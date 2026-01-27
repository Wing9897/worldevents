/**
 * UI 工具函數
 * Toast 通知、Modal 控制等通用 UI 功能
 */

const MAX_TOASTS = 3;  // 最多同時顯示 3 個 toast

const ICONS = {
    globe: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    sun: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
    moon: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`,
    chevronLeft: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>`,
    chevronRight: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>`
};

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
 * 將國家/地區代碼轉換為 SVG 圖標
 * @param {string} countryCode - 2 字母國家代碼 (ISO 3166-1 alpha-2)
 * @returns {string} SVG string
 */
function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode === 'earth' || countryCode === 'un') {
        return ICONS.globe; // 使用 SVG 地球
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

    // 設置初始語言國旗並應用語言
    // currentUILang 已在 restoreState() 中從 localStorage 恢復
    setTimeout(() => {
        const activeLang = LANGUAGES.find(l => l.code === currentUILang);
        if (activeLang && flagImg) {
            flagImg.src = getFlagUrl(activeLang.countryCode);
            flagImg.alt = activeLang.name;
        }
        // 應用保存的語言設定到整個頁面
        if (typeof updateUILanguage === 'function') {
            updateUILanguage(currentUILang);
        }
    }, 100);
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
    // 雖然可以根據瀏覽器語言預選，但在地圖應用中，默認顯示「全部地區」體驗更好
    // 因此此處不再自動預選特定地區，而是默認顯示所有事件

    // 默認為「全部地區」
    if (flagImg) flagImg.src = getFlagUrl('un');
    if (nameSpan) nameSpan.textContent = t('allRegions', '全部地區');
    selectedRegion = '';

    // 高亮「全部」選項(如果有的話)
    elements.regionDropdown?.querySelectorAll('.region-option').forEach(opt => {
        opt.classList.remove('active');
    });
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

    // 打賞按鈕事件
    initTipButton();
});

/**
 * 初始化打賞按鈕
 */
function initTipButton() {
    const tipBtn = document.getElementById('cardTipBtn');
    const tipOptions = document.getElementById('tipOptions');

    if (!tipBtn || !tipOptions) return;

    // 點擊打賞按鈕顯示/隱藏選項
    tipBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!walletAddress) {
            showToast(t('pleaseConnectWallet'), 'error');
            return;
        }

        tipOptions.classList.toggle('hidden');
    });

    // 點擊金額選項
    tipOptions.querySelectorAll('.tip-option').forEach(option => {
        option.addEventListener('click', async (e) => {
            e.stopPropagation();
            const amount = parseFloat(option.dataset.amount);
            const recipientWallet = tipBtn.dataset.wallet;

            if (!recipientWallet) {
                showToast(t('errorNetwork'), 'error');
                return;
            }

            tipOptions.classList.add('hidden');
            showToast(t('sendingTip'), 'info');

            const result = await sendTip(recipientWallet, amount);

            if (result.success) {
                // 🎉 Visual Feedback: Confetti
                if (window.confetti) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
                showToast(t('tipSuccess'), 'success');
            } else {
                showToast(result.error, 'error');
            }
        });
    });

    // 點擊外部關閉
    document.addEventListener('click', (e) => {
        if (!document.getElementById('tipDropdown')?.contains(e.target)) {
            tipOptions.classList.add('hidden');
        }
    });

    // 分享到 X 按鈕
    const shareBtn = document.getElementById('cardShareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const eventName = shareBtn.dataset.eventName || '';
            const shareText = `${eventName} - World Events Dashboard`;
            const shareUrl = window.location.href;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        });
    }
}
