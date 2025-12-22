/**
 * 地圖管理模組
 * 地圖初始化、標記、右鍵選單
 */

// ===== 地圖初始化 =====
function initMap() {
    // 檢測瀏覽器主題偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = safeLocalStorage.getItem('theme');
    isDarkTheme = savedTheme ? (savedTheme === 'dark') : prefersDark;

    // 應用主題
    document.body.classList.toggle('dark-theme', isDarkTheme);
    if (elements.themeIcon) {
        elements.themeIcon.textContent = isDarkTheme ? '☀️' : '🌙';
    }

    map = L.map('map', {
        center: [25, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        worldCopyJump: true
    });

    const tileUrl = isDarkTheme ? MAP_TILES.dark : MAP_TILES.light;
    currentTileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // 右鍵選單事件
    map.on('contextmenu', (e) => {
        if (!walletAddress) {
            showToast(t('pleaseConnectWallet'), 'error');
            return;
        }

        contextMenuLatLng = e.latlng;

        // 更新經緯度顯示
        elements.contextLat.textContent = e.latlng.lat.toFixed(4);
        elements.contextLng.textContent = e.latlng.lng.toFixed(4);

        showContextMenu(e.originalEvent.pageX, e.originalEvent.pageY);
        showLocationMarker(e.containerPoint);
    });

    // 地圖移動時隱藏選單和標記
    map.on('movestart', () => {
        hideContextMenu();
        hideLocationMarker();
    });

    map.on('click', () => {
        hideContextMenu();
        hideLocationMarker();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) {
            hideContextMenu();
            hideLocationMarker();
        }
    });
}

// ===== 位置指針 =====
function showLocationMarker(containerPoint) {
    elements.locationMarker.style.left = `${containerPoint.x}px`;
    elements.locationMarker.style.top = `${containerPoint.y}px`;
    elements.locationMarker.classList.remove('hidden');
}

function hideLocationMarker() {
    elements.locationMarker.classList.add('hidden');
}

// ===== 右鍵選單 =====
function showContextMenu(x, y) {
    elements.contextMenu.style.left = `${x}px`;
    elements.contextMenu.style.top = `${y}px`;
    elements.contextMenu.classList.remove('hidden');
}

function hideContextMenu() {
    elements.contextMenu.classList.add('hidden');
}

// ===== 地圖主題切換 =====
function toggleMapTheme() {
    isDarkTheme = !isDarkTheme;

    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }

    const tileUrl = isDarkTheme ? MAP_TILES.dark : MAP_TILES.light;
    currentTileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; Contributors',
        maxZoom: 20
    }).addTo(map);

    document.body.classList.toggle('dark-theme', isDarkTheme);
    safeLocalStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

    elements.themeIcon.textContent = isDarkTheme ? '☀️' : '🌙';
}

// ===== 面板收起/展開 =====
function togglePanel() {
    isPanelCollapsed = !isPanelCollapsed;
    const filterPanel = document.querySelector('.filter-panel');
    const panelToggle = document.querySelector('.panel-toggle');

    if (filterPanel) {
        filterPanel.classList.toggle('collapsed', isPanelCollapsed);
    }
    if (panelToggle) {
        panelToggle.classList.toggle('collapsed', isPanelCollapsed);
    }
    elements.toggleIcon.textContent = isPanelCollapsed ? '▶' : '◀';
}
