// ==========================================
// CoinRealm 认证模块 — 谷歌登录 + MetaMask 钱包
// ==========================================
(function () {
  'use strict';

  var supabase;
  var currentUser = null;
  var sbClient = null;
  var walletAddress = null;

  var authText = {
    zh: {
      googleSignIn: 'Google 登录',
      signOut: '登出',
      connectWallet: '连接钱包',
      metamaskNotInstalled: '请安装 MetaMask 浏览器插件',
      welcomeSignMessage: '欢迎来到 CoinRealm！签名以验证你的身份。',
      walletAddressLabel: '钱包地址：',
      timestampLabel: '时间戳：'
    },
    en: {
      googleSignIn: 'Sign in with Google',
      signOut: 'Sign out',
      connectWallet: 'Connect Wallet',
      metamaskNotInstalled: 'Please install the MetaMask browser extension',
      welcomeSignMessage: 'Welcome to CoinRealm! Sign to verify your identity.',
      walletAddressLabel: 'Wallet address: ',
      timestampLabel: 'Timestamp: '
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function t(key) {
    var dict = authText[getLang()];
    return dict[key] || key;
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

  // 清除钱包登录状态，恢复「连接钱包」按钮
  function disconnectWallet() {
    walletAddress = null;
    renderAuthArea();
  }

  // 绑定导航栏内所有认证相关按钮事件
  function bindAuthEvents() {
    var signinBtn = document.getElementById('google-signin-btn');
    if (signinBtn) {
      signinBtn.addEventListener('click', function () {
        window.supabase.auth.signInWithOAuth({ provider: 'google' });
      });
    }

    var signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', function () {
        window.supabase.auth.signOut().then(function () {
          updateUI(null);
        });
      });
    }

    var connectBtn = document.getElementById('connect-wallet-btn');
    if (connectBtn) {
      connectBtn.addEventListener('click', connectWallet);
    }

    var walletSignoutBtn = document.getElementById('wallet-signout-btn');
    if (walletSignoutBtn) {
      walletSignoutBtn.addEventListener('click', disconnectWallet);
    }
  }

  // 根据谷歌与钱包的登录状态，渲染 #auth-area 导航栏
  function renderAuthArea() {
    var area = document.getElementById('auth-area');
    if (!area) return;

    var parts = [];

    if (currentUser) {
      var name = (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email || '';
      if (name.length > 15) name = name.slice(0, 15);
      var avatar = (currentUser.user_metadata && currentUser.user_metadata.avatar_url) || '';
      var avatarHtml = avatar
        ? '<img class="auth-avatar" src="' + avatar + '" alt="">'
        : '<div class="auth-avatar-placeholder"></div>';

      parts.push(
        '<div class="auth-user-wrap">' +
          avatarHtml +
          '<span class="auth-user-name" title="' + (currentUser.email || '') + '">' + name + '</span>' +
          '<button type="button" id="signout-btn" class="auth-signout-btn">' + t('signOut') + '</button>' +
        '</div>'
      );
    } else {
      parts.push(
        '<button type="button" id="google-signin-btn" class="btn btn-primary">' + t('googleSignIn') + '</button>'
      );
    }

    if (currentUser && walletAddress) {
      parts.push('<span class="auth-separator">|</span>');
    }

    if (walletAddress) {
      parts.push(
        '<span class="auth-wallet-address" title="' + walletAddress + '">' +
          truncateWalletAddress(walletAddress) +
        '</span>' +
        '<button type="button" id="wallet-signout-btn" class="auth-signout-btn">' + t('signOut') + '</button>'
      );
    } else {
      parts.push(
        '<button type="button" id="connect-wallet-btn" class="btn btn-secondary">' + t('connectWallet') + '</button>'
      );
    }

    area.innerHTML = parts.join('');
    bindAuthEvents();
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

  // 语言切换时刷新按钮文字
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
