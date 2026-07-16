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
      rv_alert_already_rewarded: '该用户已领取过奖励',
      rv_unknown_user: '未知用户'
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
      rv_alert_already_rewarded: 'This user has already received the reward',
      rv_unknown_user: 'Unknown user'
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
    if (submission.status === 'pending') return true;
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

  function getScreenshotUrls(submission) {
    var urls = submission.screenshot_urls;
    if (!urls) return [];
    if (Array.isArray(urls)) {
      return urls.map(function (url) { return String(url || '').trim(); }).filter(Boolean);
    }
    if (typeof urls === 'string' && urls.trim()) {
      try {
        var parsed = JSON.parse(urls);
        if (Array.isArray(parsed)) {
          return parsed.map(function (url) { return String(url || '').trim(); }).filter(Boolean);
        }
      } catch (e) {
        return [urls.trim()];
      }
    }
    return [];
  }

  function getScreenshotCount(submission) {
    return getScreenshotUrls(submission).length;
  }

  function getStatusLabel(submission) {
    if (submission.status === 'approved') return rvT('rv_status_approved');
    if (submission.status === 'rejected') return rvT('rv_status_rejected');
    if (submission.status === 'submitted') return rvT('rv_status_submitted');
    if (submission.status === 'claimed') return rvT('rv_status_claimed');
    if (submission.status === 'pending') return rvT('rv_status_submitted');
    return submission.status || '-';
  }

  function truncateText(text, maxLen) {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '...';
  }

  function getSummaryText(submission) {
    return truncateText(submission.description || '', 50) || '-';
  }

  function normalizeSubmissionUserRecord(rawUser) {
    if (!rawUser) return null;
    if (Array.isArray(rawUser)) {
      return rawUser.length ? rawUser[0] : null;
    }
    return rawUser;
  }

  function getUnknownUserLabel() {
    return rvT('rv_unknown_user');
  }

  function formatWalletUsername(walletAddress) {
    var wallet = String(walletAddress || '').trim();
    if (!wallet) return '';
    return wallet.slice(0, 10) + '...';
  }

  function getSubmissionDisplayName(submission) {
    submission = submission || {};
    var userRecord = normalizeSubmissionUserRecord(submission.users);

    if (userRecord && userRecord.username != null && String(userRecord.username).trim()) {
      return String(userRecord.username).trim();
    }

    if (submission.user_id) {
      return String(submission.user_id).substring(0, 8) + '...';
    }

    return getUnknownUserLabel();
  }

  function renderScreenshotBlock(submission) {
    var urls = getScreenshotUrls(submission);
    if (!urls.length) return '';

    var thumbStyle = 'max-width:120px;max-height:80px;border-radius:4px;object-fit:cover;display:block;margin-top:8px;';
    var linkStyle = 'display:inline-block;margin-right:8px;margin-top:8px;';
    var galleryStyle = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;';

    if (urls.length === 1) {
      return (
        '<div class="rv-screenshots">' +
          '<a class="rv-screenshot-link" href="' + escapeHtml(urls[0]) + '" target="_blank" rel="noopener noreferrer" style="' + linkStyle + '">' +
            '<img class="rv-screenshot-thumb" src="' + escapeHtml(urls[0]) + '" alt="screenshot" style="' + thumbStyle + '">' +
          '</a>' +
        '</div>'
      );
    }

    return (
      '<div class="rv-screenshots">' +
        '<button type="button" class="rv-screenshot-toggle" data-id="' + escapeHtml(submission.id) + '" style="margin-top:8px;padding:0;border:none;background:none;color:#4f8cff;cursor:pointer;font-size:13px;">' +
          escapeHtml(rvT('rv_screenshot_summary', { count: urls.length })) +
        '</button>' +
        '<div class="rv-screenshot-gallery hidden" id="rv-screenshot-gallery-' + escapeHtml(submission.id) + '" style="' + galleryStyle + '">' +
          urls.map(function (url, index) {
            return (
              '<a class="rv-screenshot-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" style="' + linkStyle + '">' +
                '<img class="rv-screenshot-thumb" src="' + escapeHtml(url) + '" alt="screenshot ' + (index + 1) + '" style="' + thumbStyle + '">' +
              '</a>'
            );
          }).join('') +
        '</div>' +
      '</div>'
    );
  }

  function renderSubmissionItem(submission) {
    var actionsHtml = '';
    var summaryHtml = '';
    var statusLabel = getStatusLabel(submission);
    var displayName = getSubmissionDisplayName(submission);
    var screenshotHtml = renderScreenshotBlock(submission);
    var submissionStatus = String(submission.status || '').toLowerCase();

    console.log('提交列表-用户名数据：', {
      userId: submission.user_id,
      username: displayName,
      raw: submission
    });

    if (submissionStatus === 'approved') {
      summaryHtml = '<span class="rv-status-approved">' + escapeHtml(statusLabel) + '</span>';
      actionsHtml =
        '<div class="rv-actions">' +
          '<button type="button" class="rv-btn-approve rv-btn-disabled" disabled>' + rvT('rv_btn_approve') + '</button>' +
          '<button type="button" class="rv-btn-reject rv-btn-disabled" disabled>' + rvT('rv_btn_reject') + '</button>' +
        '</div>';
    } else if (submissionStatus === 'rejected') {
      summaryHtml =
        '<span class="rv-status-rejected">' + escapeHtml(statusLabel) + '</span>' +
        (submission.review_comment
          ? '<p class="rv-submit-summary">' + escapeHtml(truncateText(submission.review_comment, 50)) + '</p>'
          : '');
      actionsHtml =
        '<div class="rv-actions">' +
          '<button type="button" class="rv-btn-approve rv-btn-disabled" disabled>' + rvT('rv_btn_approve') + '</button>' +
          '<button type="button" class="rv-btn-reject rv-btn-disabled" disabled>' + rvT('rv_status_rejected') + '</button>' +
        '</div>';
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

    if (screenshotHtml) {
      summaryHtml += screenshotHtml;
    }

    var submitter = submission.submitter || {
      id: submission.user_id,
      username: displayName
    };
    var avatarHtml = typeof buildAvatarHtml === 'function'
      ? buildAvatarHtml(submitter, 'rv-avatar')
      : '<div class="rv-avatar"></div>';

    return (
      '<li class="review-submission-item" data-id="' + escapeHtml(submission.id) + '">' +
        '<div class="rv-user-block">' +
          avatarHtml +
          '<span class="rv-username">' + escapeHtml(displayName) + '</span>' +
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

    updatePendingCountBadge();

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
      if (!selectedTaskId || !publisherTasks.some(function (task) {
        return String(task.id) === String(selectedTaskId);
      })) {
        selectedTaskId = publisherTasks[0].id;
      }
      taskSelect.value = String(selectedTaskId);
      setTaskSelectDisabled(false);
    } else {
      selectedTaskId = null;
      setTaskSelectDisabled(true);
    }
  }

  function resolveCanonicalTaskId(taskId) {
    if (!taskId) return taskId;
    var matchedTask = publisherTasks.find(function (task) {
      return String(task.id) === String(taskId);
    });
    return matchedTask ? matchedTask.id : taskId;
  }

  async function findReviewableTaskIdAmongPublisherTasks() {
    if (!publisherTasks.length || !window.supabase) return null;

    var statusFilter = ['submitted', 'pending'];
    var taskIds = publisherTasks.map(function (task) { return task.id; });
    var reviewableResult = await window.supabase
      .from('submissions')
      .select('task_id')
      .in('task_id', taskIds)
      .in('status', statusFilter)
      .order('submitted_at', { ascending: false })
      .limit(1);

    if (!reviewableResult.error && reviewableResult.data && reviewableResult.data.length) {
      return reviewableResult.data[0].task_id;
    }

    return null;
  }

  async function enrichSubmissionsWithUsers(submissions) {
    if (!submissions.length) return [];

    var userIds = submissions
      .map(function (item) { return item.user_id; })
      .filter(function (id) { return !!id; });
    var uniqueIds = userIds.filter(function (id, index) {
      return userIds.indexOf(id) === index;
    });

    var userMap = {};
    if (uniqueIds.length && window.supabase) {
      var usersResult = await window.supabase
        .from('users')
        .select('id, username, email, wallet_address')
        .in('id', uniqueIds);

      console.log('提交列表-users单独查询：', JSON.stringify({
        userIds: uniqueIds,
        count: (usersResult.data || []).length,
        error: usersResult.error ? usersResult.error.message : null
      }));

      if (!usersResult.error && usersResult.data) {
        usersResult.data.forEach(function (user) {
          userMap[String(user.id)] = user;
        });
      }
    }

    return submissions.map(function (item) {
      var mappedItem = Object.assign({}, item);
      var joinedUser = normalizeSubmissionUserRecord(mappedItem.users);
      var fetchedUser = userMap[String(mappedItem.user_id)] || null;

      if (fetchedUser) {
        mappedItem.users = fetchedUser;
      } else if (joinedUser) {
        mappedItem.users = joinedUser;
      }

      return mapSubmissionWithUsername(mappedItem);
    });
  }

  function mapSubmissionWithUsername(submission) {
    var userRecord = normalizeSubmissionUserRecord(submission.users);
    var userId = submission.user_id;
    var username = getSubmissionDisplayName(submission);

    var mapped = Object.assign({}, submission);
    mapped.username = username;
    mapped.submitter = userRecord ? {
      id: userId,
      username: username,
      email: userRecord.email || '',
      wallet_address: userRecord.wallet_address || ''
    } : (userId ? { id: userId, username: username } : null);

    return mapped;
  }

  function updatePendingCountBadge() {
    var countEl = document.getElementById('rv-pending-count');
    if (!countEl) return;

    var reviewableCount = getReviewableCount();
    countEl.textContent = rvT('rv_pending_count', { count: reviewableCount });

    if (reviewableCount > 0) {
      countEl.classList.add('review-pending-count-active');
      countEl.style.color = '#fff';
      countEl.style.background = '#ff4d4f';
      countEl.style.borderRadius = '10px';
      countEl.style.padding = '2px 10px';
      countEl.style.fontSize = '12px';
      countEl.style.fontWeight = '600';
    } else {
      countEl.classList.remove('review-pending-count-active');
      countEl.style.color = '#999';
      countEl.style.background = 'transparent';
      countEl.style.borderRadius = '';
      countEl.style.padding = '';
      countEl.style.fontSize = '13px';
      countEl.style.fontWeight = '';
    }
  }

  async function resolveSelectedTaskIdWithSubmissions() {
    if (!publisherTasks.length || !window.supabase) return selectedTaskId;

    var statusFilter = ['submitted', 'pending'];
    var canonicalSelectedTaskId = resolveCanonicalTaskId(selectedTaskId);

    if (canonicalSelectedTaskId) {
      var currentResult = await window.supabase
        .from('submissions')
        .select('id')
        .eq('task_id', canonicalSelectedTaskId)
        .in('status', statusFilter)
        .limit(1);

      if (!currentResult.error && currentResult.data && currentResult.data.length) {
        return canonicalSelectedTaskId;
      }
    }

    var fallbackTaskId = await findReviewableTaskIdAmongPublisherTasks();

    console.log('审核管理-有待审核的任务查询：', JSON.stringify({
      selectedTaskId: selectedTaskId,
      canonicalSelectedTaskId: canonicalSelectedTaskId,
      fallbackTaskId: fallbackTaskId,
      publisherTaskIds: publisherTasks.map(function (task) { return task.id; })
    }));

    if (fallbackTaskId) {
      return fallbackTaskId;
    }

    return canonicalSelectedTaskId || publisherTasks[0].id;
  }

  async function advanceReviewQueueAfterApproval() {
    if (getReviewableCount() > 0) {
      return;
    }

    if (!window.supabase || !publisherTasks.length) {
      currentSubmissions = [];
      showReviewEmptyMessage('rv_empty_text');
      return;
    }

    var statusFilter = ['submitted', 'pending'];
    var taskIds = publisherTasks.map(function (task) { return task.id; });
    var reviewableResult = await window.supabase
      .from('submissions')
      .select('task_id')
      .in('task_id', taskIds)
      .in('status', statusFilter)
      .order('submitted_at', { ascending: false })
      .limit(1);

    if (!reviewableResult.error && reviewableResult.data && reviewableResult.data.length) {
      var nextTaskId = reviewableResult.data[0].task_id;
      if (String(nextTaskId) !== String(selectedTaskId)) {
        selectedTaskId = nextTaskId;
        renderTaskSelectOptions();
      }
      await loadSubmissionsForSelectedTask();
      return;
    }

    currentSubmissions = [];
    showReviewEmptyMessage('rv_empty_text');
  }

  async function loadSubmissionsForSelectedTask(allowTaskAutoSwitch) {
    if (!selectedTaskId || !window.supabase) {
      currentSubmissions = [];
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    var taskId = resolveCanonicalTaskId(selectedTaskId);
    var hashTaskId = getReviewTaskIdFromHash();
    var statusFilter = ['submitted', 'pending'];

    console.log('提交列表查询条件：', JSON.stringify({
      taskId: taskId,
      selectedTaskId: selectedTaskId,
      hashTaskId: hashTaskId,
      statusFilter: statusFilter
    }));

    var submissionsResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, screenshot_urls, submitted_at, users!user_id(username, email, wallet_address)')
      .eq('task_id', taskId)
      .in('status', statusFilter)
      .order('submitted_at', { ascending: false });

    if (submissionsResult.error) {
      console.log('提交列表-关联查询失败，降级为无关联查询：', submissionsResult.error.message);
      submissionsResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, screenshot_urls, submitted_at')
        .eq('task_id', taskId)
        .in('status', statusFilter)
        .order('submitted_at', { ascending: false });
    }

    console.log('提交列表查询结果：', JSON.stringify({
      taskId: taskId,
      count: (submissionsResult.data || []).length,
      error: submissionsResult.error ? submissionsResult.error.message : null
    }));

    if (submissionsResult.error) {
      alert(rvT('rv_alert_action_fail') + submissionsResult.error.message);
      currentSubmissions = [];
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    var rawSubmissions = submissionsResult.data || [];

    if (!rawSubmissions.length) {
      var plainResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, screenshot_urls, submitted_at')
        .eq('task_id', taskId)
        .in('status', statusFilter)
        .order('submitted_at', { ascending: false });

      console.log('提交列表-status验证：', JSON.stringify({
        taskId: taskId,
        statusFilter: statusFilter,
        count: (plainResult.data || []).length,
        sample: (plainResult.data || []).slice(0, 3).map(function (item) {
          return {
            id: item.id,
            task_id: item.task_id,
            status: item.status
          };
        }),
        error: plainResult.error ? plainResult.error.message : null
      }));

      if (plainResult.data && plainResult.data.length) {
        rawSubmissions = plainResult.data;
      } else if (allowTaskAutoSwitch !== false) {
        var fallbackTaskId = await findReviewableTaskIdAmongPublisherTasks();
        if (fallbackTaskId && String(fallbackTaskId) !== String(taskId)) {
          console.log('提交列表-自动切换任务：', JSON.stringify({
            fromTaskId: taskId,
            toTaskId: fallbackTaskId
          }));
          selectedTaskId = fallbackTaskId;
          renderTaskSelectOptions();
          await loadSubmissionsForSelectedTask(false);
          return;
        }
      }
    }

    var submissions = await enrichSubmissionsWithUsers(rawSubmissions);

    console.log('审核管理-提交列表数量：', submissions.length);

    currentSubmissions = submissions;
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

    console.log('审核管理-任务列表：', publisherTasks);

    var hashTaskId = getReviewTaskIdFromHash();
    console.log('审核管理-URL任务参数：', JSON.stringify({ hashTaskId: hashTaskId }));

    if (hashTaskId) {
      var hashMatchedTask = publisherTasks.find(function (task) {
        return String(task.id) === String(hashTaskId);
      });
      if (hashMatchedTask) {
        selectedTaskId = hashMatchedTask.id;
      } else {
        console.log('审核管理-URL任务参数无效：', JSON.stringify({
          hashTaskId: hashTaskId,
          publisherTaskIds: publisherTasks.map(function (task) { return task.id; })
        }));
      }
    }

    renderTaskSelectOptions();

    if (!publisherTasks.length) {
      showReviewEmptyMessage('rv_no_tasks');
      return;
    }

    if (!selectedTaskId) {
      selectedTaskId = publisherTasks[0].id;
    }

    selectedTaskId = resolveCanonicalTaskId(await resolveSelectedTaskIdWithSubmissions());
    renderTaskSelectOptions();

    await loadSubmissionsForSelectedTask();
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

    var approvedSubmission = null;
    currentSubmissions = currentSubmissions.map(function (item) {
      if (String(item.id) === String(submissionId)) {
        approvedSubmission = Object.assign({}, item, {
          status: 'approved',
          reviewed_at: reviewedAt
        });
        return approvedSubmission;
      }
      return item;
    });
    renderSubmissionList();
    console.log('审核通过-本地状态已更新，status：', approvedSubmission ? approvedSubmission.status : null);

    if (alreadyRewarded) {
      console.log('审核通过：状态已更新，该用户此前已领取奖励，跳过发奖', submissionId);
      if (typeof window.coinrealmNotifySubmissionStatusChanged === 'function') {
        window.coinrealmNotifySubmissionStatusChanged({
          taskId: submission.task_id,
          userId: submission.user_id,
          status: 'approved',
          path: 'review-approveSubmission-already-rewarded',
          submissionId: submissionId
        });
      }
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

    if (typeof window.coinrealmNotifySubmissionStatusChanged === 'function') {
      window.coinrealmNotifySubmissionStatusChanged({
        taskId: submission.task_id,
        userId: submission.user_id,
        status: 'approved',
        path: 'review-approveSubmission',
        submissionId: submissionId
      });
    }

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

    currentSubmissions = currentSubmissions.map(function (item) {
      if (String(item.id) === String(submissionId)) {
        return Object.assign({}, item, {
          status: 'rejected',
          review_comment: reason,
          reviewed_at: new Date().toISOString()
        });
      }
      return item;
    });

    renderSubmissionList();
    return true;
  }

  function renderSubmissionList() {
    var listEl = document.getElementById('rv-submission-list');
    var emptyEl = document.getElementById('rv-empty-state');
    var submissions = getCurrentSubmissions();

    updatePendingCountBadge();

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

    listEl.onclick = function (event) {
      var target = event.target;
      if (!target) return;

      var button = target.closest('.rv-btn-approve, .rv-btn-reject');
      if (!button) return;

      if (button.classList.contains('rv-btn-approve')) {
        var approveId = button.getAttribute('data-id');
        if (!approveId) return;
        button.disabled = true;
        approveSubmission(approveId).then(function (ok) {
          if (!ok) {
            button.disabled = false;
          }
        });
        return;
      }

      if (button.classList.contains('rv-btn-reject')) {
        var rejectId = button.getAttribute('data-id');
        if (!rejectId) return;
        pendingRejectId = rejectId;
        openRejectModal();
      }
    };

    listEl.querySelectorAll('.rv-screenshot-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var submissionId = btn.getAttribute('data-id');
        var gallery = document.getElementById('rv-screenshot-gallery-' + submissionId);
        if (!gallery) return;
        gallery.classList.toggle('hidden');
      });
    });
  }

  function openRejectModal() {
    var modal = document.getElementById('rv-reject-modal');
    var textarea = document.getElementById('rv-reject-reason');
    if (textarea) {
      textarea.value = '';
      setTimeout(function () {
        textarea.focus();
      }, 0);
    }
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
        selectedTaskId = resolveCanonicalTaskId(taskSelect.value || null);
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
