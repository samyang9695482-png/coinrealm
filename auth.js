// ==========================================
// CoinRealm 认证模块 — 谷歌登录 + MetaMask 钱包
// ==========================================
(function () {
  'use strict';

  var supabase;
  var currentUser = null;
  var sbClient = null;
  var walletAddress = null;
  var documentClickBound = false;

  var authText = {
    zh: {
      googleSignIn: 'Google 登录',
      connectWallet: '连接钱包',
      metamaskNotInstalled: '请安装 MetaMask 浏览器插件',
      welcomeSignMessage: '欢迎来到 CoinRealm！签名以验证你的身份。',
      walletAddressLabel: '钱包地址：',
      timestampLabel: '时间戳：',
      menuProfile: '个人中心',
      menuTasks: '我的任务',
      menuCreate: '发布任务',
      menuDividends: '我的分红',
      menuExchange: '兑换市场',
      menuLeaderboard: '排行榜',
      menuInvite: '邀请好友',
      signOutAll: '退出登录'
    },
    en: {
      googleSignIn: 'Sign in with Google',
      connectWallet: 'Connect Wallet',
      metamaskNotInstalled: 'Please install the MetaMask browser extension',
      welcomeSignMessage: 'Welcome to CoinRealm! Sign to verify your identity.',
      walletAddressLabel: 'Wallet address: ',
      timestampLabel: 'Timestamp: ',
      menuProfile: 'Profile',
      menuTasks: 'My Tasks',
      menuCreate: 'Post Task',
      menuDividends: 'My Dividends',
      menuExchange: 'Exchange',
      menuLeaderboard: 'Leaderboard',
      menuInvite: 'Invite Friends',
      signOutAll: 'Sign out'
    }
  };

  var menuRoutes = [
    { key: 'menuProfile', hash: 'profile' },
    { key: 'menuTasks', hash: 'home' },
    { key: 'menuCreate', hash: 'create-task' },
    { key: 'menuDividends', hash: 'dividends' },
    { key: 'menuExchange', hash: 'exchange' },
    { key: 'menuLeaderboard', hash: 'leaderboard' },
    { key: 'menuInvite', hash: 'invite' }
  ];

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function t(key) {
    var dict = authText[getLang()];
    return dict[key] || key;
  }

  function isLoggedIn() {
    return !!(currentUser || walletAddress);
  }

  function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function resolveSupabaseClient() {
    if (window.supabase && window.supabase.auth) {
      return window.supabase;
    }
    return null;
  }

  function waitForSupabase(callback) {
    var attempts = 0;

    function tick() {
      var client = resolveSupabaseClient();
      console.log('supabase ready:', typeof window.supabase);

      if (client) {
        sbClient = client;
        callback(client);
        return;
      }

      if (attempts >= 100) {
        console.warn('Supabase 未加载，登录按钮无法使用');
        callback(null);
        return;
      }

      attempts += 1;
      setTimeout(tick, 50);
    }

    tick();
  }

  // 将完整钱包地址截断为 0x1234...abcd 格式，便于导航栏展示
  function truncateWalletAddress(address) {
    if (!address || address.length < 10) return address || '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  // 生成供用户签名的随机验证消息（含钱包地址与时间戳）
  function buildWalletSignMessage(address) {
    return (
      t('welcomeSignMessage') + '\n\n' +
      t('walletAddressLabel') + address + '\n' +
      t('timestampLabel') + Date.now()
    );
  }

  // 执行 MetaMask 连接与 personal_sign 签名流程
  function connectWallet() {
    if (!window.ethereum) {
      alert(t('metamaskNotInstalled'));
      return;
    }

    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(function (accounts) {
        if (!accounts || !accounts[0]) return;
        var address = accounts[0];
        var message = buildWalletSignMessage(address);
        return window.ethereum.request({
          method: 'personal_sign',
          params: [message, address]
        }).then(function () {
          walletAddress = address;
          renderAuthArea();
        });
      })
      .catch(function (err) {
        console.warn('钱包连接失败', err);
      });
  }

  // 获取当前登录状态的展示名称（谷歌用户名或钱包地址）
  function getDisplayInfo() {
    if (currentUser) {
      var name = (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email || '';
      if (name.length > 15) name = name.slice(0, 15);
      return { name: name, title: currentUser.email || '' };
    }
    if (walletAddress) {
      return { name: truncateWalletAddress(walletAddress), title: walletAddress };
    }
    return { name: '', title: '' };
  }

  // 获取头像 HTML：谷歌登录用真实头像，钱包登录用灰色占位圆
  function getAvatarHtml() {
    if (currentUser) {
      var avatar = (currentUser.user_metadata && currentUser.user_metadata.avatar_url) || '';
      if (avatar) {
        return '<img class="auth-avatar" src="' + avatar + '" alt="">';
      }
    }
    return '<div class="auth-avatar-placeholder"></div>';
  }

  // 构建下拉菜单 HTML
  function buildDropdownMenuHtml() {
    var items = menuRoutes.map(function (route) {
      return (
        '<a href="#' + route.hash + '" class="auth-dropdown-item" data-route="' + route.hash + '">' +
          t(route.key) +
        '</a>'
      );
    }).join('');

    return (
      items +
      '<div class="auth-dropdown-divider"></div>' +
      '<button type="button" class="auth-dropdown-item auth-dropdown-signout">' + t('signOutAll') + '</button>'
    );
  }

  // 关闭下拉菜单（移动端 .visible 状态）
  function closeDropdown() {
    var dropdown = document.querySelector('.auth-dropdown');
    if (dropdown) dropdown.classList.remove('visible');
  }

  // 切换下拉菜单显示（移动端点击箭头）
  function toggleDropdown() {
    var dropdown = document.querySelector('.auth-dropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('visible');
  }

  // 退出全部登录状态（谷歌 + 钱包）
  function signOutAll() {
    walletAddress = null;
    if (currentUser && window.supabase) {
      window.supabase.auth.signOut().then(function () {
        updateUI(null);
      }).catch(function () {
        updateUI(null);
      });
      return;
    }
    updateUI(null);
  }

  // 绑定下拉菜单交互：箭头切换、菜单跳转、点击外部关闭
  function bindDropdownEvents() {
    var arrow = document.querySelector('.auth-dropdown-arrow');
    if (arrow) {
      arrow.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isMobileView()) toggleDropdown();
      });
    }

    document.querySelectorAll('.auth-dropdown-item[data-route]').forEach(function (item) {
      item.addEventListener('click', function () {
        closeDropdown();
      });
    });

    var signoutBtn = document.querySelector('.auth-dropdown-signout');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeDropdown();
        signOutAll();
      });
    }

    if (!documentClickBound) {
      documentClickBound = true;
      document.addEventListener('click', function (e) {
        var wrap = document.querySelector('.auth-user-wrap');
        if (wrap && !wrap.contains(e.target)) closeDropdown();
      });
    }
  }

  // 绑定未登录状态下的登录按钮事件
  function bindLoginEvents() {
    var signinBtn = document.getElementById('google-signin-btn');
    if (signinBtn) {
      signinBtn.addEventListener('click', function () {
        window.supabase.auth.signInWithOAuth({ provider: 'google' });
      });
    }

    var connectBtn = document.getElementById('connect-wallet-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', connectWallet);
    }
  }

  // 根据登录状态渲染 #auth-area 导航栏
  function renderAuthArea() {
    var area = document.getElementById('auth-area');
    if (!area) return;

    closeDropdown();

    if (isLoggedIn()) {
      var display = getDisplayInfo();
      area.innerHTML =
        '<div class="auth-user-wrap">' +
          '<div class="auth-user-trigger">' +
            getAvatarHtml() +
            '<span class="auth-user-name" title="' + display.title + '">' + display.name + '</span>' +
            '<span class="auth-dropdown-arrow" aria-hidden="true">▼</span>' +
          '</div>' +
          '<div class="auth-dropdown">' + buildDropdownMenuHtml() + '</div>' +
        '</div>';
      bindDropdownEvents();
      return;
    }

    area.innerHTML =
      '<button type="button" id="google-signin-btn" class="btn btn-primary">' + t('googleSignIn') + '</button>' +
      '<button type="button" id="connect-wallet-btn" class="btn btn-secondary">' + t('connectWallet') + '</button>';
    bindLoginEvents();
  }

  // 更新谷歌登录用户状态并刷新导航栏（不影响钱包状态）
  function updateUI(user) {
    currentUser = user;
    renderAuthArea();
  }

  // 启动
  function init() {
    waitForSupabase(function (client) {
      if (!window.supabase) return;

      supabase = window.supabase;
      sbClient = window.supabase;

      renderAuthArea();

      window.supabase.auth.getSession().then(function (result) {
        var session = result.data && result.data.session;
        updateUI(session ? session.user : null);
      }).catch(function () {
        updateUI(null);
      });

      window.supabase.auth.onAuthStateChange(function (event, session) {
        updateUI(session ? session.user : null);
      });
    });
  }

  // 语言切换时刷新导航栏文字
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setTimeout(function () {
        renderAuthArea();
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
