from flask import Blueprint, request, jsonify
from database.db import get_db
from middleware.auth import authenticate_token

history_bp = Blueprint('history', __name__)

@history_bp.route('/', methods=['GET'])
@authenticate_token
def get_history():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM search_history 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        ''', (request.user['id'],))
        
        history = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        # Format history
        formatted_history = []
        for item in history:
            formatted_item = {
                **item,
                'practiceArea': item['practice_area'],
                'minExperience': item['min_experience'],
                'maxRate': item['max_rate'],
                'responseGuarantee': bool(item['response_guarantee']),
                'resultCount': item['result_count'],
                'createdAt': item['created_at']
            }
            formatted_history.append(formatted_item)
        
        return jsonify({'history': formatted_history})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@history_bp.route('/', methods=['POST'])
@authenticate_token
def save_history():
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO search_history 
            (user_id, practice_area, state, min_experience, max_rate, response_guarantee, result_count)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            request.user['id'],
            data.get('practiceArea'),
            data.get('state'),
            data.get('minExperience'),
            data.get('maxRate'),
            1 if data.get('responseGuarantee') else 0,
            data.get('resultCount', 0)
        ))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Search saved to history'}), 201
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

