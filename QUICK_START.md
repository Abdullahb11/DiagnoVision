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

### Step 1: Clone the Repository
```bash
git clone https://github.com/Abdullahb11/DiagnoVision.git
cd DiagnoVision
```

### Step 2: Run Setup Script
**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

This will install all dependencies for both backend and frontend.

### Step 3: Configure Environment Variables

**⚠️ Important:** The `.env` files are **NOT** pushed to GitHub for security reasons. You need to create them manually after cloning.

#### Backend Configuration

1. **Copy the example file:**
   ```bash
   cd backend
   copy .env.example .env          # Windows
   # cp .env.example .env          # Linux/Mac
   ```

2. **Edit `backend/.env` and fill in your credentials:**
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_supabase_service_key_here
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./firebase-service-account.json
   API_PORT=8000
   API_HOST=0.0.0.0
   GLAUCOMA_MODEL_PATH=./models/glaucoma_mobilenet_best.pth
   DR_MODEL_PATH=./models/dr_model.h5
   ```

3. **Firebase Service Account Key:**
   - Download your Firebase service account key JSON file from [Firebase Console](https://console.firebase.google.com/)
   - Go to **Project Settings** → **Service Accounts** → **Generate New Private Key**
   - Save the JSON file as `firebase-service-account.json` in the `backend/` directory
   - Update `FIREBASE_SERVICE_ACCOUNT_KEY_PATH` in `.env` if you use a different filename/path

#### Frontend Configuration

1. **Copy the example file:**
   ```bash
   cd frontend
   copy .env.example .env          # Windows
   # cp .env.example .env          # Linux/Mac
   ```

2. **Edit `frontend/.env` and fill in your credentials:**
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Where to find these values:**
   - **Firebase:** Go to [Firebase Console](https://console.firebase.google.com/) → **Project Settings** → **General** → **Your apps**
   - **Supabase:** Go to [Supabase Dashboard](https://app.supabase.com/) → **Project Settings** → **API**

### Step 4: Place Model Files

Ensure your model files are in the correct location:
- Glaucoma model: `backend/models/glaucoma_mobilenet_best.pth` (should already be there)
- DR model: `backend/models/dr_model.h5` (if you have it)

### Step 5: Run the Application

**Option 1: Using the run script (Recommended)**
```bash
# Windows
run.bat

# Linux/Mac
chmod +x run.sh
./run.sh
```

**Option 2: Manual (Two Terminals)**

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:5173 (or the port shown in terminal)
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

---

## 🔒 Security Notes

- **Never commit `.env` files** - They contain sensitive credentials
- `.env` files are already in `.gitignore` and will **NOT** be pushed to GitHub
- Always use `.env.example` files as templates
- Share credentials securely with team members (not through GitHub)

---

## ❓ Troubleshooting

### Backend won't start
- Check that `backend/.env` exists and has all required variables
- Verify virtual environment is activated
- Check that model files exist in the correct paths

### Frontend won't start
- Check that `frontend/.env` exists and has all required variables
- **Restart the dev server** after creating/updating `.env` file (Vite needs restart to load new env vars)
- Check browser console for missing environment variable errors

### Firebase/Supabase connection errors
- Verify all credentials in `.env` files are correct
- Check that Firebase service account key file exists (for backend)
- Ensure Supabase project is active and accessible

---

See `README.md` for detailed instructions and `GITHUB_SETUP.md` for GitHub-specific help.

