'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, BookOpen } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const teachers = [
  { name: 'Grace M.', subjects: 'Mathematics, Physics', curriculum: 'IGCSE', location: 'Karen', rating: 4.9, experience: '8 years' },
  { name: 'James K.', subjects: 'English, Literature', curriculum: 'British', location: 'Westlands', rating: 4.8, experience: '6 years' },
  { name: 'Mary W.', subjects: 'Science, CBC', curriculum: 'CBC', location: 'Kilimani', rating: 5.0, experience: '10 years' },
  { name: 'Peter O.', subjects: 'Chemistry, Biology', curriculum: 'IGCSE', location: 'Runda', rating: 4.9, experience: '7 years' },
]

export default function FeaturedTeachersEnhanced() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Our Network"
          title="Featured educators"
          description="A sample of the TSC-certified teachers in our vetted network."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="card-elevated p-6"
            >
              <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center mb-4">
                <span className="font-serif text-lg font-semibold text-gold-400">
                  {teacher.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-ink">{teacher.name}</h3>
              <p className="text-xs text-gold-600 font-medium mt-1">{teacher.curriculum}</p>
              <div className="flex items-center gap-1 mt-2 mb-3">
                <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                <span className="text-sm text-ink-muted">{teacher.rating}</span>
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
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-ink-muted mt-8">
          Submit a request to receive a personalised shortlist matched to your needs.
        </p>
      </div>
    </section>
  )
}
