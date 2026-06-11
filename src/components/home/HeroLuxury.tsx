'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react'
import Button from '@/components/ui/Button'

const stats = [
  { value: '200+', label: 'Certified Teachers' },
  { value: '98%', label: 'Parent Satisfaction' },
  { value: '15+', label: 'Curricula Supported' },
]

export default function HeroLuxury() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-ivory overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(201,162,39,0.08),transparent)]" />
      <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-ivory z-10" />
        <Image
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop"
          alt="Child learning with a private tutor"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>

      <div className="container-custom relative z-20 pt-28 pb-16 lg:py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-50 border border-gold-200/60 text-gold-700 text-xs font-semibold uppercase tracking-wider mb-8">
              <ShieldCheck className="h-3.5 w-3.5" />
              TSC-Certified &amp; Background-Checked
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-ink leading-[1.08]">
              Exceptional tutors for{' '}
              <span className="text-gradient-gold">exceptional</span>{' '}
              learners
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-ink-muted leading-relaxed max-w-xl">
              Nairobi&apos;s premier education network. Handpicked, TSC-certified educators
              for in-home and online learning across CBC, IGCSE, and British programmes.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button href="/hire-teacher" size="lg">
                Request a Private Tutor
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/teacher-apply" variant="outline" size="lg">
                <GraduationCap className="h-5 w-5" />
                Join Our Faculty
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl font-semibold text-ink">{stat.value}</p>
                  <p className="text-sm text-ink-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:hidden mt-12 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury">
          <Image
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop"
            alt="Child learning with a private tutor"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  )
}
