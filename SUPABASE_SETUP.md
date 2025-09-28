# 🚀 Supabase Setup Guide

## Step 1: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Configuration (for magic links)
RESEND_API_KEY=your_resend_api_key

# Optional: Admin User ID (for seeding initial admin)
ADMIN_USER_ID=your_admin_user_id_here
```

## Step 2: Supabase Project Setup

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2.2 Configure Authentication
1. Go to Authentication > Settings
2. Enable "Email" provider
3. Set "Site URL" to `http://localhost:3000`
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/teacher/dashboard`
   - `http://localhost:3000/admin`

### 2.3 Create Storage Bucket
1. Go to Storage
2. Create a new bucket named `teacher-docs`
3. Set it to "Public" (or configure RLS policies)

## Step 3: Database Schema Deployment

Run the SQL commands from `supabase-teacher-schema.sql` in your Supabase SQL Editor:

1. Copy the entire content of `supabase-teacher-schema.sql`
2. Go to SQL Editor in Supabase
3. Paste and run the SQL

## Step 4: Storage Policies

Add these storage policies in Supabase Dashboard > Storage > Policies:

### Upload Policy
```sql
CREATE POLICY "Teachers can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'teacher-docs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### View Policy
```sql
CREATE POLICY "Teachers can view own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'teacher-docs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Admin Policy
```sql
CREATE POLICY "Admins can view all files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'teacher-docs' AND 
  public.is_admin()
);
```

## Step 5: Create Initial Admin User

1. Go to Authentication > Users
2. Create a new user with admin email
3. Note the user ID
4. Run this SQL to make them admin:

```sql
INSERT INTO public.profiles (id, role, full_name, email)
VALUES ('your-admin-user-id', 'admin', 'System Administrator', 'admin@nelimaclearning.co.ke')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## Step 6: Test the System

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/teacher-apply`
3. Submit a test application
4. Check the admin panel at `http://localhost:3000/admin`
5. Approve the teacher and verify they appear on hire-teacher page

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your site URL is configured correctly
2. **RLS errors**: Ensure all policies are created correctly
3. **Storage errors**: Check bucket permissions and policies
4. **Auth errors**: Verify redirect URLs are configured

### Getting Help:
- Check Supabase logs in Dashboard > Logs
- Check browser console for errors
- Verify environment variables are loaded correctly
