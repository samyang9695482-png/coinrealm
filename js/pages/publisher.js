// 发布者信息查询 — 避免 users 表 select('*') 触发 406
(function () {
  'use strict';

  var PUBLISHER_USER_SELECT_FIELDS = 'id, username, email, wallet_address, level, reputation_score, avatar_url';

  async function fetchPublisherUser(publisherId) {
    if (!window.supabase || !publisherId) {
      console.log('发布者查询结果：', { data: null, error: 'missing_params' });
      return { data: null, error: { message: 'missing_params' } };
    }

    var result = await window.supabase
      .from('users')
      .select(PUBLISHER_USER_SELECT_FIELDS)
      .eq('id', publisherId)
      .maybeSingle();

    console.log('发布者查询结果：', { data: result.data, error: result.error });
    return result;
  }

  window.coinrealmPublisherUserSelectFields = PUBLISHER_USER_SELECT_FIELDS;
  window.coinrealmFetchPublisherUser = fetchPublisherUser;
})();
