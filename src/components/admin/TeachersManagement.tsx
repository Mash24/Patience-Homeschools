'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Search,
  Filter,
  Star,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { approveTeacher, rejectTeacher, getTeachers, getTeacherDocuments, toggleTeacherFeatured } from '@/app/admin/teachers/actions'
import { getAdminDocumentUrl, verifyTeacherDocument, rejectTeacherDocument } from '@/lib/teachers/documents'

interface Teacher {
  id: string
  full_name: string
  email: string
  phone: string
  location: string
  subjects: string[]
  experience_years: number
  education_level: string
  tsc_number: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  is_featured?: boolean
  rejection_reason?: string
  created_at: string
}

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [teacherDocs, setTeacherDocs] = useState<{ id: string; kind: string; file_name: string; file_path: string; verified_at?: string; rejection_reason?: string }[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadTeachers()
  }, [selectedStatus])

  useEffect(() => {
    if (selectedTeacher) {
      getTeacherDocuments(selectedTeacher.id)
        .then((docs) => setTeacherDocs(docs || []))
        .catch(() => setTeacherDocs([]))
    } else {
      setTeacherDocs([])
    }
  }, [selectedTeacher])

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const data = await getTeachers(selectedStatus === 'all' ? undefined : selectedStatus)
      setTeachers(data || [])
    } catch (error) {
      console.error('Error loading teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(teacher => {
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus
    const matchesSearch = teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800'
      case 'under_review': return 'bg-gold-50 text-gold-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-ivory-dark text-ink'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return Clock
      case 'under_review': return Eye
      case 'approved': return CheckCircle
      case 'rejected': return XCircle
      default: return Clock
    }
  }

  const handleApprove = async (teacherId: string) => {
    try {
      setActionLoading(teacherId)
      await approveTeacher(teacherId)
      await loadTeachers() // Reload data
      setSelectedTeacher(null)
    } catch (error) {
      console.error('Error approving teacher:', error)
      alert('Failed to approve teacher. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleFeatured = async (teacherId: string, featured: boolean) => {
    try {
      setActionLoading(teacherId)
      await toggleTeacherFeatured(teacherId, featured)
      await loadTeachers()
      if (selectedTeacher?.id === teacherId) {
        setSelectedTeacher((t) => (t ? { ...t, is_featured: featured } : null))
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      alert(error instanceof Error ? error.message : 'Failed to update featured status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (teacherId: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please provide a rejection reason.')
      return
    }
    
    try {
      setActionLoading(teacherId)
      await rejectTeacher(teacherId, reason)
      await loadTeachers() // Reload data
      setSelectedTeacher(null)
    } catch (error) {
      console.error('Error rejecting teacher:', error)
      alert('Failed to reject teacher. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">Teachers Management</h1>
          <p className="mt-1 text-sm text-ink-muted">Review and manage teacher applications</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/60" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total', count: teachers.length, color: 'bg-ivory0' },
          { label: 'Pending', count: teachers.filter(t => t.status === 'submitted').length, color: 'bg-yellow-500' },
          { label: 'Under Review', count: teachers.filter(t => t.status === 'under_review').length, color: 'bg-gold-500' },
          { label: 'Approved', count: teachers.filter(t => t.status === 'approved').length, color: 'bg-green-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-ink/10 p-3 sm:p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm font-medium text-ink-muted">{stat.label}</p>
                <p className="text-sm sm:text-lg font-bold text-ink">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-ink/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-ivory">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Teacher
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Subjects
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => {
                const StatusIcon = getStatusIcon(teacher.status)
                return (
                  <tr key={teacher.id} className="hover:bg-ivory">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gold-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs sm:text-sm">
                            {teacher.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div className="text-sm font-medium text-ink flex items-center gap-1.5">
                            {teacher.full_name}
                            {teacher.is_featured && teacher.status === 'approved' && (
                              <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-ink-muted">{teacher.tsc_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-ink">{teacher.email}</div>
                      <div className="text-sm text-ink-muted">{teacher.phone}</div>
                      <div className="flex items-center text-sm text-ink-muted">
                        <MapPin className="h-3 w-3 mr-1" />
                        {teacher.location}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-ink">{teacher.experience_years} years</div>
                      <div className="text-sm text-ink-muted">{teacher.education_level}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{teacher.status.replace('_', ' ')}</span>
                        <span className="sm:hidden">{teacher.status.charAt(0).toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => setSelectedTeacher(teacher)}
                          className="text-gold-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {teacher.status === 'approved' && (
                          <button
                            onClick={() => handleToggleFeatured(teacher.id, !teacher.is_featured)}
                            disabled={actionLoading === teacher.id}
                            title={teacher.is_featured ? 'Remove from featured' : 'Mark as featured'}
                            className={teacher.is_featured ? 'text-gold-600 hover:text-gold-800' : 'text-ink-muted/60 hover:text-gold-600'}
                          >
                            <Star className={`h-4 w-4 ${teacher.is_featured ? 'fill-gold-400' : ''}`} />
                          </button>
                        )}
                        {teacher.status === 'submitted' && (
                          <>
                            <button
                              onClick={() => handleApprove(teacher.id)}
                              disabled={actionLoading === teacher.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {actionLoading === teacher.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:')
                                if (reason) handleReject(teacher.id, reason)
                              }}
                              disabled={actionLoading === teacher.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-4 sm:p-5 border w-11/12 sm:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-ink">Teacher Details</h3>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-ink-muted/60 hover:text-ink-muted"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink">Full Name</label>
                  <p className="text-sm text-ink">{selectedTeacher.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">TSC Number</label>
                  <p className="text-sm text-ink">{selectedTeacher.tsc_number}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink">Email</label>
                  <p className="text-sm text-ink">{selectedTeacher.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Phone</label>
                  <p className="text-sm text-ink">{selectedTeacher.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink">Location</label>
                <p className="text-sm text-ink">{selectedTeacher.location}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink">Subjects</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedTeacher.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink">Experience</label>
                  <p className="text-sm text-ink">{selectedTeacher.experience_years} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Education</label>
                  <p className="text-sm text-ink">{selectedTeacher.education_level}</p>
                </div>
              </div>
              
              {selectedTeacher.status === 'approved' && (
                <div className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-ink">Featured on hire page</p>
                    <p className="text-xs text-ink-muted">Show this teacher in the featured educators section</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(selectedTeacher.id, !selectedTeacher.is_featured)}
                    disabled={actionLoading === selectedTeacher.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedTeacher.is_featured
                        ? 'bg-gold-500 text-white'
                        : 'bg-white border border-ink/10 text-ink-muted hover:text-ink'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${selectedTeacher.is_featured ? 'fill-white' : ''}`} />
                    {selectedTeacher.is_featured ? 'Featured' : 'Not featured'}
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink">Documents</label>
                <div className="mt-1 space-y-2">
                  {teacherDocs.length === 0 ? (
                    <p className="text-sm text-ink-muted">No documents uploaded.</p>
                  ) : (
                    teacherDocs.map((doc) => (
                      <div key={doc.id} className="flex flex-wrap items-center gap-2 p-2 bg-ivory rounded-lg">
                        <FileText className="h-4 w-4 text-ink-muted/60 shrink-0" />
                        <span className="text-sm text-ink flex-1 capitalize">{doc.kind.replace(/_/g, ' ')} · {doc.file_name}</span>
                        {doc.verified_at ? (
                          <span className="text-xs text-green-700">Verified</span>
                        ) : doc.rejection_reason ? (
                          <span className="text-xs text-red-600">Rejected</span>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="text-gold-600 hover:text-gold-800 text-xs"
                              onClick={async () => {
                                const url = await getAdminDocumentUrl(doc.file_path)
                                window.open(url, '_blank')
                              }}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="text-green-600 text-xs"
                              onClick={async () => {
                                await verifyTeacherDocument(doc.id)
                                const docs = await getTeacherDocuments(selectedTeacher.id)
                                setTeacherDocs(docs || [])
                              }}
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              className="text-red-600 text-xs"
                              onClick={async () => {
                                const reason = prompt('Rejection reason:')
                                if (!reason) return
                                await rejectTeacherDocument(doc.id, reason)
                                const docs = await getTeacherDocuments(selectedTeacher.id)
                                setTeacherDocs(docs || [])
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-2 border border-ink/10 rounded-md text-sm font-medium text-ink hover:bg-ivory"
              >
                Close
              </button>
              {selectedTeacher.status === 'submitted' && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedTeacher.id)
                      setSelectedTeacher(null)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason:')
                      if (reason) {
                        handleReject(selectedTeacher.id, reason)
                        setSelectedTeacher(null)
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
