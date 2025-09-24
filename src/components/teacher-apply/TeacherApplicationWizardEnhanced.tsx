'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, Send, User, GraduationCap, FileText, Award, CheckCircle, 
  AlertCircle, BookOpen, ChevronLeft, ChevronRight, Camera, File, 
  X, Eye, Save, EyeIcon, Download, Trash2, RefreshCw, Lock, 
  Shield, Clock, Info, ExternalLink, CheckCircle2, XCircle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeacherApplicationSchema, type TeacherApplicationData } from '@/lib/schemas'

// Enhanced file upload component with drag & drop
interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  file: File | null
  accept: string
  maxSize: number
  label: string
  description?: string
  required?: boolean
  error?: string
}

function FileUpload({ onFileSelect, file, accept, maxSize, label, description, required, error }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.size <= maxSize) {
        simulateUpload(droppedFile)
      }
    }
  }, [maxSize])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size <= maxSize) {
        simulateUpload(selectedFile)
      }
    }
  }, [maxSize])

  const simulateUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          onFileSelect(file)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const removeFile = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : error 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-describedby={description ? `${label}-description` : undefined}
        />
        
        {file ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <File className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={removeFile}
                className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-2">
                <RefreshCw className="h-8 w-8 text-blue-600 mx-auto animate-spin" />
                <p className="text-sm text-gray-600">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  Drag and drop your file here, or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  Max file size: {formatFileSize(maxSize)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced form field component
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  description?: string
}

function FormField({ label, error, required, children, description }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

// Enhanced checkbox group component
interface CheckboxGroupProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  label: string
  error?: string
  required?: boolean
  description?: string
}

function CheckboxGroup({ options, selected, onChange, label, error, required, description }: CheckboxGroupProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, option])
    } else {
      onChange(selected.filter(item => item !== option))
    }
  }

  return (
    <FormField label={label} error={error} required={required} description={description}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={(e) => handleChange(option, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </FormField>
  )
}

export default function TeacherApplicationWizardEnhanced() {
  const curricula = ['CBC', 'IGCSE', 'British Curriculum', 'American Curriculum', 'IB']
  const subjects = [
    'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
    'Social Studies', 'Kiswahili', 'French', 'German', 'Computer Studies',
    'Art', 'Music', 'PE', 'Geography', 'History', 'Economics', 'Business Studies',
    'Religious Education', 'Environmental Science', 'Psychology', 'Sociology'
  ]

  const steps = [
    { id: 1, title: 'Personal Info', icon: User, description: 'Basic information about yourself' },
    { id: 2, title: 'Education', icon: GraduationCap, description: 'Your educational background' },
    { id: 3, title: 'Experience', icon: BookOpen, description: 'Teaching experience and qualifications' },
    { id: 4, title: 'Documents', icon: File, description: 'Required documents and certifications' },
    { id: 5, title: 'Philosophy', icon: FileText, description: 'Your teaching philosophy' },
    { id: 6, title: 'Preview', icon: Eye, description: 'Review your application' }
  ]

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File | null}>({
    tscCertificate: null,
    cv: null,
    profilePhoto: null,
    otherDocuments: null
  })
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'>('draft')
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
    getValues
  } = useForm<TeacherApplicationData>({
    resolver: zodResolver(TeacherApplicationSchema) as any,
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: ''
      },
      education: {
        highestQualification: '',
        institution: ''
      },
      experience: {
        yearsOfExperience: '',
        subjectsTaught: [],
        curriculumExperience: [],
        specializations: []
      },
      availability: {
        onlineTeaching: false
      },
      additionalInfo: {
        teachingPhilosophy: '',
        whyJoinUs: ''
      }
    }
  })

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Auto-save functionality
  const saveToLocalStorage = useCallback(async () => {
    try {
      setAutoSaveStatus('saving')
      const formData = getValues()
      const saveData = {
        formData,
        uploadedFiles: Object.keys(uploadedFiles).reduce((acc, key) => {
          if (uploadedFiles[key]) {
            acc[key] = {
              name: uploadedFiles[key]!.name,
              size: uploadedFiles[key]!.size,
              type: uploadedFiles[key]!.type,
              lastModified: uploadedFiles[key]!.lastModified
            }
          }
          return acc
        }, {} as any),
        timestamp: new Date().toISOString(),
        step: currentStep
      }
      
      localStorage.setItem('teacherApplicationDraft', JSON.stringify(saveData))
      setAutoSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      setAutoSaveStatus('error')
      console.error('Auto-save failed:', error)
    }
  }, [getValues, uploadedFiles, currentStep])

  // Auto-save on form changes
  useEffect(() => {
    const subscription = watch(() => {
      const timeoutId = setTimeout(saveToLocalStorage, 2000)
      return () => clearTimeout(timeoutId)
    })
    return () => subscription.unsubscribe()
  }, [watch, saveToLocalStorage])

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('teacherApplicationDraft')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        if (parsed.formData) {
          Object.keys(parsed.formData).forEach(key => {
            setValue(key as any, parsed.formData[key])
          })
        }
        if (parsed.step) {
          setCurrentStep(parsed.step)
        }
        setLastSaved(new Date(parsed.timestamp))
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [setValue])

  const nextStep = async () => {
    const isValid = await trigger()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: TeacherApplicationData) => {
    setIsSubmitting(true)
    setErrorMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const applicationId = `APP-${Date.now()}`
      setApplicationId(applicationId)
      setSubmitStatus('success')
      setApplicationStatus('submitted')
      
      // Clear saved data
      localStorage.removeItem('teacherApplicationDraft')
      
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (key: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [key]: file }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="Full Name" 
                error={errors.personalInfo?.fullName?.message}
                required
              >
                <input
                  {...register('personalInfo.fullName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </FormField>

              <FormField 
                label="Email Address" 
                error={errors.personalInfo?.email?.message}
                required
              >
                <input
                  {...register('personalInfo.email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </FormField>

              <FormField 
                label="Phone Number" 
                error={errors.personalInfo?.phone?.message}
                required
              >
                <input
                  {...register('personalInfo.phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </FormField>

              <FormField 
                label="Location" 
                error={errors.personalInfo?.location?.message}
                required
              >
                <input
                  {...register('personalInfo.location')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your location"
                />
              </FormField>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="Highest Qualification" 
                error={errors.education?.highestQualification?.message}
                required
              >
                <select
                  {...register('education.highestQualification')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select qualification</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </FormField>

              <FormField 
                label="Institution" 
                error={errors.education?.institution?.message}
                required
              >
                <input
                  {...register('education.institution')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter institution name"
                />
              </FormField>

              <FormField 
                label="TSC Number" 
                error={errors.education?.tscNumber?.message}
                description="Teachers Service Commission registration number"
              >
                <input
                  {...register('education.tscNumber')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter TSC number (optional)"
                />
              </FormField>

              <FormField 
                label="Year of Graduation" 
                error={errors.education?.yearOfGraduation?.message}
              >
                <input
                  {...register('education.yearOfGraduation')}
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter graduation year"
                />
              </FormField>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="Years of Experience" 
                error={errors.experience?.yearsOfExperience?.message}
                required
              >
                <select
                  {...register('experience.yearsOfExperience')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="2-3">2-3 years</option>
                  <option value="4-5">4-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </FormField>

              <FormField 
                label="Previous Schools" 
                error={errors.experience?.previousSchools?.message}
                description="List schools where you've taught (optional)"
              >
                <textarea
                  {...register('experience.previousSchools')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter previous schools"
                />
              </FormField>
            </div>

            <CheckboxGroup
              options={subjects}
              selected={watch('experience.subjectsTaught') || []}
              onChange={(selected) => setValue('experience.subjectsTaught', selected)}
              label="Subjects Taught"
              error={errors.experience?.subjectsTaught?.message}
              required
              description="Select all subjects you can teach"
            />

            <CheckboxGroup
              options={curricula}
              selected={watch('experience.curriculumExperience') || []}
              onChange={(selected) => setValue('experience.curriculumExperience', selected)}
              label="Curriculum Experience"
              error={errors.experience?.curriculumExperience?.message}
              required
              description="Select curricula you have experience with"
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                onFileSelect={(file) => handleFileUpload('tscCertificate', file)}
                file={uploadedFiles.tscCertificate}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5 * 1024 * 1024} // 5MB
                label="TSC Certificate"
                description="Upload your TSC registration certificate"
                required
              />

              <FileUpload
                onFileSelect={(file) => handleFileUpload('cv', file)}
                file={uploadedFiles.cv}
                accept=".pdf,.doc,.docx"
                maxSize={10 * 1024 * 1024} // 10MB
                label="CV/Resume"
                description="Upload your current CV or resume"
                required
              />

              <FileUpload
                onFileSelect={(file) => handleFileUpload('profilePhoto', file)}
                file={uploadedFiles.profilePhoto}
                accept=".jpg,.jpeg,.png"
                maxSize={2 * 1024 * 1024} // 2MB
                label="Profile Photo"
                description="Upload a professional headshot"
              />

              <FileUpload
                onFileSelect={(file) => handleFileUpload('otherDocuments', file)}
                file={uploadedFiles.otherDocuments}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                maxSize={5 * 1024 * 1024} // 5MB
                label="Other Documents"
                description="Any additional certificates or documents"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <FormField 
              label="Teaching Philosophy" 
              error={errors.additionalInfo?.teachingPhilosophy?.message}
              required
              description="Describe your approach to teaching and learning"
            >
              <textarea
                {...register('additionalInfo.teachingPhilosophy')}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your teaching philosophy..."
              />
            </FormField>

            <FormField 
              label="Why Join Us?" 
              error={errors.additionalInfo?.whyJoinUs?.message}
              required
              description="Tell us why you want to join our platform"
            >
              <textarea
                {...register('additionalInfo.whyJoinUs')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Why do you want to join our teaching platform?"
              />
            </FormField>

            <div className="flex items-center space-x-2">
              <input
                {...register('availability.onlineTeaching')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                I am available for online teaching
              </label>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Personal Information</h4>
                  <p className="text-sm text-gray-600">
                    {watch('personalInfo.fullName')} • {watch('personalInfo.email')} • {watch('personalInfo.phone')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Education</h4>
                  <p className="text-sm text-gray-600">
                    {watch('education.highestQualification')} from {watch('education.institution')}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Experience</h4>
                  <p className="text-sm text-gray-600">
                    {watch('experience.yearsOfExperience')} years • {watch('experience.subjectsTaught')?.length} subjects
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Documents</h4>
                  <p className="text-sm text-gray-600">
                    {Object.values(uploadedFiles).filter(Boolean).length} files uploaded
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (submitStatus === 'success') {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your application. We'll review it and get back to you within 5-7 business days.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Application ID:</strong> {applicationId}
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSubmitStatus('idle')
                  setCurrentStep(1)
                  reset()
                  setUploadedFiles({
                    tscCertificate: null,
                    cv: null,
                    profilePhoto: null,
                    otherDocuments: null
                  })
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white" aria-labelledby="application-wizard-heading">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="application-wizard-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Teacher Application
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete the form below to join our team of expert teachers. 
            Your information is automatically saved as you progress.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Auto-save Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Auto-saved</span>
                </>
              )}
              {autoSaveStatus === 'saving' && (
                <>
                  <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm text-blue-600">Saving...</span>
                </>
              )}
              {autoSaveStatus === 'error' && (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Save failed</span>
                </>
              )}
            </div>
            {lastSaved && (
              <span className="text-xs text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-blue-100 text-blue-700'
                      : currentStep > step.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={currentStep < step.id}
                >
                  <step.icon className="h-5 w-5" />
                  <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            key={currentStep}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
            animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
            transition={reducedMotion ? {} : { duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6 md:p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {steps[currentStep - 1]?.title}
              </h3>
              <p className="text-gray-600">
                {steps[currentStep - 1]?.description}
              </p>
            </div>

            {renderStepContent()}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              {currentStep === steps.length ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
