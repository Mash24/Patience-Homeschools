'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone, Mail } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-brand-gold/20 bg-brand-gold/10 px-8 py-12 text-center"
        >
          <h2 className="text-3xl font-serif text-brand-navy">
            Ready to begin?
          </h2>
          <p className="mt-3 text-brand-charcoal/80">
            Speak to an advisor and receive a shortlist within 48 hours.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link 
              href="/hire-teacher" 
              className="inline-flex h-12 items-center rounded-xl bg-brand-gold px-6 text-brand-navy hover:bg-brand-gold/90 transition-colors font-semibold"
            >
              Request a Private Tutor
            </Link>
            <Link 
              href="/teacher-apply" 
              className="inline-flex h-12 items-center rounded-xl border border-brand-gold/40 px-6 text-brand-navy hover:bg-brand-gold/10 transition-colors font-semibold"
            >
              Apply as Elite Educator
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
