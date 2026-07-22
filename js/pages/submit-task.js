// ==========================================
// 7. 任务提交页 (#submit-task) — 任务卡 #005
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var SUBMISSION_STORAGE_KEY = 'coinrealm_active_submission';
  var submitState = 'form';
  var uploadedFiles = [];
  var uploadInProgress = false;
  var submitTaskInitialized = false;
  var MAX_SCREENSHOT_FILES = 3;
  var ST_DESC_MIN_LEN = 1;
  var ST_DESC_MAX_LEN = 2000;
  var MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;
  var ALLOWED_SCREENSHOT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
  var SCREENSHOTS_BUCKET = 'screenshots';
  var activeSubmitContext = null;
  var currentSubmissionRecord = null;

  var submitPageEl = document.getElementById('submit-task-page');
  var SUBMIT_PAGE_HTML = submitPageEl ? submitPageEl.innerHTML : '';

  var submitTaskTranslations = {
    zh: {
      st_title_submit: '提交凭证',
      st_title_waiting: '等待审核',
      st_ph_desc: '请描述你是如何完成任务的...',
      st_upload_main: '📷 点击或拖拽上传截图',
      st_upload_hint: '支持 JPG、PNG、WebP 格式，单张不超过 5MB，最多 3 张',
      st_ph_note: '补充说明（可选）',
      st_waiting_text: '你的凭证已提交，等待发布者审核',
      st_waiting_sub: '预计 48 小时内完成审核',
      st_btn_submit: '提交审核',
      st_btn_submitted: '已提交',
      st_btn_back_home: '返回首页',
      st_reject_title: '驳回理由：',
      st_alert_desc: '请填写任务完成描述',
      st_alert_desc_too_long: '任务完成描述不能超过 2000 个字符',
      st_alert_need_image: '请至少上传一张截图',
      st_alert_login: '请先登录',
      st_alert_max_files: '最多上传 3 张截图',
      st_alert_invalid_type: '仅支持 JPG、PNG、WebP 格式',
      st_alert_file_size: '单张图片不能超过 5MB',
      st_alert_upload_fail: '上传失败：',
      st_alert_no_task: '请先在任务详情页领取任务',
      st_alert_submit_fail: '提交失败：',
      st_alert_already_rewarded: '该用户已领取过奖励',
      st_title_completed: '任务已完成',
      st_completed_text: '你已完成该任务并领取了奖励',
      st_btn_completed: '已完成'
    },
    en: {
      st_title_submit: 'Submit Proof',
      st_title_waiting: 'Pending Review',
      st_ph_desc: 'Describe how you completed the task...',
      st_upload_main: '📷 Click or drag to upload screenshots',
      st_upload_hint: 'JPG, PNG, WebP supported, max 5MB each, up to 3 files',
      st_ph_note: 'Additional notes (optional)',
      st_waiting_text: 'Your proof has been submitted and is awaiting publisher review',
      st_waiting_sub: 'Review expected within 48 hours',
      st_btn_submit: 'Submit for Review',
      st_btn_submitted: 'Submitted',
      st_btn_back_home: 'Back to Home',
      st_reject_title: 'Rejection reason:',
      st_alert_desc: 'Please fill in the task completion description',
      st_alert_desc_too_long: 'Task completion description cannot exceed 2000 characters',
      st_alert_need_image: 'Please upload at least one screenshot',
      st_alert_login: 'Please sign in first',
      st_alert_max_files: 'Maximum 3 screenshots allowed',
      st_alert_invalid_type: 'Only JPG, PNG, and WebP formats are supported',
      st_alert_file_size: 'Each image must be 5MB or smaller',
      st_alert_upload_fail: 'Upload failed: ',
      st_alert_no_task: 'Please claim the task on the task detail page first',
      st_alert_submit_fail: 'Submit failed: ',
      st_alert_already_rewarded: 'You have already received the reward for this task',
      st_title_completed: 'Task Completed',
      st_completed_text: 'You have completed this task and received the reward',
      st_btn_completed: 'Completed'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function stT(key) {
    var dict = submitTaskTranslations[getLang()];
    return dict[key] || key;
  }

  function getScreenshotExtension(filename) {
    var parts = String(filename || '').toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : '';
  }

  function validateSubmitProofInputs(proofType, desc, screenshotCount) {
    if (proofType === 'text') {
      var text = desc != null ? String(desc).trim() : '';
      if (text.length < ST_DESC_MIN_LEN) {
        return { ok: false, message: stT('st_alert_desc') };
      }
      if (text.length > ST_DESC_MAX_LEN) {
        return { ok: false, message: stT('st_alert_desc_too_long') };
      }
    }

    if (screenshotCount > MAX_SCREENSHOT_FILES) {
      return { ok: false, message: stT('st_alert_max_files') };
    }

    return { ok: true };
  }

  function validateScreenshotFile(file) {
    if (!file) return stT('st_alert_invalid_type');
    var ext = getScreenshotExtension(file.name);
    if (ALLOWED_SCREENSHOT_EXTENSIONS.indexOf(ext) < 0) {
      return stT('st_alert_invalid_type');
    }
    if (file.size > MAX_SCREENSHOT_SIZE) {
      return stT('st_alert_file_size');
    }
    return '';
  }

  function buildScreenshotStoragePath(userId, originalName) {
    var safeName = String(originalName || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    return userId + '_' + Date.now() + '_' + safeName;
  }

  function isScreenshotPublicUrl(url) {
    if (!url) return false;
    return /\/storage\/v1\/object\/public\/screenshots\//i.test(String(url));
  }

  function buildScreenshotPublicUrl(storagePath) {
    if (!storagePath) return '';

    var path = String(storagePath).replace(/^\/+/, '');
    if (window.supabase && window.supabase.storage) {
      var urlResult = window.supabase.storage.from(SCREENSHOTS_BUCKET).getPublicUrl(path);
      var publicUrl = urlResult.data && urlResult.data.publicUrl;
      if (publicUrl && isScreenshotPublicUrl(publicUrl)) {
        return publicUrl;
      }
    }

    var baseUrl = window.SUPABASE_URL || '';
    if (!baseUrl) return '';
    return baseUrl.replace(/\/$/, '') + '/storage/v1/object/public/' + SCREENSHOTS_BUCKET + '/' + path;
  }

  function normalizeScreenshotPublicUrl(value) {
    if (!value) return '';
    var str = String(value).trim();
    if (!str) return '';

    if (/^https?:\/\//i.test(str)) {
      return isScreenshotPublicUrl(str) ? str : '';
    }

    return buildScreenshotPublicUrl(str);
  }

  async function uploadScreenshotFile(file) {
    if (!window.supabase) {
      alert(stT('st_alert_upload_fail') + 'Supabase unavailable');
      return null;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(stT('st_alert_login'));
      return null;
    }

    var storagePath = buildScreenshotStoragePath(userId, file.name);
    var uploadResult = await window.supabase.storage
      .from(SCREENSHOTS_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type || undefined,
        upsert: false
      });

    if (uploadResult.error) {
      alert(stT('st_alert_upload_fail') + uploadResult.error.message);
      return null;
    }

    var uploadedPath = (uploadResult.data && uploadResult.data.path) || storagePath;
    var publicUrl = buildScreenshotPublicUrl(uploadedPath);
    if (!publicUrl || !isScreenshotPublicUrl(publicUrl)) {
      alert(stT('st_alert_upload_fail') + 'Invalid public URL');
      return null;
    }

    return {
      name: file.name,
      url: publicUrl,
      path: uploadedPath
    };
  }

  function renderFileList() {
    var listEl = document.getElementById('st-file-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    uploadedFiles.forEach(function (item, index) {
      var displayName = item.name || item.url || '';
      var li = document.createElement('li');
      li.className = 'submit-task-file-item';
      li.innerHTML =
        '<span class="st-file-name">' + escapeHtml(displayName) + '</span>' +
        '<button type="button" class="st-file-delete" data-index="' + index + '" aria-label="Delete">&times;</button>';
      listEl.appendChild(li);
    });

    listEl.querySelectorAll('.st-file-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= uploadedFiles.length) return;
        uploadedFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }

  function getRouteName() {
    var hash = window.location.hash.replace(/^#/, '') || 'home';
    return hash.split('?')[0] || 'home';
  }

  function ensureSubmitPageStructure() {
    var page = document.getElementById('submit-task-page');
    if (!page || !SUBMIT_PAGE_HTML) return;
    if (!document.getElementById('st-description') || !document.querySelector('#st-waiting-section .st-waiting-icon')) {
      page.innerHTML = SUBMIT_PAGE_HTML;
      submitTaskInitialized = false;
    }
  }

  function loadSubmitContext() {
    var taskId = sessionStorage.getItem('currentTaskId');
    var title = sessionStorage.getItem('currentTaskTitle');
    var reward = sessionStorage.getItem('currentTaskReward');

    if (taskId) {
      return {
        taskId: taskId,
        title: title || '',
        reward: reward != null ? reward : '0'
      };
    }

    var raw = sessionStorage.getItem(SUBMISSION_STORAGE_KEY);
    if (!raw) return null;
    try {
      var legacy = JSON.parse(raw);
      if (legacy && legacy.taskId) {
        return {
          taskId: legacy.taskId,
          title: legacy.title || '',
          reward: legacy.reward != null ? String(legacy.reward) : '0'
        };
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function formatRewardDisplay(reward) {
    var n = Number(reward) || 0;
    return n.toLocaleString('en-US') + ' CRLM';
  }

  function getRejectionReason(submission) {
    if (!submission) return '';
    return submission.review_comment || '';
  }

  function isSubmissionWaitingReview(submission) {
    if (!submission) return false;
    if (submission.status === 'submitted' || submission.status === 'approved') return true;
    if (submission.status === 'pending' && submission.submitted_at) return true;
    return false;
  }

  function isSubmissionReadyToSubmit(submission) {
    if (!submission) return false;
    if (submission.status === 'claimed') return true;
    if (submission.status === 'pending' && !submission.submitted_at) return true;
    if (submission.status === 'rejected') return true;
    return false;
  }

  async function resubmitRegularTaskProof(params) {
    params = params || {};

    var taskId = params.taskId;
    var userId = params.userId;
    var description = params.description != null ? String(params.description).trim() : '';
    var screenshotUrls = params.screenshotUrls || [];
    var submission = params.submission;
    var taskTitle = params.taskTitle || '';
    var taskReward = params.taskReward != null ? Number(params.taskReward) : 0;
    var path = params.path || 'resubmit-regular-task-proof';

    if (!window.supabase || !taskId || !userId || !submission || !submission.id) {
      return { ok: false, error: 'missing_params' };
    }

    var proofType = params.proofType || 'screenshot';

    if (submission.status !== 'rejected') {
      return { ok: false, error: 'not_rejected' };
    }

    if (proofType === 'text') {
      if (!description) {
        return { ok: false, error: 'description_required' };
      }
    } else if (!screenshotUrls.length) {
      return { ok: false, error: 'screenshot_required' };
    }

    if (!description) {
      description = '（重新提交凭证）';
    }

    if (typeof window.coinrealmCheckTaskRewardDuplicate === 'function') {
      var duplicate = await window.coinrealmCheckTaskRewardDuplicate(taskId, userId);
      if (duplicate.alreadyRewarded) {
        return { ok: false, error: 'already_rewarded' };
      }
    } else if (typeof checkUserAlreadyRewardedForTask === 'function' &&
        await checkUserAlreadyRewardedForTask(taskId, userId)) {
      return { ok: false, error: 'already_rewarded' };
    }

    var submittedAt = new Date().toISOString();
    var updateResult = await window.supabase
      .from('submissions')
      .update({
        description: description,
        screenshot_urls: screenshotUrls,
        status: 'submitted',
        submitted_at: submittedAt,
        review_comment: null,
        reviewed_at: null
      })
      .eq('id', submission.id)
      .eq('user_id', userId)
      .eq('status', 'rejected')
      .select();

    if (updateResult.error) {
      return { ok: false, error: updateResult.error.message };
    }

    if (!updateResult.data || !updateResult.data.length) {
      return { ok: false, error: 'update_failed' };
    }

    var updatedSubmission = Object.assign({}, submission, updateResult.data[0]);

    writeBroadcast({
      user_id: userId,
      event_type: 'task_submit',
      description: '重新提交了任务「' + buildTaskBroadcastTitle(taskTitle || '任务') + '」凭证',
      reward_amount: taskReward
    });

    if (typeof window.coinrealmNotifyPendingReview === 'function') {
      try {
        await window.coinrealmNotifyPendingReview({
          taskId: taskId,
          publisherId: null
        });
      } catch (pendingNotifErr) {
        console.warn('待审核通知调用失败：', pendingNotifErr);
      }
    }

    if (typeof window.coinrealmNotifySubmissionStatusChanged === 'function') {
      window.coinrealmNotifySubmissionStatusChanged({
        taskId: taskId,
        userId: userId,
        status: 'submitted',
        path: path,
        submissionId: submission.id
      });
    }

    return {
      ok: true,
      submissionStatus: 'submitted',
      submission: updatedSubmission,
      isSimpleAuto: false
    };
  }

  window.coinrealmResubmitRegularTaskProof = resubmitRegularTaskProof;

  async function handleFilesSelected(fileList) {
    if (uploadInProgress) return;

    var files = Array.from(fileList || []);
    if (!files.length) return;

    var remaining = MAX_SCREENSHOT_FILES - uploadedFiles.length;
    if (remaining <= 0) {
      alert(stT('st_alert_max_files'));
      return;
    }

    if (files.length > remaining) {
      alert(stT('st_alert_max_files'));
      files = files.slice(0, remaining);
    }

    uploadInProgress = true;
    var uploadZone = document.getElementById('st-upload-zone');

    try {
      for (var i = 0; i < files.length; i++) {
        if (uploadedFiles.length >= MAX_SCREENSHOT_FILES) {
          alert(stT('st_alert_max_files'));
          break;
        }

        var file = files[i];
        var validationError = validateScreenshotFile(file);
        if (validationError) {
          alert(validationError);
          continue;
        }

        if (uploadZone) uploadZone.classList.add('st-uploading');
        var uploaded = await uploadScreenshotFile(file);
        if (uploaded) {
          uploadedFiles.push(uploaded);
          renderFileList();
        }
      }
    } finally {
      uploadInProgress = false;
      if (uploadZone) uploadZone.classList.remove('st-uploading');
    }
  }

  function applySubmitTaskI18n() {
    document.querySelectorAll('#submit-task-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (submitTaskTranslations[getLang()][key]) {
        el.textContent = stT(key);
      }
    });

    document.querySelectorAll('#submit-task-page [data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (submitTaskTranslations[getLang()][key]) {
        el.setAttribute('placeholder', stT(key));
      }
    });

    updatePageStateUI();
  }

  function updatePageStateUI() {
    var pageTitle = document.getElementById('st-page-title');
    var formSection = document.getElementById('st-form-section');
    var waitingSection = document.getElementById('st-waiting-section');
    var summaryCard = document.querySelector('#submit-task-page .submit-task-summary-card');
    var submitBtn = document.getElementById('st-submit-btn');
    var actionBar = document.querySelector('#submit-task-page .submit-task-action-bar');

    if (submitState === 'no_task') {
      if (pageTitle) pageTitle.textContent = stT('st_title_submit');
      if (summaryCard) summaryCard.classList.add('hidden');
      if (formSection) formSection.classList.add('hidden');
      if (waitingSection) waitingSection.classList.remove('hidden');
      if (actionBar) actionBar.classList.add('hidden');
      return;
    }

    if (summaryCard) summaryCard.classList.remove('hidden');
    if (actionBar) actionBar.classList.remove('hidden');

    if (submitState === 'completed') {
      if (pageTitle) pageTitle.textContent = stT('st_title_completed');
      if (formSection) formSection.classList.add('hidden');
      if (waitingSection) {
        waitingSection.classList.remove('hidden');
        waitingSection.innerHTML =
          '<p class="st-waiting-text">' + stT('st_completed_text') + '</p>' +
          '<button type="button" id="st-back-home-btn" class="st-action-btn st-btn-disabled" disabled>' + stT('st_btn_completed') + '</button>';
      }
      if (submitBtn) submitBtn.classList.add('hidden');
      return;
    }

    if (submitState === 'waiting') {
      if (pageTitle) pageTitle.textContent = stT('st_title_waiting');
      if (formSection) formSection.classList.add('hidden');
      if (waitingSection) waitingSection.classList.remove('hidden');
      if (submitBtn) {
        submitBtn.classList.remove('hidden');
        submitBtn.textContent = stT('st_btn_submitted');
        submitBtn.classList.remove('st-btn-gold');
        submitBtn.classList.add('st-btn-disabled');
        submitBtn.disabled = true;
      }
    } else {
      if (pageTitle) pageTitle.textContent = stT('st_title_submit');
      if (formSection) formSection.classList.remove('hidden');
      if (waitingSection) waitingSection.classList.add('hidden');
      if (submitBtn) {
        submitBtn.classList.remove('hidden');
        submitBtn.textContent = stT('st_btn_submit');
        submitBtn.classList.remove('st-btn-disabled');
        submitBtn.classList.add('st-btn-gold');
        submitBtn.disabled = false;
      }
    }
  }

  function showNoTaskEmptyState() {
    submitState = 'no_task';
    var waitingSection = document.getElementById('st-waiting-section');
    if (waitingSection) {
      waitingSection.innerHTML =
        '<p class="st-waiting-text">' + stT('st_alert_no_task') + '</p>' +
        '<button type="button" id="st-back-home-btn" class="st-action-btn st-btn-gold">' + stT('st_btn_back_home') + '</button>';
      var backBtn = document.getElementById('st-back-home-btn');
      if (backBtn) {
        backBtn.addEventListener('click', function () {
          window.location.hash = 'home';
        });
      }
    }
    updatePageStateUI();
  }

  function renderRejectionBanner(submission) {
    var existing = document.getElementById('st-rejection-banner');
    if (existing) existing.remove();

    var reason = getRejectionReason(submission);
    if (!reason) return;

    var formSection = document.getElementById('st-form-section');
    if (!formSection) return;

    var banner = document.createElement('div');
    banner.id = 'st-rejection-banner';
    banner.className = 'submit-task-field';
    banner.innerHTML =
      '<p style="color:#ff4d4f;margin-bottom:12px;line-height:1.5;">' +
      '<strong>' + stT('st_reject_title') + '</strong> ' +
      escapeHtml(reason) +
      '</p>';
    formSection.insertBefore(banner, formSection.firstChild);
  }

  function applyProofTypeUi() {
    var proofType = (activeSubmitContext && activeSubmitContext.proofType) || 'screenshot';
    var isTextProof = proofType === 'text';
    var descEl = document.getElementById('st-description');
    var descField = descEl ? descEl.closest('.submit-task-field') : null;
    var uploadField = document.getElementById('st-upload-zone')
      ? document.getElementById('st-upload-zone').closest('.submit-task-field')
      : null;

    if (descField) descField.classList.toggle('hidden', !isTextProof);
    if (uploadField) uploadField.classList.toggle('hidden', isTextProof);

    if (descEl && isTextProof) {
      descEl.placeholder = activeSubmitContext.proofPlaceholder || stT('st_ph_desc');
    }
  }

  function renderSummaryCard() {
    var titleEl = document.getElementById('st-task-title');
    var rewardEl = document.getElementById('st-task-reward');

    if (!activeSubmitContext) return;

    if (titleEl) titleEl.textContent = activeSubmitContext.title || '';
    if (rewardEl) rewardEl.textContent = formatRewardDisplay(activeSubmitContext.reward);
  }

  async function syncSubmitPageState() {
    ensureSubmitPageStructure();

    activeSubmitContext = loadSubmitContext();
    currentSubmissionRecord = null;

    if (!activeSubmitContext || !activeSubmitContext.taskId) {
      showNoTaskEmptyState();
      return true;
    }

    if (!window.supabase) {
      showNoTaskEmptyState();
      return true;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      showNoTaskEmptyState();
      return true;
    }

    if (typeof window.coinrealmCheckUserAlreadyRewardedForTask === 'function' &&
        await window.coinrealmCheckUserAlreadyRewardedForTask(activeSubmitContext.taskId, userId)) {
      console.log('提交页：用户已完成该任务', { taskId: activeSubmitContext.taskId, userId: userId });
      currentSubmissionRecord = typeof window.coinrealmLoadUserSubmissionForTask === 'function'
        ? await window.coinrealmLoadUserSubmissionForTask(activeSubmitContext.taskId, userId)
        : null;
      submitState = 'completed';
      renderSummaryCard();
      updatePageStateUI();
      applySubmitTaskI18n();
      return true;
    }

    var submissionRecord = null;
    if (typeof window.coinrealmLoadUserSubmissionForTask === 'function') {
      submissionRecord = await window.coinrealmLoadUserSubmissionForTask(activeSubmitContext.taskId, userId);
    } else {
      var submissionResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls, claimed_at')
        .eq('task_id', activeSubmitContext.taskId)
        .eq('user_id', userId)
        .order('reviewed_at', { ascending: false })
        .limit(10);

      console.log('提交页加载提交记录：', submissionResult);

      if (submissionResult.error) {
        alert(stT('st_alert_submit_fail') + submissionResult.error.message);
        return false;
      }

      submissionRecord = submissionResult.data && submissionResult.data.length ? submissionResult.data[0] : null;
    }

    if (!submissionRecord) {
      showNoTaskEmptyState();
      return true;
    }

    currentSubmissionRecord = submissionRecord;
    activeSubmitContext.submissionId = submissionRecord.id;

    try {
      var taskResult = await window.supabase
        .from('tasks')
        .select('proof_type, requirements')
        .eq('id', activeSubmitContext.taskId)
        .maybeSingle();

      if (!taskResult.error && taskResult.data) {
        activeSubmitContext.proofType = String(taskResult.data.proof_type || 'screenshot').toLowerCase() === 'text'
          ? 'text'
          : 'screenshot';
        var requirements = taskResult.data.requirements;
        if (Array.isArray(requirements) && requirements[0]) {
          activeSubmitContext.proofPlaceholder = String(requirements[0]);
        } else if (typeof requirements === 'string' && requirements.trim()) {
          activeSubmitContext.proofPlaceholder = requirements.split('\n').map(function (s) { return s.trim(); }).filter(Boolean)[0] || '';
        }
      } else {
        activeSubmitContext.proofType = 'screenshot';
      }
    } catch (taskErr) {
      activeSubmitContext.proofType = 'screenshot';
    }

    applyProofTypeUi();

    if (submissionRecord.status === 'approved') {
      console.log('提交页：提交记录已是 approved', submissionRecord);
      submitState = 'completed';
    } else if (isSubmissionWaitingReview(submissionRecord)) {
      submitState = 'waiting';
    } else if (isSubmissionReadyToSubmit(submissionRecord)) {
      submitState = 'form';
    } else if (submissionRecord.status === 'rejected') {
      submitState = 'rejected';
    } else {
      submitState = 'form';
    }

    return true;
  }

  function initSubmitTaskEvents() {
    if (submitTaskInitialized) return;
    submitTaskInitialized = true;

    var uploadZone = document.getElementById('st-upload-zone');
    var fileInput = document.getElementById('st-file-input');

    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', function () {
        fileInput.click();
      });

      uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadZone.style.borderColor = '#f0b90b';
      });

      uploadZone.addEventListener('dragleave', function () {
        uploadZone.style.borderColor = '';
      });

      uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        if (e.dataTransfer && e.dataTransfer.files) {
          handleFilesSelected(e.dataTransfer.files);
        }
      });

      fileInput.addEventListener('change', function () {
        if (fileInput.files && fileInput.files.length) {
          handleFilesSelected(fileInput.files);
        }
        fileInput.value = '';
      });
    }

    var submitBtn = document.getElementById('st-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async function () {
        if (submitState === 'waiting' || submitState === 'no_task' || submitState === 'completed') return;

        var descEl = document.getElementById('st-description');
        var desc = descEl ? descEl.value.trim() : '';
        var proofType = (activeSubmitContext && activeSubmitContext.proofType) || 'screenshot';
        var proofValidation = validateSubmitProofInputs(proofType, desc, uploadedFiles.length);
        if (!proofValidation.ok) {
          alert(proofValidation.message);
          return;
        }

        if (!window.supabase) {
          alert(stT('st_alert_login'));
          return;
        }

        if (!activeSubmitContext || !activeSubmitContext.taskId) {
          showNoTaskEmptyState();
          return;
        }

        var userId = await getAuthenticatedUserId();
        if (!userId) {
          alert('请先登录');
          return;
        }

        submitBtn.disabled = true;

        try {
          if (typeof window.coinrealmCheckTaskRewardDuplicate === 'function') {
            var preSubmitDuplicate = await window.coinrealmCheckTaskRewardDuplicate(activeSubmitContext.taskId, userId);
            if (preSubmitDuplicate.alreadyRewarded) {
              console.log('提交前防重复检查：用户已有 approved 记录', {
                taskId: activeSubmitContext.taskId,
                userId: userId
              });
              alert('您已完成该任务，无需重复提交');
              submitState = 'completed';
              updatePageStateUI();
              return;
            }
          }

          if (currentSubmissionRecord && currentSubmissionRecord.status === 'approved') {
            console.log('提交前防重复检查：当前提交已是 approved', currentSubmissionRecord);
            alert(stT('st_alert_already_rewarded'));
            return;
          }

          if (currentSubmissionRecord && currentSubmissionRecord.status === 'submitted') {
            console.log('提交前防重复检查：当前提交已是 submitted，禁止重复提交', {
              taskId: activeSubmitContext.taskId,
              userId: userId,
              submissionId: currentSubmissionRecord.id,
              status: 'submitted'
            });
            submitState = 'waiting';
            updatePageStateUI();
            return;
          }

          var approvedCheck = await window.supabase
            .from('submissions')
            .select('id')
            .eq('task_id', activeSubmitContext.taskId)
            .eq('user_id', userId)
            .eq('status', 'approved');

          console.log('提交前防重复检查：', approvedCheck);

          if (!approvedCheck.error && approvedCheck.data && approvedCheck.data.length > 0) {
            console.log('提交前防重复检查：submissions 已有 approved 记录', approvedCheck.data);
            alert('您已完成该任务，无需重复提交');
            submitState = 'completed';
            updatePageStateUI();
            return;
          }

          console.log('[Submit] ===== 开始提交凭证 =====');
          console.log('[Submit] 当前用户ID:', userId);
          console.log('[Submit] 任务ID:', activeSubmitContext.taskId);
          console.log('[Submit] 当前提交记录:', currentSubmissionRecord ? JSON.stringify(currentSubmissionRecord) : 'null');
          console.log('[Submit] 提交记录是否存在:', !!currentSubmissionRecord);
          console.log('[Submit] 提交记录状态:', currentSubmissionRecord ? currentSubmissionRecord.status : 'N/A');

          var targetSubmission = currentSubmissionRecord;
          if (!targetSubmission || String(targetSubmission.task_id) !== String(activeSubmitContext.taskId)) {
            if (typeof window.coinrealmLoadUserSubmissionForTask === 'function') {
              targetSubmission = await window.coinrealmLoadUserSubmissionForTask(activeSubmitContext.taskId, userId);
            } else {
              var fallbackResult = await window.supabase
                .from('submissions')
                .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls, claimed_at')
                .eq('task_id', activeSubmitContext.taskId)
                .eq('user_id', userId)
                .order('submitted_at', { ascending: false })
                .limit(1);
              targetSubmission = fallbackResult.data && fallbackResult.data.length ? fallbackResult.data[0] : null;
            }
          }

          if (!targetSubmission) {
            if (typeof window.coinrealmCheckUserAlreadyRewardedForTask === 'function' &&
                await window.coinrealmCheckUserAlreadyRewardedForTask(activeSubmitContext.taskId, userId)) {
              alert(stT('st_alert_already_rewarded'));
              submitState = 'completed';
              updatePageStateUI();
              return;
            }
            alert(stT('st_alert_no_task'));
            return;
          }

          if (targetSubmission.status === 'approved') {
            console.log('[Submit] 条件判断：已通过审核，禁止重复提交');
            alert(stT('st_alert_already_rewarded'));
            submitState = 'completed';
            updatePageStateUI();
            return;
          }

          if (targetSubmission.status === 'submitted') {
            console.log('[Submit] 条件判断：已提交等待审核，禁止重复提交');
            console.log('[Submit]   - taskId:', activeSubmitContext.taskId);
            console.log('[Submit]   - userId:', userId);
            console.log('[Submit]   - submissionId:', targetSubmission.id);
            currentSubmissionRecord = targetSubmission;
            submitState = 'waiting';
            updatePageStateUI();
            return;
          }

          console.log('[Submit] 条件判断：isSubmissionReadyToSubmit()', isSubmissionReadyToSubmit(targetSubmission));
          console.log('[Submit] 条件判断：isSubmissionWaitingReview()', isSubmissionWaitingReview(targetSubmission));

          if (!isSubmissionReadyToSubmit(targetSubmission)) {
            console.log('[Submit] 当前状态不可提交，原因：');
            console.log('[Submit]   - submission.status:', targetSubmission.status);
            console.log('[Submit]   - submission.submitted_at:', targetSubmission.submitted_at);
            console.log('[Submit]   - 是否等待审核:', isSubmissionWaitingReview(targetSubmission));
            if (isSubmissionWaitingReview(targetSubmission)) {
              submitState = 'waiting';
              currentSubmissionRecord = targetSubmission;
              updatePageStateUI();
            }
            return;
          }

          var screenshotUrls = uploadedFiles.map(function (item) {
            return normalizeScreenshotPublicUrl(item.url || item.path);
          }).filter(function (url) {
            return !!url && isScreenshotPublicUrl(url);
          });

          if (proofType === 'screenshot' && !screenshotUrls.length) {
            console.log('[Submit] 条件判断：截图类型但没有上传截图');
            alert(stT('st_alert_need_image') || '请至少上传一张截图');
            return;
          }

          var submitResult;
          console.log('[Submit] 条件判断：targetSubmission.status === "rejected"', targetSubmission.status === 'rejected');
          console.log('[Submit] 条件判断：window.coinrealmSubmitTaskProof 存在', typeof window.coinrealmSubmitTaskProof === 'function');

          if (targetSubmission.status === 'rejected') {
            console.log('[Submit] 执行重新提交逻辑');
            submitResult = await resubmitRegularTaskProof({
              taskId: activeSubmitContext.taskId,
              userId: userId,
              description: desc,
              screenshotUrls: screenshotUrls,
              submission: targetSubmission,
              taskTitle: activeSubmitContext.title || '',
              taskReward: activeSubmitContext.reward || 0,
              proofType: proofType,
              path: 'submit-task-page-resubmit'
            });
          } else if (typeof window.coinrealmSubmitTaskProof === 'function') {
            console.log('[Submit] 执行首次提交逻辑');
            submitResult = await window.coinrealmSubmitTaskProof({
              taskId: activeSubmitContext.taskId,
              userId: userId,
              description: desc,
              screenshotUrls: screenshotUrls,
              submission: targetSubmission,
              taskTitle: activeSubmitContext.title || '',
              taskReward: activeSubmitContext.reward || 0,
              requireDescription: proofType === 'text',
              proofType: proofType,
              path: 'submit-task-page'
            });
          } else {
            console.log('[Submit] 条件判断：submit unavailable - window.coinrealmSubmitTaskProof 不存在');
            alert(stT('st_alert_submit_fail') + 'submit unavailable');
            return;
          }

          if (!submitResult.ok) {
            if (submitResult.error === 'description_required') {
              alert(stT('st_alert_desc'));
              return;
            }
            if (submitResult.error === 'screenshot_required') {
              alert(stT('st_alert_need_image') || '请至少上传一张截图');
              return;
            }
            if (submitResult.error === 'already_rewarded' || submitResult.error === 'already_approved') {
              alert(stT('st_alert_already_rewarded'));
              submitState = 'completed';
              updatePageStateUI();
              return;
            }
            if (submitResult.error === 'already_submitted' || submitResult.error === 'waiting_review') {
              currentSubmissionRecord = targetSubmission;
              submitState = 'waiting';
              updatePageStateUI();
              return;
            }
            alert(stT('st_alert_submit_fail') + (submitResult.error || 'unknown'));
            return;
          }

          currentSubmissionRecord = submitResult.submission;
          submitState = submitResult.isSimpleAuto ? 'completed' : 'waiting';
          if (!submitResult.isSimpleAuto && submitResult.submissionStatus === 'submitted') {
            try {
              if (typeof window.coinrealmNotifyPendingReview === 'function') {
                await window.coinrealmNotifyPendingReview({
                  taskId: activeSubmitContext.taskId,
                  publisherId: null
                });
              }
            } catch (pendingNotifErr) {
              console.warn('待审核通知调用失败：', pendingNotifErr);
            }
          }
          uploadedFiles = [];
          renderFileList();
          updatePageStateUI();
          applySubmitTaskI18n();
        } finally {
          if (submitBtn) {
            submitBtn.disabled = submitState === 'waiting';
          }
        }
      });
    }
  }

  async function renderSubmitTaskPage() {
    var ok = await syncSubmitPageState();
    if (!ok) return;

    if (submitState === 'no_task') {
      applySubmitTaskI18n();
      return;
    }

    renderSummaryCard();

    if (submitState === 'rejected') {
      renderRejectionBanner(currentSubmissionRecord);
    }

    initSubmitTaskEvents();
    applySubmitTaskI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      submitTaskInitialized = false;
      submitState = 'form';
      uploadedFiles = [];
      activeSubmitContext = null;
      currentSubmissionRecord = null;
    }
  }

  function handleSubmitTaskRoute() {
    restoreAppContentIfNeeded();

    var route = getRouteName();
    var submitTaskPage = document.getElementById('submit-task-page');

    if (submitTaskPage) {
      if (route === 'submit-task') {
        submitTaskPage.classList.remove('hidden');
        renderSubmitTaskPage();
      } else {
        submitTaskPage.classList.add('hidden');
      }
    }
  }

  window.addEventListener('hashchange', handleSubmitTaskRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleSubmitTaskRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleSubmitTaskRoute, 0);
    });
  }
})();

