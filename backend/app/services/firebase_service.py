import firebase_admin
from firebase_admin import credentials, firestore
import logging
import os
from datetime import datetime
from app.config import settings

logger = logging.getLogger(__name__)

class FirebaseService:
    """Service for Firebase operations"""
    
    def __init__(self):
        # Initialize Firebase Admin SDK
        try:
            if not firebase_admin._apps:
                firebase_key_path = settings.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
                if firebase_key_path and os.path.exists(firebase_key_path):
                    cred = credentials.Certificate(firebase_key_path)
                    firebase_admin.initialize_app(cred)
                    logger.info("Firebase Admin initialized successfully")
                else:
                    logger.warning(
                        f"Firebase service account key not found at {firebase_key_path}. "
                        "Set FIREBASE_SERVICE_ACCOUNT_KEY_PATH in .env file. "
                        "Firebase operations will be skipped."
                    )
            self.db = firestore.client()
        except Exception as e:
            logger.warning(f"Firebase initialization warning: {str(e)}")
            self.db = None
    
    async def store_results(
        self,
        firebase_token: str,
        patient_id: str,
        glaucoma_result: dict,
        dr_result: dict,
        image_id: str
    ):
        """
        Store analysis results in Firebase
        
        Args:
            firebase_token: Firebase auth token from frontend
            patient_id: Patient user ID
            glaucoma_result: Glaucoma analysis result
            dr_result: DR analysis result
            image_id: Image ID from Supabase
        """
        try:
            if self.db is None:
                logger.warning("Firebase not initialized - skipping result storage")
                return
            
            current_date = datetime.now().isoformat()
            
            # Store Glaucoma result
            glaucoma_ref = self.db.collection('glucoma_result').document()
            glaucoma_ref.set({
                'patientId': patient_id,
                'result_msg': glaucoma_result['result_msg'],
                'imageId': image_id,
                'doctor_feedback': '',
                'date': current_date
            })
            
            # Store DR result
            dr_ref = self.db.collection('dr_result').document()
            dr_ref.set({
                'patientId': patient_id,
                'result_msg': dr_result['result_msg'],
                'imageId': image_id,
                'doctor_feedback': '',
                'date': current_date
            })
            
            logger.info(f"Results stored in Firebase for patient {patient_id}, image {image_id}")
            
        except Exception as e:
            logger.error(f"Error storing results in Firebase: {str(e)}")
            raise

