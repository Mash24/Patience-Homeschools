'use server'

import { createClient } from '@/lib/supabase-server'

export interface StatusCount {
  status: string
  count: number
}

export interface PlatformAnalytics {
  leadsThisMonth: number
  assignmentsThisMonth: number
  reviewsTotal: number
  subscribersTotal: number
  registrationsTotal: number
  pendingDocuments: number
  leadsByMonth: { label: string; count: number }[]
  assignmentsByMonth: { label: string; count: number }[]
  leadsByStatus: StatusCount[]
  assignmentsByStatus: StatusCount[]
  teachersByStatus: StatusCount[]
  sessionsLoggedThisMonth: number
  averageReviewRating: number | null
  conversionRate: number | null
}

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()

  const [
    leadsMonth,
    assignmentsMonth,
    reviews,
    subscribers,
    registrations,
    pendingDocs,
    leadsRaw,
    assignmentsRaw,
    leadsStatusRows,
    assignmentsStatusRows,
    teachersStatusRows,
    sessionsMonth,
    reviewRatings,
    totalLeads,
    matchedLeads,
  ] = await Promise.all([
    supabase.from('parent_leads').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('assignments').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('teacher_reviews').select('id', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
    supabase.from('event_registrations').select('id', { count: 'exact', head: true }),
    supabase.from('teacher_documents').select('id', { count: 'exact', head: true }).is('verified_at', null).is('rejection_reason', null),
    supabase.from('parent_leads').select('created_at').gte('created_at', sixMonthsAgo),
    supabase.from('assignments').select('created_at').gte('created_at', sixMonthsAgo),
    supabase.from('parent_leads').select('status'),
    supabase.from('assignments').select('status'),
    supabase.from('teachers').select('status'),
    supabase.from('session_logs').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('teacher_reviews').select('rating'),
    supabase.from('parent_leads').select('id', { count: 'exact', head: true }),
    supabase.from('parent_leads').select('id', { count: 'exact', head: true }).eq('status', 'matched'),
  ])

  const monthBuckets: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' })
    monthBuckets[key] = 0
  }

  const assignmentBuckets: Record<string, number> = { ...monthBuckets }

  for (const row of leadsRaw.data || []) {
    const d = new Date(row.created_at)
    const key = d.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' })
    if (key in monthBuckets) monthBuckets[key] += 1
  }

  for (const row of assignmentsRaw.data || []) {
    const d = new Date(row.created_at)
    const key = d.toLocaleDateString('en-KE', { month: 'short', year: '2-digit' })
    if (key in assignmentBuckets) assignmentBuckets[key] += 1
  }

  const countByStatus = (rows: { status: string }[] | null): StatusCount[] => {
    const map: Record<string, number> = {}
    for (const row of rows || []) {
      map[row.status] = (map[row.status] || 0) + 1
    }
    return Object.entries(map).map(([status, count]) => ({ status, count }))
  }

  const ratings = reviewRatings.data || []
  const averageReviewRating = ratings.length
    ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) * 10) / 10
    : null

  const total = totalLeads.count || 0
  const matched = matchedLeads.count || 0
  const conversionRate = total > 0 ? Math.round((matched / total) * 100) : null

  return {
    leadsThisMonth: leadsMonth.count || 0,
    assignmentsThisMonth: assignmentsMonth.count || 0,
    reviewsTotal: reviews.count || 0,
    subscribersTotal: subscribers.count || 0,
    registrationsTotal: registrations.count || 0,
    pendingDocuments: pendingDocs.count || 0,
    leadsByMonth: Object.entries(monthBuckets).map(([label, count]) => ({ label, count })),
    assignmentsByMonth: Object.entries(assignmentBuckets).map(([label, count]) => ({ label, count })),
    leadsByStatus: countByStatus(leadsStatusRows.data),
    assignmentsByStatus: countByStatus(assignmentsStatusRows.data),
    teachersByStatus: countByStatus(teachersStatusRows.data),
    sessionsLoggedThisMonth: sessionsMonth.count || 0,
    averageReviewRating,
    conversionRate,
  }
}

export async function getNewsletterSubscribers() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) throw new Error(error.message)
  return data || []
}
