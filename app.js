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
    // 1. 初始化基礎模組
    initMap(); // js/map.js
    initLanguageSelector(); // js/i18n.js
    Forms.init(); // js/forms.js

    // 2. 初始化輔助功能
    if (typeof initQuickDates === 'function') initQuickDates(); // js/ui.js
    if (typeof initLangCompact === 'function') initLangCompact(); // js/ui.js
    if (typeof initRegionFilter === 'function') initRegionFilter(); // js/ui.js
    if (typeof detectBrowserLanguage === 'function') detectBrowserLanguage(); // js/i18n.js or js/ui.js
    if (typeof setDefaultDateRange === 'function') setDefaultDateRange('today'); // js/ui.js

    // 3. 恢復狀態與數據
    restoreSelectedSubscriptions(); // js/subscription.js
    await loadEvents(); // js/events.js

    // 4. 初始化事件監聽
    initEventListeners();

    // 5. 恢復認證狀態
    if (typeof loadTokensFromStorage === 'function' && await loadTokensFromStorage()) { // js/api.js
        handleWalletConnected(walletAddress); // js/wallet.js
    } else {
        checkPhantomWallet(); // js/wallet.js
    }
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
    if (elements.closeSubscriptionsModal) elements.closeSubscriptionsModal.addEventListener('click', closeSubscriptionsModal);
    if (elements.subscriptionsModal) elements.subscriptionsModal.addEventListener('click', (e) => {
        if (e.target === elements.subscriptionsModal) closeSubscriptionsModal();
    });
    if (elements.applySubscriptionFilter) elements.applySubscriptionFilter.addEventListener('click', applySubscriptionFilter);
    if (elements.cancelSubscriptionFilter) elements.cancelSubscriptionFilter.addEventListener('click', closeSubscriptionsModal);

    if (typeof initSubscriptionListListeners === 'function') initSubscriptionListListeners();

    // 我的事件 (JS/MyEvents.js)
    if (elements.myEventsBtn) elements.myEventsBtn.addEventListener('click', openMyEventsModal);
    if (elements.closeMyEventsModal) elements.closeMyEventsModal.addEventListener('click', closeMyEventsModal);
    if (elements.myEventsModal) elements.myEventsModal.addEventListener('click', (e) => {
        if (e.target === elements.myEventsModal) closeMyEventsModal();
    });

    // 個人資料（Profile）
    if (typeof initProfileEvents === 'function') initProfileEvents();

    // 日期選擇器按鈕
    const startDateBtn = document.getElementById('openStartDatePicker');
    const endDateBtn = document.getElementById('openEndDatePicker');
    if (startDateBtn && elements.eventStartDate) startDateBtn.addEventListener('click', () => elements.eventStartDate.showPicker());
    if (endDateBtn && elements.eventEndDate) endDateBtn.addEventListener('click', () => elements.eventEndDate.showPicker());

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

    // 圖片模態框
    const closeImageModalBtn = document.getElementById('closeImageModal');
    const imageModal = document.getElementById('imageModal');

    if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImageModal();
        });
    }

    if (imageModal) {
        // 點擊背景關閉
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }

    // ESC 鍵關閉圖片模態框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageModal && !imageModal.classList.contains('hidden')) {
            closeImageModal();
        }
    });
}
