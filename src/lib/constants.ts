// Nelimac Learning Constants
// Shared constants for forms, dropdowns, and validation

// Curricula Options - Comprehensive list for Kenya's education market
export const CURRICULA_OPTIONS = [
  "CBC (Competency-Based Curriculum)",
  "8-4-4 (KCPE/KCSE)",
  "Cambridge IGCSE / A-Levels",
  "British National Curriculum",
  "Edexcel IGCSE / A-Levels",
  "International Baccalaureate (IB)",
  "American Curriculum (SAT/AP/ACT)",
  "Montessori (Early Years)",
  "ACE (Accelerated Christian Education)",
  "Islamic Integrated Education",
  "Indian Curriculum (CBSE/ICSE)",
  "French Curriculum (AEFE)",
  "German Curriculum (Abitur)"
] as const

// Curricula options for forms (with value/label structure)
export const CURRICULA_FORM_OPTIONS = CURRICULA_OPTIONS.map(curriculum => ({
  value: curriculum,
  label: curriculum,
  description: getCurriculumDescription(curriculum)
}))

// Helper function to get curriculum descriptions
function getCurriculumDescription(curriculum: string): string {
  const descriptions: Record<string, string> = {
    "CBC (Competency-Based Curriculum)": "Kenya's new competency-based education system",
    "8-4-4 (KCPE/KCSE)": "Kenya's traditional 8-4-4 education system",
    "Cambridge IGCSE / A-Levels": "International qualifications from Cambridge Assessment",
    "British National Curriculum": "UK's national curriculum framework",
    "Edexcel IGCSE / A-Levels": "International qualifications from Pearson Edexcel",
    "International Baccalaureate (IB)": "International education program",
    "American Curriculum (SAT/AP/ACT)": "US-based education system and assessments",
    "Montessori (Early Years)": "Child-centered educational approach",
    "ACE (Accelerated Christian Education)": "Christian-based educational system",
    "Islamic Integrated Education": "Education combining Islamic and secular subjects",
    "Indian Curriculum (CBSE/ICSE)": "Indian education systems",
    "French Curriculum (AEFE)": "French education system for international students",
    "German Curriculum (Abitur)": "German education system leading to Abitur"
  }
  return descriptions[curriculum] || "Educational curriculum"
}

// Common Subjects
export const SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'French',
  'German',
  'Spanish',
  'Kiswahili',
  'Religious Studies',
  'Business Studies',
  'Economics',
  'Social Studies'
] as const

// Grade Levels
export const GRADE_LEVELS = [
  'Pre-Primary (3-5 years)',
  'Grade 1-3',
  'Grade 4-6',
  'Grade 7-9',
  'Grade 10-12',
  'A-Levels',
  'University Level'
] as const

// Teaching Modes
export const TEACHING_MODES = [
  { value: 'in_home', label: 'In-Home', description: 'Teacher comes to your home' },
  { value: 'online', label: 'Online', description: 'Virtual lessons via video call' },
  { value: 'hybrid', label: 'Hybrid', description: 'Mix of in-home and online' }
] as const

// Availability Options
export const AVAILABILITY_OPTIONS = [
  'Early Morning (6-8 AM)',
  'Morning (8-12 PM)',
  'Afternoon (12-4 PM)',
  'Evening (4-8 PM)',
  'Night (8-10 PM)',
  'Weekends',
  'Holidays'
] as const

// Hourly Rate Ranges
export const HOURLY_RATE_RANGES = [
  'KES 1,000 - 2,000',
  'KES 2,000 - 3,000',
  'KES 3,000 - 4,000',
  'KES 4,000 - 5,000',
  'KES 5,000+',
  'Negotiable'
] as const

// Budget Bands for Parents
export const BUDGET_BANDS = [
  'KES 1,000 - 2,000 per hour',
  'KES 2,000 - 3,000 per hour',
  'KES 3,000 - 4,000 per hour',
  'KES 4,000 - 5,000 per hour',
  'KES 5,000+ per hour',
  'Flexible budget'
] as const

// Common Locations in Nairobi
export const NAIROBI_LOCATIONS = [
  'Westlands',
  'Karen',
  'Runda',
  'Kilimani',
  'Kileleshwa',
  'Lavington',
  'Parklands',
  'Eastleigh',
  'South B',
  'South C',
  'Langata',
  'Kasarani',
  'Ruaraka',
  'Embakasi',
  'Online Only',
  'Other'
] as const

// Contact Methods
export const CONTACT_METHODS = [
  { value: 'email', label: 'Email', description: 'Contact via email' },
  { value: 'phone', label: 'Phone', description: 'Contact via phone call' },
  { value: 'whatsapp', label: 'WhatsApp', description: 'Contact via WhatsApp' }
] as const

// Application Status
export const APPLICATION_STATUS = [
  'pending',
  'under_review',
  'approved',
  'rejected',
  'suspended'
] as const

// Lead Status
export const LEAD_STATUS = [
  'new',
  'shortlisted',
  'matched',
  'closed'
] as const

// Match Status
export const MATCH_STATUS = [
  'suggested',
  'sent',
  'accepted',
  'declined'
] as const

// User Roles
export const USER_ROLES = [
  'parent',
  'teacher',
  'admin'
] as const

// Document Types
export const DOCUMENT_TYPES = [
  'tscCertificate',
  'cv',
  'profilePhoto',
  'otherDocuments'
] as const

// Type exports for TypeScript
export type Curriculum = typeof CURRICULA_OPTIONS[number]
export type Subject = typeof SUBJECTS[number]
export type GradeLevel = typeof GRADE_LEVELS[number]
export type TeachingMode = typeof TEACHING_MODES[number]['value']
export type AvailabilityOption = typeof AVAILABILITY_OPTIONS[number]
export type HourlyRateRange = typeof HOURLY_RATE_RANGES[number]
export type BudgetBand = typeof BUDGET_BANDS[number]
export type NairobiLocation = typeof NAIROBI_LOCATIONS[number]
export type ContactMethod = typeof CONTACT_METHODS[number]['value']
export type ApplicationStatus = typeof APPLICATION_STATUS[number]
export type LeadStatus = typeof LEAD_STATUS[number]
export type MatchStatus = typeof MATCH_STATUS[number]
export type UserRole = typeof USER_ROLES[number]
export type DocumentType = typeof DOCUMENT_TYPES[number]
