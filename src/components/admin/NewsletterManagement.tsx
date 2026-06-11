'use client'

import { useState, useEffect } from 'react'
import { Loader2, Mail, Download } from 'lucide-react'
import { getNewsletterSubscribers } from '@/lib/admin/analytics'

interface Subscriber {
  id: string
  email: string
  created_at: string
}

export default function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewsletterSubscribers()
      .then((data) => setSubscribers(data as Subscriber[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const exportCsv = () => {
    const rows = ['email,subscribed_at', ...subscribers.map((s) => `${s.email},${s.created_at}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Newsletter</h1>
          <p className="mt-1 text-sm text-ink-muted">{subscribers.length} subscribers from the site footer</p>
        </div>
        {subscribers.length > 0 && (
          <button onClick={exportCsv} className="btn-outline text-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          No subscribers yet. They&apos;ll appear when visitors subscribe via the footer.
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory border-b border-ink/5">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted hidden sm:table-cell">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-ivory/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gold-600 shrink-0" />
                      <span className="text-ink">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted hidden sm:table-cell">
                    {new Date(s.created_at).toLocaleDateString('en-KE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
