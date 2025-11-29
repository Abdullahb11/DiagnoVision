import logging
from app.models.glaucoma_model import GlaucomaModel
from app.preprocessing.glaucoma_preprocess import GlaucomaPreprocessor
from app.gradcam.glaucoma_gradcam import GlaucomaGradCAM
from app.config import settings

logger = logging.getLogger(__name__)

class GlaucomaPipeline:
    """Complete pipeline for Glaucoma detection"""
    
    def __init__(self):
        self.model = GlaucomaModel(settings.GLAUCOMA_MODEL_PATH)
        self.preprocessor = GlaucomaPreprocessor()
        self.gradcam = GlaucomaGradCAM(self.model.model)
    
    async def process(self, image_bytes: bytes, patient_id: str):
        """
        Complete Glaucoma analysis pipeline
        
        Args:
            image_bytes: Raw image bytes
            patient_id: Patient ID for logging
        
        Returns:
            Dictionary with result message, confidence, and GradCAM image
        """
        try:
            logger.info(f"Starting Glaucoma pipeline for patient {patient_id}")
            
            # Step 1: Preprocess image (matching training notebook)
            preprocessed_image = self.preprocessor.preprocess(image_bytes)
            logger.debug("Image preprocessed for Glaucoma model")
            
            # Step 2: Run model inference
            prediction = self.model.predict(preprocessed_image)
            logger.debug(f"Glaucoma prediction: {prediction['prediction']} (confidence: {prediction['confidence']:.2f})")
            
            # Step 3: Generate GradCAM with heatmap and overlay (use predicted class index)
            # Class 0 = glaucoma, Class 1 = normal
            predicted_class_idx = 0 if prediction.get("predicted_class") == "glaucoma" else 1
            gradcam_results = self.gradcam.generate_gradcam(preprocessed_image, image_bytes, predicted_class_idx)
            logger.debug("GradCAM generated for Glaucoma")
            
            # Format result message
            result_msg = self._format_result_message(prediction)
            
            return {
                "result_msg": result_msg,
                "confidence": prediction["confidence"],
                "prediction": prediction["prediction"],
                "gradcam_heatmap": gradcam_results["heatmap_only"],
                "gradcam_overlay": gradcam_results["overlay"],
                "raw_output": prediction.get("raw_output", [])
            }
            
        except Exception as e:
            logger.error(f"Error in Glaucoma pipeline: {str(e)}")
            raise
    
    def _format_result_message(self, prediction: dict) -> str:
        """Format prediction result into human-readable message"""
        confidence = prediction["confidence"]
        predicted_class = prediction.get("predicted_class", "")
        
        if predicted_class == "glaucoma" and confidence > 0.5:
            return f"Signs of Glaucoma detected (confidence: {confidence:.1%})"
        else:
            return f"No signs of Glaucoma detected (confidence: {confidence:.1%})"

