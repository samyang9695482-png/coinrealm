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
let allTasks = [];
let homeEventsBound = false;
let fetchTasksSeq = 0;

async function getUserInfo() {
    if (!window.supabase) return null;

    var sessionResult = await window.supabase.auth.getSession();
    if (sessionResult.data && sessionResult.data.session) {
        var userId = sessionResult.data.session.user.id;
        var sessionUserResult = await window.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (!sessionUserResult.error && sessionUserResult.data) {
            return sessionUserResult.data;
        }
    }

    var walletAddress = localStorage.getItem('coinrealm_wallet');
    if (walletAddress) {
        var walletUserResult = await window.supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();
        if (!walletUserResult.error && walletUserResult.data) {
            return walletUserResult.data;
        }
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

function getTaskField(task, keys, fallback) {
    for (let i = 0; i < keys.length; i++) {
        if (task[keys[i]] != null && task[keys[i]] !== '') return task[keys[i]];
    }
    return fallback;
}

function getTaskCategory(task) {
    const type = getTaskField(task, ['task_type', 'type', 'category'], 'other');
    if (task.is_official && type === 'official') return 'official';
    return type;
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
        .select('id, username, level, email')
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
    const title = escapeHtml(getTaskField(task, ['title', 'task_title'], ''));
    const reward = formatRewardAmount(getTaskField(task, ['reward_amount', 'reward'], 0));
    const slotsTotalRaw = getTaskField(task, ['slots_total', 'total_slots', 'max_participants'], 0);
    const slotsLeftRaw = getTaskField(task, ['slots_left', 'slots_remaining', 'remaining_slots'], null);
    const slotsLeft = escapeHtml(slotsLeftRaw != null && slotsLeftRaw !== '' ? slotsLeftRaw : slotsTotalRaw);
    const slotsTotal = escapeHtml(slotsTotalRaw);
    const daysLeft = calcDaysLeft(getTaskField(task, ['deadline', 'end_date', 'ends_at'], null));
    const isOfficial = !!task.is_official;
    const isPromo = !!task.is_promo;

    let badgeHtml = '';
    if (isOfficial) {
        badgeHtml = '<span class="badge official-badge" data-i18n="badge_official">官方</span>';
    } else if (isPromo) {
        badgeHtml = '<span class="badge promo-badge" data-i18n="badge_promo">推广</span>';
    }

    return (
        '<div class="task-card" data-category="' + escapeHtml(category) + '" data-task-id="' + escapeHtml(getTaskField(task, ['id'], '')) + '">' +
            '<div class="card-top">' +
                '<div class="author-info">' +
                    '<div class="css-avatar"></div>' +
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
        '</div>'
    );
}

function handleClaimTask(btn) {
    var taskId = btn.getAttribute('data-task-id');
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

function bindClaimButtons() {
    // 事件已在 initHomePageLogic 中通过委托绑定
}

function renderTaskCards(tasks) {
    const taskGrid = document.getElementById('task-grid');
    if (!taskGrid) return;
    taskGrid.innerHTML = tasks.map(buildTaskCardHtml).join('');
    bindClaimButtons();
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

            if (result.error || !result.data || result.data.length === 0) {
                allTasks = [];
                if (taskGrid) taskGrid.classList.add('hidden');
                if (emptyState) emptyState.classList.remove('hidden');
                if (result.error) console.warn('加载任务失败:', result.error);
                return;
            }

            return enrichTasksWithPublishers(result.data);
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
function getRouteBaseFromHash() {
    return (window.location.hash.replace(/^#/, '') || 'home').split('?')[0] || 'home';
}

function handleRoute() {
    if (getRouteBaseFromHash() !== 'home') return;
    initHomePageLogic();
    applyLanguageStrings();
}

function applyInitialRoute() {
    var baseRoute = getRouteBaseFromHash();
    if (typeof window.coinrealmApplyRoute === 'function') {
        window.coinrealmApplyRoute(baseRoute);
        return;
    }
    handleRoute();
}

// 页面加载完毕后默认触发一次
window.addEventListener('DOMContentLoaded', applyInitialRoute);
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

  var SUBMISSION_STORAGE_KEY = 'coinrealm_active_submission';
  var taskDetailInitialized = false;
  var currentTaskRecord = null;
  var currentPublisherRecord = null;
  var currentSubmissionRecord = null;
  var currentUserId = null;
  var detailActionState = 'loading';

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
      td_btn_claim_now: '立即领取',
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
      td_alert_claim_fail: '领取失败：',
      td_alert_already_claimed: '您已经领取过该任务',
      td_alert_task_full: '任务名额已满',
      td_alert_login: '请先登录后再领取任务'
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
      td_btn_claim_now: 'Claim Now',
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
      td_alert_claim_fail: 'Claim failed: ',
      td_alert_already_claimed: 'You have already claimed this task',
      td_alert_task_full: 'No slots left for this task',
      td_alert_login: 'Please sign in before claiming'
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

  function resolveDetailActionState(task, submission, userId) {
    var max = task.max_participants != null ? Number(task.max_participants) : null;
    var current = Number(task.current_participants) || 0;
    var deadline = task.deadline ? new Date(task.deadline) : null;
    var isFull = max != null && current >= max;
    var isExpired = deadline && !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now();

    if (isFull || isExpired) return 'ended';
    if (!userId) return 'not_logged_in';
    if (userId === task.publisher_id) return 'manage_task';
    if (!submission) return 'can_claim';

    var status = submission.status;

    if (status === 'submitted') return 'waiting_review';
    if (status === 'pending') return 'go_submit';
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
    var userInfo = await getUserInfo();

    if (!userInfo || !userInfo.id) {
      alert(tdT('td_alert_login'));
      return;
    }

    var userId = userInfo.id;
    var userLevel = userInfo.level != null ? Number(userInfo.level) : 0;

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
        status: 'pending'
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
    detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
    updateBottomActionBar();
    alert(tdT('td_alert_claim_ok'));
  }

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

    var userInfo = await getUserInfo();
    if (userInfo && userInfo.id) {
      currentUserId = userInfo.id;
      var subResult = await window.supabase
        .from('submissions')
        .select('id, task_id, user_id, status, description, submitted_at')
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
      var description = currentTaskRecord.description || '';
      if (description.indexOf('\n') !== -1) {
        descEl.innerHTML = description.split('\n').filter(function (p) { return p.trim(); }).map(function (p) {
          return '<p>' + p + '</p>';
        }).join('');
      } else {
        descEl.innerHTML = description ? '<p>' + description + '</p>' : '';
      }
    }

    var reqEl = document.getElementById('td-task-requirements');
    if (reqEl) {
      var reqs = parseRequirements(currentTaskRecord.requirements);
      reqEl.innerHTML = reqs.map(function (r) {
        return '<li>' + r + '</li>';
      }).join('');
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
    updateBottomActionBar();
    initTaskDetailEvents();
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
    btn.classList.remove('hidden', 'td-btn-gold', 'td-btn-blue', 'td-btn-gray', 'td-btn-disabled');
    btn.classList.add(config.styleClass);
    btn.textContent = config.text;
    btn.disabled = !!config.disabled;
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
        if (detailActionState === 'can_claim') {
          performClaimTask();
        } else if (detailActionState === 'rejected_resubmit') {
          navigateToSubmitPage();
        }
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
      ct_alert_login: '请先登录后再发布任务',
      ct_alert_fail: '发布失败：',
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
      ct_alert_login: 'Please log in before publishing a task',
      ct_alert_fail: 'Publish failed: ',
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

  function getProofType() {
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
        alert(ctT('ct_alert_required'));
        return;
      }

      if (!window.supabase) {
        alert(ctT('ct_alert_fail') + 'Supabase unavailable');
        return;
      }

      try {
        var sessionResult = await window.supabase.auth.getSession();
        if (sessionResult.error) throw sessionResult.error;

        var session = sessionResult.data && sessionResult.data.session;
        if (!session || !session.user || !session.user.id) {
          alert('请先登录后再发布任务');
          return;
        }

        var userId = session.user.id;
        var title = document.getElementById('ct-task-title').value.trim();
        var type = document.getElementById('ct-task-type').value;
        var description = document.getElementById('ct-task-desc').value.trim();
        var requirements = collectRequirements();
        var rewardType = getRewardType();
        var rewardAmount = parseFloat(document.getElementById('ct-reward-amount').value);
        var slotsVal = document.getElementById('ct-task-slots').value.trim();
        var maxParticipants = slotsVal ? parseInt(slotsVal, 10) : null;
        if (maxParticipants !== null && isNaN(maxParticipants)) maxParticipants = null;
        var deadline = document.getElementById('ct-deadline').value;
        var proofType = getProofType();

        var insertResult = await window.supabase
          .from('tasks')
          .insert({
            publisher_id: userId,
            title: title,
            type: type,
            description: description,
            requirements: requirements,
            reward_type: rewardType,
            reward_amount: rewardAmount,
            max_participants: maxParticipants,
            deadline: deadline,
            proof_type: proofType,
            is_official: false
          })
          .select();

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
    // 修复：重新绑定提交按钮的点击事件
    var submitBtn = document.getElementById('ct-submit-btn');
    if (submitBtn) {
        var newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

        newSubmitBtn.addEventListener('click', async function () {
            if (newSubmitBtn.disabled) return;
            if (!validateForm()) {
                alert(ctT('ct_alert_required'));
                return;
            }
            var sessionResponse = await window.supabase.auth.getSession();
            var sessionData = sessionResponse.data;
            var sessionError = sessionResponse.error;
            if (sessionError || !sessionData.session) {
                alert('请先登录后再发布任务');
                return;
            }
            var userId = sessionData.session.user.id;
            var title = document.getElementById('ct-task-title').value.trim();
            var type = document.getElementById('ct-task-type').value;
            var desc = document.getElementById('ct-task-desc').value.trim();
            var rewardType = document.querySelector('input[name="ct-reward-type"]:checked').value;
            var rewardAmount = parseFloat(document.getElementById('ct-reward-amount').value);
            var slots = parseInt(document.getElementById('ct-task-slots').value) || null;
            var deadline = document.getElementById('ct-deadline').value;
            var proofType = document.querySelector('input[name="ct-proof-type"]:checked').value;
            var reqInputs = document.querySelectorAll('#ct-requirements-list .create-task-req-input');
            var requirements = [];
            reqInputs.forEach(function (input) {
                if (input.value.trim()) {
                    requirements.push(input.value.trim());
                }
            });
            var insertResult = await window.supabase
                .from('tasks')
                .insert({
                    publisher_id: userId,
                    title: title,
                    type: type,
                    description: desc,
                    requirements: requirements,
                    reward_type: rewardType,
                    reward_amount: rewardAmount,
                    max_participants: slots,
                    deadline: deadline,
                    proof_type: proofType,
                    is_official: false
                })
                .select();
            var data = insertResult.data;
            var error = insertResult.error;
            if (error) {
                alert('发布失败：' + error.message);
                console.error('发布任务失败', error);
                return;
            }
            alert('任务发布成功！');
            resetCreateTaskForm();
            goToHomeAndRefreshTasks();
        });
    }
    initRequirementList();
  }

  async function renderCreateTaskPage() {
    var deadline = document.getElementById('ct-deadline');
    if (deadline && !deadline.value) {
      deadline.value = getDefaultDeadline();
    }

    userLevel = 0;
    var userInfo = await getUserInfo();
    if (userInfo && userInfo.level != null) {
      userLevel = userInfo.level;
    }

    initCreateTaskEvents();
    bindSubmitButton();
    applyCreateTaskI18n();
    updateSubmitButtonState();
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

  var SUBMISSION_STORAGE_KEY = 'coinrealm_active_submission';
  var submitState = 'form';
  var uploadedFiles = [];
  var submitTaskInitialized = false;
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
      st_upload_hint: '支持 JPG、PNG 格式，单张不超过 5MB',
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
      st_alert_no_task: '请先在任务详情页领取任务',
      st_alert_submit_fail: '提交失败：'
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
      st_btn_back_home: 'Back to Home',
      st_reject_title: 'Rejection reason:',
      st_alert_desc: 'Please fill in the task completion description',
      st_alert_login: 'Please sign in first',
      st_alert_max_files: 'Maximum 3 screenshots allowed',
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
    return submission.rejection_reason || submission.reject_reason || submission.review_note || '';
  }

  function isSubmissionWaitingReview(submission) {
    if (!submission) return false;
    if (submission.status === 'submitted' || submission.status === 'approved') return true;
    if (submission.status === 'pending' && submission.submitted_at) return true;
    return false;
  }

  async function resolveSubmitUserId() {
    if (window.supabase) {
      var sessionResult = await window.supabase.auth.getSession();
      var session = sessionResult.data && sessionResult.data.session;
      if (session && session.user && session.user.id) {
        return session.user.id;
      }
    }

    var wallet = localStorage.getItem('coinrealm_wallet');
    if (wallet && window.supabase) {
      var userResult = await window.supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet)
        .maybeSingle();
      if (!userResult.error && userResult.data && userResult.data.id) {
        return userResult.data.id;
      }
    }

    return null;
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
      uploadedFiles.push(file);
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

    var userId = await resolveSubmitUserId();
    if (!userId) {
      showNoTaskEmptyState();
      return true;
    }

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, rejection_reason, reject_reason, review_note, screenshot_urls')
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

        var userId = await resolveSubmitUserId();
        if (!userId) {
          alert(stT('st_alert_login'));
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

          var screenshotNames = uploadedFiles.map(function (file) {
            return file.name;
          });

          var updateResult = await window.supabase
            .from('submissions')
            .update({
              description: desc,
              screenshot_urls: screenshotNames,
              status: 'pending',
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
            status: 'pending',
            submitted_at: new Date().toISOString(),
            description: desc
          });

          submitState = 'waiting';
          updatePageStateUI();
          applySubmitTaskI18n();
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

  async function loadUserProfile() {
    if (!window.supabase) {
      alert('请先登录');
      window.location.hash = 'home';
      return null;
    }

    var user = await getUserInfo();
    if (!user) {
      alert('请先登录');
      window.location.hash = 'home';
      return null;
    }

    return user;
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
    var user = await loadUserProfile();
    if (!user) return;

    var displayUsername = user.username || displayNameFromEmail(user.email);
    var crlmBalance = Number(user.crlm_balance) || 0;
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

    var crlmEl = document.getElementById('pf-crlm-balance');
    if (crlmEl) {
      crlmEl.textContent = formatNumber(crlmBalance) + ' CRLM';
    }

    var usdtEl = document.getElementById('pf-usdt-value');
    if (usdtEl) {
      usdtEl.textContent = pfT('pf_usdt_approx', { amount: formatNumber(usdtBalance) });
    }

    var progressEl = document.getElementById('pf-stat-progress');
    if (progressEl) progressEl.textContent = '0';

    var completedEl = document.getElementById('pf-stat-completed');
    if (completedEl) completedEl.textContent = '0';

    var earningsEl = document.getElementById('pf-stat-earnings');
    if (earningsEl) earningsEl.textContent = formatNumber(crlmBalance);

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
  var friendsSortBy = 'time';
  var rulesExpanded = false;

  var sampleInviteData = {
    inviteCode: 'CRLM888',
    inviteLink: 'https://coinrealm.pages.dev?ref=CRLM888',
    inviteCount: 23,
    totalReward: 12500,
    currentBonus: 1.5,
    nextBonus: 2.0,
    nextBonusThreshold: 50,
    friends: [
      { username: 'LinkerDAO', registeredAt: '2025-01-10', reward: 350 },
      { username: 'CryptoAce', registeredAt: '2025-01-08', reward: 520 },
      { username: 'WhaleSwap', registeredAt: '2025-01-05', reward: 280 },
      { username: 'GameFi_Hub', registeredAt: '2025-01-03', reward: 410 },
      { username: 'AlphaRadar', registeredAt: '2024-12-28', reward: 190 }
    ]
  };

  var inviteTranslations = {
    zh: {
      iv_page_title: '邀请好友',
      iv_code_label: '我的专属邀请码',
      iv_btn_copy: '复制',
      iv_stat_invites: '累计邀请人数',
      iv_stat_reward: '累计获得邀请奖励',
      iv_invite_count: '{count} 人',
      iv_total_reward: '{amount} CRLM',
      iv_share_title: '分享你的专属链接',
      iv_btn_copy_link: '复制链接',
      iv_progress_title: '分红加成进度',
      iv_current_bonus: '当前：{bonus}x 加成',
      iv_next_level: '距下一等级 {bonus}x 加成还需邀请 {count} 人',
      iv_node_1: '1x（5人）',
      iv_node_15: '1.5x（20人）',
      iv_node_2: '2x（50人）',
      iv_friends_title: '我邀请的好友',
      iv_friends_count: '共 {count} 人',
      iv_sort_time: '时间',
      iv_sort_contribution: '贡献',
      iv_rules_title: '邀请规则',
      iv_rule_1: '锁仓式推荐奖励：好友完成任务你获得 20%，分 12 个月解锁',
      iv_rule_2: '分红加成规则：持币量 + 有效邀请人数的阶梯加成',
      iv_rule_3: '有效好友定义：被邀请人必须完成至少 1 个任务，才计入有效邀请',
      iv_btn_poster: '生成专属海报',
      iv_reward_amount: '+{amount} CRLM',
      iv_alert_copied: '已复制！',
      iv_alert_share: '已复制链接，即将跳转...',
      iv_alert_poster: '海报生成功能即将上线！'
    },
    en: {
      iv_page_title: 'Invite Friends',
      iv_code_label: 'My Invite Code',
      iv_btn_copy: 'Copy',
      iv_stat_invites: 'Total Invites',
      iv_stat_reward: 'Total Invite Rewards',
      iv_invite_count: '{count}',
      iv_total_reward: '{amount} CRLM',
      iv_share_title: 'Share Your Invite Link',
      iv_btn_copy_link: 'Copy Link',
      iv_progress_title: 'Dividend Bonus Progress',
      iv_current_bonus: 'Current: {bonus}x bonus',
      iv_next_level: '{count} more invites to reach {bonus}x bonus',
      iv_node_1: '1x (5)',
      iv_node_15: '1.5x (20)',
      iv_node_2: '2x (50)',
      iv_friends_title: 'My Invited Friends',
      iv_friends_count: '{count} total',
      iv_sort_time: 'Time',
      iv_sort_contribution: 'Contribution',
      iv_rules_title: 'Invite Rules',
      iv_rule_1: 'Locked referral rewards: earn 20% when friends complete tasks, unlocked over 12 months',
      iv_rule_2: 'Dividend bonus: tiered bonus based on holdings + valid invites',
      iv_rule_3: 'Valid friend: invitee must complete at least 1 task to count',
      iv_btn_poster: 'Generate Poster',
      iv_reward_amount: '+{amount} CRLM',
      iv_alert_copied: 'Copied!',
      iv_alert_share: 'Link copied, redirecting...',
      iv_alert_poster: 'Poster generation coming soon!'
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
  }

  function renderOverview() {
    var data = sampleInviteData;

    var codeEl = document.getElementById('iv-invite-code');
    if (codeEl) codeEl.textContent = data.inviteCode;

    var countEl = document.getElementById('iv-invite-count');
    if (countEl) {
      countEl.textContent = ivT('iv_invite_count', { count: data.inviteCount });
    }

    var rewardEl = document.getElementById('iv-invite-reward');
    if (rewardEl) {
      rewardEl.textContent = ivT('iv_total_reward', { amount: formatNumber(data.totalReward) });
    }

    var linkEl = document.getElementById('iv-invite-link');
    if (linkEl) linkEl.value = data.inviteLink;
  }

  function renderProgress() {
    var data = sampleInviteData;
    var pct = Math.min(100, (data.inviteCount / data.nextBonusThreshold) * 100);
    var remaining = data.nextBonusThreshold - data.inviteCount;

    var currentEl = document.getElementById('iv-current-bonus');
    if (currentEl) {
      currentEl.textContent = ivT('iv_current_bonus', { bonus: data.currentBonus });
    }

    var fillEl = document.getElementById('iv-progress-fill');
    if (fillEl) fillEl.style.width = pct + '%';

    var nextEl = document.getElementById('iv-next-level-text');
    if (nextEl) {
      nextEl.textContent = ivT('iv_next_level', {
        bonus: data.nextBonus,
        count: remaining
      });
    }
  }

  function getSortedFriends() {
    var friends = sampleInviteData.friends.slice();
    if (friendsSortBy === 'contribution') {
      friends.sort(function (a, b) { return b.reward - a.reward; });
    } else {
      friends.sort(function (a, b) {
        return new Date(b.registeredAt) - new Date(a.registeredAt);
      });
    }
    return friends;
  }

  function renderFriendsList() {
    var listEl = document.getElementById('iv-friends-list');
    var countEl = document.getElementById('iv-friends-count');
    if (!listEl) return;

    var friends = getSortedFriends();

    if (countEl) {
      countEl.textContent = ivT('iv_friends_count', { count: friends.length });
    }

    listEl.innerHTML = friends.map(function (friend) {
      return (
        '<li class="invite-friend-item">' +
          '<div class="iv-friend-avatar"></div>' +
          '<span class="iv-friend-name">' + friend.username + '</span>' +
          '<span class="iv-friend-date">' + friend.registeredAt + '</span>' +
          '<span class="iv-friend-reward">' + ivT('iv_reward_amount', { amount: formatNumber(friend.reward) }) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function updateSortTabsUI() {
    var timeTab = document.getElementById('iv-sort-time');
    var contribTab = document.getElementById('iv-sort-contribution');

    if (timeTab) {
      if (friendsSortBy === 'time') {
        timeTab.classList.add('invite-sort-active');
      } else {
        timeTab.classList.remove('invite-sort-active');
      }
    }

    if (contribTab) {
      if (friendsSortBy === 'contribution') {
        contribTab.classList.add('invite-sort-active');
      } else {
        contribTab.classList.remove('invite-sort-active');
      }
    }
  }

  function updateRulesUI() {
    var card = document.querySelector('.invite-rules-card');
    if (card) {
      if (rulesExpanded) {
        card.classList.add('expanded');
      } else {
        card.classList.remove('expanded');
      }
    }
  }

  function initInviteEvents() {
    if (inviteInitialized) return;
    inviteInitialized = true;

    var copyCodeBtn = document.getElementById('iv-copy-code-btn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', function () {
        copyText(sampleInviteData.inviteCode).then(function () {
          alert(ivT('iv_alert_copied'));
        });
      });
    }

    var copyLinkBtn = document.getElementById('iv-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function () {
        copyText(sampleInviteData.inviteLink).then(function () {
          alert(ivT('iv_alert_copied'));
        });
      });
    }

    document.querySelectorAll('.invite-share-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyText(sampleInviteData.inviteLink).then(function () {
          alert(ivT('iv_alert_share'));
        });
      });
    });

    var sortTime = document.getElementById('iv-sort-time');
    var sortContrib = document.getElementById('iv-sort-contribution');

    if (sortTime) {
      sortTime.addEventListener('click', function () {
        friendsSortBy = 'time';
        updateSortTabsUI();
        renderFriendsList();
      });
    }

    if (sortContrib) {
      sortContrib.addEventListener('click', function () {
        friendsSortBy = 'contribution';
        updateSortTabsUI();
        renderFriendsList();
      });
    }

    var rulesToggle = document.getElementById('iv-rules-toggle');
    if (rulesToggle) {
      rulesToggle.addEventListener('click', function () {
        rulesExpanded = !rulesExpanded;
        updateRulesUI();
      });
    }

    var posterBtn = document.getElementById('iv-poster-btn');
    if (posterBtn) {
      posterBtn.addEventListener('click', function () {
        alert(ivT('iv_alert_poster'));
      });
    }
  }

  function renderInvitePage() {
    renderOverview();
    renderProgress();
    updateSortTabsUI();
    renderFriendsList();
    updateRulesUI();
    initInviteEvents();
    applyInviteI18n();
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      inviteInitialized = false;
      friendsSortBy = 'time';
      rulesExpanded = false;
    }
  }

  function handleInviteRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var invitePage = document.getElementById('invite-page');

    if (invitePage) {
      if (route === 'invite') {
        invitePage.classList.remove('hidden');
        renderInvitePage();
      } else {
        invitePage.classList.add('hidden');
      }
    }
  }

  window.addEventListener('hashchange', handleInviteRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleInviteRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleInviteRoute, 0);
    });
  }
})();
