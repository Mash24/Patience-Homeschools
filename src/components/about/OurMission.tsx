'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Heart } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const missionPoints = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To connect qualified, TSC-certified educators with families seeking personalised learning solutions across Nairobi.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To become Nairobi\'s most trusted education network — where every child thrives academically and personally.',
  },
  {
    icon: Heart,
    title: 'Our Promise',
    description: 'Every family receives concierge-level support, from first enquiry to the perfect educator match.',
  },
]

export default function OurMission() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Purpose"
          title="Driven by excellence, guided by care"
          description="We're committed to educational excellence and community building, ensuring every child has access to quality education tailored to their needs."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {missionPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gold-50 flex items-center justify-center mx-auto mb-6">
                <point.icon className="h-7 w-7 text-gold-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink mb-3">{point.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '200+', label: 'Happy Families' },
            { value: '50+', label: 'Certified Teachers' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '15+', label: 'Curricula Supported' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-semibold text-ink">{stat.value}</p>
              <p className="text-sm text-ink-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
