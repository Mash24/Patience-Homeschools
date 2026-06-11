import Link from 'next/link'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-500 text-ink hover:bg-gold-400 shadow-sm hover:shadow-gold',
  secondary:
    'bg-ink text-white hover:bg-ink-light',
  outline:
    'border border-ink/15 text-ink hover:border-gold-500 hover:text-gold-700 bg-white/80',
  ghost:
    'text-ink-muted hover:text-ink hover:bg-ink/5',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

interface ButtonProps {
  href?: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  onClick,
  type = 'button',
  disabled,
}: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
