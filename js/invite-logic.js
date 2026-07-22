/* 邀请逻辑模块 - 独立于 app.js */

var INVITE_SETTINGS_DEFAULTS = {
  invite_level1_reward: 50,
  invite_level2_reward: 10
};
var cachedInviteSettings = null;

async function fetchInviteSettings() {
  if (cachedInviteSettings) return cachedInviteSettings;

  var settings = Object.assign({}, INVITE_SETTINGS_DEFAULTS);
  if (!window.supabase) {
    cachedInviteSettings = settings;
    return settings;
  }

  try {
    var keys = Object.keys(INVITE_SETTINGS_DEFAULTS);
    var result = await window.supabase
      .from('settings')
      .select('key, value')
      .in('key', keys);

    console.log('邀请奖励设置-查询结果：', result);

    if (!result.error && result.data) {
      result.data.forEach(function (row) {
        if (row.key && row.value != null && row.value !== '') {
          settings[row.key] = Number(row.value);
        }
      });
      console.log('邀请奖励设置-解析后：', settings);
    } else if (result.error) {
      console.error('邀请奖励设置-查询失败：', result.error);
    }
  } catch (settingsErr) {
    console.warn('读取邀请奖励设置失败:', settingsErr);
  }

  cachedInviteSettings = settings;
  return settings;
}

async function findInviterByRef(ref) {
  if (!ref || !window.supabase) return null;
  ref = String(ref).trim();
  if (!ref) return null;

  try {
    var exactResult = await window.supabase
      .from('users')
      .select('id, crlm_balance, invite_count, username')
      .eq('id', ref)
      .maybeSingle();

    if (!exactResult.error && exactResult.data) {
      return exactResult.data;
    }

    if (ref.length >= 8) {
      var prefixResult = await window.supabase
        .from('users')
        .select('id, crlm_balance, invite_count, username')
        .ilike('id', ref + '%')
        .limit(2);

      if (!prefixResult.error && prefixResult.data && prefixResult.data.length === 1) {
        return prefixResult.data[0];
      }
    }
  } catch (lookupErr) {
    console.warn('查找邀请人失败:', lookupErr);
  }

  return null;
}

function captureInviteRefFromUrl() {
  try {
    var params = new URLSearchParams(window.location.search);
    var ref = params.get('ref');
    if (ref) {
      var inviterId = String(ref).trim();
      localStorage.setItem('inviter_id', inviterId);
      localStorage.setItem('coinrealm_invite_ref', inviterId);
      console.log('invite-logic.js-捕获邀请 ref 参数：', inviterId);
      console.log('invite-logic.js-已存入 localStorage inviter_id：', localStorage.getItem('inviter_id'));
    } else {
      console.log('invite-logic.js-URL 中未检测到 ref 参数');
    }
  } catch (captureErr) {
    console.warn('捕获邀请 ref 失败:', captureErr);
  }
}
captureInviteRefFromUrl();

(function checkInviteInfoOnLoad() {
  try {
    var storedInviterId = localStorage.getItem('inviter_id');
    var storedInviteRef = localStorage.getItem('coinrealm_invite_ref');
    console.log('invite-logic.js-页面加载时检查邀请信息：');
    console.log('  - localStorage.inviter_id：', storedInviterId);
    console.log('  - localStorage.coinrealm_invite_ref：', storedInviteRef);
    
    var urlParams = new URLSearchParams(window.location.search);
    var urlRef = urlParams.get('ref');
    console.log('  - URL 中的 ref 参数：', urlRef);
  } catch (e) {
    console.warn('检查邀请信息失败:', e);
  }
})();

