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
  var hideTimer = null;
  var testLoginModalReady = false;
  var testLoginSubmitting = false;
  var WALLET_AUTH_WORKER_URL = 'https://coinrealm-wallet-auth.samyang9695482.workers.dev';

  // 在 app.js 执行前缓存 #app-content 完整 HTML，供菜单跳转时恢复真实页面
  var authAppContentHtml = (function () {
    var el = document.getElementById('app-content');
    return el ? el.innerHTML : '';
  })();

  var routePageMap = {
    home: 'home-page',
    profile: 'profile-page',
    'my-tasks': 'my-tasks-page',
    'publish-management': 'publish-management-page',
    'create-task': 'create-task-page',
    'task-detail': 'task-detail-page',
    'submit-task': 'submit-task-page',
    dividends: 'dividends-page',
    exchange: 'exchange-page',
    leaderboard: 'leaderboard-page',
    invite: 'invite-page',
    'broadcast-history': 'broadcast-history-page',
    publisher: 'publisher-page',
    review: 'review-page',
    admin: 'admin-page'
  };

  function getRouteBaseName(routeOrHash) {
    var route = String(routeOrHash || '').replace(/^#/, '') || 'home';
    return route.split('?')[0] || 'home';
  }

  var allPageIds = [
    'home-page',
    'task-detail-page',
    'create-task-page',
    'submit-task-page',
    'profile-page',
    'my-tasks-page',
    'publish-management-page',
    'dividends-page',
    'exchange-page',
    'leaderboard-page',
    'broadcast-history-page',
    'publisher-page',
    'review-page',
    'invite-page',
    'admin-page'
  ];

  var authText = {
    zh: {
      googleSignIn: 'Google 登录',
      testSignIn: '测试登录',
      testLoginTitle: '测试登录',
      testEmailPlaceholder: '邮箱',
      testPasswordPlaceholder: '密码',
      testLoginSubmit: '登录',
      testLoginCancel: '取消',
      testLoginRequired: '请输入邮箱和密码',
      testLoginFail: '登录失败：',
      connectWallet: '连接钱包',
      walletConnectFail: '钱包登录失败：',
      metamaskNotInstalled: '请安装 MetaMask 浏览器插件',
      welcomeSignMessage: '欢迎来到 CoinRealm！签名以验证你的身份。',
      walletAddressLabel: '钱包地址：',
      timestampLabel: '时间戳：',
      menuProfile: '个人中心',
      menuTasks: '我的任务',
      menuPublishManagement: '发布管理',
      menuCreate: '发布任务',
      menuDividends: '我的分红',
      menuExchange: '兑换市场',
      menuLeaderboard: '排行榜',
      menuInvite: '邀请好友',
      menuAdmin: '管理后台',
      menuTwitter: 'Twitter 账号',
      twitterUnbound: '未绑定',
      twitterBound: 'Twitter 已绑定 ✓',
      signOutAll: '退出登录'
    },
    en: {
      googleSignIn: 'Sign in with Google',
      testSignIn: 'Test Sign In',
      testLoginTitle: 'Test Sign In',
      testEmailPlaceholder: 'Email',
      testPasswordPlaceholder: 'Password',
      testLoginSubmit: 'Sign in',
      testLoginCancel: 'Cancel',
      testLoginRequired: 'Please enter email and password',
      testLoginFail: 'Sign in failed: ',
      connectWallet: 'Connect Wallet',
      walletConnectFail: 'Wallet sign-in failed: ',
      metamaskNotInstalled: 'Please install the MetaMask browser extension',
      welcomeSignMessage: 'Welcome to CoinRealm! Sign to verify your identity.',
      walletAddressLabel: 'Wallet address: ',
      timestampLabel: 'Timestamp: ',
      menuProfile: 'Profile',
      menuTasks: 'My Tasks',
      menuPublishManagement: 'Publish Management',
      menuCreate: 'Post Task',
      menuDividends: 'My Dividends',
      menuExchange: 'Exchange',
      menuLeaderboard: 'Leaderboard',
      menuInvite: 'Invite Friends',
      menuAdmin: 'Admin Panel',
      menuTwitter: 'Twitter Account',
      twitterUnbound: 'Not linked',
      twitterBound: 'Twitter linked ✓',
      signOutAll: 'Sign out'
    }
  };

  var menuRoutes = [
    { key: 'menuProfile', hash: 'profile' },
    { key: 'menuTasks', hash: 'my-tasks' },
    { key: 'menuPublishManagement', hash: 'publish-management' },
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

  // 从邮箱生成 username（取 @ 前前缀）
  function usernameFromEmail(email) {
    if (!email) return 'user';
    var parts = email.split('@');
    return parts[0] || 'user';
  }

  // 谷歌登录：按 Auth UID 查找/创建 users 记录（id 必须与 auth.uid() 一致）
  function upsertGoogleUser(authUser) {
    var now = new Date().toISOString();
    var userId = authUser.id;
    var email = authUser.email || null;

    return window.supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
      .then(function (result) {
        if (result.error) throw result.error;
        if (result.data) {
          return window.supabase
            .from('users')
            .update({ updated_at: now })
            .eq('id', userId)
            .select('id')
            .single();
        }
        return window.supabase
          .from('users')
          .insert({
            id: userId,
            email: email,
            wallet_address: null,
            username: usernameFromEmail(email),
            level: 0,
            reputation_score: 100,
            crlm_balance: 0,
            usdt_balance: 0
          })
          .select('id')
          .single();
      })
      .then(function (result) {
        if (result.error) throw result.error;
        return result.data.id;
      });
  }

  // 登录成功后异步同步用户到 public.users 表（不阻塞 UI）
  function syncUserToSupabase() {
    if (!window.supabase || !isLoggedIn() || !currentUser) return;

    window.supabase.auth.getSession()
      .then(function (sessionResult) {
        if (sessionResult.error) throw sessionResult.error;
        var session = sessionResult.data && sessionResult.data.session;
        var user = session && session.user;
        if (!user || !user.id) return null;
        console.log('开始同步用户，user.id:', user.id);
        return upsertGoogleUser(user);
      })
      .then(function (userId) {
        if (userId) {
          sessionStorage.setItem('coinrealm_user_id', userId);
        }
      })
      .catch(function (error) {
        console.warn('用户同步失败', error);
        console.error('同步用户失败', error);
      });
  }

  // 延迟触发用户同步，避免阻塞导航栏渲染
  function scheduleUserSync() {
    setTimeout(function () {
      syncUserToSupabase();
    }, 0);
  }

  // 将完整钱包地址截断为 0x1234...abcd 格式，便于导航栏展示
  function truncateWalletAddress(address) {
    if (!address || address.length < 10) return address || '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  function clearWalletStorage() {
    localStorage.removeItem('coinrealm_wallet');
    localStorage.removeItem('coinrealm_user_id');
  }

  function isWalletAuthUser(user) {
    if (!user) return false;
    if (user.user_metadata && user.user_metadata.wallet_address) return true;
    var email = user.email || '';
    return email.indexOf('@wallet.coinrealm.local') !== -1;
  }

  function getWalletAddressFromUser(user) {
    if (!user) return walletAddress || '';
    if (user.user_metadata && user.user_metadata.wallet_address) {
      return user.user_metadata.wallet_address;
    }
    if (walletAddress) return walletAddress;
    var email = user.email || '';
    if (email.indexOf('@wallet.coinrealm.local') !== -1) {
      return '0x' + email.split('@')[0];
    }
    return '';
  }

  function applyWalletStateFromUser(user) {
    var address = getWalletAddressFromUser(user);
    if (!address) return false;
    walletAddress = address;
    localStorage.setItem('coinrealm_wallet', address);
    return true;
  }

  function ensureWalletAuthSession() {
    if (!window.supabase) {
      return Promise.resolve(null);
    }

    return window.supabase.auth.getSession().then(function (sessionResult) {
      var session = sessionResult.data && sessionResult.data.session;
      if (!session || !session.user || !session.user.id) {
        return null;
      }

      if (isWalletAuthUser(session.user)) {
        applyWalletStateFromUser(session.user);
      }

      localStorage.setItem('coinrealm_user_id', session.user.id);
      sessionStorage.setItem('coinrealm_user_id', session.user.id);
      return session.user.id;
    });
  }

  function authenticateWalletWithWorker(address, signature, message) {
    if (!window.supabase) {
      return Promise.reject(new Error('Supabase unavailable'));
    }

    return verifyWalletSignatureInBrowser(message, signature, address)
      .then(function () {
        return fetch(WALLET_AUTH_WORKER_URL, {
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: address,
            signature: signature,
            message: message
          })
        });
      })
      .then(function (response) {
        return response.text().then(function (text) {
          var data = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch (_err) {
            throw new Error(text || ('HTTP ' + response.status));
          }
          if (!response.ok) {
            var detail = data && data.detail ? ' (' + data.detail + ')' : '';
            throw new Error(((data && data.error) || ('HTTP ' + response.status)) + detail);
          }
          if (!data.access_token || !data.refresh_token) {
            throw new Error('Invalid wallet auth response');
          }
          return data;
        });
      })
      .then(function (data) {
        return window.supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        }).then(function (result) {
          if (result.error) throw result.error;

          walletAddress = address;
          localStorage.setItem('coinrealm_wallet', address);

          var userId = data.user_id ||
            (data.user && data.user.id) ||
            (result.data && result.data.user && result.data.user.id) ||
            null;

          if (userId) {
            localStorage.setItem('coinrealm_user_id', userId);
            sessionStorage.setItem('coinrealm_user_id', userId);
          }

          updateUI(result.data && result.data.user ? result.data.user : null);
          return result.data;
        });
      });
  }

  // 页面加载时从 localStorage / Supabase 会话恢复钱包登录态
  function restoreWalletSession(callback) {
    var savedWallet = localStorage.getItem('coinrealm_wallet');
    if (!savedWallet || !window.supabase) {
      callback();
      return;
    }

    walletAddress = savedWallet;

    window.supabase.auth.getSession()
      .then(function (result) {
        var session = result.data && result.data.session;
        if (session && session.user) {
          applyWalletStateFromUser(session.user);
          localStorage.setItem('coinrealm_user_id', session.user.id);
          sessionStorage.setItem('coinrealm_user_id', session.user.id);
          callback();
          return;
        }

        clearWalletStorage();
        walletAddress = null;
        callback();
      })
      .catch(function () {
        clearWalletStorage();
        walletAddress = null;
        callback();
      });
  }

  // 生成供用户签名的随机验证消息（含钱包地址与时间戳）
  function buildWalletSignMessage(address) {
    return (
      t('welcomeSignMessage') + '\n\n' +
      t('walletAddressLabel') + address + '\n' +
      t('timestampLabel') + Date.now()
    );
  }

  function loadBrowserEthers() {
    return new Promise(function (resolve, reject) {
      if (window.ethers && typeof window.ethers.verifyMessage === 'function') {
        resolve(window.ethers);
        return;
      }

      var existing = document.getElementById('coinrealm-ethers-cdn');
      if (existing) {
        existing.addEventListener('load', function () { resolve(window.ethers); }, { once: true });
        existing.addEventListener('error', function () { reject(new Error('ethers load failed')); }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.id = 'coinrealm-ethers-cdn';
      script.src = 'https://cdn.jsdelivr.net/npm/ethers@6.13.4/dist/ethers.umd.min.js';
      script.onload = function () { resolve(window.ethers); };
      script.onerror = function () { reject(new Error('ethers load failed')); };
      document.head.appendChild(script);
    });
  }

  function verifyWalletSignatureInBrowser(message, signature, address) {
    return loadBrowserEthers().then(function (ethers) {
      if (!ethers || typeof ethers.verifyMessage !== 'function') {
        throw new Error('ethers verifyMessage unavailable');
      }
      var recovered = ethers.verifyMessage(message, signature);
      var expected = ethers.getAddress(address).toLowerCase();
      var actual = ethers.getAddress(recovered).toLowerCase();
      if (expected !== actual) {
        throw new Error('本地签名验证失败');
      }
    });
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
        }).then(function (signature) {
          return authenticateWalletWithWorker(address, signature, message);
        });
      })
      .catch(function (err) {
        console.warn('钱包连接失败', err);
        alert(t('walletConnectFail') + (err && err.message ? err.message : String(err)));
        walletAddress = null;
        clearWalletStorage();
        renderAuthArea();
      });
  }

  // 获取当前登录状态的展示名称（谷歌用户名或钱包地址）
  function getDisplayInfo() {
    if (currentUser) {
      var wallet = getWalletAddressFromUser(currentUser);
      if (wallet) {
        return { name: truncateWalletAddress(wallet), title: wallet };
      }
      var name = (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email || '';
      if (name.length > 15) name = name.slice(0, 15);
      return { name: name, title: currentUser.email || '' };
    }
    if (walletAddress) {
      return { name: truncateWalletAddress(walletAddress), title: walletAddress };
    }
    return { name: '', title: '' };
  }

  // 获取头像 HTML：优先谷歌头像，其次预设头像，最后首字母占位
  function getAvatarHtml() {
    if (typeof window.coinrealmGetNavAvatarHtml === 'function') {
      return window.coinrealmGetNavAvatarHtml();
    }
    if (currentUser) {
      var avatar = (currentUser.user_metadata && currentUser.user_metadata.avatar_url) || '';
      if (avatar) {
        return '<img class="auth-avatar" src="' + avatar + '" alt="">';
      }
    }
    return '<div class="auth-avatar-placeholder"></div>';
  }

  // 构建下拉菜单 HTML
  function buildDropdownMenuHtml(includeAdmin, showLeaderboard) {
    if (showLeaderboard === undefined) showLeaderboard = true;
    var routes = menuRoutes.filter(function (route) {
      return !(route.hash === 'leaderboard' && !showLeaderboard);
    });
    if (includeAdmin) {
      routes.push({ key: 'menuAdmin', hash: 'admin' });
    }

    var items = routes.map(function (route) {
      return (
        '<a href="#' + route.hash + '" class="auth-dropdown-item" data-route="' + route.hash + '">' +
          t(route.key) +
        '</a>'
      );
    }).join('');

    return (
      items +
      '<div class="auth-dropdown-divider"></div>' +
      '<button type="button" class="auth-dropdown-item auth-dropdown-twitter" id="auth-dropdown-twitter">' +
        '<span class="auth-dropdown-twitter-label">' + t('menuTwitter') + '</span>' +
        '<span id="auth-twitter-status" class="auth-twitter-status">' + t('twitterUnbound') + '</span>' +
      '</button>' +
      '<div class="auth-dropdown-divider"></div>' +
      '<button type="button" class="auth-dropdown-item auth-dropdown-signout">' + t('signOutAll') + '</button>'
    );
  }

  // 显示目标路由对应页面，隐藏其余页面
  function showPageForRoute(route) {
    var baseRoute = getRouteBaseName(route);
    var targetId = routePageMap[baseRoute];
    if (!targetId) return;

    allPageIds.forEach(function (id) {
      var page = document.getElementById(id);
      if (page) page.classList.add('hidden');
    });

    var target = document.getElementById(targetId);
    if (target) target.classList.remove('hidden');
  }

  // 恢复完整页面结构并切换到指定路由（绕过占位路由对 innerHTML 的覆盖）
  function applyAuthRoute(route) {
    var el = document.getElementById('app-content');
    if (!el || !authAppContentHtml) return;

    var baseRoute = getRouteBaseName(route);

    if (!document.getElementById('home-page')) {
      el.innerHTML = authAppContentHtml;
    }

    showPageForRoute(baseRoute);

    if (baseRoute === 'home') {
      if (typeof handleRoute === 'function') handleRoute();
      return;
    }

    // 触发各页面模块的 hashchange 处理器以执行 render，再恢复被占位路由覆盖的内容
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    setTimeout(function () {
      if (!document.getElementById('home-page')) {
        el.innerHTML = authAppContentHtml;
        showPageForRoute(baseRoute);
      }
    }, 0);
  }

  // 菜单项路由跳转：更新 hash 并切换页面
  function navigateToRoute(route) {
    closeDropdown();

    if (history.replaceState) {
      history.replaceState(null, '', '#' + route);
    } else {
      window.location.hash = route;
    }

    applyAuthRoute(route);
  }

  // 关闭下拉菜单
  function closeDropdown() {
    clearTimeout(hideTimer);
    hideTimer = null;
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
    clearWalletStorage();
    sessionStorage.removeItem('coinrealm_user_id');

    if (window.supabase) {
      window.supabase.auth.signOut().then(function () {
        updateUI(null);
      }).catch(function () {
        updateUI(null);
      });
      return;
    }

    updateUI(null);
  }

  // 绑定下拉菜单交互：悬停/点击显示、菜单跳转、点击外部关闭
  function bindDropdownEvents() {
    var wrap = document.querySelector('.auth-user-wrap');
    var dropdown = document.querySelector('.auth-dropdown');

    if (wrap && dropdown) {
      wrap.addEventListener('mouseenter', function () {
        clearTimeout(hideTimer);
        dropdown.classList.add('visible');
      });

      wrap.addEventListener('mouseleave', function () {
        hideTimer = setTimeout(function () {
          dropdown.classList.remove('visible');
        }, 200);
      });

      dropdown.addEventListener('mouseenter', function () {
        clearTimeout(hideTimer);
      });

      dropdown.addEventListener('mouseleave', function () {
        dropdown.classList.remove('visible');
      });
    }

    var arrow = document.querySelector('.auth-dropdown-arrow');
    if (arrow) {
      arrow.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isMobileView()) toggleDropdown();
      });
    }

    document.querySelectorAll('.auth-dropdown-item[data-route]').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        var route = item.getAttribute('data-route');
        if (route) navigateToRoute(route);
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

    var twitterBtn = document.getElementById('auth-dropdown-twitter');
    if (twitterBtn) {
      twitterBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeDropdown();
        if (typeof window.coinrealmOpenTwitterBindModal === 'function') {
          window.coinrealmOpenTwitterBindModal();
        }
      });
    }

    if (typeof window.coinrealmRefreshTwitterBindUi === 'function') {
      window.coinrealmRefreshTwitterBindUi();
    }

    if (!documentClickBound) {
      documentClickBound = true;
      document.addEventListener('click', function (e) {
        var wrap = document.querySelector('.auth-user-wrap');
        if (wrap && !wrap.contains(e.target)) closeDropdown();
      });
    }
  }

  // 临时测试：邮箱密码登录弹窗样式（仅 auth.js 内注入）
  function ensureTestLoginStyles() {
    if (document.getElementById('auth-test-login-styles')) return;

    var style = document.createElement('style');
    style.id = 'auth-test-login-styles';
    style.textContent =
      '.auth-area { gap: 8px; flex-wrap: wrap; }' +
      '.auth-test-login-modal { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; }' +
      '.auth-test-login-modal.hidden { display: none; }' +
      '.auth-test-login-overlay { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.55); }' +
      '.auth-test-login-card { position: relative; z-index: 1; width: min(320px, calc(100vw - 32px)); padding: 20px; border-radius: 12px; background: #1a1a1a; border: 1px solid #333; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35); }' +
      '.auth-test-login-title { margin: 0 0 16px; font-size: 1rem; color: #fff; }' +
      '.auth-test-login-input { width: 100%; box-sizing: border-box; margin-bottom: 10px; padding: 10px 12px; border: 1px solid #444; border-radius: 8px; background: #111; color: #fff; font: inherit; }' +
      '.auth-test-login-error { margin: 0 0 10px; font-size: 0.8125rem; color: #ff7875; }' +
      '.auth-test-login-error.hidden { display: none; }' +
      '.auth-test-login-actions { display: flex; gap: 8px; justify-content: flex-end; }' +
      '.auth-test-login-actions .btn { min-width: 72px; }';
    document.head.appendChild(style);
  }

  function ensureTestLoginModal() {
    ensureTestLoginStyles();

    if (document.getElementById('auth-test-login-modal')) {
      testLoginModalReady = true;
      return;
    }

    var modal = document.createElement('div');
    modal.id = 'auth-test-login-modal';
    modal.className = 'auth-test-login-modal hidden';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="auth-test-login-overlay"></div>' +
      '<div class="auth-test-login-card" role="dialog" aria-modal="true" aria-labelledby="auth-test-login-title">' +
        '<h3 id="auth-test-login-title" class="auth-test-login-title">' + t('testLoginTitle') + '</h3>' +
        '<input type="email" id="auth-test-email" class="auth-test-login-input" autocomplete="username" placeholder="' + t('testEmailPlaceholder') + '">' +
        '<input type="password" id="auth-test-password" class="auth-test-login-input" autocomplete="current-password" placeholder="' + t('testPasswordPlaceholder') + '">' +
        '<p id="auth-test-error" class="auth-test-login-error hidden"></p>' +
        '<div class="auth-test-login-actions">' +
          '<button type="button" id="auth-test-cancel" class="btn btn-secondary">' + t('testLoginCancel') + '</button>' +
          '<button type="button" id="auth-test-submit" class="btn btn-primary">' + t('testLoginSubmit') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    bindTestLoginModalEvents();
    testLoginModalReady = true;
  }

  function updateTestLoginModalText() {
    var modal = document.getElementById('auth-test-login-modal');
    if (!modal) return;

    var title = modal.querySelector('#auth-test-login-title');
    var emailInput = modal.querySelector('#auth-test-email');
    var passwordInput = modal.querySelector('#auth-test-password');
    var cancelBtn = modal.querySelector('#auth-test-cancel');
    var submitBtn = modal.querySelector('#auth-test-submit');

    if (title) title.textContent = t('testLoginTitle');
    if (emailInput) emailInput.placeholder = t('testEmailPlaceholder');
    if (passwordInput) passwordInput.placeholder = t('testPasswordPlaceholder');
    if (cancelBtn) cancelBtn.textContent = t('testLoginCancel');
    if (submitBtn) submitBtn.textContent = t('testLoginSubmit');
  }

  function showTestLoginError(message) {
    var errorEl = document.getElementById('auth-test-error');
    if (!errorEl) return;
    if (message) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
      return;
    }
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  function showTestLoginModal() {
    ensureTestLoginModal();
    updateTestLoginModalText();

    var modal = document.getElementById('auth-test-login-modal');
    var emailInput = document.getElementById('auth-test-email');
    var passwordInput = document.getElementById('auth-test-password');
    var submitBtn = document.getElementById('auth-test-submit');

    showTestLoginError('');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (submitBtn) submitBtn.disabled = false;

    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }

    if (emailInput) {
      setTimeout(function () {
        emailInput.focus();
      }, 0);
    }
  }

  function hideTestLoginModal() {
    var modal = document.getElementById('auth-test-login-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    showTestLoginError('');
  }

  function submitTestLogin() {
    if (testLoginSubmitting || !window.supabase) return;

    var emailInput = document.getElementById('auth-test-email');
    var passwordInput = document.getElementById('auth-test-password');
    var submitBtn = document.getElementById('auth-test-submit');
    var email = emailInput ? emailInput.value.trim() : '';
    var password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      showTestLoginError(t('testLoginRequired'));
      return;
    }

    testLoginSubmitting = true;
    showTestLoginError('');
    if (submitBtn) submitBtn.disabled = true;

    window.supabase.auth.signInWithPassword({ email: email, password: password })
      .then(function (result) {
        if (result.error) throw result.error;
        hideTestLoginModal();
        updateUI(result.data && result.data.user ? result.data.user : null);
      })
      .catch(function (err) {
        showTestLoginError(t('testLoginFail') + (err && err.message ? err.message : String(err)));
      })
      .finally(function () {
        testLoginSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
      });
  }

  function bindTestLoginModalEvents() {
    var modal = document.getElementById('auth-test-login-modal');
    if (!modal || modal.getAttribute('data-bound') === '1') return;
    modal.setAttribute('data-bound', '1');

    var overlay = modal.querySelector('.auth-test-login-overlay');
    var cancelBtn = document.getElementById('auth-test-cancel');
    var submitBtn = document.getElementById('auth-test-submit');
    var passwordInput = document.getElementById('auth-test-password');

    if (overlay) {
      overlay.addEventListener('click', hideTestLoginModal);
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', hideTestLoginModal);
    }
    if (submitBtn) {
      submitBtn.addEventListener('click', submitTestLogin);
    }
    if (passwordInput) {
      passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submitTestLogin();
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

    var testSigninBtn = document.getElementById('test-signin-btn');
    if (testSigninBtn) {
      testSigninBtn.addEventListener('click', showTestLoginModal);
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

      function renderLoggedInMenu(includeAdmin, showLeaderboard) {
        area.innerHTML =
          '<div class="auth-user-wrap">' +
            '<div class="auth-user-trigger">' +
              getAvatarHtml() +
              '<span class="auth-user-name" title="' + display.title + '">' + display.name + '</span>' +
              '<span class="auth-dropdown-arrow" aria-hidden="true">▼</span>' +
            '</div>' +
            '<div class="auth-dropdown">' + buildDropdownMenuHtml(!!includeAdmin, showLeaderboard !== false) + '</div>' +
          '</div>';
        bindDropdownEvents();
      }

      var adminPromise = typeof window.coinrealmIsAdminUser === 'function'
        ? window.coinrealmIsAdminUser()
        : Promise.resolve(false);
      var leaderboardPromise = typeof window.coinrealmIsInviteLeaderboardEnabled === 'function'
        ? window.coinrealmIsInviteLeaderboardEnabled()
        : Promise.resolve(true);

      Promise.all([adminPromise, leaderboardPromise]).then(function (results) {
        renderLoggedInMenu(results[0], results[1]);
      }).catch(function () {
        renderLoggedInMenu(false, true);
      });
      return;
    }

    area.innerHTML =
      '<button type="button" id="google-signin-btn" class="btn btn-primary">' + t('googleSignIn') + '</button>' +
      '<button type="button" id="test-signin-btn" class="btn btn-secondary">' + t('testSignIn') + '</button>' +
      '<button type="button" id="connect-wallet-btn" class="btn btn-secondary">' + t('connectWallet') + '</button>';
    bindLoginEvents();
  }

  // 更新谷歌登录用户状态并刷新导航栏（不影响钱包状态）
  function updateUI(user) {
    currentUser = user;
    if (currentUser) {
      if (!applyWalletStateFromUser(currentUser)) {
        walletAddress = null;
        localStorage.removeItem('coinrealm_wallet');
      }
      scheduleUserSync();
    } else {
      walletAddress = null;
      sessionStorage.removeItem('coinrealm_user_id');
    }
    renderAuthArea();
  }

  // 启动
  function init() {
    ensureTestLoginModal();

    waitForSupabase(function (client) {
      if (!window.supabase) return;

      supabase = window.supabase;
      sbClient = window.supabase;

      renderAuthArea();

      restoreWalletSession(function () {
        window.supabase.auth.getSession().then(function (result) {
          var session = result.data && result.data.session;
          if (session && session.user) {
            updateUI(session.user);
          } else {
            updateUI(null);
          }
        }).catch(function () {
          updateUI(null);
        });

        window.supabase.auth.onAuthStateChange(function (event, session) {
          if (session && session.user) {
            updateUI(session.user);
            return;
          }
          walletAddress = null;
          clearWalletStorage();
          sessionStorage.removeItem('coinrealm_user_id');
          updateUI(null);
        });
      });
    });
  }

  // 语言切换时刷新导航栏文字
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setTimeout(function () {
        updateTestLoginModalText();
        renderAuthArea();
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.coinrealmNavigateToRoute = navigateToRoute;
  window.coinrealmApplyRoute = applyAuthRoute;
  window.coinrealmEnsureWalletAuth = ensureWalletAuthSession;
  window.coinrealmRefreshAuthArea = renderAuthArea;

  // 外部 hash 变化时，若页面被占位内容覆盖则恢复并跳转
  window.addEventListener('hashchange', function () {
    setTimeout(function () {
      var baseRoute = getRouteBaseName(window.location.hash);
      if (!document.getElementById('home-page') && authAppContentHtml) {
        applyAuthRoute(baseRoute);
        return;
      }
      if (document.getElementById('home-page')) {
        showPageForRoute(baseRoute);
        if (baseRoute === 'home' && typeof handleRoute === 'function') handleRoute();
      }
    }, 0);
  });
})();
