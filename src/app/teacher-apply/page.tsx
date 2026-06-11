'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { submitProvisionalApplication, sendApplicationMagicLink } from '@/lib/teacher-application-actions'
import DuplicateApplicationModal from '@/components/DuplicateApplicationModal'
import { CURRICULA_OPTIONS } from '@/lib/constants'
import { 
  User,  Mail, Phone, MapPin, 
  BookOpen, 
  GraduationCap, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Camera,
  Award,
  Clock,
  Star,
  Sparkles,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  Plus,
  Eye,
  DollarSign,
  Shield
} from 'lucide-react'

interface TeacherApplicationData {
  // Personal Information
  fullName: string
  email: string
  phone: string
  location: string
  gender: string
  dateOfBirth: string
  
  // Professional Information
  subjects: string[]
  curricula: string[]
  gradeLevels: string[]
  experienceYears: number
  educationBackground: string
  teachingPhilosophy: string
  
  // Availability & Preferences
  availability: string[]
  hourlyRateRange: string
  tscNumber: string
  
  // Documents
  documents: {
    cv?: File
    profilePhoto?: File
    tscCertificate?: File
    educationCertificate?: File
  }
}

interface ValidationErrors {
  [key: string]: string
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User, description: 'Basic information' },
  { id: 2, title: 'Professional', icon: BookOpen, description: 'Teaching details' },
  { id: 3, title: 'Documents', icon: Upload, description: 'Upload files' },
  { id: 4, title: 'Review', icon: Eye, description: 'Preview & submit' },
]

const subjects = [
  'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education',
  'French', 'German', 'Spanish', 'Kiswahili', 'Religious Studies', 'Business Studies'
]

const curricula = CURRICULA_OPTIONS

const gradeLevels = [
  'Pre-Primary (3-5 years)', 'Grade 1-3', 'Grade 4-6', 'Grade 7-9', 
  'Grade 10-12', 'A-Levels', 'University Level'
]

const availabilityOptions = [
  'Early Morning (6-8 AM)', 'Morning (8-12 PM)', 'Afternoon (12-4 PM)',
  'Evening (4-8 PM)', 'Night (8-10 PM)', 'Weekends', 'Holidays'
]

const hourlyRateRanges = [
  'KES 1,000 - 2,000', 'KES 2,000 - 3,000', 'KES 3,000 - 4,000',
  'KES 4,000 - 5,000', 'KES 5,000+', 'Negotiable'
]

