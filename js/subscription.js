/**
 * 訂閱管理模組
 * 訂閱列表、推薦帳號、訂閱/取消訂閱操作
 */

// ===== 載入訂閱數據 =====
async function loadSubscriptionsData() {
    elements.subscriptionsLoading.classList.remove('hidden');
    elements.subscriptionsList.innerHTML = '';
    elements.subscriptionsEmpty.classList.add('hidden');

    // 從 localStorage 恢復選定的訂閱
    const savedSubscriptions = localStorage.getItem('selectedSubscriptions');
    if (savedSubscriptions) {
        selectedSubscriptions = savedSubscriptions.split(',').filter(w => w);
    }

    try {
        const response = await authenticatedFetch(`${API_BASE}/subscriptions`);
        const data = await response.json();

        elements.subscriptionsLoading.classList.add('hidden');

        // 渲染我的訂閱
        if (data.subscriptions && data.subscriptions.length > 0) {
            elements.subscriptionsList.innerHTML = generateAccountsHTML(data.subscriptions, true);
        } else {
            elements.subscriptionsEmpty.classList.remove('hidden');
        }
    } catch (err) {
        console.error('載入訂閱列表失敗:', err);
        elements.subscriptionsLoading.classList.add('hidden');
        elements.subscriptionsEmpty.classList.remove('hidden');
    }
}

// ===== 關閉訂閱管理 Modal =====
function closeSubscriptionsModal() {
    elements.managementModal.classList.add('hidden');
}

// ===== 生成帳號 HTML =====
function generateAccountsHTML(accounts, isMySubscriptions) {
    const roleLabels = {
        official: t('roleOfficial'),
        verified: t('roleVerified'),
        community: t('roleCommunity'),
        institution: t('roleInstitution'),
        user: t('roleUser')
    };

    const hasStoredSettings = localStorage.getItem('selectedSubscriptions') !== null;

    return accounts.map(account => {
        let isChecked;

        if (hasStoredSettings) {
            isChecked = selectedSubscriptions.includes(account.wallet_address);
        } else {
            isChecked = isMySubscriptions;
        }

        // 安全處理 Role Class
        const safeRole = roleLabels.hasOwnProperty(account.role) ? account.role : 'user';
        const roleLabel = roleLabels[safeRole];

        const actionBtn = isMySubscriptions
            ? `<button class="action-btn delete-btn" data-action="unsubscribe" data-wallet="${account.wallet_address}" title="${t('unsubscribe')}">🗑️</button>`
            : `<button class="action-btn add-btn" data-action="subscribe" data-wallet="${account.wallet_address}" title="${t('subscribe')}">➕</button>`;

        // 顯示名稱：優先顯示 display_name，緊接著是短錢包地址
        // 安全：對 displayName 進行 HTML 轉義防止 XSS
        const escapeHtml = (str) => str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
        const safeDisplayName = escapeHtml(account.display_name);
        const walletShort = account.wallet_address.substring(0, 8) + '...';
        const nameDisplay = safeDisplayName
            ? `<span class="subscription-name">${safeDisplayName}</span><span class="subscription-wallet">${walletShort}</span>`
            : `<span class="subscription-wallet">${account.wallet_address}</span>`;

        return `
            <div class="subscription-item">
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="subscription-checkbox" 
                        data-wallet="${account.wallet_address}" 
                        ${isChecked ? 'checked' : ''}>
                </div>
                <div class="subscription-info">
                    ${nameDisplay}
                    <span class="subscription-role ${safeRole}">${roleLabel}</span>
                </div>
                ${actionBtn}
            </div>
        `;
    }).join('');
}

// ===== 初始化訂閱列表監聽器 =====
function initSubscriptionListListeners() {
    const handleAction = (e) => {
        const btn = e.target.closest('.action-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();

            const wallet = btn.dataset.wallet;
            const action = btn.dataset.action;

            if (action === 'unsubscribe') {
                handleUnsubscribe(wallet);
            } else if (action === 'subscribe') {
                handleQuickSubscribe(wallet);
            }
            return;
        }
    };

    if (elements.subscriptionsList) {
        elements.subscriptionsList.removeEventListener('click', handleAction);
        elements.subscriptionsList.addEventListener('click', handleAction);
    }
}

