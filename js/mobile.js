/**
 * CoinRealm Mobile — 路由壳层 + PWA
 * 业务逻辑复用桌面版 app.js / auth.js / js/pages/*
 */
(function () {
  'use strict';

  var TAB_ROUTES = ['home', 'my-tasks', 'create-task', 'invite', 'profile'];

  var SUB_ROUTES = {
    'task-detail': '任务详情',
    'submit-task': '提交凭证',
    review: '审核管理',
    'publish-management': '发布管理',
    publisher: '发布者',
    leaderboard: '排行榜',
    exchange: '兑换市场',
    dividends: '我的分红',
    admin: '管理后台',
    'broadcast-history': '广播动态',
    'simple-tasks': '简单任务'
  };

  var TAB_TITLES = {
    home: '任务中心',
    'my-tasks': '我的任务',
    'create-task': '发布任务',
    invite: '空投中心',
    profile: '我的'
  };

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

  function syncLoginScreen() {
    var screen = document.getElementById('mobile-login-screen');
    if (!screen) return;
    if (isLoggedIn()) {
      screen.classList.add('hidden');
      screen.setAttribute('aria-hidden', 'true');
    } else {
      screen.classList.remove('hidden');
      screen.setAttribute('aria-hidden', 'false');
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
      titleEl.textContent = TAB_TITLES[route] || 'CoinRealm';
      backBtn.classList.add('hidden');
      if (tabBar) tabBar.style.display = '';
      setActiveTab(route);
      return;
    }

    body.classList.add('sub-page');
    titleEl.textContent = SUB_ROUTES[route] || 'CoinRealm';
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
      langBtn.addEventListener('click', function () {
        var desktopLang = document.getElementById('lang-toggle');
        if (desktopLang) {
          desktopLang.click();
        } else {
          var current = localStorage.getItem('coinrealm_lang') === 'en' ? 'en' : 'zh';
          localStorage.setItem('coinrealm_lang', current === 'zh' ? 'en' : 'zh');
          window.location.reload();
        }
        updateLangButton();
      });
    }
  }

  function updateLangButton() {
    var langBtn = document.getElementById('mobile-lang-btn');
    if (!langBtn) return;
    var lang = localStorage.getItem('coinrealm_lang') === 'en' ? 'en' : 'zh';
    langBtn.textContent = lang === 'en' ? 'EN' : '中';
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
    updateLangButton();
    observeAuthChanges();
    registerServiceWorker();

    window.addEventListener('hashchange', handleRouteChange);

    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      var origRefresh = window.coinrealmRefreshAuthArea;
      window.coinrealmRefreshAuthArea = function () {
        origRefresh();
        syncLoginScreen();
      };
    }

    handleRouteChange();
    syncLoginScreen();

    console.log('[mobile] 手机版壳层已初始化');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileShell);
  } else {
    initMobileShell();
  }
})();
