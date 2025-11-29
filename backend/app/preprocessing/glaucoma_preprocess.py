import numpy as np
from PIL import Image
import torch
from torchvision import transforms
import logging
import io

logger = logging.getLogger(__name__)

class GlaucomaPreprocessor:
    """Preprocessing pipeline for Glaucoma detection (matching training notebook)"""
    
    def __init__(self):
        # ImageNet normalization parameters (matching notebook)
        self.imagenet_mean = [0.485, 0.456, 0.406]
        self.imagenet_std = [0.229, 0.224, 0.225]
        
        # Validation transform (matching notebook - no augmentation for inference)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=self.imagenet_mean, std=self.imagenet_std)
        ])
    
    def preprocess(self, image_bytes: bytes) -> torch.Tensor:
        """
        Preprocess image for Glaucoma model (matching training notebook)
        
        Args:
            image_bytes: Raw image bytes
        
        Returns:
            Preprocessed image tensor (3, 224, 224) ready for model input
        """
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert('RGB')
            
            # Apply transforms (resize, to tensor, normalize)
            image_tensor = self.transform(image)
            
            return image_tensor
            
        except Exception as e:
            logger.error(f"Error in Glaucoma preprocessing: {str(e)}")
            raise
