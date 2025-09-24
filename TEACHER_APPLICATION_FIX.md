# Teacher Application Database Setup Guide

## Issue Identified
The teacher application form was showing success messages but not saving data to the database because:

1. **API Route Issue**: The `/api/teachers` route was only logging data to console, not saving to Supabase
2. **Missing Environment Variables**: No Supabase configuration was set up
3. **File Upload Missing**: Document uploads weren't being handled

## Fixes Applied

### 1. Fixed Teacher Application API (`/api/teachers/route.ts`)
- Added proper Supabase database insertion
- Maps form data to database schema
- Handles validation and error cases
- Falls back to demo mode if Supabase not configured

### 2. Added File Upload API (`/api/teachers/upload/route.ts`)
- Handles document uploads to Supabase Storage
- Creates records in `teacher_documents` table
- Supports TSC certificates, CVs, profile photos, and other documents

### 3. Updated Form Submission Logic
- Modified `TeacherApplicationWizard.tsx` to upload files after successful application submission
- Uses `Promise.allSettled()` to handle upload failures gracefully
- Application succeeds even if some file uploads fail

### 4. Created Environment Configuration
- Added `env.example` with required environment variables
- Includes Supabase, email, and WhatsApp configuration

## Setup Instructions

### 1. Configure Supabase
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Copy your project URL and API keys

### 2. Set Up Environment Variables
1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

### 3. Test the Application
1. Start the development server: `npm run dev`
2. Navigate to `/teacher-apply`
3. Fill out the form and submit
4. Check your Supabase dashboard to verify data is saved

## Database Tables Used

### `teachers` table
- Stores teacher application data
- Maps form fields to database columns
- Status: 'pending' for new applications

### `teacher_documents` table
- Stores uploaded document metadata
- Links to Supabase Storage files
- Document types: 'tscCertificate', 'cv', 'profilePhoto', 'otherDocuments'

### Storage Bucket: `teacher-docs`
- Stores actual file uploads
- Private bucket for security
- Organized by teacher ID

## Testing Checklist

- [ ] Teacher application form submits successfully
- [ ] Data appears in `teachers` table
- [ ] File uploads work (if files selected)
- [ ] Documents appear in `teacher_documents` table
- [ ] Files stored in Supabase Storage
- [ ] Success message shows with application ID
- [ ] Form resets after successful submission

## Troubleshooting

### If data still isn't saving:
1. Check browser console for errors
2. Verify Supabase environment variables are set
3. Check Supabase dashboard for connection issues
4. Ensure database schema is properly set up

### If file uploads fail:
1. Check Supabase Storage bucket exists
2. Verify storage policies are configured
3. Check file size limits (configured in schema)
4. Ensure service role key has proper permissions

## Next Steps

1. **Email Notifications**: Add email notifications for new applications
2. **Admin Dashboard**: Create admin interface to view applications
3. **Application Status**: Add status tracking and updates
4. **File Validation**: Add server-side file validation
5. **Application Review**: Build review workflow for admin users
