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

    // 地圖樣式 (Dark/Light)
    MAP_TILES: {
        light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    },

    // 時間格式
    DATE_FORMAT: {
        SHORT: 'YYYY-MM-DD',
        FULL: 'YYYY-MM-DD HH:mm'
    }
};

// 支持的地区列表 (需与后端 ALLOWED_REGIONS 保持一致)
const REGIONS = [
    { code: '', flag: 'un', nameKey: 'allRegions' },
    { code: 'tw', flag: 'tw', nameKey: 'regionTW' },
    { code: 'cn', flag: 'cn', nameKey: 'regionCN' },
    { code: 'gb', flag: 'gb', nameKey: 'regionGB' },
    { code: 'us', flag: 'us', nameKey: 'regionUS' },
    { code: 'jp', flag: 'jp', nameKey: 'regionJP' },
    { code: 'kr', flag: 'kr', nameKey: 'regionKR' },
    { code: 'es', flag: 'es', nameKey: 'regionES' },
    { code: 'fr', flag: 'fr', nameKey: 'regionFR' },
    { code: 'de', flag: 'de', nameKey: 'regionDE' },
    { code: 'br', flag: 'br', nameKey: 'regionBR' },
    { code: 'ru', flag: 'ru', nameKey: 'regionRU' }
];

// 圖標白名單 (需與後端 ALLOWED_ICONS 保持一致)
const MARKER_ICONS = [
    '📍', '🎉', '🎵', '🏆', '🎪', '🎭', '📌', '⭐', '🔥', '💡',
    '🎯', '🏁', '🎈', '🎊', '🎤', '🏟️', '🎨', '📸', '🎬', '🎮',
    '🚀', '✈️', '🚗', '🚢', '🏠', '🏢', '🏫', '🏥', '⛪', '🕌',
    '🗼', '🗽', '🌋', '🏔️', '🌊', '🌲', '🌸', '🌺', '🍀', '🎄',
    '⚽', '🏀', '🎾', '🏈', '⚾', '🎳', '🏊', '🚴', '🧗', '🎿',
    '🍕', '🍔', '🍣', '🍰', '🍿', '☕', '🍺', '🍷', '🥳', '💻'
];

// 防止意外修改
Object.freeze(CONFIG);
Object.freeze(CONFIG.MAP);
Object.freeze(CONFIG.DATE_FORMAT);
// REGIONS 和 MARKER_ICONS 作為全局常量數組，通常不凍結以便可能的擴展，或者也可以凍結
Object.freeze(REGIONS);
Object.freeze(MARKER_ICONS);
