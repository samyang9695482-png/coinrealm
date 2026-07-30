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

  var WALLET_SCHEMES = {
    okx: 'okx://',
    bitget: 'bitget://',
    metamask: 'metamask://'
  };

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
        return provider;
      }
    }
    return null;
  }

  function tryOpenWallet(walletType) {
    var scheme = WALLET_SCHEMES[walletType];
    if (!scheme) return;

    var walletName = WALLET_NAMES[walletType] || walletType;
    var start = Date.now();
    var redirected = false;

    var onVisible = function () {
      if (document.visibilityState === 'visible' && !redirected) {
        var provider = getWalletProvider(walletType);
        if (provider && typeof window.coinrealmConnectWalletByProvider === 'function') {
          document.removeEventListener('visibilitychange', onVisible);
          window.coinrealmConnectWalletByProvider(provider, walletName)
            .then(function () { navigateTo('home'); })
            .catch(function () {
              tryOpenWallet(walletType);
            });
        }
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    var timer = setTimeout(function () {
      if (!redirected && Date.now() - start < 2500) {
        redirected = true;
        document.removeEventListener('visibilitychange', onVisible);
        fetchWalletInviteSettings().then(function (settings) {
          var downloadUrl = settings[walletType] || WALLET_DEFAULTS[walletType];
          if (downloadUrl) {
            window.location.href = downloadUrl;
          } else {
            alert(walletName + (typeof window.t === 'function' ? window.t('walletNotInstalled') : ' 未安装，请先安装钱包'));
          }
        });
      }
    }, 1500);

    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = scheme;
    document.body.appendChild(iframe);

    window.addEventListener('pagehide', function () {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    }, { once: true });

    setTimeout(function () {
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 2000);
  }

  function handleWalletLogin(walletType) {
    var provider = getWalletProvider(walletType);
    var walletName = WALLET_NAMES[walletType] || walletType;

    if (provider) {
      if (typeof window.coinrealmConnectWalletByProvider === 'function') {
        window.coinrealmConnectWalletByProvider(provider, walletName)
          .then(function () {
            navigateTo('home');
          })
          .catch(function (err) {
            console.warn(walletName + ' 登录失败', err);
          });
      } else {
        alert(typeof window.t === 'function' ? window.t('walletServiceUnavailable') : '钱包连接服务暂不可用，请刷新页面重试');
      }
    } else {
      tryOpenWallet(walletType);
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
})();
