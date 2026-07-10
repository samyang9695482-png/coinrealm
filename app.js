function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('coinrealm_lang', lang);
    applyLanguageStrings();
}
(function () {

  'use strict';



  var STORAGE_KEY = 'coinrealm_lang';

  var DEFAULT_LANG = 'zh';

  var DEFAULT_ROUTE = 'home';



  var translations = {

    zh: {

      CoinRealm: 'CoinRealm',

      connectWallet: '连接钱包',

      langLabel: '中文',

      langToggle: 'EN',

      home: '首页',

      loading: '加载中...',

      pages: {

        home: { title: '任务大厅', message: '即将上线...' },

        'task-detail': { title: '任务详情', message: '即将上线...' },

        'create-task': { title: '发布任务', message: '即将上线...' },

        'submit-task': { title: '提交凭证', message: '即将上线...' },

        profile: { title: '个人中心', message: '即将上线...' },

        dividends: { title: '我的分红', message: '即将上线...' },

        exchange: { title: '兑换市场', message: '即将上线...' },

        leaderboard: { title: '排行榜', message: '即将上线...' },

        'broadcast-history': { title: '广播历史', message: '即将上线...' },

        publisher: { title: '发布者主页', message: '即将上线...' },

        review: { title: '审核管理', message: '即将上线...' },

        invite: { title: '邀请好友', message: '即将上线...' },

        'my-tasks': { title: '我的任务', message: '即将上线...' },

        'publish-management': { title: '发布管理', message: '即将上线...' },

        admin: { title: '管理后台', message: '即将上线...' }

      }

    },

    en: {

      CoinRealm: 'CoinRealm',

      connectWallet: 'Connect Wallet',

      langLabel: 'EN',

      langToggle: '中文',

      home: 'Home',

      loading: 'Loading...',

      pages: {

        home: { title: 'Task Hall', message: 'Coming soon...' },

        'task-detail': { title: 'Task Detail', message: 'Coming soon...' },

        'create-task': { title: 'Create Task', message: 'Coming soon...' },

        'submit-task': { title: 'Submit Proof', message: 'Coming soon...' },

        profile: { title: 'Profile', message: 'Coming soon...' },

        dividends: { title: 'My Dividends', message: 'Coming soon...' },

        exchange: { title: 'Exchange Market', message: 'Coming soon...' },

        leaderboard: { title: 'Leaderboard', message: 'Coming soon...' },

        'broadcast-history': { title: 'Broadcast History', message: 'Coming soon...' },

        publisher: { title: 'Publisher Profile', message: 'Coming soon...' },

        review: { title: 'Review Management', message: 'Coming soon...' },

        invite: { title: 'Invite Friends', message: 'Coming soon...' },

        'my-tasks': { title: 'My Tasks', message: 'Coming soon...' },

        'publish-management': { title: 'Publish Management', message: 'Coming soon...' },

        admin: { title: 'Admin Panel', message: 'Coming soon...' }

      }

    }

  };



  var routes = Object.keys(translations.zh.pages);

  var currentLang = DEFAULT_LANG;

  var currentRoute = DEFAULT_ROUTE;



  var appContent = document.getElementById('app-content');

  var langToggleBtn = document.getElementById('lang-toggle');

  var langLabel = document.getElementById('lang-label');



  function t(key) {

    var dict = translations[currentLang];

    return dict[key] !== undefined ? dict[key] : key;

  }



  function getPageContent(route) {

    var dict = translations[currentLang];

    var page = dict.pages[route];

    if (!page) {

      return {

        title: route,

        message: currentLang === 'zh' ? '页面未找到' : 'Page not found'

      };

    }

    return page;

  }



  function applyTranslations() {

    document.querySelectorAll('[data-i18n]').forEach(function (el) {

      var key = el.getAttribute('data-i18n');

      if (key === 'CoinRealm') {

        el.textContent = t('CoinRealm');

      } else if (key === 'connectWallet') {

        el.textContent = t('connectWallet');

      } else if (key === 'loading') {

        el.textContent = t('loading');

      }

    });



    if (langLabel) {

      langLabel.textContent = t('langToggle');

    }



    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';

  }



  function renderPage(route) {
    if (!appContent) return;
    // 真实页面已在 #app-content 内实现，禁止用占位内容覆盖（否则会销毁 #task-grid 等节点）
    if (document.getElementById('home-page')) return;

    var page = getPageContent(route);

    appContent.innerHTML =
      '<div class="card page-placeholder">' +
        '<h1>' + page.title + '</h1>' +
        '<p>' + page.message + '</p>' +
      '</div>';
  }



  function navigate(route) {

    if (routes.indexOf(route) === -1) {

      route = DEFAULT_ROUTE;

    }

    currentRoute = route;

    renderPage(route);

  }



  function getRouteFromHash() {

    var hash = window.location.hash.replace(/^#/, '');

    return hash || DEFAULT_ROUTE;

  }



  function setLanguage(lang) {

    if (lang !== 'zh' && lang !== 'en') {

      lang = DEFAULT_LANG;

    }

    currentLang = lang;

    localStorage.setItem(STORAGE_KEY, lang);

    applyTranslations();

    renderPage(currentRoute);

  }



  function toggleLanguage() {

    setLanguage(currentLang === 'zh' ? 'en' : 'zh');

  }



  function initLanguage() {

    var saved = localStorage.getItem(STORAGE_KEY);

    if (saved === 'zh' || saved === 'en') {

      currentLang = saved;

    } else {

      currentLang = DEFAULT_LANG;

    }

    applyTranslations();

  }



  function initRouter() {
    // 路由由 auth.js 与各页面模块处理；此处不再监听 hashchange，避免与 fetchTasks 渲染冲突
  }



  function initEvents() {

    if (langToggleBtn) {

      langToggleBtn.addEventListener('click', toggleLanguage);

    }

  }



  function init() {

    initLanguage();

    initRouter();

    initEvents();

  }



  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', init);

  } else {

    init();

  }

})();
// ==========================================
// 1. 多语言中英文字典追加 (请合并到已有 translations 中)
// ==========================================
const translations = {
    zh: {
        ads_banner: "广告位（Web3 Ads）",
        ads_placeholder: "广告位招租 | 联系 @CoinRealm_X",
        broadcast_prefix: "用户",
        broadcast_done: "完成了注册任务，获得",
        broadcast_empty: "暂无动态",
        guide_text: "欢迎来到 CoinRealm！选择一个任务，开始赚取 CRLM 吧。",
        search_placeholder: "搜索任务...",
        nav_simple_tasks: "⚡ 简单任务",
        nav_home: "首页",
        nav_airdrop: "空投",
        nav_invite_earn: "邀请赚币",
        simple_view_all: "查看更多 →",
        st_page_title: "⚡ 简单任务",
        st_page_subtitle: "一键完成，快速赚取 CRLM",
        st_loading: "加载中...",
        st_empty: "暂无简单任务，稍后再来看看吧",
        st_btn_create: "发布简单任务",
        st_btn_claim: "一键领取",
        st_btn_claimed: "已领取",
        st_btn_full: "已满员",
        st_label_slots: "剩余名额",
        st_label_deadline: "截止时间",
        st_claim_success: "领取成功！请按照任务要求完成操作。",
        st_login_required: "请先登录后再领取",
        st_already_claimed: "你已领取过该任务",
        st_task_full: "任务名额已满",
        st_claim_fail: "领取失败：",
        tag_all: "全部",
        tag_simple: "⚡ 简单任务",
        tag_official: "官方",
        tag_airdrop: "空投",
        tag_register: "注册",
        tag_trade: "交易",
        tag_game: "游戏",
        tag_content: "内容",
        tag_test: "测试",
        sort_highest: "价值最高",
        sort_latest: "最新发布",
        sort_ending: "即将截止",
        sort_rewards: "奖励最多",
        badge_official: "官方",
        badge_promo: "推广",
        badge_simple_fast: "快速任务",
        text_slots: "剩余名额",
        text_days: "天后",
        btn_claim: "领取",
        empty_text: "没有找到相关任务，换个筛选试试？",
        official_recommend_title: "⭐ 官方推荐",
        official_view_all: "查看全部 >",
        checkin_success_title: "签到成功",
        checkin_reward_label: "获得奖励",
        checkin_streak: "已连续签到 {days} 天",
        checkin_streak_bonus: "连续7天加成，奖励已翻倍！",
        checkin_close: "太棒了",
        checkin_already: "今日已签到，已连续签到 {days} 天",
        checkin_login_required: "请先登录后再领取空投",
        checkin_fail: "空投失败：",
        airdrop_streak: "连续空投第 {days} 天",
        airdrop_task_required: "🎁 请先完成至少一个任务，即可每日领取空投",
        airdrop_already: "🎁 今日空投已领取，明天再来！",
        airdrop_success: "🎁 空投成功！+{amount} CRLM",
        reward_sent_desc: "奖励已发送至余额",
        reward_confirm: "确定"
    },
    en: {
        ads_banner: "Advertising Space (Web3 Ads)",
        ads_placeholder: "Ad space available | Contact @CoinRealm_X",
        broadcast_prefix: "User",
        broadcast_done: "completed the registration task and received",
        broadcast_empty: "No activity yet",
        guide_text: "Welcome to CoinRealm! Select a task and start earning CRLM.",
        search_placeholder: "Search tasks...",
        nav_simple_tasks: "⚡ Simple Tasks",
        nav_home: "Home",
        nav_airdrop: "Airdrop",
        nav_invite_earn: "Invite",
        simple_view_all: "View all →",
        st_page_title: "⚡ Simple Tasks",
        st_page_subtitle: "Complete in one tap, earn CRLM fast",
        st_loading: "Loading...",
        st_empty: "No simple tasks yet. Check back later.",
        st_btn_create: "Post a Simple Task",
        st_btn_claim: "Claim Now",
        st_btn_claimed: "Claimed",
        st_btn_full: "Full",
        st_label_slots: "Slots left",
        st_label_deadline: "Deadline",
        st_claim_success: "Claimed! Please complete the task as required.",
        st_login_required: "Please sign in before claiming",
        st_already_claimed: "You have already claimed this task",
        st_task_full: "This task is full",
        st_claim_fail: "Claim failed: ",
        tag_all: "All",
        tag_simple: "⚡ Simple Tasks",
        tag_official: "Official",
        tag_airdrop: "Airdrop",
        tag_register: "Register",
        tag_trade: "Trade",
        tag_game: "Game",
        tag_content: "Content",
        tag_test: "Test",
        sort_highest: "Highest Value",
        sort_latest: "Latest Released",
        sort_ending: "Ending Soon",
        sort_rewards: "Most Rewards",
        badge_official: "Official",
        badge_promo: "Promo",
        badge_simple_fast: "Quick Task",
        text_slots: "Slots left",
        text_days: "days left",
        btn_claim: "Claim",
        empty_text: "No tasks found. Try changing your filters?",
        official_recommend_title: "⭐ Official Picks",
        official_view_all: "View all >",
        checkin_success_title: "Check-in Successful",
        checkin_reward_label: "Reward earned",
        checkin_streak: "Streak: {days} days",
        checkin_streak_bonus: "7+ day streak — reward doubled!",
        checkin_close: "Awesome",
        checkin_already: "Already checked in today. Streak: {days} days",
        checkin_login_required: "Please sign in before claiming airdrop",
        checkin_fail: "Airdrop failed: ",
        airdrop_streak: "Airdrop streak: day {days}",
        airdrop_task_required: "🎁 Complete at least one task to claim daily airdrop",
        airdrop_already: "🎁 Today's airdrop claimed. Come back tomorrow!",
        airdrop_success: "🎁 Airdrop success! +{amount} CRLM",
        reward_sent_desc: "Reward sent to your balance",
        reward_confirm: "OK"
    }
};

// 当前全局语言变量声明（假设项目中已存在该状态控制）
let currentLang = localStorage.getItem('coinrealm_lang') || 'zh';
let allTasks = [];
let homeOfficialTasks = [];
let homeEventsBound = false;
let fetchTasksSeq = 0;

async function getCurrentUserId() {
    if (window.supabase) {
        var sessionResult = await window.supabase.auth.getSession();
        if (sessionResult.data && sessionResult.data.session && sessionResult.data.session.user) {
            return sessionResult.data.session.user.id;
        }
    }

    var walletUserId = localStorage.getItem('coinrealm_user_id');
    if (walletUserId) {
        return walletUserId;
    }

    return null;
}

async function getAuthenticatedUserId() {
    if (!window.supabase) return null;

    var sessionResult = await window.supabase.auth.getSession();
    var session = sessionResult.data && sessionResult.data.session;

    if (session && session.user && session.user.id) {
        var expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        if (expiresAt && Date.now() > expiresAt - 120000) {
            var refreshed = await window.supabase.auth.refreshSession();
            if (!refreshed.error && refreshed.data && refreshed.data.session && refreshed.data.session.user) {
                return refreshed.data.session.user.id;
            }
        }
        return session.user.id;
    }

    if (typeof window.coinrealmEnsureWalletAuth === 'function') {
        return window.coinrealmEnsureWalletAuth();
    }

    return null;
}

function buildTaskInsertPayload(userId, fields) {
    var payload = {
        publisher_id: userId,
        title: fields.title,
        type: fields.type,
        description: fields.description,
        requirements: fields.requirements,
        reward_type: fields.rewardType,
        reward_amount: fields.rewardAmount,
        max_participants: fields.maxParticipants,
        deadline: fields.deadline,
        proof_type: fields.proofType,
        is_official: false
    };
    if (fields.imageUrl) {
        payload.image_url = fields.imageUrl;
    }
    if (fields.verificationType) {
        payload.verification_type = fields.verificationType;
    }
    if (fields.platform) {
        payload.platform = fields.platform;
        payload.task_action = fields.taskAction || null;
        payload.task_target = fields.taskTarget || null;
        payload.task_keyword = fields.taskKeyword || null;
    }
    return payload;
}

var TWITTER_VERIFY_WORKER_URL = 'https://coinrealm-twitter-verify.samyang9695482.workers.dev';
var TELEGRAM_WORKER_URL = 'https://coinrealm-telegram-verify.samyang9695482.workers.dev';
var TELEGRAM_VERIFY_WORKER_URL = TELEGRAM_WORKER_URL;
var DISCORD_VERIFY_WORKER_URL = 'https://coinrealm-discord-verify.samyang9695482.workers.dev';
var DISCORD_OAUTH_WORKER_URL = DISCORD_VERIFY_WORKER_URL;
var DISCORD_OAUTH_CLIENT_ID = '1522853910480683209';
var DISCORD_OAUTH_REDIRECT_URI = 'https://coinrealm.pages.dev';
var DISCORD_OAUTH_SESSION_USER = 'coinrealm_discord_oauth_user_id';
var DISCORD_OAUTH_SESSION_RETURN = 'coinrealm_discord_oauth_return_hash';
var DISCORD_OAUTH_RESUME_SUBTASK = 'coinrealm_discord_oauth_resume_subtask';
var DISCORD_OAUTH_RESUME_TASK = 'coinrealm_discord_oauth_resume_task';
var DISCORD_OAUTH_PROCESSED_CODE = 'coinrealm_discord_oauth_processed_code';
var CRLM_CONTRACT_ADDRESS = '0x1378bbf6CC9f2A624f0B1c2Fd478Aa6F7B153d2e';
var CRLM_POLYGON_RPC = 'https://polygon.llamarpc.com';
var WITHDRAW_WORKER_URL = 'https://coinrealm-withdraw.samyang9695482.workers.dev';
// 平台充币收款地址（Polygon）
var DEPOSIT_WALLET_ADDRESS = '0x6f6ecc7fe6a3c5f8a50b5bd9a91dfd76e4ecf5b2';
// 平台提币出款地址（Polygon，Worker 使用 PLATFORM_PRIVATE_KEY 对应钱包）
var WITHDRAW_WALLET_ADDRESS = '0x29a186c7824f2d60601676c3530e7cdee6832f67';
var PLATFORM_WALLET_ADDRESS = WITHDRAW_WALLET_ADDRESS;

var WITHDRAW_SETTINGS_DEFAULTS = {
  withdraw_min_amount: 10,
  withdraw_max_per_tx: 5000,
  withdraw_max_daily_user: 10000,
  withdraw_max_daily_global: 100000
};
var cachedWithdrawSettings = null;

async function fetchWithdrawSettings() {
  if (cachedWithdrawSettings) return cachedWithdrawSettings;

  var settings = Object.assign({}, WITHDRAW_SETTINGS_DEFAULTS);
  if (!window.supabase) {
    cachedWithdrawSettings = settings;
    return settings;
  }

  try {
    var keys = Object.keys(WITHDRAW_SETTINGS_DEFAULTS);
    var result = await window.supabase
      .from('settings')
      .select('key, value')
      .in('key', keys);

    if (!result.error && result.data) {
      result.data.forEach(function (row) {
        var num = Number(row.value);
        if (row.key && Number.isFinite(num)) {
          settings[row.key] = num;
        }
      });
    }
  } catch (settingsErr) {
    console.warn('加载提币设置失败:', settingsErr);
  }

  cachedWithdrawSettings = settings;
  return settings;
}

function getWithdrawWorkerUrl() {
  return String(WITHDRAW_WORKER_URL || '').replace(/\/$/, '');
}

function invalidateWithdrawSettingsCache() {
  cachedWithdrawSettings = null;
}

var INVITE_SETTINGS_DEFAULTS = {
  invite_level1_reward: 50,
  invite_level2_reward: 10
};
var cachedInviteSettings = null;

async function fetchInviteSettings() {
  if (cachedInviteSettings) return cachedInviteSettings;

  var settings = Object.assign({}, INVITE_SETTINGS_DEFAULTS);
  if (!window.supabase) {
    cachedInviteSettings = settings;
    return settings;
  }

  try {
    var keys = Object.keys(INVITE_SETTINGS_DEFAULTS);
    var result = await window.supabase
      .from('settings')
      .select('key, value')
      .in('key', keys);

    if (!result.error && result.data) {
      result.data.forEach(function (row) {
        if (row.key && row.value != null && row.value !== '') {
          settings[row.key] = Number(row.value);
        }
      });
    }
  } catch (settingsErr) {
    console.warn('读取邀请奖励设置失败:', settingsErr);
  }

  cachedInviteSettings = settings;
  return settings;
}

function invalidateInviteSettingsCache() {
  cachedInviteSettings = null;
}

var ADS_CONFIG_DEFAULTS = {
  interval: 5,
  ads: [
    { name: '广告位 1', image: '', link: '', code: '', enabled: false },
    { name: '广告位 2', image: '', link: '', code: '', enabled: false },
    { name: '广告位 3', image: '', link: '', code: '', enabled: false }
  ]
};
var cachedAdsConfig = null;

function normalizeAdsConfig(raw) {
  var config = {
    interval: Number(raw && raw.interval) || ADS_CONFIG_DEFAULTS.interval,
    ads: []
  };

  if (!Number.isFinite(config.interval) || config.interval < 2) {
    config.interval = ADS_CONFIG_DEFAULTS.interval;
  }

  var sourceAds = raw && Array.isArray(raw.ads) ? raw.ads : [];
  for (var i = 0; i < 3; i++) {
    var item = sourceAds[i] || {};
    config.ads.push({
      name: String(item.name != null ? item.name : ADS_CONFIG_DEFAULTS.ads[i].name),
      image: String(item.image || ''),
      link: String(item.link || ''),
      code: String(item.code || ''),
      enabled: !!item.enabled
    });
  }

  return config;
}

async function fetchAdsConfig() {
  if (cachedAdsConfig) return cachedAdsConfig;

  var config = normalizeAdsConfig(ADS_CONFIG_DEFAULTS);
  if (!window.supabase) {
    cachedAdsConfig = config;
    return config;
  }

  try {
    var result = await window.supabase
      .from('settings')
      .select('value')
      .eq('key', 'ads_config')
      .maybeSingle();

    if (!result.error && result.data && result.data.value) {
      var parsed = null;
      try {
        parsed = JSON.parse(result.data.value);
      } catch (parseErr) {
        console.warn('解析广告配置失败:', parseErr);
      }
      if (parsed) {
        config = normalizeAdsConfig(parsed);
      }
    }
  } catch (settingsErr) {
    console.warn('读取广告配置失败:', settingsErr);
  }

  cachedAdsConfig = config;
  return config;
}

function invalidateAdsConfigCache() {
  cachedAdsConfig = null;
}

var adsCarouselTimer = null;
var adsCarouselFadeTimer = null;
var adsCarouselState = null;

function stopAdsCarousel() {
  if (adsCarouselTimer) {
    clearInterval(adsCarouselTimer);
    adsCarouselTimer = null;
  }
  if (adsCarouselFadeTimer) {
    clearTimeout(adsCarouselFadeTimer);
    adsCarouselFadeTimer = null;
  }
}

function getAdsPlaceholderText() {
  var langData = translations[currentLang] || translations.zh;
  return langData.ads_placeholder || translations.zh.ads_placeholder || '广告位招租 | 联系 @CoinRealm_X';
}

function buildAdsSlideContent(ad) {
  var parts = [];
  if (ad.image) {
    parts.push('<img class="ads-carousel-image" src="' + escapeHtml(ad.image) + '" alt="' + escapeHtml(ad.name || '') + '">');
  }
  if (ad.code) {
    parts.push('<div class="ads-carousel-code">' + ad.code + '</div>');
  }
  if (!parts.length && ad.name) {
    parts.push('<span class="ads-carousel-name">' + escapeHtml(ad.name) + '</span>');
  }
  if (!parts.length) {
    parts.push('<span class="ads-carousel-placeholder">' + escapeHtml(getAdsPlaceholderText()) + '</span>');
  }
  var clickableClass = ad.link ? ' is-clickable' : '';
  return '<div class="ads-carousel-content' + clickableClass + '" data-ad-link="' + escapeHtml(ad.link || '') + '">' + parts.join('') + '</div>';
}

function renderAdsSlide(slideEl, ad) {
  if (!slideEl) return;
  slideEl.innerHTML = buildAdsSlideContent(ad);
}

function renderAdsPlaceholder(slideEl) {
  if (!slideEl) return;
  slideEl.innerHTML = '<span class="ads-carousel-placeholder">' + escapeHtml(getAdsPlaceholderText()) + '</span>';
}

function updateAdsCarouselDots(dotsEl, slotIndex, config) {
  if (!dotsEl) return;

  dotsEl.innerHTML = '';
  for (var i = 0; i < 3; i++) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'ads-carousel-dot';
    dot.setAttribute('data-ad-index', String(i));
    dot.setAttribute('aria-label', 'Ad ' + (i + 1));
    if (!config.ads[i].enabled) {
      dot.disabled = true;
    }
    if (i === slotIndex) {
      dot.classList.add('is-active');
    }
    dotsEl.appendChild(dot);
  }
}

function showAdsCarouselSlot(slotIndex, options) {
  options = options || {};
  if (!adsCarouselState) return;

  var state = adsCarouselState;
  var ad = state.config.ads[slotIndex];
  if (!ad || !ad.enabled) return;

  var slideEl = state.slideEl;
  if (!slideEl) return;

  function applySlide() {
    renderAdsSlide(slideEl, ad);
    slideEl.classList.remove('is-fading');
    state.currentSlotIndex = slotIndex;
    state.rotationIndex = Math.max(0, state.enabledSlotIndices.indexOf(slotIndex));
    updateAdsCarouselDots(state.dotsEl, slotIndex, state.config);
  }

  if (options.animate === false) {
    applySlide();
    return;
  }

  slideEl.classList.add('is-fading');
  if (adsCarouselFadeTimer) {
    clearTimeout(adsCarouselFadeTimer);
  }
  adsCarouselFadeTimer = setTimeout(function () {
    applySlide();
    adsCarouselFadeTimer = null;
  }, 500);
}

function startAdsCarouselRotation() {
  stopAdsCarousel();
  if (!adsCarouselState || adsCarouselState.enabledSlotIndices.length <= 1) return;

  var intervalMs = (Number(adsCarouselState.config.interval) || 5) * 1000;
  adsCarouselTimer = setInterval(function () {
    if (!adsCarouselState || !adsCarouselState.enabledSlotIndices.length) return;
    var nextRotationIndex = (adsCarouselState.rotationIndex + 1) % adsCarouselState.enabledSlotIndices.length;
    var nextSlotIndex = adsCarouselState.enabledSlotIndices[nextRotationIndex];
    showAdsCarouselSlot(nextSlotIndex, { animate: true });
  }, intervalMs);
}

async function initAdsCarousel() {
  stopAdsCarousel();

  var carouselEl = document.getElementById('ads-carousel');
  var slideEl = document.getElementById('ads-carousel-slide');
  var dotsEl = document.getElementById('ads-carousel-dots');
  if (!carouselEl || !slideEl) return;

  var config = await fetchAdsConfig();
  var enabledSlotIndices = [];
  config.ads.forEach(function (ad, index) {
    if (ad.enabled) enabledSlotIndices.push(index);
  });

  adsCarouselState = {
    config: config,
    slideEl: slideEl,
    dotsEl: dotsEl,
    enabledSlotIndices: enabledSlotIndices,
    currentSlotIndex: -1,
    rotationIndex: 0
  };

  if (!enabledSlotIndices.length) {
    renderAdsPlaceholder(slideEl);
    slideEl.classList.remove('is-fading');
    if (dotsEl) {
      dotsEl.classList.add('hidden');
      dotsEl.setAttribute('aria-hidden', 'true');
      dotsEl.innerHTML = '';
    }
    return;
  }

  if (dotsEl) {
    dotsEl.classList.remove('hidden');
    dotsEl.setAttribute('aria-hidden', 'false');
  }

  showAdsCarouselSlot(enabledSlotIndices[0], { animate: false });
  startAdsCarouselRotation();
}

window.initAdsCarousel = initAdsCarousel;
window.invalidateAdsConfigCache = invalidateAdsConfigCache;

(function captureInviteRefFromUrl() {
  try {
    var params = new URLSearchParams(window.location.search);
    var ref = params.get('ref');
    if (ref) {
      localStorage.setItem('coinrealm_invite_ref', String(ref).trim());
    }
  } catch (captureErr) {
    console.warn('捕获邀请 ref 失败:', captureErr);
  }
})();

async function findInviterByRef(ref) {
  if (!ref || !window.supabase) return null;
  ref = String(ref).trim();
  if (!ref) return null;

  try {
    var exactResult = await window.supabase
      .from('users')
      .select('id, crlm_balance, invite_count, username')
      .eq('id', ref)
      .maybeSingle();

    if (!exactResult.error && exactResult.data) {
      return exactResult.data;
    }

    if (ref.length >= 8) {
      var prefixResult = await window.supabase
        .from('users')
        .select('id, crlm_balance, invite_count, username')
        .ilike('id', ref + '%')
        .limit(2);

      if (!prefixResult.error && prefixResult.data && prefixResult.data.length === 1) {
        return prefixResult.data[0];
      }
    }
  } catch (lookupErr) {
    console.warn('查找邀请人失败:', lookupErr);
  }

  return null;
}

async function grantInviteReward(inviter, inviteeId, level, amount) {
  if (!inviter || !inviteeId || amount <= 0 || !window.supabase) return false;

  var insertResult = await window.supabase.from('invites').insert({
    inviter_id: inviter.id,
    invitee_id: inviteeId,
    level: level,
    reward_amount: amount
  });

  if (insertResult.error) {
    console.warn('插入邀请记录失败:', insertResult.error);
    return false;
  }

  var newBalance = (Number(inviter.crlm_balance) || 0) + amount;
  var patchPayload = { crlm_balance: newBalance };

  if (level === 1) {
    patchPayload.invite_count = (Number(inviter.invite_count) || 0) + 1;
  }

  var updateResult = await window.supabase
    .from('users')
    .update(patchPayload)
    .eq('id', inviter.id);

  if (updateResult.error) {
    console.warn('更新邀请人奖励失败:', updateResult.error);
    return false;
  }

  inviter.crlm_balance = newBalance;
  if (level === 1) {
    inviter.invite_count = patchPayload.invite_count;
  }

  return true;
}

async function processInviteRewardsForUser(inviteeId, inviter) {
  if (!inviteeId || !inviter || inviter.id === inviteeId || !window.supabase) return;

  var settings = await fetchInviteSettings();
  var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
  var level2Reward = Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward;

  await grantInviteReward(inviter, inviteeId, 1, level1Reward);

  try {
    var parentResult = await window.supabase
      .from('invites')
      .select('inviter_id')
      .eq('invitee_id', inviter.id)
      .eq('level', 1)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!parentResult.error && parentResult.data && parentResult.data.inviter_id) {
      var grandResult = await window.supabase
        .from('users')
        .select('id, crlm_balance, invite_count')
        .eq('id', parentResult.data.inviter_id)
        .maybeSingle();

      if (!grandResult.error && grandResult.data && grandResult.data.id !== inviteeId) {
        await grantInviteReward(grandResult.data, inviteeId, 2, level2Reward);
      }
    }
  } catch (level2Err) {
    console.warn('处理二级邀请奖励失败:', level2Err);
  }
}

async function processPendingInviteRegistration() {
  if (!window.supabase) return;

  var ref = localStorage.getItem('coinrealm_invite_ref');
  if (!ref) return;

  var userId = await getCurrentUserId();
  if (!userId) return;

  try {
    var existingResult = await window.supabase
      .from('invites')
      .select('id')
      .eq('invitee_id', userId)
      .limit(1);

    if (!existingResult.error && existingResult.data && existingResult.data.length) {
      localStorage.removeItem('coinrealm_invite_ref');
      return;
    }

    var inviter = await findInviterByRef(ref);
    if (!inviter || inviter.id === userId) {
      localStorage.removeItem('coinrealm_invite_ref');
      return;
    }

    await processInviteRewardsForUser(userId, inviter);
    localStorage.removeItem('coinrealm_invite_ref');
  } catch (pendingErr) {
    console.warn('处理待处理邀请失败:', pendingErr);
  }
}

window.coinrealmProcessPendingInvite = processPendingInviteRegistration;

async function fetchDepositWalletAddress() {
  var configured = String(DEPOSIT_WALLET_ADDRESS || '').trim();
  if (configured) return configured;

  if (window.supabase) {
    try {
      var result = await window.supabase
        .from('settings')
        .select('value')
        .eq('key', 'deposit_wallet_address')
        .maybeSingle();
      if (!result.error && result.data && result.data.value) {
        return String(result.data.value).trim();
      }
    } catch (settingsErr) {
      console.warn('读取充币地址失败:', settingsErr);
    }
  }
  return '';
}

// CRLM 合约 ABI 见 contracts/CRLM.json，链上转账在 withdraw-worker 中使用
var TWITTER_OAUTH_SESSION_TOKEN = 'coinrealm_twitter_oauth_token_secret';
var TWITTER_OAUTH_SESSION_USER = 'coinrealm_twitter_oauth_user_id';
var TWITTER_OAUTH_SESSION_RETURN = 'coinrealm_twitter_oauth_return_hash';
var TWITTER_OAUTH_PENDING_CLAIM = 'coinrealm_twitter_oauth_pending_claim';

var twitterBindInitialized = false;
var twitterBindSubmitting = false;
var twitterBindOnSuccessCallback = null;

var twitterBindTranslations = {
    zh: {
        tw_bind_title: '绑定 Twitter 账号',
        tw_bind_desc: '验证任务需要你的 Twitter 账号信息',
        tw_bind_ph: '请输入你的 Twitter 用户名（如 @testuser）',
        tw_bind_confirm: '确认绑定',
        tw_bind_cancel: '取消',
        tw_bind_login_required: '请先登录',
        tw_bind_username_required: '请输入 Twitter 用户名',
        tw_bind_username_invalid: 'Twitter 用户名格式无效（1-15 位字母、数字或下划线）',
        tw_bind_save_fail: '保存失败：',
        tw_menu_unbound: '未绑定',
        tw_menu_bound: 'Twitter 已绑定 ✓',
        tw_profile_bind_label: '绑定 Twitter 账号',
        tw_profile_account_label: 'Twitter 账号'
    },
    en: {
        tw_bind_title: 'Link Twitter Account',
        tw_bind_desc: 'Task verification requires your Twitter account',
        tw_bind_ph: 'Enter your Twitter username (e.g. @testuser)',
        tw_bind_confirm: 'Confirm',
        tw_bind_cancel: 'Cancel',
        tw_bind_login_required: 'Please sign in first',
        tw_bind_username_required: 'Please enter your Twitter username',
        tw_bind_username_invalid: 'Invalid Twitter username (1-15 letters, numbers, or underscores)',
        tw_bind_save_fail: 'Save failed: ',
        tw_menu_unbound: 'Not linked',
        tw_menu_bound: 'Twitter linked ✓',
        tw_profile_bind_label: 'Link Twitter Account',
        tw_profile_account_label: 'Twitter Account'
    }
};

function getTwitterBindLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
}

function twT(key) {
    var dict = twitterBindTranslations[getTwitterBindLang()];
    return dict[key] || key;
}

function normalizeTwitterUsername(value) {
    var text = String(value || '').trim();
    if (!text) return '';
    var urlMatch = text.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]{1,15})(?:[\/?#]|$)/i);
    if (urlMatch) return urlMatch[1];
    return text.replace(/^@+/, '').trim();
}

async function fetchUserTwitterUsername(userId) {
    if (!window.supabase || !userId) return '';

    var result = await window.supabase
        .from('users')
        .select('twitter_username')
        .eq('id', userId)
        .maybeSingle();

    if (result.error || !result.data || !result.data.twitter_username) return '';
    return normalizeTwitterUsername(result.data.twitter_username);
}

function applyTwitterBindModalI18n() {
    var modal = document.getElementById('twitter-bind-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (twitterBindTranslations[getTwitterBindLang()][key]) {
            el.textContent = twT(key);
        }
    });

    modal.querySelectorAll('[data-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-placeholder');
        if (twitterBindTranslations[getTwitterBindLang()][key]) {
            el.setAttribute('placeholder', twT(key));
        }
    });
}

function hideTwitterBindModal() {
    var modal = document.getElementById('twitter-bind-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    twitterBindOnSuccessCallback = null;

    var errorEl = document.getElementById('twitter-bind-error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }
}

function showTwitterBindModalElement() {
    var modal = document.getElementById('twitter-bind-modal');
    if (!modal) return;
    applyTwitterBindModalI18n();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function updateTwitterBindStatusUi(username) {
    var bound = !!username;
    var handleText = bound ? ('@' + username) : twT('tw_menu_unbound');
    var profileLabel = document.getElementById('pf-twitter-menu-label');
    var profileStatus = document.getElementById('pf-twitter-menu-status');
    var authStatus = document.getElementById('auth-twitter-status');
    var authLabel = document.querySelector('.auth-dropdown-twitter-label');

    if (profileLabel) {
        profileLabel.textContent = bound ? twT('tw_profile_account_label') : twT('tw_profile_bind_label');
    }

    if (profileStatus) {
        profileStatus.textContent = handleText;
        profileStatus.classList.toggle('profile-menu-status-muted', !bound);
        profileStatus.classList.toggle('profile-menu-status-bound', bound);
        if (!bound) profileStatus.setAttribute('data-i18n', 'pf_twitter_unbound');
    }

    if (authLabel) {
        authLabel.textContent = getTwitterBindLang() === 'zh' ? 'Twitter 账号' : 'Twitter Account';
    }

    if (authStatus) {
        authStatus.textContent = bound ? twT('tw_menu_bound') : twT('tw_menu_unbound');
        authStatus.classList.toggle('auth-twitter-status-bound', bound);
    }
}

async function refreshTwitterBindStatusUi() {
    var userId = await getCurrentUserId();
    if (!userId) {
        updateTwitterBindStatusUi('');
        return;
    }

    var cached = coinrealmCurrentUserProfile && coinrealmCurrentUserProfile.twitter_username
        ? normalizeTwitterUsername(coinrealmCurrentUserProfile.twitter_username)
        : '';
    var username = cached || await fetchUserTwitterUsername(userId);

    if (coinrealmCurrentUserProfile && username) {
        coinrealmCurrentUserProfile.twitter_username = username;
    }

    updateTwitterBindStatusUi(username);
}

async function saveUserTwitterUsername(username) {
    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(twT('tw_bind_login_required'));
        return { success: false, error: 'not_logged_in' };
    }

    var updateResult = await window.supabase
        .from('users')
        .update({ twitter_username: username })
        .eq('id', userId);

    if (updateResult.error) {
        return { success: false, error: updateResult.error.message };
    }

    if (coinrealmCurrentUserProfile) {
        coinrealmCurrentUserProfile.twitter_username = username;
    }

    await refreshTwitterBindStatusUi();
    if (typeof window.coinrealmRefreshAuthArea === 'function') {
        window.coinrealmRefreshAuthArea();
    }

    return { success: true, username: username };
}

async function confirmTwitterBindModal() {
    if (twitterBindSubmitting || !window.supabase) return;

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(twT('tw_bind_login_required'));
        return;
    }

    var input = document.getElementById('twitter-bind-input');
    var errorEl = document.getElementById('twitter-bind-error');
    var username = normalizeTwitterUsername(input && input.value);

    if (!username) {
        if (errorEl) {
            errorEl.textContent = twT('tw_bind_username_required');
            errorEl.classList.remove('hidden');
        }
        return;
    }

    if (!/^[A-Za-z0-9_]{1,15}$/.test(username)) {
        if (errorEl) {
            errorEl.textContent = twT('tw_bind_username_invalid');
            errorEl.classList.remove('hidden');
        }
        return;
    }

    twitterBindSubmitting = true;
    var confirmBtn = document.getElementById('twitter-bind-confirm');
    if (confirmBtn) confirmBtn.disabled = true;

    try {
        var saveResult = await saveUserTwitterUsername(username);
        if (!saveResult.success) {
            if (errorEl) {
                errorEl.textContent = twT('tw_bind_save_fail') + (saveResult.error || '');
                errorEl.classList.remove('hidden');
            }
            return;
        }

        var callback = twitterBindOnSuccessCallback;
        hideTwitterBindModal();
        if (typeof callback === 'function') {
            callback(saveResult.username);
        }
    } finally {
        twitterBindSubmitting = false;
        if (confirmBtn) confirmBtn.disabled = false;
    }
}

function initTwitterBindModal() {
    if (twitterBindInitialized) return;
    twitterBindInitialized = true;

    document.addEventListener('click', function (e) {
        if (e.target.closest('#pf-twitter-bind-item')) {
            e.preventDefault();
            window.coinrealmOpenTwitterBindModal();
            return;
        }
        if (e.target.closest('#twitter-bind-cancel')) {
            hideTwitterBindModal();
            return;
        }
        if (e.target.closest('#twitter-bind-modal .td-twitter-modal-overlay')) {
            hideTwitterBindModal();
            return;
        }
        if (e.target.closest('#twitter-bind-confirm')) {
            confirmTwitterBindModal();
        }
    });

    applyTwitterBindModalI18n();
}

window.coinrealmOpenTwitterBindModal = async function (options) {
    options = options || {};

    if (!window.supabase) return;

    initTwitterBindModal();

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(twT('tw_bind_login_required'));
        return;
    }

    twitterBindOnSuccessCallback = typeof options.onSuccess === 'function' ? options.onSuccess : null;

    var titleEl = document.getElementById('twitter-bind-title');
    var descEl = document.getElementById('twitter-bind-desc');
    var input = document.getElementById('twitter-bind-input');
    var errorEl = document.getElementById('twitter-bind-error');

    if (titleEl) {
        titleEl.textContent = options.title ? options.title : twT('tw_bind_title');
    }
    if (descEl) {
        descEl.classList.toggle('hidden', options.showDesc !== true);
        if (options.showDesc) descEl.textContent = options.desc || twT('tw_bind_desc');
    }
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }

    var existing = await fetchUserTwitterUsername(userId);
    if (input) {
        input.value = existing ? ('@' + existing) : '';
        input.setAttribute('placeholder', twT('tw_bind_ph'));
    }

    showTwitterBindModalElement();

    if (input) {
        setTimeout(function () { input.focus(); }, 50);
    }
};

window.coinrealmRefreshTwitterBindUi = refreshTwitterBindStatusUi;
window.coinrealmFetchTwitterUsername = fetchUserTwitterUsername;

var telegramBindInitialized = false;
var telegramBindSubmitting = false;
var telegramBindOnSuccessCallback = null;

var telegramBindTranslations = {
    zh: {
        tg_bind_title: '绑定 Telegram 账号',
        tg_bind_desc: '验证任务需要你的 Telegram 账号信息',
        tg_bind_ph: '请输入你的 Telegram 用户名（如 @testuser）',
        tg_bind_confirm: '确认绑定',
        tg_bind_cancel: '取消',
        tg_bind_login_required: '请先登录',
        tg_bind_username_required: '请输入 Telegram 用户名',
        tg_bind_username_invalid: 'Telegram 用户名格式无效（5-32 位字母、数字或下划线）',
        tg_bind_save_fail: '保存失败：',
        tg_menu_unbound: '未绑定',
        tg_menu_bound: 'Telegram 已绑定 ✓',
        tg_profile_bind_label: '绑定 Telegram 账号',
        tg_profile_account_label: 'Telegram 账号'
    },
    en: {
        tg_bind_title: 'Link Telegram Account',
        tg_bind_desc: 'Task verification requires your Telegram account',
        tg_bind_ph: 'Enter your Telegram username (e.g. @testuser)',
        tg_bind_confirm: 'Confirm',
        tg_bind_cancel: 'Cancel',
        tg_bind_login_required: 'Please sign in first',
        tg_bind_username_required: 'Please enter your Telegram username',
        tg_bind_username_invalid: 'Invalid Telegram username (5-32 letters, numbers, or underscores)',
        tg_bind_save_fail: 'Save failed: ',
        tg_menu_unbound: 'Not linked',
        tg_menu_bound: 'Telegram linked ✓',
        tg_profile_bind_label: 'Link Telegram Account',
        tg_profile_account_label: 'Telegram Account'
    }
};

function tgT(key) {
    var dict = telegramBindTranslations[getTwitterBindLang()];
    return dict[key] || key;
}

function normalizeTelegramUsername(value) {
    var text = String(value || '').trim();
    if (!text) return '';
    var urlMatch = text.match(/t\.me\/([A-Za-z0-9_]{5,32})/i);
    if (urlMatch) return urlMatch[1];
    return text.replace(/^@+/, '').trim();
}

async function fetchUserTelegramUsername(userId) {
    if (!window.supabase || !userId) return '';

    var result = await window.supabase
        .from('users')
        .select('telegram_username')
        .eq('id', userId)
        .maybeSingle();

    if (result.error || !result.data || !result.data.telegram_username) return '';
    return normalizeTelegramUsername(result.data.telegram_username);
}

function applyTelegramBindModalI18n() {
    var modal = document.getElementById('telegram-bind-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (telegramBindTranslations[getTwitterBindLang()][key]) {
            el.textContent = tgT(key);
        }
    });

    modal.querySelectorAll('[data-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-placeholder');
        if (telegramBindTranslations[getTwitterBindLang()][key]) {
            el.setAttribute('placeholder', tgT(key));
        }
    });
}

function hideTelegramBindModal() {
    var modal = document.getElementById('telegram-bind-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    telegramBindOnSuccessCallback = null;

    var errorEl = document.getElementById('telegram-bind-error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }
}

function showTelegramBindModalElement() {
    var modal = document.getElementById('telegram-bind-modal');
    if (!modal) return;
    applyTelegramBindModalI18n();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function updateTelegramBindStatusUi(username) {
    var bound = !!username;
    var handleText = bound ? ('@' + username) : tgT('tg_menu_unbound');
    var profileLabel = document.getElementById('pf-telegram-menu-label');
    var profileStatus = document.getElementById('pf-telegram-menu-status');

    if (profileLabel) {
        profileLabel.textContent = bound ? tgT('tg_profile_account_label') : tgT('tg_profile_bind_label');
    }

    if (profileStatus) {
        profileStatus.textContent = handleText;
        profileStatus.classList.toggle('profile-menu-status-muted', !bound);
        profileStatus.classList.toggle('profile-menu-status-bound', bound);
        if (!bound) profileStatus.setAttribute('data-i18n', 'pf_telegram_unbound');
    }
}

async function refreshTelegramBindStatusUi() {
    var userId = await getCurrentUserId();
    if (!userId) {
        updateTelegramBindStatusUi('');
        return;
    }

    var cached = coinrealmCurrentUserProfile && coinrealmCurrentUserProfile.telegram_username
        ? normalizeTelegramUsername(coinrealmCurrentUserProfile.telegram_username)
        : '';
    var username = cached || await fetchUserTelegramUsername(userId);

    if (coinrealmCurrentUserProfile && username) {
        coinrealmCurrentUserProfile.telegram_username = username;
    }

    updateTelegramBindStatusUi(username);
}

async function saveUserTelegramUsername(username) {
    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(tgT('tg_bind_login_required'));
        return { success: false, error: 'not_logged_in' };
    }

    var updateResult = await window.supabase
        .from('users')
        .update({ telegram_username: username })
        .eq('id', userId);

    if (updateResult.error) {
        return { success: false, error: updateResult.error.message };
    }

    if (coinrealmCurrentUserProfile) {
        coinrealmCurrentUserProfile.telegram_username = username;
    }

    await refreshTelegramBindStatusUi();
    return { success: true, username: username };
}

async function confirmTelegramBindModal() {
    if (telegramBindSubmitting || !window.supabase) return;

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(tgT('tg_bind_login_required'));
        return;
    }

    var input = document.getElementById('telegram-bind-input');
    var errorEl = document.getElementById('telegram-bind-error');
    var username = normalizeTelegramUsername(input && input.value);

    if (!username) {
        if (errorEl) {
            errorEl.textContent = tgT('tg_bind_username_required');
            errorEl.classList.remove('hidden');
        }
        return;
    }

    if (!/^[A-Za-z0-9_]{5,32}$/.test(username)) {
        if (errorEl) {
            errorEl.textContent = tgT('tg_bind_username_invalid');
            errorEl.classList.remove('hidden');
        }
        return;
    }

    telegramBindSubmitting = true;
    var confirmBtn = document.getElementById('telegram-bind-confirm');
    if (confirmBtn) confirmBtn.disabled = true;

    try {
        var saveResult = await saveUserTelegramUsername(username);
        if (!saveResult.success) {
            if (errorEl) {
                errorEl.textContent = tgT('tg_bind_save_fail') + (saveResult.error || '');
                errorEl.classList.remove('hidden');
            }
            return;
        }

        var callback = telegramBindOnSuccessCallback;
        hideTelegramBindModal();
        if (typeof callback === 'function') {
            callback(saveResult.username);
        }
    } finally {
        telegramBindSubmitting = false;
        if (confirmBtn) confirmBtn.disabled = false;
    }
}

function initTelegramBindModal() {
    if (telegramBindInitialized) return;
    telegramBindInitialized = true;

    document.addEventListener('click', function (e) {
        if (e.target.closest('#pf-telegram-bind-item')) {
            e.preventDefault();
            window.coinrealmOpenTelegramBindModal();
            return;
        }
        if (e.target.closest('#telegram-bind-cancel')) {
            hideTelegramBindModal();
            return;
        }
        if (e.target.closest('#telegram-bind-modal .td-twitter-modal-overlay')) {
            hideTelegramBindModal();
            return;
        }
        if (e.target.closest('#telegram-bind-confirm')) {
            confirmTelegramBindModal();
        }
    });

    applyTelegramBindModalI18n();
}

window.coinrealmOpenTelegramBindModal = async function (options) {
    options = options || {};

    if (!window.supabase) return;

    initTelegramBindModal();

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(tgT('tg_bind_login_required'));
        return;
    }

    telegramBindOnSuccessCallback = typeof options.onSuccess === 'function' ? options.onSuccess : null;

    var titleEl = document.getElementById('telegram-bind-title');
    var descEl = document.getElementById('telegram-bind-desc');
    var input = document.getElementById('telegram-bind-input');
    var errorEl = document.getElementById('telegram-bind-error');

    if (titleEl) titleEl.textContent = tgT('tg_bind_title');
    if (descEl) {
        descEl.textContent = tgT('tg_bind_desc');
        descEl.classList.toggle('hidden', options.showDesc === false);
    }
    if (input) input.value = '';
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }

    var existing = await fetchUserTelegramUsername(userId);
    if (existing && input) input.value = '@' + existing;

    showTelegramBindModalElement();
};

window.coinrealmFetchTelegramUsername = fetchUserTelegramUsername;
window.coinrealmRefreshTelegramBindUi = refreshTelegramBindStatusUi;
window.coinrealmNormalizeTelegramUsername = normalizeTelegramUsername;

var discordBindInitialized = false;
var discordBindSubmitting = false;
var discordBindOnSuccessCallback = null;
var discordBindPendingTaskIndex = null;
var discordBindPendingTaskId = null;
var discordOAuthReturnInFlight = null;

var discordBindTranslations = {
    zh: {
        dc_bind_title: '绑定 Discord 账号',
        dc_bind_desc: '首次使用需要授权 CoinRealm 访问你的 Discord 账号',
        dc_bind_authorize: '去授权',
        dc_bind_cancel: '取消',
        dc_bind_required_title: '需要绑定 Discord',
        dc_bind_required_msg: '请先在个人中心绑定 Discord 账号',
        dc_bind_required_go: '前往个人中心',
        dc_bind_login_required: '请先登录',
        dc_bind_oauth_fail: 'Discord 授权失败：',
        dc_bind_oauth_cancelled: '授权失败或已取消',
        dc_bind_oauth_success: 'Discord 账号已成功绑定',
        dc_menu_unbound: '未绑定',
        dc_profile_bind_label: '绑定 Discord 账号',
        dc_profile_account_label: 'Discord 账号'
    },
    en: {
        dc_bind_title: 'Link Discord Account',
        dc_bind_desc: 'First-time use requires authorizing CoinRealm to access your Discord account',
        dc_bind_authorize: 'Authorize',
        dc_bind_cancel: 'Cancel',
        dc_bind_required_title: 'Discord Link Required',
        dc_bind_required_msg: 'Please link your Discord account in Profile first',
        dc_bind_required_go: 'Go to Profile',
        dc_bind_login_required: 'Please sign in first',
        dc_bind_oauth_fail: 'Discord authorization failed: ',
        dc_bind_oauth_cancelled: 'Authorization failed or cancelled',
        dc_bind_oauth_success: 'Discord account linked successfully',
        dc_menu_unbound: 'Not linked',
        dc_profile_bind_label: 'Link Discord Account',
        dc_profile_account_label: 'Discord Account'
    }
};

function dcT(key) {
    var dict = discordBindTranslations[getTwitterBindLang()];
    return dict[key] || key;
}

function normalizeDiscordUsername(value) {
    var text = String(value || '').trim();
    if (!text) return '';
    return text.replace(/^@+/, '').trim();
}

async function fetchUserDiscordAccount(userId) {
    if (!window.supabase || !userId) return { userId: '', username: '' };

    var result = await window.supabase
        .from('users')
        .select('discord_user_id, discord_username')
        .eq('id', userId)
        .maybeSingle();

    if (result.error || !result.data || !result.data.discord_user_id) {
        return { userId: '', username: '' };
    }

    return {
        userId: String(result.data.discord_user_id),
        username: normalizeDiscordUsername(result.data.discord_username || '')
    };
}

function applyDiscordBindModalI18n() {
    var modals = [
        document.getElementById('discord-bind-modal'),
        document.getElementById('discord-bind-required-modal')
    ];
    modals.forEach(function (modal) {
        if (!modal) return;
        modal.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (discordBindTranslations[getTwitterBindLang()][key]) {
                el.textContent = dcT(key);
            }
        });
    });
}

function hideDiscordBindModal() {
    var modal = document.getElementById('discord-bind-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    discordBindOnSuccessCallback = null;
    discordBindPendingTaskIndex = null;
    discordBindPendingTaskId = null;
    sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
    sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);

    var errorEl = document.getElementById('discord-bind-error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }
}

function showDiscordBindModalElement() {
    var modal = document.getElementById('discord-bind-modal');
    if (!modal) return;
    applyDiscordBindModalI18n();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function hideDiscordBindRequiredModal() {
    var modal = document.getElementById('discord-bind-required-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function showDiscordBindRequiredModal() {
    initDiscordBindModal();
    applyDiscordBindModalI18n();
    var modal = document.getElementById('discord-bind-required-modal');
    if (!modal) {
        alert(dcT('dc_bind_required_msg'));
        return;
    }
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function updateDiscordBindStatusUi(account) {
    account = account || {};
    var bound = !!account.userId;
    var handleText = bound
        ? (account.username ? account.username : ('ID ' + account.userId))
        : dcT('dc_menu_unbound');
    var profileLabel = document.getElementById('pf-discord-menu-label');
    var profileStatus = document.getElementById('pf-discord-menu-status');

    if (profileLabel) {
        profileLabel.textContent = bound ? dcT('dc_profile_account_label') : dcT('dc_profile_bind_label');
    }

    if (profileStatus) {
        profileStatus.textContent = handleText;
        profileStatus.classList.toggle('profile-menu-status-muted', !bound);
        profileStatus.classList.toggle('profile-menu-status-bound', bound);
        if (!bound) profileStatus.setAttribute('data-i18n', 'pf_discord_unbound');
    }
}

async function refreshDiscordBindStatusUi() {
    var userId = await getCurrentUserId();
    if (!userId) {
        updateDiscordBindStatusUi(null);
        return;
    }

    var cached = coinrealmCurrentUserProfile && coinrealmCurrentUserProfile.discord_user_id
        ? {
            userId: String(coinrealmCurrentUserProfile.discord_user_id),
            username: normalizeDiscordUsername(coinrealmCurrentUserProfile.discord_username || '')
        }
        : null;
    var account = cached && cached.userId ? cached : await fetchUserDiscordAccount(userId);

    if (coinrealmCurrentUserProfile && account.userId) {
        coinrealmCurrentUserProfile.discord_user_id = account.userId;
        coinrealmCurrentUserProfile.discord_username = account.username;
    }

    updateDiscordBindStatusUi(account);
}

function normalizeDiscordRouteHash(value) {
    var hash = String(value || '').trim();
    if (!hash) return '#profile';
    return hash.charAt(0) === '#' ? hash : '#' + hash;
}

function extractTaskIdFromDiscordRouteHash(hash) {
    var normalized = normalizeDiscordRouteHash(hash).replace(/^#/, '');
    if (normalized.indexOf('task-detail') === -1) return '';
    var query = normalized.split('?')[1];
    if (!query) return '';
    return new URLSearchParams(query).get('id') || '';
}

function extractTaskIdFromDiscordOAuthState(stateValue) {
    var text = String(stateValue || '').trim();
    if (!text) return '';

    if (text.indexOf('task-detail') !== -1) {
        return extractTaskIdFromDiscordRouteHash(text);
    }

    if (/^[0-9a-f-]{36}$/i.test(text)) {
        return text;
    }

    return '';
}

function buildDiscordOAuthState(options) {
    options = options || {};
    var taskId = String(options.taskId || '').trim();
    if (!taskId && options.returnHash) {
        taskId = extractTaskIdFromDiscordRouteHash(options.returnHash);
    }
    if (taskId) {
        return 'task-detail?id=' + encodeURIComponent(taskId);
    }
    return String(options.returnHash || '#profile').replace(/^#/, '') || 'profile';
}

function resolveDiscordOAuthReturnHash(params, returnHash) {
    var stateParam = params.get('state');
    if (stateParam) {
        try {
            var decodedState = decodeURIComponent(stateParam);
            console.log('[discord-oauth] 解析 state 参数：', decodedState);
            if (decodedState.indexOf('task-detail') !== -1 || /^[0-9a-f-]{36}$/i.test(decodedState)) {
                return normalizeDiscordRouteHash(decodedState);
            }
        } catch (_decodeErr) {
            console.log('[discord-oauth] state 解码失败，使用原始值：', stateParam);
        }
        return normalizeDiscordRouteHash(stateParam);
    }
    return normalizeDiscordRouteHash(returnHash || '#profile');
}

function restoreDiscordOAuthTaskRoute(params, returnHash) {
    var targetHash = resolveDiscordOAuthReturnHash(params, returnHash);
    var resumeTaskId = sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK) || '';
    var taskId = resumeTaskId || extractTaskIdFromDiscordOAuthState(params.get('state')) || extractTaskIdFromDiscordRouteHash(targetHash);

    if (!taskId) {
        console.log('[discord-oauth] 未解析到任务 ID，targetHash：', targetHash);
        return '';
    }

    var hashValue = 'task-detail?id=' + encodeURIComponent(taskId);
    console.log('[discord-oauth] 恢复到任务详情页：', hashValue);

    if (window.location.hash.replace(/^#/, '') !== hashValue) {
        window.location.hash = hashValue;
    }

    return taskId;
}

function clearDiscordOAuthCallbackUrl(options) {
    options = options || {};
    var targetHash = normalizeDiscordRouteHash(options.targetHash || '#profile');
    var resumeTaskId = String(options.resumeTaskId || '').trim();
    var taskId = resumeTaskId || extractTaskIdFromDiscordRouteHash(targetHash);
    var nextUrl;

    if (taskId) {
        var hashValue = 'task-detail?id=' + encodeURIComponent(taskId);
        nextUrl = window.location.origin + window.location.pathname + '#' + hashValue;
        console.log('[discord-oauth] 清理 URL，跳转到：', nextUrl);
        window.history.replaceState(null, '', nextUrl);
        if (window.location.hash.replace(/^#/, '') !== hashValue) {
            window.location.hash = hashValue;
        }
        return;
    }

    nextUrl = window.location.origin + window.location.pathname + targetHash;
    console.log('[discord-oauth] 清理 URL，跳转到：', nextUrl);
    window.history.replaceState(null, '', nextUrl);

    if (!window.location.search) {
        var hashBody = nextUrl.split('#')[1] || '';
        if (hashBody && window.location.hash.replace(/^#/, '') !== hashBody) {
            window.location.hash = hashBody;
        }
    }
}

function buildDiscordOAuthUrl(state) {
    var params = new URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENT_ID,
        response_type: 'code',
        redirect_uri: DISCORD_OAUTH_REDIRECT_URI,
        scope: 'identify guilds.members.read',
        state: state || ''
    });
    return 'https://discord.com/api/oauth2/authorize?' + params.toString();
}

async function startDiscordOAuthFlow(options) {
    options = options || {};
    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(dcT('dc_bind_login_required'));
        return { success: false };
    }

    var returnHash = options.returnHash || window.location.hash || '#profile';
    returnHash = normalizeDiscordRouteHash(returnHash);
    var taskId = options.taskId || extractTaskIdFromDiscordRouteHash(returnHash);
    if (taskId) {
        returnHash = '#task-detail?id=' + encodeURIComponent(taskId);
    }
    var oauthState = buildDiscordOAuthState({ taskId: taskId, returnHash: returnHash });
    var authorizeUrl = buildDiscordOAuthUrl(oauthState);

    console.log('[discord-oauth] 生成授权链接', {
        taskId: taskId,
        returnHash: returnHash,
        oauthState: oauthState,
        authorizeUrl: authorizeUrl
    });

    sessionStorage.setItem(DISCORD_OAUTH_SESSION_USER, userId);
    sessionStorage.setItem(DISCORD_OAUTH_SESSION_RETURN, returnHash);
    sessionStorage.setItem('coinrealm_discord_oauth_pending', '1');
    sessionStorage.removeItem(DISCORD_OAUTH_PROCESSED_CODE);
    if (taskId) {
        sessionStorage.setItem(DISCORD_OAUTH_RESUME_TASK, String(taskId));
    }
    window.location.href = authorizeUrl;
    return { success: true, redirecting: true };
}

async function callDiscordOAuthWorker(payload) {
    var workerUrl = DISCORD_VERIFY_WORKER_URL || DISCORD_OAUTH_WORKER_URL;
    if (!workerUrl || workerUrl === 'WORKER_URL_PLACEHOLDER') {
        return { success: false, error: 'Discord OAuth worker URL not configured', reason: 'Discord OAuth worker URL not configured' };
    }

    console.log('准备发送 code 到 Worker：', payload && payload.code);
    console.log('Discord OAuth Worker URL：', workerUrl, '参数：', payload);

    var response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload || {})
    });

    var responseText = await response.text();
    var workerResult = null;
    try {
        workerResult = responseText ? JSON.parse(responseText) : null;
    } catch (_parseErr) {
        workerResult = { success: false, error: responseText || 'Invalid worker response', reason: responseText || 'Invalid worker response' };
    }

    console.log('Worker 返回：', workerResult);

    if (!response.ok) {
        return {
            success: false,
            error: (workerResult && workerResult.error) || ('Worker request failed: ' + response.status),
            reason: workerResult && (workerResult.reason || workerResult.error)
        };
    }

    return workerResult || { success: false, error: 'Empty worker response', reason: 'Empty worker response' };
}

async function resolveDiscordOAuthUserId(sessionUserId) {
    var userId = sessionUserId || '';
    if (userId) return userId;

    userId = await getAuthenticatedUserId();
    if (userId) return userId;

    userId = await getCurrentUserId();
    if (userId) return userId;

    await new Promise(function (resolve) {
        setTimeout(resolve, 400);
    });

    userId = await getAuthenticatedUserId();
    if (userId) return userId;

    return await getCurrentUserId();
}

async function handleDiscordOAuthReturn() {
    console.log('当前 URL：', window.location.href);

    var params = new URLSearchParams(window.location.search);
    var code = params.get('code');
    var oauthError = params.get('error');
    var oauthState = params.get('state');

    console.log('[discord-oauth] 回调参数', {
        hasCode: !!code,
        codePreview: code ? String(code).slice(0, 8) + '...' : '',
        oauthState: oauthState,
        oauthError: oauthError
    });

    if (!code && oauthError) {
        console.log('[discord-oauth] Discord 返回错误：', oauthError, params.get('error_description'));
        restoreDiscordOAuthTaskRoute(params, sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN));
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);
        clearDiscordOAuthCallbackUrl({
            targetHash: resolveDiscordOAuthReturnHash(params, sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN)),
            resumeTaskId: sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK)
        });
        alert(dcT('dc_bind_oauth_cancelled'));
        return true;
    }

    if (!code) {
        return false;
    }

    if (!String(code).trim()) {
        console.log('[discord-oauth] code 为空字符串');
        restoreDiscordOAuthTaskRoute(params, sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN));
        clearDiscordOAuthCallbackUrl({
            targetHash: resolveDiscordOAuthReturnHash(params, sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN)),
            resumeTaskId: sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK)
        });
        alert(dcT('dc_bind_oauth_cancelled'));
        return true;
    }

    var processedCode = sessionStorage.getItem(DISCORD_OAUTH_PROCESSED_CODE);
    if (processedCode === code) {
        restoreDiscordOAuthTaskRoute(params, sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN));
        clearDiscordOAuthCallbackUrl({
            targetHash: resolveDiscordOAuthReturnHash(params, sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN)),
            resumeTaskId: sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK)
        });
        return true;
    }

    if (discordOAuthReturnInFlight) {
        return discordOAuthReturnInFlight;
    }

    discordOAuthReturnInFlight = (async function () {
    var returnHash = sessionStorage.getItem(DISCORD_OAUTH_SESSION_RETURN) || window.location.hash || '#profile';
    var resumeTaskId = sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK) || extractTaskIdFromDiscordOAuthState(oauthState) || '';
    var targetHash = resolveDiscordOAuthReturnHash(params, returnHash);
    var sessionUserId = sessionStorage.getItem(DISCORD_OAUTH_SESSION_USER) || '';

    restoreDiscordOAuthTaskRoute(params, returnHash);

    sessionStorage.removeItem(DISCORD_OAUTH_SESSION_USER);
    sessionStorage.removeItem(DISCORD_OAUTH_SESSION_RETURN);
    sessionStorage.removeItem('coinrealm_discord_oauth_pending');

    var userId = await resolveDiscordOAuthUserId(sessionUserId);
    if (!userId) {
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);
        alert(dcT('dc_bind_login_required'));
        clearDiscordOAuthCallbackUrl({ targetHash: targetHash, resumeTaskId: resumeTaskId });
        return true;
    }

    console.log('[discord-oauth] 准备绑定，userId：', userId, 'taskId：', resumeTaskId);

    var workerResult = await callDiscordOAuthWorker({
        code: code,
        user_id: userId,
        redirect_uri: DISCORD_OAUTH_REDIRECT_URI
    });

    clearDiscordOAuthCallbackUrl({ targetHash: targetHash, resumeTaskId: resumeTaskId });

    if (!workerResult || !workerResult.success) {
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);
        var failReason = (workerResult && (workerResult.reason || workerResult.error)) || '';
        if (String(failReason).indexOf('缺少 code') !== -1) {
            alert(dcT('dc_bind_oauth_cancelled'));
        } else {
            alert(dcT('dc_bind_oauth_fail') + failReason);
        }
        return true;
    }

    sessionStorage.setItem(DISCORD_OAUTH_PROCESSED_CODE, code);

    if (coinrealmCurrentUserProfile) {
        coinrealmCurrentUserProfile.discord_user_id = workerResult.discord_user_id || '';
        coinrealmCurrentUserProfile.discord_username = workerResult.discord_username || '';
    }

    await refreshDiscordBindStatusUi();

    var resumeTaskIdAfterBind = sessionStorage.getItem(DISCORD_OAUTH_RESUME_TASK);
    if (!resumeTaskIdAfterBind) {
        alert(dcT('dc_bind_oauth_success') + (workerResult.discord_username ? '（' + workerResult.discord_username + '）' : ''));
    }

    discordBindOnSuccessCallback = null;
    return true;
    })();

    try {
        return await discordOAuthReturnInFlight;
    } finally {
        discordOAuthReturnInFlight = null;
    }
}

function initDiscordBindModal() {
    if (discordBindInitialized) return;
    discordBindInitialized = true;

    document.addEventListener('click', function (e) {
        if (e.target.closest('#pf-discord-bind-item')) {
            e.preventDefault();
            window.coinrealmOpenDiscordBindModal();
            return;
        }
        if (e.target.closest('#discord-bind-cancel')) {
            hideDiscordBindModal();
            return;
        }
        if (e.target.closest('#discord-bind-modal .td-twitter-modal-overlay')) {
            hideDiscordBindModal();
            return;
        }
        if (e.target.closest('#discord-bind-authorize')) {
            startDiscordOAuthFromModal();
            return;
        }
        if (e.target.closest('#discord-bind-required-cancel')) {
            hideDiscordBindRequiredModal();
            return;
        }
        if (e.target.closest('#discord-bind-required-modal .td-twitter-modal-overlay')) {
            hideDiscordBindRequiredModal();
            return;
        }
        if (e.target.closest('#discord-bind-required-profile')) {
            hideDiscordBindRequiredModal();
            if (typeof window.coinrealmApplyRoute === 'function') {
                window.coinrealmApplyRoute('profile');
            } else {
                window.location.hash = 'profile';
            }
        }
    });

    applyDiscordBindModalI18n();
}

async function startDiscordOAuthFromModal() {
    if (discordBindSubmitting) return;

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(dcT('dc_bind_login_required'));
        return;
    }

    if (discordBindPendingTaskIndex != null && discordBindPendingTaskId) {
        sessionStorage.setItem(DISCORD_OAUTH_RESUME_SUBTASK, String(discordBindPendingTaskIndex));
        sessionStorage.setItem(DISCORD_OAUTH_RESUME_TASK, String(discordBindPendingTaskId));
    } else {
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);
    }

    discordBindSubmitting = true;
    var authBtn = document.getElementById('discord-bind-authorize');
    if (authBtn) authBtn.disabled = true;

    try {
        var taskId = discordBindPendingTaskId || extractTaskIdFromDiscordRouteHash(window.location.hash);
        var returnHash = taskId
            ? ('#task-detail?id=' + encodeURIComponent(taskId))
            : (window.location.hash || '#profile');
        await startDiscordOAuthFlow({ returnHash: returnHash, taskId: taskId });
    } finally {
        discordBindSubmitting = false;
        if (authBtn) authBtn.disabled = false;
    }
}

window.coinrealmOpenDiscordBindModal = async function (options) {
    options = options || {};
    if (!window.supabase) return;

    initDiscordBindModal();

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(dcT('dc_bind_login_required'));
        return;
    }

    var account = await fetchUserDiscordAccount(userId);
    if (account.userId) {
        updateDiscordBindStatusUi(account);
        if (typeof options.onSuccess === 'function') {
            options.onSuccess(account);
        }
        return;
    }

    discordBindOnSuccessCallback = typeof options.onSuccess === 'function' ? options.onSuccess : null;
    discordBindPendingTaskIndex = options.taskIndex != null ? options.taskIndex : null;
    discordBindPendingTaskId = options.taskId || null;

    if (discordBindPendingTaskIndex != null && discordBindPendingTaskId) {
        sessionStorage.setItem(DISCORD_OAUTH_RESUME_SUBTASK, String(discordBindPendingTaskIndex));
        sessionStorage.setItem(DISCORD_OAUTH_RESUME_TASK, String(discordBindPendingTaskId));
    } else {
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_SUBTASK);
        sessionStorage.removeItem(DISCORD_OAUTH_RESUME_TASK);
    }

    var titleEl = document.getElementById('discord-bind-title');
    var descEl = document.getElementById('discord-bind-desc');
    if (titleEl) titleEl.textContent = dcT('dc_bind_title');
    if (descEl) {
        descEl.textContent = dcT('dc_bind_desc');
        descEl.classList.remove('hidden');
    }

    var errorEl = document.getElementById('discord-bind-error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.add('hidden');
    }

    showDiscordBindModalElement();
};

window.coinrealmShowDiscordBindRequiredModal = showDiscordBindRequiredModal;

window.coinrealmFetchDiscordAccount = fetchUserDiscordAccount;
window.coinrealmRefreshDiscordBindUi = refreshDiscordBindStatusUi;
window.coinrealmHandleDiscordOAuthReturn = handleDiscordOAuthReturn;
window.coinrealmWaitForDiscordOAuthReturn = async function () {
    if (discordOAuthReturnInFlight) {
        await discordOAuthReturnInFlight.catch(function () {});
    }
};
window.startDiscordOAuthFlow = startDiscordOAuthFlow;

async function callTelegramVerifyWorker(payload) {
    if (!TELEGRAM_WORKER_URL || TELEGRAM_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
        console.warn('Telegram Worker URL 未配置');
        return { success: false, verified: false, error: 'Telegram worker URL not configured' };
    }

    var input = payload || {};
    var requestPayload = {
        task_id: input.task_id || input.taskId,
        user_id: input.user_id || input.userId
    };

    if (input.action_index != null || input.actionIndex != null) {
        requestPayload.action_index = input.action_index != null ? input.action_index : input.actionIndex;
    }
    if (input.subtask_only === true || input.subtaskOnly === true) {
        requestPayload.subtask_only = true;
    }

    console.log('调用 Telegram Worker，URL：', TELEGRAM_WORKER_URL, '参数：', requestPayload);

    var response = await fetch(TELEGRAM_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
    });

    var responseText = await response.text();
    var workerResult = null;

    try {
        workerResult = responseText ? JSON.parse(responseText) : null;
    } catch (_parseErr) {
        workerResult = { success: false, error: responseText || 'Invalid worker response' };
    }

    console.log('Telegram Worker 返回：', workerResult);

    if (!response.ok) {
        return {
            success: false,
            verified: false,
            httpStatus: response.status,
            error: (workerResult && workerResult.error) || ('Worker request failed: ' + response.status),
            reason: workerResult && (workerResult.reason || workerResult.error)
        };
    }

    return workerResult || { success: false, verified: false, error: 'Empty worker response' };
}

async function verifyTelegramSubtask(taskId, userId, actionIndex) {
    if (!taskId || !userId || actionIndex == null) {
        return { success: false, verified: false, error: 'missing params' };
    }

    if (!TELEGRAM_WORKER_URL || TELEGRAM_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
        return { success: false, verified: false, reason: 'Telegram Worker 未配置' };
    }

    try {
        var workerResult = await callTelegramVerifyWorker({
            task_id: taskId,
            user_id: userId,
            action_index: actionIndex,
            subtask_only: true
        });

        if (workerResult.httpStatus) {
            return {
                success: false,
                verified: false,
                error: workerResult.error,
                reason: workerResult.reason || workerResult.error
            };
        }

        return {
            success: workerResult.verified === true,
            verified: workerResult.verified === true,
            reason: workerResult.reason || workerResult.error || '',
            action_index: workerResult.action_index
        };
    } catch (err) {
        return {
            success: false,
            verified: false,
            error: err && err.message ? err.message : String(err),
            reason: err && err.message ? err.message : String(err)
        };
    }
}

async function callDiscordVerifyWorker(payload) {
    if (!DISCORD_VERIFY_WORKER_URL || DISCORD_VERIFY_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
        console.warn('Discord Worker URL 未配置');
        return { success: false, verified: false, error: 'Discord worker URL not configured' };
    }

    var requestPayload = {
        task_id: (payload && payload.task_id) || (payload && payload.taskId),
        user_id: (payload && payload.user_id) || (payload && payload.userId)
    };

    console.log('调用 Discord Worker，URL：', DISCORD_VERIFY_WORKER_URL, '参数：', requestPayload);

    var response = await fetch(DISCORD_VERIFY_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
    });

    var responseText = await response.text();
    var workerResult = null;

    try {
        workerResult = responseText ? JSON.parse(responseText) : null;
    } catch (_parseErr) {
        workerResult = { success: false, error: responseText || 'Invalid worker response' };
    }

    console.log('Discord Worker 返回：', workerResult);

    if (!response.ok) {
        return {
            success: false,
            verified: false,
            httpStatus: response.status,
            error: (workerResult && workerResult.error) || ('Worker request failed: ' + response.status),
            reason: workerResult && (workerResult.reason || workerResult.error)
        };
    }

    return workerResult || { success: false, verified: false, error: 'Empty worker response' };
}

async function verifyDiscordSubtask(taskId, userId) {
    if (!taskId || !userId) {
        return { success: false, verified: false, error: 'missing params' };
    }

    if (!DISCORD_VERIFY_WORKER_URL || DISCORD_VERIFY_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
        return { success: false, verified: false, reason: 'Discord Worker 未配置' };
    }

    try {
        var workerResult = await callDiscordVerifyWorker({ task_id: taskId, user_id: userId });

        if (workerResult.httpStatus) {
            return {
                success: false,
                verified: false,
                error: workerResult.error,
                reason: workerResult.reason || workerResult.error
            };
        }

        return {
            success: workerResult.verified === true,
            verified: workerResult.verified === true,
            reason: workerResult.reason || workerResult.error || ''
        };
    } catch (err) {
        return {
            success: false,
            verified: false,
            error: err && err.message ? err.message : String(err),
            reason: err && err.message ? err.message : String(err)
        };
    }
}

function isTelegramVerificationTask(task) {
    if (!isSimpleTaskType(task)) return false;
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    return platform === 'telegram';
}

function isAllowedTelegramAction(action) {
    var key = String(action || '').trim().toLowerCase();
    return key === 'join' || key === 'follow' || key === 'message';
}

function isTelegramVerifiableAction(task) {
    if (!isTelegramVerificationTask(task)) return false;
    var actions = parseCommaList(getTaskField(task, ['task_action'], ''));
    if (!actions.length) return false;
    return actions.every(function (action) {
        return isAllowedTelegramAction(action);
    });
}

function isDiscordVerificationTask(task) {
    if (!isSimpleTaskType(task)) return false;
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    return platform === 'discord';
}

function isAllowedDiscordAction(action) {
    var key = String(action || '').trim().toLowerCase();
    return key === 'join' || key === 'message';
}

function isDiscordVerifiableAction(task) {
    if (!isDiscordVerificationTask(task)) return false;
    var actions = parseCommaList(getTaskField(task, ['task_action'], ''));
    if (!actions.length) return false;
    return actions.every(function (action) {
        return isAllowedDiscordAction(action);
    });
}

function isSimplePlatformVerifiableTask(task) {
    return isTwitterVerifiableAction(task) || isTelegramVerifiableAction(task) || isDiscordVerifiableAction(task);
}

async function insertSimplePendingSubmission(taskId, userId, taskMeta) {
    if (!window.supabase || !taskId || !userId) {
        return { ok: false, error: 'missing params' };
    }

    var existingResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existingResult.error) {
        return { ok: false, error: existingResult.error.message };
    }

    if (existingResult.data) {
        return { ok: true, data: existingResult.data, alreadyExists: true };
    }

    var insertResult = await window.supabase
        .from('submissions')
        .insert({
            task_id: taskId,
            user_id: userId,
            status: 'pending'
        })
        .select('id, task_id, user_id, status')
        .single();

    if (insertResult.error) {
        return { ok: false, error: insertResult.error.message };
    }

    if (typeof writeBroadcast === 'function' && taskMeta) {
        writeBroadcast({
            user_id: userId,
            event_type: 'task_claim',
            description: '领取了简单任务「' + buildTaskBroadcastTitle(taskMeta.title || '') + '」',
            reward_amount: Number(taskMeta.reward_amount) || 0
        });
    }

    return { ok: true, data: insertResult.data };
}
window.coinrealmNormalizeTwitterUsername = normalizeTwitterUsername;

function buildTwitterOAuthCallbackUrl() {
    var path = window.location.pathname || '/';
    if (path.endsWith('/')) {
        path = path.slice(0, -1);
    }
    return window.location.origin + path + '?twitter_oauth=1';
}

async function callTwitterVerifyWorker(payload) {
    if (!TWITTER_VERIFY_WORKER_URL || TWITTER_VERIFY_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
        console.warn('Twitter Worker URL 未配置');
        return { success: false, verified: false, error: 'Twitter worker URL not configured' };
    }

    var requestPayload = payload || {};
    console.log('调用 Worker，URL：', TWITTER_VERIFY_WORKER_URL, '参数：', requestPayload);

    var response = await fetch(TWITTER_VERIFY_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
    });

    var responseText = await response.text();
    var workerResult = null;

    try {
        workerResult = responseText ? JSON.parse(responseText) : null;
    } catch (_parseErr) {
        workerResult = { success: false, error: responseText || 'Invalid worker response' };
    }

    console.log('Worker 返回状态：', response.status, '结果：', workerResult);

    if (!response.ok) {
        console.error('Worker 请求失败，HTTP', response.status, workerResult);
        return {
            success: false,
            verified: false,
            httpStatus: response.status,
            error: (workerResult && workerResult.error) || ('Worker request failed: ' + response.status),
            reason: workerResult && (workerResult.reason || workerResult.review_comment || workerResult.error),
            review_comment: workerResult && workerResult.review_comment,
            status: workerResult && workerResult.status
        };
    }

    return workerResult || { success: false, verified: false, error: 'Empty worker response' };
}

async function hasUserTwitterOAuthBinding(userId) {
    if (!window.supabase || !userId) return false;

    var result = await window.supabase
        .from('users')
        .select('twitter_token, twitter_access_token, twitter_token_secret, twitter_access_token_secret')
        .eq('id', userId)
        .maybeSingle();

    if (result.error || !result.data) return false;

    var user = result.data;
    var token = String(user.twitter_access_token || user.twitter_token || '').trim();
    var secret = String(user.twitter_access_token_secret || user.twitter_token_secret || '').trim();

    if (token && token.indexOf('enc:') === 0) return true;
    if (token && token.indexOf('|') !== -1) return true;
    return !!(token && secret) || !!token;
}

async function startTwitterOAuthFlow(options) {
    options = options || {};

    var userId = await getAuthenticatedUserId();
    if (!userId) {
        alert(options.loginMessage || '请先登录后再连接 Twitter');
        return { success: false, error: 'not_logged_in' };
    }

    if (options.pendingClaim) {
        sessionStorage.setItem(TWITTER_OAUTH_PENDING_CLAIM, '1');
    } else {
        sessionStorage.removeItem(TWITTER_OAUTH_PENDING_CLAIM);
    }

    sessionStorage.setItem(TWITTER_OAUTH_SESSION_USER, userId);
    sessionStorage.setItem(TWITTER_OAUTH_SESSION_RETURN, window.location.hash || '#home');

    var callbackUrl = buildTwitterOAuthCallbackUrl();
    var workerResult = await callTwitterVerifyWorker({
        action: 'oauth_request',
        user_id: userId,
        callback_url: callbackUrl
    });

    if (!workerResult || !workerResult.success || !workerResult.authorize_url) {
        var errMsg = workerResult && (workerResult.error || workerResult.reason)
            ? (workerResult.error || workerResult.reason)
            : '无法启动 Twitter 授权';
        alert(errMsg);
        return { success: false, error: errMsg };
    }

    sessionStorage.setItem(TWITTER_OAUTH_SESSION_TOKEN, workerResult.oauth_token_secret || '');
    window.location.href = workerResult.authorize_url;
    return { success: true, redirecting: true };
}

async function handleTwitterOAuthReturn() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('twitter_oauth') !== '1') return false;

    var oauthToken = params.get('oauth_token');
    var oauthVerifier = params.get('oauth_verifier');
    if (!oauthToken || !oauthVerifier) return false;

    var oauthTokenSecret = sessionStorage.getItem(TWITTER_OAUTH_SESSION_TOKEN) || '';
    var userId = sessionStorage.getItem(TWITTER_OAUTH_SESSION_USER) || '';
    var returnHash = sessionStorage.getItem(TWITTER_OAUTH_SESSION_RETURN) || '#home';
    var pendingClaim = sessionStorage.getItem(TWITTER_OAUTH_PENDING_CLAIM) === '1';

    sessionStorage.removeItem(TWITTER_OAUTH_SESSION_TOKEN);
    sessionStorage.removeItem(TWITTER_OAUTH_SESSION_USER);
    sessionStorage.removeItem(TWITTER_OAUTH_SESSION_RETURN);
    sessionStorage.removeItem(TWITTER_OAUTH_PENDING_CLAIM);

    var cleanUrl = window.location.origin + window.location.pathname + returnHash;
    window.history.replaceState(null, '', cleanUrl);

    if (!userId || !oauthTokenSecret) {
        alert('Twitter 授权会话已过期，请重新连接');
        return true;
    }

    var workerResult = await callTwitterVerifyWorker({
        action: 'oauth_callback',
        user_id: userId,
        oauth_token: oauthToken,
        oauth_token_secret: oauthTokenSecret,
        oauth_verifier: oauthVerifier
    });

    if (!workerResult || !workerResult.success) {
        var errMsg = workerResult && (workerResult.error || workerResult.reason)
            ? (workerResult.error || workerResult.reason)
            : 'Twitter 授权失败';
        alert(errMsg);
        return true;
    }

    alert('Twitter 账号已成功连接' + (workerResult.twitter_username ? '（@' + workerResult.twitter_username + '）' : ''));

    if (pendingClaim && typeof window.coinrealmResumeTwitterTaskClaim === 'function') {
        await window.coinrealmResumeTwitterTaskClaim();
    }

    return true;
}

window.coinrealmStartTwitterOAuth = startTwitterOAuthFlow;
window.coinrealmHandleTwitterOAuthReturn = handleTwitterOAuthReturn;
window.coinrealmHasUserTwitterOAuth = hasUserTwitterOAuthBinding;

window.addEventListener('DOMContentLoaded', function () {
    handleTwitterOAuthReturn().catch(function (err) {
        console.warn('Twitter OAuth callback failed', err);
    });
    handleDiscordOAuthReturn().catch(function (err) {
        console.warn('Discord OAuth callback failed', err);
    });
});

function isSimpleTaskType(task) {
    return getTaskField(task, ['type', 'task_type', 'category'], '') === 'simple';
}

function isTwitterVerificationTask(task) {
    if (!isSimpleTaskType(task)) return false;
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    return platform === 'twitter';
}

function getTwitterTaskActionForTask(task) {
    return String(getTaskField(task, ['task_action'], '') || '').trim().toLowerCase();
}

function isTwitterVerifiableAction(task) {
    if (!isTwitterVerificationTask(task)) return false;
    var actions = parseCommaList(getTaskField(task, ['task_action'], ''));
    if (!actions.length) return false;
    return actions.every(function (action) {
        return isAllowedTwitterAction(action);
    });
}

function parseCommaList(value) {
    return String(value || '').split(',').map(function (item) {
        return item.trim();
    }).filter(Boolean);
}

function isAllowedTwitterAction(action) {
    var key = String(action || '').trim().toLowerCase();
    var allowed = {
        follow: true,
        following: true,
        like: true,
        favorite: true,
        favourite: true,
        retweet: true,
        repost: true,
        reply: true,
        comment: true
    };
    return !!allowed[key];
}

/** @deprecated use isTwitterVerifiableAction */
function isTwitterActionTask(task) {
    return isTwitterVerifiableAction(task);
}

async function verifyTwitterTask(taskId, userId) {
    if (!window.supabase || !taskId || !userId) {
        console.warn('verifyTwitterTask: missing params', { taskId: taskId, userId: userId });
        return { success: false, verified: false, error: 'missing params' };
    }

    try {
        var workerResult = null;

        if (TWITTER_VERIFY_WORKER_URL && TWITTER_VERIFY_WORKER_URL !== 'WORKER_URL_PLACEHOLDER') {
            workerResult = await callTwitterVerifyWorker({
                task_id: taskId,
                user_id: userId
            });

            if (workerResult.httpStatus) {
                return {
                    success: false,
                    verified: false,
                    error: workerResult.error,
                    reason: workerResult.reason,
                    review_comment: workerResult.review_comment
                };
            }
        } else {
            console.warn('verifyTwitterTask: Worker URL 未配置，使用本地模拟通过');
            workerResult = { success: true, status: 'approved', verified: true };
        }

        var verified = workerResult.verified === true ||
            (workerResult.success === true && workerResult.status === 'approved');

        if (!verified && workerResult.reason) {
            console.warn('verifyTwitterTask 未通过', {
                taskId: taskId,
                userId: userId,
                reason: workerResult.reason || workerResult.review_comment || workerResult.error
            });
        }

        var subResult = await window.supabase
            .from('submissions')
            .select('id, task_id, user_id, status, submitted_at, reviewed_at, review_comment')
            .eq('task_id', taskId)
            .eq('user_id', userId)
            .maybeSingle();

        var submissionStatus = subResult.data && subResult.data.status
            ? subResult.data.status
            : (verified ? 'approved' : (workerResult.status || 'rejected'));

        return {
            success: workerResult.success === true,
            verified: verified,
            status: submissionStatus,
            reason: workerResult.reason || workerResult.review_comment || workerResult.error,
            review_comment: workerResult.review_comment || workerResult.reason,
            submission: subResult.data || null
        };
    } catch (err) {
        console.warn('verifyTwitterTask failed', err);
        return {
            success: false,
            verified: false,
            error: err && err.message ? err.message : String(err)
        };
    }
}

async function verifyTwitterSubtask(taskId, userId, actionIndex) {
    if (!taskId || !userId || actionIndex == null) {
        console.warn('verifyTwitterSubtask: missing params', { taskId: taskId, userId: userId, actionIndex: actionIndex });
        return { success: false, verified: false, error: 'missing params' };
    }

    if (!TWITTER_VERIFY_WORKER_URL || TWITTER_VERIFY_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
        console.warn('verifyTwitterSubtask: Worker URL 未配置，跳过子任务验证');
        return { success: true, verified: true };
    }

    var payload = {
        task_id: taskId,
        user_id: userId,
        action_index: actionIndex,
        subtask_only: true
    };

    console.log('verifyTwitterSubtask 请求参数', payload);

    try {
        var workerResult = await callTwitterVerifyWorker(payload);

        console.log('verifyTwitterSubtask Worker 返回', workerResult);

        if (workerResult.httpStatus) {
            return {
                success: false,
                verified: false,
                error: workerResult.error,
                reason: workerResult.reason || workerResult.error
            };
        }

        var reason = workerResult.reason || workerResult.review_comment || workerResult.error || '';

        if (!workerResult.verified) {
            console.warn('verifyTwitterSubtask 未通过', {
                taskId: taskId,
                userId: userId,
                actionIndex: actionIndex,
                reason: reason,
                workerResult: workerResult
            });
        }

        return {
            success: workerResult.success === true,
            verified: workerResult.verified === true,
            reason: reason,
            action_index: workerResult.action_index
        };
    } catch (err) {
        console.warn('verifyTwitterSubtask failed', err);
        return {
            success: false,
            verified: false,
            error: err && err.message ? err.message : String(err),
            reason: err && err.message ? err.message : String(err)
        };
    }
}

async function upgradeUserLevelOnTaskApproved(userId) {
    if (!window.supabase || !userId) return;

    var userResult = await window.supabase
        .from('users')
        .select('level')
        .eq('id', userId)
        .maybeSingle();

    if (userResult.error || !userResult.data) return;

    var level = Number(userResult.data.level) || 0;
    if (level < 2) {
        await window.supabase
            .from('users')
            .update({ level: 2 })
            .eq('id', userId);
    }
}

async function applyTwitterVerificationSuccess(task, userId, options) {
    options = options || {};
    if (!window.supabase || !task || !task.id || !userId) return;

    var taskId = task.id;
    var now = new Date().toISOString();
    var priorStatus = options.priorStatus || '';

    await window.supabase
        .from('submissions')
        .update({
            status: 'approved',
            reviewed_at: now
        })
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .in('status', priorStatus === 'rejected'
            ? ['verifying', 'rejected', 'pending', 'submitted']
            : ['verifying', 'pending', 'submitted']);

    if (priorStatus === 'verifying' || priorStatus === 'rejected' || priorStatus === 'pending') {
        var taskResult = await window.supabase
            .from('tasks')
            .select('current_participants, title, reward_amount, reward_type')
            .eq('id', taskId)
            .maybeSingle();

        if (!taskResult.error && taskResult.data) {
            var current = Number(taskResult.data.current_participants) || 0;
            await window.supabase
                .from('tasks')
                .update({ current_participants: current + 1 })
                .eq('id', taskId);
            task.current_participants = current + 1;
            if (!task.title) task.title = taskResult.data.title;
            if (task.reward_amount == null) task.reward_amount = taskResult.data.reward_amount;
        }
    }

    if (options.creditRewardClient) {
        var userResult = await window.supabase
            .from('users')
            .select('crlm_balance, usdt_balance')
            .eq('id', userId)
            .maybeSingle();

        if (!userResult.error && userResult.data) {
            var rewardAmount = Number(task.reward_amount) || 0;
            if (rewardAmount > 0) {
                var rewardType = String(task.reward_type || 'CRLM').toUpperCase();
                var balanceField = rewardType === 'USDT' ? 'usdt_balance' : 'crlm_balance';
                var currentBalance = Number(userResult.data[balanceField]) || 0;
                var patch = {};
                patch[balanceField] = currentBalance + rewardAmount;
                await window.supabase.from('users').update(patch).eq('id', userId);
            }
        }
    }

    var broadcastTitle = task.title || '';
    await upgradeUserLevelOnTaskApproved(userId);

    writeBroadcast({
        user_id: userId,
        event_type: 'task_approved',
        description: '完成了任务「' + buildTaskBroadcastTitle(broadcastTitle) + '」',
        reward_amount: Number(task.reward_amount) || 0
    });
}

var PROOF_SCREENSHOT_MAX_SIZE = 5 * 1024 * 1024;
var PROOF_SCREENSHOT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function getProofScreenshotExtension(filename) {
    var parts = String(filename || '').toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : '';
}

function validateProofScreenshotFile(file) {
    if (!file) return 'Invalid file';
    var ext = getProofScreenshotExtension(file.name);
    if (PROOF_SCREENSHOT_EXTENSIONS.indexOf(ext) < 0) {
        return 'Only JPG, PNG, and WebP formats are supported';
    }
    if (file.size > PROOF_SCREENSHOT_MAX_SIZE) {
        return 'Each image must be 5MB or smaller';
    }
    return '';
}

async function uploadProofScreenshot(userId, file) {
    if (!window.supabase || !userId || !file) return { ok: false, error: 'Supabase unavailable' };

    var validationError = validateProofScreenshotFile(file);
    if (validationError) return { ok: false, error: validationError };

    var safeName = String(file.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    var storagePath = userId + '_' + Date.now() + '_' + safeName;

    var uploadResult = await window.supabase.storage
        .from('screenshots')
        .upload(storagePath, file, {
            upsert: false,
            contentType: file.type || 'image/jpeg'
        });

    if (uploadResult.error) {
        return { ok: false, error: uploadResult.error.message };
    }

    var uploadedPath = (uploadResult.data && uploadResult.data.path) || storagePath;
    var urlResult = window.supabase.storage.from('screenshots').getPublicUrl(uploadedPath);
    var publicUrl = urlResult && urlResult.data && urlResult.data.publicUrl;

    if (!publicUrl) {
        return { ok: false, error: 'Invalid public URL' };
    }

    return { ok: true, publicUrl: publicUrl, path: uploadedPath };
}

function compareTaskTargetUsername(inputValue, targetValue) {
    var inputNorm = normalizeTwitterUsername(inputValue).toLowerCase();
    var targetNorm = normalizeTwitterUsername(targetValue).toLowerCase();
    if (!inputNorm || !targetNorm) return false;
    return inputNorm === targetNorm;
}

function normalizeTweetUrlForCompare(value) {
    var text = String(value || '').trim().toLowerCase();
    if (!text) return '';
    text = text.replace(/^https?:\/\//i, '');
    text = text.replace(/^www\./i, '');
    text = text.replace(/\/+$/, '');
    text = text.replace(/^x\.com\//, 'twitter.com/');
    return text;
}

function compareTaskTargetTweetUrl(inputValue, targetValue) {
    var inputNorm = normalizeTweetUrlForCompare(inputValue);
    var targetNorm = normalizeTweetUrlForCompare(targetValue);
    if (!inputNorm || !targetNorm) return false;
    if (inputNorm === targetNorm) return true;

    var rawTarget = String(targetValue || '').trim();
    if (/^\d+$/.test(rawTarget)) {
        var statusPath = '/status/' + rawTarget;
        return inputNorm.indexOf(statusPath) >= 0 || inputNorm.endsWith(statusPath.replace(/^\//, ''));
    }

    return false;
}

function compareTaskTargetKeyword(inputValue, keywordValue) {
    var inputNorm = String(inputValue || '').trim().toLowerCase();
    var keywordNorm = String(keywordValue || '').trim().toLowerCase();
    if (!inputNorm || !keywordNorm) return false;
    return inputNorm === keywordNorm;
}

async function getUserInfo() {
    if (!window.supabase) return null;

    var userId = await getCurrentUserId();
    if (!userId) return null;

    var userResult = await window.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (!userResult.error && userResult.data) {
        return userResult.data;
    }

    return null;
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

var coinrealmCurrentUserProfile = null;
var coinrealmGoogleAvatarUrl = '';
var PRESET_AVATAR_COUNT = 9;
var AVATAR_COLOR_PALETTE = ['#f0b90b', '#52c41a', '#1890ff', '#722ed1', '#eb2f96', '#13c2c2', '#fa8c16', '#597ef7', '#ff7875'];

function getPresetAvatarPaths() {
    var paths = [];
    for (var i = 1; i <= PRESET_AVATAR_COUNT; i++) {
        paths.push('img/avatars/avatar-' + i + '.png');
    }
    return paths;
}

function getPresetAvatarPathByIndex(index) {
    var n = Number(index);
    if (isNaN(n) || n < 1 || n > PRESET_AVATAR_COUNT) return '';
    return 'img/avatars/avatar-' + n + '.png';
}

function getAvatarColor(seed) {
    var str = String(seed || 'user');
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLOR_PALETTE[Math.abs(hash) % AVATAR_COLOR_PALETTE.length];
}

function getAvatarInitial(name) {
    var text = String(name || 'U').trim();
    return text ? text.charAt(0).toUpperCase() : 'U';
}

function resolveAvatarAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || String(url).indexOf('data:') === 0) return url;
    try {
        return new URL(url, window.location.href).href;
    } catch (e) {
        return url;
    }
}

var TASK_IMAGE_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect fill='%23f0f0f0' width='120' height='120'/%3E%3C/svg%3E";

function resolveTaskImageUrl(url) {
    return resolveAvatarAssetUrl(url);
}

function parseTaskUrlArrayField(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
        return value.filter(function (item) { return !!item; });
    }
    if (typeof value === 'string') {
        var trimmed = value.trim();
        if (!trimmed) return [];
        try {
            var parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.filter(function (item) { return !!item; });
            }
        } catch (e) {
            return [trimmed];
        }
    }
    return [];
}

function getTaskImageUrls(task) {
    if (!task) return [];

    var urls = parseTaskUrlArrayField(task.screenshot_urls);
    if (!urls.length) {
        var imageUrl = getTaskField(task, ['image_url'], '');
        if (imageUrl) urls = [imageUrl];
    }

    var seen = {};
    var resolved = [];
    urls.forEach(function (url) {
        var fullUrl = resolveTaskImageUrl(url);
        if (fullUrl && !seen[fullUrl]) {
            seen[fullUrl] = true;
            resolved.push(fullUrl);
        }
    });
    return resolved;
}

function handleTaskImageError(imgEl) {
    if (!imgEl) return;
    imgEl.onerror = null;
    imgEl.src = TASK_IMAGE_PLACEHOLDER;
    imgEl.classList.add('task-image-placeholder');
}

function taskImageErrorAttr() {
    return ' onerror="if(typeof window.coinrealmHandleTaskImageError===\'function\')window.coinrealmHandleTaskImageError(this)"';
}

window.coinrealmHandleTaskImageError = handleTaskImageError;

function resolveAvatarDisplay(user, options) {
    options = options || {};
    var avatarUrl = user && user.avatar_url;
    if (avatarUrl) {
        return { type: 'image', src: resolveAvatarAssetUrl(avatarUrl) };
    }
    if (options.googleAvatarUrl) {
        return { type: 'image', src: options.googleAvatarUrl };
    }
    var labelSource = (user && (user.username || user.email || user.id)) || 'U';
    return {
        type: 'letter',
        initial: getAvatarInitial(labelSource),
        color: getAvatarColor(user && user.id ? user.id : labelSource)
    };
}

function buildAvatarHtml(user, className, options) {
    className = className || 'cr-avatar';
    var resolved = resolveAvatarDisplay(user, options || {});
    if (resolved.type === 'image') {
        return '<img class="' + escapeHtml(className) + ' cr-avatar-img" src="' + escapeHtml(resolved.src) + '" alt="">';
    }
    return '<div class="' + escapeHtml(className) + ' cr-avatar-letter" style="background-color:' + escapeHtml(resolved.color) + '">' + escapeHtml(resolved.initial) + '</div>';
}

function applyAvatarToElement(el, user, className, options) {
    if (!el) return;
    el.innerHTML = buildAvatarHtml(user, className, options);
}

function getPublisherAvatarUser(task) {
    var publisher = task.publisher;
    if (publisher && typeof publisher === 'object') {
        return {
            id: publisher.id || task.publisher_id,
            username: publisher.username || task.publisher_username,
            email: publisher.email,
            avatar_url: publisher.avatar_url
        };
    }
    return {
        id: task.publisher_id,
        username: task.publisher_username,
        email: task.publisher_email,
        avatar_url: task.publisher_avatar_url
    };
}

async function refreshGoogleAvatarCache() {
    coinrealmGoogleAvatarUrl = '';
    if (!window.supabase) return;
    try {
        var result = await window.supabase.auth.getSession();
        var session = result.data && result.data.session;
        if (session && session.user && session.user.user_metadata && session.user.user_metadata.avatar_url) {
            coinrealmGoogleAvatarUrl = session.user.user_metadata.avatar_url;
        }
    } catch (e) { /* ignore */ }
}

async function loadCurrentUserProfileCache() {
    await refreshGoogleAvatarCache();
    if (!window.supabase) {
        coinrealmCurrentUserProfile = null;
        return null;
    }
    var userId = await getCurrentUserId();
    if (!userId) {
        coinrealmCurrentUserProfile = null;
        return null;
    }
    var result = await window.supabase
        .from('users')
        .select('id, username, email, avatar_url, twitter_username, telegram_username, discord_user_id, discord_username')
        .eq('id', userId)
        .single();
    if (!result.error && result.data) {
        coinrealmCurrentUserProfile = result.data;
        if (typeof window.coinrealmRefreshTwitterBindUi === 'function') {
            window.coinrealmRefreshTwitterBindUi();
        }
        if (typeof window.coinrealmRefreshTelegramBindUi === 'function') {
            window.coinrealmRefreshTelegramBindUi();
        }
        if (typeof window.coinrealmRefreshDiscordBindUi === 'function') {
            window.coinrealmRefreshDiscordBindUi();
        }
        if (typeof window.coinrealmRefreshAuthArea === 'function') {
            window.coinrealmRefreshAuthArea();
        }
        return result.data;
    }
    return null;
}

window.coinrealmGetNavAvatarHtml = function () {
    var profile = coinrealmCurrentUserProfile || {};
    return buildAvatarHtml(profile, 'auth-avatar', { googleAvatarUrl: coinrealmGoogleAvatarUrl });
};

window.coinrealmRefreshAllAvatars = async function () {
    await loadCurrentUserProfileCache();
    if (typeof window.coinrealmRefreshAuthArea === 'function') {
        window.coinrealmRefreshAuthArea();
    }
    var pfAvatar = document.getElementById('pf-avatar');
    if (pfAvatar && coinrealmCurrentUserProfile) {
        applyAvatarToElement(pfAvatar, coinrealmCurrentUserProfile, 'cr-avatar-img', {
            googleAvatarUrl: coinrealmGoogleAvatarUrl
        });
    }
    if (typeof applyFiltersAndSort === 'function') {
        applyFiltersAndSort();
    }
    if (typeof renderOfficialRecommendSection === 'function') {
        renderOfficialRecommendSection();
    }
    window.dispatchEvent(new HashChangeEvent('hashchange'));
};

window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        loadCurrentUserProfileCache();
        initTwitterBindModal();
        initTelegramBindModal();
        initDiscordBindModal();
    }, 300);
});

function writeBroadcast(payload) {
    if (!window.supabase || !payload || !payload.user_id) return;

    window.supabase
        .from('broadcasts')
        .insert({
            user_id: payload.user_id,
            event_type: payload.event_type,
            description: payload.description,
            reward_amount: payload.reward_amount != null ? payload.reward_amount : null
        })
        .then(function (result) {
            if (result.error) {
                console.warn('广播写入失败:', result.error);
                return;
            }
            if (typeof window.coinrealmRefreshHomeBroadcast === 'function') {
                window.coinrealmRefreshHomeBroadcast();
            }
        })
        .catch(function (err) {
            console.warn('广播写入失败:', err);
        });
}

function isHomepageBroadcast(record) {
    var amount = Number(record.reward_amount) || 0;
    var eventType = record.event_type || '';
    if (amount >= 500) return true;
    if (eventType === 'rare_box' || eventType === 'dividend' || eventType === 'invite') return true;
    return false;
}

function formatBroadcastRelativeTime(iso) {
    if (!iso) return '—';
    var date = new Date(iso);
    if (isNaN(date.getTime())) return String(iso).slice(0, 16);

    var diffMs = Date.now() - date.getTime();
    if (diffMs < 0) diffMs = 0;

    var minutes = Math.floor(diffMs / 60000);
    var hours = Math.floor(diffMs / 3600000);
    var days = Math.floor(diffMs / 86400000);
    var lang = currentLang === 'en' ? 'en' : 'zh';

    if (minutes < 1) return lang === 'zh' ? '刚刚' : 'Just now';
    if (minutes < 60) return lang === 'zh' ? minutes + '分钟前' : minutes + ' min ago';
    if (hours < 24) return lang === 'zh' ? hours + '小时前' : hours + ' h ago';
    if (days === 1) return lang === 'zh' ? '昨天' : 'Yesterday';
    return lang === 'zh' ? days + '天前' : days + ' d ago';
}

function renderHomeBroadcastTicker(items) {
    var wrapper = document.getElementById('broadcast-ticker');
    if (!wrapper) return;

    var langData = translations[currentLang] || translations.zh;
    var emptyText = langData.broadcast_empty || '暂无动态';

    if (!items.length) {
        wrapper.style.animation = 'none';
        wrapper.innerHTML = '<div class="broadcast-item"><span>' + escapeHtml(emptyText) + '</span></div>';
        return;
    }

    wrapper.innerHTML = items.map(function (record) {
        var desc = escapeHtml(record.description || '');
        var rewardHtml = record.reward_amount
            ? ' <span class="highlight">' + Number(record.reward_amount).toLocaleString() + ' CRLM</span>'
            : '';
        return '<div class="broadcast-item">' + desc + rewardHtml + '</div>';
    }).join('');

    if (items.length === 1) {
        wrapper.style.animation = 'none';
        return;
    }

    var styleEl = document.getElementById('coinrealm-broadcast-keyframes');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'coinrealm-broadcast-keyframes';
        document.head.appendChild(styleEl);
    }

    var count = items.length;
    var height = 60;
    var step = 100 / count;
    var keyframes = '@keyframes scrollBroadcastDynamic {';
    var i;

    for (i = 0; i < count; i++) {
        var holdStart = (i * step).toFixed(2);
        var holdEnd = (i * step + step * 0.85).toFixed(2);
        keyframes += holdStart + '% { transform: translateY(-' + (i * height) + 'px); }';
        keyframes += holdEnd + '% { transform: translateY(-' + (i * height) + 'px); }';
    }
    keyframes += '100% { transform: translateY(0); }';
    keyframes += '}';

    styleEl.textContent = keyframes;
    wrapper.style.animation = 'scrollBroadcastDynamic ' + (count * 4) + 's linear infinite';
}

function loadHomeBroadcasts() {
    if (!window.supabase) {
        renderHomeBroadcastTicker([]);
        return Promise.resolve();
    }

    return window.supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
        .then(function (result) {
            if (result.error) {
                console.warn('加载首页广播失败:', result.error);
                renderHomeBroadcastTicker([]);
                return;
            }
            var items = (result.data || []).filter(isHomepageBroadcast);
            renderHomeBroadcastTicker(items);
        })
        .catch(function (err) {
            console.warn('加载首页广播失败:', err);
            renderHomeBroadcastTicker([]);
        });
}

window.coinrealmRefreshHomeBroadcast = loadHomeBroadcasts;

function buildTaskBroadcastTitle(title) {
    return String(title || '任务').replace(/[「」]/g, '');
}

function getPublisherIdFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || '';
    if (hash.indexOf('publisher') === -1) return null;
    var query = hash.split('?')[1];
    if (!query) return null;
    return new URLSearchParams(query).get('id');
}

function navigateToPublisher(publisherId) {
    if (!publisherId) return;
    var targetHash = 'publisher?id=' + encodeURIComponent(publisherId);
    if (window.location.hash.replace(/^#/, '') === targetHash) {
        if (typeof window.coinrealmApplyRoute === 'function') {
            window.coinrealmApplyRoute('publisher');
        }
        return;
    }
    window.location.hash = targetHash;
}

var ADMIN_FOUNDER_EMAIL = 'samyang9695482@gmail.com';

async function isAdminUser() {
    if (!window.supabase) return false;

    var userId = await getCurrentUserId();
    if (!userId) return false;

    var userResult = await window.supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

    if (userResult.error || !userResult.data) return false;
    return userResult.data.email === ADMIN_FOUNDER_EMAIL;
}

window.coinrealmIsAdminUser = isAdminUser;

function getTaskField(task, keys, fallback) {
    for (let i = 0; i < keys.length; i++) {
        if (task[keys[i]] != null && task[keys[i]] !== '') return task[keys[i]];
    }
    return fallback;
}

function getTaskCategory(task) {
    if (task.is_official) return 'official';
    return getTaskField(task, ['task_type', 'type', 'category'], 'other');
}

function displayNameFromEmail(email) {
    if (!email) return '';
    var parts = String(email).split('@');
    return parts[0] || '';
}

function resolvePublisherFields(task) {
    var publisher = task.publisher;
    var username = getTaskField(task, ['publisher_username', 'publisher_name'], '');
    var level = getTaskField(task, ['publisher_level'], null);

    if (publisher && typeof publisher === 'object') {
        if (!username) username = publisher.username || displayNameFromEmail(publisher.email) || '';
        if (level == null || level === '') level = publisher.level;
    }

    if (!username) username = getTaskField(task, ['username'], 'Unknown');
    if (level == null || level === '') level = 1;

    return { username: username, level: level };
}

function enrichTasksWithPublishers(tasks) {
    if (!window.supabase || !tasks || !tasks.length) {
        return Promise.resolve(tasks || []);
    }

    var publisherIds = tasks
        .map(function (task) { return task.publisher_id; })
        .filter(function (id) { return !!id; });
    var uniqueIds = publisherIds.filter(function (id, index) {
        return publisherIds.indexOf(id) === index;
    });

    if (!uniqueIds.length) {
        return Promise.resolve(tasks);
    }

    return window.supabase
        .from('users')
        .select('id, username, level, email, avatar_url')
        .in('id', uniqueIds)
        .then(function (userResult) {
            if (userResult.error || !userResult.data) {
                if (userResult.error) console.warn('加载发布者信息失败:', userResult.error);
                return tasks;
            }

            var userMap = {};
            userResult.data.forEach(function (user) {
                userMap[user.id] = user;
            });

            return tasks.map(function (task) {
                var publisher = userMap[task.publisher_id];
                if (!publisher) return task;
                return Object.assign({}, task, {
                    publisher: publisher,
                    publisher_username: publisher.username || displayNameFromEmail(publisher.email),
                    publisher_level: publisher.level
                });
            });
        })
        .catch(function (err) {
            console.warn('加载发布者信息失败:', err);
            return tasks;
        });
}

function getTypeLabelKey(task) {
    const type = getTaskField(task, ['task_type', 'type', 'category'], 'other');
    const map = {
        official: 'tag_official',
        simple: 'tag_simple',
        airdrop: 'tag_airdrop',
        register: 'tag_register',
        trade: 'tag_trade',
        game: 'tag_game',
        content: 'tag_content',
        test: 'tag_test'
    };
    return map[type] || 'tag_all';
}

function formatRewardAmount(amount) {
    const n = Number(amount) || 0;
    return n.toLocaleString('en-US') + ' CRLM';
}

function calcDaysLeft(deadline) {
    if (!deadline) return 0;
    const end = new Date(deadline);
    if (Number.isNaN(end.getTime())) return 0;
    const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function sortTasks(tasks, sortValue) {
    const list = tasks.slice();
    switch (sortValue) {
        case 'highest-value':
        case 'most-rewards':
            list.sort((a, b) => {
                const ra = Number(getTaskField(a, ['reward_amount', 'reward'], 0));
                const rb = Number(getTaskField(b, ['reward_amount', 'reward'], 0));
                return rb - ra;
            });
            break;
        case 'ending-soon':
            list.sort((a, b) => {
                const da = new Date(getTaskField(a, ['deadline', 'end_date', 'ends_at'], 0)).getTime() || Infinity;
                const db = new Date(getTaskField(b, ['deadline', 'end_date', 'ends_at'], 0)).getTime() || Infinity;
                return da - db;
            });
            break;
        case 'latest':
        default:
            list.sort((a, b) => {
                const ca = new Date(getTaskField(a, ['created_at'], 0)).getTime() || 0;
                const cb = new Date(getTaskField(b, ['created_at'], 0)).getTime() || 0;
                return cb - ca;
            });
            break;
    }
    return list;
}

function buildTaskCardHtml(task) {
    const category = getTaskCategory(task);
    const typeLabelKey = getTypeLabelKey(task);
    const publisher = resolvePublisherFields(task);
    const username = escapeHtml(publisher.username);
    const level = escapeHtml(publisher.level);
    const publisherId = escapeHtml(getTaskField(task, ['publisher_id'], ''));
    const title = escapeHtml(getTaskField(task, ['title', 'task_title'], ''));
    const reward = formatRewardAmount(getTaskField(task, ['reward_amount', 'reward'], 0));
    const slotsTotalRaw = getTaskField(task, ['slots_total', 'total_slots', 'max_participants'], 0);
    const slotsLeftRaw = getTaskField(task, ['slots_left', 'slots_remaining', 'remaining_slots'], null);
    const slotsLeft = escapeHtml(slotsLeftRaw != null && slotsLeftRaw !== '' ? slotsLeftRaw : slotsTotalRaw);
    const slotsTotal = escapeHtml(slotsTotalRaw);
    const daysLeft = calcDaysLeft(getTaskField(task, ['deadline', 'end_date', 'ends_at'], null));
    const isOfficial = !!task.is_official;
    const isPromo = !!task.is_promo;
    const isSimple = category === 'simple';

    let badgeHtml = '';
    if (isSimple) {
        badgeHtml = '<span class="badge simple-task-badge" aria-hidden="true">⚡</span>';
    }
    if (isOfficial) {
        badgeHtml += '<span class="badge official-badge" data-i18n="badge_official">官方</span>';
    } else if (isPromo) {
        badgeHtml += '<span class="badge promo-badge" data-i18n="badge_promo">推广</span>';
    }

    const publisherUser = getPublisherAvatarUser(task);
    const avatarHtml = buildAvatarHtml(publisherUser, 'css-avatar');
    const imageUrlRaw = getTaskField(task, ['image_url'], '');
    const imageUrl = imageUrlRaw && typeof resolveAvatarAssetUrl === 'function'
        ? resolveAvatarAssetUrl(imageUrlRaw)
        : imageUrlRaw;
    const imageHtml = imageUrl
        ? '<div class="task-card-media"><img class="task-card-image" src="' + escapeHtml(imageUrl) + '" alt=""></div>'
        : '';
    const cardClass = imageUrl ? ' task-card-with-image' : '';

    return (
        '<div class="task-card' + cardClass + '" data-category="' + escapeHtml(category) + '" data-task-id="' + escapeHtml(getTaskField(task, ['id'], '')) + '">' +
            imageHtml +
            '<div class="task-card-body">' +
            '<div class="card-top">' +
                '<div class="author-info publisher-link" data-publisher-id="' + publisherId + '" style="cursor:pointer">' +
                    avatarHtml +
                    '<div class="meta-text">' +
                        '<span class="username">' + username + '</span>' +
                        '<span class="level-badge">Lv.' + level + '</span>' +
                    '</div>' +
                '</div>' +
                badgeHtml +
            '</div>' +
            (title ? '<div class="task-card-title">' + title + '</div>' : '') +
            '<div class="reward-amount">' + reward + '</div>' +
            '<div class="card-bottom">' +
                '<div class="meta-tags">' +
                    '<span class="type-label label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
                    '<span class="info-text"><span data-i18n="text_slots">剩余名额</span> ' + slotsLeft + '/' + slotsTotal + '</span>' +
                    '<span class="info-text">' + daysLeft + ' <span data-i18n="text_days">天后</span></span>' +
                '</div>' +
                '<button type="button" class="claim-btn" data-task-id="' + escapeHtml(getTaskField(task, ['id'], '')) + '" data-i18n="btn_claim">领取</button>' +
            '</div>' +
            '</div>' +
        '</div>'
    );
}

function buildOfficialRecommendCardHtml(task) {
    var category = getTaskField(task, ['task_type', 'type', 'category'], 'other');
    var typeLabelKey = getTypeLabelKey(task);
    var publisher = resolvePublisherFields(task);
    var title = escapeHtml(getTaskField(task, ['title', 'task_title'], ''));
    var description = escapeHtml(getTaskField(task, ['description'], ''));
    var reward = formatRewardAmount(getTaskField(task, ['reward_amount', 'reward'], 0));
    var slotsTotalRaw = getTaskField(task, ['slots_total', 'total_slots', 'max_participants'], 0);
    var slotsLeftRaw = getTaskField(task, ['slots_left', 'slots_remaining', 'remaining_slots'], null);
    var slotsLeft = escapeHtml(slotsLeftRaw != null && slotsLeftRaw !== '' ? slotsLeftRaw : slotsTotalRaw);
    var slotsTotal = escapeHtml(slotsTotalRaw);
    var taskId = escapeHtml(getTaskField(task, ['id'], ''));

    var publisherUser = getPublisherAvatarUser(task);
    var avatarHtml = buildAvatarHtml(publisherUser, 'official-card-avatar css-avatar');
    var imageUrlRaw = getTaskField(task, ['image_url'], '');
    var imageUrl = imageUrlRaw ? resolveTaskImageUrl(imageUrlRaw) : '';
    var cardClass = imageUrl ? ' official-recommend-card-with-image' : '';

    var cardBody =
            '<div class="official-card-top">' +
                avatarHtml +
                '<div class="official-card-author">' +
                    '<span class="official-card-username">' + escapeHtml(publisher.username) + '</span>' +
                    '<span class="official-card-level">Lv.' + escapeHtml(publisher.level) + '</span>' +
                '</div>' +
            '</div>' +
            '<h3 class="official-card-title">' + title + '</h3>' +
            '<span class="official-card-type label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
            '<div class="official-card-reward">' + reward + '</div>' +
            (description ? '<p class="official-card-desc">' + description + '</p>' : '') +
            '<div class="official-card-slots"><span data-i18n="text_slots">剩余名额</span> ' + slotsLeft + '/' + slotsTotal + '</div>';

    var imageBlock = imageUrl
        ? '<div class="official-card-media"><img class="official-card-image" src="' + escapeHtml(imageUrl) + '" alt=""' + taskImageErrorAttr() + '></div>'
        : '';

    return (
        '<article class="official-recommend-card' + cardClass + '" data-task-id="' + taskId + '" role="link" tabindex="0">' +
            (imageUrl ? '<div class="official-card-body">' + cardBody + '</div>' : cardBody) +
            imageBlock +
        '</article>'
    );
}

function renderOfficialRecommendSection() {
    var section = document.getElementById('official-recommend-section');
    var grid = document.getElementById('official-recommend-grid');
    if (!section || !grid) return;

    if (!homeOfficialTasks.length) {
        section.classList.add('hidden');
        grid.innerHTML = '';
        return;
    }

    section.classList.remove('hidden');
    grid.innerHTML = homeOfficialTasks.map(buildOfficialRecommendCardHtml).join('');
    applyLanguageStrings();
}

function navigateToTaskDetail(taskId) {
    if (!taskId) return;
    var targetHash = 'task-detail?id=' + encodeURIComponent(taskId);
    if (window.location.hash.replace(/^#/, '') === targetHash) {
        if (typeof window.coinrealmApplyRoute === 'function') {
            window.coinrealmApplyRoute('task-detail');
        }
        return;
    }
    window.location.hash = targetHash;
}

function filterByOfficialTag() {
    var tagButtons = document.querySelectorAll('#filter-tags .tag-btn');
    tagButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-type') === 'official');
    });
    applyFiltersAndSort();
    var filterBar = document.querySelector('.filter-search-bar');
    if (filterBar) {
        filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handleClaimTask(btn) {
    navigateToTaskDetail(btn.getAttribute('data-task-id'));
}

function bindClaimButtons() {
    // 事件已在 initHomePageLogic 中通过委托绑定
}

function renderTaskCards(tasks) {
    const taskGrid = document.getElementById('task-grid');
    if (!taskGrid) return;
    taskGrid.innerHTML = tasks.map(buildTaskCardHtml).join('');
    bindClaimButtons();
}

var checkinInProgress = false;
var miningCooldownUntil = 0;
var miningToastTimer = null;
var miningCountdownTimer = null;

function getLocalDateString(dayOffset) {
    var d = new Date();
    if (dayOffset) {
        d.setDate(d.getDate() + dayOffset);
    }
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
}

function formatCheckinText(key, vars) {
    var langData = translations[currentLang] || translations.zh;
    var text = langData[key] || translations.zh[key] || '';
    if (vars) {
        Object.keys(vars).forEach(function (k) {
            text = text.replace('{' + k + '}', String(vars[k]));
        });
    }
    return text;
}

var rewardCelebrationTimer = null;
var rewardCelebrationInitialized = false;

function formatRewardCelebrationAmount(amount) {
    var value = Math.round(Number(amount) || 0);
    return '+' + value.toLocaleString() + ' CRLM';
}

function spawnRewardConfetti() {
    var layer = document.getElementById('reward-confetti-layer');
    if (!layer) return;

    layer.innerHTML = '';
    var colors = ['#f0b90b', '#ff9800', '#ffb347', '#ffd700', '#f7a600'];
    var count = Math.floor(Math.random() * 11) + 20;

    for (var i = 0; i < count; i++) {
        (function () {
            var particle = document.createElement('span');
            particle.className = 'reward-confetti-particle';
            var size = 4 + Math.random() * 6;
            var angle = Math.random() * Math.PI * 2;
            var distance = 80 + Math.random() * 220;
            var rise = -(120 + Math.random() * 260);
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = (Math.random() * 0.25).toFixed(2) + 's';
            particle.style.setProperty('--tx', (Math.cos(angle) * distance).toFixed(1) + 'px');
            particle.style.setProperty('--ty', (rise + Math.sin(angle) * 80).toFixed(1) + 'px');
            layer.appendChild(particle);
        })();
    }

    setTimeout(function () {
        if (layer) layer.innerHTML = '';
    }, 2200);
}

function hideRewardCelebration() {
    var modal = document.getElementById('reward-celebration-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (rewardCelebrationTimer) {
        clearTimeout(rewardCelebrationTimer);
        rewardCelebrationTimer = null;
    }
}

function initRewardCelebrationModal() {
    if (rewardCelebrationInitialized) return;
    rewardCelebrationInitialized = true;

    document.addEventListener('click', function (e) {
        if (e.target.closest('#reward-celebration-confirm') || e.target.closest('#reward-celebration-modal .reward-celebration-overlay')) {
            hideRewardCelebration();
        }
    });
}

function showRewardCelebration(rewardAmount, options) {
    options = options || {};
    initRewardCelebrationModal();

    var modal = document.getElementById('reward-celebration-modal');
    var amountEl = document.getElementById('reward-celebration-amount');
    var descEl = document.getElementById('reward-celebration-desc');
    var confirmBtn = document.getElementById('reward-celebration-confirm');
    if (!modal || !amountEl) return;

    amountEl.textContent = formatRewardCelebrationAmount(rewardAmount);
    if (descEl) {
        descEl.textContent = options.description || formatCheckinText('reward_sent_desc') || '奖励已发送至余额';
    }
    if (confirmBtn) {
        confirmBtn.textContent = formatCheckinText('reward_confirm') || '确定';
    }

    spawnRewardConfetti();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    if (rewardCelebrationTimer) {
        clearTimeout(rewardCelebrationTimer);
    }
    rewardCelebrationTimer = setTimeout(hideRewardCelebration, options.autoCloseMs || 3000);
}

window.coinrealmShowRewardCelebration = showRewardCelebration;

function showMiningRewardToast(rewardAmount, consecutiveDays) {
    var toast = document.getElementById('mining-reward-toast');
    var rewardEl = document.getElementById('mining-reward-amount');
    var streakEl = document.getElementById('mining-reward-streak');
    if (!toast || !rewardEl || !streakEl) return;

    rewardEl.textContent = '+' + rewardAmount.toLocaleString() + ' CRLM';
    streakEl.textContent = formatCheckinText('airdrop_streak', { days: consecutiveDays });

    toast.classList.remove('hidden');
    toast.setAttribute('aria-hidden', 'false');

    if (miningToastTimer) {
        clearTimeout(miningToastTimer);
    }
    miningToastTimer = setTimeout(function () {
        toast.classList.add('hidden');
        toast.setAttribute('aria-hidden', 'true');
    }, 2000);
}

function resetMiningButtonAvailable() {
    var btn = document.getElementById('invite-mining-btn');
    var label = document.getElementById('invite-mining-label');
    var halo = document.getElementById('invite-mining-halo');
    if (!btn) return;

    btn.classList.remove('invite-mining-done');
    btn.disabled = false;
    if (halo) {
        halo.classList.remove('hidden');
    }
    if (label) {
        label.setAttribute('data-i18n', 'iv_airdrop');
        if (typeof window.getInviteText === 'function') {
            label.textContent = window.getInviteText('iv_airdrop');
        } else {
            label.textContent = '空投';
        }
    }
}

function setMiningButtonMined(streak) {
    var btn = document.getElementById('invite-mining-btn');
    var label = document.getElementById('invite-mining-label');
    var halo = document.getElementById('invite-mining-halo');
    if (!btn) return;

    btn.classList.add('invite-mining-done');
    btn.disabled = true;
    if (halo) {
        halo.classList.add('hidden');
    }
    if (label) {
        label.removeAttribute('data-i18n');
        if (typeof window.getInviteText === 'function') {
            label.textContent = window.getInviteText('iv_airdrop_claimed');
        } else {
            label.textContent = '已领取';
        }
    }
}

function getSecondsUntilMidnight() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

function formatMiningCountdown(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function updateMiningProgressUI(alreadyMined) {
    var fillEl = document.getElementById('iv-mining-progress-fill');
    var countdownEl = document.getElementById('iv-mining-countdown');
    var secondsLeft = getSecondsUntilMidnight();
    var daySeconds = 24 * 3600;
    var dayProgress = ((daySeconds - secondsLeft) / daySeconds) * 100;

    if (fillEl) {
        fillEl.style.width = (alreadyMined ? 100 : Math.max(4, dayProgress)) + '%';
    }

    if (countdownEl) {
        if (typeof window.getInviteText === 'function') {
            countdownEl.textContent = alreadyMined
                ? window.getInviteText('iv_airdrop_next', { time: formatMiningCountdown(secondsLeft) })
                : window.getInviteText('iv_airdrop_available');
        } else {
            countdownEl.textContent = alreadyMined
                ? '下次空投：' + formatMiningCountdown(secondsLeft)
                : '今日空投可领取';
        }
    }
}

function startMiningCountdownTicker(alreadyMined) {
    if (miningCountdownTimer) {
        clearInterval(miningCountdownTimer);
        miningCountdownTimer = null;
    }

    updateMiningProgressUI(alreadyMined);

    if (!document.getElementById('invite-page') || document.getElementById('invite-page').classList.contains('hidden')) {
        return;
    }

    miningCountdownTimer = setInterval(function () {
        var btn = document.getElementById('invite-mining-btn');
        var mined = btn && btn.classList.contains('invite-mining-done');
        updateMiningProgressUI(mined);
    }, 1000);
}

function stopMiningCountdownTicker() {
    if (miningCountdownTimer) {
        clearInterval(miningCountdownTimer);
        miningCountdownTimer = null;
    }
}

async function refreshMiningButtonState() {
    var btn = document.getElementById('invite-mining-btn');
    if (!btn) return;

    resetMiningButtonAvailable();

    if (!window.supabase) {
        startMiningCountdownTicker(false);
        return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
        startMiningCountdownTicker(false);
        return;
    }

    try {
        var today = getLocalDateString(0);
        var todayResult = await window.supabase
            .from('checkins')
            .select('*')
            .eq('user_id', userId)
            .gte('checkin_date', today);

        if (todayResult.error) return;

        var todayRecords = (todayResult.data || []).filter(function (row) {
            return String(row.checkin_date).slice(0, 10) === today;
        });

        if (todayRecords.length) {
            setMiningButtonMined(todayRecords[0].consecutive_days || 1);
            startMiningCountdownTicker(true);
        } else {
            startMiningCountdownTicker(false);
        }
    } catch (e) {
        startMiningCountdownTicker(false);
        /* ignore */
    }
}

function spawnMiningParticles() {
    var container = document.getElementById('invite-mining-particles');
    if (!container) return;

    container.innerHTML = '';
    var count = Math.floor(Math.random() * 4) + 5;
    var colors = ['#f0b90b', '#f7a600', '#ff9800', '#ffd54f'];

    for (var i = 0; i < count; i++) {
        (function () {
            var particle = document.createElement('span');
            particle.className = 'mining-particle';
            var angle = Math.random() * Math.PI * 2;
            var distance = 100 + Math.random() * 50;
            var size = 4 + Math.random() * 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--tx', (Math.cos(angle) * distance).toFixed(1) + 'px');
            particle.style.setProperty('--ty', (Math.sin(angle) * distance).toFixed(1) + 'px');
            container.appendChild(particle);
            setTimeout(function () {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        })();
    }
}

function playMiningPressAnimation() {
    var btn = document.getElementById('invite-mining-btn');
    if (!btn) return;
    btn.classList.remove('invite-mining-press');
    void btn.offsetWidth;
    btn.classList.add('invite-mining-press');
    setTimeout(function () {
        btn.classList.remove('invite-mining-press');
    }, 400);
}

async function handleMiningButtonClick() {
    var btn = document.getElementById('invite-mining-btn');
    if (!btn) return;
    if (btn.classList.contains('invite-mining-done')) {
        alert(formatCheckinText('airdrop_already'));
        return;
    }
    if (btn.disabled) return;
    if (Date.now() < miningCooldownUntil) return;

    miningCooldownUntil = Date.now() + 1500;
    playMiningPressAnimation();

    var result = await handleDailyCheckin();
    if (result && result.ok) {
        var amountText = String(result.reward).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        showRewardCelebration(result.reward, {
            description: formatCheckinText('airdrop_success', { amount: amountText })
        });
        if (typeof window.coinrealmRefreshInviteMiningData === 'function') {
            window.coinrealmRefreshInviteMiningData();
        }
    }
}

function bindMiningEvents() {
    var miningBtn = document.getElementById('invite-mining-btn');
    if (miningBtn && !miningBtn.dataset.bound) {
        miningBtn.dataset.bound = 'true';
        miningBtn.addEventListener('click', handleMiningButtonClick);
    }
}

function showCheckinSuccessModal(rewardAmount, consecutiveDays) {
    showMiningRewardToast(rewardAmount, consecutiveDays);
}

function hideCheckinModal() {
    var toast = document.getElementById('mining-reward-toast');
    if (!toast) return;
    toast.classList.add('hidden');
    toast.setAttribute('aria-hidden', 'true');
}

async function handleDailyCheckin() {
    if (checkinInProgress) return { ok: false };

    if (!window.supabase) {
        alert(formatCheckinText('checkin_login_required'));
        return { ok: false };
    }

    var userId = await getCurrentUserId();
    if (!userId) {
        alert(formatCheckinText('checkin_login_required'));
        return { ok: false };
    }

    checkinInProgress = true;

    try {
        var approvedResult = await window.supabase
            .from('submissions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('status', 'approved');

        if (approvedResult.error) {
            alert(formatCheckinText('checkin_fail') + approvedResult.error.message);
            return { ok: false };
        }

        if (!approvedResult.count) {
            alert(formatCheckinText('airdrop_task_required'));
            return { ok: false, taskRequired: true };
        }

        var today = getLocalDateString(0);
        var todayResult = await window.supabase
            .from('checkins')
            .select('*')
            .eq('user_id', userId)
            .gte('checkin_date', today);

        if (todayResult.error) {
            alert(formatCheckinText('checkin_fail') + todayResult.error.message);
            return { ok: false };
        }

        var todayRecords = (todayResult.data || []).filter(function (row) {
            return String(row.checkin_date).slice(0, 10) === today;
        });

        if (todayRecords.length) {
            var existingStreak = todayRecords[0].consecutive_days || 1;
            setMiningButtonMined(existingStreak);
            alert(formatCheckinText('airdrop_already'));
            return { ok: false, already: true };
        }

        var baseReward = Math.floor(Math.random() * 401) + 100;
        var yesterday = getLocalDateString(-1);
        var yesterdayResult = await window.supabase
            .from('checkins')
            .select('consecutive_days')
            .eq('user_id', userId)
            .eq('checkin_date', yesterday)
            .maybeSingle();

        var consecutiveDays = 1;
        if (!yesterdayResult.error && yesterdayResult.data && yesterdayResult.data.consecutive_days) {
            consecutiveDays = Number(yesterdayResult.data.consecutive_days) + 1;
        }

        var finalReward = baseReward;
        if (consecutiveDays >= 7) {
            finalReward = baseReward * 2;
        }

        var userResult = await window.supabase
            .from('users')
            .select('crlm_balance')
            .eq('id', userId)
            .single();

        if (userResult.error || !userResult.data) {
            alert(formatCheckinText('checkin_fail') + (userResult.error ? userResult.error.message : '无法读取用户余额'));
            return { ok: false };
        }

        var newBalance = (Number(userResult.data.crlm_balance) || 0) + finalReward;

        var insertResult = await window.supabase.from('checkins').insert({
            user_id: userId,
            checkin_date: today,
            reward_amount: finalReward,
            consecutive_days: consecutiveDays
        });

        if (insertResult.error) {
            alert(formatCheckinText('checkin_fail') + insertResult.error.message);
            return { ok: false };
        }

        var updateResult = await window.supabase
            .from('users')
            .update({ crlm_balance: newBalance })
            .eq('id', userId);

        if (updateResult.error) {
            alert(formatCheckinText('checkin_fail') + updateResult.error.message);
            return { ok: false };
        }

        showRewardCelebration(finalReward);
        setMiningButtonMined(consecutiveDays);
        startMiningCountdownTicker(true);
        writeBroadcast({
            user_id: userId,
            event_type: 'checkin',
            description: '完成每日空投，获得',
            reward_amount: finalReward
        });
        return { ok: true, reward: finalReward, streak: consecutiveDays };
    } finally {
        checkinInProgress = false;
    }
}

function bindCheckinEvents() {
    bindMiningEvents();
}

function applyFiltersAndSort() {
    const taskGrid = document.getElementById('task-grid');
    const emptyState = document.getElementById('empty-state');
    if (!taskGrid || !emptyState) return;

    const activeBtn = document.querySelector('#filter-tags .tag-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-type') : 'all';
    const sortDropdown = document.getElementById('sort-dropdown');
    const sortValue = sortDropdown ? sortDropdown.value : 'latest';

    let filtered = allTasks.slice();
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(function (task) {
            return getTaskCategory(task) === selectedCategory;
        });
    }

    filtered = sortTasks(filtered, sortValue);

    if (filtered.length === 0) {
        taskGrid.innerHTML = '';
        taskGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    renderTaskCards(filtered);
    taskGrid.classList.remove('hidden');
    applyLanguageStrings();
}

function goToHomeAndRefreshTasks() {
    if (typeof window.coinrealmNavigateToRoute === 'function') {
        window.coinrealmNavigateToRoute('home');
        return;
    }
    window.location.hash = 'home';
    if (typeof window.coinrealmApplyRoute === 'function') {
        window.coinrealmApplyRoute('home');
    } else if (typeof handleRoute === 'function') {
        handleRoute();
    }
}

function fetchTasks() {
    const seq = ++fetchTasksSeq;
    const skeletonScreen = document.getElementById('skeleton-screen');
    const taskGrid = document.getElementById('task-grid');
    const emptyState = document.getElementById('empty-state');

    if (skeletonScreen) skeletonScreen.classList.remove('hidden');
    if (taskGrid) {
        taskGrid.classList.add('hidden');
        taskGrid.innerHTML = '';
    }
    if (emptyState) emptyState.classList.add('hidden');

    if (!window.supabase) {
        if (skeletonScreen) skeletonScreen.classList.add('hidden');
        allTasks = [];
        homeOfficialTasks = [];
        renderOfficialRecommendSection();
        if (taskGrid) taskGrid.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    window.supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .then(function (result) {
            if (seq !== fetchTasksSeq) return;
            if (skeletonScreen) skeletonScreen.classList.add('hidden');

            var officialQuery = window.supabase
                .from('tasks')
                .select('*')
                .eq('is_official', true)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(4);

            return officialQuery.then(function (officialResult) {
                var officialData = (!officialResult.error && officialResult.data) ? officialResult.data : [];
                if (officialResult.error) {
                    console.warn('加载官方推荐任务失败:', officialResult.error);
                }

                return enrichTasksWithPublishers(officialData).then(function (enrichedOfficial) {
                    homeOfficialTasks = enrichedOfficial || [];
                    renderOfficialRecommendSection();

                    if (result.error || !result.data || result.data.length === 0) {
                        allTasks = [];
                        if (taskGrid) taskGrid.classList.add('hidden');
                        if (emptyState) emptyState.classList.remove('hidden');
                        if (result.error) console.warn('加载任务失败:', result.error);
                        return null;
                    }

                    return enrichTasksWithPublishers(result.data);
                });
            });
        })
        .then(function (tasks) {
            if (seq !== fetchTasksSeq) return;
            if (!tasks) return;

            allTasks = tasks;
            applyFiltersAndSort();
        })
        .catch(function (err) {
            if (seq !== fetchTasksSeq) return;
            if (skeletonScreen) skeletonScreen.classList.add('hidden');
            allTasks = [];
            homeOfficialTasks = [];
            renderOfficialRecommendSection();
            if (taskGrid) taskGrid.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            console.warn('加载任务失败:', err);
        });
}

// ==========================================
// 2. 首页核心业务逻辑与动态渲染切换
// ==========================================

function initHomePageLogic() {
    // A. 新用户引导条关闭处理逻辑
    const guideBar = document.getElementById('user-guide-bar');
    const closeGuideBtn = document.getElementById('close-guide-btn');
    
    if (guideBar && closeGuideBtn) {
        if (localStorage.getItem('coinrealm_guide_closed') === 'true') {
            guideBar.classList.add('hidden');
        } else {
            guideBar.classList.remove('hidden');
        }

        closeGuideBtn.addEventListener('click', () => {
            guideBar.classList.add('hidden');
            localStorage.setItem('coinrealm_guide_closed', 'true');
        });
    }

    // B. 骨架屏 → 从 Supabase 拉取任务数据
    fetchTasks();
    loadHomeBroadcasts();

    if (!homeEventsBound) {
        homeEventsBound = true;

        // C. 类型筛选标签切换交互逻辑
        const tagButtons = document.querySelectorAll('#filter-tags .tag-btn');

        tagButtons.forEach(button => {
            button.addEventListener('click', () => {
                tagButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                applyFiltersAndSort();
            });
        });

        // D. 排序下拉交互
        const sortDropdown = document.getElementById('sort-dropdown');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', () => {
                applyFiltersAndSort();
            });
        }

        // D2. 任务卡片「领取」按钮（事件委托，避免重复渲染后失效）
        const taskGrid = document.getElementById('task-grid');
        if (taskGrid) {
            taskGrid.addEventListener('click', function (e) {
                var publisherLink = e.target.closest('.publisher-link');
                if (publisherLink && taskGrid.contains(publisherLink)) {
                    e.preventDefault();
                    e.stopPropagation();
                    var publisherId = publisherLink.getAttribute('data-publisher-id');
                    if (publisherId) navigateToPublisher(publisherId);
                    return;
                }

                var btn = e.target.closest('.claim-btn');
                if (!btn || !taskGrid.contains(btn)) return;
                e.preventDefault();
                e.stopPropagation();
                handleClaimTask(btn);
            });
        }

        // E. 回到顶部按钮逻辑
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.remove('hidden');
                } else {
                    backToTopBtn.classList.add('hidden');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        var officialGrid = document.getElementById('official-recommend-grid');
        if (officialGrid) {
            officialGrid.addEventListener('click', function (e) {
                var card = e.target.closest('.official-recommend-card');
                if (!card || !officialGrid.contains(card)) return;
                navigateToTaskDetail(card.getAttribute('data-task-id'));
            });
            officialGrid.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                var card = e.target.closest('.official-recommend-card');
                if (!card || !officialGrid.contains(card)) return;
                e.preventDefault();
                navigateToTaskDetail(card.getAttribute('data-task-id'));
            });
        }

        var officialViewAllBtn = document.getElementById('official-view-all-btn');
        if (officialViewAllBtn) {
            officialViewAllBtn.addEventListener('click', function (e) {
                e.preventDefault();
                filterByOfficialTag();
            });
        }

        var adsCarouselEl = document.getElementById('ads-carousel');
        if (adsCarouselEl && !adsCarouselEl.dataset.bound) {
            adsCarouselEl.dataset.bound = 'true';
            adsCarouselEl.addEventListener('click', function (e) {
                var contentEl = e.target.closest('.ads-carousel-content');
                if (!contentEl || !adsCarouselEl.contains(contentEl)) return;
                var link = contentEl.getAttribute('data-ad-link');
                if (link) {
                    window.open(link, '_blank', 'noopener,noreferrer');
                }
            });
            var adsDotsEl = document.getElementById('ads-carousel-dots');
            if (adsDotsEl) {
                adsDotsEl.addEventListener('click', function (e) {
                    var dot = e.target.closest('.ads-carousel-dot');
                    if (!dot || dot.disabled || !adsCarouselState) return;
                    var slotIndex = Number(dot.getAttribute('data-ad-index'));
                    if (!Number.isFinite(slotIndex)) return;
                    showAdsCarouselSlot(slotIndex, { animate: true });
                    startAdsCarouselRotation();
                });
            }
        }
    }

    initAdsCarousel();
}

// ==========================================
// 3. 全局多语言国际化渲染应用
// ==========================================
function applyLanguageStrings() {
    const langData = translations[currentLang];
    
    // 1. 静态普通文本翻译映射
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.textContent = langData[key];
        }
    });

    // 2. 表单及输入框 Placeholder 属性翻译映射
    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const key = element.getAttribute('data-placeholder');
        if (langData[key]) {
            element.setAttribute('placeholder', langData[key]);
        }
    });

    updateNavbarMainLinksActive();
}

function updateNavbarMainLinksActive() {
    var route = getRouteBaseFromHash();
    document.querySelectorAll('.navbar-main-link').forEach(function (link) {
        var navRoute = link.getAttribute('data-nav-route');
        var isActive = navRoute === route;
        link.classList.toggle('navbar-main-link-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

window.updateNavbarMainLinksActive = updateNavbarMainLinksActive;

// ==========================================
// 4. 路由系统挂载衔接机制 (请根据具体路由实现进行补充)
// ==========================================
function getRouteBaseFromHash() {
    return (window.location.hash.replace(/^#/, '') || 'home').split('?')[0] || 'home';
}

function handleRoute() {
    if (getRouteBaseFromHash() !== 'home') return;
    initHomePageLogic();
    applyLanguageStrings();
}

function applyInitialRoute() {
    var oauthParams = new URLSearchParams(window.location.search);
    if (oauthParams.get('code') || oauthParams.get('error')) {
        console.log('[discord-oauth] 检测到 OAuth 回调，跳过默认首页路由');
        if (typeof window.coinrealmHandleDiscordOAuthReturn === 'function') {
            window.coinrealmHandleDiscordOAuthReturn().catch(function (err) {
                console.warn('Discord OAuth callback failed', err);
            });
        }
        return;
    }

    var baseRoute = getRouteBaseFromHash();
    if (typeof window.coinrealmApplyRoute === 'function') {
        window.coinrealmApplyRoute(baseRoute);
        return;
    }
    handleRoute();
}

// 页面加载完毕后默认触发一次
window.addEventListener('DOMContentLoaded', function () {
    updateNavbarMainLinksActive();
    applyInitialRoute();
});
window.addEventListener('hashchange', function () {
    updateNavbarMainLinksActive();
    handleRoute();
});

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
    sessionStorage.setItem('currentTaskId', task.id);
    sessionStorage.setItem('currentTaskTitle', task.title || '');
    sessionStorage.setItem('currentTaskReward', String(task.reward_amount != null ? task.reward_amount : 0));
    sessionStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify({
      taskId: task.id,
      submissionId: submission.id,
      title: task.title || '',
      reward: task.reward_amount != null ? task.reward_amount : 0,
      rewardUnit: task.reward_type || 'CRLM'
    }));
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

        if (currentSubmissionRecord && currentSubmissionRecord.id) {
          var existingUrls = currentSubmissionRecord.screenshot_urls;
          if (typeof existingUrls === 'string') {
            try { existingUrls = JSON.parse(existingUrls); } catch (_e) { existingUrls = []; }
          }
          if (!Array.isArray(existingUrls)) existingUrls = [];
          if (screenshotUrl) existingUrls.push(screenshotUrl);

          await window.supabase
            .from('submissions')
            .update({
              screenshot_urls: existingUrls,
              submitted_at: new Date().toISOString()
            })
            .eq('id', currentSubmissionRecord.id);
        }

        await applyTwitterVerificationSuccess(currentTaskRecord, currentUserId, {
          priorStatus: priorStatus,
          creditRewardClient: true
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

        verifyPanelSuccess = true;
        detailActionState = 'simple_completed';
        subtaskUiState = {};
        subtaskFailReasons = {};
        activeSubtaskKey = null;
        activeSubtaskIndex = null;
        renderScreenshotVerifyPanel();
        updateBottomActionBar();
        if (typeof window.coinrealmShowRewardCelebration === 'function') {
          window.coinrealmShowRewardCelebration(Number(currentTaskRecord.reward_amount) || 0);
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
        await reloadCurrentSubmission();
        if (currentSubmissionRecord && currentSubmissionRecord.status === 'approved') {
          detailActionState = 'simple_completed';
          if (typeof window.coinrealmShowRewardCelebration === 'function') {
            window.coinrealmShowRewardCelebration(Number(currentTaskRecord.reward_amount) || 0);
          }
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
        await reloadCurrentSubmission();
        if (currentSubmissionRecord && currentSubmissionRecord.status === 'approved') {
          detailActionState = 'simple_completed';
          if (typeof window.coinrealmShowRewardCelebration === 'function') {
            window.coinrealmShowRewardCelebration(Number(currentTaskRecord.reward_amount) || 0);
          }
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

  function resolveDetailActionState(task, submission, userId) {
    var max = task.max_participants != null ? Number(task.max_participants) : null;
    var current = Number(task.current_participants) || 0;
    var deadline = task.deadline ? new Date(task.deadline) : null;
    var isFull = max != null && current >= max;
    var isExpired = deadline && !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now();

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
      return 'simple_completed';
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

  function navigateToSubmitPage() {
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

    var levelResult = await window.supabase
      .from('users')
      .select('level')
      .eq('id', userId)
      .maybeSingle();
    var userLevel = levelResult.data && levelResult.data.level != null
      ? Number(levelResult.data.level)
      : 0;

    if (userLevel < 1) {
      alert(tdT('td_btn_level'));
      return;
    }

    if (currentSubmissionRecord) {
      alert(tdT('td_alert_already_claimed'));
      return;
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
      detailActionState = 'simple_completed';
      updateBottomActionBar();
      return;
    }

    var priorStatus = currentSubmissionRecord.status;

    try {
      await applyTwitterVerificationSuccess(currentTaskRecord, currentUserId, {
        priorStatus: priorStatus,
        creditRewardClient: true
      });
      await reloadCurrentSubmission();
      detailActionState = 'simple_completed';
      verifyPanelActive = false;
      verifyPanelSuccess = false;
      subtaskUiState = {};
      subtaskFailReasons = {};
      updateTaskDetailSubtaskModeUi();
      updateBottomActionBar();
      if (typeof window.coinrealmShowRewardCelebration === 'function') {
        window.coinrealmShowRewardCelebration(Number(currentTaskRecord.reward_amount) || 0);
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

    var subResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls')
      .eq('task_id', currentTaskRecord.id)
      .eq('user_id', currentUserId)
      .maybeSingle();

    if (!subResult.error && subResult.data) {
      currentSubmissionRecord = subResult.data;
    }

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
        if (priorStatus === 'verifying' || priorStatus === 'rejected' || priorStatus === 'pending') {
          await applyTwitterVerificationSuccess(currentTaskRecord, currentUserId, {
            priorStatus: priorStatus,
            creditRewardClient: useClientRewardCredit
          });
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
        detailActionState = 'simple_completed';
        twitterPendingAutoVerify = false;
        activeSubtaskKey = null;
        updateTaskDetailSubtaskModeUi();
        updateBottomActionBar();
        if (options.showAlert !== false && typeof window.coinrealmShowRewardCelebration === 'function') {
          window.coinrealmShowRewardCelebration(Number(currentTaskRecord.reward_amount) || 0);
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

    var nowIso = new Date().toISOString();

    var insertResult = await window.supabase
      .from('submissions')
      .insert({
        task_id: taskId,
        user_id: userId,
        status: 'submitted',
        submitted_at: nowIso
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
    alert(tdT('td_alert_simple_claim_ok'));

    writeBroadcast({
      user_id: userId,
      event_type: 'task_claim',
      description: '领取了简单任务「' + buildTaskBroadcastTitle(currentTaskRecord.title) + '」',
      reward_amount: Number(currentTaskRecord.reward_amount) || 0
    });
  }

  async function performSimpleTaskClaim() {
    if (twitterClaimInProgress || !window.supabase || !currentTaskRecord || !isSimpleTaskRecord(currentTaskRecord)) return;

    var userId = await getAuthenticatedUserId();

    if (!userId) {
      alert(tdT('td_alert_login'));
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

    if (currentTaskRecord.publisher_id) {
      var publisherResult = await window.supabase
        .from('users')
        .select('username, level, reputation_score, email')
        .eq('id', currentTaskRecord.publisher_id)
        .maybeSingle();
      if (!publisherResult.error && publisherResult.data) {
        currentPublisherRecord = publisherResult.data;
      }
    }

    var userId = await getCurrentUserId();
    if (userId) {
      currentUserId = userId;
      var subResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls')
        .eq('task_id', taskId)
        .eq('user_id', currentUserId)
        .maybeSingle();
      if (!subResult.error && subResult.data) {
        currentSubmissionRecord = subResult.data;
      }
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

    detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);

    var publisher = currentPublisherRecord || {};
    var publisherName = publisher.username || displayNameFromEmail(publisher.email);
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

    var completionRateEl = document.getElementById('td-completion-rate');
    if (completionRateEl) {
      completionRateEl.textContent = tdT('td_completion_rate', { rate: reputationScore });
    }

    var publishedCountEl = document.getElementById('td-published-count');
    if (publishedCountEl) {
      publishedCountEl.textContent = tdT('td_published_count', { count: publishedCount });
    }

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
        configureActionButton(buttons.submit, {
          styleClass: 'td-btn-blue',
          text: tdT('td_btn_submit'),
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
          text: tdT('td_btn_approved'),
          disabled: true
        });
        break;
      case 'rejected_resubmit':
        configureActionButton(buttons.claim, {
          styleClass: 'td-btn-gold',
          text: tdT('td_btn_rejected'),
          disabled: false
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
          navigateToSubmitPage();
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
        navigateToSubmitPage();
      });
    }

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
      st_alert_login: '请先登录',
      st_alert_max_files: '最多上传 3 张截图',
      st_alert_invalid_type: '仅支持 JPG、PNG、WebP 格式',
      st_alert_file_size: '单张图片不能超过 5MB',
      st_alert_upload_fail: '上传失败：',
      st_alert_no_task: '请先在任务详情页领取任务',
      st_alert_submit_fail: '提交失败：'
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
      st_alert_login: 'Please sign in first',
      st_alert_max_files: 'Maximum 3 screenshots allowed',
      st_alert_invalid_type: 'Only JPG, PNG, and WebP formats are supported',
      st_alert_file_size: 'Each image must be 5MB or smaller',
      st_alert_upload_fail: 'Upload failed: ',
      st_alert_no_task: 'Please claim the task on the task detail page first',
      st_alert_submit_fail: 'Submit failed: '
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

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, review_comment, screenshot_urls')
      .eq('task_id', activeSubmitContext.taskId)
      .eq('user_id', userId)
      .maybeSingle();

    if (submissionResult.error) {
      alert(stT('st_alert_submit_fail') + submissionResult.error.message);
      return false;
    }

    if (!submissionResult.data) {
      showNoTaskEmptyState();
      return true;
    }

    currentSubmissionRecord = submissionResult.data;
    activeSubmitContext.submissionId = submissionResult.data.id;

    if (isSubmissionWaitingReview(submissionResult.data)) {
      submitState = 'waiting';
    } else if (isSubmissionReadyToSubmit(submissionResult.data)) {
      submitState = 'form';
    } else if (submissionResult.data.status === 'rejected') {
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
        if (submitState === 'waiting' || submitState === 'no_task') return;

        var descEl = document.getElementById('st-description');
        var desc = descEl ? descEl.value.trim() : '';
        if (!desc) {
          alert(stT('st_alert_desc'));
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
          var lookupResult = await window.supabase
            .from('submissions')
            .select('id')
            .eq('task_id', activeSubmitContext.taskId)
            .eq('user_id', userId)
            .maybeSingle();

          if (lookupResult.error || !lookupResult.data) {
            alert(stT('st_alert_no_task'));
            return;
          }

          var screenshotUrls = uploadedFiles.map(function (item) {
            return normalizeScreenshotPublicUrl(item.url || item.path);
          }).filter(function (url) {
            return !!url && isScreenshotPublicUrl(url);
          });

          var updateResult = await window.supabase
            .from('submissions')
            .update({
              description: desc,
              screenshot_urls: screenshotUrls,
              status: 'submitted',
              submitted_at: new Date().toISOString()
            })
            .eq('id', lookupResult.data.id)
            .eq('user_id', userId);

          if (updateResult.error) {
            alert(stT('st_alert_submit_fail') + updateResult.error.message);
            return;
          }

          currentSubmissionRecord = Object.assign({}, currentSubmissionRecord || {}, {
            id: lookupResult.data.id,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            description: desc,
            screenshot_urls: screenshotUrls
          });

          submitState = 'waiting';
          uploadedFiles = [];
          renderFileList();
          updatePageStateUI();
          applySubmitTaskI18n();
          writeBroadcast({
            user_id: userId,
            event_type: 'task_submit',
            description: '提交了任务「' + buildTaskBroadcastTitle(activeSubmitContext.title) + '」凭证',
            reward_amount: Number(activeSubmitContext.reward) || 0
          });
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

// ==========================================
// 8. 个人中心页 (#profile) — 任务卡 #006
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var profileInitialized = false;
  var avatarPickerInitialized = false;
  var balanceLedgerInitialized = false;
  var withdrawInitialized = false;
  var depositInitialized = false;
  var withdrawSubmitting = false;
  var walletBindSubmitting = false;
  var selectedPresetAvatarPath = '';

  var profileTranslations = {
    zh: {
      pf_btn_withdraw: '提币',
      pf_btn_deposit: '充币',
      pf_stat_progress: '进行中',
      pf_stat_completed: '已完成',
      pf_stat_earnings: '累计收益',
      pf_menu_tasks: '我的任务（进行中/已完成/已驳回）',
      pf_menu_publish: '发布管理（我发布的任务列表）',
      pf_menu_dividends: '我的分红',
      pf_menu_exchange: '兑换市场',
      pf_menu_leaderboard: '排行榜',
      pf_menu_invite: '邀请好友',
      pf_menu_settings: '设置（语言/通知/退出登录）',
      pf_menu_twitter_bind: '绑定 Twitter 账号',
      pf_twitter_unbound: '未绑定',
      pf_menu_telegram_bind: '绑定 Telegram 账号',
      pf_telegram_unbound: '未绑定',
      pf_menu_discord_bind: '绑定 Discord 账号',
      pf_discord_unbound: '未绑定',
      pf_level_master: '大师',
      pf_completion_rate: '{rate}% 完成率',
      pf_level_badge: 'Lv.{level} {label}',
      pf_usdt_approx: '≈ {amount} USDT',
      pf_avatar_picker_title: '选择头像',
      pf_avatar_cancel: '取消',
      pf_avatar_confirm: '确认',
      pf_avatar_save_fail: '保存头像失败：',
      pf_avatar_pick_required: '请先选择一个头像',
      pf_balance_ledger: '明细',
      pf_ledger_title: 'CRLM 余额明细',
      pf_ledger_loading: '加载中...',
      pf_ledger_empty: '暂无余额变动记录',
      pf_ledger_type_checkin: '空投奖励',
      pf_ledger_type_task: '任务奖励',
      pf_ledger_desc_task: '任务奖励：{title}',
      pf_ledger_desc_checkin: '每日空投奖励（连续{days}天）',
      pf_ledger_desc_publish: '发布任务：{title}',
      pf_ledger_desc_refund: '任务退款：{title}',
      pf_ledger_icon_task: '🎯',
      pf_ledger_icon_checkin: '🎁',
      pf_ledger_icon_publish: '📝',
      pf_ledger_icon_refund: '↩️',
      pf_ledger_balance_after: '余额 {amount} CRLM',
      pf_withdraw_title: '提现 CRLM',
      pf_withdraw_balance_label: '当前余额',
      pf_withdraw_amount_label: '提现金额',
      pf_withdraw_wallet_label: '接收钱包地址',
      pf_withdraw_hint: '最小提币 {min} CRLM，预计几分钟内到账。',
      pf_withdraw_cancel: '取消',
      pf_withdraw_confirm: '确认提币',
      pf_withdraw_confirming: '处理中...',
      pf_withdraw_success_celebration: '提币成功！{amount} CRLM 已发送到你的钱包',
      pf_withdraw_err_login: '请先登录',
      pf_withdraw_err_amount: '请输入有效的提现金额',
      pf_withdraw_err_min: '最低提币金额为 {min} CRLM',
      pf_withdraw_err_max: '单笔提币不能超过 {max} CRLM',
      pf_withdraw_err_balance: '提现金额不能超过当前余额',
      pf_withdraw_err_wallet: '请输入有效的钱包地址',
      pf_withdraw_err_worker: '提币服务暂不可用，请稍后再试',
      pf_withdraw_err_failed: '提币失败：',
      pf_balance_fetch_fail: '获取余额失败，请稍后重试',
      pf_deposit_title: '充值 CRLM',
      pf_deposit_address_label: '平台充币地址（Polygon）',
      pf_deposit_copy: '复制地址',
      pf_deposit_copy_ok: '地址已复制',
      pf_deposit_hint: '请从你绑定的钱包地址向上述地址转账 CRLM。仅支持 Polygon 网络，到账后自动增加余额。',
      pf_deposit_records_title: '最近充币记录',
      pf_deposit_records_empty: '暂无充币记录',
      pf_deposit_address_missing: '充币地址未配置，请联系管理员',
      pf_deposit_copy_fail: '复制失败，请手动复制地址',
      pf_wallet_label: '钱包地址',
      pf_wallet_unbound: '未绑定',
      pf_wallet_bind_btn: '去绑定',
      pf_wallet_bound: '已绑定',
      pf_wallet_bind_fail: '绑定钱包失败：',
      pf_wallet_metamask_missing: '请安装 MetaMask 浏览器插件',
      pf_deposit_bind_required: '请先绑定你的 Polygon 钱包地址，充币需要从你的钱包地址转账。',
      pf_deposit_go_bind: '去绑定'
    },
    en: {
      pf_btn_withdraw: 'Withdraw',
      pf_btn_deposit: 'Deposit',
      pf_stat_progress: 'In Progress',
      pf_stat_completed: 'Completed',
      pf_stat_earnings: 'Total Earnings',
      pf_menu_tasks: 'My Tasks (Active/Completed/Rejected)',
      pf_menu_publish: 'Publish Management (My Published Tasks)',
      pf_menu_dividends: 'My Dividends',
      pf_menu_exchange: 'Exchange Market',
      pf_menu_leaderboard: 'Leaderboard',
      pf_menu_invite: 'Invite Friends',
      pf_menu_settings: 'Settings (Language/Notifications/Logout)',
      pf_menu_twitter_bind: 'Link Twitter Account',
      pf_twitter_unbound: 'Not linked',
      pf_menu_telegram_bind: 'Link Telegram Account',
      pf_telegram_unbound: 'Not linked',
      pf_menu_discord_bind: 'Link Discord Account',
      pf_discord_unbound: 'Not linked',
      pf_level_master: 'Master',
      pf_completion_rate: '{rate}% completion rate',
      pf_level_badge: 'Lv.{level} {label}',
      pf_usdt_approx: '≈ {amount} USDT',
      pf_avatar_picker_title: 'Choose Avatar',
      pf_avatar_cancel: 'Cancel',
      pf_avatar_confirm: 'Confirm',
      pf_avatar_save_fail: 'Failed to save avatar: ',
      pf_avatar_pick_required: 'Please select an avatar first',
      pf_balance_ledger: 'History',
      pf_ledger_title: 'CRLM Balance History',
      pf_ledger_loading: 'Loading...',
      pf_ledger_empty: 'No balance changes yet',
      pf_ledger_type_checkin: 'Airdrop Reward',
      pf_ledger_type_task: 'Task Reward',
      pf_ledger_desc_task: 'Task reward: {title}',
      pf_ledger_desc_checkin: 'Daily airdrop reward (day {days} streak)',
      pf_ledger_desc_publish: 'Published task: {title}',
      pf_ledger_desc_refund: 'Task refund: {title}',
      pf_ledger_icon_task: '🎯',
      pf_ledger_icon_checkin: '🎁',
      pf_ledger_icon_publish: '📝',
      pf_ledger_icon_refund: '↩️',
      pf_ledger_balance_after: 'Balance {amount} CRLM',
      pf_withdraw_title: 'Withdraw CRLM',
      pf_withdraw_balance_label: 'Current balance',
      pf_withdraw_amount_label: 'Withdraw amount',
      pf_withdraw_wallet_label: 'Receiving wallet address',
      pf_withdraw_hint: 'Minimum withdrawal {min} CRLM. Funds usually arrive within a few minutes.',
      pf_withdraw_cancel: 'Cancel',
      pf_withdraw_confirm: 'Confirm Withdrawal',
      pf_withdraw_confirming: 'Processing...',
      pf_withdraw_success_celebration: 'Withdrawal successful! {amount} CRLM sent to your wallet.',
      pf_withdraw_err_login: 'Please log in first',
      pf_withdraw_err_amount: 'Please enter a valid withdrawal amount',
      pf_withdraw_err_min: 'Minimum withdrawal is {min} CRLM',
      pf_withdraw_err_max: 'Maximum per withdrawal is {max} CRLM',
      pf_withdraw_err_balance: 'Amount cannot exceed your current balance',
      pf_withdraw_err_wallet: 'Please enter a valid wallet address',
      pf_withdraw_err_worker: 'Withdrawal service is unavailable. Please try again later.',
      pf_withdraw_err_failed: 'Withdrawal failed: ',
      pf_balance_fetch_fail: 'Failed to load balance. Please try again later.',
      pf_deposit_title: 'Deposit CRLM',
      pf_deposit_address_label: 'Platform deposit address (Polygon)',
      pf_deposit_copy: 'Copy address',
      pf_deposit_copy_ok: 'Address copied',
      pf_deposit_hint: 'Send CRLM from your linked wallet to the address above. Polygon network only. Balance updates automatically.',
      pf_deposit_records_title: 'Recent deposits',
      pf_deposit_records_empty: 'No deposit records yet',
      pf_deposit_address_missing: 'Deposit address is not configured. Please contact support.',
      pf_deposit_copy_fail: 'Copy failed. Please copy the address manually.',
      pf_wallet_label: 'Wallet address',
      pf_wallet_unbound: 'Not linked',
      pf_wallet_bind_btn: 'Link wallet',
      pf_wallet_bound: 'Linked',
      pf_wallet_bind_fail: 'Failed to link wallet: ',
      pf_wallet_metamask_missing: 'Please install the MetaMask browser extension',
      pf_deposit_bind_required: 'Please link your Polygon wallet first. Deposits must come from your linked address.',
      pf_deposit_go_bind: 'Link wallet'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function pfT(key, vars) {
    var dict = profileTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function displayNameFromEmail(email) {
    if (!email) return 'user';
    var parts = String(email).split('@');
    return parts[0] || 'user';
  }

  function getProfileLevelLabel(level) {
    var n = Number(level) || 0;
    if (n >= 5) return pfT('pf_level_master');
    return '';
  }

  async function fetchCurrentUserCrlmBalance() {
    if (!window.supabase) {
      return { ok: false, error: pfT('pf_balance_fetch_fail') };
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      return { ok: false, error: pfT('pf_withdraw_err_login') };
    }

    try {
      var result = await window.supabase
        .from('users')
        .select('id, crlm_balance')
        .eq('id', userId)
        .single();

      if (result.error || !result.data) {
        console.error('获取 CRLM 余额失败:', result.error);
        return { ok: false, error: pfT('pf_balance_fetch_fail') };
      }

      var balance = Number(result.data.crlm_balance);
      if (!Number.isFinite(balance)) balance = 0;

      if (coinrealmCurrentUserProfile && String(coinrealmCurrentUserProfile.id) === String(userId)) {
        coinrealmCurrentUserProfile.crlm_balance = balance;
      }

      return { ok: true, balance: balance, userId: userId };
    } catch (balanceErr) {
      console.error('获取 CRLM 余额失败:', balanceErr);
      return { ok: false, error: pfT('pf_balance_fetch_fail') };
    }
  }

  function renderProfileCrlmBalanceDisplay(balanceResult) {
    var crlmEl = document.getElementById('pf-crlm-balance');
    var earningsEl = document.getElementById('pf-stat-earnings');

    if (!balanceResult || !balanceResult.ok) {
      var failText = (balanceResult && balanceResult.error) || pfT('pf_balance_fetch_fail');
      if (crlmEl) crlmEl.textContent = failText;
      return;
    }

    if (crlmEl) crlmEl.textContent = formatNumber(balanceResult.balance) + ' CRLM';
    if (earningsEl) earningsEl.textContent = formatNumber(balanceResult.balance);
  }

  async function loadUserProfile() {
    if (!window.supabase) {
      alert('请先登录');
      window.location.hash = 'home';
      return null;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert('请先登录');
      window.location.hash = 'home';
      return null;
    }

    var userResult = await window.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userResult.error || !userResult.data) {
      console.error('获取用户数据失败:', userResult.error);
      alert('获取用户数据失败');
      return null;
    }

    return userResult.data;
  }

  function formatLedgerDateTime(value) {
    if (!value) return '--';
    var d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      var dateOnly = String(value).slice(0, 10);
      return dateOnly + ' 00:00';
    }
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    return y + '-' + m + '-' + day + ' ' + hh + ':' + mm;
  }

  function getLedgerTaskTitle(task, fallback) {
    var title = task && task.title ? String(task.title).trim() : '';
    return title || fallback || pfT('pf_ledger_type_task');
  }

  function isCrlmLedgerTask(task) {
    var rewardType = String((task && task.reward_type) || 'CRLM').toUpperCase();
    return rewardType === 'CRLM';
  }

  function resolveLedgerTaskStakeAmount(task) {
    if (!task) return 0;
    if (task.stake_amount != null && !Number.isNaN(Number(task.stake_amount))) {
      return Number(task.stake_amount) || 0;
    }
    var reward = Number(task.reward_amount) || 0;
    if (task.deposit_amount != null && !Number.isNaN(Number(task.deposit_amount))) {
      return reward + (Number(task.deposit_amount) || 0);
    }
    var netReward = reward * 0.85;
    return reward + netReward * 0.2;
  }

  function calculateLedgerTaskRefund(task) {
    var maxParticipantsRaw = task && task.max_participants;
    if (maxParticipantsRaw == null || maxParticipantsRaw === '') return 0;

    var maxParticipants = parseFloat(maxParticipantsRaw);
    var currentParticipants = parseFloat(task.current_participants) || 0;
    if (Number.isNaN(maxParticipants) || maxParticipants <= 0) return 0;

    var remainingSlots = Math.max(0, maxParticipants - currentParticipants);
    if (remainingSlots <= 0) return 0;

    var rewardAmount = parseFloat(task.reward_amount) || 0;
    var perSlotReward = rewardAmount / maxParticipants;
    var refundAmount = perSlotReward * remainingSlots;
    return refundAmount * 0.85;
  }

  function hideBalanceLedgerModal() {
    var modal = document.getElementById('balance-ledger-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function fetchBalanceLedgerEntries(userId, currentBalance) {
    if (!window.supabase || !userId) return [];

    var entries = [];
    var queryLimit = 50;

    try {
      var checkinsResult = await window.supabase
        .from('checkins')
        .select('checkin_date, reward_amount, consecutive_days, created_at')
        .eq('user_id', userId)
        .order('checkin_date', { ascending: false })
        .limit(queryLimit);

      if (!checkinsResult.error) {
        (checkinsResult.data || []).forEach(function (row) {
          var amount = Number(row.reward_amount) || 0;
          var streak = Number(row.consecutive_days) || 1;
          entries.push({
            time: row.created_at || (String(row.checkin_date).slice(0, 10) + 'T12:00:00'),
            icon: pfT('pf_ledger_icon_checkin'),
            description: pfT('pf_ledger_desc_checkin', { days: streak }),
            delta: amount,
            income: true
          });
        });
      }
    } catch (checkinErr) {
      console.warn('余额明细：签到记录查询失败', checkinErr);
    }

    try {
      var submissionsResult = await window.supabase
        .from('submissions')
        .select('reviewed_at, submitted_at, task_id, tasks(reward_amount, reward_type, title)')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false })
        .limit(queryLimit);

      if (!submissionsResult.error) {
        (submissionsResult.data || []).forEach(function (row) {
          var task = row.tasks || {};
          if (!isCrlmLedgerTask(task)) return;
          var amount = Number(task.reward_amount) || 0;
          if (amount <= 0) return;
          entries.push({
            time: row.reviewed_at || row.submitted_at || new Date().toISOString(),
            icon: pfT('pf_ledger_icon_task'),
            description: pfT('pf_ledger_desc_task', { title: getLedgerTaskTitle(task, '任务 #' + row.task_id) }),
            delta: amount,
            income: true
          });
        });
      }
    } catch (submissionErr) {
      console.warn('余额明细：任务奖励查询失败', submissionErr);
    }

    try {
      var publishedResult = await window.supabase
        .from('tasks')
        .select('id, title, created_at, reward_amount, reward_type, stake_amount, deposit_amount, max_participants, current_participants, status')
        .eq('publisher_id', userId)
        .order('created_at', { ascending: false })
        .limit(queryLimit);

      if (!publishedResult.error) {
        (publishedResult.data || []).forEach(function (task) {
          if (!isCrlmLedgerTask(task)) return;
          var stakeAmount = resolveLedgerTaskStakeAmount(task);
          if (stakeAmount <= 0) return;
          entries.push({
            time: task.created_at || new Date().toISOString(),
            icon: pfT('pf_ledger_icon_publish'),
            description: pfT('pf_ledger_desc_publish', { title: getLedgerTaskTitle(task, '任务 #' + task.id) }),
            delta: stakeAmount,
            income: false
          });
        });
      }
    } catch (publishErr) {
      console.warn('余额明细：发布任务消耗查询失败', publishErr);
    }

    try {
      var cancelledResult = await window.supabase
        .from('tasks')
        .select('id, title, created_at, updated_at, reward_amount, reward_type, stake_amount, deposit_amount, max_participants, current_participants, status')
        .eq('publisher_id', userId)
        .eq('status', 'cancelled')
        .order('updated_at', { ascending: false })
        .limit(queryLimit);

      if (!cancelledResult.error) {
        (cancelledResult.data || []).forEach(function (task) {
          if (!isCrlmLedgerTask(task)) return;
          var refundAmount = calculateLedgerTaskRefund(task);
          if (refundAmount <= 0) return;
          entries.push({
            time: task.updated_at || task.created_at || new Date().toISOString(),
            icon: pfT('pf_ledger_icon_refund'),
            description: pfT('pf_ledger_desc_refund', { title: getLedgerTaskTitle(task, '任务 #' + task.id) }),
            delta: refundAmount,
            income: true
          });
        });
      }
    } catch (refundErr) {
      console.warn('余额明细：任务退款查询失败', refundErr);
    }

    entries.sort(function (a, b) {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    entries = entries.slice(0, 20);

    var runningBalance = Number(currentBalance) || 0;
    entries.forEach(function (entry) {
      entry.balanceAfter = runningBalance;
      runningBalance -= entry.income ? entry.delta : -entry.delta;
    });

    return entries;
  }

  function renderBalanceLedgerList(entries) {
    var listEl = document.getElementById('balance-ledger-list');
    var emptyEl = document.getElementById('balance-ledger-empty');
    if (!listEl) return;

    if (!entries.length) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    listEl.innerHTML = entries.map(function (entry) {
      var amountClass = entry.income ? 'income' : 'expense';
      var amountText = (entry.income ? '+' : '-') + formatNumber(Math.abs(entry.delta));
      var icon = entry.icon || '';
      var description = entry.description || '';
      return (
        '<li class="balance-ledger-item">' +
          '<div class="balance-ledger-time">' + escapeHtml(formatLedgerDateTime(entry.time)) + '</div>' +
          '<div class="balance-ledger-type">' + escapeHtml(icon + ' ' + description) + '</div>' +
          '<div class="balance-ledger-amount ' + amountClass + '">' + escapeHtml(amountText) + '</div>' +
          '<div class="balance-ledger-balance">' + escapeHtml(pfT('pf_ledger_balance_after', { amount: formatNumber(entry.balanceAfter) })) + '</div>' +
        '</li>'
      );
    }).join('');
  }

  async function openBalanceLedgerModal() {
    if (!window.supabase) return;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert('请先登录');
      return;
    }

    var modal = document.getElementById('balance-ledger-modal');
    var loadingEl = document.getElementById('balance-ledger-loading');
    var titleEl = document.getElementById('balance-ledger-title');
    var closeBtn = document.getElementById('balance-ledger-close');
    if (!modal) return;

    if (titleEl) titleEl.textContent = pfT('pf_ledger_title');
    if (closeBtn) {
      var langData = translations[getLang()] || translations.zh;
      closeBtn.textContent = langData.reward_confirm || '确定';
    }
    if (loadingEl) loadingEl.classList.remove('hidden');
    renderBalanceLedgerList([]);

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    var user = coinrealmCurrentUserProfile;
    if (!user || String(user.id) !== String(userId)) {
      user = await loadUserProfile();
    }
    var currentBalance = user ? Number(user.crlm_balance) || 0 : 0;
    var entries = await fetchBalanceLedgerEntries(userId, currentBalance);
    renderBalanceLedgerList(entries);
    if (loadingEl) loadingEl.classList.add('hidden');
  }

  function initBalanceLedgerEvents() {
    if (balanceLedgerInitialized) return;
    balanceLedgerInitialized = true;

    document.addEventListener('click', function (e) {
      if (e.target.closest('#pf-balance-ledger-btn')) {
        e.preventDefault();
        openBalanceLedgerModal();
        return;
      }
      if (e.target.closest('#balance-ledger-close') || e.target.closest('#balance-ledger-modal .td-twitter-modal-overlay')) {
        hideBalanceLedgerModal();
      }
    });
  }

  function isValidWithdrawWalletAddress(address) {
    var value = String(address || '').trim();
    return value.indexOf('0x') === 0 && value.length > 10;
  }

  function hideWithdrawModal() {
    var modal = document.getElementById('withdraw-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function resetWithdrawModalForm() {
    var formWrap = document.getElementById('withdraw-form-wrap');
    var errorEl = document.getElementById('withdraw-error');
    var amountInput = document.getElementById('withdraw-amount-input');
    var walletInput = document.getElementById('withdraw-wallet-input');
    var confirmBtn = document.getElementById('withdraw-confirm-btn');

    if (formWrap) formWrap.classList.remove('hidden');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
    if (amountInput) amountInput.value = '';
    if (walletInput) walletInput.value = '';
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = pfT('pf_withdraw_confirm');
    }
  }

  function updateWithdrawModalHint(settings) {
    var hintEl = document.getElementById('withdraw-hint');
    var minAmount = settings && settings.withdraw_min_amount != null
      ? Number(settings.withdraw_min_amount)
      : WITHDRAW_SETTINGS_DEFAULTS.withdraw_min_amount;
    if (hintEl) {
      hintEl.textContent = pfT('pf_withdraw_hint', { min: formatNumber(minAmount) });
    }
  }

  function applyWithdrawModalI18n() {
    var modal = document.getElementById('withdraw-modal');
    if (!modal) return;

    modal.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (profileTranslations[getLang()][key]) {
        el.textContent = pfT(key);
      }
    });

    var confirmBtn = document.getElementById('withdraw-confirm-btn');
    if (confirmBtn && !withdrawSubmitting) {
      confirmBtn.textContent = pfT('pf_withdraw_confirm');
    }
  }

  async function openWithdrawModal() {
    if (!window.supabase) return;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(pfT('pf_withdraw_err_login'));
      return;
    }

    var modal = document.getElementById('withdraw-modal');
    if (!modal) return;

    resetWithdrawModalForm();
    applyWithdrawModalI18n();

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    var balanceEl = document.getElementById('withdraw-current-balance');
    var confirmBtn = document.getElementById('withdraw-confirm-btn');
    var amountInput = document.getElementById('withdraw-amount-input');
    if (balanceEl) balanceEl.textContent = pfT('pf_ledger_loading');

    var balanceResult = await fetchCurrentUserCrlmBalance();
    var settings = await fetchWithdrawSettings();
    var minAmount = Number(settings.withdraw_min_amount) || WITHDRAW_SETTINGS_DEFAULTS.withdraw_min_amount;

    updateWithdrawModalHint(settings);

    if (!balanceResult.ok) {
      if (balanceEl) balanceEl.textContent = balanceResult.error;
      if (confirmBtn) confirmBtn.disabled = true;
      if (amountInput) {
        amountInput.min = String(minAmount);
        amountInput.removeAttribute('max');
      }
      showWithdrawError(balanceResult.error);
      return;
    }

    if (balanceEl) balanceEl.textContent = formatNumber(balanceResult.balance);
    renderProfileCrlmBalanceDisplay(balanceResult);

    if (amountInput) {
      amountInput.min = String(minAmount);
      amountInput.max = String(balanceResult.balance);
    }
    if (confirmBtn) confirmBtn.disabled = false;
  }

  function showWithdrawError(message) {
    var errorEl = document.getElementById('withdraw-error');
    if (!errorEl) return;
    errorEl.textContent = message || pfT('pf_withdraw_err_failed');
    errorEl.classList.remove('hidden');
  }

  async function submitWithdrawRequest() {
    if (withdrawSubmitting) return;
    if (!window.supabase) return;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(pfT('pf_withdraw_err_login'));
      return;
    }

    if (!WITHDRAW_WORKER_URL || WITHDRAW_WORKER_URL === 'WORKER_URL_PLACEHOLDER') {
      showWithdrawError(pfT('pf_withdraw_err_worker'));
      return;
    }

    var amountInput = document.getElementById('withdraw-amount-input');
    var walletInput = document.getElementById('withdraw-wallet-input');
    var confirmBtn = document.getElementById('withdraw-confirm-btn');
    var amount = Number(amountInput && amountInput.value);
    var walletAddress = walletInput ? String(walletInput.value || '').trim() : '';
    var settings = await fetchWithdrawSettings();
    var minAmount = Number(settings.withdraw_min_amount) || WITHDRAW_SETTINGS_DEFAULTS.withdraw_min_amount;
    var maxPerTx = Number(settings.withdraw_max_per_tx) || WITHDRAW_SETTINGS_DEFAULTS.withdraw_max_per_tx;

    var user = coinrealmCurrentUserProfile;
    var currentBalance = user ? Number(user.crlm_balance) || 0 : 0;
    if (!user || String(user.id) !== String(userId)) {
      user = await loadUserProfile();
      currentBalance = user ? Number(user.crlm_balance) || 0 : 0;
    }

    var errorEl = document.getElementById('withdraw-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      showWithdrawError(pfT('pf_withdraw_err_amount'));
      return;
    }
    if (amount < minAmount) {
      showWithdrawError(pfT('pf_withdraw_err_min', { min: formatNumber(minAmount) }));
      return;
    }
    if (amount > maxPerTx) {
      showWithdrawError(pfT('pf_withdraw_err_max', { max: formatNumber(maxPerTx) }));
      return;
    }
    if (amount > currentBalance) {
      showWithdrawError(pfT('pf_withdraw_err_balance'));
      return;
    }
    if (!isValidWithdrawWalletAddress(walletAddress)) {
      showWithdrawError(pfT('pf_withdraw_err_wallet'));
      return;
    }

    withdrawSubmitting = true;
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = pfT('pf_withdraw_confirming');
    }

    try {
      var withdrawApiUrl = getWithdrawWorkerUrl();
      var requestPayload = {
        user_id: userId,
        amount: amount,
        wallet_address: walletAddress
      };

      console.log('调用提币 Worker，URL：', withdrawApiUrl);
      console.log('提币 Worker 请求方法：POST');
      console.log('提币 Worker 请求头：', { 'Content-Type': 'application/json' });
      console.log('提币 Worker 请求参数：', requestPayload);

      var response = await fetch(withdrawApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(requestPayload),
        mode: 'cors',
        credentials: 'omit'
      });

      console.log('提币 Worker HTTP 状态：', response.status, response.statusText);

      var result = {};
      try {
        result = await response.json();
      } catch (_jsonErr) {
        result = {};
      }

      console.log('提币 Worker 返回：', result);

      if (!response.ok || !result.success) {
        var reason = result.error || result.reason || ('HTTP ' + response.status);
        showWithdrawError(pfT('pf_withdraw_err_failed') + reason);
        return;
      }

      if (user && result.crlm_balance != null) {
        user.crlm_balance = result.crlm_balance;
        coinrealmCurrentUserProfile = user;
      }

      hideWithdrawModal();

      var crlmEl = document.getElementById('pf-crlm-balance');
      if (crlmEl && user) {
        crlmEl.textContent = formatNumber(Number(user.crlm_balance) || 0) + ' CRLM';
      }
      var earningsEl = document.getElementById('pf-stat-earnings');
      if (earningsEl && user) {
        earningsEl.textContent = formatNumber(Number(user.crlm_balance) || 0);
      }

      if (typeof window.coinrealmShowRewardCelebration === 'function') {
        window.coinrealmShowRewardCelebration(amount, {
          description: pfT('pf_withdraw_success_celebration', { amount: formatNumber(amount) }),
          autoCloseMs: 4000
        });
      }
    } catch (err) {
      console.error('提币 Worker 网络请求失败:', err);
      console.error('提币 Worker 请求 URL：', getWithdrawWorkerUrl());
      showWithdrawError(pfT('pf_withdraw_err_failed') + (err && err.message ? err.message : String(err)));
    } finally {
      withdrawSubmitting = false;
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = pfT('pf_withdraw_confirm');
      }
    }
  }

  function initWithdrawEvents() {
    if (withdrawInitialized) return;
    withdrawInitialized = true;

    document.addEventListener('click', function (e) {
      if (e.target.closest('#pf-withdraw-btn')) {
        e.preventDefault();
        openWithdrawModal();
        return;
      }
      if (e.target.closest('#withdraw-cancel-btn') || e.target.closest('#withdraw-modal .td-twitter-modal-overlay')) {
        hideWithdrawModal();
        return;
      }
      if (e.target.closest('#withdraw-confirm-btn')) {
        e.preventDefault();
        submitWithdrawRequest();
      }
    });
  }

  function hideDepositModal() {
    var modal = document.getElementById('deposit-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  function ensureProfileWalletRow() {
    var assetLeft = document.querySelector('.profile-asset-left');
    if (!assetLeft || document.getElementById('pf-wallet-row')) return;

    var row = document.createElement('div');
    row.id = 'pf-wallet-row';
    row.className = 'profile-wallet-row';
    row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap;font-size:13px;';
    row.innerHTML =
      '<span id="pf-wallet-label" class="profile-wallet-label" style="color:#999;" data-i18n="pf_wallet_label">钱包地址</span>' +
      '<span id="pf-wallet-value" class="profile-wallet-value"></span>' +
      '<button type="button" id="pf-wallet-bind-btn" class="profile-deposit-btn profile-wallet-bind-btn hidden" style="padding:4px 12px;font-size:12px;" data-i18n="pf_wallet_bind_btn">去绑定</button>' +
      '<span id="pf-wallet-bound-tag" class="profile-menu-status profile-menu-status-bound hidden" data-i18n="pf_wallet_bound">已绑定</span>';

    var usdtEl = document.getElementById('pf-usdt-value');
    if (usdtEl && usdtEl.parentNode === assetLeft) {
      if (usdtEl.nextSibling) {
        assetLeft.insertBefore(row, usdtEl.nextSibling);
      } else {
        assetLeft.appendChild(row);
      }
    } else {
      assetLeft.appendChild(row);
    }
  }

  function renderProfileWalletRow(user) {
    ensureProfileWalletRow();

    var valueEl = document.getElementById('pf-wallet-value');
    var bindBtn = document.getElementById('pf-wallet-bind-btn');
    var boundTag = document.getElementById('pf-wallet-bound-tag');
    var labelEl = document.getElementById('pf-wallet-label');
    var address = user ? String(user.wallet_address || '').trim() : '';
    var isBound = isValidWithdrawWalletAddress(address);

    if (labelEl) labelEl.textContent = pfT('pf_wallet_label');

    if (isBound) {
      if (valueEl) {
        valueEl.textContent = truncateTxHash(address);
        valueEl.style.color = '#e8e8e8';
      }
      if (bindBtn) bindBtn.classList.add('hidden');
      if (boundTag) {
        boundTag.textContent = pfT('pf_wallet_bound');
        boundTag.classList.remove('hidden');
      }
    } else {
      if (valueEl) {
        valueEl.textContent = pfT('pf_wallet_unbound');
        valueEl.style.color = '#999';
      }
      if (bindBtn) {
        bindBtn.textContent = pfT('pf_wallet_bind_btn');
        bindBtn.classList.remove('hidden');
        bindBtn.disabled = false;
      }
      if (boundTag) boundTag.classList.add('hidden');
    }
  }

  async function bindProfileWalletAddress() {
    if (walletBindSubmitting) return;

    if (!window.ethereum) {
      alert(pfT('pf_wallet_metamask_missing'));
      return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(pfT('pf_withdraw_err_login'));
      return;
    }

    walletBindSubmitting = true;
    var bindBtn = document.getElementById('pf-wallet-bind-btn');
    if (bindBtn) bindBtn.disabled = true;

    try {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      var address = accounts && accounts[0] ? String(accounts[0]).trim() : '';
      if (!isValidWithdrawWalletAddress(address)) {
        alert(pfT('pf_wallet_bind_fail') + '无效地址');
        return;
      }

      address = address.toLowerCase();

      var result = await window.supabase
        .from('users')
        .update({ wallet_address: address })
        .eq('id', userId)
        .select()
        .single();

      if (result.error) {
        alert(pfT('pf_wallet_bind_fail') + (result.error.message || ''));
        return;
      }

      coinrealmCurrentUserProfile = result.data || Object.assign({}, coinrealmCurrentUserProfile || {}, {
        wallet_address: address
      });
      renderProfileWalletRow(coinrealmCurrentUserProfile);
    } catch (bindErr) {
      console.error('绑定钱包失败:', bindErr);
      if (!bindErr || bindErr.code !== 4001) {
        alert(pfT('pf_wallet_bind_fail') + (bindErr && bindErr.message ? bindErr.message : String(bindErr)));
      }
    } finally {
      walletBindSubmitting = false;
      if (bindBtn) bindBtn.disabled = false;
    }
  }

  var depositContentSelectors = [
    '.deposit-address-label',
    '.deposit-qr-wrap',
    '.deposit-address-row',
    '#deposit-hint',
    '#deposit-copy-tip',
    '.deposit-records-section'
  ];

  function ensureDepositBindGate() {
    var panel = document.querySelector('#deposit-modal .deposit-modal-panel');
    if (!panel || document.getElementById('deposit-bind-gate')) return;

    var gate = document.createElement('div');
    gate.id = 'deposit-bind-gate';
    gate.className = 'deposit-bind-gate hidden';
    gate.style.cssText = 'padding:8px 0 4px;';
    gate.innerHTML =
      '<p id="deposit-bind-message" class="deposit-bind-message" style="margin:0 0 16px;line-height:1.6;color:#333;"></p>' +
      '<div class="td-twitter-modal-actions deposit-bind-actions">' +
        '<button type="button" id="deposit-go-bind-btn" class="td-twitter-modal-btn td-twitter-modal-primary"></button>' +
        '<button type="button" id="deposit-bind-cancel-btn" class="td-twitter-modal-btn td-twitter-modal-cancel" data-i18n="pf_withdraw_cancel">取消</button>' +
      '</div>';

    var titleEl = document.getElementById('deposit-modal-title');
    if (titleEl && titleEl.parentNode === panel) {
      panel.insertBefore(gate, titleEl.nextSibling);
    } else {
      panel.insertBefore(gate, panel.firstChild);
    }
  }

  function setDepositModalContentVisible(visible) {
    depositContentSelectors.forEach(function (selector) {
      var el = document.querySelector('#deposit-modal ' + selector);
      if (el) el.classList.toggle('hidden', !visible);
    });

    var gate = document.getElementById('deposit-bind-gate');
    if (gate) gate.classList.toggle('hidden', visible);

    var footerActions = document.querySelector('#deposit-modal .deposit-modal-panel > .td-twitter-modal-actions');
    if (footerActions) footerActions.classList.toggle('hidden', !visible);
  }

  function navigateToProfileForWalletBind() {
    hideDepositModal();
    window.location.hash = 'profile';
    if (typeof handleProfileRoute === 'function') {
      handleProfileRoute();
    } else {
      renderProfilePage();
    }
  }

  function truncateTxHash(hash) {
    var value = String(hash || '');
    if (value.length <= 14) return value;
    return value.slice(0, 8) + '...' + value.slice(-6);
  }

  function formatDepositDateTime(value) {
    if (!value) return '--';
    var d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value).slice(0, 16);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    return y + '-' + m + '-' + day + ' ' + hh + ':' + mm;
  }

  function applyDepositModalI18n() {
    var modal = document.getElementById('deposit-modal');
    if (!modal) return;
    modal.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (profileTranslations[getLang()][key]) {
        el.textContent = pfT(key);
      }
    });
  }

  async function loadDepositRecords(userId) {
    var listEl = document.getElementById('deposit-records-list');
    var loadingEl = document.getElementById('deposit-records-loading');
    var emptyEl = document.getElementById('deposit-records-empty');
    if (!listEl) return;

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    listEl.innerHTML = '';

    if (!window.supabase || !userId) {
      if (loadingEl) loadingEl.classList.add('hidden');
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    try {
      var result = await window.supabase
        .from('deposit_records')
        .select('amount, tx_hash, created_at, status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (loadingEl) loadingEl.classList.add('hidden');

      if (result.error || !result.data || !result.data.length) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
      }

      listEl.innerHTML = result.data.map(function (row) {
        var amount = Number(row.amount) || 0;
        return (
          '<li class="deposit-records-item">' +
            '<div class="deposit-records-time">' + escapeHtml(formatDepositDateTime(row.created_at)) + '</div>' +
            '<div class="deposit-records-amount">+' + escapeHtml(formatNumber(amount)) + ' CRLM</div>' +
            '<div class="deposit-records-hash">' + escapeHtml(truncateTxHash(row.tx_hash)) + '</div>' +
          '</li>'
        );
      }).join('');
    } catch (depositErr) {
      console.warn('加载充币记录失败:', depositErr);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (emptyEl) emptyEl.classList.remove('hidden');
    }
  }

  async function openDepositModal() {
    var userId = await getCurrentUserId();
    if (!userId) {
      alert(pfT('pf_withdraw_err_login'));
      return;
    }

    var user = coinrealmCurrentUserProfile;
    if (!user || String(user.id) !== String(userId)) {
      user = await loadUserProfile();
    }
    if (user) coinrealmCurrentUserProfile = user;

    var modal = document.getElementById('deposit-modal');
    if (!modal) return;

    ensureDepositBindGate();
    applyDepositModalI18n();

    var walletAddress = user ? String(user.wallet_address || '').trim() : '';
    if (!isValidWithdrawWalletAddress(walletAddress)) {
      var bindMessage = document.getElementById('deposit-bind-message');
      var goBindBtn = document.getElementById('deposit-go-bind-btn');
      var cancelBtn = document.getElementById('deposit-bind-cancel-btn');
      if (bindMessage) bindMessage.textContent = pfT('pf_deposit_bind_required');
      if (goBindBtn) goBindBtn.textContent = pfT('pf_deposit_go_bind');
      if (cancelBtn) cancelBtn.textContent = pfT('pf_withdraw_cancel');
      setDepositModalContentVisible(false);
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      return;
    }

    setDepositModalContentVisible(true);

    var depositAddress = await fetchDepositWalletAddress();
    var addressEl = document.getElementById('deposit-wallet-address');
    var qrEl = document.getElementById('deposit-qr-image');
    var copyTip = document.getElementById('deposit-copy-tip');

    if (copyTip) copyTip.classList.add('hidden');

    if (!depositAddress) {
      if (addressEl) addressEl.textContent = pfT('pf_deposit_address_missing');
      if (qrEl) qrEl.removeAttribute('src');
    } else {
      if (addressEl) addressEl.textContent = depositAddress;
      if (qrEl) {
        qrEl.src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(depositAddress);
      }
    }

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    await loadDepositRecords(userId);
  }

  async function copyDepositAddress() {
    var addressEl = document.getElementById('deposit-wallet-address');
    var copyTip = document.getElementById('deposit-copy-tip');
    var address = addressEl ? String(addressEl.textContent || '').trim() : '';
    if (!address || address.indexOf('0x') !== 0) {
      alert(pfT('pf_deposit_address_missing'));
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(address);
      } else {
        var textarea = document.createElement('textarea');
        textarea.value = address;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (copyTip) {
        copyTip.textContent = pfT('pf_deposit_copy_ok');
        copyTip.classList.remove('hidden');
      }
    } catch (copyErr) {
      console.warn('复制充币地址失败:', copyErr);
      alert(pfT('pf_deposit_copy_fail'));
    }
  }

  function initDepositEvents() {
    if (depositInitialized) return;
    depositInitialized = true;

    document.addEventListener('click', function (e) {
      if (e.target.closest('#pf-deposit-btn')) {
        e.preventDefault();
        openDepositModal();
        return;
      }
      if (e.target.closest('#pf-wallet-bind-btn')) {
        e.preventDefault();
        bindProfileWalletAddress();
        return;
      }
      if (e.target.closest('#deposit-go-bind-btn')) {
        e.preventDefault();
        navigateToProfileForWalletBind();
        return;
      }
      if (e.target.closest('#deposit-bind-cancel-btn')) {
        hideDepositModal();
        return;
      }
      if (e.target.closest('#deposit-copy-btn')) {
        e.preventDefault();
        copyDepositAddress();
        return;
      }
      if (e.target.closest('#deposit-close-btn') || e.target.closest('#deposit-modal .td-twitter-modal-overlay')) {
        hideDepositModal();
        renderProfilePage();
      }
    });
  }

  function applyProfileI18n() {
    document.querySelectorAll('#profile-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (profileTranslations[getLang()][key]) {
        el.textContent = pfT(key);
      }
    });
  }

  async function renderProfilePage() {
    await refreshGoogleAvatarCache();
    var user = await loadUserProfile();
    if (!user) return;

    coinrealmCurrentUserProfile = user;

    if (typeof window.coinrealmRefreshTelegramBindUi === 'function') {
      window.coinrealmRefreshTelegramBindUi();
    }

    if (typeof window.coinrealmRefreshDiscordBindUi === 'function') {
      window.coinrealmRefreshDiscordBindUi();
    }

    var displayUsername = user.username || displayNameFromEmail(user.email);
    var usdtBalance = Number(user.usdt_balance) || 0;
    var reputationScore = user.reputation_score != null ? user.reputation_score : 0;
    var levelNum = user.level != null ? user.level : 0;

    var usernameEl = document.getElementById('pf-username');
    if (usernameEl) usernameEl.textContent = displayUsername;

    var levelBadge = document.getElementById('pf-level-badge');
    if (levelBadge) {
      var levelLabel = getProfileLevelLabel(levelNum);
      levelBadge.textContent = levelLabel
        ? pfT('pf_level_badge', { level: levelNum, label: levelLabel })
        : 'Lv.' + levelNum;
    }

    var reputationEl = document.getElementById('pf-reputation');
    if (reputationEl) {
      reputationEl.textContent = pfT('pf_completion_rate', { rate: reputationScore });
    }

    var balanceResult = await fetchCurrentUserCrlmBalance();
    renderProfileCrlmBalanceDisplay(balanceResult);

    var usdtEl = document.getElementById('pf-usdt-value');
    if (usdtEl) {
      usdtEl.textContent = pfT('pf_usdt_approx', { amount: formatNumber(usdtBalance) });
    }

    renderProfileWalletRow(user);

    var progressEl = document.getElementById('pf-stat-progress');
    var completedEl = document.getElementById('pf-stat-completed');
    var progressCount = 0;
    var completedCount = 0;

    if (window.supabase && user.id) {
      try {
        var progressResult = await window.supabase
          .from('submissions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .in('status', ['pending', 'submitted', 'verifying']);
        if (!progressResult.error && progressResult.count != null) {
          progressCount = progressResult.count;
        }
      } catch (progressErr) {
        console.warn('个人中心：进行中任务统计失败', progressErr);
      }

      try {
        var completedResult = await window.supabase
          .from('submissions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'approved');
        if (!completedResult.error && completedResult.count != null) {
          completedCount = completedResult.count;
        }
      } catch (completedErr) {
        console.warn('个人中心：已完成任务统计失败', completedErr);
      }
    }

    if (progressEl) progressEl.textContent = String(progressCount);
    if (completedEl) completedEl.textContent = String(completedCount);

    var avatarEl = document.getElementById('pf-avatar');
    if (avatarEl) {
      applyAvatarToElement(avatarEl, user, 'cr-avatar-img', {
        googleAvatarUrl: coinrealmGoogleAvatarUrl
      });
    }

    var editBtn = document.getElementById('pf-avatar-edit-btn');
    if (editBtn) editBtn.classList.remove('hidden');

    applyProfileI18n();

    if (typeof window.coinrealmRefreshTwitterBindUi === 'function') {
      await window.coinrealmRefreshTwitterBindUi();
    }
  }

  function renderAvatarPickerGrid() {
    var grid = document.getElementById('avatar-picker-grid');
    if (!grid) return;

    grid.innerHTML = getPresetAvatarPaths().map(function (path, index) {
      var selectedClass = path === selectedPresetAvatarPath ? ' avatar-picker-item-selected' : '';
      return (
        '<button type="button" class="avatar-picker-item' + selectedClass + '" data-avatar-path="' + escapeHtml(path) + '" aria-label="Avatar ' + (index + 1) + '">' +
          '<img src="' + escapeHtml(path) + '" alt="">' +
        '</button>'
      );
    }).join('');
  }

  function openAvatarPicker() {
    selectedPresetAvatarPath = '';
    if (coinrealmCurrentUserProfile && coinrealmCurrentUserProfile.avatar_url) {
      var paths = getPresetAvatarPaths();
      if (paths.indexOf(coinrealmCurrentUserProfile.avatar_url) >= 0) {
        selectedPresetAvatarPath = coinrealmCurrentUserProfile.avatar_url;
      }
    }

    renderAvatarPickerGrid();
    var modal = document.getElementById('avatar-picker-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    applyProfileI18n();
  }

  function closeAvatarPicker() {
    var modal = document.getElementById('avatar-picker-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  async function confirmAvatarSelection() {
    if (!selectedPresetAvatarPath) {
      alert(pfT('pf_avatar_pick_required'));
      return;
    }
    if (!window.supabase) return;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert('请先登录');
      return;
    }

    var result = await window.supabase
      .from('users')
      .update({ avatar_url: selectedPresetAvatarPath })
      .eq('id', userId);

    if (result.error) {
      alert(pfT('pf_avatar_save_fail') + result.error.message);
      return;
    }

    if (coinrealmCurrentUserProfile) {
      coinrealmCurrentUserProfile.avatar_url = selectedPresetAvatarPath;
    } else {
      coinrealmCurrentUserProfile = { id: userId, avatar_url: selectedPresetAvatarPath };
    }

    closeAvatarPicker();
    var avatarEl = document.getElementById('pf-avatar');
    if (avatarEl) {
      applyAvatarToElement(avatarEl, coinrealmCurrentUserProfile, 'cr-avatar-img', {
        googleAvatarUrl: coinrealmGoogleAvatarUrl
      });
    }
    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      window.coinrealmRefreshAuthArea();
    }
    if (typeof applyFiltersAndSort === 'function') {
      applyFiltersAndSort();
    }
    if (typeof renderOfficialRecommendSection === 'function') {
      renderOfficialRecommendSection();
    }
  }

  function initAvatarPickerEvents() {
    if (avatarPickerInitialized) return;
    avatarPickerInitialized = true;

    var editBtn = document.getElementById('pf-avatar-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openAvatarPicker();
      });
    }

    var grid = document.getElementById('avatar-picker-grid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var item = e.target.closest('.avatar-picker-item');
        if (!item) return;
        selectedPresetAvatarPath = item.getAttribute('data-avatar-path') || '';
        renderAvatarPickerGrid();
      });
    }

    var cancelBtn = document.getElementById('avatar-picker-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closeAvatarPicker);

    var confirmBtn = document.getElementById('avatar-picker-confirm');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmAvatarSelection);

    var overlay = document.querySelector('#avatar-picker-modal .avatar-picker-overlay');
    if (overlay) overlay.addEventListener('click', closeAvatarPicker);
  }

  function initProfileEvents() {
    if (profileInitialized) return;
    profileInitialized = true;
    initAvatarPickerEvents();
    initBalanceLedgerEvents();
    initWithdrawEvents();
    initDepositEvents();

    document.querySelectorAll('#profile-page .profile-menu-item[data-route]').forEach(function (item) {
      item.addEventListener('click', function (e) {
        var route = item.getAttribute('data-route');
        if (route) {
          e.preventDefault();
          window.location.hash = route;
        }
      });
    });
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      profileInitialized = false;
      avatarPickerInitialized = false;
      balanceLedgerInitialized = false;
      withdrawInitialized = false;
      depositInitialized = false;
    }
  }

  function handleProfileRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var profilePage = document.getElementById('profile-page');

    if (profilePage) {
      if (route === 'profile') {
        profilePage.classList.remove('hidden');
        initProfileEvents();
        renderProfilePage();
      } else {
        profilePage.classList.add('hidden');
      }
    }
  }

  window.addEventListener('hashchange', handleProfileRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleProfileRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleProfileRoute, 0);
    });
  }
})();

// ==========================================
// 8b. 我的任务页 (#my-tasks)
// ==========================================
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
    expired: []
  };
  var verifyPollTimer = null;
  var VERIFY_POLL_MS = 30000;
  var myTasksUserId = null;

  var myTasksTranslations = {
    zh: {
      mt_page_title: '我的任务',
      mt_tab_active: '进行中',
      mt_tab_completed: '已完成',
      mt_tab_expired: '已失效',
      mt_login_required: '请先登录查看任务',
      mt_loading: '加载中...',
      mt_btn_home: '去任务大厅',
      mt_empty_active: '暂无进行中的任务，去任务大厅看看吧~',
      mt_empty_completed: '暂无已完成的任务，继续加油！',
      mt_empty_expired: '暂无已失效的任务',
      mt_status_pending: '待提交',
      mt_status_submitted: '已提交',
      mt_status_reviewing: '审核中',
      mt_status_verifying: '验证中',
      mt_status_approved: '已通过',
      mt_status_rejected: '未通过',
      mt_label_deadline: '截止时间',
      mt_label_completed: '完成时间',
      mt_label_reason: '失效原因',
      mt_reason_rejected: '已驳回',
      mt_reason_expired: '已过期',
      mt_reason_full: '已满员',
      mt_reason_cancelled: '已取消',
      mt_load_fail: '加载失败：'
    },
    en: {
      mt_page_title: 'My Tasks',
      mt_tab_active: 'In Progress',
      mt_tab_completed: 'Completed',
      mt_tab_expired: 'Expired',
      mt_login_required: 'Please sign in to view your tasks',
      mt_loading: 'Loading...',
      mt_btn_home: 'Go to Task Hall',
      mt_empty_active: 'No tasks in progress. Check the task hall!',
      mt_empty_completed: 'No completed tasks yet. Keep going!',
      mt_empty_expired: 'No expired tasks',
      mt_status_pending: 'Pending submission',
      mt_status_submitted: 'Submitted',
      mt_status_reviewing: 'Under review',
      mt_status_verifying: 'Verifying',
      mt_status_approved: 'Approved',
      mt_status_rejected: 'Rejected',
      mt_label_deadline: 'Deadline',
      mt_label_completed: 'Completed',
      mt_label_reason: 'Reason',
      mt_reason_rejected: 'Rejected',
      mt_reason_expired: 'Expired',
      mt_reason_full: 'Full',
      mt_reason_cancelled: 'Cancelled',
      mt_load_fail: 'Load failed: '
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
    if (submission.status === 'rejected') return mtT('mt_reason_rejected');
    if (task.status === 'cancelled') return mtT('mt_reason_cancelled');
    var maxP = task.max_participants != null ? Number(task.max_participants) : null;
    var currentP = Number(task.current_participants) || 0;
    if (task.status === 'completed') return mtT('mt_reason_full');
    if (maxP != null && maxP > 0 && currentP >= maxP) return mtT('mt_reason_full');
    return mtT('mt_reason_expired');
  }

  function isExpiredSubmission(submission, task) {
    if (submission.status === 'rejected') return true;
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
    var expired = [];

    items.forEach(function (item) {
      var sub = item.submission;
      var task = item.task;

      if (sub.status === 'approved') {
        completed.push(item);
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

      if (sub.status === 'verifying' || sub.status === 'pending' || sub.status === 'submitted') {
        active.push(item);
      }
    });

    return { active: active, completed: completed, expired: expired };
  }

  async function fetchMyTasksData(userId) {
    if (!window.supabase) return { active: [], completed: [], expired: [] };

    var result = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, submitted_at, reviewed_at, review_comment, tasks(*)')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (result.error) {
      throw result.error;
    }

    return categorizeMyTasks(normalizeSubmissionRows(result.data));
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
    } else {
      if (submission.status === 'rejected') {
        statusHtml = '<span class="my-task-status my-task-status-rejected">' + escapeHtml(mtT('mt_status_rejected')) + '</span>';
      } else {
        statusHtml = '<span class="my-task-status my-task-status-expired">' + escapeHtml(item.expiredReason || mtT('mt_reason_expired')) + '</span>';
      }
      var reasonText = item.expiredReason || mtT('mt_reason_expired');
      if (submission.status === 'rejected' && submission.review_comment) {
        reasonText = submission.review_comment;
      }
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
          '</div>' +
          '<div class="my-task-reward">' + reward + '</div>' +
          metaHtml +
        '</div>' +
      '</article>'
    );
  }

  function getEmptyMessageKey(tab) {
    if (tab === 'completed') return 'mt_empty_completed';
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
      myTasksData = await fetchMyTasksData(userId);
      renderMyTasksList();
      await verifyActiveTwitterSubmissions();
      startVerifyingPoll();
    } catch (err) {
      console.warn('加载我的任务失败', err);
      alert(mtT('mt_load_fail') + (err && err.message ? err.message : String(err)));
      myTasksData = { active: [], completed: [], expired: [] };
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
  }

  function initMyTasksEvents() {
    if (myTasksInitialized) return;
    myTasksInitialized = true;

    document.querySelectorAll('#my-tasks-page .my-tasks-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchMyTasksTab(btn.getAttribute('data-tab') || 'active');
      });
    });

    var listEl = document.getElementById('mt-task-list');
    if (listEl) {
      listEl.addEventListener('click', function (e) {
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

// ==========================================
// 8c. 发布管理页 (#publish-management)
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var publishMgmtInitialized = false;
  var publishMgmtLoading = false;
  var publishedTasks = [];
  var pendingDeleteTask = null;
  var deleteInProgress = false;
  var pendingPinTask = null;
  var selectedPinPackage = null;
  var pendingBoostTask = null;
  var pendingSlotsTask = null;
  var pmActionInProgress = false;
  var PM_PLATFORM_COMMISSION = 0.15;
  var PM_DEPOSIT_RATE = 0.2;

  var publishMgmtTranslations = {
    zh: {
      pm_page_title: '发布管理',
      pm_login_required: '请先登录查看发布任务',
      pm_loading: '加载中...',
      pm_empty_text: '你还没有发布过任务',
      pm_btn_create: '去发布任务',
      pm_btn_delete: '删除',
      pm_btn_cancel: '取消',
      pm_btn_confirm: '确认',
      pm_btn_confirm_delete: '确定删除',
      pm_btn_confirm_pin: '确认置顶',
      pm_btn_pause: '暂停',
      pm_btn_resume: '恢复',
      pm_btn_pin: '置顶',
      pm_btn_unpin: '取消置顶',
      pm_btn_boost: '加价',
      pm_btn_add_slots: '增加名额',
      pm_delete_confirm: '确定要删除该任务吗？剩余资金将退回你的账户。',
      pm_pause_confirm: '确定要暂停该任务吗？暂停后用户将无法继续领取。',
      pm_resume_confirm: '确定要恢复该任务吗？恢复后用户可继续领取。',
      pm_pin_title: '置顶任务',
      pm_pin_desc: '选择置顶套餐，支付 CRLM 后任务将展示在首页置顶区。',
      pm_pin_1d: '1天',
      pm_pin_7d: '7天',
      pm_pin_30d: '30天',
      pm_boost_title: '追加奖励',
      pm_boost_desc: '输入要追加的奖励金额，系统将额外扣除 20% 作为押金。',
      pm_boost_ph: '请输入追加金额',
      pm_boost_hint: '需扣除：{amount} {unit}（含 20% 押金）',
      pm_slots_title: '增加名额',
      pm_slots_desc: '输入要增加的名额数量（≥1）。',
      pm_slots_ph: '请输入增加名额',
      pm_delete_success_refund: '任务已删除，{unit} 已退回你的账户。退款金额：{amount}（按剩余名额计算，已扣除15%佣金）',
      pm_delete_success_full: '任务已删除，该任务已满员，无需退款。',
      pm_delete_success_simple: '任务已删除。',
      pm_delete_fail: '操作失败，请稍后重试',
      pm_action_fail: '操作失败，请稍后重试',
      pm_action_success_pause: '任务已暂停。',
      pm_action_success_resume: '任务已恢复。',
      pm_action_success_pin: '置顶成功，任务将在首页置顶区展示。',
      pm_action_success_unpin: '已取消置顶。',
      pm_action_success_boost: '成功追加 {amount} {unit} 奖励，任务总奖励已更新。',
      pm_action_success_slots: '成功增加 {added} 个名额，当前总名额为 {total}。',
      pm_alert_invalid_amount: '请输入有效的追加金额',
      pm_alert_invalid_slots: '请输入有效的名额数量（≥1）',
      pm_alert_balance: '余额不足，请先充值',
      pm_alert_select_pin: '请选择置顶套餐',
      pm_alert_slots_exceed: '增加名额后单人奖励不能为 0',
      pm_label_deadline: '截止时间',
      pm_label_slots: '剩余名额',
      pm_status_active: '进行中',
      pm_status_paused: '已暂停',
      pm_status_completed: '已完成',
      pm_status_cancelled: '已取消',
      pm_status_promoted: '已置顶 · 剩余 {days} 天',
      pm_pending_review: '待审核 {count} 条',
      pm_load_fail: '加载失败：'
    },
    en: {
      pm_page_title: 'Publish Management',
      pm_login_required: 'Please sign in to view your published tasks',
      pm_loading: 'Loading...',
      pm_empty_text: 'You have not published any tasks yet',
      pm_btn_create: 'Create a Task',
      pm_btn_delete: 'Delete',
      pm_btn_cancel: 'Cancel',
      pm_btn_confirm: 'Confirm',
      pm_btn_confirm_delete: 'Confirm Delete',
      pm_btn_confirm_pin: 'Confirm Pin',
      pm_btn_pause: 'Pause',
      pm_btn_resume: 'Resume',
      pm_btn_pin: 'Pin',
      pm_btn_unpin: 'Unpin',
      pm_btn_boost: 'Boost Reward',
      pm_btn_add_slots: 'Add Slots',
      pm_delete_confirm: 'Delete this task? Remaining funds will be refunded to your account.',
      pm_pause_confirm: 'Pause this task? Users will not be able to claim it while paused.',
      pm_resume_confirm: 'Resume this task? Users will be able to claim it again.',
      pm_pin_title: 'Pin Task',
      pm_pin_desc: 'Choose a pin package. Pay CRLM to feature this task on the homepage.',
      pm_pin_1d: '1 Day',
      pm_pin_7d: '7 Days',
      pm_pin_30d: '30 Days',
      pm_boost_title: 'Boost Reward',
      pm_boost_desc: 'Enter the additional reward amount. An extra 20% deposit will be charged.',
      pm_boost_ph: 'Enter additional amount',
      pm_boost_hint: 'Total charge: {amount} {unit} (includes 20% deposit)',
      pm_slots_title: 'Add Slots',
      pm_slots_desc: 'Enter how many slots to add (≥1).',
      pm_slots_ph: 'Enter slots to add',
      pm_delete_success_refund: 'Task deleted. {amount} {unit} refunded to your account (remaining slots, 15% commission deducted).',
      pm_delete_success_full: 'Task deleted. The task was full; no refund needed.',
      pm_delete_success_simple: 'Task deleted.',
      pm_delete_fail: 'Operation failed. Please try again later.',
      pm_action_fail: 'Operation failed. Please try again later.',
      pm_action_success_pause: 'Task paused.',
      pm_action_success_resume: 'Task resumed.',
      pm_action_success_pin: 'Task pinned successfully.',
      pm_action_success_unpin: 'Pin removed.',
      pm_action_success_boost: 'Added {amount} {unit}. Total reward updated.',
      pm_action_success_slots: 'Added {added} slots. Total slots: {total}.',
      pm_alert_invalid_amount: 'Please enter a valid amount',
      pm_alert_invalid_slots: 'Please enter a valid slot count (≥1)',
      pm_alert_balance: 'Insufficient balance',
      pm_alert_select_pin: 'Please select a pin package',
      pm_alert_slots_exceed: 'Per-slot reward cannot be zero after adding slots',
      pm_label_deadline: 'Deadline',
      pm_label_slots: 'Slots left',
      pm_status_active: 'Active',
      pm_status_paused: 'Paused',
      pm_status_completed: 'Completed',
      pm_status_cancelled: 'Cancelled',
      pm_status_promoted: 'Pinned · {days} days left',
      pm_pending_review: '{count} pending review',
      pm_load_fail: 'Load failed: '
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function pmT(key, vars) {
    var dict = publishMgmtTranslations[getLang()];
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

  function formatPmDeadline(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    if (getLang() === 'zh') {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function isPastDeadline(deadline) {
    if (!deadline) return false;
    var d = new Date(deadline);
    if (Number.isNaN(d.getTime())) return false;
    var end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return Date.now() > end.getTime();
  }

  function canDeleteExpiredTask(task) {
    if (!task) return false;
    return (task.status || 'active') === 'active' && isPastDeadline(task.deadline);
  }

  function formatPmAmount(num) {
    var n = parseFloat(num) || 0;
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  }

  function calculateDeleteRefund(task) {
    var maxParticipantsRaw = task.max_participants;
    if (maxParticipantsRaw == null || maxParticipantsRaw === '') {
      return { netRefund: 0, remainingSlots: 0, noSlotsLimit: true, rewardType: task.reward_type || 'CRLM' };
    }

    var maxParticipants = parseFloat(maxParticipantsRaw);
    var currentParticipants = parseFloat(task.current_participants) || 0;
    if (isNaN(maxParticipants) || maxParticipants <= 0) {
      return { netRefund: 0, remainingSlots: 0, noSlotsLimit: true, rewardType: task.reward_type || 'CRLM' };
    }

    var remainingSlots = Math.max(0, maxParticipants - currentParticipants);
    if (remainingSlots <= 0) {
      return { netRefund: 0, remainingSlots: 0, isFull: true, rewardType: task.reward_type || 'CRLM' };
    }

    var rewardAmount = parseFloat(task.reward_amount) || 0;
    var perSlotReward = rewardAmount / maxParticipants;
    var refundAmount = perSlotReward * remainingSlots;
    var netRefund = refundAmount * (1 - PM_PLATFORM_COMMISSION);

    return {
      netRefund: netRefund,
      remainingSlots: remainingSlots,
      rewardType: task.reward_type || 'CRLM'
    };
  }

  function formatPmReward(task) {
    var amount = Number(task && task.reward_amount) || 0;
    var unit = (task && task.reward_type) || 'CRLM';
    return amount.toLocaleString('en-US') + ' ' + unit;
  }

  function getTaskStatusMeta(status) {
    if (status === 'active') {
      return { labelKey: 'pm_status_active', className: 'pm-task-status-active' };
    }
    if (status === 'paused') {
      return { labelKey: 'pm_status_paused', className: 'pm-task-status-paused' };
    }
    if (status === 'completed') {
      return { labelKey: 'pm_status_completed', className: 'pm-task-status-completed' };
    }
    if (status === 'cancelled') {
      return { labelKey: 'pm_status_cancelled', className: 'pm-task-status-cancelled' };
    }
    return { labelKey: 'pm_status_active', className: 'pm-task-status-active' };
  }

  function getPromotionDaysLeft(task) {
    if (!task || !task.is_promoted || !task.promotion_expire_at) return 0;
    var expire = new Date(task.promotion_expire_at);
    if (Number.isNaN(expire.getTime())) return 0;
    var diff = expire.getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  }

  function isTaskPromoted(task) {
    return !!(task && task.is_promoted && getPromotionDaysLeft(task) > 0);
  }

  function isSubmissionPendingReview(submission) {
    if (!submission) return false;
    if (submission.status === 'pending') return true;
    if (submission.status === 'submitted') return true;
    return false;
  }

  async function fetchPendingReviewCounts(taskIds) {
    var counts = {};
    if (!taskIds.length || !window.supabase) return counts;

    var result = await window.supabase
      .from('submissions')
      .select('id, task_id, status, submitted_at')
      .in('task_id', taskIds);

    if (result.error) return counts;

    (result.data || []).forEach(function (submission) {
      if (!isSubmissionPendingReview(submission)) return;
      counts[submission.task_id] = (counts[submission.task_id] || 0) + 1;
    });

    return counts;
  }

  async function fetchPublishedTasks(userId) {
    if (!window.supabase) return [];

    var tasksResult = await window.supabase
      .from('tasks')
      .select('*')
      .eq('publisher_id', userId)
      .order('created_at', { ascending: false });

    if (tasksResult.error) throw tasksResult.error;

    var tasks = (tasksResult.data || []).filter(function (task) {
      return task.status !== 'cancelled';
    });
    if (!tasks.length) return [];

    var taskIds = tasks.map(function (task) { return task.id; });
    var pendingCounts = await fetchPendingReviewCounts(taskIds);

    return tasks.map(function (task) {
      return {
        task: task,
        pendingReviewCount: pendingCounts[task.id] || 0
      };
    });
  }

  function buildPublishMgmtActionsHtml(task, item) {
    var taskId = escapeHtml(task.id);
    var status = task.status || 'active';
    var parts = [];

    if (item.pendingReviewCount > 0) {
      parts.push(
        '<button type="button" class="pm-action-btn pm-action-link pm-pending-link" data-task-id="' + taskId + '">' +
          '<span class="publish-mgmt-pending-dot" aria-hidden="true"></span>' +
          '<span>' + escapeHtml(pmT('pm_pending_review', { count: item.pendingReviewCount })) + '</span>' +
        '</button>'
      );
    }

    if (status === 'active') {
      parts.push('<button type="button" class="pm-action-btn pm-action-pause" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_pause')) + '</button>');
    } else if (status === 'paused') {
      parts.push('<button type="button" class="pm-action-btn pm-action-resume" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_resume')) + '</button>');
    }

    if (isTaskPromoted(task)) {
      parts.push('<button type="button" class="pm-action-btn pm-action-unpin" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_unpin')) + '</button>');
    } else {
      parts.push('<button type="button" class="pm-action-btn pm-action-pin" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_pin')) + '</button>');
    }

    if (status === 'active' || status === 'paused') {
      parts.push('<button type="button" class="pm-action-btn pm-action-boost" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_boost')) + '</button>');
    }

    if ((status === 'active' || status === 'paused') && task.max_participants != null && task.max_participants !== '') {
      parts.push('<button type="button" class="pm-action-btn pm-action-slots" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_add_slots')) + '</button>');
    }

    if (canDeleteExpiredTask(task)) {
      parts.push('<button type="button" class="pm-action-btn pm-action-delete publish-mgmt-delete-btn" data-task-id="' + taskId + '">' + escapeHtml(pmT('pm_btn_delete')) + '</button>');
    }

    if (!parts.length) return '';
    return '<div class="publish-mgmt-card-actions">' + parts.join('') + '</div>';
  }

  function buildPublishMgmtCardHtml(item) {
    var task = item.task;
    var title = escapeHtml(task.title || '');
    var category = getTaskField(task, ['type', 'task_type', 'category'], 'other');
    var typeLabelKey = getTypeLabelKey(task);
    var reward = escapeHtml(formatPmReward(task));
    var taskId = escapeHtml(task.id);
    var statusMeta = getTaskStatusMeta(task.status || 'active');
    var maxParticipants = task.max_participants != null ? Number(task.max_participants) : null;
    var currentParticipants = Number(task.current_participants) || 0;
    var slotsLeft = maxParticipants != null ? Math.max(0, maxParticipants - currentParticipants) : null;
    var slotsText = maxParticipants != null
      ? slotsLeft + '/' + maxParticipants
      : String(currentParticipants);

    var imageUrlRaw = getTaskField(task, ['image_url'], '');
    var imageUrl = imageUrlRaw ? resolveTaskImageUrl(imageUrlRaw) : '';
    var cardClass = imageUrl ? ' publish-mgmt-card-with-image' : '';
    var imageBlock = imageUrl
      ? '<div class="publish-mgmt-card-media"><img class="publish-mgmt-card-image" src="' + escapeHtml(imageUrl) + '" alt=""' + taskImageErrorAttr() + '></div>'
      : '';

    var promotedBadge = isTaskPromoted(task)
      ? '<span class="publish-mgmt-task-status pm-task-status-promoted">' +
          escapeHtml(pmT('pm_status_promoted', { days: getPromotionDaysLeft(task) })) +
        '</span>'
      : '';

    var cardClickableClass = item.pendingReviewCount > 0 ? ' publish-mgmt-card-has-pending' : '';
    var actionsHtml = buildPublishMgmtActionsHtml(task, item);

    var bodyHtml =
      '<div class="publish-mgmt-card-body">' +
        '<h3 class="publish-mgmt-card-title">' + title + '</h3>' +
        '<div class="publish-mgmt-card-tags">' +
          '<span class="type-label label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
          '<span class="publish-mgmt-task-status ' + statusMeta.className + '">' + escapeHtml(pmT(statusMeta.labelKey)) + '</span>' +
          promotedBadge +
        '</div>' +
        '<div class="publish-mgmt-reward">' + reward + '</div>' +
        '<p class="publish-mgmt-meta">' + escapeHtml(pmT('pm_label_slots')) + '：' + escapeHtml(slotsText) + '</p>' +
        '<p class="publish-mgmt-meta">' + escapeHtml(pmT('pm_label_deadline')) + '：' + escapeHtml(formatPmDeadline(task.deadline)) + '</p>' +
        actionsHtml +
      '</div>';

    return (
      '<article class="publish-mgmt-card' + cardClass + cardClickableClass + '" data-task-id="' + taskId + '"' +
        (item.pendingReviewCount > 0 ? ' tabindex="0"' : '') + '>' +
        imageBlock +
        bodyHtml +
      '</article>'
    );
  }

  function renderPublishMgmtList() {
    var listEl = document.getElementById('pm-task-list');
    var emptyEl = document.getElementById('pm-empty-state');
    if (!listEl || !emptyEl) return;

    if (!publishedTasks.length) {
      listEl.innerHTML = '';
      listEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    listEl.innerHTML = publishedTasks.map(buildPublishMgmtCardHtml).join('');

    if (typeof applyLanguageStrings === 'function') {
      applyLanguageStrings();
    }
  }

  function setPublishMgmtLoading(loading) {
    publishMgmtLoading = loading;
    var loadingEl = document.getElementById('pm-loading');
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
  }

  function applyPublishMgmtI18n() {
    document.querySelectorAll('#publish-management-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (publishMgmtTranslations[getLang()][key]) {
        el.textContent = pmT(key);
      }
    });
    document.querySelectorAll('#publish-management-page [data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (publishMgmtTranslations[getLang()][key]) {
        el.setAttribute('placeholder', pmT(key));
      }
    });
  }

  async function loadAndRenderPublishMgmt() {
    var loginEl = document.getElementById('pm-login-required');
    var mainEl = document.getElementById('pm-main-content');
    var userId = await getCurrentUserId();

    applyPublishMgmtI18n();

    if (!userId) {
      if (loginEl) loginEl.classList.remove('hidden');
      if (mainEl) mainEl.classList.add('hidden');
      return;
    }

    if (loginEl) loginEl.classList.add('hidden');
    if (mainEl) mainEl.classList.remove('hidden');

    setPublishMgmtLoading(true);
    try {
      publishedTasks = await fetchPublishedTasks(userId);
      renderPublishMgmtList();
    } catch (err) {
      console.warn('加载发布管理失败', err);
      alert(pmT('pm_load_fail') + (err && err.message ? err.message : String(err)));
      publishedTasks = [];
      renderPublishMgmtList();
    } finally {
      setPublishMgmtLoading(false);
    }
  }

  function navigateToReviewForTask(taskId) {
    if (!taskId) return;
    window.location.hash = 'review?taskId=' + encodeURIComponent(taskId);
  }

  function showDeleteModalError(message) {
    var errorEl = document.getElementById('pm-delete-error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function clearDeleteModalError() {
    var errorEl = document.getElementById('pm-delete-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  function openDeleteModal(task) {
    pendingDeleteTask = task;
    clearDeleteModalError();
    var modal = document.getElementById('pm-delete-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    applyPublishMgmtI18n();
  }

  function closeDeleteModal() {
    pendingDeleteTask = null;
    clearDeleteModalError();
    var modal = document.getElementById('pm-delete-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    var confirmBtn = document.getElementById('pm-delete-confirm');
    if (confirmBtn) confirmBtn.disabled = false;
  }

  async function confirmDeleteExpiredTask() {
    if (deleteInProgress || !pendingDeleteTask || !window.supabase) return;

    var task = pendingDeleteTask;
    var confirmBtn = document.getElementById('pm-delete-confirm');
    deleteInProgress = true;
    if (confirmBtn) confirmBtn.disabled = true;
    clearDeleteModalError();

    try {
      var userId = await getCurrentUserId();
      if (!userId) {
        showDeleteModalError(pmT('pm_delete_fail'));
        return;
      }

      var taskResult = await window.supabase
        .from('tasks')
        .select('*')
        .eq('id', task.id)
        .eq('publisher_id', userId)
        .maybeSingle();

      if (taskResult.error || !taskResult.data) {
        showDeleteModalError(pmT('pm_delete_fail'));
        return;
      }

      var freshTask = taskResult.data;
      if (!canDeleteExpiredTask(freshTask)) {
        showDeleteModalError(pmT('pm_delete_fail'));
        return;
      }

      var refundInfo = calculateDeleteRefund(freshTask);
      var rewardType = refundInfo.rewardType || 'CRLM';
      var netRefund = parseFloat(refundInfo.netRefund) || 0;
      var successMessage = pmT('pm_delete_success_simple');

      if (refundInfo.noSlotsLimit) {
        successMessage = pmT('pm_delete_success_simple');
      } else if (refundInfo.isFull || refundInfo.remainingSlots <= 0) {
        successMessage = pmT('pm_delete_success_full');
      } else if (netRefund > 0) {
        successMessage = pmT('pm_delete_success_refund', {
          unit: rewardType,
          amount: formatPmAmount(netRefund)
        });
      }

      if (netRefund > 0) {
        var userResult = await window.supabase
          .from('users')
          .select('crlm_balance, usdt_balance')
          .eq('id', userId)
          .single();

        if (userResult.error || !userResult.data) {
          showDeleteModalError(pmT('pm_delete_fail'));
          return;
        }

        var balanceField = rewardType === 'USDT' ? 'usdt_balance' : 'crlm_balance';
        var currentBalance = parseFloat(userResult.data[balanceField]) || 0;
        var balanceUpdate = {};
        balanceUpdate[balanceField] = currentBalance + netRefund;

        var balanceResult = await window.supabase
          .from('users')
          .update(balanceUpdate)
          .eq('id', userId);

        if (balanceResult.error) {
          showDeleteModalError(pmT('pm_delete_fail'));
          return;
        }
      }

      var taskUpdateResult = await window.supabase
        .from('tasks')
        .update({ status: 'cancelled' })
        .eq('id', freshTask.id)
        .eq('publisher_id', userId);

      if (taskUpdateResult.error) {
        showDeleteModalError(pmT('pm_delete_fail'));
        return;
      }

      closeDeleteModal();
      alert(successMessage);
      await loadAndRenderPublishMgmt();
    } finally {
      deleteInProgress = false;
      if (confirmBtn && pendingDeleteTask) {
        confirmBtn.disabled = false;
      }
    }
  }

  function findPublishedTaskEntry(taskId) {
    return publishedTasks.find(function (entry) {
      return entry.task && String(entry.task.id) === String(taskId);
    });
  }

  async function fetchOwnedTask(taskId, userId) {
    if (!window.supabase || !taskId || !userId) return null;
    var result = await window.supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('publisher_id', userId)
      .maybeSingle();
    if (result.error || !result.data) return null;
    return result.data;
  }

  function showPmModalError(errorElId, message) {
    var errorEl = document.getElementById(errorElId);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function clearPmModalError(errorElId) {
    var errorEl = document.getElementById(errorElId);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  function closeAllPmModals() {
    closeDeleteModal();
    closePinModal();
    closeBoostModal();
    closeSlotsModal();
  }

  async function pauseTask(taskId) {
    if (pmActionInProgress || !window.confirm(pmT('pm_pause_confirm'))) return;

    pmActionInProgress = true;
    try {
      var userId = await getCurrentUserId();
      if (!userId) {
        alert(pmT('pm_login_required'));
        return;
      }

      var task = await fetchOwnedTask(taskId, userId);
      if (!task || (task.status || 'active') !== 'active') {
        alert(pmT('pm_action_fail'));
        return;
      }

      var updateResult = await window.supabase
        .from('tasks')
        .update({ status: 'paused' })
        .eq('id', taskId)
        .eq('publisher_id', userId);

      if (updateResult.error) {
        alert(pmT('pm_action_fail'));
        return;
      }

      alert(pmT('pm_action_success_pause'));
      await loadAndRenderPublishMgmt();
    } finally {
      pmActionInProgress = false;
    }
  }

  async function resumeTask(taskId) {
    if (pmActionInProgress || !window.confirm(pmT('pm_resume_confirm'))) return;

    pmActionInProgress = true;
    try {
      var userId = await getCurrentUserId();
      if (!userId) {
        alert(pmT('pm_login_required'));
        return;
      }

      var task = await fetchOwnedTask(taskId, userId);
      if (!task || task.status !== 'paused') {
        alert(pmT('pm_action_fail'));
        return;
      }

      var updateResult = await window.supabase
        .from('tasks')
        .update({ status: 'active' })
        .eq('id', taskId)
        .eq('publisher_id', userId);

      if (updateResult.error) {
        alert(pmT('pm_action_fail'));
        return;
      }

      alert(pmT('pm_action_success_resume'));
      await loadAndRenderPublishMgmt();
    } finally {
      pmActionInProgress = false;
    }
  }

  function openPinModal(task) {
    pendingPinTask = task;
    selectedPinPackage = null;
    clearPmModalError('pm-pin-error');

    document.querySelectorAll('#pm-pin-modal .pm-pin-package-btn').forEach(function (btn) {
      btn.classList.remove('selected');
    });

    var modal = document.getElementById('pm-pin-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    applyPublishMgmtI18n();
  }

  function closePinModal() {
    pendingPinTask = null;
    selectedPinPackage = null;
    clearPmModalError('pm-pin-error');
    var modal = document.getElementById('pm-pin-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    var confirmBtn = document.getElementById('pm-pin-confirm');
    if (confirmBtn) confirmBtn.disabled = false;
  }

  async function confirmPinTask() {
    if (pmActionInProgress || !pendingPinTask || !window.supabase) return;
    if (!selectedPinPackage) {
      showPmModalError('pm-pin-error', pmT('pm_alert_select_pin'));
      return;
    }

    pmActionInProgress = true;
    var confirmBtn = document.getElementById('pm-pin-confirm');
    if (confirmBtn) confirmBtn.disabled = true;
    clearPmModalError('pm-pin-error');

    try {
      var userId = await getCurrentUserId();
      if (!userId) {
        showPmModalError('pm-pin-error', pmT('pm_login_required'));
        return;
      }

      var task = await fetchOwnedTask(pendingPinTask.id, userId);
      if (!task) {
        showPmModalError('pm-pin-error', pmT('pm_action_fail'));
        return;
      }

      var price = Number(selectedPinPackage.price) || 0;
      var days = Number(selectedPinPackage.days) || 0;
      if (price <= 0 || days <= 0) {
        showPmModalError('pm-pin-error', pmT('pm_alert_select_pin'));
        return;
      }

      var userResult = await window.supabase
        .from('users')
        .select('crlm_balance')
        .eq('id', userId)
        .single();

      if (userResult.error || !userResult.data) {
        showPmModalError('pm-pin-error', pmT('pm_action_fail'));
        return;
      }

      var currentBalance = parseFloat(userResult.data.crlm_balance) || 0;
      if (currentBalance < price) {
        showPmModalError('pm-pin-error', pmT('pm_alert_balance'));
        return;
      }

      var expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + days);

      var balanceResult = await window.supabase
        .from('users')
        .update({ crlm_balance: currentBalance - price })
        .eq('id', userId);

      if (balanceResult.error) {
        showPmModalError('pm-pin-error', pmT('pm_action_fail'));
        return;
      }

      var taskUpdateResult = await window.supabase
        .from('tasks')
        .update({
          is_promoted: true,
          promotion_expire_at: expireAt.toISOString()
        })
        .eq('id', task.id)
        .eq('publisher_id', userId);

      if (taskUpdateResult.error) {
        await window.supabase
          .from('users')
          .update({ crlm_balance: currentBalance })
          .eq('id', userId);
        showPmModalError('pm-pin-error', pmT('pm_action_fail'));
        return;
      }

      closePinModal();
      alert(pmT('pm_action_success_pin'));
      await loadAndRenderPublishMgmt();
    } finally {
      pmActionInProgress = false;
      if (confirmBtn && pendingPinTask) {
        confirmBtn.disabled = false;
      }
    }
  }

  async function unpinTask(taskId) {
    if (pmActionInProgress) return;

    pmActionInProgress = true;
    try {
      var userId = await getCurrentUserId();
      if (!userId) {
        alert(pmT('pm_login_required'));
        return;
      }

      var task = await fetchOwnedTask(taskId, userId);
      if (!task) {
        alert(pmT('pm_action_fail'));
        return;
      }

      var updateResult = await window.supabase
        .from('tasks')
        .update({
          is_promoted: false,
          promotion_expire_at: null
        })
        .eq('id', taskId)
        .eq('publisher_id', userId);

      if (updateResult.error) {
        alert(pmT('pm_action_fail'));
        return;
      }

      alert(pmT('pm_action_success_unpin'));
      await loadAndRenderPublishMgmt();
    } finally {
      pmActionInProgress = false;
    }
  }

  function openBoostModal(task) {
    pendingBoostTask = task;
    clearPmModalError('pm-boost-error');
    var input = document.getElementById('pm-boost-input');
    var hint = document.getElementById('pm-boost-hint');
    if (input) input.value = '';
    if (hint) hint.textContent = '';
    var modal = document.getElementById('pm-boost-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    applyPublishMgmtI18n();
  }

  function closeBoostModal() {
    pendingBoostTask = null;
    clearPmModalError('pm-boost-error');
    var modal = document.getElementById('pm-boost-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    var confirmBtn = document.getElementById('pm-boost-confirm');
    if (confirmBtn) confirmBtn.disabled = false;
  }

  function updateBoostHint() {
    var hint = document.getElementById('pm-boost-hint');
    var input = document.getElementById('pm-boost-input');
    if (!hint || !input || !pendingBoostTask) return;

    var appendAmount = parseFloat(input.value);
    if (!appendAmount || appendAmount <= 0) {
      hint.textContent = '';
      return;
    }

    var unit = pendingBoostTask.reward_type || 'CRLM';
    var totalCharge = appendAmount * (1 + PM_DEPOSIT_RATE);
    hint.textContent = pmT('pm_boost_hint', {
      amount: formatPmAmount(totalCharge),
      unit: unit
    });
  }

  async function confirmBoostTask() {
    if (pmActionInProgress || !pendingBoostTask || !window.supabase) return;

    pmActionInProgress = true;
    var confirmBtn = document.getElementById('pm-boost-confirm');
    if (confirmBtn) confirmBtn.disabled = true;
    clearPmModalError('pm-boost-error');

    try {
      var input = document.getElementById('pm-boost-input');
      var appendAmount = parseFloat(input && input.value);
      if (!appendAmount || appendAmount <= 0) {
        showPmModalError('pm-boost-error', pmT('pm_alert_invalid_amount'));
        return;
      }

      var userId = await getCurrentUserId();
      if (!userId) {
        showPmModalError('pm-boost-error', pmT('pm_login_required'));
        return;
      }

      var task = await fetchOwnedTask(pendingBoostTask.id, userId);
      if (!task) {
        showPmModalError('pm-boost-error', pmT('pm_action_fail'));
        return;
      }

      var status = task.status || 'active';
      if (status !== 'active' && status !== 'paused') {
        showPmModalError('pm-boost-error', pmT('pm_action_fail'));
        return;
      }

      var rewardType = task.reward_type || 'CRLM';
      var balanceField = rewardType === 'USDT' ? 'usdt_balance' : 'crlm_balance';
      var additionalDeposit = appendAmount * PM_DEPOSIT_RATE;
      var totalCharge = appendAmount + additionalDeposit;

      var userResult = await window.supabase
        .from('users')
        .select('crlm_balance, usdt_balance')
        .eq('id', userId)
        .single();

      if (userResult.error || !userResult.data) {
        showPmModalError('pm-boost-error', pmT('pm_action_fail'));
        return;
      }

      var currentBalance = parseFloat(userResult.data[balanceField]) || 0;
      if (currentBalance < totalCharge) {
        showPmModalError('pm-boost-error', pmT('pm_alert_balance'));
        return;
      }

      var oldReward = parseFloat(task.reward_amount) || 0;
      var oldDeposit = parseFloat(task.deposit_amount) || 0;
      var newReward = oldReward + appendAmount;
      var newDeposit = oldDeposit + additionalDeposit;
      var balanceUpdate = {};
      balanceUpdate[balanceField] = currentBalance - totalCharge;

      var balanceResult = await window.supabase
        .from('users')
        .update(balanceUpdate)
        .eq('id', userId);

      if (balanceResult.error) {
        showPmModalError('pm-boost-error', pmT('pm_action_fail'));
        return;
      }

      var taskUpdatePayload = {
        reward_amount: newReward,
        deposit_amount: newDeposit
      };
      if (task.stake_amount != null) {
        taskUpdatePayload.stake_amount = newReward + newDeposit;
      }

      var taskUpdateResult = await window.supabase
        .from('tasks')
        .update(taskUpdatePayload)
        .eq('id', task.id)
        .eq('publisher_id', userId);

      if (taskUpdateResult.error) {
        var rollbackUpdate = {};
        rollbackUpdate[balanceField] = currentBalance;
        await window.supabase.from('users').update(rollbackUpdate).eq('id', userId);
        showPmModalError('pm-boost-error', pmT('pm_action_fail'));
        return;
      }

      closeBoostModal();
      alert(pmT('pm_action_success_boost', {
        amount: formatPmAmount(appendAmount),
        unit: rewardType
      }));
      await loadAndRenderPublishMgmt();
    } finally {
      pmActionInProgress = false;
      if (confirmBtn && pendingBoostTask) {
        confirmBtn.disabled = false;
      }
    }
  }

  function openSlotsModal(task) {
    pendingSlotsTask = task;
    clearPmModalError('pm-slots-error');
    var input = document.getElementById('pm-slots-input');
    if (input) input.value = '';
    var modal = document.getElementById('pm-slots-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
    applyPublishMgmtI18n();
  }

  function closeSlotsModal() {
    pendingSlotsTask = null;
    clearPmModalError('pm-slots-error');
    var modal = document.getElementById('pm-slots-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    var confirmBtn = document.getElementById('pm-slots-confirm');
    if (confirmBtn) confirmBtn.disabled = false;
  }

  async function confirmAddSlots() {
    if (pmActionInProgress || !pendingSlotsTask || !window.supabase) return;

    pmActionInProgress = true;
    var confirmBtn = document.getElementById('pm-slots-confirm');
    if (confirmBtn) confirmBtn.disabled = true;
    clearPmModalError('pm-slots-error');

    try {
      var input = document.getElementById('pm-slots-input');
      var addedSlots = parseInt(input && input.value, 10);
      if (!addedSlots || addedSlots < 1) {
        showPmModalError('pm-slots-error', pmT('pm_alert_invalid_slots'));
        return;
      }

      var userId = await getCurrentUserId();
      if (!userId) {
        showPmModalError('pm-slots-error', pmT('pm_login_required'));
        return;
      }

      var task = await fetchOwnedTask(pendingSlotsTask.id, userId);
      if (!task) {
        showPmModalError('pm-slots-error', pmT('pm_action_fail'));
        return;
      }

      var status = task.status || 'active';
      if (status !== 'active' && status !== 'paused') {
        showPmModalError('pm-slots-error', pmT('pm_action_fail'));
        return;
      }

      if (task.max_participants == null || task.max_participants === '') {
        showPmModalError('pm-slots-error', pmT('pm_action_fail'));
        return;
      }

      var oldMax = parseInt(task.max_participants, 10);
      var rewardAmount = parseFloat(task.reward_amount) || 0;
      var newMax = oldMax + addedSlots;
      var perSlot = rewardAmount / newMax;

      if (!oldMax || newMax <= 0 || perSlot <= 0) {
        showPmModalError('pm-slots-error', pmT('pm_alert_slots_exceed'));
        return;
      }

      var updateResult = await window.supabase
        .from('tasks')
        .update({ max_participants: newMax })
        .eq('id', task.id)
        .eq('publisher_id', userId);

      if (updateResult.error) {
        showPmModalError('pm-slots-error', pmT('pm_action_fail'));
        return;
      }

      closeSlotsModal();
      alert(pmT('pm_action_success_slots', {
        added: addedSlots,
        total: newMax
      }));
      await loadAndRenderPublishMgmt();
    } finally {
      pmActionInProgress = false;
      if (confirmBtn && pendingSlotsTask) {
        confirmBtn.disabled = false;
      }
    }
  }

  function initPublishMgmtEvents() {
    if (publishMgmtInitialized) return;
    publishMgmtInitialized = true;

    var listEl = document.getElementById('pm-task-list');
    if (listEl) {
      listEl.addEventListener('click', function (e) {
        if (e.target.closest('.publish-mgmt-card-actions')) {
          var actionBtn = e.target.closest('.pm-action-btn');
          if (!actionBtn) return;

          e.stopPropagation();
          var taskId = actionBtn.getAttribute('data-task-id');
          var entry = findPublishedTaskEntry(taskId);
          if (!entry || !entry.task) return;

          if (actionBtn.classList.contains('pm-pending-link')) {
            navigateToReviewForTask(taskId);
            return;
          }
          if (actionBtn.classList.contains('pm-action-pause')) {
            pauseTask(taskId);
            return;
          }
          if (actionBtn.classList.contains('pm-action-resume')) {
            resumeTask(taskId);
            return;
          }
          if (actionBtn.classList.contains('pm-action-pin')) {
            openPinModal(entry.task);
            return;
          }
          if (actionBtn.classList.contains('pm-action-unpin')) {
            unpinTask(taskId);
            return;
          }
          if (actionBtn.classList.contains('pm-action-boost')) {
            openBoostModal(entry.task);
            return;
          }
          if (actionBtn.classList.contains('pm-action-slots')) {
            openSlotsModal(entry.task);
            return;
          }
          if (actionBtn.classList.contains('publish-mgmt-delete-btn')) {
            openDeleteModal(entry.task);
          }
          return;
        }

        var pendingLink = e.target.closest('.pm-pending-link');
        if (pendingLink) {
          navigateToReviewForTask(pendingLink.getAttribute('data-task-id'));
          return;
        }

        var card = e.target.closest('.publish-mgmt-card-has-pending');
        if (card && listEl.contains(card)) {
          navigateToReviewForTask(card.getAttribute('data-task-id'));
        }
      });

      listEl.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest('.publish-mgmt-card-actions')) return;
        var card = e.target.closest('.publish-mgmt-card-has-pending');
        if (!card || !listEl.contains(card)) return;
        e.preventDefault();
        navigateToReviewForTask(card.getAttribute('data-task-id'));
      });
    }

    var deleteCancelBtn = document.getElementById('pm-delete-cancel');
    var deleteConfirmBtn = document.getElementById('pm-delete-confirm');
    var deleteModal = document.getElementById('pm-delete-modal');
    if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteModal);
    if (deleteConfirmBtn) deleteConfirmBtn.addEventListener('click', confirmDeleteExpiredTask);
    if (deleteModal) {
      var deleteOverlay = deleteModal.querySelector('.pm-delete-modal-overlay');
      if (deleteOverlay) deleteOverlay.addEventListener('click', closeDeleteModal);
    }

    var pinCancelBtn = document.getElementById('pm-pin-cancel');
    var pinConfirmBtn = document.getElementById('pm-pin-confirm');
    var pinModal = document.getElementById('pm-pin-modal');
    if (pinCancelBtn) pinCancelBtn.addEventListener('click', closePinModal);
    if (pinConfirmBtn) pinConfirmBtn.addEventListener('click', confirmPinTask);
    if (pinModal) {
      var pinOverlay = pinModal.querySelector('.pm-action-modal-overlay');
      if (pinOverlay) pinOverlay.addEventListener('click', closePinModal);
      pinModal.querySelectorAll('.pm-pin-package-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          pinModal.querySelectorAll('.pm-pin-package-btn').forEach(function (b) {
            b.classList.remove('selected');
          });
          btn.classList.add('selected');
          selectedPinPackage = {
            days: btn.getAttribute('data-days'),
            price: btn.getAttribute('data-price')
          };
        });
      });
    }

    var boostCancelBtn = document.getElementById('pm-boost-cancel');
    var boostConfirmBtn = document.getElementById('pm-boost-confirm');
    var boostInput = document.getElementById('pm-boost-input');
    var boostModal = document.getElementById('pm-boost-modal');
    if (boostCancelBtn) boostCancelBtn.addEventListener('click', closeBoostModal);
    if (boostConfirmBtn) boostConfirmBtn.addEventListener('click', confirmBoostTask);
    if (boostInput) boostInput.addEventListener('input', updateBoostHint);
    if (boostModal) {
      var boostOverlay = boostModal.querySelector('.pm-action-modal-overlay');
      if (boostOverlay) boostOverlay.addEventListener('click', closeBoostModal);
    }

    var slotsCancelBtn = document.getElementById('pm-slots-cancel');
    var slotsConfirmBtn = document.getElementById('pm-slots-confirm');
    var slotsModal = document.getElementById('pm-slots-modal');
    if (slotsCancelBtn) slotsCancelBtn.addEventListener('click', closeSlotsModal);
    if (slotsConfirmBtn) slotsConfirmBtn.addEventListener('click', confirmAddSlots);
    if (slotsModal) {
      var slotsOverlay = slotsModal.querySelector('.pm-action-modal-overlay');
      if (slotsOverlay) slotsOverlay.addEventListener('click', closeSlotsModal);
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      publishMgmtInitialized = false;
      pendingDeleteTask = null;
      pendingPinTask = null;
      selectedPinPackage = null;
      pendingBoostTask = null;
      pendingSlotsTask = null;
      deleteInProgress = false;
      pmActionInProgress = false;
    }
  }

  async function handlePublishMgmtRoute() {
    restoreAppContentIfNeeded();

    var routeBase = getRouteBase();
    var page = document.getElementById('publish-management-page');
    if (!page) return;

    if (routeBase === 'publish-management') {
      page.classList.remove('hidden');
      initPublishMgmtEvents();
      await loadAndRenderPublishMgmt();
    } else {
      page.classList.add('hidden');
      closeAllPmModals();
    }
  }

  window.addEventListener('hashchange', handlePublishMgmtRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handlePublishMgmtRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handlePublishMgmtRoute, 0);
    });
  }
})();

// ==========================================
// 9. 我的分红页 (#dividends) — 任务卡 #007
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var dividendsDataLoaded = false;
  var dividendsDataLoading = false;
  var cachedDividendsData = null;

  var dividendsTranslations = {
    zh: {
      dv_page_title: '我的分红',
      dv_countdown_label: '距离下次分红还有',
      dv_countdown_note: '每周结算一次',
      dv_countdown_value: '{days}天 {hours}小时',
      dv_weight_title: '我的分红权重',
      dv_holdings_label: '持币量',
      dv_invites_label: '有效邀请人数',
      dv_total_weight_label: '综合权重',
      dv_bonus: '{bonus} 加成',
      dv_invites_unit: '{count} 人',
      dv_last_title: '上次分红',
      dv_history_title: '分红记录',
      dv_source_commission: '任务佣金分红',
      dv_source_holding: '持币权重分红',
      dv_amount_plus: '+{amount} CRLM',
      dv_login_required: '请先登录查看分红',
      dv_no_dividend: '暂无分红',
      dv_no_history: '暂无分红记录',
      dv_loading: '加载中...'
    },
    en: {
      dv_page_title: 'My Dividends',
      dv_countdown_label: 'Time until next dividend',
      dv_countdown_note: 'Settled weekly',
      dv_countdown_value: '{days}d {hours}h',
      dv_weight_title: 'My Dividend Weight',
      dv_holdings_label: 'Token Holdings',
      dv_invites_label: 'Valid Invites',
      dv_total_weight_label: 'Total Weight',
      dv_bonus: '{bonus} bonus',
      dv_invites_unit: '{count} people',
      dv_last_title: 'Last Dividend',
      dv_history_title: 'Dividend History',
      dv_source_commission: 'Task commission dividend',
      dv_source_holding: 'Holding weight dividend',
      dv_amount_plus: '+{amount} CRLM',
      dv_login_required: 'Please sign in to view dividends',
      dv_no_dividend: 'No dividends yet',
      dv_no_history: 'No dividend records yet',
      dv_loading: 'Loading...'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function dvT(key, vars) {
    var dict = dividendsTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function applyDividendsI18n() {
    document.querySelectorAll('#dividends-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dividendsTranslations[getLang()][key]) {
        el.textContent = dvT(key);
      }
    });
  }

  function formatBonusMultiplier(value) {
    if (!value) return '0x';
    return (value % 1 === 0 ? String(value) : value.toFixed(1)) + 'x';
  }

  function calcHoldingsBonus(amount) {
    if (amount >= 100000) return 2;
    if (amount >= 10000) return 1.5;
    if (amount >= 1000) return 1;
    return 0;
  }

  function calcInvitesBonus(count) {
    if (count >= 50) return 2;
    if (count >= 20) return 1.5;
    if (count >= 5) return 1;
    return 0;
  }

  function getCountdownToSunday() {
    var now = new Date();
    var daysUntil = (7 - now.getDay()) % 7;
    if (daysUntil === 0) {
      daysUntil = 7;
    }

    var target = new Date(now);
    target.setDate(now.getDate() + daysUntil);
    target.setHours(0, 0, 0, 0);

    var diffMs = Math.max(0, target.getTime() - now.getTime());
    return {
      days: Math.floor(diffMs / (24 * 60 * 60 * 1000)),
      hours: Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    };
  }

  function getDividendField(row, names, fallback) {
    for (var i = 0; i < names.length; i++) {
      if (row[names[i]] != null && row[names[i]] !== '') {
        return row[names[i]];
      }
    }
    return fallback;
  }

  function formatDividendDate(row) {
    var raw = getDividendField(row, ['dividend_date', 'created_at', 'date'], '');
    if (!raw) return '—';
    return String(raw).slice(0, 10);
  }

  function formatDividendAmount(row) {
    return Number(getDividendField(row, ['amount', 'reward_amount', 'dividend_amount'], 0)) || 0;
  }

  function formatDividendSource(row) {
    var source = getDividendField(row, ['source', 'source_type', 'type'], '');
    var normalized = String(source || '').toLowerCase();
    if (normalized.indexOf('commission') >= 0 || normalized.indexOf('佣金') >= 0) {
      return dvT('dv_source_commission');
    }
    if (normalized.indexOf('holding') >= 0 || normalized.indexOf('持币') >= 0) {
      return dvT('dv_source_holding');
    }
    return source || '—';
  }

  function mapDividendHistory(rows) {
    return (rows || []).map(function (row) {
      return {
        date: formatDividendDate(row),
        amount: formatDividendAmount(row),
        sourceText: formatDividendSource(row)
      };
    });
  }

  function loadDividendsData() {
    if (dividendsDataLoaded || dividendsDataLoading) {
      return Promise.resolve(cachedDividendsData);
    }

    dividendsDataLoading = true;

    return getCurrentUserId()
      .then(function (userId) {
        if (!userId || !window.supabase) {
          return { loggedIn: false };
        }

        return window.supabase
          .from('users')
          .select('crlm_balance, invite_count')
          .eq('id', userId)
          .single()
          .then(function (userResult) {
            if (userResult.error || !userResult.data) {
              return { loggedIn: false };
            }

            return window.supabase
              .from('dividends')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .then(function (historyResult) {
                if (historyResult.error) {
                  console.warn('加载分红记录失败:', historyResult.error);
                }

                return {
                  loggedIn: true,
                  holdingsAmount: Number(userResult.data.crlm_balance) || 0,
                  invitesCount: Number(userResult.data.invite_count) || 0,
                  history: mapDividendHistory(historyResult.error ? [] : historyResult.data)
                };
              });
          });
      })
      .catch(function (err) {
        console.warn('加载分红页数据失败:', err);
        return { loggedIn: false };
      })
      .then(function (data) {
        cachedDividendsData = data;
        dividendsDataLoaded = true;
        dividendsDataLoading = false;
        return data;
      });
  }

  function renderCountdown() {
    var countdownEl = document.getElementById('dv-countdown-value');
    if (!countdownEl) return;

    var countdown = getCountdownToSunday();
    countdownEl.textContent = dvT('dv_countdown_value', {
      days: countdown.days,
      hours: countdown.hours
    });
  }

  function renderLoginRequiredState() {
    var loginMsg = dvT('dv_login_required');

    var holdingsAmount = document.getElementById('dv-holdings-amount');
    var holdingsBonus = document.getElementById('dv-holdings-bonus');
    var invitesCount = document.getElementById('dv-invites-count');
    var invitesBonus = document.getElementById('dv-invites-bonus');
    var totalWeight = document.getElementById('dv-total-weight');
    var lastAmount = document.getElementById('dv-last-amount');
    var lastDate = document.getElementById('dv-last-date');
    var lastSource = document.getElementById('dv-last-source');
    var historyList = document.getElementById('dv-history-list');

    if (holdingsAmount) holdingsAmount.textContent = loginMsg;
    if (holdingsBonus) holdingsBonus.textContent = '';
    if (invitesCount) invitesCount.textContent = '';
    if (invitesBonus) invitesBonus.textContent = '';
    if (totalWeight) totalWeight.textContent = '—';
    if (lastAmount) lastAmount.textContent = loginMsg;
    if (lastDate) lastDate.textContent = '';
    if (lastSource) lastSource.textContent = '';
    if (historyList) {
      historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + loginMsg + '</span></li>';
    }
  }

  function renderLoadingState() {
    var loadingMsg = dvT('dv_loading');
    var holdingsAmount = document.getElementById('dv-holdings-amount');
    var lastAmount = document.getElementById('dv-last-amount');
    var historyList = document.getElementById('dv-history-list');

    if (holdingsAmount) holdingsAmount.textContent = loadingMsg;
    if (lastAmount) lastAmount.textContent = loadingMsg;
    if (historyList) {
      historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + loadingMsg + '</span></li>';
    }
  }

  function renderDividendsContent(data) {
    if (!data || !data.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var holdingsBonusValue = calcHoldingsBonus(data.holdingsAmount);
    var invitesBonusValue = calcInvitesBonus(data.invitesCount);
    var totalWeightValue = holdingsBonusValue + invitesBonusValue;

    var holdingsAmountEl = document.getElementById('dv-holdings-amount');
    if (holdingsAmountEl) {
      holdingsAmountEl.textContent = formatNumber(data.holdingsAmount) + ' CRLM';
    }

    var holdingsBonusEl = document.getElementById('dv-holdings-bonus');
    if (holdingsBonusEl) {
      holdingsBonusEl.textContent = dvT('dv_bonus', { bonus: formatBonusMultiplier(holdingsBonusValue) });
    }

    var invitesCountEl = document.getElementById('dv-invites-count');
    if (invitesCountEl) {
      invitesCountEl.textContent = dvT('dv_invites_unit', { count: data.invitesCount });
    }

    var invitesBonusEl = document.getElementById('dv-invites-bonus');
    if (invitesBonusEl) {
      invitesBonusEl.textContent = dvT('dv_bonus', { bonus: formatBonusMultiplier(invitesBonusValue) });
    }

    var totalWeightEl = document.getElementById('dv-total-weight');
    if (totalWeightEl) {
      totalWeightEl.textContent = totalWeightValue.toFixed(1) + 'x';
    }

    var lastAmountEl = document.getElementById('dv-last-amount');
    var lastDateEl = document.getElementById('dv-last-date');
    var lastSourceEl = document.getElementById('dv-last-source');
    var historyList = document.getElementById('dv-history-list');
    var lastRecord = data.history.length ? data.history[0] : null;

    if (lastRecord) {
      if (lastAmountEl) {
        lastAmountEl.textContent = dvT('dv_amount_plus', { amount: formatNumber(lastRecord.amount) });
      }
      if (lastDateEl) lastDateEl.textContent = lastRecord.date;
      if (lastSourceEl) lastSourceEl.textContent = lastRecord.sourceText;
    } else {
      if (lastAmountEl) lastAmountEl.textContent = dvT('dv_no_dividend');
      if (lastDateEl) lastDateEl.textContent = '';
      if (lastSourceEl) lastSourceEl.textContent = '';
    }

    if (historyList) {
      if (!data.history.length) {
        historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + dvT('dv_no_history') + '</span></li>';
      } else {
        historyList.innerHTML = data.history.map(function (item) {
          return (
            '<li class="dividends-history-item">' +
              '<span class="dividends-history-date">' + item.date + '</span>' +
              '<span class="dividends-history-amount">' + dvT('dv_amount_plus', { amount: formatNumber(item.amount) }) + '</span>' +
              '<span class="dividends-history-source">' + item.sourceText + '</span>' +
            '</li>'
          );
        }).join('');
      }
    }
  }

  function renderDividendsPage() {
    applyDividendsI18n();
    renderCountdown();

    if (dividendsDataLoading && !dividendsDataLoaded) {
      renderLoadingState();
      return;
    }

    if (cachedDividendsData) {
      renderDividendsContent(cachedDividendsData);
      return;
    }

    if (!dividendsDataLoaded) {
      renderLoadingState();
      loadDividendsData().then(function (data) {
        renderDividendsContent(data);
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
    }
  }

  function handleDividendsRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var dividendsPage = document.getElementById('dividends-page');

    if (dividendsPage) {
      if (route === 'dividends') {
        dividendsPage.classList.remove('hidden');
        renderDividendsPage();
      } else {
        dividendsPage.classList.add('hidden');
        dividendsDataLoaded = false;
        dividendsDataLoading = false;
        cachedDividendsData = null;
      }
    }
  }

  window.addEventListener('hashchange', handleDividendsRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleDividendsRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleDividendsRoute, 0);
    });
  }
})();

// ==========================================
// 10. 兑换市场页 (#exchange) — 任务卡 #008
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var exchangeMode = 'buy';
  var exchangeInitialized = false;
  var exchangeDataLoaded = false;
  var exchangeDataLoading = false;
  var activeOrders = [];
  var matchedTrades = [];
  var exchangeActionInProgress = false;

  var exchangeTranslations = {
    zh: {
      ex_page_title: '兑换市场',
      ex_tab_buy: '买入 CRLM',
      ex_tab_sell: '卖出 CRLM',
      ex_col_price: '价格（CRLM/USDT）',
      ex_col_qty: '数量（CRLM）',
      ex_col_total: '总价（USDT）',
      ex_col_action: '操作',
      ex_no_more: '暂无更多挂单',
      ex_form_title: '我要下单',
      ex_ph_price: '价格',
      ex_ph_qty: '数量',
      ex_total_usdt: '{amount} USDT',
      ex_btn_confirm: '确认挂单',
      ex_btn_buy: '买入',
      ex_btn_sell: '卖出',
      ex_trades_title: '最新成交',
      ex_alert_trade: '交易成功！',
      ex_alert_required: '请填写价格和数量',
      ex_alert_order: '挂单成功！',
      ex_alert_login: '请先登录后再操作',
      ex_alert_self_trade: '不能与自己挂单交易',
      ex_alert_usdt_insufficient: 'USDT 余额不足',
      ex_alert_crlm_insufficient: 'CRLM 余额不足',
      ex_alert_order_fail: '挂单失败：',
      ex_alert_trade_fail: '交易失败：',
      ex_trade_qty: '{qty} CRLM',
      ex_no_trades: '暂无成交记录',
      ex_loading: '加载中...'
    },
    en: {
      ex_page_title: 'Exchange Market',
      ex_tab_buy: 'Buy CRLM',
      ex_tab_sell: 'Sell CRLM',
      ex_col_price: 'Price (CRLM/USDT)',
      ex_col_qty: 'Quantity (CRLM)',
      ex_col_total: 'Total (USDT)',
      ex_col_action: 'Action',
      ex_no_more: 'No more orders',
      ex_form_title: 'Place Order',
      ex_ph_price: 'Price',
      ex_ph_qty: 'Quantity',
      ex_total_usdt: '{amount} USDT',
      ex_btn_confirm: 'Confirm Order',
      ex_btn_buy: 'Buy',
      ex_btn_sell: 'Sell',
      ex_trades_title: 'Recent Trades',
      ex_alert_trade: 'Trade successful!',
      ex_alert_required: 'Please enter price and quantity',
      ex_alert_order: 'Order placed successfully!',
      ex_alert_login: 'Please sign in first',
      ex_alert_self_trade: 'You cannot trade with your own order',
      ex_alert_usdt_insufficient: 'Insufficient USDT balance',
      ex_alert_crlm_insufficient: 'Insufficient CRLM balance',
      ex_alert_order_fail: 'Order failed: ',
      ex_alert_trade_fail: 'Trade failed: ',
      ex_trade_qty: '{qty} CRLM',
      ex_no_trades: 'No trades yet',
      ex_loading: 'Loading...'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function exT(key, vars) {
    var dict = exchangeTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function applyExchangeI18n() {
    document.querySelectorAll('#exchange-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (exchangeTranslations[getLang()][key]) {
        el.textContent = exT(key);
      }
    });

    document.querySelectorAll('#exchange-page [data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (exchangeTranslations[getLang()][key]) {
        el.setAttribute('placeholder', exT(key));
      }
    });
  }

  function formatOrderTime(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso).slice(0, 16);
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var hours = String(d.getHours()).padStart(2, '0');
    var minutes = String(d.getMinutes()).padStart(2, '0');
    return month + '-' + day + ' ' + hours + ':' + minutes;
  }

  function getVisibleOrders() {
    var orderTypeFilter = exchangeMode === 'buy' ? 'sell' : 'buy';
    return activeOrders.filter(function (order) {
      return order.order_type === orderTypeFilter;
    });
  }

  function loadExchangeData() {
    if (exchangeDataLoading) {
      return Promise.resolve();
    }

    if (!window.supabase) {
      activeOrders = [];
      matchedTrades = [];
      exchangeDataLoaded = true;
      return Promise.resolve();
    }

    exchangeDataLoading = true;

    return Promise.all([
      window.supabase
        .from('exchange_orders')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false }),
      window.supabase
        .from('exchange_orders')
        .select('*')
        .eq('status', 'matched')
        .order('created_at', { ascending: false })
        .limit(50)
    ])
      .then(function (results) {
        var activeResult = results[0];
        var matchedResult = results[1];

        if (activeResult.error) {
          console.warn('加载挂单失败:', activeResult.error);
          activeOrders = [];
        } else {
          activeOrders = activeResult.data || [];
        }

        if (matchedResult.error) {
          console.warn('加载成交记录失败:', matchedResult.error);
          matchedTrades = [];
        } else {
          matchedTrades = matchedResult.data || [];
        }
      })
      .catch(function (err) {
        console.warn('加载兑换市场数据失败:', err);
        activeOrders = [];
        matchedTrades = [];
      })
      .then(function () {
        exchangeDataLoaded = true;
        exchangeDataLoading = false;
      });
  }

  function renderOrderList() {
    var listEl = document.getElementById('ex-order-list');
    var noMoreEl = document.querySelector('#exchange-page .exchange-no-more');
    if (!listEl) return;

    if (exchangeDataLoading && !exchangeDataLoaded) {
      listEl.innerHTML = '<tr><td colspan="4">' + exT('ex_loading') + '</td></tr>';
      if (noMoreEl) noMoreEl.classList.add('hidden');
      return;
    }

    var orders = getVisibleOrders();
    var actionKey = exchangeMode === 'buy' ? 'ex_btn_buy' : 'ex_btn_sell';
    var actionText = exT(actionKey);

    if (!orders.length) {
      listEl.innerHTML = '';
      if (noMoreEl) noMoreEl.classList.remove('hidden');
      return;
    }

    if (noMoreEl) noMoreEl.classList.add('hidden');

    listEl.innerHTML = orders.map(function (order) {
      var price = Number(order.price) || 0;
      var qty = Number(order.quantity) || 0;
      var total = price * qty;
      var orderId = order.id != null ? String(order.id) : '';
      var safeId = typeof escapeHtml === 'function' ? escapeHtml(orderId) : orderId;

      return (
        '<tr data-order-id="' + safeId + '">' +
          '<td>' + price.toFixed(4) + '</td>' +
          '<td>' + qty.toLocaleString() + '</td>' +
          '<td>' + total.toFixed(2) + '<br><small>' + formatOrderTime(order.created_at) + '</small></td>' +
          '<td><button type="button" class="exchange-action-btn ex-order-action-btn" data-order-id="' + safeId + '">' + actionText + '</button></td>' +
        '</tr>'
      );
    }).join('');
  }

  function renderTradesList() {
    var listEl = document.getElementById('ex-trades-list');
    if (!listEl) return;

    if (exchangeDataLoading && !exchangeDataLoaded) {
      listEl.innerHTML = '<li class="exchange-trades-item"><span class="exchange-trades-time">' + exT('ex_loading') + '</span></li>';
      return;
    }

    if (!matchedTrades.length) {
      listEl.innerHTML = '<li class="exchange-trades-item"><span class="exchange-trades-time">' + exT('ex_no_trades') + '</span></li>';
      return;
    }

    listEl.innerHTML = matchedTrades.map(function (trade) {
      var price = Number(trade.price) || 0;
      var qty = Number(trade.quantity) || 0;
      return (
        '<li class="exchange-trades-item">' +
          '<span class="exchange-trades-time">' + formatOrderTime(trade.created_at) + '</span>' +
          '<span class="exchange-trades-price">' + price.toFixed(4) + '</span>' +
          '<span class="exchange-trades-qty">' + exT('ex_trade_qty', { qty: qty.toLocaleString() }) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  async function placeExchangeOrder(price, qty) {
    if (!window.supabase) {
      alert(exT('ex_alert_login'));
      return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(exT('ex_alert_login'));
      return;
    }

    var orderType = exchangeMode === 'buy' ? 'buy' : 'sell';
    var insertResult = await window.supabase.from('exchange_orders').insert({
      user_id: userId,
      order_type: orderType,
      price: price,
      quantity: qty,
      status: 'active'
    });

    if (insertResult.error) {
      alert(exT('ex_alert_order_fail') + insertResult.error.message);
      return;
    }

    alert(exT('ex_alert_order'));
    clearOrderForm();
    exchangeDataLoaded = false;
    await loadExchangeData();
    renderOrderList();
    renderTradesList();
  }

  async function matchExchangeOrder(orderId) {
    if (exchangeActionInProgress) return;

    if (!window.supabase) {
      alert(exT('ex_alert_login'));
      return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(exT('ex_alert_login'));
      return;
    }

    var order = activeOrders.find(function (item) {
      return String(item.id) === String(orderId);
    });

    if (!order) {
      alert(exT('ex_alert_trade_fail') + 'order not found');
      return;
    }

    if (String(order.user_id) === String(userId)) {
      alert(exT('ex_alert_self_trade'));
      return;
    }

    exchangeActionInProgress = true;

    try {
      var qty = Number(order.quantity) || 0;
      var price = Number(order.price) || 0;
      var total = Math.round(price * qty * 100) / 100;

      if (qty <= 0 || price <= 0) {
        alert(exT('ex_alert_trade_fail') + 'invalid order');
        return;
      }

      var buyerId;
      var sellerId;
      if (order.order_type === 'sell') {
        sellerId = order.user_id;
        buyerId = userId;
      } else if (order.order_type === 'buy') {
        buyerId = order.user_id;
        sellerId = userId;
      } else {
        alert(exT('ex_alert_trade_fail') + 'invalid order type');
        return;
      }

      var usersResult = await window.supabase
        .from('users')
        .select('id, crlm_balance, usdt_balance')
        .in('id', [buyerId, sellerId]);

      if (usersResult.error || !usersResult.data || usersResult.data.length < 2) {
        alert(exT('ex_alert_trade_fail') + (usersResult.error ? usersResult.error.message : 'user not found'));
        return;
      }

      var buyer = null;
      var seller = null;
      usersResult.data.forEach(function (user) {
        if (String(user.id) === String(buyerId)) buyer = user;
        if (String(user.id) === String(sellerId)) seller = user;
      });

      if (!buyer || !seller) {
        alert(exT('ex_alert_trade_fail') + 'user not found');
        return;
      }

      var buyerUsdt = Number(buyer.usdt_balance) || 0;
      var buyerCrlm = Number(buyer.crlm_balance) || 0;
      var sellerCrlm = Number(seller.crlm_balance) || 0;
      var sellerUsdt = Number(seller.usdt_balance) || 0;

      if (buyerUsdt < total) {
        alert(exT('ex_alert_usdt_insufficient'));
        return;
      }

      if (sellerCrlm < qty) {
        alert(exT('ex_alert_crlm_insufficient'));
        return;
      }

      var buyerUpdate = await window.supabase
        .from('users')
        .update({
          crlm_balance: buyerCrlm + qty,
          usdt_balance: Math.round((buyerUsdt - total) * 100) / 100
        })
        .eq('id', buyerId);

      if (buyerUpdate.error) {
        alert(exT('ex_alert_trade_fail') + buyerUpdate.error.message);
        return;
      }

      var sellerUpdate = await window.supabase
        .from('users')
        .update({
          crlm_balance: sellerCrlm - qty,
          usdt_balance: Math.round((sellerUsdt + total) * 100) / 100
        })
        .eq('id', sellerId);

      if (sellerUpdate.error) {
        alert(exT('ex_alert_trade_fail') + sellerUpdate.error.message);
        return;
      }

      var orderUpdate = await window.supabase
        .from('exchange_orders')
        .update({ status: 'matched' })
        .eq('id', order.id)
        .eq('status', 'active');

      if (orderUpdate.error) {
        alert(exT('ex_alert_trade_fail') + orderUpdate.error.message);
        return;
      }

      alert(exT('ex_alert_trade'));
      exchangeDataLoaded = false;
      await loadExchangeData();
      renderOrderList();
      renderTradesList();
    } finally {
      exchangeActionInProgress = false;
    }
  }

  function updateTabUI() {
    var tabBuy = document.getElementById('ex-tab-buy');
    var tabSell = document.getElementById('ex-tab-sell');

    if (tabBuy) {
      if (exchangeMode === 'buy') {
        tabBuy.classList.add('exchange-tab-active');
      } else {
        tabBuy.classList.remove('exchange-tab-active');
      }
    }

    if (tabSell) {
      if (exchangeMode === 'sell') {
        tabSell.classList.add('exchange-tab-active');
      } else {
        tabSell.classList.remove('exchange-tab-active');
      }
    }
  }

  function updateTotalDisplay() {
    var priceInput = document.getElementById('ex-input-price');
    var qtyInput = document.getElementById('ex-input-qty');
    var totalEl = document.getElementById('ex-total-display');

    if (!totalEl) return;

    var price = parseFloat(priceInput ? priceInput.value : '');
    var qty = parseFloat(qtyInput ? qtyInput.value : '');

    if (isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
      totalEl.textContent = exT('ex_total_usdt', { amount: '0.00' });
      return;
    }

    var total = (price * qty).toFixed(2);
    totalEl.textContent = exT('ex_total_usdt', { amount: total });
  }

  function clearOrderForm() {
    var priceInput = document.getElementById('ex-input-price');
    var qtyInput = document.getElementById('ex-input-qty');
    if (priceInput) priceInput.value = '';
    if (qtyInput) qtyInput.value = '';
    updateTotalDisplay();
  }

  function initExchangeEvents() {
    if (exchangeInitialized) return;
    exchangeInitialized = true;

    var tabBuy = document.getElementById('ex-tab-buy');
    var tabSell = document.getElementById('ex-tab-sell');

    if (tabBuy) {
      tabBuy.addEventListener('click', function () {
        exchangeMode = 'buy';
        updateTabUI();
        renderOrderList();
      });
    }

    if (tabSell) {
      tabSell.addEventListener('click', function () {
        exchangeMode = 'sell';
        updateTabUI();
        renderOrderList();
      });
    }

    var priceInput = document.getElementById('ex-input-price');
    var qtyInput = document.getElementById('ex-input-qty');

    if (priceInput) priceInput.addEventListener('input', updateTotalDisplay);
    if (qtyInput) qtyInput.addEventListener('input', updateTotalDisplay);

    var confirmBtn = document.getElementById('ex-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        var price = parseFloat(priceInput ? priceInput.value : '');
        var qty = parseFloat(qtyInput ? qtyInput.value : '');

        if (!priceInput || !qtyInput || !priceInput.value.trim() || !qtyInput.value.trim() || isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
          alert(exT('ex_alert_required'));
          return;
        }

        placeExchangeOrder(price, qty);
      });
    }

    var orderListEl = document.getElementById('ex-order-list');
    if (orderListEl && !orderListEl.dataset.bound) {
      orderListEl.dataset.bound = 'true';
      orderListEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.ex-order-action-btn');
        if (!btn || !orderListEl.contains(btn)) return;
        var orderId = btn.getAttribute('data-order-id');
        if (!orderId) return;
        matchExchangeOrder(orderId);
      });
    }
  }

  function renderExchangePage() {
    initExchangeEvents();
    applyExchangeI18n();
    updateTabUI();
    updateTotalDisplay();
    renderOrderList();
    renderTradesList();

    if (!exchangeDataLoaded && !exchangeDataLoading) {
      loadExchangeData().then(function () {
        renderOrderList();
        renderTradesList();
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      exchangeInitialized = false;
      exchangeMode = 'buy';
      exchangeDataLoaded = false;
      exchangeDataLoading = false;
      activeOrders = [];
      matchedTrades = [];
    }
  }

  function handleExchangeRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var exchangePage = document.getElementById('exchange-page');

    if (exchangePage) {
      if (route === 'exchange') {
        exchangePage.classList.remove('hidden');
        renderExchangePage();
      } else {
        exchangePage.classList.add('hidden');
        exchangeDataLoaded = false;
        exchangeDataLoading = false;
        activeOrders = [];
        matchedTrades = [];
      }
    }
  }

  window.addEventListener('hashchange', handleExchangeRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleExchangeRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleExchangeRoute, 0);
    });
  }
})();

// ==========================================
// 11. 排行榜页 (#leaderboard) — 任务卡 #009
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var leaderboardType = 'earnings';
  var leaderboardInitialized = false;
  var leaderboardDataLoaded = false;
  var leaderboardDataLoading = false;

  var rankBadges = ['🥇', '🥈', '🥉'];

  var leaderboardColumns = {
    earnings: { field: 'crlm_balance', select: 'id, username, level, crlm_balance, avatar_url' },
    invites: { field: 'invite_count', select: 'id, username, level, invite_count, avatar_url' },
    reputation: { field: 'reputation_score', select: 'id, username, level, reputation_score, avatar_url' }
  };

  var leaderboardData = {
    earnings: [],
    invites: [],
    reputation: []
  };

  var myRankData = {
    earnings: null,
    invites: null,
    reputation: null
  };

  var leaderboardTranslations = {
    zh: {
      lb_page_title: '排行榜',
      lb_tab_earnings: '赚币榜',
      lb_tab_invites: '邀请榜',
      lb_tab_reputation: '信誉榜',
      lb_level: 'Lv.{level}',
      lb_my_rank: '#{rank}',
      lb_earnings_value: '{amount} CRLM',
      lb_invites_value: '{count} 人',
      lb_reputation_value: '{score}%',
      lb_login_required: '请先登录查看排名',
      lb_loading: '加载中...'
    },
    en: {
      lb_page_title: 'Leaderboard',
      lb_tab_earnings: 'Earnings',
      lb_tab_invites: 'Invites',
      lb_tab_reputation: 'Reputation',
      lb_level: 'Lv.{level}',
      lb_my_rank: '#{rank}',
      lb_earnings_value: '{amount} CRLM',
      lb_invites_value: '{count} people',
      lb_reputation_value: '{score}%',
      lb_login_required: 'Please sign in to view your rank',
      lb_loading: 'Loading...'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function lbT(key, vars) {
    var dict = leaderboardTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatValue(type, value) {
    if (type === 'earnings') {
      return lbT('lb_earnings_value', { amount: formatNumber(value) });
    }
    if (type === 'invites') {
      return lbT('lb_invites_value', { count: value });
    }
    return lbT('lb_reputation_value', { score: value });
  }

  function mapUserRow(row, type) {
    var field = leaderboardColumns[type].field;
    return {
      id: row.id,
      username: row.username || '—',
      level: row.level != null ? row.level : 1,
      value: Number(row[field]) || 0,
      avatar_url: row.avatar_url || ''
    };
  }

  function fetchTopUsers(type) {
    var config = leaderboardColumns[type];
    return window.supabase
      .from('users')
      .select(config.select)
      .order(config.field, { ascending: false })
      .limit(20)
      .then(function (result) {
        if (result.error) throw result.error;
        return (result.data || []).map(function (row) {
          return mapUserRow(row, type);
        });
      });
  }

  function fetchMyRankForType(type, userId) {
    var config = leaderboardColumns[type];
    return window.supabase
      .from('users')
      .select('id, username, level, avatar_url, ' + config.field)
      .eq('id', userId)
      .single()
      .then(function (userResult) {
        if (userResult.error || !userResult.data) return null;

        var value = Number(userResult.data[config.field]) || 0;
        return window.supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gt(config.field, value)
          .then(function (countResult) {
            if (countResult.error) return null;
            return {
              rank: (countResult.count || 0) + 1,
              id: userResult.data.id,
              username: userResult.data.username || '—',
              level: userResult.data.level != null ? userResult.data.level : 1,
              value: value,
              avatar_url: userResult.data.avatar_url || ''
            };
          });
      });
  }

  function loadLeaderboardData() {
    if (leaderboardDataLoaded || leaderboardDataLoading) {
      return Promise.resolve();
    }

    if (!window.supabase) {
      leaderboardDataLoaded = true;
      return Promise.resolve();
    }

    leaderboardDataLoading = true;
    var types = ['earnings', 'invites', 'reputation'];

    return Promise.all(types.map(fetchTopUsers))
      .then(function (topResults) {
        types.forEach(function (type, index) {
          leaderboardData[type] = topResults[index];
        });
        return getCurrentUserId();
      })
      .then(function (userId) {
        if (!userId) {
          types.forEach(function (type) {
            myRankData[type] = null;
          });
          return null;
        }
        return Promise.all(types.map(function (type) {
          return fetchMyRankForType(type, userId);
        })).then(function (myResults) {
          types.forEach(function (type, index) {
            myRankData[type] = myResults[index];
          });
        });
      })
      .catch(function (err) {
        console.warn('加载排行榜失败:', err);
        types.forEach(function (type) {
          myRankData[type] = null;
        });
      })
      .then(function () {
        leaderboardDataLoaded = true;
        leaderboardDataLoading = false;
      });
  }

  function getRankDisplay(rank) {
    if (rank <= 3) {
      return '<span class="leaderboard-rank">' + rankBadges[rank - 1] + '</span>';
    }
    return '<span class="leaderboard-rank"><span class="leaderboard-rank-num">' + rank + '</span></span>';
  }

  function applyLeaderboardI18n() {
    document.querySelectorAll('#leaderboard-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (leaderboardTranslations[getLang()][key]) {
        el.textContent = lbT(key);
      }
    });
  }

  function renderRankList() {
    var listEl = document.getElementById('lb-rank-list');
    if (!listEl) return;

    if (leaderboardDataLoading && !leaderboardDataLoaded) {
      listEl.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-value">' + lbT('lb_loading') + '</span></li>';
      return;
    }

    var data = leaderboardData[leaderboardType] || [];

    listEl.innerHTML = data.map(function (item, index) {
      var rank = index + 1;
      var topClass = rank <= 3 ? ' leaderboard-item-top3' : '';
      var safeUsername = typeof escapeHtml === 'function' ? escapeHtml(item.username) : item.username;
      var avatarHtml = typeof buildAvatarHtml === 'function'
        ? buildAvatarHtml({ id: item.id, username: item.username, avatar_url: item.avatar_url }, 'leaderboard-avatar')
        : '<div class="leaderboard-avatar"></div>';
      return (
        '<li class="leaderboard-item' + topClass + '">' +
          getRankDisplay(rank) +
          avatarHtml +
          '<div class="leaderboard-user-info">' +
            '<span class="leaderboard-username">' + safeUsername + '</span>' +
            '<span class="leaderboard-level">' + lbT('lb_level', { level: item.level }) + '</span>' +
          '</div>' +
          '<span class="leaderboard-value">' + formatValue(leaderboardType, item.value) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderMyRank() {
    var rankEl = document.getElementById('lb-my-rank-num');
    var usernameEl = document.getElementById('lb-my-username');
    var levelEl = document.getElementById('lb-my-level');
    var valueEl = document.getElementById('lb-my-value');

    var myData = myRankData[leaderboardType];

    if (leaderboardDataLoading && !leaderboardDataLoaded) {
      if (rankEl) rankEl.textContent = '';
      if (usernameEl) usernameEl.textContent = lbT('lb_loading');
      if (levelEl) levelEl.textContent = '';
      if (valueEl) valueEl.textContent = '';
      return;
    }

    if (!myData) {
      if (rankEl) rankEl.textContent = '';
      if (usernameEl) usernameEl.textContent = lbT('lb_login_required');
      if (levelEl) levelEl.textContent = '';
      if (valueEl) valueEl.textContent = '';
      return;
    }

    if (rankEl) rankEl.textContent = lbT('lb_my_rank', { rank: myData.rank });
    if (usernameEl) usernameEl.textContent = myData.username;
    if (levelEl) levelEl.textContent = lbT('lb_level', { level: myData.level });
    if (valueEl) valueEl.textContent = formatValue(leaderboardType, myData.value);

    var myAvatarEl = document.querySelector('.leaderboard-my-rank .leaderboard-avatar');
    if (myAvatarEl && typeof applyAvatarToElement === 'function') {
      applyAvatarToElement(myAvatarEl, {
        id: myData.id,
        username: myData.username,
        avatar_url: myData.avatar_url
      }, 'leaderboard-avatar', { googleAvatarUrl: coinrealmGoogleAvatarUrl });
    }
  }

  function updateTabUI() {
    var tabs = {
      earnings: document.getElementById('lb-tab-earnings'),
      invites: document.getElementById('lb-tab-invites'),
      reputation: document.getElementById('lb-tab-reputation')
    };

    Object.keys(tabs).forEach(function (key) {
      if (tabs[key]) {
        if (leaderboardType === key) {
          tabs[key].classList.add('leaderboard-tab-active');
        } else {
          tabs[key].classList.remove('leaderboard-tab-active');
        }
      }
    });
  }

  function initLeaderboardEvents() {
    if (leaderboardInitialized) return;
    leaderboardInitialized = true;

    var tabEarnings = document.getElementById('lb-tab-earnings');
    var tabInvites = document.getElementById('lb-tab-invites');
    var tabReputation = document.getElementById('lb-tab-reputation');

    if (tabEarnings) {
      tabEarnings.addEventListener('click', function () {
        leaderboardType = 'earnings';
        updateTabUI();
        renderRankList();
        renderMyRank();
      });
    }

    if (tabInvites) {
      tabInvites.addEventListener('click', function () {
        leaderboardType = 'invites';
        updateTabUI();
        renderRankList();
        renderMyRank();
      });
    }

    if (tabReputation) {
      tabReputation.addEventListener('click', function () {
        leaderboardType = 'reputation';
        updateTabUI();
        renderRankList();
        renderMyRank();
      });
    }
  }

  function renderLeaderboardPage() {
    initLeaderboardEvents();
    applyLeaderboardI18n();
    updateTabUI();
    renderRankList();
    renderMyRank();

    if (!leaderboardDataLoaded && !leaderboardDataLoading) {
      loadLeaderboardData().then(function () {
        renderRankList();
        renderMyRank();
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      leaderboardInitialized = false;
      leaderboardType = 'earnings';
      leaderboardDataLoaded = false;
      leaderboardDataLoading = false;
      leaderboardData = { earnings: [], invites: [], reputation: [] };
      myRankData = { earnings: null, invites: null, reputation: null };
    }
  }

  function handleLeaderboardRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var leaderboardPage = document.getElementById('leaderboard-page');

    if (leaderboardPage) {
      if (route === 'leaderboard') {
        leaderboardPage.classList.remove('hidden');
        renderLeaderboardPage();
      } else {
        leaderboardPage.classList.add('hidden');
        leaderboardDataLoaded = false;
        leaderboardDataLoading = false;
      }
    }
  }

  window.addEventListener('hashchange', handleLeaderboardRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleLeaderboardRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleLeaderboardRoute, 0);
    });
  }
})();

// ==========================================
// 12. 广播历史页 (#broadcast-history) — 任务卡 #010
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var visibleCount = 10;
  var broadcastHasMore = true;
  var broadcastFetchOffset = 0;
  var broadcastLoading = false;
  var broadcastInitialized = false;
  var BROADCAST_PAGE_SIZE = 10;
  var allBroadcasts = [];

  var broadcastTranslations = {
    zh: {
      bh_page_title: '最新战报',
      bh_load_more: '加载更多',
      bh_no_more: '没有更多了',
      bh_empty: '暂无广播记录',
      bh_loading: '加载中...'
    },
    en: {
      bh_page_title: 'Latest Activity',
      bh_load_more: 'Load More',
      bh_no_more: 'No More',
      bh_empty: 'No broadcasts yet',
      bh_loading: 'Loading...'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function bhT(key, vars) {
    var dict = broadcastTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function fetchBroadcastBatch() {
    if (!window.supabase) {
      return Promise.resolve([]);
    }

    return window.supabase
      .from('broadcasts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(broadcastFetchOffset, broadcastFetchOffset + BROADCAST_PAGE_SIZE - 1)
      .then(function (result) {
        if (result.error) {
          throw result.error;
        }
        var rows = result.data || [];
        broadcastFetchOffset += BROADCAST_PAGE_SIZE;
        if (rows.length < BROADCAST_PAGE_SIZE) {
          broadcastHasMore = false;
        }
        return rows;
      });
  }

  function resetBroadcastHistoryData() {
    visibleCount = 10;
    broadcastHasMore = true;
    broadcastFetchOffset = 0;
    broadcastLoading = false;
    allBroadcasts = [];
  }

  function loadInitialBroadcastHistory() {
    if (broadcastLoading) {
      return Promise.resolve();
    }

    resetBroadcastHistoryData();
    broadcastLoading = true;

    return fetchBroadcastBatch()
      .then(function (rows) {
        allBroadcasts = rows;
      })
      .catch(function (err) {
        console.warn('加载广播历史失败:', err);
        allBroadcasts = [];
        broadcastHasMore = false;
      })
      .then(function () {
        broadcastLoading = false;
      });
  }

  function loadMoreBroadcastHistory() {
    if (broadcastLoading || !broadcastHasMore) {
      return Promise.resolve();
    }

    broadcastLoading = true;

    return fetchBroadcastBatch()
      .then(function (rows) {
        allBroadcasts = allBroadcasts.concat(rows);
      })
      .catch(function (err) {
        console.warn('加载更多广播失败:', err);
        broadcastHasMore = false;
      })
      .then(function () {
        broadcastLoading = false;
      });
  }

  function renderBroadcastItem(item) {
    var desc = typeof escapeHtml === 'function' ? escapeHtml(item.description || '') : (item.description || '');
    var rewardHtml = item.reward_amount
      ? ' <span class="bh-reward-highlight">' + Number(item.reward_amount).toLocaleString() + ' CRLM</span>'
      : '';

    return (
      '<li class="broadcast-history-item">' +
        '<div class="bh-avatar"></div>' +
        '<p class="bh-content">' + desc + rewardHtml + '</p>' +
        '<span class="bh-time">' + formatBroadcastRelativeTime(item.created_at) + '</span>' +
      '</li>'
    );
  }

  function renderBroadcastList() {
    var listEl = document.getElementById('bh-broadcast-list');
    if (!listEl) return;

    if (broadcastLoading && !allBroadcasts.length) {
      listEl.innerHTML = '<li class="broadcast-history-item"><span class="bh-time">' + bhT('bh_loading') + '</span></li>';
      return;
    }

    if (!allBroadcasts.length) {
      listEl.innerHTML = '<li class="broadcast-history-item"><span class="bh-time">' + bhT('bh_empty') + '</span></li>';
      return;
    }

    var items = allBroadcasts.slice(0, visibleCount);
    listEl.innerHTML = items.map(renderBroadcastItem).join('');
  }

  function updateLoadMoreButton() {
    var btn = document.getElementById('bh-load-more-btn');
    if (!btn) return;

    var canShowMore = visibleCount < allBroadcasts.length || broadcastHasMore;

    if (!canShowMore) {
      btn.textContent = bhT('bh_no_more');
      btn.disabled = true;
    } else {
      btn.textContent = bhT('bh_load_more');
      btn.disabled = false;
    }
  }

  function applyBroadcastI18n() {
    document.querySelectorAll('#broadcast-history-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (broadcastTranslations[getLang()][key]) {
        el.textContent = bhT(key);
      }
    });
    updateLoadMoreButton();
  }

  function initBroadcastEvents() {
    if (broadcastInitialized) return;
    broadcastInitialized = true;

    var loadBtn = document.getElementById('bh-load-more-btn');
    if (loadBtn) {
      loadBtn.addEventListener('click', function () {
        if (loadBtn.disabled) return;

        visibleCount += BROADCAST_PAGE_SIZE;

        if (visibleCount > allBroadcasts.length && broadcastHasMore) {
          loadMoreBroadcastHistory().then(function () {
            renderBroadcastList();
            updateLoadMoreButton();
          });
          return;
        }

        renderBroadcastList();
        updateLoadMoreButton();
      });
    }
  }

  function renderBroadcastHistoryPage() {
    initBroadcastEvents();
    applyBroadcastI18n();
    renderBroadcastList();
    updateLoadMoreButton();

    if (!allBroadcasts.length && !broadcastLoading) {
      loadInitialBroadcastHistory().then(function () {
        renderBroadcastList();
        updateLoadMoreButton();
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      broadcastInitialized = false;
      resetBroadcastHistoryData();
    }
  }

  function handleBroadcastHistoryRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var broadcastPage = document.getElementById('broadcast-history-page');

    if (broadcastPage) {
      if (route === 'broadcast-history') {
        broadcastPage.classList.remove('hidden');
        renderBroadcastHistoryPage();
      } else {
        broadcastPage.classList.add('hidden');
        resetBroadcastHistoryData();
      }
    }
  }

  window.addEventListener('hashchange', handleBroadcastHistoryRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleBroadcastHistoryRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleBroadcastHistoryRoute, 0);
    });
  }
})();

// ==========================================
// 13. 发布者主页 (#publisher) — 任务卡 #011
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var publisherInitialized = false;
  var publisherLoading = false;
  var publisherDataLoaded = false;
  var loadedPublisher = null;
  var publisherActiveTasks = [];

  var publisherTranslations = {
    zh: {
      pub_official_badge: '官方认证',
      pub_high_risk: '⚠️ 高风险',
      pub_stat_reputation: '信誉分',
      pub_stat_completion: '完成率',
      pub_stat_tasks: '历史任务数',
      pub_stat_registered: '注册时间',
      pub_tasks_title: '进行中的任务',
      pub_empty_text: '该发布者暂无进行中的任务',
      pub_level_master: '大师',
      pub_level_badge: 'Lv.{level} {label}',
      pub_task_count_unit: '{count} 个',
      pub_percent: '{value}%',
      pub_loading: '加载中...',
      pub_not_found: '未找到该发布者'
    },
    en: {
      pub_official_badge: 'Official Verified',
      pub_high_risk: '⚠️ High Risk',
      pub_stat_reputation: 'Reputation',
      pub_stat_completion: 'Completion Rate',
      pub_stat_tasks: 'Tasks Published',
      pub_stat_registered: 'Registered',
      pub_tasks_title: 'Active Tasks',
      pub_empty_text: 'This publisher has no active tasks',
      pub_level_master: 'Master',
      pub_level_badge: 'Lv.{level} {label}',
      pub_task_count_unit: '{count}',
      pub_percent: '{value}%',
      pub_loading: 'Loading...',
      pub_not_found: 'Publisher not found'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function pubT(key, vars) {
    var dict = publisherTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function applyPublisherI18n() {
    document.querySelectorAll('#publisher-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (publisherTranslations[getLang()][key]) {
        el.textContent = pubT(key);
      }
    });
  }

  function formatRegisterDate(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr).slice(0, 10);
    if (getLang() === 'zh') {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  function loadPublisherPageData(publisherId) {
    if (!publisherId || !window.supabase) {
      return Promise.resolve(null);
    }

    publisherLoading = true;

    return window.supabase
      .from('users')
      .select('*')
      .eq('id', publisherId)
      .single()
      .then(function (userResult) {
        if (userResult.error || !userResult.data) {
          return null;
        }

        return Promise.all([
          Promise.resolve(userResult.data),
          window.supabase
            .from('tasks')
            .select('*')
            .eq('publisher_id', publisherId)
            .eq('status', 'active')
            .order('created_at', { ascending: false }),
          window.supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true })
            .eq('publisher_id', publisherId)
        ]).then(function (results) {
          var user = results[0];
          var tasksResult = results[1];
          var countResult = results[2];

          publisherActiveTasks = (tasksResult.error ? [] : (tasksResult.data || [])).map(function (task) {
            return Object.assign({}, task, {
              publisher_username: username,
              publisher_level: level
            });
          });

          var username = user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'Unknown');
          var level = user.level != null ? Number(user.level) : 0;
          var reputationScore = user.reputation_score != null ? Number(user.reputation_score) : 0;
          var completionRate = user.completion_rate != null ? Number(user.completion_rate) : reputationScore;

          return {
            id: user.id,
            username: username,
            level: level,
            levelLabelKey: level >= 5 ? 'pub_level_master' : '',
            reputationScore: reputationScore,
            completionRate: completionRate,
            taskCount: countResult.error ? 0 : (countResult.count || 0),
            registeredAt: formatRegisterDate(user.created_at),
            isOfficial: !!user.is_official,
            isHighRisk: !!user.is_high_risk,
            avatar_url: user.avatar_url || ''
          };
        });
      })
      .catch(function (err) {
        console.warn('加载发布者主页失败:', err);
        return null;
      })
      .then(function (data) {
        loadedPublisher = data;
        publisherDataLoaded = true;
        publisherLoading = false;
        return data;
      });
  }

  function renderPublisherTasks() {
    var grid = document.getElementById('pub-task-grid');
    var emptyState = document.getElementById('pub-empty-state');

    if (!grid || !emptyState) return;

    if (!publisherActiveTasks.length) {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');

    if (typeof buildTaskCardHtml === 'function') {
      grid.innerHTML = publisherActiveTasks.map(buildTaskCardHtml).join('');
      if (typeof applyLanguageStrings === 'function') {
        applyLanguageStrings();
      }
      return;
    }

    grid.innerHTML = '';
  }

  function renderPublisherProfile(publisher) {
    if (!publisher) {
      var usernameEl = document.getElementById('pub-username');
      if (usernameEl) usernameEl.textContent = pubT('pub_not_found');
      renderPublisherTasks();
      return;
    }

    var officialBadge = document.getElementById('pub-official-badge');
    if (officialBadge) {
      if (publisher.isOfficial) {
        officialBadge.classList.remove('hidden');
      } else {
        officialBadge.classList.add('hidden');
      }
    }

    var highRiskTag = document.getElementById('pub-high-risk-tag');
    if (highRiskTag) {
      if (publisher.isHighRisk) {
        highRiskTag.classList.remove('hidden');
      } else {
        highRiskTag.classList.add('hidden');
      }
    }

    var usernameEl = document.getElementById('pub-username');
    if (usernameEl) usernameEl.textContent = publisher.username;

    var levelBadge = document.getElementById('pub-level-badge');
    if (levelBadge) {
      var levelLabel = publisher.levelLabelKey ? pubT(publisher.levelLabelKey) : '';
      levelBadge.textContent = levelLabel
        ? pubT('pub_level_badge', { level: publisher.level, label: levelLabel })
        : 'Lv.' + publisher.level;
    }

    var reputationEl = document.getElementById('pub-reputation-score');
    if (reputationEl) {
      reputationEl.textContent = pubT('pub_percent', { value: publisher.reputationScore });
    }

    var completionEl = document.getElementById('pub-completion-rate');
    if (completionEl) {
      completionEl.textContent = pubT('pub_percent', { value: publisher.completionRate });
    }

    var taskCountEl = document.getElementById('pub-task-count');
    if (taskCountEl) {
      taskCountEl.textContent = pubT('pub_task_count_unit', { count: publisher.taskCount });
    }

    var registerEl = document.getElementById('pub-register-date');
    if (registerEl) {
      registerEl.textContent = publisher.registeredAt;
    }

    var avatarEl = document.querySelector('#publisher-page .publisher-avatar');
    if (avatarEl && typeof applyAvatarToElement === 'function') {
      applyAvatarToElement(avatarEl, {
        id: publisher.id,
        username: publisher.username,
        avatar_url: publisher.avatar_url
      }, 'publisher-avatar');
    }

    renderPublisherTasks();
  }

  function renderPublisherPage() {
    applyPublisherI18n();

    var publisherId = typeof getPublisherIdFromHash === 'function' ? getPublisherIdFromHash() : null;
    if (!publisherId) {
      window.location.hash = 'home';
      return;
    }

    if (publisherLoading && !publisherDataLoaded) {
      var loadingEl = document.getElementById('pub-username');
      if (loadingEl) loadingEl.textContent = pubT('pub_loading');
      return;
    }

    if (loadedPublisher && String(loadedPublisher.id) === String(publisherId)) {
      renderPublisherProfile(loadedPublisher);
      applyPublisherI18n();
      return;
    }

    publisherDataLoaded = false;
    loadPublisherPageData(publisherId).then(function (data) {
      renderPublisherProfile(data);
      applyPublisherI18n();
    });
  }

  function initPublisherEvents() {
    if (publisherInitialized) return;
    publisherInitialized = true;

    var grid = document.getElementById('pub-task-grid');
    if (grid && !grid.dataset.bound) {
      grid.dataset.bound = 'true';
      grid.addEventListener('click', function (e) {
        var publisherLink = e.target.closest('.publisher-link');
        if (publisherLink && grid.contains(publisherLink)) {
          e.preventDefault();
          e.stopPropagation();
          var publisherId = publisherLink.getAttribute('data-publisher-id');
          if (publisherId && typeof navigateToPublisher === 'function') {
            navigateToPublisher(publisherId);
          }
          return;
        }

        var btn = e.target.closest('.claim-btn');
        if (!btn || !grid.contains(btn)) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof handleClaimTask === 'function') {
          handleClaimTask(btn);
        }
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      publisherInitialized = false;
      publisherDataLoaded = false;
      publisherLoading = false;
      loadedPublisher = null;
      publisherActiveTasks = [];
    }
  }

  function handlePublisherRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var routeBase = route.split('?')[0] || 'home';
    var publisherPage = document.getElementById('publisher-page');

    if (publisherPage) {
      if (routeBase === 'publisher') {
        publisherPage.classList.remove('hidden');
        initPublisherEvents();
        renderPublisherPage();
      } else {
        publisherPage.classList.add('hidden');
        publisherDataLoaded = false;
        loadedPublisher = null;
        publisherActiveTasks = [];
      }
    }
  }

  window.addEventListener('hashchange', handlePublisherRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handlePublisherRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handlePublisherRoute, 0);
    });
  }
})();

// ==========================================
// 14. 审核管理页 (#review) — 任务卡 #012
// ==========================================
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
      rv_alert_action_fail: '操作失败：'
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
      rv_alert_action_fail: 'Action failed: '
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

  async function approveSubmission(submissionId) {
    if (!window.supabase || !submissionId) return false;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(rvT('rv_alert_login'));
      return false;
    }

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, user_id, task_id')
      .eq('id', submissionId)
      .single();

    if (submissionResult.error || !submissionResult.data) {
      alert(rvT('rv_alert_action_fail') + (submissionResult.error ? submissionResult.error.message : 'submission not found'));
      return false;
    }

    var submission = submissionResult.data;
    var taskResult = await window.supabase
      .from('tasks')
      .select('title, reward_amount')
      .eq('id', submission.task_id)
      .maybeSingle();

    var taskTitle = taskResult.data && taskResult.data.title ? taskResult.data.title : '任务';
    var rewardAmount = taskResult.data ? Number(taskResult.data.reward_amount) || 0 : 0;

    var updateResult = await window.supabase
      .from('submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateResult.error) {
      alert(rvT('rv_alert_action_fail') + updateResult.error.message);
      return false;
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

// ==========================================
// 15. 邀请专属页 (#invite) — 任务卡 #013
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var inviteInitialized = false;
  var inviteRecordsTab = 'friends';
  var inviteDataLoaded = false;
  var inviteDataLoading = false;
  var inviteData = null;
  var leaderboardExpanded = false;
  var miningRecordsExpanded = false;
  var rankBadges = ['🥇', '🥈', '🥉'];

  var inviteTranslations = {
    zh: {
      iv_page_title: '邀请好友',
      iv_lb_title: '🏆 邀请排行榜',
      iv_lb_expand: '查看完整排行榜',
      iv_lb_collapse: '收起排行榜',
      iv_lb_invites: '{count} 人',
      iv_lb_reward: '{amount} CRLM',
      iv_lb_my_rank: '我的排名',
      iv_lb_empty: '暂无排行数据',
      iv_share_headline: '邀请好友，赚取 CRLM',
      iv_reward_desc: '一级奖励：{level1} CRLM/人，二级奖励：{level2} CRLM/人',
      iv_stat_invites: '累计邀请',
      iv_stat_reward: '累计奖励',
      iv_invite_count: '{count} 人',
      iv_total_reward: '{amount} CRLM',
      iv_btn_copy_link: '复制链接',
      iv_friends_title: '我邀请的好友',
      iv_rewards_title: '邀请奖励记录',
      iv_reward_amount: '+{amount} CRLM',
      iv_level_tag: 'L{level}',
      iv_alert_copied: '已复制！',
      iv_alert_share: '已复制链接，即将跳转...',
      iv_login_required: '请先登录查看邀请信息',
      iv_loading: '加载中...',
      iv_no_friends: '暂无邀请好友',
      iv_friends_right_hint: '您邀请的好友列表见右栏',
      iv_no_rewards: '暂无奖励记录',
      iv_airdrop: '空投',
      iv_airdrop_claimed: '已领取',
      iv_airdrop_hint: '每日可领取一次空投，获得随机 CRLM 奖励',
      iv_airdrop_earnings_title: '🎁 空投收益',
      iv_airdrop_expand: '查看全部记录',
      iv_airdrop_collapse: '收起记录',
      iv_airdrop_empty: '暂无空投记录',
      iv_airdrop_record: '+{amount} CRLM · 连续 {days} 天',
      iv_airdrop_next: '下次空投：{time}',
      iv_airdrop_available: '今日空投可用'
    },
    en: {
      iv_page_title: 'Invite Friends',
      iv_lb_title: '🏆 Invite Leaderboard',
      iv_lb_expand: 'View full leaderboard',
      iv_lb_collapse: 'Collapse leaderboard',
      iv_lb_invites: '{count} invites',
      iv_lb_reward: '{amount} CRLM',
      iv_lb_my_rank: 'My rank',
      iv_lb_empty: 'No leaderboard data yet',
      iv_share_headline: 'Invite friends, earn CRLM',
      iv_reward_desc: 'Level 1: {level1} CRLM each, Level 2: {level2} CRLM each',
      iv_stat_invites: 'Total invites',
      iv_stat_reward: 'Total rewards',
      iv_invite_count: '{count}',
      iv_total_reward: '{amount} CRLM',
      iv_btn_copy_link: 'Copy link',
      iv_friends_title: 'My invites',
      iv_rewards_title: 'Reward history',
      iv_reward_amount: '+{amount} CRLM',
      iv_level_tag: 'L{level}',
      iv_alert_copied: 'Copied!',
      iv_alert_share: 'Link copied, redirecting...',
      iv_login_required: 'Please sign in to view invite info',
      iv_loading: 'Loading...',
      iv_no_friends: 'No invited friends yet',
      iv_friends_right_hint: 'See your invited friends in the right column',
      iv_no_rewards: 'No reward records yet',
      iv_airdrop: 'Airdrop',
      iv_airdrop_claimed: 'Claimed',
      iv_airdrop_hint: 'Claim one daily airdrop for a random CRLM reward',
      iv_airdrop_earnings_title: '🎁 Airdrop earnings',
      iv_airdrop_expand: 'View all records',
      iv_airdrop_collapse: 'Collapse records',
      iv_airdrop_empty: 'No airdrop records yet',
      iv_airdrop_record: '+{amount} CRLM · {days}-day streak',
      iv_airdrop_next: 'Next airdrop in {time}',
      iv_airdrop_available: 'Airdrop available today'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function ivT(key, vars) {
    var dict = inviteTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  window.getInviteText = ivT;

  window.coinrealmRefreshInviteMiningData = function () {
    inviteDataLoaded = false;
    loadInvitePageData().then(function () {
      renderMiningRecords();
      renderInviteRecordsList();
      applyInviteI18n();
    });
  };

  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  function applyInviteI18n() {
    document.querySelectorAll('#invite-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (inviteTranslations[getLang()][key]) {
        el.textContent = ivT(key);
      }
    });

    var miningBtn = document.getElementById('invite-mining-btn');
    var miningLabel = document.getElementById('invite-mining-label');
    if (miningBtn && miningLabel && miningBtn.classList.contains('invite-mining-done')) {
      miningLabel.textContent = ivT('iv_airdrop_claimed');
    }
  }

  function buildInviteLink(userId) {
    var base = window.location.origin + window.location.pathname;
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'ref=' + encodeURIComponent(userId);
  }

  function getRankBadge(rank) {
    return rank <= 3 ? rankBadges[rank - 1] : String(rank);
  }

  function renderLeaderboardAvatarHtml(user) {
    var avatarHtml = '<div class="iv-lb-avatar"></div>';
    if (!user) return avatarHtml;
    var temp = document.createElement('div');
    temp.className = 'iv-lb-avatar';
    if (typeof applyAvatarToElement === 'function') {
      applyAvatarToElement(temp, user, 'cr-avatar-img', {});
      return temp.outerHTML;
    }
    return avatarHtml;
  }

  function aggregateInviteRewards(rows) {
    var map = {};
    (rows || []).forEach(function (row) {
      var inviterId = row.inviter_id;
      if (!inviterId) return;
      map[inviterId] = (map[inviterId] || 0) + (Number(row.reward_amount) || 0);
    });
    return map;
  }

  function fetchInviteLeaderboard(limit) {
    return window.supabase
      .from('users')
      .select('id, username, email, avatar_url, invite_count')
      .order('invite_count', { ascending: false })
      .limit(limit)
      .then(function (usersResult) {
        if (usersResult.error) throw usersResult.error;
        var users = usersResult.data || [];
        var userIds = users.map(function (u) { return u.id; }).filter(Boolean);
        if (!userIds.length) {
          return users.map(function (u, index) {
            return {
              rank: index + 1,
              id: u.id,
              username: u.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(u.email) : 'User'),
              avatar_url: u.avatar_url || '',
              invite_count: Number(u.invite_count) || 0,
              total_reward: 0
            };
          });
        }

        return window.supabase
          .from('invites')
          .select('inviter_id, reward_amount')
          .in('inviter_id', userIds)
          .then(function (rewardsResult) {
            var rewardMap = aggregateInviteRewards(rewardsResult.error ? [] : rewardsResult.data);
            return users.map(function (u, index) {
              return {
                rank: index + 1,
                id: u.id,
                username: u.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(u.email) : 'User'),
                avatar_url: u.avatar_url || '',
                invite_count: Number(u.invite_count) || 0,
                total_reward: rewardMap[u.id] || 0
              };
            });
          });
      });
  }

  function fetchMyInviteRank(userId) {
    return window.supabase
      .from('users')
      .select('id, username, email, avatar_url, invite_count')
      .eq('id', userId)
      .single()
      .then(function (userResult) {
        if (userResult.error || !userResult.data) return null;
        var inviteCount = Number(userResult.data.invite_count) || 0;
        return window.supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gt('invite_count', inviteCount)
          .then(function (countResult) {
            if (countResult.error) return null;
            return window.supabase
              .from('invites')
              .select('reward_amount')
              .eq('inviter_id', userId)
              .then(function (rewardResult) {
                var totalReward = (rewardResult.data || []).reduce(function (sum, row) {
                  return sum + (Number(row.reward_amount) || 0);
                }, 0);
                return {
                  rank: (countResult.count || 0) + 1,
                  id: userResult.data.id,
                  username: userResult.data.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(userResult.data.email) : 'User'),
                  avatar_url: userResult.data.avatar_url || '',
                  invite_count: inviteCount,
                  total_reward: totalReward
                };
              });
          });
      });
  }

  function loadInvitePageData() {
    if (inviteDataLoading) {
      return Promise.resolve(inviteData);
    }

    inviteDataLoading = true;

    return Promise.all([
      fetchInviteSettings(),
      getCurrentUserId()
    ])
      .then(function (results) {
        var settings = results[0];
        var userId = results[1];

        if (!userId || !window.supabase) {
          return { loggedIn: false, settings: settings };
        }

        return Promise.all([
          window.supabase.from('users').select('invite_count').eq('id', userId).single(),
          window.supabase.from('invites').select('*').eq('inviter_id', userId).order('created_at', { ascending: false }),
          window.supabase.from('checkins').select('*').eq('user_id', userId).order('checkin_date', { ascending: false }).limit(50),
          fetchInviteLeaderboard(50),
          fetchMyInviteRank(userId)
        ]).then(function (pageResults) {
          var userResult = pageResults[0];
          var invitesResult = pageResults[1];
          var checkinsResult = pageResults[2];
          var leaderboard = pageResults[3];
          var myRank = pageResults[4];

          if (userResult.error || !userResult.data) {
            return { loggedIn: false, settings: settings };
          }

          var inviteRows = invitesResult.error ? [] : (invitesResult.data || []);
          var level1Rows = inviteRows.filter(function (row) { return Number(row.level) === 1; });
          var inviteeIds = level1Rows.map(function (row) { return row.invitee_id; }).filter(Boolean);
          var uniqueIds = inviteeIds.filter(function (id, index) { return inviteeIds.indexOf(id) === index; });

          var buildData = function (userMap) {
            var friends = level1Rows.map(function (row) {
              var user = userMap[row.invitee_id] || {};
              return {
                username: user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'Unknown'),
                registeredAt: row.created_at ? String(row.created_at).slice(0, 10) : '—',
                reward: Number(row.reward_amount) || 0
              };
            });

            var rewardRecords = inviteRows.map(function (row) {
              var user = userMap[row.invitee_id] || {};
              return {
                level: Number(row.level) || 1,
                username: user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'User'),
                reward: Number(row.reward_amount) || 0,
                createdAt: row.created_at ? String(row.created_at).slice(0, 16).replace('T', ' ') : '—'
              };
            });

            return {
              loggedIn: true,
              userId: userId,
              settings: settings,
              inviteCount: Number(userResult.data.invite_count) || friends.length,
              totalReward: inviteRows.reduce(function (sum, row) {
                return sum + (Number(row.reward_amount) || 0);
              }, 0),
              friends: friends,
              rewardRecords: rewardRecords,
              miningRecords: checkinsResult.error ? [] : (checkinsResult.data || []),
              leaderboard: leaderboard || [],
              myRank: myRank
            };
          };

          if (!uniqueIds.length) {
            return buildData({});
          }

          return window.supabase
            .from('users')
            .select('id, username, email')
            .in('id', uniqueIds)
            .then(function (usersResult) {
              var userMap = {};
              if (!usersResult.error && usersResult.data) {
                usersResult.data.forEach(function (user) {
                  userMap[user.id] = user;
                });
              }
              return buildData(userMap);
            });
        });
      })
      .catch(function (err) {
        console.warn('加载邀请页数据失败:', err);
        return { loggedIn: false, settings: INVITE_SETTINGS_DEFAULTS };
      })
      .then(function (data) {
        inviteData = data;
        inviteDataLoaded = true;
        inviteDataLoading = false;
        return data;
      });
  }

  function renderLoginRequiredState() {
    var loginMsg = ivT('iv_login_required');
    var countEl = document.getElementById('iv-invite-count');
    var rewardEl = document.getElementById('iv-invite-reward');
    var linkEl = document.getElementById('iv-invite-link');
    var lbList = document.getElementById('iv-leaderboard-list');
    var recordsList = document.getElementById('iv-records-list');
    var miningList = document.getElementById('iv-mining-records');
    var myRankFooter = document.getElementById('iv-my-rank-footer');

    if (countEl) countEl.textContent = loginMsg;
    if (rewardEl) rewardEl.textContent = '';
    if (linkEl) linkEl.value = '';
    if (lbList) lbList.innerHTML = '<li class="invite-empty-hint">' + loginMsg + '</li>';
    if (recordsList) recordsList.innerHTML = '<li class="invite-empty-hint">' + loginMsg + '</li>';
    if (miningList) miningList.innerHTML = '<li class="invite-empty-hint">' + loginMsg + '</li>';
    if (myRankFooter) myRankFooter.classList.add('hidden');
  }

  function renderRewardDesc() {
    var descEl = document.getElementById('iv-reward-desc');
    if (!descEl) return;
    var settings = (inviteData && inviteData.settings) || INVITE_SETTINGS_DEFAULTS;
    descEl.textContent = ivT('iv_reward_desc', {
      level1: formatNumber(Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward),
      level2: formatNumber(Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward)
    });
  }

  function renderOverview() {
    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var inviteLink = buildInviteLink(inviteData.userId);
    var countEl = document.getElementById('iv-invite-count');
    var rewardEl = document.getElementById('iv-invite-reward');
    var linkEl = document.getElementById('iv-invite-link');

    if (countEl) countEl.textContent = ivT('iv_invite_count', { count: inviteData.inviteCount });
    if (rewardEl) rewardEl.textContent = ivT('iv_total_reward', { amount: formatNumber(inviteData.totalReward) });
    if (linkEl) linkEl.value = inviteLink;

    inviteData.inviteLink = inviteLink;
    renderRewardDesc();
  }

  function renderLeaderboard() {
    var listEl = document.getElementById('iv-leaderboard-list');
    var expandBtn = document.getElementById('iv-leaderboard-expand');
    var myRankFooter = document.getElementById('iv-my-rank-footer');
    if (!listEl) return;

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var rows = (inviteData.leaderboard || []).slice();
    var displayLimit = leaderboardExpanded ? 50 : 6;
    var visibleRows = rows.slice(0, displayLimit);

    if (!visibleRows.length) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_lb_empty') + '</li>';
    } else {
      listEl.innerHTML = visibleRows.map(function (row) {
        var safeName = typeof escapeHtml === 'function' ? escapeHtml(row.username) : row.username;
        return (
          '<li class="invite-leaderboard-item">' +
            '<span class="iv-lb-rank">' + getRankBadge(row.rank) + '</span>' +
            renderLeaderboardAvatarHtml(row) +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + safeName + '</span>' +
              '<span class="iv-lb-meta">' + ivT('iv_lb_invites', { count: row.invite_count }) + '</span>' +
            '</div>' +
            '<span class="iv-lb-reward">' + ivT('iv_lb_reward', { amount: formatNumber(row.total_reward) }) + '</span>' +
          '</li>'
        );
      }).join('');
    }

    if (expandBtn) {
      expandBtn.textContent = leaderboardExpanded ? ivT('iv_lb_collapse') : ivT('iv_lb_expand');
      expandBtn.classList.toggle('hidden', rows.length <= 6);
    }

    if (myRankFooter) {
      var myRank = inviteData.myRank;
      var inVisible = myRank && visibleRows.some(function (row) { return row.id === myRank.id; });
      if (myRank && !inVisible) {
        myRankFooter.classList.remove('hidden');
        myRankFooter.innerHTML =
          '<span class="invite-my-rank-label">' + ivT('iv_lb_my_rank') + '</span>' +
          '<div class="invite-leaderboard-item" style="padding:0;border:none;">' +
            '<span class="iv-lb-rank">' + getRankBadge(myRank.rank) + '</span>' +
            renderLeaderboardAvatarHtml(myRank) +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + (typeof escapeHtml === 'function' ? escapeHtml(myRank.username) : myRank.username) + '</span>' +
              '<span class="iv-lb-meta">' + ivT('iv_lb_invites', { count: myRank.invite_count }) + '</span>' +
            '</div>' +
            '<span class="iv-lb-reward">' + ivT('iv_lb_reward', { amount: formatNumber(myRank.total_reward) }) + '</span>' +
          '</div>';
      } else {
        myRankFooter.classList.add('hidden');
        myRankFooter.innerHTML = '';
      }
    }
  }

  function renderMiningRecords() {
    var listEl = document.getElementById('iv-mining-records');
    var expandBtn = document.getElementById('iv-mining-expand');
    if (!listEl) return;

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var records = (inviteData.miningRecords || []).slice();
    var displayLimit = miningRecordsExpanded ? 50 : 6;
    var visibleRecords = records.slice(0, displayLimit);

    if (!visibleRecords.length) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_airdrop_empty') + '</li>';
    } else {
      listEl.innerHTML = visibleRecords.map(function (row) {
        var dateText = row.checkin_date ? String(row.checkin_date).slice(0, 10) : '—';
        return (
          '<li class="invite-mining-record-item">' +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + dateText + '</span>' +
              '<span class="iv-lb-meta">' + ivT('iv_airdrop_record', {
                amount: formatNumber(Number(row.reward_amount) || 0),
                days: Number(row.consecutive_days) || 1
              }) + '</span>' +
            '</div>' +
          '</li>'
        );
      }).join('');
    }

    if (expandBtn) {
      expandBtn.textContent = miningRecordsExpanded ? ivT('iv_airdrop_collapse') : ivT('iv_airdrop_expand');
      expandBtn.classList.toggle('hidden', records.length <= 6);
    }
  }

  function updateInviteRecordsTabsUI() {
    var friendsTab = document.getElementById('iv-tab-friends');
    var rewardsTab = document.getElementById('iv-tab-rewards');
    if (friendsTab) friendsTab.classList.toggle('invite-records-tab-active', inviteRecordsTab === 'friends');
    if (rewardsTab) rewardsTab.classList.toggle('invite-records-tab-active', inviteRecordsTab === 'rewards');
  }

  function renderInviteRecordsList() {
    var listEl = document.getElementById('iv-records-list');
    if (!listEl) return;

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    if (inviteRecordsTab === 'friends') {
      var friends = inviteData.friends || [];
      if (!friends.length) {
        listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_no_friends') + '</li>';
        return;
      }

      listEl.innerHTML = friends.map(function (friend) {
        var safeName = typeof escapeHtml === 'function' ? escapeHtml(friend.username) : friend.username;
        return (
          '<li class="invite-record-item">' +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + safeName + '</span>' +
              '<span class="iv-lb-meta">' + friend.registeredAt + '</span>' +
            '</div>' +
            '<span class="iv-record-reward">' + ivT('iv_reward_amount', { amount: formatNumber(friend.reward) }) + '</span>' +
          '</li>'
        );
      }).join('');
      return;
    }

    var rewards = inviteData.rewardRecords || [];
    if (!rewards.length) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_no_rewards') + '</li>';
      return;
    }

    listEl.innerHTML = rewards.map(function (record) {
      var safeName = typeof escapeHtml === 'function' ? escapeHtml(record.username) : record.username;
      var levelClass = record.level === 2 ? 'iv-record-level-2' : 'iv-record-level-1';
      return (
        '<li class="invite-record-item">' +
          '<span class="iv-record-level ' + levelClass + '">' + ivT('iv_level_tag', { level: record.level }) + '</span>' +
          '<div class="iv-lb-info">' +
            '<span class="iv-lb-name">' + safeName + '</span>' +
            '<span class="iv-lb-meta">' + record.createdAt + '</span>' +
          '</div>' +
          '<span class="iv-record-reward">' + ivT('iv_reward_amount', { amount: formatNumber(record.reward) }) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function openShareWindow(platform) {
    if (!inviteData || !inviteData.loggedIn || !inviteData.inviteLink) {
      alert(ivT('iv_login_required'));
      return;
    }

    var link = inviteData.inviteLink;
    var text = ivT('iv_share_headline');
    var encodedUrl = encodeURIComponent(link);
    var encodedText = encodeURIComponent(text + ' ' + link);
    var shareUrl = '';

    if (platform === 'twitter') {
      shareUrl = 'https://twitter.com/intent/tweet?text=' + encodedText;
    } else if (platform === 'telegram') {
      shareUrl = 'https://t.me/share/url?url=' + encodedUrl + '&text=' + encodeURIComponent(text);
    } else {
      copyText(link).then(function () {
        alert(ivT('iv_alert_copied'));
      });
      return;
    }

    copyText(link).then(function () {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    });
  }

  function initInviteEvents() {
    if (inviteInitialized) return;
    inviteInitialized = true;

    var copyLinkBtn = document.getElementById('iv-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function () {
        if (!inviteData || !inviteData.loggedIn || !inviteData.inviteLink) {
          alert(ivT('iv_login_required'));
          return;
        }
        copyText(inviteData.inviteLink).then(function () {
          alert(ivT('iv_alert_copied'));
        });
      });
    }

    document.querySelectorAll('.invite-share-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openShareWindow(btn.getAttribute('data-share'));
      });
    });

    var friendsTab = document.getElementById('iv-tab-friends');
    var rewardsTab = document.getElementById('iv-tab-rewards');
    if (friendsTab) {
      friendsTab.addEventListener('click', function () {
        inviteRecordsTab = 'friends';
        updateInviteRecordsTabsUI();
        renderInviteRecordsList();
      });
    }
    if (rewardsTab) {
      rewardsTab.addEventListener('click', function () {
        inviteRecordsTab = 'rewards';
        updateInviteRecordsTabsUI();
        renderInviteRecordsList();
      });
    }

    var lbExpandBtn = document.getElementById('iv-leaderboard-expand');
    if (lbExpandBtn) {
      lbExpandBtn.addEventListener('click', function () {
        leaderboardExpanded = !leaderboardExpanded;
        renderLeaderboard();
        applyInviteI18n();
      });
    }

    var miningExpandBtn = document.getElementById('iv-mining-expand');
    if (miningExpandBtn) {
      miningExpandBtn.addEventListener('click', function () {
        miningRecordsExpanded = !miningRecordsExpanded;
        renderMiningRecords();
        applyInviteI18n();
      });
    }

    bindMiningEvents();
  }

  function renderInvitePage() {
    initInviteEvents();
    applyInviteI18n();
    updateInviteRecordsTabsUI();

    if (typeof processPendingInviteRegistration === 'function') {
      processPendingInviteRegistration();
    }

    refreshMiningButtonState().then(function () {
      applyInviteI18n();
    });

    if (inviteDataLoading && !inviteDataLoaded) {
      var countEl = document.getElementById('iv-invite-count');
      if (countEl) countEl.textContent = ivT('iv_loading');
      return;
    }

    var renderAll = function () {
      renderOverview();
      renderLeaderboard();
      renderMiningRecords();
      renderInviteRecordsList();
      applyInviteI18n();
    };

    if (inviteDataLoaded && inviteData) {
      renderAll();
      return;
    }

    loadInvitePageData().then(renderAll);
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      inviteInitialized = false;
      inviteRecordsTab = 'friends';
      leaderboardExpanded = false;
      miningRecordsExpanded = false;
      inviteDataLoaded = false;
      inviteDataLoading = false;
      inviteData = null;
    }
  }

  function handleInviteRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var routeBase = route.split('?')[0] || 'home';
    var invitePage = document.getElementById('invite-page');

    if (invitePage) {
      if (routeBase === 'invite') {
        invitePage.classList.remove('hidden');
        renderInvitePage();
      } else {
        invitePage.classList.add('hidden');
        stopMiningCountdownTicker();
        inviteDataLoaded = false;
        inviteDataLoading = false;
        inviteData = null;
      }
    }
  }

  window.addEventListener('hashchange', handleInviteRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      handleInviteRoute();
      if (typeof processPendingInviteRegistration === 'function') {
        processPendingInviteRegistration();
      }
    }, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleInviteRoute, 0);
    });
  }
})();

// ==========================================
// 16. 管理后台 (#admin)
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var adminInitialized = false;
  var adminAccessGranted = false;
  var adminTab = 'dashboard';
  var allTasks = [];
  var taskSearch = '';
  var taskStatusFilter = 'all';
  var adminUsers = [];
  var adminBroadcasts = [];

  var adminTranslations = {
    zh: {
      ad_page_title: '管理后台',
      ad_denied_title: '无权访问',
      ad_denied_text: '您没有权限访问此页面',
      ad_btn_back_home: '返回首页',
      ad_tab_dashboard: '数据看板',
      ad_tab_tasks: '任务管理',
      ad_tab_users: '用户管理',
      ad_tab_broadcasts: '广播管理',
      ad_tab_withdraw: '提币设置',
      ad_tab_invite: '邀请设置',
      ad_tab_ads: '广告管理',
      ad_ads_title: '广告管理',
      ad_ads_interval: '轮播间隔（秒）',
      ad_ads_slot1: '广告位 1',
      ad_ads_slot2: '广告位 2',
      ad_ads_slot3: '广告位 3',
      ad_ads_slot_name: '广告名称',
      ad_ads_slot_image: '广告图片链接',
      ad_ads_slot_link: '广告目标链接',
      ad_ads_slot_code: '广告代码',
      ad_ads_slot_enabled: '开启此广告位',
      ad_btn_save_ads: '保存',
      ad_ads_save_ok: '广告设置已保存',
      ad_ads_save_fail: '保存广告设置失败：',
      ad_ads_invalid_interval: '请输入有效的轮播间隔（至少 2 秒）',
      ad_invite_title: '邀请设置',
      ad_invite_level1: '一级奖励金额（CRLM）',
      ad_invite_level2: '二级奖励金额（CRLM）',
      ad_btn_save_invite: '保存',
      ad_invite_save_ok: '邀请设置已保存',
      ad_invite_save_fail: '保存邀请设置失败：',
      ad_invite_invalid: '请输入有效的奖励金额',
      ad_dashboard_title: '数据看板',
      ad_tasks_title: '任务管理',
      ad_users_title: '用户管理',
      ad_broadcasts_title: '广播管理',
      ad_withdraw_title: '提币设置',
      ad_withdraw_min: '最小提币金额（CRLM）',
      ad_withdraw_max_tx: '单笔提币上限（CRLM）',
      ad_withdraw_max_daily_user: '每日提币上限（CRLM）',
      ad_withdraw_max_daily_global: '全局每日提币上限（CRLM）',
      ad_btn_save_withdraw: '保存',
      ad_withdraw_save_ok: '提币设置已保存',
      ad_withdraw_save_fail: '保存提币设置失败：',
      ad_withdraw_invalid: '请输入有效的限额数值',
      ad_stat_users: '总用户数',
      ad_stat_tasks: '总任务数',
      ad_stat_active: '进行中任务',
      ad_stat_completed: '已完成任务',
      ad_stat_checkins: '累计空投次数',
      ad_stat_broadcasts: '累计广播数',
      ad_search_tasks: '搜索任务标题...',
      ad_filter_all: '全部状态',
      ad_filter_active: '进行中',
      ad_filter_completed: '已完成',
      ad_filter_cancelled: '已下架',
      ad_filter_high: '高风险',
      ad_modal_cancel_title: '下架任务',
      ad_label_cancel_reason: '下架原因',
      ad_btn_cancel: '取消',
      ad_btn_confirm_cancel: '确认下架',
      ad_btn_high_risk: '标记高风险',
      ad_btn_cancel_task: '下架',
      ad_btn_recommend: '设为推荐',
      ad_btn_unrecommend: '取消推荐',
      ad_btn_publish_official: '发布官方任务',
      ad_modal_publish_official: '发布官方任务',
      ad_label_title: '标题',
      ad_label_type: '类型',
      ad_label_desc: '描述',
      ad_label_req: '要求（每行一条）',
      ad_label_reward: '奖励金额（CRLM）',
      ad_label_slots: '名额',
      ad_label_deadline: '截止时间',
      ad_label_proof: '凭证要求',
      ad_proof_text: '文字凭证',
      ad_proof_screenshot: '截图凭证',
      ad_btn_publish: '发布',
      ad_save_ok: '操作成功',
      ad_alert_required: '请填写所有必填字段',
      ad_btn_ban: '封禁',
      ad_btn_level: '调等级',
      ad_btn_grant: '发放 CRLM',
      ad_modal_grant_title: '发放 CRLM',
      ad_label_grant_amount: '发放数量',
      ad_label_grant_reason: '发放原因（可选）',
      ad_ph_grant_reason: '请输入发放原因',
      ad_grant_user_label: '用户：{name}',
      ad_grant_balance_label: '当前 CRLM 余额：{amount}',
      ad_btn_grant_confirm: '确认发放',
      ad_grant_success: '发放成功！用户 {name} 获得 {amount} CRLM',
      ad_grant_invalid_amount: '请输入有效的发放数量（最小 1）',
      ad_btn_del_broadcast: '删除',
      ad_empty_tasks: '暂无任务',
      ad_empty_users: '暂无用户',
      ad_empty_broadcasts: '暂无广播',
      ad_loading: '加载中...',
      ad_login_required: '请先登录',
      ad_confirm_ban: '确定封禁该用户吗？',
      ad_confirm_del_broadcast: '确定删除该广播吗？',
      ad_save_fail: '操作失败：',
      ad_meta_reward: '奖励',
      ad_meta_publisher: '发布者',
      ad_meta_status: '状态',
      ad_meta_username: '用户名',
      ad_meta_email: '邮箱',
      ad_meta_level: '等级',
      ad_meta_balance: '余额',
      ad_meta_registered: '注册',
      ad_prompt_level: '请输入新等级（数字）：'
    },
    en: {
      ad_page_title: 'Admin Panel',
      ad_denied_title: 'Access Denied',
      ad_denied_text: 'You do not have permission to access this page',
      ad_btn_back_home: 'Back to Home',
      ad_tab_dashboard: 'Dashboard',
      ad_tab_tasks: 'Tasks',
      ad_tab_users: 'Users',
      ad_tab_broadcasts: 'Broadcasts',
      ad_tab_withdraw: 'Withdraw Settings',
      ad_tab_invite: 'Invite Settings',
      ad_tab_ads: 'Ad Management',
      ad_ads_title: 'Ad Management',
      ad_ads_interval: 'Carousel interval (seconds)',
      ad_ads_slot1: 'Ad Slot 1',
      ad_ads_slot2: 'Ad Slot 2',
      ad_ads_slot3: 'Ad Slot 3',
      ad_ads_slot_name: 'Ad name',
      ad_ads_slot_image: 'Image URL',
      ad_ads_slot_link: 'Target URL',
      ad_ads_slot_code: 'Ad code',
      ad_ads_slot_enabled: 'Enable this ad slot',
      ad_btn_save_ads: 'Save',
      ad_ads_save_ok: 'Ad settings saved',
      ad_ads_save_fail: 'Failed to save ad settings: ',
      ad_ads_invalid_interval: 'Please enter a valid interval (minimum 2 seconds)',
      ad_invite_title: 'Invite Settings',
      ad_invite_level1: 'Level 1 reward (CRLM)',
      ad_invite_level2: 'Level 2 reward (CRLM)',
      ad_btn_save_invite: 'Save',
      ad_invite_save_ok: 'Invite settings saved',
      ad_invite_save_fail: 'Failed to save invite settings: ',
      ad_invite_invalid: 'Please enter valid reward amounts',
      ad_dashboard_title: 'Dashboard',
      ad_tasks_title: 'Task Management',
      ad_users_title: 'User Management',
      ad_broadcasts_title: 'Broadcast Management',
      ad_withdraw_title: 'Withdraw Settings',
      ad_withdraw_min: 'Minimum withdrawal (CRLM)',
      ad_withdraw_max_tx: 'Max per withdrawal (CRLM)',
      ad_withdraw_max_daily_user: 'Daily limit per user (CRLM)',
      ad_withdraw_max_daily_global: 'Global daily limit (CRLM)',
      ad_btn_save_withdraw: 'Save',
      ad_withdraw_save_ok: 'Withdraw settings saved',
      ad_withdraw_save_fail: 'Failed to save withdraw settings: ',
      ad_withdraw_invalid: 'Please enter valid limit values',
      ad_stat_users: 'Total Users',
      ad_stat_tasks: 'Total Tasks',
      ad_stat_active: 'Active Tasks',
      ad_stat_completed: 'Completed Tasks',
      ad_stat_checkins: 'Total Airdrops',
      ad_stat_broadcasts: 'Total Broadcasts',
      ad_search_tasks: 'Search task title...',
      ad_filter_all: 'All Status',
      ad_filter_active: 'Active',
      ad_filter_completed: 'Completed',
      ad_filter_cancelled: 'Removed',
      ad_filter_high: 'High Risk',
      ad_modal_cancel_title: 'Remove Task',
      ad_label_cancel_reason: 'Reason',
      ad_btn_cancel: 'Cancel',
      ad_btn_confirm_cancel: 'Confirm Remove',
      ad_btn_high_risk: 'Mark High Risk',
      ad_btn_cancel_task: 'Remove',
      ad_btn_recommend: 'Feature',
      ad_btn_unrecommend: 'Unfeature',
      ad_btn_publish_official: 'Publish Official Task',
      ad_modal_publish_official: 'Publish Official Task',
      ad_label_title: 'Title',
      ad_label_type: 'Type',
      ad_label_desc: 'Description',
      ad_label_req: 'Requirements (one per line)',
      ad_label_reward: 'Reward (CRLM)',
      ad_label_slots: 'Slots',
      ad_label_deadline: 'Deadline',
      ad_label_proof: 'Proof Type',
      ad_proof_text: 'Text Proof',
      ad_proof_screenshot: 'Screenshot Proof',
      ad_btn_publish: 'Publish',
      ad_save_ok: 'Saved successfully',
      ad_alert_required: 'Please fill in all required fields',
      ad_btn_ban: 'Ban',
      ad_btn_level: 'Set Level',
      ad_btn_grant: 'Grant CRLM',
      ad_modal_grant_title: 'Grant CRLM',
      ad_label_grant_amount: 'Amount',
      ad_label_grant_reason: 'Reason (optional)',
      ad_ph_grant_reason: 'Enter reason',
      ad_grant_user_label: 'User: {name}',
      ad_grant_balance_label: 'Current CRLM balance: {amount}',
      ad_btn_grant_confirm: 'Confirm Grant',
      ad_grant_success: 'Granted successfully! User {name} received {amount} CRLM',
      ad_grant_invalid_amount: 'Please enter a valid amount (minimum 1)',
      ad_btn_del_broadcast: 'Delete',
      ad_empty_tasks: 'No tasks',
      ad_empty_users: 'No users',
      ad_empty_broadcasts: 'No broadcasts',
      ad_loading: 'Loading...',
      ad_login_required: 'Please sign in first',
      ad_confirm_ban: 'Ban this user?',
      ad_confirm_del_broadcast: 'Delete this broadcast?',
      ad_save_fail: 'Operation failed: ',
      ad_meta_reward: 'Reward',
      ad_meta_publisher: 'Publisher',
      ad_meta_status: 'Status',
      ad_meta_username: 'Username',
      ad_meta_email: 'Email',
      ad_meta_level: 'Level',
      ad_meta_balance: 'Balance',
      ad_meta_registered: 'Registered',
      ad_prompt_level: 'Enter new level (number):'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function adT(key, vars) {
    var dict = adminTranslations[getLang()];
    var text = dict[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.replace('{' + k + '}', vars[k]);
      });
    }
    return text;
  }

  function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function safeText(str) {
    return typeof escapeHtml === 'function' ? escapeHtml(str) : String(str || '');
  }

  function applyAdminI18n() {
    document.querySelectorAll('#admin-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (adminTranslations[getLang()][key]) {
        el.textContent = adT(key);
      }
    });
    document.querySelectorAll('#admin-page [data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (adminTranslations[getLang()][key]) {
        el.setAttribute('placeholder', adT(key));
      }
    });
  }

  function showAdminAccess(allowed) {
    adminAccessGranted = !!allowed;
    var denied = document.getElementById('admin-denied');
    var content = document.getElementById('admin-content');
    if (denied) denied.classList.toggle('hidden', allowed);
    if (content) content.classList.toggle('hidden', !allowed);
  }

  function switchAdminTab(tab) {
    if (!adminAccessGranted) return;
    adminTab = tab;
    document.querySelectorAll('#admin-page .admin-tab').forEach(function (btn) {
      if (btn.getAttribute('data-admin-tab') === tab) {
        btn.classList.add('admin-tab-active');
      } else {
        btn.classList.remove('admin-tab-active');
      }
    });
    document.querySelectorAll('#admin-page .admin-panel').forEach(function (panel) {
      panel.classList.add('hidden');
    });
    var target = document.getElementById('admin-panel-' + tab);
    if (target) target.classList.remove('hidden');
    loadActiveAdminTab();
  }

  function displayUserLabel(user) {
    if (!user) return 'Unknown';
    if (user.username) return user.username;
    if (user.email) return user.email;
    if (user.wallet_address) return user.wallet_address;
    return String(user.id || '').slice(0, 8);
  }

  function parseRequirementsText(text) {
    return String(text || '').split('\n').map(function (line) { return line.trim(); }).filter(Boolean);
  }

  function getDefaultOfficialDeadline() {
    var date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }

  function getFilteredTasks() {
    var keyword = taskSearch.trim().toLowerCase();
    return allTasks.filter(function (task) {
      if (keyword && String(task.title || '').toLowerCase().indexOf(keyword) < 0) {
        return false;
      }
      if (taskStatusFilter === 'high') {
        return task.risk_level === 'high';
      }
      if (taskStatusFilter !== 'all') {
        return (task.status || 'active') === taskStatusFilter;
      }
      return true;
    });
  }

  async function loadAllTasks() {
    if (!window.supabase) return;
    var result = await window.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (result.error) {
      console.warn('加载任务失败:', result.error);
      allTasks = [];
      return;
    }

    var tasks = result.data || [];
    var publisherIds = tasks.map(function (t) { return t.publisher_id; }).filter(Boolean);
    var uniqueIds = publisherIds.filter(function (id, i) { return publisherIds.indexOf(id) === i; });

    if (!uniqueIds.length) {
      allTasks = tasks;
      return;
    }

    var usersResult = await window.supabase.from('users').select('id, username, email, wallet_address').in('id', uniqueIds);
    var userMap = {};
    if (!usersResult.error && usersResult.data) {
      usersResult.data.forEach(function (u) { userMap[u.id] = u; });
    }

    allTasks = tasks.map(function (task) {
      task._publisherName = displayUserLabel(userMap[task.publisher_id]);
      return task;
    });
  }

  function renderTaskList() {
    var listEl = document.getElementById('ad-task-list');
    if (!listEl) return;

    var tasks = getFilteredTasks();
    if (!tasks.length) {
      listEl.innerHTML = '<p class="admin-empty">' + adT('ad_empty_tasks') + '</p>';
      return;
    }

    listEl.innerHTML = tasks.map(function (task) {
      var highTag = task.risk_level === 'high' ? '<span class="admin-tag-high">HIGH</span>' : '';
      var cancelled = task.status === 'cancelled';
      var officialTag = task.is_official ? '<span class="admin-tag-official">OFFICIAL</span>' : '';
      return (
        '<div class="admin-row">' +
          '<div class="admin-row-main">' +
            '<p class="admin-row-title">' + safeText(task.title) + highTag + officialTag + '</p>' +
            '<p class="admin-row-meta">' +
              adT('ad_meta_publisher') + ': ' + safeText(task._publisherName) + ' · ' +
              safeText(task.type || task.task_type) + ' · ' +
              adT('ad_meta_reward') + ' ' + formatNumber(Number(task.reward_amount) || 0) + ' CRLM · ' +
              adT('ad_meta_status') + ': ' + safeText(task.status || 'active') +
            '</p>' +
          '</div>' +
          '<div class="admin-row-actions">' +
            (task.is_official
              ? '<button type="button" class="admin-primary-btn ad-task-unrecommend" data-id="' + safeText(task.id) + '">' + adT('ad_btn_unrecommend') + '</button>'
              : '<button type="button" class="admin-ghost-btn ad-task-recommend" data-id="' + safeText(task.id) + '">' + adT('ad_btn_recommend') + '</button>') +
            (cancelled ? '' : '<button type="button" class="admin-warning-btn ad-task-risk" data-id="' + safeText(task.id) + '">' + adT('ad_btn_high_risk') + '</button>') +
            (cancelled ? '' : '<button type="button" class="admin-danger-btn ad-task-cancel" data-id="' + safeText(task.id) + '">' + adT('ad_btn_cancel_task') + '</button>') +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  async function markTaskHighRisk(taskId) {
    var result = await window.supabase.from('tasks').update({ risk_level: 'high' }).eq('id', taskId);
    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }
    await loadAllTasks();
    renderTaskList();
  }

  async function toggleTaskOfficialRecommend(taskId, makeOfficial) {
    var result = await window.supabase.from('tasks').update({ is_official: !!makeOfficial }).eq('id', taskId);
    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }
    await loadAllTasks();
    renderTaskList();
  }

  function openOfficialPublishModal() {
    var modal = document.getElementById('ad-official-modal');
    var form = document.getElementById('ad-official-form');
    if (!modal) return;
    if (form) form.reset();
    var deadline = document.getElementById('ad-official-deadline');
    if (deadline) deadline.value = getDefaultOfficialDeadline();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    applyAdminI18n();
  }

  function closeOfficialPublishModal() {
    var modal = document.getElementById('ad-official-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  async function submitOfficialTask(e) {
    if (e) e.preventDefault();
    if (!window.supabase) return;

    var title = document.getElementById('ad-official-title').value.trim();
    var type = document.getElementById('ad-official-type').value;
    var description = document.getElementById('ad-official-desc').value.trim();
    var requirements = parseRequirementsText(document.getElementById('ad-official-reqs').value);
    var rewardAmount = parseFloat(document.getElementById('ad-official-reward').value);
    var slotsVal = document.getElementById('ad-official-slots').value.trim();
    var deadline = document.getElementById('ad-official-deadline').value;
    var proofType = document.getElementById('ad-official-proof').value;

    if (!title || !description || !requirements.length || !deadline || isNaN(rewardAmount) || rewardAmount <= 0) {
      alert(adT('ad_alert_required'));
      return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(adT('ad_login_required'));
      return;
    }

    var maxParticipants = slotsVal ? parseInt(slotsVal, 10) : null;
    if (maxParticipants !== null && isNaN(maxParticipants)) maxParticipants = null;

    var payload = {
      publisher_id: userId,
      title: title,
      type: type,
      description: description,
      requirements: requirements,
      reward_type: 'CRLM',
      reward_amount: rewardAmount,
      max_participants: maxParticipants,
      deadline: deadline,
      proof_type: proofType,
      is_official: true,
      status: 'active',
      current_participants: 0
    };

    var result = await window.supabase.from('tasks').insert(payload);
    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }

    alert(adT('ad_save_ok'));
    closeOfficialPublishModal();
    await loadAllTasks();
    renderTaskList();
  }

  function openCancelModal(taskId) {
    var modal = document.getElementById('ad-cancel-modal');
    document.getElementById('ad-cancel-task-id').value = taskId;
    document.getElementById('ad-cancel-reason').value = '';
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCancelModal() {
    var modal = document.getElementById('ad-cancel-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  async function confirmCancelTask() {
    var taskId = document.getElementById('ad-cancel-task-id').value;
    var reason = document.getElementById('ad-cancel-reason').value.trim();
    if (!reason) return;

    var result = await window.supabase.from('tasks').update({
      status: 'cancelled',
      review_comment: reason
    }).eq('id', taskId);

    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }

    closeCancelModal();
    await loadAllTasks();
    renderTaskList();
  }

  async function loadAdminUsers() {
    if (!window.supabase) return;
    var result = await window.supabase.from('users').select('*').order('created_at', { ascending: false });
    adminUsers = result.error ? [] : (result.data || []);
  }

  function renderUsersList() {
    var listEl = document.getElementById('ad-users-list');
    if (!listEl) return;

    if (!adminUsers.length) {
      listEl.innerHTML = '<p class="admin-empty">' + adT('ad_empty_users') + '</p>';
      return;
    }

    listEl.innerHTML = adminUsers.map(function (user) {
      var bannedTag = user.is_banned ? '<span class="admin-tag-high">BANNED</span>' : '';
      return (
        '<div class="admin-row">' +
          '<div class="admin-row-main">' +
            '<p class="admin-row-title">' + safeText(displayUserLabel(user)) + bannedTag + '</p>' +
            '<p class="admin-row-meta">' +
              adT('ad_meta_email') + ': ' + safeText(user.email || '—') + ' · ' +
              adT('ad_meta_level') + ' Lv.' + (user.level != null ? user.level : 0) +
              ' · ' + adT('ad_meta_balance') + ' ' + formatNumber(Number(user.crlm_balance) || 0) + ' CRLM' +
              ' · ' + adT('ad_meta_registered') + ' ' + safeText(String(user.created_at || '').slice(0, 10)) +
            '</p>' +
          '</div>' +
          '<div class="admin-row-actions">' +
            (adminAccessGranted
              ? '<button type="button" class="admin-gold-btn-sm ad-user-grant" data-id="' + safeText(user.id) + '">' + adT('ad_btn_grant') + '</button>'
              : '') +
            '<button type="button" class="admin-ghost-btn ad-user-level" data-id="' + safeText(user.id) + '">' + adT('ad_btn_level') + '</button>' +
            '<button type="button" class="admin-danger-btn ad-user-ban" data-id="' + safeText(user.id) + '"' + (user.is_banned ? ' disabled' : '') + '>' + adT('ad_btn_ban') + '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  async function banUser(userId) {
    if (!confirm(adT('ad_confirm_ban'))) return;

    var banResult = await window.supabase.from('users').update({ is_banned: true }).eq('id', userId);
    if (banResult.error) {
      alert(adT('ad_save_fail') + banResult.error.message);
      return;
    }

    await loadAdminUsers();
    renderUsersList();
  }

  async function setUserLevel(userId) {
    var input = prompt(adT('ad_prompt_level'));
    if (input == null || input.trim() === '') return;
    var level = parseInt(input, 10);
    if (isNaN(level) || level < 0) return;

    var result = await window.supabase.from('users').update({ level: level }).eq('id', userId);
    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }

    await loadAdminUsers();
    renderUsersList();
  }

  function openGrantModal(userId) {
    if (!adminAccessGranted) return;

    var user = adminUsers.find(function (u) { return u.id === userId; });
    if (!user) return;

    var idInput = document.getElementById('ad-grant-user-id');
    var usernameEl = document.getElementById('ad-grant-username');
    var balanceEl = document.getElementById('ad-grant-balance');
    var amountInput = document.getElementById('ad-grant-amount');
    var reasonInput = document.getElementById('ad-grant-reason');
    var modal = document.getElementById('ad-grant-modal');

    if (idInput) idInput.value = userId;
    if (usernameEl) {
      usernameEl.textContent = adT('ad_grant_user_label', { name: displayUserLabel(user) });
    }
    if (balanceEl) {
      balanceEl.textContent = adT('ad_grant_balance_label', {
        amount: formatNumber(Number(user.crlm_balance) || 0)
      });
    }
    if (amountInput) amountInput.value = '';
    if (reasonInput) reasonInput.value = '';

    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeGrantModal() {
    var modal = document.getElementById('ad-grant-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  async function confirmGrantCrlm() {
    if (!adminAccessGranted || !window.supabase) return;

    var userId = document.getElementById('ad-grant-user-id');
    var amountInput = document.getElementById('ad-grant-amount');
    if (!userId || !amountInput) return;

    var amount = parseInt(amountInput.value, 10);
    if (isNaN(amount) || amount < 1) {
      alert(adT('ad_grant_invalid_amount'));
      return;
    }

    var user = adminUsers.find(function (u) { return u.id === userId.value; });
    if (!user) return;

    var currentBalance = Number(user.crlm_balance) || 0;
    var newBalance = currentBalance + amount;

    var result = await window.supabase
      .from('users')
      .update({ crlm_balance: newBalance })
      .eq('id', userId.value);

    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }

    alert(adT('ad_grant_success', {
      name: displayUserLabel(user),
      amount: formatNumber(amount)
    }));

    closeGrantModal();
    await loadAdminUsers();
    renderUsersList();
  }

  async function loadDashboard() {
    if (!window.supabase) return;

    var results = await Promise.all([
      window.supabase.from('users').select('*', { count: 'exact', head: true }),
      window.supabase.from('tasks').select('*', { count: 'exact', head: true }),
      window.supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      window.supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      window.supabase.from('checkins').select('*', { count: 'exact', head: true }),
      window.supabase.from('broadcasts').select('*', { count: 'exact', head: true })
    ]);

    var usersEl = document.getElementById('ad-stat-users');
    var tasksEl = document.getElementById('ad-stat-tasks');
    var activeEl = document.getElementById('ad-stat-active');
    var completedEl = document.getElementById('ad-stat-completed');
    var checkinsEl = document.getElementById('ad-stat-checkins');
    var broadcastsEl = document.getElementById('ad-stat-broadcasts');

    if (usersEl) usersEl.textContent = formatNumber(results[0].count || 0);
    if (tasksEl) tasksEl.textContent = formatNumber(results[1].count || 0);
    if (activeEl) activeEl.textContent = formatNumber(results[2].count || 0);
    if (completedEl) completedEl.textContent = formatNumber(results[3].count || 0);
    if (checkinsEl) checkinsEl.textContent = formatNumber(results[4].count || 0);
    if (broadcastsEl) broadcastsEl.textContent = formatNumber(results[5].count || 0);
  }

  async function loadAdminBroadcasts() {
    if (!window.supabase) return;
    var result = await window.supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
    adminBroadcasts = result.error ? [] : (result.data || []);
  }

  function renderBroadcastList() {
    var listEl = document.getElementById('ad-broadcast-list');
    if (!listEl) return;

    if (!adminBroadcasts.length) {
      listEl.innerHTML = '<p class="admin-empty">' + adT('ad_empty_broadcasts') + '</p>';
      return;
    }

    listEl.innerHTML = adminBroadcasts.map(function (item) {
      return (
        '<div class="admin-row">' +
          '<div class="admin-row-main">' +
            '<p class="admin-row-title">' + safeText(item.description) + '</p>' +
            '<p class="admin-row-meta">' + safeText(item.event_type) + ' · ' + safeText(String(item.created_at || '').slice(0, 19)) +
              (item.reward_amount ? ' · ' + formatNumber(Number(item.reward_amount)) + ' CRLM' : '') +
            '</p>' +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button type="button" class="admin-danger-btn ad-broadcast-delete" data-id="' + safeText(item.id) + '">' + adT('ad_btn_del_broadcast') + '</button>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  async function deleteBroadcast(id) {
    if (!confirm(adT('ad_confirm_del_broadcast'))) return;
    var result = await window.supabase.from('broadcasts').delete().eq('id', id);
    if (result.error) {
      alert(adT('ad_save_fail') + result.error.message);
      return;
    }
    await loadAdminBroadcasts();
    renderBroadcastList();
  }

  async function loadActiveAdminTab() {
    if (!adminAccessGranted) return;

    if (adminTab === 'dashboard') {
      await loadDashboard();
    } else if (adminTab === 'tasks') {
      await loadAllTasks();
      renderTaskList();
    } else if (adminTab === 'users') {
      await loadAdminUsers();
      renderUsersList();
    } else if (adminTab === 'broadcasts') {
      await loadAdminBroadcasts();
      renderBroadcastList();
    } else if (adminTab === 'withdraw') {
      await loadAdminWithdrawSettings();
    } else if (adminTab === 'invite') {
      await loadAdminInviteSettings();
    } else if (adminTab === 'ads') {
      await loadAdminAdsSettings();
    }
  }

  async function loadAdminWithdrawSettings() {
    var settings = await fetchWithdrawSettings();
    var minEl = document.getElementById('ad-withdraw-min');
    var maxTxEl = document.getElementById('ad-withdraw-max-tx');
    var maxDailyUserEl = document.getElementById('ad-withdraw-max-daily-user');
    var maxDailyGlobalEl = document.getElementById('ad-withdraw-max-daily-global');

    if (minEl) minEl.value = String(settings.withdraw_min_amount);
    if (maxTxEl) maxTxEl.value = String(settings.withdraw_max_per_tx);
    if (maxDailyUserEl) maxDailyUserEl.value = String(settings.withdraw_max_daily_user);
    if (maxDailyGlobalEl) maxDailyGlobalEl.value = String(settings.withdraw_max_daily_global);
  }

  async function saveAdminWithdrawSettings() {
    if (!window.supabase) return;

    var min = Number(document.getElementById('ad-withdraw-min') && document.getElementById('ad-withdraw-min').value);
    var maxTx = Number(document.getElementById('ad-withdraw-max-tx') && document.getElementById('ad-withdraw-max-tx').value);
    var maxDailyUser = Number(document.getElementById('ad-withdraw-max-daily-user') && document.getElementById('ad-withdraw-max-daily-user').value);
    var maxDailyGlobal = Number(document.getElementById('ad-withdraw-max-daily-global') && document.getElementById('ad-withdraw-max-daily-global').value);

    if (!Number.isFinite(min) || min <= 0 ||
        !Number.isFinite(maxTx) || maxTx <= 0 ||
        !Number.isFinite(maxDailyUser) || maxDailyUser <= 0 ||
        !Number.isFinite(maxDailyGlobal) || maxDailyGlobal <= 0) {
      alert(adT('ad_withdraw_invalid'));
      return;
    }

    var rows = [
      { key: 'withdraw_min_amount', value: String(min) },
      { key: 'withdraw_max_per_tx', value: String(maxTx) },
      { key: 'withdraw_max_daily_user', value: String(maxDailyUser) },
      { key: 'withdraw_max_daily_global', value: String(maxDailyGlobal) }
    ];

    var result = await window.supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' });

    if (result.error) {
      alert(adT('ad_withdraw_save_fail') + result.error.message);
      return;
    }

    invalidateWithdrawSettingsCache();
    alert(adT('ad_withdraw_save_ok'));
  }

  async function loadAdminInviteSettings() {
    var settings = await fetchInviteSettings();
    var level1El = document.getElementById('ad-invite-level1');
    var level2El = document.getElementById('ad-invite-level2');

    if (level1El) level1El.value = String(settings.invite_level1_reward);
    if (level2El) level2El.value = String(settings.invite_level2_reward);
  }

  async function saveAdminInviteSettings() {
    if (!window.supabase) return;

    var level1 = Number(document.getElementById('ad-invite-level1') && document.getElementById('ad-invite-level1').value);
    var level2 = Number(document.getElementById('ad-invite-level2') && document.getElementById('ad-invite-level2').value);

    if (!Number.isFinite(level1) || level1 < 0 || !Number.isFinite(level2) || level2 < 0) {
      alert(adT('ad_invite_invalid'));
      return;
    }

    var rows = [
      { key: 'invite_level1_reward', value: String(level1) },
      { key: 'invite_level2_reward', value: String(level2) }
    ];

    var result = await window.supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' });

    if (result.error) {
      alert(adT('ad_invite_save_fail') + result.error.message);
      return;
    }

    invalidateInviteSettingsCache();
    alert(adT('ad_invite_save_ok'));
  }

  async function loadAdminAdsSettings() {
    var config = await fetchAdsConfig();
    var intervalEl = document.getElementById('ad-ads-interval');
    if (intervalEl) intervalEl.value = String(config.interval);

    config.ads.forEach(function (ad, index) {
      var nameEl = document.getElementById('ad-ads-name-' + index);
      var imageEl = document.getElementById('ad-ads-image-' + index);
      var linkEl = document.getElementById('ad-ads-link-' + index);
      var codeEl = document.getElementById('ad-ads-code-' + index);
      var enabledEl = document.getElementById('ad-ads-enabled-' + index);

      if (nameEl) nameEl.value = ad.name || '';
      if (imageEl) imageEl.value = ad.image || '';
      if (linkEl) linkEl.value = ad.link || '';
      if (codeEl) codeEl.value = ad.code || '';
      if (enabledEl) enabledEl.checked = !!ad.enabled;
    });
  }

  async function saveAdminAdsSettings() {
    if (!window.supabase) return;

    var interval = Number(document.getElementById('ad-ads-interval') && document.getElementById('ad-ads-interval').value);
    if (!Number.isFinite(interval) || interval < 2) {
      alert(adT('ad_ads_invalid_interval'));
      return;
    }

    var ads = [];
    for (var i = 0; i < 3; i++) {
      var nameEl = document.getElementById('ad-ads-name-' + i);
      var imageEl = document.getElementById('ad-ads-image-' + i);
      var linkEl = document.getElementById('ad-ads-link-' + i);
      var codeEl = document.getElementById('ad-ads-code-' + i);
      var enabledEl = document.getElementById('ad-ads-enabled-' + i);

      ads.push({
        name: nameEl ? String(nameEl.value || '').trim() : '',
        image: imageEl ? String(imageEl.value || '').trim() : '',
        link: linkEl ? String(linkEl.value || '').trim() : '',
        code: codeEl ? String(codeEl.value || '') : '',
        enabled: !!(enabledEl && enabledEl.checked)
      });
    }

    var payload = {
      interval: interval,
      ads: ads
    };

    var result = await window.supabase
      .from('settings')
      .upsert([{ key: 'ads_config', value: JSON.stringify(payload) }], { onConflict: 'key' });

    if (result.error) {
      alert(adT('ad_ads_save_fail') + result.error.message);
      return;
    }

    invalidateAdsConfigCache();
    if (typeof initAdsCarousel === 'function') {
      initAdsCarousel();
    }
    alert(adT('ad_ads_save_ok'));
  }

  function initAdminEvents() {
    if (adminInitialized) return;
    adminInitialized = true;

    document.querySelectorAll('#admin-page .admin-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchAdminTab(btn.getAttribute('data-admin-tab'));
      });
    });

    var searchInput = document.getElementById('ad-task-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        taskSearch = searchInput.value;
        renderTaskList();
      });
    }

    var filterSelect = document.getElementById('ad-task-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', function () {
        taskStatusFilter = filterSelect.value;
        renderTaskList();
      });
    }

    var taskList = document.getElementById('ad-task-list');
    if (taskList) {
      taskList.addEventListener('click', function (e) {
        var recommendBtn = e.target.closest('.ad-task-recommend');
        var unrecommendBtn = e.target.closest('.ad-task-unrecommend');
        var riskBtn = e.target.closest('.ad-task-risk');
        var cancelBtn = e.target.closest('.ad-task-cancel');
        if (recommendBtn) toggleTaskOfficialRecommend(recommendBtn.getAttribute('data-id'), true);
        if (unrecommendBtn) toggleTaskOfficialRecommend(unrecommendBtn.getAttribute('data-id'), false);
        if (riskBtn) markTaskHighRisk(riskBtn.getAttribute('data-id'));
        if (cancelBtn) openCancelModal(cancelBtn.getAttribute('data-id'));
      });
    }

    var officialAddBtn = document.getElementById('ad-official-add-btn');
    if (officialAddBtn) {
      officialAddBtn.addEventListener('click', openOfficialPublishModal);
    }

    var officialForm = document.getElementById('ad-official-form');
    if (officialForm) {
      officialForm.addEventListener('submit', submitOfficialTask);
    }

    var officialCancelBtn = document.getElementById('ad-official-cancel');
    if (officialCancelBtn) {
      officialCancelBtn.addEventListener('click', closeOfficialPublishModal);
    }

    var usersList = document.getElementById('ad-users-list');
    if (usersList) {
      usersList.addEventListener('click', function (e) {
        var grantBtn = e.target.closest('.ad-user-grant');
        var banBtn = e.target.closest('.ad-user-ban');
        var levelBtn = e.target.closest('.ad-user-level');
        if (grantBtn) openGrantModal(grantBtn.getAttribute('data-id'));
        if (banBtn && !banBtn.disabled) banUser(banBtn.getAttribute('data-id'));
        if (levelBtn) setUserLevel(levelBtn.getAttribute('data-id'));
      });
    }

    var broadcastList = document.getElementById('ad-broadcast-list');
    if (broadcastList) {
      broadcastList.addEventListener('click', function (e) {
        var delBtn = e.target.closest('.ad-broadcast-delete');
        if (delBtn) deleteBroadcast(delBtn.getAttribute('data-id'));
      });
    }

    var cancelClose = document.getElementById('ad-cancel-close');
    var cancelConfirm = document.getElementById('ad-cancel-confirm');
    if (cancelClose) cancelClose.addEventListener('click', closeCancelModal);
    if (cancelConfirm) cancelConfirm.addEventListener('click', confirmCancelTask);

    var grantCancel = document.getElementById('ad-grant-cancel');
    var grantConfirm = document.getElementById('ad-grant-confirm');
    if (grantCancel) grantCancel.addEventListener('click', closeGrantModal);
    if (grantConfirm) grantConfirm.addEventListener('click', confirmGrantCrlm);

    var withdrawSaveBtn = document.getElementById('ad-withdraw-save-btn');
    if (withdrawSaveBtn) {
      withdrawSaveBtn.addEventListener('click', saveAdminWithdrawSettings);
    }

    var inviteSaveBtn = document.getElementById('ad-invite-save-btn');
    if (inviteSaveBtn) {
      inviteSaveBtn.addEventListener('click', saveAdminInviteSettings);
    }

    var adsSaveBtn = document.getElementById('ad-ads-save-btn');
    if (adsSaveBtn) {
      adsSaveBtn.addEventListener('click', saveAdminAdsSettings);
    }

    document.querySelectorAll('#ad-cancel-modal .admin-modal-overlay, #ad-official-modal .admin-modal-overlay, #ad-grant-modal .admin-modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function () {
        closeCancelModal();
        closeOfficialPublishModal();
        closeGrantModal();
      });
    });
  }

  async function renderAdminPage() {
    initAdminEvents();
    applyAdminI18n();
    switchAdminTab(adminTab);
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      adminInitialized = false;
      adminTab = 'dashboard';
    }
  }

  async function handleAdminRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var routeBase = route.split('?')[0] || 'home';
    var adminPage = document.getElementById('admin-page');

    if (!adminPage) return;

    if (routeBase === 'admin') {
      adminPage.classList.remove('hidden');
      showAdminAccess(false);

      var allowed = false;
      if (typeof isAdminUser === 'function') {
        allowed = await isAdminUser();
      }

      showAdminAccess(allowed);
      if (allowed) {
        await renderAdminPage();
      } else {
        applyAdminI18n();
      }
    } else {
      adminPage.classList.add('hidden');
      adminAccessGranted = false;
    }
  }

  window.addEventListener('hashchange', handleAdminRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleAdminRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleAdminRoute, 0);
    });
  }
})();

// ==========================================
// 17. 简单任务页 (#simple-tasks)
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var simpleTasksInitialized = false;
  var simpleTasksLoading = false;
  var simpleTasksList = [];
  var userSimpleSubmissionMap = {};
  var claimInProgress = false;

  var simpleTasksTranslations = {
    zh: {
      st_page_title: '⚡ 简单任务',
      st_page_subtitle: '一键完成，快速赚取 CRLM',
      st_loading: '加载中...',
      st_empty: '暂无简单任务，稍后再来看看吧',
      st_btn_create: '发布简单任务',
      st_btn_claim: '一键领取',
      st_btn_continue: '继续任务',
      st_btn_claimed: '已领取',
      st_btn_full: '已满员',
      st_label_slots: '剩余名额',
      st_label_deadline: '截止时间',
      st_claim_success: '领取成功！请按照任务要求完成操作。',
      st_login_required: '请先登录后再领取',
      st_already_claimed: '你已领取过该任务',
      st_task_full: '任务名额已满',
      st_claim_fail: '领取失败：'
    },
    en: {
      st_page_title: '⚡ Simple Tasks',
      st_page_subtitle: 'Complete in one tap, earn CRLM fast',
      st_loading: 'Loading...',
      st_empty: 'No simple tasks yet. Check back later.',
      st_btn_create: 'Post a Simple Task',
      st_btn_claim: 'Claim Now',
      st_btn_continue: 'Continue',
      st_btn_claimed: 'Claimed',
      st_btn_full: 'Full',
      st_label_slots: 'Slots left',
      st_label_deadline: 'Deadline',
      st_claim_success: 'Claimed! Please complete the task as required.',
      st_login_required: 'Please sign in before claiming',
      st_already_claimed: 'You have already claimed this task',
      st_task_full: 'This task is full',
      st_claim_fail: 'Claim failed: '
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function stT(key, vars) {
    var dict = simpleTasksTranslations[getLang()];
    var text = dict[key] || (translations[getLang()] && translations[getLang()][key]) || key;
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

  function formatStDeadline(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    if (getLang() === 'zh') {
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
    }
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatStReward(task) {
    var amount = Number(task && task.reward_amount) || 0;
    var unit = (task && task.reward_type) || 'CRLM';
    return amount.toLocaleString('en-US') + ' ' + unit;
  }

  function hideOtherPagesForSimpleTasks() {
    if (!appContentEl) return;
    Array.prototype.forEach.call(appContentEl.children, function (child) {
      if (!child.id) return;
      if (child.id === 'simple-tasks-page') {
        child.classList.remove('hidden');
      } else {
        child.classList.add('hidden');
      }
    });
  }

  function applySimpleTasksI18n() {
    document.querySelectorAll('#simple-tasks-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (simpleTasksTranslations[getLang()][key]) {
        el.textContent = stT(key);
      } else if (translations[getLang()] && translations[getLang()][key]) {
        el.textContent = translations[getLang()][key];
      }
    });
  }

  function getTaskSlotsText(task) {
    var maxParticipants = task.max_participants != null ? Number(task.max_participants) : null;
    var currentParticipants = Number(task.current_participants) || 0;
    if (maxParticipants != null) {
      var left = Math.max(0, maxParticipants - currentParticipants);
      return left + '/' + maxParticipants;
    }
    return String(currentParticipants);
  }

  function isTaskFull(task) {
    var max = task.max_participants != null ? Number(task.max_participants) : null;
    var current = Number(task.current_participants) || 0;
    return max != null && current >= max;
  }

  function buildSimpleTaskCardHtml(task) {
    var taskId = escapeHtml(task.id);
    var title = escapeHtml(task.title || '');
    var reward = escapeHtml(formatStReward(task));
    var slots = escapeHtml(getTaskSlotsText(task));
    var deadline = escapeHtml(formatStDeadline(task.deadline));
    var hasSubmission = !!userSimpleSubmissionMap[task.id];
    var full = isTaskFull(task);

    var btnClass = 'simple-task-claim-btn';
    var btnText = stT('st_btn_claim');
    var btnDisabled = '';

    if (hasSubmission) {
      var sub = userSimpleSubmissionMap[task.id];
      var platformTask = isSimplePlatformVerifiableTask(task);

      if (platformTask) {
        if (sub.status === 'approved') {
          btnClass += ' simple-task-claim-btn-done';
          btnText = stT('st_btn_claimed');
          btnDisabled = ' disabled';
        } else {
          btnClass += ' simple-task-claim-btn-continue';
          btnText = stT('st_btn_continue');
        }
      } else {
        var isDone = sub && (sub.status === 'approved' || sub.status === 'submitted');
        if (isDone || hasSubmission) {
          btnClass += ' simple-task-claim-btn-done';
          btnText = stT('st_btn_claimed');
          btnDisabled = ' disabled';
        }
      }
    } else if (full) {
      btnClass += ' simple-task-claim-btn-disabled';
      btnText = stT('st_btn_full');
      btnDisabled = ' disabled';
    }

    return (
      '<article class="simple-task-card" data-task-id="' + taskId + '">' +
        '<div class="simple-task-card-badge" aria-hidden="true">⚡</div>' +
        '<h3 class="simple-task-card-title">' + title + '</h3>' +
        '<div class="simple-task-card-reward">' + reward + '</div>' +
        '<p class="simple-task-card-meta">' + escapeHtml(stT('st_label_slots')) + '：' + slots + '</p>' +
        '<p class="simple-task-card-meta">' + escapeHtml(stT('st_label_deadline')) + '：' + deadline + '</p>' +
        '<button type="button" class="' + btnClass + '" data-task-id="' + taskId + '"' + btnDisabled + '>' +
          escapeHtml(btnText) +
        '</button>' +
      '</article>'
    );
  }

  function renderSimpleTasksGrid() {
    var gridEl = document.getElementById('st-task-grid');
    var emptyEl = document.getElementById('st-empty-state');
    if (!gridEl || !emptyEl) return;

    if (!simpleTasksList.length) {
      gridEl.innerHTML = '';
      gridEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    gridEl.classList.remove('hidden');
    gridEl.innerHTML = simpleTasksList.map(buildSimpleTaskCardHtml).join('');
  }

  function setSimpleTasksLoading(loading) {
    simpleTasksLoading = loading;
    var loadingEl = document.getElementById('st-loading');
    if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
  }

  async function loadUserSimpleSubmissions(userId, taskIds) {
    userSimpleSubmissionMap = {};
    if (!userId || !taskIds.length || !window.supabase) return;

    var result = await window.supabase
      .from('submissions')
      .select('id, task_id, status')
      .eq('user_id', userId)
      .in('task_id', taskIds);

    if (result.error) return;

    (result.data || []).forEach(function (row) {
      userSimpleSubmissionMap[row.task_id] = row;
    });
  }

  async function fetchSimpleTasks() {
    if (!window.supabase) return [];

    var result = await window.supabase
      .from('tasks')
      .select('*')
      .eq('type', 'simple')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (result.error) throw result.error;
    return result.data || [];
  }

  async function loadAndRenderSimpleTasks() {
    applySimpleTasksI18n();
    setSimpleTasksLoading(true);

    try {
      simpleTasksList = await fetchSimpleTasks();
      var userId = await getCurrentUserId();
      var taskIds = simpleTasksList.map(function (task) { return task.id; });
      await loadUserSimpleSubmissions(userId, taskIds);
      renderSimpleTasksGrid();
    } catch (err) {
      console.warn('加载简单任务失败', err);
      simpleTasksList = [];
      userSimpleSubmissionMap = {};
      renderSimpleTasksGrid();
    } finally {
      setSimpleTasksLoading(false);
      applySimpleTasksI18n();
    }
  }

  async function performSimpleTaskClaim(taskId) {
    if (claimInProgress || !taskId || !window.supabase) return;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(stT('st_login_required'));
      return;
    }

    if (userSimpleSubmissionMap[taskId]) {
      alert(stT('st_already_claimed'));
      return;
    }

    var task = simpleTasksList.find(function (item) {
      return String(item.id) === String(taskId);
    });
    if (!task) {
      await loadAndRenderSimpleTasks();
      return;
    }

    if (isTaskFull(task)) {
      alert(stT('st_task_full'));
      return;
    }

    claimInProgress = true;

    try {
      var freshResult = await window.supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('type', 'simple')
        .eq('status', 'active')
        .maybeSingle();

      if (freshResult.error || !freshResult.data) {
        alert(stT('st_claim_fail') + (freshResult.error ? freshResult.error.message : ''));
        return;
      }

      var freshTask = freshResult.data;

      if (isSimplePlatformVerifiableTask(freshTask)) {
        var pendingResult = await insertSimplePendingSubmission(taskId, userId, freshTask);
        if (!pendingResult.ok) {
          alert(stT('st_claim_fail') + (pendingResult.error || ''));
          return;
        }

        if (pendingResult.data) {
          userSimpleSubmissionMap[taskId] = pendingResult.data;
        }

        renderSimpleTasksGrid();
        window.location.hash = 'task-detail?id=' + encodeURIComponent(taskId);
        return;
      }

      var current = Number(freshTask.current_participants) || 0;
      var max = freshTask.max_participants != null ? Number(freshTask.max_participants) : null;

      if (max != null && current >= max) {
        alert(stT('st_task_full'));
        await loadAndRenderSimpleTasks();
        return;
      }

      var existingResult = await window.supabase
        .from('submissions')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingResult.error) {
        alert(stT('st_claim_fail') + existingResult.error.message);
        return;
      }

      if (existingResult.data) {
        userSimpleSubmissionMap[taskId] = existingResult.data;
        alert(stT('st_already_claimed'));
        renderSimpleTasksGrid();
        return;
      }

      var nowIso = new Date().toISOString();
      var insertResult = await window.supabase
        .from('submissions')
        .insert({
          task_id: taskId,
          user_id: userId,
          status: 'submitted',
          submitted_at: nowIso
        })
        .select()
        .single();

      if (insertResult.error) {
        alert(stT('st_claim_fail') + insertResult.error.message);
        return;
      }

      var nextCount = current + 1;
      var updateResult = await window.supabase
        .from('tasks')
        .update({ current_participants: nextCount })
        .eq('id', taskId);

      if (updateResult.error) {
        alert(stT('st_claim_fail') + updateResult.error.message);
        return;
      }

      userSimpleSubmissionMap[taskId] = insertResult.data;
      task.current_participants = nextCount;

      var listTask = simpleTasksList.find(function (item) {
        return String(item.id) === String(taskId);
      });
      if (listTask) listTask.current_participants = nextCount;

      renderSimpleTasksGrid();
      alert(stT('st_claim_success'));

      if (typeof writeBroadcast === 'function') {
        writeBroadcast({
          user_id: userId,
          event_type: 'task_claim',
          description: '领取了简单任务「' + (typeof buildTaskBroadcastTitle === 'function'
            ? buildTaskBroadcastTitle(freshTask.title)
            : freshTask.title) + '」',
          reward_amount: Number(freshTask.reward_amount) || 0
        });
      }
    } finally {
      claimInProgress = false;
    }
  }

  function initSimpleTasksEvents() {
    if (simpleTasksInitialized) return;
    simpleTasksInitialized = true;

    var gridEl = document.getElementById('st-task-grid');
    if (gridEl) {
      gridEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.simple-task-claim-btn');
        if (!btn || btn.disabled || !gridEl.contains(btn)) return;
        e.preventDefault();
        var taskId = btn.getAttribute('data-task-id');
        if (btn.classList.contains('simple-task-claim-btn-continue')) {
          window.location.hash = 'task-detail?id=' + encodeURIComponent(taskId);
          return;
        }
        performSimpleTaskClaim(taskId);
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      simpleTasksInitialized = false;
      simpleTasksList = [];
      userSimpleSubmissionMap = {};
    }
  }

  async function handleSimpleTasksRoute() {
    restoreAppContentIfNeeded();

    var routeBase = getRouteBase();
    var page = document.getElementById('simple-tasks-page');
    if (!page) return;

    if (routeBase === 'simple-tasks') {
      hideOtherPagesForSimpleTasks();
      initSimpleTasksEvents();
      await loadAndRenderSimpleTasks();
    } else {
      page.classList.add('hidden');
    }
  }

  window.addEventListener('hashchange', handleSimpleTasksRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleSimpleTasksRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleSimpleTasksRoute, 0);
    });
  }
})();