export default function TeacherApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [editingStep, setEditingStep] = useState<number | null>(null)
  
  // Duplicate application handling
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [duplicateApplicationData, setDuplicateApplicationData] = useState<any>(null)
  
  const [formData, setFormData] = useState<TeacherApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    gender: '',
    dateOfBirth: '',
    subjects: [],
    curricula: [],
    gradeLevels: [],
    experienceYears: 0,
    educationBackground: '',
    teachingPhilosophy: '',
    availability: [],
    hourlyRateRange: '',
    tscNumber: '',
    documents: {}
  })

  const router = useRouter()

  // Mandatory fields for each step
  const mandatoryFields = {
    1: ['fullName', 'email', 'phone', 'location', 'gender', 'dateOfBirth'],
    2: ['subjects', 'curricula', 'gradeLevels', 'experienceYears', 'educationBackground', 'teachingPhilosophy', 'availability'],
    3: ['documents.cv', 'documents.profilePhoto', 'documents.educationCertificate'],
    4: [] // Review step - no mandatory fields
  }

  // Validate current step
  const validateStep = useCallback((step: number): boolean => {
    const errors: ValidationErrors = {}
    const fields = mandatoryFields[step as keyof typeof mandatoryFields] || []

    fields.forEach(field => {
      if (field.includes('.')) {
        // Handle nested fields like documents.cv
        const [parent, child] = field.split('.')
        const parentObj = formData[parent as keyof TeacherApplicationData] as Record<string, any>
        if (!parentObj?.[child]) {
          errors[field] = 'This field is required'
        }
      } else {
        const value = formData[field as keyof TeacherApplicationData]
        if (Array.isArray(value)) {
          if (value.length === 0) {
            errors[field] = 'Please select at least one option'
          }
        } else if (typeof value === 'string') {
          if (!value.trim()) {
            errors[field] = 'This field is required'
          }
        } else if (typeof value === 'number') {
          if (value <= 0) {
            errors[field] = 'Please enter a valid number'
          }
        }
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [formData])

  // Check if step can be accessed
  const canAccessStep = useCallback((step: number): boolean => {
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) {
        return false
      }
    }
    return true
  }, [validateStep])

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
      setValidationErrors({})
    }
  }, [currentStep, validateStep])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setValidationErrors({})
  }, [])

  const goToStep = useCallback((step: number) => {
    if (canAccessStep(step)) {
      setCurrentStep(step)
      setEditingStep(null)
      setValidationErrors({})
    }
  }, [canAccessStep])

  const updateFormData = useCallback((field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
    setFormData(prev => ({
      ...prev,
        [parent]: {
          ...(prev[parent as keyof TeacherApplicationData] as Record<string, any>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }, [])

  const handleFileUpload = useCallback((type: keyof TeacherApplicationData['documents'], file: File) => {
    updateFormData(`documents.${type}`, file)
  }, [updateFormData])

  const removeFile = useCallback((type: keyof TeacherApplicationData['documents']) => {
    updateFormData(`documents.${type}`, undefined)
  }, [updateFormData])

  // Duplicate application handlers
  const handleSignIn = () => {
    router.push(`/signin?email=${encodeURIComponent(formData.email)}`)
    setShowDuplicateModal(false)
  }

  const checkEmailExists = async () => {
    if (!formData.email) {
      setError('Please enter an email address first')
      return
    }

    try {
      const response = await fetch('/api/duplicate-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          action: 'check-user'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setDuplicateApplicationData({
          existingApplication: result.data.teacherApplication
        })
        setShowDuplicateModal(true)
      } else {
        alert('No existing application found for this email.')
      }
    } catch (error) {
      console.error('Error checking email:', error)
      alert('Error checking email. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please complete all required fields before submitting')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      // Create FormData for submission
      const formDataToSubmit = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'documents') {
          const documents = value as TeacherApplicationData['documents']
          Object.entries(documents).forEach(([docType, file]) => {
            if (file && file instanceof File) {
              // @ts-ignore - TypeScript issue with FormData.append and File types
              formDataToSubmit.append(`documents.${docType}`, file)
            }
          })
        } else if (Array.isArray(value)) {
          formDataToSubmit.append(key, JSON.stringify(value))
        } else if (value !== undefined && value !== null && value !== '') {
          const stringValue = String(value)
          if (stringValue) {
            formDataToSubmit.append(key, stringValue)
          }
        }
      })

      // Submit provisional application
      const result = await submitProvisionalApplication(formDataToSubmit)
      
      if (result.success) {
        // Send magic link for account creation
        const magicLinkResult = await sendApplicationMagicLink(result.email!, result.applicationId!)
        
        if (magicLinkResult.success) {
          // Show success message and redirect
          setSubmittedEmail(result.email!)
          setShowAccountModal(true)
        } else {
          setError('Application submitted but failed to send verification email. Please contact support.')
        }
      } else {
        // Check if it's a duplicate application error
        if (result.error === 'DUPLICATE_APPLICATION' && result.data) {
          setError('') // Clear any existing errors
          setDuplicateApplicationData(result.data)
          setShowDuplicateModal(true)
        } else {
          setError(result.error || 'Failed to submit application')
        }
      }
    } catch (err: any) {
      console.error('Submission error:', err)
      if (err.message && err.message.includes('DUPLICATE_APPLICATION')) {
        // Handle duplicate application error from API
        setError('') // Clear any existing errors
        setDuplicateApplicationData({
          existingApplication: {
            id: 'existing',
            fullName: 'Unknown',
            email: formData.email,
            status: 'pending',
            applicationDate: new Date().toISOString()
          },
          options: {
            canSignIn: true,
            canResetPassword: true,
            canViewStatus: true
          }
        })
        setShowDuplicateModal(true)
      } else if (err.message && err.message.includes('email_exists')) {
        // Handle Supabase auth error
        setError('') // Clear any existing errors
        setDuplicateApplicationData({
          existingApplication: {
            id: 'existing',
            fullName: 'Unknown',
            email: formData.email,
            status: 'pending',
            applicationDate: new Date().toISOString()
          },
          options: {
            canSignIn: true,
            canResetPassword: true,
            canViewStatus: true
          }
        })
        setShowDuplicateModal(true)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} errors={validationErrors} checkEmailExists={checkEmailExists} />
      case 2:
        return <ProfessionalInfoStep formData={formData} updateFormData={updateFormData} errors={validationErrors} />
      case 3:
        return <DocumentsStep formData={formData} handleFileUpload={handleFileUpload} removeFile={removeFile} errors={validationErrors} />
      case 4:
        return <ReviewStep formData={formData} onEdit={setEditingStep} />
      default:
        return null
    }
  }, [currentStep, formData, updateFormData, validationErrors, handleFileUpload, removeFile])

  // Memoize step accessibility to prevent re-renders
  const stepAccessibility = useMemo(() => {
    return steps.map(step => ({
      ...step,
      isAccessible: canAccessStep(step.id)
    }))
  }, [canAccessStep])

        return (
    <div className="min-h-screen bg-ivory">
      <section className="relative bg-ink text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,162,39,0.18),transparent)]" />
        <div className="container-custom relative pt-28 pb-12 lg:pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <GraduationCap className="h-4 w-4" />
            TSC-Certified Applicants Only
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight max-w-3xl mx-auto">
            Join Nairobi&apos;s premier teaching faculty
          </h1>
          <p className="mt-4 text-white/70 max-w-xl mx-auto leading-relaxed">
            Apply to teach with Nelimac Learning. Connect with discerning families, set your own schedule, and earn competitive rates.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: DollarSign, title: 'Competitive Rates', desc: 'KSh 1,500 – 3,000/hr' },
              { icon: Clock, title: 'Flexible Schedule', desc: 'Choose your hours' },
              { icon: Shield, title: 'Secure Platform', desc: 'Guaranteed payments' },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <item.icon className="h-5 w-5 text-gold-400 mx-auto mb-2" />
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-white/50 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="teacher-matching-form" className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {stepAccessibility.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const isAccessible = step.isAccessible
              
              return (
                <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={!isAccessible}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-gold-500 text-ink shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-sage-500 text-white'
                        : isAccessible
                        ? 'bg-ivory-dark text-ink-muted hover:bg-gold-50'
                        : 'bg-ivory-dark/50 text-ink-muted/50 cursor-not-allowed'
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="mt-2 text-center px-1">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-gold-600' : isCompleted ? 'text-green-600' : 'text-ink-muted'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-ink-muted/60 hidden sm:block">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block absolute top-4 sm:top-5 md:top-6 left-1/2 w-full h-0.5 -z-10 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{ transform: 'translateX(50%)' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
          <motion.div
          key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-ivory-dark text-ink rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-400 transition-colors text-base"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full text-center"
            >
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-ink mb-2">Application Submitted!</h2>
              <p className="text-sm sm:text-base text-ink-muted mb-4 sm:mb-6">
                We've sent a secure sign-in link to <strong className="break-all">{submittedEmail}</strong>
              </p>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => window.open('mailto:', '_blank')}
                  className="w-full bg-gold-500 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-gold-400 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Open Email App</span>
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-ivory-dark text-ink py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  Return to Home
                </button>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted mt-3 sm:mt-4">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate Application Modal */}
        {showDuplicateModal && duplicateApplicationData && (
          <DuplicateApplicationModal
            isOpen={showDuplicateModal}
            onCloseAction={() => setShowDuplicateModal(false)}
            existingApplication={duplicateApplicationData.existingApplication}
            onSignInAction={handleSignIn}
          />
        )}
    </div>
  )
}

