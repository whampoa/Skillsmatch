# GitHub Repository Setup Guide

## Option 1: Connect to Existing GitHub Repository

If you already have a GitHub repository:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Convert to Python Flask backend"

# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 2: Create New GitHub Repository

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Enter repository name (e.g., `legalconnect`)
3. Choose Public or Private
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 2: Connect Local Code to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: LegalConnect - Python Flask backend with user authentication"

# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Option 3: If Repository Already Exists and Has Code

If your GitHub repo already has code and you want to replace it:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Update: Convert to Python Flask backend with virtual environment support"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Force push (WARNING: This overwrites existing code on GitHub)
git branch -M main
git push -u origin main --force
```

**⚠️ Warning**: `--force` will overwrite everything on GitHub. Only use if you're sure you want to replace the existing code.

## Option 4: Update Existing Repository (Recommended)

If you already have a git repository connected:

```bash
# Check current status
git status

# Add all new/changed files
git add .

# Commit changes
git commit -m "Convert backend to Python Flask with virtual environment support"

# Push to GitHub
git push origin main
```

## Quick Reference Commands

```bash
# Check git status
git status

# See what files changed
git diff

# Add specific file
git add filename

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest from GitHub
git pull origin main

# View commit history
git log --oneline
```

## Important Files to Commit

Make sure these are included:
- ✅ `backend/app.py` - Main Flask application
- ✅ `backend/requirements.txt` - Python dependencies
- ✅ `backend/database/db.py` - Database setup
- ✅ `backend/routes/` - All route files
- ✅ `backend/middleware/auth.py` - Authentication
- ✅ `frontend/index.html` - Frontend application
- ✅ `README.md` - Documentation
- ✅ `.gitignore` - Git ignore rules

## Files NOT to Commit (Already in .gitignore)

- ❌ `backend/venv/` - Virtual environment
- ❌ `backend/__pycache__/` - Python cache
- ❌ `backend/database/*.db` - Database files
- ❌ `.env` - Environment variables (if you create one)

## Setting Up GitHub Actions (Optional)

If you want automated deployment, you can add a GitHub Actions workflow file.

