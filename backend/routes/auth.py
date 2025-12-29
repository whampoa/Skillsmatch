from flask import Blueprint, request, jsonify
import bcrypt
from database.db import get_db
from middleware.auth import generate_token, authenticate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not name or not email or not password:
            return jsonify({'error': 'Name, email, and password are required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'User already exists'}), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        cursor.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            (name, email, hashed_password)
        )
        conn.commit()
        
        # Get the created user
        cursor.execute('SELECT id, name, email, role FROM users WHERE id = ?', (cursor.lastrowid,))
        user = dict(cursor.fetchone())
        conn.close()
        
        # Generate token
        token = generate_token(user)
        
        return jsonify({
            'message': 'User created successfully',
            'user': user,
            'token': token
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Find user
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user_row = cursor.fetchone()
        conn.close()
        
        if not user_row:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        user = dict(user_row)
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate token
        token = generate_token(user)
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            },
            'token': token
        })
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/me', methods=['GET'])
@authenticate_token
def get_current_user():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            (request.user['id'],)
        )
        user_row = cursor.fetchone()
        conn.close()
        
        if not user_row:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': dict(user_row)})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

