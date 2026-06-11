'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
const testimonials = [
  {
    name: 'Sarah Kimani',
    location: 'Karen',
    text: 'Nelimac connected us with the perfect teacher for our daughter. The personalised approach has transformed her learning experience.',
    child: 'Grade 6, IGCSE',
  },
  {
    name: 'David Mwangi',
    location: 'Westlands',
    text: 'Outstanding service. Our son went from struggling in maths to excelling within three months. The matching was spot-on.',
    child: 'Grade 8, CBC',
  },
  {
    name: 'Grace Wanjiku',
    location: 'Kilimani',
    text: 'The quality of teachers is exceptional — professional, patient, and truly understand how children learn best.',
    child: 'Grade 4, British',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(201,162,39,0.12),transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="Families trust Nelimac"
          description="Real stories from parents who found their perfect educator."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <Quote className="h-7 w-7 text-gold-400/40 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">&ldquo;{item.text}&rdquo;</p>
              <footer>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/50 mt-1">{item.child} · {item.location}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#teacher-matching-form"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 text-ink font-semibold rounded-full hover:bg-gold-400 transition-colors text-base"
          >
            Start Your Request
          </a>
        </div>
      </div>
    </section>
  )
}
