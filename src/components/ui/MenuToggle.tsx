'use client'

import { Menu, X } from 'lucide-react'
import { clsx } from 'clsx'

interface MenuToggleProps {
  open?: boolean
  onClick: () => void
  label?: string
  className?: string
}

export default function MenuToggle({ open = false, onClick, label, className }: MenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      className={clsx(
        'inline-flex items-center justify-center shrink-0',
        'h-10 w-10 rounded-xl',
        'border border-ink/10 bg-white text-ink',
        'hover:bg-gold-50 hover:border-gold-500/40 hover:text-gold-700',
        'active:scale-[0.97] transition-all duration-200',
        'shadow-sm',
        className
      )}
    >
      {open ? (
        <X className="h-5 w-5" strokeWidth={2} />
      ) : (
        <Menu className="h-5 w-5" strokeWidth={2} />
      )}
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}
