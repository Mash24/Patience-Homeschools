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
  Baby
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ParentRegistrationSchema, type ParentRegistrationData, type ChildData } from '@/lib/schemas'

export default function ParentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [userId, setUserId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
    control
  } = useForm<ParentRegistrationData>({
    resolver: zodResolver(ParentRegistrationSchema),
    defaultValues: {
      preferredCurricula: [],
      preferredSubjects: [],
      teachingMode: 'in_home',
      children: [{
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gradeLevel: '',
        school: '',
        specialNeeds: '',
        interests: []
      }],
      preferredContactMethod: 'email',
      newsletterSubscription: true,
      smsNotifications: true,
      agreeToTerms: false,
      agreeToPrivacy: false
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children'
  })

  const watchedCurricula = watch('preferredCurricula')
  const watchedSubjects = watch('preferredSubjects')
  const watchedMode = watch('teachingMode')

  const curricula = [
    { value: 'CBC', label: 'CBC', description: 'Competency Based Curriculum' },
    { value: 'IGCSE', label: 'IGCSE', description: 'International General Certificate' },
    { value: 'British Curriculum', label: 'British Curriculum', description: 'UK National Curriculum' }
  ]

  const subjects = [
    { value: 'Mathematics', icon: '🔢', category: 'Core' },
    { value: 'English', icon: '📚', category: 'Core' },
    { value: 'Science', icon: '🔬', category: 'Core' },
    { value: 'Social Studies', icon: '🌍', category: 'Core' },
    { value: 'Kiswahili', icon: '🇰🇪', category: 'Language' },
    { value: 'French', icon: '🇫🇷', category: 'Language' },
    { value: 'German', icon: '🇩🇪', category: 'Language' },
    { value: 'Computer Studies', icon: '💻', category: 'Technology' },
    { value: 'Art', icon: '🎨', category: 'Creative' },
    { value: 'Music', icon: '🎵', category: 'Creative' },
    { value: 'PE', icon: '⚽', category: 'Physical' },
    { value: 'History', icon: '📜', category: 'Social' }
  ]

  const teachingModes = [
    { 
      value: 'in_home', 
      label: 'In-Home Teaching', 
      icon: Home, 
      description: 'Teacher comes to your home',
      benefits: ['Personalized environment', 'No travel for child', 'Family involvement']
    },
    { 
      value: 'online', 
      label: 'Online Teaching', 
      icon: Calendar, 
      description: 'Virtual lessons via video call',
      benefits: ['Flexible scheduling', 'Access to global teachers', 'Cost effective']
    },
    { 
      value: 'hybrid', 
      label: 'Hybrid (Both)', 
      icon: DollarSign, 
      description: 'Mix of in-home and online',
      benefits: ['Best of both worlds', 'Weather flexibility', 'Optimal learning']
    }
  ]

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Children', icon: Baby },
    { number: 4, title: 'Education', icon: GraduationCap },
    { number: 5, title: 'Preferences', icon: Target },
    { number: 6, title: 'Review & Submit', icon: Send }
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

  const onSubmit = async (data: ParentRegistrationData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/parent-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register')
      }

      setUserId(result.id)
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Registration error:', error)
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
    setValue('preferredSubjects', newSubjects)
  }

  const handleCurriculumChange = (curriculum: string) => {
    const currentCurricula = watchedCurricula || []
    const newCurricula = currentCurricula.includes(curriculum)
      ? currentCurricula.filter(c => c !== curriculum)
      : [...currentCurricula, curriculum]
    setValue('preferredCurricula', newCurricula)
  }

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

  const addChild = () => {
    append({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gradeLevel: '',
      school: '',
      specialNeeds: '',
      interests: []
    })
  }

  // Success state
  if (submitStatus === 'success') {
    return (
      <section id="parent-registration-form" className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
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
              <h2 className="text-3xl font-bold text-green-800 mb-4">Registration Successful!</h2>
              <p className="text-lg text-green-700 mb-8">
                Welcome to Nelimac Learning! Your account has been created successfully. 
                You can now access our platform and start finding the perfect teachers for your children.
              </p>
              <div className="bg-green-50 rounded-xl p-6 mb-8">
                <p className="text-sm text-green-600 mb-2">Account ID:</p>
                <p className="font-mono text-xl font-bold text-green-800">{userId}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-blue-800">24 Hours</div>
                  <div className="text-sm text-blue-600">Account Activation</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold text-purple-800">Teacher Matching</div>
                  <div className="text-sm text-purple-600">Available Now</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="font-semibold text-orange-800">Full Access</div>
                  <div className="text-sm text-orange-600">To All Features</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/dashboard"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </a>
                <button
                  onClick={() => {
                    setSubmitStatus('idle')
                    setUserId(null)
                    setCurrentStep(1)
                  }}
                  className="btn-outline"
                >
                  Register Another Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="parent-registration-form" className="section-padding bg-white">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Create Your Parent Account
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community and gain access to TSC-certified teachers, 
              exclusive resources, and personalized education support.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 transition-colors ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </span>
            </div>
          </div>

          {/* Auto-save indicator */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Saving...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Auto-saved</span>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
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
                      <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register('firstName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Your first name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register('lastName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Your last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="+254 XXX XXX XXX"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Create a strong password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Location Information */}
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
                      <MapPin className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Location Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          {...register('city')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Nairobi"
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Area *
                        </label>
                        <input
                          type="text"
                          {...register('area')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Westlands, Karen, Runda"
                        />
                        {errors.area && (
                          <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address (Optional)
                        </label>
                        <textarea
                          {...register('address')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Your full address"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Children Information */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <Baby className="h-6 w-6 text-purple-600 mr-3" />
                        <h3 className="text-xl font-semibold text-gray-900">Children Information</h3>
                      </div>
                      <button
                        type="button"
                        onClick={addChild}
                        className="btn-outline inline-flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Child
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {fields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Child {index + 1}</h4>
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name *
                              </label>
                              <input
                                type="text"
                                {...register(`children.${index}.firstName`)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Child's first name"
                              />
                              {errors.children?.[index]?.firstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.children[index]?.firstName?.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name *
                              </label>
                              <input
                                type="text"
                                {...register(`children.${index}.lastName`)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Child's last name"
                              />
                              {errors.children?.[index]?.lastName && (
                                <p className="text-red-500 text-sm mt-1">{errors.children[index]?.lastName?.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                {...register(`children.${index}.dateOfBirth`)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              {errors.children?.[index]?.dateOfBirth && (
                                <p className="text-red-500 text-sm mt-1">{errors.children[index]?.dateOfBirth?.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Grade Level *
                              </label>
                              <select
                                {...register(`children.${index}.gradeLevel`)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              >
                                <option value="">Select grade level</option>
                                {[...Array(12)].map((_, i) => (
                                  <option key={i + 1} value={`Grade ${i + 1}`}>
                                    Grade {i + 1}
                                  </option>
                                ))}
                              </select>
                              {errors.children?.[index]?.gradeLevel && (
                                <p className="text-red-500 text-sm mt-1">{errors.children[index]?.gradeLevel?.message}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current School (Optional)
                              </label>
                              <input
                                type="text"
                                {...register(`children.${index}.school`)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="School name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Special Needs (Optional)
                              </label>
                              <input
                                type="text"
                                {...register(`children.${index}.specialNeeds`)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Any special learning needs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.children && (
                      <p className="text-red-500 text-sm mt-2">{errors.children.message}</p>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Education Preferences */}
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
                      <GraduationCap className="h-6 w-6 text-purple-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900">Education Preferences</h3>
                    </div>
                    
                    {/* Curriculum Selection */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Preferred Curriculum *</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {curricula.map((curriculum) => (
                          <label key={curriculum.value} className="relative cursor-pointer">
                            <input
                              type="checkbox"
                              checked={watchedCurricula?.includes(curriculum.value) || false}
                              onChange={() => handleCurriculumChange(curriculum.value)}
                              className="sr-only"
                            />
                            <div className={`p-4 rounded-lg border-2 transition-all ${
                              watchedCurricula?.includes(curriculum.value)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="font-medium text-gray-900">{curriculum.label}</div>
                              <div className="text-sm text-gray-600">{curriculum.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.preferredCurricula && (
                        <p className="text-red-500 text-sm mt-2">{errors.preferredCurricula.message}</p>
                      )}
                    </div>

                    {/* Subject Selection */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Preferred Subjects *</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {subjects.map((subject) => (
                          <label key={subject.value} className="relative cursor-pointer">
                            <input
                              type="checkbox"
                              checked={watchedSubjects?.includes(subject.value) || false}
                              onChange={() => handleSubjectChange(subject.value)}
                              className="sr-only"
                            />
                            <div className={`p-3 rounded-lg border-2 transition-all text-center ${
                              watchedSubjects?.includes(subject.value)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <div className="text-2xl mb-1">{subject.icon}</div>
                              <div className="text-sm font-medium text-gray-900">{subject.value}</div>
                              <div className="text-xs text-gray-500">{subject.category}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.preferredSubjects && (
                        <p className="text-red-500 text-sm mt-2">{errors.preferredSubjects.message}</p>
                      )}
                    </div>

                    {/* Teaching Mode */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Preferred Teaching Mode *</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {teachingModes.map((mode) => (
                          <label key={mode.value} className="relative cursor-pointer">
                            <input
                              type="radio"
                              value={mode.value}
                              {...register('teachingMode')}
                              className="sr-only"
                            />
                            <div className={`p-6 rounded-xl border-2 transition-all ${
                              watchedMode === mode.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <mode.icon className="h-8 w-8 text-blue-600 mb-4" />
                              <h4 className="font-semibold text-gray-900 mb-2">{mode.label}</h4>
                              <p className="text-sm text-gray-600 mb-4">{mode.description}</p>
                              <ul className="space-y-1">
                                {mode.benefits.map((benefit, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-center">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.teachingMode && (
                        <p className="text-red-500 text-sm mt-2">{errors.teachingMode.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Additional Preferences */}
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
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Learning Goals
                        </label>
                        <textarea
                          {...register('goals')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tell us about your children's learning goals and any specific needs"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Considerations
                        </label>
                        <textarea
                          {...register('budgetConsiderations')}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tell us about your budget considerations and what you're looking for in terms of value"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule Preferences
                        </label>
                        <textarea
                          {...register('schedulePreferences')}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Weekdays after 3 PM, Weekend mornings"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          {...register('emergencyContact')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Emergency contact person and number"
                        />
                      </div>
                      
                      {/* Communication Preferences */}
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preferred Contact Method *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {[
                                { value: 'email', label: 'Email', icon: Mail },
                                { value: 'phone', label: 'Phone', icon: Phone },
                                { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle }
                              ].map(({ value, label, icon: Icon }) => (
                                <label key={value} className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                  <input
                                    type="radio"
                                    value={value}
                                    {...register('preferredContactMethod')}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                  />
                                  <Icon className="w-5 h-5 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register('newsletterSubscription')}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">Subscribe to newsletter</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                {...register('smsNotifications')}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">SMS notifications</span>
                            </label>
                          </div>
                        </div>
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

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Summary of Your Registration</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{watch('firstName')} {watch('lastName')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{watch('email')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{watch('city')}, {watch('area')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Children:</span>
                          <span className="font-medium">{watch('children')?.length || 0} child(ren)</span>
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
                          <span className="text-gray-600">Teaching Mode:</span>
                          <span className="font-medium">{teachingModes.find(m => m.value === watchedMode)?.label}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-2">What Happens Next?</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Your account will be activated within 24 hours
                        </li>
                        <li className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          You'll get access to our teacher directory
                        </li>
                        <li className="flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          Start requesting teacher matches immediately
                        </li>
                        <li className="flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Join our community events and resources
                        </li>
                      </ul>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4 mb-6">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('agreeToTerms')}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and understand the service agreement.
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
                      )}
                      
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('agreeToPrivacy')}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> and consent to data processing.
                        </span>
                      </label>
                      {errors.agreeToPrivacy && (
                        <p className="text-red-500 text-sm">{errors.agreeToPrivacy.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between p-8 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary inline-flex items-center"
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex items-center min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Create Account
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
