import Link from 'next/link'
import {
  Star,
  MapPin,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Clock,
  BadgeCheck,
  Sparkles,
} from 'lucide-react'
import PageHero from '@/components/ui/PageHero'

interface Review {
  rating: number
  comment?: string | null
  created_at: string
}

interface TeacherPublicProfileProps {
  teacher: {
    id: string
    full_name?: string
    name?: string
    bio?: string
    subjects?: string[]
    curricula?: string[]
    grade_levels?: string[]
    location_area?: string
    city?: string
    years_experience?: number
    experience_years?: number
    teaching_philosophy?: string
    education_background?: string
    availability?: string[]
    hourly_rate_range?: string
    tsc_number?: string
    is_featured?: boolean
    is_verified?: boolean
  }
  reviews: Review[]
  verifiedDocCount: number
}

export default function TeacherPublicProfile({
  teacher,
  reviews,
  verifiedDocCount,
}: TeacherPublicProfileProps) {
  const name = teacher.full_name || teacher.name || 'Educator'
  const experience = teacher.years_experience || teacher.experience_years || 0
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null

  const availabilityLabels: Record<string, string> = {
    mornings: 'Mornings',
    afternoons: 'Afternoons',
    evenings: 'Evenings',
    weekends: 'Weekends',
  }

  return (
    <div className="min-h-screen bg-ivory">
      <PageHero
        eyebrow="Our educators"
        title={name}
        subtitle={`${(teacher.curricula || [])[0] || 'Multi-curriculum'} specialist · ${experience}+ years experience`}
      />

      <div className="container-custom section-padding max-w-5xl">
        <Link
          href="/hire-teacher"
          className="inline-flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to find a tutor
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {teacher.bio && (
              <div className="card-elevated p-6">
                <h2 className="font-serif text-lg font-semibold text-ink mb-3">About</h2>
                <p className="text-ink-muted leading-relaxed whitespace-pre-line">{teacher.bio}</p>
              </div>
            )}

            {teacher.teaching_philosophy && (
              <div className="card-elevated p-6">
                <h2 className="font-serif text-lg font-semibold text-ink mb-3">Teaching approach</h2>
                <p className="text-ink-muted leading-relaxed whitespace-pre-line">{teacher.teaching_philosophy}</p>
              </div>
            )}

            {teacher.education_background && (
              <div className="card-elevated p-6">
                <h2 className="font-serif text-lg font-semibold text-ink mb-3">Education</h2>
                <p className="text-ink-muted leading-relaxed whitespace-pre-line">{teacher.education_background}</p>
              </div>
            )}

            <div className="card-elevated p-6">
              <h2 className="font-serif text-lg font-semibold text-ink mb-4">Subjects & curricula</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {(teacher.subjects || []).map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-sm bg-gold-50 text-gold-800">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(teacher.curricula || []).map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full text-sm bg-ivory-dark text-ink">{c}</span>
                ))}
              </div>
              {(teacher.grade_levels || []).length > 0 && (
                <div className="mt-4 pt-4 border-t border-ink/5">
                  <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-2">Grade levels</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.grade_levels!.map((g) => (
                      <span key={g} className="px-2.5 py-1 rounded-lg text-xs bg-ivory text-ink">{g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {reviews.length > 0 && (
              <div className="card-elevated p-6">
                <h2 className="font-serif text-lg font-semibold text-ink mb-4">Parent reviews</h2>
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <div key={i} className="border-b border-ink/5 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-4 w-4 ${j < r.rating ? 'fill-gold-400 text-gold-400' : 'text-ink/15'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-ink-muted">
                          {new Date(r.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {r.comment && <p className="text-sm text-ink-muted">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card-elevated p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-ink flex items-center justify-center mx-auto relative">
                <span className="font-serif text-2xl font-semibold text-gold-400">
                  {name.charAt(0)}
                </span>
                {teacher.is_featured && (
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </span>
                )}
              </div>

              {teacher.is_featured && (
                <p className="text-center text-xs font-semibold uppercase tracking-wide text-gold-700">
                  Featured educator
                </p>
              )}

              {avgRating != null && (
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                  <span className="font-semibold text-ink">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-ink-muted">({reviews.length} reviews)</span>
                </div>
              )}

              <div className="space-y-2.5 text-sm text-ink-muted">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-500 shrink-0" />
                  {teacher.location_area || teacher.city || 'Nairobi'}
                </p>
                <p className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gold-500 shrink-0" />
                  {(teacher.subjects || []).slice(0, 3).join(', ') || 'Multiple subjects'}
                </p>
                <p className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gold-500 shrink-0" />
                  {teacher.tsc_number ? 'TSC registered' : 'TSC verification pending'}
                </p>
                {(teacher.is_verified || verifiedDocCount > 0) && (
                  <p className="flex items-center gap-2 text-green-700">
                    <BadgeCheck className="h-4 w-4 shrink-0" />
                    Verified by Nelimac
                  </p>
                )}
                {teacher.hourly_rate_range && (
                  <p className="text-ink font-medium pt-1">{teacher.hourly_rate_range}</p>
                )}
                {(teacher.availability || []).length > 0 && (
                  <div className="pt-2">
                    <p className="flex items-center gap-2 text-xs font-medium text-ink mb-1.5">
                      <Clock className="h-3.5 w-3.5 text-gold-500" /> Availability
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.availability!.map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded-md text-xs bg-ivory-dark text-ink">
                          {availabilityLabels[a] || a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/hire-teacher?teacher=${teacher.id}`}
                className="btn-primary w-full text-center"
              >
                Request this tutor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
