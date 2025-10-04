'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { 
  UserCheck, 
  ClipboardList, 
  TrendingUp, 
  AlertCircle, 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar,
  FileText,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Shield,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  pendingApplications: number
  activeTeachers: number
  totalParents: number
  activeAssignments: number
  newLeadsToday: number
  newLeadsThisWeek: number
  documentsToVerify: number
  projectedPayouts: number
  complianceIssues: number
}

interface RecentActivity {
  id: string
  type: 'application' | 'lead' | 'assignment' | 'document' | 'session' | 'payout'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'info' | 'error'
}

export default function AdminDashboardClient() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    pendingApplications: 0,
    activeTeachers: 0,
    totalParents: 0,
    activeAssignments: 0,
    newLeadsToday: 0,
    newLeadsThisWeek: 0,
    documentsToVerify: 0,
    projectedPayouts: 0,
    complianceIssues: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load pending applications
      const { count: pendingApps } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'under_review'])

      // Load active teachers
      const { count: activeTeachers } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')

      // Load total parents
      const { count: totalParents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'parent')

      // Load active assignments
      const { count: activeAssignments } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Load new leads today
      const today = new Date().toISOString().split('T')[0]
      const { count: newLeadsToday } = await supabase
        .from('parent_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      // Load new leads this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { count: newLeadsThisWeek } = await supabase
        .from('parent_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo)

      // Load documents to verify
      const { count: documentsToVerify } = await supabase
        .from('teacher_documents')
        .select('*', { count: 'exact', head: true })
        .is('verified_at', null)

      setStats({
        pendingApplications: pendingApps || 0,
        activeTeachers: activeTeachers || 0,
        totalParents: totalParents || 0,
        activeAssignments: activeAssignments || 0,
        newLeadsToday: newLeadsToday || 0,
        newLeadsThisWeek: newLeadsThisWeek || 0,
        documentsToVerify: documentsToVerify || 0,
        projectedPayouts: 0, // TODO: Calculate from completed sessions
        complianceIssues: 0 // TODO: Calculate compliance issues
      })

      // Load recent activity (mock data for now)
      setRecentActivity([
        {
          id: '1',
          type: 'application',
          title: 'New Teacher Application',
          description: 'Sarah Johnson applied for Mathematics and Science',
          timestamp: '2 hours ago',
          status: 'info'
        },
        {
          id: '2',
          type: 'lead',
          title: 'Lead Qualified',
          description: 'Parent in Westlands looking for CBC tutor',
          timestamp: '4 hours ago',
          status: 'success'
        },
        {
          id: '3',
          type: 'assignment',
          title: 'Assignment Created',
          description: 'Michael Chen assigned to Grade 6 student',
          timestamp: '6 hours ago',
          status: 'success'
        },
        {
          id: '4',
          type: 'document',
          title: 'Document Verified',
          description: 'TSC certificate verified for John Doe',
          timestamp: '1 day ago',
          status: 'success'
        },
        {
          id: '5',
          type: 'session',
          title: 'Session Completed',
          description: 'Mathematics session completed with Grade 8 student',
          timestamp: '1 day ago',
          status: 'success'
        }
      ])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return UserCheck
      case 'lead': return Users
      case 'assignment': return BookOpen
      case 'document': return FileText
      case 'session': return Calendar
      case 'payout': return DollarSign
      default: return Activity
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage operations and monitor platform health</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadDashboardData}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Approvals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/applications')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pendingApplications}</p>
                <p className="text-xs text-gray-500 mt-1">Teacher applications</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>Review applications</span>
            </div>
          </motion.div>

          {/* New Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/leads')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Leads</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.newLeadsToday}</p>
                <p className="text-xs text-gray-500 mt-1">Today ({stats.newLeadsThisWeek} this week)</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>Manage leads</span>
            </div>
          </motion.div>

          {/* Active Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/assignments')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.activeAssignments}</p>
                <p className="text-xs text-gray-500 mt-1">Teacher-student pairs</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>View assignments</span>
            </div>
          </motion.div>

          {/* Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/documents')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents to Verify</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.documentsToVerify}</p>
                <p className="text-xs text-gray-500 mt-1">Pending verification</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-amber-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>Verify documents</span>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/leads/new')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">New Lead</p>
                <p className="text-sm text-gray-500">Add parent inquiry</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/applications')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Review Applications</p>
                <p className="text-sm text-gray-500">Approve/reject teachers</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/assignments/new')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Create Assignment</p>
                <p className="text-sm text-gray-500">Match teacher & student</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/documents')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Verify Documents</p>
                <p className="text-sm text-gray-500">Check certifications</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const colorClasses = getActivityColor(activity.status)
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-start space-x-3 p-4 rounded-lg border ${colorClasses}`}
                >
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Platform Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Active Teachers</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.activeTeachers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Registered Parents</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalParents}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Active Assignments</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.activeAssignments}</span>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">High Application Volume</p>
                  <p className="text-sm text-yellow-700">12 new applications received today</p>
                  <p className="text-xs text-yellow-600 mt-1">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">System Performance</p>
                  <p className="text-sm text-blue-700">All systems running optimally</p>
                  <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
