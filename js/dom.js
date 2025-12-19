/**
 * UI 元素緩存
 * 集中管理所有 DOM 元素引用
 */
const elements = {
    // 錢包相關
    connectWallet: document.getElementById('connectWallet'),
    walletInfo: document.getElementById('walletInfo'),
    walletAddress: document.getElementById('walletAddress'),
    eventLimit: document.getElementById('eventLimit'),
    disconnectWallet: document.getElementById('disconnectWallet'),

    // 主題與面板
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    panelToggle: document.getElementById('panelToggle'),
    toggleIcon: document.getElementById('toggleIcon'),
    filterPanel: document.getElementById('filterPanel'),

    // 緊湊型語言選擇器 (在 walletInfo 內)
    langCompact: document.getElementById('langCompact'),
    langBtnCompact: document.getElementById('langBtnCompact'),
    currentFlagCompact: document.getElementById('currentFlagCompact'),
    langDropdownCompact: document.getElementById('langDropdownCompact'),

    // 過濾器
    startDate: document.getElementById('startDate'),
    endDate: document.getElementById('endDate'),
    dateFilterMode: document.getElementById('dateFilterMode'),
    // 地區過濾器
    regionSelector: document.getElementById('regionSelector'),
    regionBtn: document.getElementById('regionBtn'),
    currentRegionFlag: document.getElementById('currentRegionFlag'),
    currentRegionName: document.getElementById('currentRegionName'),
    regionDropdown: document.getElementById('regionDropdown'),
    eventTypeFilter: document.getElementById('eventTypeFilter'),
    applyFilters: document.getElementById('applyFilters'),
    clearFilters: document.getElementById('clearFilters'),

    // 統一管理中心
    managementModal: document.getElementById('managementModal'),
    closeManagementModal: document.getElementById('closeManagementModal'),
    subscriptionFooter: document.getElementById('subscriptionFooter'),

    // 訂閱相關元素
    manageSubscriptionsBtn: document.getElementById('manageSubscriptionsBtn'),
    subscriptionsList: document.getElementById('subscriptionsList'),
    subscriptionsLoading: document.getElementById('subscriptionsLoading'),
    subscriptionsEmpty: document.getElementById('subscriptionsEmpty'),
    recommendedList: document.getElementById('recommendedList'),
    recommendedEmpty: document.getElementById('recommendedEmpty'),
    recommendedLoadMore: document.getElementById('recommendedLoadMore'),
    loadMoreRecommendedBtn: document.getElementById('loadMoreRecommendedBtn'),
    subscribeWalletInput: document.getElementById('subscribeWalletInput'),
    addSubscriptionBtn: document.getElementById('addSubscriptionBtn'),
    applySubscriptionFilter: document.getElementById('applySubscriptionFilter'),
    cancelSubscriptionFilter: document.getElementById('cancelSubscriptionFilter'),

    // 新增事件表單 (主要由 forms.js 處理，但為了兼容性保留引用)
    showAddEvent: document.getElementById('showAddEvent'),
    addEventModal: document.getElementById('addEventModal'),
    closeModal: document.getElementById('closeModal'),
    cancelAdd: document.getElementById('cancelAdd'),
    addEventForm: document.getElementById('addEventForm'),
    eventLanguage: document.getElementById('eventLanguage'),
    eventLat: document.getElementById('eventLat'),
    eventLng: document.getElementById('eventLng'),
    eventStartDate: document.getElementById('eventStartDate'),
    eventEndDate: document.getElementById('eventEndDate'),
    eventTags: document.getElementById('eventTags'),
    locationInfo: document.getElementById('locationInfo'),
    locationText: document.getElementById('locationText'),

    // Context Menu & Map
    contextMenu: document.getElementById('contextMenu'),
    createEventHere: document.getElementById('createEventHere'),
    locationMarker: document.getElementById('locationMarker'),
    contextLat: document.getElementById('contextLat'),
    contextLng: document.getElementById('contextLng'),

    // Event Card
    eventCard: document.getElementById('eventCard'),
    closeCard: document.getElementById('closeCard'),
    cardTitle: document.getElementById('cardTitle'),
    cardTags: document.getElementById('cardTags'),
    cardDate: document.getElementById('cardDate'),
    cardLocation: document.getElementById('cardLocation'),
    cardUser: document.getElementById('cardUser'),
    cardLanguage: document.getElementById('cardLanguage'),
    cardDescription: document.getElementById('cardDescription'),
    cardImage: document.getElementById('cardImage'),
    cardImg: document.getElementById('cardImg'),
    cardCreatorActions: document.getElementById('cardCreatorActions'),
    cardCreatorRole: document.getElementById('cardCreatorRole'),
    cardSubscriberCount: document.getElementById('cardSubscriberCount'),
    cardSubscribeBtn: document.getElementById('cardSubscribeBtn'),

    // 圖片上傳 (forms.js)
    iconPicker: document.getElementById('iconPicker'),
    eventIcon: document.getElementById('eventIcon'),
    imageUploadArea: document.getElementById('imageUploadArea'),
    eventImage: document.getElementById('eventImage'),
    uploadPlaceholder: document.getElementById('uploadPlaceholder'),
    imagePreview: document.getElementById('imagePreview'),
    previewImg: document.getElementById('previewImg'),
    removeImage: document.getElementById('removeImage'),
    eventImagePath: document.getElementById('eventImagePath'),

    // 我的事件相關 (在管理中心內)
    myEventsBtn: document.getElementById('myEventsBtn'),
    myEventsList: document.getElementById('myEventsList'),
    myEventsLoading: document.getElementById('myEventsLoading'),
    myEventsEmpty: document.getElementById('myEventsEmpty'),

    // 向後兼容 - 舊名稱映射到新元素
    get myEventsModal() { return this.managementModal; },
    get subscriptionsModal() { return this.managementModal; },

    // Toast
    toast: document.getElementById('toast')
};
