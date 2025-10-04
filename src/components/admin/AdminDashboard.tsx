'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface DashboardStats {
  pendingTeachers: number
  approvedTeachers: number
  newParents: number
  activeAssignments: number
  openMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingTeachers: 0,
    approvedTeachers: 0,
    newParents: 0,
    activeAssignments: 0,
    openMessages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()
        
        // Load all stats in parallel
        const [
          pendingTeachersResult,
          approvedTeachersResult,
          newParentsResult,
          activeAssignmentsResult,
          openMessagesResult
        ] = await Promise.all([
          supabase.from('teachers').select('id', { count: 'exact' }).eq('status', 'submitted'),
          supabase.from('teachers').select('id', { count: 'exact' }).eq('status', 'approved'),
          supabase.from('parents').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('assignments').select('id', { count: 'exact' }).eq('status', 'active'),
          supabase.from('message_threads').select('id', { count: 'exact' }).eq('status', 'open')
        ])

        setStats({
          pendingTeachers: pendingTeachersResult.count || 0,
          approvedTeachers: approvedTeachersResult.count || 0,
          newParents: newParentsResult.count || 0,
          activeAssignments: activeAssignmentsResult.count || 0,
          openMessages: openMessagesResult.count || 0
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Pending Teachers',
      value: stats.pendingTeachers,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      href: '/admin/teachers?status=pending'
    },
    {
      title: 'Approved Teachers',
      value: stats.approvedTeachers,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      href: '/admin/teachers?status=approved'
    },
    {
      title: 'New Parent Requests',
      value: stats.newParents,
      icon: UserCheck,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      href: '/admin/parents?status=new'
    },
    {
      title: 'Active Assignments',
      value: stats.activeAssignments,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      href: '/admin/assignments?status=active'
    },
    {
      title: 'Open Messages',
      value: stats.openMessages,
      icon: MessageSquare,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      href: '/admin/messages?status=open'
    },
    {
      title: 'System Health',
      value: '98%',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      href: '/admin/settings'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'teacher_approved',
      message: 'Teacher John Doe approved',
      timestamp: '2 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'new_parent',
      message: 'New parent request from Sarah Johnson',
      timestamp: '15 minutes ago',
      icon: UserCheck,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'assignment_created',
      message: 'Assignment created: Math tutoring',
      timestamp: '1 hour ago',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'message_received',
      message: 'New message from teacher Mike Wilson',
      timestamp: '2 hours ago',
      icon: MessageSquare,
      color: 'text-red-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage teachers, parents, and assignments for Nelimac Learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = card.href}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} mb-3 sm:mb-0`}>
                <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textColor}`} />
              </div>
              <div className="sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <activity.icon className={`h-5 w-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all activity →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Review Teacher Applications</p>
                  <p className="text-sm text-gray-500">12 pending applications</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Process Parent Requests</p>
                  <p className="text-sm text-gray-500">8 new requests</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Respond to Messages</p>
                  <p className="text-sm text-gray-500">5 unread messages</p>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Create New Assignment</p>
                  <p className="text-xs sm:text-sm text-gray-500">Match teacher with parent</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section (Placeholder) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
        <div className="h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm sm:text-base">Charts and analytics will be implemented here</p>
        </div>
      </div>
    </div>
  )
}