'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function NelimacStory() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-4">Our Story</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-ink leading-tight mb-6">
              Born from a belief that every child deserves the right teacher
            </h2>
            <div className="space-y-4 text-ink-muted leading-relaxed">
              <p>
                Nelimac Learning was founded with a simple vision: make quality education
                accessible to every family in Nairobi, regardless of curriculum or location.
              </p>
              <p>
                We noticed families struggling to find qualified teachers who could adapt to
                their children&apos;s unique learning styles. So we built a platform that
                connects TSC-certified educators with discerning families — personally, thoughtfully, and with care.
              </p>
              <p>
                Today, we&apos;re Nairobi&apos;s premier education network, trusted by hundreds
                of families across the city.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-luxury"
          >
            <Image
              src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1200&auto=format&fit=crop"
              alt="Students learning together"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
