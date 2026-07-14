/**
 * CoinRealm Mobile — 路由壳层 + PWA + 中英文切换
 * 业务逻辑复用桌面版 app.js / auth.js / js/i18n.js / js/pages/*
 */
(function () {
  'use strict';

  var TAB_ROUTES = ['home', 'simple-tasks', 'create-task', 'invite', 'profile'];

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
    'my-tasks'
  ];

  var SUB_TAB_HINT = {
    'task-detail': 'home',
    'submit-task': 'home',
    'my-tasks': 'profile',
    'publish-management': 'profile',
    review: 'profile',
    publisher: 'home',
    'broadcast-history': 'home'
  };

  var mobileInitialized = false;
  var cardEnhanceObserver = null;

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
    if (route === 'simple-tasks') {
      return window.currentLang === 'en' ? 'Simple Tasks' : '简单任务';
    }
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
    var simpleLabel = document.getElementById('mobile-tab-simple-label');
    if (simpleLabel) {
      simpleLabel.textContent = window.currentLang === 'en' ? 'Simple' : '简单任务';
    }
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

  function enhanceOfficialRecommendCards() {
    var grid = document.getElementById('official-recommend-grid');
    if (!grid) return;

    var cards = grid.querySelectorAll('.official-recommend-card');
    for (var i = 0; i < cards.length; i++) {
      if (i >= 4) break;
      var card = cards[i];
      if (card.querySelector('.mobile-official-claim-btn')) continue;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'claim-btn mobile-official-claim-btn';
      btn.textContent = window.currentLang === 'en' ? 'Claim' : '领取';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var taskId = this.getAttribute('data-task-id') ||
          (this.closest('.official-recommend-card') && this.closest('.official-recommend-card').getAttribute('data-task-id'));
        if (!taskId) return;
        if (typeof navigateToTaskDetail === 'function') {
          navigateToTaskDetail(taskId);
        } else {
          window.location.hash = 'task-detail?id=' + encodeURIComponent(taskId);
        }
      });
      btn.setAttribute('data-task-id', card.getAttribute('data-task-id') || '');
      card.appendChild(btn);
    }
  }

  function observeHomeCardEnhancements() {
    if (typeof MutationObserver === 'undefined') return;
    var target = document.getElementById('official-recommend-grid') || document.getElementById('app-content');
    if (!target) return;
    if (cardEnhanceObserver) cardEnhanceObserver.disconnect();
    cardEnhanceObserver = new MutationObserver(function () {
      enhanceOfficialRecommendCards();
    });
    cardEnhanceObserver.observe(target, { childList: true, subtree: true });
    enhanceOfficialRecommendCards();
  }

  function refreshCurrentPageContent() {
    var route = getRouteBase();

    if (route === 'home' && typeof applyFiltersAndSort === 'function') {
      applyFiltersAndSort();
      setTimeout(enhanceOfficialRecommendCards, 0);
      return;
    }

    if (typeof window.coinrealmApplyRoute === 'function' && route !== 'simple-tasks') {
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
    enhanceOfficialRecommendCards();
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

    // 所有页面都显示底部 Tab
    if (tabBar) tabBar.style.display = '';

    titleEl.textContent = getPageTitle(route);

    if (isTabRoute(route)) {
      body.classList.remove('sub-page');
      backBtn.classList.add('hidden');
      setActiveTab(route);
      return;
    }

    body.classList.add('sub-page');
    backBtn.classList.remove('hidden');
    setActiveTab(SUB_TAB_HINT[route] || '');
  }

  function navigateTo(route) {
    if (route === 'simple-tasks') {
      window.location.hash = 'simple-tasks';
      return;
    }
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
    if (route === 'review' || route === 'publish-management' || route === 'my-tasks') {
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
    if (route === 'home') {
      setTimeout(enhanceOfficialRecommendCards, 50);
    }
  }

  function registerServiceWorker() {
    // 临时禁用 Service Worker 注册，排查缓存/安装问题
    // if (!('serviceWorker' in navigator)) return;
    // window.addEventListener('load', function () {
    //   navigator.serviceWorker.register('sw.js').catch(function (err) {
    //     console.warn('[mobile] Service Worker 注册失败:', err);
    //   });
    // });
    return;
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
    if (!document.getElementById('home-page')) {
      if (loading) loading.remove();
      var mount = document.getElementById('app-content');
      if (mount && !mount.querySelector('.mobile-error-state')) {
        mount.innerHTML = '<div class="mobile-error-state"><p>页面内容加载失败，请刷新重试</p></div>';
      }
      return false;
    }
    if (loading) loading.remove();
    return true;
  }

  function initMobileShell() {
    if (mobileInitialized) return;
    if (!removeContentLoading()) return;
    mobileInitialized = true;
    bindLoginButtons();
    bindTabBar();
    bindHeader();
    observeAuthChanges();
    observeHomeCardEnhancements();
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
    enhanceOfficialRecommendCards();

    console.log('[mobile] 手机版壳层已初始化，当前语言:', window.currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileShell);
  } else {
    initMobileShell();
  }
})();
