'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const testimonials = [
  {
    name: 'Sarah Mwangi',
    role: 'Parent — CBC, Westlands',
    content: 'Nelimac connected us with an amazing teacher who understood my daughter\'s learning style. The support has been invaluable.',
  },
  {
    name: 'David Kimani',
    role: 'Parent — IGCSE, Karen',
    content: 'The lab sessions and community events have made homeschooling feel less isolating. My son has gained real practical experience.',
  },
  {
    name: 'Grace Wanjiku',
    role: 'Parent — British Curriculum, Runda',
    content: 'The matching process was thorough. We found the perfect educator for our son, and the results speak for themselves.',
  },
]

export default function Testimonials() {
  return (
    <section className="section-padding bg-ink text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(201,162,39,0.12),transparent)]" />
      <div className="container-custom relative">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by Nairobi families"
          description="Hear from parents who've found their perfect educator through Nelimac."
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
            >
              <Quote className="h-8 w-8 text-gold-400/40 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed text-sm mb-6">&ldquo;{item.content}&rdquo;</p>
              <footer>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/50 mt-1">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
