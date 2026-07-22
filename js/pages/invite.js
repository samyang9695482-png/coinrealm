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
  var inviteRecordsTab = 'friends';
  var inviteDataLoaded = false;
  var inviteDataLoading = false;
  var inviteData = null;
  var leaderboardExpanded = false;
  var miningRecordsExpanded = false;
  var rankBadges = ['🥇', '🥈', '🥉'];

  // 从 window 获取默认值
  var INVITE_SETTINGS_DEFAULTS = window.coinrealmInviteSettingsDefaults || {
    invite_level1_reward: 50,
    invite_level2_reward: 10
  };

  var inviteTranslations = {
    zh: {
      iv_page_title: '邀请好友',
      iv_lb_title: '🏆 邀请排行榜',
      iv_lb_expand: '查看完整排行榜',
      iv_lb_collapse: '收起排行榜',
      iv_lb_invites: '{count} 人',
      iv_lb_reward: '{amount} CRLM',
      iv_lb_my_rank: '我的排名',
      iv_lb_empty: '暂无排行数据',
      iv_lb_coming_soon: '🏆 邀请排行榜即将开放',
      iv_share_headline: '邀请好友，赚取 CRLM',
      iv_reward_desc: '一级奖励：{level1} CRLM/人，二级奖励：{level2} CRLM/人',
      iv_stat_invites: '累计邀请',
      iv_stat_reward: '累计奖励',
      iv_invite_count: '{count} 人',
      iv_total_reward: '{amount} CRLM',
      iv_btn_copy_link: '复制链接',
      iv_friends_title: '一级邀请记录',
      iv_rewards_title: '二级邀请记录',
      iv_reward_amount: '+{amount} CRLM',
      iv_reward_pending: '未激活',
      iv_level_tag: 'L{level}',
      iv_alert_copied: '已复制！',
      iv_alert_share: '已复制链接，即将跳转...',
      iv_login_required: '请先登录查看邀请信息',
      iv_loading: '加载中...',
      iv_no_friends: '暂无邀请好友',
      iv_friends_right_hint: '您邀请的好友列表见右栏',
      iv_no_rewards: '暂无奖励记录',
      iv_airdrop: '空投',
      iv_airdrop_claimed: '已领取',
      iv_airdrop_hint: '请完成一次任意任务升级到 Lv.2 后，每日可领取一次空投，获得随机 CRLM 奖励',
      iv_airdrop_hint_level2: '升级到 Lv.2 后，每日可领取一次空投，获得随机 CRLM 奖励',
      iv_airdrop_hint_daily_task: '每日完成至少一个任务后，可领取一次空投，获得随机 CRLM 奖励',
      iv_airdrop_level_required: '请先完成任务升级到 Lv.2，即可每日领取空投',
      iv_airdrop_daily_task_required: '请先完成至少一个任务，即可领取今日空投',
      iv_airdrop_earnings_title: '🎁 空投收益',
      iv_airdrop_expand: '查看全部记录',
      iv_airdrop_collapse: '收起记录',
      iv_airdrop_empty: '暂无空投记录',
      iv_airdrop_record: '+{amount} CRLM · 连续 {days} 天',
      iv_airdrop_next: '下次空投：{time}',
      iv_airdrop_available: '今日空投可用'
    },
    en: {
      iv_page_title: 'Invite Friends',
      iv_lb_title: '🏆 Invite Leaderboard',
      iv_lb_expand: 'View full leaderboard',
      iv_lb_collapse: 'Collapse leaderboard',
      iv_lb_invites: '{count} invites',
      iv_lb_reward: '{amount} CRLM',
      iv_lb_my_rank: 'My rank',
      iv_lb_empty: 'No leaderboard data yet',
      iv_lb_coming_soon: '🏆 Invite leaderboard coming soon',
      iv_share_headline: 'Invite friends, earn CRLM',
      iv_reward_desc: 'Level 1: {level1} CRLM each, Level 2: {level2} CRLM each',
      iv_stat_invites: 'Total invites',
      iv_stat_reward: 'Total rewards',
      iv_invite_count: '{count}',
      iv_total_reward: '{amount} CRLM',
      iv_btn_copy_link: 'Copy link',
      iv_friends_title: 'Level 1 Invites',
      iv_rewards_title: 'Level 2 Invites',
      iv_reward_amount: '+{amount} CRLM',
      iv_reward_pending: 'Not activated',
      iv_level_tag: 'L{level}',
      iv_alert_copied: 'Copied!',
      iv_alert_share: 'Link copied, redirecting...',
      iv_login_required: 'Please sign in to view invite info',
      iv_loading: 'Loading...',
      iv_no_friends: 'No invited friends yet',
      iv_friends_right_hint: 'See your invited friends in the right column',
      iv_no_rewards: 'No reward records yet',
      iv_airdrop: 'Airdrop',
      iv_airdrop_claimed: 'Claimed',
      iv_airdrop_hint: 'Complete any task to reach Lv.2, then claim your daily airdrop with random CRLM rewards',
      iv_airdrop_hint_level2: 'Reach Lv.2 to claim one daily airdrop for a random CRLM reward',
      iv_airdrop_hint_daily_task: 'Complete at least one task daily to claim a random CRLM airdrop',
      iv_airdrop_level_required: 'Reach Lv.2 to claim your daily airdrop',
      iv_airdrop_daily_task_required: 'Complete at least one task today to claim today\'s airdrop',
      iv_airdrop_earnings_title: '🎁 Airdrop earnings',
      iv_airdrop_expand: 'View all records',
      iv_airdrop_collapse: 'Collapse records',
      iv_airdrop_empty: 'No airdrop records yet',
      iv_airdrop_record: '+{amount} CRLM · {days}-day streak',
      iv_airdrop_next: 'Next airdrop in {time}',
      iv_airdrop_available: 'Airdrop available today'
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

  window.getInviteText = ivT;

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

  function normalizeAirdropMode(value) {
    if (typeof window.coinrealmNormalizeAirdropMode === 'function') {
      return window.coinrealmNormalizeAirdropMode(value);
    }
    return String(value || 'level2').toLowerCase() === 'daily_task' ? 'daily_task' : 'level2';
  }

  async function fetchAirdropModeSetting() {
    if (typeof window.coinrealmFetchAirdropMode === 'function') {
      return normalizeAirdropMode(await window.coinrealmFetchAirdropMode());
    }
    return 'level2';
  }

  function getAirdropDeniedMessage(reason) {
    if (reason === 'daily_task') {
      return ivT('iv_airdrop_daily_task_required');
    }
    if (reason === 'level2') {
      return ivT('iv_airdrop_level_required');
    }
    return ivT('iv_login_required');
  }

  async function hasApprovedSubmissionToday(userId) {
    var today = getLocalDateString(0);
    var result = await window.supabase
      .from('submissions')
      .select('id, reviewed_at, updated_at, created_at')
      .eq('user_id', userId)
      .eq('status', 'approved');

    if (result.error) {
      return { ok: false, error: result.error };
    }

    var hasToday = (result.data || []).some(function (row) {
      var dateValue = row.reviewed_at || row.updated_at || row.created_at;
      if (!dateValue) return false;
      return String(dateValue).slice(0, 10) === today;
    });

    return { ok: true, hasToday: hasToday };
  }

  async function checkAirdropEligibility(userId) {
    if (!window.supabase || !userId) {
      return { ok: false, reason: 'login', message: ivT('iv_login_required') };
    }

    var mode = await fetchAirdropModeSetting();

    if (mode === 'daily_task') {
      var todayCheck = await hasApprovedSubmissionToday(userId);
      if (todayCheck.error) {
        return { ok: false, reason: 'error', message: ivT('iv_loading') };
      }
      if (!todayCheck.hasToday) {
        return { ok: false, reason: 'daily_task', message: getAirdropDeniedMessage('daily_task') };
      }
      return { ok: true, mode: mode };
    }

    var userResult = await window.supabase
      .from('users')
      .select('level')
      .eq('id', userId)
      .maybeSingle();

    if (userResult.error || !userResult.data) {
      return { ok: false, reason: 'error', message: ivT('iv_loading') };
    }

    if ((Number(userResult.data.level) || 0) < 2) {
      return { ok: false, reason: 'level2', message: getAirdropDeniedMessage('level2') };
    }

    return { ok: true, mode: mode };
  }

  async function updateAirdropHint() {
    var hintEl = document.querySelector('#invite-page .invite-mining-hint');
    if (!hintEl) return;

    var mode = await fetchAirdropModeSetting();
    var hintKey = mode === 'daily_task' ? 'iv_airdrop_hint_daily_task' : 'iv_airdrop_hint_level2';
    hintEl.setAttribute('data-i18n', hintKey);
    hintEl.textContent = ivT(hintKey);
  }

  window.coinrealmCheckAirdropEligibility = checkAirdropEligibility;
  window.coinrealmGetAirdropDeniedMessage = getAirdropDeniedMessage;
  window.coinrealmUpdateAirdropHint = updateAirdropHint;

  window.coinrealmRefreshInviteMiningData = function () {
    inviteDataLoaded = false;
    loadInvitePageData().then(function () {
      renderMiningRecords();
      renderInviteRecordsList();
      applyInviteI18n();
    });
  };

  window.coinrealmRefreshInvitePageData = function () {
    inviteDataLoaded = false;
    inviteDataLoading = false;
    inviteData = null;
    loadInvitePageData().then(function () {
      renderOverview();
      renderLeaderboard();
      renderMiningRecords();
      renderInviteRecordsList();
      applyInviteI18n();
    });
  };

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

    var miningBtn = document.getElementById('invite-mining-btn');
    var miningLabel = document.getElementById('invite-mining-label');
    if (miningBtn && miningLabel && miningBtn.classList.contains('invite-mining-done')) {
      miningLabel.textContent = ivT('iv_airdrop_claimed');
    }
  }

  function buildInviteLink(userId) {
    var base = window.location.origin + window.location.pathname;
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + 'ref=' + encodeURIComponent(userId);
  }

  function getRankBadge(rank) {
    return rank <= 3 ? rankBadges[rank - 1] : String(rank);
  }

  function renderLeaderboardAvatarHtml(user) {
    var avatarHtml = '<div class="iv-lb-avatar"></div>';
    if (!user) return avatarHtml;
    var temp = document.createElement('div');
    temp.className = 'iv-lb-avatar';
    if (typeof applyAvatarToElement === 'function') {
      applyAvatarToElement(temp, user, 'cr-avatar-img', {});
      return temp.outerHTML;
    }
    return avatarHtml;
  }

  function aggregateInviteRewards(rows) {
    var map = {};
    (rows || []).forEach(function (row) {
      var inviterId = row.inviter_id;
      if (!inviterId) return;
      map[inviterId] = (map[inviterId] || 0) + (Number(row.reward_amount) || 0);
    });
    return map;
  }

  function fetchInviteLeaderboard(limit) {
    return window.supabase
      .from('users')
      .select('id, username, email, avatar_url, invite_count')
      .order('invite_count', { ascending: false })
      .limit(limit)
      .then(function (usersResult) {
        if (usersResult.error) throw usersResult.error;
        var users = usersResult.data || [];
        var userIds = users.map(function (u) { return u.id; }).filter(Boolean);
        if (!userIds.length) {
          return users.map(function (u, index) {
            return {
              rank: index + 1,
              id: u.id,
              username: u.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(u.email) : 'User'),
              avatar_url: u.avatar_url || '',
              invite_count: Number(u.invite_count) || 0,
              total_reward: 0
            };
          });
        }

        return window.supabase
          .from('invites')
          .select('inviter_id, reward_amount')
          .in('inviter_id', userIds)
          .then(function (rewardsResult) {
            var rewardMap = aggregateInviteRewards(rewardsResult.error ? [] : rewardsResult.data);
            return users.map(function (u, index) {
              return {
                rank: index + 1,
                id: u.id,
                username: u.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(u.email) : 'User'),
                avatar_url: u.avatar_url || '',
                invite_count: Number(u.invite_count) || 0,
                total_reward: rewardMap[u.id] || 0
              };
            });
          });
      });
  }

  function fetchMyInviteRank(userId) {
    return window.supabase
      .from('users')
      .select('id, username, email, avatar_url, invite_count')
      .eq('id', userId)
      .single()
      .then(function (userResult) {
        if (userResult.error || !userResult.data) return null;
        var inviteCount = Number(userResult.data.invite_count) || 0;
        return window.supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gt('invite_count', inviteCount)
          .then(function (countResult) {
            if (countResult.error) return null;
            return window.supabase
              .from('invites')
              .select('reward_amount')
              .eq('inviter_id', userId)
              .then(function (rewardResult) {
                var totalReward = (rewardResult.data || []).reduce(function (sum, row) {
                  return sum + (Number(row.reward_amount) || 0);
                }, 0);
                return {
                  rank: (countResult.count || 0) + 1,
                  id: userResult.data.id,
                  username: userResult.data.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(userResult.data.email) : 'User'),
                  avatar_url: userResult.data.avatar_url || '',
                  invite_count: inviteCount,
                  total_reward: totalReward
                };
              });
          });
      });
  }

  function loadInvitePageData() {
    if (inviteDataLoading) {
      return Promise.resolve(inviteData);
    }

    inviteDataLoading = true;

    // 使用 window 对象引用 app.js 中暴露的函数
    var appFetchInviteSettings = window.coinrealmFetchInviteSettings || fetchInviteSettings;

    return Promise.all([
      appFetchInviteSettings(),
      fetchShowInviteLeaderboard(),
      getCurrentUserId()
    ])
      .then(function (results) {
        var settings = results[0];
        console.log('邀请页面-加载数据-settings:', settings);
        var showLeaderboardValue = results[1];
        var userId = results[2];
        var showInviteLeaderboard = isInviteLeaderboardEnabled(showLeaderboardValue);

        if (!userId || !window.supabase) {
          return { loggedIn: false, settings: settings, showInviteLeaderboard: showInviteLeaderboard };
        }

        return Promise.all([
          window.supabase.from('users').select('invite_count').eq('id', userId).single(),
          window.supabase.from('invites').select('id, inviter_id, invitee_id, level, reward_amount, is_activated, created_at').eq('inviter_id', userId).eq('level', 1).order('created_at', { ascending: false }),
          window.supabase.from('invites').select('id, inviter_id, invitee_id, level, reward_amount, is_activated, created_at').eq('inviter_id', userId).eq('level', 2).order('created_at', { ascending: false }),
          window.supabase.from('checkins').select('*').eq('user_id', userId).order('checkin_date', { ascending: false }).limit(50),
          fetchInviteLeaderboard(50),
          fetchMyInviteRank(userId)
        ]).then(function (pageResults) {
          var userResult = pageResults[0];
          var level1InvitesResult = pageResults[1];
          var level2InvitesResult = pageResults[2];
          var checkinsResult = pageResults[3];
          var leaderboard = pageResults[4];
          var myRank = pageResults[5];

          if (userResult.error || !userResult.data) {
            return { loggedIn: false, settings: settings, showInviteLeaderboard: showInviteLeaderboard };
          }

          var level1Invites = level1InvitesResult.error ? [] : (level1InvitesResult.data || []);
          var level2Invites = level2InvitesResult.error ? [] : (level2InvitesResult.data || []);

          // 收集所有被邀请人ID，用于关联 users 表获取 username
          var allInviteeIds = [];
          level1Invites.forEach(function (row) { if (row.invitee_id) allInviteeIds.push(row.invitee_id); });
          level2Invites.forEach(function (row) { if (row.invitee_id) allInviteeIds.push(row.invitee_id); });
          var uniqueInviteeIds = allInviteeIds.filter(function (id, index) { return allInviteeIds.indexOf(id) === index; });

          var buildData = function (userMap) {
            var level1Records = level1Invites.map(function (row) {
              var user = userMap[row.invitee_id] || {};
              var isActivated = Boolean(row.is_activated);
              return {
                id: row.invitee_id,
                username: user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'Unknown'),
                registeredAt: row.created_at ? String(row.created_at).slice(0, 10) : '—',
                isActivated: isActivated,
                reward: isActivated ? (Number(row.reward_amount) || Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward) : 0
              };
            });

            var level2Records = level2Invites.map(function (row) {
              var user = userMap[row.invitee_id] || {};
              var isActivated = Boolean(row.is_activated);
              return {
                id: row.invitee_id,
                username: user.username || (typeof displayNameFromEmail === 'function' ? displayNameFromEmail(user.email) : 'Unknown'),
                registeredAt: row.created_at ? String(row.created_at).slice(0, 10) : '—',
                isActivated: isActivated,
                reward: isActivated ? (Number(row.reward_amount) || Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward) : 0
              };
            });

            var level1ActivatedCount = level1Records.filter(function (r) { return r.isActivated; }).length;
            var level2ActivatedCount = level2Records.filter(function (r) { return r.isActivated; }).length;
            var totalReward = level1Records.reduce(function (sum, r) { return sum + r.reward; }, 0) + level2Records.reduce(function (sum, r) { return sum + r.reward; }, 0);

            return {
              loggedIn: true,
              userId: userId,
              settings: settings,
              showInviteLeaderboard: showInviteLeaderboard,
              inviteCount: Number(userResult.data.invite_count) || level1Records.length,
              totalReward: totalReward,
              level1ActivatedCount: level1ActivatedCount,
              level2ActivatedCount: level2ActivatedCount,
              friends: level1Records,
              rewardRecords: level2Records,
              miningRecords: checkinsResult.error ? [] : (checkinsResult.data || []),
              leaderboard: leaderboard || [],
              myRank: myRank
            };
          };

          if (!uniqueInviteeIds.length) {
            return buildData({});
          }

          return window.supabase
            .from('users')
            .select('id, username, email')
            .in('id', uniqueInviteeIds)
            .then(function (usersResult) {
              var userMap = {};
              if (!usersResult.error && usersResult.data) {
                usersResult.data.forEach(function (user) {
                  userMap[user.id] = user;
                });
              }
              return buildData(userMap);
            });
        });
      })
      .catch(function (err) {
        console.warn('加载邀请页数据失败:', err);
        return { loggedIn: false, settings: INVITE_SETTINGS_DEFAULTS, showInviteLeaderboard: false };
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
    var countEl = document.getElementById('iv-invite-count');
    var rewardEl = document.getElementById('iv-invite-reward');
    var linkEl = document.getElementById('iv-invite-link');
    var lbList = document.getElementById('iv-leaderboard-list');
    var recordsList = document.getElementById('iv-records-list');
    var miningList = document.getElementById('iv-mining-records');
    var myRankFooter = document.getElementById('iv-my-rank-footer');

    if (countEl) countEl.textContent = loginMsg;
    if (rewardEl) rewardEl.textContent = '';
    if (linkEl) linkEl.value = '';
    if (lbList) lbList.innerHTML = '<li class="invite-empty-hint">' + loginMsg + '</li>';
    if (recordsList) recordsList.innerHTML = '<li class="invite-empty-hint">' + loginMsg + '</li>';
    if (miningList) miningList.innerHTML = '<li class="invite-empty-hint">' + loginMsg + '</li>';
    if (myRankFooter) myRankFooter.classList.add('hidden');
  }

  function renderRewardDesc() {
    var descEl = document.getElementById('iv-reward-desc');
    if (!descEl) return;
    var settings = (inviteData && inviteData.settings) || INVITE_SETTINGS_DEFAULTS;
    console.log('邀请奖励渲染-settings:', settings);
    console.log('邀请奖励渲染-inviteData.settings:', inviteData ? inviteData.settings : 'null');
    var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
    var level2Reward = Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward;
    console.log('邀请奖励渲染-level1Reward:', level1Reward, 'level2Reward:', level2Reward);
    descEl.textContent = '一级奖励：' + level1Reward + ' CRLM/人，二级奖励：' + level2Reward + ' CRLM/人';
  }

  function renderOverview() {
    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var inviteLink = buildInviteLink(inviteData.userId);
    var countEl = document.getElementById('iv-invite-count');
    var rewardEl = document.getElementById('iv-invite-reward');
    var linkEl = document.getElementById('iv-invite-link');

    if (countEl) countEl.textContent = ivT('iv_invite_count', { count: inviteData.inviteCount });
    if (rewardEl) rewardEl.textContent = ivT('iv_total_reward', { amount: formatNumber(inviteData.totalReward) });
    if (linkEl) linkEl.value = inviteLink;

    inviteData.inviteLink = inviteLink;
    renderRewardDesc();
  }

  function renderLeaderboard() {
    var listEl = document.getElementById('iv-leaderboard-list');
    var expandBtn = document.getElementById('iv-leaderboard-expand');
    var myRankFooter = document.getElementById('iv-my-rank-footer');
    if (!listEl) return;

    var leaderboardEnabled = !inviteData || inviteData.showInviteLeaderboard !== false;
    if (!leaderboardEnabled) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_lb_coming_soon') + '</li>';
      if (expandBtn) expandBtn.classList.add('hidden');
      if (myRankFooter) {
        myRankFooter.classList.add('hidden');
        myRankFooter.innerHTML = '';
      }
      return;
    }

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var rows = (inviteData.leaderboard || []).slice();
    var displayLimit = leaderboardExpanded ? 50 : 6;
    var visibleRows = rows.slice(0, displayLimit);

    if (!visibleRows.length) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_lb_empty') + '</li>';
    } else {
      listEl.innerHTML = visibleRows.map(function (row) {
        var safeName = typeof escapeHtml === 'function' ? escapeHtml(row.username) : row.username;
        return (
          '<li class="invite-leaderboard-item">' +
            '<span class="iv-lb-rank">' + getRankBadge(row.rank) + '</span>' +
            renderLeaderboardAvatarHtml(row) +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + safeName + '</span>' +
              '<span class="iv-lb-meta">' + ivT('iv_lb_invites', { count: row.invite_count }) + '</span>' +
            '</div>' +
            '<span class="iv-lb-reward">' + ivT('iv_lb_reward', { amount: formatNumber(row.total_reward) }) + '</span>' +
          '</li>'
        );
      }).join('');
    }

    if (expandBtn) {
      expandBtn.textContent = leaderboardExpanded ? ivT('iv_lb_collapse') : ivT('iv_lb_expand');
      expandBtn.classList.toggle('hidden', rows.length <= 6);
    }

    if (myRankFooter) {
      var myRank = inviteData.myRank;
      var inVisible = myRank && visibleRows.some(function (row) { return row.id === myRank.id; });
      if (myRank && !inVisible) {
        myRankFooter.classList.remove('hidden');
        myRankFooter.innerHTML =
          '<span class="invite-my-rank-label">' + ivT('iv_lb_my_rank') + '</span>' +
          '<div class="invite-leaderboard-item" style="padding:0;border:none;">' +
            '<span class="iv-lb-rank">' + getRankBadge(myRank.rank) + '</span>' +
            renderLeaderboardAvatarHtml(myRank) +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + (typeof escapeHtml === 'function' ? escapeHtml(myRank.username) : myRank.username) + '</span>' +
              '<span class="iv-lb-meta">' + ivT('iv_lb_invites', { count: myRank.invite_count }) + '</span>' +
            '</div>' +
            '<span class="iv-lb-reward">' + ivT('iv_lb_reward', { amount: formatNumber(myRank.total_reward) }) + '</span>' +
          '</div>';
      } else {
        myRankFooter.classList.add('hidden');
        myRankFooter.innerHTML = '';
      }
    }
  }

  function renderMiningRecords() {
    var listEl = document.getElementById('iv-mining-records');
    var expandBtn = document.getElementById('iv-mining-expand');
    if (!listEl) return;

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var records = (inviteData.miningRecords || []).slice();
    var displayLimit = miningRecordsExpanded ? 50 : 6;
    var visibleRecords = records.slice(0, displayLimit);

    if (!visibleRecords.length) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_airdrop_empty') + '</li>';
    } else {
      listEl.innerHTML = visibleRecords.map(function (row) {
        var dateText = row.checkin_date ? String(row.checkin_date).slice(0, 10) : '—';
        return (
          '<li class="invite-mining-record-item">' +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + dateText + '</span>' +
              '<span class="iv-lb-meta">' + ivT('iv_airdrop_record', {
                amount: formatNumber(Number(row.reward_amount) || 0),
                days: Number(row.consecutive_days) || 1
              }) + '</span>' +
            '</div>' +
          '</li>'
        );
      }).join('');
    }

    if (expandBtn) {
      expandBtn.textContent = miningRecordsExpanded ? ivT('iv_airdrop_collapse') : ivT('iv_airdrop_expand');
      expandBtn.classList.toggle('hidden', records.length <= 6);
    }
  }

  function updateInviteRecordsTabsUI() {
    var friendsTab = document.getElementById('iv-tab-friends');
    var rewardsTab = document.getElementById('iv-tab-rewards');
    if (friendsTab) friendsTab.classList.toggle('invite-records-tab-active', inviteRecordsTab === 'friends');
    if (rewardsTab) rewardsTab.classList.toggle('invite-records-tab-active', inviteRecordsTab === 'rewards');
  }

  function renderInviteRecordsList() {
    var listEl = document.getElementById('iv-records-list');
    if (!listEl) return;

    if (!inviteData || !inviteData.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    if (inviteRecordsTab === 'friends') {
      var friends = inviteData.friends || [];
      if (!friends.length) {
        listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_no_friends') + '</li>';
        return;
      }

      listEl.innerHTML = friends.map(function (friend) {
        var safeName = typeof escapeHtml === 'function' ? escapeHtml(friend.username) : friend.username;
        var rewardText;
        var rewardClass;
        
        if (friend.isActivated) {
          // 已激活：显示金色奖励金额
          rewardText = ivT('iv_reward_amount', { amount: formatNumber(friend.reward) });
          rewardClass = 'iv-record-reward iv-record-reward-activated';
        } else {
          // 未激活：显示灰色"奖励发放中"
          rewardText = ivT('iv_reward_pending');
          rewardClass = 'iv-record-reward iv-record-reward-pending';
        }
        
        return (
          '<li class="invite-record-item">' +
            '<div class="iv-lb-info">' +
              '<span class="iv-lb-name">' + safeName + '</span>' +
              '<span class="iv-lb-meta">' + friend.registeredAt + '</span>' +
            '</div>' +
            '<span class="' + rewardClass + '">' + rewardText + '</span>' +
          '</li>'
        );
      }).join('');
      return;
    }

    var rewards = inviteData.rewardRecords || [];
    if (!rewards.length) {
      listEl.innerHTML = '<li class="invite-empty-hint">' + ivT('iv_no_rewards') + '</li>';
      return;
    }

    listEl.innerHTML = rewards.map(function (record) {
      var safeName = typeof escapeHtml === 'function' ? escapeHtml(record.username) : record.username;
      var rewardText;
      var rewardClass;
      
      if (record.isActivated) {
        rewardText = ivT('iv_reward_amount', { amount: formatNumber(record.reward) });
        rewardClass = 'iv-record-reward iv-record-reward-activated';
      } else {
        rewardText = ivT('iv_reward_pending');
        rewardClass = 'iv-record-reward iv-record-reward-pending';
      }
      
      return (
        '<li class="invite-record-item">' +
          '<div class="iv-lb-info">' +
            '<span class="iv-lb-name">' + safeName + '</span>' +
            '<span class="iv-lb-meta">' + record.registeredAt + '</span>' +
          '</div>' +
          '<span class="' + rewardClass + '">' + rewardText + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function openShareWindow(platform) {
    if (!inviteData || !inviteData.loggedIn || !inviteData.inviteLink) {
      alert(ivT('iv_login_required'));
      return;
    }

    var link = inviteData.inviteLink;
    var text = ivT('iv_share_headline');
    var encodedUrl = encodeURIComponent(link);
    var encodedText = encodeURIComponent(text + ' ' + link);
    var shareUrl = '';

    if (platform === 'twitter') {
      shareUrl = 'https://twitter.com/intent/tweet?text=' + encodedText;
    } else if (platform === 'telegram') {
      shareUrl = 'https://t.me/share/url?url=' + encodedUrl + '&text=' + encodeURIComponent(text);
    } else {
      copyText(link).then(function () {
        alert(ivT('iv_alert_copied'));
      });
      return;
    }

    copyText(link).then(function () {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    });
  }

  function initInviteEvents() {
    if (inviteInitialized) return;
    inviteInitialized = true;

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
        openShareWindow(btn.getAttribute('data-share'));
      });
    });

    var friendsTab = document.getElementById('iv-tab-friends');
    var rewardsTab = document.getElementById('iv-tab-rewards');
    if (friendsTab) {
      friendsTab.addEventListener('click', function () {
        inviteRecordsTab = 'friends';
        updateInviteRecordsTabsUI();
        renderInviteRecordsList();
      });
    }
    if (rewardsTab) {
      rewardsTab.addEventListener('click', function () {
        inviteRecordsTab = 'rewards';
        updateInviteRecordsTabsUI();
        renderInviteRecordsList();
      });
    }

    var lbExpandBtn = document.getElementById('iv-leaderboard-expand');
    if (lbExpandBtn) {
      lbExpandBtn.addEventListener('click', function () {
        leaderboardExpanded = !leaderboardExpanded;
        renderLeaderboard();
        applyInviteI18n();
      });
    }

    var miningExpandBtn = document.getElementById('iv-mining-expand');
    if (miningExpandBtn) {
      miningExpandBtn.addEventListener('click', function () {
        miningRecordsExpanded = !miningRecordsExpanded;
        renderMiningRecords();
        applyInviteI18n();
      });
    }

    bindMiningEvents();
  }

  function renderInvitePage() {
    initInviteEvents();
    applyInviteI18n();
    updateInviteRecordsTabsUI();
    updateAirdropHint();

    if (typeof window.coinrealmProcessPendingInvite === 'function') {
      window.coinrealmProcessPendingInvite();
    }

    refreshMiningButtonState().then(function () {
      applyInviteI18n();
    });

    if (inviteDataLoading && !inviteDataLoaded) {
      var countEl = document.getElementById('iv-invite-count');
      if (countEl) countEl.textContent = ivT('iv_loading');
      return;
    }

    var renderAll = function () {
      renderOverview();
      renderLeaderboard();
      renderMiningRecords();
      renderInviteRecordsList();
      updateAirdropHint().then(function () {
        applyInviteI18n();
      });
    };

    if (inviteDataLoaded && inviteData) {
      renderAll();
      return;
    }

    loadInvitePageData().then(renderAll);
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
      inviteInitialized = false;
      inviteRecordsTab = 'friends';
      leaderboardExpanded = false;
      miningRecordsExpanded = false;
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
        stopMiningCountdownTicker();
        inviteDataLoaded = false;
        inviteDataLoading = false;
        inviteData = null;
      }
    }
  }

  window.addEventListener('hashchange', handleInviteRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      handleInviteRoute();
      if (typeof processPendingInviteRegistration === 'function') {
        processPendingInviteRegistration();
      }
    }, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleInviteRoute, 0);
    });
  }
})();
