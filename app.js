function switchLanguage(lang) {
    window.setGlobalLanguage(lang);
    applyLanguageStrings();
}
(function () {

  'use strict';

  var STORAGE_KEY = 'coinrealm_lang';

  var DEFAULT_LANG = 'zh';

  var DEFAULT_ROUTE = 'home';

  var routes = Object.keys(window.translations.zh.pages);

  var currentRoute = DEFAULT_ROUTE;

  var appContent = document.getElementById('app-content');

  var langToggleBtn = document.getElementById('lang-toggle');

  var langLabel = document.getElementById('lang-label');

  function getPageContent(route) {

    var dict = window.translations[window.currentLang];

    var page = dict.pages[route];

    if (!page) {

      return {

        title: route,

        message: window.currentLang === 'zh' ? '页面未找到' : 'Page not found'

      };

    }

    return page;

  }

  function applyTranslations() {

    document.querySelectorAll('[data-i18n]').forEach(function (el) {

      var key = el.getAttribute('data-i18n');

      if (key === 'CoinRealm') {

        el.textContent = window.t('CoinRealm');

      } else if (key === 'connectWallet') {

        el.textContent = window.t('connectWallet');

      } else if (key === 'loading') {

        el.textContent = window.t('loading');

      }

    });

    if (langLabel) {

      langLabel.textContent = window.t('langToggle');

    }

    document.documentElement.lang = window.currentLang === 'zh' ? 'zh-CN' : 'en';

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

    window.setGlobalLanguage(lang);

    applyTranslations();

    renderPage(currentRoute);

    if (typeof applyLanguageStrings === 'function') {
      applyLanguageStrings();
    }

  }



  function toggleLanguage() {

    setLanguage(window.currentLang === 'zh' ? 'en' : 'zh');

  }



  function initLanguage() {

    var saved = localStorage.getItem(STORAGE_KEY);

    if (saved === 'zh' || saved === 'en') {

      window.currentLang = saved;

    } else {

      window.currentLang = DEFAULT_LANG;

    }

    document.documentElement.lang = window.currentLang === 'zh' ? 'zh-CN' : 'en';

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

var SHOW_INVITE_LEADERBOARD_DEFAULT = 'false';
var cachedShowInviteLeaderboard = null;

function isInviteLeaderboardEnabled(value) {
  return String(value == null ? SHOW_INVITE_LEADERBOARD_DEFAULT : value).toLowerCase() === 'true';
}

async function fetchShowInviteLeaderboard() {
  if (cachedShowInviteLeaderboard !== null) {
    return cachedShowInviteLeaderboard;
  }

  var value = SHOW_INVITE_LEADERBOARD_DEFAULT;
  if (!window.supabase) {
    cachedShowInviteLeaderboard = value;
    return value;
  }

  try {
    var result = await window.supabase
      .from('settings')
      .select('value')
      .eq('key', 'show_invite_leaderboard')
      .maybeSingle();

    if (!result.error && result.data && result.data.value != null && result.data.value !== '') {
      value = String(result.data.value);
    }
  } catch (settingsErr) {
    console.warn('读取排行榜开关失败:', settingsErr);
  }

  cachedShowInviteLeaderboard = value;
  return value;
}

function invalidateShowInviteLeaderboardCache() {
  cachedShowInviteLeaderboard = null;
}

async function applyLeaderboardMenuVisibility() {
  var enabled = isInviteLeaderboardEnabled(await fetchShowInviteLeaderboard());
  var profileLbItem = document.querySelector('#profile-page .profile-menu-item[data-route="leaderboard"]');

  if (profileLbItem) {
    if (enabled) {
      profileLbItem.classList.remove('hidden', 'profile-menu-item-disabled');
      profileLbItem.removeAttribute('aria-disabled');
    } else {
      profileLbItem.classList.add('hidden');
      profileLbItem.classList.remove('profile-menu-item-disabled');
      profileLbItem.removeAttribute('aria-disabled');
    }
  }
}

window.coinrealmFetchShowInviteLeaderboard = fetchShowInviteLeaderboard;
window.coinrealmIsInviteLeaderboardEnabled = function () {
  return fetchShowInviteLeaderboard().then(isInviteLeaderboardEnabled);
};
window.coinrealmApplyLeaderboardMenuVisibility = applyLeaderboardMenuVisibility;
window.coinrealmInvalidateShowInviteLeaderboardCache = invalidateShowInviteLeaderboardCache;

var SHOW_EXCHANGE_DEFAULT = 'false';
var SHOW_DIVIDENDS_DEFAULT = 'false';
var cachedShowExchange = null;
var cachedShowDividends = null;
var featurePageOriginalHtml = {};

function isSettingsFlagEnabled(value, defaultValue) {
  return String(value == null ? defaultValue : value).toLowerCase() === 'true';
}

function isExchangeEnabled(value) {
  return isSettingsFlagEnabled(value, SHOW_EXCHANGE_DEFAULT);
}

function isDividendsEnabled(value) {
  return isSettingsFlagEnabled(value, SHOW_DIVIDENDS_DEFAULT);
}

async function fetchShowExchange() {
  if (cachedShowExchange !== null) {
    return cachedShowExchange;
  }

  var value = SHOW_EXCHANGE_DEFAULT;
  if (!window.supabase) {
    cachedShowExchange = value;
    return value;
  }

  try {
    var result = await window.supabase
      .from('settings')
      .select('value')
      .eq('key', 'show_exchange')
      .maybeSingle();

    if (!result.error && result.data && result.data.value != null && result.data.value !== '') {
      value = String(result.data.value);
    }
  } catch (settingsErr) {
    console.warn('读取兑换市场开关失败:', settingsErr);
  }

  cachedShowExchange = value;
  return value;
}

async function fetchShowDividends() {
  if (cachedShowDividends !== null) {
    return cachedShowDividends;
  }

  var value = SHOW_DIVIDENDS_DEFAULT;
  if (!window.supabase) {
    cachedShowDividends = value;
    return value;
  }

  try {
    var result = await window.supabase
      .from('settings')
      .select('value')
      .eq('key', 'show_dividends')
      .maybeSingle();

    if (!result.error && result.data && result.data.value != null && result.data.value !== '') {
      value = String(result.data.value);
    }
  } catch (settingsErr) {
    console.warn('读取我的分红开关失败:', settingsErr);
  }

  cachedShowDividends = value;
  return value;
}

function invalidateShowExchangeCache() {
  cachedShowExchange = null;
}

function invalidateShowDividendsCache() {
  cachedShowDividends = null;
}

function isFeatureUnavailablePage(pageEl) {
  return !!(pageEl && pageEl.querySelector('.feature-unavailable-msg'));
}

function renderFeatureUnavailablePage(pageEl) {
  if (!pageEl) return;
  var pageId = pageEl.id;
  if (!featurePageOriginalHtml[pageId]) {
    featurePageOriginalHtml[pageId] = pageEl.innerHTML;
  }
  pageEl.innerHTML = '<div class="empty-state feature-unavailable-msg">该功能暂未开放，敬请期待</div>';
  pageEl.classList.remove('hidden');
}

function restoreFeaturePageContent(pageEl) {
  if (!pageEl) return;
  var pageId = pageEl.id;
  if (isFeatureUnavailablePage(pageEl) && featurePageOriginalHtml[pageId]) {
    pageEl.innerHTML = featurePageOriginalHtml[pageId];
  }
}

function clearFeaturePageOriginalHtmlCache() {
  featurePageOriginalHtml = {};
}

async function applyExchangeDividendsMenuVisibility() {
  if (typeof window.coinrealmApplyProfileExchangeDividendsVisibility === 'function') {
    await window.coinrealmApplyProfileExchangeDividendsVisibility();
  }
}

window.coinrealmFetchShowExchange = fetchShowExchange;
window.coinrealmIsExchangeEnabled = function () {
  return fetchShowExchange().then(isExchangeEnabled);
};
window.coinrealmFetchShowDividends = fetchShowDividends;
window.coinrealmIsDividendsEnabled = function () {
  return fetchShowDividends().then(isDividendsEnabled);
};
window.coinrealmRenderFeatureUnavailablePage = renderFeatureUnavailablePage;
window.coinrealmRestoreFeaturePageContent = restoreFeaturePageContent;
window.coinrealmIsFeatureUnavailablePage = isFeatureUnavailablePage;
window.coinrealmClearFeaturePageOriginalHtmlCache = clearFeaturePageOriginalHtmlCache;
window.coinrealmApplyExchangeDividendsMenuVisibility = applyExchangeDividendsMenuVisibility;
window.coinrealmInvalidateShowExchangeCache = invalidateShowExchangeCache;
window.coinrealmInvalidateShowDividendsCache = invalidateShowDividendsCache;

var ENABLE_USDT_REWARD_DEFAULT = 'false';
var cachedEnableUsdtReward = null;

function isEnableUsdtRewardEnabled(value) {
  return isSettingsFlagEnabled(value, ENABLE_USDT_REWARD_DEFAULT);
}

async function fetchEnableUsdtReward() {
  if (cachedEnableUsdtReward !== null) {
    return cachedEnableUsdtReward;
  }

  var value = ENABLE_USDT_REWARD_DEFAULT;
  if (!window.supabase) {
    cachedEnableUsdtReward = value;
    return value;
  }

  try {
    var result = await window.supabase
      .from('settings')
      .select('value')
      .eq('key', 'enable_usdt_reward')
      .maybeSingle();

    if (!result.error && result.data && result.data.value != null && result.data.value !== '') {
      value = String(result.data.value);
    }
  } catch (settingsErr) {
    console.warn('读取 USDT 奖励开关失败:', settingsErr);
  }

  cachedEnableUsdtReward = value;
  return value;
}

function invalidateEnableUsdtRewardCache() {
  cachedEnableUsdtReward = null;
}

window.coinrealmFetchEnableUsdtReward = fetchEnableUsdtReward;
window.coinrealmIsEnableUsdtRewardEnabled = function () {
  return fetchEnableUsdtReward().then(isEnableUsdtRewardEnabled);
};
window.coinrealmInvalidateEnableUsdtRewardCache = invalidateEnableUsdtRewardCache;

var AIRDROP_MODE_DEFAULT = 'level2';
var cachedAirdropMode = null;

function normalizeAirdropMode(value) {
  return String(value || AIRDROP_MODE_DEFAULT).toLowerCase() === 'daily_task' ? 'daily_task' : 'level2';
}

async function fetchAirdropMode() {
  if (cachedAirdropMode !== null) {
    return cachedAirdropMode;
  }

  var value = AIRDROP_MODE_DEFAULT;
  if (!window.supabase) {
    cachedAirdropMode = value;
    return value;
  }

  try {
    var result = await window.supabase
      .from('settings')
      .select('value')
      .eq('key', 'airdrop_mode')
      .maybeSingle();

    if (!result.error && result.data && result.data.value != null && result.data.value !== '') {
      value = normalizeAirdropMode(result.data.value);
    }
  } catch (settingsErr) {
    console.warn('读取空投模式失败:', settingsErr);
  }

  cachedAirdropMode = value;
  return value;
}

function invalidateAirdropModeCache() {
  cachedAirdropMode = null;
}

window.coinrealmFetchAirdropMode = fetchAirdropMode;
window.coinrealmNormalizeAirdropMode = normalizeAirdropMode;
window.coinrealmInvalidateAirdropModeCache = invalidateAirdropModeCache;

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
  var langData = window.translations[window.currentLang] || window.translations.zh;
  return langData.ads_placeholder || window.translations.zh.ads_placeholder || '广告位招租 | 联系 @CoinRealm_X';
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

function resolveSimpleTaskTypeKey(task) {
    if (!task) return '';
    var type = String(getTaskField(task, ['type', 'task_type', 'category'], '') || '').trim().toLowerCase();
    var platform = String(getTaskField(task, ['platform', 'verification_type'], '') || '').trim().toLowerCase();
    if (platform === 'twitter' || platform === 'telegram' || platform === 'discord') return platform;
    if (type === 'twitter' || type === 'telegram' || type === 'discord') return type;
    return type;
}

function isSimpleAutoApprovalTask(task) {
    if (!task) return false;
    var typeKey = resolveSimpleTaskTypeKey(task);
    if (typeKey === 'simple') return true;
    return typeKey === 'twitter' || typeKey === 'telegram' || typeKey === 'discord'
        || isSimplePlatformVerifiableTask(task);
}

window.coinrealmIsSimpleAutoApprovalTask = isSimpleAutoApprovalTask;
window.coinrealmResolveSimpleTaskTypeKey = resolveSimpleTaskTypeKey;

function notifySubmissionStatusChanged(payload) {
    payload = payload || {};
    console.log('任务提交状态变更通知：', payload);

    if (typeof window.coinrealmRefreshProfileSubmissionStats === 'function') {
        window.coinrealmRefreshProfileSubmissionStats().catch(function (err) {
            console.warn('刷新个人中心统计失败', err);
        });
    }
    if (typeof window.coinrealmRefreshHomeApprovedTasks === 'function') {
        window.coinrealmRefreshHomeApprovedTasks().catch(function (err) {
            console.warn('刷新首页已完成标记失败', err);
        });
    }
    if (payload.taskId && typeof window.coinrealmMarkHomeTaskCompleted === 'function') {
        window.coinrealmMarkHomeTaskCompleted(payload.taskId);
    }
    if (payload.taskId && typeof window.coinrealmMarkTaskDetailCompleted === 'function') {
        window.coinrealmMarkTaskDetailCompleted(payload.taskId, payload.userId);
    }

    try {
        window.dispatchEvent(new CustomEvent('coinrealm:submission-status-changed', { detail: payload }));
    } catch (notifyErr) {
        console.warn('派发提交状态变更事件失败', notifyErr);
    }
}

window.coinrealmNotifySubmissionStatusChanged = notifySubmissionStatusChanged;

async function grantSimpleTaskRewards(task, userId, options) {
    options = options || {};
    if (!window.supabase || !task || !task.id || !userId) return false;

    var taskId = task.id;
    var priorStatus = options.priorStatus || '';

    var duplicateResult = await checkTaskRewardDuplicate(taskId, userId);
    if (duplicateResult.alreadyRewarded) {
        notifySubmissionStatusChanged({
            taskId: taskId,
            userId: userId,
            status: 'approved',
            path: options.path || 'grantSimpleTaskRewards-duplicate'
        });
        return { alreadyRewarded: true };
    }

    var shouldIncrementParticipants = options.incrementParticipants !== false
        && priorStatus !== 'submitted';

    if (shouldIncrementParticipants) {
        var taskResult = await window.supabase
            .from('tasks')
            .select('current_participants, title, reward_amount, reward_type, max_participants')
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
            if (task.reward_type == null) task.reward_type = taskResult.data.reward_type;
            if (task.max_participants == null) task.max_participants = taskResult.data.max_participants;
        }
    }

    if (task.max_participants == null || task.reward_amount == null) {
        var rewardTaskResult = await window.supabase
            .from('tasks')
            .select('title, reward_amount, reward_type, max_participants')
            .eq('id', taskId)
            .maybeSingle();

        if (!rewardTaskResult.error && rewardTaskResult.data) {
            if (!task.title) task.title = rewardTaskResult.data.title;
            if (task.reward_amount == null) task.reward_amount = rewardTaskResult.data.reward_amount;
            if (task.reward_type == null) task.reward_type = rewardTaskResult.data.reward_type;
            if (task.max_participants == null) task.max_participants = rewardTaskResult.data.max_participants;
        }
    }

    var rewardAmount = calculatePerParticipantReward(task);

    if (options.creditRewardClient !== false) {
        var userResult = await window.supabase
            .from('users')
            .select('crlm_balance, usdt_balance')
            .eq('id', userId)
            .maybeSingle();

        if (!userResult.error && userResult.data && rewardAmount > 0) {
            var rewardType = String(task.reward_type || 'CRLM').toUpperCase();
            var balanceField = rewardType === 'USDT' ? 'usdt_balance' : 'crlm_balance';
            var currentBalance = Number(userResult.data[balanceField]) || 0;
            var patch = {};
            patch[balanceField] = currentBalance + rewardAmount;
            await window.supabase.from('users').update(patch).eq('id', userId);
            console.log('简单任务自动审核发奖：', { taskId: taskId, userId: userId, rewardAmount: rewardAmount });
        }
    }

    await upgradeUserLevelOnTaskApproved(userId);

    writeBroadcast({
        user_id: userId,
        event_type: 'task_approved',
        description: '完成了任务「' + buildTaskBroadcastTitle(task.title || '') + '」',
        reward_amount: rewardAmount
    });

    console.log('简单任务自动审核：', { taskId: taskId, userId: userId, status: 'approved', path: options.path || 'grantSimpleTaskRewards' });
    notifySubmissionStatusChanged({
        taskId: taskId,
        userId: userId,
        status: 'approved',
        path: options.path || 'grantSimpleTaskRewards'
    });
    return true;
}

window.coinrealmGrantSimpleTaskRewards = grantSimpleTaskRewards;

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

        var submissionRow = await loadUserSubmissionForTask(taskId, userId);

        if (verified) {
            var taskResult = await window.supabase
                .from('tasks')
                .select('*')
                .eq('id', taskId)
                .maybeSingle();

            if (taskResult.data && isSimpleAutoApprovalTask(taskResult.data)) {
                await applyTwitterVerificationSuccess(taskResult.data, userId, {
                    priorStatus: submissionRow && submissionRow.status ? submissionRow.status : 'pending',
                    creditRewardClient: true,
                    submissionId: submissionRow && submissionRow.id,
                    path: 'verifyTwitterTask'
                });

                submissionRow = await loadUserSubmissionForTask(taskId, userId);
            }
        }

        var submissionStatus = submissionRow && submissionRow.status
            ? submissionRow.status
            : (verified ? 'approved' : (workerResult.status || 'rejected'));

        return {
            success: workerResult.success === true,
            verified: verified,
            status: submissionStatus,
            reason: workerResult.reason || workerResult.review_comment || workerResult.error,
            review_comment: workerResult.review_comment || workerResult.reason,
            submission: submissionRow || null
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

async function maybeFinalizeSimpleTaskAfterWorkerVerify(taskId, userId, submissionId) {
    if (!window.supabase || !taskId || !userId) return false;

    var taskResult = await window.supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .maybeSingle();

    if (!taskResult.data || !isSimpleAutoApprovalTask(taskResult.data)) return false;

    var submissionRow = null;
    if (submissionId) {
        var byIdResult = await window.supabase
            .from('submissions')
            .select('id, status')
            .eq('id', submissionId)
            .maybeSingle();
        submissionRow = byIdResult.data;
    } else {
        var subResult = await window.supabase
            .from('submissions')
            .select('id, status')
            .eq('task_id', taskId)
            .eq('user_id', userId)
            .maybeSingle();
        submissionRow = subResult.data;
    }

    if (!submissionRow || !submissionRow.id) return false;
    if (submissionRow.status === 'approved') return true;

    return finalizeSimpleTaskSubmission(taskResult.data, userId, {
        priorStatus: submissionRow.status || 'pending',
        submissionId: submissionRow.id,
        creditRewardClient: true
    });
}

window.coinrealmMaybeFinalizeSimpleTaskAfterWorkerVerify = maybeFinalizeSimpleTaskAfterWorkerVerify;

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

function calculatePerParticipantReward(task) {
    if (!task) return 0;
    var rewardAmount = Number(task.reward_amount) || 0;
    var maxParticipantsRaw = task.max_participants;
    if (maxParticipantsRaw == null || maxParticipantsRaw === '') return rewardAmount;

    var maxParticipants = parseFloat(maxParticipantsRaw);
    if (Number.isNaN(maxParticipants) || maxParticipants <= 0) return rewardAmount;

    return rewardAmount / maxParticipants;
}

function usernameFromWalletAddress(walletAddress) {
    var normalized = String(walletAddress || '').trim();
    if (!normalized) return 'Wallet_user';
    return 'Wallet_' + normalized.slice(0, 6);
}

function formatWalletDisplayName(walletAddress) {
    var normalized = String(walletAddress || '').trim();
    if (!normalized) return '';
    return 'Wallet_' + normalized.slice(0, 10) + '...';
}

function resolveUserDisplayName(user) {
    if (!user || typeof user !== 'object') {
        console.log('resolveUserDisplayName: 无用户数据', user);
        return '未知发布者';
    }

    var rawUsername = user.username;
    if (rawUsername != null && String(rawUsername).trim()) {
        var fromUsername = String(rawUsername).trim();
        console.log('resolveUserDisplayName: 使用 username', {
            username: rawUsername,
            displayName: fromUsername
        });
        return fromUsername;
    }

    var email = user.email != null ? String(user.email).trim() : '';
    if (email && email.indexOf('@wallet.coinrealm.local') === -1) {
        var fromEmail = email.split('@')[0] || email;
        console.log('resolveUserDisplayName: 使用 email', {
            email: email,
            displayName: fromEmail
        });
        return fromEmail;
    }

    var wallet = user.wallet_address != null ? String(user.wallet_address).trim() : '';
    if (wallet) {
        var fromWallet = formatWalletDisplayName(wallet);
        console.log('resolveUserDisplayName: 使用 wallet_address', {
            wallet_address: wallet,
            displayName: fromWallet
        });
        return fromWallet;
    }

    if (email) {
        var fromWalletEmail = formatWalletDisplayName('0x' + email.split('@')[0]);
        console.log('resolveUserDisplayName: 使用钱包邮箱兜底', {
            email: email,
            displayName: fromWalletEmail
        });
        return fromWalletEmail;
    }

    console.log('resolveUserDisplayName: 未知发布者', user);
    return '未知发布者';
}

window.coinrealmUsernameFromWalletAddress = usernameFromWalletAddress;
window.coinrealmFormatWalletDisplayName = formatWalletDisplayName;
window.coinrealmResolveUserDisplayName = resolveUserDisplayName;

async function fetchPublisherUserById(publisherId) {
    if (!window.supabase || !publisherId) return null;

    var result = await window.supabase
        .from('users')
        .select('id, username, level, reputation_score, email, wallet_address, avatar_url, created_at, completion_rate, is_official, is_high_risk')
        .eq('id', publisherId)
        .maybeSingle();

    console.log('查询发布者信息：', { publisherId: publisherId, result: result });

    if (result.error || !result.data) {
        console.warn('查询发布者信息失败：', result.error);
        return null;
    }

    return Object.assign({}, result.data, {
        displayName: resolveUserDisplayName(result.data)
    });
}

window.coinrealmFetchPublisherUserById = fetchPublisherUserById;

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

async function checkTaskRewardDuplicate(taskId, userId) {
    if (!window.supabase || !taskId || !userId) {
        return { alreadyRewarded: false };
    }

    var result = await window.supabase
        .from('submissions')
        .select('id')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .eq('status', 'approved');

    console.log('防重复发奖检查：', { taskId: taskId, userId: userId, result: result });

    if (result.error) {
        console.warn('防重复发奖检查失败：', result.error);
        return { alreadyRewarded: false, error: result.error };
    }

    if (result.data && result.data.length > 0) {
        console.log('该用户已领取过奖励，跳过发奖', {
            taskId: taskId,
            userId: userId,
            approvedSubmissionIds: result.data.map(function (row) { return row.id; })
        });
        return { alreadyRewarded: true, approvedSubmissionIds: result.data.map(function (row) { return row.id; }) };
    }

    return { alreadyRewarded: false };
}

async function checkUserAlreadyRewardedForTask(taskId, userId) {
    var duplicateResult = await checkTaskRewardDuplicate(taskId, userId);
    return !!duplicateResult.alreadyRewarded;
}

async function loadUserSubmissionForTask(taskId, userId) {
    if (!window.supabase || !taskId || !userId) return null;

    var result = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls')
        .eq('task_id', taskId)
        .eq('user_id', userId)
        .order('reviewed_at', { ascending: false, nullsFirst: false })
        .order('submitted_at', { ascending: false, nullsFirst: false });

    console.log('加载用户提交记录：', { taskId: taskId, userId: userId, result: result });

    if (result.error) {
        console.warn('加载用户提交记录失败：', result.error);
        return null;
    }

    var rows = result.data || [];
    if (!rows.length) return null;

    var approvedRow = rows.find(function (row) { return row.status === 'approved'; });
    if (approvedRow) return approvedRow;

    var statusPriority = {
        submitted: 6,
        verifying: 5,
        pending: 4,
        claimed: 3,
        rejected: 2
    };

    rows.sort(function (a, b) {
        var pa = statusPriority[a.status] || 0;
        var pb = statusPriority[b.status] || 0;
        if (pb !== pa) return pb - pa;
        var ta = new Date(a.submitted_at || a.reviewed_at || 0).getTime();
        var tb = new Date(b.submitted_at || b.reviewed_at || 0).getTime();
        return tb - ta;
    });

    return rows[0];
}

window.coinrealmCheckUserAlreadyRewardedForTask = checkUserAlreadyRewardedForTask;
window.coinrealmCheckTaskRewardDuplicate = checkTaskRewardDuplicate;
window.coinrealmLoadUserSubmissionForTask = loadUserSubmissionForTask;
window.coinrealmCalculatePerParticipantReward = calculatePerParticipantReward;

async function applyTwitterVerificationSuccess(task, userId, options) {
    options = options || {};
    if (!window.supabase || !task || !task.id || !userId) return false;

    var taskId = task.id;
    var now = new Date().toISOString();
    var priorStatus = options.priorStatus || '';

    if (priorStatus === 'approved') {
        console.log('防重复领取：提交状态已是 approved，跳过发奖', { taskId: taskId, userId: userId });
        notifySubmissionStatusChanged({ taskId: taskId, userId: userId, status: 'approved', path: options.path || 'applyTwitterVerificationSuccess-prior-approved' });
        return { alreadyRewarded: true };
    }

    var duplicateResult = await checkTaskRewardDuplicate(taskId, userId);
    if (duplicateResult.alreadyRewarded) {
        console.log('该用户已领取过奖励，跳过发奖', { taskId: taskId, userId: userId, path: options.path || 'applyTwitterVerificationSuccess' });
        notifySubmissionStatusChanged({
            taskId: taskId,
            userId: userId,
            status: 'approved',
            path: options.path || 'applyTwitterVerificationSuccess-duplicate'
        });
        return duplicateResult;
    }

    var grantResult = await grantSimpleTaskRewards(task, userId, {
        priorStatus: priorStatus,
        creditRewardClient: options.creditRewardClient !== false,
        incrementParticipants: options.incrementParticipants,
        path: options.path || 'applyTwitterVerificationSuccess-grant'
    });

    if (grantResult && grantResult.alreadyRewarded) {
        return grantResult;
    }

    if (!grantResult) {
        console.warn('简单任务发奖失败，跳过状态更新', { taskId: taskId, userId: userId });
        return false;
    }

    if (!options.skipStatusUpdate) {
        var approvePayload = {
            status: 'approved',
            reviewed_at: now,
            submitted_at: options.submittedAt || now
        };

        var updateQuery = window.supabase
            .from('submissions')
            .update(approvePayload)
            .eq('task_id', taskId)
            .eq('user_id', userId)
            .in('status', priorStatus === 'rejected'
                ? ['verifying', 'rejected', 'pending', 'submitted', 'claimed']
                : ['verifying', 'pending', 'submitted', 'claimed']);

        if (options.submissionId) {
            updateQuery = window.supabase
                .from('submissions')
                .update(approvePayload)
                .eq('id', options.submissionId)
                .neq('status', 'approved');
        }

        var updateResult = await updateQuery.select();

        console.log('简单任务自动审核：', {
            taskId: taskId,
            userId: userId,
            status: 'approved',
            submissionId: options.submissionId || null,
            path: options.path || 'applyTwitterVerificationSuccess',
            updateResult: updateResult
        });

        if (updateResult.error) {
            console.warn('自动验证更新提交状态失败：', updateResult.error);
            return false;
        }

        if (!options.submissionId && (!updateResult.data || !updateResult.data.length)) {
            console.log('防重复领取：无待审核提交可更新', { taskId: taskId, userId: userId });
        }
    }

    notifySubmissionStatusChanged({
        taskId: taskId,
        userId: userId,
        status: 'approved',
        path: options.path || 'applyTwitterVerificationSuccess'
    });

    return true;
}

async function finalizeSimpleTaskSubmission(task, userId, options) {
    options = options || {};
    if (!task || !userId) return false;

    var taskId = task.id;
    var duplicateResult = await checkTaskRewardDuplicate(taskId, userId);
    if (duplicateResult.alreadyRewarded) {
        console.log('finalizeSimpleTaskSubmission: 该用户已领取过奖励，跳过', {
            taskId: taskId,
            userId: userId,
            path: options.path || 'finalizeSimpleTaskSubmission'
        });
        notifySubmissionStatusChanged({
            taskId: taskId,
            userId: userId,
            status: 'approved',
            path: options.path || 'finalizeSimpleTaskSubmission-duplicate'
        });
        return duplicateResult;
    }

    var priorStatus = options.priorStatus || 'pending';
    var approvedStatus = 'approved';

    console.log('简单任务提交，status：', approvedStatus, {
        taskId: task.id,
        userId: userId,
        submissionId: options.submissionId || null,
        priorStatus: priorStatus
    });

    return applyTwitterVerificationSuccess(task, userId, {
        priorStatus: priorStatus,
        creditRewardClient: options.creditRewardClient !== false,
        submissionId: options.submissionId,
        skipStatusUpdate: options.skipStatusUpdate,
        incrementParticipants: options.incrementParticipants,
        path: options.path || 'finalizeSimpleTaskSubmission'
    });
}

window.coinrealmFinalizeSimpleTaskSubmission = finalizeSimpleTaskSubmission;

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

async function uploadProofScreenshotWithProgress(userId, file, onProgress) {
    if (typeof onProgress === 'function') onProgress(0);

    var progressValue = 8;
    var progressTimer = null;
    if (typeof onProgress === 'function') {
        progressTimer = setInterval(function () {
            progressValue = Math.min(progressValue + 7, 92);
            onProgress(progressValue);
        }, 180);
    }

    try {
        var result = await uploadProofScreenshot(userId, file);
        if (typeof onProgress === 'function') {
            onProgress(result.ok ? 100 : progressValue);
        }
        return result;
    } finally {
        if (progressTimer) clearInterval(progressTimer);
    }
}

function isSubmissionReadyToSubmitProof(submission) {
    if (!submission) return false;
    if (submission.status === 'claimed') return true;
    if (submission.status === 'pending' && !submission.submitted_at) return true;
    if (submission.status === 'rejected') return true;
    return false;
}

function isSubmissionWaitingReviewProof(submission) {
    if (!submission) return false;
    if (submission.status === 'submitted') return true;
    if (submission.status === 'approved') return true;
    if (submission.status === 'pending' && submission.submitted_at) return true;
    return false;
}

async function submitTaskProofSubmission(options) {
    options = options || {};

    var taskId = options.taskId;
    var userId = options.userId;
    var description = options.description != null ? String(options.description).trim() : '';
    var screenshotUrls = options.screenshotUrls || [];
    var submission = options.submission;
    var taskTitle = options.taskTitle || '';
    var taskReward = options.taskReward != null ? Number(options.taskReward) : 0;
    var requireDescription = options.requireDescription !== false;
    var path = options.path || 'submit-task-proof';

    if (!window.supabase || !taskId || !userId || !submission || !submission.id) {
        return { ok: false, error: 'missing_params' };
    }

    var proofType = options.proofType || 'screenshot';

    if (proofType === 'text') {
        if (!description) {
            return { ok: false, error: 'description_required' };
        }
    } else if (requireDescription && !description) {
        return { ok: false, error: 'description_required' };
    }

    if (proofType === 'screenshot' && !screenshotUrls.length) {
        return { ok: false, error: 'screenshot_required' };
    }

    if (!description) {
        description = '（详情页提交凭证）';
    }

    if (submission.status === 'approved') {
        return { ok: false, error: 'already_approved' };
    }

    if (submission.status === 'submitted') {
        return { ok: false, error: 'already_submitted', submissionStatus: 'submitted' };
    }

    if (!isSubmissionReadyToSubmitProof(submission)) {
        if (isSubmissionWaitingReviewProof(submission)) {
            return { ok: false, error: 'waiting_review', submissionStatus: submission.status };
        }
        return { ok: false, error: 'not_ready' };
    }

    var alreadyRewardedBeforeSubmit = typeof checkTaskRewardDuplicate === 'function'
        ? (await checkTaskRewardDuplicate(taskId, userId)).alreadyRewarded
        : (typeof checkUserAlreadyRewardedForTask === 'function'
            ? await checkUserAlreadyRewardedForTask(taskId, userId)
            : false);

    if (alreadyRewardedBeforeSubmit) {
        return { ok: false, error: 'already_rewarded' };
    }

    var taskRecord = options.taskRecord || null;
    var taskType = '';
    var isSimpleAuto = false;

    if (!taskRecord && window.supabase) {
        var taskResult = await window.supabase
            .from('tasks')
            .select('id, title, type, task_type, category, platform, verification_type, reward_amount, reward_type, max_participants, current_participants')
            .eq('id', taskId)
            .maybeSingle();

        if (!taskResult.error && taskResult.data) {
            taskRecord = taskResult.data;
        }
    }

    if (taskRecord) {
        if (typeof resolveSimpleTaskTypeKey === 'function') {
            taskType = resolveSimpleTaskTypeKey(taskRecord);
        } else {
            taskType = String(taskRecord.type || taskRecord.task_type || taskRecord.category || '').trim().toLowerCase();
        }
        if (typeof isSimpleAutoApprovalTask === 'function') {
            isSimpleAuto = isSimpleAutoApprovalTask(taskRecord);
        } else {
            isSimpleAuto = taskType === 'simple' || taskType === 'twitter' || taskType === 'telegram' || taskType === 'discord';
        }
    }

    var priorStatus = submission.status;

    if (isSimpleAuto && taskRecord && typeof grantSimpleTaskRewards === 'function') {
        var preGrantResult = await grantSimpleTaskRewards(taskRecord, userId, {
            priorStatus: priorStatus,
            creditRewardClient: true,
            path: path + '-pre-grant'
        });
        if (preGrantResult && preGrantResult.alreadyRewarded) {
            return { ok: false, error: 'already_rewarded' };
        }
        if (!preGrantResult) {
            return { ok: false, error: 'grant_failed' };
        }
    }

    var submissionStatus = isSimpleAuto ? 'approved' : 'submitted';
    var submittedAt = new Date().toISOString();
    var updatePayload = {
        description: description,
        screenshot_urls: screenshotUrls,
        status: submissionStatus,
        submitted_at: submittedAt
    };

    if (isSimpleAuto) {
        updatePayload.reviewed_at = submittedAt;
    }

    var updateQuery = window.supabase
        .from('submissions')
        .update(updatePayload)
        .eq('id', submission.id)
        .eq('user_id', userId);

    if (isSimpleAuto) {
        updateQuery = updateQuery.neq('status', 'approved');
    } else {
        updateQuery = updateQuery.neq('status', 'approved').neq('status', 'submitted');
    }

    var updateResult = await updateQuery.select();

    if (updateResult.error) {
        return { ok: false, error: updateResult.error.message };
    }

    if (!updateResult.data || !updateResult.data.length) {
        return { ok: false, error: 'already_rewarded' };
    }

    var updatedSubmission = Object.assign({}, submission, updateResult.data[0], {
        status: submissionStatus,
        submitted_at: submittedAt,
        reviewed_at: isSimpleAuto ? submittedAt : null,
        description: description,
        screenshot_urls: screenshotUrls
    });

    if (!isSimpleAuto) {
        writeBroadcast({
            user_id: userId,
            event_type: 'task_submit',
            description: '提交了任务「' + buildTaskBroadcastTitle(taskTitle || (taskRecord && taskRecord.title) || '任务') + '」凭证',
            reward_amount: taskReward || Number((taskRecord && taskRecord.reward_amount) || 0)
        });
    }

    if (typeof notifySubmissionStatusChanged === 'function') {
        notifySubmissionStatusChanged({
            taskId: taskId,
            userId: userId,
            status: submissionStatus,
            path: path,
            submissionId: submission.id
        });
    }

    return {
        ok: true,
        submissionStatus: submissionStatus,
        submission: updatedSubmission,
        isSimpleAuto: isSimpleAuto
    };
}

window.coinrealmValidateProofScreenshotFile = validateProofScreenshotFile;
window.coinrealmUploadProofScreenshot = uploadProofScreenshot;
window.coinrealmUploadProofScreenshotWithProgress = uploadProofScreenshotWithProgress;
window.coinrealmSubmitTaskProof = submitTaskProofSubmission;
window.coinrealmIsSubmissionReadyToSubmitProof = isSubmissionReadyToSubmitProof;
window.coinrealmIsSubmissionWaitingReviewProof = isSubmissionWaitingReviewProof;

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
            username: resolveUserDisplayName(publisher),
            email: publisher.email,
            wallet_address: publisher.wallet_address,
            avatar_url: publisher.avatar_url
        };
    }
    return {
        id: task.publisher_id,
        username: resolveUserDisplayName({
            username: task.publisher_username,
            email: task.publisher_email,
            wallet_address: task.publisher_wallet_address
        }),
        email: task.publisher_email,
        wallet_address: task.publisher_wallet_address,
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
        .select('id, username, email, wallet_address, avatar_url, twitter_username, telegram_username, discord_user_id, discord_username')
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
    var langData = window.translations[window.currentLang] || window.translations.zh;
    var text = langData[key] || window.translations.zh[key] || '';
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
        if (typeof window.coinrealmCheckAirdropEligibility === 'function') {
            var eligibility = await window.coinrealmCheckAirdropEligibility(userId);
            if (!eligibility.ok) {
                alert(eligibility.message || formatCheckinText('checkin_fail'));
                return { ok: false, denied: true, reason: eligibility.reason };
            }
        } else {
            var userLevelResult = await window.supabase
                .from('users')
                .select('level')
                .eq('id', userId)
                .maybeSingle();

            if (userLevelResult.error) {
                alert(formatCheckinText('checkin_fail') + userLevelResult.error.message);
                return { ok: false };
            }

            if ((Number(userLevelResult.data && userLevelResult.data.level) || 0) < 2) {
                alert(formatCheckinText('airdrop_level_required') || '请先完成任务升级到 Lv.2，即可每日领取空投');
                return { ok: false, levelRequired: true };
            }
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

// ==========================================
// 3. 全局多语言国际化渲染应用
// ==========================================
function applyLanguageStrings() {
    const langData = window.translations[window.currentLang];
    
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
      pf_withdraw_compliance_hint: '提币仅用于 CRLM 实用代币转移至您的数字钱包，本平台不提供任何法币和代币兑换服务。',
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
      pf_withdraw_err_wallet_empty: '请输入接收钱包地址',
      pf_withdraw_err_wallet_format: '钱包地址必须是 0x 开头加 40 位十六进制字符',
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
      pf_withdraw_compliance_hint: 'Withdrawal is only for transferring CRLM utility tokens to your digital wallet. This platform does not provide any fiat or token exchange services.',
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
      pf_withdraw_err_wallet_empty: 'Please enter a receiving wallet address',
      pf_withdraw_err_wallet_format: 'Wallet address must start with 0x followed by 40 hexadecimal characters',
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
        .select('id, reviewed_at, submitted_at, task_id, tasks(title, reward_amount, reward_type, max_participants)')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false })
        .limit(queryLimit);

      console.log('任务奖励查询结果：', submissionsResult);

      if (submissionsResult.error) {
        console.warn('任务奖励查询错误：', submissionsResult.error);
      }

      if (!submissionsResult.error) {
        var approvedRows = submissionsResult.data || [];
        var taskIds = approvedRows.map(function (row) { return row.task_id; }).filter(Boolean);
        var uniqueTaskIds = taskIds.filter(function (id, index) { return taskIds.indexOf(id) === index; });
        var taskMap = {};

        if (uniqueTaskIds.length) {
          var tasksResult = await window.supabase
            .from('tasks')
            .select('id, title, reward_amount, reward_type, max_participants')
            .in('id', uniqueTaskIds);

          console.log('任务奖励关联 tasks 查询结果：', tasksResult);

          if (!tasksResult.error) {
            (tasksResult.data || []).forEach(function (task) {
              taskMap[task.id] = task;
            });
          }
        }

        var addedTaskRewardEntries = 0;

        approvedRows.forEach(function (row) {
          var joinedTask = Array.isArray(row.tasks) ? row.tasks[0] : row.tasks;
          var fallbackTask = taskMap[row.task_id] || {};
          var task = Object.assign({}, fallbackTask, joinedTask || {});
          var rewardType = String((task && task.reward_type) || 'CRLM').toUpperCase();
          if (rewardType !== 'CRLM') return;

          var amount = calculatePerParticipantReward(task);
          var title = getLedgerTaskTitle(task, '任务 #' + row.task_id);
          console.log('任务奖励明细条目：', { row: row, task: task, amount: amount, title: title });

          if (amount <= 0) return;

          addedTaskRewardEntries += 1;
          entries.push({
            time: row.reviewed_at || row.submitted_at || new Date().toISOString(),
            icon: pfT('pf_ledger_icon_task'),
            description: '任务奖励：' + title,
            delta: amount,
            income: true
          });
        });

        if (approvedRows.length && !addedTaskRewardEntries) {
          var broadcastsResult = await window.supabase
            .from('broadcasts')
            .select('created_at, description, reward_amount, event_type')
            .eq('user_id', userId)
            .eq('event_type', 'task_approved')
            .order('created_at', { ascending: false })
            .limit(queryLimit);

          console.log('任务奖励广播兜底查询结果：', broadcastsResult);

          if (!broadcastsResult.error) {
            (broadcastsResult.data || []).forEach(function (row) {
              var amount = Number(row.reward_amount) || 0;
              if (amount <= 0) return;
              var desc = String(row.description || '').trim();
              entries.push({
                time: row.created_at || new Date().toISOString(),
                icon: pfT('pf_ledger_icon_task'),
                description: desc ? ('任务奖励：' + desc.replace(/^.*?「/, '').replace(/」.*$/, '') || desc) : pfT('pf_ledger_type_task'),
                delta: amount,
                income: true
              });
            });
          }
        }
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

    console.log('余额明细最终条目（含任务奖励）：', entries);

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
      var langData = window.translations[window.getLang()] || window.translations.zh;
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
    return /^0x[a-fA-F0-9]{40}$/.test(String(address || '').trim());
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
    if (!hintEl) return;

    var mainText = pfT('pf_withdraw_hint', { min: formatNumber(minAmount) });
    var complianceText = pfT('pf_withdraw_compliance_hint');
    var safeMain = typeof escapeHtml === 'function' ? escapeHtml(mainText) : mainText;
    var safeCompliance = typeof escapeHtml === 'function' ? escapeHtml(complianceText) : complianceText;

    hintEl.innerHTML =
      '<span>' + safeMain + '</span>' +
      '<span style="display:block;margin-top:8px;color:#999;font-size:12px;line-height:1.5;">' + safeCompliance + '</span>';
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
    if (!walletAddress) {
      showWithdrawError(pfT('pf_withdraw_err_wallet_empty'));
      return;
    }
    if (!isValidWithdrawWalletAddress(walletAddress)) {
      showWithdrawError(pfT('pf_withdraw_err_wallet_format'));
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

    var displayUsername = resolveUserDisplayName(user);
    console.log('个人中心显示用户名：', { user: user, displayUsername: displayUsername });
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

    if (typeof window.coinrealmLoadProfileSubmissionStats === 'function') {
      var submissionStats = await window.coinrealmLoadProfileSubmissionStats();
      progressCount = submissionStats.progress || 0;
      completedCount = submissionStats.completed || 0;
    }

    if (progressEl) progressEl.textContent = String(progressCount);
    if (completedEl) completedEl.textContent = String(completedCount);

    if (typeof window.coinrealmInitProfileStatNavigation === 'function') {
      window.coinrealmInitProfileStatNavigation();
    }

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

    if (typeof applyLeaderboardMenuVisibility === 'function') {
      await applyLeaderboardMenuVisibility();
    }

    if (typeof applyExchangeDividendsMenuVisibility === 'function') {
      await applyExchangeDividendsMenuVisibility();
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

    if (typeof window.coinrealmInitProfileStatNavigation === 'function') {
      window.coinrealmInitProfileStatNavigation();
    }

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
        if (typeof applyLeaderboardMenuVisibility === 'function') {
          applyLeaderboardMenuVisibility();
        }
        if (typeof applyExchangeDividendsMenuVisibility === 'function') {
          applyExchangeDividendsMenuVisibility();
        }
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

// 8b. 我的任务页 (#my-tasks) — 见 js/pages/my-tasks.js

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

  async function handleExchangeRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var exchangePage = document.getElementById('exchange-page');

    if (exchangePage) {
      if (route === 'exchange') {
        var enabled = false;
        if (typeof window.coinrealmIsExchangeEnabled === 'function') {
          enabled = await window.coinrealmIsExchangeEnabled();
        }

        if (!enabled) {
          if (typeof window.coinrealmRenderFeatureUnavailablePage === 'function') {
            window.coinrealmRenderFeatureUnavailablePage(exchangePage);
          } else {
            exchangePage.classList.remove('hidden');
          }
          return;
        }

        if (typeof window.coinrealmRestoreFeaturePageContent === 'function') {
          window.coinrealmRestoreFeaturePageContent(exchangePage);
        }
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

    var fetchPublisher = typeof window.coinrealmFetchPublisherUser === 'function'
      ? window.coinrealmFetchPublisherUser(publisherId)
      : window.supabase
          .from('users')
          .select('id, username, email, wallet_address, level, reputation_score, avatar_url')
          .eq('id', publisherId)
          .maybeSingle()
          .then(function (result) {
            console.log('发布者查询结果：', { data: result.data, error: result.error });
            return result;
          });

    return fetchPublisher
      .then(function (userResult) {
        if (userResult.error || !userResult.data) {
          console.warn('发布者主页：未找到用户', { publisherId: publisherId, error: userResult.error });
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

          var username = resolveUserDisplayName(user);
          var level = user.level != null ? Number(user.level) : 0;
          var reputationScore = user.reputation_score != null ? Number(user.reputation_score) : 0;
          var completionRate = user.completion_rate != null ? Number(user.completion_rate) : reputationScore;

          console.log('发布者主页数据：', { publisherId: publisherId, user: user, username: username });

          publisherActiveTasks = (tasksResult.error ? [] : (tasksResult.data || [])).map(function (task) {
            return Object.assign({}, task, {
              publisher_username: username,
              publisher_level: level,
              publisher_wallet_address: user.wallet_address || null
            });
          });

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
// 14. 审核管理页 (#review) — 见 js/pages/review.js
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
      ad_tab_airdrop: '空投设置',
      ad_tab_features: '功能开关',
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
      ad_invite_show_leaderboard: '显示邀请排行榜',
      ad_btn_save_invite: '保存',
      ad_invite_save_ok: '邀请设置已保存',
      ad_invite_save_fail: '保存邀请设置失败：',
      ad_invite_invalid: '请输入有效的奖励金额',
      ad_airdrop_title: '空投设置',
      ad_airdrop_mode_level2: '升级到 Lv.2 后每天可领取',
      ad_airdrop_mode_daily_task: '每天完成一个任务才可领取',
      ad_btn_save_airdrop: '保存',
      ad_airdrop_save_ok: '空投设置已保存',
      ad_airdrop_save_fail: '保存空投设置失败：',
      ad_features_title: '功能开关',
      ad_features_show_exchange: '开启兑换市场',
      ad_features_show_dividends: '开启我的分红',
      ad_features_enable_usdt: '开启 USDT 任务奖励',
      ad_btn_save_features: '保存',
      ad_features_save_ok: '功能开关已保存',
      ad_features_save_fail: '保存功能开关失败：',
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
      ad_tab_airdrop: 'Airdrop Settings',
      ad_tab_features: 'Feature Toggles',
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
      ad_invite_show_leaderboard: 'Show invite leaderboard',
      ad_btn_save_invite: 'Save',
      ad_invite_save_ok: 'Invite settings saved',
      ad_invite_save_fail: 'Failed to save invite settings: ',
      ad_invite_invalid: 'Please enter valid reward amounts',
      ad_airdrop_title: 'Airdrop Settings',
      ad_airdrop_mode_level2: 'Claim daily after reaching Lv.2',
      ad_airdrop_mode_daily_task: 'Complete one task daily to claim',
      ad_btn_save_airdrop: 'Save',
      ad_airdrop_save_ok: 'Airdrop settings saved',
      ad_airdrop_save_fail: 'Failed to save airdrop settings: ',
      ad_features_title: 'Feature Toggles',
      ad_features_show_exchange: 'Enable Exchange Market',
      ad_features_show_dividends: 'Enable My Dividends',
      ad_features_enable_usdt: 'Enable USDT Task Rewards',
      ad_btn_save_features: 'Save',
      ad_features_save_ok: 'Feature toggles saved',
      ad_features_save_fail: 'Failed to save feature toggles: ',
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
    if (typeof window.coinrealmLoadAdminUsers === 'function') {
      adminUsers = await window.coinrealmLoadAdminUsers();
      return;
    }

    if (!window.supabase) {
      adminUsers = [];
      console.log('用户列表查询结果：', { count: 0, users: adminUsers });
      return;
    }

    var users = [];
    var pageSize = 1000;
    var from = 0;

    while (true) {
      var to = from + pageSize - 1;
      var result = await window.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (result.error) {
        console.warn('用户列表查询失败：', result.error);
        break;
      }

      var batch = result.data || [];
      users = users.concat(batch);

      if (batch.length < pageSize) {
        break;
      }

      from += pageSize;
    }

    adminUsers = users;
    console.log('用户列表查询结果：', { count: adminUsers.length, users: adminUsers });
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
    } else if (adminTab === 'airdrop') {
      await loadAdminAirdropSettings();
    } else if (adminTab === 'features') {
      await loadAdminFeatureSettings();
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
    ensureAdminInviteLeaderboardToggle();
    applyAdminI18n();

    var settings = await fetchInviteSettings();
    var level1El = document.getElementById('ad-invite-level1');
    var level2El = document.getElementById('ad-invite-level2');
    var showLeaderboardEl = document.getElementById('ad-invite-show-leaderboard');
    var showLeaderboardValue = await fetchShowInviteLeaderboard();

    if (level1El) level1El.value = String(settings.invite_level1_reward);
    if (level2El) level2El.value = String(settings.invite_level2_reward);
    if (showLeaderboardEl) {
      showLeaderboardEl.checked = isInviteLeaderboardEnabled(showLeaderboardValue);
    }
  }

  function ensureAdminInviteLeaderboardToggle() {
    if (document.getElementById('ad-invite-show-leaderboard')) return;

    var form = document.getElementById('ad-invite-form');
    var saveBtn = document.getElementById('ad-invite-save-btn');
    if (!form || !saveBtn) return;

    var toggleWrap = document.createElement('label');
    toggleWrap.className = 'admin-ads-toggle';
    toggleWrap.innerHTML =
      '<input type="checkbox" id="ad-invite-show-leaderboard" class="admin-ads-toggle-input">' +
      '<span class="admin-ads-toggle-slider" aria-hidden="true"></span>' +
      '<span class="admin-ads-toggle-text" data-i18n="ad_invite_show_leaderboard">显示邀请排行榜</span>';

    form.insertBefore(toggleWrap, saveBtn);
  }

  async function saveAdminInviteSettings() {
    if (!window.supabase) return;

    var level1 = Number(document.getElementById('ad-invite-level1') && document.getElementById('ad-invite-level1').value);
    var level2 = Number(document.getElementById('ad-invite-level2') && document.getElementById('ad-invite-level2').value);
    var showLeaderboardEl = document.getElementById('ad-invite-show-leaderboard');
    var showLeaderboard = !!(showLeaderboardEl && showLeaderboardEl.checked);

    if (!Number.isFinite(level1) || level1 < 0 || !Number.isFinite(level2) || level2 < 0) {
      alert(adT('ad_invite_invalid'));
      return;
    }

    var rows = [
      { key: 'invite_level1_reward', value: String(level1) },
      { key: 'invite_level2_reward', value: String(level2) },
      { key: 'show_invite_leaderboard', value: showLeaderboard ? 'true' : 'false' }
    ];

    var result = await window.supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' });

    if (result.error) {
      alert(adT('ad_invite_save_fail') + result.error.message);
      return;
    }

    invalidateInviteSettingsCache();
    invalidateShowInviteLeaderboardCache();
    if (typeof applyLeaderboardMenuVisibility === 'function') {
      applyLeaderboardMenuVisibility();
    }
    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      window.coinrealmRefreshAuthArea();
    }
    alert(adT('ad_invite_save_ok'));
  }

  function ensureAdminAirdropTab() {
    if (document.getElementById('admin-panel-airdrop')) return;

    var tabsBar = document.querySelector('#admin-page .admin-tabs');
    var featuresTab = tabsBar && tabsBar.querySelector('[data-admin-tab="features"]');
    var inviteTab = tabsBar && tabsBar.querySelector('[data-admin-tab="invite"]');
    if (!tabsBar) return;

    var tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = 'admin-tab';
    tabBtn.setAttribute('data-admin-tab', 'airdrop');
    tabBtn.setAttribute('data-i18n', 'ad_tab_airdrop');
    tabBtn.textContent = adT('ad_tab_airdrop');
    if (featuresTab) {
      tabsBar.insertBefore(tabBtn, featuresTab);
    } else if (inviteTab && inviteTab.nextSibling) {
      tabsBar.insertBefore(tabBtn, inviteTab.nextSibling);
    } else {
      tabsBar.appendChild(tabBtn);
    }

    var panel = document.createElement('section');
    panel.id = 'admin-panel-airdrop';
    panel.className = 'admin-panel hidden';
    panel.innerHTML =
      '<h2 class="admin-section-title" data-i18n="ad_airdrop_title">' + adT('ad_airdrop_title') + '</h2>' +
      '<form id="ad-airdrop-form" class="admin-form admin-airdrop-form">' +
        '<label class="admin-airdrop-option">' +
          '<input type="radio" name="ad-airdrop-mode" id="ad-airdrop-mode-level2" value="level2" class="admin-airdrop-radio">' +
          '<span data-i18n="ad_airdrop_mode_level2">' + adT('ad_airdrop_mode_level2') + '</span>' +
        '</label>' +
        '<label class="admin-airdrop-option">' +
          '<input type="radio" name="ad-airdrop-mode" id="ad-airdrop-mode-daily-task" value="daily_task" class="admin-airdrop-radio">' +
          '<span data-i18n="ad_airdrop_mode_daily_task">' + adT('ad_airdrop_mode_daily_task') + '</span>' +
        '</label>' +
        '<button type="button" id="ad-airdrop-save-btn" class="admin-primary-btn" data-i18n="ad_btn_save_airdrop">' + adT('ad_btn_save_airdrop') + '</button>' +
      '</form>';

    var featuresPanel = document.getElementById('admin-panel-features');
    if (featuresPanel && featuresPanel.parentNode) {
      featuresPanel.parentNode.insertBefore(panel, featuresPanel);
    } else {
      var adminContent = document.getElementById('admin-content');
      if (adminContent) adminContent.appendChild(panel);
    }
  }

  async function loadAdminAirdropSettings() {
    ensureAdminAirdropTab();
    applyAdminI18n();

    var mode = normalizeAirdropMode(await fetchAirdropMode());
    var level2El = document.getElementById('ad-airdrop-mode-level2');
    var dailyTaskEl = document.getElementById('ad-airdrop-mode-daily-task');

    if (level2El) level2El.checked = mode === 'level2';
    if (dailyTaskEl) dailyTaskEl.checked = mode === 'daily_task';
  }

  async function saveAdminAirdropSettings() {
    if (!window.supabase) return;

    var selected = document.querySelector('input[name="ad-airdrop-mode"]:checked');
    var mode = normalizeAirdropMode(selected && selected.value);

    var result = await window.supabase
      .from('settings')
      .upsert([{ key: 'airdrop_mode', value: mode }], { onConflict: 'key' });

    if (result.error) {
      alert(adT('ad_airdrop_save_fail') + result.error.message);
      return;
    }

    invalidateAirdropModeCache();
    if (typeof window.coinrealmUpdateAirdropHint === 'function') {
      window.coinrealmUpdateAirdropHint();
    }
    alert(adT('ad_airdrop_save_ok'));
  }

  function ensureAdminFeaturesTab() {
    if (document.getElementById('admin-panel-features')) return;

    var tabsBar = document.querySelector('#admin-page .admin-tabs');
    var adsTab = tabsBar && tabsBar.querySelector('[data-admin-tab="ads"]');
    if (!tabsBar) return;

    var tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = 'admin-tab';
    tabBtn.setAttribute('data-admin-tab', 'features');
    tabBtn.setAttribute('data-i18n', 'ad_tab_features');
    tabBtn.textContent = adT('ad_tab_features');
    if (adsTab) {
      tabsBar.insertBefore(tabBtn, adsTab);
    } else {
      tabsBar.appendChild(tabBtn);
    }

    var panel = document.createElement('section');
    panel.id = 'admin-panel-features';
    panel.className = 'admin-panel hidden';
    panel.innerHTML =
      '<h2 class="admin-section-title" data-i18n="ad_features_title">' + adT('ad_features_title') + '</h2>' +
      '<form id="ad-features-form" class="admin-form admin-features-form">' +
        '<label class="admin-ads-toggle">' +
          '<input type="checkbox" id="ad-features-show-exchange" class="admin-ads-toggle-input">' +
          '<span class="admin-ads-toggle-slider" aria-hidden="true"></span>' +
          '<span class="admin-ads-toggle-text" data-i18n="ad_features_show_exchange">' + adT('ad_features_show_exchange') + '</span>' +
        '</label>' +
        '<label class="admin-ads-toggle">' +
          '<input type="checkbox" id="ad-features-show-dividends" class="admin-ads-toggle-input">' +
          '<span class="admin-ads-toggle-slider" aria-hidden="true"></span>' +
          '<span class="admin-ads-toggle-text" data-i18n="ad_features_show_dividends">' + adT('ad_features_show_dividends') + '</span>' +
        '</label>' +
        '<label class="admin-ads-toggle">' +
          '<input type="checkbox" id="ad-features-enable-usdt" class="admin-ads-toggle-input">' +
          '<span class="admin-ads-toggle-slider" aria-hidden="true"></span>' +
          '<span class="admin-ads-toggle-text" data-i18n="ad_features_enable_usdt">' + adT('ad_features_enable_usdt') + '</span>' +
        '</label>' +
        '<button type="button" id="ad-features-save-btn" class="admin-primary-btn" data-i18n="ad_btn_save_features">' + adT('ad_btn_save_features') + '</button>' +
      '</form>';

    var adsPanel = document.getElementById('admin-panel-ads');
    if (adsPanel && adsPanel.parentNode) {
      adsPanel.parentNode.insertBefore(panel, adsPanel);
    } else {
      var adminContent = document.getElementById('admin-content');
      if (adminContent) adminContent.appendChild(panel);
    }
  }

  function ensureAdminUsdtRewardToggle() {
    if (document.getElementById('ad-features-enable-usdt')) return;

    var form = document.getElementById('ad-features-form');
    var saveBtn = document.getElementById('ad-features-save-btn');
    if (!form || !saveBtn) return;

    var toggleWrap = document.createElement('label');
    toggleWrap.className = 'admin-ads-toggle';
    toggleWrap.innerHTML =
      '<input type="checkbox" id="ad-features-enable-usdt" class="admin-ads-toggle-input">' +
      '<span class="admin-ads-toggle-slider" aria-hidden="true"></span>' +
      '<span class="admin-ads-toggle-text" data-i18n="ad_features_enable_usdt">' + adT('ad_features_enable_usdt') + '</span>';

    form.insertBefore(toggleWrap, saveBtn);
  }

  async function loadAdminFeatureSettings() {
    ensureAdminFeaturesTab();
    ensureAdminUsdtRewardToggle();
    applyAdminI18n();

    var showExchangeEl = document.getElementById('ad-features-show-exchange');
    var showDividendsEl = document.getElementById('ad-features-show-dividends');
    var enableUsdtEl = document.getElementById('ad-features-enable-usdt');
    var showExchangeValue = await fetchShowExchange();
    var showDividendsValue = await fetchShowDividends();
    var enableUsdtValue = await fetchEnableUsdtReward();

    if (showExchangeEl) {
      showExchangeEl.checked = isExchangeEnabled(showExchangeValue);
    }
    if (showDividendsEl) {
      showDividendsEl.checked = isDividendsEnabled(showDividendsValue);
    }
    if (enableUsdtEl) {
      enableUsdtEl.checked = isEnableUsdtRewardEnabled(enableUsdtValue);
    }
  }

  async function saveAdminFeatureSettings() {
    if (!window.supabase) return;

    var showExchangeEl = document.getElementById('ad-features-show-exchange');
    var showDividendsEl = document.getElementById('ad-features-show-dividends');
    var enableUsdtEl = document.getElementById('ad-features-enable-usdt');
    var showExchange = !!(showExchangeEl && showExchangeEl.checked);
    var showDividends = !!(showDividendsEl && showDividendsEl.checked);
    var enableUsdt = !!(enableUsdtEl && enableUsdtEl.checked);

    var rows = [
      { key: 'show_exchange', value: showExchange ? 'true' : 'false' },
      { key: 'show_dividends', value: showDividends ? 'true' : 'false' },
      { key: 'enable_usdt_reward', value: enableUsdt ? 'true' : 'false' }
    ];

    var result = await window.supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' });

    if (result.error) {
      alert(adT('ad_features_save_fail') + result.error.message);
      return;
    }

    invalidateShowExchangeCache();
    invalidateShowDividendsCache();
    invalidateEnableUsdtRewardCache();
    if (typeof applyExchangeDividendsMenuVisibility === 'function') {
      applyExchangeDividendsMenuVisibility();
    }
    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      window.coinrealmRefreshAuthArea();
    }
    alert(adT('ad_features_save_ok'));
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

    ensureAdminInviteLeaderboardToggle();
    ensureAdminAirdropTab();
    ensureAdminFeaturesTab();
    ensureAdminUsdtRewardToggle();

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

    var airdropSaveBtn = document.getElementById('ad-airdrop-save-btn');
    if (airdropSaveBtn) {
      airdropSaveBtn.addEventListener('click', saveAdminAirdropSettings);
    }

    var featuresSaveBtn = document.getElementById('ad-features-save-btn');
    if (featuresSaveBtn) {
      featuresSaveBtn.addEventListener('click', saveAdminFeatureSettings);
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
    var text = dict[key] || (window.translations[window.getLang()] && window.translations[window.getLang()][key]) || key;
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
      } else if (window.translations[window.getLang()] && window.translations[window.getLang()][key]) {
        el.textContent = window.translations[window.getLang()][key];
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

      var duplicateResult = await checkTaskRewardDuplicate(taskId, userId);
      if (duplicateResult.alreadyRewarded) {
        console.log('简单任务专页：用户已完成该任务，禁止重复领取', { taskId: taskId, userId: userId });
        alert(stT('st_already_claimed'));
        renderSimpleTasksGrid();
        return;
      }

      if (typeof window.coinrealmGrantSimpleTaskRewards === 'function') {
        var grantResult = await window.coinrealmGrantSimpleTaskRewards(freshTask, userId, {
          priorStatus: '',
          creditRewardClient: true,
          path: 'performSimpleTaskClaim-simple-tasks-page-grant'
        });
        if (grantResult && grantResult.alreadyRewarded) {
          console.log('简单任务专页：发奖跳过，用户已领取', { taskId: taskId, userId: userId });
          alert(stT('st_already_claimed'));
          return;
        }
        if (!grantResult) {
          alert(stT('st_claim_fail'));
          return;
        }
      }

      var nowIso = new Date().toISOString();

      console.log('简单任务提交，status：', 'approved', {
        taskId: taskId,
        userId: userId,
        path: 'performSimpleTaskClaim-simple-tasks-page'
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
        alert(stT('st_claim_fail') + insertResult.error.message);
        return;
      }

      var refreshedTaskResult = await window.supabase
        .from('tasks')
        .select('current_participants')
        .eq('id', taskId)
        .maybeSingle();

      if (!refreshedTaskResult.error && refreshedTaskResult.data) {
        freshTask.current_participants = refreshedTaskResult.data.current_participants;
      }

      userSimpleSubmissionMap[taskId] = insertResult.data;
      task.current_participants = freshTask.current_participants;

      var listTask = simpleTasksList.find(function (item) {
        return String(item.id) === String(taskId);
      });
      if (listTask) listTask.current_participants = freshTask.current_participants;

      renderSimpleTasksGrid();
      alert(stT('st_claim_success'));

      if (typeof window.coinrealmNotifySubmissionStatusChanged === 'function') {
        window.coinrealmNotifySubmissionStatusChanged({
          taskId: taskId,
          userId: userId,
          status: 'approved',
          path: 'performSimpleTaskClaim-simple-tasks-page'
        });
      }

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

// ==========================================
// 我的分红页 (#dividends) — 功能开关保护
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      if (typeof window.coinrealmClearFeaturePageOriginalHtmlCache === 'function') {
        window.coinrealmClearFeaturePageOriginalHtmlCache();
      }
    }
  }

  async function handleDividendsFeatureGate() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    if (route !== 'dividends') return;

    var dividendsPage = document.getElementById('dividends-page');
    if (!dividendsPage) return;

    var enabled = false;
    if (typeof window.coinrealmIsDividendsEnabled === 'function') {
      enabled = await window.coinrealmIsDividendsEnabled();
    }

    if (!enabled) {
      if (typeof window.coinrealmRenderFeatureUnavailablePage === 'function') {
        window.coinrealmRenderFeatureUnavailablePage(dividendsPage);
      } else {
        dividendsPage.classList.remove('hidden');
      }
      return;
    }

    if (typeof window.coinrealmIsFeatureUnavailablePage === 'function' &&
        window.coinrealmIsFeatureUnavailablePage(dividendsPage)) {
      if (typeof window.coinrealmRestoreFeaturePageContent === 'function') {
        window.coinrealmRestoreFeaturePageContent(dividendsPage);
      }
      dividendsPage.classList.remove('hidden');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }

  function scheduleDividendsFeatureGate() {
    setTimeout(handleDividendsFeatureGate, 0);
  }

  window.addEventListener('hashchange', scheduleDividendsFeatureGate);

  window.addEventListener('DOMContentLoaded', function () {
    scheduleDividendsFeatureGate();
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', scheduleDividendsFeatureGate);
  }
})();
