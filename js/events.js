/**
 * 事件管理模組
 * 事件載入、顯示、創建、刪除
 */

// ===== 事件載入 =====
async function loadEvents() {
    const params = new URLSearchParams();

    // 如果有選定的訂閱帳號，傳送給後端
    if (selectedSubscriptions.length > 0) {
        params.append('subscribed_wallets', selectedSubscriptions.join(','));
    }

    if (elements.startDate.value) params.append('start_date', elements.startDate.value);
    if (elements.endDate.value) params.append('end_date', elements.endDate.value);
    if (elements.dateFilterMode && elements.dateFilterMode.value) params.append('filter_mode', elements.dateFilterMode.value);
    if (elements.eventTypeFilter.value) params.append('event_type', elements.eventTypeFilter.value);
    // 地區過濾：使用 getSelectedRegion() 獲取選擇的地區
    // 注意：API 參數名為 'language' 是為了向後兼容，但實際傳遞的是地區代碼
    if (typeof getSelectedRegion === 'function') {
        const region = getSelectedRegion();
        if (region) params.append('language', region);  // 參數名為 language，值為地區代碼
    }

    try {
        const fetchOptions = {};
        if (accessToken) {
            fetchOptions.headers = {
                'Authorization': `Bearer ${accessToken}`
            };
        }

        const response = await fetch(`${API_BASE}/events?${params}`, fetchOptions);
        const events = await response.json();
        displayEvents(events);
    } catch (err) {
        showToast(t('loadError'), 'error');
        console.error(err);
    }
}

// ===== 顯示事件標記 =====
function displayEvents(events) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    events.forEach(event => {
        // 安全檢查：圖標必須在白名單內，否則使用默認值
        let eventIcon = event.icon || '📍';
        if (typeof MARKER_ICONS !== 'undefined' && !MARKER_ICONS.includes(eventIcon)) {
            eventIcon = '📍';
        }

        const marker = L.marker([event.lat, event.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: eventIcon, // 已驗證安全的圖標
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        });

        marker.on('click', () => showEventCard(event));

        marker.bindTooltip(event.name.replace(/</g, '&lt;').replace(/>/g, '&gt;'), { // 簡單轉義
            permanent: false,
            direction: 'top',
            className: 'event-tooltip'
        });

        marker.addTo(map);
        markers.push(marker);
    });
}

