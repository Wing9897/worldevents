/**
 * UI 工具函數
 * Toast 通知、Modal 控制等通用 UI 功能
 */

const MAX_TOASTS = 3;  // 最多同時顯示 3 個 toast

/**
 * 顯示 Toast 通知
 * @param {string} message - 通知訊息
 * @param {string} type - 類型: 'success', 'error', 'info'
 * @param {number} duration - 顯示時間 (毫秒)
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container not found');
        return;
    }

    // 限制最多 MAX_TOASTS 個 toast
    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length >= MAX_TOASTS) {
        // 移除最舊的 toast (第一個)
        const oldestToast = existingToasts[0];
        oldestToast.classList.remove('show');
        setTimeout(() => oldestToast.remove(), 300);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // 觸發動畫
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 自動移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * 取得翻譯文字
 * @param {string} key - 翻譯鍵
 * @param {string} fallback - 備用文字
 * @returns {string}
 */
function t(key, fallback = '') {
    const lang = I18N[currentUILang] || I18N['zh-tw'] || {};
    return lang[key] || fallback || key;
}

/**
 * 更新頁面所有 data-i18n 元素的翻譯
 */
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);
        if (translated && translated !== key) {
            el.textContent = translated;
        }
    });

    // 更新 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = t(key);
        if (translated && translated !== key) {
            el.placeholder = translated;
        }
    });
}

/**
 * 取得國旗圖片 URL
 * @param {string} countryCode - 國家代碼
 * @returns {string}
 */
function getFlagUrl(countryCode) {
    if (countryCode === 'un') {
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/40px-Flag_of_the_United_Nations.svg.png';
    }
    return `${CONFIG.FLAG_CDN}/${countryCode}.png`;
}

/**
 * 將國家/地區代碼轉換為 Emoji 國旗
 * @param {string} countryCode - 2 字母國家代碼 (ISO 3166-1 alpha-2)
 * @returns {string} 國旗 emoji 或地球符號
 */
function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode === 'earth' || countryCode === 'un') {
        return '🌐'; // 地球表示「全部地區」
    }
    const code = countryCode.toUpperCase();
    // 將字母轉換為區域指示符號 (例如 'TW' -> 🇹🇼)
    return String.fromCodePoint(
        ...code.split('').map(char => 0x1F1E6 - 65 + char.charCodeAt(0))
    );
}

/**
 * 格式化日期時間
 * @param {string} dateStr - ISO 日期字串
 * @param {boolean} includeTime - 是否包含時間
 * @returns {string}
 */
function formatDateTime(dateStr, includeTime = true) {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }

    return date.toLocaleString(currentUILang, options);
}

/**
 * 複製文字到剪貼板
 * @param {string} text - 要複製的文字
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(t('addressCopied'), 'success');
    } catch (err) {
        console.error('複製失敗:', err);
    }
}

/**
 * 縮短錢包地址顯示
 * @param {string} address - 完整地址
 * @param {number} startLen - 開頭保留長度
 * @param {number} endLen - 結尾保留長度
 * @returns {string}
 */

/**
 * 縮短錢包地址顯示
 * @param {string} address - 完整地址
 * @param {number} startLen - 開頭保留長度
 * @param {number} endLen - 結尾保留長度
 * @returns {string}
 */
function shortenAddress(address, startLen = 6, endLen = 4) {
    if (!address || address.length <= startLen + endLen) return address;
    return `${address.slice(0, startLen)}...${address.slice(-endLen)}`;
}

// ===== 日期處理與快速選擇 =====

/**
 * 初始化快速日期選擇按鈕
 */
function initQuickDates() {
    const btns = document.querySelectorAll('.quick-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.quick-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setDefaultDateRange(btn.dataset.range);

            // 如果 loadEvents 存在，則重新加載
            if (typeof loadEvents === 'function') {
                loadEvents();
            }
        });
    });
}

/**
 * 設置默認日期範圍
 * @param {string} range - 範圍代碼 (today, week, etc.)
 */
