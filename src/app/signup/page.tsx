'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User, CheckCircle, AlertCircle, Mail } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [applicationData, setApplicationData] = useState<any>(null)

  useEffect(() => {
    // Get email from URL params or current session
    const email = searchParams.get('email')
    const applicationId = searchParams.get('applicationId')
    
    if (email) {
      setUserEmail(email)
    } else {
      // Try to get from current session
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setUserEmail(user.email)
        }
      })
    }

    // Fetch application data if applicationId is provided
    if (applicationId) {
      fetchApplicationData(applicationId)
    }
  }, [searchParams])

  const fetchApplicationData = async (applicationId: string) => {
    try {
      // Try to fetch from teachers table first (new flow)
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (!teacherError && teacherData) {
        setApplicationData(teacherData)
        setUserEmail(teacherData.email)
        return
      }

      // Fallback to provisional_applications table (old flow)
      const { data, error } = await supabase
        .from('provisional_applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (!error && data) {
        setApplicationData(data)
        setUserEmail(data.email)
      }
    } catch (err) {
      console.error('Error fetching application data:', err)
    }
  }

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 8
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)
    const hasNumbers = /\d/.test(pwd)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    }
  }

  const passwordValidation = validatePassword(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      // Validate password strength
      if (!passwordValidation.isValid) {
        setError('Password does not meet requirements')
        return
      }

      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: {
          password_set: true,
          setup_completed: true
        }
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      // If we have application data, create/update profile
      if (applicationData) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Create profile with application data
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              role: 'teacher',
              full_name: applicationData.full_name,
              email: applicationData.email,
              phone: applicationData.phone,
              location: applicationData.location_area,
            })

          if (profileError) {
            console.error('Error creating profile:', profileError)
          }

          // Create teacher record
          const { error: teacherError } = await supabase
            .from('teachers')
            .upsert({
              id: user.id,
              full_name: applicationData.full_name,
              email: applicationData.email,
              phone: applicationData.phone,
              location_area: applicationData.location_area,
              subjects: applicationData.subjects,
              curricula: applicationData.curricula,
              grade_levels: applicationData.grade_levels,
              experience_years: applicationData.experience_years,
              education_background: applicationData.education_background,
              teaching_philosophy: applicationData.teaching_philosophy,
              availability: applicationData.availability,
              hourly_rate_range: applicationData.hourly_rate_range,
              tsc_number: applicationData.tsc_number,
              status: 'submitted',
              is_featured: false,
              is_verified: false,
              application_date: applicationData.application_date
            })

          if (teacherError) {
            console.error('Error creating teacher record:', teacherError)
          }
        }
      }

      // Redirect to appropriate dashboard based on role
      if (applicationData) {
        // Teacher application - redirect to teacher dashboard
        router.push('/teacher/dashboard')
      } else {
        // General signup - redirect to main dashboard
        router.push('/dashboard')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Registration
          </h1>
          <p className="text-gray-600">
            Set up your password to access your teacher dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field (Non-editable) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={userEmail}
                readOnly
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="your-email@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">This email is from your application and cannot be changed</p>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center space-x-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span>One uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span>One lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span>One number</span>
                </div>
                <div className={`flex items-center space-x-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className="h-4 w-4" />
                  <span>One special character</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid || password !== confirmPassword}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By completing registration, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center space-x-3">
          <User className="h-6 w-6 animate-pulse text-blue-600" />
          <span className="text-lg font-medium text-gray-900">Loading signup...</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignupContent />
    </Suspense>
  )
}