function getStoredInviterId() {
  try {
    var inviterId = localStorage.getItem('inviter_id');
    if (inviterId) {
      console.log('invite-logic.js-从 localStorage 读取到 inviter_id：', inviterId);
      return String(inviterId).trim();
    }
  } catch (storageErr) {
    console.warn('读取邀请人 ID 失败:', storageErr);
  }

  try {
    var fallback = localStorage.getItem('coinrealm_invite_ref');
    if (fallback) {
      console.log('invite-logic.js-从备用键读取到 coinrealm_invite_ref：', fallback);
      return String(fallback).trim();
    }
  } catch (fallbackErr) {
    console.warn('读取历史邀请 ref 失败:', fallbackErr);
  }

  console.log('invite-logic.js-未在 localStorage 中找到任何邀请信息');
  return '';
}

function clearStoredInviterId() {
  try {
    localStorage.removeItem('inviter_id');
    localStorage.removeItem('coinrealm_invite_ref');
  } catch (storageErr) {
    console.warn('清理邀请缓存失败:', storageErr);
  }
}

async function grantInviteReward(inviter, inviteeId, level, amount) {
  if (!inviter || !inviteeId || amount <= 0 || !window.supabase) return false;

  try {
    var insertResult = await window.supabase.from('invites').insert({
      inviter_id: inviter.id,
      invitee_id: inviteeId,
      level: level,
      reward_amount: amount,
      is_activated: false,
      created_at: new Date().toISOString()
    });

    if (insertResult.error) {
      var errMsg = String(insertResult.error.message || insertResult.error.details || '').toLowerCase();
      var errCode = insertResult.error.code || '';
      
      if (errCode === '23505' || errMsg.indexOf('duplicate') !== -1 || errMsg.indexOf('conflict') !== -1) {
        console.log('邀请记录已存在（409冲突），说明邀请关系已建立，视为成功');
        return true;
      }
      
      if (errMsg.indexOf('column') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('邀请表字段缺失，请先执行 SQL：ALTER TABLE invites ADD COLUMN IF NOT EXISTS reward_amount NUMERIC DEFAULT 0; ALTER TABLE invites ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE; ALTER TABLE invites ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();');
      } else {
        console.warn('插入邀请记录失败:', insertResult.error);
      }
      return false;
    }

    console.log('邀请记录创建成功，等待被邀请人激活（is_activated=false）');
    return true;
  } catch (grantErr) {
    console.warn('创建邀请记录失败:', grantErr);
    return false;
  }
}

function buildInviteNotificationPayload(userId, title, link, relatedId) {
  return {
    user_id: userId,
    type: 'info',
    title: title,
    link: link,
    related_id: relatedId || null
  };
}

async function writeInviteNotification(userId, title, link, relatedId) {
  if (!userId || !window.supabase) return;
  try {
    if (typeof window.coinrealmCreateNotification === 'function') {
      await window.coinrealmCreateNotification(buildInviteNotificationPayload(userId, title, link, relatedId));
      return;
    }
    await window.supabase.from('notifications').insert(buildInviteNotificationPayload(userId, title, link, relatedId));
  } catch (notifErr) {
    console.warn('写入邀请通知失败:', notifErr);
  }
}

function writeInviteBroadcast(userId, description, rewardAmount) {
  if (!userId || !window.supabase) return;
  try {
    if (typeof writeBroadcast === 'function') {
      writeBroadcast({
        user_id: userId,
        event_type: 'invite_reward',
        description: description,
        reward_amount: rewardAmount
      });
      return;
    }
    window.supabase.from('broadcasts').insert({
      user_id: userId,
      event_type: 'invite_reward',
      description: description,
      reward_amount: rewardAmount
    });
  } catch (broadcastErr) {
    console.warn('写入邀请广播失败:', broadcastErr);
  }
}

