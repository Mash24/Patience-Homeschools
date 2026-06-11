'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, MapPin, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { getTeacherSuggestionsForLead, type TeacherSuggestion } from '@/lib/matching/suggestions'

export default function TeacherMatchSuggestions({ leadId }: { leadId: string }) {
  const [suggestions, setSuggestions] = useState<TeacherSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getTeacherSuggestionsForLead(leadId)
      .then(setSuggestions)
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [leadId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted py-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Finding matches...
      </div>
    )
  }

  if (!suggestions.length) {
    return (
      <p className="text-sm text-ink-muted">
        No strong matches found — try shortlisting the lead and browsing teachers manually.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-600 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" /> Suggested teachers
      </h4>
      {suggestions.map((t, i) => (
        <div key={t.id} className="border border-ink/10 rounded-xl p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-ink text-sm flex items-center gap-1.5">
                #{i + 1} {t.full_name}
                {t.is_featured && <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />}
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Match score: <span className="font-semibold text-gold-700">{t.score}</span>
                {t.experience_years != null && ` · ${t.experience_years}y exp`}
              </p>
            </div>
            <Link
              href={`/admin/assignments/new?leadId=${leadId}&teacherId=${t.id}`}
              className="text-xs text-gold-600 hover:text-gold-800 flex items-center gap-1 shrink-0"
            >
              Assign <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {t.location_area && (
            <p className="text-xs text-ink-muted flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {t.location_area}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {t.subjects.slice(0, 3).map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-gold-50 text-gold-800">{s}</span>
            ))}
          </div>
          <ul className="text-[11px] text-ink-muted space-y-0.5">
            {t.reasons.slice(0, 3).map((r) => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
