/**
 * API 請求工具
 * 封裝帶認證的 HTTP 請求與 Token 管理
 */

/**
 * 帶認證的 fetch 請求
 * 自動附加 Authorization header，並處理 token 刷新
 * @param {string} url - 請求 URL
 * @param {Object} options - fetch 選項
 * @returns {Promise<Response>}
 */
async function authenticatedFetch(url, options = {}) {
    const headers = {
        ...options.headers
    };

    if (typeof accessToken !== 'undefined' && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // 如果 token 過期，嘗試刷新
    if (response.status === 401) {
        if (typeof refreshToken !== 'undefined' && refreshToken) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                headers['Authorization'] = `Bearer ${accessToken}`;
                response = await fetch(url, { ...options, headers });

                // Refresh 後仍失敗，登出
                if (response.status === 401) {
                    handleLogout();
                    throw new Error('登入失效');
                }
            } else {
                handleLogout();
                throw new Error('Token 刷新失敗');
            }
        } else {
            // 無 Refresh Token，直接登出
            handleLogout();
        }
    }

    return response;
}

/**
 * 刷新 Access Token
 * @returns {Promise<boolean>} 是否刷新成功
 */
async function refreshAccessToken() {
    try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (response.ok) {
            const data = await response.json();
            accessToken = data.access_token;
            if (data.refresh_token) {
                refreshToken = data.refresh_token;
            }
            // 更新 localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            return true;
        } else {
            // 刷新失敗，清除認證狀態
            handleLogout();
            return false;
        }
    } catch (err) {
        console.error('Token 刷新失敗:', err);
        handleLogout();
        return false;
    }
}

/**
 * 從 localStorage 加載 Token 並驗證
 * @returns {Promise<boolean>} 是否成功加載並驗證
 */
async function loadTokensFromStorage() {
    // 從 localStorage 加載 Token
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedWallet = localStorage.getItem('walletAddress');

    if (storedAccessToken && storedRefreshToken && storedWallet) {
        accessToken = storedAccessToken;
        refreshToken = storedRefreshToken;
        walletAddress = storedWallet;

        // 驗證 Token 是否仍然有效（使用需要認證的 API）
        try {
            const response = await fetch(`${API_BASE}/user/events`, {
                headers: { 'Authorization': `Bearer ${storedAccessToken}` }
            });

            if (response.status === 401) {
                // Token 無效，嘗試用 refresh token 刷新
                const refreshed = await refreshAccessToken();

                if (!refreshed) {
                    // 刷新失敗，清除 session
                    handleLogout();
                    return false;
                }
            }
            return true;
        } catch (err) {
            console.error('Token 驗證失敗:', err);
            // 網路錯誤時仍然嘗試使用現有 token
            return true;
        }
    }
    return false;
}


/**
 * 處理登出
 */
function handleLogout() {
    accessToken = null;
    refreshToken = null;
    walletAddress = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('walletAddress');

    // 通知 UI 更新
    if (typeof updateWalletUI === 'function') {
        updateWalletUI(false);
    }

    if (typeof showToast === 'function' && typeof t === 'function') {
        showToast(t('walletDisconnected'), 'info');
    }
}
