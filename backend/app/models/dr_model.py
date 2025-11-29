import tensorflow as tf
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class DRModel:
    """Diabetic Retinopathy detection model loader and inference"""
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load the DR detection model"""
        try:
            if Path(self.model_path).exists():
                self.model = tf.keras.models.load_model(self.model_path)
                logger.info(f"DR model loaded from {self.model_path}")
            else:
                logger.warning(f"Model file not found at {self.model_path}. Using placeholder.")
                # Placeholder - will be replaced with actual model
                self.model = None
        except Exception as e:
            logger.error(f"Error loading DR model: {str(e)}")
            self.model = None
    
    def predict(self, preprocessed_image: np.ndarray):
        """
        Run inference on preprocessed image
        
        Args:
            preprocessed_image: Preprocessed image array matching training format
        
        Returns:
            Prediction result and confidence
        """
        if self.model is None:
            # Placeholder prediction for development
            logger.warning("Using placeholder prediction - model not loaded")
            return {
                "prediction": "No signs detected",
                "confidence": 0.90,
                "raw_output": [0.10, 0.90]  # [negative, positive]
            }
        
        try:
            # Add batch dimension if needed
            if len(preprocessed_image.shape) == 3:
                preprocessed_image = np.expand_dims(preprocessed_image, axis=0)
            
            # Run prediction
            predictions = self.model.predict(preprocessed_image, verbose=0)
            
            # Process predictions (adjust based on your model output format)
            if predictions.shape[1] == 2:  # Binary classification
                confidence = float(predictions[0][1])
                result = "Signs detected" if confidence > 0.5 else "No signs detected"
            else:
                confidence = float(predictions[0][0])
                result = "Signs detected" if confidence > 0.5 else "No signs detected"
            
            return {
                "prediction": result,
                "confidence": confidence,
                "raw_output": predictions[0].tolist()
            }
        except Exception as e:
            logger.error(f"Error during DR prediction: {str(e)}")
            raise

