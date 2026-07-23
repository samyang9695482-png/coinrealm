/* 邀请逻辑模块 - 独立于 app.js */
/* ========================================================================
   🔍 RLS 策略说明（必须配置，否则邀请功能无法正常工作）

   invites 表需要允许读取“上级的邀请关系”，以便在发放二级奖励时追溯邀请人的上级。
   仅靠 invites_select_invitee / invites_select_inviter 两条策略无法满足追溯需求
   （当前用户无法查询他人 invitee_id 的记录）。请在 Supabase SQL Editor 执行：

   -- 1. 查看现有策略
   SELECT * FROM pg_policies WHERE tablename = 'invites';

   -- 2. 放开 invites 表的读取（邀请关系不敏感，允许所有认证用户读取）
   CREATE POLICY IF NOT EXISTS "invites_select_all" ON invites
     FOR SELECT TO authenticated USING (true);

   -- 3. 允许被邀请人更新自己收到的邀请（用于激活奖励、标记 is_effective）
   CREATE POLICY IF NOT EXISTS "invites_update_invitee" ON invites
     FOR UPDATE TO authenticated USING (invitee_id = auth.uid()) WITH CHECK (invitee_id = auth.uid());

   -- 4. 允许邀请人更新自己发出的邀请（管理员审核流程会更新 inviter 侧记录）
   CREATE POLICY IF NOT EXISTS "invites_update_inviter" ON invites
     FOR UPDATE TO authenticated USING (inviter_id = auth.uid()) WITH CHECK (inviter_id = auth.uid());

   -- 5. 允许认证用户插入邀请记录
   CREATE POLICY IF NOT EXISTS "invites_insert_authenticated" ON invites
     FOR INSERT TO authenticated WITH CHECK (true);

   -- 6. users 表余额更新（发放奖励时需更新邀请人余额）
   CREATE POLICY IF NOT EXISTS "users_update_balance" ON users
     FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

   -- 7. deposit_records 表写入（记录奖励明细）
   CREATE POLICY IF NOT EXISTS "deposit_records_insert_authenticated" ON deposit_records
     FOR INSERT TO authenticated WITH CHECK (true);
   CREATE POLICY IF NOT EXISTS "deposit_records_select_owner" ON deposit_records
     FOR SELECT TO authenticated USING (user_id = auth.uid());
   ======================================================================== */

/* ========================================================================
   模块说明
   - processInvite(newUserId)：注册时建立邀请关系（仅插入 level=1 记录，不发奖）
   - activateInviteRewards(userId, options)：任务审核通过后激活奖励
       · 为邀请人发放一级奖励
       · 追溯邀请人的上级，为其发放二级奖励
   - 所有奖励发放前都通过 deposit_records(user_id + related_id + type) 精确防重复
   ======================================================================== */

var INVITE_SETTINGS_DEFAULTS = {
  invite_level1_reward: 500,  // 一级奖励默认金额
  invite_level2_reward: 50    // 二级奖励默认金额
};
var cachedInviteSettings = null;

// 读取邀请奖励配置（带缓存，管理员保存设置后由 invalidateInviteSettingsCache 清空）
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

    console.log('[InviteSettings] 查询结果：', result);

    if (!result.error && result.data) {
      result.data.forEach(function (row) {
        if (row.key && row.value != null && row.value !== '') {
          settings[row.key] = Number(row.value);
        }
      });
      console.log('[InviteSettings] 解析后：', settings);
    } else if (result.error) {
      console.error('[InviteSettings] 查询失败：', result.error);
    }
  } catch (settingsErr) {
    console.warn('[InviteSettings] 读取失败:', settingsErr);
  }

  cachedInviteSettings = settings;
  return settings;
}

// 清空邀请奖励设置缓存（管理员保存设置后由 app.js 调用）
function invalidateInviteSettingsCache() {
  cachedInviteSettings = null;
}

// 根据 ref 查找邀请人（精确匹配优先，ref 较长时尝试前缀匹配）
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
    console.warn('[Invite] 查找邀请人失败:', lookupErr);
  }

  return null;
}

// 从 URL（search 和 hash）中捕获 ref 参数并存入 localStorage
function captureInviteRefFromUrl() {
  try {
    var ref = null;

    // 1. 检查 search 部分 (?ref=xxx)
    var params = new URLSearchParams(window.location.search);
    ref = params.get('ref');

    // 2. 检查 hash 部分 (#route?ref=xxx)
    if (!ref) {
      var hash = window.location.hash || '';
      var qIdx = hash.indexOf('?');
      if (qIdx >= 0) {
        var hashParams = new URLSearchParams(hash.slice(qIdx + 1));
        ref = hashParams.get('ref');
      }
    }

    console.log('[DIAG] 步骤1：URL 参数捕获 - ref =', ref);
    if (ref) {
      var inviterId = String(ref).trim();
      localStorage.setItem('inviter_id', inviterId);
      localStorage.setItem('coinrealm_invite_ref', inviterId);
      console.log('[DIAG] 步骤2：localStorage 存储 - inviter_id =', localStorage.getItem('inviter_id'));
    } else {
      console.log('[DIAG] 步骤2：localStorage 存储 - 跳过（URL 无 ref）');
    }
  } catch (captureErr) {
    console.warn('[DIAG] 步骤1/2：捕获邀请 ref 失败:', captureErr);
  }
}
captureInviteRefFromUrl();

