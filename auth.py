from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
import time
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError
import base58
import secrets
import hashlib

auth_bp = Blueprint('auth', __name__)

# JWT 設定
# 開發環境使用固定 key（生產環境應使用環境變數）
import os
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev_secret_key_for_world_events_dashboard_2024')
ACCESS_TOKEN_EXPIRY = 3600  # 1小時
REFRESH_TOKEN_EXPIRY = 86400 * 7  # 7天

# Nonce 儲存（生產環境應使用 Redis）
nonce_store = {}
# Refresh Token 黑名單（已撤銷的 Token）
token_blacklist = set()

def generate_nonce():
    """生成隨機 nonce"""
    return secrets.token_hex(16)

def verify_solana_signature(wallet_address, message, signature):
    """驗證 Solana 錢包簽名"""
    try:
        public_key_bytes = base58.b58decode(wallet_address)
        verify_key = VerifyKey(public_key_bytes)
        verify_key.verify(message.encode('utf-8'), bytes(signature))
        return True
    except (BadSignatureError, Exception) as e:
        print(f"簽名驗證失敗: {e}")
        return False

@auth_bp.route('/auth/nonce/<wallet_address>', methods=['GET'])
def get_nonce(wallet_address):
    """獲取簽名用的 nonce"""
    nonce = generate_nonce()
    timestamp = int(time.time())
    message = f"請簽名以驗證錢包所有權\n\n錢包地址: {wallet_address}\n時間戳: {timestamp}\nNonce: {nonce}\n\n此操作不會產生任何費用"

    # 儲存 nonce（5分鐘有效期）
    nonce_store[wallet_address] = {
        'nonce': nonce,
        'timestamp': timestamp,
        'expires_at': timestamp + 300
    }

    return jsonify({
        'nonce': nonce,
        'message': message,
        'timestamp': timestamp
    })

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """驗證簽名並發放 JWT Token"""
    data = request.get_json()

    wallet_address = data.get('wallet_address')
    message = data.get('message')
    signature = data.get('signature')
    nonce = data.get('nonce')

    if not all([wallet_address, message, signature, nonce]):
        return jsonify({'error': '缺少必要參數'}), 400

    # 1. 驗證 nonce
    if wallet_address not in nonce_store:
        return jsonify({'error': 'Nonce 不存在或已過期'}), 400

    stored_data = nonce_store[wallet_address]
    if stored_data['nonce'] != nonce:
        return jsonify({'error': 'Nonce 不匹配'}), 400

    if time.time() > stored_data['expires_at']:
        del nonce_store[wallet_address]
        return jsonify({'error': 'Nonce 已過期'}), 400

    # 2. 驗證簽名
    if not verify_solana_signature(wallet_address, message, signature):
        return jsonify({'error': '簽名驗證失敗'}), 403

    # 3. 刪除已使用的 nonce（防止重放攻擊）
    del nonce_store[wallet_address]

    # 4. 生成 Access Token（短期）
    access_payload = {
        'wallet_address': wallet_address,
        'type': 'access',
        'exp': int(time.time()) + ACCESS_TOKEN_EXPIRY,
        'iat': int(time.time())
    }
    access_token = jwt.encode(access_payload, SECRET_KEY, algorithm='HS256')

    # 5. 生成 Refresh Token（長期）
    refresh_payload = {
        'wallet_address': wallet_address,
        'type': 'refresh',
        'exp': int(time.time()) + REFRESH_TOKEN_EXPIRY,
        'iat': int(time.time()),
        'jti': secrets.token_hex(16)  # Token ID，用於撤銷
    }
    refresh_token = jwt.encode(refresh_payload, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'success': True,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_in': ACCESS_TOKEN_EXPIRY,
        'token_type': 'Bearer'
    })

@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh():
    """使用 Refresh Token 獲取新的 Access Token"""
    data = request.get_json()
    refresh_token = data.get('refresh_token')

    if not refresh_token:
        return jsonify({'error': '缺少 Refresh Token'}), 400

    try:
        # 驗證 Refresh Token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=['HS256'])

        # 檢查 Token 類型
        if payload.get('type') != 'refresh':
            return jsonify({'error': '無效的 Token 類型'}), 401

        # 檢查是否在黑名單
        token_id = payload.get('jti')
        if token_id in token_blacklist:
            return jsonify({'error': 'Token 已被撤銷'}), 401

        wallet_address = payload['wallet_address']

        # 生成新的 Access Token
        access_payload = {
            'wallet_address': wallet_address,
            'type': 'access',
            'exp': int(time.time()) + ACCESS_TOKEN_EXPIRY,
            'iat': int(time.time())
        }
        access_token = jwt.encode(access_payload, SECRET_KEY, algorithm='HS256')

        return jsonify({
            'success': True,
            'access_token': access_token,
            'expires_in': ACCESS_TOKEN_EXPIRY
        })

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Refresh Token 已過期，請重新登入'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Refresh Token 無效'}), 401

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """登出並撤銷 Refresh Token"""
    data = request.get_json()
    refresh_token = data.get('refresh_token')

    if refresh_token:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=['HS256'])
            token_id = payload.get('jti')
            if token_id:
                token_blacklist.add(token_id)  # 加入黑名單
        except:
            pass

    return jsonify({'success': True, 'message': '登出成功'})

def token_required(f):
    """JWT Token 驗證裝飾器"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': '缺少認證 Token'}), 401

        if token.startswith('Bearer '):
            token = token[7:]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

            # 檢查 Token 類型
            if payload.get('type') != 'access':
                return jsonify({'error': '無效的 Token 類型'}), 401

            request.wallet_address = payload['wallet_address']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token 已過期', 'code': 'TOKEN_EXPIRED'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token 無效'}), 401

        return f(*args, **kwargs)

    return decorated

def token_optional(f):
    """可選的 JWT Token 驗證裝飾器（未登入時 wallet_address 為 None）"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        request.wallet_address = None

        if token:
            if token.startswith('Bearer '):
                token = token[7:]

            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                if payload.get('type') == 'access':
                    request.wallet_address = payload['wallet_address']
            except:
                pass  # Token 無效時忽略，繼續但 wallet_address 為 None

        return f(*args, **kwargs)

    return decorated
