/* 邀请逻辑模块 - 独立于 app.js */
/* ========================================================================
   🔍 RLS 策略诊断提示
   如果邀请记录显示"未激活"且无法更新，99% 是 invites 表 RLS 策略问题。
   
   请在 Supabase SQL Editor 执行以下 SQL：
   
   -- 1. 先检查当前 RLS 策略
   SELECT * FROM pg_policies WHERE tablename = 'invites';
   
   -- 2. 如果没有针对 invitee 的策略，添加以下策略：
   -- 允许被邀请人查看自己收到的邀请
   CREATE POLICY IF NOT EXISTS "invites_select_invitee" ON invites
     FOR SELECT TO authenticated USING (invitee_id = auth.uid());
   
   -- 允许被邀请人更新自己收到的邀请（用于激活奖励）
   CREATE POLICY IF NOT EXISTS "invites_update_invitee" ON invites
     FOR UPDATE TO authenticated USING (invitee_id = auth.uid());
   
   -- 允许邀请人查看自己发出的邀请
   CREATE POLICY IF NOT EXISTS "invites_select_inviter" ON invites
     FOR SELECT TO authenticated USING (inviter_id = auth.uid());
   
   -- 允许认证用户插入邀请记录
   CREATE POLICY IF NOT EXISTS "invites_insert_authenticated" ON invites
     FOR INSERT TO authenticated WITH CHECK (true);
   
   -- 3. 如果还是不行，检查 invites 表是否启用了 RLS
   ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
   ======================================================================== */

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
    console.log('[DIAG] 步骤1：URL 参数捕获（invite-logic.js）- ref =', ref);
    if (ref) {
      var inviterId = String(ref).trim();
      localStorage.setItem('inviter_id', inviterId);
      localStorage.setItem('coinrealm_invite_ref', inviterId);
      console.log('[DIAG] 步骤2：localStorage 存储（invite-logic.js）- inviter_id =', localStorage.getItem('inviter_id'));
    } else {
      console.log('[DIAG] 步骤2：localStorage 存储（invite-logic.js）- 跳过（URL 无 ref）');
    }
  } catch (captureErr) {
    console.warn('[DIAG] 步骤1/2：捕获邀请 ref 失败:', captureErr);
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
      console.log('[DIAG] getStoredInviterId - 从 localStorage 读取到 inviter_id =', inviterId);
      return String(inviterId).trim();
    }
  } catch (storageErr) {
    console.warn('[DIAG] getStoredInviterId - 读取失败:', storageErr);
  }

  try {
    var fallback = localStorage.getItem('coinrealm_invite_ref');
    if (fallback) {
      console.log('[DIAG] getStoredInviterId - 从备用键读取到 coinrealm_invite_ref =', fallback);
      return String(fallback).trim();
    }
  } catch (fallbackErr) {
    console.warn('[DIAG] getStoredInviterId - 备用键读取失败:', fallbackErr);
  }

  console.log('[DIAG] getStoredInviterId - 未找到任何邀请信息，返回空字符串');
  return '';
}

function clearStoredInviterId() {
  console.log('[DIAG] clearStoredInviterId 被调用 - 清除前 inviter_id =', localStorage.getItem('inviter_id'));
  try {
    localStorage.removeItem('inviter_id');
    localStorage.removeItem('coinrealm_invite_ref');
    console.log('[DIAG] clearStoredInviterId 完成 - 清除后 inviter_id =', localStorage.getItem('inviter_id'));
  } catch (storageErr) {
    console.warn('[DIAG] clearStoredInviterId - 清除失败:', storageErr);
  }
}