// 钱包登录成功后兜底重新捕获 URL 中的 ref 参数
window.coinrealmCaptureInviteRef = captureInviteRefFromUrl;

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
      console.log('[DIAG] getStoredInviterId - inviter_id =', inviterId);
      return String(inviterId).trim();
    }
  } catch (storageErr) {
    console.warn('[DIAG] getStoredInviterId - 读取失败:', storageErr);
  }

  try {
    var fallback = localStorage.getItem('coinrealm_invite_ref');
    if (fallback) {
      console.log('[DIAG] getStoredInviterId - coinrealm_invite_ref =', fallback);
      return String(fallback).trim();
    }
  } catch (fallbackErr) {
    console.warn('[DIAG] getStoredInviterId - 备用键读取失败:', fallbackErr);
  }

  console.log('[DIAG] getStoredInviterId - 未找到邀请信息，返回空字符串');
  return '';
}

function clearStoredInviterId() {
  console.log('[DIAG] clearStoredInviterId - 清除前 inviter_id =', localStorage.getItem('inviter_id'));
  try {
    localStorage.removeItem('inviter_id');
    localStorage.removeItem('coinrealm_invite_ref');
    console.log('[DIAG] clearStoredInviterId - 清除后 inviter_id =', localStorage.getItem('inviter_id'));
  } catch (storageErr) {
    console.warn('[DIAG] clearStoredInviterId - 清除失败:', storageErr);
  }
}

// 在 invites 表插入邀请记录（注册时建立邀请关系，不发奖）
// inviter：邀请人 users 记录；inviteeId：被邀请人ID；level：1 或 2；amount：奖励金额
async function grantInviteReward(inviter, inviteeId, level, amount) {
  console.log('[DIAG] grantInviteReward 开始', {
    inviterId: inviter && inviter.id,
    inviteeId: inviteeId,
    level: level,
    amount: amount,
    supabaseReady: !!window.supabase
  });

  // 检查：用户不能邀请自己
  if (inviter && inviter.id && String(inviter.id) === String(inviteeId)) {
    console.warn('[Invite] 跳过：用户不能邀请自己 | inviterId =', inviter.id, '| inviteeId =', inviteeId);
    return false;
  }

  if (!inviter || !inviteeId || amount <= 0 || !window.supabase) {
    console.log('[DIAG] grantInviteReward 跳过 - 参数不足');
    return false;
  }

  try {
    var insertPayload = {
      inviter_id: inviter.id,
      invitee_id: inviteeId,
      level: level,
      reward_amount: amount,
      is_activated: false,
      is_effective: false,
      created_at: new Date().toISOString()
    };
    console.log('[DIAG] grantInviteReward - INSERT invites，payload =', insertPayload);

    var insertResult = await window.supabase.from('invites').insert(insertPayload);

    console.log('[DIAG] grantInviteReward - 写入结果：', insertResult.error ? '失败' : '成功', insertResult.error || insertResult.data);

    if (insertResult.error) {
      var errMsg = String(insertResult.error.message || insertResult.error.details || '').toLowerCase();
      var errCode = insertResult.error.code || '';

      // 主键/唯一约束冲突 → 记录已存在，视为成功
      if (errCode === '23505' || errMsg.indexOf('duplicate') !== -1 || errMsg.indexOf('conflict') !== -1) {
        console.log('[DIAG] grantInviteReward - 邀请记录已存在（冲突），视为成功');
        return true;
      }

      if (errMsg.indexOf('column') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('[Invite] invites 表字段缺失，请执行 SQL：ALTER TABLE invites ADD COLUMN IF NOT EXISTS reward_amount NUMERIC DEFAULT 0; ALTER TABLE invites ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE; ALTER TABLE invites ADD COLUMN IF NOT EXISTS is_effective BOOLEAN DEFAULT FALSE; ALTER TABLE invites ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();');
      }
      return false;
    }

    console.log('[DIAG] grantInviteReward - 邀请记录已创建（is_activated=false, is_effective=false）');
    return true;
  } catch (grantErr) {
    console.warn('[DIAG] grantInviteReward 异常:', grantErr);
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
    console.warn('[Invite] 写入通知失败:', notifErr);
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
    console.warn('[Invite] 写入广播失败:', broadcastErr);
  }
}

