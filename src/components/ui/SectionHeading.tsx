'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl mb-12 md:mb-16 ${alignClass}`}
    >
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${light ? 'text-gold-300' : 'text-gold-600'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight ${light ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? 'text-white/70' : 'text-ink-muted'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
