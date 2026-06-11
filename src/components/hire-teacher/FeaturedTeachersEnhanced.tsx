'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, MapPin, BookOpen, Loader2 } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

interface FeaturedTeacher {
  id: string
  name: string
  subjects: string
  curriculum: string
  location: string
  rating: number | null
  reviewCount?: number
  experience: string
  isFeatured?: boolean
}

export default function FeaturedTeachersEnhanced() {
  const [teachers, setTeachers] = useState<FeaturedTeacher[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/teachers/featured')
      .then((r) => r.json())
      .then((d) => setTeachers(d.teachers || []))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Our Network"
          title="Featured educators"
          description="TSC-certified teachers from our vetted network — approved and ready to teach."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
          </div>
        ) : teachers.length === 0 ? (
          <p className="text-center text-ink-muted text-sm py-8">
            Featured teachers will appear here as our network grows.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/teachers/${teacher.id}`} className="card-elevated p-6 block hover:shadow-luxury transition-shadow h-full">
                  <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center mb-4">
                    <span className="font-serif text-lg font-semibold text-gold-400">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{teacher.name}</h3>
                    {teacher.isFeatured && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold text-gold-700 bg-gold-100 px-1.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gold-600 font-medium mt-1">{teacher.curriculum}</p>
                  <div className="flex items-center gap-1 mt-2 mb-3">
                    {teacher.rating != null ? (
                      <>
                        <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                        <span className="text-sm text-ink-muted">{teacher.rating}</span>
                        {teacher.reviewCount ? (
                          <span className="text-xs text-ink-muted">({teacher.reviewCount})</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-xs text-ink-muted">New · no reviews yet</span>
                    )}
                    <span className="text-xs text-ink-muted ml-1">· {teacher.experience}</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {teacher.subjects}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold-500 shrink-0" />
                      {teacher.location}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-center text-sm text-ink-muted mt-8">
          All teachers are TSC-verified. Submit a request and we&apos;ll match you with the best fit.
        </p>
      </div>
    </section>
  )
}
