-- Provisional Applications Schema for Application-First Flow
-- This allows teachers to complete applications before creating accounts

-- Provisional applications table
CREATE TABLE IF NOT EXISTS public.provisional_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  location_area text,
  subjects text[],
  curricula text[],
  grade_levels text[],
  experience_years integer DEFAULT 0,
  education_background text,
  teaching_philosophy text,
  availability text[],
  hourly_rate_range text,
  tsc_number text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'claimed', 'expired')),
  application_date timestamptz DEFAULT now(),
  claimed_at timestamptz,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Provisional application documents table
CREATE TABLE IF NOT EXISTS public.provisional_application_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.provisional_applications(id) ON DELETE CASCADE,
  kind text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  is_required boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_provisional_applications_email ON public.provisional_applications(email);
CREATE INDEX IF NOT EXISTS idx_provisional_applications_status ON public.provisional_applications(status);
CREATE INDEX IF NOT EXISTS idx_provisional_applications_expires_at ON public.provisional_applications(expires_at);
CREATE INDEX IF NOT EXISTS idx_provisional_documents_app_id ON public.provisional_application_documents(application_id);

-- RLS Policies for provisional applications
ALTER TABLE public.provisional_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provisional_application_documents ENABLE ROW LEVEL SECURITY;

-- Only admins can read provisional applications
CREATE POLICY "admins can read provisional applications" ON public.provisional_applications
  FOR SELECT USING (public.is_admin());

-- Only admins can update provisional applications
CREATE POLICY "admins can update provisional applications" ON public.provisional_applications
  FOR UPDATE USING (public.is_admin());

-- Only admins can delete provisional applications
CREATE POLICY "admins can delete provisional applications" ON public.provisional_applications
  FOR DELETE USING (public.is_admin());

-- Only admins can read provisional documents
CREATE POLICY "admins can read provisional documents" ON public.provisional_application_documents
  FOR SELECT USING (public.is_admin());

-- Only admins can delete provisional documents
CREATE POLICY "admins can delete provisional documents" ON public.provisional_application_documents
  FOR DELETE USING (public.is_admin());

-- Function to clean up expired provisional applications
CREATE OR REPLACE FUNCTION public.cleanup_expired_applications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete expired provisional applications and their documents
  DELETE FROM public.provisional_application_documents
  WHERE application_id IN (
    SELECT id FROM public.provisional_applications 
    WHERE expires_at < now() AND status = 'submitted'
  );
  
  DELETE FROM public.provisional_applications
  WHERE expires_at < now() AND status = 'submitted';
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.cleanup_expired_applications() TO service_role;