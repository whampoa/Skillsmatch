const { initDatabase, db } = require('./db');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        await initDatabase();
        
        // Create default admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const { runQuery, getOne } = require('./db');
        
        // Check if admin exists
        const existingAdmin = await getOne('SELECT * FROM users WHERE email = ?', ['admin@legalconnect.com']);
        
        if (!existingAdmin) {
            await runQuery(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin User', 'admin@legalconnect.com', adminPassword, 'admin']
            );
            console.log('Default admin user created: admin@legalconnect.com / admin123');
        }
        
        // Check if lawyers exist, if not, seed some sample data
        const { getAll } = require('./db');
        const existingLawyers = await getAll('SELECT COUNT(*) as count FROM lawyers');
        
        if (existingLawyers[0].count === 0) {
            console.log('Seeding sample lawyer data...');
            await seedLawyers();
        }
        
        console.log('Database initialization complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

async function seedLawyers() {
    const { runQuery } = require('./db');
    
    const sampleLawyers = [
        {
            name: 'Sarah Mitchell',
            firm: 'Family Law Partners',
            tier: 'top',
            practice_area: 'family',
            specialties: JSON.stringify(['Divorce', 'Child Custody', 'Property Settlement']),
            experience_years: 15,
            case_count: 450,
            success_rate: 92,
            hourly_rate_min: 450,
            hourly_rate_max: 800,
            location_city: 'Sydney',
            location_state: 'NSW',
            verified: 1,
            mediation_certified: 1,
            response_guarantee: 1,
            bio: 'Family law specialist with extensive experience in complex divorce and custody cases.',
            avatar_color: '#8B5CF6'
        },
        {
            name: 'James Wilson',
            firm: 'Conveyancing Experts',
            tier: 'mid',
            practice_area: 'conveyancing',
            specialties: JSON.stringify(['Residential', 'Commercial', 'Off-the-Plan']),
            experience_years: 10,
            case_count: 320,
            success_rate: 88,
            hourly_rate_min: 250,
            hourly_rate_max: 450,
            location_city: 'Melbourne',
            location_state: 'VIC',
            verified: 1,
            mediation_certified: 0,
            response_guarantee: 1,
            bio: 'Experienced conveyancer specializing in residential and commercial property transactions.',
            avatar_color: '#10B981'
        },
        {
            name: 'Emma Thompson',
            firm: 'Immigration Solutions',
            tier: 'mid',
            practice_area: 'immigration',
            specialties: JSON.stringify(['Partner Visas', 'Skilled Migration', 'Citizenship']),
            experience_years: 12,
            case_count: 280,
            success_rate: 90,
            hourly_rate_min: 300,
            hourly_rate_max: 550,
            location_city: 'Brisbane',
            location_state: 'QLD',
            verified: 1,
            mediation_certified: 0,
            response_guarantee: 1,
            mara_number: 'MARN1000001',
            bio: 'Registered migration agent with proven track record in visa applications.',
            avatar_color: '#3B82F6'
        }
    ];
    
    for (const lawyer of sampleLawyers) {
        await runQuery(
            `INSERT INTO lawyers (
                name, firm, tier, practice_area, specialties, experience_years,
                case_count, success_rate, hourly_rate_min, hourly_rate_max,
                location_city, location_state, verified, mediation_certified,
                response_guarantee, mara_number, bio, avatar_color
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                lawyer.name, lawyer.firm, lawyer.tier, lawyer.practice_area,
                lawyer.specialties, lawyer.experience_years, lawyer.case_count,
                lawyer.success_rate, lawyer.hourly_rate_min, lawyer.hourly_rate_max,
                lawyer.location_city, lawyer.location_state, lawyer.verified,
                lawyer.mediation_certified, lawyer.response_guarantee,
                lawyer.mara_number || null, lawyer.bio, lawyer.avatar_color
            ]
        );
    }
    
    console.log(`Seeded ${sampleLawyers.length} sample lawyers`);
}

if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase, seedLawyers };