// Step Components
function PersonalInfoStep({ formData, updateFormData, errors, checkEmailExists }: any) {
  const handleInputChange = useCallback((field: string, value: string) => {
    updateFormData(field, value)
  }, [updateFormData])

  const handleFileChange = useCallback((file: File | null) => {
    updateFormData('documents.profilePhoto', file)
  }, [updateFormData])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-ink mb-1 sm:mb-2">Personal Information</h2>
        <p className="text-sm sm:text-base text-ink-muted">Tell us about yourself</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center mb-6 sm:mb-8">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-ink/10 overflow-hidden bg-ivory-dark flex items-center justify-center">
            {formData.documents?.profilePhoto ? (
              <img
                src={URL.createObjectURL(formData.documents.profilePhoto)}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-ink-muted/60" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-gold-500 text-white rounded-full p-2 cursor-pointer hover:bg-gold-400 transition-colors">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-ink-muted mt-2 text-center">
          Upload a clear profile photo<br />
          <span className="text-xs text-ink-muted">JPG, PNG (max 5MB)</span>
        </p>
        {errors['documents.profilePhoto'] && (
          <p className="text-red-500 text-sm mt-1">{errors['documents.profilePhoto']}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
            Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-base ${
              errors.fullName ? 'border-red-500' : 'border-ink/10'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
            Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-base ${
                      errors.email ? 'border-red-500' : 'border-ink/10'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  <button
                    type="button"
                    onClick={() => checkEmailExists()}
                    disabled={!formData.email}
                    className="px-4 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-base transition-colors whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                <p className="text-xs text-ink-muted mt-1">Check if you already have an application</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
            Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-base ${
              errors.phone ? 'border-red-500' : 'border-ink/10'
            }`}
            placeholder="+254 700 000 000"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
            Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-base ${
              errors.location ? 'border-red-500' : 'border-ink/10'
            }`}
                  placeholder="e.g., Westlands, Nairobi"
                />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-base ${
              errors.gender ? 'border-red-500' : 'border-ink/10'
            }`}
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Rather not say">Rather not say</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-base ${
              errors.dateOfBirth ? 'border-red-500' : 'border-ink/10'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>
      </div>
    </div>
  )
}

function ProfessionalInfoStep({ formData, updateFormData, errors }: any) {
  const toggleArrayValue = useCallback((field: string, value: string) => {
    const currentArray = formData[field] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value]
    updateFormData(field, newArray)
  }, [formData, updateFormData])

  const handleInputChange = useCallback((field: string, value: string | number) => {
    updateFormData(field, value)
  }, [updateFormData])

  const handleTextareaChange = useCallback((field: string, value: string) => {
    updateFormData(field, value)
  }, [updateFormData])

        return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-ink mb-1 sm:mb-2">Professional Information</h2>
        <p className="text-sm sm:text-base text-ink-muted">Tell us about your teaching experience</p>
            </div>

      {/* Subjects */}
              <div>
        <label className="block text-sm font-medium text-ink mb-2 sm:mb-3">
          Subjects You Teach <span className="text-red-500">*</span>
                </label>
        
        {/* Mobile Dropdown */}
        <div className="sm:hidden mb-3">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleArrayValue('subjects', e.target.value)
                e.target.value = ''
              }
            }}
            className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-sm"
          >
            <option value="">Add a subject...</option>
            {subjects.filter(subject => !formData.subjects.includes(subject)).map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        {/* Selected Subjects */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.subjects.map((subject: string) => (
            <span key={subject} className="inline-flex items-center px-2 py-1 bg-gold-50 text-gold-800 rounded text-xs sm:text-sm">
              {subject}
              <button
                onClick={() => toggleArrayValue('subjects', subject)}
                className="ml-1 text-gold-600 hover:text-gold-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {subjects.map((subject) => (
                    <button
                      key={subject}
                      type="button"
              onClick={() => toggleArrayValue('subjects', subject)}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                        formData.subjects.includes(subject)
                  ? 'bg-gold-500 text-white border-blue-600'
                  : 'bg-white text-ink border-ink/10 hover:border-gold-500'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
        {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
              </div>

      {/* Curricula */}
              <div>
        <label className="block text-sm font-medium text-ink mb-2 sm:mb-3">
          Curricula You Teach <span className="text-red-500">*</span>
                </label>
        
        {/* Mobile Dropdown */}
        <div className="sm:hidden mb-3">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleArrayValue('curricula', e.target.value)
                e.target.value = ''
              }
            }}
            className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-sm"
          >
            <option value="">Add a curriculum...</option>
            {curricula.filter(curriculum => !formData.curricula.includes(curriculum)).map(curriculum => (
              <option key={curriculum} value={curriculum}>{curriculum}</option>
            ))}
          </select>
        </div>
        
        {/* Selected Curricula */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.curricula.map((curriculum: string) => (
            <span key={curriculum} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs sm:text-sm">
              {curriculum}
              <button
                onClick={() => toggleArrayValue('curricula', curriculum)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {curricula.map((curriculum) => (
                    <button
                      key={curriculum}
                      type="button"
              onClick={() => toggleArrayValue('curricula', curriculum)}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                        formData.curricula.includes(curriculum)
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-ink border-ink/10 hover:border-green-500'
                      }`}
                    >
                      {curriculum}
                    </button>
                  ))}
                </div>
        {errors.curricula && <p className="text-red-500 text-sm mt-1">{errors.curricula}</p>}
              </div>

      {/* Grade Levels */}
              <div>
        <label className="block text-sm font-medium text-ink mb-2 sm:mb-3">
          Grade Levels <span className="text-red-500">*</span>
                </label>
        
        {/* Mobile Dropdown */}
        <div className="sm:hidden mb-3">
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleArrayValue('gradeLevels', e.target.value)
                e.target.value = ''
              }
            }}
            className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent text-sm"
          >
            <option value="">Add a grade level...</option>
            {gradeLevels.filter(level => !formData.gradeLevels.includes(level)).map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        
        {/* Selected Grade Levels */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.gradeLevels.map((level: string) => (
            <span key={level} className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs sm:text-sm">
              {level}
              <button
                onClick={() => toggleArrayValue('gradeLevels', level)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        
        {/* Desktop Grid */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {gradeLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
              onClick={() => toggleArrayValue('gradeLevels', level)}
              className={`p-2 sm:p-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                        formData.gradeLevels.includes(level)
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-ink border-ink/10 hover:border-purple-500'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
        {errors.gradeLevels && <p className="text-red-500 text-sm mt-1">{errors.gradeLevels}</p>}
              </div>

      {/* Experience Years */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
          Years of Teaching Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
          onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent ${
            errors.experienceYears ? 'border-red-500' : 'border-ink/10'
          }`}
          placeholder="Enter years of experience"
        />
        {errors.experienceYears && <p className="text-red-500 text-sm mt-1">{errors.experienceYears}</p>}
                </div>

      {/* Education Background */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
          Education Background <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.educationBackground}
          onChange={(e) => handleTextareaChange('educationBackground', e.target.value)}
                  rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent ${
            errors.educationBackground ? 'border-red-500' : 'border-ink/10'
          }`}
                  placeholder="Describe your educational qualifications..."
                />
        {errors.educationBackground && <p className="text-red-500 text-sm mt-1">{errors.educationBackground}</p>}
              </div>

      {/* Teaching Philosophy */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
          Teaching Philosophy <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.teachingPhilosophy}
          onChange={(e) => handleTextareaChange('teachingPhilosophy', e.target.value)}
                  rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent ${
            errors.teachingPhilosophy ? 'border-red-500' : 'border-ink/10'
          }`}
          placeholder="Describe your approach to teaching..."
        />
        {errors.teachingPhilosophy && <p className="text-red-500 text-sm mt-1">{errors.teachingPhilosophy}</p>}
              </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-ink mb-3">
          Availability <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availabilityOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleArrayValue('availability', option)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                formData.availability.includes(option)
                  ? 'bg-yellow-600 text-white border-yellow-600'
                  : 'bg-white text-ink border-ink/10 hover:border-yellow-500'
              }`}
            >
              {option}
            </button>
          ))}
            </div>
        {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
            </div>

      {/* Hourly Rate Range */}
              <div>
                <label className="block text-sm font-medium text-ink mb-3">
          Expected Hourly Rate Range <span className="text-ink-muted/60">(Optional)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {hourlyRateRanges.map((rate) => (
                    <button
              key={rate}
                      type="button"
              onClick={() => handleInputChange('hourlyRateRange', rate)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                formData.hourlyRateRange === rate
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-ink border-ink/10 hover:border-indigo-500'
              }`}
            >
              {rate}
                    </button>
                  ))}
                </div>
              </div>

      {/* TSC Number */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
          TSC Number <span className="text-ink-muted/60">(Optional)</span>
                </label>
        <input
          type="text"
          value={formData.tscNumber}
          onChange={(e) => handleInputChange('tscNumber', e.target.value)}
          className="w-full px-4 py-3 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
          placeholder="TSC/12345/2020"
        />
              </div>
            </div>
  )
}

