// ==========================================
// 5. 任务详情页 (#task-detail) — 任务卡 #003
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var SUBMISSION_STORAGE_KEY = 'coinrealm_active_submission';
  var taskDetailInitialized = false;
  var taskDetailImageLightboxInitialized = false;
  var currentTaskRecord = null;
  var currentPublisherRecord = null;
  var currentSubmissionRecord = null;
  var currentUserId = null;
  var detailActionState = 'loading';
  var twitterClaimInProgress = false;
  var twitterVerifyInProgress = false;
  var twitterPendingAutoVerify = false;
  var taskDetailVisibilityBound = false;
  var activeSubtaskKey = null;
  var activeSubtaskIndex = null;
  var subtaskUiState = {};
  var subtaskFailReasons = {};
  var subtaskVerifyInProgress = false;
  var verifyPanelActive = false;
  var verifySubtaskIndex = null;
  var verifyScreenshotFile = null;
  var verifyScreenshotPreviewUrl = '';
  var verifyScreenshotPublicUrl = '';
  var verifySubmitting = false;
  var verifyPanelSuccess = false;
  var verifyPanelInitialized = false;
  var proofUploadFiles = [];
  var proofUploadInProgress = false;
  var proofUploadInitialized = false;
  var proofSubmitInProgress = false;
  var MAX_PROOF_SCREENSHOT_FILES = 3;
  var SUBTASK_PROGRESS_PREFIX = 'coinrealm_subtask_done';

  var taskDetailTranslations = {
    zh: {
      td_official_badge: '官方认证',
      td_desc_title: '任务描述',
      td_desc_empty: '暂无任务描述',
      td_images_title: '任务图片',
      td_req_title: '任务要求',
      td_req_empty: '暂无任务要求',
      td_slots_label: '剩余名额',
      td_deadline_label: '截止时间',
      td_staked_label: '发布者已质押',
      td_pin_title: '推广此任务',
      td_pin_not_pinned: '未置顶',
      td_pin_pinned: '已置顶，剩余 {days} 天',
      td_pin_1d: '1天',
      td_pin_7d: '7天',
      td_pin_30d: '30天',
      td_pin_disclaimer: '置顶后展示在首页用户置顶区。如任务被官方下架，置顶费不退。',
      td_high_risk: '⚠️ 高风险任务',
      td_risk_title: '⚠️ 风险提示',
      td_risk_content: 'CoinRealm 不对该任务的真实性做背书。请自行判断项目风险，切勿投入超出你承受能力的资金。如任务要求转账、提供私钥或助记词，请立即举报。',
      td_report_btn: '⚠ 举报',
      td_report_title: '举报任务',
      td_report_reason_label: '举报原因',
      td_report_desc_label: '补充说明（选填）',
      td_report_desc_ph: '请补充说明（选填）',
      td_report_submit: '提交举报',
      td_report_cancel: '取消',
      td_report_reason_fake: '虚假任务',
      td_report_reason_scam: '诈骗/钓鱼',
      td_report_reason_illegal: '内容违规',
      td_report_reason_impossible: '任务无法完成',
      td_report_reason_no_review: '发布者不审核',
      td_report_reason_other: '其他',
      td_report_login: '请先登录后再举报',
      td_report_own: '不能举报自己发布的任务',
      td_report_need_reason: '请选择举报原因',
      td_report_success: '举报已提交，平台将在24小时内处理',
      td_report_fail: '举报提交失败：',
      td_report_already: '你已举报过该任务，请等待平台处理',
      td_report_no_table: '举报功能尚未初始化，请联系管理员在数据库创建 reports 表：\n\nCREATE TABLE IF NOT EXISTS reports (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  task_id UUID REFERENCES tasks(id),\n  reporter_id UUID REFERENCES users(id),\n  reason TEXT NOT NULL,\n  description TEXT,\n  status TEXT DEFAULT \'pending\',\n  reviewed_at TIMESTAMPTZ,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);',
      td_btn_claim: '领取任务',
      td_btn_claim_now: '立即领取',
      td_btn_simple_claim: '一键领取',
      td_btn_go_twitter: '前往 Twitter 完成任务',
      td_btn_waiting_action: '等待操作...',
      td_btn_submit_task: '提交任务',
      td_btn_subtasks_remaining: '还有 {count} 项未完成',
      td_subtasks_title: '任务步骤',
      td_subtask_follow: '关注 {user}',
      td_subtask_like: '点赞推文',
      td_subtask_reply: '评论推文',
      td_subtask_reply_keyword: '评论推文（关键词：{keyword}）',
      td_subtask_go: '去完成',
      td_subtask_verifying: '验证中...',
      td_subtask_retry: '重新验证',
      td_subtask_fail_hint: '验证未通过',
      td_subtask_done: '✓ 已完成',
      td_verify_title: '提交验证',
      td_verify_step_upload: '上传截图',
      td_verify_step_submit: '确认提交',
      td_verify_upload_main: '点击上传截图',
      td_verify_step_follow: '关注 {user} 后，截图你的关注列表',
      td_verify_hint_follow: '请截取包含目标账号 {user} 的关注列表页面',
      td_verify_label_follow: '请确认截图中包含的目标账号',
      td_verify_ph_follow: '如 {user}',
      td_verify_empty_follow: '请输入目标账号',
      td_verify_step_like: '点赞推文后，截图你的点赞记录',
      td_verify_hint_like: '请截取包含目标推文的点赞页面',
      td_verify_label_like: '请确认截图中包含的推文链接',
      td_verify_ph_like: '如 https://twitter.com/xxx/status/123',
      td_verify_empty_like: '请输入推文链接',
      td_verify_step_reply: '评论推文后，截图你的评论内容',
      td_verify_hint_reply: '请截取包含你的评论内容的页面',
      td_verify_label_reply: '请确认你的评论中包含的关键词',
      td_verify_ph_reply: '如 {keyword}',
      td_verify_empty_reply: '请输入关键词',
      td_verify_confirm_hint: '系统将自动比对您填写的内容与任务目标是否一致',
      td_verify_reupload: '重新上传',
      td_verify_submit: '提交验证',
      td_verify_submit_done: '✓ 验证通过',
      td_verify_success: '✓ 验证通过！奖励已到账',
      td_verify_alert_no_screenshot: '请先上传截图',
      td_verify_alert_no_confirm: '请填写确认信息',
      td_verify_alert_mismatch: '信息不匹配，请确认后重新输入',
      td_verify_alert_upload_fail: '上传失败：',
      td_btn_simple_done: '✓ 已完成',
      td_btn_simple_verifying: '验证中...',
      td_btn_simple_checking: '正在验证...',
      td_btn_simple_retry: '重新验证',
      td_btn_submit: '去提交',
      td_btn_manage: '管理任务',
      td_btn_login: '请先登录',
      td_btn_waiting: '已提交，等待审核',
      td_proof_title: '提交凭证',
      td_proof_upload_main: '📷 点击上传截图',
      td_proof_upload_hint: '支持 JPG、PNG、WebP，单张不超过 5MB，最多 3 张',
      td_proof_submit: '提交凭证',
      td_proof_submitted: '已提交',
      td_proof_waiting: '已提交，等待审核',
      td_proof_alert_max_files: '最多上传 3 张截图',
      td_proof_alert_upload_fail: '上传失败：',
      td_proof_alert_submit_fail: '提交失败：',
      td_proof_alert_need_image: '请至少上传一张截图',
      td_proof_alert_need_text: '请填写发布者要求的信息',
      td_proof_ph_default: '请填写发布者要求的信息',
      td_reject_reason_label: '驳回理由：',
      td_btn_approved: '已通过',
      td_btn_rejected: '重新提交',
      td_btn_level: '等级不足（需Lv.1以上）',
      td_btn_ended: '已结束',
      td_completion_rate: '{rate}% 完成率',
      td_published_count: '已发布 {count} 个任务',
      td_level_master: '大师',
      td_deadline: '{days}天后 ({date})',
      td_staked: '已质押 {total} CRLM（奖励{reward} + 押金{deposit}）',
      td_staked_simple: '已质押 {total} CRLM',
      td_type_official: '官方',
      td_type_airdrop: '空投',
      td_type_register: '注册',
      td_type_trade: '交易',
      td_type_game: '游戏',
      td_type_content: '内容',
      td_type_test: '测试',
      td_type_other: '其他',
      td_type_all: '全部',
      td_alert_claim_ok: '领取成功！',
      td_alert_simple_claim_ok: '领取成功！请按照任务要求完成操作。',
      td_alert_twitter_launch: '即将跳转到 Twitter，请完成关注/点赞/转发后返回此页面。',
      td_alert_twitter_redirect: '请点击按钮前往 Twitter 完成任务。完成后回到此页面，系统将自动验证。',
      td_alert_twitter_verified: '验证通过！奖励已到账。',
      td_alert_twitter_not_verified: '暂未检测到操作，请确认已完成后再试。',
      td_alert_twitter_no_link: '任务未配置 Twitter 链接，请联系发布者。',
      td_alert_telegram_no_link: '任务未配置 Telegram 链接，请联系发布者。',
      td_alert_telegram_verified: '验证通过！奖励已到账。',
      td_alert_discord_no_link: '任务未配置 Discord 邀请链接，请联系发布者。',
      td_alert_discord_verified: '验证通过！奖励已到账。',
      td_subtask_tg_join: '加入群组',
      td_subtask_tg_follow: '关注频道',
      td_subtask_tg_message: '发送消息',
      td_subtask_tg_message_kw: '发送消息（关键词：{keyword}）',
      td_subtask_dc_join: '加入服务器',
      td_subtask_dc_message: '发送消息',
      td_subtask_dc_message_kw: '发送消息（关键词：{keyword}）',
      td_alert_simple_verifying: '任务已领取，正在验证中...',
      td_alert_claim_fail: '领取失败：',
      td_alert_already_claimed: '您已经领取过该任务',
      td_alert_task_full: '任务名额已满',
      td_alert_login: '请先登录后再领取任务',
      td_twitter_bind_title: '请先绑定你的 Twitter 账号',
      td_twitter_bind_desc: '验证任务需要你的 Twitter 账号信息',
      td_twitter_bind_ph: '请输入你的 Twitter 用户名（如 @testuser）',
      td_twitter_bind_confirm: '确认绑定',
      td_twitter_btn_cancel: '取消',
      td_twitter_username_required: '请输入 Twitter 用户名',
      td_twitter_username_invalid: 'Twitter 用户名格式无效（1-15 位字母、数字或下划线）',
      td_twitter_save_fail: '保存失败：'
    },
    en: {
      td_official_badge: 'Official Verified',
      td_desc_title: 'Description',
      td_desc_empty: 'No description provided',
      td_images_title: 'Task Images',
      td_req_title: 'Requirements',
      td_req_empty: 'No requirements listed',
      td_slots_label: 'Slots Left',
      td_deadline_label: 'Deadline',
      td_staked_label: 'Publisher Staked',
      td_pin_title: 'Promote This Task',
      td_pin_not_pinned: 'Not pinned',
      td_pin_pinned: 'Pinned, {days} days left',
      td_pin_1d: '1 Day',
      td_pin_7d: '7 Days',
      td_pin_30d: '30 Days',
      td_pin_disclaimer: 'Pinned tasks appear in the homepage user pin section. Pin fees are non-refundable if the task is removed by officials.',
      td_high_risk: '⚠️ High Risk Task',
      td_risk_title: '⚠️ Risk Warning',
      td_risk_content: 'CoinRealm does not endorse the authenticity of this task. Assess project risks yourself and never invest more than you can afford to lose. Report immediately if the task asks for transfers, private keys, or seed phrases.',
      td_report_btn: '⚠ Report',
      td_report_title: 'Report Task',
      td_report_reason_label: 'Reason',
      td_report_desc_label: 'Details (optional)',
      td_report_desc_ph: 'Additional details (optional)',
      td_report_submit: 'Submit Report',
      td_report_cancel: 'Cancel',
      td_report_reason_fake: 'Fake task',
      td_report_reason_scam: 'Scam / phishing',
      td_report_reason_illegal: 'Prohibited content',
      td_report_reason_impossible: 'Task cannot be completed',
      td_report_reason_no_review: 'Publisher does not review',
      td_report_reason_other: 'Other',
      td_report_login: 'Please sign in before reporting',
      td_report_own: 'You cannot report your own task',
      td_report_need_reason: 'Please select a reason',
      td_report_success: 'Report submitted. The platform will review within 24 hours.',
      td_report_fail: 'Failed to submit report: ',
      td_report_already: 'You already reported this task. Please wait for review.',
      td_report_no_table: 'Reports table is missing. Ask an admin to create it:\n\nCREATE TABLE IF NOT EXISTS reports (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  task_id UUID REFERENCES tasks(id),\n  reporter_id UUID REFERENCES users(id),\n  reason TEXT NOT NULL,\n  description TEXT,\n  status TEXT DEFAULT \'pending\',\n  reviewed_at TIMESTAMPTZ,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);',
      td_btn_claim: 'Claim Task',
      td_btn_claim_now: 'Claim Now',
      td_btn_simple_claim: 'Claim Now',
      td_btn_go_twitter: 'Go to Twitter',
      td_btn_waiting_action: 'Waiting for action...',
      td_btn_submit_task: 'Submit Task',
      td_btn_subtasks_remaining: '{count} step(s) remaining',
      td_subtasks_title: 'Task Steps',
      td_subtask_follow: 'Follow {user}',
      td_subtask_like: 'Like tweet',
      td_subtask_reply: 'Comment on tweet',
      td_subtask_reply_keyword: 'Comment on tweet (keyword: {keyword})',
      td_subtask_go: 'Go',
      td_subtask_verifying: 'Verifying...',
      td_subtask_retry: 'Retry',
      td_subtask_fail_hint: 'Verification failed',
      td_subtask_done: '✓ Done',
      td_verify_title: 'Submit Verification',
      td_verify_step_upload: 'Upload screenshot',
      td_verify_step_submit: 'Confirm submit',
      td_verify_upload_main: 'Click to upload screenshot',
      td_verify_step_follow: 'After following {user}, screenshot your following list',
      td_verify_hint_follow: 'Capture the following list page that includes {user}',
      td_verify_label_follow: 'Confirm the target account shown in your screenshot',
      td_verify_ph_follow: 'e.g. {user}',
      td_verify_empty_follow: 'Please enter the target account',
      td_verify_step_like: 'After liking the tweet, screenshot your likes page',
      td_verify_hint_like: 'Capture the likes page that includes the target tweet',
      td_verify_label_like: 'Confirm the tweet link shown in your screenshot',
      td_verify_ph_like: 'e.g. https://twitter.com/xxx/status/123',
      td_verify_empty_like: 'Please enter the tweet link',
      td_verify_step_reply: 'After commenting, screenshot your comment',
      td_verify_hint_reply: 'Capture the page that includes your comment',
      td_verify_label_reply: 'Confirm the keyword included in your comment',
      td_verify_ph_reply: 'e.g. {keyword}',
      td_verify_empty_reply: 'Please enter the keyword',
      td_verify_confirm_hint: 'We will compare your input with the task target automatically',
      td_verify_reupload: 'Re-upload',
      td_verify_submit: 'Submit Verification',
      td_verify_submit_done: '✓ Verified',
      td_verify_success: '✓ Verified! Reward credited.',
      td_verify_alert_no_screenshot: 'Please upload a screenshot first',
      td_verify_alert_no_confirm: 'Please fill in the confirmation field',
      td_verify_alert_mismatch: 'Information does not match. Please check and try again',
      td_verify_alert_upload_fail: 'Upload failed: ',
      td_btn_simple_done: '✓ Completed',
      td_btn_simple_verifying: 'Verifying...',
      td_btn_simple_checking: 'Verifying now...',
      td_btn_simple_retry: 'Verify Again',
      td_btn_submit: 'Submit Proof',
      td_btn_manage: 'Manage Task',
      td_btn_login: 'Please sign in first',
      td_btn_waiting: 'Submitted, pending review',
      td_proof_title: 'Submit Proof',
      td_proof_upload_main: '📷 Click to upload screenshots',
      td_proof_upload_hint: 'JPG, PNG, WebP supported, max 5MB each, up to 3 files',
      td_proof_submit: 'Submit Proof',
      td_proof_submitted: 'Submitted',
      td_proof_waiting: 'Submitted, pending review',
      td_proof_alert_max_files: 'Maximum 3 screenshots allowed',
      td_proof_alert_upload_fail: 'Upload failed: ',
      td_proof_alert_submit_fail: 'Submit failed: ',
      td_proof_alert_need_image: 'Please upload at least one screenshot',
      td_proof_alert_need_text: 'Please fill in the information required by the publisher',
      td_proof_ph_default: 'Please fill in the information required by the publisher',
      td_reject_reason_label: 'Rejection reason: ',
      td_btn_approved: 'Approved',
      td_btn_rejected: 'Resubmit',
      td_btn_level: 'Level Too Low (Lv.1+ required)',
      td_btn_ended: 'Ended',
      td_completion_rate: '{rate}% completion rate',
      td_published_count: '{count} tasks published',
      td_level_master: 'Master',
      td_deadline: '{days} days left ({date})',
      td_staked: 'Staked {total} CRLM (reward {reward} + deposit {deposit})',
      td_staked_simple: 'Staked {total} CRLM',
      td_type_official: 'Official',
      td_type_airdrop: 'Airdrop',
      td_type_register: 'Register',
      td_type_trade: 'Trade',
      td_type_game: 'Game',
      td_type_content: 'Content',
      td_type_test: 'Test',
      td_type_other: 'Other',
      td_type_all: 'All',
      td_alert_claim_ok: 'Task claimed successfully!',
      td_alert_simple_claim_ok: 'Claimed! Please complete the task as required.',
      td_alert_twitter_launch: 'Opening Twitter now. Complete the follow/like/retweet action, then return to this page.',
      td_alert_twitter_redirect: 'Click the button to open Twitter and complete the task. Return here when done for automatic verification.',
      td_alert_twitter_verified: 'Verified! Your reward has been credited.',
      td_alert_twitter_not_verified: 'Action not detected yet. Please finish on Twitter and try again.',
      td_alert_twitter_no_link: 'This task has no Twitter link configured. Please contact the publisher.',
      td_alert_telegram_no_link: 'This task has no Telegram link configured. Please contact the publisher.',
      td_alert_telegram_verified: 'Verified! Reward credited.',
      td_alert_discord_no_link: 'This task has no Discord invite link configured. Please contact the publisher.',
      td_alert_discord_verified: 'Verified! Reward credited.',
      td_subtask_tg_join: 'Join group',
      td_subtask_tg_follow: 'Follow channel',
      td_subtask_tg_message: 'Send message',
      td_subtask_tg_message_kw: 'Send message (keyword: {keyword})',
      td_subtask_dc_join: 'Join server',
      td_subtask_dc_message: 'Send message',
      td_subtask_dc_message_kw: 'Send message (keyword: {keyword})',
      td_alert_simple_verifying: 'Task claimed. Verification in progress...',
      td_alert_claim_fail: 'Claim failed: ',
      td_alert_already_claimed: 'You have already claimed this task',
      td_alert_task_full: 'No slots left for this task',
      td_alert_login: 'Please sign in before claiming',
      td_twitter_bind_title: 'Connect your Twitter account first',
      td_twitter_bind_desc: 'Task verification requires your Twitter account info',
      td_twitter_bind_ph: 'Enter your Twitter username (e.g. @testuser)',
      td_twitter_bind_confirm: 'Confirm',
      td_twitter_btn_cancel: 'Cancel',
      td_twitter_username_required: 'Please enter your Twitter username',
      td_twitter_username_invalid: 'Invalid Twitter username (1-15 letters, numbers, or underscores)',
      td_twitter_save_fail: 'Save failed: '
    }
  };

  function getRouteName() {
    var hash = window.location.hash.replace(/^#/, '') || 'home';
    return hash.split('?')[0] || 'home';
  }

  function getTaskIdFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || '';
    if (hash.indexOf('task-detail') === -1) return null;
    var query = hash.split('?')[1];
    if (!query) return null;
    return new URLSearchParams(query).get('id');
  }

  function displayNameFromEmail(email) {
    if (!email) return 'Unknown';
    var parts = String(email).split('@');
    return parts[0] || 'Unknown';
  }

  function getTypeLabelText(type) {
    var key = 'td_type_' + (type || 'other');
    var text = tdT(key);
    return text === key ? tdT('td_type_other') : text;
  }

  function formatDeadlineDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    var lang = getLang();
    if (lang === 'zh') {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function parseRequirements(requirements) {
    if (Array.isArray(requirements)) return requirements.filter(Boolean);
    if (typeof requirements === 'string' && requirements.trim()) {
      try {
        var parsed = JSON.parse(requirements);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {
        return requirements.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      }
    }
    return [];
  }

  function saveSubmissionContext(task, submission) {
    if (!task || !submission) return;
    var perReward = getPerParticipantReward(task);
    sessionStorage.setItem('currentTaskId', task.id);
    sessionStorage.setItem('currentTaskTitle', task.title || '');
    sessionStorage.setItem('currentTaskReward', String(perReward));
    sessionStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify({
      taskId: task.id,
      submissionId: submission.id,
      title: task.title || '',
      reward: perReward,
      rewardUnit: task.reward_type || 'CRLM'
    }));
  }

  function getPerParticipantReward(task) {
    if (!task) return 0;
    var rewardAmount = Number(task.reward_amount) || 0;
    var maxParticipants = task.max_participants != null ? Number(task.max_participants) : null;
    if (maxParticipants != null && maxParticipants > 0) {
      return rewardAmount / maxParticipants;
    }
    return rewardAmount;
  }

  function isSimpleTaskRecord(task) {
    return getTaskField(task, ['type', 'task_type', 'category'], '') === 'simple';
  }

  function isTwitterSimpleTask(task) {
    if (!isSimpleTaskRecord(task)) return false;
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    return platform === 'twitter';
  }

  function getTwitterTaskAction(task) {
    return String(getTaskField(task, ['task_action'], '') || '').trim().toLowerCase();
  }

  function isTwitterFollowTask(task) {
    if (!isTwitterSimpleTask(task)) return false;
    var action = getTwitterTaskAction(task);
    return action === 'follow' || action === 'following';
  }

  function isTwitterVerifiableActionLocal(task) {
    if (!isTwitterSimpleTask(task)) return false;
    var actions = parseTaskActionsList(task);
    if (!actions.length) return false;
    return actions.every(function (action) {
      return isAllowedTwitterAction(action);
    });
  }

  function isTelegramSimpleTask(task) {
    if (!isSimpleTaskRecord(task)) return false;
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    return platform === 'telegram';
  }

  function isTelegramVerifiableActionLocal(task) {
    if (!isTelegramSimpleTask(task)) return false;
    var actions = parseTaskActionsList(task);
    if (!actions.length) return false;
    return actions.every(function (action) {
      return isAllowedTelegramAction(action);
    });
  }

  function isDiscordSimpleTask(task) {
    if (!isSimpleTaskRecord(task)) return false;
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    return platform === 'discord';
  }

  function isDiscordVerifiableActionLocal(task) {
    if (!isDiscordSimpleTask(task)) return false;
    var actions = parseTaskActionsList(task);
    if (!actions.length) return false;
    return actions.every(function (action) {
      return isAllowedDiscordAction(action);
    });
  }

  function isSimpleVerifiablePlatformTask(task) {
    return isTwitterVerifiableActionLocal(task)
      || isTelegramVerifiableActionLocal(task)
      || isDiscordVerifiableActionLocal(task);
  }

  function usesScreenshotVerification(task) {
    return isTwitterVerifiableActionLocal(task);
  }

  function usesTelegramWorkerVerification(task) {
    return isTelegramVerifiableActionLocal(task);
  }

  function usesDiscordWorkerVerification(task) {
    return isDiscordVerifiableActionLocal(task);
  }

  function getTaskPlatform(task) {
    return String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
  }

  function parseTaskActionsList(task) {
    return parseCommaList(getTaskField(task, ['task_action'], '')).map(function (action) {
      return action.toLowerCase();
    });
  }

  function parseTaskTargetsList(task) {
    return parseCommaList(getTaskField(task, ['task_target'], ''));
  }

  function normalizeSubtaskAction(action, platform) {
    var key = String(action || '').toLowerCase();
    if (platform === 'telegram') {
      if (key === 'join') return 'join';
      if (key === 'follow') return 'follow';
      if (key === 'message') return 'message';
      return key;
    }
    if (platform === 'discord') {
      if (key === 'join') return 'join';
      if (key === 'message') return 'message';
      return key;
    }
    var map = {
      follow: 'follow',
      following: 'follow',
      like: 'like',
      favorite: 'like',
      favourite: 'like',
      retweet: 'retweet',
      repost: 'retweet',
      reply: 'reply',
      comment: 'reply'
    };
    return map[key] || key;
  }

  function buildTelegramOpenUrl(target) {
    var clean = String(target || '').trim();
    if (!clean) return '';
    if (/^https?:\/\//i.test(clean)) return clean;
    if (/^t\.me\//i.test(clean)) return 'https://' + clean.replace(/^\/+/, '');
    if (clean.charAt(0) === '@') return 'https://t.me/' + encodeURIComponent(clean.slice(1));
    return 'https://t.me/' + encodeURIComponent(clean);
  }

  function buildDiscordOpenUrl(target) {
    var clean = String(target || '').trim();
    if (!clean) return '';
    if (/^https?:\/\//i.test(clean)) return clean;
    if (/^discord(?:app)?\.com\/invite\//i.test(clean) || /^discord\.gg\//i.test(clean)) {
      return 'https://' + clean.replace(/^\/+/, '');
    }
    if (/^[A-Za-z0-9-]+$/.test(clean)) return 'https://discord.gg/' + encodeURIComponent(clean);
    return clean;
  }

  function buildSubtaskOpenUrl(action, target, task) {
    var platform = getTaskPlatform(task);
    var clean = String(target || '').trim();
    if (!clean) return '';
    if (platform === 'telegram') return buildTelegramOpenUrl(clean);
    if (platform === 'discord') return buildDiscordOpenUrl(clean);
    if (/^https?:\/\//i.test(clean)) return clean;
    if (action === 'follow') {
      var user = normalizeTwitterUsername(clean);
      return user ? 'https://twitter.com/' + encodeURIComponent(user) : '';
    }
    if (/^\d+$/.test(clean)) return 'https://twitter.com/i/status/' + clean;
    return 'https://twitter.com/' + encodeURIComponent(clean.replace(/^@+/, ''));
  }

  function buildSubtaskLabel(action, target, task) {
    var platform = getTaskPlatform(task);
    if (platform === 'telegram') {
      if (action === 'join') return tdT('td_subtask_tg_join');
      if (action === 'follow') return tdT('td_subtask_tg_follow');
      if (action === 'message') {
        var tgKeyword = task ? String(getTaskField(task, ['task_keyword'], '') || '').trim() : '';
        if (tgKeyword) return tdT('td_subtask_tg_message_kw', { keyword: tgKeyword });
        return tdT('td_subtask_tg_message');
      }
    }
    if (platform === 'discord') {
      if (action === 'join') return tdT('td_subtask_dc_join');
      if (action === 'message') {
        var dcKeyword = task ? String(getTaskField(task, ['task_keyword'], '') || '').trim() : '';
        if (dcKeyword) return tdT('td_subtask_dc_message_kw', { keyword: dcKeyword });
        return tdT('td_subtask_dc_message');
      }
    }
    if (action === 'follow') {
      var user = normalizeTwitterUsername(target);
      return tdT('td_subtask_follow', { user: user ? '@' + user : target });
    }
    if (action === 'like') return tdT('td_subtask_like');
    if (action === 'reply') {
      var keyword = task ? String(getTaskField(task, ['task_keyword'], '') || '').trim() : '';
      if (keyword) return tdT('td_subtask_reply_keyword', { keyword: keyword });
      return tdT('td_subtask_reply');
    }
    if (action === 'retweet') return tdT('td_subtask_like');
    return target;
  }

  function buildSubtasksFromTask(task) {
    var platform = getTaskPlatform(task);
    var actions = parseTaskActionsList(task);
    var targets = parseTaskTargetsList(task);
    return actions.map(function (rawAction, index) {
      var action = normalizeSubtaskAction(rawAction, platform);
      var target = targets[index] || '';
      return {
        key: action + ':' + index,
        index: index,
        action: action,
        target: target,
        label: buildSubtaskLabel(action, target, task),
        url: buildSubtaskOpenUrl(action, target, task)
      };
    });
  }

  function getSubtaskProgressStorageKey() {
    if (!currentTaskRecord || !currentUserId) return '';
    return SUBTASK_PROGRESS_PREFIX + ':' + currentTaskRecord.id + ':' + currentUserId;
  }

  function loadSubtaskProgressSet() {
    var key = getSubtaskProgressStorageKey();
    if (!key) return {};
    try {
      var raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (_err) {
      return {};
    }
  }

  function saveSubtaskProgressSet(setObj) {
    var key = getSubtaskProgressStorageKey();
    if (!key) return;
    sessionStorage.setItem(key, JSON.stringify(setObj || {}));
  }

  function isSubtaskDone(subtaskKey) {
    var set = loadSubtaskProgressSet();
    return !!set[subtaskKey];
  }

  function markSubtaskDone(subtaskKey) {
    var set = loadSubtaskProgressSet();
    set[subtaskKey] = true;
    saveSubtaskProgressSet(set);
  }

  function countCompletedSubtasks() {
    if (!currentTaskRecord) return 0;
    return buildSubtasksFromTask(currentTaskRecord).filter(function (st) {
      return isSubtaskDone(st.key);
    }).length;
  }

  function allSubtasksMarkedDone() {
    if (!currentTaskRecord) return false;
    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    return subtasks.length > 0 && subtasks.every(function (st) {
      return isSubtaskDone(st.key);
    });
  }

  function isSimpleSubtaskMode() {
    if (!currentTaskRecord || !currentSubmissionRecord || !isSimpleVerifiablePlatformTask(currentTaskRecord)) {
      return false;
    }
    if (currentSubmissionRecord.status === 'approved') return false;
    if (currentSubmissionRecord.status === 'submitted') {
      return !allSubtasksMarkedDone();
    }
    return true;
  }

  function getVerifyActionCopy(subtask) {
    if (!subtask) {
      return {
        stepAction: tdT('td_verify_step_upload'),
        uploadMain: tdT('td_verify_upload_main'),
        uploadHint: '',
        inputLabel: tdT('td_verify_confirm_hint'),
        inputPlaceholder: '',
        inputHint: tdT('td_verify_confirm_hint'),
        emptyInput: tdT('td_verify_alert_no_confirm')
      };
    }

    var target = String(subtask.target || '').trim();
    var user = normalizeTwitterUsername(target);
    var userAt = user ? '@' + user : target;
    var keyword = currentTaskRecord
      ? String(getTaskField(currentTaskRecord, ['task_keyword'], '') || '').trim()
      : '';
    var vars = { user: userAt, target: target, keyword: keyword };

    if (subtask.action === 'like' || subtask.action === 'retweet') {
      return {
        stepAction: tdT('td_verify_step_like'),
        uploadMain: tdT('td_verify_upload_main'),
        uploadHint: tdT('td_verify_hint_like'),
        inputLabel: tdT('td_verify_label_like'),
        inputPlaceholder: target && /^https?:\/\//i.test(target)
          ? target
          : tdT('td_verify_ph_like'),
        inputHint: tdT('td_verify_confirm_hint'),
        emptyInput: tdT('td_verify_empty_like')
      };
    }

    if (subtask.action === 'reply') {
      return {
        stepAction: tdT('td_verify_step_reply'),
        uploadMain: tdT('td_verify_upload_main'),
        uploadHint: tdT('td_verify_hint_reply'),
        inputLabel: tdT('td_verify_label_reply'),
        inputPlaceholder: keyword ? tdT('td_verify_ph_reply', vars) : tdT('td_verify_empty_reply'),
        inputHint: tdT('td_verify_confirm_hint'),
        emptyInput: tdT('td_verify_empty_reply')
      };
    }

    return {
      stepAction: tdT('td_verify_step_follow', vars),
      uploadMain: tdT('td_verify_upload_main'),
      uploadHint: tdT('td_verify_hint_follow', vars),
      inputLabel: tdT('td_verify_label_follow'),
      inputPlaceholder: userAt ? tdT('td_verify_ph_follow', vars) : tdT('td_verify_empty_follow'),
      inputHint: tdT('td_verify_confirm_hint'),
      emptyInput: tdT('td_verify_empty_follow')
    };
  }

  function compareScreenshotProofInput(inputValue, subtask, task) {
    if (!subtask) return false;

    if (subtask.action === 'like' || subtask.action === 'retweet') {
      return compareTaskTargetTweetUrl(inputValue, subtask.target);
    }

    if (subtask.action === 'reply') {
      var keyword = task ? String(getTaskField(task, ['task_keyword'], '') || '').trim() : '';
      if (!keyword) return false;
      return compareTaskTargetKeyword(inputValue, keyword);
    }

    return compareTaskTargetUsername(inputValue, subtask.target);
  }

  function applyVerifyPanelCopy(subtask) {
    var copy = getVerifyActionCopy(subtask);
    var uploadText = document.getElementById('td-verify-upload-text');
    var uploadHint = document.getElementById('td-verify-upload-hint');
    var confirmLabel = document.getElementById('td-verify-confirm-label');
    var confirmHint = document.getElementById('td-verify-confirm-hint');
    var accountInput = document.getElementById('td-verify-account-input');
    var successText = document.getElementById('td-verify-success-text');
    var reuploadBtn = document.getElementById('td-verify-reupload-btn');
    var submitBtn = document.getElementById('td-verify-submit-btn');

    if (uploadText) uploadText.textContent = copy.uploadMain;
    if (uploadHint) uploadHint.textContent = copy.uploadHint;
    if (confirmLabel) confirmLabel.textContent = copy.inputLabel;
    if (confirmHint) confirmHint.textContent = copy.inputHint;
    if (accountInput && !accountInput.value && !verifyPanelSuccess) {
      accountInput.placeholder = copy.inputPlaceholder;
    }
    if (successText) successText.textContent = tdT('td_verify_success');
    if (reuploadBtn) reuploadBtn.textContent = tdT('td_verify_reupload');
    if (submitBtn && !verifyPanelSuccess) submitBtn.textContent = tdT('td_verify_submit');
  }

  function getVerifyEmptyInputMessage(subtask) {
    var copy = getVerifyActionCopy(subtask);
    return copy.emptyInput || tdT('td_verify_alert_no_confirm');
  }

  function updateTaskDetailSubtaskModeUi() {
    var page = document.getElementById('task-detail-page');
    var section = document.getElementById('td-subtasks-section');
    var verifySection = document.getElementById('td-screenshot-verify-section');
    var show = isSimpleSubtaskMode();
    if (page) {
      page.classList.toggle('task-detail-subtask-mode', show);
      page.classList.toggle('task-detail-verify-success', show && verifyPanelSuccess);
    }
    if (section) section.classList.toggle('hidden', !show || verifyPanelActive);
    if (verifySection) {
      var showScreenshot = show && verifyPanelActive && usesScreenshotVerification(currentTaskRecord);
      verifySection.classList.toggle('hidden', !showScreenshot);
    }
    if (show && !verifyPanelActive) renderSubtasksPanel();
    if (show && verifyPanelActive) renderScreenshotVerifyPanel();
  }

  function resetVerifyPanelFormState() {
    verifyScreenshotFile = null;
    verifyScreenshotPreviewUrl = '';
    verifyScreenshotPublicUrl = '';
    verifyPanelSuccess = false;
    verifySubmitting = false;

    var fileInput = document.getElementById('td-verify-file-input');
    var accountInput = document.getElementById('td-verify-account-input');
    var errorEl = document.getElementById('td-verify-error');
    var successPanel = document.getElementById('td-verify-success-panel');
    var submitBtn = document.getElementById('td-verify-submit-btn');
    var uploadZone = document.getElementById('td-verify-upload-zone');
    var previewWrap = document.getElementById('td-verify-preview-wrap');
    var previewImg = document.getElementById('td-verify-preview-img');

    if (fileInput) fileInput.value = '';
    if (accountInput) accountInput.value = '';
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    if (successPanel) successPanel.classList.add('hidden');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('td-verify-submit-done');
      submitBtn.textContent = tdT('td_verify_submit');
    }
    if (uploadZone) uploadZone.classList.remove('hidden');
    if (previewWrap) previewWrap.classList.add('hidden');
    if (previewImg) previewImg.src = '';
  }

  function getVerifyStepPhase() {
    if (verifyPanelSuccess) return 4;
    if (verifyScreenshotFile || verifyScreenshotPreviewUrl) return 3;
    return 2;
  }

  function renderVerifySteps(subtask) {
    var stepsEl = document.getElementById('td-verify-steps');
    if (!stepsEl) return;

    var copy = getVerifyActionCopy(subtask);
    var phase = getVerifyStepPhase();
    var steps = [
      { label: copy.stepAction, key: 'action' },
      { label: tdT('td_verify_step_upload'), key: 'upload' },
      { label: tdT('td_verify_step_submit'), key: 'submit' }
    ];

    var html = '';
    steps.forEach(function (step, index) {
      var stepNum = index + 1;
      var stateClass = 'td-verify-step-pending';
      var icon = '○';

      if (verifyPanelSuccess || stepNum < phase) {
        stateClass = 'td-verify-step-done';
        icon = '✓';
      } else if (stepNum === phase) {
        stateClass = 'td-verify-step-current';
        icon = '●';
      }

      html += (
        '<div class="td-verify-step ' + stateClass + '">' +
          '<span class="td-verify-step-icon">' + icon + '</span>' +
          '<span class="td-verify-step-label">' + escapeHtml(step.label) + '</span>' +
        '</div>'
      );

      if (index < steps.length - 1) {
        html += '<div class="td-verify-step-connector"></div>';
      }
    });

    stepsEl.innerHTML = html;
  }

  function renderScreenshotVerifyPanel() {
    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    var st = subtasks[verifySubtaskIndex];
    if (!st) return;

    applyVerifyPanelCopy(st);
    renderVerifySteps(st);

    var previewWrap = document.getElementById('td-verify-preview-wrap');
    var previewImg = document.getElementById('td-verify-preview-img');
    var uploadZone = document.getElementById('td-verify-upload-zone');
    var successPanel = document.getElementById('td-verify-success-panel');
    var submitBtn = document.getElementById('td-verify-submit-btn');
    var accountInput = document.getElementById('td-verify-account-input');

    if (verifyScreenshotPreviewUrl && previewImg && previewWrap) {
      previewImg.src = verifyScreenshotPreviewUrl;
      previewWrap.classList.remove('hidden');
      if (uploadZone) uploadZone.classList.add('hidden');
    }

    if (verifyPanelSuccess) {
      if (successPanel) successPanel.classList.remove('hidden');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('td-verify-submit-done');
        submitBtn.textContent = tdT('td_verify_submit_done');
      }
      if (accountInput) accountInput.disabled = true;
    } else if (accountInput) {
      accountInput.disabled = false;
    }
  }

  function showScreenshotVerifyPanel(index) {
    verifyPanelActive = true;
    verifySubtaskIndex = index;
    resetVerifyPanelFormState();
    updateTaskDetailSubtaskModeUi();
  }

  function hideScreenshotVerifyPanel() {
    verifyPanelActive = false;
    verifySubtaskIndex = null;
    resetVerifyPanelFormState();
    updateTaskDetailSubtaskModeUi();
  }

  function showVerifyError(message) {
    var errorEl = document.getElementById('td-verify-error');
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.classList.toggle('hidden', !message);
  }

  async function handleVerifyScreenshotSelected(file) {
    if (!file || verifySubmitting || verifyPanelSuccess) return;

    var validationError = validateProofScreenshotFile(file);
    if (validationError) {
      showVerifyError(validationError);
      return;
    }

    showVerifyError('');
    verifyScreenshotFile = file;
    verifyScreenshotPublicUrl = '';

    if (verifyScreenshotPreviewUrl) {
      URL.revokeObjectURL(verifyScreenshotPreviewUrl);
    }
    verifyScreenshotPreviewUrl = URL.createObjectURL(file);
    renderScreenshotVerifyPanel();
  }

  async function submitScreenshotVerification() {
    if (verifySubmitting || verifyPanelSuccess || !currentTaskRecord || !currentUserId) return;

    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    var st = subtasks[verifySubtaskIndex];
    if (!st) return;

    if (!verifyScreenshotFile && !verifyScreenshotPublicUrl) {
      showVerifyError(tdT('td_verify_alert_no_screenshot'));
      return;
    }

    var accountInput = document.getElementById('td-verify-account-input');
    var accountValue = accountInput ? accountInput.value : '';
    if (!String(accountValue || '').trim()) {
      showVerifyError(getVerifyEmptyInputMessage(st));
      return;
    }

    if (!compareScreenshotProofInput(accountValue, st, currentTaskRecord)) {
      showVerifyError(tdT('td_verify_alert_mismatch'));
      return;
    }

    showVerifyError('');
    verifySubmitting = true;
    var submitBtn = document.getElementById('td-verify-submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    try {
      var screenshotUrl = verifyScreenshotPublicUrl;

      if (verifyScreenshotFile && !screenshotUrl) {
        var uploadResult = await uploadProofScreenshot(currentUserId, verifyScreenshotFile);
        if (!uploadResult.ok) {
          showVerifyError(tdT('td_verify_alert_upload_fail') + (uploadResult.error || ''));
          return;
        }
        screenshotUrl = uploadResult.publicUrl;
        verifyScreenshotPublicUrl = screenshotUrl;
      }

      markSubtaskDone(st.key);
      clearSubtaskFailure(st);

      var allDone = allSubtasksMarkedDone();

      if (allDone) {
        var priorStatus = currentSubmissionRecord ? currentSubmissionRecord.status : 'pending';
        var isSimpleAutoTask = false;

        if (currentTaskRecord && typeof window.coinrealmIsSimpleAutoApprovalTask === 'function') {
          isSimpleAutoTask = window.coinrealmIsSimpleAutoApprovalTask(currentTaskRecord);
        }

        if (currentSubmissionRecord && currentSubmissionRecord.id) {
          var existingUrls = currentSubmissionRecord.screenshot_urls;
          if (typeof existingUrls === 'string') {
            try { existingUrls = JSON.parse(existingUrls); } catch (_e) { existingUrls = []; }
          }
          if (!Array.isArray(existingUrls)) existingUrls = [];
          if (screenshotUrl) existingUrls.push(screenshotUrl);

          var submissionUpdatePayload = {
            screenshot_urls: existingUrls,
            submitted_at: new Date().toISOString()
          };

          if (!isSimpleAutoTask) {
            submissionUpdatePayload.status = 'submitted';
            submissionUpdatePayload.reviewed_at = null;
            submissionUpdatePayload.review_comment = null;
          }

          await window.supabase
            .from('submissions')
            .update(submissionUpdatePayload)
            .eq('id', currentSubmissionRecord.id);
        }

        if (!isSimpleAutoTask) {
          try {
            if (typeof window.coinrealmNotifyPendingReview === 'function') {
              await window.coinrealmNotifyPendingReview({
                taskId: currentTaskRecord && currentTaskRecord.id ? currentTaskRecord.id : null,
                publisherId: currentTaskRecord && currentTaskRecord.publisher_id ? currentTaskRecord.publisher_id : null
              });
            }
          } catch (pendingNotifErr) {
            console.warn('待审核通知调用失败：', pendingNotifErr);
          }
        }

        if (isSimpleAutoTask && typeof window.coinrealmFinalizeSimpleTaskSubmission === 'function') {
          await window.coinrealmFinalizeSimpleTaskSubmission(currentTaskRecord, currentUserId, {
            priorStatus: priorStatus,
            submissionId: currentSubmissionRecord && currentSubmissionRecord.id,
            creditRewardClient: true,
            path: 'task-detail-screenshot-verify'
          });
        }

        verifyPanelSuccess = true;
        markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
        subtaskUiState = {};
        subtaskFailReasons = {};
        activeSubtaskKey = null;
        activeSubtaskIndex = null;
        renderScreenshotVerifyPanel();
        updateBottomActionBar();
        if (typeof window.coinrealmShowRewardCelebration === 'function') {
          window.coinrealmShowRewardCelebration(getPerParticipantReward(currentTaskRecord));
        }
        return;
      }

      verifyPanelSuccess = true;
      renderScreenshotVerifyPanel();

      var completedIndex = verifySubtaskIndex;

      window.setTimeout(function () {
        verifyPanelSuccess = false;
        hideScreenshotVerifyPanel();

        var nextIndex = subtasks.findIndex(function (item, idx) {
          return idx > completedIndex && !isSubtaskDone(item.key);
        });

        if (nextIndex < 0) {
          nextIndex = subtasks.findIndex(function (item) {
            return !isSubtaskDone(item.key);
          });
        }

        if (nextIndex >= 0) {
          renderSubtasksPanel();
          var nextRow = document.querySelector('#td-subtasks-list .td-subtask-row[data-subtask-index="' + nextIndex + '"]');
          if (nextRow && nextRow.scrollIntoView) nextRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        updateBottomActionBar();
      }, 1200);
    } catch (err) {
      showVerifyError(err && err.message ? err.message : String(err));
    } finally {
      verifySubmitting = false;
      if (!verifyPanelSuccess && submitBtn) submitBtn.disabled = false;
    }
  }

  function initScreenshotVerifyPanel() {
    if (verifyPanelInitialized) return;
    verifyPanelInitialized = true;

    var uploadZone = document.getElementById('td-verify-upload-zone');
    var fileInput = document.getElementById('td-verify-file-input');
    var reuploadBtn = document.getElementById('td-verify-reupload-btn');
    var submitBtn = document.getElementById('td-verify-submit-btn');

    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', function () {
        if (verifySubmitting || verifyPanelSuccess) return;
        fileInput.click();
      });
      uploadZone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          uploadZone.click();
        }
      });
      fileInput.addEventListener('change', function () {
        var file = fileInput.files && fileInput.files[0];
        if (file) handleVerifyScreenshotSelected(file);
      });
    }

    if (reuploadBtn && fileInput) {
      reuploadBtn.addEventListener('click', function () {
        if (verifySubmitting || verifyPanelSuccess) return;
        fileInput.click();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        submitScreenshotVerification();
      });
    }
  }

  function getSubtaskDisplayState(st) {
    if (isSubtaskDone(st.key)) return 'done';
    if (subtaskUiState[st.key] === 'verifying') return 'verifying';
    if (subtaskUiState[st.key] === 'failed') return 'retry';
    return 'go';
  }

  function getSubtaskFailReason(st) {
    return subtaskFailReasons[st.key] || '';
  }

  function setSubtaskFailed(st, reason) {
    subtaskUiState[st.key] = 'failed';
    subtaskFailReasons[st.key] = reason || tdT('td_subtask_fail_hint');
  }

  function clearSubtaskFailure(st) {
    delete subtaskUiState[st.key];
    delete subtaskFailReasons[st.key];
  }

  function buildSubtaskButtonHtml(st, displayState) {
    if (displayState === 'done') {
      return (
        '<button type="button" class="td-subtask-btn td-subtask-btn-done" data-subtask-index="' + st.index + '" disabled>' +
          escapeHtml(tdT('td_subtask_done')) +
        '</button>'
      );
    }
    if (displayState === 'verifying') {
      return (
        '<button type="button" class="td-subtask-btn td-subtask-btn-verifying" data-subtask-index="' + st.index + '" disabled>' +
          '<span class="td-subtask-spinner" aria-hidden="true"></span>' +
          '<span>' + escapeHtml(tdT('td_subtask_verifying')) + '</span>' +
        '</button>'
      );
    }
    if (displayState === 'retry') {
      return (
        '<button type="button" class="td-subtask-btn td-subtask-btn-retry" data-subtask-index="' + st.index + '" data-subtask-action="retry">' +
          escapeHtml(tdT('td_subtask_retry')) +
        '</button>'
      );
    }
    return (
      '<button type="button" class="td-subtask-btn td-subtask-btn-go" data-subtask-index="' + st.index + '" data-subtask-action="go">' +
        escapeHtml(tdT('td_subtask_go')) +
      '</button>'
    );
  }

  function renderSubtasksPanel() {
    var listEl = document.getElementById('td-subtasks-list');
    if (!listEl || !currentTaskRecord) return;

    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    listEl.innerHTML = subtasks.map(function (st, index) {
      var displayState = getSubtaskDisplayState(st);
      var done = displayState === 'done';
      var failReason = getSubtaskFailReason(st);
      var rowClass = 'td-subtask-row' + (done ? ' td-subtask-row-done' : '');
      if (displayState === 'retry') rowClass += ' td-subtask-row-failed';
      var indexClass = 'td-subtask-index' + (done ? ' td-subtask-index-done' : '');
      var indexContent = done ? '✓' : String(index + 1);
      var reasonHtml = (displayState === 'retry' && failReason)
        ? '<div class="td-subtask-reason">' + escapeHtml(failReason) + '</div>'
        : '';
      return (
        '<div class="' + rowClass + '" data-subtask-index="' + index + '">' +
          '<div class="' + indexClass + '" aria-hidden="true">' + indexContent + '</div>' +
          '<div class="td-subtask-body">' +
            '<div class="td-subtask-label">' + escapeHtml(st.label) + '</div>' +
            reasonHtml +
          '</div>' +
          buildSubtaskButtonHtml(st, displayState) +
        '</div>'
      );
    }).join('');
  }

  function handleSubtaskGo(index) {
    if (verifySubmitting || subtaskVerifyInProgress || !currentTaskRecord || !currentUserId) return;
    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    var st = subtasks[index];
    if (!st || isSubtaskDone(st.key)) return;

    if (!st.url) {
      if (usesTelegramWorkerVerification(currentTaskRecord)) {
        alert(tdT('td_alert_telegram_no_link'));
      } else if (usesDiscordWorkerVerification(currentTaskRecord)) {
        alert(tdT('td_alert_discord_no_link'));
      } else {
        alert(tdT('td_alert_twitter_no_link'));
      }
      return;
    }

    if (usesTelegramWorkerVerification(currentTaskRecord)) {
      handleTelegramSubtaskGo(index, st);
      return;
    }

    if (usesDiscordWorkerVerification(currentTaskRecord)) {
      handleDiscordSubtaskGo(index, st);
      return;
    }

    activeSubtaskKey = st.key;
    activeSubtaskIndex = index;
    window.open(st.url, '_blank', 'noopener,noreferrer');
    showScreenshotVerifyPanel(index);
  }

  async function handleTelegramSubtaskGo(index, st) {
    var username = await fetchUserTelegramUsername(currentUserId);
    if (!username) {
      await openTelegramBindModal({
        onSuccess: function () {
          handleTelegramSubtaskGo(index, st);
        }
      });
      return;
    }

    activeSubtaskKey = st.key;
    activeSubtaskIndex = index;
    subtaskUiState[st.key] = 'verifying';
    delete subtaskFailReasons[st.key];
    renderSubtasksPanel();
    setupTaskDetailVisibilityListener();
    window.open(st.url, '_blank', 'noopener,noreferrer');
  }

  async function fetchUserDiscordAccountLocal(userId) {
    if (window.coinrealmFetchDiscordAccount) {
      var account = await window.coinrealmFetchDiscordAccount(userId);
      if (account && account.userId) return account;
    }

    if (coinrealmCurrentUserProfile && coinrealmCurrentUserProfile.discord_user_id) {
      return {
        userId: String(coinrealmCurrentUserProfile.discord_user_id),
        username: String(coinrealmCurrentUserProfile.discord_username || '').replace(/^@+/, '').trim()
      };
    }

    return { userId: '', username: '' };
  }

  function isDiscordBindRequiredReason(reason) {
    var text = String(reason || '');
    return text.indexOf('请先在个人中心绑定') !== -1
      || /绑定.*Discord/i.test(text)
      || /Discord.*绑定/i.test(text);
  }

  async function openDiscordBindModal(options) {
    if (typeof window.coinrealmOpenDiscordBindModal !== 'function') return;
    await window.coinrealmOpenDiscordBindModal(Object.assign({ showDesc: true }, options || {}));
  }

  function openDiscordSubtaskInvite(index, st) {
    activeSubtaskKey = st.key;
    activeSubtaskIndex = index;
    subtaskUiState[st.key] = 'verifying';
    delete subtaskFailReasons[st.key];
    renderSubtasksPanel();
    setupTaskDetailVisibilityListener();
    window.open(st.url, '_blank', 'noopener,noreferrer');
  }

  async function tryResumeDiscordSubtaskVerification() {
    if (!currentTaskRecord || !currentUserId || !usesDiscordWorkerVerification(currentTaskRecord)) return;

    var resumeIndex = sessionStorage.getItem(DISCORD_OAUTH_RESUME_SUBTASK);
    var resumeTaskId = sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK);
    if (resumeIndex == null || !resumeTaskId) return;
    if (String(currentTaskRecord.id) !== String(resumeTaskId)) return;

    if (typeof window.coinrealmWaitForDiscordOAuthReturn === 'function') {
      await window.coinrealmWaitForDiscordOAuthReturn();
    }

    sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
    sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);

    var index = parseInt(resumeIndex, 10);
    if (Number.isNaN(index)) return;

    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    var st = subtasks[index];
    if (!st || isSubtaskDone(st.key)) return;

    var account = await fetchUserDiscordAccountLocal(currentUserId);
    if (!account.userId) return;

    openDiscordSubtaskInvite(index, st);
  }

  async function handleDiscordSubtaskGo(index, st) {
    var account = await fetchUserDiscordAccountLocal(currentUserId);
    if (!account.userId) {
      await openDiscordBindModal({
        taskIndex: index,
        taskId: currentTaskRecord.id
      });
      return;
    }

    openDiscordSubtaskInvite(index, st);
  }

  async function runDiscordSubtaskVerification(index) {
    if (subtaskVerifyInProgress || !currentTaskRecord || !currentUserId) return;

    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    var st = subtasks[index];
    if (!st || isSubtaskDone(st.key)) {
      activeSubtaskKey = null;
      activeSubtaskIndex = null;
      return;
    }

    var account = await fetchUserDiscordAccountLocal(currentUserId);
    if (!account.userId) {
      await openDiscordBindModal({
        taskIndex: index,
        taskId: currentTaskRecord.id
      });
      return;
    }

    subtaskVerifyInProgress = true;
    subtaskUiState[st.key] = 'verifying';
    delete subtaskFailReasons[st.key];
    renderSubtasksPanel();

    try {
      var result = typeof verifyDiscordSubtask === 'function'
        ? await verifyDiscordSubtask(currentTaskRecord.id, currentUserId)
        : { verified: false, reason: 'Discord Worker 未配置' };
      if (result.verified) {
        markSubtaskDone(st.key);
        clearSubtaskFailure(st);
        if (typeof window.coinrealmRefreshDiscordBindUi === 'function') {
          window.coinrealmRefreshDiscordBindUi();
        }
        if (allSubtasksMarkedDone()) {
          await finalizeSimplePlatformTaskSubmission();
          if (typeof window.coinrealmShowRewardCelebration === 'function') {
            window.coinrealmShowRewardCelebration(getPerParticipantReward(currentTaskRecord));
          }
        } else {
          await reloadCurrentSubmission();
        }
        if (currentSubmissionRecord && currentSubmissionRecord.status === 'approved') {
          markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
        }
      } else {
        var failReason = result.reason || result.error || tdT('td_subtask_fail_hint');
        if (isDiscordBindRequiredReason(failReason)) {
          await openDiscordBindModal({
            taskIndex: index,
            taskId: currentTaskRecord.id
          });
          return;
        }
        setSubtaskFailed(st, failReason);
      }
    } catch (err) {
      setSubtaskFailed(st, err && err.message ? err.message : String(err));
    } finally {
      subtaskVerifyInProgress = false;
      activeSubtaskKey = null;
      activeSubtaskIndex = null;
      renderSubtasksPanel();
      updateBottomActionBar();
    }
  }

  async function fetchUserTelegramUsername(userId) {
    return window.coinrealmFetchTelegramUsername
      ? window.coinrealmFetchTelegramUsername(userId)
      : '';
  }

  async function openTelegramBindModal(options) {
    if (typeof window.coinrealmOpenTelegramBindModal !== 'function') return;
    await window.coinrealmOpenTelegramBindModal(Object.assign({ showDesc: true }, options || {}));
  }

  async function runTelegramSubtaskVerification(index) {
    if (subtaskVerifyInProgress || !currentTaskRecord || !currentUserId) return;

    var subtasks = buildSubtasksFromTask(currentTaskRecord);
    var st = subtasks[index];
    if (!st || isSubtaskDone(st.key)) {
      activeSubtaskKey = null;
      activeSubtaskIndex = null;
      return;
    }

    var username = await fetchUserTelegramUsername(currentUserId);
    if (!username) {
      setSubtaskFailed(st, tgT('tg_bind_desc'));
      activeSubtaskKey = null;
      activeSubtaskIndex = null;
      renderSubtasksPanel();
      await openTelegramBindModal({
        onSuccess: function () {
          runTelegramSubtaskVerification(index);
        }
      });
      return;
    }

    subtaskVerifyInProgress = true;
    subtaskUiState[st.key] = 'verifying';
    delete subtaskFailReasons[st.key];
    renderSubtasksPanel();

    try {
      var result = await verifyTelegramSubtask(currentTaskRecord.id, currentUserId, index);
      if (result.verified) {
        markSubtaskDone(st.key);
        clearSubtaskFailure(st);
        if (allSubtasksMarkedDone()) {
          await finalizeSimplePlatformTaskSubmission();
          if (typeof window.coinrealmShowRewardCelebration === 'function') {
            window.coinrealmShowRewardCelebration(getPerParticipantReward(currentTaskRecord));
          }
        } else {
          await reloadCurrentSubmission();
        }
        if (currentSubmissionRecord && currentSubmissionRecord.status === 'approved') {
          markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
        }
      } else {
        setSubtaskFailed(st, result.reason || result.error || tdT('td_subtask_fail_hint'));
      }
    } catch (err) {
      setSubtaskFailed(st, err && err.message ? err.message : String(err));
    } finally {
      subtaskVerifyInProgress = false;
      activeSubtaskKey = null;
      activeSubtaskIndex = null;
      renderSubtasksPanel();
      updateBottomActionBar();
    }
  }

  function normalizeTwitterUsername(value) {
    if (typeof window.coinrealmNormalizeTwitterUsername === 'function') {
      return window.coinrealmNormalizeTwitterUsername(value);
    }
    var text = String(value || '').trim();
    if (!text) return '';
    var urlMatch = text.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]{1,15})(?:[\/?#]|$)/i);
    if (urlMatch) return urlMatch[1];
    return text.replace(/^@+/, '').trim();
  }

  function markTaskDetailCompleted(taskId, userId) {
    if (!currentTaskRecord || String(currentTaskRecord.id) !== String(taskId)) return;
    if (userId && currentUserId && String(currentUserId) !== String(userId)) return;

    if (currentSubmissionRecord) {
      currentSubmissionRecord.status = 'approved';
    } else if (typeof loadUserSubmissionForTask === 'function' && currentUserId) {
      loadUserSubmissionForTask(taskId, currentUserId).then(function (row) {
        if (row) currentSubmissionRecord = row;
      });
    }

    detailActionState = isSimpleTaskRecord(currentTaskRecord) ? 'simple_completed' : 'approved';
    updateBottomActionBar();

    console.log('任务详情：立即更新为已完成状态', {
      taskId: taskId,
      userId: userId || currentUserId,
      detailActionState: detailActionState,
      submissionStatus: currentSubmissionRecord ? currentSubmissionRecord.status : null
    });

    if (typeof window.coinrealmMarkHomeTaskCompleted === 'function') {
      window.coinrealmMarkHomeTaskCompleted(taskId);
    }
  }

  window.coinrealmMarkTaskDetailCompleted = markTaskDetailCompleted;

  function resolveDetailActionState(task, submission, userId) {
    var max = task.max_participants != null ? Number(task.max_participants) : null;
    var current = Number(task.current_participants) || 0;
    var deadline = task.deadline ? new Date(task.deadline) : null;
    var isFull = max != null && current >= max;
    var isExpired = deadline && !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now();

    if (submission && submission.status === 'approved') {
      return 'approved';
    }

    if (isSimpleTaskRecord(task)) {
      if (isFull || isExpired) return 'ended';
      if (!userId) return 'not_logged_in';
      if (userId === task.publisher_id) return 'manage_task';
      if (!submission) return 'simple_can_claim';

      if (isSimpleVerifiablePlatformTask(task)) {
        if (submission.status === 'approved') return 'simple_completed';
        if (submission.status === 'rejected') return 'simple_retry';
        return 'simple_subtasks';
      }

      if (submission.status === 'approved' || submission.status === 'submitted') return 'simple_completed';
      if (submission.status === 'rejected') return 'simple_retry';
      if (submission.status === 'pending') return 'simple_subtasks';
      return 'simple_can_claim';
    }

    if (isFull || isExpired) return 'ended';
    if (!userId) return 'not_logged_in';
    if (userId === task.publisher_id) return 'manage_task';
    if (!submission) return 'can_claim';

    var status = submission.status;

    if (status === 'submitted') return 'waiting_review';
    if (status === 'claimed') return 'go_submit';
    if (status === 'pending' && !submission.submitted_at) return 'go_submit';
    if (status === 'pending' && submission.submitted_at) return 'waiting_review';
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected_resubmit';

    return 'go_submit';
  }

  async function navigateToSubmitPage() {
    if (!currentTaskRecord) return;

    if (typeof checkUserAlreadyRewardedForTask === 'function' && currentUserId &&
        await checkUserAlreadyRewardedForTask(currentTaskRecord.id, currentUserId)) {
      console.log('任务详情：用户已完成该任务，禁止跳转提交页', {
        taskId: currentTaskRecord.id,
        userId: currentUserId
      });
      markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
      return;
    }

    if (!currentSubmissionRecord) {
      console.log('任务详情：无提交记录，禁止跳转提交页', {
        taskId: currentTaskRecord && currentTaskRecord.id,
        submission: currentSubmissionRecord
      });
      return;
    }

    var status = currentSubmissionRecord.status;

    if (status === 'approved') {
      console.log('任务详情：已完成任务，禁止跳转提交页', {
        taskId: currentTaskRecord.id,
        userId: currentUserId,
        status: status
      });
      markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
      return;
    }

    if (status === 'submitted' || (status === 'pending' && currentSubmissionRecord.submitted_at)) {
      console.log('任务详情：已提交等待审核，禁止跳转提交页', {
        taskId: currentTaskRecord.id,
        userId: currentUserId,
        status: status,
        submitted_at: currentSubmissionRecord.submitted_at
      });
      detailActionState = 'waiting_review';
      updateBottomActionBar();
      return;
    }

    saveSubmissionContext(currentTaskRecord, currentSubmissionRecord);
    window.location.hash = 'submit-task';
  }

  async function performClaimTask() {
    if (!window.supabase || !currentTaskRecord) return;

    var taskId = currentTaskRecord.id;
    var userId = await getAuthenticatedUserId();

    if (!userId) {
      alert(tdT('td_alert_login'));
      return;
    }

    if (typeof checkUserAlreadyRewardedForTask === 'function' &&
        await checkUserAlreadyRewardedForTask(taskId, userId)) {
      console.log('任务详情：用户已完成该任务，禁止重复领取', { taskId: taskId, userId: userId });
      currentSubmissionRecord = typeof loadUserSubmissionForTask === 'function'
        ? await loadUserSubmissionForTask(taskId, userId)
        : currentSubmissionRecord;
      currentUserId = userId;
      markTaskDetailCompleted(taskId, userId);
      return;
    }

    var levelResult = await window.supabase
      .from('users')
      .select('level')
      .eq('id', userId)
      .maybeSingle();
    var userLevel = levelResult.data && levelResult.data.level != null
      ? Number(levelResult.data.level)
      : 0;

    if (userLevel < 0) {
      alert(tdT('td_btn_level'));
      return;
    }

    if (currentSubmissionRecord) {
      alert(tdT('td_alert_already_claimed'));
      return;
    }

    if (typeof loadUserSubmissionForTask === 'function') {
      var existingSubmission = await loadUserSubmissionForTask(taskId, userId);
      if (existingSubmission) {
        currentSubmissionRecord = existingSubmission;
        currentUserId = userId;
        detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
        updateBottomActionBar();
        if (detailActionState === 'approved') {
          console.log('任务详情：检测到已完成提交记录', existingSubmission);
          return;
        }
        alert(tdT('td_alert_already_claimed'));
        return;
      }
    }

    var max = currentTaskRecord.max_participants != null ? Number(currentTaskRecord.max_participants) : null;
    var current = Number(currentTaskRecord.current_participants) || 0;

    if (max != null && current >= max) {
      alert(tdT('td_alert_task_full'));
      return;
    }

    var insertResult = await window.supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        user_id: userId,
        status: 'claimed'
      })
      .select()
      .single();

    if (insertResult.error) {
      alert(tdT('td_alert_claim_fail') + insertResult.error.message);
      return;
    }

    var nextCount = current + 1;
    var updateResult = await window.supabase
      .from('tasks')
      .update({ current_participants: nextCount })
      .eq('id', taskId);

    if (updateResult.error) {
      alert(tdT('td_alert_claim_fail') + updateResult.error.message);
      return;
    }

    currentTaskRecord.current_participants = nextCount;
    currentSubmissionRecord = insertResult.data;
    currentUserId = userId;
    detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
    updateBottomActionBar();
    alert(tdT('td_alert_claim_ok'));
    writeBroadcast({
      user_id: userId,
      event_type: 'task_claim',
      description: '领取了任务「' + buildTaskBroadcastTitle(currentTaskRecord.title) + '」',
      reward_amount: Number(currentTaskRecord.reward_amount) || 0
    });
  }

  async function fetchUserTwitterUsername(userId) {
    return window.coinrealmFetchTwitterUsername
      ? window.coinrealmFetchTwitterUsername(userId)
      : '';
  }

  async function finalizeSimplePlatformTaskSubmission() {
    if (!window.supabase || !currentTaskRecord || !currentUserId) return false;

    if (!currentSubmissionRecord) {
      await reloadCurrentSubmission();
    }
    if (!currentSubmissionRecord || !currentSubmissionRecord.id) return false;

    var priorStatus = currentSubmissionRecord.status || 'pending';
    var finalizeFn = typeof window.coinrealmFinalizeSimpleTaskSubmission === 'function'
      ? window.coinrealmFinalizeSimpleTaskSubmission
      : (typeof applyTwitterVerificationSuccess === 'function' ? applyTwitterVerificationSuccess : null);

    if (!finalizeFn) return false;

    console.log('简单任务平台任务收口审核：', {
      taskId: currentTaskRecord.id,
      userId: currentUserId,
      submissionId: currentSubmissionRecord.id,
      priorStatus: priorStatus
    });

    var ok = await finalizeFn(currentTaskRecord, currentUserId, {
      priorStatus: priorStatus,
      creditRewardClient: true,
      submissionId: currentSubmissionRecord.id
    });

    await reloadCurrentSubmission();

    if (currentTaskRecord && currentTaskRecord.id) {
      var taskRefresh = await window.supabase
        .from('tasks')
        .select('current_participants')
        .eq('id', currentTaskRecord.id)
        .maybeSingle();
      if (!taskRefresh.error && taskRefresh.data) {
        currentTaskRecord.current_participants = taskRefresh.data.current_participants;
      }
    }

    if (currentSubmissionRecord && currentSubmissionRecord.status === 'approved') {
      markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
      return true;
    }

    console.warn('简单任务提交后状态未变为 approved', {
      taskId: currentTaskRecord.id,
      userId: currentUserId,
      submission: currentSubmissionRecord,
      finalizeOk: ok
    });
    return false;
  }

  async function insertTwitterPendingSubmission(userId) {
    if (!window.supabase || !currentTaskRecord || !userId) return false;

    var taskId = currentTaskRecord.id;
    var max = currentTaskRecord.max_participants != null ? Number(currentTaskRecord.max_participants) : null;
    var current = Number(currentTaskRecord.current_participants) || 0;

    if (max != null && current >= max) {
      alert(tdT('td_alert_task_full'));
      return false;
    }

    var insertResult = await window.supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        user_id: userId,
        status: 'pending'
      })
      .select()
      .single();

    if (insertResult.error) {
      alert(tdT('td_alert_claim_fail') + insertResult.error.message);
      return false;
    }

    currentSubmissionRecord = insertResult.data;
    currentUserId = userId;

    writeBroadcast({
      user_id: userId,
      event_type: 'task_claim',
      description: '领取了简单任务「' + buildTaskBroadcastTitle(currentTaskRecord.title) + '」',
      reward_amount: Number(currentTaskRecord.reward_amount) || 0
    });

    return true;
  }

  async function launchTwitterTaskStep2() {
    updateTaskDetailSubtaskModeUi();
    updateBottomActionBar();
  }

  function getTwitterTargetUrl(task) {
    var target = String(getTaskField(task, ['task_target'], '') || '').trim();
    if (!target) return '';
    if (/^https?:\/\//i.test(target)) return target;
    if (/^\d+$/.test(target)) return 'https://twitter.com/i/status/' + target;
    if (target.charAt(0) === '@') target = target.slice(1);
    return 'https://twitter.com/' + encodeURIComponent(target);
  }

  async function submitSimpleTwitterTask() {
    if (!window.supabase || !currentTaskRecord || !currentUserId || !currentSubmissionRecord) {
      return;
    }

    if (!allSubtasksMarkedDone()) {
      alert(tdT('td_btn_subtasks_remaining', {
        count: Math.max(0, buildSubtasksFromTask(currentTaskRecord).length - countCompletedSubtasks())
      }));
      return;
    }

    if (currentSubmissionRecord.status === 'approved') {
      markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
      return;
    }

    try {
      await finalizeSimplePlatformTaskSubmission();
      markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
      verifyPanelActive = false;
      verifyPanelSuccess = false;
      subtaskUiState = {};
      subtaskFailReasons = {};
      updateTaskDetailSubtaskModeUi();
      if (typeof window.coinrealmShowRewardCelebration === 'function') {
        window.coinrealmShowRewardCelebration(getPerParticipantReward(currentTaskRecord));
      }
    } catch (err) {
      alert(tdT('td_alert_claim_fail') + (err && err.message ? err.message : String(err)));
    }
  }

  function openTwitterTargetWindow(task) {
    var url = getTwitterTargetUrl(task);
    if (!url) {
      alert(tdT('td_alert_twitter_no_link'));
      return false;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  }

  function buildTdSpinnerButtonHtml(labelKey) {
    return (
      '<span class="td-btn-inner">' +
        '<span class="td-verify-spinner" aria-hidden="true"></span>' +
        '<span>' + escapeHtml(tdT(labelKey)) + '</span>' +
      '</span>'
    );
  }

  async function reloadCurrentSubmission() {
    if (!window.supabase || !currentTaskRecord || !currentUserId) return null;

    if (typeof loadUserSubmissionForTask === 'function') {
      currentSubmissionRecord = await loadUserSubmissionForTask(currentTaskRecord.id, currentUserId);
    } else {
      var subResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls')
        .eq('task_id', currentTaskRecord.id)
        .eq('user_id', currentUserId)
        .order('reviewed_at', { ascending: false })
        .limit(1);

      if (!subResult.error && subResult.data && subResult.data.length) {
        currentSubmissionRecord = subResult.data[0];
      }
    }

    console.log('任务详情：重新加载提交记录', {
      taskId: currentTaskRecord.id,
      userId: currentUserId,
      submission: currentSubmissionRecord
    });

    return currentSubmissionRecord;
  }

  async function runTwitterVerification(options) {
    options = options || {};
    if (twitterVerifyInProgress || !window.supabase || !currentTaskRecord || !currentUserId) return;
    if (!isTwitterVerifiableActionLocal(currentTaskRecord)) return;

    var priorStatus = currentSubmissionRecord ? currentSubmissionRecord.status : '';
    var useClientRewardCredit = !TWITTER_VERIFY_WORKER_URL || TWITTER_VERIFY_WORKER_URL === 'WORKER_URL_PLACEHOLDER';

    twitterVerifyInProgress = true;
    detailActionState = 'simple_verify_checking';
    updateBottomActionBar();

    try {
      var result = await verifyTwitterTask(currentTaskRecord.id, currentUserId);
      if (result.submission) {
        currentSubmissionRecord = result.submission;
      } else {
        await reloadCurrentSubmission();
      }

      if (result.verified) {
        if (result.submission && result.submission.status === 'approved') {
          console.log('Twitter 验证：verifyTwitterTask 已完成审核，跳过重复 finalize', {
            taskId: currentTaskRecord.id,
            userId: currentUserId,
            submissionId: result.submission.id
          });
          currentSubmissionRecord = result.submission;
        } else {
          await finalizeSimplePlatformTaskSubmission();
        }
        if (currentTaskRecord && currentTaskRecord.id) {
          var taskRefresh = await window.supabase
            .from('tasks')
            .select('current_participants')
            .eq('id', currentTaskRecord.id)
            .maybeSingle();
          if (!taskRefresh.error && taskRefresh.data) {
            currentTaskRecord.current_participants = taskRefresh.data.current_participants;
          }
        }
        markTaskDetailCompleted(currentTaskRecord.id, currentUserId);
        twitterPendingAutoVerify = false;
        activeSubtaskKey = null;
        updateTaskDetailSubtaskModeUi();
        if (options.showAlert !== false && typeof window.coinrealmShowRewardCelebration === 'function') {
          window.coinrealmShowRewardCelebration(getPerParticipantReward(currentTaskRecord));
        }
        return;
      }

      await reloadCurrentSubmission();
      detailActionState = currentSubmissionRecord && currentSubmissionRecord.status === 'rejected'
        ? 'simple_retry'
        : 'simple_subtasks';
      twitterPendingAutoVerify = false;
      activeSubtaskKey = null;
      updateTaskDetailSubtaskModeUi();
      updateBottomActionBar();
      if (options.showAlert !== false) {
        alert(tdT('td_alert_twitter_not_verified'));
      }
    } catch (err) {
      console.warn('Twitter verification failed', err);
      detailActionState = 'simple_retry';
      updateTaskDetailSubtaskModeUi();
      updateBottomActionBar();
    } finally {
      twitterVerifyInProgress = false;
    }
  }

  function setupTaskDetailVisibilityListener() {
    if (taskDetailVisibilityBound) return;
    taskDetailVisibilityBound = true;

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      if (activeSubtaskIndex == null || !currentTaskRecord) return;
      if (usesTelegramWorkerVerification(currentTaskRecord)) {
        runTelegramSubtaskVerification(activeSubtaskIndex);
        return;
      }
      if (usesDiscordWorkerVerification(currentTaskRecord)) {
        runDiscordSubtaskVerification(activeSubtaskIndex);
      }
    });
  }

  function syncTwitterVerifyUiState() {
    updateTaskDetailSubtaskModeUi();
  }

  function showTwitterModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    applyTaskDetailI18n();
  }

  function hideTwitterModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function hideAllTwitterModals() {
    if (typeof hideTwitterBindModal === 'function') {
      hideTwitterBindModal();
    }
  }

  async function openTwitterBindModal(options) {
    if (typeof window.coinrealmOpenTwitterBindModal !== 'function') return;
    await window.coinrealmOpenTwitterBindModal(Object.assign({ showDesc: true }, options || {}));
  }

  async function completeSimpleTaskClaim(userId) {
    if (!window.supabase || !currentTaskRecord || !userId) return;

    var taskId = currentTaskRecord.id;
    var max = currentTaskRecord.max_participants != null ? Number(currentTaskRecord.max_participants) : null;
    var current = Number(currentTaskRecord.current_participants) || 0;

    if (max != null && current >= max) {
      alert(tdT('td_alert_task_full'));
      return;
    }

    if (typeof checkUserAlreadyRewardedForTask === 'function' &&
        await checkUserAlreadyRewardedForTask(taskId, userId)) {
      console.log('任务详情：简单任务已领取奖励，禁止重复领取', { taskId: taskId, userId: userId });
      markTaskDetailCompleted(taskId, userId);
      return;
    }

    if (typeof window.coinrealmGrantSimpleTaskRewards === 'function') {
      var grantResult = await window.coinrealmGrantSimpleTaskRewards(currentTaskRecord, userId, {
        priorStatus: '',
        creditRewardClient: true,
        path: 'completeSimpleTaskClaim-grant'
      });
      if (grantResult && grantResult.alreadyRewarded) {
        markTaskDetailCompleted(taskId, userId);
        return;
      }
      if (!grantResult) {
        alert(tdT('td_alert_claim_fail'));
        return;
      }
    }

    var nowIso = new Date().toISOString();

    console.log('简单任务提交，status：', 'approved', {
      taskId: taskId,
      userId: userId,
      path: 'completeSimpleTaskClaim'
    });

    var insertResult = await window.supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        user_id: userId,
        status: 'approved',
        submitted_at: nowIso,
        reviewed_at: nowIso
      })
      .select()
      .single();

    if (insertResult.error) {
      alert(tdT('td_alert_claim_fail') + insertResult.error.message);
      return;
    }

    currentSubmissionRecord = insertResult.data;
    currentUserId = userId;

    markTaskDetailCompleted(taskId, userId);
    if (typeof window.coinrealmNotifySubmissionStatusChanged === 'function') {
      window.coinrealmNotifySubmissionStatusChanged({
        taskId: taskId,
        userId: userId,
        status: 'approved',
        path: 'completeSimpleTaskClaim'
      });
    }
    alert(tdT('td_alert_simple_claim_ok'));
  }

  async function performSimpleTaskClaim() {
    if (twitterClaimInProgress || !window.supabase || !currentTaskRecord || !isSimpleTaskRecord(currentTaskRecord)) return;

    var userId = await getAuthenticatedUserId();

    if (!userId) {
      alert(tdT('td_alert_login'));
      return;
    }

    var taskId = currentTaskRecord.id;

    if (typeof checkUserAlreadyRewardedForTask === 'function' &&
        await checkUserAlreadyRewardedForTask(taskId, userId)) {
      console.log('任务详情：简单任务已完成，禁止重复领取', { taskId: taskId, userId: userId });
      currentSubmissionRecord = typeof loadUserSubmissionForTask === 'function'
        ? await loadUserSubmissionForTask(taskId, userId)
        : currentSubmissionRecord;
      currentUserId = userId;
      markTaskDetailCompleted(taskId, userId);
      return;
    }

    if (currentSubmissionRecord) {
      alert(tdT('td_alert_already_claimed'));
      return;
    }

    if (isSimpleVerifiablePlatformTask(currentTaskRecord)) {
      twitterClaimInProgress = true;
      try {
        var inserted = await insertTwitterPendingSubmission(userId);
        if (!inserted) return;

        detailActionState = 'simple_subtasks';
        updateTaskDetailSubtaskModeUi();
        updateBottomActionBar();
        renderSubtasksPanel();
      } finally {
        twitterClaimInProgress = false;
      }
      return;
    }

    twitterClaimInProgress = true;
    try {
      await completeSimpleTaskClaim(userId);
    } finally {
      twitterClaimInProgress = false;
    }
  }

  window.coinrealmResumeTwitterTaskClaim = async function () {
    /* OAuth resume hook — not used in username-bind flow */
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function tdT(key, vars) {
    var dict = taskDetailTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function applyTaskDetailI18n() {
    document.querySelectorAll('#task-detail-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (taskDetailTranslations[getLang()][key]) {
        el.textContent = tdT(key);
      }
    });
    document.querySelectorAll('#task-detail-page [data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (taskDetailTranslations[getLang()][key]) {
        el.setAttribute('placeholder', tdT(key));
      }
    });
    if (document.getElementById('td-report-btn') || document.getElementById('td-report-modal')) {
      ensureReportButton();
      syncReportModalI18n();
    }
  }

  async function resolvePublisherGoogleAvatarUrl(publisherId) {
    if (!window.supabase || !publisherId) return '';
    try {
      var result = await window.supabase.auth.getSession();
      var session = result.data && result.data.session;
      if (!session || !session.user || String(session.user.id) !== String(publisherId)) {
        return '';
      }
      return (session.user.user_metadata && session.user.user_metadata.avatar_url) || '';
    } catch (e) {
      return '';
    }
  }

  async function renderPublisherAvatar(publisher, publisherName) {
    var avatarEl = document.querySelector('#task-detail-page .publisher-avatar');
    if (!avatarEl) return;

    var publisherUser = {
      id: publisher.id || (currentTaskRecord && currentTaskRecord.publisher_id),
      username: publisherName || publisher.username,
      email: publisher.email,
      wallet_address: publisher.wallet_address,
      avatar_url: publisher.avatar_url
    };

    var googleAvatarUrl = await resolvePublisherGoogleAvatarUrl(publisherUser.id);
    var avatarUrl = publisherUser.avatar_url || googleAvatarUrl || '';
    console.log('任务详情-发布者头像：', avatarUrl);

    if (typeof applyAvatarToElement === 'function') {
      applyAvatarToElement(avatarEl, publisherUser, 'css-avatar', { googleAvatarUrl: googleAvatarUrl });
    } else if (typeof buildAvatarHtml === 'function') {
      avatarEl.innerHTML = buildAvatarHtml(publisherUser, 'css-avatar', { googleAvatarUrl: googleAvatarUrl });
    }
  }

  async function renderTaskDetailPage() {
    var taskId = getTaskIdFromHash();
    if (!taskId) {
      window.location.hash = 'home';
      return;
    }

    if (!window.supabase) return;

    var taskResult = await window.supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskResult.error || !taskResult.data) {
      alert(getLang() === 'zh' ? '任务不存在' : 'Task not found');
      window.location.hash = 'home';
      return;
    }

    currentTaskRecord = taskResult.data;
    currentPublisherRecord = null;
    currentSubmissionRecord = null;
    currentUserId = null;
    subtaskUiState = {};
    subtaskFailReasons = {};
    verifyPanelActive = false;
    verifySubtaskIndex = null;
    verifyPanelSuccess = false;
    activeSubtaskKey = null;
    activeSubtaskIndex = null;
    resetProofUploadFiles();

    if (currentTaskRecord.publisher_id) {
      var publisherResult;
      if (typeof window.coinrealmFetchPublisherUser === 'function') {
        publisherResult = await window.coinrealmFetchPublisherUser(currentTaskRecord.publisher_id);
      } else {
        publisherResult = await window.supabase
          .from('users')
          .select('id, username, email, wallet_address, level, reputation_score, avatar_url')
          .eq('id', currentTaskRecord.publisher_id)
          .maybeSingle();
        console.log('发布者查询结果：', { data: publisherResult.data, error: publisherResult.error });
      }
      console.log('任务详情：查询发布者', {
        publisherId: currentTaskRecord.publisher_id,
        result: publisherResult
      });
      if (!publisherResult.error && publisherResult.data) {
        currentPublisherRecord = publisherResult.data;
      }
    }

    var userId = await getCurrentUserId();
    if (userId) {
      currentUserId = userId;

      var approvedResult = await window.supabase
        .from('submissions')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .eq('status', 'approved')
        .limit(1);

      var approvedList = approvedResult.data;
      var isCompleted = approvedList && approvedList.length > 0;

      console.log('任务详情页加载：', {
        taskId: taskId,
        userId: userId,
        approvedList: approvedList,
        isCompleted: isCompleted
      });

      if (isCompleted) {
        currentSubmissionRecord = { id: approvedList[0].id, status: 'approved' };
        detailActionState = isSimpleTaskRecord(currentTaskRecord) ? 'simple_completed' : 'approved';
      } else {
        var submissionsResult = await window.supabase
          .from('submissions')
          .select('id, status')
          .eq('task_id', taskId)
          .eq('user_id', userId);

        var submissions = submissionsResult.error ? [] : (submissionsResult.data || []);

        if (submissions.length) {
          var statusPriority = {
            submitted: 6,
            verifying: 5,
            pending: 4,
            claimed: 3,
            rejected: 2
          };
          submissions.sort(function (a, b) {
            var pa = statusPriority[a.status] || 0;
            var pb = statusPriority[b.status] || 0;
            return pb - pa;
          });
          currentSubmissionRecord = submissions[0];
        } else {
          currentSubmissionRecord = null;
        }

        detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
      }
    } else {
      detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
    }

    var publishedCount = 0;
    if (currentTaskRecord.publisher_id) {
      var countResult = await window.supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('publisher_id', currentTaskRecord.publisher_id);
      if (!countResult.error && countResult.count != null) {
        publishedCount = countResult.count;
      }
    }

    console.log('任务详情：底部按钮状态', {
      taskId: taskId,
      userId: currentUserId,
      detailActionState: detailActionState,
      submissionStatus: currentSubmissionRecord ? currentSubmissionRecord.status : null,
      submissionId: currentSubmissionRecord ? currentSubmissionRecord.id : null
    });

    var publisher = currentPublisherRecord || {};
    var publisherName = typeof window.coinrealmResolveUserDisplayName === 'function'
      ? window.coinrealmResolveUserDisplayName(publisher)
      : (publisher.username || displayNameFromEmail(publisher.email) || '未知发布者');
    console.log('任务详情：发布者显示名', { publisher: publisher, publisherName: publisherName });
    var publisherLevel = publisher.level != null ? publisher.level : 0;
    var reputationScore = publisher.reputation_score != null ? publisher.reputation_score : 0;

    var officialBadge = document.getElementById('td-official-badge');
    if (officialBadge) {
      if (currentTaskRecord.is_official) {
        officialBadge.classList.remove('hidden');
      } else {
        officialBadge.classList.add('hidden');
      }
    }

    var publisherNameEl = document.getElementById('td-publisher-name');
    if (publisherNameEl) publisherNameEl.textContent = publisherName;

    var publisherInfoLeft = document.querySelector('#task-detail-page .publisher-info-left');
    if (publisherInfoLeft && currentTaskRecord.publisher_id) {
      publisherInfoLeft.style.cursor = 'pointer';
      publisherInfoLeft.setAttribute('data-publisher-id', currentTaskRecord.publisher_id);
      if (!publisherInfoLeft.dataset.bound) {
        publisherInfoLeft.dataset.bound = 'true';
        publisherInfoLeft.addEventListener('click', function () {
          navigateToPublisher(currentTaskRecord.publisher_id);
        });
      }
    } else if (publisherInfoLeft) {
      publisherInfoLeft.style.cursor = '';
      publisherInfoLeft.removeAttribute('data-publisher-id');
    }

    var publisherLevelEl = document.getElementById('td-publisher-level');
    if (publisherLevelEl) {
      var levelLabel = publisherLevel >= 5 ? tdT('td_level_master') : '';
      publisherLevelEl.textContent = levelLabel
        ? 'Lv.' + publisherLevel + ' ' + levelLabel
        : 'Lv.' + publisherLevel;
    }

    await renderPublisherAvatar(publisher, publisherName);

    var completionRateEl = document.getElementById('td-completion-rate');
    if (completionRateEl) {
      completionRateEl.textContent = tdT('td_completion_rate', { rate: reputationScore });
    }

    var publishedCountEl = document.getElementById('td-published-count');
    if (publishedCountEl) {
      publishedCountEl.textContent = tdT('td_published_count', { count: publishedCount });
    }

    ensureReportUi();
    updateReportButtonVisibility();

    var taskTitleEl = document.getElementById('td-task-title');
    if (taskTitleEl) taskTitleEl.textContent = currentTaskRecord.title || '';

    var taskTypeEl = document.getElementById('td-task-type');
    if (taskTypeEl) {
      var taskType = currentTaskRecord.type || 'other';
      taskTypeEl.textContent = getTypeLabelText(taskType);
      taskTypeEl.className = 'td-type-label label-' + taskType;
    }

    var rewardAmountEl = document.getElementById('td-reward-amount');
    if (rewardAmountEl) {
      var rewardVal = Number(currentTaskRecord.reward_amount) || 0;
      var rewardUnit = currentTaskRecord.reward_type || 'CRLM';
      rewardAmountEl.textContent = rewardVal.toLocaleString('en-US') + ' ' + rewardUnit;
    }

    var descEl = document.getElementById('td-task-description');
    if (descEl) {
      var description = String(getTaskField(currentTaskRecord, ['description'], '') || '').trim();
      if (description.indexOf('\n') !== -1) {
        descEl.innerHTML = description.split('\n').filter(function (p) { return p.trim(); }).map(function (p) {
          return '<p>' + escapeHtml(p) + '</p>';
        }).join('');
      } else {
        descEl.innerHTML = description ? '<p>' + escapeHtml(description) + '</p>' : '<p class="td-empty-hint">' + escapeHtml(tdT('td_desc_empty')) + '</p>';
      }
    }

    renderTaskDetailImages(currentTaskRecord);

    var reqEl = document.getElementById('td-task-requirements');
    if (reqEl) {
      var reqs = parseRequirements(getTaskField(currentTaskRecord, ['requirements'], ''));
      if (reqs.length) {
        reqEl.innerHTML = reqs.map(function (r) {
          return '<li>' + escapeHtml(r) + '</li>';
        }).join('');
      } else {
        reqEl.innerHTML = '<li class="td-empty-hint">' + escapeHtml(tdT('td_req_empty')) + '</li>';
      }
    }

    var maxParticipants = currentTaskRecord.max_participants != null ? Number(currentTaskRecord.max_participants) : null;
    var currentParticipants = Number(currentTaskRecord.current_participants) || 0;
    var slotsLeft = maxParticipants != null ? Math.max(0, maxParticipants - currentParticipants) : null;
    var slotsTotal = maxParticipants != null ? maxParticipants : currentParticipants;

    var slotsTextEl = document.getElementById('td-slots-text');
    if (slotsTextEl) {
      slotsTextEl.textContent = maxParticipants != null
        ? slotsLeft + '/' + slotsTotal
        : String(currentParticipants);
    }

    var progressFill = document.getElementById('td-slots-progress-fill');
    if (progressFill) {
      if (maxParticipants != null && slotsTotal > 0) {
        var pct = (slotsLeft / slotsTotal) * 100;
        progressFill.style.width = pct + '%';
      } else {
        progressFill.style.width = '100%';
      }
    }

    var daysLeft = calcDaysLeft(currentTaskRecord.deadline);
    var deadlineTextEl = document.getElementById('td-deadline-text');
    if (deadlineTextEl) {
      deadlineTextEl.textContent = tdT('td_deadline', {
        days: daysLeft,
        date: formatDeadlineDate(currentTaskRecord.deadline)
      });
    }

    var stakedTextEl = document.getElementById('td-staked-text');
    if (stakedTextEl) {
      var rewardAmount = Number(currentTaskRecord.reward_amount) || 0;
      var depositAmount = currentTaskRecord.deposit_amount != null
        ? Number(currentTaskRecord.deposit_amount)
        : Math.round(rewardAmount * 0.2);
      var stakedTotal = currentTaskRecord.stake_amount != null
        ? Number(currentTaskRecord.stake_amount)
        : rewardAmount + depositAmount;
      stakedTextEl.textContent = currentTaskRecord.deposit_amount != null || currentTaskRecord.stake_amount != null
        ? tdT('td_staked', { total: stakedTotal, reward: rewardAmount, deposit: depositAmount })
        : tdT('td_staked_simple', { total: stakedTotal });
    }

    var highRiskTag = document.getElementById('td-high-risk-tag');
    if (highRiskTag) {
      if (currentTaskRecord.is_high_risk) {
        highRiskTag.classList.remove('hidden');
      } else {
        highRiskTag.classList.add('hidden');
      }
    }

    updatePinCard();
    applyTaskDetailI18n();
    syncTwitterVerifyUiState();
    initScreenshotVerifyPanel();
    updateBottomActionBar();
    initTaskDetailImageLightbox();
    initTaskDetailEvents();

    if ((new URLSearchParams(window.location.search).get('code') || new URLSearchParams(window.location.search).get('error'))
        && typeof window.coinrealmHandleDiscordOAuthReturn === 'function') {
      await window.coinrealmHandleDiscordOAuthReturn();
    }
    await tryResumeDiscordSubtaskVerification();
  }

  function renderTaskDetailImages(task) {
    var section = document.getElementById('td-task-images-section');
    var grid = document.getElementById('td-task-images-grid');
    if (!section || !grid) return;

    var urls = getTaskImageUrls(task);
    if (!urls.length) {
      section.classList.add('hidden');
      grid.innerHTML = '';
      return;
    }

    section.classList.remove('hidden');
    grid.innerHTML = urls.map(function (url, index) {
      return (
        '<button type="button" class="td-task-image-item" data-index="' + index + '" data-url="' + escapeHtml(url) + '">' +
          '<img src="' + escapeHtml(url) + '" alt=""' + taskImageErrorAttr() + '>' +
        '</button>'
      );
    }).join('');
  }

  function openTaskDetailImageLightbox(url) {
    var lightbox = document.getElementById('td-image-lightbox');
    var lightboxImg = document.getElementById('td-image-lightbox-img');
    if (!lightbox || !lightboxImg || !url) return;
    lightboxImg.src = url;
    lightboxImg.onerror = function () {
      handleTaskImageError(lightboxImg);
    };
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function initTaskDetailImageLightbox() {
    if (taskDetailImageLightboxInitialized) return;
    taskDetailImageLightboxInitialized = true;

    var lightbox = document.getElementById('td-image-lightbox');
    var lightboxImg = document.getElementById('td-image-lightbox-img');
    var grid = document.getElementById('td-task-images-grid');
    if (!lightbox || !lightboxImg || !grid) return;

    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.td-task-image-item');
      if (!item) return;
      var url = item.getAttribute('data-url');
      if (!url) return;
      lightboxImg.src = url;
      lightboxImg.onerror = function () {
        handleTaskImageError(lightboxImg);
      };
      lightbox.classList.remove('hidden');
      lightbox.setAttribute('aria-hidden', 'false');
    });

    lightbox.addEventListener('click', function () {
      lightbox.classList.add('hidden');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      lightboxImg.classList.remove('task-image-placeholder');
    });
  }

  function updatePinCard() {
    var pinCard = document.getElementById('td-pin-card');
    var pinStatus = document.getElementById('td-pin-status');
    if (!pinCard || !pinStatus) return;

    if (currentUserId && currentTaskRecord && currentUserId === currentTaskRecord.publisher_id) {
      pinCard.classList.remove('hidden');
      pinStatus.textContent = tdT('td_pin_not_pinned');
    } else {
      pinCard.classList.add('hidden');
    }
  }

  function getCurrentTaskProofType() {
    if (!currentTaskRecord) return 'screenshot';
    var proofType = getTaskField(currentTaskRecord, ['proof_type', 'proofType'], 'screenshot');
    return String(proofType || 'screenshot').toLowerCase() === 'text' ? 'text' : 'screenshot';
  }

  function getProofTextPlaceholder() {
    if (!currentTaskRecord) return tdT('td_proof_ph_default');
    var reqs = parseRequirements(getTaskField(currentTaskRecord, ['requirements'], ''));
    if (reqs.length && reqs[0]) return String(reqs[0]);
    return tdT('td_proof_ph_default');
  }

  function ensureProofTextInput() {
    var section = document.getElementById('td-proof-upload-section');
    if (!section) return null;

    var existing = document.getElementById('td-proof-text-input');
    if (existing) return existing;

    var textarea = document.createElement('textarea');
    textarea.id = 'td-proof-text-input';
    textarea.className = 'td-proof-text-input';
    textarea.setAttribute('rows', '4');

    var uploadZone = document.getElementById('td-proof-upload-zone');
    if (uploadZone) {
      section.insertBefore(textarea, uploadZone);
    } else {
      section.appendChild(textarea);
    }

    return textarea;
  }

  function shouldShowProofUploadSection() {
    if (!currentTaskRecord || isSimpleTaskRecord(currentTaskRecord)) return false;
    return detailActionState === 'go_submit' ||
      detailActionState === 'rejected_resubmit' ||
      detailActionState === 'waiting_review';
  }

  function resetProofUploadFiles() {
    proofUploadFiles.forEach(function (item) {
      if (item.localPreview) {
        try { URL.revokeObjectURL(item.localPreview); } catch (e) { /* ignore */ }
      }
    });
    proofUploadFiles = [];
    renderProofPreviewList();

    var textInput = document.getElementById('td-proof-text-input');
    if (textInput) textInput.value = '';
  }

  function renderProofPreviewList() {
    var listEl = document.getElementById('td-proof-preview-list');
    if (!listEl) return;

    listEl.innerHTML = proofUploadFiles.map(function (item) {
      var thumbSrc = item.url || item.localPreview || '';
      var progressHtml = item.uploading
        ? '<div class="td-proof-progress-wrap">' +
            '<div class="td-proof-progress-track"><div class="td-proof-progress-fill" style="width:' + (item.progress || 0) + '%"></div></div>' +
            '<div class="td-proof-progress-text">' + (item.progress || 0) + '%</div>' +
          '</div>'
        : '';

      return (
        '<div class="td-proof-preview-item" data-id="' + escapeHtml(item.id) + '">' +
          (thumbSrc
            ? '<img class="td-proof-preview-thumb" src="' + escapeHtml(thumbSrc) + '" alt="screenshot" data-preview-url="' + escapeHtml(thumbSrc) + '">'
            : '<div class="td-proof-preview-thumb"></div>') +
          (!item.uploading && item.url
            ? '<button type="button" class="td-proof-preview-delete" data-id="' + escapeHtml(item.id) + '" aria-label="Delete">&times;</button>'
            : '') +
          progressHtml +
        '</div>'
      );
    }).join('');

    listEl.querySelectorAll('.td-proof-preview-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var fileId = btn.getAttribute('data-id');
        proofUploadFiles = proofUploadFiles.filter(function (item) {
          if (String(item.id) === String(fileId) && item.localPreview) {
            try { URL.revokeObjectURL(item.localPreview); } catch (err) { /* ignore */ }
          }
          return String(item.id) !== String(fileId);
        });
        renderProofPreviewList();
      });
    });

    listEl.querySelectorAll('.td-proof-preview-thumb[data-preview-url]').forEach(function (img) {
      img.addEventListener('click', function () {
        openTaskDetailImageLightbox(img.getAttribute('data-preview-url'));
      });
    });
  }

  async function handleProofFilesSelected(fileList) {
    if (proofUploadInProgress || proofSubmitInProgress) return;

    var files = Array.from(fileList || []);
    if (!files.length) return;

    var remaining = MAX_PROOF_SCREENSHOT_FILES - proofUploadFiles.filter(function (item) {
      return item.url || item.uploading;
    }).length;

    if (remaining <= 0) {
      alert(tdT('td_proof_alert_max_files'));
      return;
    }

    if (files.length > remaining) {
      alert(tdT('td_proof_alert_max_files'));
      files = files.slice(0, remaining);
    }

    var userId = await getAuthenticatedUserId();
    if (!userId) {
      alert(tdT('td_alert_login'));
      return;
    }

    var uploadZone = document.getElementById('td-proof-upload-zone');
    proofUploadInProgress = true;
    if (uploadZone) uploadZone.classList.add('td-proof-uploading');

    try {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var validateFn = typeof window.coinrealmValidateProofScreenshotFile === 'function'
          ? window.coinrealmValidateProofScreenshotFile
          : null;
        if (validateFn) {
          var validationError = validateFn(file);
          if (validationError) {
            alert(validationError);
            continue;
          }
        }

        var itemId = 'proof_' + Date.now() + '_' + i;
        var localPreview = URL.createObjectURL(file);
        var uploadItem = {
          id: itemId,
          name: file.name,
          url: '',
          path: '',
          localPreview: localPreview,
          uploading: true,
          progress: 0
        };
        proofUploadFiles.push(uploadItem);
        renderProofPreviewList();

        var uploadFn = typeof window.coinrealmUploadProofScreenshotWithProgress === 'function'
          ? window.coinrealmUploadProofScreenshotWithProgress
          : (typeof window.coinrealmUploadProofScreenshot === 'function'
            ? window.coinrealmUploadProofScreenshot
            : null);

        if (!uploadFn) {
          alert(tdT('td_proof_alert_upload_fail') + 'upload unavailable');
          proofUploadFiles = proofUploadFiles.filter(function (item) { return String(item.id) !== String(itemId); });
          renderProofPreviewList();
          continue;
        }

        var uploadResult = await uploadFn(userId, file, function (progress) {
          uploadItem.progress = progress;
          renderProofPreviewList();
        });

        if (!uploadResult || !uploadResult.ok) {
          alert(tdT('td_proof_alert_upload_fail') + ((uploadResult && uploadResult.error) || 'unknown'));
          proofUploadFiles = proofUploadFiles.filter(function (item) { return String(item.id) !== String(itemId); });
          renderProofPreviewList();
          continue;
        }

        uploadItem.url = uploadResult.publicUrl;
        uploadItem.path = uploadResult.path;
        uploadItem.uploading = false;
        uploadItem.progress = 100;
        renderProofPreviewList();
      }
    } finally {
      proofUploadInProgress = false;
      if (uploadZone) uploadZone.classList.remove('td-proof-uploading');
    }
  }

  function updateRejectionBanner() {
    var proofSection = document.getElementById('td-proof-upload-section');
    if (!proofSection) return;

    var existing = document.getElementById('td-rejection-banner');
    var shouldShow = detailActionState === 'rejected_resubmit' &&
      currentSubmissionRecord &&
      currentSubmissionRecord.review_comment;

    if (!shouldShow) {
      if (existing) existing.remove();
      return;
    }

    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'td-rejection-banner';
      existing.className = 'td-rejection-banner';
      proofSection.parentNode.insertBefore(existing, proofSection);
    }

    existing.style.color = '#ff4d4f';
    existing.style.fontSize = '14px';
    existing.style.lineHeight = '1.6';
    existing.style.marginBottom = '12px';
    existing.textContent = tdT('td_reject_reason_label') + String(currentSubmissionRecord.review_comment);
  }

  function updateProofUploadSectionUI() {
    var section = document.getElementById('td-proof-upload-section');
    var uploadZone = document.getElementById('td-proof-upload-zone');
    var previewList = document.getElementById('td-proof-preview-list');
    var fileInput = document.getElementById('td-proof-file-input');
    var submitBtn = document.getElementById('td-proof-submit-btn');
    var textInput = ensureProofTextInput();
    if (!section) return;

    if (!shouldShowProofUploadSection()) {
      section.classList.add('hidden');
      updateRejectionBanner();
      return;
    }

    section.classList.remove('hidden');

    var proofType = getCurrentTaskProofType();
    var isTextProof = proofType === 'text';
    var isWaiting = detailActionState === 'waiting_review';

    if (textInput) {
      textInput.classList.toggle('hidden', !isTextProof || isWaiting);
      if (isTextProof && !isWaiting) {
        textInput.placeholder = getProofTextPlaceholder();
        if (currentSubmissionRecord && currentSubmissionRecord.description && !textInput.value) {
          textInput.value = String(currentSubmissionRecord.description);
        }
      }
    }

    if (uploadZone) {
      uploadZone.classList.toggle('hidden', isWaiting || isTextProof);
    }

    if (previewList) {
      previewList.classList.toggle('hidden', isTextProof);
    }

    if (fileInput && isTextProof) {
      fileInput.value = '';
    }

    if (submitBtn) {
      if (isWaiting) {
        submitBtn.disabled = true;
        submitBtn.textContent = tdT('td_proof_waiting');
      } else {
        submitBtn.disabled = proofSubmitInProgress;
        submitBtn.textContent = tdT('td_proof_submit');
      }
      submitBtn.classList.remove('hidden');
    }

    updateRejectionBanner();
  }

  async function submitProofFromDetailPage() {
    if (proofSubmitInProgress || proofUploadInProgress) return;
    if (!currentTaskRecord || !currentSubmissionRecord) return;

    if (detailActionState === 'waiting_review') return;

    var proofType = getCurrentTaskProofType();
    var isTextProof = proofType === 'text';
    var textInput = document.getElementById('td-proof-text-input');
    var description = isTextProof && textInput ? String(textInput.value || '').trim() : '';
    var uploadedUrls = [];

    if (isTextProof) {
      if (!description) {
        alert(tdT('td_proof_alert_need_text'));
        return;
      }
    } else {
      uploadedUrls = proofUploadFiles
        .filter(function (item) { return item.url && !item.uploading; })
        .map(function (item) { return item.url; });

      if (!uploadedUrls.length) {
        alert(tdT('td_proof_alert_need_image'));
        return;
      }
    }

    var userId = await getAuthenticatedUserId();
    if (!userId) {
      alert(tdT('td_alert_login'));
      return;
    }

    proofSubmitInProgress = true;
    var submitBtn = document.getElementById('td-proof-submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    try {
      var submitFn;
      if (currentSubmissionRecord.status === 'rejected' &&
          typeof window.coinrealmResubmitRegularTaskProof === 'function') {
        submitFn = window.coinrealmResubmitRegularTaskProof;
      } else if (typeof window.coinrealmSubmitTaskProof === 'function') {
        submitFn = window.coinrealmSubmitTaskProof;
      } else {
        alert(tdT('td_proof_alert_submit_fail') + 'submit unavailable');
        return;
      }

      var result = await submitFn({
        taskId: currentTaskRecord.id,
        userId: userId,
        description: description,
        screenshotUrls: uploadedUrls,
        submission: currentSubmissionRecord,
        taskTitle: currentTaskRecord.title || '',
        taskReward: currentTaskRecord.reward_amount || 0,
        requireDescription: isTextProof,
        proofType: proofType,
        path: currentSubmissionRecord.status === 'rejected'
          ? 'task-detail-proof-resubmit'
          : 'task-detail-proof-submit'
      });

      if (!result.ok) {
        if (result.error === 'already_submitted' || result.error === 'waiting_review') {
          currentSubmissionRecord = Object.assign({}, currentSubmissionRecord, {
            status: 'submitted'
          });
          detailActionState = 'waiting_review';
          updateBottomActionBar();
          updateProofUploadSectionUI();
          return;
        }
        if (result.error === 'already_rewarded' || result.error === 'already_approved') {
          markTaskDetailCompleted(currentTaskRecord.id, userId);
          return;
        }
        if (result.error === 'description_required') {
          alert(tdT('td_proof_alert_need_text'));
          return;
        }
        if (result.error === 'screenshot_required') {
          alert(tdT('td_proof_alert_need_image'));
          return;
        }
        alert(tdT('td_proof_alert_submit_fail') + (result.error || 'unknown'));
        return;
      }

      currentSubmissionRecord = result.submission;
      resetProofUploadFiles();

      if (result.submissionStatus === 'approved') {
        markTaskDetailCompleted(currentTaskRecord.id, userId);
      } else {
        detailActionState = 'waiting_review';
        updateBottomActionBar();
        updateProofUploadSectionUI();
      }
    } finally {
      proofSubmitInProgress = false;
      updateProofUploadSectionUI();
    }
  }

  function initProofUploadSection() {
    if (proofUploadInitialized) return;
    proofUploadInitialized = true;

    var uploadZone = document.getElementById('td-proof-upload-zone');
    var fileInput = document.getElementById('td-proof-file-input');
    var submitBtn = document.getElementById('td-proof-submit-btn');

    if (uploadZone && fileInput) {
      uploadZone.addEventListener('click', function () {
        if (detailActionState === 'waiting_review') return;
        fileInput.click();
      });
      uploadZone.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (detailActionState !== 'waiting_review') fileInput.click();
        }
      });
      uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadZone.classList.add('td-proof-dragover');
      });
      uploadZone.addEventListener('dragleave', function () {
        uploadZone.classList.remove('td-proof-dragover');
      });
      uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadZone.classList.remove('td-proof-dragover');
        if (detailActionState === 'waiting_review') return;
        handleProofFilesSelected(e.dataTransfer && e.dataTransfer.files);
      });
      fileInput.addEventListener('change', function () {
        handleProofFilesSelected(fileInput.files);
        fileInput.value = '';
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        submitProofFromDetailPage();
      });
    }
  }

  function configureActionButton(btn, config) {
    if (!btn) return;
    btn.classList.remove(
      'hidden',
      'td-btn-gold',
      'td-btn-blue',
      'td-btn-gray',
      'td-btn-green',
      'td-btn-orange',
      'td-btn-disabled',
      'td-btn-with-spinner'
    );
    btn.classList.add(config.styleClass);
    if (config.html) {
      btn.innerHTML = config.html;
    } else {
      btn.textContent = config.text;
    }
    btn.disabled = !!config.disabled;
    if (config.withSpinner) {
      btn.classList.add('td-btn-with-spinner');
    }
  }

  function getSimpleSubtaskBottomBarConfig() {
    var total = currentTaskRecord ? buildSubtasksFromTask(currentTaskRecord).length : 0;
    var done = countCompletedSubtasks();
    var remaining = Math.max(0, total - done);

    if (allSubtasksMarkedDone()) {
      return {
        styleClass: 'td-btn-gold',
        text: tdT('td_btn_submit_task'),
        disabled: false
      };
    }

    return {
      styleClass: 'td-btn-disabled',
      text: tdT('td_btn_subtasks_remaining', { count: remaining }),
      disabled: true
    };
  }

  function updateBottomActionBar() {
    var buttons = {
      claim: document.getElementById('td-btn-claim'),
      submit: document.getElementById('td-btn-submit'),
      manage: document.getElementById('td-btn-manage'),
      level: document.getElementById('td-btn-level'),
      ended: document.getElementById('td-btn-ended')
    };

    Object.keys(buttons).forEach(function (key) {
      if (buttons[key]) buttons[key].classList.add('hidden');
    });

    switch (detailActionState) {
      case 'not_logged_in':
        configureActionButton(buttons.level, {
          styleClass: 'td-btn-disabled',
          text: tdT('td_btn_login'),
          disabled: true
        });
        break;
      case 'can_claim':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-gold',
          text: tdT('td_btn_claim_now'),
          disabled: false
        });
        break;
      case 'simple_can_claim':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-gold',
          text: tdT('td_btn_simple_claim'),
          disabled: false
        });
        break;
      case 'simple_subtasks':
      case 'simple_retry':
        configureActionButton(buttons.claim, getSimpleSubtaskBottomBarConfig());
        break;
      case 'simple_go_twitter':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-blue',
          text: tdT('td_btn_go_twitter'),
          disabled: false
        });
        break;
      case 'simple_waiting_action':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-blue',
          text: tdT('td_btn_waiting_action'),
          disabled: true
        });
        break;
      case 'simple_verifying':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-blue',
          text: tdT('td_btn_waiting_action'),
          disabled: true
        });
        break;
      case 'simple_verify_checking':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-blue',
          html: buildTdSpinnerButtonHtml('td_btn_simple_checking'),
          disabled: true,
          withSpinner: true
        });
        break;
      case 'simple_retry':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-orange',
          text: tdT('td_btn_simple_retry'),
          disabled: false
        });
        break;
      case 'simple_completed':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-green',
          text: tdT('td_btn_simple_done'),
          disabled: true
        });
        break;
      case 'go_submit':
        break;
      case 'rejected_resubmit':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-orange',
          text: tdT('td_btn_rejected'),
          disabled: false
        });
        break;
      case 'waiting_review':
        configureActionButton(buttons.ended, {
          styleClass: 'td-btn-disabled',
          text: tdT('td_btn_waiting'),
          disabled: true
        });
        break;
      case 'approved':
        configureActionButton(buttons.ended, {
          styleClass: 'td-btn-disabled',
          text: tdT('td_btn_simple_done'),
          disabled: true
        });
        break;
      case 'manage_task':
        configureActionButton(buttons.manage, {
          styleClass: 'td-btn-gray',
          text: tdT('td_btn_manage'),
          disabled: false
        });
        break;
      case 'ended':
      default:
        configureActionButton(buttons.ended, {
          styleClass: 'td-btn-disabled',
          text: tdT('td_btn_ended'),
          disabled: true
        });
        break;
    }

    updateProofUploadSectionUI();
  }

  function ensureReportStyles() {
    if (document.getElementById('coinrealm-report-styles')) return;
    var style = document.createElement('style');
    style.id = 'coinrealm-report-styles';
    style.textContent = [
      '.publisher-info-card { position: relative; }',
      '.td-report-btn {',
      '  position: absolute; top: 10px; right: 12px; z-index: 2;',
      '  margin: 0; padding: 0; border: none; background: transparent;',
      '  color: #999; font-size: 12px; line-height: 1.2; cursor: pointer;',
      '  font-family: inherit;',
      '}',
      '.td-report-btn:hover { color: #e74c3c; }',
      '.publisher-info-card.td-has-official-badge .td-report-btn { top: 34px; }',
      '#td-report-modal .td-report-field { margin-bottom: 14px; }',
      '#td-report-modal .td-report-label {',
      '  display: block; margin-bottom: 6px; font-size: 13px; color: #555; font-weight: 600;',
      '}',
      '#td-report-modal .td-report-select,',
      '#td-report-modal .td-report-textarea {',
      '  width: 100%; box-sizing: border-box; border: 1px solid #ddd; border-radius: 8px;',
      '  padding: 10px 12px; font-size: 14px; font-family: inherit; background: #fff;',
      '}',
      '#td-report-modal .td-report-textarea { min-height: 88px; resize: vertical; }',
      '#td-report-modal .td-report-actions {',
      '  display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px;',
      '}',
      '#td-report-modal .td-report-cancel-btn {',
      '  min-height: 40px; padding: 0 16px; border-radius: 8px; border: 1px solid #ddd;',
      '  background: #f5f5f5; color: #333; cursor: pointer; font-size: 14px;',
      '}',
      '#td-report-modal .td-report-submit-btn {',
      '  min-height: 40px; padding: 0 16px; border-radius: 8px; border: none;',
      '  background: #e74c3c; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600;',
      '}',
      '#td-report-modal .td-report-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }',
      '.my-task-report-tag {',
      '  display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px;',
      '  font-size: 12px; font-weight: 600; line-height: 1.4;',
      '}',
      '.my-task-report-pending { background: #fff7e6; color: #d48806; }',
      '.my-task-report-approved { background: #f6ffed; color: #389e0d; }',
      '.my-task-report-rejected { background: #f5f5f5; color: #8c8c8c; }',
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
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function getReportReasonOptions() {
    return [
      { value: '虚假任务', key: 'td_report_reason_fake' },
      { value: '诈骗/钓鱼', key: 'td_report_reason_scam' },
      { value: '内容违规', key: 'td_report_reason_illegal' },
      { value: '任务无法完成', key: 'td_report_reason_impossible' },
      { value: '发布者不审核', key: 'td_report_reason_no_review' },
      { value: '其他', key: 'td_report_reason_other' }
    ];
  }

  function ensureReportModal() {
    var existing = document.getElementById('td-report-modal');
    var modal = existing;
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'td-report-modal';
      modal.className = 'td-twitter-modal hidden';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML =
        '<div class="td-twitter-modal-overlay" id="td-report-overlay"></div>' +
        '<div class="td-twitter-modal-panel" role="dialog" aria-modal="true" aria-labelledby="td-report-title">' +
          '<h3 id="td-report-title" class="td-twitter-modal-title"></h3>' +
          '<div class="td-report-field">' +
            '<label class="td-report-label" for="td-report-reason" id="td-report-reason-label"></label>' +
            '<select id="td-report-reason" class="td-report-select"></select>' +
          '</div>' +
          '<div class="td-report-field">' +
            '<label class="td-report-label" for="td-report-desc" id="td-report-desc-label"></label>' +
            '<textarea id="td-report-desc" class="td-report-textarea" rows="4"></textarea>' +
          '</div>' +
          '<div class="td-report-actions">' +
            '<button type="button" id="td-report-cancel" class="td-report-cancel-btn"></button>' +
            '<button type="button" id="td-report-submit" class="td-report-submit-btn"></button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    if (!modal.dataset.reportBound) {
      modal.dataset.reportBound = '1';
      var overlay = document.getElementById('td-report-overlay') || modal.querySelector('.td-twitter-modal-overlay');
      var cancelBtn = document.getElementById('td-report-cancel');
      var submitBtn = document.getElementById('td-report-submit');
      if (overlay) overlay.addEventListener('click', closeReportModal);
      if (cancelBtn) cancelBtn.addEventListener('click', closeReportModal);
      if (submitBtn) submitBtn.addEventListener('click', submitTaskReport);
    }

    syncReportModalI18n();
    return modal;
  }

  function syncReportModalI18n() {
    var title = document.getElementById('td-report-title');
    var reasonLabel = document.getElementById('td-report-reason-label');
    var descLabel = document.getElementById('td-report-desc-label');
    var desc = document.getElementById('td-report-desc');
    var cancelBtn = document.getElementById('td-report-cancel');
    var submitBtn = document.getElementById('td-report-submit');
    var reasonSelect = document.getElementById('td-report-reason');

    if (title) title.textContent = tdT('td_report_title');
    if (reasonLabel) reasonLabel.textContent = tdT('td_report_reason_label');
    if (descLabel) descLabel.textContent = tdT('td_report_desc_label');
    if (desc) desc.placeholder = tdT('td_report_desc_ph');
    if (cancelBtn) cancelBtn.textContent = tdT('td_report_cancel');
    if (submitBtn) submitBtn.textContent = tdT('td_report_submit');

    if (reasonSelect) {
      var current = reasonSelect.value;
      reasonSelect.innerHTML = '<option value="">' + escapeHtml(tdT('td_report_reason_label')) + '</option>' +
        getReportReasonOptions().map(function (opt) {
          return '<option value="' + escapeHtml(opt.value) + '">' + escapeHtml(tdT(opt.key)) + '</option>';
        }).join('');
      if (current) reasonSelect.value = current;
    }
  }

  function ensureReportButton() {
    var card = document.querySelector('#task-detail-page .publisher-info-card');
    if (!card) return null;

    var btn = document.getElementById('td-report-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'td-report-btn';
      btn.className = 'td-report-btn';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openReportModal();
      });
      card.appendChild(btn);
    }
    btn.textContent = tdT('td_report_btn');
    return btn;
  }

  function ensureReportUi() {
    ensureReportStyles();
    ensureReportModal();
    ensureReportButton();
  }

  window.coinrealmEnsureTaskReportUi = ensureReportUi;

  function updateReportButtonVisibility() {
    var btn = document.getElementById('td-report-btn');
    var card = document.querySelector('#task-detail-page .publisher-info-card');
    if (!btn || !card || !currentTaskRecord) return;

    var officialBadge = document.getElementById('td-official-badge');
    var hasOfficial = officialBadge && !officialBadge.classList.contains('hidden');
    card.classList.toggle('td-has-official-badge', !!hasOfficial);

    var isOwnTask = !!(currentUserId && currentTaskRecord.publisher_id &&
      String(currentUserId) === String(currentTaskRecord.publisher_id));
    btn.classList.toggle('hidden', isOwnTask);
  }

  function openReportModal() {
    if (!currentTaskRecord || !currentTaskRecord.id) return;

    ensureReportUi();
    syncReportModalI18n();

    var reasonSelect = document.getElementById('td-report-reason');
    var desc = document.getElementById('td-report-desc');
    if (reasonSelect) reasonSelect.value = '';
    if (desc) desc.value = '';

    showTwitterModal('td-report-modal');
  }

  function closeReportModal() {
    hideTwitterModal('td-report-modal');
  }

  function isReportsTableMissingError(error) {
    if (!error) return false;
    var msg = String(error.message || error.details || error.hint || '').toLowerCase();
    var code = String(error.code || '');
    return code === '42P01' || code === 'PGRST205' ||
      msg.indexOf('reports') !== -1 && (msg.indexOf('does not exist') !== -1 || msg.indexOf('schema cache') !== -1 || msg.indexOf('could not find') !== -1);
  }

  async function submitTaskReport() {
    if (!currentTaskRecord || !currentTaskRecord.id || !window.supabase) return;

    var userId = typeof getAuthenticatedUserId === 'function'
      ? await getAuthenticatedUserId()
      : await getCurrentUserId();
    if (!userId) {
      alert(tdT('td_report_login'));
      return;
    }

    if (currentTaskRecord.publisher_id && String(currentTaskRecord.publisher_id) === String(userId)) {
      alert(tdT('td_report_own'));
      return;
    }

    var reasonSelect = document.getElementById('td-report-reason');
    var descEl = document.getElementById('td-report-desc');
    var reason = reasonSelect ? reasonSelect.value.trim() : '';
    var description = descEl ? descEl.value.trim() : '';
    if (!reason) {
      alert(tdT('td_report_need_reason'));
      return;
    }

    var submitBtn = document.getElementById('td-report-submit');
    if (submitBtn) submitBtn.disabled = true;

    try {
      var existing = await window.supabase
        .from('reports')
        .select('id, status')
        .eq('task_id', currentTaskRecord.id)
        .eq('reporter_id', userId)
        .limit(1);

      if (existing.error) {
        if (isReportsTableMissingError(existing.error)) {
          alert(tdT('td_report_no_table'));
        } else {
          alert(tdT('td_report_fail') + existing.error.message);
        }
        return;
      }

      if (existing.data && existing.data.length) {
        alert(tdT('td_report_already'));
        closeReportModal();
        return;
      }

      var insertResult = await window.supabase
        .from('reports')
        .insert({
          task_id: currentTaskRecord.id,
          reporter_id: userId,
          reason: reason,
          description: description || null,
          status: 'pending'
        })
        .select('id')
        .single();

      if (insertResult.error) {
        if (isReportsTableMissingError(insertResult.error)) {
          alert(tdT('td_report_no_table'));
        } else {
          alert(tdT('td_report_fail') + insertResult.error.message);
        }
        return;
      }

      alert(tdT('td_report_success'));
      closeReportModal();
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  function initTaskDetailEvents() {
    if (taskDetailInitialized) return;
    taskDetailInitialized = true;

    var claimBtn = document.getElementById('td-btn-claim');
    if (claimBtn) {
      claimBtn.addEventListener('click', function () {
        if (detailActionState === 'simple_can_claim') {
          performSimpleTaskClaim();
        } else if (detailActionState === 'simple_subtasks' || detailActionState === 'simple_retry') {
          if (allSubtasksMarkedDone()) {
            submitSimpleTwitterTask();
          }
        } else if (detailActionState === 'can_claim') {
          performClaimTask();
        } else if (detailActionState === 'rejected_resubmit') {
          var proofSection = document.getElementById('td-proof-upload-section');
          if (proofSection) {
            proofSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }

    var subtasksList = document.getElementById('td-subtasks-list');
    if (subtasksList && !subtasksList.dataset.bound) {
      subtasksList.dataset.bound = '1';
      subtasksList.addEventListener('click', function (e) {
        var btn = e.target.closest('.td-subtask-btn-go, .td-subtask-btn-retry');
        if (!btn || btn.disabled) return;
        var index = parseInt(btn.getAttribute('data-subtask-index'), 10);
        if (Number.isNaN(index)) return;
        if (btn.classList.contains('td-subtask-btn-retry')) {
          if (usesTelegramWorkerVerification(currentTaskRecord)) {
            runTelegramSubtaskVerification(index);
          } else if (usesDiscordWorkerVerification(currentTaskRecord)) {
            runDiscordSubtaskVerification(index);
          }
          return;
        }
        handleSubtaskGo(index);
      });
    }

    var submitBtn = document.getElementById('td-btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var proofSection = document.getElementById('td-proof-upload-section');
        if (proofSection && shouldShowProofUploadSection()) {
          proofSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    initProofUploadSection();

    var manageBtn = document.getElementById('td-btn-manage');
    if (manageBtn) {
      manageBtn.addEventListener('click', function () {
        window.location.hash = 'review';
      });
    }
  }

  function initPinPackageSelection() {
    var packageBtns = document.querySelectorAll('#task-detail-page .pin-package-btn');
    packageBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        packageBtns.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
      });
    });
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      initPinPackageSelection();
      taskDetailInitialized = false;
      taskDetailImageLightboxInitialized = false;
    }
  }

  function showPageByRoute(route) {
    restoreAppContentIfNeeded();

    var homePage = document.getElementById('home-page');
    var taskDetailPage = document.getElementById('task-detail-page');

    if (taskDetailPage) taskDetailPage.classList.add('hidden');

    if (route === 'task-detail') {
      if (homePage) homePage.classList.add('hidden');
      if (taskDetailPage) {
        taskDetailPage.classList.remove('hidden');
        renderTaskDetailPage();
      }
    } else if (route === 'home') {
      if (homePage) homePage.classList.remove('hidden');
      if (typeof initHomePageLogic === 'function') initHomePageLogic();
      if (typeof applyLanguageStrings === 'function') applyLanguageStrings();
    }
  }

  function handleTaskDetailRoute() {
    showPageByRoute(getRouteName());
  }

  initPinPackageSelection();

  window.addEventListener('hashchange', handleTaskDetailRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleTaskDetailRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(function () {
        var route = getRouteName();
        if (route === 'task-detail') {
          renderTaskDetailPage();
        } else {
          handleTaskDetailRoute();
        }
      }, 0);
    });
  }
})();

