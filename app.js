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

    function handleHashChange() {

      navigate(getRouteFromHash());

    }



    window.addEventListener('hashchange', handleHashChange);

    handleHashChange();

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

