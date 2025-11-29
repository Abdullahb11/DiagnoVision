from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional
import logging

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
        
        # Prepare GradCAM data for upload
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
        
        # Upload images to Supabase (original + GradCAMs)
        image_data = await supabase_service.upload_images(
            original_image=image_bytes,
            glaucoma_gradcam=glaucoma_gradcam_dict,
            dr_gradcam=dr_gradcam_dict,
            patient_id=patient_id
        )
        
        # Return combined results - frontend will store in Firebase
        return JSONResponse(content={
            "success": True,
            "patient_id": patient_id,
            "image_id": image_data["image_id"],
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
            "image_url": image_data["image_url"],
            "heatmap_url": image_data["heatmap_url"],
            "overlay_url": image_data["overlay_url"],
            "gradcam_url": image_data["overlay_url"]  # For backward compatibility
        })
        
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

