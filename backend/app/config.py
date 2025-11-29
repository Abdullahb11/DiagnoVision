import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Supabase Configuration
    SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xoyxfcmpzmjjzwulejvr.supabase.co")
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveXhmY21wem1qanp3dWxlanZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzNTExMywiZXhwIjoyMDgwMDExMTEzfQ.3SpFd70YVK2tcKAByf4djQv9GgRi_RYP51IK_cWQWhs")
    
    # API Configuration
    API_PORT = int(os.getenv("API_PORT", 8000))
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    
    # Model Paths
    GLAUCOMA_MODEL_PATH = os.getenv("GLAUCOMA_MODEL_PATH", "./models/glaucoma_mobilenet_best.pth")
    DR_MODEL_PATH = os.getenv("DR_MODEL_PATH", "./models/dr_model.h5")
    
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

