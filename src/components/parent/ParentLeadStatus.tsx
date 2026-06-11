'use client'

import { CheckCircle, UserPlus, XCircle, Inbox } from 'lucide-react'

interface Lead {
  id: string
  status: string
  child_first_name?: string
  grade_level?: string
  subjects?: string[]
  curricula?: string[]
  mode?: string
  city?: string
  goals?: string
  created_at: string
}

const STEPS = [
  { key: 'new', label: 'Received', icon: Inbox },
  { key: 'shortlisted', label: 'Shortlisted', icon: UserPlus },
  { key: 'matched', label: 'Matched', icon: CheckCircle },
  { key: 'closed', label: 'Closed', icon: XCircle },
]

const statusOrder = ['new', 'shortlisted', 'matched', 'closed']

export default function ParentLeadStatus({ lead }: { lead: Lead }) {
  const currentIdx = statusOrder.indexOf(lead.status)

  return (
    <div className="card-elevated p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-1">Tutor request</p>
        <h2 className="font-serif text-lg font-semibold text-ink">
          {lead.child_first_name ? `${lead.child_first_name}'s tutoring request` : 'Your tutoring request'}
        </h2>
        <p className="text-sm text-ink-muted mt-1">
          Submitted {new Date(lead.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        {STEPS.filter((s) => s.key !== 'closed' || lead.status === 'closed').map((step, i) => {
          const stepIdx = statusOrder.indexOf(step.key)
          const done = lead.status === 'closed' ? step.key === 'closed' : stepIdx <= currentIdx
          const active = step.key === lead.status
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                done ? 'bg-gold-500 text-ink' : 'bg-ivory-dark text-ink-muted'
              } ${active ? 'ring-2 ring-gold-500 ring-offset-2' : ''}`}>
                <step.icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-medium ${done ? 'text-ink' : 'text-ink-muted'}`}>{step.label}</span>
            </div>
          )
        })}
      </div>

      {lead.status === 'new' && (
        <p className="text-sm text-ink-muted bg-gold-50 p-4 rounded-xl">
          We received your request and will review it shortly. Our concierge team typically responds within 1–2 business days.
        </p>
      )}
      {lead.status === 'shortlisted' && (
        <p className="text-sm text-ink-muted bg-gold-50 p-4 rounded-xl">
          You&apos;re on our shortlist — we&apos;re actively matching you with a qualified tutor.
        </p>
      )}
      {lead.status === 'matched' && (
        <p className="text-sm text-ink-muted bg-sage-50 p-4 rounded-xl">
          A tutor has been matched! Check the Teachers tab for contact details and scheduling.
        </p>
      )}
      {lead.status === 'closed' && (
        <p className="text-sm text-ink-muted bg-ivory p-4 rounded-xl">
          This request has been closed. Contact us if you&apos;d like to submit a new request.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        {lead.grade_level && (
          <div><span className="text-ink-muted">Grade:</span> <span className="text-ink">{lead.grade_level}</span></div>
        )}
        {lead.mode && (
          <div><span className="text-ink-muted">Mode:</span> <span className="text-ink capitalize">{lead.mode.replace('_', ' ')}</span></div>
        )}
        {lead.city && (
          <div><span className="text-ink-muted">Area:</span> <span className="text-ink">{lead.city}</span></div>
        )}
        {lead.subjects?.length ? (
          <div className="sm:col-span-2">
            <span className="text-ink-muted">Subjects:</span>{' '}
            <span className="text-ink">{lead.subjects.join(', ')}</span>
          </div>
        ) : null}
        {lead.goals && (
          <div className="sm:col-span-2">
            <span className="text-ink-muted">Goals:</span>{' '}
            <span className="text-ink">{lead.goals}</span>
          </div>
        )}
      </div>
    </div>
  )
}
