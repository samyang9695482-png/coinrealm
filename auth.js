// ==========================================
// CoinRealm 谷歌登录 — 独立模块
// ==========================================
(function () {
  'use strict';

  var currentUser = null;

  var authText = {
    zh: { googleSignIn: 'Google 登录', signOut: '登出' },
    en: { googleSignIn: 'Sign in with Google', signOut: 'Sign out' }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function t(key) {
    var dict = authText[getLang()];
    return dict[key] || key;
  }

  // 更新导航栏 UI
  function updateUI(user) {
    currentUser = user;
    var area = document.getElementById('auth-area');
    if (!area) return;

    if (user) {
      var name = (user.user_metadata && user.user_metadata.full_name) || user.email || '';
      if (name.length > 15) name = name.slice(0, 15);
      var avatar = (user.user_metadata && user.user_metadata.avatar_url) || '';
      var avatarHtml = avatar
        ? '<img class="auth-avatar" src="' + avatar + '" alt="">'
        : '<div class="auth-avatar-placeholder"></div>';

      area.innerHTML =
        '<div class="auth-user-wrap">' +
          avatarHtml +
          '<span class="auth-user-name" title="' + (user.email || '') + '">' + name + '</span>' +
          '<button type="button" id="signout-btn" class="auth-signout-btn">' + t('signOut') + '</button>' +
        '</div>';

      var signoutBtn = document.getElementById('signout-btn');
      if (signoutBtn && typeof supabase !== 'undefined') {
        signoutBtn.addEventListener('click', function () {
          supabase.auth.signOut().then(function () {
            updateUI(null);
          });
        });
      }
    } else {
      area.innerHTML =
        '<button type="button" id="google-signin-btn" class="btn btn-primary">' + t('googleSignIn') + '</button>';

      var signinBtn = document.getElementById('google-signin-btn');
      if (signinBtn && typeof supabase !== 'undefined') {
        signinBtn.addEventListener('click', function () {
          supabase.auth.signInWithOAuth({ provider: 'google' });
        });
      }
    }
  }

  // 启动
  function init() {
    if (typeof supabase === 'undefined') {
      console.warn('Supabase 未加载，登录按钮无法使用');
      updateUI(null);
      return;
    }

    // 立刻显示 Google 登录按钮
    updateUI(null);

    // 异步检查登录状态
    supabase.auth.getSession().then(function (result) {
      var session = result.data && result.data.session;
      updateUI(session ? session.user : null);
    }).catch(function () {
      // 即使出错，按钮也已经在上面显示出来了
    });

    supabase.auth.onAuthStateChange(function (event, session) {
      updateUI(session ? session.user : null);
    });
  }

  // 语言切换时刷新按钮文字
  var langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setTimeout(function () {
        updateUI(currentUser);
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();