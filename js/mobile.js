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
    refreshMobileFilterLabels();
  }

  function enhanceOfficialRecommendCards() {
    var section = document.getElementById('official-recommend-section');
    if (section) section.classList.add('mobile-official-section');

    var grid = document.getElementById('official-recommend-grid');
    if (!grid) return;

    var cards = grid.querySelectorAll('.official-recommend-card');
    for (var i = 0; i < cards.length; i++) {
      if (i >= 4) break;
      var card = cards[i];
      card.classList.add('mobile-official-card');
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

  /** 简单任务：保证闪电图标与一键领取分列两侧，不重叠 */
  function enhanceSimpleTaskCards() {
    var grid = document.getElementById('st-task-grid');
    if (!grid) return;
    grid.classList.add('mobile-simple-task-grid');
    var cards = grid.querySelectorAll('.simple-task-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.add('mobile-simple-task-card');
    }
  }

  var MOBILE_FILTER_PRIMARY = ['all'];
  var MOBILE_FILTER_ALL = [
    { type: 'all', zh: '全部', en: 'All' },
    { type: 'simple', zh: '简单任务', en: 'Simple' },
    { type: 'official', zh: '官方', en: 'Official' },
    { type: 'airdrop', zh: '空投', en: 'Airdrop' },
    { type: 'register', zh: '注册', en: 'Register' },
    { type: 'trade', zh: '交易', en: 'Trade' },
    { type: 'game', zh: '游戏', en: 'Game' },
    { type: 'content', zh: '内容', en: 'Content' },
    { type: 'test', zh: '测试', en: 'Test' }
  ];

  function applyMobileSort(sortValue) {
    var sortDropdown = document.getElementById('sort-dropdown');
    if (sortDropdown) {
      sortDropdown.value = sortValue;
      if (typeof applyFiltersAndSort === 'function') {
        applyFiltersAndSort();
      }
    }
    syncMobileFilterChips();
  }

  function getMobileFilterLabel(type) {
    for (var i = 0; i < MOBILE_FILTER_ALL.length; i++) {
      if (MOBILE_FILTER_ALL[i].type === type) {
        return window.currentLang === 'en' ? MOBILE_FILTER_ALL[i].en : MOBILE_FILTER_ALL[i].zh;
      }
    }
    return type;
  }

  function getActiveDesktopFilterType() {
    var active = document.querySelector('#filter-tags > .tag-btn.active');
    return active ? active.getAttribute('data-type') : 'all';
  }

  function applyDesktopFilterType(type) {
    var buttons = document.querySelectorAll('#filter-tags > .tag-btn');
    var matched = false;
    buttons.forEach(function (btn) {
      var isMatch = btn.getAttribute('data-type') === type;
      btn.classList.toggle('active', isMatch);
      if (isMatch) matched = true;
    });
    if (!matched && buttons.length) {
      buttons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-type') === 'all');
      });
      type = 'all';
    }
    syncMobileFilterChips(type);
    if (typeof applyFiltersAndSort === 'function') {
      applyFiltersAndSort();
    }
  }

  function syncMobileFilterChips(type) {
    var bar = document.querySelector('.mobile-filter-bar');
    if (!bar) return;
    type = type || getActiveDesktopFilterType();
    var isPrimary = MOBILE_FILTER_PRIMARY.indexOf(type) >= 0;
    bar.querySelectorAll('.mobile-filter-chip[data-type]').forEach(function (chip) {
      chip.classList.toggle('active', isPrimary && chip.getAttribute('data-type') === type);
    });
    var moreBtn = bar.querySelector('.mobile-filter-more-btn');
    if (moreBtn) {
      moreBtn.classList.toggle('active', !isPrimary);
      var nextMoreText;
      if (!isPrimary && type && type !== 'all') {
        nextMoreText = getMobileFilterLabel(type) + ' ▼';
      } else {
        nextMoreText = (window.currentLang === 'en' ? 'More' : '更多') + ' ▼';
      }
      if (moreBtn.textContent !== nextMoreText) {
        moreBtn.textContent = nextMoreText;
      }
    }
    var sortDropdown = document.getElementById('sort-dropdown');
    var sortValue = sortDropdown ? sortDropdown.value : 'highest-value';
    var sortBtn = bar.querySelector('.mobile-filter-sort-btn');
    if (sortBtn) {
      var sortText = (sortValue === 'latest')
        ? (window.currentLang === 'en' ? 'Latest ▼' : '最新发布 ▼')
        : (window.currentLang === 'en' ? 'Highest ▼' : '单价最高 ▼');
      if (sortBtn.textContent !== sortText) sortBtn.textContent = sortText;
      sortBtn.classList.toggle('active', true);
    }
    bar.querySelectorAll('.mobile-filter-sort-dropdown-item, .mobile-filter-dropdown-item[data-sort]').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-sort') === sortValue);
    });
    bar.querySelectorAll('.mobile-filter-dropdown-item[data-type]').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-type') === type);
    });
  }

  function closeMobileFilterDropdown() {
    document.querySelectorAll('.mobile-filter-dropdown.open').forEach(function (d) {
      d.classList.remove('open');
    });
  }

  function setupMobileFilterTags() {
    var host = document.getElementById('filter-tags');
    if (!host) return;

    if (host.querySelector('.mobile-filter-bar')) return;

    var bar = document.createElement('div');
    bar.className = 'mobile-filter-bar';

    var primaryDefs = [
      { type: 'all', zh: '全部', en: 'All' }
    ];

    primaryDefs.forEach(function (def) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'mobile-filter-chip';
      chip.setAttribute('data-type', def.type);
      chip.textContent = window.currentLang === 'en' ? def.en : def.zh;
      chip.addEventListener('click', function () {
        closeMobileFilterDropdown();
        applyDesktopFilterType(def.type);
      });
      bar.appendChild(chip);
    });

    var moreWrap = document.createElement('div');
    moreWrap.className = 'mobile-filter-more-wrap';

    var moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'mobile-filter-chip mobile-filter-more-btn';
    moreBtn.textContent = (window.currentLang === 'en' ? 'More' : '更多') + ' ▼';
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dropdown = moreWrap.querySelector('.mobile-filter-dropdown');
      if (!dropdown) return;
      dropdown.classList.toggle('open');
    });

    var dropdown = document.createElement('div');
    dropdown.className = 'mobile-filter-dropdown';
    MOBILE_FILTER_ALL.forEach(function (def) {
      if (MOBILE_FILTER_PRIMARY.indexOf(def.type) >= 0) return;
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'mobile-filter-dropdown-item';
      item.setAttribute('data-type', def.type);
      item.textContent = window.currentLang === 'en' ? def.en : def.zh;
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMobileFilterDropdown();
        applyDesktopFilterType(def.type);
      });
      dropdown.appendChild(item);
    });

    moreWrap.appendChild(moreBtn);
    moreWrap.appendChild(dropdown);
    bar.appendChild(moreWrap);

    var sortWrap = document.createElement('div');
    sortWrap.className = 'mobile-filter-more-wrap';

    var sortBtn = document.createElement('button');
    sortBtn.type = 'button';
    sortBtn.className = 'mobile-filter-chip mobile-filter-sort-btn';
    sortBtn.textContent = window.currentLang === 'en' ? 'Highest ▼' : '单价最高 ▼';
    sortBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closeMobileFilterDropdown();
      var dropdown = sortWrap.querySelector('.mobile-filter-dropdown');
      if (!dropdown) return;
      dropdown.classList.toggle('open');
    });

    var sortDropdown = document.createElement('div');
    sortDropdown.className = 'mobile-filter-dropdown mobile-filter-sort-dropdown';
    var sortOptions = [
      { value: 'highest-value', zh: '单价最高', en: 'Highest Value' },
      { value: 'latest', zh: '最新发布', en: 'Latest' }
    ];
    sortOptions.forEach(function (opt) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'mobile-filter-dropdown-item';
      item.setAttribute('data-sort', opt.value);
      item.textContent = window.currentLang === 'en' ? opt.en : opt.zh;
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMobileFilterDropdown();
        applyMobileSort(opt.value);
      });
      sortDropdown.appendChild(item);
    });

    sortWrap.appendChild(sortBtn);
    sortWrap.appendChild(sortDropdown);
    bar.appendChild(sortWrap);

    host.insertBefore(bar, host.firstChild);

    syncMobileFilterChips(getActiveDesktopFilterType());
  }

  var mobileSearchBound = false;
  function bindMobileSearchInput() {
    if (mobileSearchBound) return;
    var searchInput = document.getElementById('task-search');
    if (!searchInput) return;
    mobileSearchBound = true;
    searchInput.addEventListener('input', function () {
      if (typeof applyFiltersAndSort === 'function') {
        applyFiltersAndSort();
      }
    });
  }

  function refreshMobileFilterLabels() {
    var bar = document.querySelector('.mobile-filter-bar');
    if (!bar) {
      setupMobileFilterTags();
      syncMobileFilterChips(getActiveDesktopFilterType());
      return;
    }
    var map = {
      all: window.currentLang === 'en' ? 'All' : '全部'
    };
    bar.querySelectorAll('.mobile-filter-chip[data-type]').forEach(function (chip) {
      var type = chip.getAttribute('data-type');
      if (map[type] && chip.textContent !== map[type]) chip.textContent = map[type];
    });
    var moreBtn = bar.querySelector('.mobile-filter-more-btn');
    if (moreBtn) {
      var activeType = getActiveDesktopFilterType();
      var isPrimary = MOBILE_FILTER_PRIMARY.indexOf(activeType) >= 0;
      var moreText;
      if (!isPrimary && activeType && activeType !== 'all') {
        moreText = getMobileFilterLabel(activeType) + ' ▼';
      } else {
        moreText = (window.currentLang === 'en' ? 'More' : '更多') + ' ▼';
      }
      if (moreBtn.textContent !== moreText) moreBtn.textContent = moreText;
    }
    var sortBtn = bar.querySelector('.mobile-filter-sort-btn');
    if (sortBtn) {
      var sortDropdown = document.getElementById('sort-dropdown');
      var sortValue = sortDropdown ? sortDropdown.value : 'highest-value';
      var sortText = (sortValue === 'latest')
        ? (window.currentLang === 'en' ? 'Latest ▼' : '最新发布 ▼')
        : (window.currentLang === 'en' ? 'Highest ▼' : '单价最高 ▼');
      if (sortBtn.textContent !== sortText) sortBtn.textContent = sortText;
    }
    var sortItems = bar.querySelectorAll('.mobile-filter-dropdown-item[data-sort]');
    var sortLabelMap = {
      'highest-value': window.currentLang === 'en' ? 'Highest Value' : '单价最高',
      'latest': window.currentLang === 'en' ? 'Latest' : '最新发布'
    };
    sortItems.forEach(function (item) {
      var val = item.getAttribute('data-sort');
      var label = sortLabelMap[val];
      if (label && item.textContent !== label) item.textContent = label;
    });
    bar.querySelectorAll('.mobile-filter-dropdown-item[data-type]').forEach(function (item) {
      var label = getMobileFilterLabel(item.getAttribute('data-type'));
      if (item.textContent !== label) item.textContent = label;
    });
    syncMobileFilterChips(getActiveDesktopFilterType());
  }

  var homeEnhanceBusy = false;

  function runHomeEnhancements() {
    if (homeEnhanceBusy) return;
    homeEnhanceBusy = true;
    try {
      setupMobileFilterTags();
      enhanceOfficialRecommendCards();
      enhanceSimpleTaskCards();
    } finally {
      setTimeout(function () { homeEnhanceBusy = false; }, 0);
    }
  }

  function observeHomeCardEnhancements() {
    if (typeof MutationObserver === 'undefined') return;
    var target = document.getElementById('app-content');
    if (!target) return;
    if (cardEnhanceObserver) cardEnhanceObserver.disconnect();

    cardEnhanceObserver = new MutationObserver(function (mutations) {
      if (homeEnhanceBusy) return;

      var needsWork = false;
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        if (!nodes || !nodes.length) continue;
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (!node || node.nodeType !== 1) continue;
          // 忽略我们自己注入的节点，切断反馈循环
          if (node.classList && (
            node.classList.contains('mobile-filter-bar') ||
            node.classList.contains('mobile-official-claim-btn')
          )) {
            continue;
          }
          if (
            node.id === 'filter-tags' ||
            node.id === 'official-recommend-grid' ||
            node.id === 'home-page' ||
            node.id === 'st-task-grid' ||
            (node.classList && (
              node.classList.contains('official-recommend-card') ||
              node.classList.contains('simple-task-card')
            )) ||
            (node.querySelector && (
              node.querySelector('#filter-tags') ||
              node.querySelector('#official-recommend-grid') ||
              node.querySelector('.official-recommend-card') ||
              node.querySelector('#st-task-grid') ||
              node.querySelector('.simple-task-card')
            ))
          ) {
            needsWork = true;
            break;
          }
        }
        if (needsWork) break;
      }

      if (needsWork) runHomeEnhancements();
    });

    cardEnhanceObserver.observe(target, { childList: true, subtree: true });
    runHomeEnhancements();
    syncMobileFilterChips(getActiveDesktopFilterType());
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

    bindWalletLoginButtons();
  }

  var WALLET_DEFAULTS = {
    okx: 'https://web3.okx.com/join/CR2026',
    bitget: '',
    metamask: 'https://metamask.io/download'
  };

  var WALLET_PROVIDER_MAP = {
    okx: ['okxwallet', 'ethereum'],
    bitget: ['bitgetverse', 'ethereum'],
    metamask: ['ethereum']
  };

  var WALLET_NAMES = {
    okx: 'OKX Wallet',
    bitget: 'Bitget Wallet',
    metamask: 'MetaMask'
  };

  // 钱包登录方式配置
  // okx:    使用 OKX 官方 Universal Link（download?deeplink=okx://wallet/dapp/url?dappUrl=...）
  //         在 OKX App 内置浏览器中加载网站 → window.okxwallet 自动注入 → 自动连接
  // bitget: 使用 WalletConnect v2 协议（QR 码扫码 / Deep Link 配对）
  //         Bitget 官方无 Universal Link 端点，WalletConnect 是跨钱包通用方案
  // metamask: 使用 WalletConnect v2 协议（QR 码扫码 / Deep Link 配对）
  //           MetaMask 无 dApp URL Deep Link，WalletConnect 可调起 App 并完成配对
  var WALLET_DEEPLINK_CONFIG = {
    okx: {
      base: 'okx://wallet/dapp/url',
      download: 'https://web3.okx.com/download',
      paramKey: 'dappUrl',
      // Universal Link 方式：download?deeplink=<base>?<paramKey>=<dapp>
      type: 'universal'
    }
  };

  // 使用 WalletConnect 协议登录的钱包列表
  // MetaMask 已改用官方 SDK（@metamask/sdk），不再走 WalletConnect
  var WALLETCONNECT_WALLETS = ['bitget'];

  // WalletConnect v2 配置
  // projectId 需要在 https://cloud.walletconnect.com/ 申请，替换下方占位符
  var WALLETCONNECT_PROJECT_ID = '4b6a3d8bfca4801504c4c6be44524bee';
  var WALLETCONNECT_CHAINS = [1]; // Ethereum mainnet
  var WALLETCONNECT_RPC_MAP = {
    1: 'https://cloudflare-eth.com'
  };
  var WALLETCONNECT_METADATA = {
    name: 'CoinRealm',
    description: 'CoinRealm Web3 Task Platform',
    url: window.location.origin,
    icons: [window.location.origin + '/img/crlm-logo.png']
  };

  // MetaMask SDK 配置
  // UMD 版本将 SDK 挂载到 window.browser.MetaMaskSDK
  // SDK 会自动检测环境：移动端调起 App + 回调，桌面端连接浏览器扩展或显示 QR 码
  var METAMASK_SDK_DAPP_METADATA = {
    name: 'CoinRealm',
    url: window.location.host,
    iconUrl: window.location.origin + '/img/crlm-logo.png'
  };

  var WALLET_PENDING_KEY = 'coinrealm_wallet_pending';
  var WALLET_PENDING_TIMEOUT = 10 * 60 * 1000; // 10 分钟过期

  var cachedWalletInviteSettings = null;

  function fetchWalletInviteSettings() {
    if (cachedWalletInviteSettings) return Promise.resolve(cachedWalletInviteSettings);

    var defaults = Object.assign({}, WALLET_DEFAULTS);
    if (!window.supabase) {
      cachedWalletInviteSettings = defaults;
      return Promise.resolve(defaults);
    }

    return window.supabase
      .from('settings')
      .select('key, value')
      .in('key', ['wallet_invite_okx', 'wallet_invite_bitget', 'wallet_invite_metamask'])
      .then(function (result) {
        if (result.data) {
          result.data.forEach(function (row) {
            if (row.key === 'wallet_invite_okx') defaults.okx = row.value;
            if (row.key === 'wallet_invite_bitget') defaults.bitget = row.value;
            if (row.key === 'wallet_invite_metamask') defaults.metamask = row.value;
          });
        }
        cachedWalletInviteSettings = defaults;
        return defaults;
      })
      .catch(function (err) {
        console.warn('加载钱包邀请设置失败:', err);
        return defaults;
      });
  }

  function invalidateWalletInviteCache() {
    cachedWalletInviteSettings = null;
  }

  function getWalletProvider(walletType) {
    var keys = WALLET_PROVIDER_MAP[walletType] || [];
    for (var i = 0; i < keys.length; i++) {
      var provider = window[keys[i]];
      if (provider && typeof provider.request === 'function') {
        if (walletType === 'okx') {
          if (provider.isOkxWallet === true || keys[i] === 'okxwallet') {
            return provider;
          }
        } else if (walletType === 'bitget') {
          if (provider.isBitget === true || keys[i] === 'bitgetverse') {
            return provider;
          }
        } else if (walletType === 'metamask') {
          if (provider.isMetaMask === true || !provider.isOkxWallet) {
            return provider;
          }
        } else {
          return provider;
        }
      }
    }
    return null;
  }

  function connectWalletProvider(provider, walletName) {
    if (!provider || typeof provider.request !== 'function') {
      return Promise.reject(new Error(walletName + ' provider not available'));
    }
    if (typeof window.coinrealmConnectWalletByProvider !== 'function') {
      return Promise.reject(new Error('wallet service unavailable'));
    }
    return window.coinrealmConnectWalletByProvider(provider, walletName);
  }

  function redirectToWalletDownload(walletType) {
    var walletName = WALLET_NAMES[walletType] || walletType;
    fetchWalletInviteSettings().then(function (settings) {
      var downloadUrl = settings[walletType] || WALLET_DEFAULTS[walletType];
      if (downloadUrl) {
        window.location.href = downloadUrl;
      } else {
        alert(walletName + (typeof window.t === 'function' ? window.t('walletNotInstalled') : ' 未安装，请先安装钱包'));
      }
    });
  }

  // ============ OKX Deep Link 登录流程 ============
  // OKX: 使用官方 Universal Link（download?deeplink=...）跳转，未安装自动显示下载页
  //      在 OKX App 内置浏览器中加载网站 → window.okxwallet 自动注入 → 自动连接

  // 构建钱包 Deep Link 的 scheme 部分：<base>?<paramKey>=<dapp>
  function buildWalletScheme(walletType) {
    var config = WALLET_DEEPLINK_CONFIG[walletType];
    if (!config) return null;

    var dappUrl = window.location.origin + window.location.pathname + window.location.search;
    return config.base + '?' + config.paramKey + '=' + encodeURIComponent(dappUrl);
  }

  // 构建钱包 Deep Link 完整 URL（Universal Link 方式：download?deeplink=<scheme>）
  function buildWalletDeeplink(walletType) {
    var config = WALLET_DEEPLINK_CONFIG[walletType];
    if (!config) return null;

    var scheme = buildWalletScheme(walletType);
    return config.download + '?deeplink=' + encodeURIComponent(scheme);
  }

  // 调起 OKX 钱包 App（Universal Link 方式）
  function openWalletDeeplink(walletType, onFailure) {
    var deeplink = buildWalletDeeplink(walletType);
    if (!deeplink) {
      onFailure();
      return;
    }

    var start = Date.now();
    var redirected = false;

    var timer = setTimeout(function () {
      if (!redirected && Date.now() - start < 2500) {
        redirected = true;
        onFailure();
      }
    }, 1500);

    // Universal Link 方式（OKX）：直接跳转
    window.location.href = deeplink;

    window.addEventListener('pagehide', function () {
      clearTimeout(timer);
    }, { once: true });
  }

  // 发起 OKX Deep Link 登录
  function tryWalletDeeplink(walletType) {
    var config = WALLET_DEEPLINK_CONFIG[walletType];
    if (!config) {
      redirectToWalletDownload(walletType);
      return;
    }

    sessionStorage.setItem(WALLET_PENDING_KEY, JSON.stringify({
      walletType: walletType,
      timestamp: Date.now()
    }));

    openWalletDeeplink(walletType, function () {
      // 超时未跳转 → 钱包未安装，清除 pending 状态并跳转推广下载链接
      sessionStorage.removeItem(WALLET_PENDING_KEY);
      redirectToWalletDownload(walletType);
    });
  }

  // ============ WalletConnect v2 登录流程 ============
  // 用于 Bitget：通过 WalletConnect 中继服务器与钱包 App 通信
  // 流程：动态 import() 加载 EthereumProvider → init() → enable() 弹出 QR 码
  //       → 用户钱包扫码配对 → 获取账户地址 → personal_sign 签名 → 验签登录
  //
  // ⚠️ WalletConnect UMD 版本（dist/index.umd.js）依赖外部全局变量（bs58/viem/lit 等），
  //    在浏览器中无法直接使用。改用动态 import() 从 esm.sh 加载，esm.sh 会自动打包所有依赖。

  // esm.sh URL — 自动打包 WalletConnect 及其所有依赖为自包含的 ES Module
  var WALLETCONNECT_ESM_URL = 'https://esm.sh/@walletconnect/ethereum-provider@2.23.10';

  var wcProviderPromise = null; // 单例缓存 WalletConnect provider

  // 初始化 WalletConnect EthereumProvider（单例）
  // 使用动态 import() 从 esm.sh 加载模块（自动打包依赖），无需 <script src> 引入
  function getWalletConnectProvider() {
    if (wcProviderPromise) return wcProviderPromise;

    if (WALLETCONNECT_PROJECT_ID === 'YOUR_WALLETCONNECT_PROJECT_ID' || !WALLETCONNECT_PROJECT_ID) {
      wcProviderPromise = Promise.reject(new Error('WalletConnect projectId 未配置'));
      return wcProviderPromise;
    }

    console.log('[wallet] 开始加载 WalletConnect 模块:', WALLETCONNECT_ESM_URL);

    // 动态 import() 加载 ES Module（esm.sh 自动打包所有依赖）
    wcProviderPromise = import(WALLETCONNECT_ESM_URL)
      .then(function (module) {
        // esm.sh 导出：{ EthereumProvider, default, ... }
        var EthereumProvider = module.EthereumProvider || module.default;
        if (!EthereumProvider || typeof EthereumProvider.init !== 'function') {
          console.error('[wallet] WalletConnect 模块加载成功但 EthereumProvider 不可用', module);
          throw new Error('WalletConnect EthereumProvider 不可用');
        }
        console.log('[wallet] WalletConnect 模块加载成功，开始初始化 provider');
        return EthereumProvider.init({
          projectId: WALLETCONNECT_PROJECT_ID,
          chains: WALLETCONNECT_CHAINS,
          optionalChains: WALLETCONNECT_CHAINS,
          showQrModal: true,
          rpcMap: WALLETCONNECT_RPC_MAP,
          metadata: WALLETCONNECT_METADATA,
          methods: ['eth_requestAccounts', 'personal_sign'],
          events: ['accountsChanged', 'chainChanged']
        });
      })
      .then(function (provider) {
        if (!provider || typeof provider.request !== 'function') {
          throw new Error('WalletConnect provider 初始化失败');
        }
        console.log('[wallet] WalletConnect provider 初始化成功');
        return provider;
      })
      .catch(function (err) {
        // 加载/初始化失败时清空缓存，允许下次重试
        wcProviderPromise = null;
        console.error('[wallet] WalletConnect 加载或初始化失败:', err);
        throw err;
      });

    return wcProviderPromise;
  }

  // 发起 WalletConnect 登录
  function tryWalletConnectLogin(walletType) {
    var walletName = WALLET_NAMES[walletType] || walletType;

    getWalletConnectProvider()
      .then(function (provider) {
        console.log('[wallet] ' + walletName + ' 开始 WalletConnect 配对（弹出 QR 码）');
        // enable() 会弹出 QR 码模态框，等待用户在钱包 App 中扫码配对
        return provider.enable().then(function (accounts) {
          if (!accounts || !accounts[0]) {
            throw new Error(walletName + ' 未返回账户地址');
          }
          console.log('[wallet] ' + walletName + ' 配对成功，地址:', accounts[0]);
          // 复用 connectWalletProvider 完成 personal_sign + 验签登录
          return connectWalletProvider(provider, walletName);
        });
      })
      .then(function () {
        // 关闭可能仍打开的 QR 码模态框
        try {
          var wcProvider = wcProviderPromise && wcProviderPromise._result;
          if (wcProvider && typeof wcProvider.disconnect === 'function') {
            // 不主动断开会话，仅尝试关闭模态框（如有）
          }
        } catch (_e) { /* ignore */ }
        navigateTo('home');
      })
      .catch(function (err) {
        console.warn('[wallet] ' + walletName + ' WalletConnect 登录失败:', err);
        // 用户取消配对时不跳转下载页，仅提示
        var msg = err && err.message ? err.message : String(err);
        if (msg.indexOf('reject') !== -1 || msg.indexOf('cancel') !== -1 || msg.indexOf('User') !== -1) {
          alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') + msg);
          return;
        }
        // 模块加载失败或初始化失败 → 回退到推广下载链接
        if (msg.indexOf('WalletConnect') !== -1 || msg.indexOf('Failed to fetch') !== -1 ||
            msg.indexOf('fetch') !== -1 || msg.indexOf('network') !== -1) {
          alert((typeof window.t === 'function' ? window.t('walletServiceUnavailable') :
            '钱包连接服务暂不可用，请检查网络后重试') + '\n' + msg);
          redirectToWalletDownload(walletType);
          return;
        }
        alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') + msg);
      });
  }

  // ============ MetaMask SDK 登录流程 ============
  // 使用 @metamask/sdk 官方 SDK 处理完整的连接-签名-回调流程
  // SDK 自动检测环境：
  //   - MetaMask App 内置浏览器 → 直接使用 window.ethereum
  //   - 手机普通浏览器 → Deep Link 调起 MetaMask App → 用户确认后自动返回网站
  //   - 桌面浏览器 → 连接 MetaMask 扩展或显示 QR 码
  //   - 未安装 → 显示 QR 码或提示下载
  // 参考文档：https://docs.metamask.io/wallet/how-to/connect/connect-and-sign/

  var mmSdkPromise = null; // 单例缓存 MetaMask SDK 实例

  function isMetaMaskSdkAvailable() {
    return !!(window.browser && typeof window.browser.MetaMaskSDK === 'function');
  }

  // 初始化 MetaMask SDK（单例）
  function getMetaMaskSdk() {
    if (mmSdkPromise) return mmSdkPromise;

    if (!isMetaMaskSdkAvailable()) {
      mmSdkPromise = Promise.reject(new Error('MetaMask SDK 库未加载'));
      return mmSdkPromise;
    }

    try {
      var sdk = new window.browser.MetaMaskSDK({
        dappMetadata: METAMASK_SDK_DAPP_METADATA,
        // 移动端不立即检查安装，等用户主动点击登录时再触发 Deep Link
        checkInstallationImmediately: false,
        // 兼容旧版 web3 调用
        shouldShimWeb3Request: true
      });
      mmSdkPromise = Promise.resolve(sdk);
    } catch (err) {
      mmSdkPromise = Promise.reject(err);
    }

    return mmSdkPromise;
  }

  // 发起 MetaMask SDK 登录
  function tryMetaMaskSdkLogin() {
    var walletName = WALLET_NAMES['metamask'];

    getMetaMaskSdk()
      .then(function (sdk) {
        // getProvider() 返回 EIP-1193 兼容的 provider
        // SDK 会在移动端自动处理 Deep Link 调起与回调
        var provider = sdk.getProvider();
        if (!provider || typeof provider.request !== 'function') {
          throw new Error('MetaMask provider 不可用');
        }
        // 复用 connectWalletProvider 完成 eth_requestAccounts + personal_sign + 验签登录
        return connectWalletProvider(provider, walletName);
      })
      .then(function () {
        navigateTo('home');
      })
      .catch(function (err) {
        console.warn(walletName + ' SDK 登录失败', err);
        var msg = err && err.message ? err.message : String(err);
        // 用户取消连接/签名时，仅提示不跳转下载页
        if (msg.indexOf('reject') !== -1 || msg.indexOf('cancel') !== -1 ||
            msg.indexOf('User') !== -1 || msg.indexOf('denied') !== -1) {
          alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') + msg);
          return;
        }
        // SDK 库未加载 → 回退到推广下载链接
        if (msg.indexOf('SDK 库未加载') !== -1 || msg.indexOf('provider 不可用') !== -1) {
          alert((typeof window.t === 'function' ? window.t('walletServiceUnavailable') :
            '钱包连接服务暂不可用，请刷新页面重试') + '\n' + msg);
          redirectToWalletDownload('metamask');
          return;
        }
        alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') + msg);
      });
  }

  // 读取 pending 状态（含过期检查）
  function getWalletPending() {
    var pending = null;
    try {
      pending = JSON.parse(sessionStorage.getItem(WALLET_PENDING_KEY) || 'null');
    } catch (_e) { pending = null; }

    if (pending && pending.timestamp && Date.now() - pending.timestamp > WALLET_PENDING_TIMEOUT) {
      sessionStorage.removeItem(WALLET_PENDING_KEY);
      return null;
    }
    return pending;
  }

  // 检测 OKX App 环境：若 Provider 可用且有 pending 标记，自动连接钱包
  // 此函数在 initMobileShell 和 handleRouteChange 中调用
  // 仅适用于 OKX（Universal Link 在 App 内置浏览器加载网站的场景）
  // Bitget / MetaMask 使用 WalletConnect，无需此回调检测
  function checkWalletCallback() {
    var pending = getWalletPending();
    if (!pending || !pending.walletType) return;

    var walletType = pending.walletType;

    // 仅处理有 Deep Link 功能的钱包（okx）
    if (!WALLET_DEEPLINK_CONFIG[walletType]) return;

    var provider = getWalletProvider(walletType);
    if (!provider) return; // 尚未进入钱包 App，等待

    // 已进入钱包 App，清除 pending 标记，自动发起 Provider 连接
    sessionStorage.removeItem(WALLET_PENDING_KEY);
    var walletName = WALLET_NAMES[walletType] || walletType;
    console.log('[wallet] 检测到 ' + walletName + ' App 环境，自动连接钱包');

    connectWalletProvider(provider, walletName)
      .then(function () {
        navigateTo('home');
      })
      .catch(function (err) {
        console.warn(walletName + ' 自动连接失败', err);
        alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') +
          (err && err.message ? err.message : String(err)));
      });
  }

  function handleWalletLogin(walletType) {
    var walletName = WALLET_NAMES[walletType] || walletType;

    // OKX: Deep Link 流程（Universal Link 跳转到 OKX App）
    if (WALLET_DEEPLINK_CONFIG[walletType]) {
      var provider = getWalletProvider(walletType);
      if (provider) {
        // 已在 OKX App 内置浏览器中，直接走 Provider 流程
        connectWalletProvider(provider, walletName)
          .then(function () { navigateTo('home'); })
          .catch(function (err) {
            console.warn(walletName + ' 登录失败', err);
            alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') +
              (err && err.message ? err.message : String(err)));
          });
      } else {
        // 普通浏览器中，通过 Deep Link 跳转到 OKX App
        tryWalletDeeplink(walletType);
      }
      return;
    }

    // MetaMask: 使用官方 SDK（自动处理移动端 Deep Link 调起与回调）
    if (walletType === 'metamask') {
      // 优先检测注入的 Provider（用户已在 MetaMask App 内置浏览器中）
      var mmProvider = getWalletProvider(walletType);
      if (mmProvider) {
        connectWalletProvider(mmProvider, walletName)
          .then(function () { navigateTo('home'); })
          .catch(function (err) {
            console.warn(walletName + ' 登录失败', err);
            alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') +
              (err && err.message ? err.message : String(err)));
          });
        return;
      }
      // 普通浏览器中，使用 MetaMask SDK 调起 App 并完成连接-签名-回调
      tryMetaMaskSdkLogin();
      return;
    }

    // Bitget: WalletConnect 协议
    if (WALLETCONNECT_WALLETS.indexOf(walletType) !== -1) {
      // 优先检测注入的 Provider（用户已在钱包 App 内置浏览器中）
      var wcProvider = getWalletProvider(walletType);
      if (wcProvider) {
        connectWalletProvider(wcProvider, walletName)
          .then(function () { navigateTo('home'); })
          .catch(function (err) {
            console.warn(walletName + ' 登录失败', err);
            alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') +
              (err && err.message ? err.message : String(err)));
          });
        return;
      }
      // 普通浏览器中，使用 WalletConnect 协议配对
      tryWalletConnectLogin(walletType);
      return;
    }

    // 其他钱包：Provider + 下载链接
    var genericProvider = getWalletProvider(walletType);
    if (genericProvider) {
      connectWalletProvider(genericProvider, walletName)
        .then(function () { navigateTo('home'); })
        .catch(function (err) {
          console.warn(walletName + ' 登录失败', err);
          alert((typeof window.t === 'function' ? window.t('walletConnectFail') : '钱包登录失败：') +
            (err && err.message ? err.message : String(err)));
        });
    } else {
      redirectToWalletDownload(walletType);
    }
  }

  function bindWalletLoginButtons() {
    var walletButtons = document.querySelectorAll('.mobile-wallet-btn');
    walletButtons.forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        var walletType = btn.getAttribute('data-wallet');
        if (walletType) {
          handleWalletLogin(walletType);
        }
      });
    });
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

  function enhanceTaskDetailReportUi() {
    var card = document.querySelector('#task-detail-page .publisher-info-card');
    var btn = document.getElementById('td-report-btn');
    if (card && !btn && typeof window.coinrealmEnsureTaskReportUi === 'function') {
      window.coinrealmEnsureTaskReportUi();
      btn = document.getElementById('td-report-btn');
    }
    if (card) {
      card.classList.add('mobile-publisher-card');
    }
    if (btn) {
      btn.classList.add('mobile-report-btn');
    }
  }

  function handleRouteChange() {
    var route = getRouteBase();
    updateHeader(route);
    syncLoginScreen();
    checkWalletCallback();
    if (typeof window.coinrealmRefreshNotifications === 'function') {
      window.coinrealmRefreshNotifications();
    }
    if (route === 'home') {
      setTimeout(function () {
        setupMobileFilterTags();
        enhanceOfficialRecommendCards();
      }, 50);
    }
    if (route === 'simple-tasks') {
      setTimeout(enhanceSimpleTaskCards, 50);
      setTimeout(enhanceSimpleTaskCards, 300);
    }
    if (route === 'task-detail') {
      setTimeout(enhanceTaskDetailReportUi, 80);
      setTimeout(enhanceTaskDetailReportUi, 400);
    }
    if (route === 'create-task') {
      setActiveTab('create-task');
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
    setupMobileFilterTags();
    bindMobileSearchInput();
    checkWalletCallback();

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.mobile-filter-more-wrap')) {
        closeMobileFilterDropdown();
      }
    });

    applyMobileShellI18n();

    window.addEventListener('hashchange', handleRouteChange);

    if (typeof window.coinrealmRefreshAuthArea === 'function') {
      var origRefresh = window.coinrealmRefreshAuthArea;
      window.coinrealmRefreshAuthArea = function () {
        origRefresh();
        syncLoginScreen();
        syncLoginButtonLabels();
        if (typeof window.coinrealmRefreshNotifications === 'function') {
          window.coinrealmRefreshNotifications();
        }
      };
    }

    handleRouteChange();
    syncLoginScreen();
    setupMobileFilterTags();
    enhanceOfficialRecommendCards();
    enhanceSimpleTaskCards();

    if (typeof window.coinrealmInitNotifications === 'function') {
      window.coinrealmInitNotifications();
    } else if (typeof window.coinrealmRefreshNotifications === 'function') {
      window.coinrealmRefreshNotifications();
    }

    console.log('[mobile] 手机版壳层已初始化，当前语言:', window.currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileShell);
  } else {
    initMobileShell();
  }

  // 暴露 WalletConnect「仅连接取址」能力给 app.js（用于个人中心绑定钱包，不签名、不登录）
  window.coinrealmRequestWalletAddressViaWalletConnect = function () {
    return getWalletConnectProvider().then(function (provider) {
      // enable() 弹出 QR 码模态框，用户扫码配对后返回 accounts，等价于 eth_requestAccounts
      return provider.enable();
    }).then(function (accounts) {
      if (!accounts || !accounts[0]) throw new Error('未返回账户地址');
      return String(accounts[0]).toLowerCase();
    });
  };
})();
