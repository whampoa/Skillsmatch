# Setup Complete! 🎉

Your LegalConnect application is now running locally!

## Server Status
✅ **Server is running on:** http://localhost:3000
✅ **API Health Check:** http://localhost:3000/api/health
✅ **Frontend:** http://localhost:3000

## What Was Set Up

1. ✅ Python virtual environment created in `backend/venv/`
2. ✅ All dependencies installed (Flask, Flask-CORS, PyJWT, bcrypt, python-dotenv)
3. ✅ Database initialized with:
   - Default admin user: `admin@legalconnect.com` / `admin123`
   - Sample lawyer data seeded
4. ✅ Flask server started and running

## Access the Application

Open your web browser and navigate to:
- **Main Application:** http://localhost:3000
- **API Endpoints:** http://localhost:3000/api

## Default Admin Account

- **Email:** `admin@legalconnect.com`
- **Password:** `admin123`

⚠️ **Important:** Change the admin password after first login!

## Managing the Server

### To Stop the Server
Press `Ctrl+C` in the terminal where the server is running, or find the process and kill it:
```bash
# Find the process
ps aux | grep "python app.py"

# Kill the process (replace PID with actual process ID)
kill <PID>
```

### To Restart the Server
```bash
cd backend
./venv/bin/python app.py
```

### To Run in Development Mode
The server is already running in debug mode, so changes to Python files will automatically reload.

## Next Steps

1. **Open the application** in your browser at http://localhost:3000
2. **Test the features:**
   - Browse lawyers without signing in
   - Create a new user account
   - Login as admin to manage lawyers
   - Save lawyers to shortlist
   - Compare lawyers side-by-side
3. **Customize the application** as needed

## Troubleshooting

### If the server isn't running:
```bash
cd backend
./venv/bin/python app.py
```

### If you need to reinstall dependencies:
```bash
cd backend
./venv/bin/pip install -r requirements.txt
```

### If you need to reset the database:
Delete `backend/database/legalconnect.db` and restart the server. It will automatically recreate the database with default data.

## Environment Variables (Optional)

You can create a `.env` file in the `backend` directory to customize settings:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FLASK_ENV=development
```

Enjoy your LegalConnect application! 🚀


