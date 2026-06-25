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
