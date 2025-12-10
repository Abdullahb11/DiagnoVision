import torch
import torch.nn as nn
from torchvision import models
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class DRModel:
    """Diabetic Retinopathy detection model loader and inference using PyTorch EfficientNet-B3"""
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_names = ['No DR', 'Mild/Mod', 'Severe', 'Proliferative']
        self.num_classes = 4
        self.load_model()
    
    def load_model(self):
        """Load the DR detection model (EfficientNet-B3)"""
        try:
            if Path(self.model_path).exists():
                # Load pre-trained EfficientNet-B3
                model = models.efficientnet_b3(weights=None)  # We load our own weights
                
                # Replace final classifier for 4 classes
                num_features = model.classifier[1].in_features
                model.classifier[1] = nn.Linear(num_features, self.num_classes)
                
                # Load trained weights
                model.load_state_dict(torch.load(self.model_path, map_location=self.device))
                model.eval()  # Set to evaluation mode
                model = model.to(self.device)
                
                self.model = model
                logger.info(f"DR model loaded from {self.model_path} on device: {self.device}")
            else:
                logger.warning(f"Model file not found at {self.model_path}. Using placeholder.")
                self.model = None
        except Exception as e:
            logger.error(f"Error loading DR model: {str(e)}")
            self.model = None
    
    def predict(self, preprocessed_image: torch.Tensor):
        """
        Run inference on preprocessed image
        
        Args:
            preprocessed_image: Preprocessed image tensor (1, 3, 300, 300) on correct device
        
        Returns:
            Prediction result and confidence
        """
        if self.model is None:
            # Placeholder prediction for development
            logger.warning("Using placeholder prediction - model not loaded")
            return {
                "prediction": "No signs detected",
                "confidence": 0.90,
                "predicted_class": "No DR",
                "raw_output": [0.90, 0.05, 0.03, 0.02]  # [No DR, Mild/Mod, Severe, Proliferative]
            }
        
        try:
            # Ensure image is on correct device and has batch dimension
            if len(preprocessed_image.shape) == 3:
                preprocessed_image = preprocessed_image.unsqueeze(0)
            
            preprocessed_image = preprocessed_image.to(self.device)
            
            # Run prediction
            with torch.no_grad():
                outputs = self.model(preprocessed_image)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
            
            # Get prediction
            probs = probabilities[0].cpu().numpy()
            pred_idx = int(np.argmax(probs))  # Convert numpy.int64 to Python int for Captum
            confidence = float(probs[pred_idx])
            pred_class = self.class_names[pred_idx]
            
            # Determine result message
            if pred_class == 'No DR' and confidence > 0.5:
                result = "No signs detected"
            else:
                result = "Signs detected"
            
            return {
                "prediction": result,
                "confidence": confidence,
                "predicted_class": pred_class,
                "predicted_class_idx": pred_idx,
                "raw_output": probs.tolist()  # [No DR, Mild/Mod, Severe, Proliferative]
            }
        except Exception as e:
            logger.error(f"Error during DR prediction: {str(e)}")
            raise
