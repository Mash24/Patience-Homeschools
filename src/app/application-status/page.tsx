'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  ArrowLeft,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react'

interface ApplicationStatus {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  status: string
  applicationDate: string
  subjects: string[]
  curricula: string[]
  gradeLevels: string[]
  experienceYears: number
  educationBackground: string
  teachingPhilosophy: string
  availability: string[]
  hourlyRateRange: string
  tscNumber: string
}

function ApplicationStatusContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  
  const [application, setApplication] = useState<ApplicationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (email) {
      fetchApplicationStatus()
    } else {
      setError('No email provided')
      setLoading(false)
    }
  }, [email])

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch('/api/duplicate-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          action: 'check-user'
        })
      })

      const result = await response.json()
      
      if (result.success && result.data.teacherApplication) {
        setApplication(result.data.teacherApplication)
      } else {
        setError('Application not found')
      }
    } catch (error) {
      console.error('Error fetching application status:', error)
      setError('Failed to load application status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'submitted':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5" />
      case 'pending':
        return <Clock className="h-5 w-5" />
      case 'rejected':
        return <XCircle className="h-5 w-5" />
      case 'submitted':
        return <Eye className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg font-medium text-gray-900">Loading application status...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Status</h1>
                <p className="text-gray-600">Track your teacher application progress</p>
              </div>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">Current Status:</span>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application?.status || '')}`}>
              {getStatusIcon(application?.status || '')}
              <span className="capitalize">{application?.status}</span>
            </div>
          </div>
        </motion.div>

        {/* Application Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{application?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-gray-900">{application?.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">{application?.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Location</p>
                  <p className="text-gray-900">{application?.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Application Date</p>
                  <p className="text-gray-900">{formatDate(application?.applicationDate || '')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Professional Information</span>
          </h2>
          
          <div className="space-y-6">
            {/* Subjects */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {application?.subjects?.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {subject}
                  </span>
                )) || <span className="text-gray-500 text-sm">No subjects specified</span>}
              </div>
            </div>

            {/* Curricula */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Curricula</h3>
              <div className="flex flex-wrap gap-2">
                {application?.curricula?.map((curriculum, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {curriculum}
                  </span>
                )) || <span className="text-gray-500 text-sm">No curricula specified</span>}
              </div>
            </div>

            {/* Grade Levels */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Grade Levels</h3>
              <div className="flex flex-wrap gap-2">
                {application?.gradeLevels?.map((level, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {level}
                  </span>
                )) || <span className="text-gray-500 text-sm">No grade levels specified</span>}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Experience</h3>
              <p className="text-gray-900">{application?.experienceYears} years of teaching experience</p>
            </div>

            {/* Hourly Rate */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Hourly Rate Range</h3>
              <p className="text-gray-900">{application?.hourlyRateRange}</p>
            </div>

            {/* Education Background */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Education Background</h3>
              <p className="text-gray-900">{application?.educationBackground}</p>
            </div>

            {/* Teaching Philosophy */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Teaching Philosophy</h3>
              <p className="text-gray-900">{application?.teachingPhilosophy}</p>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {application?.availability?.map((time, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {time}
                  </span>
                )) || <span className="text-gray-500 text-sm">No availability specified</span>}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-900">Loading application status...</span>
        </div>
      </motion.div>
    </div>
  )
}

export default function ApplicationStatusPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ApplicationStatusContent />
    </Suspense>
  )
}
