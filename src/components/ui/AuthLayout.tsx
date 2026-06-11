'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="container-custom py-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center group-hover:bg-gold-500 transition-colors">
            <span className="font-serif text-base font-semibold text-gold-400 group-hover:text-ink">N</span>
          </div>
          <span className="font-serif text-lg font-semibold text-ink">Nelimac Learning</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-medium text-ink">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-ink-muted">{subtitle}</p>
            )}
          </div>

          <div className="card-elevated p-8">
            {children}
          </div>

          {footer && (
            <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
