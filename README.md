# DiagnoVision

**AI-Powered Medical Image Analysis Platform for Glaucoma and Diabetic Retinopathy Detection**

DiagnoVision is a full-stack web application that uses machine learning models to analyze retinal images and detect signs of Glaucoma and Diabetic Retinopathy. The platform provides real-time analysis with GradCAM visualizations to help doctors and patients understand the AI's predictions.

---

## 🚀 Features

- **User Authentication**: Firebase-based authentication with role-based access (Patient/Doctor)
- **Image Analysis**: Upload retinal images for AI-powered analysis
- **Glaucoma Detection**: PyTorch MobileNetV2 model for Glaucoma detection
- **GradCAM Visualization**: Three visualization types (Original, Heatmap, Overlay)
- **Results Storage**: Automatic storage in Firebase Firestore and Supabase
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** - [Sign up](https://firebase.google.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abdullahb11/DiagnoVision.git
cd DiagnoVision
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Or use the install script:
# Windows: install.bat
# Linux/Mac: ./install.sh
```

**Configure Environment Variables:**

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=https://xoyxfcmpzmjjzwulejvr.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
GLAUCOMA_MODEL_PATH=models/glaucoma_mobilenet_best.pth
```

**Note:** The Glaucoma model file (`glaucoma_mobilenet_best.pth`) should already be in `backend/models/` directory.

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or use the install script:
# Windows: install.bat
# Linux/Mac: ./install.sh
```

**Configure Firebase:**

Update `frontend/src/config/firebase.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

**Configure Supabase:**

Update `frontend/src/config/supabase.js` with your Supabase credentials:

```javascript
const supabaseUrl = "https://your-project.supabase.co"
const supabaseAnonKey = "your-anon-key"
```

**Configure API Endpoint:**

Update `frontend/src/config/api.js` with your backend URL:

```javascript
export const API_BASE_URL = "http://localhost:8000" // Change for production
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend

# Activate virtual environment (if using)
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

# Start FastAPI server
uvicorn app.main:app --reload

# Server will run on http://localhost:8000
```

### Start Frontend Development Server

```bash
cd frontend

# Start Vite dev server
npm run dev

# Server will run on http://localhost:5173
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

---

## 📁 Project Structure

```
DiagnoVision/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── config.py       # Configuration
│   │   ├── api/            # API routes
│   │   ├── models/         # ML model loaders
│   │   ├── preprocessing/  # Image preprocessing
│   │   ├── gradcam/        # GradCAM visualization
│   │   ├── pipelines/      # ML pipelines
│   │   └── services/       # External services
│   ├── models/             # Trained model files
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (create this)
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── config/         # Configuration files
│   │   └── pages/          # Page components
│   ├── package.json        # Node dependencies
│   └── .env                # Environment variables (if needed)
│
├── README.md               # This file
└── workDone.md             # Project status documentation
```

---

## 🔧 Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Copy configuration to `frontend/src/config/firebase.js`

### Supabase Setup

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Create a storage bucket named `images` (make it public)
4. Create `images` table with schema:
   ```sql
   CREATE TABLE images (
     imageId UUID PRIMARY KEY,
     Image_url TEXT,
     heatmap_url TEXT,
     overlay_url TEXT,
     grad_cam_url TEXT
   );
   ```
5. Copy URL and keys to configuration files

---

## 🧪 Testing

### Test Backend API

```bash
# Start backend server
cd backend
uvicorn app.main:app --reload

# Test endpoint (using curl or Postman)
curl -X POST "http://localhost:8000/api/analyze" \
  -F "image=@path/to/test/image.jpg" \
  -F "patient_id=test_patient_id"
```

### Test Frontend

1. Start both backend and frontend servers
2. Navigate to http://localhost:5173
3. Sign up as a patient
4. Upload a retinal image
5. View analysis results

---

## 📦 Dependencies

### Backend Dependencies

- FastAPI 0.104.1
- PyTorch 2.9.1
- Torchvision 0.24.1
- Captum 0.8.0 (GradCAM)
- Supabase Python SDK 2.0.3
- See `backend/requirements.txt` for complete list

### Frontend Dependencies

- React 18.2.0
- Vite 5.0.8
- React Router 6.20.0
- Tailwind CSS 3.3.6
- Firebase SDK 10.7.1
- Supabase JS 2.38.4
- See `frontend/package.json` for complete list

---

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on hosting platform
2. Install dependencies: `pip install -r requirements.txt`
3. Run: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend Deployment

1. Build production version: `npm run build`
2. Deploy `dist/` folder to hosting service (Vercel, Netlify, etc.)
3. Update API endpoint in `frontend/src/config/api.js`

---

## 📝 Current Status

**✅ Completed:**
- User authentication (Firebase)
- Patient/Doctor signup with profile creation
- Glaucoma model integration
- Image upload and analysis
- GradCAM visualization (3 images)
- Results storage in Firebase and Supabase

**⏳ In Progress:**
- DR (Diabetic Retinopathy) model integration
- Messaging system
- Appointment booking
- History page functionality

See `workDone.md` for detailed status and roadmap.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Abdullah** - [GitHub](https://github.com/Abdullahb11)

---

## 🙏 Acknowledgments

- PyTorch team for the ML framework
- Firebase and Supabase for backend services
- React and Vite communities

---

## 📞 Support

For issues and questions, please open an issue on [GitHub](https://github.com/Abdullahb11/DiagnoVision/issues).

---

**Last Updated:** January 2025

