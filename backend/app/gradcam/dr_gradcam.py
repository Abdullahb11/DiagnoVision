import numpy as np
import torch
import torch.nn.functional as F
import cv2
import logging
from PIL import Image
import io
from captum.attr import LayerGradCam

logger = logging.getLogger(__name__)

class DRGradCAM:
    """GradCAM visualization generator for DR model using Captum"""
    
    def __init__(self, model):
        self.model = model
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # ImageNet normalization parameters for unnormalizing
        self.imagenet_mean = torch.tensor([0.485, 0.456, 0.406]).to(self.device)
        self.imagenet_std = torch.tensor([0.229, 0.224, 0.225]).to(self.device)
        
        if model is not None:
            # Set up GradCAM for EfficientNet-B3 (target last convolutional block)
            # EfficientNet-B3's last conv block is model.features[-1]
            target_layer = model.features[-1]
            self.lgc = LayerGradCam(model, target_layer)
        else:
            self.lgc = None
    
    def _unnormalize_image(self, tensor_img):
        """Reverses the normalization for plotting (matching notebook)"""
        img = tensor_img.clone().to(self.device)
        img = img * self.imagenet_std[:, None, None] + self.imagenet_mean[:, None, None]
        img = img.cpu().numpy()
        img = np.transpose(img, (1, 2, 0))  # C, H, W -> H, W, C
        img = np.clip(img, 0, 1)
        return img
    
    def generate_gradcam(self, preprocessed_image: torch.Tensor, original_image_bytes: bytes, predicted_class_idx: int = None):
        """
        Generate GradCAM heatmap and overlay (matching notebook implementation)
        
        Args:
            preprocessed_image: Preprocessed image tensor (1, 3, 300, 300)
            original_image_bytes: Original image bytes for overlay
            predicted_class_idx: Class index to generate GradCAM for (0=No DR, 1=Mild/Mod, 2=Severe, 3=Proliferative)
                                 If None, uses model's prediction
        
        Returns:
            Dictionary with:
            - heatmap_only: Colored heatmap only (H, W, 3) in RGB format
            - overlay: Original image + heatmap overlay (H, W, 3) in RGB format
        """
        try:
            if self.model is None or self.lgc is None:
                # Placeholder - return dummy images
                logger.warning("Model not loaded, returning placeholder GradCAM")
                original_img = Image.open(io.BytesIO(original_image_bytes))
                original_img = original_img.convert('RGB')
                original_array = np.array(original_img)
                return {
                    "heatmap_only": original_array,
                    "overlay": original_array
                }
            
            # Ensure image is on correct device and has batch dimension
            if len(preprocessed_image.shape) == 3:
                preprocessed_image = preprocessed_image.unsqueeze(0)
            
            preprocessed_image = preprocessed_image.to(self.device)
            
            # Get predicted class if not provided
            if predicted_class_idx is None:
                with torch.no_grad():
                    outputs = self.model(preprocessed_image)
                    probabilities = F.softmax(outputs, dim=1)
                    predicted_class_idx = int(torch.argmax(probabilities, dim=1).item())
            else:
                # Ensure it's a Python int (not numpy.int64)
                predicted_class_idx = int(predicted_class_idx)
            
            # Generate GradCAM attribution (matching notebook)
            self.model.eval()
            attribution = self.lgc.attribute(preprocessed_image, target=predicted_class_idx)
            
            # Process heatmap (matching notebook)
            heatmap = attribution.squeeze().cpu().detach().numpy()
            heatmap = np.maximum(heatmap, 0)  # Use only positive contributions
            heatmap = heatmap - np.min(heatmap)
            heatmap = heatmap / (np.max(heatmap) + 1e-10)  # Normalize to 0-1
            
            # Ensure heatmap is 2D (300, 300)
            if len(heatmap.shape) > 2:
                # If multi-channel, take max across channels
                heatmap = np.max(heatmap, axis=0)
            
            # Load original image for overlay
            original_img = Image.open(io.BytesIO(original_image_bytes))
            original_img = original_img.convert('RGB')
            original_array = np.array(original_img)
            original_h, original_w = original_array.shape[:2]
            
            # Resize heatmap to match original image size (matching notebook)
            heatmap_resized = cv2.resize(heatmap, (original_w, original_h))
            heatmap_uint8 = np.uint8(255 * heatmap_resized)  # Convert to 0-255
            
            # Apply JET colormap (matching notebook) - This is the colored heatmap
            heatmap_jet = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
            heatmap_jet = cv2.cvtColor(heatmap_jet, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
            
            # Create overlay (matching notebook: 60% original, 40% heatmap)
            overlay = cv2.addWeighted(original_array, 0.6, heatmap_jet, 0.4, 0)
            
            return {
                "heatmap_only": heatmap_jet.astype(np.uint8),
                "overlay": overlay.astype(np.uint8)
            }
            
        except Exception as e:
            logger.error(f"Error generating DR GradCAM: {str(e)}")
            raise
