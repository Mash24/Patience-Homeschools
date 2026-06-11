'use client'

import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'

const steps = [
  {
    step: '01',
    title: 'Share Your Needs',
    description: 'Tell us about your child\'s curriculum, subjects, schedule, and learning goals.',
  },
  {
    step: '02',
    title: 'Receive Your Shortlist',
    description: 'Within 48 hours, we present qualified teachers matched to your exact requirements.',
  },
  {
    step: '03',
    title: 'Meet & Choose',
    description: 'Review profiles, credentials, and teaching styles. Select the perfect fit.',
  },
  {
    step: '04',
    title: 'Begin Learning',
    description: 'Start in-home or online sessions with ongoing support from our team.',
  },
]

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="How It Works"
          title="From enquiry to first lesson in four steps"
          description="Our concierge matching process removes the guesswork from finding the right educator for your family."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="card-elevated p-8 h-full">
                <span className="font-serif text-4xl font-light text-gold-300 group-hover:text-gold-500 transition-colors">
                  {item.step}
                </span>
                <h3 className="font-serif text-xl font-semibold text-ink mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
