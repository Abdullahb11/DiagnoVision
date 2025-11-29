# Quick Start Guide - DiagnoVision

## 🚀 For First Time Setup (After Cloning)

### Quick Setup (Recommended - Installs Everything)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

This will automatically:
- Create Python virtual environment
- Install all backend dependencies (including TensorFlow, Firebase Admin, etc.)
- Install all frontend dependencies

### Manual Setup (Alternative)

#### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
# Create .env file with your credentials
```

#### Frontend Setup
```bash
cd frontend
npm install
# Update firebase.js and supabase.js with your credentials
```

### Run Application
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate          # Windows
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📤 Push to GitHub (First Time)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Abdullahb11/DiagnoVision.git
git push -u origin main
```

---

## 📥 Clone & Setup on New System

```bash
git clone https://github.com/Abdullahb11/DiagnoVision.git
cd DiagnoVision

# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

After running the setup script:
1. Backend: Copy `backend/.env.example` to `backend/.env` and fill in your configuration
2. Backend: Place your model files in `backend/models/` directory
3. Frontend: Update `frontend/src/config/firebase.js` and `supabase.js` with your credentials

---

See `README.md` for detailed instructions and `GITHUB_SETUP.md` for GitHub-specific help.