async function grantInviteReward(inviter, inviteeId, level, amount) {
  console.log('[DIAG] 步骤5：数据库写入尝试 - grantInviteReward 开始', {
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
    console.log('[DIAG] 步骤5：数据库写入跳过 - 参数不足');
    return false;
  }

  try {
    var insertPayload = {
      inviter_id: inviter.id,
      invitee_id: inviteeId,
      level: level,
      reward_amount: amount,
      is_activated: false,
      created_at: new Date().toISOString()
    };
    console.log('[DIAG] 步骤5：数据库写入尝试 - INSERT invites 表，payload =', insertPayload);

    var insertResult = await window.supabase.from('invites').insert(insertPayload);

    console.log('[DIAG] 步骤5：数据库写入结果 -', insertResult.error ? '失败' : '成功', insertResult.error || insertResult.data);

    if (insertResult.error) {
      var errMsg = String(insertResult.error.message || insertResult.error.details || '').toLowerCase();
      var errCode = insertResult.error.code || '';
      console.log('[DIAG] 步骤5：数据库写入错误详情 - code =', errCode, '| message =', insertResult.error.message);
      
      if (errCode === '23505' || errMsg.indexOf('duplicate') !== -1 || errMsg.indexOf('conflict') !== -1) {
        console.log('[DIAG] 步骤5：邀请记录已存在（409冲突），视为成功');
        return true;
      }
      
      if (errMsg.indexOf('column') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('[DIAG] 步骤5：邀请表字段缺失，请执行 SQL：ALTER TABLE invites ADD COLUMN IF NOT EXISTS reward_amount NUMERIC DEFAULT 0; ALTER TABLE invites ADD COLUMN IF NOT EXISTS is_activated BOOLEAN DEFAULT FALSE; ALTER TABLE invites ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();');
      }
      return false;
    }

    console.log('[DIAG] 步骤5：数据库写入成功 - 邀请记录已创建（is_activated=false）');
    return true;
  } catch (grantErr) {
    console.warn('[DIAG] 步骤5：数据库写入异常:', grantErr);
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
  if (!userId || !window.supabase) {
    console.log('[ActivateInvite] 跳过 - 缺少 userId 或 supabase');
    return;
  }

  try {
    console.log('[ActivateInvite] ====== 开始激活检查 ======');
    console.log('[ActivateInvite] userId =', userId);

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
      console.warn('[ActivateInvite] ❌ 查询邀请记录失败！');
      console.warn('[ActivateInvite] 错误详情:', result.error);
      console.warn('[ActivateInvite] 这很可能是 RLS 策略问题！');
      console.warn('[ActivateInvite] 请在 Supabase SQL Editor 执行：');
      console.warn('[ActivateInvite] CREATE POLICY IF NOT EXISTS "invites_select_invitee" ON invites FOR SELECT TO authenticated USING (invitee_id = auth.uid());');
      console.warn('[ActivateInvite] CREATE POLICY IF NOT EXISTS "invites_update_invitee" ON invites FOR UPDATE TO authenticated USING (invitee_id = auth.uid());');
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

      // ★ 防重复：检查 deposit_records 是否已有该邀请的奖励记录
      var dupQuery = window.supabase
        .from('deposit_records')
        .select('id')
        .eq('user_id', inviterId)
        .eq('type', 'invite_reward')
        .eq('related_id', invite.id);

      // 二级奖励额外检查 description
      if (level === 2) {
        dupQuery = dupQuery.ilike('description', '%二级%');
      }

      var dupCheck = await dupQuery.limit(1);

      if (!dupCheck.error && dupCheck.data && dupCheck.data.length > 0) {
        console.log('[ActivateInvite] 跳过 - deposit_records 已有记录（奖励已发放过）');
        // 确保 is_activated 标记为 true（补救之前可能只发了奖没标记的情况）
        if (!invite.is_activated) {
          await window.supabase.from('invites').update({ is_activated: true }).eq('id', invite.id);
        }
        skipCount++;
        continue;
      }

      if (dupCheck.error) {
        console.log('[ActivateInvite] deposit_records 查询失败（可能表不存在），继续发放:', dupCheck.error.message);
      }

      // 获取邀请人信息
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

      // ★ 关键修复：先发奖励（更新余额），成功后再标记 is_activated = true
      // 这样如果余额更新失败，is_activated 仍为 false，下次可以重试
      var newBalance = (Number(inviter.crlm_balance) || 0) + rewardAmount;
      var patchPayload = { crlm_balance: newBalance };

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
        console.warn('[ActivateInvite] 请在 Supabase SQL Editor 执行：');
        console.warn('[ActivateInvite] CREATE POLICY IF NOT EXISTS "users_update_balance" ON users FOR UPDATE TO authenticated USING (true) WITH CHECK (true);');
        // 不标记 is_activated，下次重试
        continue;
      }

      console.log('[ActivateInvite] ✅ 邀请人余额已更新 +' + rewardAmount + ' CRLM');

      // 记录交易明细到 deposit_records
      var recordResult = await recordInviteRewardTransaction({
        userId: inviter.id,
        amount: rewardAmount,
        level: level,
        inviteId: invite.id,
        inviteeId: userId,
        inviterUsername: inviter.username
      });

      if (recordResult) {
        console.log('[ActivateInvite] ✅ 交易明细已记录到 deposit_records');
      } else {
        console.warn('[ActivateInvite] ⚠️ 交易明细记录失败（余额已更新，但明细未记录）');
      }

      // 余额更新成功后，标记 is_activated = true
      var updateResult = await window.supabase
        .from('invites')
        .update({ is_activated: true })
        .eq('id', invite.id);

      if (updateResult.error) {
        console.warn('[ActivateInvite] ⚠️ 余额已更新但 is_activated 标记失败（不影响奖励，下次会跳过）:', updateResult.error);
      } else {
        console.log('[ActivateInvite] ✅ is_activated 已标记为 true');
      }

      // 发送通知（格式：恭喜你获得X级邀请奖励 +XXX CRLM（用户XXX完成任务））
      var levelLabel = level === 1 ? '一级' : '二级';
      var notifTitle = '恭喜你获得' + levelLabel + '邀请奖励 +' + rewardAmount + ' CRLM（你的好友完成任务）';
      await writeInviteNotification(inviter.id, notifTitle, 'invite', userId);

      var description = level === 1 ? '你成功邀请了一位新用户，获得一级邀请奖励' : '你的二级邀请关系产生了奖励';
      writeInviteBroadcast(inviter.id, description, rewardAmount);

      successCount++;
      console.log('[ActivateInvite] ✅ 第', i + 1, '条' + levelLabel + '奖励发放成功');

      // 一级奖励发放成功后，追溯上级，发放二级奖励
      if (level === 1) {
        console.log('[ActivateInvite] --- 追溯上级，检查是否有二级奖励 ---');
        try {
          var parentInviteResult = await window.supabase
            .from('invites')
            .select('id, inviter_id, is_activated')
            .eq('invitee_id', inviterId)
            .eq('level', 1)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

          console.log('[ActivateInvite] 上级邀请查询：', parentInviteResult.error ? '失败' : ('找到 ' + (parentInviteResult.data ? 1 : 0) + ' 条'));

          if (!parentInviteResult.error && parentInviteResult.data && parentInviteResult.data.inviter_id) {
            var grandParentId = parentInviteResult.data.inviter_id;
            var parentInviteId = parentInviteResult.data.id;
            console.log('[ActivateInvite] 找到上级（grandparent）：', grandParentId);

            // 防重复：检查 grandParent 是否已经从这个 invitee 获得过二级奖励
            // 即检查是否有 inviter_id = grandParentId, invitee_id = userId, level = 2 的记录已激活
            var level2Check = await window.supabase
              .from('invites')
              .select('id, is_activated')
              .eq('inviter_id', grandParentId)
              .eq('invitee_id', userId)
              .eq('level', 2)
              .limit(1)
              .maybeSingle();

            var level2InviteId = null;
            var level2AlreadyActivated = false;

            if (!level2Check.error && level2Check.data) {
              level2InviteId = level2Check.data.id;
              level2AlreadyActivated = level2Check.data.is_activated === true;
              console.log('[ActivateInvite] 二级邀请记录已存在：id=' + level2InviteId + ' 已激活=' + level2AlreadyActivated);
            } else {
              console.log('[ActivateInvite] 二级邀请记录不存在，需要创建');
            }

            // 防重复：检查 deposit_records
            if (level2InviteId) {
              var dup2Check = await window.supabase
                .from('deposit_records')
                .select('id')
                .eq('related_id', level2InviteId)
                .eq('type', 'invite_reward')
                .limit(1);

              if (!dup2Check.error && dup2Check.data && dup2Check.data.length > 0) {
                console.log('[ActivateInvite] 跳过二级 - deposit_records 已有记录');
                if (!level2AlreadyActivated) {
                  await window.supabase.from('invites').update({ is_activated: true }).eq('id', level2InviteId);
                }
                // 继续下一条主循环记录
              } else {
                // 需要发放二级奖励
                await grantLevel2Reward({
                  grandParentId: grandParentId,
                  inviteeUserId: userId,
                  level2Reward: level2Reward,
                  existingInviteId: level2InviteId
                });
              }
            } else {
              // 没有记录，创建并发放
              await grantLevel2Reward({
                grandParentId: grandParentId,
                inviteeUserId: userId,
                level2Reward: level2Reward,
                existingInviteId: null
              });
            }
          } else {
            console.log('[ActivateInvite] 邀请人没有上级，无二级奖励');
          }
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

// 记录邀请奖励交易明细到 deposit_records 表
async function recordInviteRewardTransaction(params) {
  if (!window.supabase || !params.userId || !params.amount) return false;

  var levelLabel = params.level === 1 ? '一级' : '二级';
  var description = levelLabel + '邀请奖励 - 用户' + (params.inviterUsername || params.inviteeId) + '完成任务';

  var payload = {
    user_id: params.userId,
    amount: params.amount,
    type: 'invite_reward',
    description: description,
    related_id: params.inviteId || null,
    created_at: new Date().toISOString()
  };

  try {
    var result = await window.supabase.from('deposit_records').insert(payload);

    if (result.error) {
      var errMsg = String(result.error.message || '').toLowerCase();

      // 如果是字段不存在，提示添加字段
      if (errMsg.indexOf('column') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('[InviteReward] deposit_records 表字段缺失，请执行 SQL：');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS type TEXT DEFAULT \'invite_reward\';');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS description TEXT;');
        console.warn('[InviteReward] ALTER TABLE deposit_records ADD COLUMN IF NOT EXISTS related_id UUID;');
      }

      // 如果是表不存在，提示创建表
      if (errMsg.indexOf('relation') !== -1 && errMsg.indexOf('does not exist') !== -1) {
        console.warn('[InviteReward] deposit_records 表不存在，请执行 SQL：');
        console.warn('[InviteReward] CREATE TABLE IF NOT EXISTS deposit_records (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id), amount NUMERIC NOT NULL, type TEXT DEFAULT \'invite_reward\', description TEXT, related_id UUID, created_at TIMESTAMPTZ DEFAULT NOW());');
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

// 发放二级邀请奖励（追溯上级方式）
async function grantLevel2Reward(params) {
  var grandParentId = params.grandParentId;
  var inviteeUserId = params.inviteeUserId;
  var level2Reward = params.level2Reward;
  var existingInviteId = params.existingInviteId;

  if (!grandParentId || !inviteeUserId || !window.supabase) {
    console.log('[Level2Reward] 跳过 - 参数不足');
    return false;
  }

  try {
    console.log('[Level2Reward] 开始发放二级奖励：grandParent=' + grandParentId + ' invitee=' + inviteeUserId + ' amount=' + level2Reward);

    // 获取上级用户信息
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

    var inviteId = existingInviteId;

    // ★ 关键修复：查询时只用 invitee_id（RLS 允许），不用 inviter_id
    if (!inviteId) {
      console.log('[Level2Reward] 查询 level=2 的邀请记录（只用 invitee_id）');
      var existResult = await window.supabase
        .from('invites')
        .select('id, inviter_id, is_activated')
        .eq('invitee_id', inviteeUserId)
        .eq('level', 2)
        .limit(1)
        .maybeSingle();

      if (!existResult.error && existResult.data) {
        // 验证 inviter_id 是否匹配（防止取到错误的记录）
        if (String(existResult.data.inviter_id) === String(grandParentId)) {
          inviteId = existResult.data.id;
          console.log('[Level2Reward] 邀请记录已存在，id=' + inviteId + '，已激活=' + existResult.data.is_activated);

          if (existResult.data.is_activated) {
            console.log('[Level2Reward] 跳过 - 该记录已激活');
            return false;
          }
        } else {
          console.log('[Level2Reward] 查询到的记录 inviter_id 不匹配，需要创建新记录');
        }
      } else {
        console.log('[Level2Reward] 邀请记录不存在，需要创建');
      }
    }

    // 如果仍然没有邀请记录ID，执行 INSERT
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
          created_at: new Date().toISOString()
        })
        .select('id')
        .maybeSingle();

      if (insertResult.error) {
        var errMsg = String(insertResult.error.message || '').toLowerCase();
        var errCode = insertResult.error.code || '';

        // 冲突时，用 invitee_id 查询获取 ID（RLS 允许）
        if (errCode === '23505' || errMsg.indexOf('duplicate') !== -1 || errMsg.indexOf('conflict') !== -1) {
          console.log('[Level2Reward] INSERT 冲突，用 invitee_id 查询获取id');
          var retryResult = await window.supabase
            .from('invites')
            .select('id, inviter_id, is_activated')
            .eq('invitee_id', inviteeUserId)
            .eq('level', 2)
            .limit(1)
            .maybeSingle();

          if (!retryResult.error && retryResult.data && String(retryResult.data.inviter_id) === String(grandParentId)) {
            inviteId = retryResult.data.id;
            if (retryResult.data.is_activated) {
              console.log('[Level2Reward] 已激活，跳过');
              return false;
            }
            console.log('[Level2Reward] 冲突后查询成功，id=' + inviteId);
          } else {
            console.warn('[Level2Reward] 冲突后查询仍失败（可能 RLS 限制），inviter_id匹配=' + (retryResult.data ? String(retryResult.data.inviter_id) === String(grandParentId) : 'N/A'));
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

    // ★ 防重复：检查 deposit_records 是否已有该邀请的二级奖励记录
    var dupCheckResult = await window.supabase
      .from('deposit_records')
      .select('id')
      .eq('user_id', grandParentId)
      .eq('type', 'invite_reward')
      .eq('related_id', inviteId)
      .limit(1);

    if (!dupCheckResult.error && dupCheckResult.data && dupCheckResult.data.length > 0) {
      console.log('[Level2Reward] 跳过 - deposit_records 已有记录（奖励已发放过）');
      // 确保 is_activated 标记为 true
      await window.supabase.from('invites').update({ is_activated: true }).eq('id', inviteId);
      return false;
    }

    if (dupCheckResult.error) {
      console.log('[Level2Reward] deposit_records 查询失败（可能表不存在），继续发放:', dupCheckResult.error.message);
    }

    // 先发奖励（更新余额）
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
      inviterUsername: grandParent.username
    });

    if (recordOk) {
      console.log('[Level2Reward] ✅ 交易明细已记录');
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
    if (typeof writeInviteNotification === 'function') {
      await writeInviteNotification(grandParentId, notifTitle, 'invite', inviteeUserId);
      console.log('[Level2Reward] ✅ 通知已发送');
    }

    // 广播
    if (typeof writeInviteBroadcast === 'function') {
      writeInviteBroadcast(grandParentId, '你的二级邀请关系产生了奖励', level2Reward);
    }

    console.log('[Level2Reward] ✅ 二级奖励发放完成');
    return true;
  } catch (level2Err) {
    console.warn('[Level2Reward] 异常:', level2Err);
    return false;
  }
}

async function processInvite(newUserId) {
  console.log('[DIAG] 步骤4：邀请处理调用 - processInvite 开始，newUserId =', newUserId);
  
  if (!newUserId || !window.supabase) {
    console.log('[DIAG] 步骤4：processInvite 失败 - 缺少用户ID或supabase | newUserId =', newUserId, '| supabase =', !!window.supabase, '，保留 inviter_id 以便重试');
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
    console.log('[DIAG] 步骤4：processInvite - 检查是否已有邀请记录（invitee_id =', newUserId, '）');
    var existingResult = await window.supabase
      .from('invites')
      .select('id')
      .eq('invitee_id', newUserId)
      .limit(1);

    console.log('[DIAG] 步骤4：processInvite - 已有邀请记录查询结果 =', existingResult.error ? '查询失败' : existingResult.data);

    if (!existingResult.error && existingResult.data && existingResult.data.length) {
      console.log('[DIAG] 步骤4：processInvite - 用户已有邀请关系，跳过');
      return true;
    }

    var settings = await fetchInviteSettings();
    var level1Reward = Number(settings.invite_level1_reward) || INVITE_SETTINGS_DEFAULTS.invite_level1_reward;
    var level2Reward = Number(settings.invite_level2_reward) || INVITE_SETTINGS_DEFAULTS.invite_level2_reward;
    console.log('[DIAG] 步骤4：processInvite - 奖励配置 level1 =', level1Reward, '| level2 =', level2Reward);

    console.log('[DIAG] 步骤4：processInvite - 查询邀请人信息（inviterId =', inviterId, '）');
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
    console.log('[DIAG] 步骤4：processInvite - 开始发放一级奖励');
    var level1Done = await grantInviteReward(inviter, newUserId, 1, level1Reward);
    console.log('[DIAG] 步骤4：processInvite - 一级奖励结果 =', level1Done);
    if (!level1Done) {
      console.log('[DIAG] 步骤4：processInvite 失败 - 一级奖励发放失败，保留 inviter_id');
      return false;
    }

    console.log('[DIAG] 步骤4：processInvite - 查询二级邀请人（inviter 的上级）');
    
    // ★ 注意：由于 RLS 策略限制，注册时新用户（newUserId）无法查询邀请人的上级关系
    // 二级奖励在 activateInviteRewards 中处理（用户完成任务时，使用 invitee_id 查询，RLS 允许）
    // 这里尝试查询，如果失败则跳过，由 activateInviteRewards 处理
    var parentResult = await window.supabase
      .from('invites')
      .select('inviter_id')
      .eq('invitee_id', inviter.id)
      .eq('level', 1)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    console.log('[DIAG] 步骤4：processInvite - 二级邀请人查询结果 =', parentResult.error ? '失败' : parentResult.data);

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
          console.log('[DIAG] 步骤4：processInvite - 开始发放二级奖励');
          var level2Done = await grantInviteReward(parentInviter, newUserId, 2, level2Reward);
          console.log('[DIAG] 步骤4：processInvite - 二级奖励结果 =', level2Done);
        }
      }
    } else {
      console.log('[DIAG] 步骤4：processInvite - 二级邀请人查询失败（可能 RLS 限制），将由 activateInviteRewards 处理');
    }

    console.log('[DIAG] 步骤4：processInvite - 成功完成，清除 inviter_id');
    
    // 邀请关系建立后，通知邀请人
    console.log('[DIAG] 步骤4：processInvite - 发送邀请成功通知给邀请人:', inviter.id);
    await writeInviteNotification(inviter.id, '你邀请的新用户已注册，待其完成任务后你将获得邀请奖励', 'invite', newUserId);
    
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

async function processPendingInviteRegistration() {
  console.log('[DIAG] 步骤4：邀请处理调用 - processPendingInviteRegistration 开始');
  
  if (!window.supabase) {
    console.log('[DIAG] 步骤4：processPendingInviteRegistration 失败 - 没有 supabase，保留 inviter_id 以便重试');
    return;
  }

  var inviterId = getStoredInviterId();
  console.log('[DIAG] 步骤4：processPendingInviteRegistration - inviter_id =', inviterId);
  
  if (!inviterId) {
    console.log('[DIAG] 步骤4：processPendingInviteRegistration 跳过 - 无邀请人信息（inviter_id 为空）');
    return;
  }

  var userId;
  if (typeof window.coinrealmGetCurrentUserId === 'function') {
    userId = await window.coinrealmGetCurrentUserId();
  } else if (typeof getCurrentUserId === 'function') {
    userId = await getCurrentUserId();
  }
  console.log('[DIAG] 步骤3：钱包登录用户ID（processPendingInviteRegistration 读取）- userId =', userId);
  
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

    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 查找邀请人（findInviterByRef）');
    var inviter = await findInviterByRef(inviterId);
    console.log('[DIAG] 步骤4：processPendingInviteRegistration - 邀请人查找结果 =', inviter);
    
    if (!inviter || inviter.id === userId) {
      console.log('[DIAG] 步骤4：processPendingInviteRegistration 失败 - 邀请者无效或不能邀请自己，清除 inviter_id');
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

window.coinrealmCaptureInviteRef = captureInviteRefFromUrl;
window.coinrealmProcessInvite = processInvite;
window.coinrealmProcessPendingInvite = processPendingInviteRegistration;
window.coinrealmActivateInviteRewards = activateInviteRewards;
window.coinrealmFetchInviteSettings = fetchInviteSettings;
window.coinrealmInviteSettingsDefaults = INVITE_SETTINGS_DEFAULTS;
window.coinrealmDiagnoseInviteRLS = diagnoseInviteRLS;

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
  console.log('[InviteRLS] 测试1 - 查询自己发出的邀请:', test1.error ? '❌ 失败（' + (test1.error.message || test1.error.code) + ')' : ('✅ 成功（找到 ' + (test1.data ? test1.data.length : 0) + ' 条)'));

  // 测试2：作为被邀请人查询（invitee_id = 自己）
  var test2 = await window.supabase.from('invites').select('id').eq('invitee_id', userId).limit(1);
  console.log('[InviteRLS] 测试2 - 查询自己收到的邀请:', test2.error ? '❌ 失败（' + (test2.error.message || test2.error.code) + '）【需要添加 invites_select_invitee 策略】' : ('✅ 成功（找到 ' + (test2.data ? test2.data.length : 0) + ' 条)'));

  // 测试3：插入测试（如果有记录可以尝试更新）
  if (test2.data && test2.data.length > 0) {
    var testId = test2.data[0].id;
    var test3 = await window.supabase.from('invites').update({ _rls_test: new Date().toISOString() }).eq('id', testId);
    console.log('[InviteRLS] 测试3 - 更新自己收到的邀请:', test3.error ? '❌ 失败（' + (test3.error.message || test3.error.code) + '）【需要添加 invites_update_invitee 策略】' : '✅ 成功');
  } else {
    console.log('[InviteRLS] 测试3 - 跳过（没有可更新的记录）');
  }

  console.log('[InviteRLS] ====== 自检完成 ======');

  // 如果测试2/3 失败，给出修复方案
  if (test2.error) {
    console.log('[InviteRLS] 🚨 请在 Supabase SQL Editor 执行以下 SQL 修复：');
    console.log('[InviteRLS] CREATE POLICY IF NOT EXISTS "invites_select_invitee" ON invites FOR SELECT TO authenticated USING (invitee_id = auth.uid());');
    console.log('[InviteRLS] CREATE POLICY IF NOT EXISTS "invites_update_invitee" ON invites FOR UPDATE TO authenticated USING (invitee_id = auth.uid());');
  }
}