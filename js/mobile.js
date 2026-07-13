/**
 * CoinRealm Mobile — 路由壳层 + PWA + 中英文切换
 * 业务逻辑复用桌面版 app.js / auth.js / js/i18n.js / js/pages/*
 */
(function () {
  'use strict';

  var TAB_ROUTES = ['home', 'my-tasks', 'create-task', 'invite', 'profile'];

  var SUB_ROUTES = [
    'task-detail',
    'submit-task',
    'review',
    'publish-management',
    'publisher',
    'leaderboard',
    'exchange',
    'dividends',
    'admin',
    'broadcast-history',
    'simple-tasks'
  ];

  var mobileInitialized = false;

  function getRouteBase() {
    var hash = window.location.hash.replace(/^#/, '') || 'home';
    return hash.split('?')[0] || 'home';
  }

  function isTabRoute(route) {
    return TAB_ROUTES.indexOf(route) >= 0;
  }

  function isLoggedIn() {
    return !!(window.supabase && document.querySelector('#auth-area .auth-user-wrap'));
  }

  function getPageTitle(route) {
    if (!window.translations || !window.currentLang) return 'CoinRealm';
    var pages = window.translations[window.currentLang].pages;
    if (pages && pages[route] && pages[route].title) {
      return pages[route].title;
    }
    if (route === 'home' && typeof window.t === 'function') return window.t('nav_home');
    if (route === 'invite' && typeof window.t === 'function') return window.t('nav_airdrop');
    return 'CoinRealm';
  }

  function applyMobilePageTabLabels() {
    document.querySelectorAll('[data-mobile-page]').forEach(function (el) {
      var route = el.getAttribute('data-mobile-page');
      if (route) el.textContent = getPageTitle(route);
    });
  }

  function applyMobileLoginSubtitle() {
    var subtitle = document.getElementById('mobile-login-subtitle');
    if (!subtitle) return;
    subtitle.textContent = window.currentLang === 'en'
      ? 'Web3 Tasks & Airdrop Platform'
      : 'Web3 任务与空投平台';
  }

  function syncLoginButtonLabels() {
    var googleHidden = document.getElementById('google-signin-btn');
    var walletHidden = document.getElementById('connect-wallet-btn');
    var googleMobile = document.getElementById('mobile-google-btn');
    var walletMobile = document.getElementById('mobile-wallet-btn');

    if (googleHidden && googleMobile) {
      googleMobile.textContent = googleHidden.textContent;
    }
    if (walletMobile && typeof window.t === 'function') {
      walletMobile.textContent = window.t('connectWallet');
    } else if (walletHidden && walletMobile) {
      walletMobile.textContent = walletHidden.textContent;
    }
  }

  function applyMobileShellI18n() {
    if (typeof applyLanguageStrings === 'function') {
      applyLanguageStrings();
    } else if (typeof window.t === 'function') {
      document.querySelectorAll('#mobile-header [data-i18n], #mobile-tab-bar [data-i18n], #mobile-content-loading [data-i18n], #mobile-wallet-btn[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (key) el.textContent = window.t(key);
      });
    }

    applyMobilePageTabLabels();
    applyMobileLoginSubtitle();
    updateLangButton();
    syncLoginButtonLabels();
  }

  function refreshCurrentPageContent() {
    var route = getRouteBase();

    if (route === 'home' && typeof applyFiltersAndSort === 'function') {
      applyFiltersAndSort();
      return;
    }

    if (typeof window.coinrealmApplyRoute === 'function') {
      window.coinrealmApplyRoute(route);
    }
  }

  function toggleMobileLanguage() {
    var nextLang = window.currentLang === 'zh' ? 'en' : 'zh';

    if (typeof window.switchLanguage === 'function') {
      window.switchLanguage(nextLang);
    } else {
      window.setGlobalLanguage(nextLang);
      if (typeof applyLanguageStrings === 'function') {
        applyLanguageStrings();
      }
    }

    applyMobileShellI18n();

    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      window.coinrealmRefreshAuthArea();
    }

    syncLoginButtonLabels();
    updateHeader(getRouteBase());
    refreshCurrentPageContent();
  }

  function syncLoginScreen() {
    var screen = document.getElementById('mobile-login-screen');
    if (!screen) return;
    if (isLoggedIn()) {
      screen.classList.add('hidden');
      screen.setAttribute('aria-hidden', 'true');
    } else {
      screen.classList.remove('hidden');
      screen.setAttribute('aria-hidden', 'false');
      syncLoginButtonLabels();
    }
  }

  function triggerHiddenAuthButton(id) {
    var btn = document.getElementById(id);
    if (btn) btn.click();
  }

  function bindLoginButtons() {
    var googleBtn = document.getElementById('mobile-google-btn');
    var walletBtn = document.getElementById('mobile-wallet-btn');

    if (googleBtn) {
      googleBtn.addEventListener('click', function () {
        triggerHiddenAuthButton('google-signin-btn');
      });
    }
    if (walletBtn) {
      walletBtn.addEventListener('click', function () {
        triggerHiddenAuthButton('connect-wallet-btn');
      });
    }
  }

  function setActiveTab(route) {
    document.querySelectorAll('.mobile-tab').forEach(function (tab) {
      var tabRoute = tab.getAttribute('data-route');
      tab.classList.toggle('active', tabRoute === route);
    });
  }

  function updateHeader(route) {
    var titleEl = document.getElementById('mobile-page-title');
    var backBtn = document.getElementById('mobile-back-btn');
    var tabBar = document.getElementById('mobile-tab-bar');
    var body = document.body;

    if (!titleEl || !backBtn) return;

    if (isTabRoute(route)) {
      body.classList.remove('sub-page');
      titleEl.textContent = getPageTitle(route);
      backBtn.classList.add('hidden');
      if (tabBar) tabBar.style.display = '';
      setActiveTab(route);
      return;
    }

    body.classList.add('sub-page');
    titleEl.textContent = SUB_ROUTES.indexOf(route) >= 0 ? getPageTitle(route) : 'CoinRealm';
    backBtn.classList.remove('hidden');
    if (tabBar) tabBar.style.display = 'none';
  }

  function navigateTo(route) {
    if (typeof window.coinrealmNavigateToRoute === 'function') {
      window.coinrealmNavigateToRoute(route);
      return;
    }
    window.location.hash = route;
  }

  function goBack() {
    var route = getRouteBase();
    if (route === 'task-detail' || route === 'submit-task') {
      window.history.length > 1 ? window.history.back() : navigateTo('home');
      return;
    }
    if (route === 'review' || route === 'publish-management') {
      navigateTo('profile');
      return;
    }
    if (route === 'publisher') {
      navigateTo('home');
      return;
    }
    navigateTo('home');
  }

  function bindTabBar() {
    document.querySelectorAll('.mobile-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var route = tab.getAttribute('data-route');
        if (!route) return;
        navigateTo(route);
      });
    });
  }

  function bindHeader() {
    var backBtn = document.getElementById('mobile-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', goBack);
    }

    var langBtn = document.getElementById('mobile-lang-btn');
    if (langBtn) {
      langBtn.addEventListener('click', toggleMobileLanguage);
    }
  }

  function updateLangButton() {
    var langBtn = document.getElementById('mobile-lang-btn');
    if (!langBtn || typeof window.t !== 'function') return;
    langBtn.textContent = window.t('langToggle');
  }

  function handleRouteChange() {
    var route = getRouteBase();
    updateHeader(route);
    syncLoginScreen();
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('[mobile] Service Worker 注册失败:', err);
      });
    });
  }

  function observeAuthChanges() {
    var authArea = document.getElementById('auth-area');
    if (!authArea || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function () {
      syncLoginScreen();
      syncLoginButtonLabels();
    });
    observer.observe(authArea, { childList: true, subtree: true });
  }

  function removeContentLoading() {
    var loading = document.getElementById('mobile-content-loading');
    if (loading) loading.remove();
  }

  function initMobileShell() {
    if (mobileInitialized) return;
    mobileInitialized = true;

    removeContentLoading();
    bindLoginButtons();
    bindTabBar();
    bindHeader();
    observeAuthChanges();
    registerServiceWorker();

    applyMobileShellI18n();

    window.addEventListener('hashchange', handleRouteChange);

    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      var origRefresh = window.coinrealmRefreshAuthArea;
      window.coinrealmRefreshAuthArea = function () {
        origRefresh();
        syncLoginScreen();
        syncLoginButtonLabels();
      };
    }

    handleRouteChange();
    syncLoginScreen();

    console.log('[mobile] 手机版壳层已初始化，当前语言:', window.currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileShell);
  } else {
    initMobileShell();
  }
})();
