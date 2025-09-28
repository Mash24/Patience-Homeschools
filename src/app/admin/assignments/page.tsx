'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Parent {
  id: string
  full_name: string
  phone: string
  email: string
  created_at: string
  children: Child[]
}

interface Child {
  id: string
  full_name: string
  level: string
  birthdate: string
  notes: string
}

interface Teacher {
  id: string
  full_name: string
  email: string
  phone: string
  subjects: string[]
  curricula: string[]
  status: string
}

interface Assignment {
  id: string
  teacher_id: string
  parent_id: string
  child_id: string
  subject: string
  student_level: string
  location: string
  status: string
  hourly_rate: number
  created_at: string
  teacher: {
    full_name: string
    email: string
  }
  parent: {
    full_name: string
    email: string
  }
  child: {
    full_name: string
    level: string
  }
}

export default function AdminAssignments() {
  const [parents, setParents] = useState<Parent[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedParent, setExpandedParent] = useState<string | null>(null)
  
  const [newAssignment, setNewAssignment] = useState({
    teacher_id: '',
    parent_id: '',
    child_id: '',
    subject: '',
    student_level: '',
    location: '',
    hourly_rate: '',
    status: 'active'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load parents with children
      const { data: parentsData } = await supabase
        .from('profiles')
        .select(`
          *,
          children:children(*)
        `)
        .eq('role', 'parent')
        .order('created_at', { ascending: false })

      setParents(parentsData || [])

      // Load teachers (approved first, then submitted as fallback)
      let { data: teachersData } = await supabase
        .from('teachers')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      // If no approved teachers, load submitted teachers
      if (!teachersData || teachersData.length === 0) {
        const fallbackResult = await supabase
          .from('teachers')
          .select('*')
          .eq('status', 'submitted')
          .order('created_at', { ascending: false })
        
        if (!fallbackResult.error) {
          teachersData = fallbackResult.data
        }
      }

      setTeachers(teachersData || [])

      // Load assignments with related data
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select(`
          *,
          teacher:teachers(full_name, email),
          parent:profiles(full_name, email),
          child:children(full_name, level)
        `)
        .order('created_at', { ascending: false })

      setAssignments(assignmentsData || [])

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('assignments')
        .insert({
          teacher_id: newAssignment.teacher_id,
          parent_id: newAssignment.parent_id,
          child_id: newAssignment.child_id,
          subject: newAssignment.subject,
          student_level: newAssignment.student_level,
          location: newAssignment.location,
          hourly_rate: newAssignment.hourly_rate ? parseFloat(newAssignment.hourly_rate) : null,
          status: newAssignment.status
        })

      if (error) throw error

      setNewAssignment({
        teacher_id: '',
        parent_id: '',
        child_id: '',
        subject: '',
        student_level: '',
        location: '',
        hourly_rate: '',
        status: 'active'
      })
      setShowCreateForm(false)
      loadData()
    } catch (error) {
      console.error('Error creating assignment:', error)
    }
  }

  const handleStatusChange = async (assignmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ status: newStatus })
        .eq('id', assignmentId)

      if (error) throw error

      loadData()
    } catch (error) {
      console.error('Error updating assignment status:', error)
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.parent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.child.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
              <p className="text-gray-600">Manage parent-teacher assignments</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Assignment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Parents</p>
                <p className="text-2xl font-bold text-gray-900">{parents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Assignment Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Assignment</h2>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher
                  </label>
                  <select
                    value={newAssignment.teacher_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, teacher_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.full_name} - {teacher.subjects.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent
                  </label>
                  <select
                    value={newAssignment.parent_id}
                    onChange={(e) => {
                      setNewAssignment({ 
                        ...newAssignment, 
                        parent_id: e.target.value,
                        child_id: '' // Reset child when parent changes
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Parent</option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Child
                  </label>
                  <select
                    value={newAssignment.child_id}
                    onChange={(e) => setNewAssignment({ ...newAssignment, child_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!newAssignment.parent_id}
                  >
                    <option value="">Select Child</option>
                    {parents
                      .find(p => p.id === newAssignment.parent_id)
                      ?.children.map(child => (
                        <option key={child.id} value={child.id}>
                          {child.full_name} - {child.level}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student Level
                  </label>
                  <input
                    type="text"
                    value={newAssignment.student_level}
                    onChange={(e) => setNewAssignment({ ...newAssignment, student_level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newAssignment.location}
                    onChange={(e) => setNewAssignment({ ...newAssignment, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (KES)
                  </label>
                  <input
                    type="number"
                    value={newAssignment.hourly_rate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, hourly_rate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="100"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {assignment.teacher.full_name} → {assignment.child.full_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {assignment.subject} • {assignment.student_level}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={assignment.status}
                    onChange={(e) => handleStatusChange(assignment.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(assignment.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Parent:</span>
                  {assignment.parent.full_name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location:</span>
                  {assignment.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Rate:</span>
                  {assignment.hourly_rate ? `KES ${assignment.hourly_rate}/hour` : 'Not set'}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {assignment.parent.email}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {assignment.teacher.email}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No assignments found</p>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first assignment to get started'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
