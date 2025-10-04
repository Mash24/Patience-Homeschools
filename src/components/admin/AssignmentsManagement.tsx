'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  User,
  GraduationCap,
  DollarSign,
  Search,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { getAssignments, updateAssignmentStatus } from '@/app/admin/assignments/actions'

interface Assignment {
  id: string
  parent_id: string
  teacher_id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  start_date: string
  end_date: string
  hourly_rate: number
  total_hours: number
  notes: string
  created_at: string
  parent: {
    full_name: string
    child_name: string
    email: string
    phone: string
  }
  teacher: {
    full_name: string
    email: string
    phone: string
    subjects: string[]
  }
}

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadAssignments()
  }, [selectedStatus])

  const loadAssignments = async () => {
    try {
      setLoading(true)
      const data = await getAssignments(selectedStatus === 'all' ? undefined : selectedStatus)
      setAssignments(data || [])
    } catch (error) {
      console.error('Error loading assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus
    const matchesSearch = assignment.teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.parent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.parent.child_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleStatusUpdate = async (assignmentId: string, newStatus: string) => {
    try {
      setActionLoading(assignmentId)
      await updateAssignmentStatus(assignmentId, newStatus)
      await loadAssignments()
    } catch (error) {
      console.error('Error updating assignment status:', error)
      alert('Failed to update assignment status. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'active': return CheckCircle
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const handleStatusChange = (assignmentId: string, newStatus: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === assignmentId 
        ? { ...assignment, status: newStatus as any }
        : assignment
    ))
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assignments Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage teacher-parent assignments and classes</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
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
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Assignment</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total', count: assignments.length, color: 'bg-gray-500' },
          { label: 'Pending', count: assignments.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Active', count: assignments.filter(a => a.status === 'active').length, color: 'bg-green-500' },
          { label: 'Completed', count: assignments.filter(a => a.status === 'completed').length, color: 'bg-purple-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-sm sm:text-lg font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate & Hours
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
              {filteredAssignments.map((assignment) => {
                const StatusIcon = getStatusIcon(assignment.status)
                return (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {assignment.teacher.subjects?.[0]?.substring(0, 2).toUpperCase() || 'AS'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.parent.full_name} → {assignment.teacher.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Started: {new Date(assignment.start_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {assignment.teacher.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{assignment.teacher.full_name}</div>
                          <div className="text-sm text-gray-500">{assignment.teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {assignment.parent.child_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{assignment.parent.child_name}</div>
                          <div className="text-sm text-gray-500">{assignment.parent.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {assignment.teacher.subjects?.join(', ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">KSh {assignment.hourly_rate.toLocaleString()}/hr</div>
                      <div className="text-sm text-gray-500">{assignment.total_hours} hours</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {assignment.status === 'active' && (
                          <button
                            onClick={() => handleStatusUpdate(assignment.id, 'completed')}
                            disabled={actionLoading === assignment.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {actionLoading === assignment.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        {assignment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(assignment.id, 'cancelled')}
                            disabled={actionLoading === assignment.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
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

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Assignment Details</h3>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teacher</label>
                  <p className="text-sm text-gray-900">{selectedAssignment.teacher.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">{selectedAssignment.parent.child_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent</label>
                  <p className="text-sm text-gray-900">{selectedAssignment.parent.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subjects</label>
                  <p className="text-sm text-gray-900">{selectedAssignment.teacher.subjects?.join(', ')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedAssignment.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="text-sm text-gray-900">
                    {selectedAssignment.end_date ? new Date(selectedAssignment.end_date).toLocaleDateString() : 'Ongoing'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <p className="text-sm text-gray-900">KSh {selectedAssignment.hourly_rate.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Hours</label>
                  <p className="text-sm text-gray-900">{selectedAssignment.total_hours}</p>
                </div>
              </div>
              
              {selectedAssignment.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{selectedAssignment.notes}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAssignment(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedAssignment.status === 'pending' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedAssignment.id, 'active')
                    setSelectedAssignment(null)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Activate
                </button>
              )}
              {selectedAssignment.status === 'active' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedAssignment.id, 'completed')
                    setSelectedAssignment(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New Assignment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Teacher</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Mike Wilson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Parent</label>
                  <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Sarah Johnson</option>
                    <option>Michael Kimani</option>
                    <option>Grace Wanjiku</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mathematics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <input
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about the assignment..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
