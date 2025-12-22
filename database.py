import sqlite3
import os

# ===== 配置常數 =====
DEFAULT_USER_QUOTA = 30  # 新用戶預設配額

# 預設官方帳號列表（逗號分隔的錢包地址）
# 可透過環境變數覆蓋：OFFICIAL_WALLETS=addr1,addr2,addr3
OFFICIAL_WALLETS = [
    w.strip() for w in 
    os.environ.get('OFFICIAL_WALLETS', '').split(',') 
    if w.strip()
]

# 數據庫存放在 data 目錄中（便於 Docker 掛載）
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, 'events.db')

def get_db():
    """獲取數據庫連接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """初始化數據庫表"""
    conn = get_db()
    cursor = conn.cursor()
    
    # 創建事件表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            date TEXT NOT NULL,
            start_date TEXT,
            end_date TEXT,
            user TEXT NOT NULL,
            wallet_address TEXT NOT NULL,
            event_type TEXT,
            language TEXT DEFAULT 'en',
            image_path TEXT,
            icon TEXT DEFAULT '📍',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 遷移：添加缺失欄位
    migrations = [
        'ALTER TABLE events ADD COLUMN image_path TEXT',
        "ALTER TABLE events ADD COLUMN icon TEXT DEFAULT '📍'",
        'ALTER TABLE events ADD COLUMN start_date TEXT',
        'ALTER TABLE events ADD COLUMN end_date TEXT',
        'ALTER TABLE events ADD COLUMN tx_signature TEXT',
        'ALTER TABLE events ADD COLUMN tx_network TEXT',
        "ALTER TABLE events ADD COLUMN storage_mode TEXT DEFAULT 'local'"
    ]
    for migration in migrations:
        try:
            cursor.execute(migration)
        except sqlite3.OperationalError:
            # 欄位已存在，跳過
            pass
    
    # 創建用戶配額表
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS user_limits (
            wallet_address TEXT PRIMARY KEY,
            event_count INTEGER DEFAULT 0,
            quota INTEGER DEFAULT {DEFAULT_USER_QUOTA},
            role TEXT DEFAULT 'user',
            display_name TEXT
        )
    ''')

    # 遷移：添加 quota 欄位
    try:
        cursor.execute(f'ALTER TABLE user_limits ADD COLUMN quota INTEGER DEFAULT {DEFAULT_USER_QUOTA}')
    except sqlite3.OperationalError:
        # 欄位已存在，跳過
        pass
    
    # 遷移：添加 role 欄位
    try:
        cursor.execute("ALTER TABLE user_limits ADD COLUMN role TEXT DEFAULT 'user'")
    except sqlite3.OperationalError:
        # 欄位已存在，跳過
        pass
    
    # 遷移：添加 display_name 欄位
    try:
        cursor.execute('ALTER TABLE user_limits ADD COLUMN display_name TEXT')
    except sqlite3.OperationalError:
        # 欄位已存在，跳過
        pass
    
    # 創建訂閱表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subscriber_wallet TEXT NOT NULL,
            target_wallet TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(subscriber_wallet, target_wallet)
        )
    ''')
    
    conn.commit()
    
    # 初始化官方帳號（從環境變數 OFFICIAL_WALLETS 讀取）
    # 1. 確保名單中的帳號為 official
    for wallet in OFFICIAL_WALLETS:
        cursor.execute('''
            INSERT OR IGNORE INTO user_limits (wallet_address, role, quota)
            VALUES (?, 'official', 1000)
        ''', (wallet,))
        cursor.execute('''
            UPDATE user_limits SET role = 'official', quota = 1000 
            WHERE wallet_address = ?
        ''', (wallet,))
    
    # 2. 安全機制：撤銷不在名單中的官方帳號權限 (Strict Sync)
    # 這確保修改 .env 並重啟後，舊的官方帳號會自動失去權限
    if OFFICIAL_WALLETS:
        placeholders = ','.join('?' for _ in OFFICIAL_WALLETS)
        cursor.execute(f'''
            UPDATE user_limits 
            SET role = 'user', quota = {DEFAULT_USER_QUOTA}
            WHERE role = 'official' AND wallet_address NOT IN ({placeholders})
        ''', OFFICIAL_WALLETS)
    else:
        # 如果名單為空，且為了安全，不自動刪除所有官方帳號（避免配置錯誤導致全滅）
        # 僅印出警告，或者可以選擇也執行刪除。這裡選擇保守策略。
        print("[Database] Warning: No OFFICIAL_WALLETS configured. Existing officials will retain access.")
    
    conn.commit()
    
    conn.close()

def get_user_event_count(wallet_address):
    """獲取用戶已創建的事件數量"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT event_count FROM user_limits WHERE wallet_address = ?', (wallet_address,))
    row = cursor.fetchone()
    conn.close()
    return row['event_count'] if row else 0

