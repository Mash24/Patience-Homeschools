-- Core Admin Panel Database Schema for Nelimac Learning
-- This creates all the necessary tables for the admin system

-- 1. Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  subjects TEXT[] NOT NULL, -- Array of subjects they can teach
  experience_years INTEGER DEFAULT 0,
  education_level TEXT,
  tsc_number TEXT,
  documents JSONB DEFAULT '[]', -- Store document URLs and metadata
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  assigned_parents UUID[] DEFAULT '{}', -- Array of parent IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Parents/Leads Table
CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  child_name TEXT,
  child_grade TEXT,
  child_age INTEGER,
  requested_subjects TEXT[] NOT NULL,
  budget_range TEXT,
  schedule_preferences TEXT,
  special_requirements TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'assigned', 'completed', 'cancelled')),
  assigned_teacher_id UUID REFERENCES teachers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Assignments Table (Teacher-Parent Matches)
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  hourly_rate DECIMAL(10,2),
  total_hours INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, parent_id, subject)
);

-- 4. Messages Table (Support/Communication)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL, -- Can be teacher, parent, or admin
  sender_role TEXT NOT NULL CHECK (sender_role IN ('parent', 'teacher', 'admin')),
  sender_email TEXT NOT NULL,
  recipient_id UUID, -- Admin who should handle this
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'technical', 'billing', 'complaint', 'feedback')),
  admin_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Admin Actions Log
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('teacher', 'parent', 'assignment', 'message')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'assigned', 'unassigned', 'created', 'updated', 'deleted')),
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL,
  recipient_role TEXT NOT NULL CHECK (recipient_role IN ('parent', 'teacher', 'admin')),
  recipient_email TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('approval', 'rejection', 'assignment', 'message', 'system')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_parents_status ON parents(status);
CREATE INDEX IF NOT EXISTS idx_parents_email ON parents(email);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_parent ON assignments(parent_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Admin Access
-- Admin users can read/write all data
CREATE POLICY "Admin full access" ON teachers FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON parents FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON assignments FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON messages FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON admin_actions FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON notifications FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON system_settings FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can read their own data
CREATE POLICY "Teachers own data" ON teachers FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers own assignments" ON assignments FOR SELECT TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers own notifications" ON notifications FOR SELECT TO authenticated
  USING (auth.uid() = recipient_id AND recipient_role = 'teacher');

-- Parents can read their own data
CREATE POLICY "Parents own data" ON parents FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Parents own assignments" ON assignments FOR SELECT TO authenticated
  USING (auth.uid() = parent_id);

CREATE POLICY "Parents own notifications" ON notifications FOR SELECT TO authenticated
  USING (auth.uid() = recipient_id AND recipient_role = 'parent');

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('email_templates', '{"approval": "Your teacher application has been approved!", "rejection": "Your teacher application was not approved.", "assignment": "You have been assigned a new student."}', 'Email notification templates'),
  ('auto_approval_rules', '{"enabled": false, "min_experience": 2, "required_documents": ["degree", "id"]}', 'Automatic approval rules'),
  ('notification_settings', '{"email_enabled": true, "in_app_enabled": true, "admin_alerts": true}', 'Notification preferences')
ON CONFLICT (key) DO NOTHING;
