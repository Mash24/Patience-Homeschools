'use client'

import { motion } from 'framer-motion'
import { Shield, Clock, Users, ArrowRight } from 'lucide-react'

const highlights = [
  { icon: Shield, text: 'TSC-certified teachers only' },
  { icon: Clock, text: 'Shortlist within 48 hours' },
  { icon: Users, text: 'Personal concierge matching' },
]

export default function HireTeacherHeroEnhanced() {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,162,39,0.18),transparent)]" />
      <div className="container-custom relative pt-28 pb-16 lg:pt-36 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
            Find a Tutor
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1]">
            The right teacher, matched to your child
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            Tell us what you need. We&apos;ll handpick qualified educators from our
            vetted network and send you a curated shortlist — no guesswork required.
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            {highlights.map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-white/60">
                <item.icon className="h-4 w-4 text-gold-400" />
                {item.text}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="#teacher-matching-form"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              Start your request below
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
