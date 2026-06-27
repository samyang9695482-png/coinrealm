@ -1087,15 +1087,15 @@
    if (!window.supabase || !currentTaskRecord) return;

    var taskId = currentTaskRecord.id;
    var userInfo = await getUserInfo();
    var user = await getUserInfo();

    if (!userInfo || !userInfo.id) {
    if (!user || !user.id) {
      alert(tdT('td_alert_login'));
      return;
    }

    var userId = userInfo.id;
    var userLevel = userInfo.level != null ? Number(userInfo.level) : 0;
    var userId = user.id;
    var userLevel = user.level != null ? Number(user.level) : 0;

    if (userLevel < 1) {
      alert(tdT('td_btn_level'));
@@ -1143,6 +1143,7 @@

    currentTaskRecord.current_participants = nextCount;
    currentSubmissionRecord = insertResult.data;
    currentUserId = userId;
    detailActionState = resolveDetailActionState(currentTaskRecord, currentSubmissionRecord, currentUserId);
    updateBottomActionBar();
    alert(tdT('td_alert_claim_ok'));
@@ -1896,16 +1897,13 @@
      }

      try {
        var sessionResult = await window.supabase.auth.getSession();
        if (sessionResult.error) throw sessionResult.error;

        var session = sessionResult.data && sessionResult.data.session;
        if (!session || !session.user || !session.user.id) {
        var user = await getUserInfo();
        if (!user || !user.id) {
          alert('请先登录后再发布任务');
          return;
        }

        var userId = session.user.id;
        var userId = user.id;
        var title = document.getElementById('ct-task-title').value.trim();
        var type = document.getElementById('ct-task-type').value;
        var description = document.getElementById('ct-task-desc').value.trim();
@@ -1975,14 +1973,12 @@
                alert(ctT('ct_alert_required'));
                return;
            }
            var sessionResponse = await window.supabase.auth.getSession();
            var sessionData = sessionResponse.data;
            var sessionError = sessionResponse.error;
            if (sessionError || !sessionData.session) {
            var user = await getUserInfo();
            if (!user || !user.id) {
                alert('请先登录后再发布任务');
                return;
            }
            var userId = sessionData.session.user.id;
            var userId = user.id;
            var title = document.getElementById('ct-task-title').value.trim();
            var type = document.getElementById('ct-task-type').value;
            var desc = document.getElementById('ct-task-desc').value.trim();
@@ -2243,30 +2239,6 @@
    return false;
  }

  async function resolveSubmitUserId() {
    if (window.supabase) {
      var sessionResult = await window.supabase.auth.getSession();
      var session = sessionResult.data && sessionResult.data.session;
      if (session && session.user && session.user.id) {
        return session.user.id;
      }
    }

    var wallet = localStorage.getItem('coinrealm_wallet');
    if (wallet && window.supabase) {
      var userResult = await window.supabase
        .from('users')
        .select('id')
        .eq('wallet_address', wallet)
        .maybeSingle();
      if (!userResult.error && userResult.data && userResult.data.id) {
        return userResult.data.id;
      }
    }

    return null;
  }

  function handleFilesSelected(fileList) {
    var files = Array.from(fileList);
    var remaining = 3 - uploadedFiles.length;
@@ -2415,12 +2387,14 @@
      return true;
    }

    var userId = await resolveSubmitUserId();
    if (!userId) {
    var user = await getUserInfo();
    if (!user || !user.id) {
      showNoTaskEmptyState();
      return true;
    }

    var userId = user.id;

    var submissionResult = await window.supabase
      .from('submissions')
      .select('id, task_id, user_id, status, description, submitted_at, rejection_reason, reject_reason, review_note, screenshot_urls')
@@ -2511,32 +2485,33 @@
          return;
        }

        var userId = await resolveSubmitUserId();
        if (!userId) {
          alert(stT('st_alert_login'));
        var user = await getUserInfo();
        if (!user || !user.id) {
          alert('请先登录');
          return;
        }
        var userId = user.id;

        submitBtn.disabled = true;

        try {
          var lookupResult = await window.supabase
            .from('submissions')
            .select('id')
            .eq('task_id', activeSubmitContext.taskId)
            .eq('user_id', userId)
            .maybeSingle();

          if (lookupResult.error || !lookupResult.data) {
            alert(stT('st_alert_no_task'));
            return;
          }

          var screenshotNames = uploadedFiles.map(function (file) {
            return file.name;
          });

          var updateResult = await window.supabase
            .from('submissions')
            .update({
              description: desc,