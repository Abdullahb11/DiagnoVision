import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Get the backend directory (parent of app directory)
BACKEND_DIR = Path(__file__).parent.parent
MODELS_DIR = BACKEND_DIR / "models"


def _resolve_firebase_key_path() -> Optional[str]:
    """Resolve service account path relative to backend/ when not absolute."""
    raw = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH")
    if not raw:
        return None
    p = Path(raw.strip().strip('"').strip("'"))
    resolved = (p.resolve() if p.is_absolute() else (BACKEND_DIR / p).resolve())
    return str(resolved)


class Settings:
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    
    # Firebase Configuration (Firestore only; scan PDFs use Supabase Storage)
    FIREBASE_SERVICE_ACCOUNT_KEY_PATH = _resolve_firebase_key_path()
    # Supabase Storage bucket for scan PDF reports (default: same bucket as retinal images)
    SUPABASE_SCAN_REPORTS_BUCKET = os.getenv("SUPABASE_SCAN_REPORTS_BUCKET", "images")
    
    # API Configuration
    API_PORT = int(os.getenv("API_PORT", 8000))
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    
    # Model Paths - Resolve relative to backend directory
    GLAUCOMA_MODEL_PATH = os.getenv("GLAUCOMA_MODEL_PATH") or str(MODELS_DIR / "glaucoma_mobilenet_best.pth")
    DR_MODEL_PATH = os.getenv("DR_MODEL_PATH") or str(MODELS_DIR / "efficientnet_b3_final_aptos.pth")
    
    @classmethod
    def validate(cls):
        """Validate that all required environment variables are set"""
        required_vars = [
            "SUPABASE_URL",
            "SUPABASE_SERVICE_KEY"
        ]
        missing = [var for var in required_vars if not os.getenv(var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

settings = Settings()

