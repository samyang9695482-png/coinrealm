// CoinRealm 全局中英文字典
(function () {
  'use strict';

  var STORAGE_KEY = 'coinrealm_lang';
  var DEFAULT_LANG = 'zh';

  window.translations = {
    zh: {
      CoinRealm: 'CoinRealm',
      connectWallet: '连接钱包',
      langLabel: '中文',
      langToggle: 'EN',
      home: '首页',
      loading: '加载中...',
      pages: {
        home: { title: '任务大厅', message: '即将上线...' },
        'task-detail': { title: '任务详情', message: '即将上线...' },
        'create-task': { title: '发布任务', message: '即将上线...' },
        'submit-task': { title: '提交凭证', message: '即将上线...' },
        profile: { title: '个人中心', message: '即将上线...' },
        dividends: { title: '我的分红', message: '即将上线...' },
        exchange: { title: '兑换市场', message: '即将上线...' },
        leaderboard: { title: '排行榜', message: '即将上线...' },
        'broadcast-history': { title: '广播历史', message: '即将上线...' },
        publisher: { title: '发布者主页', message: '即将上线...' },
        review: { title: '审核管理', message: '即将上线...' },
        invite: { title: '邀请好友', message: '即将上线...' },
        'my-tasks': { title: '我的任务', message: '即将上线...' },
        'publish-management': { title: '发布管理', message: '即将上线...' },
        admin: { title: '管理后台', message: '即将上线...' }
      },
      ads_banner: '广告位（Web3 Ads）',
      ads_placeholder: '广告位招租 | 联系 @CoinRealm_X',
      broadcast_prefix: '用户',
      broadcast_done: '完成了注册任务，获得',
      broadcast_empty: '暂无动态',
      guide_text: '欢迎来到 CoinRealm！选择一个任务，开始赚取 CRLM 吧。',
      search_placeholder: '搜索任务...',
      nav_simple_tasks: '⚡ 简单任务',
      nav_home: '首页',
      nav_airdrop: '空投',
      nav_invite_earn: '邀请赚币',
      simple_view_all: '查看更多 →',
      st_page_title: '⚡ 简单任务',
      st_page_subtitle: '一键完成，快速赚取 CRLM',
      st_loading: '加载中...',
      st_empty: '暂无简单任务，稍后再来看看吧',
      st_btn_create: '发布简单任务',
      st_btn_claim: '一键领取',
      st_btn_claimed: '已领取',
      st_btn_full: '已满员',
      st_label_slots: '剩余名额',
      st_label_deadline: '截止时间',
      st_claim_success: '领取成功！请按照任务要求完成操作。',
      st_login_required: '请先登录后再领取',
      st_already_claimed: '你已领取过该任务',
      st_task_full: '任务名额已满',
      st_claim_fail: '领取失败：',
      tag_all: '全部',
      tag_simple: '⚡ 简单任务',
      tag_official: '官方',
      tag_airdrop: '空投',
      tag_register: '注册',
      tag_trade: '交易',
      tag_game: '游戏',
      tag_content: '内容',
      tag_test: '测试',
      sort_highest: '价值最高',
      sort_latest: '最新发布',
      sort_ending: '即将截止',
      sort_rewards: '奖励最多',
      badge_official: '官方',
      badge_promo: '推广',
      badge_simple_fast: '快速任务',
      text_slots: '剩余名额',
      text_days: '天后',
      btn_claim: '领取',
      empty_text: '没有找到相关任务，换个筛选试试？',
      official_recommend_title: '⭐ 官方推荐',
      official_view_all: '查看全部 >',
      checkin_success_title: '签到成功',
      checkin_reward_label: '获得奖励',
      checkin_streak: '已连续签到 {days} 天',
      checkin_streak_bonus: '连续7天加成，奖励已翻倍！',
      checkin_close: '太棒了',
      checkin_already: '今日已签到，已连续签到 {days} 天',
      checkin_login_required: '请先登录后再领取空投',
      checkin_fail: '空投失败：',
      airdrop_streak: '连续空投第 {days} 天',
      airdrop_task_required: '🎁 请先完成至少一个任务，即可每日领取空投',
      airdrop_already: '🎁 今日空投已领取，明天再来！',
      airdrop_success: '🎁 空投成功！+{amount} CRLM',
      reward_sent_desc: '奖励已发送至余额',
      reward_confirm: '确定'
    },
    en: {
      CoinRealm: 'CoinRealm',
      connectWallet: 'Connect Wallet',
      langLabel: 'EN',
      langToggle: '中文',
      home: 'Home',
      loading: 'Loading...',
      pages: {
        home: { title: 'Task Hall', message: 'Coming soon...' },
        'task-detail': { title: 'Task Detail', message: 'Coming soon...' },
        'create-task': { title: 'Create Task', message: 'Coming soon...' },
        'submit-task': { title: 'Submit Proof', message: 'Coming soon...' },
        profile: { title: 'Profile', message: 'Coming soon...' },
        dividends: { title: 'My Dividends', message: 'Coming soon...' },
        exchange: { title: 'Exchange Market', message: 'Coming soon...' },
        leaderboard: { title: 'Leaderboard', message: 'Coming soon...' },
        'broadcast-history': { title: 'Broadcast History', message: 'Coming soon...' },
        publisher: { title: 'Publisher Profile', message: 'Coming soon...' },
        review: { title: 'Review Management', message: 'Coming soon...' },
        invite: { title: 'Invite Friends', message: 'Coming soon...' },
        'my-tasks': { title: 'My Tasks', message: 'Coming soon...' },
        'publish-management': { title: 'Publish Management', message: 'Coming soon...' },
        admin: { title: 'Admin Panel', message: 'Coming soon...' }
      },
      ads_banner: 'Advertising Space (Web3 Ads)',
      ads_placeholder: 'Ad space available | Contact @CoinRealm_X',
      broadcast_prefix: 'User',
      broadcast_done: 'completed the registration task and received',
      broadcast_empty: 'No activity yet',
      guide_text: 'Welcome to CoinRealm! Select a task and start earning CRLM.',
      search_placeholder: 'Search tasks...',
      nav_simple_tasks: '⚡ Simple Tasks',
      nav_home: 'Home',
      nav_airdrop: 'Airdrop',
      nav_invite_earn: 'Invite & Earn',
      simple_view_all: 'View More',
      st_page_title: '⚡ Simple Tasks',
      st_page_subtitle: 'Complete in one tap, earn CRLM fast',
      st_loading: 'Loading...',
      st_empty: 'No simple tasks yet. Check back later.',
      st_btn_create: 'Post a Simple Task',
      st_btn_claim: 'Claim Now',
      st_btn_claimed: 'Claimed',
      st_btn_full: 'Full',
      st_label_slots: 'Slots left',
      st_label_deadline: 'Deadline',
      st_claim_success: 'Claimed! Please complete the task as required.',
      st_login_required: 'Please sign in before claiming',
      st_already_claimed: 'You have already claimed this task',
      st_task_full: 'This task is full',
      st_claim_fail: 'Claim failed: ',
      tag_all: 'All',
      tag_simple: '⚡ Simple Tasks',
      tag_official: 'Official',
      tag_airdrop: 'Airdrop',
      tag_register: 'Register',
      tag_trade: 'Trade',
      tag_game: 'Game',
      tag_content: 'Content',
      tag_test: 'Test',
      sort_highest: 'Highest Value',
      sort_latest: 'Latest Released',
      sort_ending: 'Ending Soon',
      sort_rewards: 'Most Rewards',
      badge_official: 'Official',
      badge_promo: 'Promo',
      badge_simple_fast: 'Quick Task',
      text_slots: 'Slots left',
      text_days: 'days left',
      btn_claim: 'Claim',
      empty_text: 'No tasks found. Try changing your filters?',
      official_recommend_title: '⭐ Official Picks',
      official_view_all: 'View all >',
      checkin_success_title: 'Check-in Successful',
      checkin_reward_label: 'Reward earned',
      checkin_streak: 'Streak: {days} days',
      checkin_streak_bonus: '7+ day streak — reward doubled!',
      checkin_close: 'Awesome',
      checkin_already: 'Already checked in today. Streak: {days} days',
      checkin_login_required: 'Please sign in before claiming airdrop',
      checkin_fail: 'Airdrop failed: ',
      airdrop_streak: 'Airdrop streak: day {days}',
      airdrop_task_required: '🎁 Complete at least one task to claim daily airdrop',
      airdrop_already: '🎁 Today\'s airdrop claimed. Come back tomorrow!',
      airdrop_success: '🎁 Airdrop success! +{amount} CRLM',
      reward_sent_desc: 'Reward sent to your balance',
      reward_confirm: 'OK'
    }
  };

  function initCurrentLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') {
      window.currentLang = saved;
    } else {
      window.currentLang = DEFAULT_LANG;
    }
    document.documentElement.lang = window.currentLang === 'zh' ? 'zh-CN' : 'en';
  }

  window.getLang = function () {
    var saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'zh';
  };

  window.t = function (key) {
    var dict = window.translations[window.currentLang];
    return dict && dict[key] !== undefined ? dict[key] : key;
  };

  window.setGlobalLanguage = function (lang) {
    if (lang !== 'zh' && lang !== 'en') {
      lang = DEFAULT_LANG;
    }
    window.currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  };

  initCurrentLang();
})();
