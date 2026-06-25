// ==========================================
// CoinRealm 谷歌登录 — 独立模块
// ==========================================
(function () {
  'use strict';

  var supabase;
  var currentUser = null;
  var sbClient = null;

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
      if (signoutBtn) {
        console.log('supabase ready:', typeof window.supabase);
        signoutBtn.addEventListener('click', function () {
          window.supabase.auth.signOut().then(function () {
            updateUI(null);
          });
        });
      }
    } else {
      area.innerHTML =
        '<button type="button" id="google-signin-btn" class="btn btn-primary">' + t('googleSignIn') + '</button>';

      var signinBtn = document.getElementById('google-signin-btn');
      if (signinBtn) {
        console.log('supabase ready:', typeof window.supabase);
        signinBtn.addEventListener('click', function () {
          window.supabase.auth.signInWithOAuth({ provider: 'google' });
        });
      }
    }
  }

  // 启动
  function init() {
    waitForSupabase(function (client) {
      if (!window.supabase) return;

      supabase = window.supabase;
      sbClient = window.supabase;

      updateUI(null);

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
