// 个人中心 — 任务统计与跳转
(function () {
  'use strict';

  function navigateToMyTasksTab(tab) {
    var hash = '#my-tasks?tab=' + encodeURIComponent(tab);
    console.log('个人中心跳转我的任务：', hash);
    window.location.hash = hash;
  }

  async function loadProfileSubmissionStats() {
    var userId = typeof getCurrentUserId === 'function' ? await getCurrentUserId() : null;
    var stats = { progress: 0, completed: 0 };

    if (!window.supabase || !userId) {
      console.log('个人中心任务统计：无用户或未配置 Supabase', stats);
      return stats;
    }

    try {
      var progressResult = await window.supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['pending', 'submitted', 'verifying']);
      console.log('个人中心进行中统计：', { userId: userId, result: progressResult });
      if (!progressResult.error && progressResult.count != null) {
        stats.progress = progressResult.count;
      }
    } catch (progressErr) {
      console.warn('个人中心：进行中任务统计失败', progressErr);
    }

    try {
      var completedResult = await window.supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'approved');
      console.log('个人中心已完成统计：', { userId: userId, result: completedResult });
      if (!completedResult.error && completedResult.count != null) {
        stats.completed = completedResult.count;
      }
    } catch (completedErr) {
      console.warn('个人中心：已完成任务统计失败', completedErr);
    }

    return stats;
  }

  function initProfileStatNavigation() {
    var progressEl = document.getElementById('pf-stat-progress');
    var completedEl = document.getElementById('pf-stat-completed');

    if (progressEl && !progressEl.dataset.statNavBound) {
      progressEl.dataset.statNavBound = 'true';
      progressEl.classList.add('profile-stat-clickable');
      progressEl.setAttribute('role', 'button');
      progressEl.setAttribute('tabindex', '0');
      progressEl.setAttribute('title', progressEl.getAttribute('title') || '查看进行中的任务');
      progressEl.addEventListener('click', function () {
        navigateToMyTasksTab('progress');
      });
      progressEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToMyTasksTab('progress');
        }
      });
    }

    if (completedEl && !completedEl.dataset.statNavBound) {
      completedEl.dataset.statNavBound = 'true';
      completedEl.classList.add('profile-stat-clickable');
      completedEl.setAttribute('role', 'button');
      completedEl.setAttribute('tabindex', '0');
      completedEl.setAttribute('title', completedEl.getAttribute('title') || '查看已完成的任务');
      completedEl.addEventListener('click', function () {
        navigateToMyTasksTab('completed');
      });
      completedEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToMyTasksTab('completed');
        }
      });
    }
  }

  window.coinrealmLoadProfileSubmissionStats = loadProfileSubmissionStats;
  window.coinrealmInitProfileStatNavigation = initProfileStatNavigation;
  window.coinrealmNavigateToMyTasksTab = navigateToMyTasksTab;
})();
