'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Phone, Mail } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-xl sm:rounded-2xl border border-brand-gold/20 bg-brand-gold/10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 lg:py-12 text-center"
        >
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif text-brand-navy">
            Ready to begin?
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-brand-charcoal/80 max-w-2xl mx-auto leading-relaxed">
            Speak to an advisor and receive a shortlist within 48 hours.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-row justify-center gap-2 sm:gap-3 md:gap-4">
            <Link 
              href="/hire-teacher" 
              className="inline-flex h-8 sm:h-10 md:h-12 items-center justify-center rounded-lg sm:rounded-xl bg-brand-gold px-3 sm:px-4 md:px-6 text-brand-navy hover:bg-brand-gold/90 transition-colors font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap overflow-hidden w-full sm:w-auto sm:flex-1 sm:max-w-[200px] md:max-w-none"
            >
              <span className="truncate">Request a Private Tutor</span>
            </Link>
            <Link 
              href="/teacher-apply" 
              className="inline-flex h-8 sm:h-10 md:h-12 items-center justify-center rounded-lg sm:rounded-xl border border-brand-gold/40 px-3 sm:px-4 md:px-6 text-brand-navy hover:bg-brand-gold/10 transition-colors font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap overflow-hidden w-full sm:w-auto sm:flex-1 sm:max-w-[200px] md:max-w-none"
            >
              <span className="truncate">Apply as Elite Educator</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
