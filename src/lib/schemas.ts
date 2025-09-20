import { z } from 'zod'

// Parent Lead Schema
export const ParentLeadSchema = z.object({
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  city: z.string().optional(),
  childFirstName: z.string().optional(),
  gradeLevel: z.string().min(1, 'Please select a grade level'),
  curricula: z.array(z.string()).min(1, 'Please select at least one curriculum'),
  subjects: z.array(z.string()).min(1, 'Please select at least one subject'),
  goals: z.string().optional(),
  mode: z.enum(['in_home', 'online', 'hybrid']),
  locationArea: z.string().optional(),
  scheduleNote: z.string().optional(),
  budgetBand: z.string().optional(),
})

export type ParentLeadData = z.infer<typeof ParentLeadSchema>

// Teacher Application Schema
export const TeacherApplicationSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    idNumber: z.string().optional(),
    location: z.string().min(1, 'Please enter your location'),
    dateOfBirth: z.string().optional(),
  }),
  education: z.object({
    highestQualification: z.string().min(1, 'Please enter your highest qualification'),
    institution: z.string().min(1, 'Please enter your institution'),
    yearOfGraduation: z.string().optional(),
    tscNumber: z.string().optional(),
    additionalCertifications: z.string().optional(),
  }),
  experience: z.object({
    yearsOfExperience: z.string().min(1, 'Please enter years of experience'),
    previousSchools: z.string().optional(),
    subjectsTaught: z.array(z.string()).min(1, 'Please select at least one subject'),
    curriculumExperience: z.array(z.string()).min(1, 'Please select at least one curriculum'),
    specializations: z.array(z.string()).optional(),
  }),
  availability: z.object({
    preferredSchedule: z.string().optional(),
    maxHoursPerWeek: z.string().optional(),
    preferredLocation: z.string().optional(),
    onlineTeaching: z.boolean().default(false),
  }),
  additionalInfo: z.object({
    teachingPhilosophy: z.string().optional(),
    whyJoinUs: z.string().optional(),
    references: z.string().optional(),
  }),
})

export type TeacherApplicationData = z.infer<typeof TeacherApplicationSchema>

// Contact Form Schema
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>

// Database Types
export interface ParentLead {
  id: string
  parent_name: string
  email: string
  phone?: string
  city?: string
  child_first_name?: string
  grade_level: string
  curricula: string[]
  subjects: string[]
  goals?: string
  mode: 'in_home' | 'online' | 'hybrid'
  location_area?: string
  schedule_note?: string
  budget_band?: string
  status: 'new' | 'shortlisted' | 'matched' | 'closed'
  created_at: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  city?: string
  curricula: string[]
  subjects: string[]
  levels: string[]
  mode: 'in_home' | 'online' | 'both'
  service_areas?: string[]
  years_experience: number
  rate_min?: number
  rate_max?: number
  tsc_number?: string
  verified: boolean
  status: 'pending' | 'approved' | 'rejected'
  score: number
  created_at: string
}

export interface TeacherDocument {
  id: string
  teacher_id: string
  kind: string
  file_path: string
  verified_at?: string
  created_at: string
}

export interface Match {
  id: string
  lead_id: string
  teacher_id: string
  score?: number
  status: 'suggested' | 'sent' | 'accepted' | 'declined'
  created_at: string
}
