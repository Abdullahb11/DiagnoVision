# DiagnoVision - AI-Powered Eye Disease Detection Platform

A comprehensive web application for early detection of Diabetic Retinopathy (DR) and Glaucoma using AI-powered image analysis.

## 🏗️ Project Structure

```
DiagnoVision/
├── frontend/          # React.js frontend application
├── backend/           # FastAPI backend for ML inference
└── README.md          # This file
```

## 🚀 Quick Start

### Frontend Only

```bash
cd frontend
npm install          # or run install.bat (Windows) / install.sh (Linux/Mac)
npm run dev
```

Frontend runs on `http://localhost:3000`

### Backend Only

```bash
cd backend
pip install -r requirements.txt  # or run install.bat (Windows) / install.sh (Linux/Mac)
python -m uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### Both Frontend and Backend

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## 📋 Prerequisites

### Frontend
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Backend
- Python 3.8 or higher
- pip (Python package manager)

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework (Vite)
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Firebase** - Authentication & data storage
- **Supabase** - Image storage

### Backend
- **FastAPI** - Python web framework
- **TensorFlow/Keras** - ML model inference
- **OpenCV** - Image processing
- **Supabase** - Image storage
- **Firebase Admin SDK** - Results storage

## 📁 Detailed Setup

### Frontend Setup

See [frontend/README.md](frontend/README.md) for detailed frontend setup instructions.

### Backend Setup

See [backend/README.md](backend/README.md) for detailed backend setup instructions.

## 🔑 Configuration

### Frontend Configuration

1. Copy `.env.example` to `.env` in the `frontend/` directory
2. Fill in Firebase and Supabase credentials

### Backend Configuration

1. Copy `.env.example` to `.env` in the `backend/` directory
2. Fill in Firebase, Supabase, and model paths
3. Place your trained models in `backend/models/`

## 📊 Database Schema

See [frontend/SCHEMA.md](frontend/SCHEMA.md) for complete database schema documentation.

## 🔄 Workflow

1. **User Authentication**: Frontend handles sign up/sign in via Firebase
2. **Image Upload**: Patient uploads retinal image through frontend
3. **ML Analysis**: Frontend sends image to FastAPI backend
4. **Model Processing**: Backend runs both Glaucoma and DR models
5. **GradCAM Generation**: Backend generates explainability visualizations
6. **Storage**: Backend stores images in Supabase and results in Firebase
7. **Display**: Frontend displays results to patient/doctor

## 📝 Development Notes

- Frontend and backend can be developed independently
- Backend preprocessing and GradCAM functions are placeholders - update them to match your training notebooks
- Models should be placed in `backend/models/` directory
- Environment variables should be configured in `.env` files

## 📚 Documentation

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Database Schema](frontend/SCHEMA.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

© 2025 DiagnoVision. All rights reserved.
