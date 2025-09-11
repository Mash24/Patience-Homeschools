'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Send, User, GraduationCap, FileText, Award } from 'lucide-react'

export default function TeacherApplicationForm() {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      idNumber: '',
      location: '',
      dateOfBirth: ''
    },
    education: {
      highestQualification: '',
      institution: '',
      yearOfGraduation: '',
      tscNumber: '',
      additionalCertifications: ''
    },
    experience: {
      yearsOfExperience: '',
      previousSchools: '',
      subjectsTaught: [],
      curriculumExperience: [],
      specializations: []
    },
    availability: {
      preferredSchedule: '',
      maxHoursPerWeek: '',
      preferredLocation: '',
      onlineTeaching: false
    },
    documents: {
      cv: null,
      certificates: [],
      tscCertificate: null,
      goodConduct: null
    },
    additionalInfo: {
      teachingPhilosophy: '',
      whyJoinUs: '',
      references: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const curricula = ['CBC', 'IGCSE', 'British Curriculum']
  const subjects = [
    'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
    'Social Studies', 'Kiswahili', 'French', 'German', 'Computer Studies',
    'Art', 'Music', 'PE', 'Geography', 'History', 'Economics'
  ]
  const locations = [
    'Westlands', 'Karen', 'Runda', 'Kilimani', 'Kileleshwa', 
    'Lavington', 'Parklands', 'Eastleigh', 'Online Only', 'Any Location'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsSubmitting(false)
    alert('Thank you! Your application has been submitted. We\'ll review it and get back to you within 48 hours.')
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: checked
          ? [...(prev.experience[field as keyof typeof prev.experience] as string[]), value]
          : (prev.experience[field as keyof typeof prev.experience] as string[]).filter(item => item !== value)
      }
    }))
  }

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Education & Qualifications', icon: GraduationCap },
    { number: 3, title: 'Teaching Experience', icon: Award },
    { number: 4, title: 'Availability & Preferences', icon: FileText }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Teacher Application Form
            </h2>
            <p className="text-xl text-gray-600">
              Complete this form to join our network of qualified teachers
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
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
                        required
                        value={formData.personalInfo.fullName}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.personalInfo.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.personalInfo.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.idNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, idNumber: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="National ID number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <select
                        required
                        value={formData.personalInfo.location}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select location</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Education & Qualifications */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
                    Education & Qualifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Highest Qualification *
                      </label>
                      <select
                        required
                        value={formData.education.highestQualification}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          education: { ...prev.education, highestQualification: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select qualification</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.education.institution}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          education: { ...prev.education, institution: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="University/College name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Graduation *
                      </label>
                      <input
                        type="number"
                        required
                        min="1980"
                        max="2024"
                        value={formData.education.yearOfGraduation}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          education: { ...prev.education, yearOfGraduation: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Year"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        TSC Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.education.tscNumber}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          education: { ...prev.education, tscNumber: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="TSC registration number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Certifications
                      </label>
                      <textarea
                        value={formData.education.additionalCertifications}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          education: { ...prev.education, additionalCertifications: e.target.value }
                        }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="List any additional certifications, training, or professional development courses"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Teaching Experience */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Teaching Experience
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Teaching Experience *
                      </label>
                      <select
                        required
                        value={formData.experience.yearsOfExperience}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          experience: { ...prev.experience, yearsOfExperience: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="2-3">2-3 years</option>
                        <option value="4-5">4-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Previous Schools/Institutions
                      </label>
                      <textarea
                        value={formData.experience.previousSchools}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          experience: { ...prev.experience, previousSchools: e.target.value }
                        }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="List schools or institutions where you have taught"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subjects You Can Teach *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                        {subjects.map(subject => (
                          <label key={subject} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.experience.subjectsTaught.includes(subject)}
                              onChange={(e) => handleArrayChange('subjectsTaught', subject, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{subject}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Curriculum Experience *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {curricula.map(curriculum => (
                          <label key={curriculum} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.experience.curriculumExperience.includes(curriculum)}
                              onChange={(e) => handleArrayChange('curriculumExperience', curriculum, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{curriculum}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Availability & Preferences */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-orange-600" />
                    Availability & Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Schedule *
                      </label>
                      <select
                        required
                        value={formData.availability.preferredSchedule}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          availability: { ...prev.availability, preferredSchedule: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select schedule</option>
                        <option value="mornings">Mornings (8 AM - 12 PM)</option>
                        <option value="afternoons">Afternoons (1 PM - 5 PM)</option>
                        <option value="evenings">Evenings (5 PM - 8 PM)</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Hours Per Week *
                      </label>
                      <select
                        required
                        value={formData.availability.maxHoursPerWeek}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          availability: { ...prev.availability, maxHoursPerWeek: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select hours</option>
                        <option value="1-5">1-5 hours</option>
                        <option value="6-10">6-10 hours</option>
                        <option value="11-15">11-15 hours</option>
                        <option value="16-20">16-20 hours</option>
                        <option value="20+">20+ hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Teaching Location *
                      </label>
                      <select
                        required
                        value={formData.availability.preferredLocation}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          availability: { ...prev.availability, preferredLocation: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select location</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.availability.onlineTeaching}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          availability: { ...prev.availability, onlineTeaching: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        I'm available for online teaching
                      </label>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teaching Philosophy
                    </label>
                    <textarea
                      value={formData.additionalInfo.teachingPhilosophy}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        additionalInfo: { ...prev.additionalInfo, teachingPhilosophy: e.target.value }
                      }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your teaching philosophy and approach to education"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why do you want to join Patience Home Schools?
                    </label>
                    <textarea
                      value={formData.additionalInfo.whyJoinUs}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        additionalInfo: { ...prev.additionalInfo, whyJoinUs: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us why you're interested in joining our platform"
                    />
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                    className="btn-primary"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

