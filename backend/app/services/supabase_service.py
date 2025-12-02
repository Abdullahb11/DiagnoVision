from supabase import create_client, Client
import logging
from PIL import Image
import io
import uuid
import numpy as np
from app.config import settings

logger = logging.getLogger(__name__)

class SupabaseService:
    """Service for Supabase operations"""
    
    def __init__(self):
        # Validate that required environment variables are set
        if not settings.SUPABASE_URL:
            raise ValueError(
                "SUPABASE_URL is not set. Please create a .env file in the backend directory "
                "and add SUPABASE_URL. See .env.example for a template."
            )
        if not settings.SUPABASE_SERVICE_KEY:
            raise ValueError(
                "SUPABASE_SERVICE_KEY is not set. Please create a .env file in the backend directory "
                "and add SUPABASE_SERVICE_KEY. See .env.example for a template."
            )
        
        self.supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
    
    async def upload_images(
        self,
        original_image: bytes,
        glaucoma_gradcam: dict,
        dr_gradcam: dict,
        patient_id: str
    ) -> dict:
        """
        Upload original image and GradCAM visualizations to Supabase Storage
        
        Args:
            original_image: Original image bytes
            glaucoma_gradcam: Dict with 'heatmap_only' and 'overlay' numpy arrays
            dr_gradcam: Dict with 'heatmap_only' and 'overlay' numpy arrays (or None)
            patient_id: Patient ID
        
        Returns:
            Dictionary with image_id, image_url, heatmap_url, and overlay_url
        """
        try:
            # Generate unique image ID
            image_id = str(uuid.uuid4())
            
            # Upload original image
            original_path = f"images/{patient_id}/{image_id}_original.jpg"
            self.supabase.storage.from_("images").upload(
                original_path,
                original_image,
                file_options={"content-type": "image/jpeg"}
            )
            original_url = self.supabase.storage.from_("images").get_public_url(original_path)
            
            # Use Glaucoma GradCAM (or DR if Glaucoma not available)
            gradcam_data = glaucoma_gradcam if glaucoma_gradcam and glaucoma_gradcam.get("heatmap_only") is not None else dr_gradcam
            
            # Check if we have valid GradCAM data
            if gradcam_data is None or gradcam_data.get("heatmap_only") is None:
                logger.warning("No valid GradCAM data available, skipping heatmap/overlay upload")
                # Return only original image URL
                return {
                    "image_id": image_id,
                    "image_url": original_url,
                    "heatmap_url": None,
                    "overlay_url": None,
                    "gradcam_url": None
                }
            
            # Upload heatmap only (colored heatmap)
            heatmap_only = gradcam_data.get("heatmap_only")
            if heatmap_only is not None:
                heatmap_bytes = self._heatmap_to_bytes(heatmap_only)
                heatmap_path = f"images/{patient_id}/{image_id}_heatmap.jpg"
                self.supabase.storage.from_("images").upload(
                    heatmap_path,
                    heatmap_bytes,
                    file_options={"content-type": "image/jpeg"}
                )
                heatmap_url = self.supabase.storage.from_("images").get_public_url(heatmap_path)
            else:
                heatmap_url = None
            
            # Upload overlay (original + heatmap)
            overlay = gradcam_data.get("overlay")
            if overlay is not None:
                overlay_bytes = self._heatmap_to_bytes(overlay)
                overlay_path = f"images/{patient_id}/{image_id}_overlay.jpg"
                self.supabase.storage.from_("images").upload(
                    overlay_path,
                    overlay_bytes,
                    file_options={"content-type": "image/jpeg"}
                )
                overlay_url = self.supabase.storage.from_("images").get_public_url(overlay_path)
            else:
                overlay_url = None
            
            # Store metadata in images table (all three URLs)
            self.supabase.table("images").insert({
                "imageId": image_id,
                "Image_url": original_url,
                "heatmap_url": heatmap_url,
                "overlay_url": overlay_url,
                "grad_cam_url": overlay_url if overlay_url else original_url  # For backward compatibility
            }).execute()
            
            logger.info(f"Images uploaded to Supabase for image_id: {image_id}")
            
            return {
                "image_id": image_id,
                "image_url": original_url,
                "heatmap_url": heatmap_url,
                "overlay_url": overlay_url,
                "gradcam_url": overlay_url  # For backward compatibility
            }
            
        except Exception as e:
            logger.error(f"Error uploading to Supabase: {str(e)}")
            raise
    
    async def upload_images_async(
        self,
        image_id: str,
        original_image: bytes,
        glaucoma_gradcam: dict,
        dr_gradcam: dict,
        patient_id: str
    ):
        """
        Upload images to Supabase asynchronously (non-blocking background task)
        
        Args:
            image_id: Pre-generated image ID
            original_image: Original image bytes
            glaucoma_gradcam: Dict with 'heatmap_only' and 'overlay' numpy arrays
            dr_gradcam: Dict with 'heatmap_only' and 'overlay' numpy arrays (or None)
            patient_id: Patient ID
        """
        try:
            # Upload original image
            original_path = f"images/{patient_id}/{image_id}_original.jpg"
            self.supabase.storage.from_("images").upload(
                original_path,
                original_image,
                file_options={"content-type": "image/jpeg"}
            )
            original_url = self.supabase.storage.from_("images").get_public_url(original_path)
            
            # Use Glaucoma GradCAM (or DR if Glaucoma not available)
            gradcam_data = glaucoma_gradcam if glaucoma_gradcam and glaucoma_gradcam.get("heatmap_only") is not None else dr_gradcam
            
            heatmap_url = None
            overlay_url = None
            
            if gradcam_data and gradcam_data.get("heatmap_only") is not None:
                # Upload heatmap only (colored heatmap)
                heatmap_bytes = self._heatmap_to_bytes(gradcam_data["heatmap_only"])
                heatmap_path = f"images/{patient_id}/{image_id}_heatmap.jpg"
                self.supabase.storage.from_("images").upload(
                    heatmap_path,
                    heatmap_bytes,
                    file_options={"content-type": "image/jpeg"}
                )
                heatmap_url = self.supabase.storage.from_("images").get_public_url(heatmap_path)
                
                # Upload overlay (original + heatmap)
                if gradcam_data.get("overlay") is not None:
                    overlay_bytes = self._heatmap_to_bytes(gradcam_data["overlay"])
                    overlay_path = f"images/{patient_id}/{image_id}_overlay.jpg"
                    self.supabase.storage.from_("images").upload(
                        overlay_path,
                        overlay_bytes,
                        file_options={"content-type": "image/jpeg"}
                    )
                    overlay_url = self.supabase.storage.from_("images").get_public_url(overlay_path)
            
            # Store metadata in images table (all three URLs)
            self.supabase.table("images").insert({
                "imageId": image_id,
                "Image_url": original_url,
                "heatmap_url": heatmap_url,
                "overlay_url": overlay_url,
                "grad_cam_url": overlay_url if overlay_url else original_url  # For backward compatibility
            }).execute()
            
            logger.info(f"Images uploaded to Supabase for image_id: {image_id}")
            
        except Exception as e:
            logger.error(f"Error uploading to Supabase (async): {str(e)}")
            # Don't raise - this is background task, failure shouldn't affect response
    
    def _combine_gradcams(self, glaucoma_gradcam, dr_gradcam):
        """Combine Glaucoma and DR GradCAM heatmaps"""
        # TODO: Implement combination logic (overlay, side-by-side, etc.)
        # For now, return the first one
        return glaucoma_gradcam
    
    def _heatmap_to_bytes(self, heatmap):
        """Convert heatmap numpy array (colored overlay) to image bytes"""
        try:
            # Heatmap is now a colored overlay (H, W, 3) in RGB format
            # Ensure it's uint8
            if heatmap.dtype != np.uint8:
                if heatmap.max() <= 1.0:
                    heatmap = (heatmap * 255).astype(np.uint8)
                else:
                    heatmap = heatmap.astype(np.uint8)
            
            # Convert to PIL Image (already RGB)
            img = Image.fromarray(heatmap)
            
            # Convert to bytes
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG', quality=95)
            return img_bytes.getvalue()
        except Exception as e:
            logger.error(f"Error converting heatmap to bytes: {str(e)}")
            raise