async function activateInviteRewards(userId) {
  if (!userId || !window.supabase) return;
  
  try {
    console.log('检查邀请激活状态，用户ID:', userId);
    
    var result = await window.supabase
      .from('invites')
      .select('*')
      .eq('invitee_id', userId)
      .eq('is_activated', false);
    
    if (result.error || !result.data || !result.data.length) {
      console.log('没有需要激活的邀请记录');
      return;
    }
    
    console.log('找到需要激活的邀请记录:', result.data.length);
    
    var settings = await fetchInviteSettings();
    var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
    var level2Reward = Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward;
    
    for (var i = 0; i < result.data.length; i++) {
      var invite = result.data[i];
      var inviterId = invite.inviter_id;
      var level = invite.level;
      var rewardAmount = level === 1 ? level1Reward : level2Reward;
      
      console.log('激活邀请记录:', invite.id, '邀请人:', inviterId, '级别:', level, '奖励:', rewardAmount);
      
      var inviterResult = await window.supabase
        .from('users')
        .select('id, crlm_balance, invite_count, username')
        .eq('id', inviterId)
        .maybeSingle();
      
      if (inviterResult.error || !inviterResult.data) {
        console.warn('获取邀请人信息失败:', inviterResult.error);
        continue;
      }
      
      var inviter = inviterResult.data;
      
      var updateResult = await window.supabase
        .from('invites')
        .update({ is_activated: true })
        .eq('id', invite.id);
      
      if (updateResult.error) {
        console.warn('更新邀请记录为已激活失败:', updateResult.error);
        continue;
      }
      
      var newBalance = (Number(inviter.crlm_balance) || 0) + rewardAmount;
      var patchPayload = { crlm_balance: newBalance };
      
      if (level === 1) {
        patchPayload.invite_count = (Number(inviter.invite_count) || 0) + 1;
      }
      
      var updateUserResult = await window.supabase
        .from('users')
        .update(patchPayload)
        .eq('id', inviter.id);
      
      if (updateUserResult.error) {
        console.warn('更新邀请人奖励失败:', updateUserResult.error);
        continue;
      }
      
      var title = level === 1 ? '你成功邀请了一位新用户，获得一级邀请奖励' : '你成功邀请的一位好友进一步扩展了邀请网络，获得二级邀请奖励';
      await writeInviteNotification(inviter.id, title, 'invite', userId);
      
      var description = level === 1 ? '你成功邀请了一位新用户，获得一级邀请奖励' : '你的二级邀请关系产生了奖励';
      writeInviteBroadcast(inviter.id, description, rewardAmount);
      
      console.log('邀请激活成功，邀请人:', inviterId, '获得奖励:', rewardAmount);
    }
  } catch (activateErr) {
    console.warn('检查并激活邀请失败:', activateErr);
  }
}

async function processInvite(newUserId) {
  console.log('邀请处理-processInvite 开始，用户ID:', newUserId);
  
  if (!newUserId || !window.supabase) {
    console.log('邀请处理-processInvite 失败：缺少用户ID或supabase');
    return false;
  }

  var inviterId = getStoredInviterId();
  console.log('邀请处理-检测到 inviter_id：', inviterId);
  
  if (!inviterId) {
    console.log('无邀请人信息，跳过邀请');
    clearStoredInviterId();
    return false;
  }

  if (String(inviterId) === String(newUserId)) {
    console.log('邀请处理-processInvite 失败：不能邀请自己');
    clearStoredInviterId();
    return false;
  }

  try {
    var existingResult = await window.supabase
      .from('invites')
      .select('id')
      .eq('invitee_id', newUserId)
      .limit(1);

    if (!existingResult.error && existingResult.data && existingResult.data.length) {
      console.log('邀请处理-用户已经有邀请关系，返回成功但不清除 inviter_id');
      return true;
    }

    var settings = await fetchInviteSettings();
    var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
    var level2Reward = Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward;

    var inviterResult = await window.supabase
      .from('users')
      .select('id, crlm_balance, invite_count, username')
      .eq('id', inviterId)
      .maybeSingle();

    if (inviterResult.error || !inviterResult.data) {
      console.log('邀请处理-邀请者信息查询失败，保留 inviter_id 以便重试');
      return false;
    }

    var inviter = inviterResult.data;
    var level1Done = await grantInviteReward(inviter, newUserId, 1, level1Reward);
    if (!level1Done) {
      console.log('邀请处理-一级奖励发放失败，保留 inviter_id 以便重试');
      return false;
    }

    var parentResult = await window.supabase
      .from('invites')
      .select('inviter_id')
      .eq('invitee_id', inviter.id)
      .eq('level', 1)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!parentResult.error && parentResult.data && parentResult.data.inviter_id) {
      var parentInviterId = parentResult.data.inviter_id;
      if (parentInviterId && String(parentInviterId) !== String(newUserId)) {
        var parentUserResult = await window.supabase
          .from('users')
          .select('id, crlm_balance, invite_count, username')
          .eq('id', parentInviterId)
          .maybeSingle();

        if (!parentUserResult.error && parentUserResult.data) {
          var parentInviter = parentUserResult.data;
          var level2Done = await grantInviteReward(parentInviter, newUserId, 2, level2Reward);
        }
      }
    }

    console.log('邀请处理-成功完成，清除 localStorage 中的 inviter_id');
    clearStoredInviterId();
    if (typeof window.coinrealmRefreshInvitePageData === 'function') {
      window.coinrealmRefreshInvitePageData();
    }
    return true;
  } catch (inviteErr) {
    console.warn('处理邀请关系失败，保留 inviter_id 以便重试:', inviteErr);
    return false;
  }
}

