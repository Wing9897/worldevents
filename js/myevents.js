/**
 * 個人資料與事件管理模組
 * 用戶資料編輯、事件列表、刪除事件、分頁管理
 */

// ===== 打開管理中心 =====
function openManagementModal(tab = 'profile') {
    if (!walletAddress) {
        showToast(t('pleaseConnectWallet'), 'error');
        return;
    }
    elements.managementModal.classList.remove('hidden');
    switchTab(tab);
    hideEditMode();
    loadProfile();

    // 預載入數據
    if (tab === 'myevents') {
        loadMyEvents();
    } else if (tab === 'subscriptions') {
        loadSubscriptionsData();
    }
}

// 向後兼容舊函數
function openMyEventsModal() {
    openManagementModal('profile');
    loadMyEvents(); // 同時預載入事件
}

function openSubscriptionsModal() {
    openManagementModal('subscriptions');
}

// ===== 分頁切換 =====
function switchTab(tabName) {
    // 切換標籤按鈕樣式
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // 切換內容區域
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}TabContent`);
    });

    // 控制訂閱分頁專用 footer
    const footer = document.getElementById('subscriptionFooter');
    if (footer) {
        footer.classList.toggle('hidden', tabName !== 'subscriptions');
    }

    // 載入對應數據
    if (tabName === 'myevents') {
        loadMyEvents();
    } else if (tabName === 'subscriptions') {
        loadSubscriptionsData();
    }
}

// ===== 載入訂閱數據（委託給 subscription.js） =====
function loadSubscriptionsData() {
    // 觸發訂閱模組的載入邏輯
    if (typeof openSubscriptionsModal_internal === 'function') {
        openSubscriptionsModal_internal();
    } else {
        // 直接呼叫原有邏輯
        loadSubscriptionsList();
    }
}

// ===== 載入用戶資料 =====
async function loadProfile() {
    try {
        const response = await authenticatedFetch(`${CONFIG.API_BASE}/profile`);
        if (response.ok) {
            const profile = await response.json();

            // 更新顯示名稱
            const displayNameText = document.getElementById('displayNameText');
            const displayNameInput = document.getElementById('displayNameInput');

            if (displayNameText) {
                if (profile.display_name) {
                    // 有設定名稱：移除 i18n 屬性並顯示名稱
                    displayNameText.removeAttribute('data-i18n');
                    displayNameText.textContent = profile.display_name;
                } else {
                    // 未設定名稱：添加 i18n 屬性並顯示預設文本
                    displayNameText.setAttribute('data-i18n', 'noNameSet');
                    displayNameText.textContent = t('noNameSet');
                }
            }

            if (displayNameInput) displayNameInput.value = profile.display_name || '';

            // 保存全局
            window.currentUserDisplayName = profile.display_name || null;
        }
    } catch (err) {
        console.error('載入用戶資料失敗:', err);
    }
}

// ===== 顯示編輯模式 =====
function showEditMode() {
    const displayRow = document.querySelector('.profile-name-row');
    const editRow = document.getElementById('editNameRow');
    const input = document.getElementById('displayNameInput');

    if (displayRow) displayRow.classList.add('hidden');
    if (editRow) editRow.classList.remove('hidden');
    if (input) input.focus();
}

// ===== 隱藏編輯模式 =====
function hideEditMode() {
    const displayRow = document.querySelector('.profile-name-row');
    const editRow = document.getElementById('editNameRow');

    if (displayRow) displayRow.classList.remove('hidden');
    if (editRow) editRow.classList.add('hidden');
}

// ===== 儲存用戶資料 =====
async function saveProfile() {
    const displayNameInput = document.getElementById('displayNameInput');
    const saveBtn = document.getElementById('saveProfileBtn');

    if (!displayNameInput || !saveBtn) return;

    const displayName = displayNameInput.value.trim();

    // 禁用按鈕
    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '⏳';

    try {
        const response = await authenticatedFetch(`${CONFIG.API_BASE}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ display_name: displayName })
        });

        if (response.ok) {
            showToast(t('profileSaved'), 'success');

            // 更新顯示
            const displayNameText = document.getElementById('displayNameText');
            if (displayNameText) {
                if (displayName) {
                    displayNameText.removeAttribute('data-i18n');
                    displayNameText.textContent = displayName;
                } else {
                    displayNameText.setAttribute('data-i18n', 'noNameSet');
                    displayNameText.textContent = t('noNameSet');
                }
            }

            // 更新全局變數
            window.currentUserDisplayName = displayName || null;

            // 返回顯示模式
            hideEditMode();
        } else {
            showToast(t('errorSaveProfile', 'Save failed'), 'error');
        }
    } catch (err) {
        console.error('儲存用戶資料失敗:', err);
        showToast(t('errorNetwork', 'Network error'), 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// ===== 初始化個人資料事件 =====
function initProfileEvents() {
    const editBtn = document.getElementById('editNameBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (editBtn) {
        editBtn.addEventListener('click', showEditMode);
    }
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            loadProfile(); // 重新載入取消更改
            hideEditMode();
        });
    }

    // 分頁標籤點擊
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // 關閉按鈕
    const closeBtn = document.getElementById('closeManagementModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeManagementModal);
    }
}

