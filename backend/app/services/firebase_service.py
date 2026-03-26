import firebase_admin
from firebase_admin import credentials, firestore
import logging
import os
from datetime import datetime

from app.config import settings

logger = logging.getLogger(__name__)


class FirebaseService:
    """Service for Firebase Firestore (no Firebase Storage — scan PDFs use Supabase)."""

    def __init__(self):
        self.db = None
        try:
            if not firebase_admin._apps:
                firebase_key_path = settings.FIREBASE_SERVICE_ACCOUNT_KEY_PATH
                if firebase_key_path and os.path.exists(firebase_key_path):
                    cred = credentials.Certificate(firebase_key_path)
                    firebase_admin.initialize_app(cred)
                    logger.info("Firebase Admin initialized successfully")
                else:
                    logger.warning(
                        "Firebase service account key missing — Firestore disabled. "
                        "Download JSON from Firebase Console → Project settings → Service accounts → "
                        "Generate new private key, save as backend/firebase-service-account.json "
                        "(or set FIREBASE_SERVICE_ACCOUNT_KEY_PATH). Path checked: %s",
                        firebase_key_path or "(not set)",
                    )
            if firebase_admin._apps:
                self.db = firestore.client()
            else:
                self.db = None
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

    def notify_associated_doctors_scan_report(
        self,
        patient_id: str,
        image_id: str,
        patient_display_name: str,
        pdf_url: str,
        glaucoma_msg: str,
        dr_msg: str,
    ) -> dict:
        """
        Create a Firestore notification for each active patient_doctor link.
        pdf_url should point to the file in Supabase Storage (or any HTTPS URL).
        """
        result = {"ok": False, "doctors_notified": 0, "skipped": None, "pdf_url": pdf_url}

        if self.db is None:
            result["skipped"] = "firestore_not_initialized"
            logger.warning("Scan report notify skipped: Firestore not initialized")
            return result

        if not pdf_url:
            result["skipped"] = "missing_pdf_url"
            return result

        try:
            rels = (
                self.db.collection("patient_doctor")
                .where("patientId", "==", patient_id)
                .stream()
            )
            doctor_ids = []
            for doc_snap in rels:
                d = doc_snap.to_dict() or {}
                if d.get("status") == "active" and d.get("doctorId"):
                    doctor_ids.append(d["doctorId"])
            doctor_ids = list(dict.fromkeys(doctor_ids))
        except Exception as e:
            logger.error("Failed to query patient_doctor: %s", e)
            result["skipped"] = f"firestore_query_failed: {e}"
            return result

        if not doctor_ids:
            result["ok"] = True
            result["skipped"] = "no_active_doctors"
            result["doctors_notified"] = 0
            logger.info("No active doctors for patient %s — PDF URL not sent via notification", patient_id)
            return result

        message_body = (
            f"{patient_display_name or 'A patient'} completed an eye scan. "
            f"DR: {dr_msg[:100]}{'…' if len(dr_msg) > 100 else ''} "
            "Open the PDF to view images and full results."
        )

        batch = self.db.batch()
        notif_col = self.db.collection("notifications")
        for doctor_id in doctor_ids:
            ref = notif_col.document()
            batch.set(
                ref,
                {
                    "user_id": doctor_id,
                    "type": "info",
                    "title": "New eye scan report",
                    "message": message_body,
                    "read": False,
                    "createdAt": firestore.SERVER_TIMESTAMP,
                    "data": {
                        "kind": "scan_report",
                        "pdf_url": pdf_url,
                        "patient_id": patient_id,
                        "image_id": image_id,
                        "patient_name": patient_display_name or "",
                        "summary_glaucoma": glaucoma_msg,
                        "summary_dr": dr_msg,
                    },
                },
            )
        batch.commit()
        result["ok"] = True
        result["doctors_notified"] = len(doctor_ids)
        logger.info("Notified %s doctors for patient %s scan %s", len(doctor_ids), patient_id, image_id)
        return result


firebase_service = FirebaseService()
