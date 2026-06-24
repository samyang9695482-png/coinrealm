(function () {
  'use strict';

  // ==================== 全局状态 ====================
  var STORAGE_KEY_LANG = 'coinrealm_lang';
  var STORAGE_KEY_GUIDE = 'coinrealm_guide_closed';
  var DEFAULT_LANG = 'zh';
  var DEFAULT_ROUTE = 'home';

  // ==================== 中英文字典（合并首页 + 路由） ====================
  var translations = {
    zh: {
      // 导航栏
      CoinRealm: 'CoinRealm',
      connectWallet: '连接钱包',
      langToggle: 'EN',
      home: '首页',
      loading: '加载中...',

      // 首页
      ads_banner: '广告位（Web3 Ads）',
      broadcast_prefix: '用户',
      broadcast_done: '完成了注册任务，获得',
      guide_text: '欢迎来到 CoinRealm！选择一个任务，开始赚取 CRLM 吧。',
      search_placeholder: '搜索任务...',
      tag_all: '全部',
      tag_official: '官方',
      tag_airdrop: '空投',
      tag_register: '注册',
      tag_trade: '交易',
      tag_game: '游戏',
      tag_content: '内容',
      tag_test: '测试',
      sort_highest: '价值最高',
      sort_latest: '最新发布',
      sort_ending: '即将截止',
      sort_rewards: '奖励最多',
      badge_official: '官方',
      badge_promo: '推广',
      text_slots: '剩余名额',
      text_days: '天后',
      btn_claim: '领取',
      empty_text: '没有找到相关任务，换个筛选试试？',

      // 其他路由占位
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
      // 导航栏
      CoinRealm: 'CoinRealm',
      connectWallet: 'Connect Wallet',
      langToggle: '中文',
      home: 'Home',
      loading: 'Loading...',

      // 首页
      ads_banner: 'Advertising Space (Web3 Ads)',
      broadcast_prefix: 'User',
      broadcast_done: 'completed the registration task and received',
      guide_text: 'Welcome to CoinRealm! Select a task and start earning CRLM.',
      search_placeholder: 'Search tasks...',
      tag_all: 'All',
      tag_official: 'Official',
      tag_airdrop: 'Airdrop',
      tag_register: 'Register',
      tag_trade: 'Trade',
      tag_game: 'Game',
      tag_content: 'Content',
      tag_test: 'Test',
      sort_highest: 'Highest Value',
      sort_latest: 'Latest Released',
      sort_ending: 'Ending Soon',
      sort_rewards: 'Most Rewards',
      badge_official: 'Official',
      badge_promo: 'Promo',
      text_slots: 'Slots left',
      text_days: 'days left',
      btn_claim: 'Claim',
      empty_text: 'No tasks found. Try changing your filters?',

      // 其他路由占位
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

  // ==================== 语言工具函数 ====================
  function t(key) {
    var dict = translations[currentLang];
    return dict[key] !== undefined ? dict[key] : key;
  }

  function applyTranslations() {
    // 翻译带有 data-i18n 的元素
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });

    // 翻译带有 data-placeholder 的元素
    document.querySelectorAll('[data-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-placeholder');
      if (translations[currentLang][key]) {
        el.setAttribute('placeholder', translations[currentLang][key]);
      }
    });

    // 更新语言切换按钮文字
    if (langLabel) {
      langLabel.textContent = t('langToggle');
    }

    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  }

  // ==================== 路由系统 ====================
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

  function renderPage(route) {
    if (!appContent) return;

    // 如果是首页，直接显示 #home-page 的内容
    if (route === 'home') {
      var homePage = document.getElementById('home-page');
      if (homePage) {
        // 隐藏所有路由页面，显示首页
        appContent.innerHTML = '';
        appContent.appendChild(homePage);
        applyTranslations();
        initHomePageLogic();
      }
      return;
    }

    // 其他路由显示占位页面
    var page = getPageContent(route);
    appContent.innerHTML =
      '<div class="card page-placeholder">' +
        '<h1>' + page.title + '</h1>' +
        '<p>' + page.message + '</p>' +
      '</div>';
  }

  function navigate(route) {
    if (routes.indexOf(route) === -1 && route !== 'home') {
      route = DEFAULT_ROUTE;
    }
    currentRoute = route;
    renderPage(route);
  }

  function getRouteFromHash() {
    var hash = window.location.hash.replace(/^#/, '');
    return hash || DEFAULT_ROUTE;
  }

  // ==================== 语言切换 ====================
  function setLanguage(lang) {
    if (lang !== 'zh' && lang !== 'en') {
      lang = DEFAULT_LANG;
    }
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    applyTranslations();
    renderPage(currentRoute);
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'zh' ? 'en' : 'zh');
  }

  function initLanguage() {
    var saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'zh' || saved === 'en') {
      currentLang = saved;
    } else {
      currentLang = DEFAULT_LANG;
    }
    applyTranslations();
  }

  // ==================== 首页交互逻辑 ====================
  function initHomePageLogic() {
    // A. 新用户引导条
    var guideBar = document.getElementById('user-guide-bar');
    var closeGuideBtn = document.getElementById('close-guide-btn');
    if (guideBar && closeGuideBtn) {
      if (localStorage.getItem(STORAGE_KEY_GUIDE) === 'true') {
        guideBar.classList.add('hidden');
      } else {
        guideBar.classList.remove('hidden');
      }
      closeGuideBtn.addEventListener('click', function () {
        guideBar.classList.add('hidden');
        localStorage.setItem(STORAGE_KEY_GUIDE, 'true');
      });
    }

    // B. 骨架屏
    var skeletonScreen = document.getElementById('skeleton-screen');
    var taskGrid = document.getElementById('task-grid');
    if (skeletonScreen && taskGrid) {
      skeletonScreen.classList.remove('hidden');
      taskGrid.classList.add('hidden');
      setTimeout(function () {
        skeletonScreen.classList.add('hidden');
        taskGrid.classList.remove('hidden');
        applyTranslations();
      }, 2000);
    }

    // C. 类型筛选
    var tagButtons = document.querySelectorAll('#filter-tags .tag-btn');
    var taskCards = document.querySelectorAll('#task-grid .task-card');
    var emptyState = document.getElementById('empty-state');
    tagButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        tagButtons.forEach(function (btn) { btn.classList.remove('active'); });
        button.classList.add('active');
        var selectedCategory = button.getAttribute('data-type');
        var visibleCount = 0;
        taskCards.forEach(function (card) {
          var cardCategory = card.getAttribute('data-category');
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.classList.remove('hidden');
            visibleCount++;
          } else {
            card.classList.add('hidden');
          }
        });
        if (visibleCount === 0 && emptyState) {
          emptyState.classList.remove('hidden');
          if (taskGrid) taskGrid.classList.add('hidden');
        } else {
          if (emptyState) emptyState.classList.add('hidden');
          if (taskGrid && skeletonScreen && skeletonScreen.classList.contains('hidden')) {
            taskGrid.classList.remove('hidden');
          }
        }
      });
    });

    // D. 排序下拉
    var sortDropdown = document.getElementById('sort-dropdown');
    if (sortDropdown) {
      sortDropdown.addEventListener('change', function (e) {
        console.log('Sorting changed to: ' + e.target.value);
      });
    }

    // E. 回到顶部按钮
    var backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
          backToTopBtn.classList.remove('hidden');
        } else {
          backToTopBtn.classList.add('hidden');
        }
      });
      backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==================== 事件绑定 ====================
  function initEvents() {
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', toggleLanguage);
    }
  }

  function initRouter() {
    function handleHashChange() {
      navigate(getRouteFromHash());
    }
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
  }

  // ==================== 启动 ====================
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
