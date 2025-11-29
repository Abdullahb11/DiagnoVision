# Database Schema Documentation

## Firebase Tables

### user
- `id` - User ID (primary key)
- `email` - User email address
- `password` - User password (hashed)
- `role` - User role (patient/doctor)

### patient
- `user_id` - Foreign key to user.id
- `name` - Patient name
- `age` - Patient age
- `gender` - Patient gender
- `doctorId` - Foreign key to doctor.user_id
- `contactNo` - Contact number

### doctor
- `user_id` - Foreign key to user.id
- `name` - Doctor name
- `qualification` - Doctor qualifications
- `licenseNo` - Medical license number

### messages
- `msg_id` - Message ID (primary key)
- `patientId` - Foreign key to patient.user_id
- `doctorId` - Foreign key to doctor.user_id
- `msg` - Message content
- `sent_by_patient` - Boolean flag indicating if message was sent by patient

### notifications
- `user_id` - Foreign key to user.id
- `notification` - Notification content

### glucoma_result
- `patientId` - Foreign key to patient.user_id
- `result_msg` - Glaucoma test result message
- `imageId` - Foreign key to images.imageId
- `doctor_feedback` - Doctor's feedback on the result
- `date` - Date of the result

### dr_result
- `patientId` - Foreign key to patient.user_id
- `result_msg` - DR (Diabetic Retinopathy) test result message
- `imageId` - Foreign key to images.imageId
- `doctor_feedback` - Doctor's feedback on the result
- `date` - Date of the result

### appointments
- `id` - Appointment ID (primary key)
- `patientID` - Foreign key to patient.user_id
- `doctorID` - Foreign key to doctor.user_id
- `Date` - Appointment date
- `status` - Appointment status

## Supabase Tables

### images
- `imageId` - Image ID (primary key)
- `Image_url` - URL to the original stored image
- `heatmap_url` - URL to the GradCAM heatmap only (colored heatmap)
- `overlay_url` - URL to the overlay image (original + heatmap combined)
- `grad_cam_url` - URL to the Grad-CAM visualization image (for backward compatibility, points to overlay_url)

## Notes
- Supabase stores the actual image files and provides references in the `images` table
- Both `glucoma_result` and `dr_result` reference images via `imageId`
- Firebase handles authentication and user management
- Supabase handles image storage and retrieval

