// 管理后台 — 用户列表等共享逻辑
(function () {
  'use strict';

  var ADMIN_USERS_PAGE_SIZE = 1000;

  async function fetchAllAdminUsers() {
    if (!window.supabase) {
      console.log('用户列表查询结果：', { count: 0, users: [] });
      return [];
    }

    var users = [];
    var from = 0;

    while (true) {
      var to = from + ADMIN_USERS_PAGE_SIZE - 1;
      var result = await window.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (result.error) {
        console.warn('用户列表查询失败：', result.error);
        console.log('用户列表查询结果：', { count: users.length, users: users });
        return users;
      }

      var batch = result.data || [];
      users = users.concat(batch);

      if (batch.length < ADMIN_USERS_PAGE_SIZE) {
        break;
      }

      from += ADMIN_USERS_PAGE_SIZE;
    }

    console.log('用户列表查询结果：', { count: users.length, users: users });
    return users;
  }

  window.coinrealmLoadAdminUsers = fetchAllAdminUsers;
})();
