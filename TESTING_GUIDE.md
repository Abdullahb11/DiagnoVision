# DiagnoVision Testing Guide

## 🚀 Quick Start Testing

### Prerequisites
1. ✅ Backend server running on `http://localhost:8000`
2. ✅ Frontend running on `http://localhost:5173` (or your Vite dev server port)
3. ✅ User logged in as a **patient** (not doctor)

---

## 📋 Step-by-Step Testing Instructions

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Verify Backend is Running:**
- Open browser: `http://localhost:8000/health`
- Should see: `{"status":"healthy"}`

---

### Step 2: Start the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already done)
npm install

# Start the dev server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 3: Login as Patient

1. Open browser: `http://localhost:5173`
2. Sign in with a patient account (or create one if needed)
3. Navigate to: **Eye Scan Analysis** (from sidebar)

---

### Step 4: Test Image Upload and Analysis

1. **Select an Image:**
   - Click "Choose File" button
   - Select a retinal image (JPG, PNG, or TIFF)
   - Image preview should appear

2. **Click "Analyze Image"**
   - Loading spinner appears
   - "Analyzing image... This may take a moment." message shows

3. **Wait for Results** (usually 5-15 seconds)
   - Backend processes the image
   - Model runs inference
   - GradCAM is generated
   - Images uploaded to Supabase

---

## ✅ What to Expect

### Successful Analysis Response

You should see:

1. **Glaucoma Detection Results:**
   - Result message (e.g., "Signs of Glaucoma detected (confidence: 85.0%)")
   - Confidence percentage with progress bar
   - Color coding:
     - 🟢 Green: Low risk (< 50%)
     - 🟡 Yellow: Medium risk (50-70%)
     - 🔴 Red: High risk (> 70%)

2. **Diabetic Retinopathy Results:**
   - Similar format as Glaucoma
   - (Note: DR model may show placeholder if not implemented yet)

3. **Visualizations:**
   - **Original Image**: The uploaded image from Supabase
   - **GradCAM Visualization**: Heatmap showing model attention areas

4. **Success Message:**
   - "✓ Analysis complete! Results have been saved to your history."

---

## 🔍 Expected API Response Format

```json
{
  "success": true,
  "patient_id": "user-uid-here",
  "image_id": "uuid-here",
  "glaucoma": {
    "result_msg": "Signs of Glaucoma detected (confidence: 85.0%)",
    "confidence": 0.85,
    "prediction": "Signs detected",
    "raw_output": [0.85, 0.15]
  },
  "dr": {
    "result_msg": "No signs of Diabetic Retinopathy detected (confidence: 90.0%)",
    "confidence": 0.90,
    "prediction": "No signs detected",
    "raw_output": [0.10, 0.90]
  },
  "image_url": "https://xoyxfcmpzmjjzwulejvr.supabase.co/storage/v1/object/public/images/...",
  "gradcam_url": "https://xoyxfcmpzmjjzwulejvr.supabase.co/storage/v1/object/public/images/..."
}
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Model not loading**
```
WARNING: Model file not found at ./models/glaucoma_mobilenet_best.pth
```
**Solution:** 
- Check that `glaucoma_mobilenet_best.pth` exists in `backend/models/`
- Verify file path in `backend/app/config.py`

**Problem: PyTorch/Captum import errors**
```
ModuleNotFoundError: No module named 'torch'
```
**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

**Problem: CORS errors**
```
Access to fetch at 'http://localhost:8000/api/analyze' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:**
- Check `backend/app/main.py` - CORS should allow `localhost:5173`
- Verify backend is running

---

### Frontend Issues

**Problem: "Failed to analyze image" error**
- Check browser console for detailed error
- Verify backend is running: `http://localhost:8000/health`
- Check network tab for API request/response

**Problem: Images not displaying**
- Check Supabase storage bucket "images" is public
- Verify image URLs in response are accessible
- Check browser console for image loading errors

**Problem: Results not saving to Firebase**
- Check browser console for Firebase errors
- Verify user is logged in
- Check Firestore security rules allow writes

---

## 📊 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend connects to backend API
- [ ] Image upload works
- [ ] Analysis completes successfully
- [ ] Glaucoma results display correctly
- [ ] Confidence bars show correct values
- [ ] Original image displays from Supabase
- [ ] GradCAM visualization displays
- [ ] Results saved to Firebase Firestore
- [ ] Error handling works (try invalid image)
- [ ] Loading states display correctly

---

## 🎯 Test Cases

### Test Case 1: Normal Image (No Glaucoma)
- Upload a normal retinal image
- **Expected:** "No signs of Glaucoma detected" with low confidence

### Test Case 2: Glaucoma Image
- Upload a glaucoma-positive image
- **Expected:** "Signs of Glaucoma detected" with high confidence (> 50%)

### Test Case 3: Invalid File
- Try uploading a non-image file (e.g., .txt)
- **Expected:** Error message displayed

### Test Case 4: Large File
- Try uploading a very large image (> 10MB)
- **Expected:** Error or timeout (backend may reject)

### Test Case 5: Network Error
- Stop backend server, try to analyze
- **Expected:** Error message: "Failed to analyze image. Please try again."

---

## 📝 Notes

- **First Request:** May take longer (model loading)
- **Subsequent Requests:** Faster (model already loaded)
- **GradCAM Generation:** Adds 2-5 seconds to processing time
- **Image Upload:** Depends on image size and network speed

---

## 🔗 Useful URLs

- Backend Health: `http://localhost:8000/health`
- Backend API Docs: `http://localhost:8000/docs` (FastAPI auto-generated)
- Frontend: `http://localhost:5173`
- Supabase Dashboard: `https://supabase.com/dashboard/project/xoyxfcmpzmjjzwulejvr`
- Firebase Console: `https://console.firebase.google.com/project/diagnovision-6bd9d`

---

## ✅ Success Criteria

Your test is successful if:
1. ✅ Image uploads without errors
2. ✅ Analysis completes in < 30 seconds
3. ✅ Results display with confidence scores
4. ✅ Images (original + GradCAM) display correctly
5. ✅ Results saved to Firebase (check Firestore console)
6. ✅ No errors in browser console
7. ✅ No errors in backend logs

---

**Happy Testing! 🎉**