// ===== 快速訂閱 =====
async function handleQuickSubscribe(targetWallet) {
    try {
        const response = await authenticatedFetch(`${API_BASE}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_wallet: targetWallet })
        });

        const data = await response.json();

        if (data.success) {
            showToast(t('subscribeSuccess', 'Subscribed successfully'), 'success');

            if (!selectedSubscriptions.includes(targetWallet)) {
                selectedSubscriptions.push(targetWallet);
                localStorage.setItem('selectedSubscriptions', selectedSubscriptions.join(','));
            }

            openSubscriptionsModal();
        } else {
            showToast(data.error || t('subscribeFailed', 'Subscription failed'), 'error');
        }
    } catch (err) {
        console.error('訂閱失敗:', err);
        showToast(t('subscribeFailed', 'Subscription failed'), 'error');
    }
}

// ===== 取消訂閱 =====
async function handleUnsubscribe(targetWallet) {
    if (!confirm(t('confirmUnsubscribe'))) return;

    try {
        const response = await authenticatedFetch(`${API_BASE}/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_wallet: targetWallet })
        });

        const data = await response.json();

        if (data.success) {
            showToast(t('unsubscribeSuccess'), 'success');
            selectedSubscriptions = selectedSubscriptions.filter(w => w !== targetWallet);
            localStorage.setItem('selectedSubscriptions', selectedSubscriptions.join(','));
            await openSubscriptionsModal();
        } else {
            showToast(data.error || t('unsubscribeFailed', 'Unsubscription failed'), 'error');
        }
    } catch (err) {
        console.error('取消訂閱失敗:', err);
        showToast(t('unsubscribeFailed', 'Unsubscription failed'), 'error');
    }
}

// ===== 手動訂閱 =====
async function handleManualSubscribe() {
    const input = elements.subscribeWalletInput;
    const targetWalletAddr = input.value.trim();

    if (!targetWalletAddr) return;

    if (targetWalletAddr.length < 32 || targetWalletAddr.length > 44) {
        showToast(t('invalidWalletAddress', 'Invalid wallet address'), 'error');
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_BASE}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_wallet: targetWalletAddr })
        });

        const data = await response.json();

        if (data.success) {
            showToast(t('subscribeSuccess', 'Subscribed successfully'), 'success');
            input.value = '';

            if (!selectedSubscriptions.includes(targetWalletAddr)) {
                selectedSubscriptions.push(targetWalletAddr);
                localStorage.setItem('selectedSubscriptions', selectedSubscriptions.join(','));
            }

            openSubscriptionsModal();
        } else {
            showToast(data.error || t('subscribeFailed', 'Subscription failed'), 'error');
        }
    } catch (err) {
        console.error('訂閱失敗:', err);
        showToast(t('subscribeFailed', 'Subscription failed'), 'error');
    }
}

// ===== 應用訂閱過濾 =====
function applySubscriptionFilter() {
    const subscriptionCheckboxes = elements.subscriptionsList.querySelectorAll('.subscription-checkbox:checked');

    const allChecked = Array.from(subscriptionCheckboxes).map(cb => cb.dataset.wallet);

    selectedSubscriptions = allChecked;
    localStorage.setItem('selectedSubscriptions', selectedSubscriptions.join(','));

    closeSubscriptionsModal();
    loadEvents();
    showToast('✅', 'success');
}

// ===== 恢復選定的訂閱 =====
function restoreSelectedSubscriptions() {
    const savedSubscriptions = localStorage.getItem('selectedSubscriptions');
    if (savedSubscriptions) {
        selectedSubscriptions = savedSubscriptions.split(',').filter(w => w);
    }
}
