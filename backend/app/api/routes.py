from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import logging
import base64
import asyncio
import uuid

from app.pipelines.glaucoma_pipeline import GlaucomaPipeline
from app.pipelines.dr_pipeline import DRPipeline
from app.services.supabase_service import SupabaseService

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize pipelines and services
glaucoma_pipeline = GlaucomaPipeline()
dr_pipeline = DRPipeline()
supabase_service = SupabaseService()

@router.post("/analyze")
async def analyze_image(
    image: UploadFile = File(...),
    patient_id: str = Form(...)
):
    """
    Analyze retinal image for Glaucoma and Diabetic Retinopathy
    
    Args:
        image: Uploaded retinal image file
        patient_id: Patient user ID from Firebase
    
    Returns:
        Combined results from both Glaucoma and DR analysis
        Frontend will handle storing results in Firebase
    """
    try:
        # Read image file
        image_bytes = await image.read()
        
        # Run both pipelines
        logger.info(f"Starting analysis for patient {patient_id}")
        
        # Run Glaucoma pipeline
        glaucoma_result = await glaucoma_pipeline.process(image_bytes, patient_id)
        
        # Run DR pipeline
        dr_result = await dr_pipeline.process(image_bytes, patient_id)
        
        # Prepare GradCAM data
        # Glaucoma GradCAM returns dict with 'heatmap_only' and 'overlay'
        glaucoma_gradcam_dict = {
            "heatmap_only": glaucoma_result.get("gradcam_heatmap"),
            "overlay": glaucoma_result.get("gradcam_overlay")
        } if glaucoma_result.get("gradcam_heatmap") is not None else None
        
        # DR GradCAM (placeholder for now)
        dr_gradcam_dict = {
            "heatmap_only": dr_result.get("gradcam_heatmap"),
            "overlay": dr_result.get("gradcam_overlay")
        } if dr_result.get("gradcam_heatmap") is not None else None
        
        # Generate image_id for Supabase
        image_id = str(uuid.uuid4())
        
        # Convert images to base64 for immediate display
        original_base64 = base64.b64encode(image_bytes).decode('utf-8')
        
        # Use Glaucoma GradCAM (or DR if Glaucoma not available)
        gradcam_data = glaucoma_gradcam_dict if glaucoma_gradcam_dict and glaucoma_gradcam_dict.get("heatmap_only") is not None else dr_gradcam_dict
        
        heatmap_base64 = None
        overlay_base64 = None
        
        if gradcam_data:
            if gradcam_data.get("heatmap_only") is not None:
                heatmap_bytes = supabase_service._heatmap_to_bytes(gradcam_data["heatmap_only"])
                heatmap_base64 = base64.b64encode(heatmap_bytes).decode('utf-8')
            
            if gradcam_data.get("overlay") is not None:
                overlay_bytes = supabase_service._heatmap_to_bytes(gradcam_data["overlay"])
                overlay_base64 = base64.b64encode(overlay_bytes).decode('utf-8')
        
        # Upload to Supabase in background (non-blocking)
        asyncio.create_task(
            supabase_service.upload_images_async(
                image_id=image_id,
                original_image=image_bytes,
                glaucoma_gradcam=glaucoma_gradcam_dict,
                dr_gradcam=dr_gradcam_dict,
                patient_id=patient_id
            )
        )
        
        # Return response immediately with base64 images
        return JSONResponse(content={
            "success": True,
            "patient_id": patient_id,
            "image_id": image_id,
            "glaucoma": {
                "result_msg": glaucoma_result["result_msg"],
                "confidence": glaucoma_result["confidence"],
                "prediction": glaucoma_result.get("prediction", ""),
                "raw_output": glaucoma_result.get("raw_output", [])
            },
            "dr": {
                "result_msg": dr_result["result_msg"],
                "confidence": dr_result["confidence"],
                "prediction": dr_result.get("prediction", ""),
                "raw_output": dr_result.get("raw_output", [])
            },
            # Base64 images for immediate display
            "image_base64": f"data:image/jpeg;base64,{original_base64}",
            "heatmap_base64": f"data:image/jpeg;base64,{heatmap_base64}" if heatmap_base64 else None,
            "overlay_base64": f"data:image/jpeg;base64,{overlay_base64}" if overlay_base64 else None,
            # URLs will be available after async upload completes (for history)
            # These will be null initially but that's OK - history page will fetch from Supabase
            "image_url": None,
            "heatmap_url": None,
            "overlay_url": None,
            "gradcam_url": None  # For backward compatibility
        })
        
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

