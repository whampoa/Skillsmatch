# LegalConnect - Backend Application

A complete full-stack legal matching application with user authentication and lawyer database management.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Lawyer Database**: Store and manage lawyer profiles
- **Search & Matching**: AI-powered lawyer matching with filters
- **Shortlist**: Save favorite lawyers
- **Comparison**: Compare up to 3 lawyers side-by-side
- **Search History**: Track your search queries
- **Admin Panel**: Manage lawyer database (admin only)
- **Export**: Export shortlists and comparisons as PDF or CSV

## Tech Stack

- **Backend**: Python + Flask
- **Database**: SQLite (easy to migrate to PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Alpine.js + Tailwind CSS

## Setup Instructions

### 1. Create Python Virtual Environment

```bash
cd backend
python3 -m venv venv
```

### 2. Activate Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Initialize Database

The database will be automatically initialized when you first run the server. It will:
- Create the database tables
- Create a default admin user:
  - Email: `admin@legalconnect.com`
  - Password: `admin123`
- Seed sample lawyer data

### 5. Configure Environment (Optional)

Create a `.env` file in the `backend` directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FLASK_ENV=development
```

### 6. Start the Server

```bash
python app.py
```

Or using Flask directly:

```bash
flask run --port=3000
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Lawyers
- `GET /api/lawyers` - Get all lawyers (with optional filters)
- `GET /api/lawyers/:id` - Get single lawyer
- `POST /api/lawyers` - Create lawyer (admin only)
- `PUT /api/lawyers/:id` - Update lawyer (admin only)
- `DELETE /api/lawyers/:id` - Delete lawyer (admin only)

### Shortlist
- `GET /api/shortlist` - Get user's shortlist (requires auth)
- `POST /api/shortlist/:lawyerId` - Add to shortlist (requires auth)
- `DELETE /api/shortlist/:lawyerId` - Remove from shortlist (requires auth)

### Comparison
- `GET /api/comparison` - Get comparison list (requires auth)
- `POST /api/comparison/:lawyerId` - Add to comparison (requires auth)
- `DELETE /api/comparison/:lawyerId` - Remove from comparison (requires auth)
- `DELETE /api/comparison` - Clear all comparisons (requires auth)

### History
- `GET /api/history` - Get search history (requires auth)
- `POST /api/history` - Save search to history (requires auth)

## Usage

1. **Browse Lawyers**: Search and filter lawyers without signing in
2. **Sign Up/Login**: Create an account to save shortlists and comparisons
3. **Save Lawyers**: Click "Save" to add lawyers to your shortlist
4. **Compare**: Add up to 3 lawyers to compare side-by-side
5. **Export**: Export your shortlist or comparison as PDF or CSV
6. **Admin Panel**: Login as admin to manage the lawyer database

## Deployment

### Easy Deployment Options

1. **Heroku**: 
   - Add `Procfile` with: `web: cd backend && python app.py`
   - Add `runtime.txt` with: `python-3.11.0` (or your Python version)
   - Set environment variables in Heroku dashboard
   - Deploy with Git

2. **Railway**:
   - Connect GitHub repository
   - Set start command: `cd backend && python app.py`
   - Set environment variables
   - Railway will auto-detect Python and install dependencies

3. **Render**:
   - Connect GitHub repository
   - Set build command: `cd backend && pip install -r requirements.txt`
   - Set start command: `cd backend && python app.py`

4. **PythonAnywhere**:
   - Upload files via web interface or Git
   - Create virtual environment and install dependencies
   - Configure WSGI file to point to `app.py`

5. **DigitalOcean App Platform**:
   - Connect GitHub repository
   - Auto-detects Python and installs dependencies
   - Set start command: `cd backend && python app.py`

### Database Migration

To migrate from SQLite to PostgreSQL:

1. Install PostgreSQL adapter: `pip install psycopg2-binary`
2. Update `backend/database/db.py` to use PostgreSQL connection
3. Update connection string in environment variables

## Default Admin Account

- **Email**: `admin@legalconnect.com`
- **Password**: `admin123`

**Important**: Change the admin password after first login in production!

## File Structure

```
project/
├── backend/
│   ├── app.py             # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   ├── venv/             # Virtual environment (created by you)
│   ├── database/
│   │   └── db.py         # Database connection & initialization
│   ├── middleware/
│   │   └── auth.py       # JWT authentication middleware
│   └── routes/
│       ├── auth.py       # Authentication routes
│       ├── lawyers.py    # Lawyer CRUD routes
│       ├── shortlist.py  # Shortlist routes
│       ├── comparison.py # Comparison routes
│       └── history.py    # Search history routes
├── frontend/
│   └── index.html        # Frontend application
└── README.md            # This file
```

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- API endpoints are protected with authentication middleware
- Admin routes require admin role verification
- CORS is enabled for frontend-backend communication

## License

ISC

