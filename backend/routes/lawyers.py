from flask import Blueprint, request, jsonify
import json
from database.db import get_db
from middleware.auth import authenticate_token, require_admin

lawyers_bp = Blueprint('lawyers', __name__)

@lawyers_bp.route('/', methods=['GET'])
def get_lawyers():
    try:
        practice_area = request.args.get('practiceArea')
        state = request.args.get('state')
        min_experience = request.args.get('minExperience', type=int)
        max_rate = request.args.get('maxRate', type=float)
        response_guarantee = request.args.get('responseGuarantee') == 'true'
        sort_by = request.args.get('sortBy', 'id')
        
        conn = get_db()
        cursor = conn.cursor()
        
        query = 'SELECT * FROM lawyers WHERE 1=1'
        params = []
        
        if practice_area:
            query += ' AND practice_area = ?'
            params.append(practice_area)
        
        if state:
            query += ' AND location_state = ?'
            params.append(state)
        
        if min_experience:
            query += ' AND experience_years >= ?'
            params.append(min_experience)
        
        if max_rate:
            query += ' AND hourly_rate_min <= ?'
            params.append(max_rate)
        
        if response_guarantee:
            query += ' AND response_guarantee = 1'
        
        # Sorting
        valid_sorts = {'id': 'id', 'experience_years': 'experience_years', 
                      'hourly_rate_min': 'hourly_rate_min', 'success_rate': 'success_rate'}
        sort_field = valid_sorts.get(sort_by, 'id')
        query += f' ORDER BY {sort_field} DESC'
        
        cursor.execute(query, params)
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
        
        return jsonify({'lawyers': formatted_lawyers})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@lawyers_bp.route('/<int:lawyer_id>', methods=['GET'])
def get_lawyer(lawyer_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM lawyers WHERE id = ?', (lawyer_id,))
        lawyer_row = cursor.fetchone()
        conn.close()
        
        if not lawyer_row:
            return jsonify({'error': 'Lawyer not found'}), 404
        
        lawyer = dict(lawyer_row)
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
        
        return jsonify({'lawyer': formatted_lawyer})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@lawyers_bp.route('/', methods=['POST'])
@authenticate_token
@require_admin
def create_lawyer():
    try:
        data = request.get_json()
        
        required_fields = ['name', 'firm', 'practiceArea', 'experienceYears', 
                          'hourlyRateMin', 'hourlyRateMax', 'locationCity', 'locationState']
        if not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO lawyers (
                name, firm, tier, practice_area, specialties, experience_years,
                case_count, success_rate, hourly_rate_min, hourly_rate_max,
                location_city, location_state, verified, mediation_certified,
                response_guarantee, mara_number, bio, avatar_color
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'],
            data['firm'],
            data.get('tier', 'mid'),
            data['practiceArea'],
            json.dumps(data.get('specialties', [])),
            data['experienceYears'],
            data.get('caseCount', 0),
            data.get('successRate', 75),
            data['hourlyRateMin'],
            data['hourlyRateMax'],
            data['locationCity'],
            data['locationState'],
            1 if data.get('verified', False) else 0,
            1 if data.get('mediationCertified', False) else 0,
            1 if data.get('responseGuarantee', False) else 0,
            data.get('maraNumber'),
            data.get('bio'),
            data.get('avatarColor', '#000000')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Lawyer created successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@lawyers_bp.route('/<int:lawyer_id>', methods=['PUT'])
@authenticate_token
@require_admin
def update_lawyer(lawyer_id):
    try:
        data = request.get_json()
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Build update query dynamically
        updates = []
        values = []
        
        field_mapping = {
            'name': 'name',
            'firm': 'firm',
            'tier': 'tier',
            'practiceArea': 'practice_area',
            'specialties': 'specialties',
            'experienceYears': 'experience_years',
            'caseCount': 'case_count',
            'successRate': 'success_rate',
            'hourlyRateMin': 'hourly_rate_min',
            'hourlyRateMax': 'hourly_rate_max',
            'locationCity': 'location_city',
            'locationState': 'location_state',
            'verified': 'verified',
            'mediationCertified': 'mediation_certified',
            'responseGuarantee': 'response_guarantee',
            'maraNumber': 'mara_number',
            'bio': 'bio',
            'avatarColor': 'avatar_color'
        }
        
        for key, value in data.items():
            db_key = field_mapping.get(key)
            if db_key:
                if key == 'specialties' and isinstance(value, list):
                    updates.append(f'{db_key} = ?')
                    values.append(json.dumps(value))
                elif key in ['verified', 'mediationCertified', 'responseGuarantee']:
                    updates.append(f'{db_key} = ?')
                    values.append(1 if value else 0)
                else:
                    updates.append(f'{db_key} = ?')
                    values.append(value)
        
        if not updates:
            conn.close()
            return jsonify({'error': 'No valid fields to update'}), 400
        
        values.append(lawyer_id)
        query = f'UPDATE lawyers SET {", ".join(updates)} WHERE id = ?'
        
        cursor.execute(query, values)
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Lawyer updated successfully'})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@lawyers_bp.route('/<int:lawyer_id>', methods=['DELETE'])
@authenticate_token
@require_admin
def delete_lawyer(lawyer_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM lawyers WHERE id = ?', (lawyer_id,))
        conn.commit()
        conn.close()
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Lawyer not found'}), 404
        
        return jsonify({'message': 'Lawyer deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