// ===== 關閉管理中心 Modal =====
function closeManagementModal() {
    elements.managementModal.classList.add('hidden');
}

// 向後兼容
function closeMyEventsModal() {
    closeManagementModal();
}

// ===== 載入我的事件 =====
async function loadMyEvents() {
    elements.myEventsLoading.classList.remove('hidden');
    elements.myEventsList.innerHTML = '';
    elements.myEventsEmpty.classList.add('hidden');

    try {
        const response = await authenticatedFetch(`${API_BASE}/user/events`);
        const events = await response.json();

        elements.myEventsLoading.classList.add('hidden');

        if (!Array.isArray(events) || events.length === 0) {
            elements.myEventsEmpty.classList.remove('hidden');
            return;
        }

        renderMyEvents(events);
    } catch (err) {
        console.error(err);
        elements.myEventsLoading.classList.add('hidden');
        showToast(t('loadError'), 'error');
    }
}

// ===== 渲染我的事件列表 =====
function renderMyEvents(events) {
    elements.myEventsList.innerHTML = '';

    events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'my-event-item';

        const dateStr = formatDisplayDate(event.date);

        // 安全的圖標驗證
        const safeIcon = (typeof MARKER_ICONS !== 'undefined' && MARKER_ICONS.includes(event.icon))
            ? event.icon : '📍';

        // 使用安全的 DOM 操作而非 innerHTML
        const infoDiv = document.createElement('div');
        infoDiv.className = 'my-event-info';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'my-event-title';
        titleDiv.textContent = event.name; // 安全：textContent 自動轉義

        const dateDiv = document.createElement('div');
        dateDiv.className = 'my-event-date';
        dateDiv.textContent = `${safeIcon} ${dateStr}`;

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(dateDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.title = t('delete');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => deleteEvent(event.id, item));

        item.appendChild(infoDiv);
        item.appendChild(deleteBtn);

        elements.myEventsList.appendChild(item);
    });
}

// ===== 刪除事件 =====
async function deleteEvent(eventId, listItem) {

    try {
        if (!window.confirm(t('deleteConfirm'))) {
            return;
        }
    } catch (e) {
        console.error('Confirm 錯誤:', e);
        return;
    }

    const deleteBtn = listItem.querySelector('.btn-delete');
    if (deleteBtn) {
        deleteBtn.innerHTML = '⏳';
        deleteBtn.disabled = true;
    }

    try {
        const response = await authenticatedFetch(`${API_BASE}/events/${eventId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const result = await response.json();

            listItem.style.opacity = '0';
            setTimeout(() => {
                listItem.remove();
                if (elements.myEventsList.children.length === 0) {
                    elements.myEventsEmpty.classList.remove('hidden');
                }
            }, 300);

            showToast(t('deleteSuccess'), 'success');

            // 更新狀態
            userEventCount = result.event_count;
            if (result.remaining !== undefined) {
                const remaining = result.remaining;
                elements.eventLimit.textContent = `${t('remaining')} ${remaining} ${t('times')}`;
                elements.showAddEvent.disabled = remaining <= 0;
            }

            loadEvents();
        } else {
            let errorMsg = 'Delete failed';
            try {
                const err = await response.clone().json();
                errorMsg = err.error || errorMsg;
            } catch (e) {
                console.error('解析錯誤響應失敗:', e);
            }
            console.error('刪除失敗:', errorMsg);
            showToast(errorMsg, 'error');

            if (deleteBtn) {
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.disabled = false;
            }
        }
    } catch (err) {
        console.error('網絡或其他錯誤:', err);
        showToast(t('networkError'), 'error');
        if (deleteBtn) {
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.disabled = false;
        }
    }
}