function DocumentsStep({ formData, handleFileUpload, removeFile, errors }: any) {
  const documentTypes = [
    { key: 'cv', label: 'CV/Resume', required: true, icon: FileText },
    { key: 'profilePhoto', label: 'Profile Photo', required: true, icon: Camera },
    { key: 'educationCertificate', label: 'Education Certificate', required: true, icon: GraduationCap },
    { key: 'tscCertificate', label: 'TSC Certificate', required: false, icon: Award }
  ]

  const handleFileChange = useCallback((docType: string, file: File | undefined) => {
    if (file) {
      handleFileUpload(docType, file)
    }
  }, [handleFileUpload])

        return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-ink mb-1 sm:mb-2">Document Upload</h2>
        <p className="text-sm sm:text-base text-ink-muted">Upload your professional documents</p>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {documentTypes.map((doc) => {
          const Icon = doc.icon
          const file = formData.documents[doc.key]
          const errorKey = `documents.${doc.key}`
          
          return (
            <div key={doc.key} className="border border-ink/10 rounded-lg p-4 sm:p-6">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-ink-muted" />
              <div>
                  <h3 className="font-medium text-ink text-sm sm:text-base">{doc.label}</h3>
                  <p className="text-xs sm:text-sm text-ink-muted">
                    {doc.required ? 'Required' : 'Optional'}
                  </p>
                </div>
              </div>

              {file ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-600" />
              <div>
                        <p className="text-sm font-medium text-green-900">{file.name}</p>
                        <p className="text-xs text-green-700">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                  </div>
                  </div>
                    <button
                      onClick={() => removeFile(doc.key)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept={doc.key === 'profilePhoto' ? 'image/*' : '.pdf,.doc,.docx'}
                    onChange={(e) => handleFileChange(doc.key, e.target.files?.[0])}
                    className="hidden"
                    id={`file-${doc.key}`}
                  />
                  <label
                    htmlFor={`file-${doc.key}`}
                    className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-ink/10 rounded-lg cursor-pointer hover:border-gold-500 transition-colors"
                  >
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-ink-muted/60 mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-ink-muted">Click to upload</p>
                    <p className="text-xs text-ink-muted/60">
                      {doc.key === 'profilePhoto' ? 'JPG, PNG (max 5MB)' : 'PDF, DOC (max 10MB)'}
                    </p>
                  </label>
                </div>
              )}

              {errors[errorKey] && (
                <p className="text-red-500 text-sm mt-1">{errors[errorKey]}</p>
              )}
                </div>
          )
        })}
              </div>
            </div>
  )
}

