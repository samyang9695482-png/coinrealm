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

  // 模拟当前用户身份：'visitor' | 'worker' | 'publisher' | 'level_insufficient' | 'ended'
  var currentUserRole = 'visitor';

  var taskDetailTranslations = {
    zh: {
      td_official_badge: '官方认证',
      td_desc_title: '任务描述',
      td_req_title: '任务要求',
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
      td_btn_submit: '去提交',
      td_btn_manage: '管理任务',
      td_btn_level: '等级不足（需Lv.1以上）',
      td_btn_ended: '已结束',
      td_completion_rate: '{rate}% 完成率',
      td_published_count: '已发布 {count} 个任务',
      td_level_master: '大师',
      td_deadline: '{days}天后 ({date})',
      td_staked: '已质押 {total} CRLM（奖励{reward} + 押金{deposit}）',
      td_type_airdrop: '空投',
      td_type_register: '注册'
    },
    en: {
      td_official_badge: 'Official Verified',
      td_desc_title: 'Description',
      td_req_title: 'Requirements',
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
      td_btn_submit: 'Submit Proof',
      td_btn_manage: 'Manage Task',
      td_btn_level: 'Level Too Low (Lv.1+ required)',
      td_btn_ended: 'Ended',
      td_completion_rate: '{rate}% completion rate',
      td_published_count: '{count} tasks published',
      td_level_master: 'Master',
      td_deadline: '{days} days left ({date})',
      td_staked: 'Staked {total} CRLM (reward {reward} + deposit {deposit})',
      td_type_airdrop: 'Airdrop',
      td_type_register: 'Register'
    }
  };

  var sampleTask = {
    publisher: {
      username: 'AlphaRadar',
      level: 5,
      levelLabelKey: 'td_level_master',
      completionRate: 98,
      publishedCount: 23,
      isOfficial: false
    },
    task: {
      title: '注册XX交易所，领取空投',
      titleEn: 'Register on XX Exchange & Claim Airdrop',
      type: 'airdrop',
      reward: 500,
      description: [
        '完成指定交易所注册并完成 KYC 验证，即可领取平台空投奖励。',
        '请确保使用本人实名信息注册，提交时需附上注册成功截图。'
      ],
      descriptionEn: [
        'Register on the designated exchange and complete KYC verification to claim the platform airdrop reward.',
        'Please use your real identity for registration and attach a screenshot when submitting.'
      ],
      requirements: [
        '注册并完成 KYC',
        '截图上传',
        '提供钱包地址'
      ],
      requirementsEn: [
        'Register and complete KYC',
        'Upload screenshot',
        'Provide wallet address'
      ],
      isHighRisk: false
    },
    status: {
      slotsLeft: 15,
      slotsTotal: 20,
      daysLeft: 3,
      deadline: '2025年1月15日',
      deadlineEn: 'Jan 15, 2025',
      stakedTotal: 600,
      rewardAmount: 500,
      depositAmount: 100
    },
    pin: {
      isPinned: false,
      pinnedDaysLeft: 0
    }
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
  }

  function renderTaskDetailPage() {
    var task = sampleTask;
    var lang = getLang();
    var isZh = lang === 'zh';

    var officialBadge = document.getElementById('td-official-badge');
    if (officialBadge) {
      if (task.publisher.isOfficial) {
        officialBadge.classList.remove('hidden');
      } else {
        officialBadge.classList.add('hidden');
      }
    }

    var publisherName = document.getElementById('td-publisher-name');
    if (publisherName) publisherName.textContent = task.publisher.username;

    var publisherLevel = document.getElementById('td-publisher-level');
    if (publisherLevel) {
      publisherLevel.textContent = 'Lv.' + task.publisher.level + ' ' + tdT(task.publisher.levelLabelKey);
    }

    var completionRate = document.getElementById('td-completion-rate');
    if (completionRate) {
      completionRate.textContent = tdT('td_completion_rate', { rate: task.publisher.completionRate });
    }

    var publishedCount = document.getElementById('td-published-count');
    if (publishedCount) {
      publishedCount.textContent = tdT('td_published_count', { count: task.publisher.publishedCount });
    }

    var taskTitle = document.getElementById('td-task-title');
    if (taskTitle) {
      taskTitle.textContent = isZh ? task.task.title : task.task.titleEn;
    }

    var taskType = document.getElementById('td-task-type');
    if (taskType) {
      taskType.textContent = tdT('td_type_' + task.task.type);
      taskType.className = 'td-type-label label-' + task.task.type;
    }

    var rewardAmount = document.getElementById('td-reward-amount');
    if (rewardAmount) rewardAmount.textContent = task.task.reward + ' CRLM';

    var descEl = document.getElementById('td-task-description');
    if (descEl) {
      var descParas = isZh ? task.task.description : task.task.descriptionEn;
      descEl.innerHTML = descParas.map(function (p) {
        return '<p>' + p + '</p>';
      }).join('');
    }

    var reqEl = document.getElementById('td-task-requirements');
    if (reqEl) {
      var reqs = isZh ? task.task.requirements : task.task.requirementsEn;
      reqEl.innerHTML = reqs.map(function (r) {
        return '<li>' + r + '</li>';
      }).join('');
    }

    var slotsText = document.getElementById('td-slots-text');
    if (slotsText) {
      slotsText.textContent = task.status.slotsLeft + '/' + task.status.slotsTotal;
    }

    var progressFill = document.getElementById('td-slots-progress-fill');
    if (progressFill) {
      var pct = (task.status.slotsLeft / task.status.slotsTotal) * 100;
      progressFill.style.width = pct + '%';
    }

    var deadlineText = document.getElementById('td-deadline-text');
    if (deadlineText) {
      deadlineText.textContent = tdT('td_deadline', {
        days: task.status.daysLeft,
        date: isZh ? task.status.deadline : task.status.deadlineEn
      });
    }

    var stakedText = document.getElementById('td-staked-text');
    if (stakedText) {
      stakedText.textContent = tdT('td_staked', {
        total: task.status.stakedTotal,
        reward: task.status.rewardAmount,
        deposit: task.status.depositAmount
      });
    }

    var highRiskTag = document.getElementById('td-high-risk-tag');
    if (highRiskTag) {
      if (task.task.isHighRisk) {
        highRiskTag.classList.remove('hidden');
      } else {
        highRiskTag.classList.add('hidden');
      }
    }

    updatePinCard();
    updateBottomActionBar();
    applyTaskDetailI18n();
  }

  function updatePinCard() {
    var pinCard = document.getElementById('td-pin-card');
    var pinStatus = document.getElementById('td-pin-status');
    if (!pinCard || !pinStatus) return;

    if (currentUserRole === 'publisher') {
      pinCard.classList.remove('hidden');
      if (sampleTask.pin.isPinned) {
        pinStatus.textContent = tdT('td_pin_pinned', { days: sampleTask.pin.pinnedDaysLeft });
      } else {
        pinStatus.textContent = tdT('td_pin_not_pinned');
      }
    } else {
      pinCard.classList.add('hidden');
    }
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

    var activeBtn = null;
    switch (currentUserRole) {
      case 'worker':
        activeBtn = buttons.submit;
        break;
      case 'publisher':
        activeBtn = buttons.manage;
        break;
      case 'level_insufficient':
        activeBtn = buttons.level;
        break;
      case 'ended':
        activeBtn = buttons.ended;
        break;
      default:
        activeBtn = buttons.claim;
    }

    if (activeBtn) activeBtn.classList.remove('hidden');
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
    }
  }

  function showPageByRoute(route) {
    restoreAppContentIfNeeded();

    var homePage = document.getElementById('home-page');
    var taskDetailPage = document.getElementById('task-detail-page');

    if (homePage) homePage.classList.add('hidden');
    if (taskDetailPage) taskDetailPage.classList.add('hidden');

    if (route === 'task-detail') {
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
    var hash = window.location.hash.replace(/^#/, '') || 'home';
    showPageByRoute(hash);
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
        var route = window.location.hash.replace(/^#/, '') || 'home';
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

  var userLevel = 2;
  var userBalance = 500;
  var createTaskInitialized = false;

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
      ct_ph_title: '请输入任务标题',
      ct_ph_desc: '请详细描述任务内容和要求',
      ct_ph_req: '请输入任务要求',
      ct_ph_reward: '请输入奖励金额',
      ct_ph_slots: '请输入名额（留空则不限）',
      ct_type_other: '其他',
      ct_add_req: '+ 添加要求',
      ct_proof_text: '文字凭证',
      ct_proof_screenshot: '截图凭证',
      ct_stake_note: '仅 Lv.3 及以上用户可发布任务。',
      ct_stake_hint: '发布此任务需质押 {amount} CRLM（奖励 + 押金），任务完成后押金退还。',
      ct_stake_hint_usdt: '发布此任务需质押 {amount} USDT（奖励 + 押金），任务完成后押金退还。',
      ct_btn_submit: '确认发布',
      ct_btn_balance: '余额不足，请先兑换 CRLM',
      ct_btn_level: '等级不足（需 Lv.3 以上）',
      ct_agreement: '点击发布即表示同意 CoinRealm 发布规则',
      ct_alert_required: '请填写所有必填字段',
      ct_alert_success: '任务发布成功！',
      tag_all: '全部',
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
      ct_ph_title: 'Enter task title',
      ct_ph_desc: 'Describe the task content and requirements in detail',
      ct_ph_req: 'Enter a requirement',
      ct_ph_reward: 'Enter reward amount',
      ct_ph_slots: 'Enter slots (leave empty for unlimited)',
      ct_type_other: 'Other',
      ct_add_req: '+ Add Requirement',
      ct_proof_text: 'Text Proof',
      ct_proof_screenshot: 'Screenshot Proof',
      ct_stake_note: 'Only Lv.3+ users can publish tasks.',
      ct_stake_hint: 'Publishing requires staking {amount} CRLM (reward + deposit). Deposit refunded after completion.',
      ct_stake_hint_usdt: 'Publishing requires staking {amount} USDT (reward + deposit). Deposit refunded after completion.',
      ct_btn_submit: 'Confirm & Publish',
      ct_btn_balance: 'Insufficient balance, please exchange CRLM first',
      ct_btn_level: 'Level too low (Lv.3+ required)',
      ct_agreement: 'By publishing, you agree to CoinRealm publishing rules',
      ct_alert_required: 'Please fill in all required fields',
      ct_alert_success: 'Task published successfully!',
      tag_all: 'All',
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

  function calcStakeTotal(reward) {
    var deposit = reward * 0.2;
    return reward + deposit;
  }

  function updateStakeHint() {
    var hintEl = document.getElementById('ct-stake-hint');
    if (!hintEl) return;

    var reward = getRewardAmount();
    var total = reward > 0 ? calcStakeTotal(reward) : 0;
    var amountStr = total % 1 === 0 ? String(total) : total.toFixed(2);
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
    updateSubmitButtonState();
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

    updateStakeHint();
    updateSubmitButtonState();
    applyCreateTaskI18n();
  }

  function validateForm() {
    var title = document.getElementById('ct-task-title');
    var type = document.getElementById('ct-task-type');
    var desc = document.getElementById('ct-task-desc');
    var reward = document.getElementById('ct-reward-amount');
    var deadline = document.getElementById('ct-deadline');
    var reqInputs = document.querySelectorAll('#ct-requirements-list .create-task-req-input');

    if (!title || !title.value.trim()) return false;
    if (!type || !type.value) return false;
    if (!desc || !desc.value.trim()) return false;
    if (!reward || !reward.value.trim() || parseFloat(reward.value) <= 0) return false;
    if (!deadline || !deadline.value) return false;

    var hasReq = false;
    reqInputs.forEach(function (input) {
      if (input.value.trim()) hasReq = true;
    });
    if (!hasReq) return false;

    return true;
  }

  function initCreateTaskEvents() {
    if (createTaskInitialized) return;
    createTaskInitialized = true;

    var rewardInput = document.getElementById('ct-reward-amount');
    if (rewardInput) {
      rewardInput.addEventListener('input', function () {
        updateStakeHint();
        updateSubmitButtonState();
      });
    }

    document.querySelectorAll('input[name="ct-reward-type"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        updateStakeHint();
        updateSubmitButtonState();
      });
    });

    var submitBtn = document.getElementById('ct-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        if (submitBtn.disabled) return;
        if (!validateForm()) {
          alert(ctT('ct_alert_required'));
          return;
        }
        alert(ctT('ct_alert_success'));
        resetCreateTaskForm();
      });
    }

    initRequirementList();
  }

  function renderCreateTaskPage() {
    var deadline = document.getElementById('ct-deadline');
    if (deadline && !deadline.value) {
      deadline.value = getDefaultDeadline();
    }

    initCreateTaskEvents();
    applyCreateTaskI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      createTaskInitialized = false;
    }
  }

  function handleCreateTaskRoute() {
    restoreAppContentIfNeeded();

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

  var submitState = 'form';
  var uploadedFiles = [];
  var submitTaskInitialized = false;

  var sampleSubmitTask = {
    title: '注册XX交易所，领取空投',
    titleEn: 'Register on XX Exchange & Claim Airdrop',
    reward: 500,
    rewardUnit: 'CRLM'
  };

  var submitTaskTranslations = {
    zh: {
      st_title_submit: '提交凭证',
      st_title_waiting: '等待审核',
      st_ph_desc: '请描述你是如何完成任务的...',
      st_upload_main: '📷 点击或拖拽上传截图',
      st_upload_hint: '支持 JPG、PNG 格式，单张不超过 5MB',
      st_ph_note: '补充说明（可选）',
      st_waiting_text: '你的凭证已提交，等待发布者审核',
      st_waiting_sub: '预计 48 小时内完成审核',
      st_btn_submit: '提交审核',
      st_btn_submitted: '已提交',
      st_alert_desc: '请填写任务完成描述',
      st_alert_max_files: '最多上传 3 张截图'
    },
    en: {
      st_title_submit: 'Submit Proof',
      st_title_waiting: 'Pending Review',
      st_ph_desc: 'Describe how you completed the task...',
      st_upload_main: '📷 Click or drag to upload screenshots',
      st_upload_hint: 'JPG, PNG supported, max 5MB per file',
      st_ph_note: 'Additional notes (optional)',
      st_waiting_text: 'Your proof has been submitted and is awaiting publisher review',
      st_waiting_sub: 'Review expected within 48 hours',
      st_btn_submit: 'Submit for Review',
      st_btn_submitted: 'Submitted',
      st_alert_desc: 'Please fill in the task completion description',
      st_alert_max_files: 'Maximum 3 screenshots allowed'
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

  function renderFileList() {
    var listEl = document.getElementById('st-file-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    uploadedFiles.forEach(function (file, index) {
      var li = document.createElement('li');
      li.className = 'submit-task-file-item';
      li.innerHTML =
        '<span class="st-file-name">' + file.name + '</span>' +
        '<button type="button" class="st-file-delete" data-index="' + index + '" aria-label="Delete">&times;</button>';
      listEl.appendChild(li);
    });

    listEl.querySelectorAll('.st-file-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        uploadedFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }

  function handleFilesSelected(fileList) {
    var files = Array.from(fileList);
    var remaining = 3 - uploadedFiles.length;

    if (remaining <= 0) {
      alert(stT('st_alert_max_files'));
      return;
    }

    if (files.length > remaining) {
      alert(stT('st_alert_max_files'));
      files = files.slice(0, remaining);
    }

    files.forEach(function (file) {
      uploadedFiles.push({ name: file.name });
    });

    renderFileList();
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
    var submitBtn = document.getElementById('st-submit-btn');

    if (submitState === 'waiting') {
      if (pageTitle) pageTitle.textContent = stT('st_title_waiting');
      if (formSection) formSection.classList.add('hidden');
      if (waitingSection) waitingSection.classList.remove('hidden');
      if (submitBtn) {
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
        submitBtn.textContent = stT('st_btn_submit');
        submitBtn.classList.remove('st-btn-disabled');
        submitBtn.classList.add('st-btn-gold');
        submitBtn.disabled = false;
      }
    }
  }

  function renderSummaryCard() {
    var titleEl = document.getElementById('st-task-title');
    var rewardEl = document.getElementById('st-task-reward');
    var isZh = getLang() === 'zh';

    if (titleEl) {
      titleEl.textContent = isZh ? sampleSubmitTask.title : sampleSubmitTask.titleEn;
    }
    if (rewardEl) {
      rewardEl.textContent = sampleSubmitTask.reward + ' ' + sampleSubmitTask.rewardUnit;
    }
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
      submitBtn.addEventListener('click', function () {
        if (submitState === 'waiting') return;

        var desc = document.getElementById('st-description');
        if (!desc || !desc.value.trim()) {
          alert(stT('st_alert_desc'));
          return;
        }

        submitState = 'waiting';
        updatePageStateUI();
      });
    }
  }

  function renderSubmitTaskPage() {
    renderSummaryCard();
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
    }
  }

  function handleSubmitTaskRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
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

  var sampleUser = {
    username: 'AlphaRadar',
    level: 5,
    levelLabelKey: 'pf_level_master',
    completionRate: 98,
    crlmBalance: 12500,
    usdtValue: 1250,
    stats: {
      inProgress: 3,
      completed: 28,
      totalEarnings: 15600
    }
  };

  var profileTranslations = {
    zh: {
      pf_btn_withdraw: '提币',
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
      pf_level_master: '大师',
      pf_completion_rate: '{rate}% 完成率',
      pf_level_badge: 'Lv.{level} {label}',
      pf_usdt_approx: '≈ {amount} USDT'
    },
    en: {
      pf_btn_withdraw: 'Withdraw',
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
      pf_level_master: 'Master',
      pf_completion_rate: '{rate}% completion rate',
      pf_level_badge: 'Lv.{level} {label}',
      pf_usdt_approx: '≈ {amount} USDT'
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

  function applyProfileI18n() {
    document.querySelectorAll('#profile-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (profileTranslations[getLang()][key]) {
        el.textContent = pfT(key);
      }
    });
  }

  function renderProfilePage() {
    var user = sampleUser;

    var usernameEl = document.getElementById('pf-username');
    if (usernameEl) usernameEl.textContent = user.username;

    var levelBadge = document.getElementById('pf-level-badge');
    if (levelBadge) {
      levelBadge.textContent = pfT('pf_level_badge', {
        level: user.level,
        label: pfT(user.levelLabelKey)
      });
    }

    var reputationEl = document.getElementById('pf-reputation');
    if (reputationEl) {
      reputationEl.textContent = pfT('pf_completion_rate', { rate: user.completionRate });
    }

    var crlmEl = document.getElementById('pf-crlm-balance');
    if (crlmEl) {
      crlmEl.textContent = formatNumber(user.crlmBalance) + ' CRLM';
    }

    var usdtEl = document.getElementById('pf-usdt-value');
    if (usdtEl) {
      usdtEl.textContent = pfT('pf_usdt_approx', { amount: formatNumber(user.usdtValue) });
    }

    var progressEl = document.getElementById('pf-stat-progress');
    if (progressEl) progressEl.textContent = user.stats.inProgress;

    var completedEl = document.getElementById('pf-stat-completed');
    if (completedEl) completedEl.textContent = user.stats.completed;

    var earningsEl = document.getElementById('pf-stat-earnings');
    if (earningsEl) earningsEl.textContent = formatNumber(user.stats.totalEarnings);

    applyProfileI18n();
  }

  function initProfileEvents() {
    if (profileInitialized) return;
    profileInitialized = true;

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
// 9. 我的分红页 (#dividends) — 任务卡 #007
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var sampleDividendsData = {
    countdown: { days: 3, hours: 12, minutes: 30 },
    holdings: { amount: 12500, bonus: '1.5x' },
    invites: { count: 23, bonus: '1.5x' },
    totalWeight: '3.0x',
    lastDividend: {
      amount: 850,
      date: '2025-01-15',
      sourceKey: 'dv_source_commission'
    },
    history: [
      { date: '2025-01-15', amount: 850, sourceKey: 'dv_source_commission' },
      { date: '2025-01-08', amount: 720, sourceKey: 'dv_source_commission' },
      { date: '2025-01-01', amount: 680, sourceKey: 'dv_source_holding' }
    ]
  };

  var dividendsTranslations = {
    zh: {
      dv_page_title: '我的分红',
      dv_countdown_label: '距离下次分红还有',
      dv_countdown_note: '分红每周结算一次',
      dv_countdown_value: '{days}天 {hours}小时 {minutes}分',
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
      dv_amount_plus: '+{amount} CRLM'
    },
    en: {
      dv_page_title: 'My Dividends',
      dv_countdown_label: 'Time until next dividend',
      dv_countdown_note: 'Dividends settle weekly',
      dv_countdown_value: '{days}d {hours}h {minutes}m',
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
      dv_amount_plus: '+{amount} CRLM'
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

  function renderDividendsPage() {
    var data = sampleDividendsData;

    var countdownEl = document.getElementById('dv-countdown-value');
    if (countdownEl) {
      countdownEl.textContent = dvT('dv_countdown_value', {
        days: data.countdown.days,
        hours: data.countdown.hours,
        minutes: data.countdown.minutes
      });
    }

    var holdingsAmount = document.getElementById('dv-holdings-amount');
    if (holdingsAmount) {
      holdingsAmount.textContent = formatNumber(data.holdings.amount) + ' CRLM';
    }

    var holdingsBonus = document.getElementById('dv-holdings-bonus');
    if (holdingsBonus) {
      holdingsBonus.textContent = dvT('dv_bonus', { bonus: data.holdings.bonus });
    }

    var invitesCount = document.getElementById('dv-invites-count');
    if (invitesCount) {
      invitesCount.textContent = dvT('dv_invites_unit', { count: data.invites.count });
    }

    var invitesBonus = document.getElementById('dv-invites-bonus');
    if (invitesBonus) {
      invitesBonus.textContent = dvT('dv_bonus', { bonus: data.invites.bonus });
    }

    var totalWeight = document.getElementById('dv-total-weight');
    if (totalWeight) totalWeight.textContent = data.totalWeight;

    var lastAmount = document.getElementById('dv-last-amount');
    if (lastAmount) {
      lastAmount.textContent = dvT('dv_amount_plus', { amount: formatNumber(data.lastDividend.amount) });
    }

    var lastDate = document.getElementById('dv-last-date');
    if (lastDate) lastDate.textContent = data.lastDividend.date;

    var lastSource = document.getElementById('dv-last-source');
    if (lastSource) {
      lastSource.textContent = dvT(data.lastDividend.sourceKey);
    }

    var historyList = document.getElementById('dv-history-list');
    if (historyList) {
      historyList.innerHTML = data.history.map(function (item) {
        return (
          '<li class="dividends-history-item">' +
            '<span class="dividends-history-date">' + item.date + '</span>' +
            '<span class="dividends-history-amount">' + dvT('dv_amount_plus', { amount: formatNumber(item.amount) }) + '</span>' +
            '<span class="dividends-history-source">' + dvT(item.sourceKey) + '</span>' +
          '</li>'
        );
      }).join('');
    }

    applyDividendsI18n();
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

  var buyOrders = [
    { price: 0.10, qty: 1000, total: 100.00 },
    { price: 0.098, qty: 2000, total: 196.00 },
    { price: 0.102, qty: 500, total: 51.00 },
    { price: 0.095, qty: 3000, total: 285.00 }
  ];

  var sellOrders = [
    { price: 0.105, qty: 800, total: 84.00 },
    { price: 0.108, qty: 1500, total: 162.00 },
    { price: 0.103, qty: 600, total: 61.80 },
    { price: 0.110, qty: 2500, total: 275.00 }
  ];

  var recentTrades = [
    { time: '14:32:18', price: 0.101, qty: 500 },
    { time: '14:28:05', price: 0.099, qty: 1200 },
    { time: '14:15:42', price: 0.100, qty: 800 }
  ];

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
      ex_trade_qty: '{qty} CRLM'
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
      ex_trade_qty: '{qty} CRLM'
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

  function renderOrderList() {
    var listEl = document.getElementById('ex-order-list');
    if (!listEl) return;

    var orders = exchangeMode === 'buy' ? buyOrders : sellOrders;
    var actionKey = exchangeMode === 'buy' ? 'ex_btn_buy' : 'ex_btn_sell';
    var actionText = exT(actionKey);

    listEl.innerHTML = orders.map(function (order) {
      return (
        '<tr>' +
          '<td>' + order.price.toFixed(4) + '</td>' +
          '<td>' + order.qty.toLocaleString() + '</td>' +
          '<td>' + order.total.toFixed(2) + '</td>' +
          '<td><button type="button" class="exchange-action-btn ex-order-action-btn">' + actionText + '</button></td>' +
        '</tr>'
      );
    }).join('');

    listEl.querySelectorAll('.ex-order-action-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        alert(exT('ex_alert_trade'));
      });
    });
  }

  function renderTradesList() {
    var listEl = document.getElementById('ex-trades-list');
    if (!listEl) return;

    listEl.innerHTML = recentTrades.map(function (trade) {
      return (
        '<li class="exchange-trades-item">' +
          '<span class="exchange-trades-time">' + trade.time + '</span>' +
          '<span class="exchange-trades-price">' + trade.price.toFixed(4) + '</span>' +
          '<span class="exchange-trades-qty">' + exT('ex_trade_qty', { qty: trade.qty.toLocaleString() }) + '</span>' +
        '</li>'
      );
    }).join('');
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

        alert(exT('ex_alert_order'));
        clearOrderForm();
      });
    }
  }

  function renderExchangePage() {
    updateTabUI();
    renderOrderList();
    renderTradesList();
    updateTotalDisplay();
    initExchangeEvents();
    applyExchangeI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      exchangeInitialized = false;
      exchangeMode = 'buy';
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

  var rankBadges = ['🥇', '🥈', '🥉'];

  var leaderboardData = {
    earnings: [
      { username: 'WhaleKing', level: 9, value: 125000 },
      { username: 'CryptoAce', level: 8, value: 98500 },
      { username: 'TaskMaster', level: 7, value: 87200 },
      { username: 'CRLM_Hunter', level: 7, value: 76800 },
      { username: 'DeFiPro', level: 6, value: 65400 },
      { username: 'AlphaRadar', level: 6, value: 58900 },
      { username: 'LinkerDAO', level: 5, value: 45200 },
      { username: 'GameFi_Hub', level: 5, value: 39800 }
    ],
    invites: [
      { username: 'InviteKing', level: 8, value: 156 },
      { username: 'ReferPro', level: 7, value: 128 },
      { username: 'ShareMaster', level: 7, value: 112 },
      { username: 'GrowthHacker', level: 6, value: 98 },
      { username: 'NodeRunner', level: 6, value: 85 },
      { username: 'ChainLinker', level: 5, value: 72 },
      { username: 'AlphaRadar', level: 5, value: 65 },
      { username: 'NewbieGuide', level: 4, value: 58 }
    ],
    reputation: [
      { username: 'TrustAce', level: 9, value: 99 },
      { username: 'HonestTrader', level: 8, value: 98 },
      { username: 'ReliableOne', level: 8, value: 97 },
      { username: 'TopPublisher', level: 7, value: 96 },
      { username: 'FairDeal', level: 7, value: 95 },
      { username: 'AlphaRadar', level: 5, value: 94 },
      { username: 'LinkerDAO', level: 5, value: 93 },
      { username: 'WhaleSwap', level: 6, value: 92 }
    ]
  };

  var myRankData = {
    earnings: { rank: 42, username: 'AlphaRadar', level: 5, value: 15600 },
    invites: { rank: 28, username: 'AlphaRadar', level: 5, value: 23 },
    reputation: { rank: 15, username: 'AlphaRadar', level: 5, value: 98 }
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
      lb_reputation_value: '{score}%'
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
      lb_reputation_value: '{score}%'
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

    var data = leaderboardData[leaderboardType];

    listEl.innerHTML = data.map(function (item, index) {
      var rank = index + 1;
      var topClass = rank <= 3 ? ' leaderboard-item-top3' : '';
      return (
        '<li class="leaderboard-item' + topClass + '">' +
          getRankDisplay(rank) +
          '<div class="leaderboard-avatar"></div>' +
          '<div class="leaderboard-user-info">' +
            '<span class="leaderboard-username">' + item.username + '</span>' +
            '<span class="leaderboard-level">' + lbT('lb_level', { level: item.level }) + '</span>' +
          '</div>' +
          '<span class="leaderboard-value">' + formatValue(leaderboardType, item.value) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderMyRank() {
    var myData = myRankData[leaderboardType];
    if (!myData) return;

    var rankEl = document.getElementById('lb-my-rank-num');
    var usernameEl = document.getElementById('lb-my-username');
    var levelEl = document.getElementById('lb-my-level');
    var valueEl = document.getElementById('lb-my-value');

    if (rankEl) rankEl.textContent = lbT('lb_my_rank', { rank: myData.rank });
    if (usernameEl) usernameEl.textContent = myData.username;
    if (levelEl) levelEl.textContent = lbT('lb_level', { level: myData.level });
    if (valueEl) valueEl.textContent = formatValue(leaderboardType, myData.value);
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
    updateTabUI();
    renderRankList();
    renderMyRank();
    initLeaderboardEvents();
    applyLeaderboardI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      leaderboardInitialized = false;
      leaderboardType = 'earnings';
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
  var loadMoreUsed = false;
  var broadcastInitialized = false;

  var allBroadcasts = [
    { user: '0x1234...ab9f', taskKey: 'register', reward: 500, timeKey: 'bh_time_3min' },
    { user: '0x88f2...c3d1', taskKey: 'trade', reward: 1200, timeKey: 'bh_time_8min' },
    { user: '0xabc9...7e2a', taskKey: 'official', reward: 2500, timeKey: 'bh_time_15min' },
    { user: '0x5566...f890', taskKey: 'airdrop', reward: 800, timeKey: 'bh_time_25min' },
    { user: '0xdead...beef', taskKey: 'game', reward: 650, timeKey: 'bh_time_40min' },
    { user: '0xface...cafe', taskKey: 'register', reward: 300, timeKey: 'bh_time_1h' },
    { user: '0x1024...2048', taskKey: 'trade', reward: 1800, timeKey: 'bh_time_2h' },
    { user: '0x7777...8888', taskKey: 'content', reward: 420, timeKey: 'bh_time_3h' },
    { user: '0xaaaa...bbbb', taskKey: 'test', reward: 1500, timeKey: 'bh_time_5h' },
    { user: '0xcccc...dddd', taskKey: 'register', reward: 350, timeKey: 'bh_time_8h' },
    { user: '0xeeee...ffff', taskKey: 'official', reward: 3200, timeKey: 'bh_time_yesterday' },
    { user: '0x1111...2222', taskKey: 'airdrop', reward: 900, timeKey: 'bh_time_yesterday' },
    { user: '0x3333...4444', taskKey: 'trade', reward: 2100, timeKey: 'bh_time_2days' },
    { user: '0x5555...6666', taskKey: 'game', reward: 720, timeKey: 'bh_time_2days' },
    { user: '0x9999...0000', taskKey: 'register', reward: 480, timeKey: 'bh_time_3days' }
  ];

  var broadcastTranslations = {
    zh: {
      bh_page_title: '最新战报',
      bh_load_more: '加载更多',
      bh_no_more: '没有更多了',
      bh_user_prefix: '用户',
      bh_task_register: '注册任务',
      bh_task_trade: '交易任务',
      bh_task_official: '官方任务',
      bh_task_airdrop: '空投任务',
      bh_task_game: '游戏任务',
      bh_task_content: '内容任务',
      bh_task_test: '测试任务',
      bh_event_done: '完成了{task}，获得',
      bh_time_3min: '3分钟前',
      bh_time_8min: '8分钟前',
      bh_time_15min: '15分钟前',
      bh_time_25min: '25分钟前',
      bh_time_40min: '40分钟前',
      bh_time_1h: '1小时前',
      bh_time_2h: '2小时前',
      bh_time_3h: '3小时前',
      bh_time_5h: '5小时前',
      bh_time_8h: '8小时前',
      bh_time_yesterday: '昨天',
      bh_time_2days: '2天前',
      bh_time_3days: '3天前'
    },
    en: {
      bh_page_title: 'Latest Activity',
      bh_load_more: 'Load More',
      bh_no_more: 'No More',
      bh_user_prefix: 'User',
      bh_task_register: 'registration task',
      bh_task_trade: 'trading task',
      bh_task_official: 'official task',
      bh_task_airdrop: 'airdrop task',
      bh_task_game: 'game task',
      bh_task_content: 'content task',
      bh_task_test: 'test task',
      bh_event_done: 'completed {task} and received',
      bh_time_3min: '3 min ago',
      bh_time_8min: '8 min ago',
      bh_time_15min: '15 min ago',
      bh_time_25min: '25 min ago',
      bh_time_40min: '40 min ago',
      bh_time_1h: '1 hour ago',
      bh_time_2h: '2 hours ago',
      bh_time_3h: '3 hours ago',
      bh_time_5h: '5 hours ago',
      bh_time_8h: '8 hours ago',
      bh_time_yesterday: 'Yesterday',
      bh_time_2days: '2 days ago',
      bh_time_3days: '3 days ago'
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

  function getTaskName(taskKey) {
    return bhT('bh_task_' + taskKey);
  }

  function renderBroadcastItem(item) {
    var taskName = getTaskName(item.taskKey);
    var desc =
      bhT('bh_user_prefix') + ' ' + item.user + ' ' +
      bhT('bh_event_done', { task: taskName }) + ' ' +
      '<span class="bh-reward-highlight">' + item.reward.toLocaleString() + ' CRLM</span>';

    return (
      '<li class="broadcast-history-item">' +
        '<div class="bh-avatar"></div>' +
        '<p class="bh-content">' + desc + '</p>' +
        '<span class="bh-time">' + bhT(item.timeKey) + '</span>' +
      '</li>'
    );
  }

  function renderBroadcastList() {
    var listEl = document.getElementById('bh-broadcast-list');
    if (!listEl) return;

    var items = allBroadcasts.slice(0, visibleCount);
    listEl.innerHTML = items.map(renderBroadcastItem).join('');
  }

  function updateLoadMoreButton() {
    var btn = document.getElementById('bh-load-more-btn');
    if (!btn) return;

    if (loadMoreUsed) {
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
        if (loadMoreUsed) return;
        visibleCount = allBroadcasts.length;
        loadMoreUsed = true;
        renderBroadcastList();
        updateLoadMoreButton();
      });
    }
  }

  function renderBroadcastHistoryPage() {
    renderBroadcastList();
    updateLoadMoreButton();
    initBroadcastEvents();
    applyBroadcastI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      broadcastInitialized = false;
      visibleCount = 10;
      loadMoreUsed = false;
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

  var samplePublisher = {
    username: 'AlphaRadar',
    level: 5,
    levelLabelKey: 'pub_level_master',
    reputationScore: 98,
    completionRate: 96,
    taskCount: 23,
    registeredAt: '2024年3月',
    registeredAtEn: 'Mar 2024',
    isOfficial: false,
    isHighRisk: false,
    hasActiveTasks: true,
    tasks: [
      { type: 'airdrop', reward: 500, slotsLeft: 88, slotsTotal: 100, daysLeft: 5 },
      { type: 'register', reward: 300, slotsLeft: 2, slotsTotal: 50, daysLeft: 1 },
      { type: 'trade', reward: 2500, slotsLeft: 11, slotsTotal: 15, daysLeft: 7 },
      { type: 'game', reward: 800, slotsLeft: 40, slotsTotal: 200, daysLeft: 12 }
    ]
  };

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
      pub_alert_claim: '任务领取成功！',
      pub_text_slots: '剩余名额',
      pub_text_days: '天后',
      pub_btn_claim: '领取',
      tag_airdrop: '空投',
      tag_register: '注册',
      tag_trade: '交易',
      tag_game: '游戏',
      tag_official: '官方',
      tag_content: '内容',
      tag_test: '测试'
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
      pub_alert_claim: 'Task claimed successfully!',
      pub_text_slots: 'Slots left',
      pub_text_days: 'days left',
      pub_btn_claim: 'Claim',
      tag_airdrop: 'Airdrop',
      tag_register: 'Register',
      tag_trade: 'Trade',
      tag_game: 'Game',
      tag_official: 'Official',
      tag_content: 'Content',
      tag_test: 'Test'
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

  function renderTaskCard(task) {
    var typeKey = 'tag_' + task.type;
    var labelClass = 'label-' + task.type;

    return (
      '<div class="task-card" data-category="' + task.type + '">' +
        '<div class="reward-amount">' + formatNumber(task.reward) + ' CRLM</div>' +
        '<div class="card-bottom">' +
          '<div class="meta-tags">' +
            '<span class="type-label ' + labelClass + '">' + pubT(typeKey) + '</span>' +
            '<span class="info-text">' + pubT('pub_text_slots') + ' ' + task.slotsLeft + '/' + task.slotsTotal + '</span>' +
            '<span class="info-text">' + task.daysLeft + ' ' + pubT('pub_text_days') + '</span>' +
          '</div>' +
          '<button type="button" class="claim-btn pub-claim-btn">' + pubT('pub_btn_claim') + '</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderPublisherTasks() {
    var grid = document.getElementById('pub-task-grid');
    var emptyState = document.getElementById('pub-empty-state');
    var publisher = samplePublisher;

    if (!grid || !emptyState) return;

    if (!publisher.hasActiveTasks || !publisher.tasks.length) {
      grid.innerHTML = '';
      grid.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    grid.innerHTML = publisher.tasks.map(renderTaskCard).join('');

    grid.querySelectorAll('.pub-claim-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        alert(pubT('pub_alert_claim'));
      });
    });
  }

  function renderPublisherPage() {
    var publisher = samplePublisher;
    var isZh = getLang() === 'zh';

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
      levelBadge.textContent = pubT('pub_level_badge', {
        level: publisher.level,
        label: pubT(publisher.levelLabelKey)
      });
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
      registerEl.textContent = isZh ? publisher.registeredAt : publisher.registeredAtEn;
    }

    renderPublisherTasks();
    applyPublisherI18n();
  }

  function initPublisherEvents() {
    if (publisherInitialized) return;
    publisherInitialized = true;
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      publisherInitialized = false;
    }
  }

  function handlePublisherRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var publisherPage = document.getElementById('publisher-page');

    if (publisherPage) {
      if (route === 'publisher') {
        publisherPage.classList.remove('hidden');
        initPublisherEvents();
        renderPublisherPage();
      } else {
        publisherPage.classList.add('hidden');
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
  var currentTaskKey = 'task1';
  var pendingRejectId = null;

  function cloneSubmissions(items) {
    return items.map(function (item) {
      return {
        id: item.id,
        username: item.username,
        time: item.time,
        type: item.type,
        text: item.text,
        screenshotCount: item.screenshotCount,
        status: item.status || 'pending'
      };
    });
  }

  var reviewTasksData = {
    task1: cloneSubmissions([
      { id: 't1-s1', username: 'LinkerDAO', time: '2025-01-15 14:30', type: 'text', text: '我已完成XX交易所注册并完成KYC验证，注册邮箱为test@example.com，UID为8839201，请审核通过。', status: 'pending' },
      { id: 't1-s2', username: 'CryptoAce', time: '2025-01-15 13:10', type: 'screenshot', screenshotCount: 2, status: 'pending' },
      { id: 't1-s3', username: 'WhaleSwap', time: '2025-01-15 11:45', type: 'text', text: '已完成注册并绑定钱包地址0x88f2...abc9，附注册成功截图说明。', status: 'pending' }
    ]),
    task2: cloneSubmissions([
      { id: 't2-s1', username: 'GameFi_Hub', time: '2025-01-14 20:15', type: 'screenshot', screenshotCount: 3, status: 'pending' },
      { id: 't2-s2', username: 'AlphaRadar', time: '2025-01-14 18:40', type: 'text', text: '已试玩Web3游戏达到10级，游戏内昵称PlayerOne，耗时约2小时完成。', status: 'pending' },
      { id: 't2-s3', username: 'NodeRunner', time: '2025-01-14 16:22', type: 'text', text: '完成新手教程并通关第一章，UID 55231，请审核。', status: 'pending' }
    ]),
    task3: cloneSubmissions([
      { id: 't3-s1', username: 'ShareMaster', time: '2025-01-13 09:30', type: 'screenshot', screenshotCount: 1, status: 'pending' },
      { id: 't3-s2', username: 'ReferPro', time: '2025-01-13 08:50', type: 'text', text: '已转发指定推文并保留24小时，推文链接https://x.com/example/status/123', status: 'pending' },
      { id: 't3-s3', username: 'GrowthHacker', time: '2025-01-13 07:15', type: 'screenshot', screenshotCount: 2, status: 'pending' }
    ])
  };

  var reviewTranslations = {
    zh: {
      rv_page_title: '审核管理',
      rv_select_label: '选择要审核的任务',
      rv_task_1: '注册XX交易所',
      rv_task_2: '试玩Web3游戏',
      rv_task_3: '转发推文任务',
      rv_list_title: '待审核提交',
      rv_pending_count: '共 {count} 条',
      rv_empty_text: '所有提交已审核完毕',
      rv_reject_title: '驳回理由',
      rv_reject_ph: '请填写驳回理由...',
      rv_reject_confirm: '确认驳回',
      rv_reject_cancel: '取消',
      rv_btn_approve: '通过',
      rv_btn_reject: '驳回',
      rv_status_approved: '已通过',
      rv_status_rejected: '已驳回',
      rv_screenshot_summary: '📷 查看截图（{count}张）'
    },
    en: {
      rv_page_title: 'Review Management',
      rv_select_label: 'Select task to review',
      rv_task_1: 'Register on XX Exchange',
      rv_task_2: 'Try Web3 Game',
      rv_task_3: 'Retweet Task',
      rv_list_title: 'Pending Submissions',
      rv_pending_count: '{count} total',
      rv_empty_text: 'All submissions have been reviewed',
      rv_reject_title: 'Rejection Reason',
      rv_reject_ph: 'Please enter rejection reason...',
      rv_reject_confirm: 'Confirm Reject',
      rv_reject_cancel: 'Cancel',
      rv_btn_approve: 'Approve',
      rv_btn_reject: 'Reject',
      rv_status_approved: 'Approved',
      rv_status_rejected: 'Rejected',
      rv_screenshot_summary: '📷 View screenshots ({count})'
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

  function getCurrentSubmissions() {
    return reviewTasksData[currentTaskKey] || [];
  }

  function getPendingCount() {
    return getCurrentSubmissions().filter(function (s) { return s.status === 'pending'; }).length;
  }

  function truncateText(text, maxLen) {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '...';
  }

  function getSummaryText(submission) {
    if (submission.type === 'screenshot') {
      return rvT('rv_screenshot_summary', { count: submission.screenshotCount || 0 });
    }
    return truncateText(submission.text, 50);
  }

  function renderSubmissionItem(submission) {
    var actionsHtml = '';
    var summaryHtml = '';

    if (submission.status === 'approved') {
      summaryHtml = '<span class="rv-status-approved">' + rvT('rv_status_approved') + '</span>';
    } else if (submission.status === 'rejected') {
      summaryHtml = '<span class="rv-status-rejected">' + rvT('rv_status_rejected') + '</span>';
    } else {
      summaryHtml = '<p class="rv-submit-summary">' + getSummaryText(submission) + '</p>';
      actionsHtml =
        '<div class="rv-actions">' +
          '<button type="button" class="rv-btn-approve" data-id="' + submission.id + '">' + rvT('rv_btn_approve') + '</button>' +
          '<button type="button" class="rv-btn-reject" data-id="' + submission.id + '">' + rvT('rv_btn_reject') + '</button>' +
        '</div>';
    }

    return (
      '<li class="review-submission-item" data-id="' + submission.id + '">' +
        '<div class="rv-user-block">' +
          '<div class="rv-avatar"></div>' +
          '<span class="rv-username">' + submission.username + '</span>' +
        '</div>' +
        '<div class="rv-content-block">' +
          '<p class="rv-submit-time">' + submission.time + '</p>' +
          summaryHtml +
        '</div>' +
        actionsHtml +
      '</li>'
    );
  }

  function renderSubmissionList() {
    var listEl = document.getElementById('rv-submission-list');
    var emptyEl = document.getElementById('rv-empty-state');
    var countEl = document.getElementById('rv-pending-count');
    var submissions = getCurrentSubmissions();
    var pendingCount = getPendingCount();

    if (countEl) {
      countEl.textContent = rvT('rv_pending_count', { count: pendingCount });
    }

    if (!listEl || !emptyEl) return;

    if (pendingCount === 0) {
      listEl.innerHTML = '';
      listEl.classList.add('hidden');
      emptyEl.classList.remove('hidden');
      return;
    }

    listEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    listEl.innerHTML = submissions.map(renderSubmissionItem).join('');

    listEl.querySelectorAll('.rv-btn-approve').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var submission = getCurrentSubmissions().find(function (s) { return s.id === id; });
        if (submission) {
          submission.status = 'approved';
          renderSubmissionList();
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
      taskSelect.addEventListener('change', function () {
        currentTaskKey = taskSelect.value;
        closeRejectModal();
        renderSubmissionList();
        applyReviewI18n();
      });
    }

    var confirmBtn = document.getElementById('rv-reject-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (!pendingRejectId) return;
        var submission = getCurrentSubmissions().find(function (s) { return s.id === pendingRejectId; });
        if (submission) {
          submission.status = 'rejected';
          renderSubmissionList();
        }
        closeRejectModal();
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

  function renderReviewPage() {
    var taskSelect = document.getElementById('rv-task-select');
    if (taskSelect) {
      currentTaskKey = taskSelect.value || 'task1';
    }

    initReviewEvents();
    renderSubmissionList();
    applyReviewI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      reviewInitialized = false;
      currentTaskKey = 'task1';
      pendingRejectId = null;
      reviewTasksData.task1 = cloneSubmissions([
        { id: 't1-s1', username: 'LinkerDAO', time: '2025-01-15 14:30', type: 'text', text: '我已完成XX交易所注册并完成KYC验证，注册邮箱为test@example.com，UID为8839201，请审核通过。', status: 'pending' },
        { id: 't1-s2', username: 'CryptoAce', time: '2025-01-15 13:10', type: 'screenshot', screenshotCount: 2, status: 'pending' },
        { id: 't1-s3', username: 'WhaleSwap', time: '2025-01-15 11:45', type: 'text', text: '已完成注册并绑定钱包地址0x88f2...abc9，附注册成功截图说明。', status: 'pending' }
      ]);
      reviewTasksData.task2 = cloneSubmissions([
        { id: 't2-s1', username: 'GameFi_Hub', time: '2025-01-14 20:15', type: 'screenshot', screenshotCount: 3, status: 'pending' },
        { id: 't2-s2', username: 'AlphaRadar', time: '2025-01-14 18:40', type: 'text', text: '已试玩Web3游戏达到10级，游戏内昵称PlayerOne，耗时约2小时完成。', status: 'pending' },
        { id: 't2-s3', username: 'NodeRunner', time: '2025-01-14 16:22', type: 'text', text: '完成新手教程并通关第一章，UID 55231，请审核。', status: 'pending' }
      ]);
      reviewTasksData.task3 = cloneSubmissions([
        { id: 't3-s1', username: 'ShareMaster', time: '2025-01-13 09:30', type: 'screenshot', screenshotCount: 1, status: 'pending' },
        { id: 't3-s2', username: 'ReferPro', time: '2025-01-13 08:50', type: 'text', text: '已转发指定推文并保留24小时，推文链接https://x.com/example/status/123', status: 'pending' },
        { id: 't3-s3', username: 'GrowthHacker', time: '2025-01-13 07:15', type: 'screenshot', screenshotCount: 2, status: 'pending' }
      ]);
    }
  }

  function handleReviewRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var reviewPage = document.getElementById('review-page');

    if (reviewPage) {
      if (route === 'review') {
        reviewPage.classList.remove('hidden');
        renderReviewPage();
      } else {
        reviewPage.classList.add('hidden');
        closeRejectModal();
      }
    }
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