// 记录邀请奖励交易明细到 deposit_records 表
// params: { userId, amount, level, inviteId, inviteeId, inviterUsername, triggerSource }
async function recordInviteRewardTransaction(params) {
  if (!window.supabase || !params.userId || !params.amount) return false;

  var levelLabel = params.level === 1 ? '一级' : '二级';
  var description = levelLabel + '邀请奖励（用户' + (params.inviterUsername || params.inviteeId) + '完成任务）';

  var payload = {
    user_id: params.userId,
    amount: params.amount,
    type: 'invite_reward',
    description: description,
    related_id: params.inviteId || null,
    trigger_source: params.triggerSource || 'review_approve',
    created_at: new Date().toISOString()
  };

  try {
    var result = await window.supabase.from('deposit_records').insert(payload);

    if (result.error) {
      var errMsg = String(result.error.message || '').toLowerCase();

      if (errMsg.indexOf('column') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('[InviteReward] deposit_records 字段缺失，请执行 SQL：');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS type TEXT DEFAULT \'invite_reward\';');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS description TEXT;');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS related_id UUID;');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS trigger_source TEXT;');
      }

      if (errMsg.indexOf('relation') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('[InviteReward] deposit_records 表不存在，请创建该表');
      }

      console.warn('[InviteReward] deposit_records 插入失败:', result.error);
      return false;
    }

    return true;
  } catch (recordErr) {
    console.warn('[InviteReward] deposit_records 插入异常:', recordErr);
    return false;
  }
}

// 防重复检查：deposit_records(user_id + related_id + type='invite_reward')
// 这是判断奖励是否已发放的最可靠依据
async function isInviteRewardAlreadyGranted(userId, inviteId) {
  if (!userId || !inviteId || !window.supabase) return { ok: false, granted: false };

  try {
    var result = await window.supabase
      .from('deposit_records')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'invite_reward')
      .eq('related_id', inviteId)
      .maybeSingle();

    if (result.error) {
      console.error('[InviteDupCheck] 防重复检查失败:', result.error);
      return { ok: false, granted: false, error: result.error };
    }
    return { ok: true, granted: !!result.data };
  } catch (err) {
    console.error('[InviteDupCheck] 防重复检查异常:', err);
    return { ok: false, granted: false, error: err };
  }
}

