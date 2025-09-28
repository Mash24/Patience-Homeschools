-- Add missing columns to teachers table if they don't exist
-- This script ensures the teachers table has all required columns

-- Add gender column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teachers' AND column_name = 'gender') THEN
        ALTER TABLE public.teachers ADD COLUMN gender text;
    END IF;
END $$;

-- Add date_of_birth column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teachers' AND column_name = 'date_of_birth') THEN
        ALTER TABLE public.teachers ADD COLUMN date_of_birth date;
    END IF;
END $$;

-- Ensure application_date column exists (it should already exist based on schema)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teachers' AND column_name = 'application_date') THEN
        ALTER TABLE public.teachers ADD COLUMN application_date timestamptz;
    END IF;
END $$;

-- Add profile_photo_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'teachers' AND column_name = 'profile_photo_url') THEN
        ALTER TABLE public.teachers ADD COLUMN profile_photo_url text;
    END IF;
END $$;

-- Update any existing records to have application_date set to created_at if it's null
UPDATE public.teachers 
SET application_date = created_at 
WHERE application_date IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_email ON public.teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON public.teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_application_date ON public.teachers(application_date DESC);
CREATE INDEX IF NOT EXISTS idx_teachers_created_at ON public.teachers(created_at DESC);
