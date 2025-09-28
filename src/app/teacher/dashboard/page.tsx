'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Upload,
  Download,
  Calendar,
  Star,
  Award,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface TeacherProfile {
  id: string
  full_name: string
  email: string
  phone: string
  location_area: string
  subjects: string[]
  curricula: string[]
  grade_levels: string[]
  experience_years: number
  education_background: string
  teaching_philosophy: string
  availability: string[]
  hourly_rate_range: string
  tsc_number: string
  status: string
  application_date: string
  review_date?: string
  approved_date?: string
  rejection_reason?: string
  is_featured: boolean
  is_verified: boolean
}

interface ProvisionalApplication {
  id: string
  email: string
  full_name: string
  phone: string
  location_area: string
  subjects: string[]
  curricula: string[]
  grade_levels: string[]
  experience_years: number
  education_background: string
  teaching_philosophy: string
  availability: string[]
  hourly_rate_range: string
  tsc_number: string
  status: string
  application_date: string
  review_date?: string
  rejection_reason?: string
}

interface Document {
  id: string
  kind: string
  file_name: string
  file_path: string
  verified_at?: string
  rejection_reason?: string
}

interface Assignment {
  id: string
  parent_id: string
  child_id: string
  subject: string
  student_level: string
  location: string
  status: string
  hourly_rate: number
  parent: {
    full_name: string
    email: string
    phone: string
  }
  child: {
    full_name: string
    level: string
  }
}

interface ClassSession {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  location: string
  notes: string
  assignment: {
    subject: string
    child: {
      full_name: string
    }
    parent: {
      full_name: string
    }
  }
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', icon: FileText, label: 'Draft' },
  submitted: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Under Review' },
  under_review: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Under Review' },
  approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
  suspended: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' }
}

