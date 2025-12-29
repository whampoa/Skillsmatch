import sqlite3
import os
import bcrypt
from pathlib import Path

# Database path
DB_DIR = Path(__file__).parent
DB_PATH = DB_DIR / 'legalconnect.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def init_database():
    """Initialize database tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Lawyers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lawyers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                firm TEXT NOT NULL,
                tier TEXT DEFAULT 'mid',
                practice_area TEXT NOT NULL,
                specialties TEXT,
                experience_years INTEGER NOT NULL,
                case_count INTEGER DEFAULT 0,
                success_rate INTEGER DEFAULT 0,
                hourly_rate_min REAL NOT NULL,
                hourly_rate_max REAL NOT NULL,
                location_city TEXT NOT NULL,
                location_state TEXT NOT NULL,
                verified INTEGER DEFAULT 0,
                mediation_certified INTEGER DEFAULT 0,
                response_guarantee INTEGER DEFAULT 0,
                mara_number TEXT,
                bio TEXT,
                avatar_color TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Shortlists table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS shortlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lawyer_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
                UNIQUE(user_id, lawyer_id)
            )
        ''')
        
        # Comparisons table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS comparisons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lawyer_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
                UNIQUE(user_id, lawyer_id)
            )
        ''')
        
        # Search history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS search_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                practice_area TEXT,
                state TEXT,
                min_experience INTEGER,
                max_rate REAL,
                response_guarantee INTEGER DEFAULT 0,
                result_count INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        
        conn.commit()
        
        # Create default admin user if it doesn't exist
        cursor.execute('SELECT * FROM users WHERE email = ?', ('admin@legalconnect.com',))
        if not cursor.fetchone():
            admin_password = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ('Admin User', 'admin@legalconnect.com', admin_password, 'admin')
            )
            print('Default admin user created: admin@legalconnect.com / admin123')
        
        # Seed sample lawyers if none exist
        cursor.execute('SELECT COUNT(*) as count FROM lawyers')
        if cursor.fetchone()['count'] == 0:
            seed_lawyers(cursor)
            print('Seeded sample lawyer data')
        
        conn.commit()
        
    except Exception as e:
        print(f'Error initializing database: {e}')
        conn.rollback()
    finally:
        conn.close()

def seed_lawyers(cursor):
    """Seed sample lawyer data"""
    import json
    
    sample_lawyers = [
        {
            'name': 'Sarah Mitchell',
            'firm': 'Family Law Partners',
            'tier': 'top',
            'practice_area': 'family',
            'specialties': json.dumps(['Divorce', 'Child Custody', 'Property Settlement']),
            'experience_years': 15,
            'case_count': 450,
            'success_rate': 92,
            'hourly_rate_min': 450,
            'hourly_rate_max': 800,
            'location_city': 'Sydney',
            'location_state': 'NSW',
            'verified': 1,
            'mediation_certified': 1,
            'response_guarantee': 1,
            'mara_number': None,
            'bio': 'Family law specialist with extensive experience in complex divorce and custody cases.',
            'avatar_color': '#8B5CF6'
        },
        {
            'name': 'James Wilson',
            'firm': 'Conveyancing Experts',
            'tier': 'mid',
            'practice_area': 'conveyancing',
            'specialties': json.dumps(['Residential', 'Commercial', 'Off-the-Plan']),
            'experience_years': 10,
            'case_count': 320,
            'success_rate': 88,
            'hourly_rate_min': 250,
            'hourly_rate_max': 450,
            'location_city': 'Melbourne',
            'location_state': 'VIC',
            'verified': 1,
            'mediation_certified': 0,
            'response_guarantee': 1,
            'mara_number': None,
            'bio': 'Experienced conveyancer specializing in residential and commercial property transactions.',
            'avatar_color': '#10B981'
        },
        {
            'name': 'Emma Thompson',
            'firm': 'Immigration Solutions',
            'tier': 'mid',
            'practice_area': 'immigration',
            'specialties': json.dumps(['Partner Visas', 'Skilled Migration', 'Citizenship']),
            'experience_years': 12,
            'case_count': 280,
            'success_rate': 90,
            'hourly_rate_min': 300,
            'hourly_rate_max': 550,
            'location_city': 'Brisbane',
            'location_state': 'QLD',
            'verified': 1,
            'mediation_certified': 0,
            'response_guarantee': 1,
            'mara_number': 'MARN1000001',
            'bio': 'Registered migration agent with proven track record in visa applications.',
            'avatar_color': '#3B82F6'
        }
    ]
    
    for lawyer in sample_lawyers:
        cursor.execute('''
            INSERT INTO lawyers (
                name, firm, tier, practice_area, specialties, experience_years,
                case_count, success_rate, hourly_rate_min, hourly_rate_max,
                location_city, location_state, verified, mediation_certified,
                response_guarantee, mara_number, bio, avatar_color
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            lawyer['name'], lawyer['firm'], lawyer['tier'], lawyer['practice_area'],
            lawyer['specialties'], lawyer['experience_years'], lawyer['case_count'],
            lawyer['success_rate'], lawyer['hourly_rate_min'], lawyer['hourly_rate_max'],
            lawyer['location_city'], lawyer['location_state'], lawyer['verified'],
            lawyer['mediation_certified'], lawyer['response_guarantee'],
            lawyer['mara_number'], lawyer['bio'], lawyer['avatar_color']
        ))

