// ==========================================
// 6. 发布任务页 (#create-task) — 任务卡 #004
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var userLevel = 0;
  var userBalance = 500;
  var ctUploadedImages = [];
  var ctImageUploadInProgress = false;
  var ctImageUploadSeq = 0;
  var CT_MAX_IMAGES = 3;
  var CT_MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  var CT_ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
  var CT_PLATFORM_COMMISSION = 0.15;

  var CT_SOCIAL_PLATFORMS = {
    twitter: {
      actions: [
        { value: 'follow', labelKey: 'ct_action_twitter_follow' },
        { value: 'like', labelKey: 'ct_action_twitter_like' },
        { value: 'retweet', labelKey: 'ct_action_twitter_retweet' },
        { value: 'reply', labelKey: 'ct_action_twitter_reply', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_twitter'
    },
    telegram: {
      actions: [
        { value: 'join', labelKey: 'ct_action_telegram_join' },
        { value: 'follow', labelKey: 'ct_action_telegram_follow' },
        { value: 'message', labelKey: 'ct_action_telegram_message', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_telegram'
    },
    discord: {
      actions: [
        { value: 'join', labelKey: 'ct_action_discord_join' },
        { value: 'message', labelKey: 'ct_action_discord_message', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_discord'
    },
    youtube: {
      actions: [
        { value: 'subscribe', labelKey: 'ct_action_youtube_subscribe' },
        { value: 'like', labelKey: 'ct_action_youtube_like' },
        { value: 'comment', labelKey: 'ct_action_youtube_comment', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_youtube'
    },
    github: {
      actions: [
        { value: 'star', labelKey: 'ct_action_github_star' },
        { value: 'fork', labelKey: 'ct_action_github_fork' },
        { value: 'follow', labelKey: 'ct_action_github_follow' }
      ],
      targetPlaceholderKey: 'ct_ph_target_github'
    },
    tiktok: {
      actions: [
        { value: 'follow', labelKey: 'ct_action_tiktok_follow' },
        { value: 'like', labelKey: 'ct_action_tiktok_like' },
        { value: 'comment', labelKey: 'ct_action_tiktok_comment', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_tiktok'
    },
    instagram: {
      actions: [
        { value: 'follow', labelKey: 'ct_action_instagram_follow' },
        { value: 'like', labelKey: 'ct_action_instagram_like' },
        { value: 'comment', labelKey: 'ct_action_instagram_comment', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_instagram'
    },
    reddit: {
      actions: [
        { value: 'join', labelKey: 'ct_action_reddit_join' },
        { value: 'like', labelKey: 'ct_action_reddit_like' },
        { value: 'comment', labelKey: 'ct_action_reddit_comment', needsKeyword: true }
      ],
      targetPlaceholderKey: 'ct_ph_target_reddit'
    }
  };

  var createTaskTranslations = {
    zh: {
      ct_page_title: '发布任务',
      ct_label_title: '任务标题',
      ct_label_type: '任务类型',
      ct_label_desc: '任务描述',
      ct_label_req: '任务要求',
      ct_label_reward_type: '奖励类型',
      ct_label_reward_amount: '奖励金额',
      ct_label_slots: '任务名额',
      ct_label_deadline: '截止时间',
      ct_label_proof: '凭证要求',
      ct_label_images: '任务图片',
      ct_ph_title: '请输入任务标题',
      ct_ph_desc: '请详细描述任务内容和要求',
      ct_ph_desc_simple: '请简单描述任务内容，如“关注 @CoinRealm_X”',
      ct_ph_req: '请输入任务要求',
      ct_ph_req_simple: '如“关注后截图上传”',
      ct_label_platform: '任务平台',
      ct_platform_select: '请选择平台',
      ct_platform_twitter: 'Twitter (X)',
      ct_platform_telegram: 'Telegram',
      ct_platform_discord: 'Discord',
      ct_platform_youtube: 'YouTube',
      ct_platform_github: 'GitHub',
      ct_platform_tiktok: 'TikTok',
      ct_platform_instagram: 'Instagram',
      ct_platform_reddit: 'Reddit',
      ct_label_action: '任务动作',
      ct_toggle_follow: '关注',
      ct_toggle_like: '点赞',
      ct_toggle_reply: '评论',
      ct_toggle_tg_join: '加入群组',
      ct_toggle_tg_follow: '关注频道',
      ct_toggle_tg_message: '发送消息',
      ct_toggle_dc_join: '加入服务器',
      ct_toggle_dc_message: '发送消息',
      ct_label_target_dc_invite: '服务器邀请链接',
      ct_ph_target_dc_invite: '请输入服务器邀请链接，如 https://discord.gg/xxx',
      ct_ph_keyword_dc_message: '消息中需包含的关键词（可选）',
      ct_alert_discord_actions_required: '请至少选择一项 Discord 任务动作',
      ct_alert_discord_target_required: '请填写 Discord 服务器邀请链接',
      ct_label_target_tg_join: '加入群组',
      ct_label_target_tg_follow: '关注频道',
      ct_label_target_tg_message: '发送消息',
      ct_ph_target_tg_join: '请输入群组链接，如 https://t.me/xxx',
      ct_ph_target_tg_follow: '请输入频道链接，如 https://t.me/xxx',
      ct_ph_target_tg_message: '请输入群组链接',
      ct_ph_keyword_tg_message: '要求的关键词（可选）',
      ct_alert_telegram_actions_required: '请至少选择一项 Telegram 任务动作',
      ct_alert_telegram_target_required: '请填写所有已选动作对应的目标',
      ct_label_target_follow: '关注目标',
      ct_label_target_like: '点赞目标',
      ct_label_target_reply: '评论目标',
      ct_ph_target_follow: '请输入 Twitter 用户名，如 @CoinRealm_X',
      ct_ph_target_like: '请输入推文链接',
      ct_ph_target_reply: '请输入推文链接，并可选填写要求的关键词',
      ct_ph_keyword_reply: '要求的关键词（可选）',
      ct_alert_twitter_actions_required: '请至少选择一项 Twitter 任务动作',
      ct_alert_twitter_target_required: '请填写所有已选动作对应的目标',
      ct_label_target: '目标',
      ct_label_keyword: '关键词',
      ct_ph_target: '请输入目标链接或账号',
      ct_ph_keyword: '请输入关键词（可选）',
      ct_keyword_hint: '仅回复/评论/发送消息类任务需要填写',
      ct_ph_target_twitter: '账号名或推文链接',
      ct_ph_target_telegram: '群组/频道链接',
      ct_ph_target_discord: '服务器邀请链接',
      ct_ph_target_youtube: '频道链接或视频链接',
      ct_ph_target_github: '仓库链接或用户主页链接',
      ct_ph_target_tiktok: '账号链接或视频链接',
      ct_ph_target_instagram: '账号链接或帖子链接',
      ct_ph_target_reddit: '社区链接或帖子链接',
      ct_action_twitter_follow: '关注账号',
      ct_action_twitter_like: '点赞推文',
      ct_action_twitter_retweet: '转发推文',
      ct_action_twitter_reply: '回复推文',
      ct_action_telegram_join: '加入群组',
      ct_action_telegram_follow: '关注频道',
      ct_action_telegram_message: '发送消息',
      ct_action_discord_join: '加入服务器',
      ct_action_discord_message: '发送消息',
      ct_action_youtube_subscribe: '订阅频道',
      ct_action_youtube_like: '点赞视频',
      ct_action_youtube_comment: '评论视频',
      ct_action_github_star: 'Star 仓库',
      ct_action_github_fork: 'Fork 仓库',
      ct_action_github_follow: 'Follow 用户',
      ct_action_tiktok_follow: '关注账号',
      ct_action_tiktok_like: '点赞视频',
      ct_action_tiktok_comment: '评论视频',
      ct_action_instagram_follow: '关注账号',
      ct_action_instagram_like: '点赞帖子',
      ct_action_instagram_comment: '评论帖子',
      ct_action_reddit_join: '加入社区',
      ct_action_reddit_like: '点赞帖子',
      ct_action_reddit_comment: '评论帖子',
      ct_sql_title: '若发布失败提示缺少字段，请在 Supabase 运行：',
      ct_alert_platform_required: '请选择任务平台并填写动作与目标',
      ct_alert_keyword_required: '请填写关键词',
      ct_type_simple: '简单任务',
      ct_ph_reward: '请输入奖励金额',
      ct_ph_slots: '请输入名额（留空则不限）',
      ct_type_other: '其他',
      ct_add_req: '+ 添加要求',
      ct_proof_text: '文字凭证',
      ct_proof_screenshot: '截图凭证',
      ct_stake_note: '仅 Lv.3 及以上用户可发布任务。',
      ct_stake_hint: '发布此任务需质押 {amount} CRLM（扣除佣金后奖励的 20% 押金），任务完成后押金退还。',
      ct_stake_hint_usdt: '发布此任务需质押 {amount} USDT（扣除佣金后奖励的 20% 押金），任务完成后押金退还。',
      ct_unit_price: '任务单价：约 {amount} {unit}',
      ct_deadline_hint: '⏰ 超时审核将自动通过。若多次超时未审核，发布权限可能被暂停。',
      ct_btn_submit: '确认发布',
      ct_btn_balance: '余额不足，请先兑换 CRLM',
      ct_btn_level: '等级不足（需 Lv.3 以上）',
      ct_agreement: '点击发布即表示同意 CoinRealm 发布规则',
      ct_alert_required: '请填写所有必填字段',
      ct_alert_success: '任务发布成功！',
      ct_alert_login: '请先登录后再发布任务',
      ct_alert_fail: '发布失败：',
      ct_alert_max_images: '最多上传 3 张图片',
      ct_alert_invalid_image: '仅支持 JPG、PNG、WebP 格式',
      ct_alert_image_size: '单张图片不能超过 5MB',
      ct_alert_upload_fail: '上传失败：',
      tag_all: '全部',
      tag_simple: '⚡ 简单任务',
      tag_airdrop: '空投',
      tag_register: '注册',
      tag_trade: '交易',
      tag_game: '游戏',
      tag_content: '内容',
      tag_test: '测试'
    },
    en: {
      ct_page_title: 'Create Task',
      ct_label_title: 'Task Title',
      ct_label_type: 'Task Type',
      ct_label_desc: 'Description',
      ct_label_req: 'Requirements',
      ct_label_reward_type: 'Reward Type',
      ct_label_reward_amount: 'Reward Amount',
      ct_label_slots: 'Task Slots',
      ct_label_deadline: 'Deadline',
      ct_label_proof: 'Proof Type',
      ct_label_images: 'Task Images',
      ct_ph_title: 'Enter task title',
      ct_ph_desc: 'Describe the task content and requirements in detail',
      ct_ph_desc_simple: 'Briefly describe the task, e.g. "Follow @CoinRealm_X"',
      ct_ph_req: 'Enter a requirement',
      ct_ph_req_simple: 'e.g. "Upload a screenshot after following"',
      ct_label_platform: 'Platform',
      ct_platform_select: 'Select a platform',
      ct_platform_twitter: 'Twitter (X)',
      ct_platform_telegram: 'Telegram',
      ct_platform_discord: 'Discord',
      ct_platform_youtube: 'YouTube',
      ct_platform_github: 'GitHub',
      ct_platform_tiktok: 'TikTok',
      ct_platform_instagram: 'Instagram',
      ct_platform_reddit: 'Reddit',
      ct_label_action: 'Action',
      ct_toggle_follow: 'Follow',
      ct_toggle_like: 'Like',
      ct_toggle_reply: 'Comment',
      ct_toggle_tg_join: 'Join Group',
      ct_toggle_tg_follow: 'Follow Channel',
      ct_toggle_tg_message: 'Send Message',
      ct_toggle_dc_join: 'Join Server',
      ct_toggle_dc_message: 'Send Message',
      ct_label_target_dc_invite: 'Server Invite Link',
      ct_ph_target_dc_invite: 'Enter server invite link, e.g. https://discord.gg/xxx',
      ct_ph_keyword_dc_message: 'Keyword required in message (optional)',
      ct_alert_discord_actions_required: 'Select at least one Discord action',
      ct_alert_discord_target_required: 'Enter the Discord server invite link',
      ct_label_target_tg_join: 'Join Group',
      ct_label_target_tg_follow: 'Follow Channel',
      ct_label_target_tg_message: 'Send Message',
      ct_ph_target_tg_join: 'Group link, e.g. https://t.me/xxx',
      ct_ph_target_tg_follow: 'Channel link, e.g. https://t.me/xxx',
      ct_ph_target_tg_message: 'Group link',
      ct_ph_keyword_tg_message: 'Required keyword (optional)',
      ct_alert_telegram_actions_required: 'Select at least one Telegram action',
      ct_alert_telegram_target_required: 'Fill in the target for each selected action',
      ct_label_target_follow: 'Follow target',
      ct_label_target_like: 'Like target',
      ct_label_target_reply: 'Comment target',
      ct_ph_target_follow: 'Enter Twitter username, e.g. @CoinRealm_X',
      ct_ph_target_like: 'Enter tweet link',
      ct_ph_target_reply: 'Enter tweet link (optional keyword below)',
      ct_ph_keyword_reply: 'Required keyword (optional)',
      ct_alert_twitter_actions_required: 'Select at least one Twitter action',
      ct_alert_twitter_target_required: 'Fill in the target for each selected action',
      ct_label_target: 'Target',
      ct_label_keyword: 'Keyword',
      ct_ph_target: 'Enter target link or account',
      ct_ph_keyword: 'Enter keyword (optional)',
      ct_keyword_hint: 'Required for reply/comment/message actions',
      ct_ph_target_twitter: 'Account handle or tweet link',
      ct_ph_target_telegram: 'Group/channel link',
      ct_ph_target_discord: 'Server invite link',
      ct_ph_target_youtube: 'Channel or video link',
      ct_ph_target_github: 'Repository or profile link',
      ct_ph_target_tiktok: 'Account or video link',
      ct_ph_target_instagram: 'Account or post link',
      ct_ph_target_reddit: 'Community or post link',
      ct_action_twitter_follow: 'Follow account',
      ct_action_twitter_like: 'Like tweet',
      ct_action_twitter_retweet: 'Retweet',
      ct_action_twitter_reply: 'Reply to tweet',
      ct_action_telegram_join: 'Join group',
      ct_action_telegram_follow: 'Follow channel',
      ct_action_telegram_message: 'Send message',
      ct_action_discord_join: 'Join server',
      ct_action_discord_message: 'Send message',
      ct_action_youtube_subscribe: 'Subscribe to channel',
      ct_action_youtube_like: 'Like video',
      ct_action_youtube_comment: 'Comment on video',
      ct_action_github_star: 'Star repository',
      ct_action_github_fork: 'Fork repository',
      ct_action_github_follow: 'Follow user',
      ct_action_tiktok_follow: 'Follow account',
      ct_action_tiktok_like: 'Like video',
      ct_action_tiktok_comment: 'Comment on video',
      ct_action_instagram_follow: 'Follow account',
      ct_action_instagram_like: 'Like post',
      ct_action_instagram_comment: 'Comment on post',
      ct_action_reddit_join: 'Join community',
      ct_action_reddit_like: 'Upvote post',
      ct_action_reddit_comment: 'Comment on post',
      ct_sql_title: 'If publish fails due to missing columns, run in Supabase:',
      ct_alert_platform_required: 'Please select a platform and fill in action and target',
      ct_alert_keyword_required: 'Please enter a keyword',
      ct_type_simple: 'Simple Task',
      ct_ph_reward: 'Enter reward amount',
      ct_ph_slots: 'Enter slots (leave empty for unlimited)',
      ct_type_other: 'Other',
      ct_add_req: '+ Add Requirement',
      ct_proof_text: 'Text Proof',
      ct_proof_screenshot: 'Screenshot Proof',
      ct_stake_note: 'Only Lv.3+ users can publish tasks.',
      ct_stake_hint: 'Publishing requires staking {amount} CRLM (20% deposit after commission). Deposit refunded after completion.',
      ct_stake_hint_usdt: 'Publishing requires staking {amount} USDT (20% deposit after commission). Deposit refunded after completion.',
      ct_unit_price: 'Unit reward: approx. {amount} {unit}',
      ct_deadline_hint: '⏰ Tasks will be auto-approved if review times out. Repeated timeouts may result in suspension of publishing rights.',
      ct_btn_submit: 'Confirm & Publish',
      ct_btn_balance: 'Insufficient balance, please exchange CRLM first',
      ct_btn_level: 'Level too low (Lv.3+ required)',
      ct_agreement: 'By publishing, you agree to CoinRealm publishing rules',
      ct_alert_required: 'Please fill in all required fields',
      ct_alert_success: 'Task published successfully!',
      ct_alert_login: 'Please log in before publishing a task',
      ct_alert_fail: 'Publish failed: ',
      ct_alert_max_images: 'Maximum 3 images allowed',
      ct_alert_invalid_image: 'Only JPG, PNG, and WebP formats are supported',
      ct_alert_image_size: 'Each image must be 5MB or smaller',
      ct_alert_upload_fail: 'Upload failed: ',
      tag_all: 'All',
      tag_simple: '⚡ Simple Tasks',
      tag_airdrop: 'Airdrop',
      tag_register: 'Register',
      tag_trade: 'Trade',
      tag_game: 'Game',
      tag_content: 'Content',
      tag_test: 'Test'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function ctT(key, vars) {
    var dict = createTaskTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function getDefaultDeadline() {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  function getRewardType() {
    var checked = document.querySelector('input[name="ct-reward-type"]:checked');
    return checked ? checked.value : 'CRLM';
  }

  function getRewardAmount() {
    var input = document.getElementById('ct-reward-amount');
    var val = parseFloat(input ? input.value : '');
    return isNaN(val) || val < 0 ? 0 : val;
  }

  function getTaskSlots() {
    var input = document.getElementById('ct-task-slots');
    if (!input || !input.value.trim()) return 0;
    var val = parseInt(input.value, 10);
    return isNaN(val) || val <= 0 ? 0 : val;
  }

  function formatCtAmount(num) {
    var n = Number(num) || 0;
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  }

  function getNetRewardAfterCommission(reward) {
    return reward * (1 - CT_PLATFORM_COMMISSION);
  }

  function calcStakeDeposit(netReward) {
    return netReward * 0.2;
  }

  function getCtImageExtension(filename) {
    var parts = String(filename || '').toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : '';
  }

  function validateCtImageFile(file) {
    if (!file) return ctT('ct_alert_invalid_image');
    if (CT_ALLOWED_IMAGE_EXTENSIONS.indexOf(getCtImageExtension(file.name)) < 0) {
      return ctT('ct_alert_invalid_image');
    }
    if (file.size > CT_MAX_IMAGE_SIZE) {
      return ctT('ct_alert_image_size');
    }
    return '';
  }

  function buildCtStoragePath(userId, seq) {
    return userId + '_' + Date.now() + '_' + seq;
  }

  async function uploadCtImageFile(file) {
    if (!window.supabase) {
      alert(ctT('ct_alert_upload_fail') + 'Supabase unavailable');
      return null;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(ctT('ct_alert_login'));
      return null;
    }

    ctImageUploadSeq += 1;
    var storagePath = buildCtStoragePath(userId, ctImageUploadSeq);
    var uploadResult = await window.supabase.storage
      .from('screenshots')
      .upload(storagePath, file, {
        contentType: file.type || undefined,
        upsert: false
      });

    if (uploadResult.error) {
      alert(ctT('ct_alert_upload_fail') + uploadResult.error.message);
      return null;
    }

    var urlResult = window.supabase.storage.from('screenshots').getPublicUrl(storagePath);
    var publicUrl = urlResult.data && urlResult.data.publicUrl;
    if (!publicUrl) {
      alert(ctT('ct_alert_upload_fail'));
      return null;
    }

    return {
      name: file.name,
      url: publicUrl,
      path: storagePath
    };
  }

  function renderCtImageList() {
    var listEl = document.getElementById('ct-image-list');
    if (!listEl) return;

    var html = ctUploadedImages.map(function (item, index) {
      var src = typeof resolveAvatarAssetUrl === 'function' ? resolveAvatarAssetUrl(item.url) : item.url;
      return (
        '<button type="button" class="ct-image-thumb" data-index="' + index + '" aria-label="Remove image">' +
          '<img src="' + escapeHtml(src) + '" alt="">' +
          '<span class="ct-image-remove" aria-hidden="true">&times;</span>' +
        '</button>'
      );
    }).join('');

    if (ctUploadedImages.length < CT_MAX_IMAGES) {
      html += '<button type="button" id="ct-image-add-btn" class="ct-image-add-btn" aria-label="Add image">+</button>';
    }

    listEl.innerHTML = html;
  }

  async function handleCtImagesSelected(fileList) {
    if (ctImageUploadInProgress) return;

    var files = Array.from(fileList || []);
    if (!files.length) return;

    if (ctUploadedImages.length >= CT_MAX_IMAGES) {
      alert(ctT('ct_alert_max_images'));
      return;
    }

    var remaining = CT_MAX_IMAGES - ctUploadedImages.length;
    if (files.length > remaining) {
      alert(ctT('ct_alert_max_images'));
      files = files.slice(0, remaining);
    }

    ctImageUploadInProgress = true;
    try {
      for (var i = 0; i < files.length; i++) {
        if (ctUploadedImages.length >= CT_MAX_IMAGES) {
          alert(ctT('ct_alert_max_images'));
          break;
        }

        var file = files[i];
        var validationError = validateCtImageFile(file);
        if (validationError) {
          alert(validationError);
          continue;
        }

        var uploaded = await uploadCtImageFile(file);
        if (uploaded) {
          ctUploadedImages.push(uploaded);
          renderCtImageList();
        }
      }
    } finally {
      ctImageUploadInProgress = false;
    }
  }

  function updateUnitPriceHint() {
    var hintEl = document.getElementById('ct-unit-price-hint');
    if (!hintEl) return;

    var reward = getRewardAmount();
    var slots = getTaskSlots();
    if (reward <= 0 || slots <= 0) {
      hintEl.classList.add('hidden');
      hintEl.textContent = '';
      return;
    }

    var unitPrice = getNetRewardAfterCommission(reward) / slots;
    var rewardType = getRewardType();
    hintEl.textContent = ctT('ct_unit_price', {
      amount: formatCtAmount(unitPrice),
      unit: rewardType
    });
    hintEl.classList.remove('hidden');
  }

  function updateStakeHint() {
    var hintEl = document.getElementById('ct-stake-hint');
    if (!hintEl) return;

    var reward = getRewardAmount();
    if (reward <= 0) {
      hintEl.textContent = '';
      return;
    }

    var deposit = calcStakeDeposit(getNetRewardAfterCommission(reward));
    var amountStr = formatCtAmount(deposit);
    var rewardType = getRewardType();
    var key = rewardType === 'USDT' ? 'ct_stake_hint_usdt' : 'ct_stake_hint';
    hintEl.textContent = ctT(key, { amount: amountStr });
  }

  function updateSubmitButtonState() {
    var btn = document.getElementById('ct-submit-btn');
    if (!btn) return;

    btn.classList.remove('ct-btn-normal', 'ct-btn-disabled');
    btn.disabled = false;

    if (userLevel < 3) {
      btn.classList.add('ct-btn-disabled');
      btn.disabled = true;
      btn.textContent = ctT('ct_btn_level');
      return;
    }

    var reward = getRewardAmount();
    if (reward > userBalance) {
      btn.classList.add('ct-btn-disabled');
      btn.disabled = true;
      btn.textContent = ctT('ct_btn_balance');
      return;
    }

    btn.classList.add('ct-btn-normal');
    btn.textContent = ctT('ct_btn_submit');
  }

  function applyCreateTaskI18n() {
    document.querySelectorAll('#create-task-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (createTaskTranslations[getLang()][key]) {
        el.textContent = ctT(key);
      }
    });

    document.querySelectorAll('#create-task-page [data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (createTaskTranslations[getLang()][key]) {
        el.setAttribute('placeholder', ctT(key));
      }
    });

    document.querySelectorAll('#create-task-page select option[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (createTaskTranslations[getLang()][key]) {
        el.textContent = ctT(key);
      }
    });

    updateStakeHint();
    updateUnitPriceHint();
    updateSubmitButtonState();
    if (getSelectedPlatform()) {
      rebuildPlatformActionOptions();
      updatePlatformTargetPlaceholder();
      updatePlatformKeywordVisibility();
    }
  }

  function bindRequirementRow(row) {
    var deleteBtn = row.querySelector('.create-task-req-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function () {
        var list = document.getElementById('ct-requirements-list');
        var rows = list ? list.querySelectorAll('.create-task-req-row') : [];
        if (rows.length <= 1) return;
        row.remove();
      });
    }
  }

  function addRequirementRow() {
    var list = document.getElementById('ct-requirements-list');
    if (!list) return;

    var row = document.createElement('div');
    row.className = 'create-task-req-row';
    row.innerHTML =
      '<input type="text" class="create-task-input create-task-req-input" data-placeholder="ct_ph_req" placeholder="' + ctT('ct_ph_req') + '">' +
      '<button type="button" class="create-task-req-delete" aria-label="Delete">&times;</button>';
    list.appendChild(row);
    bindRequirementRow(row);
  }

  function initRequirementList() {
    var list = document.getElementById('ct-requirements-list');
    if (!list) return;

    list.querySelectorAll('.create-task-req-row').forEach(bindRequirementRow);

    var addBtn = document.getElementById('ct-add-req-btn');
    if (addBtn) {
      addBtn.onclick = addRequirementRow;
    }
  }

  function isSimpleTaskTypeSelected() {
    var type = document.getElementById('ct-task-type');
    return !!(type && type.value === 'simple');
  }

  function getSelectedPlatform() {
    var select = document.getElementById('ct-task-platform');
    return select ? String(select.value || '').trim() : '';
  }

  function getSelectedPlatformAction() {
    var platform = getSelectedPlatform();
    if (platform === 'twitter') {
      return getSelectedTwitterActions().join(',');
    }
    if (platform === 'telegram') {
      return getSelectedTelegramActions().join(',');
    }
    if (platform === 'discord') {
      return getSelectedDiscordActions().join(',');
    }
    var select = document.getElementById('ct-task-action');
    return select ? String(select.value || '').trim() : '';
  }

  function getSelectedTelegramActions() {
    var group = document.getElementById('ct-telegram-action-group');
    if (!group) return [];
    return Array.prototype.slice.call(group.querySelectorAll('.ct-action-toggle.selected'))
      .map(function (btn) { return btn.getAttribute('data-action'); })
      .filter(Boolean);
  }

  function updateTelegramMultiActionUi() {
    var joinField = document.getElementById('ct-target-field-join');
    var followField = document.getElementById('ct-target-field-tg-follow');
    var messageField = document.getElementById('ct-target-field-message');
    var joinSelected = !!document.querySelector('#ct-telegram-action-group .ct-action-toggle[data-action="join"].selected');
    var followSelected = !!document.querySelector('#ct-telegram-action-group .ct-action-toggle[data-action="follow"].selected');
    var messageSelected = !!document.querySelector('#ct-telegram-action-group .ct-action-toggle[data-action="message"].selected');
    if (joinField) joinField.classList.toggle('hidden', !joinSelected);
    if (followField) followField.classList.toggle('hidden', !followSelected);
    if (messageField) messageField.classList.toggle('hidden', !messageSelected);
    var keywordWrap = document.getElementById('ct-target-field-message-keyword');
    if (keywordWrap) keywordWrap.classList.toggle('hidden', !messageSelected);
  }

  function resetTelegramMultiActionFields() {
    var group = document.getElementById('ct-telegram-action-group');
    if (group) {
      group.querySelectorAll('.ct-action-toggle').forEach(function (btn) {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      });
    }
    ['join', 'tg-follow', 'message'].forEach(function (key) {
      var fieldId = key === 'tg-follow' ? 'ct-target-field-tg-follow' : 'ct-target-field-' + key;
      var inputId = key === 'tg-follow' ? 'ct-target-input-tg-follow' : 'ct-target-input-' + key;
      var field = document.getElementById(fieldId);
      var input = document.getElementById(inputId);
      if (input) input.value = '';
      if (field) field.classList.add('hidden');
    });
    var keyword = document.getElementById('ct-target-keyword-message');
    var keywordWrap = document.getElementById('ct-target-field-message-keyword');
    if (keyword) keyword.value = '';
    if (keywordWrap) keywordWrap.classList.add('hidden');
  }

  function toggleTelegramActionButton(btn) {
    if (!btn || !btn.classList.contains('ct-action-toggle')) return;
    btn.classList.toggle('selected');
    btn.setAttribute('aria-pressed', btn.classList.contains('selected') ? 'true' : 'false');
    updateTelegramMultiActionUi();
    updateSubmitButtonState();
  }

  window.coinrealmToggleTelegramAction = toggleTelegramActionButton;

  function initTelegramActionToggleGroup() {
    var group = document.getElementById('ct-telegram-action-group');
    if (!group || group.dataset.bound) return;
    group.dataset.bound = '1';
    group.querySelectorAll('.ct-action-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('selected') ? 'true' : 'false');
    });
  }

  function getSelectedDiscordActions() {
    var group = document.getElementById('ct-discord-action-group');
    if (!group) return [];
    return Array.prototype.slice.call(group.querySelectorAll('.ct-action-toggle.selected'))
      .map(function (btn) { return btn.getAttribute('data-action'); })
      .filter(Boolean);
  }

  function updateDiscordMultiActionUi() {
    var joinSelected = !!document.querySelector('#ct-discord-action-group .ct-action-toggle[data-action="join"].selected');
    var messageSelected = !!document.querySelector('#ct-discord-action-group .ct-action-toggle[data-action="message"].selected');
    var targetField = document.getElementById('ct-target-field-discord');
    var keywordField = document.getElementById('ct-target-field-discord-keyword');
    if (targetField) targetField.classList.toggle('hidden', !joinSelected && !messageSelected);
    if (keywordField) keywordField.classList.toggle('hidden', !messageSelected);
  }

  function resetDiscordMultiActionFields() {
    var group = document.getElementById('ct-discord-action-group');
    if (group) {
      group.querySelectorAll('.ct-action-toggle').forEach(function (btn) {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      });
    }
    var targetField = document.getElementById('ct-target-field-discord');
    var targetInput = document.getElementById('ct-target-input-discord');
    var keywordField = document.getElementById('ct-target-field-discord-keyword');
    var keywordInput = document.getElementById('ct-target-keyword-discord');
    if (targetInput) targetInput.value = '';
    if (keywordInput) keywordInput.value = '';
    if (targetField) targetField.classList.add('hidden');
    if (keywordField) keywordField.classList.add('hidden');
  }

  function toggleDiscordActionButton(btn) {
    if (!btn || !btn.classList.contains('ct-action-toggle')) return;
    btn.classList.toggle('selected');
    btn.setAttribute('aria-pressed', btn.classList.contains('selected') ? 'true' : 'false');
    updateDiscordMultiActionUi();
    updateSubmitButtonState();
  }

  window.coinrealmToggleDiscordAction = toggleDiscordActionButton;

  function initDiscordActionToggleGroup() {
    var group = document.getElementById('ct-discord-action-group');
    if (!group || group.dataset.bound) return;
    group.dataset.bound = '1';
    group.querySelectorAll('.ct-action-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('selected') ? 'true' : 'false');
    });
  }

  function getSelectedTwitterActions() {
    var group = document.getElementById('ct-twitter-action-group');
    if (!group) return [];
    return Array.prototype.slice.call(group.querySelectorAll('.ct-action-toggle.selected'))
      .map(function (btn) { return btn.getAttribute('data-action'); })
      .filter(Boolean);
  }

  function updateTwitterMultiActionUi() {
    ['follow', 'like', 'reply'].forEach(function (action) {
      var field = document.getElementById('ct-target-field-' + action);
      var btn = document.querySelector('#ct-twitter-action-group .ct-action-toggle[data-action="' + action + '"]');
      var selected = !!(btn && btn.classList.contains('selected'));
      if (field) field.classList.toggle('hidden', !selected);
    });
    var replyKeywordWrap = document.getElementById('ct-target-field-reply-keyword');
    var replySelected = !!document.querySelector('#ct-twitter-action-group .ct-action-toggle[data-action="reply"].selected');
    if (replyKeywordWrap) replyKeywordWrap.classList.toggle('hidden', !replySelected);
  }

  function resetTwitterMultiActionFields() {
    var group = document.getElementById('ct-twitter-action-group');
    if (group) {
      group.querySelectorAll('.ct-action-toggle').forEach(function (btn) {
        btn.classList.remove('selected');
      });
    }
    ['follow', 'like', 'reply'].forEach(function (action) {
      var input = document.getElementById('ct-target-input-' + action);
      var field = document.getElementById('ct-target-field-' + action);
      if (input) input.value = '';
      if (field) field.classList.add('hidden');
    });
    var replyKeyword = document.getElementById('ct-target-keyword-reply');
    var replyKeywordWrap = document.getElementById('ct-target-field-reply-keyword');
    if (replyKeyword) replyKeyword.value = '';
    if (replyKeywordWrap) replyKeywordWrap.classList.add('hidden');
  }

  function toggleTwitterActionButton(btn) {
    if (!btn || !btn.classList.contains('ct-action-toggle')) return;
    btn.classList.toggle('selected');
    btn.setAttribute('aria-pressed', btn.classList.contains('selected') ? 'true' : 'false');
    updateTwitterMultiActionUi();
    updateSubmitButtonState();
  }

  window.coinrealmToggleTwitterAction = toggleTwitterActionButton;

  function initTwitterActionToggleGroup() {
    var group = document.getElementById('ct-twitter-action-group');
    if (!group || group.dataset.bound) return;
    group.dataset.bound = '1';
    group.querySelectorAll('.ct-action-toggle').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.classList.contains('selected') ? 'true' : 'false');
    });
  }

  function getPlatformConfig(platform) {
    return CT_SOCIAL_PLATFORMS[platform] || null;
  }

  function actionNeedsKeyword(platform, actionValue) {
    var config = getPlatformConfig(platform);
    if (!config) return false;
    for (var i = 0; i < config.actions.length; i++) {
      if (config.actions[i].value === actionValue) {
        return !!config.actions[i].needsKeyword;
      }
    }
    return false;
  }

  function rebuildPlatformActionOptions() {
    var platform = getSelectedPlatform();
    var actionSelect = document.getElementById('ct-task-action');
    if (!actionSelect) return;

    var previous = actionSelect.value;
    actionSelect.innerHTML = '';

    var config = getPlatformConfig(platform);
    if (!config) {
      actionSelect.disabled = true;
      return;
    }

    actionSelect.disabled = false;
    config.actions.forEach(function (action) {
      var option = document.createElement('option');
      option.value = action.value;
      option.textContent = ctT(action.labelKey);
      actionSelect.appendChild(option);
    });

    var hasPrevious = config.actions.some(function (action) {
      return action.value === previous;
    });
    actionSelect.value = hasPrevious ? previous : config.actions[0].value;
  }

  function updatePlatformKeywordVisibility() {
    var platform = getSelectedPlatform();
    var action = getSelectedPlatformAction();
    var keywordField = document.getElementById('ct-field-keyword');
    var keywordInput = document.getElementById('ct-task-keyword');
    var needsKeyword = actionNeedsKeyword(platform, action);

    if (keywordField) keywordField.classList.toggle('hidden', !needsKeyword);
    if (keywordInput && !needsKeyword) keywordInput.value = '';
  }

  function updatePlatformTargetPlaceholder() {
    var platform = getSelectedPlatform();
    var targetInput = document.getElementById('ct-task-target');
    var config = getPlatformConfig(platform);
    if (!targetInput || !config) return;

    var placeholderKey = config.targetPlaceholderKey || 'ct_ph_target';
    targetInput.setAttribute('data-placeholder', placeholderKey);
    targetInput.placeholder = ctT(placeholderKey);
  }

  function resetPlatformFields() {
    var platformSelect = document.getElementById('ct-task-platform');
    var actionSelect = document.getElementById('ct-task-action');
    var targetInput = document.getElementById('ct-task-target');
    var keywordInput = document.getElementById('ct-task-keyword');

    if (platformSelect) platformSelect.value = '';
    if (actionSelect) {
      actionSelect.innerHTML = '';
      actionSelect.disabled = true;
    }
    if (targetInput) targetInput.value = '';
    if (keywordInput) keywordInput.value = '';
    resetTwitterMultiActionFields();
    resetTelegramMultiActionFields();
    resetDiscordMultiActionFields();
    updatePlatformKeywordVisibility();
  }

  function updatePlatformConfigUi() {
    var simple = isSimpleTaskTypeSelected();
    var platformField = document.getElementById('ct-field-platform');
    var configField = document.getElementById('ct-field-platform-config');
    var sqlHint = document.getElementById('ct-sql-migration-hint');
    var platform = getSelectedPlatform();
    var twitterConfig = document.getElementById('ct-config-twitter');
    var telegramConfig = document.getElementById('ct-config-telegram');
    var discordConfig = document.getElementById('ct-config-discord');
    var genericConfig = document.getElementById('ct-config-generic');

    if (platformField) platformField.classList.toggle('hidden', !simple);
    if (sqlHint) sqlHint.classList.toggle('hidden', !simple);

    if (!simple) {
      if (configField) configField.classList.add('hidden');
      resetPlatformFields();
      return;
    }

    if (configField) {
      configField.classList.toggle('hidden', !platform);
    }

    if (!platform) {
      var actionSelect = document.getElementById('ct-task-action');
      if (actionSelect) {
        actionSelect.innerHTML = '';
        actionSelect.disabled = true;
      }
      resetTwitterMultiActionFields();
      resetTelegramMultiActionFields();
      resetDiscordMultiActionFields();
      updatePlatformKeywordVisibility();
      return;
    }

    if (platform === 'twitter') {
      if (twitterConfig) twitterConfig.classList.remove('hidden');
      if (telegramConfig) telegramConfig.classList.add('hidden');
      if (discordConfig) discordConfig.classList.add('hidden');
      if (genericConfig) genericConfig.classList.add('hidden');
      initTwitterActionToggleGroup();
      updateTwitterMultiActionUi();
      return;
    }

    if (platform === 'telegram') {
      if (twitterConfig) twitterConfig.classList.add('hidden');
      if (telegramConfig) telegramConfig.classList.remove('hidden');
      if (discordConfig) discordConfig.classList.add('hidden');
      if (genericConfig) genericConfig.classList.add('hidden');
      initTelegramActionToggleGroup();
      updateTelegramMultiActionUi();
      return;
    }

    if (platform === 'discord') {
      if (twitterConfig) twitterConfig.classList.add('hidden');
      if (telegramConfig) telegramConfig.classList.add('hidden');
      if (discordConfig) discordConfig.classList.remove('hidden');
      if (genericConfig) genericConfig.classList.add('hidden');
      initDiscordActionToggleGroup();
      updateDiscordMultiActionUi();
      return;
    }

    if (twitterConfig) twitterConfig.classList.add('hidden');
    if (telegramConfig) telegramConfig.classList.add('hidden');
    if (discordConfig) discordConfig.classList.add('hidden');
    if (genericConfig) genericConfig.classList.remove('hidden');
    rebuildPlatformActionOptions();
    updatePlatformTargetPlaceholder();
    updatePlatformKeywordVisibility();
  }

  function getSimpleTaskPlatformFields() {
    var platform = getSelectedPlatform();

    if (platform === 'twitter') {
      var actions = getSelectedTwitterActions();
      var targets = actions.map(function (action) {
        var input = document.getElementById('ct-target-input-' + action);
        return input ? input.value.trim() : '';
      });
      var keywordInput = document.getElementById('ct-target-keyword-reply');
      var taskKeyword = actions.indexOf('reply') !== -1 && keywordInput
        ? keywordInput.value.trim()
        : '';
      return {
        platform: platform,
        taskAction: actions.join(','),
        taskTarget: targets.join(','),
        taskKeyword: taskKeyword
      };
    }

    if (platform === 'telegram') {
      var tgActions = getSelectedTelegramActions();
      var tgTargets = tgActions.map(function (action) {
        if (action === 'join') {
          var joinInput = document.getElementById('ct-target-input-join');
          return joinInput ? joinInput.value.trim() : '';
        }
        if (action === 'follow') {
          var followInput = document.getElementById('ct-target-input-tg-follow');
          return followInput ? followInput.value.trim() : '';
        }
        if (action === 'message') {
          var msgInput = document.getElementById('ct-target-input-message');
          return msgInput ? msgInput.value.trim() : '';
        }
        return '';
      });
      var msgKeywordInput = document.getElementById('ct-target-keyword-message');
      var tgKeyword = tgActions.indexOf('message') !== -1 && msgKeywordInput
        ? msgKeywordInput.value.trim()
        : '';
      return {
        platform: platform,
        taskAction: tgActions.join(','),
        taskTarget: tgTargets.join(','),
        taskKeyword: tgKeyword
      };
    }

    if (platform === 'discord') {
      var dcActions = getSelectedDiscordActions();
      var inviteInput = document.getElementById('ct-target-input-discord');
      var inviteUrl = inviteInput ? inviteInput.value.trim() : '';
      var dcTargets = dcActions.map(function () { return inviteUrl; });
      var dcKeywordInput = document.getElementById('ct-target-keyword-discord');
      var dcKeyword = dcActions.indexOf('message') !== -1 && dcKeywordInput
        ? dcKeywordInput.value.trim()
        : '';
      return {
        platform: platform,
        taskAction: dcActions.join(','),
        taskTarget: dcTargets.join(','),
        taskKeyword: dcKeyword
      };
    }

    var action = getSelectedPlatformAction();
    var targetInput = document.getElementById('ct-task-target');
    var keywordInput = document.getElementById('ct-task-keyword');
    var target = targetInput ? targetInput.value.trim() : '';
    var keyword = keywordInput ? keywordInput.value.trim() : '';

    return {
      platform: platform,
      taskAction: action,
      taskTarget: target,
      taskKeyword: keyword
    };
  }

  function validateSimplePlatformFields() {
    var fields = getSimpleTaskPlatformFields();
    if (!fields.platform) {
      alert(ctT('ct_alert_platform_required'));
      return false;
    }

    if (fields.platform === 'twitter') {
      var actions = getSelectedTwitterActions();
      if (!actions.length) {
        alert(ctT('ct_alert_twitter_actions_required'));
        return false;
      }
      for (var i = 0; i < actions.length; i++) {
        var input = document.getElementById('ct-target-input-' + actions[i]);
        if (!input || !input.value.trim()) {
          alert(ctT('ct_alert_twitter_target_required'));
          return false;
        }
      }
      return true;
    }

    if (fields.platform === 'telegram') {
      var tgActions = getSelectedTelegramActions();
      if (!tgActions.length) {
        alert(ctT('ct_alert_telegram_actions_required'));
        return false;
      }
      for (var j = 0; j < tgActions.length; j++) {
        var tgAction = tgActions[j];
        var tgInput = tgAction === 'join'
          ? document.getElementById('ct-target-input-join')
          : tgAction === 'follow'
            ? document.getElementById('ct-target-input-tg-follow')
            : document.getElementById('ct-target-input-message');
        if (!tgInput || !tgInput.value.trim()) {
          alert(ctT('ct_alert_telegram_target_required'));
          return false;
        }
      }
      return true;
    }

    if (fields.platform === 'discord') {
      var dcActions = getSelectedDiscordActions();
      if (!dcActions.length) {
        alert(ctT('ct_alert_discord_actions_required'));
        return false;
      }
      var dcInviteInput = document.getElementById('ct-target-input-discord');
      if (!dcInviteInput || !dcInviteInput.value.trim()) {
        alert(ctT('ct_alert_discord_target_required'));
        return false;
      }
      return true;
    }

    if (!fields.taskAction || !fields.taskTarget) {
      alert(ctT('ct_alert_platform_required'));
      return false;
    }
    if (actionNeedsKeyword(fields.platform, fields.taskAction) && !fields.taskKeyword) {
      alert(ctT('ct_alert_keyword_required'));
      return false;
    }
    return true;
  }

  function ensureDefaultRequirementRows() {
    var list = document.getElementById('ct-requirements-list');
    if (!list) return;

    var rows = list.querySelectorAll('.create-task-req-row');
    if (rows.length >= 3) {
      rows.forEach(function (row) {
        var deleteBtn = row.querySelector('.create-task-req-delete');
        if (deleteBtn) deleteBtn.classList.remove('hidden');
      });
      return;
    }

    list.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      var row = document.createElement('div');
      row.className = 'create-task-req-row';
      row.innerHTML =
        '<input type="text" class="create-task-input create-task-req-input" data-placeholder="ct_ph_req" placeholder="' + ctT('ct_ph_req') + '">' +
        '<button type="button" class="create-task-req-delete" aria-label="Delete">&times;</button>';
      list.appendChild(row);
      bindRequirementRow(row);
    }
  }

  function simplifyRequirementListForSimple() {
    var list = document.getElementById('ct-requirements-list');
    if (!list) return;

    var firstValue = '';
    var firstInput = list.querySelector('.create-task-req-input');
    if (firstInput) firstValue = firstInput.value;

    list.innerHTML = '';
    var row = document.createElement('div');
    row.className = 'create-task-req-row create-task-req-row-simple';
    row.innerHTML =
      '<input type="text" class="create-task-input create-task-req-input" data-placeholder="ct_ph_req_simple" placeholder="' + ctT('ct_ph_req_simple') + '">' +
      '<button type="button" class="create-task-req-delete hidden" aria-label="Delete">&times;</button>';
    list.appendChild(row);
    bindRequirementRow(row);

    var input = row.querySelector('.create-task-req-input');
    if (input && firstValue) input.value = firstValue;
  }

  function updateCreateTaskTemplate() {
    var simple = isSimpleTaskTypeSelected();
    var formCard = document.querySelector('#create-task-page .create-task-form-card');
    if (formCard) {
      formCard.classList.toggle('create-task-form-simple', simple);
    }

    ['ct-field-images', 'ct-field-reward-type', 'ct-field-proof'].forEach(function (fieldId) {
      var field = document.getElementById(fieldId);
      if (field) field.classList.toggle('hidden', simple);
    });

    var addReqBtn = document.getElementById('ct-add-req-btn');
    if (addReqBtn) addReqBtn.classList.toggle('hidden', simple);

    var deadlineHint = document.querySelector('.create-task-deadline-hint');
    if (deadlineHint) deadlineHint.classList.toggle('hidden', simple);

    var desc = document.getElementById('ct-task-desc');
    if (desc) {
      var descKey = simple ? 'ct_ph_desc_simple' : 'ct_ph_desc';
      desc.setAttribute('data-placeholder', descKey);
      desc.placeholder = ctT(descKey);
    }

    if (simple) {
      simplifyRequirementListForSimple();
      var crlmRadio = document.querySelector('input[name="ct-reward-type"][value="CRLM"]');
      if (crlmRadio) crlmRadio.checked = true;
      ctUploadedImages = [];
      renderCtImageList();
    } else {
      ensureDefaultRequirementRows();
    }

    updateStakeHint();
    updateUnitPriceHint();
    updateSubmitButtonState();
    updatePlatformConfigUi();
  }

  function resetCreateTaskForm() {
    var title = document.getElementById('ct-task-title');
    var type = document.getElementById('ct-task-type');
    var desc = document.getElementById('ct-task-desc');
    var reward = document.getElementById('ct-reward-amount');
    var slots = document.getElementById('ct-task-slots');
    var deadline = document.getElementById('ct-deadline');
    var list = document.getElementById('ct-requirements-list');

    if (title) title.value = '';
    if (type) type.value = 'all';
    if (desc) desc.value = '';
    if (reward) reward.value = '';
    if (slots) slots.value = '';
    if (deadline) deadline.value = getDefaultDeadline();

    if (list) {
      list.innerHTML = '';
      for (var i = 0; i < 3; i++) {
        var row = document.createElement('div');
        row.className = 'create-task-req-row';
        row.innerHTML =
          '<input type="text" class="create-task-input create-task-req-input" data-placeholder="ct_ph_req" placeholder="' + ctT('ct_ph_req') + '">' +
          '<button type="button" class="create-task-req-delete" aria-label="Delete">&times;</button>';
        list.appendChild(row);
        bindRequirementRow(row);
      }
    }

    var crlmRadio = document.querySelector('input[name="ct-reward-type"][value="CRLM"]');
    var textProof = document.querySelector('input[name="ct-proof-type"][value="text"]');
    if (crlmRadio) crlmRadio.checked = true;
    if (textProof) textProof.checked = true;

    ctUploadedImages = [];
    ctImageUploadSeq = 0;
    renderCtImageList();

    updateStakeHint();
    updateUnitPriceHint();
    updateSubmitButtonState();
    updateCreateTaskTemplate();
    applyCreateTaskI18n();
  }

  function validateSimplePlatformFieldsSilent() {
    var fields = getSimpleTaskPlatformFields();
    if (!fields.platform || !fields.taskAction || !fields.taskTarget) return false;
    if (actionNeedsKeyword(fields.platform, fields.taskAction) && !fields.taskKeyword) return false;
    return true;
  }

  function validateForm() {
    var title = document.getElementById('ct-task-title');
    var type = document.getElementById('ct-task-type');
    var desc = document.getElementById('ct-task-desc');
    var reward = document.getElementById('ct-reward-amount');
    var deadline = document.getElementById('ct-deadline');
    var reqInputs = document.querySelectorAll('#ct-requirements-list .create-task-req-input');
    var simple = isSimpleTaskTypeSelected();

    if (!title || !title.value.trim()) return false;
    if (!type || !type.value || type.value === 'all') return false;
    if (!desc || !desc.value.trim()) return false;
    if (!reward || !reward.value.trim() || parseFloat(reward.value) <= 0) return false;
    if (!deadline || !deadline.value) return false;

    var hasReq = false;
    reqInputs.forEach(function (input) {
      if (input.value.trim()) hasReq = true;
    });
    if (!hasReq) return false;

    if (simple && !validateSimplePlatformFieldsSilent()) return false;

    return true;
  }

  function getProofType() {
    if (isSimpleTaskTypeSelected()) return 'none';
    var checked = document.querySelector('input[name="ct-proof-type"]:checked');
    return checked ? checked.value : 'text';
  }

  function collectRequirements() {
    var requirements = [];
    document.querySelectorAll('#ct-requirements-list .create-task-req-input').forEach(function (input) {
      var val = input.value.trim();
      if (val) requirements.push(val);
    });
    return requirements;
  }

  function bindSubmitButton() {
    var submitBtn = document.getElementById('ct-submit-btn');
    if (!submitBtn) return;

    // 克隆按钮以清除旧监听器（DOM 被恢复后需重新绑定）
    var freshBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(freshBtn, submitBtn);
    updateSubmitButtonState();

    freshBtn.addEventListener('click', async function () {
      if (freshBtn.disabled) return;

      if (!validateForm()) {
        if (isSimpleTaskTypeSelected() && !validateSimplePlatformFieldsSilent()) {
          validateSimplePlatformFields();
        } else {
          alert(ctT('ct_alert_required'));
        }
        return;
      }

      if (!window.supabase) {
        alert(ctT('ct_alert_fail') + 'Supabase unavailable');
        return;
      }

      try {
        var userId = await getAuthenticatedUserId();
        if (!userId) {
          alert('请先登录后再发布任务');
          return;
        }

        var title = document.getElementById('ct-task-title').value.trim();
        var typeSelect = document.getElementById('ct-task-type');
        var simpleTask = typeSelect && typeSelect.value === 'simple';
        var type = simpleTask ? 'simple' : typeSelect.value;
        var description = document.getElementById('ct-task-desc').value.trim();
        var requirements = collectRequirements();
        var rewardType = simpleTask ? 'CRLM' : getRewardType();
        var rewardAmount = parseFloat(document.getElementById('ct-reward-amount').value);
        var slotsVal = document.getElementById('ct-task-slots').value.trim();
        var maxParticipants = slotsVal ? parseInt(slotsVal, 10) : null;
        if (maxParticipants !== null && isNaN(maxParticipants)) maxParticipants = null;
        var deadline = document.getElementById('ct-deadline').value;
        var proofType = getProofType();
        var imageUrl = simpleTask ? null : (ctUploadedImages.length ? ctUploadedImages[0].url : null);
        var platformFields = simpleTask ? getSimpleTaskPlatformFields() : null;

        var insertPayload = buildTaskInsertPayload(userId, {
          title: title,
          type: type,
          description: description,
          requirements: requirements,
          rewardType: rewardType,
          rewardAmount: rewardAmount,
          maxParticipants: maxParticipants,
          deadline: deadline,
          proofType: proofType,
          imageUrl: imageUrl,
          verificationType: simpleTask && platformFields ? platformFields.platform : null,
          platform: simpleTask && platformFields ? platformFields.platform : null,
          taskAction: simpleTask && platformFields ? platformFields.taskAction : null,
          taskTarget: simpleTask && platformFields ? platformFields.taskTarget : null,
          taskKeyword: simpleTask && platformFields ? platformFields.taskKeyword : null
        });

        var insertResult = await window.supabase
          .from('tasks')
          .insert(insertPayload);

        if (insertResult.error) throw insertResult.error;

        alert('任务发布成功！');
        resetCreateTaskForm();
        goToHomeAndRefreshTasks();
      } catch (error) {
        console.error('发布任务失败', error);
        alert('发布失败：' + (error && error.message ? error.message : String(error)));
      }
    });
  }

  function bindCreateTaskTypeHandlers() {
    var page = document.getElementById('create-task-page');
    if (!page || page.dataset.ctDelegateBound === '1') return;
    page.dataset.ctDelegateBound = '1';

    page.addEventListener('change', function (e) {
      var target = e.target;
      if (!target || !target.id) return;
      if (target.id === 'ct-task-type') {
        updateCreateTaskTemplate();
        applyCreateTaskI18n();
        return;
      }
      if (target.id === 'ct-task-platform') {
        updatePlatformConfigUi();
        applyCreateTaskI18n();
        return;
      }
      if (target.id === 'ct-task-action') {
        updatePlatformKeywordVisibility();
      }
    });
  }

  function initCreateTaskEvents() {
    var page = document.getElementById('create-task-page');
    if (!page || page.dataset.ctInit === '1') return;
    page.dataset.ctInit = '1';

    bindCreateTaskTypeHandlers();
    var rewardInput = document.getElementById('ct-reward-amount');
    if (rewardInput) {
        rewardInput.addEventListener('input', function () {
            updateStakeHint();
            updateUnitPriceHint();
            updateSubmitButtonState();
        });
    }
    var slotsInput = document.getElementById('ct-task-slots');
    if (slotsInput) {
        slotsInput.addEventListener('input', function () {
            updateUnitPriceHint();
        });
    }
    document.querySelectorAll('input[name="ct-reward-type"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            updateStakeHint();
            updateUnitPriceHint();
            updateSubmitButtonState();
        });
    });

    var imageList = document.getElementById('ct-image-list');
    var imageInput = document.getElementById('ct-image-input');
    if (imageList) {
      imageList.addEventListener('click', function (e) {
        var addBtn = e.target.closest('#ct-image-add-btn');
        if (addBtn && imageInput) {
          imageInput.click();
          return;
        }
        var thumbBtn = e.target.closest('.ct-image-thumb');
        if (!thumbBtn) return;
        var idx = parseInt(thumbBtn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= ctUploadedImages.length) return;
        ctUploadedImages.splice(idx, 1);
        renderCtImageList();
      });
    }
    if (imageInput) {
      imageInput.addEventListener('change', function () {
        if (imageInput.files && imageInput.files.length) {
          handleCtImagesSelected(imageInput.files);
        }
        imageInput.value = '';
      });
    }

    renderCtImageList();
    initRequirementList();
    initTwitterActionToggleGroup();
  }

  async function renderCreateTaskPage() {
    var deadline = document.getElementById('ct-deadline');
    if (deadline && !deadline.value) {
      deadline.value = getDefaultDeadline();
    }

    userLevel = 0;
    var userId = await getCurrentUserId();
    if (userId && window.supabase) {
      var levelResult = await window.supabase
        .from('users')
        .select('level')
        .eq('id', userId)
        .maybeSingle();
      if (!levelResult.error && levelResult.data && levelResult.data.level != null) {
        userLevel = levelResult.data.level;
      }
    }

    initCreateTaskEvents();
    bindCreateTaskTypeHandlers();
    bindSubmitButton();
    applyCreateTaskI18n();
    updateCreateTaskTemplate();
    updateUnitPriceHint();
    updateSubmitButtonState();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
    }
  }

  function handleCreateTaskRoute() {
    restoreAppContentIfNeeded();
    bindCreateTaskTypeHandlers();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var createTaskPage = document.getElementById('create-task-page');

    if (createTaskPage) {
      if (route === 'create-task') {
        createTaskPage.classList.remove('hidden');
        renderCreateTaskPage();
      } else {
        createTaskPage.classList.add('hidden');
      }
    }
  }

  window.addEventListener('hashchange', handleCreateTaskRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleCreateTaskRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleCreateTaskRoute, 0);
    });
  }
})();

