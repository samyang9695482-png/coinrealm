let allTasks = [];
let homeOfficialTasks = [];
let homeEventsBound = false;
let fetchTasksSeq = 0;
let homeUserApprovedTaskIds = {};

function isHomepageBroadcast(record) {
    var amount = Number(record.reward_amount) || 0;
    var eventType = record.event_type || '';
    if (amount >= 500) return true;
    if (eventType === 'rare_box' || eventType === 'dividend' || eventType === 'invite') return true;
    return false;
}

function formatBroadcastRelativeTime(iso) {
    if (!iso) return '—';
    var date = new Date(iso);
    if (isNaN(date.getTime())) return String(iso).slice(0, 16);

    var diffMs = Date.now() - date.getTime();
    if (diffMs < 0) diffMs = 0;

    var minutes = Math.floor(diffMs / 60000);
    var hours = Math.floor(diffMs / 3600000);
    var days = Math.floor(diffMs / 86400000);
    var lang = window.currentLang === 'en' ? 'en' : 'zh';

    if (minutes < 1) return lang === 'zh' ? '刚刚' : 'Just now';
    if (minutes < 60) return lang === 'zh' ? minutes + '分钟前' : minutes + ' min ago';
    if (hours < 24) return lang === 'zh' ? hours + '小时前' : hours + ' h ago';
    if (days === 1) return lang === 'zh' ? '昨天' : 'Yesterday';
    return lang === 'zh' ? days + '天前' : days + ' d ago';
}

function renderHomeBroadcastTicker(items) {
    var wrapper = document.getElementById('broadcast-ticker');
    if (!wrapper) return;

    var langData = window.translations[window.currentLang] || window.translations.zh;
    var emptyText = langData.broadcast_empty || '暂无动态';

    if (!items.length) {
        wrapper.style.animation = 'none';
        wrapper.innerHTML = '<div class="broadcast-item"><span>' + escapeHtml(emptyText) + '</span></div>';
        return;
    }

    wrapper.innerHTML = items.map(function (record) {
        var desc = escapeHtml(record.description || '');
        var rewardHtml = record.reward_amount
            ? ' <span class="highlight">' + Number(record.reward_amount).toLocaleString() + ' CRLM</span>'
            : '';
        return '<div class="broadcast-item">' + desc + rewardHtml + '</div>';
    }).join('');

    if (items.length === 1) {
        wrapper.style.animation = 'none';
        return;
    }

    var styleEl = document.getElementById('coinrealm-broadcast-keyframes');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'coinrealm-broadcast-keyframes';
        document.head.appendChild(styleEl);
    }

    var count = items.length;
    var height = 60;
    var step = 100 / count;
    var keyframes = '@keyframes scrollBroadcastDynamic {';
    var i;

    for (i = 0; i < count; i++) {
        var holdStart = (i * step).toFixed(2);
        var holdEnd = (i * step + step * 0.85).toFixed(2);
        keyframes += holdStart + '% { transform: translateY(-' + (i * height) + 'px); }';
        keyframes += holdEnd + '% { transform: translateY(-' + (i * height) + 'px); }';
    }
    keyframes += '100% { transform: translateY(0); }';
    keyframes += '}';

    styleEl.textContent = keyframes;
    wrapper.style.animation = 'scrollBroadcastDynamic ' + (count * 4) + 's linear infinite';
}

function loadHomeBroadcasts() {
    if (!window.supabase) {
        renderHomeBroadcastTicker([]);
        return Promise.resolve();
    }

    return window.supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
        .then(function (result) {
            if (result.error) {
                console.warn('加载首页广播失败:', result.error);
                renderHomeBroadcastTicker([]);
                return;
            }
            var items = (result.data || []).filter(isHomepageBroadcast);
            renderHomeBroadcastTicker(items);
        })
        .catch(function (err) {
            console.warn('加载首页广播失败:', err);
            renderHomeBroadcastTicker([]);
        });
}

window.coinrealmRefreshHomeBroadcast = loadHomeBroadcasts;

