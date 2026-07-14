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

  async function loadPendingReports() {
    ensureAdminReportsUi();
    pendingReports = [];

    if (!window.supabase) {
      renderAdminReports();
      return pendingReports;
    }

    var result = await window.supabase
      .from('reports')
      .select('id, task_id, reporter_id, reason, description, status, created_at, reviewed_at, tasks(id, title, status, publisher_id, reward_amount, reward_type, deposit_amount, max_participants, current_participants), users:reporter_id(id, username, email, wallet_address)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (result.error) {
      // 某些环境下联表别名可能失败，降级为普通查询再手动补全
      var fallback = await window.supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fallback.error) {
        if (isReportsTableMissingError(fallback.error) || isReportsTableMissingError(result.error)) {
          notifyReportsTableMissing(fallback.error || result.error);
        } else {
          console.warn('加载待处理举报失败：', result.error, fallback.error);
        }
        renderAdminReports();
        return pendingReports;
      }

      pendingReports = fallback.data || [];
      await enrichPendingReports(pendingReports);
      renderAdminReports();
      return pendingReports;
    }

    pendingReports = (result.data || []).map(function (report) {
      report._taskTitle = report.tasks && report.tasks.title;
      report._reporterName = displayUserLabel(report.users);
      return report;
    });
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
    });

    var uniqueTaskIds = taskIds.filter(function (id, i) { return taskIds.indexOf(id) === i; });
    var uniqueReporterIds = reporterIds.filter(function (id, i) { return reporterIds.indexOf(id) === i; });

    var taskMap = {};
    var userMap = {};

    if (uniqueTaskIds.length) {
      var tasksResult = await window.supabase
        .from('tasks')
        .select('id, title, status, publisher_id, reward_amount, reward_type, deposit_amount, max_participants, current_participants')
        .in('id', uniqueTaskIds);
      if (!tasksResult.error && tasksResult.data) {
        tasksResult.data.forEach(function (task) {
          taskMap[task.id] = task;
        });
      }
    }

    if (uniqueReporterIds.length) {
      var usersResult = await window.supabase
        .from('users')
        .select('id, username, email, wallet_address')
        .in('id', uniqueReporterIds);
      if (!usersResult.error && usersResult.data) {
        usersResult.data.forEach(function (user) {
          userMap[user.id] = user;
        });
      }
    }

    reports.forEach(function (report) {
      report.tasks = taskMap[report.task_id] || report.tasks || null;
      report.users = userMap[report.reporter_id] || report.users || null;
      report._taskTitle = report.tasks && report.tasks.title;
      report._reporterName = displayUserLabel(report.users);
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
