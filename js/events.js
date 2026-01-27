/**
 * 事件管理模組
 * 事件載入、顯示、創建、刪除
 */

// ===== 事件載入 =====
async function loadEvents() {
    const params = new URLSearchParams();

    // 上鏈狀態過濾
    const onchainFilter = document.getElementById('onchainFilter');
    if (onchainFilter && onchainFilter.value && onchainFilter.value !== 'all') {
        params.append('onchain', onchainFilter.value);
    }

    // 事件來源過濾 (New)
    const sourceFilter = document.getElementById('sourceFilter');
    const sourceVal = sourceFilter ? sourceFilter.value : 'all';

    if (sourceVal === 'subscribed') {
        params.append('source', 'subscribed');
        // Backend should identify user from token and return subscribed events
    } else if (sourceVal === 'official') {
        params.append('source', 'official');
        // Or params.append('role', 'official'); depending on backend. Using source=official is safer given convention.
    } else if (sourceVal === 'my') {
        params.append('source', 'my');
        if (walletAddress) params.append('creator', walletAddress);
    } else {
        // Only apply manual subscription filter if source is 'all'
        if (selectedSubscriptions.length > 0) {
            params.append('subscribed_wallets', selectedSubscriptions.join(','));
        }
    }

    // 創作者過濾 (Creator Filter)
    const creatorFilter = document.getElementById('creatorFilter');
    if (creatorFilter && creatorFilter.value.trim()) {
        const val = creatorFilter.value.trim();
        // 嘗試傳遞給 creator 參數 (支持錢包地址)
        // 如果後端支持名稱搜索，也會生效
        params.append('creator', val);
    }

    // 地區過濾：使用 getSelectedRegion() 獲取選擇的地區
    if (typeof getSelectedRegion === 'function') {
        const region = getSelectedRegion();
        if (region) params.append('language', region);
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
let currentEventsData = []; // 全局事件數據，用於列表視圖

function displayEvents(events) {
    currentEventsData = events; // 存儲事件數據

    // 更新列表視圖 (如果可見)
    if (typeof renderEventGrid === 'function') {
        renderEventGrid(events);
    }

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    events.forEach(event => {
        // 安全檢查：圖標必須在白名單內，否則使用默認值
        let eventIcon = event.icon;
        if (!eventIcon || (typeof MARKER_ICONS !== 'undefined' && !MARKER_ICONS.includes(eventIcon))) {
            // Default SVG Pin
            eventIcon = `<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="none" style="color:var(--accent-primary); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        }

        const marker = L.marker([event.lat, event.lng], {
            icon: L.divIcon({
                className: 'custom-marker-svg', // Changed class name
                html: eventIcon,
                iconSize: [30, 30], // Adjusted to 30x30 (User Request: "Smaller again")
                iconAnchor: [15, 30]
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

    const startDate = new Date(event.start_date || event.date || event.timestamp);
    const validDate = !isNaN(startDate.getTime());

    if (cardStartDateOnly && cardStartTimeOnly) {
        if (validDate) {
            const dateStr = startDate.toLocaleDateString(currentUILang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const timeStr = startDate.toLocaleTimeString(currentUILang, {
                hour: '2-digit',
                minute: '2-digit'
            });
            cardStartDateOnly.textContent = dateStr;
            cardStartTimeOnly.textContent = timeStr;
        } else {
            cardStartDateOnly.textContent = 'Invalid Date';
            cardStartTimeOnly.textContent = '';
        }
    }

    // 顯示結束時間 (僅當不同於開始時間且有效時顯示)
    if (event.end_date && cardEndTimeRow) {
        const endDateObj = new Date(event.end_date);
        if (!isNaN(endDateObj.getTime())) {
            const endDateStr = endDateObj.toLocaleDateString(currentUILang, { year: 'numeric', month: 'short', day: 'numeric' });
            const endTimeStr = endDateObj.toLocaleTimeString(currentUILang, { hour: '2-digit', minute: '2-digit' });
            cardEndTimeRow.innerHTML = `${t('endTimeLabel')} <span id="cardEndDateTime">${endDateStr} ${endTimeStr}</span>`;
            cardEndTimeRow.classList.remove('hidden');
        } else {
            cardEndTimeRow.classList.add('hidden');
        }
    } else if (cardEndTimeRow) {
        cardEndTimeRow.classList.add('hidden');
    }

    elements.cardLocation.textContent = `${event.lat.toFixed(4)}, ${event.lng.toFixed(4)}`;

    // 顯示創建者名稱：優先顯示 display_name，加上短錢包地址
    const creatorName = event.creator_display_name;
    // Smart truncation: 0x12...7890
    const wallet = event.wallet_address || event.user || event.sender || '';
    const walletShort = wallet.length > 10 ? `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}` : wallet;
    elements.cardUser.textContent = creatorName ? `${creatorName} (${walletShort})` : walletShort;

    elements.cardLanguage.textContent = getRegionName(event.language);
    elements.cardDescription.textContent = event.description || t('noDescription');

    // 顯示圖片 (優先 IPFS，其次本地)
    const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
    let imageUrl = null;

    if (event.ipfs_hash) {
        // IPFS 圖片
        imageUrl = IPFS_GATEWAY + event.ipfs_hash;
    } else if (event.image_path) {
        // 本地圖片
        imageUrl = event.image_path;
    }

    if (imageUrl) {
        elements.cardImg.src = imageUrl;
        elements.cardImage.classList.remove('hidden');
        elements.cardImg.onclick = () => openLightbox(imageUrl);
    } else {
        elements.cardImage.classList.add('hidden');
        elements.cardImg.onclick = null;
    }

    // 顯示 Solana 交易連結 (如果是上鏈事件)
    const cardSolanaTx = document.getElementById('cardSolanaTx');
    const cardSolanaTxLink = document.getElementById('cardSolanaTxLink');
    if (event.tx_signature && event.storage_mode === 'onchain' && cardSolanaTx && cardSolanaTxLink) {
        const network = event.tx_network || 'devnet';
        // Mainnet 不需要 cluster 參數
        const explorerUrl = (network === 'mainnet')
            ? `https://explorer.solana.com/tx/${event.tx_signature}`
            : `https://explorer.solana.com/tx/${event.tx_signature}?cluster=${network}`;
        cardSolanaTxLink.href = explorerUrl;
        cardSolanaTx.classList.remove('hidden');
    } else if (cardSolanaTx) {
        cardSolanaTx.classList.add('hidden');
    }

    // 設置打賞按鈕
    const cardTipBtn = document.getElementById('cardTipBtn');
    const tipOptions = document.getElementById('tipOptions');
    if (cardTipBtn) {
        cardTipBtn.dataset.wallet = event.wallet_address;
        // 不能打賞自己
        if (walletAddress && event.wallet_address === walletAddress) {
            cardTipBtn.classList.add('hidden');
        } else {
            cardTipBtn.classList.remove('hidden');
        }
        // 隱藏選項
        if (tipOptions) tipOptions.classList.add('hidden');
    }

    // 設置分享按鈕
    const cardShareBtn = document.getElementById('cardShareBtn');
    if (cardShareBtn) {
        cardShareBtn.dataset.eventName = event.name;
        cardShareBtn.dataset.eventId = event.id;
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

    // 重設上鏈過濾器
    const onchainFilter = document.getElementById('onchainFilter');
    if (onchainFilter) onchainFilter.value = 'all';

    // 重設來源過濾器
    const sourceFilter = document.getElementById('sourceFilter');
    if (sourceFilter) sourceFilter.value = 'all';

    // 重設創作者過濾器
    const creatorFilter = document.getElementById('creatorFilter');
    if (creatorFilter) creatorFilter.value = '';

    loadEvents();
    showToast(t('filtersCleared'), 'success');
}

// ===== 列表視圖渲染 =====
function renderEventGrid(events) {
    const eventGrid = document.getElementById('eventGrid');
    const listEventCount = document.getElementById('listEventCount');
    if (!eventGrid) return;

    // 更新事件計數
    if (listEventCount) {
        listEventCount.textContent = `${events.length} ${t('events') || '事件'}`;
    }

    // 清空並重建
    eventGrid.innerHTML = '';

    if (events.length === 0) {
        eventGrid.innerHTML = `
            <div class="list-empty-state">
                <svg class="empty-state-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:80px;height:80px;opacity:0.4;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p>${t('noEventsFound') || '沒有找到符合條件的事件'}</p>
            </div>
        `;
        return;
    }

    const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-list-card';
        card.onclick = () => showEventCard(event);

        // 圖片處理
        let imageHtml = '';
        if (event.ipfs_hash) {
            imageHtml = `<img class="card-thumbnail" src="${IPFS_GATEWAY}${event.ipfs_hash}" alt="${event.name}" onerror="this.style.display='none'">`;
        } else if (event.image_path) {
            imageHtml = `<img class="card-thumbnail" src="${event.image_path}" alt="${event.name}" onerror="this.style.display='none'">`;
        } else {
            // 使用 Map SVG 作為預設圖標
            imageHtml = `
            <div class="card-thumbnail-placeholder">
                <svg class="icon-svg" style="width:48px;height:48px;opacity:0.5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>`;
        }

        // 日期格式化
        const eventDate = event.start_date || event.date;
        const formattedDate = eventDate ? new Date(eventDate).toLocaleDateString() : '';

        // 標籤處理
        const tags = event.event_type ? event.event_type.split(',').slice(0, 2).map(t => t.trim()).filter(t => t) : [];
        const tagsHtml = tags.map(tag => `<span class="tag-small">${tag}</span>`).join('');

        // PoE 徽章
        const poeHtml = (event.storage_mode === 'onchain' && event.tx_signature)
            ? `<span class="poe-badge-small">
                <svg class="icon-svg" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PoE
               </span>`
            : '';

        card.innerHTML = `
            ${imageHtml}
            <div class="card-body">
                <h3 class="card-title">${event.name}</h3>
                
                <!-- Creator Info (New Field) -->
                <div class="card-creator-info" style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; display:flex; align-items:center; gap:4px;">
                   <span>👤</span>
                   <span class="creator-name">${event.creator_display_name || (event.wallet_address ? event.wallet_address.substring(0, 6) + '...' : 'Unknown')}</span>
                   ${event.role === 'official' || event.role === 'verified' ? 'verified' : ''} 
                </div>

                <div class="card-meta-row">
                    <span class="card-meta-item">📅 ${formattedDate}</span>
                    <span class="card-meta-item">📍 ${event.lat?.toFixed(2)}, ${event.lng?.toFixed(2)}</span>
                </div>
                <p class="card-description">${event.description || ''}</p>
                <div class="card-footer">
                    <div class="card-tags">${tagsHtml}</div>
                    ${poeHtml}
                </div>
            </div>
        `;

        eventGrid.appendChild(card);
    });
}

// ===== 視圖切換初始化 =====
function initViewToggle() {
    const mapViewBtn = document.getElementById('mapViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const mapView = document.getElementById('mapView');
    const listView = document.getElementById('listView');

    if (!mapViewBtn || !listViewBtn || !mapView || !listView) return;

    function switchToMapView() {
        mapViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        mapView.classList.remove('hidden');
        listView.classList.add('hidden');
        // 修復地圖尺寸
        if (map) map.invalidateSize();
    }

    function switchToListView() {
        listViewBtn.classList.add('active');
        mapViewBtn.classList.remove('active');
        listView.classList.remove('hidden');
        mapView.classList.add('hidden');
        // 重新渲染列表
        renderEventGrid(currentEventsData);
    }

    mapViewBtn.addEventListener('click', switchToMapView);
    listViewBtn.addEventListener('click', switchToListView);
}

// 在 DOMContentLoaded 時初始化
document.addEventListener('DOMContentLoaded', () => {
    initViewToggle();
});
