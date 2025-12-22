/**
 * 錢包管理模組
 * Phantom 錢包連接、認證、狀態管理
 */

// ===== Phantom 錢包檢查 =====
function checkPhantomWallet() {
    // 只檢查 Phantom 是否可用，不自動登入
    // 用戶需要手動點擊「連接錢包」並簽名才能登入
    if (!window.solana || !window.solana.isPhantom) {
        // Phantom 錢包未安裝 - 無需日誌
    }
    // 不做任何自動連接，等待用戶手動點擊
}

// ===== 連接 Phantom 錢包 =====
async function connectPhantom() {
    if (!window.solana || !window.solana.isPhantom) {
        showToast(t('installPhantom'), 'error');
        window.open('https://phantom.app/', '_blank');
        return;
    }

    try {
        // 1. 連接錢包
        const { publicKey } = await window.solana.connect();
        const address = publicKey.toString();

        // 2. 請求 nonce
        const nonceResponse = await fetch(`${API_BASE}/auth/nonce/${address}`);
        if (!nonceResponse.ok) {
            throw new Error(t('errorSignMessage', 'Failed to get signature message'));
        }
        const { nonce, message } = await nonceResponse.json();

        // 3. 請求用戶簽名
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');

        // 4. 提交簽名並獲取 Token
        const authResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wallet_address: address,
                message: message,
                signature: Array.from(signedMessage.signature),
                nonce: nonce
            })
        });

        const authData = await authResponse.json();

        if (authData.success) {
            // 儲存 Token
            accessToken = authData.access_token;
            refreshToken = authData.refresh_token;

            // 儲存到 localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            handleWalletConnected(address);
        } else {
            throw new Error(authData.error || t('errorAuthFailed', 'Authentication failed'));
        }

    } catch (err) {
        console.error('連接錯誤:', err);
        showToast(t('walletConnectionError') + err.message, 'error');
    }
}

// ===== 處理錢包連接成功 =====
async function handleWalletConnected(address) {
    walletAddress = address;

    // 儲存到 localStorage
    localStorage.setItem('walletAddress', address);

    elements.connectWallet.classList.add('hidden');
    elements.walletInfo.classList.remove('hidden');
    elements.myEventsBtn.classList.remove('hidden');
    if (elements.manageSubscriptionsBtn) {
        elements.manageSubscriptionsBtn.classList.remove('hidden');
    }

    // 顯示完整錢包地址
    elements.walletAddress.textContent = address;

    // 點擊複製功能
    elements.walletAddress.onclick = () => {
        navigator.clipboard.writeText(address).then(() => {
            showToast(t('addressCopied'), 'success');
        });
    };

    try {
        const response = await fetch(`${API_BASE}/user/limit/${address}`);
        const data = await response.json();
        userEventCount = data.event_count;
        userQuota = data.quota || 100;

        const remaining = userQuota - userEventCount;
        elements.eventLimit.textContent = `${t('remaining')} ${remaining} ${t('times')}`;

        // 如果配額用完則禁用按鈕
        elements.showAddEvent.disabled = remaining <= 0;
    } catch (err) {
        userEventCount = 0;
        userQuota = 100;
        elements.eventLimit.textContent = `${t('remaining')} 100 ${t('times')}`;
        elements.showAddEvent.disabled = false;
    }

    document.querySelector('.add-event-hint').textContent = t('addEventHintConnected', 'Right-click on map to add event');
    showToast(t('walletConnected'), 'success');
}

// ===== 斷開 Phantom 錢包 =====
async function disconnectPhantom() {
    // 調用後端登出 API
    if (refreshToken) {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
        } catch (err) {
            console.error(t('errorLogoutAPI', 'Logout API call failed') + ':', err);
        }
    }

    // 斷開 Phantom 錢包
    if (window.solana) {
        window.solana.disconnect();
    }

    // 清除狀態
    walletAddress = null;
    elements.connectWallet.classList.remove('hidden');
    elements.walletInfo.classList.add('hidden');
    elements.myEventsBtn.classList.add('hidden');
    if (elements.manageSubscriptionsBtn) {
        elements.manageSubscriptionsBtn.classList.add('hidden');
    }
    userEventCount = 0;
    accessToken = null;
    refreshToken = null;
    selectedSubscriptions = [];

    // 清除 localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('selectedSubscriptions');

    // 更新 UI
    elements.connectWallet.classList.remove('hidden');
    elements.walletInfo.classList.add('hidden');
    elements.showAddEvent.disabled = true;
    document.querySelector('.add-event-hint').textContent = t('addEventHint');

    showToast(t('walletDisconnected'), 'success');
    loadEvents();
}

// ===== 格式化錢包地址 =====
function formatAddress(address) {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
}
