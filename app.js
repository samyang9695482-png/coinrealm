// ==========================================
// 16. 谷歌登录 (#auth) — 任务卡 #015 修正版
// ==========================================
(function () {
  'use strict';

  var currentUser = null;

  var authTranslations = {
    zh: {
      googleSignIn: 'Google 登录',
      signOut: '登出'
    },
    en: {
      googleSignIn: 'Sign in with Google',
      signOut: 'Sign out'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function authT(key) {
    var dict = authTranslations[getLang()];
    return dict[key] || key;
  }

  function truncateDisplayName(name) {
    if (!name) return '';
    return name.length > 15 ? name.slice(0, 15) : name;
  }

  // 绑定谷歌登录事件
  function bindGoogleSignIn() {
    var btn = document.getElementById('google-signin-btn');
    if (!btn || typeof supabase === 'undefined') return;
    btn.addEventListener('click', function () {
      supabase.auth.signInWithOAuth({ provider: 'google' });
    });
  }

  // 绑定登出事件
  function bindSignOut() {
    var btn = document.getElementById('signout-btn');
    if (!btn || typeof supabase === 'undefined') return;
    btn.addEventListener('click', function () {
      supabase.auth.signOut().then(function () {
        updateAuthUI(null);
      });
    });
  }

  // 更新导航栏 UI
  function updateAuthUI(user) {
    currentUser = user;
    var authArea = document.getElementById('auth-area');
    if (!authArea) return;

    if (user) {
      var displayName = truncateDisplayName(
        user.user_metadata && user.user_metadata.full_name
          ? user.user_metadata.full_name
          : user.email || ''
      );
      var avatarUrl = user.user_metadata && user.user_metadata.avatar_url;
      var avatarHtml = avatarUrl
        ? '<img class="auth-avatar" src="' + avatarUrl + '" alt="">'
        : '<div class="auth-avatar-placeholder"></div>';

      authArea.innerHTML =
        '<div class="auth-user-wrap">' +
          avatarHtml +
          '<span class="auth-user-name" title="' + (user.email || '') + '">' + displayName + '</span>' +
          '<button type="button" id="signout-btn" class="auth-signout-btn">' + authT('signOut') + '</button>' +
        '</div>';

      bindSignOut();
    } else {
      // 未登录：直接显示 Google 登录按钮，不再隐藏
      authArea.innerHTML =
        '<button type="button" id="google-signin-btn" class="btn btn-primary">' + authT('googleSignIn') + '</button>';
      bindGoogleSignIn();
    }
  }

  // 初始化：获取当前登录状态
  function initAuth() {
    if (typeof supabase === 'undefined') {
      // 如果 Supabase 未加载，仍然显示登录按钮（但点击会无效，所以这里还是做个提示吧）
      console.warn('Supabase not loaded');
      updateAuthUI(null);
      return;
    }

    supabase.auth.getSession().then(function (result) {
      var session = result.data && result.data.session;
      updateAuthUI(session ? session.user : null);
    });

    supabase.auth.onAuthStateChange(function (event, session) {
      updateAuthUI(session ? session.user : null);
    });
  }

  // 语言切换时更新按钮文字
  function initAuthEvents() {
    var langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', function () {
        setTimeout(function () {
          updateAuthUI(currentUser);
        }, 0);
      });
    }
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAuth();
      initAuthEvents();
    });
  } else {
    initAuth();
    initAuthEvents();
  }
})();