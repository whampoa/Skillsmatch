# LegalConnect - Legal Expertise Matching Platform

A complete full-stack legal matching application that helps users find and compare lawyers based on their specific needs. Built with Python Flask backend and a modern, responsive frontend.

## 🎯 Overview

LegalConnect is a comprehensive platform designed to simplify the process of finding the right legal representation. The application provides intelligent matching, detailed comparisons, and powerful search capabilities to help users make informed decisions when selecting legal professionals.

## ✨ Key Features

### 🔐 User Authentication & Authorization
- **Secure Registration & Login**: JWT-based authentication system
- **Role-Based Access Control**: Separate permissions for users and administrators
- **Session Management**: Automatic token refresh and secure logout
- **Password Security**: Bcrypt hashing for all passwords

### 👨‍⚖️ Lawyer Database & Management
- **Comprehensive Profiles**: Detailed lawyer information including:
  - Practice areas and specialties
  - Experience years and case history
  - Success rates and hourly rates
  - Location (city and state)
  - Verification status and certifications
  - MARA numbers for immigration lawyers
- **Admin Panel**: Full CRUD operations for managing lawyer database
- **Automatic Seeding**: Pre-populated with sample data for testing

### 🔍 Advanced Search & Filtering
- **Multi-Criteria Filtering**: Filter by:
  - Practice area (Family Law, Conveyancing, Immigration)
  - Location (State and City)
  - Experience level
  - Hourly rate range
  - Verification status
  - Mediation certification
  - Response guarantee
- **Real-time Search**: Instant results as you type
- **No Account Required**: Browse and search lawyers without signing up

### 📋 Shortlist Management
- **Save Favorite Lawyers**: Build your personalized shortlist
- **Persistent Storage**: Shortlists saved to your account
- **Quick Access**: Easy retrieval of saved lawyers
- **Export Options**: Download shortlist as PDF or CSV

### ⚖️ Lawyer Comparison
- **Side-by-Side Comparison**: Compare up to 3 lawyers simultaneously
- **Detailed Metrics**: Compare experience, rates, success rates, and more
- **Visual Comparison**: Easy-to-read comparison tables
- **Export Comparisons**: Save comparison results as PDF or CSV

### 📊 Search History
- **Track Your Searches**: Automatic logging of search queries
- **Review Past Searches**: Access your search history anytime
- **Result Tracking**: See how many results each search returned

### 📤 Export Functionality
- **PDF Export**: Professional PDF documents of shortlists and comparisons
- **CSV Export**: Spreadsheet-friendly format for data analysis
- **Free Exports**: No charges for exporting data

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0.0 (Python web framework)
- **Database**: SQLite (easily migratable to PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens) with PyJWT
- **Security**: Bcrypt for password hashing
- **CORS**: Flask-CORS for cross-origin requests
- **Environment**: python-dotenv for configuration management

### Frontend
- **Framework**: Alpine.js (lightweight JavaScript framework)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Maps**: Leaflet.js for location visualization
- **Charts**: Chart.js for analytics and visualizations
- **PDF Generation**: jsPDF for client-side PDF creation
- **Icons**: Font Awesome 6.4.0

### Architecture
- **RESTful API**: Clean API design with proper HTTP methods
- **Blueprint Pattern**: Modular route organization
- **Middleware**: Authentication middleware for protected routes
- **Single Page Application**: SPA routing with Flask static file serving

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** (Python 3.11+ recommended)
- **pip** (Python package installer)
- **Git** (for cloning the repository)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Skillsmatch
```

#### 2. Create Python Virtual Environment

It's recommended to use a virtual environment to isolate project dependencies:

```bash
cd backend
python3 -m venv venv
```

**Note**: On some systems, you may need to use `python` instead of `python3`.

#### 3. Activate Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**On Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

You should see `(venv)` in your terminal prompt, indicating the virtual environment is active.

#### 4. Install Dependencies

With the virtual environment activated, install all required packages:

```bash
pip install -r requirements.txt
```

This will install:
- Flask 3.0.0
- Flask-CORS 4.0.0
- PyJWT 2.8.0
- bcrypt 4.1.1
- python-dotenv 1.0.0

#### 5. Configure Environment Variables (Optional)

Create a `.env` file in the `backend` directory to customize configuration:

```env
# Server Configuration
PORT=3000
FLASK_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: 
- Change `JWT_SECRET` to a strong, random string in production
- Never commit `.env` files to version control
- The `.env` file is already included in `.gitignore`

