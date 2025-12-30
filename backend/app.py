import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database.db import init_database
from routes.auth import auth_bp
from routes.lawyers import lawyers_bp
from routes.shortlist import shortlist_bp
from routes.comparison import comparison_bp
from routes.history import history_bp

load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Configuration
app.config['JWT_SECRET'] = os.getenv('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production')
app.config['PORT'] = int(os.getenv('PORT', 3000))

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(lawyers_bp, url_prefix='/api/lawyers')
app.register_blueprint(shortlist_bp, url_prefix='/api/shortlist')
app.register_blueprint(comparison_bp, url_prefix='/api/comparison')
app.register_blueprint(history_bp, url_prefix='/api/history')

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok', 'message': 'LegalConnect API is running'})

# Serve frontend for all other routes (SPA routing)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    response = app.send_static_file('index.html')
    # Disable caching for HTML files to ensure updates are visible
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

if __name__ == '__main__':
    # Initialize database
    init_database()
    print('Database initialized')
    
    # Start server
    print(f'Server running on http://localhost:{app.config["PORT"]}')
    print(f'API endpoints available at http://localhost:{app.config["PORT"]}/api')
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=True)

