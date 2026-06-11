'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import MessagingPanel from '@/components/shared/MessagingPanel'
import ScheduleManager from '@/components/shared/ScheduleManager'
import SessionLogManager from '@/components/shared/SessionLogManager'
import { getTeacherRatingStats } from '@/lib/reviews/actions'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import TeacherDocumentManager from '@/components/teacher/TeacherDocumentManager'
import TeacherProfileEditor from '@/components/teacher/TeacherProfileEditor'
import TeacherAvailabilityCalendar from '@/components/teacher/TeacherAvailabilityCalendar'
import NotificationPreferences from '@/components/shared/NotificationPreferences'

interface TeacherProfile {
  id: string
  full_name: string
  email: string
  phone: string
  bio?: string
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
  draft: { color: 'bg-ivory-dark text-ink', icon: FileText, label: 'Draft' },
  submitted: { color: 'bg-gold-50 text-gold-800', icon: Clock, label: 'Under Review' },
  under_review: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Under Review' },
  approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
  suspended: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' }
}

function TeacherDashboardContent() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [provisionalApplication, setProvisionalApplication] = useState<ProvisionalApplication | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ratingStats, setRatingStats] = useState<{ average: number | null; count: number }>({ average: null, count: 0 })
  const router = useRouter()

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/signin?redirectTo=/teacher/dashboard')
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

      try {
        const stats = await getTeacherRatingStats(user.id)
        setRatingStats(stats)
      } catch {
        setRatingStats({ average: null, count: 0 })
      }

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
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ink-muted">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-ink mb-2">Profile Not Found</h2>
          <p className="text-ink-muted mb-4">We couldn't find your teacher profile.</p>
          <button
            onClick={() => router.push('/teacher-apply')}
            className="bg-gold-500 text-white px-6 py-2 rounded-lg hover:bg-gold-400 transition-colors"
          >
            Complete Application
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusConfig(profile.status)

  return (
    <TeacherLayout
      teacherName={profile.full_name}
      statusBadge={
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusInfo.color}`}>
          <statusInfo.icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{statusInfo.label}</span>
        </div>
      }
    >
      <div className="space-y-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Status Card */}
                <div className="bg-gold-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-ink mb-2">Application Status</h2>
                      <p className="text-ink-muted">
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
                  <div className="bg-white border border-ink/10 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-gold-600" />
                      </div>
                      <div>
                        <p className="text-sm text-ink-muted">Subjects</p>
                        <p className="text-2xl font-bold text-ink">{profile.subjects.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-ink/10 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-ink-muted">Experience</p>
                        <p className="text-2xl font-bold text-ink">{profile.experience_years} years</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-ink/10 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Star className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-ink-muted">Parent rating</p>
                        <p className="text-2xl font-bold text-ink">
                          {ratingStats.average != null ? `${ratingStats.average} ★` : '—'}
                        </p>
                        {ratingStats.count > 0 && (
                          <p className="text-xs text-ink-muted">{ratingStats.count} review{ratingStats.count !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Timeline */}
                <div className="bg-white border border-ink/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-ink mb-4">Application Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">Application Submitted</p>
                        <p className="text-sm text-ink-muted">{formatDate(profile.application_date)}</p>
                      </div>
                    </div>

                    {profile.review_date && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gold-50 rounded-full flex items-center justify-center">
                          <Eye className="h-4 w-4 text-gold-600" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">Under Review</p>
                          <p className="text-sm text-ink-muted">{formatDate(profile.review_date)}</p>
                        </div>
                      </div>
                    )}

                    {profile.approved_date && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-ink">Application Approved</p>
                          <p className="text-sm text-ink-muted">{formatDate(profile.approved_date)}</p>
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
                <h2 className="text-xl font-semibold text-ink">Application Status</h2>
                
                {provisionalApplication ? (
                  <div className="space-y-6">
                    {/* Application Status Card */}
                    <div className="bg-white border border-ink/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-ink">Application Details</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[provisionalApplication.status as keyof typeof statusConfig]?.color || 'bg-ivory-dark text-ink'}`}>
                          {statusConfig[provisionalApplication.status as keyof typeof statusConfig]?.label || provisionalApplication.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-ink-muted">Application Date</p>
                          <p className="font-medium">{new Date(provisionalApplication.application_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-muted">Experience</p>
                          <p className="font-medium">{provisionalApplication.experience_years} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-muted">Location</p>
                          <p className="font-medium">{provisionalApplication.location_area}</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-muted">Rate Range</p>
                          <p className="font-medium">{provisionalApplication.hourly_rate_range}</p>
                        </div>
                      </div>
                    </div>

                    {/* Application Information */}
                    <div className="bg-white border border-ink/10 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-ink mb-4">Application Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-ink-muted mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.subjects.map((subject, index) => (
                              <span key={index} className="px-2 py-1 bg-gold-50 text-gold-800 rounded-md text-sm">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-ink-muted mb-1">Curricula</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.curricula.map((curriculum, index) => (
                              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                                {curriculum}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-ink-muted mb-1">Grade Levels</p>
                          <div className="flex flex-wrap gap-2">
                            {provisionalApplication.grade_levels.map((level, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-ink-muted mb-1">Availability</p>
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
                    <div className="bg-white border border-ink/10 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-ink mb-4">Education & Philosophy</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-ink-muted mb-1">Education Background</p>
                          <p className="text-ink">{provisionalApplication.education_background}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-ink-muted mb-1">Teaching Philosophy</p>
                          <p className="text-ink">{provisionalApplication.teaching_philosophy}</p>
                        </div>
                        
                        {provisionalApplication.tsc_number && (
                          <div>
                            <p className="text-sm text-ink-muted mb-1">TSC Number</p>
                            <p className="text-ink">{provisionalApplication.tsc_number}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Messages */}
                    {provisionalApplication.status === 'submitted' && (
                      <div className="bg-gold-50 border border-gold-200 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-5 w-5 text-gold-600" />
                          <h3 className="text-lg font-medium text-blue-900">Under Review</h3>
                        </div>
                        <p className="text-gold-800">
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
                    <FileText className="h-12 w-12 text-ink-muted/60 mx-auto mb-4" />
                    <p className="text-ink-muted mb-2">No application found</p>
                    <p className="text-sm text-ink-muted">If you've submitted an application, it may still be processing</p>
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
                <h2 className="text-xl font-semibold text-ink">My Students</h2>
                
                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-ink-muted/60 mx-auto mb-4" />
                    <p className="text-ink-muted mb-2">No students assigned yet</p>
                    <p className="text-sm text-ink-muted">Students will appear here once admin assigns them to you</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="bg-white border border-ink/10 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-ink">
                              {assignment.child.full_name}
                            </h3>
                            <p className="text-sm text-ink-muted">{assignment.subject} • {assignment.student_level}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assignment.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-ivory-dark text-ink'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-ink-muted">
                            <MapPin className="h-4 w-4" />
                            {assignment.location}
                          </div>
                          {assignment.hourly_rate && (
                            <div className="flex items-center gap-2 text-sm text-ink-muted">
                              <Clock className="h-4 w-4" />
                              KES {assignment.hourly_rate}/hour
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-ink mb-2">Parent Contact</h4>
                          <div className="flex items-center gap-4 text-sm text-ink-muted">
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
                <h2 className="text-xl font-semibold text-ink">Availability & schedule</h2>
                <TeacherAvailabilityCalendar
                  availability={profile.availability || []}
                  sessions={sessions}
                />
                <ScheduleManager
                  assignments={assignments.map((a) => ({ id: a.id, subject: a.subject }))}
                  sessions={sessions}
                  onUpdated={loadTeacherData}
                />
                <SessionLogManager
                  assignments={assignments.map((a) => ({ id: a.id, subject: a.subject }))}
                />
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-ink">Messages</h2>
                {assignments.length > 0 ? (
                  <MessagingPanel assignmentId={assignments[0].id} title="Student conversations" />
                ) : (
                  <MessagingPanel title="Your conversations" />
                )}
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-ink">Your documents</h2>
                <TeacherDocumentManager
                  documents={documents}
                  onUpdated={loadTeacherData}
                  canUpload={profile.status === 'approved' || profile.status === 'draft' || profile.status === 'submitted' || profile.status === 'under_review'}
                />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-ink">Profile</h2>
                <TeacherProfileEditor
                  profile={{
                    full_name: profile.full_name,
                    email: profile.email,
                    phone: profile.phone,
                    bio: profile.bio,
                    location_area: profile.location_area,
                    hourly_rate_range: profile.hourly_rate_range,
                    availability: profile.availability,
                    teaching_philosophy: profile.teaching_philosophy,
                    education_background: profile.education_background,
                    subjects: profile.subjects,
                    curricula: profile.curricula,
                    experience_years: profile.experience_years,
                  }}
                  onSaved={loadTeacherData}
                />
                <NotificationPreferences />
              </motion.div>
            )}
      </div>
    </TeacherLayout>
  )
}

function TeacherDashboardLoading() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-muted">Loading your dashboard...</p>
      </div>
    </div>
  )
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={<TeacherDashboardLoading />}>
      <TeacherDashboardContent />
    </Suspense>
  )
}
