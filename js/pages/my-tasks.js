// 我的任务页 (#my-tasks)

(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var myTasksInitialized = false;
  var myTasksTab = 'active';
  var myTasksLoading = false;
  var myTasksData = {
    active: [],
    completed: [],
    rejected: [],
    expired: []
  };
  var verifyPollTimer = null;
  var VERIFY_POLL_MS = 30000;
  var myTasksUserId = null;
  var myReportsByTaskId = {};

  function ensureMyTasksReportStyles() {
    if (document.getElementById('coinrealm-my-tasks-report-styles')) return;
    var style = document.createElement('style');
    style.id = 'coinrealm-my-tasks-report-styles';
    style.textContent = [
      '.my-task-report-tag {',
      '  display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px;',
      '  font-size: 12px; font-weight: 600; line-height: 1.4; margin-left: 4px;',
      '}',
      '.my-task-report-pending { background: #fff7e6; color: #d48806; }',
      '.my-task-report-approved { background: #f6ffed; color: #389e0d; }',
      '.my-task-report-rejected { background: #f5f5f5; color: #8c8c8c; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  async function fetchMyReportsMap(userId) {
    var map = {};
    if (!window.supabase || !userId) return map;

    var result = await window.supabase
      .from('reports')
      .select('id, task_id, status, created_at, reviewed_at')
      .eq('reporter_id', userId)
      .order('created_at', { ascending: false });

    if (result.error) {
      console.warn('加载我的举报记录失败：', result.error);
      return map;
    }

    (result.data || []).forEach(function (report) {
      if (!report || !report.task_id) return;
      var key = String(report.task_id);
      if (!map[key]) map[key] = report;
    });
    return map;
  }

  function buildReportStatusHtml(taskId) {
    var report = myReportsByTaskId[String(taskId)];
    if (!report) return '';

    var status = String(report.status || 'pending').toLowerCase();
    if (status === 'approved') {
      return '<span class="my-task-report-tag my-task-report-approved">' + escapeHtml(mtT('mt_report_approved')) + '</span>';
    }
    if (status === 'rejected') {
      return '<span class="my-task-report-tag my-task-report-rejected">' + escapeHtml(mtT('mt_report_rejected')) + '</span>';
    }
    return '<span class="my-task-report-tag my-task-report-pending">' + escapeHtml(mtT('mt_report_pending')) + '</span>';
  }

  var myTasksTranslations = {
    zh: {
      mt_page_title: '我的任务',
      mt_tab_active: '进行中',
      mt_tab_completed: '已完成',
      mt_tab_rejected: '已驳回',
      mt_tab_expired: '已失效',
      mt_login_required: '请先登录查看任务',
      mt_loading: '加载中...',
      mt_btn_home: '去任务大厅',
      mt_empty_active: '暂无进行中的任务，去任务大厅看看吧~',
      mt_empty_completed: '暂无已完成的任务，继续加油！',
      mt_empty_rejected: '暂无被驳回的任务',
      mt_empty_expired: '暂无已失效的任务',
      mt_status_pending: '待提交',
      mt_status_submitted: '已提交',
      mt_status_reviewing: '审核中',
      mt_status_verifying: '验证中',
      mt_status_approved: '已完成',
      mt_status_rejected: '未通过',
      mt_label_deadline: '截止时间',
      mt_label_completed: '完成时间',
      mt_label_reason: '失效原因',
      mt_reason_rejected: '已驳回',
      mt_reason_expired: '已过期',
      mt_reason_full: '已满员',
      mt_reason_cancelled: '已取消',
      mt_label_publisher: '发布者',
      mt_label_reject_reason: '驳回理由',
      mt_label_reject_time: '驳回时间',
      mt_badge_rejected: '已驳回',
      mt_btn_resubmit: '重新提交',
      mt_load_fail: '加载失败：',
      mt_report_pending: '已举报',
      mt_report_approved: '举报成立',
      mt_report_rejected: '举报不成立'
    },
    en: {
      mt_page_title: 'My Tasks',
      mt_tab_active: 'In Progress',
      mt_tab_completed: 'Completed',
      mt_tab_rejected: 'Rejected',
      mt_tab_expired: 'Expired',
      mt_login_required: 'Please sign in to view your tasks',
      mt_loading: 'Loading...',
      mt_btn_home: 'Go to Task Hall',
      mt_empty_active: 'No tasks in progress. Check the task hall!',
      mt_empty_completed: 'No completed tasks yet. Keep going!',
      mt_empty_rejected: 'No rejected tasks',
      mt_empty_expired: 'No expired tasks',
      mt_status_pending: 'Pending submission',
      mt_status_submitted: 'Submitted',
      mt_status_reviewing: 'Under review',
      mt_status_verifying: 'Verifying',
      mt_status_approved: 'Completed',
      mt_status_rejected: 'Rejected',
      mt_label_deadline: 'Deadline',
      mt_label_completed: 'Completed',
      mt_label_reason: 'Reason',
      mt_reason_rejected: 'Rejected',
      mt_reason_expired: 'Expired',
      mt_reason_full: 'Full',
      mt_reason_cancelled: 'Cancelled',
      mt_label_publisher: 'Publisher',
      mt_label_reject_reason: 'Rejection reason',
      mt_label_reject_time: 'Rejected at',
      mt_badge_rejected: 'Rejected',
      mt_btn_resubmit: 'Resubmit',
      mt_load_fail: 'Load failed: ',
      mt_report_pending: 'Reported',
      mt_report_approved: 'Report upheld',
      mt_report_rejected: 'Report dismissed'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function mtT(key, vars) {
    var dict = myTasksTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function getRouteBase() {
    var hash = window.location.hash.replace(/^#/, '') || 'home';
    return hash.split('?')[0] || 'home';
  }

  function mapUrlTabToMyTasksTab(urlTab) {
    if (urlTab === 'progress' || urlTab === 'active') return 'active';
    if (urlTab === 'completed') return 'completed';
    if (urlTab === 'rejected') return 'rejected';
    if (urlTab === 'expired') return 'expired';
    return 'active';
  }

  function mapMyTasksTabToUrlTab(tab) {
    if (tab === 'active') return 'progress';
    if (tab === 'completed') return 'completed';
    if (tab === 'rejected') return 'rejected';
    if (tab === 'expired') return 'expired';
    return 'progress';
  }

  function resolveMyTasksTabFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || '';
    var queryIndex = hash.indexOf('?');
    if (queryIndex < 0) return 'active';
    var params = new URLSearchParams(hash.slice(queryIndex + 1));
    var tab = params.get('tab') || 'active';
    var resolved = mapUrlTabToMyTasksTab(tab);
    console.log('我的任务：解析标签参数', { tab: tab, resolved: resolved });
    return resolved;
  }

  function syncMyTasksTabHash(tab) {
    var urlTab = mapMyTasksTabToUrlTab(tab);
    var nextHash = '#my-tasks?tab=' + encodeURIComponent(urlTab);
    if (window.location.hash !== nextHash) {
      if (typeof history.replaceState === 'function') {
        history.replaceState(null, '', nextHash);
      } else {
        window.location.hash = nextHash;
      }
    }
  }

  function showMyTasksPageOnly() {
    if (!appContentEl) return;
    Array.prototype.forEach.call(appContentEl.children, function (el) {
      if (!el.id) return;
      if (el.id === 'my-tasks-page') {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  function isPastDeadline(deadline) {
    if (!deadline) return false;
    var d = new Date(deadline);
    if (Number.isNaN(d.getTime())) return false;
    var end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return Date.now() > end.getTime();
  }

  function formatMtDeadline(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    if (getLang() === 'zh') {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatMtDateTime(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    if (getLang() === 'zh') {
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatMtReward(task) {
    var amount = Number(task && task.reward_amount) || 0;
    var unit = (task && task.reward_type) || 'CRLM';
    return amount.toLocaleString('en-US') + ' ' + unit;
  }

  function normalizeSubmissionRows(rows) {
    return (rows || []).map(function (row) {
      var task = row.tasks;
      if (Array.isArray(task)) task = task[0];
      if (!task && row.task) task = row.task;
      return { submission: row, task: task };
    }).filter(function (item) {
      return item.task && item.task.id;
    });
  }

  function getExpiredReason(submission, task) {
    if (task.status === 'cancelled') return mtT('mt_reason_cancelled');
    var maxP = task.max_participants != null ? Number(task.max_participants) : null;
    var currentP = Number(task.current_participants) || 0;
    if (task.status === 'completed') return mtT('mt_reason_full');
    if (maxP != null && maxP > 0 && currentP >= maxP) return mtT('mt_reason_full');
    return mtT('mt_reason_expired');
  }

  function isExpiredSubmission(submission, task) {
    if (submission.status === 'rejected') return false;
    if (task.status === 'cancelled') return true;
    var maxP = task.max_participants != null ? Number(task.max_participants) : null;
    var currentP = Number(task.current_participants) || 0;
    if (task.status === 'completed') return true;
    if (maxP != null && maxP > 0 && currentP >= maxP && submission.status !== 'approved') return true;
    if (isPastDeadline(task.deadline) && submission.status !== 'approved') {
      if (submission.status === 'verifying') return false;
      if (submission.status === 'pending' && !submission.submitted_at) return true;
      if (submission.status === 'pending' || submission.status === 'submitted') return true;
    }
    return false;
  }

  function getActiveStatusLabel(submission) {
    if (submission.status === 'verifying') return mtT('mt_status_verifying');
    if (submission.status === 'submitted') return mtT('mt_status_reviewing');
    if (submission.status === 'pending' && submission.submitted_at) return mtT('mt_status_submitted');
    if (submission.status === 'claimed') return mtT('mt_status_pending');
    if (submission.status === 'pending') return mtT('mt_status_pending');
    return submission.status || '';
  }

  function buildActiveStatusHtml(submission) {
    if (submission.status === 'verifying') {
      return (
        '<span class="my-task-status my-task-status-verifying">' +
          '<span class="my-task-verify-spinner" aria-hidden="true"></span>' +
          escapeHtml(mtT('mt_status_verifying')) +
        '</span>'
      );
    }
    return '<span class="my-task-status my-task-status-active">' + escapeHtml(getActiveStatusLabel(submission)) + '</span>';
  }

  function hasVerifyingTasks() {
    return (myTasksData.active || []).some(function (item) {
      return item.submission && item.submission.status === 'verifying';
    });
  }

  function stopVerifyingPoll() {
    if (verifyPollTimer) {
      clearInterval(verifyPollTimer);
      verifyPollTimer = null;
    }
  }

  function startVerifyingPoll() {
    stopVerifyingPoll();
    if (!hasVerifyingTasks() || !myTasksUserId) return;

    verifyPollTimer = setInterval(function () {
      pollVerifyingSubmissions();
    }, VERIFY_POLL_MS);
  }

  async function verifyActiveTwitterSubmissions() {
    if (!window.supabase || !myTasksUserId) return false;

    var verifyingItems = (myTasksData.active || []).filter(function (item) {
      return item.submission &&
        item.submission.status === 'verifying' &&
        isTwitterVerificationTask(item.task);
    });

    if (!verifyingItems.length) return false;

    var changed = false;
    var useClientRewardCredit = !TWITTER_VERIFY_WORKER_URL || TWITTER_VERIFY_WORKER_URL === 'WORKER_URL_PLACEHOLDER';

    for (var i = 0; i < verifyingItems.length; i++) {
      var item = verifyingItems[i];
      var priorStatus = item.submission ? item.submission.status : '';
      var result = await verifyTwitterTask(item.task.id, myTasksUserId);
      if (result && result.verified && (priorStatus === 'verifying' || priorStatus === 'rejected' || priorStatus === 'pending')) {
        await applyTwitterVerificationSuccess(item.task, myTasksUserId, {
          priorStatus: priorStatus,
          creditRewardClient: useClientRewardCredit
        });
        changed = true;
      } else if (result && (result.verified || result.status === 'approved' || result.status === 'rejected')) {
        changed = true;
      }
    }

    if (changed) {
      myTasksData = await fetchMyTasksData(myTasksUserId);
      renderMyTasksList();
    }

    return changed;
  }

  async function pollVerifyingSubmissions() {
    if (!window.supabase || !myTasksUserId) return;

    var verifyingItems = (myTasksData.active || []).filter(function (item) {
      return item.submission && item.submission.status === 'verifying';
    });

    if (!verifyingItems.length) {
      stopVerifyingPoll();
      return;
    }

    var twitterItems = verifyingItems.filter(function (item) {
      return isTwitterVerificationTask(item.task);
    });

    if (twitterItems.length) {
      await verifyActiveTwitterSubmissions();
    } else {
      var ids = verifyingItems.map(function (item) { return item.submission.id; });
      var result = await window.supabase
        .from('submissions')
        .select('id, status, reviewed_at, review_comment')
        .in('id', ids);

      if (result.error) return;

      var changed = false;
      (result.data || []).forEach(function (row) {
        if (row.status === 'approved' || row.status === 'rejected') {
          changed = true;
        }
      });

      if (changed) {
        myTasksData = await fetchMyTasksData(myTasksUserId);
        renderMyTasksList();
      }
    }

    if (hasVerifyingTasks()) {
      startVerifyingPoll();
    } else {
      stopVerifyingPoll();
    }
  }

  function categorizeMyTasks(items) {
    var active = [];
    var completed = [];
    var rejected = [];
    var expired = [];

    items.forEach(function (item) {
      var sub = item.submission;
      var task = item.task;

      if (sub.status === 'approved') {
        completed.push(item);
        return;
      }

      if (sub.status === 'rejected') {
        rejected.push(item);
        return;
      }

      if (isExpiredSubmission(sub, task)) {
        expired.push({
          submission: sub,
          task: task,
          expiredReason: getExpiredReason(sub, task)
        });
        return;
      }

      if (sub.status === 'verifying' || sub.status === 'pending' || sub.status === 'submitted' || sub.status === 'claimed') {
        active.push(item);
      }
    });

    return { active: active, completed: completed, rejected: rejected, expired: expired };
  }

  async function enrichMyTasksWithPublishers(items) {
    if (!items.length || !window.supabase) return items;

    var publisherIds = items
      .map(function (item) { return item.task && item.task.publisher_id; })
      .filter(function (id) { return !!id; });
    var uniqueIds = publisherIds.filter(function (id, index) {
      return publisherIds.indexOf(id) === index;
    });

    if (!uniqueIds.length) return items;

    var usersResult = await window.supabase
      .from('users')
      .select('id, username, email')
      .in('id', uniqueIds);

    var userMap = {};
    if (!usersResult.error && usersResult.data) {
      usersResult.data.forEach(function (user) {
        userMap[String(user.id)] = user.username || (user.email ? String(user.email).split('@')[0] : 'Unknown');
      });
    }

    return items.map(function (item) {
      var publisherId = item.task && item.task.publisher_id;
      item.publisherName = publisherId ? (userMap[String(publisherId)] || 'Unknown') : 'Unknown';
      return item;
    });
  }

  async function fetchMyTasksData(userId) {
    if (!window.supabase) return { active: [], completed: [], rejected: [], expired: [] };

    var result = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, submitted_at, reviewed_at, review_comment, tasks(*)')
      .eq('user_id', userId)
      .order('reviewed_at', { ascending: false });

    if (result.error) {
      throw result.error;
    }

    var categorized = categorizeMyTasks(normalizeSubmissionRows(result.data));
    var allItems = categorized.active
      .concat(categorized.completed)
      .concat(categorized.rejected)
      .concat(categorized.expired);
    var enriched = await enrichMyTasksWithPublishers(allItems);
    var enrichedMap = {};
    enriched.forEach(function (item) {
      enrichedMap[item.submission.id] = item;
    });

    function remap(list) {
      return list.map(function (item) {
        return enrichedMap[item.submission.id] || item;
      });
    }

    return {
      active: remap(categorized.active),
      completed: remap(categorized.completed),
      rejected: remap(categorized.rejected),
      expired: remap(categorized.expired)
    };
  }

  function buildMyTaskCardHtml(item, tab) {
    var task = item.task;
    var submission = item.submission;
    var title = escapeHtml(task.title || '');
    var category = getTaskField(task, ['type', 'task_type', 'category'], 'other');
    var typeLabelKey = getTypeLabelKey(task);
    var reward = escapeHtml(formatMtReward(task));
    var taskId = escapeHtml(task.id);

    var imageUrlRaw = getTaskField(task, ['image_url'], '');
    var imageUrl = imageUrlRaw ? resolveTaskImageUrl(imageUrlRaw) : '';
    var cardClass = imageUrl ? ' my-task-card-with-image' : '';
    var imageBlock = imageUrl
      ? '<div class="my-task-card-media"><img class="my-task-card-image" src="' + escapeHtml(imageUrl) + '" alt=""' + taskImageErrorAttr() + '></div>'
      : '';

    var statusHtml = '';
    var metaHtml = '';

    if (tab === 'active') {
      statusHtml = buildActiveStatusHtml(submission);
      metaHtml = '<p class="my-task-meta">' + escapeHtml(mtT('mt_label_deadline')) + '：' + escapeHtml(formatMtDeadline(task.deadline)) + '</p>';
    } else if (tab === 'completed') {
      statusHtml = '<span class="my-task-status my-task-status-done">' + escapeHtml(mtT('mt_status_approved')) + '</span>';
      var doneTime = submission.reviewed_at || submission.submitted_at;
      metaHtml = '<p class="my-task-meta">' + escapeHtml(mtT('mt_label_completed')) + '：' + escapeHtml(formatMtDateTime(doneTime)) + '</p>';
    } else if (tab === 'rejected') {
      statusHtml = '<span class="my-task-status my-task-status-rejected">' + escapeHtml(mtT('mt_badge_rejected')) + '</span>';
      var publisherName = escapeHtml(item.publisherName || 'Unknown');
      var rejectReason = escapeHtml(submission.review_comment || '—');
      var rejectTime = escapeHtml(formatMtDateTime(submission.reviewed_at || submission.submitted_at));
      metaHtml =
        '<p class="my-task-meta">' + escapeHtml(mtT('mt_label_publisher')) + '：' + publisherName + '</p>' +
        '<p class="my-task-meta my-task-meta-reject">' + escapeHtml(mtT('mt_label_reject_reason')) + '：' + rejectReason + '</p>' +
        '<p class="my-task-meta">' + escapeHtml(mtT('mt_label_reject_time')) + '：' + rejectTime + '</p>' +
        '<button type="button" class="my-task-resubmit-btn" data-task-id="' + taskId + '">' + escapeHtml(mtT('mt_btn_resubmit')) + '</button>';
    } else {
      statusHtml = '<span class="my-task-status my-task-status-expired">' + escapeHtml(item.expiredReason || mtT('mt_reason_expired')) + '</span>';
      var reasonText = item.expiredReason || mtT('mt_reason_expired');
      metaHtml = '<p class="my-task-meta">' + escapeHtml(mtT('mt_label_reason')) + '：' + escapeHtml(reasonText) + '</p>';
    }

    return (
      '<article class="my-task-card' + cardClass + '" data-task-id="' + taskId + '" role="button" tabindex="0">' +
        imageBlock +
        '<div class="my-task-card-body">' +
          '<h3 class="my-task-card-title">' + title + '</h3>' +
          '<div class="my-task-card-tags">' +
            '<span class="type-label label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
            statusHtml +
            buildReportStatusHtml(task.id) +
          '</div>' +
          '<div class="my-task-reward">' + reward + '</div>' +
          metaHtml +
        '</div>' +
      '</article>'
    );
  }

  function getEmptyMessageKey(tab) {
    if (tab === 'completed') return 'mt_empty_completed';
    if (tab === 'rejected') return 'mt_empty_rejected';
    if (tab === 'expired') return 'mt_empty_expired';
    return 'mt_empty_active';
  }

  function renderMyTasksList() {
    var listEl = document.getElementById('mt-task-list');
    var emptyEl = document.getElementById('mt-empty-state');
    var emptyTextEl = document.getElementById('mt-empty-text');
    if (!listEl || !emptyEl) return;

    var items = myTasksData[myTasksTab] || [];

    if (!items.length) {
      listEl.innerHTML = '';
      listEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      if (emptyTextEl) emptyTextEl.textContent = mtT(getEmptyMessageKey(myTasksTab));
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    listEl.innerHTML = items.map(function (item) {
      return buildMyTaskCardHtml(item, myTasksTab);
    }).join('');

    if (typeof applyLanguageStrings === 'function') {
      applyLanguageStrings();
    }
  }

  function updateMyTasksTabsUI() {
    document.querySelectorAll('#my-tasks-page .my-tasks-tab').forEach(function (btn) {
      var tab = btn.getAttribute('data-tab');
      if (tab === myTasksTab) {
        btn.classList.add('my-tasks-tab-active');
      } else {
        btn.classList.remove('my-tasks-tab-active');
      }
    });
  }

  function setMyTasksLoading(loading) {
    myTasksLoading = loading;
    var loadingEl = document.getElementById('mt-loading');
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
  }

  function applyMyTasksI18n() {
    document.querySelectorAll('#my-tasks-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (myTasksTranslations[getLang()][key]) {
        el.textContent = mtT(key);
      }
    });
  }

  async function loadAndRenderMyTasks() {
    var loginEl = document.getElementById('mt-login-required');
    var mainEl = document.getElementById('mt-main-content');
    var userId = await getCurrentUserId();

    applyMyTasksI18n();
    updateMyTasksTabsUI();

    if (!userId) {
      if (loginEl) loginEl.classList.remove('hidden');
      if (mainEl) mainEl.classList.add('hidden');
      myTasksUserId = null;
      stopVerifyingPoll();
      return;
    }

    myTasksUserId = userId;

    if (loginEl) loginEl.classList.add('hidden');
    if (mainEl) mainEl.classList.remove('hidden');

    setMyTasksLoading(true);
    try {
      ensureMyTasksReportStyles();
      myReportsByTaskId = await fetchMyReportsMap(userId);
      myTasksData = await fetchMyTasksData(userId);
      renderMyTasksList();
      await verifyActiveTwitterSubmissions();
      startVerifyingPoll();
    } catch (err) {
      console.warn('加载我的任务失败', err);
      alert(mtT('mt_load_fail') + (err && err.message ? err.message : String(err)));
      myTasksData = { active: [], completed: [], rejected: [], expired: [] };
      renderMyTasksList();
      stopVerifyingPoll();
    } finally {
      setMyTasksLoading(false);
    }
  }

  function switchMyTasksTab(tab) {
    myTasksTab = tab;
    updateMyTasksTabsUI();
    renderMyTasksList();
    syncMyTasksTabHash(tab);
    console.log('我的任务：切换标签', tab);
  }

  function ensureRejectedTab() {
    var tabsEl = document.querySelector('#my-tasks-page .my-tasks-tabs');
    if (!tabsEl || document.getElementById('mt-tab-rejected')) return;

    var rejectedBtn = document.createElement('button');
    rejectedBtn.type = 'button';
    rejectedBtn.id = 'mt-tab-rejected';
    rejectedBtn.className = 'my-tasks-tab';
    rejectedBtn.setAttribute('data-tab', 'rejected');
    rejectedBtn.setAttribute('data-i18n', 'mt_tab_rejected');
    rejectedBtn.textContent = mtT('mt_tab_rejected');

    var expiredBtn = document.getElementById('mt-tab-expired');
    if (expiredBtn) {
      tabsEl.insertBefore(rejectedBtn, expiredBtn);
    } else {
      tabsEl.appendChild(rejectedBtn);
    }

    rejectedBtn.addEventListener('click', function () {
      switchMyTasksTab('rejected');
    });

    if (!document.getElementById('my-task-resubmit-style')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'my-task-resubmit-style';
      styleEl.textContent =
        '.my-task-meta-reject{color:#ff4d4f;}' +
        '.my-task-resubmit-btn{margin-top:12px;padding:8px 16px;border:none;border-radius:8px;background:#ff7a45;color:#fff;font-size:14px;font-weight:600;cursor:pointer;}' +
        '.my-task-resubmit-btn:hover{opacity:0.92;}';
      document.head.appendChild(styleEl);
    }
  }

  function initMyTasksEvents() {
    if (myTasksInitialized) return;
    myTasksInitialized = true;

    ensureRejectedTab();

    document.querySelectorAll('#my-tasks-page .my-tasks-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchMyTasksTab(btn.getAttribute('data-tab') || 'active');
      });
    });

    var listEl = document.getElementById('mt-task-list');
    if (listEl) {
      listEl.addEventListener('click', function (e) {
        var resubmitBtn = e.target.closest('.my-task-resubmit-btn');
        if (resubmitBtn && listEl.contains(resubmitBtn)) {
          e.preventDefault();
          e.stopPropagation();
          var resubmitTaskId = resubmitBtn.getAttribute('data-task-id');
          if (resubmitTaskId) navigateToTaskDetail(resubmitTaskId);
          return;
        }

        var card = e.target.closest('.my-task-card');
        if (!card || !listEl.contains(card)) return;
        var taskId = card.getAttribute('data-task-id');
        if (taskId) navigateToTaskDetail(taskId);
      });
      listEl.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.my-task-card');
        if (!card || !listEl.contains(card)) return;
        e.preventDefault();
        var taskId = card.getAttribute('data-task-id');
        if (taskId) navigateToTaskDetail(taskId);
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      myTasksInitialized = false;
    }
  }

  async function handleMyTasksRoute() {
    restoreAppContentIfNeeded();

    var routeBase = getRouteBase();
    var page = document.getElementById('my-tasks-page');

    if (!page) return;

    if (routeBase === 'my-tasks') {
      myTasksTab = resolveMyTasksTabFromHash();
      showMyTasksPageOnly();
      initMyTasksEvents();
      await loadAndRenderMyTasks();
    } else {
      page.classList.add('hidden');
      stopVerifyingPoll();
    }
  }

  window.addEventListener('hashchange', handleMyTasksRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleMyTasksRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleMyTasksRoute, 0);
    });
  }
})();