function buildTaskBroadcastTitle(title) {
    return String(title || '任务').replace(/[「」]/g, '');
}

function getPublisherIdFromHash() {
    var hash = window.location.hash.replace(/^#/, '') || '';
    if (hash.indexOf('publisher') === -1) return null;
    var query = hash.split('?')[1];
    if (!query) return null;
    return new URLSearchParams(query).get('id');
}

function navigateToPublisher(publisherId) {
    if (!publisherId) return;
    var targetHash = 'publisher?id=' + encodeURIComponent(publisherId);
    if (window.location.hash.replace(/^#/, '') === targetHash) {
        if (typeof window.coinrealmApplyRoute === 'function') {
            window.coinrealmApplyRoute('publisher');
        }
        return;
    }
    window.location.hash = targetHash;
}

function getTaskField(task, keys, fallback) {
    for (let i = 0; i < keys.length; i++) {
        if (task[keys[i]] != null && task[keys[i]] !== '') return task[keys[i]];
    }
    return fallback;
}

function getTaskCategory(task) {
    if (task.is_official) return 'official';
    return getTaskField(task, ['task_type', 'type', 'category'], 'other');
}

function displayNameFromEmail(email) {
    if (!email) return '';
    var parts = String(email).split('@');
    return parts[0] || '';
}

function resolvePublisherDisplayName(user) {
    if (!user || typeof user !== 'object') {
        console.log('首页 resolvePublisherDisplayName: 无用户数据', user);
        return '未知发布者';
    }

    if (typeof window.coinrealmResolveUserDisplayName === 'function') {
        return window.coinrealmResolveUserDisplayName(user);
    }

    var rawUsername = user.username;
    if (rawUsername != null && String(rawUsername).trim()) {
        return String(rawUsername).trim();
    }

    var email = user.email != null ? String(user.email).trim() : '';
    if (email && email.indexOf('@wallet.coinrealm.local') === -1) {
        return displayNameFromEmail(email) || email;
    }

    var wallet = user.wallet_address != null ? String(user.wallet_address).trim() : '';
    if (wallet) {
        if (typeof window.coinrealmFormatWalletDisplayName === 'function') {
            return window.coinrealmFormatWalletDisplayName(wallet);
        }
        return 'Wallet_' + wallet.slice(0, 10) + '...';
    }

    return '未知发布者';
}

function resolvePublisherFields(task) {
    var publisher = task.publisher;
    var username = '';
    var level = getTaskField(task, ['publisher_level'], null);

    if (publisher && typeof publisher === 'object') {
        username = resolvePublisherDisplayName(publisher);
        if (level == null || level === '') level = publisher.level;
    }

    if (!username) {
        username = getTaskField(task, ['publisher_username', 'publisher_name'], '');
    }
    if (!username) {
        username = getTaskField(task, ['username'], '未知发布者');
    }
    if (level == null || level === '') level = 1;

    return { username: username, level: level };
}

function enrichTasksWithPublishers(tasks) {
    if (!window.supabase || !tasks || !tasks.length) {
        return Promise.resolve(tasks || []);
    }

    var publisherIds = tasks
        .map(function (task) { return task.publisher_id; })
        .filter(function (id) { return !!id; });
    var uniqueIds = publisherIds.filter(function (id, index) {
        return publisherIds.indexOf(id) === index;
    });

    if (!uniqueIds.length) {
        return Promise.resolve(tasks);
    }

    return window.supabase
        .from('users')
        .select('id, username, level, email, wallet_address, avatar_url')
        .in('id', uniqueIds)
        .then(function (userResult) {
            if (userResult.error || !userResult.data) {
                if (userResult.error) console.warn('加载发布者信息失败:', userResult.error);
                return tasks;
            }

            var userMap = {};
            userResult.data.forEach(function (user) {
                userMap[user.id] = user;
            });

            return tasks.map(function (task) {
                var publisher = userMap[task.publisher_id];
                if (!publisher) {
                    console.log('首页发布者未找到：', {
                        taskId: task.id,
                        publisherId: task.publisher_id
                    });
                    return task;
                }

                var displayName = resolvePublisherDisplayName(publisher);
                console.log('首页发布者显示名：', {
                    publisherId: publisher.id,
                    username: publisher.username,
                    email: publisher.email,
                    wallet_address: publisher.wallet_address,
                    displayName: displayName
                });

                return Object.assign({}, task, {
                    publisher: publisher,
                    publisher_username: displayName,
                    publisher_level: publisher.level
                });
            });
        })
        .catch(function (err) {
            console.warn('加载发布者信息失败:', err);
            return tasks;
        });
}

function getTypeLabelKey(task) {
    const type = getTaskField(task, ['task_type', 'type', 'category'], 'other');
    const map = {
        official: 'tag_official',
        simple: 'tag_simple',
        airdrop: 'tag_airdrop',
        register: 'tag_register',
        trade: 'tag_trade',
        game: 'tag_game',
        content: 'tag_content',
        test: 'tag_test'
    };
    return map[type] || 'tag_all';
}

function formatRewardAmount(amount) {
    const n = Number(amount) || 0;
    return n.toLocaleString('en-US') + ' CRLM';
}

function calcDaysLeft(deadline) {
    if (!deadline) return 0;
    const end = new Date(deadline);
    if (Number.isNaN(end.getTime())) return 0;
    const diff = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

function sortTasks(tasks, sortValue) {
    const list = tasks.slice();
    switch (sortValue) {
        case 'highest-value':
        case 'most-rewards':
            list.sort((a, b) => {
                const ra = Number(getTaskField(a, ['reward_amount', 'reward'], 0));
                const rb = Number(getTaskField(b, ['reward_amount', 'reward'], 0));
                return rb - ra;
            });
            break;
        case 'ending-soon':
            list.sort((a, b) => {
                const da = new Date(getTaskField(a, ['deadline', 'end_date', 'ends_at'], 0)).getTime() || Infinity;
                const db = new Date(getTaskField(b, ['deadline', 'end_date', 'ends_at'], 0)).getTime() || Infinity;
                return da - db;
            });
            break;
        case 'latest':
        default:
            list.sort((a, b) => {
                const ca = new Date(getTaskField(a, ['created_at'], 0)).getTime() || 0;
                const cb = new Date(getTaskField(b, ['created_at'], 0)).getTime() || 0;
                return cb - ca;
            });
            break;
    }
    return list;
}

function isHomeTaskCompleted(taskId) {
    return !!homeUserApprovedTaskIds[String(taskId)];
}

async function loadHomeUserApprovedTaskIds() {
    homeUserApprovedTaskIds = {};

    var userId = await getCurrentUserId();
    if (!userId || !window.supabase) {
        console.log('首页已完成任务查询：未登录');
        return;
    }

    var result = await window.supabase
        .from('submissions')
        .select('task_id')
        .eq('user_id', userId)
        .eq('status', 'approved');

    console.log('首页已完成任务查询：', result);

    if (!result.error && result.data) {
        result.data.forEach(function (row) {
            if (row.task_id != null) {
                homeUserApprovedTaskIds[String(row.task_id)] = true;
            }
        });
    }
}

function buildTaskCardHtml(task) {
    const category = getTaskCategory(task);
    const typeLabelKey = getTypeLabelKey(task);
    const publisher = resolvePublisherFields(task);
    const username = escapeHtml(publisher.username);
    const level = escapeHtml(publisher.level);
    const publisherId = escapeHtml(getTaskField(task, ['publisher_id'], ''));
    const title = escapeHtml(getTaskField(task, ['title', 'task_title'], ''));
    const reward = formatRewardAmount(getTaskField(task, ['reward_amount', 'reward'], 0));
    const slotsTotalRaw = getTaskField(task, ['slots_total', 'total_slots', 'max_participants'], 0);
    const slotsLeftRaw = getTaskField(task, ['slots_left', 'slots_remaining', 'remaining_slots'], null);
    const slotsLeft = escapeHtml(slotsLeftRaw != null && slotsLeftRaw !== '' ? slotsLeftRaw : slotsTotalRaw);
    const slotsTotal = escapeHtml(slotsTotalRaw);
    const daysLeft = calcDaysLeft(getTaskField(task, ['deadline', 'end_date', 'ends_at'], null));
    const isOfficial = !!task.is_official;
    const isPromo = !!task.is_promo;
    const isSimple = category === 'simple';

    let badgeHtml = '';
    if (isSimple) {
        badgeHtml = '<span class="badge simple-task-badge" aria-hidden="true">⚡</span>';
    }
    if (isOfficial) {
        badgeHtml += '<span class="badge official-badge" data-i18n="badge_official">官方</span>';
    } else if (isPromo) {
        badgeHtml += '<span class="badge promo-badge" data-i18n="badge_promo">推广</span>';
    }

    const publisherUser = getPublisherAvatarUser(task);
    const avatarHtml = buildAvatarHtml(publisherUser, 'css-avatar');
    const imageUrlRaw = getTaskField(task, ['image_url'], '');
    const imageUrl = imageUrlRaw && typeof resolveAvatarAssetUrl === 'function'
        ? resolveAvatarAssetUrl(imageUrlRaw)
        : imageUrlRaw;
    const imageHtml = imageUrl
        ? '<div class="task-card-media"><img class="task-card-image" src="' + escapeHtml(imageUrl) + '" alt=""></div>'
        : '';
    const cardClass = imageUrl ? ' task-card-with-image' : '';

    const taskId = getTaskField(task, ['id'], '');
    const isCompleted = isHomeTaskCompleted(taskId);
    const completedLabel = window.currentLang === 'en' ? 'Completed' : '已完成';
    const claimBtnHtml = isCompleted
        ? '<button type="button" class="claim-btn claim-btn-done" disabled style="background:#e8e8e8;color:#999;cursor:not-allowed;">' + escapeHtml(completedLabel) + '</button>'
        : '<button type="button" class="claim-btn" data-task-id="' + escapeHtml(taskId) + '" data-i18n="btn_claim">领取</button>';

    return (
        '<div class="task-card' + cardClass + '" data-category="' + escapeHtml(category) + '" data-task-id="' + escapeHtml(taskId) + '">' +
            imageHtml +
            '<div class="task-card-body">' +
            '<div class="card-top">' +
                '<div class="author-info publisher-link" data-publisher-id="' + publisherId + '" style="cursor:pointer">' +
                    avatarHtml +
                    '<div class="meta-text">' +
                        '<span class="username">' + username + '</span>' +
                        '<span class="level-badge">Lv.' + level + '</span>' +
                    '</div>' +
                '</div>' +
                badgeHtml +
            '</div>' +
            (title ? '<div class="task-card-title">' + title + '</div>' : '') +
            '<div class="reward-amount">' + reward + '</div>' +
            '<div class="card-bottom">' +
                '<div class="meta-tags">' +
                    '<span class="type-label label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
                    '<span class="info-text"><span data-i18n="text_slots">剩余名额</span> ' + slotsLeft + '/' + slotsTotal + '</span>' +
                    '<span class="info-text">' + daysLeft + ' <span data-i18n="text_days">天后</span></span>' +
                '</div>' +
                claimBtnHtml +
            '</div>' +
            '</div>' +
        '</div>'
    );
}

function buildOfficialRecommendCardHtml(task) {
    var category = getTaskField(task, ['task_type', 'type', 'category'], 'other');
    var typeLabelKey = getTypeLabelKey(task);
    var publisher = resolvePublisherFields(task);
    var title = escapeHtml(getTaskField(task, ['title', 'task_title'], ''));
    var description = escapeHtml(getTaskField(task, ['description'], ''));
    var reward = formatRewardAmount(getTaskField(task, ['reward_amount', 'reward'], 0));
    var slotsTotalRaw = getTaskField(task, ['slots_total', 'total_slots', 'max_participants'], 0);
    var slotsLeftRaw = getTaskField(task, ['slots_left', 'slots_remaining', 'remaining_slots'], null);
    var slotsLeft = escapeHtml(slotsLeftRaw != null && slotsLeftRaw !== '' ? slotsLeftRaw : slotsTotalRaw);
    var slotsTotal = escapeHtml(slotsTotalRaw);
    var taskId = escapeHtml(getTaskField(task, ['id'], ''));

    var publisherUser = getPublisherAvatarUser(task);
    var avatarHtml = buildAvatarHtml(publisherUser, 'official-card-avatar css-avatar');
    var imageUrlRaw = getTaskField(task, ['image_url'], '');
    var imageUrl = imageUrlRaw ? resolveTaskImageUrl(imageUrlRaw) : '';
    var cardClass = imageUrl ? ' official-recommend-card-with-image' : '';

    var cardBody =
            '<div class="official-card-top">' +
                avatarHtml +
                '<div class="official-card-author">' +
                    '<span class="official-card-username">' + escapeHtml(publisher.username) + '</span>' +
                    '<span class="official-card-level">Lv.' + escapeHtml(publisher.level) + '</span>' +
                '</div>' +
            '</div>' +
            '<h3 class="official-card-title">' + title + '</h3>' +
            '<span class="official-card-type label-' + escapeHtml(category) + '" data-i18n="' + typeLabelKey + '"></span>' +
            '<div class="official-card-reward">' + reward + '</div>' +
            (description ? '<p class="official-card-desc">' + description + '</p>' : '') +
            '<div class="official-card-slots"><span data-i18n="text_slots">剩余名额</span> ' + slotsLeft + '/' + slotsTotal + '</div>';

    var imageBlock = imageUrl
        ? '<div class="official-card-media"><img class="official-card-image" src="' + escapeHtml(imageUrl) + '" alt=""' + taskImageErrorAttr() + '></div>'
        : '';

    return (
        '<article class="official-recommend-card' + cardClass + '" data-task-id="' + taskId + '" role="link" tabindex="0">' +
            (imageUrl ? '<div class="official-card-body">' + cardBody + '</div>' : cardBody) +
            imageBlock +
        '</article>'
    );
}

function renderOfficialRecommendSection() {
    var section = document.getElementById('official-recommend-section');
    var grid = document.getElementById('official-recommend-grid');
    if (!section || !grid) return;

    if (!homeOfficialTasks.length) {
        section.classList.add('hidden');
        grid.innerHTML = '';
        return;
    }

    section.classList.remove('hidden');
    grid.innerHTML = homeOfficialTasks.map(buildOfficialRecommendCardHtml).join('');
    applyLanguageStrings();
}

function navigateToTaskDetail(taskId) {
    if (!taskId) return;
    var targetHash = 'task-detail?id=' + encodeURIComponent(taskId);
    if (window.location.hash.replace(/^#/, '') === targetHash) {
        if (typeof window.coinrealmApplyRoute === 'function') {
            window.coinrealmApplyRoute('task-detail');
        }
        return;
    }
    window.location.hash = targetHash;
}

function filterByOfficialTag() {
    var tagButtons = document.querySelectorAll('#filter-tags .tag-btn');
    tagButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-type') === 'official');
    });
    applyFiltersAndSort();
    var filterBar = document.querySelector('.filter-search-bar');
    if (filterBar) {
        filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function handleClaimTask(btn) {
    if (btn.disabled || btn.classList.contains('claim-btn-done')) return;
    navigateToTaskDetail(btn.getAttribute('data-task-id'));
}

function bindClaimButtons() {
    // 事件已在 initHomePageLogic 中通过委托绑定
}

function renderTaskCards(tasks) {
    const taskGrid = document.getElementById('task-grid');
    if (!taskGrid) return;
    taskGrid.innerHTML = tasks.map(buildTaskCardHtml).join('');
    bindClaimButtons();
}

function applyFiltersAndSort() {
    const taskGrid = document.getElementById('task-grid');
    const emptyState = document.getElementById('empty-state');
    if (!taskGrid || !emptyState) return;

    const activeBtn = document.querySelector('#filter-tags .tag-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-type') : 'all';
    const sortDropdown = document.getElementById('sort-dropdown');
    const sortValue = sortDropdown ? sortDropdown.value : 'latest';

    let filtered = allTasks.slice();
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(function (task) {
            return getTaskCategory(task) === selectedCategory;
        });
    }

    filtered = sortTasks(filtered, sortValue);

    if (filtered.length === 0) {
        taskGrid.innerHTML = '';
        taskGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    renderTaskCards(filtered);
    taskGrid.classList.remove('hidden');
    applyLanguageStrings();
}

function goToHomeAndRefreshTasks() {
    if (typeof window.coinrealmNavigateToRoute === 'function') {
        window.coinrealmNavigateToRoute('home');
        return;
    }
    window.location.hash = 'home';
    if (typeof window.coinrealmApplyRoute === 'function') {
        window.coinrealmApplyRoute('home');
    } else if (typeof handleRoute === 'function') {
        handleRoute();
    }
}

function fetchTasks() {
    const seq = ++fetchTasksSeq;
    const skeletonScreen = document.getElementById('skeleton-screen');
    const taskGrid = document.getElementById('task-grid');
    const emptyState = document.getElementById('empty-state');

    if (skeletonScreen) skeletonScreen.classList.remove('hidden');
    if (taskGrid) {
        taskGrid.classList.add('hidden');
        taskGrid.innerHTML = '';
    }
    if (emptyState) emptyState.classList.add('hidden');

    if (!window.supabase) {
        if (skeletonScreen) skeletonScreen.classList.add('hidden');
        allTasks = [];
        homeOfficialTasks = [];
        renderOfficialRecommendSection();
        if (taskGrid) taskGrid.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    window.supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .then(function (result) {
            if (seq !== fetchTasksSeq) return;
            if (skeletonScreen) skeletonScreen.classList.add('hidden');

            var officialQuery = window.supabase
                .from('tasks')
                .select('*')
                .eq('is_official', true)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(4);

            return officialQuery.then(function (officialResult) {
                var officialData = (!officialResult.error && officialResult.data) ? officialResult.data : [];
                if (officialResult.error) {
                    console.warn('加载官方推荐任务失败:', officialResult.error);
                }

                return enrichTasksWithPublishers(officialData).then(function (enrichedOfficial) {
                    homeOfficialTasks = enrichedOfficial || [];
                    renderOfficialRecommendSection();

                    if (result.error || !result.data || result.data.length === 0) {
                        allTasks = [];
                        if (taskGrid) taskGrid.classList.add('hidden');
                        if (emptyState) emptyState.classList.remove('hidden');
                        if (result.error) console.warn('加载任务失败:', result.error);
                        return null;
                    }

                    return enrichTasksWithPublishers(result.data);
                });
            });
        })
        .then(function (tasks) {
            if (seq !== fetchTasksSeq) return;
            if (!tasks) return;

            allTasks = tasks;
            return loadHomeUserApprovedTaskIds().then(function () {
                applyFiltersAndSort();
            });
        })
        .catch(function (err) {
            if (seq !== fetchTasksSeq) return;
            if (skeletonScreen) skeletonScreen.classList.add('hidden');
            allTasks = [];
            homeOfficialTasks = [];
            renderOfficialRecommendSection();
            if (taskGrid) taskGrid.classList.add('hidden');
            if (emptyState) emptyState.classList.remove('hidden');
            console.warn('加载任务失败:', err);
        });
}

// ==========================================
// 2. 首页核心业务逻辑与动态渲染切换
// ==========================================

function initHomePageLogic() {
    // A. 新用户引导条关闭处理逻辑
    const guideBar = document.getElementById('user-guide-bar');
    const closeGuideBtn = document.getElementById('close-guide-btn');
    
    if (guideBar && closeGuideBtn) {
        if (localStorage.getItem('coinrealm_guide_closed') === 'true') {
            guideBar.classList.add('hidden');
        } else {
            guideBar.classList.remove('hidden');
        }

        closeGuideBtn.addEventListener('click', () => {
            guideBar.classList.add('hidden');
            localStorage.setItem('coinrealm_guide_closed', 'true');
        });
    }

    // B. 骨架屏 → 从 Supabase 拉取任务数据
    fetchTasks();
    loadHomeBroadcasts();

    if (!homeEventsBound) {
        homeEventsBound = true;

        // C. 类型筛选标签切换交互逻辑
        const tagButtons = document.querySelectorAll('#filter-tags .tag-btn');

        tagButtons.forEach(button => {
            button.addEventListener('click', () => {
                tagButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                applyFiltersAndSort();
            });
        });

        // D. 排序下拉交互
        const sortDropdown = document.getElementById('sort-dropdown');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', () => {
                applyFiltersAndSort();
            });
        }

        // D2. 任务卡片「领取」按钮（事件委托，避免重复渲染后失效）
        const taskGrid = document.getElementById('task-grid');
        if (taskGrid) {
            taskGrid.addEventListener('click', function (e) {
                var publisherLink = e.target.closest('.publisher-link');
                if (publisherLink && taskGrid.contains(publisherLink)) {
                    e.preventDefault();
                    e.stopPropagation();
                    var publisherId = publisherLink.getAttribute('data-publisher-id');
                    if (publisherId) navigateToPublisher(publisherId);
                    return;
                }

                var btn = e.target.closest('.claim-btn');
                if (!btn || !taskGrid.contains(btn)) return;
                e.preventDefault();
                e.stopPropagation();
                handleClaimTask(btn);
            });
        }

        // E. 回到顶部按钮逻辑
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.remove('hidden');
                } else {
                    backToTopBtn.classList.add('hidden');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        var officialGrid = document.getElementById('official-recommend-grid');
        if (officialGrid) {
            officialGrid.addEventListener('click', function (e) {
                var card = e.target.closest('.official-recommend-card');
                if (!card || !officialGrid.contains(card)) return;
                navigateToTaskDetail(card.getAttribute('data-task-id'));
            });
            officialGrid.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                var card = e.target.closest('.official-recommend-card');
                if (!card || !officialGrid.contains(card)) return;
                e.preventDefault();
                navigateToTaskDetail(card.getAttribute('data-task-id'));
            });
        }

        var officialViewAllBtn = document.getElementById('official-view-all-btn');
        if (officialViewAllBtn) {
            officialViewAllBtn.addEventListener('click', function (e) {
                e.preventDefault();
                filterByOfficialTag();
            });
        }

        var adsCarouselEl = document.getElementById('ads-carousel');
        if (adsCarouselEl && !adsCarouselEl.dataset.bound) {
            adsCarouselEl.dataset.bound = 'true';
            adsCarouselEl.addEventListener('click', function (e) {
                var contentEl = e.target.closest('.ads-carousel-content');
                if (!contentEl || !adsCarouselEl.contains(contentEl)) return;
                var link = contentEl.getAttribute('data-ad-link');
                if (link) {
                    window.open(link, '_blank', 'noopener,noreferrer');
                }
            });
            var adsDotsEl = document.getElementById('ads-carousel-dots');
            if (adsDotsEl) {
                adsDotsEl.addEventListener('click', function (e) {
                    var dot = e.target.closest('.ads-carousel-dot');
                    if (!dot || dot.disabled || !adsCarouselState) return;
                    var slotIndex = Number(dot.getAttribute('data-ad-index'));
                    if (!Number.isFinite(slotIndex)) return;
                    showAdsCarouselSlot(slotIndex, { animate: true });
                    startAdsCarouselRotation();
                });
            }
        }
    }

    initAdsCarousel();
}

