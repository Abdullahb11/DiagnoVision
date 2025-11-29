# Supabase Schema Update - Images Table

## Updated Schema

The `images` table in Supabase now stores all three image URLs:

### images Table
- `imageId` (uuid, primary key) - Unique image identifier
- `Image_url` (text) - URL to the original uploaded image
- `heatmap_url` (text) - URL to the GradCAM heatmap only (colored heatmap)
- `overlay_url` (text) - URL to the overlay image (original + heatmap combined)
- `grad_cam_url` (text) - URL to GradCAM visualization (for backward compatibility, points to overlay_url)

## How to Update Supabase Table

### Step 1: Go to Supabase Dashboard
1. Navigate to: https://supabase.com/dashboard/project/xoyxfcmpzmjjzwulejvr/editor
2. Find the `images` table

### Step 2: Add New Columns
1. Click on the `images` table
2. Click "Add Column" button
3. Add the following columns:

**Column 1: heatmap_url**
- Name: `heatmap_url`
- Type: `text`
- Nullable: `true` (optional, in case heatmap generation fails)
- Default: `null`

**Column 2: overlay_url**
- Name: `overlay_url`
- Type: `text`
- Nullable: `true` (optional, in case overlay generation fails)
- Default: `null`

### Step 3: Verify Existing Columns
Make sure these columns exist:
- `imageId` (uuid, primary key)
- `Image_url` (text)
- `grad_cam_url` (text (if it exists, keep it for backward compatibility)

## Final Table Structure

```
images
├── imageId (uuid, primary key)
├── Image_url (text)
├── heatmap_url (text, nullable)
├── overlay_url (text, nullable)
└── grad_cam_url (text, nullable) - for backward compatibility
```

## Notes

- **Firebase doesn't need changes** - It only stores `imageId` reference, not the URLs
- All three images are stored in Supabase Storage bucket "images"
- The backend automatically uploads all three images and stores their URLs
- Frontend displays all three images in a grid layout

## Testing

After updating the schema:
1. Restart backend server
2. Upload a test image through frontend
3. Check Supabase `images` table - should have all three URLs populated
4. Verify all three images display correctly in frontend

