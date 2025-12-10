import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Get the backend directory (parent of app directory)
BACKEND_DIR = Path(__file__).parent.parent
MODELS_DIR = BACKEND_DIR / "models"

class Settings:
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    
    # Firebase Configuration
    FIREBASE_SERVICE_ACCOUNT_KEY_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH")
    
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

