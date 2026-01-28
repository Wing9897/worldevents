/**
 * 探索帳號視圖模組
 * 公開顯示推薦帳號，無需登入即可查看
 */

// 緩存訂閱狀態
let subscribedWallets = new Set();

// ===== 載入推薦帳號 =====
async function loadExploreAccounts(query = '') {
    const loading = document.getElementById('exploreLoading');
    const grid = document.getElementById('accountGrid');
    const empty = document.getElementById('exploreEmpty');
    const countEl = document.getElementById('exploreAccountCount');

    if (!grid) return;

    loading.classList.remove('hidden');
    grid.innerHTML = '';
    empty.classList.add('hidden');

    try {
        // 如果已登入，先獲取訂閱列表
        if (walletAddress && accessToken) {
            try {
                const subResponse = await authenticatedFetch(`${API_BASE}/subscriptions`);
                const subData = await subResponse.json();
                subscribedWallets = new Set((subData.subscriptions || []).map(s => s.wallet_address));
            } catch (e) {
                console.warn('獲取訂閱列表失敗:', e);
            }
        }

        // 公開 API，無需認證
        const url = query
            ? `${API_BASE}/explore/accounts?q=${encodeURIComponent(query)}`
            : `${API_BASE}/explore/accounts`;

        const response = await fetch(url);
        const data = await response.json();

        loading.classList.add('hidden');

        const accounts = data.accounts || [];

        if (accounts.length === 0) {
            empty.classList.remove('hidden');
            if (countEl) countEl.textContent = '';
            return;
        }

        if (countEl) {
            countEl.textContent = `${accounts.length} ${t('accounts', '帳號')}`;
        }

        renderExploreAccounts(accounts, grid);
    } catch (err) {
        console.error('載入探索帳號失敗:', err);
        loading.classList.add('hidden');
        empty.classList.remove('hidden');
    }
}

// ===== 初始化搜尋功能 =====
function initExploreSearch() {
    const input = document.getElementById('exploreSearchInput');
    if (!input) return;

    let debounceTimer;
    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadExploreAccounts(e.target.value.trim());
        }, 300); // 300ms debounce
    });
}

// ===== 渲染帳號卡片 =====
function renderExploreAccounts(accounts, container) {
    const roleLabels = {
        official: t('roleOfficial', '官方'),
        verified: t('roleVerified', '認證'),
        community: t('roleCommunity', '社群'),
        institution: t('roleInstitution', '機構'),
        user: t('roleUser', '用戶')
    };

    accounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'account-card';

        const safeRole = roleLabels.hasOwnProperty(account.role) ? account.role : 'user';
        const roleLabel = roleLabels[safeRole];

        // 安全的名稱顯示
        const displayName = account.display_name
            ? escapeHtml(account.display_name)
            : account.wallet_address.substring(0, 8) + '...';

        const walletShort = account.wallet_address.substring(0, 8) + '...' + account.wallet_address.slice(-4);

        // 頭像顯示
        const avatarHtml = account.avatar_path
            ? `<img class="account-avatar-img" src="${escapeHtml(account.avatar_path)}" alt="avatar" onerror="this.outerHTML='<span class=\\'account-avatar\\'>👤</span>'">`
            : '<span class="account-avatar">👤</span>';

        // 檢查是否已訂閱
        const isSubscribed = subscribedWallets.has(account.wallet_address);
        const isOwnAccount = walletAddress === account.wallet_address;

        // 按鈕狀態
        let buttonHtml = '';
        if (isOwnAccount) {
            buttonHtml = ''; // 不顯示訂閱按鈕給自己
        } else if (isSubscribed) {
            buttonHtml = `<button class="btn btn-subscribe-card subscribed" data-wallet="${account.wallet_address}">${t('subscribed', '已訂閱')}</button>`;
        } else {
            buttonHtml = `<button class="btn btn-subscribe-card" data-wallet="${account.wallet_address}">${t('subscribe', '訂閱')}</button>`;
        }

        card.innerHTML = `
            <div class="account-card-header">
                ${avatarHtml}
                <div class="account-info">
                    <span class="account-name">${displayName}</span>
                    <span class="account-wallet">${walletShort}</span>
                </div>
                <span class="account-role ${safeRole}">${roleLabel}</span>
            </div>
            <div class="account-card-stats">
                <span class="stat-item">
                    <svg class="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5V3a2 2 0 012-2h2a2 2 0 012 2v2"/>
                    </svg>
                    ${account.event_count || 0} ${t('events', '事件')}
                </span>
                <span class="stat-item">
                    <svg class="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    ${account.subscriber_count || 0} ${t('subscribers', '訂閱者')}
                </span>
            </div>
            ${buttonHtml}
        `;

        // 訂閱/取消訂閱按鈕事件
        const subscribeBtn = card.querySelector('.btn-subscribe-card');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => handleExploreSubscribe(account.wallet_address, subscribeBtn));
        }

        container.appendChild(card);
    });
}

// ===== 處理訂閱/取消訂閱 =====
async function handleExploreSubscribe(targetWallet, btn) {
    if (!walletAddress) {
        showToast(t('pleaseConnectWallet'), 'error');
        return;
    }

    // 防止重複點擊
    if (btn.disabled) return;
    btn.disabled = true;
    btn.style.opacity = '0.6';

    const isSubscribed = btn.classList.contains('subscribed');
    const endpoint = isSubscribed ? '/unsubscribe' : '/subscribe';

    try {
        const response = await authenticatedFetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_wallet: targetWallet })
        });

        const data = await response.json();

        if (data.success) {
            if (isSubscribed) {
                btn.classList.remove('subscribed');
                btn.textContent = t('subscribe', '訂閱');
                subscribedWallets.delete(targetWallet);
                showToast(t('unsubscribe', '取消訂閱') + ' ✓', 'success');
            } else {
                btn.classList.add('subscribed');
                btn.textContent = t('subscribed', '已訂閱');
                subscribedWallets.add(targetWallet);
                showToast(t('subscribe', '訂閱') + ' ✓', 'success');
            }
        } else {
            showToast(data.error || t('subscribeFailed'), 'error');
        }
    } catch (err) {
        console.error('訂閱操作失敗:', err);
        showToast(t('subscribeFailed'), 'error');
    } finally {
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

// ===== HTML 轉義 =====
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initExploreSearch();
});

// ===== 導出到全局 =====
window.loadExploreAccounts = loadExploreAccounts;
window.initExploreSearch = initExploreSearch;
