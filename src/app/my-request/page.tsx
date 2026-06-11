'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Inbox, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ParentLeadStatus from '@/components/parent/ParentLeadStatus'

function MyRequestContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lead, setLead] = useState<Record<string, unknown> | null>(null)
  const [searched, setSearched] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setLead(null)
    setSearched(false)

    try {
      const res = await fetch('/api/parent-leads/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      setSearched(true)
      if (!data.found) {
        setError('No tutor request found for this email. Try the email you used on the hire-a-teacher form.')
      } else {
        setLead({
          id: 'lookup',
          status: data.lead.status,
          child_first_name: data.lead.childFirstName,
          grade_level: data.lead.gradeLevel,
          subjects: data.lead.subjects,
          created_at: data.lead.submittedAt,
        })
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom section-padding max-w-lg">
        <Link href="/hire-teacher" className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to find a tutor
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center">
              <Inbox className="h-6 w-6 text-gold-600" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-ink">Track your tutor request</h1>
              <p className="text-sm text-ink-muted">Enter the email you used when requesting a tutor</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="card-elevated p-6 space-y-4 mb-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="input-field w-full"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Check status'}
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-4 rounded-xl mb-6">{error}</p>
          )}

          {lead && <ParentLeadStatus lead={lead as Parameters<typeof ParentLeadStatus>[0]['lead']} />}

          {searched && !lead && !error && null}

          <p className="text-xs text-ink-muted text-center mt-8">
            Have a parent account?{' '}
            <Link href="/signin?redirectTo=/parent/dashboard?tab=request" className="text-gold-600 hover:text-gold-700">
              Sign in for full portal access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function MyRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold-600" /></div>}>
      <MyRequestContent />
    </Suspense>
  )
}
