/**
 * Solana 區塊鏈整合
 * 使用 devnet 進行 Memo 交易
 */

// Solana 配置
const SOLANA_CONFIG = {
    // 使用 devnet
    NETWORK: 'devnet',
    RPC_URL: 'https://api.devnet.solana.com',

    // SPL Memo Program v1 (更簡單，不需要 signer 在 keys 中)
    MEMO_PROGRAM_ID: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',

    // 應用識別符
    APP_ID: 'world-events',
    APP_VERSION: 1
};

// Solana 連接實例
let solanaConnection = null;

/**
 * 初始化 Solana 連接
 */
function initSolanaConnection() {
    if (!solanaConnection && typeof solanaWeb3 !== 'undefined') {
        solanaConnection = new solanaWeb3.Connection(
            SOLANA_CONFIG.RPC_URL,
            'confirmed'
        );
    }
    return solanaConnection;
}

/**
 * 創建 Memo 指令 (SPL Memo v1)
 * @param {string} message - Memo 內容
 * @returns {TransactionInstruction}
 */
function createMemoInstruction(message) {
    const programId = new solanaWeb3.PublicKey(SOLANA_CONFIG.MEMO_PROGRAM_ID);

    // 使用 TextEncoder (瀏覽器兼容) 而不是 Buffer (Node.js)
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // SPL Memo v1: 不需要任何 keys
    return new solanaWeb3.TransactionInstruction({
        keys: [],
        programId,
        data: data
    });
}

/**
 * 準備事件數據用於上鏈
 * @param {Object} eventData - 事件數據
 * @returns {string} - 壓縮後的 JSON 字符串
 */
function prepareEventMemo(eventData) {
    // Memo 限制約 800 bytes，使用縮寫鍵名節省空間

    // 字數限制常量
    const LIMITS = {
        TITLE: 50,        // 標題最多 50 字元
        DESCRIPTION: 100, // 描述最多 100 字元
        TAG_COUNT: 5,     // 最多 5 個標籤
        TAG_LENGTH: 20,   // 每個標籤最多 20 字元
        IPFS_HASH: 70     // IPFS hash 最多 70 字元 (CIDv1 約 59 字元)
    };

    const memoData = {
        a: SOLANA_CONFIG.APP_ID,     // app
        v: SOLANA_CONFIG.APP_VERSION, // version
        t: 'create',                  // type
        n: eventData.title ? eventData.title.substring(0, LIMITS.TITLE) : '', // name (限制50字)
        d: eventData.description ? eventData.description.substring(0, LIMITS.DESCRIPTION) : '', // description (限制100字)
        lt: parseFloat(eventData.lat.toFixed(4)),  // latitude (4位小數)
        ln: parseFloat(eventData.lng.toFixed(4)),  // longitude (4位小數)
        s: Math.floor(new Date(eventData.start_date).getTime() / 1000), // start timestamp
        ic: eventData.icon || '📍',   // icon
        lang: eventData.language || 'zh-tw' // language
    };

    // 可選欄位 - 結束時間
    if (eventData.end_date) {
        memoData.e = Math.floor(new Date(eventData.end_date).getTime() / 1000);
    }

    // 可選欄位 - 標籤 (限制數量和每個標籤長度)
    if (eventData.tags && eventData.tags.length > 0) {
        memoData.tg = eventData.tags
            .slice(0, LIMITS.TAG_COUNT)
            .map(tag => tag.substring(0, LIMITS.TAG_LENGTH));
    }

    // 可選欄位 - IPFS hash (不存本地路徑，只存 IPFS)
    if (eventData.ipfs_hash) {
        memoData.i = eventData.ipfs_hash.substring(0, LIMITS.IPFS_HASH);
    }

    // 注意：不將 image_path 上鏈（路徑可能很長且是本地資源）
    // 如需上鏈圖片，請使用 IPFS

    return JSON.stringify(memoData);
}

/**
 * 發送事件到 Solana 區塊鏈
 * @param {Object} eventData - 事件數據
 * @returns {Promise<{success: boolean, signature?: string, error?: string}>}
 */
async function publishEventToSolana(eventData) {
    try {
        // 檢查 Phantom 錢包
        if (!window.solana || !window.solana.isPhantom) {
            throw new Error('請安裝 Phantom 錢包');
        }

        if (!window.solana.isConnected) {
            await window.solana.connect();
        }

        // 初始化連接
        const connection = initSolanaConnection();
        if (!connection) {
            throw new Error('無法連接到 Solana 網絡');
        }

        // 準備 Memo 數據
        const memoContent = prepareEventMemo(eventData);

        if (memoContent.length > 800) {
            throw new Error('事件數據過大，請縮短描述或減少標籤');
        }

        // 創建交易
        const transaction = new solanaWeb3.Transaction();
        transaction.add(createMemoInstruction(memoContent));

        // 獲取最新區塊哈希
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = window.solana.publicKey;

        // 使用 signTransaction + sendRawTransaction
        const signedTransaction = await window.solana.signTransaction(transaction);

        const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
        });

        // 等待確認
        const confirmation = await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        }, 'confirmed');

        if (confirmation.value.err) {
            throw new Error('交易確認失敗: ' + JSON.stringify(confirmation.value.err));
        }

        return {
            success: true,
            signature: signature,
            explorer_url: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        };

    } catch (error) {
        console.error('Solana 交易失敗:', error);

        // 解析常見錯誤並提供友好提示
        let errorMessage = '交易失敗';
        const errorStr = error.message || error.toString();

        if (errorStr.includes('User rejected') || errorStr.includes('user rejected')) {
            errorMessage = '用戶取消了交易';
        } else if (errorStr.includes('Unexpected error')) {
            errorMessage = '錢包錯誤，請嘗試刷新頁面或重新連接錢包';
        } else if (errorStr.includes('insufficient')) {
            errorMessage = '餘額不足，請從 Faucet 獲取測試 SOL';
        } else if (errorStr.includes('blockhash')) {
            errorMessage = '網絡繁忙，請稍後再試';
        } else if (errorStr.includes('not connected')) {
            errorMessage = '請先連接 Phantom 錢包';
        } else {
            errorMessage = errorStr;
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * 獲取交易詳情
 * @param {string} signature - 交易簽名
 * @returns {Promise<Object|null>}
 */
async function getSolanaTransaction(signature) {
    try {
        const connection = initSolanaConnection();
        const tx = await connection.getTransaction(signature, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
        });
        return tx;
    } catch (error) {
        console.error('獲取交易失敗:', error);
        return null;
    }
}

/**
 * 檢查 Solana 網絡狀態
 * @returns {Promise<boolean>}
 */
async function checkSolanaNetwork() {
    try {
        const connection = initSolanaConnection();
        const version = await connection.getVersion();
        return true;
    } catch (error) {
        console.error('Solana 網絡不可用:', error);
        return false;
    }
}

// 導出到全局
window.SOLANA_CONFIG = SOLANA_CONFIG;
window.publishEventToSolana = publishEventToSolana;
window.getSolanaTransaction = getSolanaTransaction;
window.checkSolanaNetwork = checkSolanaNetwork;
