'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Filter,
  Star,
  Award,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { updateLeadStatus } from '@/app/admin/leads/actions'

interface Parent {
  id: string
  full_name: string
  email: string
  phone: string
  location_area: string
  children: Child[]
}

interface Child {
  id: string
  full_name: string
  birthdate: string
  level: string
  notes: string
}

interface Teacher {
  id: string
  full_name: string
  email: string
  phone: string
  subjects: string[]
  curricula: string[]
  grade_levels: string[]
  experience_years: number
  location_area: string
  hourly_rate_range: string
  bio: string
  is_verified: boolean
  status: string
}

interface AssignmentData {
  teacher_id: string
  parent_id: string
  child_id: string
  subject: string
  student_level: string
  location: string
  payment_type: 'hourly' | 'contract'
  hourly_rate: number
  contract_amount: number
  schedule_notes: string
  goals: string
  start_date: string
}

function CreateAssignmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get('leadId')
  const teacherIdParam = searchParams.get('teacherId')
  
  const [currentStep, setCurrentStep] = useState(1)
  const [parents, setParents] = useState<Parent[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    teacher_id: '',
    parent_id: '',
    child_id: '',
    subject: '',
    student_level: '',
    location: '',
    payment_type: 'hourly',
    hourly_rate: 0,
    contract_amount: 0,
    schedule_notes: '',
    goals: '',
    start_date: new Date().toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

      // Load approved teachers
      const { data: teachersData } = await supabase
        .from('teachers')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      setTeachers(teachersData || [])

      if (teacherIdParam && teachersData) {
        const matchedTeacher = teachersData.find((t) => t.id === teacherIdParam)
        if (matchedTeacher) {
          setSelectedTeacher(matchedTeacher)
          setAssignmentData((prev) => ({
            ...prev,
            teacher_id: matchedTeacher.id,
            hourly_rate: parseInt(matchedTeacher.hourly_rate_range?.match(/\d+/)?.[0] || '0', 10) || prev.hourly_rate,
          }))
        }
      }

      // If leadId is provided, load the lead and pre-select parent
      if (leadId) {
        const { data: leadData } = await supabase
          .from('parent_leads')
          .select('*')
          .eq('id', leadId)
          .single()

        if (leadData) {
          const matchingParent = parentsData?.find((p) => p.email === leadData.email)
          if (matchingParent) {
            setSelectedParent(matchingParent)
            setAssignmentData((prev) => ({
              ...prev,
              parent_id: matchingParent.id,
              location: leadData.location_area || leadData.city,
              goals: leadData.goals,
              subject: leadData.subjects?.[0] || prev.subject,
              student_level: leadData.grade_level || prev.student_level,
            }))
          }
          if (teacherIdParam && teachersData?.find((t) => t.id === teacherIdParam)) {
            setCurrentStep(3)
          } else if (matchingParent) {
            setCurrentStep(2)
          }
        }
      } else if (teacherIdParam && teachersData?.find((t) => t.id === teacherIdParam)) {
        setCurrentStep(2)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAssignment = async () => {
    try {
      const { error } = await supabase
        .from('assignments')
        .insert([assignmentData])

      if (error) throw error

      if (leadId) {
        await updateLeadStatus(leadId, 'matched')
      }

      // Log admin activity
      await supabase
        .from('admin_activities')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'assignment_created',
          target_type: 'assignment',
          target_id: assignmentData.teacher_id,
          details: assignmentData
        })

      router.push('/admin/assignments')
    } catch (error) {
      console.error('Error creating assignment:', error)
    }
  }

  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
    teacher.location_area.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const steps = [
    { id: 1, title: 'Select Parent', description: 'Choose the parent and child' },
    { id: 2, title: 'Select Teacher', description: 'Match with suitable teacher' },
    { id: 3, title: 'Assignment Details', description: 'Set terms and schedule' },
    { id: 4, title: 'Review & Create', description: 'Confirm and create assignment' }
  ]

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ink">Create Assignment</h1>
          <p className="text-ink-muted mt-2">Match a teacher with a parent and child</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-gold-500 border-blue-600 text-white' 
                    : 'border-ink/10 text-ink-muted/60'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gold-600' : 'text-ink-muted/60'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-ink-muted">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-gold-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Step 1: Select Parent */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-ink">Select Parent and Child</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {parents.map((parent) => (
                  <div
                    key={parent.id}
                    onClick={() => {
                      setSelectedParent(parent)
                      setAssignmentData(prev => ({ ...prev, parent_id: parent.id }))
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedParent?.id === parent.id 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-ink/10 hover:border-ink/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink">{parent.full_name}</h4>
                        <p className="text-sm text-ink-muted">{parent.email}</p>
                        <p className="text-sm text-ink-muted">{parent.location_area}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-ink-muted">Children:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {parent.children?.map((child) => (
                          <span
                            key={child.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedChild(child)
                              setAssignmentData(prev => ({ 
                                ...prev, 
                                child_id: child.id,
                                student_level: child.level
                              }))
                            }}
                            className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                              selectedChild?.id === child.id
                                ? 'bg-gold-50 text-gold-800'
                                : 'bg-ivory-dark text-ink-muted hover:bg-gray-200'
                            }`}
                          >
                            {child.full_name} ({child.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Teacher */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-ink">Select Teacher</h3>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-muted/60" />
                <input
                  type="text"
                  placeholder="Search teachers by name, subject, or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => {
                      setSelectedTeacher(teacher)
                      setAssignmentData(prev => ({ ...prev, teacher_id: teacher.id }))
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTeacher?.id === teacher.id 
                        ? 'border-gold-500 bg-gold-50' 
                        : 'border-ink/10 hover:border-ink/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="h-12 w-12 bg-gold-50 rounded-full flex items-center justify-center">
                          <UserCheck className="h-6 w-6 text-gold-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-ink">{teacher.full_name}</h4>
                          <p className="text-sm text-ink-muted">{teacher.email}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-ink-muted">
                              {teacher.experience_years} years experience
                            </span>
                            <span className="text-sm text-ink-muted">
                              {teacher.location_area}
                            </span>
                            <span className="text-sm text-ink-muted">
                              {teacher.hourly_rate_range}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {teacher.subjects.map((subject, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gold-50 text-gold-800 text-xs rounded-full">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {teacher.is_verified && (
                          <Award className="h-4 w-4 text-green-500" />
                        )}
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Assignment Details */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-ink">Assignment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Subject</label>
                  <select
                    value={assignmentData.subject}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                  >
                    <option value="">Select subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="CRE">CRE</option>
                    <option value="IRE">IRE</option>
                    <option value="HRE">HRE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Student Level</label>
                  <input
                    type="text"
                    value={assignmentData.student_level}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, student_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                    placeholder="e.g., Grade 6, Form 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Location</label>
                  <input
                    type="text"
                    value={assignmentData.location}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                    placeholder="Teaching location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Start Date</label>
                  <input
                    type="date"
                    value={assignmentData.start_date}
                    onChange={(e) => setAssignmentData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Payment Type</label>
                  <select
                    value={assignmentData.payment_type}
                    onChange={(e) => setAssignmentData(prev => ({ 
                      ...prev, 
                      payment_type: e.target.value as 'hourly' | 'contract' 
                    }))}
                    className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                  >
                    <option value="hourly">Hourly Rate</option>
                    <option value="contract">Contract Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    {assignmentData.payment_type === 'hourly' ? 'Hourly Rate (KES)' : 'Contract Amount (KES)'}
                  </label>
                  <input
                    type="number"
                    value={assignmentData.payment_type === 'hourly' ? assignmentData.hourly_rate : assignmentData.contract_amount}
                    onChange={(e) => setAssignmentData(prev => ({ 
                      ...prev, 
                      [assignmentData.payment_type === 'hourly' ? 'hourly_rate' : 'contract_amount']: Number(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Schedule Notes</label>
                <textarea
                  value={assignmentData.schedule_notes}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, schedule_notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                  placeholder="e.g., Monday and Wednesday 4-6 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">Goals</label>
                <textarea
                  value={assignmentData.goals}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, goals: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                  placeholder="Learning objectives and goals"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-ink">Review Assignment</h3>
              
              <div className="bg-ivory rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-ink mb-3">Parent & Child</h4>
                    <div className="space-y-2">
                      <p><span className="text-ink-muted">Parent:</span> {selectedParent?.full_name}</p>
                      <p><span className="text-ink-muted">Email:</span> {selectedParent?.email}</p>
                      <p><span className="text-ink-muted">Child:</span> {selectedChild?.full_name} ({selectedChild?.level})</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-ink mb-3">Teacher</h4>
                    <div className="space-y-2">
                      <p><span className="text-ink-muted">Name:</span> {selectedTeacher?.full_name}</p>
                      <p><span className="text-ink-muted">Email:</span> {selectedTeacher?.email}</p>
                      <p><span className="text-ink-muted">Experience:</span> {selectedTeacher?.experience_years} years</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-ink mb-3">Assignment Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p><span className="text-ink-muted">Subject:</span> {assignmentData.subject}</p>
                    <p><span className="text-ink-muted">Level:</span> {assignmentData.student_level}</p>
                    <p><span className="text-ink-muted">Location:</span> {assignmentData.location}</p>
                    <p><span className="text-ink-muted">Start Date:</span> {assignmentData.start_date}</p>
                    <p><span className="text-ink-muted">Payment:</span> {assignmentData.payment_type === 'hourly' ? `KES ${assignmentData.hourly_rate}/hour` : `KES ${assignmentData.contract_amount} contract`}</p>
                  </div>
                </div>

                {assignmentData.goals && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-ink mb-2">Goals</h4>
                    <p className="text-ink-muted">{assignmentData.goals}</p>
                  </div>
                )}

                {assignmentData.schedule_notes && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-ink mb-2">Schedule</h4>
                    <p className="text-ink-muted">{assignmentData.schedule_notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 text-ink-muted hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                disabled={
                  (currentStep === 1 && (!selectedParent || !selectedChild)) ||
                  (currentStep === 2 && !selectedTeacher) ||
                  (currentStep === 3 && (!assignmentData.subject || !assignmentData.student_level))
                }
                className="flex items-center space-x-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateAssignment}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Create Assignment</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function LoadingFallback() {
  return (
    <DashboardLayout role="admin">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </DashboardLayout>
  )
}

export default function CreateAssignmentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreateAssignmentContent />
    </Suspense>
  )
}

