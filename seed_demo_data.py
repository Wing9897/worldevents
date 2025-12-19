#!/usr/bin/env python3
"""
示範數據載入腳本
用於開發/測試環境，載入示範事件和用戶

使用方式：
  本地運行：python seed_demo_data.py
  Docker 運行：docker exec -it world-events-app python seed_demo_data.py
"""

from database import get_db, init_db

def seed_demo_data():
    """載入示範數據"""
    # 確保數據庫表存在
    init_db()
    
    conn = get_db()
    cursor = conn.cursor()
    
    # 檢查是否已有數據
    cursor.execute('SELECT COUNT(*) FROM events')
    existing_count = cursor.fetchone()[0]
    
    if existing_count > 0:
        print(f"⚠️  數據庫中已有 {existing_count} 個事件")
        response = input("是否繼續載入示範數據？(y/N): ").strip().lower()
        if response != 'y':
            print("已取消")
            conn.close()
            return
    
    # 示範事件
    sample_events = [
        ('2024 台北跨年晚會', '在台北101舉辦的盛大跨年煙火秀', 25.0330, 121.5654, '2024-12-31', 'Alice', '7xKXabc123demo456', '慶典', 'zh-tw'),
        ('Tokyo Tech Summit', 'Annual technology conference in Tokyo', 35.6762, 139.6503, '2024-11-15', 'Bob', '8yLYdef789demo012', '會議', 'ja'),
        ('Paris Climate March', 'Climate awareness demonstration', 48.8566, 2.3522, '2024-10-20', 'Charlie', '9zMZghi345demo678', '示威', 'en'),
        ('Sydney Music Festival', 'Three-day outdoor music festival', -33.8688, 151.2093, '2024-09-10', 'David', 'AaNNjkl901demo234', '音樂節', 'en'),
        ('北京人工智能展覽', '展示最新AI技術的國際展覽', 39.9042, 116.4074, '2024-08-25', 'Eve', 'BbOOmno567demo890', '展覽', 'zh-tw'),
        ('New York Marathon', 'Annual NYC marathon event', 40.7128, -74.0060, '2024-11-03', 'Frank', 'CcPPpqr123demo456', '運動', 'en'),
        ('Berlin Art Exhibition', 'Contemporary art showcase', 52.5200, 13.4050, '2024-07-18', 'Grace', 'DdQQstu789demo012', '藝術', 'en'),
        ('首爾K-POP演唱會', '韓國流行音樂盛會', 37.5665, 126.9780, '2024-06-30', 'Henry', 'EeRRvwx345demo678', '演唱會', 'ko'),
        ('Singapore Fintech Week', 'Global fintech conference', 1.3521, 103.8198, '2024-11-08', 'Ivy', 'FfSSyza901demo234', '會議', 'en'),
        ('Dubai Expo Closing', 'World Expo closing ceremony', 25.2048, 55.2708, '2024-03-31', 'Jack', 'GgTTbcd567demo890', '博覽會', 'en')
    ]
    
    cursor.executemany('''
        INSERT INTO events (name, description, lat, lng, date, user, wallet_address, event_type, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', sample_events)
    print(f"✅ 已插入 {len(sample_events)} 個示範事件")
    
    # 示範用戶配額
    sample_wallets = [
        ('7xKXabc123demo456', 1),
        ('8yLYdef789demo012', 1),
        ('9zMZghi345demo678', 1),
        ('AaNNjkl901demo234', 1),
        ('BbOOmno567demo890', 1),
        ('CcPPpqr123demo456', 1),
        ('DdQQstu789demo012', 1),
        ('EeRRvwx345demo678', 1),
        ('FfSSyza901demo234', 1),
        ('GgTTbcd567demo890', 1)
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO user_limits (wallet_address, event_count)
        VALUES (?, ?)
    ''', sample_wallets)
    
    # 設置示範用戶角色
    demo_roles = [
        ('7xKXabc123demo456', 'verified'),
        ('8yLYdef789demo012', 'community'),
        ('9zMZghi345demo678', 'verified'),
        ('AaNNjkl901demo234', 'institution'),
        ('BbOOmno567demo890', 'community'),
        ('CcPPpqr123demo456', 'verified'),
        ('DdQQstu789demo012', 'institution'),
        ('EeRRvwx345demo678', 'community'),
        ('FfSSyza901demo234', 'verified'),
        ('GgTTbcd567demo890', 'institution')
    ]
    
    for wallet, role in demo_roles:
        cursor.execute('UPDATE user_limits SET role = ? WHERE wallet_address = ?', (role, wallet))
    print(f"✅ 已設置 {len(demo_roles)} 個示範用戶角色")
    
    conn.commit()
    conn.close()
    
    print("\n🎉 示範數據載入完成！")
    print("   - 10 個示範事件")
    print("   - 10 個示範用戶（verified/community/institution）")


def clear_demo_data():
    """清除示範數據"""
    conn = get_db()
    cursor = conn.cursor()
    
    # 刪除示範錢包的事件
    demo_wallets = [
        '7xKXabc123demo456', '8yLYdef789demo012', '9zMZghi345demo678',
        'AaNNjkl901demo234', 'BbOOmno567demo890', 'CcPPpqr123demo456',
        'DdQQstu789demo012', 'EeRRvwx345demo678', 'FfSSyza901demo234',
        'GgTTbcd567demo890'
    ]
    
    placeholders = ','.join(['?' for _ in demo_wallets])
    
    cursor.execute(f'DELETE FROM events WHERE wallet_address IN ({placeholders})', demo_wallets)
    events_deleted = cursor.rowcount
    
    cursor.execute(f'DELETE FROM user_limits WHERE wallet_address IN ({placeholders})', demo_wallets)
    users_deleted = cursor.rowcount
    
    conn.commit()
    conn.close()
    
    print(f"✅ 已刪除 {events_deleted} 個示範事件")
    print(f"✅ 已刪除 {users_deleted} 個示範用戶")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == '--clear':
        print("🗑️  清除示範數據...")
        clear_demo_data()
    else:
        print("🌱 載入示範數據...")
        seed_demo_data()
