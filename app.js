function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('coinrealm_lang', lang);
    applyLanguageStrings();
}
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
        broadcast_empty: "暂无动态",
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
        empty_text: "没有找到相关任务，换个筛选试试？",
        official_recommend_title: "⭐ 官方推荐",
        official_view_all: "查看全部 >",
        checkin_success_title: "签到成功",
        checkin_reward_label: "获得奖励",
        checkin_streak: "已连续签到 {days} 天",
        checkin_streak_bonus: "连续7天加成，奖励已翻倍！",
        checkin_close: "太棒了",
        checkin_already: "今日已签到，已连续签到 {days} 天",
        checkin_login_required: "请先登录后再签到",
        checkin_fail: "签到失败："
    },
    en: {
        ads_banner: "Advertising Space (Web3 Ads)",
        broadcast_prefix: "User",
        broadcast_done: "completed the registration task and received",
        broadcast_empty: "No activity yet",
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
        empty_text: "No tasks found. Try changing your filters?",
        official_recommend_title: "⭐ Official Picks",
        official_view_all: "View all >",
        checkin_success_title: "Check-in Successful",
        checkin_reward_label: "Reward earned",
        checkin_streak: "Streak: {days} days",
        checkin_streak_bonus: "7+ day streak — reward doubled!",
        checkin_close: "Awesome",
        checkin_already: "Already checked in today. Streak: {days} days",
        checkin_login_required: "Please sign in before checking in",
        checkin_fail: "Check-in failed: "
    }
};

// 当前全局语言变量声明（假设项目中已存在该状态控制）
let currentLang = localStorage.getItem('coinrealm_lang') || 'zh';
let allTasks = [];
let homeOfficialTasks = [];
let homeEventsBound = false;
let fetchTasksSeq = 0;

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
    return {
        publisher_id: userId,
        title: fields.title,
        task_type: fields.type,
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
            username: publisher.username || task.publisher_username,
            email: publisher.email,
            avatar_url: publisher.avatar_url
        };
    }
    return {
        id: task.publisher_id,
        username: task.publisher_username,
        email: task.publisher_email,
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
        .select('id, username, email, avatar_url')
        .eq('id', userId)
        .single();
    if (!result.error && result.data) {
        coinrealmCurrentUserProfile = result.data;
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

function isHomepageBroadcast(record) {
    var amount = Number(record.reward_amount) || 0;
    var eventType = record.event_type || '';
    if (amount >= 500) return true;
    if (eventType === 'rare_box' || eventType === 'dividend' || eventType === 'invite') return true;
    return false;
}

function formatBroadcastRelativeTime(iso) {
    if (!iso) return '—';
    var date = new Date(iso);
    if (isNaN(date.getTime())) return String(iso).slice(0, 16);

    var diffMs = Date.now() - date.getTime();
    if (diffMs < 0) diffMs = 0;

    var minutes = Math.floor(diffMs / 60000);
    var hours = Math.floor(diffMs / 3600000);
    var days = Math.floor(diffMs / 86400000);
    var lang = currentLang === 'en' ? 'en' : 'zh';

    if (minutes < 1) return lang === 'zh' ? '刚刚' : 'Just now';
    if (minutes < 60) return lang === 'zh' ? minutes + '分钟前' : minutes + ' min ago';
    if (hours < 24) return lang === 'zh' ? hours + '小时前' : hours + ' h ago';
    if (days === 1) return lang === 'zh' ? '昨天' : 'Yesterday';
    return lang === 'zh' ? days + '天前' : days + ' d ago';
}

function renderHomeBroadcastTicker(items) {
    var wrapper = document.getElementById('broadcast-ticker');
    if (!wrapper) return;

    var langData = translations[currentLang] || translations.zh;
    var emptyText = langData.broadcast_empty || '暂无动态';

    if (!items.length) {
        wrapper.style.animation = 'none';
        wrapper.innerHTML = '<div class="broadcast-item"><span>' + escapeHtml(emptyText) + '</span></div>';
        return;
    }

    wrapper.innerHTML = items.map(function (record) {
        var desc = escapeHtml(record.description || '');
        var rewardHtml = record.reward_amount
            ? ' <span class="highlight">' + Number(record.reward_amount).toLocaleString() + ' CRLM</span>'
            : '';
        return '<div class="broadcast-item">' + desc + rewardHtml + '</div>';
    }).join('');

    if (items.length === 1) {
        wrapper.style.animation = 'none';
        return;
    }

    var styleEl = document.getElementById('coinrealm-broadcast-keyframes');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'coinrealm-broadcast-keyframes';
        document.head.appendChild(styleEl);
    }

    var count = items.length;
    var height = 60;
    var step = 100 / count;
    var keyframes = '@keyframes scrollBroadcastDynamic {';
    var i;

    for (i = 0; i < count; i++) {
        var holdStart = (i * step).toFixed(2);
        var holdEnd = (i * step + step * 0.85).toFixed(2);
        keyframes += holdStart + '% { transform: translateY(-' + (i * height) + 'px); }';
        keyframes += holdEnd + '% { transform: translateY(-' + (i * height) + 'px); }';
    }
    keyframes += '100% { transform: translateY(0); }';
    keyframes += '}';

    styleEl.textContent = keyframes;
    wrapper.style.animation = 'scrollBroadcastDynamic ' + (count * 4) + 's linear infinite';
}

function loadHomeBroadcasts() {
    if (!window.supabase) {
        renderHomeBroadcastTicker([]);
        return Promise.resolve();
    }

    return window.supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
        .then(function (result) {
            if (result.error) {
                console.warn('加载首页广播失败:', result.error);
                renderHomeBroadcastTicker([]);
                return;
            }
            var items = (result.data || []).filter(isHomepageBroadcast);
            renderHomeBroadcastTicker(items);
        })
        .catch(function (err) {
            console.warn('加载首页广播失败:', err);
            renderHomeBroadcastTicker([]);
        });
}

window.coinrealmRefreshHomeBroadcast = loadHomeBroadcasts;

function buildTaskBroadcastTitle(title) {
    return String(title || '任务').replace(/[「」]/g, '');
}

function getPublisherIdFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || '';
    if (hash.indexOf('publisher') === -1) return null;
    var query = hash.split('?')[1];
    if (!query) return null;
    return new URLSearchParams(query).get('id');
}

