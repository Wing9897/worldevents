/**
 * localStorage 安全包裝器
 * 處理隱私模式和存儲不可用的情況
 */

class SafeStorage {
    constructor() {
        this._available = this._checkAvailability();
        this._memoryStore = {};
    }

    _checkAvailability() {
        try {
            const testKey = '__storage_test__';
            window.localStorage.setItem(testKey, 'test');
            window.localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage 不可用，使用內存存儲:', e);
            return false;
        }
    }

    getItem(key) {
        if (this._available) {
            try {
                return window.localStorage.getItem(key);
            } catch (e) {
                console.error('讀取 localStorage 失敗:', e);
                return this._memoryStore[key] || null;
            }
        }
        return this._memoryStore[key] || null;
    }

    setItem(key, value) {
        if (this._available) {
            try {
                window.localStorage.setItem(key, value);
            } catch (e) {
                console.error('寫入 localStorage 失敗:', e);
                this._memoryStore[key] = value;
            }
        } else {
            this._memoryStore[key] = value;
        }
    }

    removeItem(key) {
        if (this._available) {
            try {
                window.localStorage.removeItem(key);
            } catch (e) {
                console.error('刪除 localStorage 項目失敗:', e);
                delete this._memoryStore[key];
            }
        } else {
            delete this._memoryStore[key];
        }
    }

    clear() {
        if (this._available) {
            try {
                window.localStorage.clear();
            } catch (e) {
                console.error('清除 localStorage 失敗:', e);
                this._memoryStore = {};
            }
        } else {
            this._memoryStore = {};
        }
    }

    get length() {
        if (this._available) {
            try {
                return window.localStorage.length;
            } catch (e) {
                return Object.keys(this._memoryStore).length;
            }
        }
        return Object.keys(this._memoryStore).length;
    }

    key(index) {
        if (this._available) {
            try {
                return window.localStorage.key(index);
            } catch (e) {
                const keys = Object.keys(this._memoryStore);
                return keys[index] || null;
            }
        }
        const keys = Object.keys(this._memoryStore);
        return keys[index] || null;
    }
}

// 創建全局安全存儲實例
const safeLocalStorage = new SafeStorage();

// 為了向後兼容，也導出為 localStorage
// 但建議使用 safeLocalStorage
if (typeof window !== 'undefined') {
    window.safeLocalStorage = safeLocalStorage;
}
