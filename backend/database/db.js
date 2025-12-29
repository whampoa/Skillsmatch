const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'legalconnect.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Initialize database tables
function initDatabase() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                    reject(err);
                }
            });

            // Lawyers table
            db.run(`CREATE TABLE IF NOT EXISTS lawyers (
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
            )`, (err) => {
                if (err) {
                    console.error('Error creating lawyers table:', err);
                    reject(err);
                }
            });

            // Shortlists table
            db.run(`CREATE TABLE IF NOT EXISTS shortlists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lawyer_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
                UNIQUE(user_id, lawyer_id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating shortlists table:', err);
                    reject(err);
                }
            });

            // Comparisons table
            db.run(`CREATE TABLE IF NOT EXISTS comparisons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lawyer_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
                UNIQUE(user_id, lawyer_id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating comparisons table:', err);
                    reject(err);
                }
            });

            // Search history table
            db.run(`CREATE TABLE IF NOT EXISTS search_history (
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
            )`, (err) => {
                if (err) {
                    console.error('Error creating search_history table:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

// Helper function to run queries
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}

// Helper function to get one row
function getOne(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Helper function to get all rows
function getAll(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    db,
    initDatabase,
    runQuery,
    getOne,
    getAll
};

