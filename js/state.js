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
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedWalletAddress = localStorage.getItem('walletAddress');

    if (savedAccessToken) accessToken = savedAccessToken;
    if (savedRefreshToken) refreshToken = savedRefreshToken;
    if (savedWalletAddress) walletAddress = savedWalletAddress;

    // 恢復 UI 設定
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) isDarkTheme = savedTheme === 'dark';

    const savedUILang = localStorage.getItem('uiLang');
    if (savedUILang) currentUILang = savedUILang;

    // 恢復訂閱選擇
    const savedSubscriptions = localStorage.getItem('selectedSubscriptions');
    if (savedSubscriptions) {
        selectedSubscriptions = savedSubscriptions.split(',').filter(w => w);
    }
}

/**
 * 保存狀態到 localStorage
 */
function saveState() {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (walletAddress) localStorage.setItem('walletAddress', walletAddress);

    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('uiLang', currentUILang);
    localStorage.setItem('selectedSubscriptions', selectedSubscriptions.join(','));
}

/**
 * 清除認證狀態
 */
function clearAuthState() {
    accessToken = null;
    refreshToken = null;
    walletAddress = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('walletAddress');
}
