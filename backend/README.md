# DiagnoVision Backend - FastAPI

FastAPI backend for AI-powered eye disease detection (Glaucoma and Diabetic Retinopathy).

## Tech Stack

- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - ML model inference
- **OpenCV** - Image processing
- **Supabase** - Image storage
- **Firebase Admin SDK** - Results storage

## Features

- Separate preprocessing pipelines for Glaucoma and DR (matching training notebooks)
- ML model inference for both diseases
- GradCAM visualization generation
- Automatic image storage in Supabase
- Results storage in Firebase

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

### Quick Setup (Recommended)

**Windows:**
```bash
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Manual Installation

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your configuration in `.env`:
   - Firebase credentials (same as frontend)
   - Supabase URL and service key
   - Model paths (update when you add your trained models)

3. Place your trained model files:
   - Glaucoma model: `models/glaucoma_model.h5`
   - DR model: `models/dr_model.h5`

## Running the Server

### Development Mode

```bash
# Activate virtual environment first
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Run server
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Image
```
POST /api/analyze
Content-Type: multipart/form-data

Body:
- image: <file>
- firebase_token: <string>
- patient_id: <string>

Response:
{
  "success": true,
  "glaucoma": {
    "result_msg": "...",
    "confidence": 0.85,
    "image_id": "..."
  },
  "dr": {
    "result_msg": "...",
    "confidence": 0.90,
    "image_id": "..."
  },
  "image_url": "...",
  "gradcam_url": "..."
}
```

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration management
│   ├── models/                 # ML model loaders
│   │   ├── glaucoma_model.py
│   │   └── dr_model.py
│   ├── preprocessing/          # Image preprocessing
│   │   ├── glaucoma_preprocess.py
│   │   └── dr_preprocess.py
│   ├── gradcam/                # GradCAM generation
│   │   ├── glaucoma_gradcam.py
│   │   └── dr_gradcam.py
│   ├── pipelines/              # Complete pipelines
│   │   ├── glaucoma_pipeline.py
│   │   └── dr_pipeline.py
│   ├── services/                # External services
│   │   ├── supabase_service.py
│   │   └── firebase_service.py
│   └── api/                     # API routes
│       └── routes.py
├── models/                      # Place your trained models here
├── requirements.txt
├── install.bat
├── install.sh
└── README.md
```

## Updating Preprocessing

The preprocessing functions in `app/preprocessing/` are placeholders. Update them to match your training notebook:

1. Open `app/preprocessing/glaucoma_preprocess.py`
2. Update `preprocess()` method to match your training preprocessing steps
3. Do the same for `app/preprocessing/dr_preprocess.py`

## Updating GradCAM

The GradCAM functions in `app/gradcam/` are placeholders. Update them to match your training notebook:

1. Open `app/gradcam/glaucoma_gradcam.py`
2. Update `generate_gradcam()` method to match your training implementation
3. Do the same for `app/gradcam/dr_gradcam.py`

## Firebase Setup

1. Download Firebase service account key JSON file
2. Place it in the backend directory
3. Update `app/services/firebase_service.py` to use the key file

## Supabase Setup

1. Get your Supabase URL and service role key
2. Add them to `.env` file
3. Ensure Supabase storage bucket "images" exists

## Development Notes

- Models are loaded lazily on first request
- Preprocessing and GradCAM functions need to be updated to match your training notebooks
- All placeholder functions will log warnings when used

## License

© 2025 DiagnoVision. All rights reserved.

