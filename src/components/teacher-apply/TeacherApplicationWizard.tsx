'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Send, User, GraduationCap, FileText, Award, CheckCircle, AlertCircle, BookOpen, ChevronLeft, ChevronRight, Camera, File, X, Eye, Save, EyeIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeacherApplicationSchema, type TeacherApplicationData } from '@/lib/schemas'

export default function TeacherApplicationWizard() {
  const curricula = ['CBC', 'IGCSE', 'British Curriculum']
  const subjects = [
    'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
    'Social Studies', 'Kiswahili', 'French', 'German', 'Computer Studies',
    'Art', 'Music', 'PE', 'Geography', 'History', 'Economics'
  ]

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Education', icon: GraduationCap },
    { id: 3, title: 'Experience', icon: BookOpen },
    { id: 4, title: 'Documents', icon: File },
    { id: 5, title: 'Philosophy', icon: FileText },
    { id: 6, title: 'Preview', icon: Eye }
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
  const [dragActive, setDragActive] = useState<string | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'>('draft')
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

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

  // Auto-save functionality
  const saveToLocalStorage = async () => {
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
        currentStep,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('teacherApplicationDraft', JSON.stringify(saveData))
      setLastSaved(new Date())
      setAutoSaveStatus('saved')
    } catch (error) {
      console.error('Failed to save form data:', error)
      setAutoSaveStatus('error')
    }
  }

  // Load from localStorage on component mount
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
        if (parsed.currentStep) {
          setCurrentStep(parsed.currentStep)
        }
        if (parsed.timestamp) {
          setLastSaved(new Date(parsed.timestamp))
        }
      } catch (error) {
        console.error('Failed to load saved form data:', error)
      }
    }
  }, [setValue])

  // Auto-save on form changes
  useEffect(() => {
    const subscription = watch(() => {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // Auto-save when step changes
  useEffect(() => {
    saveToLocalStorage()
  }, [currentStep])

  const watchedSubjects = watch('experience.subjectsTaught')
  const watchedCurricula = watch('experience.curriculumExperience')

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            if (currentStep > 1) prevStep()
            break
          case 'ArrowRight':
            event.preventDefault()
            if (currentStep < steps.length) nextStep()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, steps.length])

  const onSubmit = async (data: TeacherApplicationData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // First, submit the teacher application
      const response = await fetch('/api/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application')
      }

      setApplicationId(result.id)
      setApplicationStatus('submitted')

      // Upload files if any are selected
      const uploadPromises = []
      const teacherId = result.teacherId || result.data?.teacherId
      
      if (teacherId) {
        for (const [fileType, file] of Object.entries(uploadedFiles)) {
          if (file) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('teacherId', teacherId)
            formData.append('documentType', fileType)

            uploadPromises.push(
              fetch('/api/teachers/upload', {
                method: 'POST',
                body: formData,
              }).then(async (uploadResponse) => {
                if (!uploadResponse.ok) {
                  const errorData = await uploadResponse.json()
                  console.warn(`Failed to upload ${fileType}:`, errorData.error)
                }
                return uploadResponse.json()
              })
            )
          }
        }
      } else {
        console.warn('No teacher ID available for file uploads')
      }

      // Wait for all uploads to complete (don't fail the whole process if uploads fail)
      if (uploadPromises.length > 0) {
        try {
          await Promise.allSettled(uploadPromises)
        } catch (uploadError) {
          console.warn('Some file uploads failed:', uploadError)
        }
      }

      setSubmitStatus('success')
      
      // Clear localStorage after successful submission
      localStorage.removeItem('teacherApplicationDraft')
      
      reset()
    } catch (error) {
      console.error('Submission error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleEditSection = (stepNumber: number) => {
    setCurrentStep(stepNumber)
  }

  const handleConfirmSubmission = async () => {
    setShowConfirmationDialog(false)
    const formData = getValues()
    await onSubmit(formData)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft'
      case 'submitted': return 'Submitted'
      case 'under_review': return 'Under Review'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return 'Unknown'
    }
  }

  const handleSubjectChange = (subject: string) => {
    const currentSubjects = watchedSubjects || []
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject]
    setValue('experience.subjectsTaught', newSubjects)
  }

  const handleCurriculumChange = (curriculum: string) => {
    const currentCurricula = watchedCurricula || []
    const newCurricula = currentCurricula.includes(curriculum)
      ? currentCurricula.filter(c => c !== curriculum)
      : [...currentCurricula, curriculum]
    setValue('experience.curriculumExperience', newCurricula)
  }

  const handleFileUpload = (fileType: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: file
    }))
  }

  const handleFileRemove = (fileType: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fileType]: null
    }))
  }

  const handleDrag = (e: React.DragEvent, fileType: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(fileType)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, fileType: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(fileType, e.dataTransfer.files[0])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    
    // Only validate if there are fields to validate
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any)
      if (!isValid) {
        return // Don't proceed if validation fails
      }
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['personalInfo.fullName', 'personalInfo.email', 'personalInfo.phone', 'personalInfo.location']
      case 2:
        return ['education.highestQualification', 'education.institution', 'experience.yearsOfExperience']
      case 3:
        return ['experience.curriculumExperience', 'experience.subjectsTaught']
      case 4:
        return [] // Documents step - no form validation needed
      case 5:
        return ['additionalInfo.teachingPhilosophy']
      default:
        return []
    }
  }

  // Success state
  if (submitStatus === 'success') {
    return (
      <section className="section-padding bg-white">
        <div className="container-mobile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8 mb-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="heading-md text-green-800 mb-4">Application Submitted Successfully!</h2>
              <p className="text-luxury text-green-700 mb-6">
                Thank you for your interest in joining our network! We've received your application and will review it within 48 hours.
              </p>
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Application ID:</p>
                <p className="font-mono text-lg font-bold text-gray-800">{applicationId}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254XXXXXXXXX'}?text=Teacher%20Application%20${applicationId}%20submitted`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                >
                  <span className="sm:hidden">WhatsApp</span>
                  <span className="hidden sm:inline">Contact via WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitStatus('idle')
                    setApplicationId(null)
                    setCurrentStep(1)
                  }}
                  className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8 md:mb-12">
            <h2 className="heading-lg mb-4">
              Join Our Teacher Network
            </h2>
            <p className="text-luxury">
              Apply to become part of Nairobi's premier homeschooling network
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 md:mb-12">
            {/* Desktop Progress */}
            <div className="hidden md:flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-sm mt-3 font-medium ${
                    currentStep >= step.id ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Progress */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round((currentStep / steps.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm font-medium text-gray-900">
                  {steps[currentStep - 1]?.title}
                </span>
              </div>
            </div>

            {/* Desktop Progress Bar */}
            <div className="hidden md:block mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            {/* Auto-save Status */}
            <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {autoSaveStatus === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-600 font-medium">Saving...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <Save className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Auto-saved</span>
                    {lastSaved && (
                      <span className="text-xs text-gray-500">
                        {lastSaved.toLocaleTimeString()}
                      </span>
                    )}
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Save failed</span>
                  </>
                )}
              </div>
              <button
                onClick={saveToLocalStorage}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Save now
              </button>
            </div>

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form 
              onSubmit={(e) => {
                // Only allow submission on the final step (preview step)
                if (currentStep !== steps.length) {
                  e.preventDefault()
                  return
                }
                e.preventDefault()
                setShowConfirmationDialog(true)
              }}
              className="space-y-8"
              role="form"
              aria-label="Teacher Application Form"
              aria-describedby="form-description"
            >
              <div id="form-description" className="sr-only">
                Multi-step teacher application form with auto-save functionality. Use Ctrl+Arrow keys to navigate between steps.
              </div>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-6 py-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Tell us about yourself to get started</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Full Name *
                        </label>
                        <div className="relative">
                        <input
                          type="text"
                            {...register('personalInfo.fullName', {
                              onBlur: () => trigger('personalInfo.fullName'),
                              onChange: () => trigger('personalInfo.fullName')
                            })}
                            className={`w-full px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                              errors.personalInfo?.fullName 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                            placeholder="Enter your full name"
                            aria-label="Full Name"
                            aria-required="true"
                            aria-invalid={!!errors.personalInfo?.fullName}
                            aria-describedby={errors.personalInfo?.fullName ? 'fullName-error' : undefined}
                        />
                        {errors.personalInfo?.fullName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                        )}
                      </div>
                        {errors.personalInfo?.fullName && (
                          <p id="fullName-error" className="text-red-500 text-sm flex items-center space-x-1" role="alert">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.personalInfo.fullName.message}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Email Address *
                        </label>
                        <div className="relative">
                        <input
                          type="email"
                            {...register('personalInfo.email', {
                              onBlur: () => trigger('personalInfo.email'),
                              onChange: () => trigger('personalInfo.email')
                            })}
                            className={`w-full px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                              errors.personalInfo?.email 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.personalInfo?.email && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                        )}
                      </div>
                        {errors.personalInfo?.email && (
                          <p className="text-red-500 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.personalInfo.email.message}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Phone Number *
                        </label>
                        <div className="relative">
                        <input
                          type="tel"
                          {...register('personalInfo.phone')}
                            className={`w-full px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                              errors.personalInfo?.phone 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                          placeholder="+254 XXX XXX XXX"
                        />
                        {errors.personalInfo?.phone && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                        )}
                      </div>
                        {errors.personalInfo?.phone && (
                          <p className="text-red-500 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.personalInfo.phone.message}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Location *
                        </label>
                        <div className="relative">
                        <input
                          type="text"
                          {...register('personalInfo.location')}
                            className={`w-full px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 focus:outline-none ${
                              errors.personalInfo?.location 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                            }`}
                            placeholder="Nairobi, Kenya"
                        />
                        {errors.personalInfo?.location && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.personalInfo?.location && (
                          <p className="text-red-500 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.personalInfo.location.message}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Education */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <GraduationCap className="h-6 w-6 mr-3 text-green-600" />
                      Education & Qualifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Highest Qualification *
                        </label>
                        <input
                          type="text"
                          {...register('education.highestQualification')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Bachelor of Education, Master's Degree"
                        />
                        {errors.education?.highestQualification && (
                          <p className="text-red-500 text-sm mt-1">{errors.education.highestQualification.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institution *
                        </label>
                        <input
                          type="text"
                          {...register('education.institution')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="University or College name"
                        />
                        {errors.education?.institution && (
                          <p className="text-red-500 text-sm mt-1">{errors.education.institution.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          TSC Number
                        </label>
                        <input
                          type="text"
                          {...register('education.tscNumber')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="TSC registration number (if applicable)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience *
                        </label>
                        <select
                          {...register('experience.yearsOfExperience')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select years of experience</option>
                          <option value="0-1">0-1 years</option>
                          <option value="2-3">2-3 years</option>
                          <option value="4-5">4-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                        {errors.experience?.yearsOfExperience && (
                          <p className="text-red-500 text-sm mt-1">{errors.experience.yearsOfExperience.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Experience */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                      Teaching Experience
                    </h3>
                    
                    {/* Curriculum Experience */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Experience *</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {curricula.map((curriculum) => (
                          <label key={curriculum} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={watchedCurricula?.includes(curriculum) || false}
                              onChange={() => handleCurriculumChange(curriculum)}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{curriculum}</span>
                          </label>
                        ))}
                      </div>
                      {errors.experience?.curriculumExperience && (
                        <p className="text-red-500 text-sm mt-2">{errors.experience.curriculumExperience.message}</p>
                      )}
                    </div>

                    {/* Subject Expertise */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Subject Expertise *</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {subjects.map((subject) => (
                          <label key={subject} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={watchedSubjects?.includes(subject) || false}
                              onChange={() => handleSubjectChange(subject)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-xs font-medium text-gray-700">{subject}</span>
                          </label>
                        ))}
                      </div>
                      {errors.experience?.subjectsTaught && (
                        <p className="text-red-500 text-sm mt-2">{errors.experience.subjectsTaught.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Documents */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl px-6 py-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                          <File className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Required Documents</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Upload your professional documents to complete your application</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* TSC Certificate */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          TSC Certificate *
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                            dragActive === 'tscCertificate'
                              ? 'border-blue-400 bg-blue-50'
                              : uploadedFiles.tscCertificate
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onDragEnter={(e) => handleDrag(e, 'tscCertificate')}
                          onDragLeave={(e) => handleDrag(e, 'tscCertificate')}
                          onDragOver={(e) => handleDrag(e, 'tscCertificate')}
                          onDrop={(e) => handleDrop(e, 'tscCertificate')}
                        >
                          {uploadedFiles.tscCertificate ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <File className="h-8 w-8 text-green-600" />
                                <span className="font-semibold text-green-700">File Uploaded</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{uploadedFiles.tscCertificate.name}</p>
                              <p className="text-xs text-gray-500 mb-4">{formatFileSize(uploadedFiles.tscCertificate.size)}</p>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove('tscCertificate')}
                                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                  <X className="h-4 w-4 inline mr-1" />
                                  Remove
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-sm text-gray-600 mb-2">Drop your TSC certificate here</p>
                              <p className="text-xs text-gray-500 mb-4">or click to browse</p>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload('tscCertificate', e.target.files[0])}
                                className="hidden"
                                id="tsc-upload"
                              />
                              <label
                                htmlFor="tsc-upload"
                                className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors cursor-pointer"
                              >
                                Choose File
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CV/Resume */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          CV/Resume *
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                            dragActive === 'cv'
                              ? 'border-blue-400 bg-blue-50'
                              : uploadedFiles.cv
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onDragEnter={(e) => handleDrag(e, 'cv')}
                          onDragLeave={(e) => handleDrag(e, 'cv')}
                          onDragOver={(e) => handleDrag(e, 'cv')}
                          onDrop={(e) => handleDrop(e, 'cv')}
                        >
                          {uploadedFiles.cv ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <File className="h-8 w-8 text-green-600" />
                                <span className="font-semibold text-green-700">File Uploaded</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{uploadedFiles.cv.name}</p>
                              <p className="text-xs text-gray-500 mb-4">{formatFileSize(uploadedFiles.cv.size)}</p>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove('cv')}
                                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                  <X className="h-4 w-4 inline mr-1" />
                                  Remove
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-sm text-gray-600 mb-2">Drop your CV here</p>
                              <p className="text-xs text-gray-500 mb-4">or click to browse</p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload('cv', e.target.files[0])}
                                className="hidden"
                                id="cv-upload"
                              />
                              <label
                                htmlFor="cv-upload"
                                className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors cursor-pointer"
                              >
                                Choose File
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profile Photo */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Profile Photo
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                            dragActive === 'profilePhoto'
                              ? 'border-blue-400 bg-blue-50'
                              : uploadedFiles.profilePhoto
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onDragEnter={(e) => handleDrag(e, 'profilePhoto')}
                          onDragLeave={(e) => handleDrag(e, 'profilePhoto')}
                          onDragOver={(e) => handleDrag(e, 'profilePhoto')}
                          onDrop={(e) => handleDrop(e, 'profilePhoto')}
                        >
                          {uploadedFiles.profilePhoto ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <Camera className="h-8 w-8 text-green-600" />
                                <span className="font-semibold text-green-700">Photo Uploaded</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{uploadedFiles.profilePhoto.name}</p>
                              <p className="text-xs text-gray-500 mb-4">{formatFileSize(uploadedFiles.profilePhoto.size)}</p>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove('profilePhoto')}
                                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                  <X className="h-4 w-4 inline mr-1" />
                                  Remove
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-sm text-gray-600 mb-2">Drop your photo here</p>
                              <p className="text-xs text-gray-500 mb-4">or click to browse</p>
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload('profilePhoto', e.target.files[0])}
                                className="hidden"
                                id="photo-upload"
                              />
                              <label
                                htmlFor="photo-upload"
                                className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors cursor-pointer"
                              >
                                Choose Photo
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Other Documents */}
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Other Documents
                        </label>
                        <div
                          className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                            dragActive === 'otherDocuments'
                              ? 'border-blue-400 bg-blue-50'
                              : uploadedFiles.otherDocuments
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onDragEnter={(e) => handleDrag(e, 'otherDocuments')}
                          onDragLeave={(e) => handleDrag(e, 'otherDocuments')}
                          onDragOver={(e) => handleDrag(e, 'otherDocuments')}
                          onDrop={(e) => handleDrop(e, 'otherDocuments')}
                        >
                          {uploadedFiles.otherDocuments ? (
                            <div className="text-center">
                              <div className="flex items-center justify-center space-x-2 mb-2">
                                <File className="h-8 w-8 text-green-600" />
                                <span className="font-semibold text-green-700">File Uploaded</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{uploadedFiles.otherDocuments.name}</p>
                              <p className="text-xs text-gray-500 mb-4">{formatFileSize(uploadedFiles.otherDocuments.size)}</p>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleFileRemove('otherDocuments')}
                                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-600 transition-colors"
                                >
                                  <X className="h-4 w-4 inline mr-1" />
                                  Remove
                                </button>
                                <button
                                  type="button"
                                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                >
                                  <Eye className="h-4 w-4 inline mr-1" />
                                  View
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-sm text-gray-600 mb-2">Drop additional documents here</p>
                              <p className="text-xs text-gray-500 mb-4">or click to browse</p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload('otherDocuments', e.target.files[0])}
                                className="hidden"
                                id="other-upload"
                              />
                              <label
                                htmlFor="other-upload"
                                className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors cursor-pointer"
                              >
                                Choose File
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">i</span>
                          </div>
                        </div>
                    <div>
                          <h4 className="text-sm font-semibold text-blue-900 mb-1">Document Requirements</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• TSC Certificate: PDF, JPG, or PNG format (max 5MB)</li>
                            <li>• CV/Resume: PDF or DOC format (max 10MB)</li>
                            <li>• Profile Photo: JPG or PNG format (max 2MB)</li>
                            <li>• Other Documents: Any supported format (max 10MB)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Philosophy */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl px-6 py-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Teaching Philosophy</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Share your teaching approach and motivation</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                          Describe your teaching philosophy and approach *
                      </label>
                        <div className="relative">
                      <textarea
                        {...register('additionalInfo.teachingPhilosophy')}
                            rows={6}
                            className={`w-full px-4 py-4 bg-white border-2 rounded-xl transition-all duration-200 focus:outline-none resize-none ${
                              errors.additionalInfo?.teachingPhilosophy 
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                            }`}
                            placeholder="Tell us about your teaching style, methods, and educational philosophy. What makes you passionate about teaching? How do you approach different learning styles?"
                          />
                          {errors.additionalInfo?.teachingPhilosophy && (
                            <div className="absolute right-3 top-3">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.additionalInfo?.teachingPhilosophy && (
                          <p className="text-red-500 text-sm flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4" />
                            <span>{errors.additionalInfo.teachingPhilosophy.message}</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-500">Minimum 100 characters</p>
                    </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                        What interests you about joining Patience Education Collective?
                      </label>
                        <div className="relative">
                      <textarea
                        {...register('additionalInfo.whyJoinUs')}
                            rows={4}
                            className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-indigo-100 resize-none"
                            placeholder="Share what attracts you to our homeschooling network. What do you hope to achieve as part of our community?"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Optional but recommended</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-900 mb-2">Tips for a Great Application</h4>
                          <ul className="text-sm text-indigo-800 space-y-1">
                            <li>• Be specific about your teaching methods and experiences</li>
                            <li>• Highlight your passion for education and student success</li>
                            <li>• Mention any specializations or unique approaches you bring</li>
                            <li>• Show enthusiasm for working with homeschooling families</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Preview */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-6 py-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Review Your Application</h3>
                      </div>
                      <p className="text-gray-600 text-sm">Please review all information before submitting your application</p>
                    </div>

                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-600" />
                            Personal Information
                          </h4>
                          <button
                            onClick={() => handleEditSection(1)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium text-gray-600">Name:</span> {getValues('personalInfo.fullName') || 'Not provided'}</div>
                          <div><span className="font-medium text-gray-600">Email:</span> {getValues('personalInfo.email') || 'Not provided'}</div>
                          <div><span className="font-medium text-gray-600">Phone:</span> {getValues('personalInfo.phone') || 'Not provided'}</div>
                          <div><span className="font-medium text-gray-600">Location:</span> {getValues('personalInfo.location') || 'Not provided'}</div>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
                            Education & Qualifications
                          </h4>
                          <button
                            onClick={() => handleEditSection(2)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><span className="font-medium text-gray-600">Qualification:</span> {getValues('education.highestQualification') || 'Not provided'}</div>
                          <div><span className="font-medium text-gray-600">Institution:</span> {getValues('education.institution') || 'Not provided'}</div>
                          <div><span className="font-medium text-gray-600">TSC Number:</span> {getValues('education.tscNumber') || 'Not provided'}</div>
                          <div><span className="font-medium text-gray-600">Experience:</span> {getValues('experience.yearsOfExperience') || 'Not provided'} years</div>
                        </div>
                      </div>

                      {/* Experience */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                            Teaching Experience
                          </h4>
                          <button
                            onClick={() => handleEditSection(3)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Curriculum Experience:</span>
                            <div className="mt-1">
                              {getValues('experience.curriculumExperience')?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {getValues('experience.curriculumExperience')?.map((curriculum, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                      {curriculum}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500">None selected</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Subject Expertise:</span>
                            <div className="mt-1">
                              {getValues('experience.subjectsTaught')?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {getValues('experience.subjectsTaught')?.map((subject, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500">None selected</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Teaching Mode:</span>
                            <span className="ml-2">{getValues('availability.onlineTeaching') ? 'Online' : 'In-person'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <File className="h-5 w-5 mr-2 text-orange-600" />
                            Documents
                          </h4>
                          <button
                            onClick={() => handleEditSection(4)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {Object.entries(uploadedFiles).map(([key, file]) => (
                            <div key={key} className="flex items-center space-x-3">
                              <File className="h-4 w-4 text-gray-500" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-gray-500">
                                  {file ? `${file.name} (${formatFileSize(file.size)})` : 'Not uploaded'}
                                </div>
                              </div>
                              {file && (
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Teaching Philosophy */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                            Teaching Philosophy
                          </h4>
                          <button
                            onClick={() => handleEditSection(5)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            <span>Edit</span>
                          </button>
                        </div>
                        <div className="space-y-4 text-sm">
                          {getValues('additionalInfo.teachingPhilosophy') ? (
                            <div>
                              <span className="font-medium text-gray-600">Philosophy:</span>
                              <p className="mt-2 text-gray-700 leading-relaxed">
                                {getValues('additionalInfo.teachingPhilosophy')}
                              </p>
                            </div>
                          ) : (
                            <div className="text-gray-500">No philosophy provided</div>
                          )}
                          {getValues('additionalInfo.whyJoinUs') && (
                            <div>
                              <span className="font-medium text-gray-600">Why Join Us:</span>
                              <p className="mt-2 text-gray-700 leading-relaxed">
                                {getValues('additionalInfo.whyJoinUs')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900 mb-2">Ready to Submit?</h4>
                          <p className="text-sm text-blue-800">
                            Please review all information carefully. Once submitted, you won't be able to make changes to your application.
                            We'll review your application and get back to you within 48 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="pt-6 border-t border-gray-200">
                {/* Mobile Progress Indicator */}
                <div className="md:hidden mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round((currentStep / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                    className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 touch-manipulation ${
                    currentStep === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95 shadow-sm hover:shadow-md'
                  }`}
                >
                    <ChevronLeft className="h-5 w-5" />
                  <span>Previous</span>
                </button>

                  {/* Desktop Step Indicator */}
                  <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
                    <span>Step {currentStep} of {steps.length}</span>
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                </div>

                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                      className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation ${
                        isSubmitting
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                          <Send className="h-5 w-5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                )}
                </div>

                {/* Mobile Step Navigation */}
                <div className="md:hidden mt-4">
                  <div className="flex justify-center space-x-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          currentStep === step.id
                            ? 'bg-blue-600 scale-125'
                            : currentStep > step.id
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                        aria-label={`Go to step ${step.id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Application Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close preview"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Application Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(applicationStatus)}`}>
                      {getStatusText(applicationStatus)}
                    </div>
                    {applicationId && (
                      <span className="text-sm text-gray-600">ID: {applicationId}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Last saved: {lastSaved?.toLocaleString()}
                  </div>
                </div>

                {/* Form Data Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {getValues('personalInfo.fullName') || 'Not provided'}</div>
                      <div><span className="font-medium">Email:</span> {getValues('personalInfo.email') || 'Not provided'}</div>
                      <div><span className="font-medium">Phone:</span> {getValues('personalInfo.phone') || 'Not provided'}</div>
                      <div><span className="font-medium">Location:</span> {getValues('personalInfo.location') || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Education & Experience</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Qualification:</span> {getValues('education.highestQualification') || 'Not provided'}</div>
                      <div><span className="font-medium">Institution:</span> {getValues('education.institution') || 'Not provided'}</div>
                      <div><span className="font-medium">Experience:</span> {getValues('experience.yearsOfExperience') || 'Not provided'} years</div>
                      <div><span className="font-medium">Subjects:</span> {getValues('experience.subjectsTaught')?.join(', ') || 'None selected'}</div>
                    </div>
                  </div>
                </div>

                {/* Documents Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(uploadedFiles).map(([key, file]) => (
                      <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <File className="h-5 w-5 text-gray-500" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {file ? `${file.name} (${formatFileSize(file.size)})` : 'Not uploaded'}
                          </div>
                        </div>
                        {file && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teaching Philosophy Preview */}
                {getValues('additionalInfo.teachingPhilosophy') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Teaching Philosophy</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getValues('additionalInfo.teachingPhilosophy')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreview(false)
                  // Scroll to submit button
                  const submitButton = document.querySelector('button[type="submit"]')
                  submitButton?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Application
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Submit?</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to submit your teacher application? Please make sure all information is correct as you won't be able to make changes after submission.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmationDialog(false)}
                className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Review Again
              </button>
              <button
                onClick={handleConfirmSubmission}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Yes, Submit Application'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}
