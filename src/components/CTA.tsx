'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 sm:px-16 sm:py-20 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(201,162,39,0.2),transparent)]" />
          <div className="relative max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
              Get Started
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
              Ready to find the perfect tutor?
            </h2>
            <p className="mt-4 text-lg text-white/60 leading-relaxed">
              Speak to an advisor and receive a curated shortlist within 48 hours.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/hire-teacher" size="lg">
                Request a Private Tutor
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/teacher-apply" variant="outline" size="lg" className="!border-white/20 !text-white hover:!bg-white/10 hover:!border-white/30">
                Apply as an Educator
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
