/**
 * 全局配置常量
 */
const CONFIG = {
    API_BASE: '/api',
    EVENT_LIMIT: 100,
    FLAG_CDN: 'https://flagcdn.com/w40',
    RECOMMENDED_BATCH_SIZE: 9,

    // 地圖配置
    MAP: {
        CENTER: [25, 121],
        ZOOM: 3,
        MIN_ZOOM: 2,
        MAX_ZOOM: 18,
        TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },

    // 時間格式
    DATE_FORMAT: {
        SHORT: 'YYYY-MM-DD',
        FULL: 'YYYY-MM-DD HH:mm'
    }
};

// 防止意外修改
Object.freeze(CONFIG);
Object.freeze(CONFIG.MAP);
Object.freeze(CONFIG.DATE_FORMAT);
