-- Database Migration Script
-- Run this in Supabase SQL Editor to update existing database

-- Add missing columns to teachers table
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS id_number text,
ADD COLUMN IF NOT EXISTS year_of_graduation int,
ADD COLUMN IF NOT EXISTS additional_certifications text,
ADD COLUMN IF NOT EXISTS previous_schools text,
ADD COLUMN IF NOT EXISTS references text;

-- Add missing columns to teacher_documents table
ALTER TABLE teacher_documents 
ADD COLUMN IF NOT EXISTS file_name text,
ADD COLUMN IF NOT EXISTS file_size bigint;

-- Make kind column NOT NULL (if it isn't already)
ALTER TABLE teacher_documents ALTER COLUMN kind SET NOT NULL;

-- Add new indexes
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_tsc_number ON teachers(tsc_number);
CREATE INDEX IF NOT EXISTS idx_teacher_documents_teacher_id ON teacher_documents(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_documents_kind ON teacher_documents(kind);

-- Update any existing records with empty levels array if needed
UPDATE teachers SET levels = '{}' WHERE levels IS NULL;

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'teachers' 
ORDER BY ordinal_position;

SELECT 
  column_name, 
  data_type, 
  is_nullable 
FROM information_schema.columns 
WHERE table_name = 'teacher_documents' 
ORDER BY ordinal_position;
