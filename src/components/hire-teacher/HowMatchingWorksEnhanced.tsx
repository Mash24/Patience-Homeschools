'use client'

import { motion } from 'framer-motion'
import { FileText, Users, CheckCircle, Rocket } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const steps = [
  {
    step: '01',
    title: 'Submit Your Requirements',
    description: 'Tell us about your child\'s curriculum, subjects, schedule, and learning goals.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'We Match You',
    description: 'Our team reviews your request and shortlists qualified, TSC-certified teachers within 48 hours.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Review & Choose',
    description: 'Compare teacher profiles, credentials, and rates. Interview your top picks.',
    icon: CheckCircle,
  },
  {
    step: '04',
    title: 'Start Learning',
    description: 'Begin in-home or online sessions with ongoing support from our team.',
    icon: Rocket,
  },
]

export default function HowMatchingWorksEnhanced() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="The Process"
          title="How matching works"
          description="A concierge process designed to find the right educator — not just any educator."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-8 text-center"
            >
              <span className="font-serif text-3xl font-light text-gold-300">{item.step}</span>
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mx-auto my-4">
                <item.icon className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