// ===== 顯示事件卡片 =====
function showEventCard(event) {
    elements.cardTitle.textContent = event.name;

    const tags = event.event_type ? event.event_type.split(',').map(t => t.trim()).filter(t => t) : [];

    // 使用安全的 DOM 操作而非 innerHTML
    elements.cardTags.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        elements.cardTags.appendChild(span);
    });

    // 顯示開始日期和時間
    const cardStartDateOnly = document.getElementById('cardStartDateOnly');
    const cardStartTimeOnly = document.getElementById('cardStartTimeOnly');
    const cardEndTimeRow = document.getElementById('cardEndTimeRow');

    if (cardStartDateOnly && cardStartTimeOnly) {
        const startDateObj = new Date(event.start_date || event.date);
        const dateStr = startDateObj.toLocaleDateString(currentUILang, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const timeStr = startDateObj.toLocaleTimeString(currentUILang, {
            hour: '2-digit',
            minute: '2-digit'
        });
        cardStartDateOnly.textContent = dateStr;
        cardStartTimeOnly.textContent = timeStr;
    }

    // 顯示結束時間
    if (event.end_date && cardEndTimeRow) {
        const endDateObj = new Date(event.end_date);
        const endDateStr = endDateObj.toLocaleDateString(currentUILang, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const endTimeStr = endDateObj.toLocaleTimeString(currentUILang, {
            hour: '2-digit',
            minute: '2-digit'
        });
        cardEndTimeRow.innerHTML = `${t('endTimeLabel')} <span id="cardEndDateTime">${endDateStr} ${endTimeStr}</span>`;
        cardEndTimeRow.classList.remove('hidden');
    } else if (cardEndTimeRow) {
        cardEndTimeRow.classList.add('hidden');
    }

    elements.cardLocation.textContent = `${event.lat.toFixed(4)}, ${event.lng.toFixed(4)}`;

    // 顯示創建者名稱：優先顯示 display_name，加上短錢包地址
    const creatorName = event.creator_display_name;
    const walletShort = (event.wallet_address || event.user || '').substring(0, 8) + '...';
    elements.cardUser.textContent = creatorName ? `${creatorName} (${walletShort})` : walletShort;

    elements.cardLanguage.textContent = getRegionName(event.language);
    elements.cardDescription.textContent = event.description || t('noDescription');

    // 顯示圖片
    if (event.image_path) {
        elements.cardImg.src = event.image_path;
        elements.cardImage.classList.remove('hidden');

        // 點擊放大
        elements.cardImg.onclick = () => openLightbox(event.image_path);
    } else {
        elements.cardImage.classList.add('hidden');
        elements.cardImg.onclick = null;
    }

    // 顯示 Solana 交易連結 (如果是上鏈事件)
    const cardSolanaTx = document.getElementById('cardSolanaTx');
    const cardSolanaTxLink = document.getElementById('cardSolanaTxLink');
    if (event.tx_signature && event.storage_mode === 'onchain' && cardSolanaTx && cardSolanaTxLink) {
        const network = event.tx_network || 'devnet';
        const explorerUrl = `https://explorer.solana.com/tx/${event.tx_signature}?cluster=${network}`;
        cardSolanaTxLink.href = explorerUrl;
        cardSolanaTx.classList.remove('hidden');
    } else if (cardSolanaTx) {
        cardSolanaTx.classList.add('hidden');
    }

    // 顯示創建者信息和訂閱按鈕
    loadCreatorInfo(event.wallet_address);

    elements.eventCard.classList.remove('hidden');
}

// ===== 載入創建者資訊 =====
async function loadCreatorInfo(creatorWallet) {
    const roleLabels = {
        official: t('roleOfficial'),
        verified: t('roleVerified'),
        community: t('roleCommunity'),
        institution: t('roleInstitution'),
        user: t('roleUser')
    };

    try {
        const fetchOptions = {};
        if (accessToken) {
            fetchOptions.headers = { 'Authorization': `Bearer ${accessToken}` };
        }

        const response = await fetch(`${API_BASE}/user/profile/${creatorWallet}`, fetchOptions);
        const profile = await response.json();

        // 顯示角色徽章
        const role = profile.role || 'user';
        elements.cardCreatorRole.textContent = roleLabels[role] || roleLabels.user;
        elements.cardCreatorRole.className = `creator-role-badge ${role}`;

        // 顯示訂閱者數量
        const subCount = profile.subscriber_count || 0;
        elements.cardSubscriberCount.textContent = `${subCount} ${t('subscribers')}`;

        // 設置訂閱按鈕狀態
        elements.cardSubscribeBtn.dataset.wallet = creatorWallet;

        if (walletAddress && creatorWallet === walletAddress) {
            elements.cardSubscribeBtn.classList.add('hidden');
        } else {
            elements.cardSubscribeBtn.classList.remove('hidden');

            if (profile.is_following) {
                elements.cardSubscribeBtn.classList.add('subscribed');
                elements.cardSubscribeBtn.innerHTML = `<span>${t('subscribed')}</span>`;
            } else {
                elements.cardSubscribeBtn.classList.remove('subscribed');
                elements.cardSubscribeBtn.innerHTML = `<span>${t('subscribe')}</span>`;
            }
        }

        if (!walletAddress) {
            elements.cardSubscribeBtn.classList.add('hidden');
        }

    } catch (err) {
        console.error('載入創建者資訊失敗:', err);
        elements.cardCreatorRole.textContent = roleLabels.user;
        elements.cardCreatorRole.className = 'creator-role-badge user';
        elements.cardSubscriberCount.textContent = '';
        elements.cardSubscribeBtn.classList.add('hidden');
    }
}

// ===== 訂閱/取消訂閱 =====
async function toggleSubscribe(targetWallet) {
    if (!walletAddress) {
        showToast(t('pleaseConnectWallet'), 'error');
        return;
    }

    const isSubscribed = elements.cardSubscribeBtn.classList.contains('subscribed');
    const endpoint = isSubscribed ? '/unsubscribe' : '/subscribe';

    try {
        const response = await authenticatedFetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_wallet: targetWallet })
        });

        const result = await response.json();

        if (result.success) {
            if (isSubscribed) {
                elements.cardSubscribeBtn.classList.remove('subscribed');
                elements.cardSubscribeBtn.innerHTML = `<span>${t('subscribe')}</span>`;
                showToast(t('unsubscribe') + ' ✓', 'success');
            } else {
                elements.cardSubscribeBtn.classList.add('subscribed');
                elements.cardSubscribeBtn.innerHTML = `<span>${t('subscribed')}</span>`;
                showToast(t('subscribe') + ' ✓', 'success');
            }

            loadCreatorInfo(targetWallet);
        } else {
            showToast(result.error || 'Error', 'error');
        }
    } catch (err) {
        console.error('訂閱操作失敗:', err);
        showToast(t('networkError'), 'error');
    }
}

// ===== 格式化日期 =====
function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString(currentUILang, options);
}

function getRegionName(code) {
    if (typeof REGIONS === 'undefined') return code;
    const region = REGIONS.find(r => r.code === code);
    return region ? t(region.nameKey) || region.nameKey : code;
}

// ===== 過濾器 =====
function clearFilters() {
    elements.startDate.value = '';
    elements.endDate.value = '';
    elements.eventTypeFilter.value = '';
    document.querySelectorAll('.lang-filter-btn').forEach(btn => btn.classList.remove('active'));

    document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('active'));

    loadEvents();
    showToast(t('filtersCleared'), 'success');
}
