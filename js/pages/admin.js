// 管理后台 — 用户列表 / 举报处理

(function () {
  'use strict';

  var ADMIN_USERS_PAGE_SIZE = 1000;
  var REPORT_PLATFORM_COMMISSION = 0.15;
  var pendingReports = [];
  var reportsTableMissingNotified = false;
  var reportsUiBound = false;

  async function fetchAllAdminUsers() {
    if (!window.supabase) {
      console.log('用户列表查询结果：', { count: 0, users: [] });
      return [];
    }

    var users = [];
    var from = 0;

    while (true) {
      var to = from + ADMIN_USERS_PAGE_SIZE - 1;
      var result = await window.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (result.error) {
        console.warn('用户列表查询失败：', result.error);
        console.log('用户列表查询结果：', { count: users.length, users: users });
        return users;
      }

      var batch = result.data || [];
      users = users.concat(batch);

      if (batch.length < ADMIN_USERS_PAGE_SIZE) {
        break;
      }

      from += ADMIN_USERS_PAGE_SIZE;
    }

    console.log('用户列表查询结果：', { count: users.length, users: users });
    return users;
  }

  function isReportsTableMissingError(error) {
    if (!error) return false;
    var msg = String(error.message || error.details || error.hint || '').toLowerCase();
    var code = String(error.code || '');
    return code === '42P01' || code === 'PGRST205' ||
      (msg.indexOf('reports') !== -1 && (
        msg.indexOf('does not exist') !== -1 ||
        msg.indexOf('schema cache') !== -1 ||
        msg.indexOf('could not find') !== -1
      ));
  }

  function getReportsCreateSql() {
    return [
      'CREATE TABLE IF NOT EXISTS reports (',
      '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
      '  task_id UUID REFERENCES tasks(id),',
      '  reporter_id UUID REFERENCES users(id),',
      '  reason TEXT NOT NULL,',
      '  description TEXT,',
      '  status TEXT DEFAULT \'pending\',',
      '  reviewed_at TIMESTAMPTZ,',
      '  created_at TIMESTAMPTZ DEFAULT NOW()',
      ');'
    ].join('\n');
  }

  function notifyReportsTableMissing(error) {
    if (reportsTableMissingNotified) return;
    reportsTableMissingNotified = true;
    console.warn('reports 表不存在，请先创建：', error);
    alert(
      '举报功能需要 reports 表，请先在数据库执行：\n\n' + getReportsCreateSql()
    );
  }

  function ensureAdminReportStyles() {
    if (document.getElementById('coinrealm-admin-report-styles')) return;
    var style = document.createElement('style');
    style.id = 'coinrealm-admin-report-styles';
    style.textContent = [
      '.ad-reports-banner {',
      '  margin: 0 0 12px; padding: 10px 14px; border-radius: 8px;',
      '  background: #fff1f0; border: 1px solid #ffa39e; color: #cf1322;',
      '  font-size: 14px; font-weight: 600;',
      '}',
      '.ad-reports-section { margin: 0 0 20px; }',
      '.ad-reports-title {',
      '  margin: 0 0 10px; font-size: 15px; font-weight: 700; color: #1a1a2e;',
      '}',
      '.ad-report-desc {',
      '  margin: 4px 0 0; color: #666; font-size: 13px; white-space: pre-wrap;',
      '}',
      '.ad-report-approve-btn {',
      '  background: #e74c3c !important; color: #fff !important; border-color: #e74c3c !important;',
      '}',
      '.ad-report-reject-btn {',
      '  background: #f5f5f5 !important; color: #666 !important; border: 1px solid #d9d9d9 !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function ensureAdminReportsUi() {
    var panel = document.getElementById('admin-panel-tasks');
    if (!panel) return null;

    ensureAdminReportStyles();

    var section = document.getElementById('ad-reports-section');
    if (!section) {
      section = document.createElement('div');
      section.id = 'ad-reports-section';
      section.className = 'ad-reports-section';
      section.innerHTML =
        '<div id="ad-reports-banner" class="ad-reports-banner hidden"></div>' +
        '<h3 class="ad-reports-title">待处理举报</h3>' +
        '<div id="ad-reports-list" class="admin-list"></div>';

      var toolbar = panel.querySelector('.admin-toolbar');
      if (toolbar && toolbar.parentNode) {
        toolbar.parentNode.insertBefore(section, toolbar);
      } else {
        var taskList = document.getElementById('ad-task-list');
        if (taskList && taskList.parentNode) {
          taskList.parentNode.insertBefore(section, taskList);
        } else {
          panel.appendChild(section);
        }
      }
    }

    if (!reportsUiBound) {
      reportsUiBound = true;
      var list = document.getElementById('ad-reports-list');
      if (list) {
        list.addEventListener('click', function (e) {
          var approveBtn = e.target.closest('.ad-report-approve');
          var rejectBtn = e.target.closest('.ad-report-reject');
          if (approveBtn) {
            handleReportDecision(approveBtn.getAttribute('data-id'), 'approved');
          }
          if (rejectBtn) {
            handleReportDecision(rejectBtn.getAttribute('data-id'), 'rejected');
          }
        });
      }
    }

    return section;
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatReportTime(value) {
    if (!value) return '—';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 19);
    var y = date.getFullYear();
    var m = String(date.getMonth() + 1).padStart(2, '0');
    var d = String(date.getDate()).padStart(2, '0');
    var hh = String(date.getHours()).padStart(2, '0');
    var mm = String(date.getMinutes()).padStart(2, '0');
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm;
  }

  function displayUserLabel(user) {
    if (!user) return 'Unknown';
    if (user.username) return user.username;
    if (user.email) return user.email;
    if (user.wallet_address) return user.wallet_address;
    return String(user.id || '').slice(0, 8);
  }

  function calculatePublisherDepositRefund(task) {
    if (!task) return { amount: 0, rewardType: 'CRLM' };

    var rewardType = task.reward_type || 'CRLM';
    var deposit = parseFloat(task.deposit_amount);
    if (!Number.isNaN(deposit) && deposit > 0) {
      return { amount: deposit, rewardType: rewardType };
    }

    var maxParticipantsRaw = task.max_participants;
    if (maxParticipantsRaw == null || maxParticipantsRaw === '') {
      return { amount: 0, rewardType: rewardType };
    }

    var maxParticipants = parseFloat(maxParticipantsRaw);
    var currentParticipants = parseFloat(task.current_participants) || 0;
    if (Number.isNaN(maxParticipants) || maxParticipants <= 0) {
      return { amount: 0, rewardType: rewardType };
    }

    var remainingSlots = Math.max(0, maxParticipants - currentParticipants);
    if (remainingSlots <= 0) {
      return { amount: 0, rewardType: rewardType };
    }

    var rewardAmount = parseFloat(task.reward_amount) || 0;
    var perSlotReward = rewardAmount / maxParticipants;
    var refundAmount = perSlotReward * remainingSlots * (1 - REPORT_PLATFORM_COMMISSION);
    return { amount: refundAmount, rewardType: rewardType };
  }

  async function refundPublisherDeposit(task) {
    if (!window.supabase || !task || !task.publisher_id) {
      return { ok: true, amount: 0 };
    }

    var refundInfo = calculatePublisherDepositRefund(task);
    var amount = parseFloat(refundInfo.amount) || 0;
    if (amount <= 0) {
      return { ok: true, amount: 0 };
    }

    var rewardType = String(refundInfo.rewardType || 'CRLM').toUpperCase();
    var balanceField = rewardType === 'USDT' ? 'usdt_balance' : 'crlm_balance';

    var userResult = await window.supabase
      .from('users')
      .select('crlm_balance, usdt_balance')
      .eq('id', task.publisher_id)
      .single();

    if (userResult.error || !userResult.data) {
      return { ok: false, error: userResult.error || new Error('publisher not found') };
    }

    var currentBalance = parseFloat(userResult.data[balanceField]) || 0;
    var patch = {};
    patch[balanceField] = currentBalance + amount;

    var updateResult = await window.supabase
      .from('users')
      .update(patch)
      .eq('id', task.publisher_id);

    if (updateResult.error) {
      return { ok: false, error: updateResult.error };
    }

    return { ok: true, amount: amount, rewardType: rewardType };
  }

  function renderAdminReports() {
    ensureAdminReportsUi();

    var banner = document.getElementById('ad-reports-banner');
    var listEl = document.getElementById('ad-reports-list');
    if (!listEl) return;

    var count = pendingReports.length;
    if (banner) {
      if (count > 0) {
        banner.classList.remove('hidden');
        banner.textContent = '有 ' + count + ' 条举报待处理';
      } else {
        banner.classList.add('hidden');
        banner.textContent = '';
      }
    }

    if (!count) {
      listEl.innerHTML = '<p class="admin-empty">暂无待处理举报</p>';
      return;
    }

    listEl.innerHTML = pendingReports.map(function (report) {
      var taskTitle = (report.tasks && report.tasks.title) || report._taskTitle || ('任务 ' + String(report.task_id || '').slice(0, 8));
      var reporterName = report._reporterName || displayUserLabel(report.users) || String(report.reporter_id || '').slice(0, 8);
      var desc = report.description ? String(report.description) : '';
      return (
        '<div class="admin-row" data-report-id="' + escapeHtml(report.id) + '">' +
          '<div class="admin-row-main">' +
            '<p class="admin-row-title">' + escapeHtml(taskTitle) + '</p>' +
            '<p class="admin-row-meta">' +
              '举报人：' + escapeHtml(reporterName) +
              ' · 原因：' + escapeHtml(report.reason || '—') +
              ' · 时间：' + escapeHtml(formatReportTime(report.created_at)) +
            '</p>' +
            (desc ? '<p class="ad-report-desc">补充说明：' + escapeHtml(desc) + '</p>' : '') +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button type="button" class="admin-danger-btn ad-report-approve-btn ad-report-approve" data-id="' + escapeHtml(report.id) + '">属实</button>' +
            '<button type="button" class="admin-ghost-btn ad-report-reject-btn ad-report-reject" data-id="' + escapeHtml(report.id) + '">不属实</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function normalizeReportStatus(status) {
    return String(status == null ? '' : status).trim().toLowerCase();
  }

  function isPendingReport(report) {
    return normalizeReportStatus(report && report.status) === 'pending';
  }

  /**
   * 按调试约定查询 pending 举报：
   * from('reports').select('*, tasks(title), users(username)').eq('status', 'pending')
   * 若联表失败则降级为 reports(*) + 手动关联 tasks/users。
   */
  async function queryPendingReportsRaw() {
    if (!window.supabase) {
      return { data: [], error: null, strategy: 'no-supabase' };
    }

    // 1) 用户提供的调试查询（优先）
    var joined = await window.supabase
      .from('reports')
      .select('*, tasks(title), users!reporter_id(username)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    console.log('[admin] reports 联表查询结果：', joined);

    if (!joined.error && joined.data && joined.data.length) {
      return { data: joined.data || [], error: null, strategy: 'embed-reporter_id' };
    }

    // 2) 无 FK hint 的简写（部分库关系名就是 users）
    var joinedSimple = await window.supabase
      .from('reports')
      .select('*, tasks(title), users(username)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    console.log('[admin] reports 简写联表查询结果：', joinedSimple);

    if (!joinedSimple.error && joinedSimple.data && joinedSimple.data.length) {
      return { data: joinedSimple.data || [], error: null, strategy: 'embed-users' };
    }

    // 3) 仅查 reports，后续手动关联（最稳妥；联表为空时也走这里）
    var plain = await window.supabase
      .from('reports')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    console.log('[admin] reports 单表查询结果：', plain);

    if (!plain.error && plain.data && plain.data.length) {
      return { data: plain.data || [], error: null, strategy: 'plain' };
    }

    if (plain.error || (joined.error && joinedSimple.error)) {
      // 再放宽：不带 status 过滤，前端自行筛 pending（防止 status 大小写/空格差异）
      var allRows = await window.supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      console.log('[admin] reports 全量抽样查询结果：', allRows);

      if (allRows.error) {
        return {
          data: [],
          error: plain.error || allRows.error || joined.error || joinedSimple.error,
          strategy: 'failed',
          diagnostics: { joined: joined, joinedSimple: joinedSimple, plain: plain, allRows: allRows }
        };
      }

      var pendingOnly = (allRows.data || []).filter(isPendingReport);
      console.log('[admin] reports 前端筛选 pending：', {
        total: (allRows.data || []).length,
        pending: pendingOnly.length,
        statuses: (allRows.data || []).map(function (row) { return row.status; })
      });
      if (pendingOnly.length) {
        return { data: pendingOnly, error: null, strategy: 'client-filter-pending' };
      }
    }

    // 联表与单表都为空：保留“成功但无数据”，交给上层诊断 RLS
    if (!plain.error) {
      return { data: [], error: null, strategy: 'plain-empty' };
    }

    return {
      data: [],
      error: plain.error || joinedSimple.error || joined.error,
      strategy: 'failed',
      diagnostics: { joined: joined, joinedSimple: joinedSimple, plain: plain }
    };
  }

  async function diagnoseEmptyReportsQuery() {
    if (!window.supabase) return null;

    var listEl = document.getElementById('ad-reports-list');
    var anyRows = await window.supabase
      .from('reports')
      .select('id, task_id, reporter_id, status, reason, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    console.log('[admin] reports 诊断查询（不限 status）：', anyRows);

    if (anyRows.error) {
      console.warn(
        '[admin] 无法读取 reports 表，可能是表权限/RLS 拦截。',
        anyRows.error,
        '\n建议在 Supabase SQL 中检查策略，例如：\n' +
        'ALTER TABLE reports ENABLE ROW LEVEL SECURITY;\n' +
        '-- 允许已登录用户读取（或仅管理员）：\n' +
        'CREATE POLICY "reports_select_authenticated" ON reports\n' +
        '  FOR SELECT TO authenticated USING (true);\n'
      );
      if (listEl) {
        listEl.innerHTML =
          '<p class="admin-empty">无法读取举报数据：' + escapeHtml(anyRows.error.message || '权限错误') +
          '。请检查 reports 表的 RLS SELECT 策略。</p>';
      }
      return { kind: 'error', error: anyRows.error };
    }

    var rows = anyRows.data || [];
    if (!rows.length) {
      console.warn(
        '[admin] reports 查询成功但结果为空。若表中其实有数据，通常是 RLS 策略阻止了管理员 SELECT。\n' +
        '请在 Supabase → Authentication/Policies 检查 reports 的 SELECT 策略，确保管理员可读取全部行。\n' +
        '可在控制台执行：\n' +
        "await window.supabase.from('reports').select('*, tasks(title), users(username)').eq('status', 'pending')"
      );
      if (listEl) {
        listEl.innerHTML =
          '<p class="admin-empty">暂无待处理举报。若确认 reports 表有数据，请检查 RLS：管理员需要 SELECT 全部举报的策略。' +
          '详见控制台 [admin] 日志。</p>';
      }
      return { kind: 'rls-or-empty' };
    }

    var pendingCount = rows.filter(isPendingReport).length;
    console.log('[admin] reports 表可读，当前抽样 status 分布：', rows.map(function (row) {
      return { id: row.id, status: row.status };
    }));

    if (!pendingCount && listEl) {
      listEl.innerHTML =
        '<p class="admin-empty">reports 表可读，但没有 status=pending 的记录（抽样 ' +
        rows.length + ' 条）。详见控制台。</p>';
    }

    return { kind: 'has-rows', rows: rows, pendingCount: pendingCount };
  }

  async function loadPendingReports() {
    ensureAdminReportsUi();
    pendingReports = [];

    if (!window.supabase) {
      console.log('[admin] pending reports：supabase 未初始化');
      renderAdminReports();
      return pendingReports;
    }

    var queryResult = await queryPendingReportsRaw();

    if (queryResult.error) {
      if (isReportsTableMissingError(queryResult.error)) {
        notifyReportsTableMissing(queryResult.error);
      } else {
        console.warn('加载待处理举报失败：', queryResult.error, queryResult.diagnostics || null);
        alert('加载举报失败：' + (queryResult.error.message || String(queryResult.error)));
      }
      renderAdminReports();
      return pendingReports;
    }

    pendingReports = (queryResult.data || []).filter(isPendingReport);
    console.log('[admin] pending reports 最终结果：', {
      strategy: queryResult.strategy,
      count: pendingReports.length,
      rows: pendingReports
    });

    if (!pendingReports.length) {
      console.log('[admin] pending reports 为空，开始诊断…');
      var diagnosis = await diagnoseEmptyReportsQuery();
      if (!(diagnosis && (diagnosis.kind === 'error' || diagnosis.kind === 'rls-or-empty' || diagnosis.kind === 'has-rows'))) {
        renderAdminReports();
      } else if (diagnosis.kind === 'has-rows' && diagnosis.pendingCount > 0) {
        // 诊断发现有 pending，但主查询未取到——再尝试一次全量筛选
        pendingReports = (diagnosis.rows || []).filter(isPendingReport);
        await enrichPendingReports(pendingReports);
        renderAdminReports();
      } else if (diagnosis.kind === 'has-rows' && !diagnosis.pendingCount) {
        // 文案已在 diagnose 中写入 list
        var banner = document.getElementById('ad-reports-banner');
        if (banner) {
          banner.classList.add('hidden');
          banner.textContent = '';
        }
      }
      return pendingReports;
    }

    // 联表可能只有 tasks(title)/users(username)，补全任务与用户信息供处理与展示
    await enrichPendingReports(pendingReports);

    pendingReports = pendingReports.map(function (report) {
      if (report.tasks && report.tasks.title) {
        report._taskTitle = report.tasks.title;
      }
      if (report.users) {
        report._reporterName = displayUserLabel(report.users);
      } else if (report.users === null && report.reporter) {
        report.users = report.reporter;
        report._reporterName = displayUserLabel(report.reporter);
      }
      return report;
    });

    console.log('[admin] pending reports 关联补全后：', pendingReports);
    renderAdminReports();
    return pendingReports;
  }

  async function enrichPendingReports(reports) {
    if (!reports.length || !window.supabase) return;

    var taskIds = [];
    var reporterIds = [];
    reports.forEach(function (report) {
      if (report.task_id) taskIds.push(report.task_id);
      if (report.reporter_id) reporterIds.push(report.reporter_id);
      // 已有嵌套对象时也收集，便于覆盖不完整字段
      if (report.tasks && report.tasks.id) taskIds.push(report.tasks.id);
    });

    var uniqueTaskIds = taskIds.filter(function (id, i) { return id && taskIds.indexOf(id) === i; });
    var uniqueReporterIds = reporterIds.filter(function (id, i) { return id && reporterIds.indexOf(id) === i; });

    var taskMap = {};
    var userMap = {};

    if (uniqueTaskIds.length) {
      var tasksResult = await window.supabase
        .from('tasks')
        .select('id, title, status, publisher_id, reward_amount, reward_type, deposit_amount, max_participants, current_participants')
        .in('id', uniqueTaskIds);
      console.log('[admin] reports 关联 tasks 结果：', tasksResult);
      if (!tasksResult.error && tasksResult.data) {
        tasksResult.data.forEach(function (task) {
          taskMap[String(task.id)] = task;
        });
      }
    }

    if (uniqueReporterIds.length) {
      var usersResult = await window.supabase
        .from('users')
        .select('id, username, email, wallet_address')
        .in('id', uniqueReporterIds);
      console.log('[admin] reports 关联 users 结果：', usersResult);
      if (!usersResult.error && usersResult.data) {
        usersResult.data.forEach(function (user) {
          userMap[String(user.id)] = user;
        });
      } else if (usersResult && usersResult.error) {
        console.warn('[admin] 关联 users 失败（可能 RLS）。举报人将显示为 ID 片段。', usersResult.error);
      }
    }

    reports.forEach(function (report) {
      var taskKey = report.task_id != null ? String(report.task_id) : '';
      var userKey = report.reporter_id != null ? String(report.reporter_id) : '';
      var embeddedTask = report.tasks && !Array.isArray(report.tasks) ? report.tasks : null;
      var embeddedUser = report.users && !Array.isArray(report.users) ? report.users : null;

      report.tasks = taskMap[taskKey] || embeddedTask || null;
      report.users = userMap[userKey] || embeddedUser || null;
      report._taskTitle = (report.tasks && report.tasks.title) || report._taskTitle || null;
      report._reporterName = displayUserLabel(report.users) || report._reporterName || null;
    });
  }

  async function handleReportDecision(reportId, decision) {
    if (!reportId || !window.supabase) return;
    if (decision !== 'approved' && decision !== 'rejected') return;

    var report = null;
    for (var i = 0; i < pendingReports.length; i++) {
      if (String(pendingReports[i].id) === String(reportId)) {
        report = pendingReports[i];
        break;
      }
    }

    if (!report) {
      alert('未找到该举报记录，请刷新后重试');
      return;
    }

    var confirmText = decision === 'approved'
      ? '确认该举报属实？将下架任务并退还发布者押金。'
      : '确认该举报不属实？';
    if (!window.confirm(confirmText)) return;

    try {
      if (decision === 'approved') {
        var task = report.tasks || null;
        if ((!task || !task.publisher_id) && report.task_id) {
          var taskResult = await window.supabase
            .from('tasks')
            .select('id, title, status, publisher_id, reward_amount, reward_type, deposit_amount, max_participants, current_participants')
            .eq('id', report.task_id)
            .maybeSingle();
          if (taskResult.error) {
            alert('加载任务失败：' + taskResult.error.message);
            return;
          }
          task = taskResult.data;
        }

        if (task && task.status !== 'cancelled') {
          var cancelResult = await window.supabase
            .from('tasks')
            .update({
              status: 'cancelled',
              review_comment: '举报属实下架：' + (report.reason || '')
            })
            .eq('id', task.id);

          if (cancelResult.error) {
            alert('下架任务失败：' + cancelResult.error.message);
            return;
          }

          var refundResult = await refundPublisherDeposit(task);
          if (!refundResult.ok) {
            alert('任务已下架，但退还押金失败：' + (refundResult.error && refundResult.error.message ? refundResult.error.message : '未知错误'));
          }
        }
      }

      var updatePayload = {
        status: decision,
        reviewed_at: new Date().toISOString()
      };
      var updateResult = await window.supabase
        .from('reports')
        .update(updatePayload)
        .eq('id', reportId);

      if (updateResult.error) {
        if (isReportsTableMissingError(updateResult.error)) {
          notifyReportsTableMissing(updateResult.error);
        } else {
          alert('更新举报状态失败：' + updateResult.error.message);
        }
        return;
      }

      alert(decision === 'approved' ? '已处理：举报属实，任务已下架' : '已处理：举报不属实');
      await loadPendingReports();

      if (typeof window.coinrealmReloadAdminTasks === 'function') {
        await window.coinrealmReloadAdminTasks();
      }
    } catch (err) {
      console.warn('处理举报失败：', err);
      alert('处理举报失败：' + (err && err.message ? err.message : String(err)));
    }
  }

  async function refreshAdminReports() {
    ensureAdminReportsUi();
    await loadPendingReports();
  }

  window.coinrealmLoadAdminUsers = fetchAllAdminUsers;
  window.coinrealmRefreshAdminReports = refreshAdminReports;
  window.coinrealmEnsureAdminReportsUi = ensureAdminReportsUi;
})();
