/**
 * 全局狀態管理
 * 集中管理應用程式狀態
 */

// ===== 應用狀態 =====
let map = null;
let currentTileLayer = null;
let markers = [];
let contextMenuLatLng = null;

// ===== 用戶狀態 =====
let walletAddress = null;
let accessToken = null;
let refreshToken = null;
let userEventCount = 0;
let userQuota = 100;

// ===== UI 狀態 =====
let currentUILang = 'zh-tw';
let lastUILang = null;
let isDarkTheme = false;
let isPanelCollapsed = false;

// ===== 訂閱狀態 =====
let selectedSubscriptions = [];
let allRecommendedAccounts = [];
let shownRecommendedCount = 0;

/**
 * 從 localStorage 恢復狀態
 */
function restoreState() {
    // 恢復認證資訊
    const savedAccessToken = safeLocalStorage.getItem('accessToken');
    const savedRefreshToken = safeLocalStorage.getItem('refreshToken');
    const savedWalletAddress = safeLocalStorage.getItem('walletAddress');

    if (savedAccessToken) accessToken = savedAccessToken;
    if (savedRefreshToken) refreshToken = savedRefreshToken;
    if (savedWalletAddress) walletAddress = savedWalletAddress;

    // 恢復 UI 設定
    const savedTheme = safeLocalStorage.getItem('theme');
    if (savedTheme) isDarkTheme = savedTheme === 'dark';

    const savedUILang = safeLocalStorage.getItem('uiLang');
    if (savedUILang) currentUILang = savedUILang;

    // 恢復訂閱選擇
    const savedSubscriptions = safeLocalStorage.getItem('selectedSubscriptions');
    if (savedSubscriptions) {
        selectedSubscriptions = savedSubscriptions.split(',').filter(w => w);
    }
}

/**
 * 保存狀態到 localStorage
 */
function saveState() {
    if (accessToken) safeLocalStorage.setItem('accessToken', accessToken);
    if (refreshToken) safeLocalStorage.setItem('refreshToken', refreshToken);
    if (walletAddress) safeLocalStorage.setItem('walletAddress', walletAddress);

    safeLocalStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    safeLocalStorage.setItem('uiLang', currentUILang);
    safeLocalStorage.setItem('selectedSubscriptions', selectedSubscriptions.join(','));
}

/**
 * 清除認證狀態
 */
function clearAuthState() {
    accessToken = null;
    refreshToken = null;
    walletAddress = null;
    safeLocalStorage.removeItem('accessToken');
    safeLocalStorage.removeItem('refreshToken');
    safeLocalStorage.removeItem('walletAddress');
}