#### 6. Initialize Database

The database will be automatically initialized when you first run the server. The initialization process will:

1. **Create Database Tables**:
   - `users` - User accounts and authentication
   - `lawyers` - Lawyer profiles and information
   - `shortlists` - User shortlists
   - `comparisons` - Lawyer comparisons
   - `search_history` - Search query history

2. **Create Default Admin User**:
   - Email: `admin@legalconnect.com`
   - Password: `admin123`
   - Role: `admin`

3. **Seed Sample Data**:
   - Pre-populated with sample lawyers across different practice areas
   - Includes lawyers from different states (NSW, VIC, QLD)
   - Various experience levels and pricing tiers

#### 7. Start the Server

**Option 1: Using app.py (Recommended)**
```bash
python app.py
```

**Option 2: Using Flask CLI**
```bash
flask run --port=3000
```

**Option 3: Using Virtual Environment Python Directly**
```bash
./venv/bin/python app.py
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

You should see output similar to:
```
Database initialized
Server running on http://localhost:3000
API endpoints available at http://localhost:3000/api
 * Running on http://0.0.0.0:3000
```

#### 8. Access the Application

Open your web browser and navigate to:
- **Frontend**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health
- **API Base**: http://localhost:3000/api

### Quick Start (One-Line Setup)

For a quick setup, you can run:

```bash
cd backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt && ./venv/bin/python app.py
```

This will create the virtual environment, install dependencies, and start the server in one command.

## 📡 API Documentation

The LegalConnect API follows RESTful conventions and returns JSON responses. All endpoints are prefixed with `/api`.

### Base URL
```
http://localhost:3000/api
```

### Authentication

Most endpoints require authentication via JWT tokens. Include the token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

#### Register New User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Email already exists"
}
```

#### Login
**POST** `/api/auth/login`

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

#### Get Current User
**GET** `/api/auth/me`

Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-01-15T10:30:00"
}
```

### Lawyers

#### Get All Lawyers
**GET** `/api/lawyers`

Retrieve all lawyers with optional filtering. No authentication required.

**Query Parameters:**
- `practice_area` - Filter by practice area (family, conveyancing, immigration)
- `state` - Filter by state (NSW, VIC, QLD, etc.)
- `city` - Filter by city
- `min_experience` - Minimum years of experience
- `max_rate` - Maximum hourly rate
- `verified` - Filter by verification status (0 or 1)
- `mediation_certified` - Filter by mediation certification (0 or 1)
- `response_guarantee` - Filter by response guarantee (0 or 1)

**Example Request:**
```
GET /api/lawyers?practice_area=family&state=NSW&min_experience=10
```

**Response (200 OK):**
```json
{
  "lawyers": [
    {
      "id": 1,
      "name": "Sarah Mitchell",
      "firm": "Family Law Partners",
      "tier": "top",
      "practice_area": "family",
      "specialties": ["Divorce", "Child Custody", "Property Settlement"],
      "experience_years": 15,
      "case_count": 450,
      "success_rate": 92,
      "hourly_rate_min": 450,
      "hourly_rate_max": 800,
      "location_city": "Sydney",
      "location_state": "NSW",
      "verified": true,
      "mediation_certified": true,
      "response_guarantee": true,
      "bio": "Family law specialist with extensive experience..."
    }
  ],
  "total": 1
}
```

#### Get Single Lawyer
**GET** `/api/lawyers/:id`

Retrieve detailed information about a specific lawyer.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Sarah Mitchell",
  "firm": "Family Law Partners",
  ...
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Lawyer not found"
}
```

#### Create Lawyer (Admin Only)
**POST** `/api/lawyers`

