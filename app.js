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
// ==========================================
// 1. 多语言中英文字典追加 (请合并到已有 translations 中)
// ==========================================
const translations = {
    zh: {
        ads_banner: "广告位（Web3 Ads）",
        broadcast_prefix: "用户",
        broadcast_done: "完成了注册任务，获得",
        guide_text: "欢迎来到 CoinRealm！选择一个任务，开始赚取 CRLM 吧。",
        search_placeholder: "搜索任务...",
        tag_all: "全部",
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
        text_slots: "剩余名额",
        text_days: "天后",
        btn_claim: "领取",
        empty_text: "没有找到相关任务，换个筛选试试？"
    },
    en: {
        ads_banner: "Advertising Space (Web3 Ads)",
        broadcast_prefix: "User",
        broadcast_done: "completed the registration task and received",
        guide_text: "Welcome to CoinRealm! Select a task and start earning CRLM.",
        search_placeholder: "Search tasks...",
        tag_all: "All",
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
        text_slots: "Slots left",
        text_days: "days left",
        btn_claim: "Claim",
        empty_text: "No tasks found. Try changing your filters?"
    }
};

// 当前全局语言变量声明（假设项目中已存在该状态控制）
let currentLang = localStorage.getItem('coinrealm_lang') || 'zh';

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

    // B. 骨架屏定时控制切入逻辑
    const skeletonScreen = document.getElementById('skeleton-screen');
    const taskGrid = document.getElementById('task-grid');
    
    if (skeletonScreen && taskGrid) {
        skeletonScreen.classList.remove('hidden');
        taskGrid.classList.add('hidden');
        
        setTimeout(() => {
            skeletonScreen.classList.add('hidden');
            taskGrid.classList.remove('hidden');
            // 数据展现后刷新一次当前界面的语言文本
            applyLanguageStrings();
        }, 2000);
    }

    // C. 类型筛选标签切换交互逻辑
    const tagButtons = document.querySelectorAll('#filter-tags .tag-btn');
    const taskCards = document.querySelectorAll('#task-grid .task-card');
    const emptyState = document.getElementById('empty-state');

    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            tagButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-type');
            let visibleCount = 0;

            taskCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // 联动无数据时的空状态组件状态
            if (visibleCount === 0) {
                emptyState.classList.remove('hidden');
                taskGrid.classList.add('hidden');
            } else {
                emptyState.classList.add('hidden');
                // 仅在骨架屏倒计时结束后才展现网格
                if(skeletonScreen.classList.contains('hidden')) {
                    taskGrid.classList.remove('hidden');
                }
            }
        });
    });

    // D. 排序下拉交互绑定 (由于是静态卡片，在此做占位交互展示结构)
    const sortDropdown = document.getElementById('sort-dropdown');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            console.log(`Sorting criteria changed to: ${e.target.value}`);
            // 真实项目中这里将重新对 DOM 数组排序或发起新数据请求
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
}

// ==========================================
// 4. 路由系统挂载衔接机制 (请根据具体路由实现进行补充)
// ==========================================
// 示例：当触发 hashchange 切换进入 #home 路由时调用
function handleRoute() {
    const hash = window.location.hash || '#home';
    if (hash === '#home') {
        // 在此注入或展现 index.html 节点结构后，执行以下核心初始化
        initHomePageLogic();
        applyLanguageStrings();
    }
}

// 语言切换控制对外桥接函数示例
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('coinrealm_lang', lang);
    applyLanguageStrings();
}

// 页面加载完毕后默认触发一次
window.addEventListener('DOMContentLoaded', () => {
    handleRoute();
});
window.addEventListener('hashchange', handleRoute);

