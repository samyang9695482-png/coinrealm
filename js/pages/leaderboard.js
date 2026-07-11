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
