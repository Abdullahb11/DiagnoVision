import numpy as np
from PIL import Image
import torch
from torchvision import transforms
import cv2
import logging
import io

logger = logging.getLogger(__name__)

class BenGrahamPreprocessing:
    """Ben Graham preprocessing for DR detection (matching training notebook)"""
    
    def __init__(self, sigmaX=10):
        self.sigmaX = sigmaX
    
    def __call__(self, img):
        """
        Apply Ben Graham preprocessing: image = image * 4 - gaussian_blur * 4 + 128
        """
        img = np.array(img)
        img = cv2.addWeighted(img, 4, cv2.GaussianBlur(img, (0, 0), self.sigmaX), -4, 128)
        return Image.fromarray(img)

class DRPreprocessor:
    """Preprocessing pipeline for DR detection (matching training notebook)"""
    
    def __init__(self):
        self.imagenet_mean = [0.485, 0.456, 0.406]
        self.imagenet_std = [0.229, 0.224, 0.225]
      
        self.transform = transforms.Compose([
            transforms.Resize((300, 300)),
            BenGrahamPreprocessing(sigmaX=10),
            transforms.ToTensor(),
            transforms.Normalize(mean=self.imagenet_mean, std=self.imagenet_std)
        ])
    
    def preprocess(self, image_bytes: bytes) -> torch.Tensor:
        """
        Preprocess image for DR model (matching training notebook)
        
        Args:
            image_bytes: Raw image bytes
        
        Returns:
            Preprocessed image tensor (3, 300, 300) ready for model input
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert('RGB')
            
            image_tensor = self.transform(image)
            
            return image_tensor
            
        except Exception as e:
            logger.error(f"Error in DR preprocessing: {str(e)}")
            raise
