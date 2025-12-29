from flask import Blueprint, request, jsonify
import json
from database.db import get_db
from middleware.auth import authenticate_token

shortlist_bp = Blueprint('shortlist', __name__)

@shortlist_bp.route('/', methods=['GET'])
@authenticate_token
def get_shortlist():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT l.* FROM lawyers l
            INNER JOIN shortlists s ON l.id = s.lawyer_id
            WHERE s.user_id = ?
            ORDER BY s.created_at DESC
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
        
        return jsonify({'shortlist': formatted_lawyers})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@shortlist_bp.route('/<int:lawyer_id>', methods=['POST'])
@authenticate_token
def add_to_shortlist(lawyer_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if lawyer exists
        cursor.execute('SELECT * FROM lawyers WHERE id = ?', (lawyer_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Lawyer not found'}), 404
        
        # Check if already in shortlist
        cursor.execute(
            'SELECT * FROM shortlists WHERE user_id = ? AND lawyer_id = ?',
            (request.user['id'], lawyer_id)
        )
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Lawyer already in shortlist'}), 400
        
        # Add to shortlist
        cursor.execute(
            'INSERT INTO shortlists (user_id, lawyer_id) VALUES (?, ?)',
            (request.user['id'], lawyer_id)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Lawyer added to shortlist'}), 201
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@shortlist_bp.route('/<int:lawyer_id>', methods=['DELETE'])
@authenticate_token
def remove_from_shortlist(lawyer_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'DELETE FROM shortlists WHERE user_id = ? AND lawyer_id = ?',
            (request.user['id'], lawyer_id)
        )
        conn.commit()
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Lawyer not found in shortlist'}), 404
        
        conn.close()
        return jsonify({'message': 'Lawyer removed from shortlist'})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

