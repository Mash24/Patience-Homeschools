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
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { getAdminActions } from '@/lib/admin/actions'
import { getPlatformAnalytics, type PlatformAnalytics } from '@/lib/admin/analytics'

interface DashboardStats {
  pendingTeachers: number
  approvedTeachers: number
  newLeads: number
  newParents: number
  activeAssignments: number
  openMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingTeachers: 0,
    approvedTeachers: 0,
    newLeads: 0,
    newParents: 0,
    activeAssignments: 0,
    openMessages: 0
  })
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null)
  const [recentActivities, setRecentActivities] = useState<{
    id: string
    message: string
    timestamp: string
    icon: typeof CheckCircle
    color: string
  }[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const supabase = createClient()
        
        const [
          pendingTeachersResult,
          approvedTeachersResult,
          newLeadsResult,
          newParentsResult,
          activeAssignmentsResult,
          openMessagesResult,
          actions,
          analyticsData,
        ] = await Promise.all([
          supabase.from('teachers').select('id', { count: 'exact' }).eq('status', 'submitted'),
          supabase.from('teachers').select('id', { count: 'exact' }).eq('status', 'approved'),
          supabase.from('parent_leads').select('id', { count: 'exact' }).eq('status', 'new'),
          supabase.from('parents').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase.from('assignments').select('id', { count: 'exact' }).eq('status', 'active'),
          supabase.from('message_threads').select('id', { count: 'exact' }).eq('status', 'open'),
          getAdminActions(10).catch(() => []),
          getPlatformAnalytics().catch(() => null),
        ])

        if (analyticsData) setAnalytics(analyticsData)

        setStats({
          pendingTeachers: pendingTeachersResult.count || 0,
          approvedTeachers: approvedTeachersResult.count || 0,
          newLeads: newLeadsResult.count || 0,
          newParents: newParentsResult.count || 0,
          activeAssignments: activeAssignmentsResult.count || 0,
          openMessages: openMessagesResult.count || 0
        })

        const iconForAction = (action: string, entityType: string) => {
          if (action.includes('approve')) return { icon: CheckCircle, color: 'text-green-600' }
          if (action.includes('reject')) return { icon: AlertCircle, color: 'text-red-600' }
          if (entityType.includes('lead') || entityType.includes('parent')) return { icon: UserCheck, color: 'text-gold-600' }
          if (entityType.includes('assignment')) return { icon: Calendar, color: 'text-purple-600' }
          if (entityType.includes('message')) return { icon: MessageSquare, color: 'text-red-600' }
          return { icon: Clock, color: 'text-ink-muted' }
        }

        const formatTimeAgo = (dateStr: string) => {
          const diff = Date.now() - new Date(dateStr).getTime()
          const mins = Math.floor(diff / 60000)
          if (mins < 60) return `${mins || 1} min ago`
          const hrs = Math.floor(mins / 60)
          if (hrs < 24) return `${hrs} hr ago`
          return `${Math.floor(hrs / 24)} days ago`
        }

        setRecentActivities(
          (actions as { id: string; action: string; entity_type: string; created_at: string }[]).map((a) => {
            const { icon, color } = iconForAction(a.action, a.entity_type)
            return {
              id: a.id,
              message: `${a.action.replace(/_/g, ' ')} · ${a.entity_type.replace(/_/g, ' ')}`,
              timestamp: formatTimeAgo(a.created_at),
              icon,
              color,
            }
          })
        )
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
      title: 'New Leads',
      value: stats.newLeads,
      icon: UserCheck,
      color: 'bg-gold-500',
      bgColor: 'bg-gold-50',
      textColor: 'text-gold-700',
      href: '/admin/leads?status=new'
    },
    {
      title: 'Parent Accounts',
      value: stats.newParents,
      icon: UserCheck,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      href: '/admin/parents?status=pending'
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
      <div className="bg-white rounded-lg shadow-sm border border-ink/10 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-ink mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-ink-muted">Manage teachers, parents, and assignments for Nelimac Learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow-sm border border-ink/10 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = card.href}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className={`p-2 sm:p-3 rounded-lg ${card.bgColor} mb-3 sm:mb-0`}>
                <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.textColor}`} />
              </div>
              <div className="sm:ml-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-ink-muted mb-1">{card.title}</p>
                <p className="text-lg sm:text-xl xl:text-2xl font-bold text-ink">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-ink mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-ink-muted">No recent admin actions yet.</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-ink capitalize">{activity.message}</p>
                    <p className="text-xs text-ink-muted">{activity.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-ink/10">
            <Link href="/admin/audit" className="text-gold-600 hover:text-gold-700 text-sm font-medium">
              View all activity →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-ink mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/teachers?status=submitted" className="block w-full text-left p-3 border border-ink/10 rounded-lg hover:bg-ivory transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gold-600" />
                <div>
                  <p className="font-medium text-ink">Review Teacher Applications</p>
                  <p className="text-sm text-ink-muted">{stats.pendingTeachers} pending</p>
                </div>
              </div>
            </Link>
            
            <Link href="/admin/leads?status=new" className="block w-full text-left p-3 border border-ink/10 rounded-lg hover:bg-ivory transition-colors">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-ink">Process Parent Leads</p>
                  <p className="text-sm text-ink-muted">{stats.newLeads} new leads</p>
                </div>
              </div>
            </Link>
            
            <Link href="/admin/messages" className="block w-full text-left p-3 border border-ink/10 rounded-lg hover:bg-ivory transition-colors">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-ink">Respond to Messages</p>
                  <p className="text-sm text-ink-muted">{stats.openMessages} open threads</p>
                </div>
              </div>
            </Link>
            
            <Link href="/admin/reports" className="block w-full text-left p-3 border border-ink/10 rounded-lg hover:bg-ivory transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-ink">View platform reports</p>
                  <p className="text-sm text-ink-muted">Leads, assignments & funnel</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/assignments/new" className="block w-full text-left p-3 border border-ink/10 rounded-lg hover:bg-ivory transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-ink text-sm sm:text-base">Create New Assignment</p>
                  <p className="text-xs sm:text-sm text-ink-muted">Match teacher with parent</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {analytics && (
        <div className="bg-white rounded-lg shadow-sm border border-ink/10 p-4 sm:p-6 space-y-6">
          <h3 className="text-lg font-semibold text-ink">Analytics overview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Leads this month', value: analytics.leadsThisMonth },
              { label: 'New assignments', value: analytics.assignmentsThisMonth },
              { label: 'Reviews', value: analytics.reviewsTotal },
              { label: 'Subscribers', value: analytics.subscribersTotal },
              { label: 'Event sign-ups', value: analytics.registrationsTotal },
              { label: 'Docs to review', value: analytics.pendingDocuments, href: '/admin/documents' },
            ].map((item) => (
              <div
                key={item.label}
                className={`bg-ivory rounded-xl p-4 text-center ${'href' in item && item.href ? 'cursor-pointer hover:bg-gold-50 transition-colors' : ''}`}
                onClick={'href' in item && item.href ? () => { window.location.href = item.href as string } : undefined}
              >
                <p className="text-2xl font-bold text-ink">{item.value}</p>
                <p className="text-xs text-ink-muted mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-ink-muted mb-3">Parent leads (last 6 months)</p>
            <div className="flex items-end gap-2 h-32">
              {analytics.leadsByMonth.map((m) => {
                const max = Math.max(...analytics.leadsByMonth.map((x) => x.count), 1)
                const height = Math.max((m.count / max) * 100, m.count > 0 ? 8 : 2)
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-ink">{m.count}</span>
                    <div className="w-full bg-gold-500 rounded-t-md transition-all" style={{ height: `${height}%` }} />
                    <span className="text-[10px] text-ink-muted">{m.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}