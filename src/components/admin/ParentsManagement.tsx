'use client'

import { useState, useEffect } from 'react'
import { 
  UserCheck, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  DollarSign,
  Calendar,
  Search,
  Users,
  UserPlus
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { qualifyParent, rejectParent, getParents, getAvailableTeachers } from '@/app/admin/parents/actions'
import { createAssignment } from '@/app/admin/assignments/actions'

interface Parent {
  id: string
  full_name: string
  email: string
  phone: string
  location: string
  child_name: string
  child_grade: string
  child_age: number
  subjects_needed: string[]
  budget_range: string
  schedule_preferences: string
  special_requirements: string
  status: 'pending' | 'qualified' | 'assigned' | 'completed' | 'rejected'
  created_at: string
}

interface Teacher {
  id: string
  full_name: string
  email: string
  subjects: string[]
  location: string
}

export default function ParentsManagement() {
  const [parents, setParents] = useState<Parent[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [assignmentNotes, setAssignmentNotes] = useState('')

  useEffect(() => {
    loadParents()
    loadTeachers()
  }, [selectedStatus])

  const loadParents = async () => {
    try {
      setLoading(true)
      const data = await getParents(selectedStatus === 'all' ? undefined : selectedStatus)
      setParents(data || [])
    } catch (error) {
      console.error('Error loading parents:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTeachers = async () => {
    try {
      const data = await getAvailableTeachers()
      setTeachers(data || [])
    } catch (error) {
      console.error('Error loading teachers:', error)
    }
  }

  const filteredParents = parents.filter(parent => {
    const matchesStatus = selectedStatus === 'all' || parent.status === selectedStatus
    const matchesSearch = parent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.requested_subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-yellow-100 text-yellow-800'
      case 'assigned': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock
      case 'qualified': return CheckCircle
      case 'assigned': return UserPlus
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const handleQualify = async (parentId: string) => {
    try {
      setActionLoading(parentId)
      await qualifyParent(parentId)
      await loadParents()
    } catch (error) {
      console.error('Error qualifying parent:', error)
      alert('Failed to qualify parent. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAssign = async (parentId: string) => {
    if (!selectedTeacher) {
      alert('Please select a teacher.')
      return
    }
    
    try {
      setActionLoading(parentId)
      await createAssignment(parentId, selectedTeacher, undefined, undefined, assignmentNotes)
      await loadParents()
      setShowAssignModal(false)
      setSelectedTeacher('')
      setAssignmentNotes('')
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Failed to create assignment. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const openAssignModal = (parent: Parent) => {
    setSelectedParent(parent)
    setShowAssignModal(true)
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Parents Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage parent requests and assignments</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search parents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="qualified">Qualified</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total', count: parents.length, color: 'bg-gray-500' },
          { label: 'Pending', count: parents.filter(p => p.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Qualified', count: parents.filter(p => p.status === 'qualified').length, color: 'bg-blue-500' },
          { label: 'Assigned', count: parents.filter(p => p.status === 'assigned').length, color: 'bg-green-500' },
          { label: 'Completed', count: parents.filter(p => p.status === 'completed').length, color: 'bg-purple-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent & Child
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Child Details
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParents.map((parent) => {
                const StatusIcon = getStatusIcon(parent.status)
                return (
                  <tr key={parent.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs sm:text-sm">
                            {parent.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">{parent.full_name}</div>
                          <div className="text-xs sm:text-sm text-gray-500">Parent of {parent.child_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parent.email}</div>
                      <div className="text-sm text-gray-500">{parent.phone}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {parent.location}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parent.child_name}</div>
                      <div className="text-sm text-gray-500">{parent.child_grade}</div>
                      <div className="text-sm text-gray-500">Age: {parent.child_age}</div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {parent.subjects_needed.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{parent.budget_range}</div>
                      <div className="text-sm text-gray-500">{parent.schedule_preferences}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(parent.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">{parent.status}</span>
                        <span className="sm:hidden">{parent.status.charAt(0).toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={() => setSelectedParent(parent)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {parent.status === 'pending' && (
                          <button
                            onClick={() => handleQualify(parent.id)}
                            disabled={actionLoading === parent.id}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          >
                            {actionLoading === parent.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        {parent.status === 'qualified' && (
                          <button
                            onClick={() => openAssignModal(parent)}
                            disabled={actionLoading === parent.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
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

      {/* Parent Detail Modal - Same as before but for parents */}
      {selectedParent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Parent Details</h3>
              <button
                onClick={() => setSelectedParent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                  <p className="text-sm text-gray-900">{selectedParent.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Child Name</label>
                  <p className="text-sm text-gray-900">{selectedParent.child_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedParent.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedParent.phone}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">{selectedParent.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Child Grade</label>
                  <p className="text-sm text-gray-900">{selectedParent.child_grade}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Child Age</label>
                  <p className="text-sm text-gray-900">{selectedParent.child_age} years</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Subjects</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedParent.requested_subjects.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                <p className="text-sm text-gray-900">{selectedParent.budget_range}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Schedule Preferences</label>
                <p className="text-sm text-gray-900">{selectedParent.schedule_preferences}</p>
              </div>
              
              {selectedParent.special_requirements && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
                  <p className="text-sm text-gray-900">{selectedParent.special_requirements}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedParent(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedParent.status === 'new' && (
                <button
                  onClick={() => {
                    handleQualify(selectedParent.id)
                    setSelectedParent(null)
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
                >
                  Qualify Lead
                </button>
              )}
              {selectedParent.status === 'qualified' && (
                <button
                  onClick={() => {
                    handleAssign(selectedParent.id)
                    setSelectedParent(null)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Assign Teacher
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedParent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Teacher</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Parent</label>
                <p className="text-gray-900">{selectedParent.full_name} - {selectedParent.child_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Select Teacher</label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Choose a teacher...</option>
                  {teachers
                    .filter(teacher => 
                      selectedParent.subjects_needed.some(subject => 
                        teacher.subjects?.includes(subject)
                      )
                    )
                    .map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name} - {teacher.subjects?.join(', ')} ({teacher.location})
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Assignment Notes</label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Any special instructions or notes..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAssign(selectedParent.id)}
                  disabled={actionLoading === selectedParent.id || !selectedTeacher}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading === selectedParent.id ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
