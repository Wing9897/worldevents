/**
 * 社交媒體連結模組
 * 從後端獲取配置並渲染側欄底部的社交圖標
 */

const Social = {
    // 社交平台配置
    platforms: {
        discord: {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M524.5 69.8a463.3 463.3 0 0 0 -104.1-32.3c-3.1 5.7-6.6 13.5-9.1 19.8c-39.7-5.9-79.3-5.9-119 0c-2.5-6.3-5.9-14-9.1-19.8c-35.4 5.9-69.6 16.9-104.1 32.3C116.8 193.7 101.9 313.2 126.9 432.3c35.6 26.5 70.3 42.6 104.4 53c7.7-10.4 14.5-21.6 20.3-33.3c-14.1-5.3-27.5-11.5-40-18.7c3.4-2.5 6.7-5.1 9.9-7.7c86.5 40.2 179.9 40.2 266.4 0c3.2 2.6 6.5 5.2 9.9 7.7c-12.5 7.1-25.9 13.4-40 18.7c5.8 11.7 12.6 22.9 20.3 33.3c34.1-10.4 68.8-26.5 104.4-53c20.3-100.8 7.6-220.1-51.5-330.1c-34.5-15.4-68.7-26.5-104.1-32.3zm-272.1 272.9c-25.7 0-46.7-23.6-46.7-52.6c0-29 20.5-52.6 46.7-52.6c26.5 0 46.7 23.6 46.7 52.6c0 29-20.2 52.6-46.7 52.6zm165 0c-25.7 0-46.7-23.6-46.7-52.6c0-29 20.5-52.6 46.7-52.6c26.5 0 46.7 23.6 46.7 52.6c0 29-20.2 52.6-46.7 52.6z"/></svg>',
            color: '#5865F2',
            title: 'Discord'
        },
        telegram: {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5c-2.3 .4-39.3 25.1-111 73.5-10.5 7-20 11.7-28.5 11.5-23.4-.6-45.7-7.2-56-12.2-12.7-6-8.2-15.6 3.6-21.2C130.6 250.7 296 183.1 364.5 156.9 395 145.4 400.9 146.4 397 182.2z"/></svg>',
            color: '#0088cc',
            title: 'Telegram'
        },
        youtube: {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 42.3 48.3 48.6 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.9 48.3-48.6 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"/></svg>',
            color: '#FF0000',
            title: 'YouTube'
        },
        facebook: {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/></svg>',
            color: '#1877F2',
            title: 'Facebook'
        },
        x: {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>',
            color: '#000000', // X 品牌色是黑色
            title: 'X (Twitter)'
        }
    },

    // 初始化
    init: async function () {
        const container = document.getElementById('socialLinks');
        if (!container) return;

        try {
            const response = await fetch(`${CONFIG.API_BASE}/config`);
            if (response.ok) {
                const data = await response.json();
                if (data.social_links) {
                    this.render(container, data.social_links);
                }
            }
        } catch (err) {
            console.error('獲取配置失敗:', err);
        }
    },

    // 渲染圖標
    render: function (container, links) {
        container.innerHTML = '';
        const t = window.t || ((k) => k); // 確保 t 函數可用

        // 創建標題容器
        const header = document.createElement('div');
        header.className = 'social-header';
        header.setAttribute('data-i18n', 'joinCommunity');
        header.textContent = t('joinCommunity');
        container.appendChild(header);

        // 創建圖標容器
        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'social-icons-row';

        Object.keys(links).forEach(platformKey => {
            const url = links[platformKey];
            const platformConfig = this.platforms[platformKey];

            if (url && platformConfig) {
                const linkEl = document.createElement('a');
                linkEl.href = url;
                linkEl.target = '_blank';
                linkEl.rel = 'noopener noreferrer';
                linkEl.className = `social-btn ${platformKey}`;
                linkEl.title = platformConfig.title;
                linkEl.innerHTML = platformConfig.icon;

                // 設置自定義屬性用於 CSS 顏色
                linkEl.style.setProperty('--social-color', platformConfig.color);

                iconsContainer.appendChild(linkEl);
            }
        });

        container.appendChild(iconsContainer);

        // 如果有連結，顯示容器
        if (iconsContainer.children.length > 0) {
            container.classList.add('has-links');
        }
    }
};

// 確保在 DOM 加載後初始化
document.addEventListener('DOMContentLoaded', () => {
    Social.init();
});
