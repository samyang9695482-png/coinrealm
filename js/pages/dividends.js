// ==========================================
// 9. 我的分红页 (#dividends) — 任务卡 #007
// ==========================================
(function () {
  'use strict';

  var APP_CONTENT_HTML = '';
  var appContentEl = document.getElementById('app-content');
  if (appContentEl) {
    APP_CONTENT_HTML = appContentEl.innerHTML;
  }

  var dividendsDataLoaded = false;
  var dividendsDataLoading = false;
  var cachedDividendsData = null;

  var dividendsTranslations = {
    zh: {
      dv_page_title: '我的分红',
      dv_countdown_label: '距离下次分红还有',
      dv_countdown_note: '每周结算一次',
      dv_countdown_value: '{days}天 {hours}小时',
      dv_weight_title: '我的分红权重',
      dv_holdings_label: '持币量',
      dv_invites_label: '有效邀请人数',
      dv_total_weight_label: '综合权重',
      dv_bonus: '{bonus} 加成',
      dv_invites_unit: '{count} 人',
      dv_last_title: '上次分红',
      dv_history_title: '分红记录',
      dv_source_commission: '任务佣金分红',
      dv_source_holding: '持币权重分红',
      dv_amount_plus: '+{amount} CRLM',
      dv_login_required: '请先登录查看分红',
      dv_no_dividend: '暂无分红',
      dv_no_history: '暂无分红记录',
      dv_loading: '加载中...'
    },
    en: {
      dv_page_title: 'My Dividends',
      dv_countdown_label: 'Time until next dividend',
      dv_countdown_note: 'Settled weekly',
      dv_countdown_value: '{days}d {hours}h',
      dv_weight_title: 'My Dividend Weight',
      dv_holdings_label: 'Token Holdings',
      dv_invites_label: 'Valid Invites',
      dv_total_weight_label: 'Total Weight',
      dv_bonus: '{bonus} bonus',
      dv_invites_unit: '{count} people',
      dv_last_title: 'Last Dividend',
      dv_history_title: 'Dividend History',
      dv_source_commission: 'Task commission dividend',
      dv_source_holding: 'Holding weight dividend',
      dv_amount_plus: '+{amount} CRLM',
      dv_login_required: 'Please sign in to view dividends',
      dv_no_dividend: 'No dividends yet',
      dv_no_history: 'No dividend records yet',
      dv_loading: 'Loading...'
    }
  };

  function getLang() {
    var saved = localStorage.getItem('coinrealm_lang');
    return saved === 'en' ? 'en' : 'zh';
  }

  function dvT(key, vars) {
    var dict = dividendsTranslations[getLang()];
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

  function applyDividendsI18n() {
    document.querySelectorAll('#dividends-page [data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dividendsTranslations[getLang()][key]) {
        el.textContent = dvT(key);
      }
    });
  }

  function formatBonusMultiplier(value) {
    if (!value) return '0x';
    return (value % 1 === 0 ? String(value) : value.toFixed(1)) + 'x';
  }

  function calcHoldingsBonus(amount) {
    if (amount >= 100000) return 2;
    if (amount >= 10000) return 1.5;
    if (amount >= 1000) return 1;
    return 0;
  }

  function calcInvitesBonus(count) {
    if (count >= 50) return 2;
    if (count >= 20) return 1.5;
    if (count >= 5) return 1;
    return 0;
  }

  function getCountdownToSunday() {
    var now = new Date();
    var daysUntil = (7 - now.getDay()) % 7;
    if (daysUntil === 0) {
      daysUntil = 7;
    }

    var target = new Date(now);
    target.setDate(now.getDate() + daysUntil);
    target.setHours(0, 0, 0, 0);

    var diffMs = Math.max(0, target.getTime() - now.getTime());
    return {
      days: Math.floor(diffMs / (24 * 60 * 60 * 1000)),
      hours: Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    };
  }

  function getDividendField(row, names, fallback) {
    for (var i = 0; i < names.length; i++) {
      if (row[names[i]] != null && row[names[i]] !== '') {
        return row[names[i]];
      }
    }
    return fallback;
  }

  function formatDividendDate(row) {
    var raw = getDividendField(row, ['dividend_date', 'created_at', 'date'], '');
    if (!raw) return '—';
    return String(raw).slice(0, 10);
  }

  function formatDividendAmount(row) {
    return Number(getDividendField(row, ['amount', 'reward_amount', 'dividend_amount'], 0)) || 0;
  }

  function formatDividendSource(row) {
    var source = getDividendField(row, ['source', 'source_type', 'type'], '');
    var normalized = String(source || '').toLowerCase();
    if (normalized.indexOf('commission') >= 0 || normalized.indexOf('佣金') >= 0) {
      return dvT('dv_source_commission');
    }
    if (normalized.indexOf('holding') >= 0 || normalized.indexOf('持币') >= 0) {
      return dvT('dv_source_holding');
    }
    return source || '—';
  }

  function mapDividendHistory(rows) {
    return (rows || []).map(function (row) {
      return {
        date: formatDividendDate(row),
        amount: formatDividendAmount(row),
        sourceText: formatDividendSource(row)
      };
    });
  }

  function loadDividendsData() {
    if (dividendsDataLoaded || dividendsDataLoading) {
      return Promise.resolve(cachedDividendsData);
    }

    dividendsDataLoading = true;

    return getCurrentUserId()
      .then(function (userId) {
        if (!userId || !window.supabase) {
          return { loggedIn: false };
        }

        return window.supabase
          .from('users')
          .select('crlm_balance, invite_count')
          .eq('id', userId)
          .single()
          .then(function (userResult) {
            if (userResult.error || !userResult.data) {
              return { loggedIn: false };
            }

            return window.supabase
              .from('dividends')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false })
              .then(function (historyResult) {
                if (historyResult.error) {
                  console.warn('加载分红记录失败:', historyResult.error);
                }

                return {
                  loggedIn: true,
                  holdingsAmount: Number(userResult.data.crlm_balance) || 0,
                  invitesCount: Number(userResult.data.invite_count) || 0,
                  history: mapDividendHistory(historyResult.error ? [] : historyResult.data)
                };
              });
          });
      })
      .catch(function (err) {
        console.warn('加载分红页数据失败:', err);
        return { loggedIn: false };
      })
      .then(function (data) {
        cachedDividendsData = data;
        dividendsDataLoaded = true;
        dividendsDataLoading = false;
        return data;
      });
  }

  function renderCountdown() {
    var countdownEl = document.getElementById('dv-countdown-value');
    if (!countdownEl) return;

    var countdown = getCountdownToSunday();
    countdownEl.textContent = dvT('dv_countdown_value', {
      days: countdown.days,
      hours: countdown.hours
    });
  }

  function renderLoginRequiredState() {
    var loginMsg = dvT('dv_login_required');

    var holdingsAmount = document.getElementById('dv-holdings-amount');
    var holdingsBonus = document.getElementById('dv-holdings-bonus');
    var invitesCount = document.getElementById('dv-invites-count');
    var invitesBonus = document.getElementById('dv-invites-bonus');
    var totalWeight = document.getElementById('dv-total-weight');
    var lastAmount = document.getElementById('dv-last-amount');
    var lastDate = document.getElementById('dv-last-date');
    var lastSource = document.getElementById('dv-last-source');
    var historyList = document.getElementById('dv-history-list');

    if (holdingsAmount) holdingsAmount.textContent = loginMsg;
    if (holdingsBonus) holdingsBonus.textContent = '';
    if (invitesCount) invitesCount.textContent = '';
    if (invitesBonus) invitesBonus.textContent = '';
    if (totalWeight) totalWeight.textContent = '—';
    if (lastAmount) lastAmount.textContent = loginMsg;
    if (lastDate) lastDate.textContent = '';
    if (lastSource) lastSource.textContent = '';
    if (historyList) {
      historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + loginMsg + '</span></li>';
    }
  }

  function renderLoadingState() {
    var loadingMsg = dvT('dv_loading');
    var holdingsAmount = document.getElementById('dv-holdings-amount');
    var lastAmount = document.getElementById('dv-last-amount');
    var historyList = document.getElementById('dv-history-list');

    if (holdingsAmount) holdingsAmount.textContent = loadingMsg;
    if (lastAmount) lastAmount.textContent = loadingMsg;
    if (historyList) {
      historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + loadingMsg + '</span></li>';
    }
  }

  function renderDividendsContent(data) {
    if (!data || !data.loggedIn) {
      renderLoginRequiredState();
      return;
    }

    var holdingsBonusValue = calcHoldingsBonus(data.holdingsAmount);
    var invitesBonusValue = calcInvitesBonus(data.invitesCount);
    var totalWeightValue = holdingsBonusValue + invitesBonusValue;

    var holdingsAmountEl = document.getElementById('dv-holdings-amount');
    if (holdingsAmountEl) {
      holdingsAmountEl.textContent = formatNumber(data.holdingsAmount) + ' CRLM';
    }

    var holdingsBonusEl = document.getElementById('dv-holdings-bonus');
    if (holdingsBonusEl) {
      holdingsBonusEl.textContent = dvT('dv_bonus', { bonus: formatBonusMultiplier(holdingsBonusValue) });
    }

    var invitesCountEl = document.getElementById('dv-invites-count');
    if (invitesCountEl) {
      invitesCountEl.textContent = dvT('dv_invites_unit', { count: data.invitesCount });
    }

    var invitesBonusEl = document.getElementById('dv-invites-bonus');
    if (invitesBonusEl) {
      invitesBonusEl.textContent = dvT('dv_bonus', { bonus: formatBonusMultiplier(invitesBonusValue) });
    }

    var totalWeightEl = document.getElementById('dv-total-weight');
    if (totalWeightEl) {
      totalWeightEl.textContent = totalWeightValue.toFixed(1) + 'x';
    }

    var lastAmountEl = document.getElementById('dv-last-amount');
    var lastDateEl = document.getElementById('dv-last-date');
    var lastSourceEl = document.getElementById('dv-last-source');
    var historyList = document.getElementById('dv-history-list');
    var lastRecord = data.history.length ? data.history[0] : null;

    if (lastRecord) {
      if (lastAmountEl) {
        lastAmountEl.textContent = dvT('dv_amount_plus', { amount: formatNumber(lastRecord.amount) });
      }
      if (lastDateEl) lastDateEl.textContent = lastRecord.date;
      if (lastSourceEl) lastSourceEl.textContent = lastRecord.sourceText;
    } else {
      if (lastAmountEl) lastAmountEl.textContent = dvT('dv_no_dividend');
      if (lastDateEl) lastDateEl.textContent = '';
      if (lastSourceEl) lastSourceEl.textContent = '';
    }

    if (historyList) {
      if (!data.history.length) {
        historyList.innerHTML = '<li class="dividends-history-item"><span class="dividends-history-source">' + dvT('dv_no_history') + '</span></li>';
      } else {
        historyList.innerHTML = data.history.map(function (item) {
          return (
            '<li class="dividends-history-item">' +
              '<span class="dividends-history-date">' + item.date + '</span>' +
              '<span class="dividends-history-amount">' + dvT('dv_amount_plus', { amount: formatNumber(item.amount) }) + '</span>' +
              '<span class="dividends-history-source">' + item.sourceText + '</span>' +
            '</li>'
          );
        }).join('');
      }
    }
  }

  function renderDividendsPage() {
    applyDividendsI18n();
    renderCountdown();

    if (dividendsDataLoading && !dividendsDataLoaded) {
      renderLoadingState();
      return;
    }

    if (cachedDividendsData) {
      renderDividendsContent(cachedDividendsData);
      return;
    }

    if (!dividendsDataLoaded) {
      renderLoadingState();
      loadDividendsData().then(function (data) {
        renderDividendsContent(data);
      });
    }
  }

  function restoreAppContentIfNeeded() {
    if (!appContentEl || !APP_CONTENT_HTML) return;
    if (!document.getElementById('home-page')) {
      appContentEl.innerHTML = APP_CONTENT_HTML;
    }
  }

  function handleDividendsRoute() {
    restoreAppContentIfNeeded();

    var route = window.location.hash.replace(/^#/, '') || 'home';
    var dividendsPage = document.getElementById('dividends-page');

    if (dividendsPage) {
      if (route === 'dividends') {
        dividendsPage.classList.remove('hidden');
        renderDividendsPage();
      } else {
        dividendsPage.classList.add('hidden');
        dividendsDataLoaded = false;
        dividendsDataLoading = false;
        cachedDividendsData = null;
      }
    }
  }

  window.addEventListener('hashchange', handleDividendsRoute);

  window.addEventListener('DOMContentLoaded', function () {
    setTimeout(handleDividendsRoute, 0);
  });

  var langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function () {
      setTimeout(handleDividendsRoute, 0);
    });
  }
})();
