'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HeroLuxury() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-700">
              <ShieldCheck className="h-4 w-4" />
              TSC-Certified • Background-Checked
            </div>

            {/* Headline - Split Promise + Curriculums */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Trusted homeschool teachers for your child
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium">
                CBC • IGCSE • British Programmes
              </p>
            </div>

            {/* Subheading */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Handpicked tutors available for in-home or online learning across Nairobi. 
              Get matched with the perfect teacher for your child's needs.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start gap-3">
  <Link href="/hire-teacher" prefetch className="inline-flex">
    <button
      type="button"
      aria-label="Request a private tutor"
      data-cta="hero_request_tutor"
      className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-white font-semibold
                 hover:bg-amber-600 active:bg-amber-700 transition-colors
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="-ml-0.5"><path fill="currentColor" d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z"/></svg>
      <span>Request a Private Tutor</span>
    </button>
  </Link>

  <div className="flex flex-col">
    <Link href="/teacher-apply" prefetch className="inline-flex">
      <button
        type="button"
        aria-label="Apply to join the teaching faculty"
        data-cta="hero_join_faculty"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3
                   text-gray-700 hover:bg-gray-50 transition-colors
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3l9 5-9 5-9-5 9-5zm0 7l7.8-4.33L12 4.34 4.2 5.67 12 10zM4 13l8 4 8-4v2l-8 4-8-4v-2z"/></svg>
        <span>Apply as an Elite Teacher</span>
      </button>
    </Link>
    <span className="mt-1 text-xs text-gray-500">TSC-verified applicants only</span>
  </div>
</div>


            {/* Trust Elements - 3 Essentials */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span>Background-checked</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-amber-500" />
                <span>TSC-certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>98% parent satisfaction</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop"
                alt="Child learning with tutor in a home setting"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Micro-caption */}
            <p className="mt-4 text-sm text-gray-500 text-center">
              Private tutoring across Nairobi • CBC • IGCSE • British
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