function ReviewStep({ formData, onEdit }: any) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-6 sm:mb-8">
        <Eye className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gold-600 mx-auto mb-3 sm:mb-4" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-ink mb-1 sm:mb-2">Review Your Application</h2>
        <p className="text-sm sm:text-base text-ink-muted">Please review all information before submitting</p>
              </div>

      {/* Personal Information */}
      <div className="bg-ivory rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-ink flex items-center space-x-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Personal Information</span>
          </h3>
            <button
            onClick={() => onEdit(1)}
            className="flex items-center space-x-1 text-gold-600 hover:text-gold-800 text-sm sm:text-base"
            >
            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Edit</span>
            </button>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <p className="text-sm text-ink-muted">Full Name</p>
            <p className="font-medium">{formData.fullName}</p>
        </div>
          <div>
            <p className="text-sm text-ink-muted">Email</p>
            <p className="font-medium">{formData.email}</p>
      </div>
          <div>
            <p className="text-sm text-ink-muted">Phone</p>
            <p className="font-medium">{formData.phone}</p>
                  </div>
          <div>
            <p className="text-sm text-ink-muted">Location</p>
            <p className="font-medium">{formData.location}</p>
                  </div>
          <div>
            <p className="text-sm text-ink-muted">Gender</p>
            <p className="font-medium">{formData.gender}</p>
                </div>
          <div>
            <p className="text-sm text-ink-muted">Date of Birth</p>
            <p className="font-medium">{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
        </div>
      </div>

        {/* Profile Photo Preview */}
        {formData.documents?.profilePhoto && (
          <div className="mt-4">
            <p className="text-sm text-ink-muted mb-2">Profile Photo</p>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-ink/10">
              <img
                src={URL.createObjectURL(formData.documents.profilePhoto)}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
                    </div>
                      </div>
                    )}
                  </div>

      {/* Professional Information */}
      <div className="bg-ivory rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Professional Information</span>
          </h3>
                <button
            onClick={() => onEdit(2)}
            className="flex items-center space-x-1 text-gold-600 hover:text-gold-800"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
                </button>
          </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-muted mb-1">Subjects</p>
            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((subject: string) => (
                <span key={subject} className="px-2 py-1 bg-gold-50 text-gold-800 rounded text-sm">
                  {subject}
                </span>
              ))}
        </div>
      </div>
          <div>
            <p className="text-sm text-ink-muted mb-1">Curricula</p>
            <div className="flex flex-wrap gap-2">
              {formData.curricula.map((curriculum: string) => (
                <span key={curriculum} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  {curriculum}
                </span>
              ))}
                </div>
              </div>
          <div>
            <p className="text-sm text-ink-muted mb-1">Grade Levels</p>
            <div className="flex flex-wrap gap-2">
              {formData.gradeLevels.map((level: string) => (
                <span key={level} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                  {level}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-ink-muted">Experience</p>
              <p className="font-medium">{formData.experienceYears} years</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted">Hourly Rate</p>
              <p className="font-medium">{formData.hourlyRateRange || 'Not specified'}</p>
            </div>
          </div>
          {formData.tscNumber && (
            <div>
              <p className="text-sm text-ink-muted">TSC Number</p>
              <p className="font-medium">{formData.tscNumber}</p>
            </div>
          )}
        </div>
              </div>

      {/* Documents */}
      <div className="bg-ivory rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Documents</span>
          </h3>
                <button
            onClick={() => onEdit(3)}
            className="flex items-center space-x-1 text-gold-600 hover:text-gold-800"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
                </button>
              </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.documents)
            .filter(([_, file]) => file)
            .map(([key, file]) => (
              <div key={key} className="flex items-center space-x-3 p-3 bg-white rounded border">
                <FileText className="w-5 h-5 text-ink-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{(file as File).name}</p>
                  <p className="text-xs text-ink-muted">
                    {((file as File).size / 1024 / 1024).toFixed(2)} MB
                  </p>
    </div>
        </div>
            ))}
          </div>
      </div>
    </div>
  )
}