'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, TrendingUp, Users, Calendar, Star, BookOpen } from 'lucide-react'
import { getPlatformAnalytics, type PlatformAnalytics } from '@/lib/admin/analytics'

function BarChart({
  title,
  data,
  color = 'bg-gold-500',
}: {
  title: string
  data: { label: string; count: number }[]
  color?: string
}) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <div>
      <p className="text-sm font-medium text-ink mb-3">{title}</p>
      <div className="flex items-end gap-2 h-36">
        {data.map((m) => {
          const height = Math.max((m.count / max) * 100, m.count > 0 ? 8 : 2)
          return (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-ink">{m.count}</span>
              <div className={`w-full ${color} rounded-t-md transition-all`} style={{ height: `${height}%` }} />
              <span className="text-[10px] text-ink-muted text-center leading-tight">{m.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusFunnel({
  title,
  items,
  href,
}: {
  title: string
  items: { status: string; count: number }[]
  href?: string
}) {
  const total = items.reduce((s, i) => s + i.count, 0) || 1
  const colors: Record<string, string> = {
    new: 'bg-gold-500',
    submitted: 'bg-yellow-500',
    shortlisted: 'bg-yellow-400',
    matched: 'bg-green-500',
    closed: 'bg-ivory-dark',
    active: 'bg-green-500',
    completed: 'bg-purple-500',
    cancelled: 'bg-red-400',
    approved: 'bg-green-600',
    rejected: 'bg-red-500',
    under_review: 'bg-gold-400',
    pending: 'bg-yellow-500',
  }

  return (
    <div className="card-elevated p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-ink">{title}</h3>
        {href && (
          <Link href={href} className="text-xs text-gold-600 hover:text-gold-700">View →</Link>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">No data yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.status}>
              <div className="flex justify-between text-xs mb-1">
                <span className="capitalize text-ink-muted">{item.status.replace(/_/g, ' ')}</span>
                <span className="font-medium text-ink">{item.count}</span>
              </div>
              <div className="h-2 bg-ivory rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors[item.status] || 'bg-ink/30'}`}
                  style={{ width: `${Math.max((item.count / total) * 100, item.count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ReportsDashboard() {
  const [data, setData] = useState<PlatformAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlatformAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-gold-600" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-ink-muted text-center py-12">Could not load reports.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Platform reports</h1>
        <p className="mt-1 text-sm text-ink-muted">Leads, assignments, teachers, and engagement metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Leads this month', value: data.leadsThisMonth, icon: Users },
          { label: 'Assignments', value: data.assignmentsThisMonth, icon: Calendar },
          { label: 'Sessions logged', value: data.sessionsLoggedThisMonth, icon: BookOpen },
          { label: 'Avg rating', value: data.averageReviewRating ?? '—', icon: Star },
          { label: 'Lead → match %', value: data.conversionRate != null ? `${data.conversionRate}%` : '—', icon: TrendingUp },
          { label: 'Reviews total', value: data.reviewsTotal, icon: Star },
        ].map((item) => (
          <div key={item.label} className="card-elevated p-4">
            <item.icon className="h-5 w-5 text-gold-600 mb-2" />
            <p className="text-2xl font-bold text-ink">{item.value}</p>
            <p className="text-xs text-ink-muted mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <BarChart title="Parent leads (last 6 months)" data={data.leadsByMonth} />
        </div>
        <div className="card-elevated p-6">
          <BarChart title="New assignments (last 6 months)" data={data.assignmentsByMonth} color="bg-purple-500" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatusFunnel title="Lead pipeline" items={data.leadsByStatus} href="/admin/leads" />
        <StatusFunnel title="Assignments" items={data.assignmentsByStatus} href="/admin/assignments" />
        <StatusFunnel title="Teachers" items={data.teachersByStatus} href="/admin/teachers" />
      </div>

      <div className="card-elevated p-6">
        <h3 className="font-medium text-ink mb-4">Engagement snapshot</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Newsletter subscribers', value: data.subscribersTotal },
            { label: 'Event registrations', value: data.registrationsTotal },
            { label: 'Pending documents', value: data.pendingDocuments, href: '/admin/documents' },
            { label: 'Total reviews', value: data.reviewsTotal, href: '/admin/reviews' },
          ].map((item) => (
            <div
              key={item.label}
              className={`bg-ivory rounded-xl p-4 ${'href' in item && item.href ? 'cursor-pointer hover:bg-gold-50' : ''}`}
              onClick={'href' in item && item.href ? () => { window.location.href = item.href as string } : undefined}
            >
              <p className="text-xl font-bold text-ink">{item.value}</p>
              <p className="text-xs text-ink-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
