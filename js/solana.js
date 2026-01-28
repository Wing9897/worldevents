/**
 * Solana 區塊鏈整合
 * 支援 Mainnet / Devnet / Testnet 網路切換
 */
'use strict';

// Solana 網路配置
const SOLANA_NETWORKS = {
    mainnet: {
        name: 'Mainnet',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        explorerUrl: 'https://explorer.solana.com/tx/',
        cluster: ''
    },
    devnet: {
        name: 'Devnet',
        rpcUrl: 'https://api.devnet.solana.com',
        explorerUrl: 'https://explorer.solana.com/tx/',
        cluster: 'devnet'
    },
    testnet: {
        name: 'Testnet',
        rpcUrl: 'https://api.testnet.solana.com',
        explorerUrl: 'https://explorer.solana.com/tx/',
        cluster: 'testnet'
    }
};

// 當前使用的網路配置
let currentNetwork = 'devnet';

// Solana 配置 (動態)
const SOLANA_CONFIG = {
    // SPL Memo Program v1 (更簡單，不需要 signer 在 keys 中)
    MEMO_PROGRAM_ID: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',

    // 應用識別符
    APP_ID: 'world-events',
    APP_VERSION: 1,

    // 動態取得當前網路配置
    get NETWORK() { return currentNetwork; },
    get RPC_URL() { return SOLANA_NETWORKS[currentNetwork].rpcUrl; },
    get EXPLORER_URL() { return SOLANA_NETWORKS[currentNetwork].explorerUrl; },
    get CLUSTER() { return SOLANA_NETWORKS[currentNetwork].cluster; }
};

// Solana 連接實例
let solanaConnection = null;

/**
 * 設定 Solana 網路
 * @param {string} network - 網路名稱 (mainnet, devnet, testnet)
 */
function setSolanaNetwork(network) {
    if (SOLANA_NETWORKS[network]) {
        currentNetwork = network;
        solanaConnection = null; // 重置連接以使用新的 RPC
        // console.log(`[Solana] 已切換至 ${SOLANA_NETWORKS[network].name}`);
        return true;
    }
    console.error(`[Solana] 未知網路: ${network}`);
    return false;
}

/**
 * 取得當前網路名稱
 */
function getCurrentNetwork() {
    return currentNetwork;
}

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
        lang: eventData.language || 'en', // language (default to en)
        _: Date.now().toString(36) + Math.random().toString(36).substr(2, 4) // unique nonce
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
            throw new Error(t('installPhantom'));
        }

        if (!window.solana.isConnected) {
            await window.solana.connect();
        }

        // 初始化連接
        const connection = initSolanaConnection();
        if (!connection) {
            throw new Error(t('networkError'));
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
            network: currentNetwork,
            explorer_url: SOLANA_CONFIG.CLUSTER
                ? `${SOLANA_CONFIG.EXPLORER_URL}${signature}?cluster=${SOLANA_CONFIG.CLUSTER}`
                : `${SOLANA_CONFIG.EXPLORER_URL}${signature}`
        };

    } catch (error) {
        console.error('Solana 交易失敗:', error);

        // 解析常見錯誤並提供友好提示
        let errorMessage = '交易失敗';
        const errorStr = error.message || error.toString();

        if (errorStr.includes('User rejected') || errorStr.includes('user rejected')) {
            errorMessage = t('errorUserRejected', 'User rejected transaction');
        } else if (errorStr.includes('Unexpected error')) {
            errorMessage = t('walletConnectionError') + 'Unknown error';
        } else if (errorStr.includes('insufficient')) {
            errorMessage = t('errorInsufficientBalance', 'Insufficient balance');
        } else if (errorStr.includes('blockhash')) {
            errorMessage = t('errorNetworkBusy', 'Network busy');
        } else if (errorStr.includes('not connected')) {
            errorMessage = t('pleaseConnectWallet');
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

/**
 * 發送 SOL 打賞
 * @param {string} recipientWallet - 接收者錢包地址
 * @param {number} amountSOL - SOL 金額
 * @returns {Promise<{success: boolean, signature?: string, error?: string}>}
 */
async function sendTip(recipientWallet, amountSOL) {
    try {
        // 檢查 Phantom 錢包
        if (!window.solana || !window.solana.isPhantom) {
            throw new Error(t('installPhantom'));
        }

        if (!window.solana.isConnected) {
            await window.solana.connect();
        }

        // 驗證接收者地址
        let recipientPubkey;
        try {
            recipientPubkey = new solanaWeb3.PublicKey(recipientWallet);
        } catch (e) {
            throw new Error('無效的接收者錢包地址');
        }

        // 初始化連接
        const connection = initSolanaConnection();
        if (!connection) {
            throw new Error('無法連接到 Solana 網絡');
        }

        // 計算 lamports (1 SOL = 10^9 lamports)
        const lamports = Math.round(amountSOL * 1_000_000_000);

        if (lamports <= 0) {
            throw new Error(t('errorTipAmountTooSmall', 'Tip amount must be > 0'));
        }

        // 創建轉帳指令
        const transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: window.solana.publicKey,
                toPubkey: recipientPubkey,
                lamports: lamports
            })
        );

        // 獲取最新區塊哈希
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = window.solana.publicKey;

        // 簽名並發送
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
            throw new Error('交易確認失敗');
        }

        return {
            success: true,
            signature: signature,
            explorer_url: SOLANA_CONFIG.CLUSTER
                ? `${SOLANA_CONFIG.EXPLORER_URL}${signature}?cluster=${SOLANA_CONFIG.CLUSTER}`
                : `${SOLANA_CONFIG.EXPLORER_URL}${signature}`
        };

    } catch (error) {
        console.error('打賞失敗:', error);

        let errorMessage = '打賞失敗';
        const errorStr = error.message || error.toString();

        if (errorStr.includes('User rejected') || errorStr.includes('user rejected')) {
            errorMessage = t('errorUserRejected', 'User rejected');
        } else if (errorStr.includes('insufficient')) {
            errorMessage = t('errorInsufficientBalance', 'Insufficient balance');
        } else if (errorStr.includes('not connected')) {
            errorMessage = t('pleaseConnectWallet');
        } else {
            errorMessage = errorStr;
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

// 導出到全局
window.SOLANA_NETWORKS = SOLANA_NETWORKS;
window.SOLANA_CONFIG = SOLANA_CONFIG;
window.setSolanaNetwork = setSolanaNetwork;
window.getCurrentNetwork = getCurrentNetwork;
window.publishEventToSolana = publishEventToSolana;
window.getSolanaTransaction = getSolanaTransaction;
window.checkSolanaNetwork = checkSolanaNetwork;
window.sendTip = sendTip;