async function processPendingInviteRegistration() {
  console.log('邀请处理-processPendingInviteRegistration 开始');
  
  if (!window.supabase) {
    console.log('邀请处理-processPendingInviteRegistration 失败：没有 supabase');
    clearStoredInviterId();
    return;
  }

  var inviterId = getStoredInviterId();
  console.log('邀请处理-processPendingInviteRegistration 检测到 inviter_id：', inviterId);
  
  if (!inviterId) {
    console.log('无邀请人信息，跳过邀请');
    clearStoredInviterId();
    return;
  }

  var userId;
  if (typeof window.coinrealmGetCurrentUserId === 'function') {
    userId = await window.coinrealmGetCurrentUserId();
  } else if (typeof getCurrentUserId === 'function') {
    userId = await getCurrentUserId();
  }
  console.log('邀请处理-processPendingInviteRegistration 当前用户ID：', userId);
  
  if (!userId) {
    console.log('邀请处理-processPendingInviteRegistry 失败：没有找到当前用户ID');
    clearStoredInviterId();
    return;
  }

  try {
    var existingResult = await window.supabase
      .from('invites')
      .select('id')
      .eq('invitee_id', userId)
      .limit(1);

    if (!existingResult.error && existingResult.data && existingResult.data.length) {
      console.log('邀请处理-processPendingInviteRegistry：用户已经有邀请关系');
      clearStoredInviterId();
      return;
    }

    var inviter = await findInviterByRef(inviterId);
    console.log('邀请处理-processPendingInviteRegistry 找到邀请者：', inviter);
    
    if (!inviter || inviter.id === userId) {
      console.log('邀请处理-processPendingInviteRegistry：邀请者无效或不能邀请自己');
      clearStoredInviterId();
      return;
    }

    console.log('邀请处理-processPendingInviteRegistry 开始调用 processInvite');
    await processInvite(userId);
    console.log('邀请处理-processPendingInviteRegistry processInvite 完成');
    clearStoredInviterId();
  } catch (pendingErr) {
    console.warn('处理待处理邀请失败:', pendingErr);
    clearStoredInviterId();
  }
}

window.coinrealmCaptureInviteRef = captureInviteRefFromUrl;
window.coinrealmProcessInvite = processInvite;
window.coinrealmProcessPendingInvite = processPendingInviteRegistration;
window.coinrealmActivateInviteRewards = activateInviteRewards;
window.coinrealmFetchInviteSettings = fetchInviteSettings;
window.coinrealmInviteSettingsDefaults = INVITE_SETTINGS_DEFAULTS;