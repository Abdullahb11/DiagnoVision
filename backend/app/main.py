from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import router
import torch
import gc

# Render Free Tier Memory Optimizations
torch.set_num_threads(1)

app = FastAPI(
    title="DiagnoVision API",
    description="AI-powered eye disease detection API for Glaucoma and Diabetic Retinopathy",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (including Vercel production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["analysis"])

@app.get("/")
async def root():
    return {
        "message": "DiagnoVision API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.API_HOST, port=settings.API_PORT)

