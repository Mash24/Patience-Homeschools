'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  User, 
  BookOpen, 
  Calendar, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Shield,
  Star,
  GraduationCap,
  Users,
  Target,
  Heart,
  Zap,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MessageCircle,
  Home,
  School,
  Baby,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ParentLeadSchema, type ParentLeadData } from '@/lib/schemas'

export default function TeacherMatchingFormEnhanced() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
    getValues
  } = useForm<ParentLeadData>({
    resolver: zodResolver(ParentLeadSchema),
    defaultValues: {
      curricula: [],
      subjects: [],
      mode: 'in_home'
    }
  })

  const watchedSubjects = watch('subjects')
  const watchedCurricula = watch('curricula')
  const watchedMode = watch('mode')

  const curricula = [
    { value: 'CBC', label: 'CBC', description: 'Competency Based Curriculum', icon: '🎯' },
    { value: 'IGCSE', label: 'IGCSE', description: 'International General Certificate', icon: '🌍' },
    { value: 'British Curriculum', label: 'British Curriculum', description: 'UK National Curriculum', icon: '🇬🇧' }
  ]

  const subjects = [
    { value: 'Mathematics', icon: '🔢', category: 'Core', color: 'bg-blue-50 border-blue-200' },
    { value: 'English', icon: '📚', category: 'Core', color: 'bg-green-50 border-green-200' },
    { value: 'Science', icon: '🔬', category: 'Core', color: 'bg-purple-50 border-purple-200' },
    { value: 'Social Studies', icon: '🌍', category: 'Core', color: 'bg-orange-50 border-orange-200' },
    { value: 'Kiswahili', icon: '🇰🇪', category: 'Language', color: 'bg-red-50 border-red-200' },
    { value: 'French', icon: '🇫🇷', category: 'Language', color: 'bg-indigo-50 border-indigo-200' },
    { value: 'German', icon: '🇩🇪', category: 'Language', color: 'bg-gray-50 border-gray-200' },
    { value: 'Computer Studies', icon: '💻', category: 'Technology', color: 'bg-cyan-50 border-cyan-200' },
    { value: 'Art', icon: '🎨', category: 'Creative', color: 'bg-pink-50 border-pink-200' },
    { value: 'Music', icon: '🎵', category: 'Creative', color: 'bg-yellow-50 border-yellow-200' },
    { value: 'PE', icon: '⚽', category: 'Physical', color: 'bg-emerald-50 border-emerald-200' },
    { value: 'History', icon: '📜', category: 'Social', color: 'bg-amber-50 border-amber-200' }
  ]

  const teachingModes = [
    { 
      value: 'in_home', 
      label: 'In-Home Teaching', 
      icon: Home, 
      description: 'Teacher comes to your home',
      benefits: ['Personalized environment', 'No travel for child', 'Family involvement'],
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    { 
      value: 'online', 
      label: 'Online Teaching', 
      icon: Calendar, 
      description: 'Virtual lessons via video call',
      benefits: ['Flexible scheduling', 'Access to global teachers', 'Cost effective'],
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    { 
      value: 'hybrid', 
      label: 'Hybrid (Both)', 
      icon: Zap, 
      description: 'Mix of in-home and online',
      benefits: ['Best of both worlds', 'Weather flexibility', 'Optimal learning'],
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    }
  ]

  const steps = [
    { number: 1, title: 'Parent Info', icon: User, fields: ['parentName', 'email', 'phone', 'city'] },
    { number: 2, title: 'Child Details', icon: BookOpen, fields: ['childFirstName', 'gradeLevel'] },
    { number: 3, title: 'Curriculum & Subjects', icon: GraduationCap, fields: ['curricula', 'subjects'] },
    { number: 4, title: 'Teaching Mode', icon: Calendar, fields: ['mode'] },
    { number: 5, title: 'Preferences', icon: Target, fields: ['locationArea', 'scheduleNote', 'goals', 'budgetBand'] },
    { number: 6, title: 'Review & Submit', icon: Send, fields: [] }
  ]

  // Auto-save functionality
  useEffect(() => {
    const subscription = watch((value) => {
      if (Object.keys(value).length > 0) {
        setAutoSaveStatus('saving')
        // Simulate auto-save
        setTimeout(() => {
          setAutoSaveStatus('saved')
        }, 1000)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const onSubmit = async (data: ParentLeadData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/parent-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit lead')
      }

      setLeadId(result.id)
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Submission error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubjectChange = (subject: string) => {
    const currentSubjects = watchedSubjects || []
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject]
    setValue('subjects', newSubjects, { shouldValidate: true })
  }

  const handleCurriculumChange = (curriculum: string) => {
    const currentCurricula = watchedCurricula || []
    const newCurricula = currentCurricula.includes(curriculum)
      ? currentCurricula.filter(c => c !== curriculum)
      : [...currentCurricula, curriculum]
    setValue('curricula', newCurricula, { shouldValidate: true })
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepData = steps[currentStep - 1]
    if (!currentStepData.fields.length) return true

    const isValid = await trigger(currentStepData.fields as any)
    
    // Clear previous step errors
    setStepErrors(prev => ({ ...prev, [currentStep]: [] }))
    
    if (!isValid) {
      const stepErrorMessages: string[] = []
      currentStepData.fields.forEach(field => {
        if (errors[field as keyof ParentLeadData]) {
          stepErrorMessages.push(errors[field as keyof ParentLeadData]?.message || 'Invalid input')
        }
      })
      setStepErrors(prev => ({ ...prev, [currentStep]: stepErrorMessages }))
    }
    
    return isValid
  }

  const nextStep = async () => {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only submit if we're on the last step
    if (currentStep === steps.length) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        const formData = getValues()
        await onSubmit(formData)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      // Clear errors when going back
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }))
    }
  }

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= steps.length) {
      setCurrentStep(stepNumber)
      setStepErrors(prev => ({ ...prev, [currentStep]: [] }))
    }
  }

  // Success state
  if (submitStatus === 'success') {
    return (
      <section id="teacher-matching-form" className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-mobile">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-green-200">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold text-green-800 mb-4">Request Submitted Successfully!</h2>
              <p className="text-lg text-green-700 mb-8">
                Thank you for your interest! We've received your request and will match you with suitable teachers within 24 hours.
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-green-600 mb-2">Reference ID:</p>
                <p className="font-mono text-xl font-bold text-green-800">{leadId}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-800">24 Hours</div>
                  <div className="text-sm text-blue-600">Response Time</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-800">3 Teachers</div>
                  <div className="text-sm text-purple-600">Matched for You</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-semibold text-orange-800">100%</div>
                  <div className="text-sm text-orange-600">Satisfaction</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254XXXXXXXXX'}?text=Lead%20${leadId}%20submitted%20-%20Need%20teacher%20matching`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Contact via WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSubmitStatus('idle')
                    setLeadId(null)
                    setCurrentStep(1)
                    setStepErrors({})
                  }}
                  className="btn-outline"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="teacher-matching-form" className="section-padding bg-white">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header - Ultra Mobile Optimized */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 px-2 sm:px-0">
            <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-blue-50 border border-blue-200 rounded-full px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 mb-3 sm:mb-4 lg:mb-6">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-700">Smart Matching</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 lg:mb-4 leading-tight">
              Find Your Perfect Teacher
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-4 lg:px-0 leading-relaxed">
              Connect with 3 qualified teachers within 24 hours
            </p>
          </div>

          {/* Enhanced Progress Bar - Responsive */}
          <div className="mb-6 lg:mb-8">
            {/* Desktop Progress Bar */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <button
                      onClick={() => goToStep(step.number)}
                      className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-all ${
                        currentStep >= step.number 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                          : 'bg-white border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                    >
                      <step.icon className="h-4 w-4 lg:h-5 lg:w-5" />
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 lg:w-16 h-0.5 mx-1 lg:mx-2 transition-colors ${
                        currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Progress Bar - Ultra Compact */}
            <div className="sm:hidden">
              <div className="flex items-center justify-center space-x-1.5 mb-3">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    onClick={() => goToStep(step.number)}
                    className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all ${
                      currentStep >= step.number 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <step.icon className="h-2.5 w-2.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center px-2">
              <span className="text-xs sm:text-sm text-gray-600">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-1 sm:h-1.5 lg:h-2 mt-1.5 sm:mt-2">
                <div 
                  className="bg-blue-600 h-1 sm:h-1.5 lg:h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Auto-save indicator - Mobile Optimized */}
          <div className="flex justify-end mb-4 sm:mb-6 px-2 sm:px-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-500">
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-600"></div>
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Saving</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="hidden sm:inline">Auto-saved</span>
                  <span className="sm:hidden">Saved</span>
                </>
              )}
            </div>
          </div>

          {/* Form - Ultra Mobile Optimized */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden mx-1 sm:mx-0">
            <form onSubmit={handleFormSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Parent Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <User className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Parent Information</h3>
                    </div>
                    
                    {stepErrors[1] && stepErrors[1].length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-red-700 font-medium">Please fix the following errors:</p>
                            <ul className="text-red-600 text-sm mt-1">
                              {stepErrors[1].map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Parent Name *
                        </label>
                        <input
                          type="text"
                          {...register('parentName')}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="Your full name"
                        />
                        {errors.parentName && (
                          <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="+254 XXX XXX XXX"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          {...register('city')}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="Nairobi"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Child Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <BookOpen className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Child Information</h3>
                    </div>
                    
                    {stepErrors[2] && stepErrors[2].length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-red-700 font-medium">Please fix the following errors:</p>
                            <ul className="text-red-600 text-sm mt-1">
                              {stepErrors[2].map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Child's First Name
                        </label>
                        <input
                          type="text"
                          {...register('childFirstName')}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="Child's name"
                        />
                        {errors.childFirstName && (
                          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.childFirstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade Level *
                        </label>
                        <select
                          {...register('gradeLevel')}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        >
                          <option value="">Select grade level</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={`Grade ${i + 1}`}>
                              Grade {i + 1}
                            </option>
                          ))}
                        </select>
                        {errors.gradeLevel && (
                          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gradeLevel.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Curriculum & Subjects */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <GraduationCap className="h-6 w-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Curriculum & Subjects</h3>
                    </div>
                    
                    {stepErrors[3] && stepErrors[3].length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-red-700 font-medium">Please fix the following errors:</p>
                            <ul className="text-red-600 text-sm mt-1">
                              {stepErrors[3].map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Curriculum Selection */}
                    <div className="mb-6 sm:mb-8">
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Preferred Curriculum *</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {curricula.map((curriculum) => (
                          <label key={curriculum.value} className="relative cursor-pointer">
                            <input
                              type="checkbox"
                              checked={watchedCurricula?.includes(curriculum.value) || false}
                              onChange={() => handleCurriculumChange(curriculum.value)}
                              className="sr-only"
                            />
                            <div className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                              watchedCurricula?.includes(curriculum.value)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="flex items-center mb-2">
                                <span className="text-xl sm:text-2xl mr-2">{curriculum.icon}</span>
                                <div className="font-medium text-gray-900 text-sm sm:text-base">{curriculum.label}</div>
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600">{curriculum.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.curricula && (
                        <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.curricula.message}</p>
                      )}
                    </div>

                    {/* Subject Selection - Ultra Mobile Optimized */}
                    <div>
                      <h4 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-2 sm:mb-3 lg:mb-4">Subjects Needed *</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 lg:gap-3">
                        {subjects.map((subject) => (
                          <label key={subject.value} className="relative cursor-pointer">
                            <input
                              type="checkbox"
                              checked={watchedSubjects?.includes(subject.value) || false}
                              onChange={() => handleSubjectChange(subject.value)}
                              className="sr-only"
                            />
                            <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg border-2 transition-all text-center ${
                              watchedSubjects?.includes(subject.value)
                                ? 'border-blue-500 bg-blue-50'
                                : `${subject.color} hover:border-gray-400`
                            }`}>
                              <div className="text-sm sm:text-lg lg:text-2xl mb-0.5 sm:mb-1">{subject.icon}</div>
                              <div className="text-xs sm:text-xs lg:text-sm font-medium text-gray-900 leading-tight">{subject.value}</div>
                              <div className="text-xs text-gray-500 hidden lg:block">{subject.category}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.subjects && (
                        <p className="text-red-500 text-xs mt-1.5 sm:mt-2">{errors.subjects.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Teaching Mode */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Teaching Mode</h3>
                    </div>
                    
                    {stepErrors[4] && stepErrors[4].length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-red-700 font-medium">Please fix the following errors:</p>
                            <ul className="text-red-600 text-sm mt-1">
                              {stepErrors[4].map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      {teachingModes.map((mode) => (
                        <label key={mode.value} className="relative cursor-pointer">
                          <input
                            type="radio"
                            value={mode.value}
                            {...register('mode')}
                            className="sr-only"
                          />
                          <div className={`p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all ${
                            watchedMode === mode.value
                              ? 'border-blue-500 bg-blue-50'
                              : `${mode.color} hover:border-gray-400`
                          }`}>
                            <mode.icon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${mode.iconColor} mb-2 sm:mb-3 lg:mb-4`} />
                            <h4 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-xs sm:text-sm lg:text-base">{mode.label}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 lg:mb-4">{mode.description}</p>
                            <ul className="space-y-0.5 sm:space-y-1">
                              {mode.benefits.map((benefit, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-center">
                                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                                  <span className="leading-tight">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.mode && (
                      <p className="text-red-500 text-sm mt-2">{errors.mode.message}</p>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Preferences */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <Target className="h-6 w-6 text-orange-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Additional Preferences</h3>
                    </div>
                    
                    {stepErrors[5] && stepErrors[5].length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <div>
                            <p className="text-red-700 font-medium">Please fix the following errors:</p>
                            <ul className="text-red-600 text-sm mt-1">
                              {stepErrors[5].map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location Area
                        </label>
                        <input
                          type="text"
                          {...register('locationArea')}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="e.g., Westlands, Karen, Runda"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule Preferences
                        </label>
                        <textarea
                          {...register('scheduleNote')}
                          rows={3}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                          placeholder="e.g., Weekdays after 3 PM, Weekend mornings"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Learning Goals
                        </label>
                        <textarea
                          {...register('goals')}
                          rows={3}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                          placeholder="Tell us about your child's learning goals and any specific needs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Considerations
                        </label>
                        <textarea
                          {...register('budgetBand')}
                          rows={2}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base resize-none"
                          placeholder="Tell us about your budget considerations and what you're looking for in terms of value"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center mb-6">
                      <Send className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
                    </div>
                    
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <p className="text-red-700">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Summary of Your Request</h4>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parent:</span>
                          <span className="font-medium">{watch('parentName')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Child:</span>
                          <span className="font-medium">{watch('childFirstName')} - {watch('gradeLevel')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Curriculum:</span>
                          <span className="font-medium">{watchedCurricula?.join(', ') || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subjects:</span>
                          <span className="font-medium">{watchedSubjects?.join(', ') || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mode:</span>
                          <span className="font-medium">{teachingModes.find(m => m.value === watchedMode)?.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">What Happens Next?</h4>
                      <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                        <li className="flex items-center">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                          <span>We'll review your requirements within 24 hours</span>
                        </li>
                        <li className="flex items-center">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                          <span>We'll match you with 3 qualified teachers</span>
                        </li>
                        <li className="flex items-center">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                          <span>You'll receive detailed teacher profiles</span>
                        </li>
                        <li className="flex items-center">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                          <span>Schedule interviews and choose your perfect match</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Navigation - Ultra Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 lg:p-6 xl:p-8 bg-gray-50 border-t border-gray-200 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg transition-all text-xs sm:text-sm lg:text-base ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="flex items-center space-x-1 sm:space-x-1.5 lg:space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full transition-colors ${
                        index + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary inline-flex items-center group text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3"
                  >
                    <span>Next</span>
                    <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      const isValid = await validateCurrentStep()
                      if (isValid) {
                        const formData = getValues()
                        await onSubmit(formData)
                      }
                    }}
                    disabled={isSubmitting}
                    className="btn-primary inline-flex items-center min-w-[120px] sm:min-w-[140px] lg:min-w-[200px] group text-xs sm:text-sm lg:text-base px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 border-b-2 border-white mr-1.5 sm:mr-2"></div>
                        <span className="hidden sm:inline">Submitting...</span>
                        <span className="sm:hidden">Submitting</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Submit Request</span>
                        <span className="sm:hidden">Submit</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}