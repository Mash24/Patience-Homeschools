'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, BookOpen, Calendar, MapPin, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ParentLeadSchema, type ParentLeadData } from '@/lib/schemas'
import { CURRICULA_OPTIONS } from '@/lib/constants'

export default function TeacherMatchingFormNew() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [leadId, setLeadId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
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

  const curricula = CURRICULA_OPTIONS
  const subjects = [
    'Mathematics', 'English', 'Science', 'Social Studies', 'Kiswahili',
    'French', 'German', 'Computer Studies', 'Art', 'Music', 'PE'
  ]
  const locations = [
    'Westlands', 'Karen', 'Runda', 'Kilimani', 'Kileleshwa', 
    'Lavington', 'Parklands', 'Eastleigh', 'Online Only', 'Other'
  ]

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
    setValue('subjects', newSubjects)
  }

  const handleCurriculumChange = (curriculum: string) => {
    const currentCurricula = watchedCurricula || []
    const newCurricula = currentCurricula.includes(curriculum)
      ? currentCurricula.filter(c => c !== curriculum)
      : [...currentCurricula, curriculum]
    setValue('curricula', newCurricula)
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
              <h2 className="heading-md text-green-800 mb-4">Lead Submitted Successfully!</h2>
              <p className="text-luxury text-green-700 mb-6">
                Thank you for your interest! We've received your request and will match you with suitable teachers within 24 hours.
              </p>
              <div className="bg-white rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Reference ID:</p>
                <p className="font-mono text-lg font-bold text-gray-800">{leadId}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254XXXXXXXXX'}?text=Lead%20${leadId}%20submitted%20-%20Need%20teacher%20matching`}
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
                    setLeadId(null)
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
              Tell Us About Your Needs
            </h2>
            <p className="text-luxury">
              Fill out this form and we'll match you with 3 qualified teachers within 24 hours
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
              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Parent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Name *
                    </label>
                    <input
                      type="text"
                      {...register('parentName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                    {errors.parentName && (
                      <p className="text-red-500 text-sm mt-1">{errors.parentName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+254 XXX XXX XXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nairobi"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Child Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Child Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child's First Name
                    </label>
                    <input
                      type="text"
                      {...register('childFirstName')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Child's name"
                    />
                    {errors.childFirstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.childFirstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level *
                    </label>
                    <select
                      {...register('gradeLevel')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select grade level</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                    {errors.gradeLevel && (
                      <p className="text-red-500 text-sm mt-1">{errors.gradeLevel.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Curriculum Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Curriculum Preferences *
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
                {errors.curricula && (
                  <p className="text-red-500 text-sm mt-2">{errors.curricula.message}</p>
                )}
              </div>

              {/* Subject Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-orange-600" />
                  Subjects Needed *
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
                {errors.subjects && (
                  <p className="text-red-500 text-sm mt-2">{errors.subjects.message}</p>
                )}
              </div>

              {/* Teaching Mode */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                  Teaching Mode *
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'in_home', label: 'In-Home Teaching', icon: MapPin },
                    { value: 'online', label: 'Online Teaching', icon: Calendar },
                    { value: 'hybrid', label: 'Hybrid (Both)', icon: DollarSign }
                  ].map(({ value, label, icon: Icon }) => (
                    <label key={value} className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="radio"
                        value={value}
                        {...register('mode')}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                {errors.mode && (
                  <p className="text-red-500 text-sm mt-2">{errors.mode.message}</p>
                )}
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Additional Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Area
                    </label>
                    <input
                      type="text"
                      {...register('locationArea')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your child's learning goals and any specific needs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      {...register('budgetBand')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under KES 5,000/month">Under KES 5,000/month</option>
                      <option value="KES 5,000 - 10,000/month">KES 5,000 - 10,000/month</option>
                      <option value="KES 10,000 - 20,000/month">KES 10,000 - 20,000/month</option>
                      <option value="KES 20,000 - 30,000/month">KES 20,000 - 30,000/month</option>
                      <option value="Above KES 30,000/month">Above KES 30,000/month</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
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
                      Submit Request
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
