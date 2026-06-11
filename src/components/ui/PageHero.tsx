'use client'

import { motion } from 'framer-motion'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}

export default function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,162,39,0.18),transparent)]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
      <div className="container-custom relative py-16 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1]">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