Create a new lawyer profile. Requires admin authentication.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "firm": "Smith Legal",
  "tier": "mid",
  "practice_area": "conveyancing",
  "specialties": ["Residential", "Commercial"],
  "experience_years": 8,
  "case_count": 200,
  "success_rate": 85,
  "hourly_rate_min": 200,
  "hourly_rate_max": 400,
  "location_city": "Melbourne",
  "location_state": "VIC",
  "verified": true,
  "mediation_certified": false,
  "response_guarantee": true,
  "bio": "Experienced conveyancer..."
}
```

**Response (201 Created):**
```json
{
  "message": "Lawyer created successfully",
  "lawyer": { ... }
}
```

#### Update Lawyer (Admin Only)
**PUT** `/api/lawyers/:id`

Update an existing lawyer profile. Requires admin authentication.

**Request Body:** (Same as create, but all fields optional)

**Response (200 OK):**
```json
{
  "message": "Lawyer updated successfully",
  "lawyer": { ... }
}
```

#### Delete Lawyer (Admin Only)
**DELETE** `/api/lawyers/:id`

Delete a lawyer profile. Requires admin authentication.

**Response (200 OK):**
```json
{
  "message": "Lawyer deleted successfully"
}
```

### Shortlist

All shortlist endpoints require authentication.

#### Get User's Shortlist
**GET** `/api/shortlist`

Retrieve all lawyers in the authenticated user's shortlist.

**Response (200 OK):**
```json
{
  "shortlist": [
    {
      "id": 1,
      "lawyer_id": 5,
      "lawyer": {
        "id": 5,
        "name": "Sarah Mitchell",
        ...
      },
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

#### Add to Shortlist
**POST** `/api/shortlist/:lawyerId`

Add a lawyer to the user's shortlist.

**Response (201 Created):**
```json
{
  "message": "Lawyer added to shortlist",
  "shortlist": { ... }
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Lawyer already in shortlist"
}
```

#### Remove from Shortlist
**DELETE** `/api/shortlist/:lawyerId`

Remove a lawyer from the user's shortlist.

**Response (200 OK):**
```json
{
  "message": "Lawyer removed from shortlist"
}
```

### Comparison

All comparison endpoints require authentication. Maximum of 3 lawyers can be compared at once.

#### Get Comparison List
**GET** `/api/comparison`

Retrieve all lawyers in the user's comparison list.

**Response (200 OK):**
```json
{
  "comparison": [
    {
      "id": 1,
      "lawyer_id": 5,
      "lawyer": { ... },
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

#### Add to Comparison
**POST** `/api/comparison/:lawyerId`

Add a lawyer to the comparison list.

**Response (201 Created):**
```json
{
  "message": "Lawyer added to comparison",
  "comparison": { ... }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Maximum 3 lawyers can be compared"
}
```

#### Remove from Comparison
**DELETE** `/api/comparison/:lawyerId`

Remove a lawyer from the comparison list.

**Response (200 OK):**
```json
{
  "message": "Lawyer removed from comparison"
}
```

#### Clear All Comparisons
**DELETE** `/api/comparison`

Remove all lawyers from the comparison list.

**Response (200 OK):**
```json
{
  "message": "Comparison list cleared"
}
```

### Search History

All history endpoints require authentication.

#### Get Search History
**GET** `/api/history`

Retrieve the user's search history, ordered by most recent first.

**Response (200 OK):**
```json
{
  "history": [
    {
      "id": 1,
      "practice_area": "family",
      "state": "NSW",
      "min_experience": 10,
      "max_rate": 500,
      "result_count": 15,
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

#### Save Search to History
**POST** `/api/history`

Save a search query to the user's history.

**Request Body:**
```json
{
  "practice_area": "family",
  "state": "NSW",
  "min_experience": 10,
  "max_rate": 500,
  "response_guarantee": 1,
  "result_count": 15
}
```

**Response (201 Created):**
```json
{
  "message": "Search saved to history",
  "history": { ... }
}
```

### Health Check

#### API Health Status
**GET** `/api/health`

Check if the API is running and healthy.

**Response (200 OK):**
```json
{
  "status": "ok",
  "message": "LegalConnect API is running"
}
```

## 📖 Usage Guide

### For End Users

1. **Browse Lawyers** (No Account Required)
   - Visit the homepage and use the search interface
   - Apply filters to narrow down your search
   - View detailed lawyer profiles
   - No registration needed for browsing

2. **Create an Account**
   - Click "Sign Up" to create a free account
   - Provide your name, email, and password
   - You'll be automatically logged in after registration

3. **Save to Shortlist**
   - Click the "Save" button on any lawyer profile
   - Access your shortlist from the navigation menu
   - Build a collection of lawyers you're interested in

4. **Compare Lawyers**
   - Add up to 3 lawyers to your comparison list
   - View side-by-side comparisons of key metrics
   - Compare experience, rates, success rates, and more

5. **Export Data**
   - Export your shortlist as PDF or CSV
   - Export comparison results for offline review
   - All exports are free and unlimited

6. **View Search History**
   - Access your search history from your account
   - Review past searches and results
   - Quickly repeat previous searches

### For Administrators

1. **Admin Login**
   - Use the default admin credentials:
     - Email: `admin@legalconnect.com`
     - Password: `admin123`
   - **Important**: Change the password immediately after first login

2. **Manage Lawyers**
   - Add new lawyer profiles
   - Update existing lawyer information
   - Delete lawyers from the database
   - All changes are immediately reflected in the application

3. **Database Management**
   - The database is stored in `backend/database/legalconnect.db`
   - Backup the database file regularly
   - Reset the database by deleting the `.db` file and restarting the server

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

## 🔒 Security

### Authentication & Authorization
- **Password Hashing**: All passwords are hashed using bcrypt with automatic salt generation
- **JWT Tokens**: Secure token-based authentication with configurable expiration (default: 7 days)
- **Role-Based Access**: Separate user and admin roles with appropriate permissions
- **Protected Routes**: Authentication middleware protects sensitive endpoints
- **Admin Verification**: Admin-only routes verify user role before allowing access

### Best Practices
- **Environment Variables**: Sensitive data stored in `.env` files (not committed to git)
- **CORS Configuration**: Properly configured CORS for frontend-backend communication
- **SQL Injection Prevention**: Parameterized queries prevent SQL injection attacks
- **Input Validation**: Server-side validation for all user inputs

### Production Checklist
- [ ] Change default admin password
- [ ] Set a strong `JWT_SECRET` in environment variables
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Enable rate limiting for API endpoints
- [ ] Use a production-grade WSGI server (e.g., Gunicorn)
- [ ] Migrate from SQLite to PostgreSQL for production

## 🐛 Troubleshooting

### Common Issues

#### Server Won't Start

**Problem**: Port already in use
```bash
Error: [Errno 48] Address already in use
```

**Solution**: 
- Change the port in `.env` file: `PORT=3001`
- Or kill the process using the port:
  ```bash
  lsof -ti:3000 | xargs kill -9
  ```

#### Module Not Found Errors

**Problem**: `ModuleNotFoundError: No module named 'flask'`

**Solution**: 
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`
- Verify you're using the virtual environment's Python:
  ```bash
  which python  # Should point to venv/bin/python
  ```

#### Database Errors

**Problem**: Database locked or corrupted

**Solution**:
- Stop the server
- Delete `backend/database/legalconnect.db`
- Restart the server (database will be recreated)

#### Authentication Issues

**Problem**: JWT token invalid or expired

**Solution**:
- Log out and log back in to get a new token
- Check that `JWT_SECRET` matches between server restarts
- Verify token is being sent in `Authorization` header

#### CORS Errors

**Problem**: CORS policy blocking requests

**Solution**:
- Verify Flask-CORS is installed
- Check CORS configuration in `app.py`
- Ensure frontend URL is allowed in CORS settings

### Getting Help

If you encounter issues not covered here:
1. Check the server logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure Python version is 3.8 or higher
4. Check that the database file has proper permissions

## 🛠️ Development

### Project Structure

```
Skillsmatch/
├── backend/
│   ├── app.py                 # Main Flask application entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (not in git)
│   ├── venv/                 # Virtual environment (not in git)
│   ├── database/
│   │   ├── __init__.py
│   │   ├── db.py             # Database connection and initialization
│   │   ├── db.js             # Legacy Node.js database file
│   │   └── legalconnect.db  # SQLite database (not in git)
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── auth.py           # JWT authentication middleware
│   │   └── auth.js           # Legacy Node.js auth file
│   └── routes/
│       ├── __init__.py
│       ├── auth.py           # Authentication routes
│       ├── lawyers.py        # Lawyer CRUD operations
│       ├── shortlist.py      # Shortlist management
│       ├── comparison.py     # Comparison functionality
│       ├── history.py        # Search history
│       └── *.js              # Legacy Node.js route files
├── frontend/
│   └── index.html            # Single-page frontend application
├── README.md                 # This file
├── GITHUB_SETUP.md          # GitHub setup instructions
└── SETUP_COMPLETE.md        # Local setup completion guide
```

### Development Workflow

1. **Activate Virtual Environment**
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```

2. **Make Changes**
   - Edit Python files in `backend/routes/` or `backend/middleware/`
   - Edit frontend in `frontend/index.html`
   - Flask debug mode will auto-reload on file changes

3. **Test Changes**
   - Test API endpoints using curl, Postman, or the frontend
   - Check server logs for errors
   - Verify database changes

4. **Database Changes**
   - Modify `backend/database/db.py` for schema changes
   - Delete `legalconnect.db` to reset database
   - Restart server to apply changes

### Adding New Features

1. **New API Endpoint**:
   - Create route in appropriate file in `backend/routes/`
   - Register blueprint in `backend/app.py`
   - Add authentication middleware if needed

2. **New Database Table**:
   - Add table creation SQL in `init_database()` in `backend/database/db.py`
   - Add seed data if needed

3. **New Frontend Feature**:
   - Edit `frontend/index.html`
   - Use Alpine.js for interactivity
   - Make API calls to backend endpoints

### Code Style

- Follow PEP 8 for Python code
- Use descriptive variable and function names
- Add comments for complex logic
- Keep functions focused and small
- Use type hints where appropriate

## 🚀 Deployment

### Production Considerations

Before deploying to production:

1. **Environment Setup**
   - Set `FLASK_ENV=production`
   - Use a strong, unique `JWT_SECRET`
   - Configure proper CORS origins
   - Set up environment variables securely

2. **Database**
   - Migrate from SQLite to PostgreSQL for production
   - Set up regular database backups
   - Configure connection pooling

3. **Server**
   - Use a production WSGI server (Gunicorn, uWSGI)
   - Set up reverse proxy (Nginx, Apache)
   - Enable HTTPS with SSL certificates
   - Configure logging and monitoring

4. **Security**
   - Change default admin password
   - Enable rate limiting
   - Set up firewall rules
   - Regular security updates

### Deployment Platforms

#### Heroku
1. Add `Procfile`: `web: cd backend && gunicorn app:app`
2. Add `runtime.txt` with Python version
3. Set environment variables in Heroku dashboard
4. Deploy: `git push heroku main`

#### Railway
1. Connect GitHub repository
2. Set start command: `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
3. Add environment variables
4. Deploy automatically on push

#### Render
1. Connect GitHub repository
2. Build command: `cd backend && pip install -r requirements.txt`
3. Start command: `cd backend && gunicorn app:app`
4. Set environment variables

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Auto-detects Python
3. Set start command: `cd backend && gunicorn app:app`
4. Configure environment variables

### Database Migration to PostgreSQL

1. Install PostgreSQL adapter:
   ```bash
   pip install psycopg2-binary
   ```

2. Update `backend/database/db.py`:
   ```python
   import psycopg2
   from psycopg2.extras import RealDictCursor
   
   def get_db():
       conn = psycopg2.connect(os.getenv('DATABASE_URL'))
       conn.cursor_factory = RealDictCursor
       return conn
   ```

3. Set `DATABASE_URL` environment variable
4. Run migrations to create tables

## 📝 Default Admin Account

- **Email**: `admin@legalconnect.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **CRITICAL**: Change the admin password immediately after first login in production environments!

## 📄 License

ISC License

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

---

**Built with ❤️ using Flask and modern web technologies**

