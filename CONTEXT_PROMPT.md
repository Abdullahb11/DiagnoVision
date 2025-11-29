# DiagnoVision Project - Full Context Prompt

**Copy and paste this entire prompt when reopening Cursor to give full context:**

---

## Project Overview

I'm working on **DiagnoVision**, a medical image analysis platform for Glaucoma and Diabetic Retinopathy detection using ML models. The project uses React.js (frontend) and will use FastAPI (backend) for ML model inference.

## Project Structure

```
DiagnoVision/
├── frontend/          # React.js application (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/    # React components (Header, Sidebar, Layout, ProtectedRoute)
│   │   ├── contexts/      # AuthContext for Firebase authentication
│   │   ├── config/        # Firebase and Supabase configuration
│   │   ├── pages/         # All page components (patient/, doctor/, Home, SignIn, SignUp)
│   │   └── ...
│   ├── package.json
│   ├── install.bat        # Windows install script
│   ├── install.sh         # Linux/Mac install script
│   └── ...
└── backend/           # FastAPI backend (TO BE CREATED - not yet set up)
    └── (will contain FastAPI app, ML models, preprocessing, GradCAM, etc.)
```

## Tech Stack

- **Frontend**: React.js, Vite, React Router, Tailwind CSS
- **Authentication**: Firebase Auth (email/password only, NO Google auth)
- **Database**: 
  - Firebase Firestore (user data, patient, doctor, messages, notifications, results, appointments)
  - Supabase (image storage and `images` table)
- **Backend**: FastAPI (for ML model inference - structure planned but not implemented yet)
- **ML**: Glaucoma and Diabetic Retinopathy detection models (trained, will be integrated later)

## Database Schema

### Firebase Tables (Firestore)
- **user**: `id`, `email`, `password`, `role` (patient/doctor)
- **patient**: `user_id`, `name`, `age`, `gender`, `doctorId`, `contactNo`
- **doctor**: `user_id`, `name`, `qualification`, `licenseNo`
- **messages**: `msg_id`, `patientId`, `doctorId`, `msg`, `sent_by_patient`
- **notifications**: `user_id`, `notification`
- **glucoma_result**: `patientId`, `result_msg`, `imageId`, `doctor_feedback`, `date`
- **dr_result**: `patientId`, `result_msg`, `imageId`, `doctor_feedback`, `date`
- **appointments**: `id`, `patientID`, `doctorID`, `Date`, `status`

### Supabase Tables
- **images**: `imageId`, `Image_url`, `heatmap_url`, `overlay_url`, `grad_cam_url`

## Current Status

### ✅ Completed

1. **Frontend Migration**: 
   - Migrated from HTML/JS to React.js with Vite
   - All pages converted to React components
   - Routing set up with React Router
   - Tailwind CSS configured

2. **Firebase Integration**:
   - Firebase Auth configured (email/password only)
   - Firestore integrated for role storage
   - User role stored in Firestore `user` collection on signup
   - Role fetched from Firestore on authentication state change
   - AuthContext provides `currentUser`, `userRole`, `signup`, `signin`, `signout`

3. **Supabase Integration**:
   - Supabase client configured in frontend (`src/config/supabase.js`)
   - Supabase credentials configured:
     - URL: `https://xoyxfcmpzmjjzwulejvr.supabase.co`
     - Anon key: Configured
     - Service key: Will be used in backend

4. **UI Components**:
   - Header with sign-out functionality
   - Sidebar with role-based navigation (patient/doctor)
   - Layout component with responsive sidebar toggle
   - Protected routes based on authentication and role

5. **Pages Created**:
   - Home, SignIn, SignUp
   - Patient: Dashboard, History, Eye Scan Analysis, Available Doctors, My Doctors, Messages
   - Doctor: Dashboard, My Patients, Messages

### 🔄 In Progress / Next Steps

**Phase 1: Database Setup** (Current Phase)
- ✅ Supabase configured (credentials set up)
- ⏳ Verify Supabase storage bucket "images" exists and is public
- ⏳ Verify Supabase `images` table exists with correct schema
- ⏳ Create Firebase Firestore collections: `patient`, `doctor`, `glucoma_result`, `dr_result`, `messages`, `appointments`

**Phase 2: Backend Setup** (Next)
- Create FastAPI backend structure
- Set up ML model loading
- Implement preprocessing pipelines (glaucoma and DR)
- Implement GradCAM generation
- Set up image upload to Supabase after processing
- Set up Firebase Admin SDK for backend authentication

**Phase 3: Frontend-Backend Integration**
- Connect frontend to FastAPI endpoints
- Implement image upload flow
- Display results and GradCAM visualizations

## Image Processing Flow

1. User uploads image → Frontend sends to FastAPI
2. FastAPI preprocesses image (for both glaucoma and DR)
3. ML models run inference
4. GradCAM heatmaps generated
5. **After processing**: Original image + GradCAM images uploaded to Supabase Storage
6. Image metadata stored in Supabase `images` table
7. Results stored in Firebase (`glucoma_result` or `dr_result`)

**Important**: Images are NOT stored in Supabase until AFTER ML processing completes.

## Firebase Configuration

- **Project ID**: `diagnovision-6bd9d`
- **API Key**: `AIzaSyAMUgHQRjj0OjjqsM5z6QKlcQBntMzcFso`
- **Auth Domain**: `diagnovision-6bd9d.firebaseapp.com`
- **Storage Bucket**: `diagnovision-6bd9d.firebasestorage.app`
- **Messaging Sender ID**: `404961014974`
- **App ID**: `1:404961014974:web:84d00bc3c9984801605aef`

## Supabase Configuration

- **URL**: `https://xoyxfcmpzmjjzwulejvr.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveXhmY21wem1qanp3dWxlanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzUxMTMsImV4cCI6MjA4MDAxMTExM30.S48PUVG7Oce5Uzch2iHh520a0So-5oUr_nwtmKaJ7sU`
- **Service Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveXhmY21wem1qanp3dWxlanZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzNTExMywiZXhwIjoyMDgwMDExMTEzfQ.3SpFd70YVK2tcKAByf4djQv9GgRi_RYP51IK_cWQWhs`

## Key Implementation Details

1. **Authentication**: 
   - Firebase Auth handles authentication
   - User role stored in Firestore `user` collection
   - Role persists across page refreshes via Firestore

2. **Role-Based Access**:
   - Sidebar shows different navigation items based on `userRole` (patient/doctor)
   - Protected routes check authentication and role

3. **Backend Authentication**:
   - Backend will use Firebase Admin SDK
   - Frontend sends Firebase auth token to backend
   - NO Supabase authentication (only Firebase)

4. **Dependency Management**:
   - Frontend: `npm install` (or run `install.bat`/`install.sh`)
   - Backend: Will use `pip install -r requirements.txt` (when created)

## Important Notes

- **NO backend folder exists yet** - it was deleted/moved. Backend structure needs to be created.
- All original HTML/JS files were migrated to React components
- Google authentication was removed (email/password only)
- Sidebar visibility and role handling are working correctly
- Supabase is configured but storage bucket and table need verification in Supabase dashboard

## Current Task

We're in **Phase 1: Database Setup**. Next steps:
1. Verify Supabase storage bucket "images" exists and is public
2. Verify Supabase `images` table exists
3. Create Firebase Firestore collections for remaining tables

---

**End of Context Prompt**

