'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  Users,
  Award,
  Calendar,
  Star
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PageHero from '@/components/ui/PageHero'

export default function ParentRegistration() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    children: [{ fullName: '', birthdate: '', level: '', notes: '' }]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'parent'
          }
        }
      })

      if (authError) throw authError
      setCurrentStep(3)
    } catch (error) {
      console.error('Error creating parent account:', error)
      alert('Error creating account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <PageHero
        eyebrow="For parents"
        title="Join Nelimac Learning"
        subtitle="Register as a parent to find qualified teachers for your children"
      />

      <div className="container-custom section-padding">
        <div className="max-w-3xl mx-auto card-elevated p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-ink mb-6">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted/60" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-400 transition-colors"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-ink mb-6">Children Details</h2>
                
                <div className="bg-ivory p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-ink mb-4">Child 1</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.children[0].fullName}
                        onChange={(e) => setFormData({
                          ...formData,
                          children: [{
                            ...formData.children[0],
                            fullName: e.target.value
                          }]
                        })}
                        className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                        placeholder="Child's full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">
                        Grade Level *
                      </label>
                      <input
                        type="text"
                        value={formData.children[0].level}
                        onChange={(e) => setFormData({
                          ...formData,
                          children: [{
                            ...formData.children[0],
                            level: e.target.value
                          }]
                        })}
                        className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                        placeholder="e.g., Grade 6, Form 2"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-gray-200 text-ink rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-400 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-semibold text-ink mb-4">Account Created Successfully!</h2>
                <p className="text-ink-muted mb-6">
                  We've sent a verification link to <strong>{formData.email}</strong>. 
                  Please check your email and click the link to complete your registration.
                </p>
                
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-400 transition-colors"
                >
                  Return to Home
                </button>
              </motion.div>
            )}
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-gold-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Qualified Teachers</h3>
            <p className="text-ink-muted">All teachers are verified and TSC certified</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Flexible Scheduling</h3>
            <p className="text-ink-muted">Schedule sessions that work for your family</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Quality Assurance</h3>
            <p className="text-ink-muted">Track progress and provide feedback</p>
          </div>
        </div>
      </div>
    </div>
  )
}