def get_user_quota(wallet_address):
    """獲取用戶配額"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT quota FROM user_limits WHERE wallet_address = ?', (wallet_address,))
    row = cursor.fetchone()
    conn.close()
    return row['quota'] if row else DEFAULT_USER_QUOTA

def increment_user_event_count(wallet_address):
    """增加用戶的事件計數"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_limits (wallet_address, event_count) 
        VALUES (?, 1)
        ON CONFLICT(wallet_address) DO UPDATE SET event_count = event_count + 1
    ''', (wallet_address,))
    conn.commit()
    conn.close()

def decrement_user_event_count(wallet_address):
    """減少用戶的事件計數"""
    conn = get_db()
    cursor = conn.cursor()
    
    # 先查詢當前計數
    cursor.execute('SELECT event_count FROM user_limits WHERE wallet_address = ?', (wallet_address,))
    row = cursor.fetchone()
    
    if row:
        current_count = row['event_count']
        new_count = max(0, current_count - 1)
        print(f"[Database] Decrementing event count for {wallet_address}: {current_count} -> {new_count}")
        
        cursor.execute('UPDATE user_limits SET event_count = ? WHERE wallet_address = ?', (new_count, wallet_address))
        conn.commit()
    else:
        print(f"[Database] Warning: No user limit record found for {wallet_address} during decrement")
    
    conn.close()

if __name__ == '__main__':
    init_db()
    print("數據庫初始化完成！")

# ===== 用戶角色相關 =====
def get_user_role(wallet_address):
    """獲取用戶角色"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT role FROM user_limits WHERE wallet_address = ?', (wallet_address,))
    row = cursor.fetchone()
    conn.close()
    return row['role'] if row else 'user'

# ===== 用戶顯示名稱相關 =====
def get_user_display_name(wallet_address):
    """獲取用戶顯示名稱"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT display_name FROM user_limits WHERE wallet_address = ?', (wallet_address,))
    row = cursor.fetchone()
    conn.close()
    return row['display_name'] if row and row['display_name'] else None

def set_user_display_name(wallet_address, display_name):
    """設置用戶顯示名稱"""
    # 限制名稱長度
    if display_name and len(display_name) > 50:
        display_name = display_name[:50]
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_limits (wallet_address, display_name) 
        VALUES (?, ?)
        ON CONFLICT(wallet_address) DO UPDATE SET display_name = ?
    ''', (wallet_address, display_name, display_name))
    conn.commit()
    conn.close()
    return True

def get_user_profile(wallet_address):
    """獲取完整用戶資料"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT wallet_address, event_count, quota, role, display_name 
        FROM user_limits WHERE wallet_address = ?
    ''', (wallet_address,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'wallet_address': row['wallet_address'],
            'event_count': row['event_count'],
            'quota': row['quota'],
            'role': row['role'],
            'display_name': row['display_name']
        }
    else:
        return {
            'wallet_address': wallet_address,
            'event_count': 0,
            'quota': DEFAULT_USER_QUOTA,
            'role': 'user',
            'display_name': None
        }

def set_user_role(wallet_address, role):
    """設置用戶角色"""
    valid_roles = ['user', 'official', 'verified', 'community', 'institution']
    if role not in valid_roles:
        return False
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_limits (wallet_address, role) 
        VALUES (?, ?)
        ON CONFLICT(wallet_address) DO UPDATE SET role = ?
    ''', (wallet_address, role, role))
    conn.commit()
    conn.close()
    return True

def is_public_account(wallet_address):
    """檢查是否為公開帳號（官方/認證/社群/機構）"""
    role = get_user_role(wallet_address)
    return role in ['official', 'verified', 'community', 'institution']

# ===== 訂閱相關 =====
def subscribe(subscriber_wallet, target_wallet):
    """訂閱用戶"""
    if subscriber_wallet == target_wallet:
        return False
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO subscriptions (subscriber_wallet, target_wallet)
            VALUES (?, ?)
        ''', (subscriber_wallet, target_wallet))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        # 已訂閱或違反唯一約束
        conn.close()
        return False

def unsubscribe(subscriber_wallet, target_wallet):
    """取消訂閱"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        DELETE FROM subscriptions 
        WHERE subscriber_wallet = ? AND target_wallet = ?
    ''', (subscriber_wallet, target_wallet))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

def get_subscriptions(wallet_address):
    """獲取用戶訂閱的帳號列表"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT target_wallet FROM subscriptions 
        WHERE subscriber_wallet = ?
    ''', (wallet_address,))
    rows = cursor.fetchall()
    conn.close()
    return [row['target_wallet'] for row in rows]

def get_subscribers(wallet_address):
    """獲取訂閱此用戶的帳號列表"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT subscriber_wallet FROM subscriptions 
        WHERE target_wallet = ?
    ''', (wallet_address,))
    rows = cursor.fetchall()
    conn.close()
    return [row['subscriber_wallet'] for row in rows]

def is_subscribed(subscriber_wallet, target_wallet):
    """檢查是否已訂閱"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 1 FROM subscriptions 
        WHERE subscriber_wallet = ? AND target_wallet = ?
    ''', (subscriber_wallet, target_wallet))
    row = cursor.fetchone()
    conn.close()
    return row is not None

def get_subscriber_count(wallet_address):
    """獲取訂閱者數量"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT COUNT(*) as count FROM subscriptions 
        WHERE target_wallet = ?
    ''', (wallet_address,))
    row = cursor.fetchone()
    conn.close()
    return row['count'] if row else 0
