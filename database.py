import sqlite3
import os

# ===== 配置常數 =====
DEFAULT_USER_QUOTA = 30  # 新用戶預設配額

# ENV Helper
def get_env_wallets(key):
    return [w.strip() for w in os.environ.get(key, '').split(',') if w.strip()]

# 載入各類特殊帳號配置
OFFICIAL_WALLETS = get_env_wallets('OFFICIAL_WALLETS')
VERIFIED_WALLETS = get_env_wallets('VERIFIED_WALLETS')
COMMUNITY_WALLETS = get_env_wallets('COMMUNITY_WALLETS')
INSTITUTION_WALLETS = get_env_wallets('INSTITUTION_WALLETS')

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
        "ALTER TABLE events ADD COLUMN storage_mode TEXT DEFAULT 'local'",
        'ALTER TABLE events ADD COLUMN ipfs_hash TEXT'
    ]
    for migration in migrations:
        try:
            cursor.execute(migration)
        except:
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
    except:
        pass
    
    # 遷移：添加 role 欄位
    try:
        cursor.execute("ALTER TABLE user_limits ADD COLUMN role TEXT DEFAULT 'user'")
    except:
        pass
    
    # 遷移：添加 display_name 欄位
    try:
        cursor.execute('ALTER TABLE user_limits ADD COLUMN display_name TEXT')
    except:
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
    
    # 同步角色權限 Helper
    def sync_role_from_env(wallet_list, role_name, quota_limit):
        if not wallet_list:
             # 如果列表為空，則打印警告但不執行大規模刪除，避免配置錯誤導致權限全失
             # 僅針對 Official 這樣做？或者一致性？
             # 為了安全，如果列表為空，我們不自動降級該角色，除非明確是空列表（split邏輯已處理空字串）
             # 但如果我們想通過清空 Env 來移除權限？ 
             # 權衡：防止誤操作優先。
             return

        for wallet in wallet_list:
            cursor.execute(f'''
                INSERT OR IGNORE INTO user_limits (wallet_address, role, quota)
                VALUES (?, ?, ?)
            ''', (wallet, role_name, quota_limit))
            cursor.execute(f'''
                UPDATE user_limits SET role = ?, quota = ? 
                WHERE wallet_address = ?
            ''', (role_name, quota_limit, wallet))
        
        # 移除不在清單中的該角色用戶 (Strict Sync)
        placeholders = ','.join('?' for _ in wallet_list)
        cursor.execute(f'''
            UPDATE user_limits 
            SET role = 'user', quota = {DEFAULT_USER_QUOTA}
            WHERE role = ? AND wallet_address NOT IN ({placeholders})
        ''', (role_name, *wallet_list))

    # 執行各角色的同步
    sync_role_from_env(OFFICIAL_WALLETS, 'official', 1000)
    sync_role_from_env(VERIFIED_WALLETS, 'verified', 500)
    sync_role_from_env(COMMUNITY_WALLETS, 'community', 200)
    sync_role_from_env(INSTITUTION_WALLETS, 'institution', 500)
    
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
    except:
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