function setDefaultDateRange(range) {
    if (typeof elements === 'undefined' || !elements.startDate) return;

    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (range) {
        case '1h':
            startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
            endDate = now;
            break;
        case '3h':
            startDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
            endDate = now;
            break;
        case '6h':
            startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            endDate = now;
            break;
        case '12h':
            startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
            endDate = now;
            break;
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            break;
        case 'week':
            const dayOfWeek = now.getDay() || 7;
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + 1, 0, 0, 0);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6, 23, 59, 59);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            break;
        case 'all':
            elements.startDate.value = '';
            elements.endDate.value = '';
            return;
    }

    elements.startDate.value = formatDateForInput(startDate);
    elements.endDate.value = formatDateForInput(endDate);
}

/**
 * 格式化日期為 Input 可用格式
 */
function formatDateTimeForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateForInput(date) {
    return formatDateTimeForInput(date);
}

/**
 * 初始化緊湊型語言選擇器 (walletInfo 內)
 */
function initLangCompact() {
    const btn = elements.langBtnCompact;
    const dropdown = elements.langDropdownCompact;
    const flagImg = elements.currentFlagCompact;
    if (!btn || !dropdown) return;

    // 填充選項
    dropdown.innerHTML = '';
    if (typeof LANGUAGES !== 'undefined') {
        LANGUAGES.forEach(lang => {
            if (!lang.code) return;
            const option = document.createElement('div');
            option.className = 'language-option';
            option.dataset.lang = lang.code;
            option.dataset.flag = lang.countryCode;
            option.innerHTML = `
                <img class="flag-icon" src="${getFlagUrl(lang.countryCode)}" alt="${lang.name}">
                <span class="lang-name">${lang.name}</span>
            `;
            option.addEventListener('click', () => {
                selectCompactLanguage(lang);
                dropdown.classList.add('hidden');
            });
            dropdown.appendChild(option);
        });
    }

    // 切換下拉
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });

    // 點擊外部關閉
    document.addEventListener('click', (e) => {
        if (!elements.langCompact?.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // 設置初始語言國旗（必須與 currentUILang 同步）
    // 注意：currentUILang 可能已經在 app.js 中通過 updateUILanguage 設置
    // 我們需要確保國旗顯示與實際的 UI 語言一致

    // 等待 currentUILang 初始化完成，然後同步國旗
    setTimeout(() => {
        const activeLang = LANGUAGES.find(l => l.code === currentUILang);
        if (activeLang && flagImg) {
            flagImg.src = getFlagUrl(activeLang.countryCode);
            flagImg.alt = activeLang.name;
        }
    }, 100); // 短暫延遲以確保 currentUILang 已被 updateUILanguage 設置
}

/**
 * 選擇緊湊型語言
 */
function selectCompactLanguage(lang) {
    const flagImg = elements.currentFlagCompact;
    if (flagImg) {
        flagImg.src = getFlagUrl(lang.countryCode);
        flagImg.alt = lang.name;
    }

    // 1. 先更新全局狀態和存儲，確保後續邏輯讀取到最新語言
    currentUILang = lang.code;
    localStorage.setItem('uiLang', lang.code);
    if (typeof saveState === 'function') saveState(); // js/state.js

    // 2. 更新全部地區下拉菜單 (依賴 currentUILang)
    refreshRegionDropdown();

    // 3. 更新全站 UI 文字並重新載入事件 (updateUILanguage 會調用 loadEvents)
    if (typeof updateUILanguage === 'function') {
        updateUILanguage(lang.code);
    }
}

/**
 * 刷新地區下拉選單翻譯
 */
function refreshRegionDropdown() {
    const dropdown = elements.regionDropdown;
    const nameSpan = elements.currentRegionName;
    if (!dropdown) return;

    // 更新下拉選項文字
    dropdown.querySelectorAll('.region-option').forEach(opt => {
        const nameKey = opt.dataset.nameKey || REGIONS.find(r => r.code === opt.dataset.region)?.nameKey;
        if (nameKey) {
            const nameEl = opt.querySelector('.region-name');
            if (nameEl) nameEl.textContent = t(nameKey, nameKey);
        }
    });

    // 更新當前選擇的顯示文字
    const currentRegion = REGIONS.find(r => r.code === selectedRegion);
    if (currentRegion && nameSpan) {
        nameSpan.textContent = t(currentRegion.nameKey, currentRegion.nameKey);
    }
}

/**
 * 初始化地區過濾器
 */
let selectedRegion = '';
function initRegionFilter() {
    const btn = elements.regionBtn;
    const dropdown = elements.regionDropdown;
    const flagImg = elements.currentRegionFlag;
    const nameSpan = elements.currentRegionName;
    if (!btn || !dropdown) return;

    // 填充選項
    dropdown.innerHTML = '';
    if (typeof REGIONS !== 'undefined') {
        REGIONS.forEach(region => {
            const option = document.createElement('div');
            option.className = 'region-option';
            option.dataset.region = region.code;
            option.dataset.flag = region.flag;
            option.dataset.nameKey = region.nameKey;

            const displayName = t(region.nameKey, region.nameKey);
            option.innerHTML = `
                <img class="flag-icon" src="${getFlagUrl(region.flag)}" alt="${displayName}">
                <span class="region-name">${displayName}</span>
            `;
            option.addEventListener('click', () => {
                selectRegion(region);
                dropdown.classList.add('hidden');
                btn.classList.remove('open');
            });
            dropdown.appendChild(option);
        });
    }

    // 切換下拉
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        btn.classList.toggle('open');
    });

    // 點擊外部關閉
    document.addEventListener('click', (e) => {
        if (!elements.regionSelector?.contains(e.target)) {
            dropdown.classList.add('hidden');
            btn.classList.remove('open');
        }
    });

    // 智能分離默認設置：
    // 雖然架構上完全分離，但為了提升 UX，初次加載時嘗試根據瀏覽器語言 "智能建議" 地區
    // 如果匹配不到，則默認為 "全部地區"，保持中立

    let defaultRegionCode = '';
    try {
        const browserLang = navigator.language || navigator.userLanguage || '';
        if (browserLang) {
            const parts = browserLang.toLowerCase().split('-');
            if (parts.length > 1) {
                // 格式如 zh-tw, en-us: 直接取地區碼
                defaultRegionCode = parts[1];
            } else {
                // 格式如 ja, ko, es: 嘗試映射到主要國家
                const langMap = {
                    'ja': 'jp', 'ko': 'kr', 'en': 'us',
                    'pt': 'br', 'zh': 'cn'
                };
                defaultRegionCode = langMap[parts[0]] || parts[0];
            }
        }
    } catch (e) {
        console.warn('Auto-detect region failed:', e);
    }

    // 嘗試在支持的列表中尋找匹配
    const matchedRegion = REGIONS.find(r => r.code === defaultRegionCode);

    if (matchedRegion) {
        // 命中！智能預選該地區
        selectRegion(matchedRegion);
    } else {
        // 未命中 (或瀏覽器語言無法識別)，嚴格默認為「全部地區」
        if (flagImg) flagImg.src = getFlagUrl('un');
        if (nameSpan) nameSpan.textContent = t('allRegions', '全部地區');
        selectedRegion = '';
    }
}

/**
 * 選擇地區
 */
function selectRegion(region) {
    const flagImg = elements.currentRegionFlag;
    const nameSpan = elements.currentRegionName;
    const displayName = t(region.nameKey, region.nameKey);

    if (flagImg) flagImg.src = getFlagUrl(region.flag);
    if (nameSpan) nameSpan.textContent = displayName;

    selectedRegion = region.code;

    // 更新選項高亮
    elements.regionDropdown?.querySelectorAll('.region-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.region === region.code);
    });

    // 重新載入事件
    if (typeof loadEvents === 'function') loadEvents();
}

/**
 * 獲取當前選擇的地區
 */
function getSelectedRegion() {
    return selectedRegion;
}
// ===== Lightbox (Image Zoom) =====
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Close on background click
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Global listeners for lightbox
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('lightboxClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});
