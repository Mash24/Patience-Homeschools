'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('admin@nelimaclearning.co.ke')
  const [password, setPassword] = useState('@Test123!')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  // Get email from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        setSuccess('Sign in successful! Redirecting...')
        
        // Check user role from JWT metadata
        const role = data.user.app_metadata?.role || data.user.user_metadata?.role
        console.log('Signin - User:', data.user.email)
        console.log('Signin - Role from metadata:', role)

        setTimeout(() => {
          if (role === 'admin') {
            console.log('Signin - Redirecting to admin dashboard')
            router.replace('/admin') // Use replace instead of push
          } else if (role === 'teacher') {
            console.log('Signin - Redirecting to teacher dashboard')
            router.replace('/teacher/dashboard')
          } else {
            console.log('Signin - No valid role found, redirecting to teacher application')
            router.replace('/teacher-apply')
          }
        }, 1000) // Reduced timeout
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAndCreateProfile = async (user: any) => {
    try {
      console.log('checkAndCreateProfile - Checking teacher record for user:', user.id)
      
      // Check if user has a teacher record
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('checkAndCreateProfile - Teacher record:', teacher)
      console.log('checkAndCreateProfile - Teacher error:', teacherError)
      console.log('checkAndCreateProfile - Teacher error code:', teacherError?.code)
      console.log('checkAndCreateProfile - Teacher error message:', teacherError?.message)

      // If there's a 406 error, it might be a table structure issue
      // Let's try a different approach - check if user exists in auth with teacher metadata
      if (teacherError && (teacherError.code === 'PGRST301' || teacherError.message?.includes('406'))) {
        console.log('checkAndCreateProfile - Teachers table query failed (406), checking user metadata')
        
        // Check if user has teacher metadata
        if (user.user_metadata?.role === 'teacher' || user.user_metadata?.applicationId) {
          console.log('checkAndCreateProfile - User has teacher metadata, creating profile')
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              role: 'teacher',
              full_name: user.user_metadata?.full_name || user.email,
              email: user.email,
              phone: user.user_metadata?.phone || '',
              location: user.user_metadata?.location || '',
            })

          if (!profileError) {
            console.log('checkAndCreateProfile - Profile created from metadata, redirecting to teacher dashboard')
            router.push('/teacher/dashboard')
            return
          }
        }
      }

      if (!teacherError && teacher) {
        console.log('checkAndCreateProfile - Creating profile...')
        
        // User has a teacher record, create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            role: 'teacher',
            full_name: teacher.full_name,
            email: teacher.email,
            phone: teacher.phone,
            location: teacher.location_area,
          })

        console.log('checkAndCreateProfile - Profile creation error:', profileError)

        if (!profileError) {
          console.log('checkAndCreateProfile - Profile created successfully, redirecting to teacher dashboard')
          // Profile created successfully, redirect to teacher dashboard
          router.push('/teacher/dashboard')
          return
        } else {
          console.log('checkAndCreateProfile - Profile creation failed, redirecting to teacher-apply')
        }
      } else {
        console.log('checkAndCreateProfile - No teacher record found, redirecting to teacher-apply')
      }

      // If no teacher record or profile creation failed, redirect to teacher application
      router.push('/teacher-apply')
    } catch (err) {
      console.error('Error checking/creating profile:', err)
      router.push('/teacher-apply')
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setIsResetting(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSuccess('Password reset email sent! Check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl"
          >
            <span className="text-3xl font-bold text-white">N</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Nelimac Learning teacher or admin account</p>
        </div>

        {/* Sign In Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-xl"
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}

            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>

            {/* Password Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handlePasswordReset}
              disabled={isResetting || !email}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Sending Reset Email...</span>
                </>
              ) : (
                <>
                  <span>Forgot Password?</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have a teacher account?{' '}
              <button
                onClick={() => router.push('/teacher-apply')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Apply as a Teacher
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
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
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-900">Loading sign in...</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInContent />
    </Suspense>
  )
}
