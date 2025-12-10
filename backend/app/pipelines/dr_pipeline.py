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
            
            # Step 3: Generate GradCAM with heatmap and overlay (use predicted class index)
            # Class indices: 0=No DR, 1=Mild/Mod, 2=Severe, 3=Proliferative
            predicted_class_idx = prediction.get("predicted_class_idx", 0)
            gradcam_results = self.gradcam.generate_gradcam(preprocessed_image, image_bytes, predicted_class_idx)
            logger.debug("GradCAM generated for DR")
            
            # Format result message
            result_msg = self._format_result_message(prediction)
            
            return {
                "result_msg": result_msg,
                "confidence": prediction["confidence"],
                "prediction": prediction["prediction"],
                "predicted_class": prediction.get("predicted_class", ""),
                "gradcam_heatmap": gradcam_results["heatmap_only"],
                "gradcam_overlay": gradcam_results["overlay"],
                "raw_output": prediction.get("raw_output", [])
            }
            
        except Exception as e:
            logger.error(f"Error in DR pipeline: {str(e)}")
            raise
    
    def _format_result_message(self, prediction: dict) -> str:
        """Format prediction result into human-readable message"""
        confidence = prediction["confidence"]
        predicted_class = prediction.get("predicted_class", "")
        
        if predicted_class == "No DR" and confidence > 0.5:
            return f"No signs of Diabetic Retinopathy detected (confidence: {confidence:.1%})"
        else:
            return f"Signs of Diabetic Retinopathy detected - {predicted_class} (confidence: {confidence:.1%})"
