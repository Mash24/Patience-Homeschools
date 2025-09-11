'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HeroLuxury() {
  return (
    <section className="relative overflow-hidden">
      {/* background wash */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_20%,rgba(180,140,29,0.10),transparent)]" />
      <div className="container mx-auto max-w-screen-xl px-6 md:px-8 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-sm text-brand-gold">
              <ShieldCheck className="h-4 w-4" />
              TSC-Certified • Safeguarded
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-semibold leading-[1.1] text-brand-navy">
              Bespoke homeschooling by exceptional educators.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-brand-charcoal/80">
              CBC, IGCSE & British programmes—tailored to your child and delivered at home or online,
              with concierge matching and exclusive events across Nairobi.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/hire-teacher" prefetch>
                <button className="h-12 rounded-xl bg-brand-gold text-brand-navy hover:bg-brand-gold/90 px-6 font-semibold transition-all duration-300 flex items-center gap-2">
                  Request a Private Tutor <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/teacher-apply" prefetch>
                <button className="h-12 rounded-xl border border-brand-gold/40 text-brand-navy hover:bg-brand-gold/10 px-6 font-semibold transition-all duration-300">
                  Apply as Elite Educator
                </button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-charcoal/70">
              <Badge icon={<GraduationCap className="h-4 w-4" />} text="Cambridge experience" />
              <Badge icon={<ShieldCheck className="h-4 w-4" />} text="Background-checked" />
              <Badge icon={<Sparkles className="h-4 w-4" />} text="98% parent satisfaction" />
            </div>
          </motion.div>

          {/* Right: Editorial image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-soft">
              {/* Replace with your real image */}
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop"
                alt="Professional teacher working with student on educational materials"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-black/5">
      {icon}
      {text}
    </span>
  )
}

