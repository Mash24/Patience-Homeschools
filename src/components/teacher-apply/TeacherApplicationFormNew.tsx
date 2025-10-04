'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Send, User, GraduationCap, FileText, Award, CheckCircle, AlertCircle, BookOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeacherApplicationSchema, type TeacherApplicationData } from '@/lib/schemas'
import { CURRICULA_OPTIONS } from '@/lib/constants'

export default function TeacherApplicationFormNew() {
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
    reset
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

  const curricula = CURRICULA_OPTIONS
  const subjects = [
    'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
    'Social Studies', 'Kiswahili', 'French', 'German', 'Computer Studies',
    'Art', 'Music', 'PE', 'Geography', 'History', 'Economics'
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
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
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
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <span className="sm:hidden">WhatsApp</span>
                  <span className="hidden sm:inline">Contact via WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitStatus('idle')
                    setApplicationId(null)
                  }}
                  className="btn-outline"
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
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">
              Join Our Teacher Network
            </h2>
            <p className="text-luxury">
              Apply to become part of Nairobi's premier homeschooling network
            </p>
          </div>

          <div className="card">
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
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
              </div>

              {/* Education Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
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
              </div>

              {/* Curriculum Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Curriculum Experience *
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {curricula.map((curriculum) => (
                    <label key={curriculum} className="flex items-center space-x-3 cursor-pointer">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Subject Expertise *
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {subjects.map((subject) => (
                    <label key={subject} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchedSubjects?.includes(subject) || false}
                        onChange={() => handleSubjectChange(subject)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
                {errors.experience?.subjectsTaught && (
                  <p className="text-red-500 text-sm mt-2">{errors.experience.subjectsTaught.message}</p>
                )}
              </div>

              {/* Teaching Philosophy */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-600" />
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
              </div>

              {/* Why Join Us */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-600" />
                  Why Join Our Network?
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What interests you about joining Nelimac Learning?
                  </label>
                  <textarea
                    {...register('additionalInfo.whyJoinUs')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share what attracts you to our homeschooling network..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary inline-flex items-center justify-center min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
