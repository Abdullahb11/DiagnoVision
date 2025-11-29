# GitHub Setup & Deployment Guide

This guide will help you push DiagnoVision to GitHub and set it up on a new system.

---

## 📤 Pushing to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to project root
cd DiagnoVision

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: DiagnoVision project setup"
```

### Step 2: Add GitHub Remote

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/Abdullahb11/DiagnoVision.git

# Verify remote was added
git remote -v
```

### Step 3: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys
- Use GitHub CLI: `gh auth login`

### Step 4: Verify Upload

1. Go to https://github.com/Abdullahb11/DiagnoVision
2. Verify all files are uploaded
3. Check that `backend/models/glaucoma_mobilenet_best.pth` is included

---

## 📥 Cloning & Setting Up on a New System

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Abdullahb11/DiagnoVision.git

# Navigate to project directory
cd DiagnoVision
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
# Windows:
copy .env.example .env
# Linux/Mac:
cp .env.example .env

# Edit .env file and add your credentials:
# SUPABASE_URL=https://xoyxfcmpzmjjzwulejvr.supabase.co
# SUPABASE_SERVICE_KEY=your_supabase_service_key_here
# GLAUCOMA_MODEL_PATH=models/glaucoma_mobilenet_best.pth
```

**Quick Install Script (if available):**
```bash
# Windows
install.bat

# Linux/Mac
chmod +x install.sh
./install.sh
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Or use install script:
# Windows: install.bat
# Linux/Mac: ./install.sh
```

**Configure Firebase:**
1. Open `frontend/src/config/firebase.js`
2. Replace with your Firebase credentials

**Configure Supabase:**
1. Open `frontend/src/config/supabase.js`
2. Replace with your Supabase credentials

**Configure API Endpoint:**
1. Open `frontend/src/config/api.js`
2. Update `API_BASE_URL` if backend is on different port/domain

### Step 4: Verify Model File

```bash
# Check if glaucoma model exists
ls backend/models/glaucoma_mobilenet_best.pth

# If missing, you may need to download it separately
# (Check if it's in .gitignore or if it's too large for GitHub)
```

**Note:** If the model file is too large (>100MB), GitHub may not allow it. In that case:
1. Use Git LFS: `git lfs track "*.pth"`
2. Or host the model separately and download it during setup

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Activate venv if not already active
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Start server
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend

# Start dev server
npm run dev
```

### Step 6: Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔄 Updating the Repository

### Making Changes and Pushing

```bash
# Check status
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### Pulling Latest Changes

```bash
# Pull latest changes
git pull origin main

# If you have local changes, you may need to:
git stash
git pull origin main
git stash pop
```

---

## ⚠️ Important Notes

### Files NOT Tracked by Git

The following files are ignored (for security):
- `.env` files (contain secrets)
- `node_modules/` (can be reinstalled)
- `__pycache__/` (Python cache)
- Virtual environments (`venv/`, `env/`)

### Files That ARE Tracked

- Source code
- Configuration files (without secrets)
- `glaucoma_mobilenet_best.pth` (model file)
- `package.json` and `requirements.txt`

### Environment Variables

**Never commit `.env` files!** They contain:
- Supabase service keys
- Firebase API keys
- Other sensitive credentials

Instead:
1. Use `.env.example` files as templates
2. Document required variables in README
3. Each developer creates their own `.env` file

---

## 🐛 Troubleshooting

### Issue: "Permission denied" when pushing

**Solution:**
```bash
# Use Personal Access Token instead of password
# Or set up SSH keys:
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add public key to GitHub Settings > SSH Keys
```

### Issue: Model file too large for GitHub

**Solution:**
```bash
# Install Git LFS
git lfs install

# Track .pth files
git lfs track "*.pth"

# Add and commit
git add .gitattributes
git add backend/models/glaucoma_mobilenet_best.pth
git commit -m "Add model file with LFS"
git push origin main
```

### Issue: "Module not found" after cloning

**Solution:**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port 8000 (backend)
# Windows:
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9

# Or change port in uvicorn command:
uvicorn app.main:app --reload --port 8001
```

---

## 📋 Checklist for New System Setup

- [ ] Clone repository
- [ ] Install Node.js and Python
- [ ] Set up backend virtual environment
- [ ] Install backend dependencies
- [ ] Create backend `.env` file with credentials
- [ ] Install frontend dependencies
- [ ] Configure Firebase in `frontend/src/config/firebase.js`
- [ ] Configure Supabase in `frontend/src/config/supabase.js`
- [ ] Verify model file exists
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test application

---

## 🔗 Useful Commands

```bash
# Check git status
git status

# View commit history
git log

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# View remote repositories
git remote -v

# Update remote URL (if needed)
git remote set-url origin https://github.com/Abdullahb11/DiagnoVision.git
```

---

**Last Updated:** January 2025

