'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, BookOpen, Calendar, MapPin, DollarSign } from 'lucide-react'

export default function TeacherMatchingForm() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    curriculum: '',
    subjects: [],
    grade: '',
    preferredSchedule: '',
    location: '',
    budget: '',
    additionalRequirements: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const curricula = ['CBC', 'IGCSE', 'British Curriculum']
  const subjects = [
    'Mathematics', 'English', 'Science', 'Social Studies', 'Kiswahili',
    'French', 'German', 'Computer Studies', 'Art', 'Music', 'PE'
  ]
  const locations = [
    'Westlands', 'Karen', 'Runda', 'Kilimani', 'Kileleshwa', 
    'Lavington', 'Parklands', 'Eastleigh', 'Online Only', 'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    setFormData({
      parentName: '',
      email: '',
      phone: '',
      childName: '',
      childAge: '',
      curriculum: '',
      subjects: [],
      grade: '',
      preferredSchedule: '',
      location: '',
      budget: '',
      additionalRequirements: ''
    })
    
    setIsSubmitting(false)
    alert('Thank you! We\'ll match you with suitable teachers within 24 hours.')
  }

  const handleSubjectChange = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

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
              Tell Us About Your Needs
            </h2>
            <p className="text-xl text-gray-600">
              Fill out this form and we'll match you with 3 qualified teachers within 24 hours
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
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
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+254 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <select
                      required
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Child Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Child Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Child's Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.childName}
                      onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Child's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="18"
                      value={formData.childAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade/Level *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Grade 6, Year 10"
                    />
                  </div>
                </div>
              </div>

              {/* Curriculum and Subjects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Curriculum & Subjects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Curriculum *
                    </label>
                    <select
                      required
                      value={formData.curriculum}
                      onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select curriculum</option>
                      {curricula.map(curriculum => (
                        <option key={curriculum} value={curriculum}>{curriculum}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects Needed *
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {subjects.map(subject => (
                        <label key={subject} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.subjects.includes(subject)}
                            onChange={() => handleSubjectChange(subject)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{subject}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule and Budget */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Schedule & Budget
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Schedule
                    </label>
                    <select
                      value={formData.preferredSchedule}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredSchedule: e.target.value }))}
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
                      Budget Range (KES/month)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="0-10000">KSh 0 - 10,000</option>
                      <option value="10000-20000">KSh 10,000 - 20,000</option>
                      <option value="20000-30000">KSh 20,000 - 30,000</option>
                      <option value="30000+">KSh 30,000+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any specific requirements, learning styles, or additional information..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Find My Teacher</span>
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  We'll contact you within 24 hours with teacher recommendations
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

