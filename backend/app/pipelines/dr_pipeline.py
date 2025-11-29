import logging
from app.models.dr_model import DRModel
from app.preprocessing.dr_preprocess import DRPreprocessor
from app.gradcam.dr_gradcam import DRGradCAM
from app.config import settings

logger = logging.getLogger(__name__)

class DRPipeline:
    """Complete pipeline for Diabetic Retinopathy detection"""
    
    def __init__(self):
        self.model = DRModel(settings.DR_MODEL_PATH)
        self.preprocessor = DRPreprocessor()
        self.gradcam = DRGradCAM(self.model.model)
    
    async def process(self, image_bytes: bytes, patient_id: str):
        """
        Complete DR analysis pipeline
        
        Args:
            image_bytes: Raw image bytes
            patient_id: Patient ID for logging
        
        Returns:
            Dictionary with result message, confidence, and GradCAM image
        """
        try:
            logger.info(f"Starting DR pipeline for patient {patient_id}")
            
            # Step 1: Preprocess image (matching training notebook)
            preprocessed_image = self.preprocessor.preprocess(image_bytes)
            logger.debug("Image preprocessed for DR model")
            
            # Step 2: Run model inference
            prediction = self.model.predict(preprocessed_image)
            logger.debug(f"DR prediction: {prediction['prediction']} (confidence: {prediction['confidence']:.2f})")
            
            # Step 3: Generate GradCAM (placeholder for now - DR model not implemented)
            # For now, return None for DR GradCAM since model is not ready
            logger.debug("DR GradCAM placeholder - model not implemented")
            
            # Format result message
            result_msg = self._format_result_message(prediction)
            
            # Return None for DR GradCAM (will be handled in Supabase service)
            return {
                "result_msg": result_msg,
                "confidence": prediction["confidence"],
                "prediction": prediction["prediction"],
                "gradcam_heatmap": None,
                "gradcam_overlay": None,
                "raw_output": prediction.get("raw_output", [])
            }
            
        except Exception as e:
            logger.error(f"Error in DR pipeline: {str(e)}")
            raise
    
    def _format_result_message(self, prediction: dict) -> str:
        """Format prediction result into human-readable message"""
        confidence = prediction["confidence"]
        pred = prediction["prediction"]
        
        if "No signs" in pred or confidence < 0.5:
            return f"No signs of Diabetic Retinopathy detected (confidence: {confidence:.1%})"
        else:
            return f"Signs of Diabetic Retinopathy detected (confidence: {confidence:.1%})"