export default function TeacherDashboard() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [provisionalApplication, setProvisionalApplication] = useState<ProvisionalApplication | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Load teacher profile
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single()

      if (teacherError) {
        console.error('Error loading teacher data:', teacherError)
        
        // If teacher profile doesn't exist, check if user has a profile with teacher role
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userProfile && userProfile.role === 'teacher') {
          // User has teacher role but no teacher record - redirect to complete application
          console.log('User has teacher role but no teacher record, redirecting to teacher-apply')
          router.push('/teacher-apply')
          return
        }

        // Try to load provisional application
        const { data: provisionalData, error: provisionalError } = await supabase
          .from('provisional_applications')
          .select('*')
          .eq('email', user.email)
          .order('application_date', { ascending: false })
          .limit(1)
          .single()

        if (!provisionalError && provisionalData) {
          setProvisionalApplication(provisionalData)
        } else {
          // No provisional application either - redirect to teacher-apply
          console.log('No teacher record or provisional application found, redirecting to teacher-apply')
          router.push('/teacher-apply')
        }
        return
      }

      setProfile(teacherData)

      // Also load provisional application for tracking
      const { data: provisionalData, error: provisionalError } = await supabase
        .from('provisional_applications')
        .select('*')
        .eq('email', user.email)
        .order('application_date', { ascending: false })
        .limit(1)
        .single()

      if (!provisionalError && provisionalData) {
        setProvisionalApplication(provisionalData)
      }

      // Load documents
      const { data: docsData, error: docsError } = await supabase
        .from('teacher_documents')
        .select('*')
        .eq('teacher_id', user.id)

      if (docsError) {
        console.error('Error loading documents:', docsError)
      } else {
        setDocuments(docsData || [])
      }

      // Load assignments with parent and child data
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select(`
          *,
          parent:profiles(full_name, email, phone),
          child:children(full_name, level)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })

      if (assignmentsError) {
        console.error('Error loading assignments:', assignmentsError)
      } else {
        setAssignments(assignmentsData || [])
      }

      // Load sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('class_sessions')
        .select(`
          *,
          assignment:assignments(
            subject,
            child:children(full_name),
            parent:profiles(full_name)
          )
        `)
        .in('assignment_id', assignmentsData?.map(a => a.id) || [])
        .order('day_of_week', { ascending: true })

      if (sessionsError) {
        console.error('Error loading sessions:', sessionsError)
      } else {
        setSessions(sessionsData || [])
      }

    } catch (error) {
      console.error('Error loading teacher data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find your teacher profile.</p>
          <button
            onClick={() => router.push('/teacher-apply')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Application
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusConfig(profile.status)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {profile.full_name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {profile.full_name}</h1>
                <p className="text-gray-600">Teacher Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${statusInfo.color}`}>
                <statusInfo.icon className="h-4 w-4" />
                <span>{statusInfo.label}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'application', label: 'Application', icon: FileText },
                { id: 'students', label: 'My Students', icon: Users },
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'profile', label: 'Profile', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Status Card */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Status</h2>
                      <p className="text-gray-600">
                        {profile.status === 'approved' 
                          ? 'Congratulations! Your application has been approved. You can now start teaching.'
                          : profile.status === 'rejected'
                          ? 'Your application was not approved at this time.'
                          : 'Your application is currently under review. We\'ll notify you once it\'s processed.'
                        }
                      </p>
                      {profile.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Reason:</strong> {profile.rejection_reason}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${statusInfo.color}`}>
                      <div className="flex items-center space-x-2">
                        <statusInfo.icon className="h-5 w-5" />
                        <span className="font-semibold">{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Subjects</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.subjects.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.experience_years} years</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Documents</p>
                        <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Timeline */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Application Submitted</p>
                        <p className="text-sm text-gray-600">{formatDate(profile.application_date)}</p>
                      </div>
                    </div>

                    {profile.review_date && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Under Review</p>
                          <p className="text-sm text-gray-600">{formatDate(profile.review_date)}</p>
                        </div>
                      </div>
                    )}

                    {profile.approved_date && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Application Approved</p>
                          <p className="text-sm text-gray-600">{formatDate(profile.approved_date)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'application' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Application Status</h2>
                
                {provisionalApplication ? (
                  <div className="space-y-6">
                    {/* Application Status Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[provisionalApplication.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {statusConfig[provisionalApplication.status as keyof typeof statusConfig]?.label || provisionalApplication.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Application Date</p>
                          <p className="font-medium">{new Date(provisionalApplication.application_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-medium">{provisionalApplication.experience_years} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">{provisionalApplication.location_area}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rate Range</p>
                          <p className="font-medium">{provisionalApplication.hourly_rate_range}</p>
                        </div>
                      </div>
                    </div>

                    {/* Application Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Application Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.subjects.map((subject, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Curricula</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.curricula.map((curriculum, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                                {curriculum}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Grade Levels</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.grade_levels.map((level, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Availability</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.availability.map((time, index) => (
                              <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Education & Philosophy */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Education & Philosophy</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Education Background</p>
                          <p className="text-gray-900">{provisionalApplication.education_background}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Teaching Philosophy</p>
                          <p className="text-gray-900">{provisionalApplication.teaching_philosophy}</p>
                        </div>
                        
                        {provisionalApplication.tsc_number && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">TSC Number</p>
                            <p className="text-gray-900">{provisionalApplication.tsc_number}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Messages */}
                    {provisionalApplication.status === 'submitted' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-medium text-blue-900">Under Review</h3>
                        </div>
                        <p className="text-blue-800">
                          Your application is currently being reviewed by our team. We'll notify you once the review is complete.
                        </p>
                      </div>
                    )}

                    {provisionalApplication.status === 'rejected' && provisionalApplication.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <XCircle className="h-5 w-5 text-red-600" />
                          <h3 className="text-lg font-medium text-red-900">Application Rejected</h3>
                        </div>
                        <p className="text-red-800 mb-2">Reason for rejection:</p>
                        <p className="text-red-700">{provisionalApplication.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No application found</p>
                    <p className="text-sm text-gray-500">If you've submitted an application, it may still be processing</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">My Students</h2>
                
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No students assigned yet</p>
                    <p className="text-sm text-gray-500">Students will appear here once admin assigns them to you</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {assignment.child.full_name}
                            </h3>
                            <p className="text-sm text-gray-600">{assignment.subject} • {assignment.student_level}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assignment.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {assignment.location}
                          </div>
                          {assignment.hourly_rate && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              KES {assignment.hourly_rate}/hour
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Parent Contact</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {assignment.parent.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {assignment.parent.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Weekly Schedule</h2>
                
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No sessions scheduled</p>
                    <p className="text-sm text-gray-500">Sessions will appear here once assigned</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {session.assignment.subject}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {session.day_of_week}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {session.start_time} - {session.end_time}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {session.assignment.child.full_name}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {session.location || 'TBD'}
                          </div>
                        </div>
                        
                        {session.notes && (
                          <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-lg">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
                  {profile.status === 'draft' || profile.status === 'rejected' ? (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload New</span>
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map(doc => (
                    <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {doc.kind.replace('_', ' ')}
                            </h3>
                            <p className="text-sm text-gray-600">{doc.file_name}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.verified_at 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.verified_at ? 'Verified' : 'Pending'}
                        </div>
                      </div>

                      {doc.rejection_reason && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Rejection Reason:</strong> {doc.rejection_reason}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">View</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                          <Download className="h-4 w-4" />
                          <span className="text-sm">Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.full_name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={profile.location_area}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.subjects.map(subject => (
                          <span key={subject} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Curricula</label>
                      <div className="flex flex-wrap gap-2">
                        {profile.curricula.map(curriculum => (
                          <span key={curriculum} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {curriculum}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                      <p className="text-gray-900">{profile.experience_years} years</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                      <p className="text-gray-900">{profile.hourly_rate_range}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Background</label>
                  <textarea
                    value={profile.education_background}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Philosophy</label>
                  <textarea
                    value={profile.teaching_philosophy}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
