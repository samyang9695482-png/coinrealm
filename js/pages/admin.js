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
      '.ad-reports-section { margin: 0 0 20px; display: block !important; }',
      '.ad-reports-title {',
      '  margin: 0 0 10px; font-size: 15px; font-weight: 700; color: #1a1a2e;',
      '}',
      '#ad-reports-list { min-height: 24px; }',
      '#ad-reports-list .admin-row {',
      '  display: flex; align-items: flex-start; justify-content: space-between;',
      '  gap: 12px; padding: 12px 0; border-bottom: 1px solid #eee;',
      '}',
      '.ad-report-desc {',
      '  margin: 4px 0 0; color: #666; font-size: 13px; white-space: pre-wrap;',
      '}',
      '.ad-report-task-desc {',
      '  margin: 6px 0 0; color: #666; font-size: 13px; line-height: 1.5; white-space: pre-wrap;',
      '}',
      '.ad-report-task-meta {',
      '  margin: 4px 0 0; color: #666; font-size: 12px; line-height: 1.5;',
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
    if (!panel) {
      console.warn('[admin] admin-panel-tasks 不存在，无法挂载举报 UI');
      return null;
    }

    ensureAdminReportStyles();

    var section = document.getElementById('ad-reports-section');
    var list = document.getElementById('ad-reports-list');

    // 面板被重绘/还原后，旧节点可能游离或残缺，强制重建
    if (section && !panel.contains(section)) {
      try { section.remove(); } catch (_e) { /* ignore */ }
      section = null;
      reportsUiBound = false;
    }
    if (section && !list) {
      try { section.remove(); } catch (_e) { /* ignore */ }
      section = null;
      reportsUiBound = false;
    }

    if (!section) {
      section = document.createElement('div');
      section.id = 'ad-reports-section';
      section.className = 'ad-reports-section';
      section.innerHTML =
        '<div id="ad-reports-banner" class="ad-reports-banner hidden"></div>' +
        '<h3 class="ad-reports-title">待处理举报</h3>' +
        '<div id="ad-reports-list" class="admin-list"></div>';

      var header = panel.querySelector('.admin-section-header');
      var toolbar = panel.querySelector('.admin-toolbar');
      if (header && header.parentNode === panel) {
        // 紧跟标题下方，避免被任务列表挤出可视区
        if (header.nextSibling) {
          panel.insertBefore(section, header.nextSibling);
        } else {
          panel.appendChild(section);
        }
      } else if (toolbar && toolbar.parentNode === panel) {
        panel.insertBefore(section, toolbar);
      } else {
        var taskList = document.getElementById('ad-task-list');
        if (taskList && taskList.parentNode === panel) {
          panel.insertBefore(section, taskList);
        } else {
          panel.insertBefore(section, panel.firstChild);
        }
      }
    }

    section.style.display = 'block';
    section.classList.remove('hidden');
    section.setAttribute('aria-hidden', 'false');

    if (!reportsUiBound) {
      reportsUiBound = true;
      // 事件委托挂在面板上，避免列表重绘后丢监听
      panel.addEventListener('click', function (e) {
        var approveBtn = e.target.closest('.ad-report-approve');
        var rejectBtn = e.target.closest('.ad-report-reject');
        if (!approveBtn && !rejectBtn) return;
        if (!panel.contains(e.target)) return;
        if (approveBtn) {
          handleReportDecision(approveBtn.getAttribute('data-id'), 'approved');
        }
        if (rejectBtn) {
          handleReportDecision(rejectBtn.getAttribute('data-id'), 'rejected');
        }
      });
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
    if (!listEl) {
      console.warn('[admin] ad-reports-list 不存在，无法渲染举报列表');
      return;
    }

    var count = pendingReports.length;
    if (banner) {
      if (count > 0) {
        banner.classList.remove('hidden');
        banner.style.display = 'block';
        banner.textContent = '有 ' + count + ' 条举报待处理';
      } else {
        banner.classList.add('hidden');
        banner.style.display = '';
        banner.textContent = '';
      }
    }

    if (!count) {
      listEl.innerHTML = '<p class="admin-empty">暂无待处理举报</p>';
      console.log('[admin] 举报列表渲染：', 0);
      return;
    }

    listEl.innerHTML = pendingReports.map(function (report) {
      var taskTitle = '';
      var taskDescription = '';
      var publisherName = '未知';
      var reporterName = '未知';
      var desc = report.description ? String(report.description) : '';

      if (report.tasks && report.tasks.title) {
        taskTitle = report.tasks.title;
      } else if (report._taskTitle) {
        taskTitle = report._taskTitle;
      } else {
        taskTitle = '任务 ' + String(report.task_id || '').slice(0, 8);
      }

      if (report.tasks && report.tasks.description) {
        taskDescription = String(report.tasks.description).replace(/\s+/g, ' ').trim();
      } else if (report._taskDescription) {
        taskDescription = String(report._taskDescription).replace(/\s+/g, ' ').trim();
      }

      if (taskDescription.length > 100) {
        taskDescription = taskDescription.slice(0, 100) + '…';
      }

      if (report._publisherName) {
        publisherName = report._publisherName;
      } else if (report.tasks && report.tasks.publisher_username) {
        publisherName = report.tasks.publisher_username;
      } else if (report.tasks && report.tasks.publisher_id) {
        publisherName = String(report.tasks.publisher_id).slice(0, 8);
      }

      if (report.users && report.users.username) {
        reporterName = report.users.username;
      } else if (report._reporterName) {
        reporterName = report._reporterName;
      } else if (report.reporter_id) {
        reporterName = String(report.reporter_id).slice(0, 8);
      }

      return (
        '<div class="admin-row" data-report-id="' + escapeHtml(report.id) + '">' +
          '<div class="admin-row-main">' +
            '<p class="admin-row-title"><strong>' + escapeHtml(taskTitle) + '</strong></p>' +
            (taskDescription ? '<p class="ad-report-task-desc">' + escapeHtml(taskDescription) + '</p>' : '') +
            '<p class="ad-report-task-meta">发布者：' + escapeHtml(publisherName) + '</p>' +
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

    console.log('[admin] 举报列表渲染：', pendingReports.length);
  }

  function normalizeReportStatus(status) {
    return String(status == null ? '' : status).trim().toLowerCase();
  }

  function isPendingReport(report) {
    // 没有 status 字段时也视为主查询已过滤过的 pending
    if (!report) return false;
    if (report.status == null || report.status === '') return true;
    return normalizeReportStatus(report.status) === 'pending';
  }

  async function loadPendingReports() {
    ensureAdminReportsUi();
    pendingReports = [];

    if (!window.supabase) {
      console.log('[admin] 举报查询结果：', { data: null, error: 'supabase 未初始化' });
      renderAdminReports();
      return pendingReports;
    }

    // 主查询（与控制台调试语句一致）
    var result = await window.supabase
      .from('reports')
      .select('id, reason, description, status, created_at, task_id, reporter_id, tasks(title, description, publisher_id), users!reporter_id(username)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    console.log('[admin] 举报查询结果：', { data: result.data, error: result.error });

    if (result.error) {
      console.warn('[admin] 联表查询失败，降级为单表查询：', result.error);

      var plain = await window.supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('[admin] 举报查询结果：', { data: plain.data, error: plain.error });

      if (plain.error) {
        if (isReportsTableMissingError(plain.error) || isReportsTableMissingError(result.error)) {
          notifyReportsTableMissing(plain.error || result.error);
        } else {
          alert('加载举报失败：' + (plain.error.message || result.error.message));
        }
        renderAdminReports();
        return pendingReports;
      }

      pendingReports = plain.data || [];
    } else {
      pendingReports = result.data || [];
    }

    // 再兜底：主查询异常为空时，拉全量再筛 pending
    if (!pendingReports.length) {
      var allRows = await window.supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      console.log('[admin] 举报全量抽样：', { data: allRows.data, error: allRows.error });

      if (!allRows.error && allRows.data && allRows.data.length) {
        var pendingOnly = allRows.data.filter(function (row) {
          return normalizeReportStatus(row.status) === 'pending';
        });
        console.log('[admin] 全量中 pending 条数：', pendingOnly.length);
        if (pendingOnly.length) {
          pendingReports = pendingOnly;
        }
      } else if (allRows.error) {
        console.warn('[admin] 全量查询失败，可能被 RLS 拦截：', allRows.error);
      }
    }

    // 关联补全失败不影响渲染
    try {
      await enrichPendingReports(pendingReports);
    } catch (enrichErr) {
      console.warn('[admin] 举报关联补全失败（仍会渲染列表）：', enrichErr);
    }

    pendingReports = pendingReports.map(function (report) {
      if (report.tasks && report.tasks.title) {
        report._taskTitle = report.tasks.title;
      }
      var userObj = report.users;
      if (userObj && Array.isArray(userObj)) userObj = userObj[0] || null;
      if (userObj) {
        report.users = userObj;
        report._reporterName = userObj.username || displayUserLabel(userObj);
      }
      return report;
    });

    console.log('[admin] 准备渲染举报列表：', pendingReports.length, pendingReports);
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
      var task = taskMap[taskKey] || embeddedTask || null;
      var reporter = userMap[userKey] || embeddedUser || null;
      var publisher = null;

      report.tasks = task;
      report.users = reporter;
      report._taskTitle = (task && task.title) || report._taskTitle || null;
      report._taskDescription = (task && task.description) || report._taskDescription || null;
      report._reporterName = displayUserLabel(reporter) || report._reporterName || null;

      if (task && task.publisher_id && (!task.publisher_username || task.publisher_username === '')) {
        (async function () {
          try {
            var publisherResult = await window.supabase
              .from('users')
              .select('username')
              .eq('id', task.publisher_id)
              .single();

            if (!publisherResult.error && publisherResult.data) {
              publisher = publisherResult.data;
              report._publisherName = publisher.username || null;
            }
          } catch (publisherErr) {
            console.warn('[admin] 查询任务发布者失败：', publisherErr);
          }

          console.log('[admin] 举报详情：', { report: report, task: task, reporter: reporter, publisher: publisher });
        })();
      } else {
        console.log('[admin] 举报详情：', { report: report, task: task, reporter: reporter, publisher: publisher });
      }
    });
  }

  var DEFAULT_REPORT_REWARD = 50;
  var cachedReportReward = null;
  var reportRewardUiBound = false;

  async function fetchReportRewardAmount() {
    if (cachedReportReward != null && Number.isFinite(cachedReportReward)) {
      return cachedReportReward;
    }

    var amount = DEFAULT_REPORT_REWARD;
    if (!window.supabase) {
      cachedReportReward = amount;
      return amount;
    }

    try {
      var result = await window.supabase
        .from('settings')
        .select('key, value')
        .eq('key', 'report_reward')
        .maybeSingle();

      console.log('[admin] report_reward 设置查询：', result);

      if (!result.error && result.data && result.data.value != null && result.data.value !== '') {
        var num = Number(result.data.value);
        if (Number.isFinite(num) && num >= 0) {
          amount = num;
        }
      }
    } catch (err) {
      console.warn('[admin] 读取 report_reward 失败，使用默认值', DEFAULT_REPORT_REWARD, err);
    }

    cachedReportReward = amount;
    return amount;
  }

  function invalidateReportRewardCache() {
    cachedReportReward = null;
  }

  async function rewardReporterForApprovedReport(report, rewardAmount) {
    if (!window.supabase || !report || !report.reporter_id) {
      return { ok: false, error: new Error('missing reporter_id') };
    }

    var amount = Number(rewardAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { ok: true, amount: 0, skipped: true };
    }

    var reporterId = report.reporter_id;
    var userResult = await window.supabase
      .from('users')
      .select('id, crlm_balance, username')
      .eq('id', reporterId)
      .single();

    if (userResult.error || !userResult.data) {
      return { ok: false, error: userResult.error || new Error('reporter not found') };
    }

    var currentBalance = parseFloat(userResult.data.crlm_balance) || 0;
    var balanceResult = await window.supabase
      .from('users')
      .update({ crlm_balance: currentBalance + amount })
      .eq('id', reporterId);

    if (balanceResult.error) {
      return { ok: false, error: balanceResult.error };
    }

    var description = '用户举报属实，获得 ' + amount + ' CRLM 奖励';
    var broadcastPayload = {
      user_id: reporterId,
      event_type: 'report_approved',
      description: description,
      reward_amount: amount
    };

    if (typeof writeBroadcast === 'function') {
      writeBroadcast(broadcastPayload);
    } else {
      var broadcastResult = await window.supabase.from('broadcasts').insert(broadcastPayload);
      if (broadcastResult.error) {
        console.warn('[admin] 举报奖励广播写入失败：', broadcastResult.error);
      }
    }

    return {
      ok: true,
      amount: amount,
      reporterId: reporterId,
      username: userResult.data.username || null
    };
  }

  function ensureReportRewardSettingsUi() {
    var invitePanel = document.getElementById('admin-panel-invite');
    var withdrawPanel = document.getElementById('admin-panel-withdraw');
    var host = invitePanel || withdrawPanel || document.getElementById('admin-panel-tasks');
    if (!host) return null;

    var wrap = document.getElementById('ad-report-reward-settings');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'ad-report-reward-settings';
      wrap.className = 'admin-form';
      wrap.style.marginTop = '20px';
      wrap.style.paddingTop = '16px';
      wrap.style.borderTop = '1px solid #eee';
      wrap.innerHTML =
        '<h3 class="admin-section-title" style="font-size:15px;margin:0 0 12px;">举报奖励设置</h3>' +
        '<label class="admin-label" for="ad-report-reward">举报属实奖励金额（CRLM）</label>' +
        '<input type="number" id="ad-report-reward" class="admin-input" min="0" step="1" value="' + DEFAULT_REPORT_REWARD + '">' +
        '<p style="margin:8px 0 12px;font-size:12px;color:#888;">处理举报属实时，将自动发放给举报人。默认 50。</p>' +
        '<button type="button" id="ad-report-reward-save-btn" class="admin-primary-btn">保存举报奖励</button>';

      if (invitePanel) {
        var inviteForm = document.getElementById('ad-invite-form');
        if (inviteForm && inviteForm.parentNode) {
          inviteForm.parentNode.insertBefore(wrap, inviteForm.nextSibling);
        } else {
          invitePanel.appendChild(wrap);
        }
      } else if (withdrawPanel) {
        withdrawPanel.appendChild(wrap);
      } else {
        host.appendChild(wrap);
      }
    }

    if (!reportRewardUiBound) {
      reportRewardUiBound = true;
      var saveBtn = document.getElementById('ad-report-reward-save-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', saveReportRewardSetting);
      }

      document.querySelectorAll('#admin-page .admin-tab').forEach(function (btn) {
        if (btn.dataset.reportRewardTabBound) return;
        btn.dataset.reportRewardTabBound = '1';
        btn.addEventListener('click', function () {
          setTimeout(function () {
            ensureReportRewardSettingsUi();
            loadReportRewardSettingIntoUi();
          }, 50);
        });
      });
    }

    return wrap;
  }

  async function loadReportRewardSettingIntoUi() {
    ensureReportRewardSettingsUi();
    var input = document.getElementById('ad-report-reward');
    if (!input) return;
    var amount = await fetchReportRewardAmount();
    input.value = String(amount);
  }

  async function saveReportRewardSetting() {
    if (!window.supabase) return;

    var input = document.getElementById('ad-report-reward');
    var amount = Number(input && input.value);
    if (!Number.isFinite(amount) || amount < 0) {
      alert('请输入有效的举报奖励金额（≥ 0）');
      return;
    }

    var result = await window.supabase
      .from('settings')
      .upsert([{ key: 'report_reward', value: String(amount) }], { onConflict: 'key' });

    if (result.error) {
      alert('保存举报奖励失败：' + result.error.message);
      return;
    }

    invalidateReportRewardCache();
    cachedReportReward = amount;
    alert('举报奖励已保存：' + amount + ' CRLM');
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

    var rewardAmount = await fetchReportRewardAmount();
    var confirmText = decision === 'approved'
      ? '确认该举报属实？将下架任务、退还发布者押金，并向举报人发放 ' + rewardAmount + ' CRLM 奖励。'
      : '确认该举报不属实？（不发放奖励）';
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

        // 1) 下架任务
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

          // 2) 退还发布者押金
          var refundResult = await refundPublisherDeposit(task);
          if (!refundResult.ok) {
            alert('任务已下架，但退还押金失败：' + (refundResult.error && refundResult.error.message ? refundResult.error.message : '未知错误'));
          }
        }

        // 3) 更新举报状态为 approved
        var approveUpdate = await window.supabase
          .from('reports')
          .update({
            status: 'approved',
            reviewed_at: new Date().toISOString()
          })
          .eq('id', reportId);

        if (approveUpdate.error) {
          if (isReportsTableMissingError(approveUpdate.error)) {
            notifyReportsTableMissing(approveUpdate.error);
          } else {
            alert('更新举报状态失败：' + approveUpdate.error.message);
          }
          return;
        }

        // 4) 给举报人发放奖励 + 写广播
        var reporterId = report.reporter_id;
        if (!reporterId) {
          var freshReport = await window.supabase
            .from('reports')
            .select('id, reporter_id')
            .eq('id', reportId)
            .maybeSingle();
          if (!freshReport.error && freshReport.data) {
            reporterId = freshReport.data.reporter_id;
            report.reporter_id = reporterId;
          }
        }

        var rewardResult = await rewardReporterForApprovedReport(report, rewardAmount);
        if (!rewardResult.ok) {
          alert(
            '举报已通过，但发放举报奖励失败：' +
            (rewardResult.error && rewardResult.error.message ? rewardResult.error.message : '未知错误')
          );
        } else if (rewardResult.skipped) {
          alert('已处理：举报属实，任务已下架（奖励金额为 0，未发放）');
        } else {
          alert('已处理：举报属实，任务已下架，已向举报人发放 ' + rewardResult.amount + ' CRLM');
        }
      } else {
        // 不属实：仅更新状态，不给奖励
        var rejectUpdate = await window.supabase
          .from('reports')
          .update({
            status: 'rejected',
            reviewed_at: new Date().toISOString()
          })
          .eq('id', reportId);

        if (rejectUpdate.error) {
          if (isReportsTableMissingError(rejectUpdate.error)) {
            notifyReportsTableMissing(rejectUpdate.error);
          } else {
            alert('更新举报状态失败：' + rejectUpdate.error.message);
          }
          return;
        }

        alert('已处理：举报不属实');
      }

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
    try {
      ensureAdminReportsUi();
      // 先加载举报，避免设置项异常挡住列表
      await loadPendingReports();
    } catch (err) {
      console.warn('[admin] 刷新举报列表失败：', err);
    }

    try {
      ensureReportRewardSettingsUi();
      await loadReportRewardSettingIntoUi();
    } catch (settingsErr) {
      console.warn('[admin] 加载举报奖励设置失败：', settingsErr);
    }
  }

  window.coinrealmLoadAdminUsers = fetchAllAdminUsers;
  window.coinrealmRefreshAdminReports = refreshAdminReports;
  window.coinrealmEnsureAdminReportsUi = ensureAdminReportsUi;
  window.coinrealmFetchReportReward = fetchReportRewardAmount;

  // 页面加载后尝试挂载设置项（邀请设置页）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        ensureReportRewardSettingsUi();
        loadReportRewardSettingIntoUi();
      }, 400);
    });
  } else {
    setTimeout(function () {
      ensureReportRewardSettingsUi();
      loadReportRewardSettingIntoUi();
    }, 400);
  }
})();
