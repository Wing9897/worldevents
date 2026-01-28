/**
 * World Events Dashboard - 主應用程式
 * 依賴: js/dom.js (DOM 元素緩存), js/forms.js, js/ui.js, 其他模組...
 */

// ===== 配置 =====
const API_BASE = (typeof CONFIG !== 'undefined') ? CONFIG.API_BASE : 'http://localhost:5000/api';
const EVENT_LIMIT = (typeof CONFIG !== 'undefined') ? CONFIG.EVENT_LIMIT : 100;
const RECOMMENDED_BATCH_SIZE = (typeof CONFIG !== 'undefined') ? CONFIG.RECOMMENDED_BATCH_SIZE : 9;

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', async () => {
    // 0. 恢復全局狀態
    if (typeof restoreState === 'function') restoreState(); // js/state.js

    // 1. 初始化基礎模組
    initMap(); // js/map.js
    initLanguageSelector(); // js/i18n.js
    Forms.init(); // js/forms.js

    // 2. 初始化輔助功能
    if (typeof initQuickDates === 'function') initQuickDates(); // js/ui.js
    if (typeof initLangCompact === 'function') initLangCompact(); // js/ui.js
    if (typeof initRegionFilter === 'function') initRegionFilter(); // js/ui.js
    if (typeof setDefaultDateRange === 'function') setDefaultDateRange('today'); // js/ui.js

    // 3. 恢復狀態與數據
    if (typeof restoreSelectedSubscriptions === 'function') restoreSelectedSubscriptions(); // js/subscription.js
    await loadEvents(); // js/events.js

    // 4. 初始化事件監聽
    initEventListeners();

    // 5. 恢復認證狀態
    if (typeof loadTokensFromStorage === 'function' && await loadTokensFromStorage()) { // js/api.js
        handleWalletConnected(walletAddress); // js/wallet.js
    }
    // 如果沒有已存儲的 token，用戶將通過點擊「連接錢包」按鈕手動連接
});

// ===== 事件監聽器 =====
function initEventListeners() {
    // UI 切換
    if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleMapTheme); // js/map.js
    if (elements.panelToggle) elements.panelToggle.addEventListener('click', togglePanel); // js/map.js

    // 錢包
    if (elements.connectWallet) elements.connectWallet.addEventListener('click', connectPhantom); // js/wallet.js
    if (elements.disconnectWallet) elements.disconnectWallet.addEventListener('click', disconnectPhantom); // js/wallet.js

    // 過濾器
    if (elements.applyFilters) elements.applyFilters.addEventListener('click', loadEvents); // js/events.js
    if (elements.clearFilters) elements.clearFilters.addEventListener('click', clearFilters); // js/events.js

    if (elements.dateFilterMode) {
        elements.dateFilterMode.addEventListener('change', loadEvents);
    }
    // 地區過濾器的 listener 由 initRegionFilter 處理

    if (elements.eventTypeFilter) {
        elements.eventTypeFilter.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loadEvents();
        });
    }

    if (elements.startDate && elements.endDate) {
        [elements.startDate, elements.endDate].forEach(input => {
            input.addEventListener('change', () => {
                document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
                loadEvents();
            });
        });
    }

    // 訂閱管理 (JS/Subscription.js)
    if (elements.manageSubscriptionsBtn) elements.manageSubscriptionsBtn.addEventListener('click', openSubscriptionsModal);

    if (elements.applySubscriptionFilter) elements.applySubscriptionFilter.addEventListener('click', applySubscriptionFilter);
    if (elements.cancelSubscriptionFilter) elements.cancelSubscriptionFilter.addEventListener('click', closeSubscriptionsModal);

    if (typeof initSubscriptionListListeners === 'function') initSubscriptionListListeners();

    // 我的事件 (JS/MyEvents.js)
    // Unified Management Modal (replaces My Events & Subscriptions legacy handlers)
    if (elements.myEventsBtn) {
        elements.myEventsBtn.addEventListener('click', () => {
            if (typeof openManagementModal === 'function') {
                openManagementModal('myevents');
            }
        });
    }

    // Close button for management modal is handled in myevents.js initProfileEvents()

    // Click outside to close
    if (elements.managementModal) {
        elements.managementModal.addEventListener('click', (e) => {
            if (e.target === elements.managementModal) {
                elements.managementModal.classList.add('hidden');
            }
        });
    }

    // 個人資料（Profile）
    if (typeof initProfileEvents === 'function') initProfileEvents();

    // Context Menu -> Add Event
    if (elements.createEventHere) {
        elements.createEventHere.addEventListener('click', () => {
            hideContextMenu(); // js/map.js
            hideLocationMarker(); // js/map.js
            Forms.openAddModal(contextMenuLatLng); // js/forms.js
        });
    }

    // Event Card
    if (elements.closeCard) {
        elements.closeCard.addEventListener('click', () => {
            elements.eventCard.classList.add('hidden');
        });
    }

    if (elements.cardSubscribeBtn) {
        elements.cardSubscribeBtn.addEventListener('click', () => {
            const targetWallet = elements.cardSubscribeBtn.dataset.wallet;
            if (targetWallet) toggleSubscribe(targetWallet); // js/events.js
        });
    }
}
