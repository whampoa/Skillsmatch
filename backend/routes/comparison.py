from flask import Blueprint, request, jsonify
import json
from database.db import get_db
from middleware.auth import authenticate_token

comparison_bp = Blueprint('comparison', __name__)

@comparison_bp.route('/', methods=['GET'])
@authenticate_token
def get_comparison():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT l.* FROM lawyers l
            INNER JOIN comparisons c ON l.id = c.lawyer_id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
            LIMIT 3
        ''', (request.user['id'],))
        
        lawyers = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        # Format lawyers
        formatted_lawyers = []
        for lawyer in lawyers:
            formatted_lawyer = {
                **lawyer,
                'specialties': json.loads(lawyer['specialties']) if lawyer['specialties'] else [],
                'verified': bool(lawyer['verified']),
                'mediationCertified': bool(lawyer['mediation_certified']),
                'responseGuarantee': bool(lawyer['response_guarantee']),
                'practiceArea': lawyer['practice_area'],
                'experienceYears': lawyer['experience_years'],
                'caseCount': lawyer['case_count'],
                'successRate': lawyer['success_rate'],
                'hourlyRateMin': lawyer['hourly_rate_min'],
                'hourlyRateMax': lawyer['hourly_rate_max'],
                'locationCity': lawyer['location_city'],
                'locationState': lawyer['location_state'],
                'maraNumber': lawyer['mara_number'],
                'avatarColor': lawyer['avatar_color']
            }
            formatted_lawyers.append(formatted_lawyer)
        
        return jsonify({'comparison': formatted_lawyers})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@comparison_bp.route('/<int:lawyer_id>', methods=['POST'])
@authenticate_token
def add_to_comparison(lawyer_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check current count
        cursor.execute(
            'SELECT COUNT(*) as count FROM comparisons WHERE user_id = ?',
            (request.user['id'],)
        )
        count = cursor.fetchone()['count']
        
        if count >= 3:
            conn.close()
            return jsonify({'error': 'Maximum 3 lawyers can be compared'}), 400
        
        # Check if lawyer exists
        cursor.execute('SELECT * FROM lawyers WHERE id = ?', (lawyer_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Lawyer not found'}), 404
        
        # Check if already in comparison
        cursor.execute(
            'SELECT * FROM comparisons WHERE user_id = ? AND lawyer_id = ?',
            (request.user['id'], lawyer_id)
        )
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Lawyer already in comparison'}), 400
        
        # Add to comparison
        cursor.execute(
            'INSERT INTO comparisons (user_id, lawyer_id) VALUES (?, ?)',
            (request.user['id'], lawyer_id)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Lawyer added to comparison'}), 201
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@comparison_bp.route('/<int:lawyer_id>', methods=['DELETE'])
@authenticate_token
def remove_from_comparison(lawyer_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'DELETE FROM comparisons WHERE user_id = ? AND lawyer_id = ?',
            (request.user['id'], lawyer_id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Lawyer not found in comparison'}), 404
        
        conn.close()
        return jsonify({'message': 'Lawyer removed from comparison'})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@comparison_bp.route('/', methods=['DELETE'])
@authenticate_token
def clear_comparison():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM comparisons WHERE user_id = ?', (request.user['id'],))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Comparison cleared'})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

