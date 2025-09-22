'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Send, User, GraduationCap, FileText, Award, CheckCircle, AlertCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeacherApplicationSchema, type TeacherApplicationData } from '@/lib/schemas'

export default function TeacherApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger
  } = useForm<TeacherApplicationData>({
    resolver: zodResolver(TeacherApplicationSchema),
    defaultValues: {
      experience: {
        subjectsTaught: [],
        curriculumExperience: [],
        specializations: []
      },
      availability: {
        onlineTeaching: false
      }
    }
  })

  const watchedSubjects = watch('experience.subjectsTaught')
  const watchedCurricula = watch('experience.curriculumExperience')

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
    { id: 4, title: 'Philosophy', icon: FileText }
  ]

  const onSubmit = async (data: TeacherApplicationData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
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
    setValue('experience.subjectsTaught', newSubjects)
  }

  const handleCurriculumChange = (curriculum: string) => {
    const currentCurricula = watchedCurricula || []
    const newCurricula = currentCurricula.includes(curriculum)
      ? currentCurricula.filter(c => c !== curriculum)
      : [...currentCurricula, curriculum]
    setValue('experience.curriculumExperience', newCurricula)
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)
    
    if (isValid && currentStep < steps.length) {
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
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentStep >= step.id 
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step.id ? 'text-gold-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <User className="h-6 w-6 mr-3 text-blue-600" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          {...register('personalInfo.fullName')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                        {errors.personalInfo?.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.personalInfo.fullName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...register('personalInfo.email')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                        {errors.personalInfo?.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.personalInfo.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register('personalInfo.phone')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+254 XXX XXX XXX"
                        />
                        {errors.personalInfo?.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.personalInfo.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          {...register('personalInfo.location')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nairobi"
                        />
                        {errors.personalInfo?.location && (
                          <p className="text-red-500 text-sm mt-1">{errors.personalInfo.location.message}</p>
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

                {/* Step 4: Philosophy */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                      Teaching Philosophy
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your teaching philosophy and approach
                      </label>
                      <textarea
                        {...register('additionalInfo.teachingPhilosophy')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your teaching style, methods, and educational philosophy..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What interests you about joining Patience Education Collective?
                      </label>
                      <textarea
                        {...register('additionalInfo.whyJoinUs')}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Share what attracts you to our homeschooling network..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </div>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
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

