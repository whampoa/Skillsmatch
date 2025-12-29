import jwt
from functools import wraps
from flask import request, jsonify, current_app

def generate_token(user):
    """Generate JWT token for user"""
    payload = {
        'id': user['id'],
        'email': user['email'],
        'role': user['role']
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET'], algorithm='HS256')

def verify_token(token):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def authenticate_token(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Access token required'}), 401
        
        try:
            token = auth_header.split(' ')[1]  # Bearer TOKEN
        except IndexError:
            return jsonify({'error': 'Invalid token format'}), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 403
        
        request.user = payload
        return f(*args, **kwargs)
    
    return decorated_function

def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.user.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    
    return decorated_function

