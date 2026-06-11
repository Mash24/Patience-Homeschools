'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { submitTeacherReview } from '@/lib/reviews/actions'

export default function ReviewForm({
  teacherId,
  assignmentId,
  teacherName,
  existingReview,
  onSubmitted,
}: {
  teacherId: string
  assignmentId: string
  teacherName: string
  existingReview?: { rating: number; comment?: string } | null
  onSubmitted?: () => void
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(!!existingReview)

  const handleSubmit = async () => {
    if (rating < 1) return
    setSaving(true)
    try {
      await submitTeacherReview({ teacherId, assignmentId, rating, comment })
      setDone(true)
      onSubmitted?.()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to submit review')
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    const displayRating = existingReview?.rating || rating
    const displayComment = existingReview?.comment || comment
    return (
      <div className="mt-4 p-4 bg-sage-50 rounded-xl border border-sage-200">
        <p className="text-sm font-medium text-ink">Your review</p>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: displayRating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
          ))}
        </div>
        {displayComment && (
          <p className="text-sm text-ink-muted mt-2">{displayComment}</p>
        )}
        {!existingReview && (
          <p className="text-xs text-ink-muted mt-2">Thank you for reviewing {teacherName}!</p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-ivory rounded-xl border border-ink/10 space-y-3">
      <p className="text-sm font-medium text-ink">Rate {teacherName}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="p-0.5"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                n <= (hover || rating) ? 'fill-gold-400 text-gold-400' : 'text-ink/20'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        className="input-field text-sm min-h-[80px]"
        placeholder="Share your experience (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={saving || rating < 1}
        className="btn-primary text-sm"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit review'}
      </button>
    </div>
  )
}
