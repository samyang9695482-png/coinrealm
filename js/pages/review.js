// 审核管理页 (#review)

(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var reviewInitialized = false;
  var publisherTasks = [];
  var currentSubmissions = [];
  var selectedTaskId = null;
  var pendingRejectId = null;
  var reviewLoading = false;

  var reviewTranslations = {
    zh: {
      rv_page_title: '审核管理',
      rv_select_label: '选择要审核的任务',
      rv_list_title: '待审核提交',
      rv_pending_count: '共 {count} 条',
      rv_empty_text: '所有提交已审核完毕',
      rv_no_tasks: '您还没有发布过任务',
      rv_no_submissions: '暂无提交',
      rv_reject_title: '驳回理由',
      rv_reject_ph: '请填写驳回理由...',
      rv_reject_confirm: '确认驳回',
      rv_reject_cancel: '取消',
      rv_btn_approve: '通过',
      rv_btn_reject: '驳回',
      rv_status_approved: '已通过',
      rv_status_rejected: '已驳回',
      rv_status_submitted: '待审核',
      rv_status_claimed: '待提交凭证',
      rv_screenshot_summary: '📷 查看截图（{count}张）',
      rv_alert_login: '请先登录',
      rv_alert_reject_reason: '请填写驳回理由',
      rv_alert_action_fail: '操作失败：',
      rv_alert_already_rewarded: '该用户已领取过奖励'
    },
    en: {
      rv_page_title: 'Review Management',
      rv_select_label: 'Select task to review',
      rv_list_title: 'Submissions',
      rv_pending_count: '{count} total',
      rv_empty_text: 'All submissions have been reviewed',
      rv_no_tasks: 'You have not published any tasks yet',
      rv_no_submissions: 'No submissions yet',
      rv_reject_title: 'Rejection Reason',
      rv_reject_ph: 'Please enter rejection reason...',
      rv_reject_confirm: 'Confirm Reject',
      rv_reject_cancel: 'Cancel',
      rv_btn_approve: 'Approve',
      rv_btn_reject: 'Reject',
      rv_status_approved: 'Approved',
      rv_status_rejected: 'Rejected',
      rv_status_submitted: 'Pending review',
      rv_status_claimed: 'Awaiting proof',
      rv_screenshot_summary: '📷 View screenshots ({count})',
      rv_alert_login: 'Please sign in first',
      rv_alert_reject_reason: 'Please enter a rejection reason',
      rv_alert_action_fail: 'Action failed: ',
      rv_alert_already_rewarded: 'This user has already received the reward'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function rvT(key, vars) {
    var dict = reviewTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function getReviewTaskIdFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || '';
    var queryIndex = hash.indexOf('?');
    if (queryIndex < 0) return null;
    var params = new URLSearchParams(hash.slice(queryIndex + 1));
    return params.get('taskId') || params.get('id') || null;
  }

  function getCurrentSubmissions() {
    return currentSubmissions;
  }

  function isReviewable(submission) {
    if (!submission) return false;
    if (submission.status === 'submitted') return true;
    if (submission.status === 'pending' && submission.submitted_at) return true;
    return false;
  }

  function getReviewableCount() {
    return getCurrentSubmissions().filter(isReviewable).length;
  }

  function formatSubmissionTime(value) {
    if (!value) return '-';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    var lang = getLang();
    if (lang === 'zh') {
      return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getScreenshotCount(submission) {
    var urls = submission.screenshot_urls;
    if (Array.isArray(urls)) return urls.length;
    if (typeof urls === 'string' && urls.trim()) {
      try {
        var parsed = JSON.parse(urls);
        if (Array.isArray(parsed)) return parsed.length;
      } catch (e) {
        return 1;
      }
    }
    return 0;
  }

  function getStatusLabel(submission) {
    if (submission.status === 'approved') return rvT('rv_status_approved');
    if (submission.status === 'rejected') return rvT('rv_status_rejected');
    if (submission.status === 'submitted') return rvT('rv_status_submitted');
    if (submission.status === 'claimed') return rvT('rv_status_claimed');
    if (submission.status === 'pending' && submission.submitted_at) return rvT('rv_status_submitted');
    return submission.status || '-';
  }

  function truncateText(text, maxLen) {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '...';
  }

  function getSummaryText(submission) {
    var screenshotCount = getScreenshotCount(submission);
    if (screenshotCount > 0 && !submission.description) {
      return rvT('rv_screenshot_summary', { count: screenshotCount });
    }
    if (screenshotCount > 0 && submission.description) {
      return truncateText(submission.description, 50) + ' · ' +
        rvT('rv_screenshot_summary', { count: screenshotCount });
    }
    return truncateText(submission.description || '', 50) || '-';
  }

  function renderSubmissionItem(submission) {
    var actionsHtml = '';
    var summaryHtml = '';
    var statusLabel = getStatusLabel(submission);

    if (submission.status === 'approved') {
      summaryHtml = '<span class="rv-status-approved">' + escapeHtml(statusLabel) + '</span>';
    } else if (submission.status === 'rejected') {
      summaryHtml =
        '<span class="rv-status-rejected">' + escapeHtml(statusLabel) + '</span>' +
        (submission.review_comment
          ? '<p class="rv-submit-summary">' + escapeHtml(truncateText(submission.review_comment, 50)) + '</p>'
          : '');
    } else {
      summaryHtml =
        '<p class="rv-submit-summary">' + escapeHtml(getSummaryText(submission)) + '</p>' +
        '<p class="rv-submit-summary">' + escapeHtml(statusLabel) + '</p>';
      if (isReviewable(submission)) {
        actionsHtml =
          '<div class="rv-actions">' +
            '<button type="button" class="rv-btn-approve" data-id="' + escapeHtml(submission.id) + '">' + rvT('rv_btn_approve') + '</button>' +
            '<button type="button" class="rv-btn-reject" data-id="' + escapeHtml(submission.id) + '">' + rvT('rv_btn_reject') + '</button>' +
          '</div>';
      }
    }

    var submitter = submission.submitter || {
      id: submission.user_id,
      username: submission.username || 'Unknown'
    };
    var avatarHtml = typeof buildAvatarHtml === 'function'
      ? buildAvatarHtml(submitter, 'rv-avatar')
      : '<div class="rv-avatar"></div>';

    return (
      '<li class="review-submission-item" data-id="' + escapeHtml(submission.id) + '">' +
        '<div class="rv-user-block">' +
          avatarHtml +
          '<span class="rv-username">' + escapeHtml(submission.username || 'Unknown') + '</span>' +
        '</div>' +
        '<div class="rv-content-block">' +
          '<p class="rv-submit-time">' + escapeHtml(formatSubmissionTime(submission.submitted_at)) + '</p>' +
          summaryHtml +
        '</div>' +
        actionsHtml +
      '</li>'
    );
  }

  function showReviewEmptyMessage(messageKey) {
    var listEl = document.getElementById('rv-submission-list');
    var emptyEl = document.getElementById('rv-empty-state');
    var countEl = document.getElementById('rv-pending-count');

    if (countEl) countEl.textContent = rvT('rv_pending_count', { count: 0 });
    if (listEl) {
      listEl.innerHTML = '';
      listEl.classList.add('hidden');
    }
    if (emptyEl) {
      emptyEl.innerHTML = '<p>' + escapeHtml(rvT(messageKey)) + '</p>';
      emptyEl.classList.remove('hidden');
    }
  }

  function setTaskSelectDisabled(disabled) {
    var taskSelect = document.getElementById('rv-task-select');
    if (taskSelect) taskSelect.disabled = !!disabled;
  }

  function renderTaskSelectOptions() {
    var taskSelect = document.getElementById('rv-task-select');
    if (!taskSelect) return;

    taskSelect.innerHTML = '';
    publisherTasks.forEach(function (task) {
      var option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.title || task.id;
      taskSelect.appendChild(option);
    });

    if (publisherTasks.length) {
      if (!selectedTaskId || !publisherTasks.some(function (task) { return task.id === selectedTaskId; })) {
        selectedTaskId = publisherTasks[0].id;
      }
      taskSelect.value = selectedTaskId;
      setTaskSelectDisabled(false);
    } else {
      selectedTaskId = null;
      setTaskSelectDisabled(true);
    }
  }

  async function enrichSubmissionsWithUsers(submissions) {
    if (!submissions.length || !window.supabase) return submissions;

    var userIds = submissions
      .map(function (item) { return item.user_id; })
      .filter(function (id) { return !!id; });
    var uniqueIds = userIds.filter(function (id, index) {
      return userIds.indexOf(id) === index;
    });

    if (!uniqueIds.length) {
      return submissions.map(function (item) {
        item.username = 'Unknown';
        return item;
      });
    }

    var usersResult = await window.supabase
      .from('users')
      .select('id, username, email, avatar_url')
      .in('id', uniqueIds);

    var userMap = {};
    if (!usersResult.error && usersResult.data) {
      usersResult.data.forEach(function (user) {
        userMap[user.id] = {
          username: user.username || displayNameFromEmail(user.email) || 'Unknown',
          avatar_url: user.avatar_url || '',
          id: user.id,
          email: user.email
        };
      });
    }

    return submissions.map(function (item) {
      var submitter = userMap[item.user_id];
      item.submitter = submitter || null;
      item.username = submitter ? submitter.username : 'Unknown';
      return item;
    });
  }

  async function loadSubmissionsForSelectedTask() {
    if (!selectedTaskId || !window.supabase) {
      currentSubmissions = [];
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    var submissionsResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls')
      .eq('task_id', selectedTaskId)
      .order('submitted_at', { ascending: false });

    if (submissionsResult.error) {
      alert(rvT('rv_alert_action_fail') + submissionsResult.error.message);
      currentSubmissions = [];
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    currentSubmissions = await enrichSubmissionsWithUsers(submissionsResult.data || []);
    renderSubmissionList();
  }

  async function loadPublisherTasks() {
    publisherTasks = [];
    currentSubmissions = [];
    selectedTaskId = null;

    if (!window.supabase) {
      showReviewEmptyMessage('rv_no_tasks');
      renderTaskSelectOptions();
      return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      showReviewEmptyMessage('rv_no_tasks');
      renderTaskSelectOptions();
      return;
    }

    var tasksResult = await window.supabase
      .from('tasks')
      .select('*')
      .eq('publisher_id', userId)
      .order('created_at', { ascending: false });

    if (tasksResult.error) {
      alert(rvT('rv_alert_action_fail') + tasksResult.error.message);
      showReviewEmptyMessage('rv_no_tasks');
      renderTaskSelectOptions();
      return;
    }

    publisherTasks = tasksResult.data || [];

    var hashTaskId = getReviewTaskIdFromHash();
    if (hashTaskId && publisherTasks.some(function (task) { return task.id === hashTaskId; })) {
      selectedTaskId = hashTaskId;
    }

    renderTaskSelectOptions();

    if (!publisherTasks.length) {
      showReviewEmptyMessage('rv_no_tasks');
      return;
    }

    await loadSubmissionsForSelectedTask();
  }

  function displayNameFromEmail(email) {
    if (!email) return 'Unknown';
    var parts = String(email).split('@');
    return parts[0] || 'Unknown';
  }

  async function approveSubmission(submissionId) {
    if (!window.supabase || !submissionId) return false;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(rvT('rv_alert_login'));
      return false;
    }

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, user_id, task_id, status')
      .eq('id', submissionId)
      .maybeSingle();

    if (submissionResult.error || !submissionResult.data) {
      alert(rvT('rv_alert_action_fail') + (submissionResult.error ? submissionResult.error.message : 'submission not found'));
      return false;
    }

    var submission = submissionResult.data;
    var alreadyRewarded = await checkUserAlreadyRewardedForTask(submission.task_id, submission.user_id);
    var reviewedAt = new Date().toISOString();

    var updateResult = await window.supabase
      .from('submissions')
      .update({
        status: 'approved',
        reviewed_at: reviewedAt
      })
      .eq('id', submissionId)
      .select();

    var data = updateResult.data;
    var error = updateResult.error;

    console.log('审核通过更新结果：', { submissionId: submissionId, data: data, error: error });

    if (error) {
      console.error('审核通过更新失败：', error);
      alert(rvT('rv_alert_action_fail') + error.message);
      return false;
    }

    currentSubmissions = currentSubmissions.map(function (item) {
      if (String(item.id) === String(submissionId)) {
        return Object.assign({}, item, {
          status: 'approved',
          reviewed_at: reviewedAt
        });
      }
      return item;
    });
    renderSubmissionList();

    if (alreadyRewarded) {
      console.log('审核通过：状态已更新，该用户此前已领取奖励，跳过发奖', submissionId);
      return true;
    }

    var taskResult = await window.supabase
      .from('tasks')
      .select('title, reward_amount, reward_type, max_participants')
      .eq('id', submission.task_id)
      .maybeSingle();

    var taskTitle = taskResult.data && taskResult.data.title ? taskResult.data.title : '任务';
    var rewardAmount = calculatePerParticipantReward(taskResult.data || {});

    if (rewardAmount > 0 && window.supabase) {
      var userResult = await window.supabase
        .from('users')
        .select('crlm_balance, usdt_balance')
        .eq('id', submission.user_id)
        .maybeSingle();

      if (!userResult.error && userResult.data) {
        var rewardType = String((taskResult.data && taskResult.data.reward_type) || 'CRLM').toUpperCase();
        var balanceField = rewardType === 'USDT' ? 'usdt_balance' : 'crlm_balance';
        var currentBalance = Number(userResult.data[balanceField]) || 0;
        var patch = {};
        patch[balanceField] = currentBalance + rewardAmount;
        await window.supabase.from('users').update(patch).eq('id', submission.user_id);
        console.log('人工审核发奖成功：', {
          submissionId: submissionId,
          userId: submission.user_id,
          rewardAmount: rewardAmount
        });
      }
    }

    await upgradeUserLevelOnTaskApproved(submission.user_id);

    writeBroadcast({
      user_id: submission.user_id,
      event_type: 'task_approved',
      description: '任务「' + buildTaskBroadcastTitle(taskTitle) + '」审核通过，获得',
      reward_amount: rewardAmount
    });

    return true;
  }

  async function rejectSubmission(submissionId, reason) {
    if (!window.supabase || !submissionId) return false;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(rvT('rv_alert_login'));
      return false;
    }

    var updateResult = await window.supabase
      .from('submissions')
      .update({
        status: 'rejected',
        review_comment: reason,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateResult.error) {
      alert(rvT('rv_alert_action_fail') + updateResult.error.message);
      return false;
    }

    return true;
  }

  function renderSubmissionList() {
    var listEl = document.getElementById('rv-submission-list');
    var emptyEl = document.getElementById('rv-empty-state');
    var countEl = document.getElementById('rv-pending-count');
    var submissions = getCurrentSubmissions();

    if (countEl) {
      countEl.textContent = rvT('rv_pending_count', { count: submissions.length });
    }

    if (!listEl || !emptyEl) return;

    if (!publisherTasks.length) {
      showReviewEmptyMessage('rv_no_tasks');
      return;
    }

    if (!submissions.length) {
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    listEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    listEl.innerHTML = submissions.map(renderSubmissionItem).join('');

    listEl.querySelectorAll('.rv-btn-approve').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var id = btn.getAttribute('data-id');
        btn.disabled = true;
        var ok = await approveSubmission(id);
        if (ok) {
          await loadSubmissionsForSelectedTask();
        } else {
          btn.disabled = false;
        }
      });
    });

    listEl.querySelectorAll('.rv-btn-reject').forEach(function (btn) {
      btn.addEventListener('click', function () {
        pendingRejectId = btn.getAttribute('data-id');
        openRejectModal();
      });
    });
  }

  function openRejectModal() {
    var modal = document.getElementById('rv-reject-modal');
    var textarea = document.getElementById('rv-reject-reason');
    if (textarea) textarea.value = '';
    if (modal) modal.classList.remove('hidden');
  }

  function closeRejectModal() {
    var modal = document.getElementById('rv-reject-modal');
    pendingRejectId = null;
    if (modal) modal.classList.add('hidden');
  }

  function applyReviewI18n() {
    document.querySelectorAll('#review-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (reviewTranslations[getLang()][key]) {
        el.textContent = rvT(key);
      }
    });

    document.querySelectorAll('#review-page select option[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (reviewTranslations[getLang()][key]) {
        el.textContent = rvT(key);
      }
    });

    document.querySelectorAll('#review-page [data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (reviewTranslations[getLang()][key]) {
        el.setAttribute('placeholder', rvT(key));
      }
    });
  }

  function initReviewEvents() {
    if (reviewInitialized) return;
    reviewInitialized = true;

    var taskSelect = document.getElementById('rv-task-select');
    if (taskSelect) {
      taskSelect.addEventListener('change', async function () {
        selectedTaskId = taskSelect.value || null;
        closeRejectModal();
        await loadSubmissionsForSelectedTask();
        applyReviewI18n();
      });
    }

    var confirmBtn = document.getElementById('rv-reject-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async function () {
        if (!pendingRejectId) return;
        var textarea = document.getElementById('rv-reject-reason');
        var reason = textarea ? textarea.value.trim() : '';
        if (!reason) {
          alert(rvT('rv_alert_reject_reason'));
          return;
        }

        confirmBtn.disabled = true;
        var ok = await rejectSubmission(pendingRejectId, reason);
        confirmBtn.disabled = false;
        if (ok) {
          closeRejectModal();
          await loadSubmissionsForSelectedTask();
        }
      });
    }

    var cancelBtn = document.getElementById('rv-reject-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeRejectModal);
    }

    var modal = document.getElementById('rv-reject-modal');
    if (modal) {
      var overlay = modal.querySelector('.review-modal-overlay');
      if (overlay) {
        overlay.addEventListener('click', closeRejectModal);
      }
    }
  }

  async function renderReviewPage() {
    if (reviewLoading) return;
    reviewLoading = true;

    initReviewEvents();
    applyReviewI18n();
    await loadPublisherTasks();

    reviewLoading = false;
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      reviewInitialized = false;
      publisherTasks = [];
      currentSubmissions = [];
      selectedTaskId = null;
      pendingRejectId = null;
    }
  }

  function handleReviewRoute() {
    restoreAppContentIfNeeded();

    var routeBase = getRouteBaseFromHash();
    var reviewPage = document.getElementById('review-page');

    if (reviewPage) {
      if (routeBase === 'review') {
        reviewPage.classList.remove('hidden');
        renderReviewPage();
      } else {
        reviewPage.classList.add('hidden');
        closeRejectModal();
      }
    }
  }

  function getRouteBaseFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || 'home';
    return hash.split('?')[0] || 'home';
  }

  window.addEventListener('hashchange', handleReviewRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleReviewRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleReviewRoute, 0);
    });
  }
})();
