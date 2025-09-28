# Database Setup Required

## ⚠️ IMPORTANT: Database Tables Missing

The teacher application system requires additional database tables that haven't been created yet.

## 🔧 Quick Fix:

1. **Open your Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the contents of `setup-provisional-applications.sql`**
4. **Click "Run"**

## 📋 What this creates:

- `provisional_applications` table - stores applications before account creation
- `provisional_application_documents` table - stores uploaded documents temporarily
- RLS policies for security
- Cleanup function for expired applications

## ✅ After running the SQL:

The teacher application form will work properly and you can:
- Submit applications without creating accounts first
- Upload documents during application
- Receive magic links for account creation
- Have applications automatically linked after verification

## 🚨 Current Error:
```
Could not find the table 'public.provisional_applications' in the schema cache
```

This will be resolved once you run the SQL schema.
