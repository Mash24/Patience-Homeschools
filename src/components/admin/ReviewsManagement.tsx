'use client'

import { useState, useEffect } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { getAllReviews } from '@/lib/reviews/actions'

interface Review {
  id: string
  rating: number
  comment?: string
  created_at: string
  teacher?: { full_name?: string; name?: string; email?: string }
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllReviews()
      .then((data) => setReviews(data as Review[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Teacher Reviews</h1>
        <p className="mt-1 text-sm text-ink-muted">Parent feedback on assigned tutors</p>
      </div>

      {reviews.length === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          No reviews submitted yet.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const teacherName = r.teacher?.full_name || r.teacher?.name || 'Unknown teacher'
            return (
              <div key={r.id} className="card-elevated p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{teacherName}</p>
                    {r.teacher?.email && (
                      <p className="text-xs text-ink-muted">{r.teacher.email}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-ink-muted mt-3">{r.comment}</p>
                )}
                <p className="text-xs text-ink-muted/70 mt-2">
                  {new Date(r.created_at).toLocaleDateString('en-KE', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
