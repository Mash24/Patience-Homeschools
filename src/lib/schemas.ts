import { z } from 'zod'

// Parent Lead Schema (for teacher matching)
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

// Enhanced Parent Registration Schema
export const ParentRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  
  // Location Information
  city: z.string().min(2, 'Please enter your city'),
  area: z.string().min(2, 'Please enter your area'),
  address: z.string().optional(),
  
  // Family Information
  children: z.array(z.object({
    firstName: z.string().min(1, 'Child name is required'),
    lastName: z.string().min(1, 'Child surname is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gradeLevel: z.string().min(1, 'Grade level is required'),
    school: z.string().optional(),
    specialNeeds: z.string().optional(),
    interests: z.array(z.string()).optional(),
  })).min(1, 'Please add at least one child'),
  
  // Education Preferences
  preferredCurricula: z.array(z.string()).min(1, 'Please select at least one curriculum'),
  preferredSubjects: z.array(z.string()).min(1, 'Please select at least one subject'),
  teachingMode: z.enum(['in_home', 'online', 'hybrid']),
  
  // Additional Information
  goals: z.string().optional(),
  budgetConsiderations: z.string().optional(),
  schedulePreferences: z.string().optional(),
  emergencyContact: z.string().optional(),
  
  // Communication Preferences
  preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
  newsletterSubscription: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  
  // Terms and Conditions
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeToPrivacy: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type ParentRegistrationData = z.infer<typeof ParentRegistrationSchema>

// Child Schema (for individual child data)
export const ChildSchema = z.object({
  firstName: z.string().min(1, 'Child name is required'),
  lastName: z.string().min(1, 'Child surname is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  school: z.string().optional(),
  specialNeeds: z.string().optional(),
  interests: z.array(z.string()).optional(),
})

export type ChildData = z.infer<typeof ChildSchema>

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
    teachingPhilosophy: z.string().min(100, 'Teaching philosophy must be at least 100 characters'),
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
  id_number?: string
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
  year_of_graduation?: number
  additional_certifications?: string
  previous_schools?: string
  references?: string
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
  file_name?: string
  file_size?: number
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