// 激活邀请奖励：任务审核通过后调用
// userId：完成任务并被审核通过的用户
// options.skipPermissionCheck：管理员审核通过时传 true 跳过权限校验
async function activateInviteRewards(userId, options) {
  if (!userId || !window.supabase) {
    console.log('[ActivateInvite] 跳过 - 缺少 userId 或 supabase');
    return;
  }

  options = options || {};
  var skipPermissionCheck = options.skipPermissionCheck === true;
  var triggerSource = options.triggerSource || 'review_approve';

  // ★ 权限校验：只能激活自己的邀请记录（审核通过时由管理员调用，可跳过校验）
  if (!skipPermissionCheck) {
    var currentUserId = null;
    if (typeof window.coinrealmGetCurrentUserId === 'function') {
      currentUserId = await window.coinrealmGetCurrentUserId();
    } else if (typeof getCurrentUserId === 'function') {
      currentUserId = await getCurrentUserId();
    }

    if (!currentUserId || String(currentUserId) !== String(userId)) {
      console.error('[ActivateInvite] 权限拒绝：当前用户只能激活自己的邀请记录 | currentUserId=', currentUserId, '| targetUserId=', userId);
      return;
    }
  }

  try {
    console.log('[ActivateInvite] ====== 开始激活检查 ======');
    console.log('[ActivateInvite] userId =', userId, '| skipPermissionCheck =', skipPermissionCheck);

    // 步骤1：检查用户是否有已审核通过的提交（只有完成任务才激活邀请奖励）
    var approvedResult = await window.supabase
      .from('submissions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .limit(1);

    console.log('[ActivateInvite] 步骤1：已通过提交查询 =', approvedResult.error ? '失败' : ('找到 ' + (approvedResult.data ? approvedResult.data.length : 0) + ' 条'));

    if (approvedResult.error) {
      console.warn('[ActivateInvite] 查询已通过提交失败:', approvedResult.error);
      return;
    }

    if (!approvedResult.data || !approvedResult.data.length) {
      console.log('[ActivateInvite] 用户还没有已审核通过的提交，跳过激活');
      return;
    }

    // 步骤2：查询该用户的所有邀请记录（不限制 is_activated，以便补救未发奖的记录）
    var result = await window.supabase
      .from('invites')
      .select('*')
      .eq('invitee_id', userId);

    console.log('[ActivateInvite] 步骤2：邀请记录查询 =', result.error ? '失败' : ('找到 ' + (result.data ? result.data.length : 0) + ' 条'));

    if (result.error) {
      console.warn('[ActivateInvite] ❌ 查询邀请记录失败！这很可能是 RLS 策略问题！');
      console.warn('[ActivateInvite] 错误详情:', result.error);
      console.warn('[ActivateInvite] 请执行：CREATE POLICY IF NOT EXISTS "invites_select_all" ON invites FOR SELECT TO authenticated USING (true);');
      return;
    }

    if (!result.data || !result.data.length) {
      console.log('[ActivateInvite] 没有邀请记录');
      return;
    }

    console.log('[ActivateInvite] 步骤3：找到', result.data.length, '条邀请记录，开始逐条处理');

    var settings = await fetchInviteSettings();
    var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
    var level2Reward = Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward;

    console.log('[ActivateInvite] 奖励配置：一级 =', level1Reward, '二级 =', level2Reward);

    var successCount = 0;
    var skipCount = 0;

    for (var i = 0; i < result.data.length; i++) {
      var invite = result.data[i];
      var inviterId = invite.inviter_id;
      var level = invite.level;
      var rewardAmount = level === 1 ? level1Reward : level2Reward;
      var levelLabel = level === 1 ? '一级' : '二级';

      console.log('[ActivateInvite] --- 处理第 ' + (i + 1) + '/' + result.data.length + ' 条：id=' + invite.id + ' ' + levelLabel + ' 邀请人=' + inviterId + ' 已激活=' + invite.is_activated + ' ---');

      if (!inviterId) {
        console.warn('[ActivateInvite] 跳过 - 缺少 inviter_id');
        continue;
      }

      // ★ 防重复检查（最重要）：deposit_records(user_id + related_id + type)
      var dupCheck = await isInviteRewardAlreadyGranted(inviterId, invite.id);

      if (!dupCheck.ok) {
        console.error('[ActivateInvite] 防重复检查失败，跳过该条以防重复发放');
        continue;
      }

      if (dupCheck.granted) {
        console.log('[ActivateInvite] 跳过 - deposit_records 已有记录（奖励已发放过）');
        // 确保 is_activated 标记为 true（保持数据一致性）
        if (!invite.is_activated) {
          await window.supabase
            .from('invites')
            .update({ is_activated: true, is_effective: level === 1 ? true : invite.is_effective })
            .eq('id', invite.id);
        }
        skipCount++;
        continue;
      }

      // 获取邀请人信息（用于更新余额）
      var inviterResult = await window.supabase
        .from('users')
        .select('id, crlm_balance, invite_count, username')
        .eq('id', inviterId)
        .maybeSingle();

      if (inviterResult.error || !inviterResult.data) {
        console.warn('[ActivateInvite] 获取邀请人信息失败:', inviterResult.error);
        continue;
      }

      var inviter = inviterResult.data;
      console.log('[ActivateInvite] 邀请人信息：username=' + inviter.username + ' 当前余额=' + inviter.crlm_balance);

      // 获取被邀请人信息（用于通知文案）
      var inviteeResult = await window.supabase
        .from('users')
        .select('id, username')
        .eq('id', userId)
        .maybeSingle();

      var inviteeUsername = (inviteeResult.data && inviteeResult.data.username) ? inviteeResult.data.username : '未知用户';
      console.log('[ActivateInvite] 被邀请人信息：username=' + inviteeUsername);

      // ★ 关键顺序：先发奖励（更新余额 + 记录明细），成功后再标记 is_activated/is_effective
      // 这样如果余额更新失败，is_activated 仍为 false，下次可以重试
      var newBalance = (Number(inviter.crlm_balance) || 0) + rewardAmount;
      var patchPayload = { crlm_balance: newBalance };

      // 一级奖励发放时，邀请人的 invite_count +1
      if (level === 1) {
        patchPayload.invite_count = (Number(inviter.invite_count) || 0) + 1;
      }

      console.log('[ActivateInvite] 更新邀请人余额：' + inviter.crlm_balance + ' + ' + rewardAmount + ' = ' + newBalance);

      var updateUserResult = await window.supabase
        .from('users')
        .update(patchPayload)
        .eq('id', inviter.id);

      if (updateUserResult.error) {
        console.warn('[ActivateInvite] ❌ 更新邀请人余额失败！', updateUserResult.error);
        console.warn('[ActivateInvite] 这很可能是 users 表 RLS 策略阻止了更新他人余额');
        console.warn('[ActivateInvite] 请执行：CREATE POLICY IF NOT EXISTS "users_update_balance" ON users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);');
        // 不标记 is_activated，下次重试
        continue;
      }

      console.log('[ActivateInvite] ✅ 邀请人余额已更新 +' + rewardAmount + ' CRLM');

      // 记录交易明细到 deposit_records（防重复的关键依据）
      var recordResult = await recordInviteRewardTransaction({
        userId: inviter.id,
        amount: rewardAmount,
        level: level,
        inviteId: invite.id,
        inviteeId: userId,
        inviterUsername: inviter.username,
        triggerSource: triggerSource
      });

      if (recordResult) {
        console.log('[ActivateInvite] ✅ 交易明细已记录到 deposit_records');
      } else {
        console.warn('[ActivateInvite] ⚠️ 交易明细记录失败（余额已更新，但明细未记录，需人工核对）');
      }

      // 标记 invites 记录：is_activated = true；一级奖励同时标记 is_effective = true
      var invitePatch = { is_activated: true };
      if (level === 1) {
        invitePatch.is_effective = true;
      }

      var updateInviteResult = await window.supabase
        .from('invites')
        .update(invitePatch)
        .eq('id', invite.id);

      if (updateInviteResult.error) {
        console.warn('[ActivateInvite] ⚠️ 邀请记录状态更新失败:', updateInviteResult.error);
      } else {
        console.log('[ActivateInvite] ✅ invites 记录已标记 is_activated=true' + (level === 1 ? ', is_effective=true' : ''));
      }

      // 发送通知
      var notifTitle = '恭喜你获得' + levelLabel + '邀请奖励 +' + rewardAmount + ' CRLM（用户' + inviteeUsername + '完成任务）';
      await writeInviteNotification(inviter.id, notifTitle, 'invite', userId);

      var description = level === 1 ? '你成功邀请了一位新用户，获得一级邀请奖励' : '你的二级邀请关系产生了奖励';
      writeInviteBroadcast(inviter.id, description, rewardAmount);

      successCount++;
      console.log('[ActivateInvite] ✅ 第', i + 1, '条' + levelLabel + '奖励发放成功');

      // ★ 一级奖励发放成功后，追溯邀请人的上级，发放二级奖励
      if (level === 1) {
        console.log('[ActivateInvite] --- 追溯邀请人的上级，检查是否有二级奖励 ---');
        try {
          await grantLevel2Reward({
            grandParentId: null,           // 待查询确定
            inviterId: inviterId,           // 一级邀请人（其上级将获得二级奖励）
            inviteeUserId: userId,          // 完成任务的用户
            level2Reward: level2Reward,
            skipPermissionCheck: skipPermissionCheck,
            triggerSource: triggerSource
          });
        } catch (parentErr) {
          console.warn('[ActivateInvite] 追溯上级异常:', parentErr);
        }
      }
    }

    console.log('[ActivateInvite] ====== 全部完成：成功 ' + successCount + ' / 跳过 ' + skipCount + ' / 共 ' + result.data.length + ' 条 ======');
  } catch (activateErr) {
    console.warn('[ActivateInvite] 异常:', activateErr);
  }
}

// 发放二级奖励（追溯上级方式）
// 一级奖励发放后，查询“一级邀请人”的上级（即被邀请人的二级邀请人），为其发放二级奖励。
// params: { grandParentId, inviterId, inviteeUserId, level2Reward, existingInviteId, skipPermissionCheck, triggerSource }
async function grantLevel2Reward(params) {
  var inviterId = params.inviterId;            // 一级邀请人 B（其上级 A 将获得二级奖励）
  var inviteeUserId = params.inviteeUserId;    // 完成任务的用户 C
  var level2Reward = params.level2Reward;
  var existingInviteId = params.existingInviteId || null;
  var skipPermissionCheck = params.skipPermissionCheck === true;
  var triggerSource = params.triggerSource || 'review_approve';

  if (!inviterId || !inviteeUserId || !window.supabase || level2Reward <= 0) {
    console.log('[Level2Reward] 跳过 - 参数不足');
    return false;
  }

  // ★ 权限校验：审核通过流程由管理员调用，可跳过校验
  if (!skipPermissionCheck) {
    var currentUserId = null;
    if (typeof window.coinrealmGetCurrentUserId === 'function') {
      currentUserId = await window.coinrealmGetCurrentUserId();
    } else if (typeof getCurrentUserId === 'function') {
      currentUserId = await getCurrentUserId();
    }

    // 二级奖励的接收人是上级（A），普通用户无权为他人发奖，必须跳过校验或为本人
    if (!currentUserId || (String(currentUserId) !== String(inviterId) && String(currentUserId) !== String(inviteeUserId))) {
      console.error('[Level2Reward] 权限拒绝：currentUserId=', currentUserId, '| inviterId=', inviterId, '| inviteeUserId=', inviteeUserId);
      return false;
    }
  }

  try {
    console.log('[Level2Reward] 开始：一级邀请人=' + inviterId + ' 完成任务用户=' + inviteeUserId + ' 二级奖励=' + level2Reward);

    // ★ 关键步骤：查询一级邀请人（B）的上级（A），即 invites 表中 invitee_id = inviterId 且 level = 1
    // 注意：此查询需要 invites_select_all 策略支持，否则无法读取他人的邀请关系
    var grandParentId = params.grandParentId || null;

    if (!grandParentId) {
      console.log('[Level2Reward] 查询一级邀请人的上级（invitee_id = ' + inviterId + ', level = 1）');
      var parentInviteResult = await window.supabase
        .from('invites')
        .select('id, inviter_id, is_activated')
        .eq('invitee_id', inviterId)
        .eq('level', 1)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (parentInviteResult.error) {
        console.warn('[Level2Reward] 查询上级失败（可能是 RLS 限制）：', parentInviteResult.error);
        console.warn('[Level2Reward] 请执行：CREATE POLICY IF NOT EXISTS "invites_select_all" ON invites FOR SELECT TO authenticated USING (true);');
        return false;
      }

      if (!parentInviteResult.data || !parentInviteResult.data.inviter_id) {
        console.log('[Level2Reward] 一级邀请人没有上级，无二级奖励');
        return false;
      }

      grandParentId = parentInviteResult.data.inviter_id;
      console.log('[Level2Reward] 找到上级（grandParent）：', grandParentId);
    }

    // 防自邀：上级不能是被邀请人自己
    if (String(grandParentId) === String(inviteeUserId)) {
      console.warn('[Level2Reward] 跳过：上级与被邀请人相同（数据异常）');
      return false;
    }

    // 查找或创建 level=2 的邀请记录（inviter=grandParent, invitee=inviteeUserId）
    // ★ 先查询是否已存在记录（只用 invitee_id + inviter_id 组合，RLS 允许）
    var inviteId = existingInviteId;

    if (!inviteId) {
      console.log('[Level2Reward] 查询 level=2 邀请记录（inviter=' + grandParentId + ', invitee=' + inviteeUserId + '）');
      var existResult = await window.supabase
        .from('invites')
        .select('id, is_activated')
        .eq('inviter_id', grandParentId)
        .eq('invitee_id', inviteeUserId)
        .eq('level', 2)
        .maybeSingle();

      if (!existResult.error && existResult.data) {
        inviteId = existResult.data.id;
        console.log('[Level2Reward] level=2 邀请记录已存在，id=' + inviteId + ' is_activated=' + existResult.data.is_activated);
      } else if (existResult.error) {
        console.warn('[Level2Reward] 查询 level=2 记录失败：', existResult.error);
      } else {
        console.log('[Level2Reward] level=2 邀请记录不存在，需要创建');
      }
    }

    // 如果仍然没有邀请记录ID，执行 INSERT（前置查询已避免大部分冲突）
    if (!inviteId) {
      console.log('[Level2Reward] 执行 INSERT 创建 level=2 邀请记录');
      var insertResult = await window.supabase
        .from('invites')
        .insert({
          inviter_id: grandParentId,
          invitee_id: inviteeUserId,
          level: 2,
          reward_amount: level2Reward,
          is_activated: false,
          is_effective: false,
          created_at: new Date().toISOString()
        })
        .select('id')
        .maybeSingle();

      if (insertResult.error) {
        var errMsg = String(insertResult.error.message || '').toLowerCase();
        var errCode = insertResult.error.code || '';

        if (errCode === '23505' || errMsg.indexOf('duplicate') !== -1 || errMsg.indexOf('conflict') !== -1) {
          // 冲突说明记录已被其他请求创建，重新查询获取 id
          console.warn('[Level2Reward] INSERT 冲突，重新查询获取记录 id');
          var retryResult = await window.supabase
            .from('invites')
            .select('id, is_activated')
            .eq('inviter_id', grandParentId)
            .eq('invitee_id', inviteeUserId)
            .eq('level', 2)
            .maybeSingle();

          if (!retryResult.error && retryResult.data) {
            inviteId = retryResult.data.id;
            console.log('[Level2Reward] 重新查询成功，id=' + inviteId);
          } else {
            console.warn('[Level2Reward] 冲突后查询失败，跳过（避免重复发放）');
            return false;
          }
        } else {
          console.warn('[Level2Reward] 创建 invites 记录失败:', insertResult.error);
          return false;
        }
      } else if (insertResult.data) {
        inviteId = insertResult.data.id;
        console.log('[Level2Reward] 创建 invites 记录成功，id=' + inviteId);
      }
    }

    if (!inviteId) {
      console.warn('[Level2Reward] 无法获取邀请记录ID，跳过');
      return false;
    }

    // ★ 防重复检查（最重要）：deposit_records(user_id + related_id + type)
    var dupCheck = await isInviteRewardAlreadyGranted(grandParentId, inviteId);

    if (!dupCheck.ok) {
      console.error('[Level2Reward] 防重复检查失败，停止发放');
      return false;
    }

    if (dupCheck.granted) {
      console.log('[Level2Reward] 跳过 - deposit_records 已有记录（奖励已发放过）');
      // 确保 is_activated 标记为 true（保持数据一致性）
      await window.supabase.from('invites').update({ is_activated: true }).eq('id', inviteId);
      return false;
    }

    // 获取上级用户信息（用于更新余额）
    var gpResult = await window.supabase
      .from('users')
      .select('id, username, crlm_balance')
      .eq('id', grandParentId)
      .maybeSingle();

    if (gpResult.error || !gpResult.data) {
      console.warn('[Level2Reward] 获取上级用户信息失败:', gpResult.error);
      return false;
    }

    var grandParent = gpResult.data;
    console.log('[Level2Reward] 上级用户：username=' + grandParent.username + ' 当前余额=' + grandParent.crlm_balance);

    // 发奖励（更新余额）
    var newBalance = (Number(grandParent.crlm_balance) || 0) + Number(level2Reward);
    var updateBalanceResult = await window.supabase
      .from('users')
      .update({ crlm_balance: newBalance })
      .eq('id', grandParentId);

    if (updateBalanceResult.error) {
      console.warn('[Level2Reward] ❌ 更新上级余额失败：', updateBalanceResult.error);
      return false;
    }

    console.log('[Level2Reward] ✅ 上级余额已更新 +' + level2Reward + ' CRLM');

    // 记录交易明细
    var recordOk = await recordInviteRewardTransaction({
      userId: grandParentId,
      amount: level2Reward,
      level: 2,
      inviteId: inviteId,
      inviteeId: inviteeUserId,
      inviterUsername: grandParent.username,
      triggerSource: triggerSource
    });

    if (recordOk) {
      console.log('[Level2Reward] ✅ 交易明细已记录');
    } else {
      console.warn('[Level2Reward] ⚠️ 交易明细记录失败（余额已更新，需人工核对）');
    }

    // 标记 is_activated = true
    var updateInviteResult = await window.supabase
      .from('invites')
      .update({ is_activated: true })
      .eq('id', inviteId);

    if (updateInviteResult.error) {
      console.warn('[Level2Reward] ⚠️ is_activated 标记失败:', updateInviteResult.error);
    } else {
      console.log('[Level2Reward] ✅ is_activated 已标记为 true');
    }

    // 发送通知
    var notifTitle = '恭喜你获得二级邀请奖励 +' + level2Reward + ' CRLM（你的好友的好友完成任务）';
    await writeInviteNotification(grandParentId, notifTitle, 'invite', inviteeUserId);
    console.log('[Level2Reward] ✅ 通知已发送');

    // 广播
    writeInviteBroadcast(grandParentId, '你的二级邀请关系产生了奖励', level2Reward);

    console.log('[Level2Reward] ✅ 二级奖励发放完成');
    return true;
  } catch (level2Err) {
    console.warn('[Level2Reward] 异常:', level2Err);
    return false;
  }
}

// 处理邀请关系建立：注册时调用
// 仅插入 level=1 邀请记录（is_activated=false, is_effective=false），不发放任何奖励。
// 奖励在 activateInviteRewards（任务审核通过）时发放。
async function processInvite(newUserId) {
  console.log('[DIAG] 步骤4：processInvite 开始，newUserId =', newUserId);

  if (!newUserId || !window.supabase) {
    console.log('[DIAG] 步骤4：processInvite 失败 - 缺少用户ID或supabase，保留 inviter_id 以便重试');
    return false;
  }

  var inviterId = getStoredInviterId();
  console.log('[DIAG] 步骤4：processInvite - 读取到 inviterId =', inviterId);

  if (!inviterId) {
    console.log('[DIAG] 步骤4：processInvite 跳过 - 无邀请人信息（inviter_id 为空）');
    return false;
  }

  // 检查：用户不能邀请自己
  if (String(inviterId) === String(newUserId)) {
    console.warn('[Invite] 跳过：用户不能邀请自己 | inviterId =', inviterId, '| inviteeId =', newUserId);
    clearStoredInviterId();
    return false;
  }

  try {
    // 检查是否已有邀请记录（防重复建立）
    console.log('[DIAG] 步骤4：processInvite - 检查是否已有邀请记录（invitee_id = ' + newUserId + '）');
    var existingResult = await window.supabase
      .from('invites')
      .select('id')
      .eq('invitee_id', newUserId)
      .limit(1);

    console.log('[DIAG] 步骤4：processInvite - 已有邀请记录查询结果 =', existingResult.error ? '查询失败' : existingResult.data);

    if (!existingResult.error && existingResult.data && existingResult.data.length) {
      console.log('[DIAG] 步骤4：processInvite - 用户已有邀请关系，清除 inviter_id 并跳过');
      clearStoredInviterId();
      return true;
    }

    // 读取奖励配置
    var settings = await fetchInviteSettings();
    var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
    console.log('[DIAG] 步骤4：processInvite - 奖励配置 level1 =', level1Reward);

    // 查询邀请人信息
    console.log('[DIAG] 步骤4：processInvite - 查询邀请人信息（inviterId = ' + inviterId + '）');
    var inviterResult = await window.supabase
      .from('users')
      .select('id, crlm_balance, invite_count, username')
      .eq('id', inviterId)
      .maybeSingle();

    console.log('[DIAG] 步骤4：processInvite - 邀请人查询结果 =', inviterResult.error ? '失败' : inviterResult.data);

    if (inviterResult.error || !inviterResult.data) {
      console.log('[DIAG] 步骤4：processInvite 失败 - 邀请者信息查询失败，保留 inviter_id 以便重试');
      return false;
    }

    var inviter = inviterResult.data;

    // ★ 仅插入 level=1 邀请记录（不发奖）。二级奖励在 activateInviteRewards 中处理。
    console.log('[DIAG] 步骤4：processInvite - 建立 level=1 邀请关系');
    var level1Done = await grantInviteReward(inviter, newUserId, 1, level1Reward);
    console.log('[DIAG] 步骤4：processInvite - 邀请关系建立结果 =', level1Done);

    if (!level1Done) {
      console.log('[DIAG] 步骤4：processInvite 失败 - 邀请记录建立失败，保留 inviter_id');
      return false;
    }

    // 邀请关系建立后，通知邀请人
    console.log('[DIAG] 步骤4：processInvite - 发送邀请成功通知给邀请人:', inviter.id);
    await writeInviteNotification(inviter.id, '你邀请的新用户已注册，待其完成任务后你将获得邀请奖励', 'invite', newUserId);

    // 邀请关系建立成功，清除 inviter_id
    console.log('[DIAG] 步骤4：processInvite - 成功完成，清除 inviter_id');
    clearStoredInviterId();

    if (typeof window.coinrealmRefreshInvitePageData === 'function') {
      window.coinrealmRefreshInvitePageData();
    }
    return true;
  } catch (inviteErr) {
    console.warn('[DIAG] 步骤4：processInvite 异常 - 保留 inviter_id:', inviteErr);
    return false;
  }
}

// 处理待处理邀请：登录后/页面加载时调用，读取 localStorage 中的 inviter_id 并尝试建立邀请关系
async function processPendingInviteRegistration() {
  console.log('[DIAG] 步骤4：processPendingInviteRegistration 开始');

  if (!window.supabase) {
    console.log('[DIAG] 步骤4：processPendingInviteRegistration 失败 - 没有 supabase，保留 inviter_id 以便重试');
    return;
  }

  var inviterId = getStoredInviterId();
  console.log('[DIAG] 步骤4：processPendingInviteRegistration - inviter_id =', inviterId);

  if (!inviterId) {
    console.log('[DIAG] 步骤4：processPendingInviteRegistration 跳过 - 无邀请人信息');
    return;
  }

  var userId;
  if (typeof window.coinrealmGetCurrentUserId === 'function') {
    userId = await window.coinrealmGetCurrentUserId();
  } else if (typeof getCurrentUserId === 'function') {
    userId = await getCurrentUserId();
  }
  console.log('[DIAG] 步骤3：processPendingInviteRegistration 读取当前用户ID =', userId);

  if (!userId) {
    console.log('[DIAG] 步骤4：processPendingInviteRegistration 跳过 - 没有找到当前用户ID，保留 inviter_id 以便重试');
    return;
  }

  try {
    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 检查是否已有邀请记录');
    var existingResult = await window.supabase
      .from('invites')
      .select('id')
      .eq('invitee_id', userId)
      .limit(1);

    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 已有邀请记录查询结果 =', existingResult.error ? '查询失败' : existingResult.data);

    if (!existingResult.error && existingResult.data && existingResult.data.length) {
      console.log('[DIAG] 步骤4：processPendingInviteRegistration - 用户已有邀请关系，清除 inviter_id');
      clearStoredInviterId();
      return;
    }

    // 校验邀请人有效性
    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 查找邀请人（findInviterByRef）');
    var inviter = await findInviterByRef(inviterId);
    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 邀请人查找结果 =', inviter);

    if (!inviter || inviter.id === userId) {
      console.log('[DIAG] 步骤4：processPendingInviteRegistration - 邀请者无效或不能邀请自己，清除 inviter_id');
      clearStoredInviterId();
      return;
    }

    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 开始调用 processInvite');
    var inviteResult = await processInvite(userId);
    console.log('[DIAG] 步骤4：processPendingInviteRegistration - processInvite 完成，结果 =', inviteResult);
    if (inviteResult) {
      clearStoredInviterId();
    }
  } catch (pendingErr) {
    console.warn('[DIAG] 步骤4：processPendingInviteRegistration 异常 - 保留 inviter_id 以便重试:', pendingErr);
  }
}

// RLS 快速自检：在控制台运行 window.coinrealmDiagnoseInviteRLS() 查看诊断结果
async function diagnoseInviteRLS() {
  if (!window.supabase) {
    console.log('[InviteRLS] supabase 未就绪');
    return;
  }

  var sessionResult = await window.supabase.auth.getSession();
  var userId = sessionResult.data && sessionResult.data.session && sessionResult.data.session.user && sessionResult.data.session.user.id;

  console.log('[InviteRLS] 当前用户ID:', userId);
  if (!userId) {
    console.log('[InviteRLS] 未登录，跳过');
    return;
  }

  console.log('[InviteRLS] ====== 开始自检 ======');

  // 测试1：作为邀请人查询（inviter_id = 自己）
  var test1 = await window.supabase.from('invites').select('id').eq('inviter_id', userId).limit(1);
  console.log('[InviteRLS] 测试1 - 查询自己发出的邀请:', test1.error ? '❌ 失败（' + (test1.error.message || test1.error.code) + '）' : ('✅ 成功（找到 ' + (test1.data ? test1.data.length : 0) + ' 条)'));

  // 测试2：作为被邀请人查询（invitee_id = 自己）
  var test2 = await window.supabase.from('invites').select('id').eq('invitee_id', userId).limit(1);
  console.log('[InviteRLS] 测试2 - 查询自己收到的邀请:', test2.error ? '❌ 失败（' + (test2.error.message || test2.error.code) + '）【需要 invites_select_all 或 invites_select_invitee 策略】' : ('✅ 成功（找到 ' + (test2.data ? test2.data.length : 0) + ' 条)'));

  // 测试3：全表读取（用于追溯上级）
  var test3 = await window.supabase.from('invites').select('id').limit(1);
  console.log('[InviteRLS] 测试3 - 全表读取（追溯上级需要）:', test3.error ? '❌ 失败（' + (test3.error.message || test3.error.code) + '）【需要 invites_select_all 策略】' : '✅ 成功');

  console.log('[InviteRLS] ====== 自检完成 ======');

  if (test3.error) {
    console.log('[InviteRLS] 🚨 追溯上级需要全表读取权限，请执行：');
    console.log('[InviteRLS] CREATE POLICY IF NOT EXISTS "invites_select_all" ON invites FOR SELECT TO authenticated USING (true);');
  }
}
window.coinrealmDiagnoseInviteRLS = diagnoseInviteRLS;