function navigateToPublisher(publisherId) {
    if (!publisherId) return;
    var targetHash = 'publisher?id=' + encodeURIComponent(publisherId);
    if (window.location.hash.replace(/^#/, '') === targetHash) {
        if (typeof window.coinrealmApplyRoute === 'function') {
            window.coinrealmApplyRoute('publisher');
        }
        return;
    }
    window.location.hash = targetHash;
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

function getTaskField(task, keys, fallback) {
    for (let i = 0; i < keys.length; i++) {
        if (task[keys[i]] != null && task[keys[i]] !== '') return task[keys[i]];
    }
    return fallback;
}

function getTaskCategory(task) {
    if (task.is_official) return 'official';
    return getTaskField(task, ['task_type', 'type', 'category'], 'other');
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
        .select('id, username, level, email, avatar_url')
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
    const publisherId = escapeHtml(getTaskField(task, ['publisher_id'], ''));
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

    const publisherUser = getPublisherAvatarUser(task);
    const avatarHtml = buildAvatarHtml(publisherUser, 'css-avatar');

    return (
        '<div class="task-card" data-category="' + escapeHtml(category) + '" data-task-id="' + escapeHtml(getTaskField(task, ['id'], '')) + '">' +
            '<div class="card-top">' +
                '<div class="author-info publisher-link" data-publisher-id="' + publisherId + '" style="cursor:pointer">' +
                    avatarHtml +
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

function buildOfficialRecommendCardHtml(task) {
    var category = getTaskField(task, ['task_type', 'type', 'category'], 'other');
    var typeLabelKey = getTypeLabelKey(task);
    var publisher = resolvePublisherFields(task);
    var title = escapeHtml(getTaskField(task, ['title', 'task_title'], ''));
    var description = escapeHtml(getTaskField(task, ['description'], ''));
    var reward = formatRewardAmount(getTaskField(task, ['reward_amount', 'reward'], 0));
    var slotsTotalRaw = getTaskField(task, ['slots_total', 'total_slots', 'max_participants'], 0);
    var slotsLeftRaw = getTaskField(task, ['slots_left', 'slots_remaining', 'remaining_slots'], null);
    var slotsLeft = escapeHtml(slotsLeftRaw != null && slotsLeftRaw !== '' ? slotsLeftRaw : slotsTotalRaw);
    var slotsTotal = escapeHtml(slotsTotalRaw);
    var taskId = escapeHtml(getTaskField(task, ['id'], ''));

    var publisherUser = getPublisherAvatarUser(task);
    var avatarHtml = buildAvatarHtml(publisherUser, 'official-card-avatar css-avatar');

    return (
        '<article class="official-recommend-card" data-task-id="' + taskId + '" role="link" tabindex="0">' +
            '<div class="official-card-top">' +
                avatarHtml +
                '<div class="official-card-author">' +
                    '<span class="official-card-username">' + escapeHtml(publisher.username) + '</span>' +
                    '<span class="official-card-level">Lv.' + escapeHtml(publisher.level) + '</span>' +
                '</div>' +
            '</div>' +
            '<h3 class="official-card-title">' + title + '</h3>' +
            '<span class="official-card-type label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
            '<div class="official-card-reward">' + reward + '</div>' +
            (description ? '<p class="official-card-desc">' + description + '</p>' : '') +
            '<div class="official-card-slots"><span data-i18n="text_slots">剩余名额</span> ' + slotsLeft + '/' + slotsTotal + '</div>' +
        '</article>'
    );
}

function renderOfficialRecommendSection() {
    var section = document.getElementById('official-recommend-section');
    var grid = document.getElementById('official-recommend-grid');
    if (!section || !grid) return;

    if (!homeOfficialTasks.length) {
        section.classList.add('hidden');
        grid.innerHTML = '';
        return;
    }

    section.classList.remove('hidden');
    grid.innerHTML = homeOfficialTasks.map(buildOfficialRecommendCardHtml).join('');
    applyLanguageStrings();
}

function navigateToTaskDetail(taskId) {
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

function filterByOfficialTag() {
    var tagButtons = document.querySelectorAll('#filter-tags .tag-btn');
    tagButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-type') === 'official');
    });
    applyFiltersAndSort();
    var filterBar = document.querySelector('.filter-search-bar');
    if (filterBar) {
        filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handleClaimTask(btn) {
    navigateToTaskDetail(btn.getAttribute('data-task-id'));
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

var checkinInProgress = false;

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
    var langData = translations[currentLang] || translations.zh;
    var text = langData[key] || translations.zh[key] || '';
    if (vars) {
        Object.keys(vars).forEach(function (k) {
            text = text.replace('{' + k + '}', String(vars[k]));
        });
    }
    return text;
}

function showCheckinSuccessModal(rewardAmount, consecutiveDays) {
    var modal = document.getElementById('checkin-modal');
    var rewardEl = document.getElementById('checkin-reward-value');
    var streakEl = document.getElementById('checkin-streak-line');
    if (!modal || !rewardEl || !streakEl) return;

    rewardEl.textContent = rewardAmount.toLocaleString() + ' CRLM';
    var streakText = formatCheckinText('checkin_streak', { days: consecutiveDays });
    if (consecutiveDays >= 7) {
        streakText += ' · ' + formatCheckinText('checkin_streak_bonus');
    }
    streakEl.textContent = streakText;

    rewardEl.style.animation = 'none';
    void rewardEl.offsetWidth;
    rewardEl.style.animation = '';

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    applyLanguageStrings();
}

function hideCheckinModal() {
    var modal = document.getElementById('checkin-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

async function handleDailyCheckin() {
    if (checkinInProgress) return;

    if (!window.supabase) {
        alert(formatCheckinText('checkin_login_required'));
        return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
        alert(formatCheckinText('checkin_login_required'));
        return;
    }

    checkinInProgress = true;

    try {
        var today = getLocalDateString(0);
        var todayResult = await window.supabase
            .from('checkins')
            .select('*')
            .eq('user_id', userId)
            .gte('checkin_date', today);

        if (todayResult.error) {
            alert(formatCheckinText('checkin_fail') + todayResult.error.message);
            return;
        }

        var todayRecords = (todayResult.data || []).filter(function (row) {
            return String(row.checkin_date).slice(0, 10) === today;
        });

        if (todayRecords.length) {
            var existingStreak = todayRecords[0].consecutive_days || 1;
            alert(formatCheckinText('checkin_already', { days: existingStreak }));
            return;
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
            return;
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
            return;
        }

        var updateResult = await window.supabase
            .from('users')
            .update({ crlm_balance: newBalance })
            .eq('id', userId);

        if (updateResult.error) {
            alert(formatCheckinText('checkin_fail') + updateResult.error.message);
            return;
        }

        showCheckinSuccessModal(finalReward, consecutiveDays);
        writeBroadcast({
            user_id: userId,
            event_type: 'checkin',
            description: '完成每日签到，获得',
            reward_amount: finalReward
        });
    } finally {
        checkinInProgress = false;
    }
}

function bindCheckinEvents() {
    var checkinBtn = document.getElementById('daily-checkin-btn');
    if (checkinBtn && !checkinBtn.dataset.bound) {
        checkinBtn.dataset.bound = 'true';
        checkinBtn.addEventListener('click', function () {
            handleDailyCheckin();
        });
    }

    var modal = document.getElementById('checkin-modal');
    var closeBtn = document.getElementById('checkin-modal-close');
    if (closeBtn && !closeBtn.dataset.bound) {
        closeBtn.dataset.bound = 'true';
        closeBtn.addEventListener('click', hideCheckinModal);
    }
    if (modal && !modal.dataset.bound) {
        modal.dataset.bound = 'true';
        var overlay = modal.querySelector('.checkin-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', hideCheckinModal);
        }
    }
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
        homeOfficialTasks = [];
        renderOfficialRecommendSection();
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

            var officialQuery = window.supabase
                .from('tasks')
                .select('*')
                .eq('is_official', true)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(4);

            return officialQuery.then(function (officialResult) {
                var officialData = (!officialResult.error && officialResult.data) ? officialResult.data : [];
                if (officialResult.error) {
                    console.warn('加载官方推荐任务失败:', officialResult.error);
                }

                return enrichTasksWithPublishers(officialData).then(function (enrichedOfficial) {
                    homeOfficialTasks = enrichedOfficial || [];
                    renderOfficialRecommendSection();

                    if (result.error || !result.data || result.data.length === 0) {
                        allTasks = [];
                        if (taskGrid) taskGrid.classList.add('hidden');
                        if (emptyState) emptyState.classList.remove('hidden');
                        if (result.error) console.warn('加载任务失败:', result.error);
                        return null;
                    }

                    return enrichTasksWithPublishers(result.data);
                });
            });
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
            homeOfficialTasks = [];
            renderOfficialRecommendSection();
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
    loadHomeBroadcasts();

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
                var publisherLink = e.target.closest('.publisher-link');
                if (publisherLink && taskGrid.contains(publisherLink)) {
                    e.preventDefault();
                    e.stopPropagation();
                    var publisherId = publisherLink.getAttribute('data-publisher-id');
                    if (publisherId) navigateToPublisher(publisherId);
                    return;
                }

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

        bindCheckinEvents();

        var officialGrid = document.getElementById('official-recommend-grid');
        if (officialGrid) {
            officialGrid.addEventListener('click', function (e) {
                var card = e.target.closest('.official-recommend-card');
                if (!card || !officialGrid.contains(card)) return;
                navigateToTaskDetail(card.getAttribute('data-task-id'));
            });
            officialGrid.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                var card = e.target.closest('.official-recommend-card');
                if (!card || !officialGrid.contains(card)) return;
                e.preventDefault();
                navigateToTaskDetail(card.getAttribute('data-task-id'));
            });
        }

        var officialViewAllBtn = document.getElementById('official-view-all-btn');
        if (officialViewAllBtn) {
            officialViewAllBtn.addEventListener('click', function (e) {
                e.preventDefault();
                filterByOfficialTag();
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
    if (status === 'claimed') return 'go_submit';
    if (status === 'pending' && !submission.submitted_at) return 'go_submit';
    if (status === 'pending' && submission.submitted_at) return 'waiting_review';
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
    var userId = await getAuthenticatedUserId();

    if (!userId) {
      alert(tdT('td_alert_login'));
      return;
    }

    var levelResult = await window.supabase
      .from('users')
      .select('level')
      .eq('id', userId)
      .maybeSingle();
    var userLevel = levelResult.data && levelResult.data.level != null
      ? Number(levelResult.data.level)
      : 0;

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
        status: 'claimed'
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
    currentUserId = userId;
    detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
    updateBottomActionBar();
    alert(tdT('td_alert_claim_ok'));
    writeBroadcast({
      user_id: userId,
      event_type: 'task_claim',
      description: '领取了任务「' + buildTaskBroadcastTitle(currentTaskRecord.title) + '」',
      reward_amount: Number(currentTaskRecord.reward_amount) || 0
    });
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

    var userId = await getCurrentUserId();
    if (userId) {
      currentUserId = userId;
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

    var publisherInfoLeft = document.querySelector('#task-detail-page .publisher-info-left');
    if (publisherInfoLeft && currentTaskRecord.publisher_id) {
      publisherInfoLeft.style.cursor = 'pointer';
      publisherInfoLeft.setAttribute('data-publisher-id', currentTaskRecord.publisher_id);
      if (!publisherInfoLeft.dataset.bound) {
        publisherInfoLeft.dataset.bound = 'true';
        publisherInfoLeft.addEventListener('click', function () {
          navigateToPublisher(currentTaskRecord.publisher_id);
        });
      }
    } else if (publisherInfoLeft) {
      publisherInfoLeft.style.cursor = '';
      publisherInfoLeft.removeAttribute('data-publisher-id');
    }

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
        var userId = await getAuthenticatedUserId();
        if (!userId) {
          alert('请先登录后再发布任务');
          return;
        }

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
          .insert(buildTaskInsertPayload(userId, {
            title: title,
            type: type,
            description: description,
            requirements: requirements,
            rewardType: rewardType,
            rewardAmount: rewardAmount,
            maxParticipants: maxParticipants,
            deadline: deadline,
            proofType: proofType
          }));

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
    initRequirementList();
  }

  async function renderCreateTaskPage() {
    var deadline = document.getElementById('ct-deadline');
    if (deadline && !deadline.value) {
      deadline.value = getDefaultDeadline();
    }

    userLevel = 0;
    var userId = await getCurrentUserId();
    if (userId && window.supabase) {
      var levelResult = await window.supabase
        .from('users')
        .select('level')
        .eq('id', userId)
        .maybeSingle();
      if (!levelResult.error && levelResult.data && levelResult.data.level != null) {
        userLevel = levelResult.data.level;
      }
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
  var uploadInProgress = false;
  var submitTaskInitialized = false;
  var MAX_SCREENSHOT_FILES = 3;
  var MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024;
  var ALLOWED_SCREENSHOT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
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
      st_upload_hint: '支持 JPG、PNG、WebP 格式，单张不超过 5MB，最多 3 张',
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
      st_alert_invalid_type: '仅支持 JPG、PNG、WebP 格式',
      st_alert_file_size: '单张图片不能超过 5MB',
      st_alert_upload_fail: '上传失败：',
      st_alert_no_task: '请先在任务详情页领取任务',
      st_alert_submit_fail: '提交失败：'
    },
    en: {
      st_title_submit: 'Submit Proof',
      st_title_waiting: 'Pending Review',
      st_ph_desc: 'Describe how you completed the task...',
      st_upload_main: '📷 Click or drag to upload screenshots',
      st_upload_hint: 'JPG, PNG, WebP supported, max 5MB each, up to 3 files',
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
      st_alert_invalid_type: 'Only JPG, PNG, and WebP formats are supported',
      st_alert_file_size: 'Each image must be 5MB or smaller',
      st_alert_upload_fail: 'Upload failed: ',
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

  function getScreenshotExtension(filename) {
    var parts = String(filename || '').toLowerCase().split('.');
    return parts.length > 1 ? parts.pop() : '';
  }

  function validateScreenshotFile(file) {
    if (!file) return stT('st_alert_invalid_type');
    var ext = getScreenshotExtension(file.name);
    if (ALLOWED_SCREENSHOT_EXTENSIONS.indexOf(ext) < 0) {
      return stT('st_alert_invalid_type');
    }
    if (file.size > MAX_SCREENSHOT_SIZE) {
      return stT('st_alert_file_size');
    }
    return '';
  }

  function buildScreenshotStoragePath(userId, originalName) {
    var safeName = String(originalName || 'image').replace(/[^a-zA-Z0-9._-]/g, '_');
    return userId + '_' + Date.now() + '_' + safeName;
  }

  async function uploadScreenshotFile(file) {
    if (!window.supabase) {
      alert(stT('st_alert_upload_fail') + 'Supabase unavailable');
      return null;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(stT('st_alert_login'));
      return null;
    }

    var storagePath = buildScreenshotStoragePath(userId, file.name);
    var uploadResult = await window.supabase.storage
      .from('screenshots')
      .upload(storagePath, file, {
        contentType: file.type || undefined,
        upsert: false
      });

    if (uploadResult.error) {
      alert(stT('st_alert_upload_fail') + uploadResult.error.message);
      return null;
    }

    var urlResult = window.supabase.storage.from('screenshots').getPublicUrl(storagePath);
    var publicUrl = urlResult.data && urlResult.data.publicUrl;
    if (!publicUrl) {
      alert(stT('st_alert_upload_fail'));
      return null;
    }

    return {
      name: file.name,
      url: publicUrl,
      path: storagePath
    };
  }

  function renderFileList() {
    var listEl = document.getElementById('st-file-list');
    if (!listEl) return;

    listEl.innerHTML = '';
    uploadedFiles.forEach(function (item, index) {
      var displayName = item.name || item.url || '';
      var li = document.createElement('li');
      li.className = 'submit-task-file-item';
      li.innerHTML =
        '<span class="st-file-name">' + escapeHtml(displayName) + '</span>' +
        '<button type="button" class="st-file-delete" data-index="' + index + '" aria-label="Delete">&times;</button>';
      listEl.appendChild(li);
    });

    listEl.querySelectorAll('.st-file-delete').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= uploadedFiles.length) return;
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
    return submission.review_comment || '';
  }

  function isSubmissionWaitingReview(submission) {
    if (!submission) return false;
    if (submission.status === 'submitted' || submission.status === 'approved') return true;
    if (submission.status === 'pending' && submission.submitted_at) return true;
    return false;
  }

  function isSubmissionReadyToSubmit(submission) {
    if (!submission) return false;
    if (submission.status === 'claimed') return true;
    if (submission.status === 'pending' && !submission.submitted_at) return true;
    if (submission.status === 'rejected') return true;
    return false;
  }

  async function handleFilesSelected(fileList) {
    if (uploadInProgress) return;

    var files = Array.from(fileList || []);
    if (!files.length) return;

    var remaining = MAX_SCREENSHOT_FILES - uploadedFiles.length;
    if (remaining <= 0) {
      alert(stT('st_alert_max_files'));
      return;
    }

    if (files.length > remaining) {
      alert(stT('st_alert_max_files'));
      files = files.slice(0, remaining);
    }

    uploadInProgress = true;
    var uploadZone = document.getElementById('st-upload-zone');

    try {
      for (var i = 0; i < files.length; i++) {
        if (uploadedFiles.length >= MAX_SCREENSHOT_FILES) {
          alert(stT('st_alert_max_files'));
          break;
        }

        var file = files[i];
        var validationError = validateScreenshotFile(file);
        if (validationError) {
          alert(validationError);
          continue;
        }

        if (uploadZone) uploadZone.classList.add('st-uploading');
        var uploaded = await uploadScreenshotFile(file);
        if (uploaded) {
          uploadedFiles.push(uploaded);
          renderFileList();
        }
      }
    } finally {
      uploadInProgress = false;
      if (uploadZone) uploadZone.classList.remove('st-uploading');
    }
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

    var userId = await getCurrentUserId();
    if (!userId) {
      showNoTaskEmptyState();
      return true;
    }

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, review_comment, screenshot_urls')
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
    } else if (isSubmissionReadyToSubmit(submissionResult.data)) {
      submitState = 'form';
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

        var userId = await getAuthenticatedUserId();
        if (!userId) {
          alert('请先登录');
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

          var screenshotUrls = uploadedFiles.map(function (item) {
            return item.url;
          });

          var updateResult = await window.supabase
            .from('submissions')
            .update({
              description: desc,
              screenshot_urls: screenshotUrls,
              status: 'submitted',
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
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            description: desc,
            screenshot_urls: screenshotUrls
          });

          submitState = 'waiting';
          uploadedFiles = [];
          renderFileList();
          updatePageStateUI();
          applySubmitTaskI18n();
          writeBroadcast({
            user_id: userId,
            event_type: 'task_submit',
            description: '提交了任务「' + buildTaskBroadcastTitle(activeSubmitContext.title) + '」凭证',
            reward_amount: Number(activeSubmitContext.reward) || 0
          });
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
  var avatarPickerInitialized = false;
  var selectedPresetAvatarPath = '';

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
      pf_usdt_approx: '≈ {amount} USDT',
      pf_avatar_picker_title: '选择头像',
      pf_avatar_cancel: '取消',
      pf_avatar_confirm: '确认',
      pf_avatar_save_fail: '保存头像失败：',
      pf_avatar_pick_required: '请先选择一个头像'
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
      pf_usdt_approx: '≈ {amount} USDT',
      pf_avatar_picker_title: 'Choose Avatar',
      pf_avatar_cancel: 'Cancel',
      pf_avatar_confirm: 'Confirm',
      pf_avatar_save_fail: 'Failed to save avatar: ',
      pf_avatar_pick_required: 'Please select an avatar first'
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

    var avatarEl = document.getElementById('pf-avatar');
    if (avatarEl) {
      applyAvatarToElement(avatarEl, user, 'cr-avatar-img', {
        googleAvatarUrl: coinrealmGoogleAvatarUrl
      });
    }

    var editBtn = document.getElementById('pf-avatar-edit-btn');
    if (editBtn) editBtn.classList.remove('hidden');

    applyProfileI18n();
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

  var dividendsDataLoaded = false;
  var dividendsDataLoading = false;
  var cachedDividendsData = null;

  var dividendsTranslations = {
    zh: {
      dv_page_title: '我的分红',
      dv_countdown_label: '距离下次分红还有',
      dv_countdown_note: '每周结算一次',
      dv_countdown_value: '{days}天 {hours}小时',
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
      dv_amount_plus: '+{amount} CRLM',
      dv_login_required: '请先登录查看分红',
      dv_no_dividend: '暂无分红',
      dv_no_history: '暂无分红记录',
      dv_loading: '加载中...'
    },
    en: {
      dv_page_title: 'My Dividends',
      dv_countdown_label: 'Time until next dividend',
      dv_countdown_note: 'Settled weekly',
      dv_countdown_value: '{days}d {hours}h',
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
      dv_amount_plus: '+{amount} CRLM',
      dv_login_required: 'Please sign in to view dividends',
      dv_no_dividend: 'No dividends yet',
      dv_no_history: 'No dividend records yet',
      dv_loading: 'Loading...'
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

  function formatBonusMultiplier(value) {
    if (!value) return '0x';
    return (value % 1 === 0 ? String(value) : value.toFixed(1)) + 'x';
  }

  function calcHoldingsBonus(amount) {
    if (amount >= 100000) return 2;
    if (amount >= 10000) return 1.5;
    if (amount >= 1000) return 1;
    return 0;
  }

  function calcInvitesBonus(count) {
    if (count >= 50) return 2;
    if (count >= 20) return 1.5;
    if (count >= 5) return 1;
    return 0;
  }

  function getCountdownToSunday() {
    var now = new Date();
    var daysUntil = (7 - now.getDay()) % 7;
    if (daysUntil === 0) {
      daysUntil = 7;
    }

    var target = new Date(now);
    target.setDate(now.getDate() + daysUntil);
    target.setHours(0, 0, 0, 0);

    var diffMs = Math.max(0, target.getTime() - now.getTime());
    return {
      days: Math.floor(diffMs / (24 * 60 * 60 * 1000)),
      hours: Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    };
  }

  function getDividendField(row, names, fallback) {
    for (var i = 0; i < names.length; i++) {
      if (row[names[i]] != null && row[names[i]] !== '') {
        return row[names[i]];
      }
    }
    return fallback;
  }

  function formatDividendDate(row) {
    var raw = getDividendField(row, ['dividend_date', 'created_at', 'date'], '');
    if (!raw) return '—';
    return String(raw).slice(0, 10);
  }

  function formatDividendAmount(row) {
    return Number(getDividendField(row, ['amount', 'reward_amount', 'dividend_amount'], 0)) || 0;
  }

  function formatDividendSource(row) {
    var source = getDividendField(row, ['source', 'source_type', 'type'], '');
    var normalized = String(source || '').toLowerCase();
    if (normalized.indexOf('commission') >= 0 || normalized.indexOf('佣金') >= 0) {
      return dvT('dv_source_commission');
    }
    if (normalized.indexOf('holding') >= 0 || normalized.indexOf('持币') >= 0) {
      return dvT('dv_source_holding');
    }
    return source || '—';
  }

  function mapDividendHistory(rows) {
    return (rows || []).map(function (row) {
      return {
        date: formatDividendDate(row),
        amount: formatDividendAmount(row),
        sourceText: formatDividendSource(row)
      };
    });
  }

  function loadDividendsData() {
    if (dividendsDataLoaded || dividendsDataLoading) {
      return Promise.resolve(cachedDividendsData);
    }

    dividendsDataLoading = true;

    return getCurrentUserId()
      .then(function (userId) {
        if (!userId || !window.supabase) {
          return { loggedIn: false };
        }

        return window.supabase
          .from('users')
          .select('crlm_balance, invite_count')
          .eq('id', userId)
          .single()
          .then(function (userResult) {
            if (userResult.error || !userResult.data) {
              return { loggedIn: false };
            }

            return window.supabase
              .from('dividends')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .then(function (historyResult) {
                if (historyResult.error) {
                  console.warn('加载分红记录失败:', historyResult.error);
                }

                return {
                  loggedIn: true,
                  holdingsAmount: Number(userResult.data.crlm_balance) || 0,
                  invitesCount: Number(userResult.data.invite_count) || 0,
                  history: mapDividendHistory(historyResult.error ? [] : historyResult.data)
                };
              });
          });
      })
      .catch(function (err) {
        console.warn('加载分红页数据失败:', err);
        return { loggedIn: false };
      })
      .then(function (data) {
        cachedDividendsData = data;
        dividendsDataLoaded = true;
        dividendsDataLoading = false;
        return data;
      });
  }

  function renderCountdown() {
    var countdownEl = document.getElementById('dv-countdown-value');
    if (!countdownEl) return;

    var countdown = getCountdownToSunday();
    countdownEl.textContent = dvT('dv_countdown_value', {
      days: countdown.days,
      hours: countdown.hours
    });
  }

  function renderLoginRequiredState() {
    var loginMsg = dvT('dv_login_required');

    var holdingsAmount = document.getElementById('dv-holdings-amount');
    var holdingsBonus = document.getElementById('dv-holdings-bonus');
    var invitesCount = document.getElementById('dv-invites-count');
    var invitesBonus = document.getElementById('dv-invites-bonus');
    var totalWeight = document.getElementById('dv-total-weight');
    var lastAmount = document.getElementById('dv-last-amount');
    var lastDate = document.getElementById('dv-last-date');
    var lastSource = document.getElementById('dv-last-source');
    var historyList = document.getElementById('dv-history-list');

    if (holdingsAmount) holdingsAmount.textContent = loginMsg;
    if (holdingsBonus) holdingsBonus.textContent = '';
    if (invitesCount) invitesCount.textContent = '';
    if (invitesBonus) invitesBonus.textContent = '';
    if (totalWeight) totalWeight.textContent = '—';
    if (lastAmount) lastAmount.textContent = loginMsg;
    if (lastDate) lastDate.textContent = '';
    if (lastSource) lastSource.textContent = '';
    if (historyList) {
      historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + loginMsg + '</span></li>';
    }
  }

  function renderLoadingState() {
    var loadingMsg = dvT('dv_loading');
    var holdingsAmount = document.getElementById('dv-holdings-amount');
    var lastAmount = document.getElementById('dv-last-amount');
    var historyList = document.getElementById('dv-history-list');

    if (holdingsAmount) holdingsAmount.textContent = loadingMsg;
    if (lastAmount) lastAmount.textContent = loadingMsg;
    if (historyList) {
      historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + loadingMsg + '</span></li>';
    }
  }

  function renderDividendsContent(data) {
    if (!data || !data.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var holdingsBonusValue = calcHoldingsBonus(data.holdingsAmount);
    var invitesBonusValue = calcInvitesBonus(data.invitesCount);
    var totalWeightValue = holdingsBonusValue + invitesBonusValue;

    var holdingsAmountEl = document.getElementById('dv-holdings-amount');
    if (holdingsAmountEl) {
      holdingsAmountEl.textContent = formatNumber(data.holdingsAmount) + ' CRLM';
    }

    var holdingsBonusEl = document.getElementById('dv-holdings-bonus');
    if (holdingsBonusEl) {
      holdingsBonusEl.textContent = dvT('dv_bonus', { bonus: formatBonusMultiplier(holdingsBonusValue) });
    }

    var invitesCountEl = document.getElementById('dv-invites-count');
    if (invitesCountEl) {
      invitesCountEl.textContent = dvT('dv_invites_unit', { count: data.invitesCount });
    }

    var invitesBonusEl = document.getElementById('dv-invites-bonus');
    if (invitesBonusEl) {
      invitesBonusEl.textContent = dvT('dv_bonus', { bonus: formatBonusMultiplier(invitesBonusValue) });
    }

    var totalWeightEl = document.getElementById('dv-total-weight');
    if (totalWeightEl) {
      totalWeightEl.textContent = totalWeightValue.toFixed(1) + 'x';
    }

    var lastAmountEl = document.getElementById('dv-last-amount');
    var lastDateEl = document.getElementById('dv-last-date');
    var lastSourceEl = document.getElementById('dv-last-source');
    var historyList = document.getElementById('dv-history-list');
    var lastRecord = data.history.length ? data.history[0] : null;

    if (lastRecord) {
      if (lastAmountEl) {
        lastAmountEl.textContent = dvT('dv_amount_plus', { amount: formatNumber(lastRecord.amount) });
      }
      if (lastDateEl) lastDateEl.textContent = lastRecord.date;
      if (lastSourceEl) lastSourceEl.textContent = lastRecord.sourceText;
    } else {
      if (lastAmountEl) lastAmountEl.textContent = dvT('dv_no_dividend');
      if (lastDateEl) lastDateEl.textContent = '';
      if (lastSourceEl) lastSourceEl.textContent = '';
    }

    if (historyList) {
      if (!data.history.length) {
        historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + dvT('dv_no_history') + '</span></li>';
      } else {
        historyList.innerHTML = data.history.map(function (item) {
          return (
            '<li class="dividends-history-item">' +
              '<span class="dividends-history-date">' + item.date + '</span>' +
              '<span class="dividends-history-amount">' + dvT('dv_amount_plus', { amount: formatNumber(item.amount) }) + '</span>' +
              '<span class="dividends-history-source">' + item.sourceText + '</span>' +
            '</li>'
          );
        }).join('');
      }
    }
  }

  function renderDividendsPage() {
    applyDividendsI18n();
    renderCountdown();

    if (dividendsDataLoading && !dividendsDataLoaded) {
      renderLoadingState();
      return;
    }

    if (cachedDividendsData) {
      renderDividendsContent(cachedDividendsData);
      return;
    }

    if (!dividendsDataLoaded) {
      renderLoadingState();
      loadDividendsData().then(function (data) {
        renderDividendsContent(data);
      });
    }
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
        dividendsDataLoaded = false;
        dividendsDataLoading = false;
        cachedDividendsData = null;
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
  var leaderboardDataLoaded = false;
  var leaderboardDataLoading = false;

  var rankBadges = ['🥇', '🥈', '🥉'];

  var leaderboardColumns = {
    earnings: { field: 'crlm_balance', select: 'id, username, level, crlm_balance, avatar_url' },
    invites: { field: 'invite_count', select: 'id, username, level, invite_count, avatar_url' },
    reputation: { field: 'reputation_score', select: 'id, username, level, reputation_score, avatar_url' }
  };

  var leaderboardData = {
    earnings: [],
    invites: [],
    reputation: []
  };

  var myRankData = {
    earnings: null,
    invites: null,
    reputation: null
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
      lb_reputation_value: '{score}%',
      lb_login_required: '请先登录查看排名',
      lb_loading: '加载中...'
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
      lb_reputation_value: '{score}%',
      lb_login_required: 'Please sign in to view your rank',
      lb_loading: 'Loading...'
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

  function mapUserRow(row, type) {
    var field = leaderboardColumns[type].field;
    return {
      id: row.id,
      username: row.username || '—',
      level: row.level != null ? row.level : 1,
      value: Number(row[field]) || 0,
      avatar_url: row.avatar_url || ''
    };
  }

  function fetchTopUsers(type) {
    var config = leaderboardColumns[type];
    return window.supabase
      .from('users')
      .select(config.select)
      .order(config.field, { ascending: false })
      .limit(20)
      .then(function (result) {
        if (result.error) throw result.error;
        return (result.data || []).map(function (row) {
          return mapUserRow(row, type);
        });
      });
  }

  function fetchMyRankForType(type, userId) {
    var config = leaderboardColumns[type];
    return window.supabase
      .from('users')
      .select('id, username, level, avatar_url, ' + config.field)
      .eq('id', userId)
      .single()
      .then(function (userResult) {
        if (userResult.error || !userResult.data) return null;

        var value = Number(userResult.data[config.field]) || 0;
        return window.supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gt(config.field, value)
          .then(function (countResult) {
            if (countResult.error) return null;
            return {
              rank: (countResult.count || 0) + 1,
              id: userResult.data.id,
              username: userResult.data.username || '—',
              level: userResult.data.level != null ? userResult.data.level : 1,
              value: value,
              avatar_url: userResult.data.avatar_url || ''
            };
          });
      });
  }

  function loadLeaderboardData() {
    if (leaderboardDataLoaded || leaderboardDataLoading) {
      return Promise.resolve();
    }

    if (!window.supabase) {
      leaderboardDataLoaded = true;
      return Promise.resolve();
    }

    leaderboardDataLoading = true;
    var types = ['earnings', 'invites', 'reputation'];

    return Promise.all(types.map(fetchTopUsers))
      .then(function (topResults) {
        types.forEach(function (type, index) {
          leaderboardData[type] = topResults[index];
        });
        return getCurrentUserId();
      })
      .then(function (userId) {
        if (!userId) {
          types.forEach(function (type) {
            myRankData[type] = null;
          });
          return null;
        }
        return Promise.all(types.map(function (type) {
          return fetchMyRankForType(type, userId);
        })).then(function (myResults) {
          types.forEach(function (type, index) {
            myRankData[type] = myResults[index];
          });
        });
      })
      .catch(function (err) {
        console.warn('加载排行榜失败:', err);
        types.forEach(function (type) {
          myRankData[type] = null;
        });
      })
      .then(function () {
        leaderboardDataLoaded = true;
        leaderboardDataLoading = false;
      });
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

    if (leaderboardDataLoading && !leaderboardDataLoaded) {
      listEl.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-value">' + lbT('lb_loading') + '</span></li>';
      return;
    }

    var data = leaderboardData[leaderboardType] || [];

    listEl.innerHTML = data.map(function (item, index) {
      var rank = index + 1;
      var topClass = rank <= 3 ? ' leaderboard-item-top3' : '';
      var safeUsername = typeof escapeHtml === 'function' ? escapeHtml(item.username) : item.username;
      var avatarHtml = typeof buildAvatarHtml === 'function'
        ? buildAvatarHtml({ id: item.id, username: item.username, avatar_url: item.avatar_url }, 'leaderboard-avatar')
        : '<div class="leaderboard-avatar"></div>';
      return (
        '<li class="leaderboard-item' + topClass + '">' +
          getRankDisplay(rank) +
          avatarHtml +
          '<div class="leaderboard-user-info">' +
            '<span class="leaderboard-username">' + safeUsername + '</span>' +
            '<span class="leaderboard-level">' + lbT('lb_level', { level: item.level }) + '</span>' +
          '</div>' +
          '<span class="leaderboard-value">' + formatValue(leaderboardType, item.value) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderMyRank() {
    var rankEl = document.getElementById('lb-my-rank-num');
    var usernameEl = document.getElementById('lb-my-username');
    var levelEl = document.getElementById('lb-my-level');
    var valueEl = document.getElementById('lb-my-value');

    var myData = myRankData[leaderboardType];

    if (leaderboardDataLoading && !leaderboardDataLoaded) {
      if (rankEl) rankEl.textContent = '';
      if (usernameEl) usernameEl.textContent = lbT('lb_loading');
      if (levelEl) levelEl.textContent = '';
      if (valueEl) valueEl.textContent = '';
      return;
    }

    if (!myData) {
      if (rankEl) rankEl.textContent = '';
      if (usernameEl) usernameEl.textContent = lbT('lb_login_required');
      if (levelEl) levelEl.textContent = '';
      if (valueEl) valueEl.textContent = '';
      return;
    }

    if (rankEl) rankEl.textContent = lbT('lb_my_rank', { rank: myData.rank });
    if (usernameEl) usernameEl.textContent = myData.username;
    if (levelEl) levelEl.textContent = lbT('lb_level', { level: myData.level });
    if (valueEl) valueEl.textContent = formatValue(leaderboardType, myData.value);

    var myAvatarEl = document.querySelector('.leaderboard-my-rank .leaderboard-avatar');
    if (myAvatarEl && typeof applyAvatarToElement === 'function') {
      applyAvatarToElement(myAvatarEl, {
        id: myData.id,
        username: myData.username,
        avatar_url: myData.avatar_url
      }, 'leaderboard-avatar', { googleAvatarUrl: coinrealmGoogleAvatarUrl });
    }
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
    initLeaderboardEvents();
    applyLeaderboardI18n();
    updateTabUI();
    renderRankList();
    renderMyRank();

    if (!leaderboardDataLoaded && !leaderboardDataLoading) {
      loadLeaderboardData().then(function () {
        renderRankList();
        renderMyRank();
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      leaderboardInitialized = false;
      leaderboardType = 'earnings';
      leaderboardDataLoaded = false;
      leaderboardDataLoading = false;
      leaderboardData = { earnings: [], invites: [], reputation: [] };
      myRankData = { earnings: null, invites: null, reputation: null };
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
        leaderboardDataLoaded = false;
        leaderboardDataLoading = false;
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

    return window.supabase
      .from('users')
      .select('*')
      .eq('id', publisherId)
      .single()
      .then(function (userResult) {
        if (userResult.error || !userResult.data) {
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

          publisherActiveTasks = (tasksResult.error ? [] : (tasksResult.data || [])).map(function (task) {
            return Object.assign({}, task, {
              publisher_username: username,
              publisher_level: level
            });
          });

          var username = user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'Unknown');
          var level = user.level != null ? Number(user.level) : 0;
          var reputationScore = user.reputation_score != null ? Number(user.reputation_score) : 0;
          var completionRate = user.completion_rate != null ? Number(user.completion_rate) : reputationScore;

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
  var publisherTasks = [];
  var currentSubmissions = [];
  var selectedTaskId = null;
  var pendingRejectId = null;
  var reviewLoading = false;

  var reviewTranslations = {
    zh: {
      rv_page_title: '审核管理',
      rv_select_label: '选择要审核的任务',
      rv_list_title: '待审核提交',
      rv_pending_count: '共 {count} 条',
      rv_empty_text: '所有提交已审核完毕',
      rv_no_tasks: '您还没有发布过任务',
      rv_no_submissions: '暂无提交',
      rv_reject_title: '驳回理由',
      rv_reject_ph: '请填写驳回理由...',
      rv_reject_confirm: '确认驳回',
      rv_reject_cancel: '取消',
      rv_btn_approve: '通过',
      rv_btn_reject: '驳回',
      rv_status_approved: '已通过',
      rv_status_rejected: '已驳回',
      rv_status_submitted: '待审核',
      rv_status_claimed: '待提交凭证',
      rv_screenshot_summary: '📷 查看截图（{count}张）',
      rv_alert_login: '请先登录',
      rv_alert_reject_reason: '请填写驳回理由',
      rv_alert_action_fail: '操作失败：'
    },
    en: {
      rv_page_title: 'Review Management',
      rv_select_label: 'Select task to review',
      rv_list_title: 'Submissions',
      rv_pending_count: '{count} total',
      rv_empty_text: 'All submissions have been reviewed',
      rv_no_tasks: 'You have not published any tasks yet',
      rv_no_submissions: 'No submissions yet',
      rv_reject_title: 'Rejection Reason',
      rv_reject_ph: 'Please enter rejection reason...',
      rv_reject_confirm: 'Confirm Reject',
      rv_reject_cancel: 'Cancel',
      rv_btn_approve: 'Approve',
      rv_btn_reject: 'Reject',
      rv_status_approved: 'Approved',
      rv_status_rejected: 'Rejected',
      rv_status_submitted: 'Pending review',
      rv_status_claimed: 'Awaiting proof',
      rv_screenshot_summary: '📷 View screenshots ({count})',
      rv_alert_login: 'Please sign in first',
      rv_alert_reject_reason: 'Please enter a rejection reason',
      rv_alert_action_fail: 'Action failed: '
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
    return currentSubmissions;
  }

  function isReviewable(submission) {
    if (!submission) return false;
    if (submission.status === 'submitted') return true;
    if (submission.status === 'pending' && submission.submitted_at) return true;
    return false;
  }

  function getReviewableCount() {
    return getCurrentSubmissions().filter(isReviewable).length;
  }

  function formatSubmissionTime(value) {
    if (!value) return '-';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    var lang = getLang();
    if (lang === 'zh') {
      return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getScreenshotCount(submission) {
    var urls = submission.screenshot_urls;
    if (Array.isArray(urls)) return urls.length;
    if (typeof urls === 'string' && urls.trim()) {
      try {
        var parsed = JSON.parse(urls);
        if (Array.isArray(parsed)) return parsed.length;
      } catch (e) {
        return 1;
      }
    }
    return 0;
  }

  function getStatusLabel(submission) {
    if (submission.status === 'approved') return rvT('rv_status_approved');
    if (submission.status === 'rejected') return rvT('rv_status_rejected');
    if (submission.status === 'submitted') return rvT('rv_status_submitted');
    if (submission.status === 'claimed') return rvT('rv_status_claimed');
    if (submission.status === 'pending' && submission.submitted_at) return rvT('rv_status_submitted');
    return submission.status || '-';
  }

  function truncateText(text, maxLen) {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '...';
  }

  function getSummaryText(submission) {
    var screenshotCount = getScreenshotCount(submission);
    if (screenshotCount > 0 && !submission.description) {
      return rvT('rv_screenshot_summary', { count: screenshotCount });
    }
    if (screenshotCount > 0 && submission.description) {
      return truncateText(submission.description, 50) + ' · ' +
        rvT('rv_screenshot_summary', { count: screenshotCount });
    }
    return truncateText(submission.description || '', 50) || '-';
  }

  function renderSubmissionItem(submission) {
    var actionsHtml = '';
    var summaryHtml = '';
    var statusLabel = getStatusLabel(submission);

    if (submission.status === 'approved') {
      summaryHtml = '<span class="rv-status-approved">' + escapeHtml(statusLabel) + '</span>';
    } else if (submission.status === 'rejected') {
      summaryHtml =
        '<span class="rv-status-rejected">' + escapeHtml(statusLabel) + '</span>' +
        (submission.review_comment
          ? '<p class="rv-submit-summary">' + escapeHtml(truncateText(submission.review_comment, 50)) + '</p>'
          : '');
    } else {
      summaryHtml =
        '<p class="rv-submit-summary">' + escapeHtml(getSummaryText(submission)) + '</p>' +
        '<p class="rv-submit-summary">' + escapeHtml(statusLabel) + '</p>';
      if (isReviewable(submission)) {
        actionsHtml =
          '<div class="rv-actions">' +
            '<button type="button" class="rv-btn-approve" data-id="' + escapeHtml(submission.id) + '">' + rvT('rv_btn_approve') + '</button>' +
            '<button type="button" class="rv-btn-reject" data-id="' + escapeHtml(submission.id) + '">' + rvT('rv_btn_reject') + '</button>' +
          '</div>';
      }
    }

    var submitter = submission.submitter || {
      id: submission.user_id,
      username: submission.username || 'Unknown'
    };
    var avatarHtml = typeof buildAvatarHtml === 'function'
      ? buildAvatarHtml(submitter, 'rv-avatar')
      : '<div class="rv-avatar"></div>';

    return (
      '<li class="review-submission-item" data-id="' + escapeHtml(submission.id) + '">' +
        '<div class="rv-user-block">' +
          avatarHtml +
          '<span class="rv-username">' + escapeHtml(submission.username || 'Unknown') + '</span>' +
        '</div>' +
        '<div class="rv-content-block">' +
          '<p class="rv-submit-time">' + escapeHtml(formatSubmissionTime(submission.submitted_at || submission.created_at)) + '</p>' +
          summaryHtml +
        '</div>' +
        actionsHtml +
      '</li>'
    );
  }

  function showReviewEmptyMessage(messageKey) {
    var listEl = document.getElementById('rv-submission-list');
    var emptyEl = document.getElementById('rv-empty-state');
    var countEl = document.getElementById('rv-pending-count');

    if (countEl) countEl.textContent = rvT('rv_pending_count', { count: 0 });
    if (listEl) {
      listEl.innerHTML = '';
      listEl.classList.add('hidden');
    }
    if (emptyEl) {
      emptyEl.innerHTML = '<p>' + escapeHtml(rvT(messageKey)) + '</p>';
      emptyEl.classList.remove('hidden');
    }
  }

  function setTaskSelectDisabled(disabled) {
    var taskSelect = document.getElementById('rv-task-select');
    if (taskSelect) taskSelect.disabled = !!disabled;
  }

  function renderTaskSelectOptions() {
    var taskSelect = document.getElementById('rv-task-select');
    if (!taskSelect) return;

    taskSelect.innerHTML = '';
    publisherTasks.forEach(function (task) {
      var option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.title || task.id;
      taskSelect.appendChild(option);
    });

    if (publisherTasks.length) {
      if (!selectedTaskId || !publisherTasks.some(function (task) { return task.id === selectedTaskId; })) {
        selectedTaskId = publisherTasks[0].id;
      }
      taskSelect.value = selectedTaskId;
      setTaskSelectDisabled(false);
    } else {
      selectedTaskId = null;
      setTaskSelectDisabled(true);
    }
  }

  async function enrichSubmissionsWithUsers(submissions) {
    if (!submissions.length || !window.supabase) return submissions;

    var userIds = submissions
      .map(function (item) { return item.user_id; })
      .filter(function (id) { return !!id; });
    var uniqueIds = userIds.filter(function (id, index) {
      return userIds.indexOf(id) === index;
    });

    if (!uniqueIds.length) {
      return submissions.map(function (item) {
        item.username = 'Unknown';
        return item;
      });
    }

    var usersResult = await window.supabase
      .from('users')
      .select('id, username, email, avatar_url')
      .in('id', uniqueIds);

    var userMap = {};
    if (!usersResult.error && usersResult.data) {
      usersResult.data.forEach(function (user) {
        userMap[user.id] = {
          username: user.username || displayNameFromEmail(user.email) || 'Unknown',
          avatar_url: user.avatar_url || '',
          id: user.id,
          email: user.email
        };
      });
    }

    return submissions.map(function (item) {
      var submitter = userMap[item.user_id];
      item.submitter = submitter || null;
      item.username = submitter ? submitter.username : 'Unknown';
      return item;
    });
  }

  async function loadSubmissionsForSelectedTask() {
    if (!selectedTaskId || !window.supabase) {
      currentSubmissions = [];
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    var submissionsResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, reviewed_at, review_comment, screenshot_urls, created_at')
      .eq('task_id', selectedTaskId)
      .order('submitted_at', { ascending: false });

    if (submissionsResult.error) {
      alert(rvT('rv_alert_action_fail') + submissionsResult.error.message);
      currentSubmissions = [];
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    currentSubmissions = await enrichSubmissionsWithUsers(submissionsResult.data || []);
    renderSubmissionList();
  }

  async function loadPublisherTasks() {
    publisherTasks = [];
    currentSubmissions = [];
    selectedTaskId = null;

    if (!window.supabase) {
      showReviewEmptyMessage('rv_no_tasks');
      renderTaskSelectOptions();
      return;
    }

    var userId = await getCurrentUserId();
    if (!userId) {
      showReviewEmptyMessage('rv_no_tasks');
      renderTaskSelectOptions();
      return;
    }

    var tasksResult = await window.supabase
      .from('tasks')
      .select('*')
      .eq('publisher_id', userId)
      .order('created_at', { ascending: false });

    if (tasksResult.error) {
      alert(rvT('rv_alert_action_fail') + tasksResult.error.message);
      showReviewEmptyMessage('rv_no_tasks');
      renderTaskSelectOptions();
      return;
    }

    publisherTasks = tasksResult.data || [];
    renderTaskSelectOptions();

    if (!publisherTasks.length) {
      showReviewEmptyMessage('rv_no_tasks');
      return;
    }

    await loadSubmissionsForSelectedTask();
  }

  async function approveSubmission(submissionId) {
    if (!window.supabase || !submissionId) return false;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(rvT('rv_alert_login'));
      return false;
    }

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, user_id, task_id')
      .eq('id', submissionId)
      .single();

    if (submissionResult.error || !submissionResult.data) {
      alert(rvT('rv_alert_action_fail') + (submissionResult.error ? submissionResult.error.message : 'submission not found'));
      return false;
    }

    var submission = submissionResult.data;
    var taskResult = await window.supabase
      .from('tasks')
      .select('title, reward_amount')
      .eq('id', submission.task_id)
      .maybeSingle();

    var taskTitle = taskResult.data && taskResult.data.title ? taskResult.data.title : '任务';
    var rewardAmount = taskResult.data ? Number(taskResult.data.reward_amount) || 0 : 0;

    var updateResult = await window.supabase
      .from('submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateResult.error) {
      alert(rvT('rv_alert_action_fail') + updateResult.error.message);
      return false;
    }

    writeBroadcast({
      user_id: submission.user_id,
      event_type: 'task_approved',
      description: '任务「' + buildTaskBroadcastTitle(taskTitle) + '」审核通过，获得',
      reward_amount: rewardAmount
    });

    return true;
  }

  async function rejectSubmission(submissionId, reason) {
    if (!window.supabase || !submissionId) return false;

    var userId = await getCurrentUserId();
    if (!userId) {
      alert(rvT('rv_alert_login'));
      return false;
    }

    var updateResult = await window.supabase
      .from('submissions')
      .update({
        status: 'rejected',
        review_comment: reason,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (updateResult.error) {
      alert(rvT('rv_alert_action_fail') + updateResult.error.message);
      return false;
    }

    return true;
  }

  function renderSubmissionList() {
    var listEl = document.getElementById('rv-submission-list');
    var emptyEl = document.getElementById('rv-empty-state');
    var countEl = document.getElementById('rv-pending-count');
    var submissions = getCurrentSubmissions();

    if (countEl) {
      countEl.textContent = rvT('rv_pending_count', { count: submissions.length });
    }

    if (!listEl || !emptyEl) return;

    if (!publisherTasks.length) {
      showReviewEmptyMessage('rv_no_tasks');
      return;
    }

    if (!submissions.length) {
      showReviewEmptyMessage('rv_no_submissions');
      return;
    }

    listEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    listEl.innerHTML = submissions.map(renderSubmissionItem).join('');

    listEl.querySelectorAll('.rv-btn-approve').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        var id = btn.getAttribute('data-id');
        btn.disabled = true;
        var ok = await approveSubmission(id);
        if (ok) {
          await loadSubmissionsForSelectedTask();
        } else {
          btn.disabled = false;
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
      taskSelect.addEventListener('change', async function () {
        selectedTaskId = taskSelect.value || null;
        closeRejectModal();
        await loadSubmissionsForSelectedTask();
        applyReviewI18n();
      });
    }

    var confirmBtn = document.getElementById('rv-reject-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async function () {
        if (!pendingRejectId) return;
        var textarea = document.getElementById('rv-reject-reason');
        var reason = textarea ? textarea.value.trim() : '';
        if (!reason) {
          alert(rvT('rv_alert_reject_reason'));
          return;
        }

        confirmBtn.disabled = true;
        var ok = await rejectSubmission(pendingRejectId, reason);
        confirmBtn.disabled = false;
        if (ok) {
          closeRejectModal();
          await loadSubmissionsForSelectedTask();
        }
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

  async function renderReviewPage() {
    if (reviewLoading) return;
    reviewLoading = true;

    initReviewEvents();
    applyReviewI18n();
    await loadPublisherTasks();

    reviewLoading = false;
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      reviewInitialized = false;
      publisherTasks = [];
      currentSubmissions = [];
      selectedTaskId = null;
      pendingRejectId = null;
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
  var inviteDataLoaded = false;
  var inviteDataLoading = false;
  var inviteData = null;

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
      iv_next_level_max: '已达到最高加成等级',
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
      iv_alert_poster: '海报生成功能即将上线！',
      iv_login_required: '请先登录查看邀请信息',
      iv_loading: '加载中...',
      iv_no_friends: '暂无邀请好友'
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
      iv_next_level_max: 'Maximum bonus tier reached',
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
      iv_alert_poster: 'Poster generation coming soon!',
      iv_login_required: 'Please sign in to view invite info',
      iv_loading: 'Loading...',
      iv_no_friends: 'No invited friends yet'
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

  function calcInviteBonus(count) {
    if (count >= 50) return 2;
    if (count >= 20) return 1.5;
    if (count >= 5) return 1;
    return 0;
  }

  function getInviteProgressInfo(count) {
    var tiers = [
      { threshold: 5, bonus: 1 },
      { threshold: 20, bonus: 1.5 },
      { threshold: 50, bonus: 2 }
    ];
    var currentBonus = calcInviteBonus(count);
    var nextTier = null;
    var prevThreshold = 0;

    for (var i = 0; i < tiers.length; i++) {
      if (count < tiers[i].threshold) {
        nextTier = tiers[i];
        prevThreshold = i === 0 ? 0 : tiers[i - 1].threshold;
        break;
      }
    }

    if (!nextTier) {
      return {
        currentBonus: currentBonus,
        nextBonus: 2,
        remaining: 0,
        pct: 100
      };
    }

    var pct = ((count - prevThreshold) / (nextTier.threshold - prevThreshold)) * 100;
    return {
      currentBonus: currentBonus,
      nextBonus: nextTier.bonus,
      remaining: nextTier.threshold - count,
      pct: Math.max(0, Math.min(100, pct))
    };
  }

  function buildInviteLink(code) {
    var base = window.location.origin + window.location.pathname;
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'ref=' + encodeURIComponent(code);
  }

  function getInviteField(row, names, fallback) {
    for (var i = 0; i < names.length; i++) {
      if (row[names[i]] != null && row[names[i]] !== '') {
        return row[names[i]];
      }
    }
    return fallback;
  }

  function mapInviteFriends(rows, userMap) {
    return (rows || []).map(function (row) {
      var inviteeId = getInviteField(row, ['invitee_id', 'invited_user_id', 'friend_id'], '');
      var user = userMap[inviteeId] || {};
      var createdAt = getInviteField(row, ['created_at', 'registered_at'], user.created_at);
      return {
        username: user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'Unknown'),
        registeredAt: createdAt ? String(createdAt).slice(0, 10) : '—',
        reward: Number(getInviteField(row, ['reward_amount', 'reward', 'contribution'], 0)) || 0
      };
    });
  }

  function loadInvitePageData() {
    if (inviteDataLoading) {
      return Promise.resolve(inviteData);
    }

    inviteDataLoading = true;

    return getCurrentUserId()
      .then(function (userId) {
        if (!userId || !window.supabase) {
          return { loggedIn: false };
        }

        return window.supabase
          .from('users')
          .select('invite_count')
          .eq('id', userId)
          .single()
          .then(function (userResult) {
            if (userResult.error || !userResult.data) {
              return { loggedIn: false };
            }

            return window.supabase
              .from('invites')
              .select('*')
              .eq('inviter_id', userId)
              .order('created_at', { ascending: false })
              .then(function (invitesResult) {
                if (invitesResult.error) {
                  console.warn('加载邀请列表失败:', invitesResult.error);
                }

                var inviteRows = invitesResult.error ? [] : (invitesResult.data || []);
                var inviteeIds = inviteRows
                  .map(function (row) {
                    return getInviteField(row, ['invitee_id', 'invited_user_id', 'friend_id'], null);
                  })
                  .filter(function (id) { return !!id; });

                var uniqueIds = inviteeIds.filter(function (id, index) {
                  return inviteeIds.indexOf(id) === index;
                });

                if (!uniqueIds.length) {
                  return {
                    loggedIn: true,
                    userId: userId,
                    inviteCount: Number(userResult.data.invite_count) || 0,
                    totalReward: inviteRows.reduce(function (sum, row) {
                      return sum + (Number(getInviteField(row, ['reward_amount', 'reward', 'contribution'], 0)) || 0);
                    }, 0),
                    friends: mapInviteFriends(inviteRows, {})
                  };
                }

                return window.supabase
                  .from('users')
                  .select('id, username, email, created_at')
                  .in('id', uniqueIds)
                  .then(function (usersResult) {
                    var userMap = {};
                    if (!usersResult.error && usersResult.data) {
                      usersResult.data.forEach(function (user) {
                        userMap[user.id] = user;
                      });
                    }

                    var friends = mapInviteFriends(inviteRows, userMap);
                    return {
                      loggedIn: true,
                      userId: userId,
                      inviteCount: Number(userResult.data.invite_count) || friends.length,
                      totalReward: friends.reduce(function (sum, friend) {
                        return sum + friend.reward;
                      }, 0),
                      friends: friends
                    };
                  });
              });
          });
      })
      .catch(function (err) {
        console.warn('加载邀请页数据失败:', err);
        return { loggedIn: false };
      })
      .then(function (data) {
        inviteData = data;
        inviteDataLoaded = true;
        inviteDataLoading = false;
        return data;
      });
  }

  function renderLoginRequiredState() {
    var loginMsg = ivT('iv_login_required');
    var codeEl = document.getElementById('iv-invite-code');
    var countEl = document.getElementById('iv-invite-count');
    var rewardEl = document.getElementById('iv-invite-reward');
    var linkEl = document.getElementById('iv-invite-link');
    var currentEl = document.getElementById('iv-current-bonus');
    var nextEl = document.getElementById('iv-next-level-text');
    var fillEl = document.getElementById('iv-progress-fill');
    var listEl = document.getElementById('iv-friends-list');
    var friendsCountEl = document.getElementById('iv-friends-count');

    if (codeEl) codeEl.textContent = '—';
    if (countEl) countEl.textContent = loginMsg;
    if (rewardEl) rewardEl.textContent = '';
    if (linkEl) linkEl.value = '';
    if (currentEl) currentEl.textContent = loginMsg;
    if (nextEl) nextEl.textContent = '';
    if (fillEl) fillEl.style.width = '0%';
    if (friendsCountEl) friendsCountEl.textContent = '';
    if (listEl) {
      listEl.innerHTML = '<li class="invite-friend-item"><span class="iv-friend-name">' + loginMsg + '</span></li>';
    }
  }

  function renderOverview() {
    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var inviteCode = String(inviteData.userId).slice(0, 8);
    var inviteLink = buildInviteLink(inviteCode);

    var codeEl = document.getElementById('iv-invite-code');
    if (codeEl) codeEl.textContent = inviteCode;

    var countEl = document.getElementById('iv-invite-count');
    if (countEl) {
      countEl.textContent = ivT('iv_invite_count', { count: inviteData.inviteCount });
    }

    var rewardEl = document.getElementById('iv-invite-reward');
    if (rewardEl) {
      rewardEl.textContent = ivT('iv_total_reward', { amount: formatNumber(inviteData.totalReward) });
    }

    var linkEl = document.getElementById('iv-invite-link');
    if (linkEl) linkEl.value = inviteLink;

    inviteData.inviteCode = inviteCode;
    inviteData.inviteLink = inviteLink;
  }

  function renderProgress() {
    if (!inviteData || !inviteData.loggedIn) return;

    var progress = getInviteProgressInfo(inviteData.inviteCount);

    var currentEl = document.getElementById('iv-current-bonus');
    if (currentEl) {
      currentEl.textContent = ivT('iv_current_bonus', { bonus: progress.currentBonus });
    }

    var fillEl = document.getElementById('iv-progress-fill');
    if (fillEl) fillEl.style.width = progress.pct + '%';

    var nextEl = document.getElementById('iv-next-level-text');
    if (nextEl) {
      if (progress.remaining <= 0) {
        nextEl.textContent = ivT('iv_next_level_max');
      } else {
        nextEl.textContent = ivT('iv_next_level', {
          bonus: progress.nextBonus,
          count: progress.remaining
        });
      }
    }
  }

  function getSortedFriends() {
    if (!inviteData || !inviteData.loggedIn) return [];
    var friends = (inviteData.friends || []).slice();
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

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var friends = getSortedFriends();

    if (countEl) {
      countEl.textContent = ivT('iv_friends_count', { count: friends.length });
    }

    if (!friends.length) {
      listEl.innerHTML = '<li class="invite-friend-item"><span class="iv-friend-name">' + ivT('iv_no_friends') + '</span></li>';
      return;
    }

    listEl.innerHTML = friends.map(function (friend) {
      var safeName = typeof escapeHtml === 'function' ? escapeHtml(friend.username) : friend.username;
      return (
        '<li class="invite-friend-item">' +
          '<div class="iv-friend-avatar"></div>' +
          '<span class="iv-friend-name">' + safeName + '</span>' +
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
        if (!inviteData || !inviteData.loggedIn || !inviteData.inviteCode) {
          alert(ivT('iv_login_required'));
          return;
        }
        copyText(inviteData.inviteCode).then(function () {
          alert(ivT('iv_alert_copied'));
        });
      });
    }

    var copyLinkBtn = document.getElementById('iv-copy-link-btn');
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function () {
        if (!inviteData || !inviteData.loggedIn || !inviteData.inviteLink) {
          alert(ivT('iv_login_required'));
          return;
        }
        copyText(inviteData.inviteLink).then(function () {
          alert(ivT('iv_alert_copied'));
        });
      });
    }

    document.querySelectorAll('.invite-share-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!inviteData || !inviteData.loggedIn || !inviteData.inviteLink) {
          alert(ivT('iv_login_required'));
          return;
        }
        copyText(inviteData.inviteLink).then(function () {
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
    initInviteEvents();
    applyInviteI18n();
    updateSortTabsUI();
    updateRulesUI();

    if (inviteDataLoading && !inviteDataLoaded) {
      var codeEl = document.getElementById('iv-invite-code');
      if (codeEl) codeEl.textContent = ivT('iv_loading');
      return;
    }

    if (inviteDataLoaded && inviteData) {
      renderOverview();
      renderProgress();
      renderFriendsList();
      applyInviteI18n();
      return;
    }

    loadInvitePageData().then(function () {
      renderOverview();
      renderProgress();
      renderFriendsList();
      applyInviteI18n();
    });
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      inviteInitialized = false;
      friendsSortBy = 'time';
      rulesExpanded = false;
      inviteDataLoaded = false;
      inviteDataLoading = false;
      inviteData = null;
    }
  }

  function handleInviteRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var routeBase = route.split('?')[0] || 'home';
    var invitePage = document.getElementById('invite-page');

    if (invitePage) {
      if (routeBase === 'invite') {
        invitePage.classList.remove('hidden');
        renderInvitePage();
      } else {
        invitePage.classList.add('hidden');
        inviteDataLoaded = false;
        inviteDataLoading = false;
        inviteData = null;
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
      ad_dashboard_title: '数据看板',
      ad_tasks_title: '任务管理',
      ad_users_title: '用户管理',
      ad_broadcasts_title: '广播管理',
      ad_stat_users: '总用户数',
      ad_stat_tasks: '总任务数',
      ad_stat_active: '进行中任务',
      ad_stat_completed: '已完成任务',
      ad_stat_checkins: '累计签到次数',
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
      ad_dashboard_title: 'Dashboard',
      ad_tasks_title: 'Task Management',
      ad_users_title: 'User Management',
      ad_broadcasts_title: 'Broadcast Management',
      ad_stat_users: 'Total Users',
      ad_stat_tasks: 'Total Tasks',
      ad_stat_active: 'Active Tasks',
      ad_stat_completed: 'Completed Tasks',
      ad_stat_checkins: 'Total Check-ins',
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
      task_type: type,
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
    if (!window.supabase) return;
    var result = await window.supabase.from('users').select('*').order('created_at', { ascending: false });
    adminUsers = result.error ? [] : (result.data || []);
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
    }
  }

  function initAdminEvents() {
    if (adminInitialized) return;
    adminInitialized = true;

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
        var banBtn = e.target.closest('.ad-user-ban');
        var levelBtn = e.target.closest('.ad-user-level');
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

    document.querySelectorAll('#ad-cancel-modal .admin-modal-overlay, #ad-official-modal .admin-modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function () {
        closeCancelModal();
        closeOfficialPublishModal();
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
