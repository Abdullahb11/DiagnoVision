import torch
import torch.nn as nn
from torchvision import models
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class GlaucomaModel:
    """Glaucoma detection model loader and inference using PyTorch MobileNetV2"""
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.class_names = ['glaucoma', 'normal']
        self.load_model()
    
    def load_model(self):
        """Load the Glaucoma detection model (PyTorch MobileNetV2)"""
        try:
            if Path(self.model_path).exists():
                # Load pre-trained MobileNetV2
                model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
                
                # Freeze all layers
                for param in model.parameters():
                    param.requires_grad = False
                
                # Replace final classifier for 2 classes (glaucoma, normal)
                num_features = model.classifier[1].in_features
                model.classifier[1] = nn.Linear(num_features, len(self.class_names))
                
                # Load trained weights
                model.load_state_dict(torch.load(self.model_path, map_location=self.device))
                model.eval()  # Set to evaluation mode
                model = model.to(self.device)
                
                self.model = model
                logger.info(f"Glaucoma model loaded from {self.model_path} on device: {self.device}")
            else:
                logger.warning(f"Model file not found at {self.model_path}. Using placeholder.")
                self.model = None
        except Exception as e:
            logger.error(f"Error loading Glaucoma model: {str(e)}")
            self.model = None
    
    def predict(self, preprocessed_image: torch.Tensor):
        """
        Run inference on preprocessed image
        
        Args:
            preprocessed_image: Preprocessed image tensor (1, 3, 224, 224) on correct device
        
        Returns:
            Prediction result and confidence
        """
        if self.model is None:
            # Placeholder prediction for development
            logger.warning("Using placeholder prediction - model not loaded")
            return {
                "prediction": "No signs detected",
                "confidence": 0.85,
                "raw_output": [0.15, 0.85]  # [glaucoma, normal]
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
            pred_idx = np.argmax(probs)
            confidence = float(probs[pred_idx])
            pred_class = self.class_names[pred_idx]
            
            # Determine result message
            if pred_class == 'glaucoma' and confidence > 0.5:
                result = "Signs detected"
            else:
                result = "No signs detected"
            
            return {
                "prediction": result,
                "confidence": confidence,
                "predicted_class": pred_class,
                "raw_output": probs.tolist()  # [glaucoma_prob, normal_prob]
            }
        except Exception as e:
            logger.error(f"Error during Glaucoma prediction: {str(e)}")
            raise
