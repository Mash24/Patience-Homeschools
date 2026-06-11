'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

const navigation = [
  { name: 'Programmes', href: '/curricula' },
  { name: 'Find a Tutor', href: '/hire-teacher' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/90 backdrop-blur-xl border-b border-ink/5 shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center group-hover:bg-gold-500 transition-colors duration-300">
              <span className="font-serif text-lg font-semibold text-gold-400 group-hover:text-ink">N</span>
            </div>
            <div>
              <span className="block font-serif text-xl font-semibold text-ink leading-none">Nelimac</span>
              <span className="block text-[10px] uppercase tracking-[0.15em] text-ink-muted mt-0.5">Learning</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-gold-600'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button href="/signin" variant="ghost" size="sm">
              Sign In
            </Button>
            <Button href="/hire-teacher" size="sm">
              Find a Tutor
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-ink hover:text-gold-600 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-ink/5 pt-4 animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-gold-50 text-gold-700'
                      : 'text-ink-muted hover:bg-ivory-dark hover:text-ink'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-ink/5 flex flex-col gap-3 px-4">
              <Button href="/hire-teacher" className="w-full">
                Find a Tutor
              </Button>
              <Button href="/signin" variant="outline" className="w-full">
                Sign In
              </Button>
              <Button href="/teacher-apply" variant="ghost" className="w-full">
                Apply as a Teacher
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
