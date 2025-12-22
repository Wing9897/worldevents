from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from database import (
    get_db, init_db, get_user_event_count, get_user_quota, 
    increment_user_event_count, decrement_user_event_count,
    get_user_role, set_user_role,
    subscribe, unsubscribe, get_subscriptions, is_subscribed, get_subscriber_count,
    get_user_display_name, set_user_display_name, get_user_profile
)
from auth import auth_bp, token_required, token_optional
import os
import uuid
import time
from functools import wraps
from io import BytesIO

# 嘗試導入 Pillow，如果不可用則使用基本存儲
try:
    from PIL import Image
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("⚠️ Pillow not installed. Images will be saved without compression.")
    print("   Install with: pip install Pillow")

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# 註冊認證模組
app.register_blueprint(auth_bp, url_prefix='/api')

# 初始化數據庫（確保 Gunicorn 啟動時執行）
init_db()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_IMAGE_WIDTH = 400  # 符合 event card 寬度
# 與前端 MARKER_ICONS 完全一致的圖標列表
ALLOWED_ICONS = {
    '📍', '🎉', '🎵', '🏆', '🎪', '🎭', '📌', '⭐', '🔥', '💡',
    '🎯', '🏁', '🎈', '🎊', '🎤', '🏟️', '🎨', '📸', '🎬', '🎮',
    '🚀', '✈️', '🚗', '🚢', '🏠', '🏢', '🏫', '🏥', '⛪', '🕌',
    '🗼', '🗽', '🌋', '🏔️', '🌊', '🌲', '🌸', '🌺', '🍀', '🎄',
    '⚽', '🏀', '🎾', '🏈', '⚾', '🎳', '🏊', '🚴', '🧗', '🎿',
    '🍕', '🍔', '🍣', '🍰', '🍿', '☕', '🍺', '🍷', '🥳', '💻'
}
ALLOWED_REGIONS = {'zh-tw', 'zh-cn', 'en', 'en-us', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'}

# 確保上傳目錄存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ===== 簡單請求限制 (無需 Redis) =====
rate_limit_store = {}  # {ip: [timestamp1, timestamp2, ...]}
RATE_LIMIT_WINDOW = 60  # 60秒窗口
RATE_LIMIT_MAX_REQUESTS = 30  # 每窗口最多30次請求

def get_client_ip():
    """獲取客戶端 IP"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr

def rate_limit(f):
    """請求限制裝飾器"""
    @wraps(f)
    def decorated(*args, **kwargs):
        ip = get_client_ip()
        now = time.time()
        
        # 清理過期記錄
        if ip in rate_limit_store:
            rate_limit_store[ip] = [t for t in rate_limit_store[ip] if now - t < RATE_LIMIT_WINDOW]
        else:
            rate_limit_store[ip] = []
        
        # 檢查是否超過限制
        if len(rate_limit_store[ip]) >= RATE_LIMIT_MAX_REQUESTS:
            return jsonify({'error': '請求過於頻繁，請稍後再試', 'code': 'RATE_LIMITED'}), 429
        
        # 記錄本次請求
        rate_limit_store[ip].append(now)
        
        return f(*args, **kwargs)
    return decorated

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def compress_image(image_data, max_width=MAX_IMAGE_WIDTH):
    """壓縮圖片到指定寬度"""
    if not PILLOW_AVAILABLE:
        return image_data, 'jpg'
    
    img = Image.open(BytesIO(image_data))
    
    # 轉換為 RGB（移除透明度）
    if img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # 調整大小（保持比例）
    if img.width > max_width:
        ratio = max_width / img.width
        new_height = int(img.height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
    
    # 壓縮為 JPEG
    output = BytesIO()
    img.save(output, format='JPEG', quality=80, optimize=True)
    return output.getvalue(), 'jpg'

@app.route('/')
def serve_index():
    """提供前端頁面"""
    return send_from_directory('.', 'index.html')

# 安全修復：移除通配符路由，防止源碼洩露
# 靜態文件 (css/js) 在生產環境由 Nginx 處理
# 開發環境下如果需要，應明確指定目錄，而不是開放根目錄 '.'

@app.route('/css/<path:path>')
def serve_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def serve_js(path):
    return send_from_directory('js', path)

@app.route('/images/<path:path>')
def serve_images(path):
    return send_from_directory('images', path)

@app.route('/uploads/<filename>')
def serve_upload(filename):
    """提供上傳的圖片"""
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/upload', methods=['POST'])
@token_required
@rate_limit
def upload_image():
    """上傳並壓縮圖片（需要認證）"""
    if 'image' not in request.files:
        return jsonify({'error': '沒有圖片文件'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': '沒有選擇文件'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': '不支持的文件格式'}), 400
    
    try:
        # 讀取並壓縮圖片
        image_data = file.read()
        compressed_data, ext = compress_image(image_data)
        
        # 生成唯一文件名
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # 保存壓縮後的圖片
        with open(filepath, 'wb') as f:
            f.write(compressed_data)
        
        return jsonify({
            'success': True,
            'image_path': f'/uploads/{filename}',
            'filename': filename
        })
    except Exception as e:
        print(f"[Upload Error] {str(e)}")  # 記錄到 server log
        return jsonify({'error': '上傳失敗，請稍後重試'}), 500

@app.route('/api/events', methods=['GET'])
@token_optional
def get_events():
    """獲取事件列表，支持過濾"""
    conn = get_db()
    cursor = conn.cursor()
    
    # 構建查詢
    query = 'SELECT e.*, ul.role as creator_role FROM events e LEFT JOIN user_limits ul ON e.wallet_address = ul.wallet_address WHERE 1=1'
    params = []
    
    # 錢包地址過濾（精確匹配單一錢包，用於查看特定用戶的事件）
    wallet_filter = request.args.get('wallet')
    if wallet_filter:
        # 如果指定了特定錢包，只顯示該錢包的事件（不論角色）
        query += ' AND e.wallet_address = ?'
        params.append(wallet_filter)
    else:
        # 沒有指定錢包時，使用訂閱過濾邏輯
        # 獲取選定的訂閱錢包（逗號分隔）
        selected_subscriptions = request.args.get('subscribed_wallets', '')
        selected_list = [w.strip() for w in selected_subscriptions.split(',') if w.strip()]
        
        # 取得當前登入用戶的錢包地址
        current_user_wallet = request.wallet_address
        
        # 預設顯示：官方帳號 + 自己的事件 + 選定的訂閱帳號
        if selected_list:
            placeholders = ','.join(['?' for _ in selected_list])
            if current_user_wallet:
                query += f" AND (ul.role = 'official' OR e.wallet_address = ? OR e.wallet_address IN ({placeholders}))"
                params.append(current_user_wallet)
            else:
                query += f" AND (ul.role = 'official' OR e.wallet_address IN ({placeholders}))"
            params.extend(selected_list)
        else:
            if current_user_wallet:
                # 顯示官方帳號 + 自己的事件
                query += " AND (ul.role = 'official' OR e.wallet_address = ?)"
                params.append(current_user_wallet)
            else:
                # 未登入時只顯示官方帳號
                query += " AND ul.role = 'official'"
    
    # 時間範圍過濾
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    filter_mode = request.args.get('filter_mode', 'start')

    if start_date and end_date:
        if filter_mode == 'start':
            query += ' AND e.date >= ? AND e.date <= ?'
            params.extend([start_date, end_date])
        elif filter_mode == 'end':
            query += ' AND COALESCE(e.end_date, e.date) >= ? AND COALESCE(e.end_date, e.date) <= ?'
            params.extend([start_date, end_date])
        else:
            query += ' AND e.date <= ? AND COALESCE(e.end_date, e.date) >= ?'
            params.extend([end_date, start_date])
    else:
        if start_date:
            query += ' AND e.date >= ?'
            params.append(start_date)
        if end_date:
            query += ' AND e.date <= ?'
            params.append(end_date)
    
    # 用戶錢包地址過濾（模糊搜尋，用於搜索框）
    user = request.args.get('user')
    if user:
        query += ' AND (e.wallet_address LIKE ? OR e.user LIKE ?)'
        params.append(f'%{user}%')
        params.append(f'%{user}%')
    
    # 事件類型過濾（模糊搜尋）
    event_type = request.args.get('event_type')
    if event_type:
        query += ' AND e.event_type LIKE ?'
        params.append(f'%{event_type}%')
    
    # 地區過濾（注意：language 欄位存的是地區代碼，非語言代碼）
    language = request.args.get('language')
    if language:
        query += ' AND e.language = ?'
        params.append(language)
    
    query += ' ORDER BY e.date DESC'
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    events = []
    for row in rows:
        event = dict(row)
        # 添加創建者的顯示名稱
        creator_display_name = get_user_display_name(event.get('wallet_address'))
        event['creator_display_name'] = creator_display_name
        events.append(event)
    
    return jsonify(events)

@app.route('/api/events', methods=['POST'])
@token_required
@rate_limit
def create_event():
    """創建新事件（需要認證）"""
    data = request.get_json()

    # 從 JWT Token 獲取已認證的錢包地址
    wallet_address = request.wallet_address

    # 驗證必填欄位
    required = ['name', 'lat', 'lng', 'date', 'user']
    for field in required:
        if field not in data:
            return jsonify({'error': f'缺少必填欄位: {field}'}), 400

    # 檢查用戶配額
    current_count = get_user_event_count(wallet_address)
    user_quota = get_user_quota(wallet_address)

    if current_count >= user_quota:
        return jsonify({'error': f'已達到配額上限 ({user_quota} 次)'}), 403

    conn = get_db()
    cursor = conn.cursor()
    

    # 驗證地區代碼（使用 language 欄位存儲）
    region_code = data.get('language', 'en')
    if region_code not in ALLOWED_REGIONS:
        region_code = 'en'  # 默認英語地區
    
    cursor.execute('''
        INSERT INTO events (name, description, lat, lng, date, start_date, end_date, user, wallet_address, event_type, language, image_path, icon, tx_signature, tx_network, storage_mode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'],
        data.get('description', ''),
        data['lat'],
        data['lng'],
        data.get('start_date', data['date']),  # 向後兼容：使用 start_date 或 date
        data.get('start_date', data['date']),
        data.get('end_date', ''),
        data['user'],
        wallet_address,
        data.get('event_type', ''),
        region_code,  # 使用驗證後的地區代碼
        data.get('image_path', ''),
        data.get('icon') if data.get('icon') in ALLOWED_ICONS else '📍',
        data.get('tx_signature', ''),
        data.get('tx_network', ''),
        data.get('storage_mode', 'local')
    ))
    
    event_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # 增加用戶計數
    increment_user_event_count(wallet_address)
    new_count = current_count + 1

    return jsonify({
        'id': event_id, 
        'message': '事件創建成功', 
        'event_count': new_count,
        'tx_signature': data.get('tx_signature', ''),
        'tx_network': data.get('tx_network', ''),
        'storage_mode': data.get('storage_mode', 'local')
    }), 201

@app.route('/api/user/events', methods=['GET'])
@token_required
def get_user_events():
    """獲取當前用戶的所有事件"""
    wallet_address = request.wallet_address
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM events WHERE wallet_address = ? ORDER BY date DESC', (wallet_address,))
    rows = cursor.fetchall()
    conn.close()
    
    events = [dict(row) for row in rows]
    return jsonify(events)

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@token_required
def delete_event(event_id):
    """刪除事件（僅限創建者）"""
    wallet_address = request.wallet_address
    
    conn = get_db()
    cursor = conn.cursor()
    
    # 修改：同時檢查 ID 和 錢包地址
    cursor.execute('SELECT * FROM events WHERE id = ? AND wallet_address = ?', (event_id, wallet_address))
    event = cursor.fetchone()
    
    if not event:
        conn.close()
        return jsonify({'error': '事件不存在或無權刪除'}), 404
        
    # 刪除事件
    cursor.execute('DELETE FROM events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()
    
    # 注意：不恢復配額，創建次數是永久消耗的
    
    # 獲取當前計數（僅供顯示）
    current_count = get_user_event_count(wallet_address)
    quota = get_user_quota(wallet_address)
    
    print(f"刪除事件: Address={wallet_address}, EventCount={current_count}, Quota={quota}")
    
    return jsonify({
        'success': True, 
        'message': '事件已刪除',
        'event_count': current_count,
        'remaining': quota - current_count
    })

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """獲取單個事件詳情"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM events WHERE id = ?', (event_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return jsonify(dict(row))
    return jsonify({'error': '事件不存在'}), 404

@app.route('/api/user/limit/<wallet_address>', methods=['GET'])
def get_user_limit(wallet_address):
    """獲取用戶的配額狀態"""
    count = get_user_event_count(wallet_address)
    quota = get_user_quota(wallet_address)
    return jsonify({
        'wallet_address': wallet_address,
        'event_count': count,
        'quota': quota,
        'remaining': quota - count
    })

@app.route('/api/languages', methods=['GET'])
def get_languages():
    """獲取可用語言列表"""
    languages = [
        {'code': 'zh-tw', 'name': '繁體中文'},
        {'code': 'zh-cn', 'name': '简体中文'},
        {'code': 'en', 'name': 'English'},
        {'code': 'ja', 'name': '日本語'},
        {'code': 'ko', 'name': '한국어'},
        {'code': 'es', 'name': 'Español'},
        {'code': 'fr', 'name': 'Français'},
        {'code': 'de', 'name': 'Deutsch'},
        {'code': 'pt', 'name': 'Português'},
        {'code': 'ru', 'name': 'Русский'}
    ]
    return jsonify(languages)

@app.route('/api/config', methods=['GET'])
def get_config():
    """獲取公開配置（社交媒體連結等）"""
    social_links = {}
    
    # 從環境變數讀取社交媒體連結
    discord_link = os.getenv('SOCIAL_DISCORD', '')
    telegram_link = os.getenv('SOCIAL_TELEGRAM', '')
    youtube_link = os.getenv('SOCIAL_YOUTUBE', '')
    facebook_link = os.getenv('SOCIAL_FACEBOOK', '')
    
    # 只返回有設定的連結
    if discord_link:
        social_links['discord'] = discord_link
    if telegram_link:
        social_links['telegram'] = telegram_link
    if youtube_link:
        social_links['youtube'] = youtube_link
    if facebook_link:
        social_links['facebook'] = facebook_link
    
    # X (Twitter)
    x_link = os.getenv('SOCIAL_X', '')
    if x_link:
        social_links['x'] = x_link
    
    return jsonify({
        'social_links': social_links
    })

# ===== 用戶資料 API =====
@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile():
    """獲取當前用戶資料"""
    wallet_address = request.wallet_address
    profile = get_user_profile(wallet_address)
    return jsonify(profile)

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile():
    """更新用戶資料（目前只支援 display_name）"""
    wallet_address = request.wallet_address
    data = request.get_json()
    
    display_name = data.get('display_name', '').strip()
    
    # 允許空字串（清除名稱）
    if display_name == '':
        display_name = None
    
    set_user_display_name(wallet_address, display_name)
    
    return jsonify({
        'success': True,
        'display_name': display_name
    })

@app.route('/api/user/<wallet_address>', methods=['GET'])
def get_user_info(wallet_address):
    """獲取指定用戶的公開資料"""
    display_name = get_user_display_name(wallet_address)
    role = get_user_role(wallet_address)
    
    return jsonify({
        'wallet_address': wallet_address,
        'display_name': display_name,
        'role': role
    })

# ===== 訂閱相關 API =====
@app.route('/api/subscribe', methods=['POST'])
@token_required
def subscribe_user():
    """訂閱用戶"""
    data = request.get_json()
    target_wallet = data.get('target_wallet')
    
    if not target_wallet:
        return jsonify({'error': '缺少目標錢包地址'}), 400
    
    subscriber_wallet = request.wallet_address
    
    if subscriber_wallet == target_wallet:
        return jsonify({'error': '不能訂閱自己'}), 400
    
    if subscribe(subscriber_wallet, target_wallet):
        return jsonify({
            'success': True,
            'message': '訂閱成功',
            'target_wallet': target_wallet
        })
    else:
        return jsonify({'error': '已經訂閱或訂閱失敗'}), 400

@app.route('/api/unsubscribe', methods=['POST'])
@token_required
def unsubscribe_user():
    """取消訂閱"""
    data = request.get_json()
    target_wallet = data.get('target_wallet')
    
    if not target_wallet:
        return jsonify({'error': '缺少目標錢包地址'}), 400
    
    subscriber_wallet = request.wallet_address
    
    if unsubscribe(subscriber_wallet, target_wallet):
        return jsonify({
            'success': True,
            'message': '已取消訂閱',
            'target_wallet': target_wallet
        })
    else:
        return jsonify({'error': '未訂閱此用戶'}), 400

@app.route('/api/subscriptions', methods=['GET'])
@token_required
def get_user_subscriptions():
    """獲取當前用戶的訂閱列表和推薦帳號"""
    wallet_address = request.wallet_address
    subscriptions = get_subscriptions(wallet_address)
    
    # 獲取每個訂閱帳號的詳細信息
    subscribed_list = []
    subscribed_wallets = set(subscriptions)
    for target in subscriptions:
        role = get_user_role(target)
        display_name = get_user_display_name(target)
        subscribed_list.append({
            'wallet_address': target,
            'role': role,
            'display_name': display_name
        })
    
    # 獲取推薦帳號（認證/社群/機構，排除已訂閱的）
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT wallet_address, role, display_name FROM user_limits 
        WHERE role IN ('verified', 'community', 'institution')
        ORDER BY role, wallet_address
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    recommended_list = []
    for row in rows:
        if row['wallet_address'] not in subscribed_wallets and row['wallet_address'] != wallet_address:
            recommended_list.append({
                'wallet_address': row['wallet_address'],
                'role': row['role'],
                'display_name': row['display_name']
            })
    
    return jsonify({
        'subscriptions': subscribed_list,
        'recommended': recommended_list,
        'count': len(subscribed_list)
    })

@app.route('/api/user/profile/<wallet_address>', methods=['GET'])
@token_optional
def get_user_profile(wallet_address):
    """獲取用戶公開資料"""
    role = get_user_role(wallet_address)
    subscriber_count = get_subscriber_count(wallet_address)
    
    # 檢查當前用戶是否已訂閱
    is_following = False
    if request.wallet_address:
        is_following = is_subscribed(request.wallet_address, wallet_address)
    
    return jsonify({
        'wallet_address': wallet_address,
        'role': role,
        'subscriber_count': subscriber_count,
        'is_following': is_following
    })

# ===== 管理員 API (簡易版) =====
@app.route('/api/admin/set-role', methods=['POST'])
@token_required
def admin_set_role():
    """設置用戶角色（需要管理員權限）"""
    data = request.get_json()
    target_wallet = data.get('wallet_address')
    new_role = data.get('role')
    
    # 簡易管理員檢查（實際應使用更安全的方式）
    admin_wallet = request.wallet_address
    admin_role = get_user_role(admin_wallet)
    
    if admin_role != 'official':
        return jsonify({'error': '需要官方帳號權限'}), 403
    
    if not target_wallet or not new_role:
        return jsonify({'error': '缺少參數'}), 400
    
    if set_user_role(target_wallet, new_role):
        return jsonify({
            'success': True,
            'message': f'已將 {target_wallet} 設置為 {new_role}'
        })
    else:
        return jsonify({'error': '無效的角色類型'}), 400

if __name__ == '__main__':
    init_db()
    print("🌍 世界事件 Dashboard API 啟動中...")
    print("📍 http://localhost:5000")
    print(f"📷 圖片壓縮: {'啟用 (Pillow)' if PILLOW_AVAILABLE else '停用'}")
    app.run(debug=True, port=5000)
