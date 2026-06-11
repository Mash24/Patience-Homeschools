'use client'

import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { subscribe } from '@/lib/newsletter'

const explore = [
  { name: 'Programmes', href: '/curricula' },
  { name: 'Find a Tutor', href: '/hire-teacher' },
  { name: 'Resources', href: '/resources' },
  { name: 'Events', href: '/events' },
  { name: 'Apply as Teacher', href: '/teacher-apply' },
]

const company = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Track Tutor Request', href: '/my-request' },
  { name: 'Teacher Application Status', href: '/application-status' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                <span className="font-serif text-lg font-semibold text-ink">N</span>
              </div>
              <div>
                <span className="block font-serif text-xl font-semibold leading-none">Nelimac Learning</span>
                <span className="block text-xs text-white/50 mt-0.5">Nairobi&apos;s Premier Education Network</span>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm mb-8">
              Curated TSC-certified educators, concierge tutor matching, and exclusive learning experiences for discerning families.
            </p>
            <form action={subscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                name="email"
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold-500 text-ink font-semibold rounded-full text-sm hover:bg-gold-400 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400 mb-5">Explore</h3>
            <ul className="space-y-3">
              {explore.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-gold-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400 mb-5">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-gold-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-400 mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
                Nairobi, Kenya
              </li>
              <li>
                <a href="tel:+254700000000" className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 transition-colors">
                  <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                  +254 700 000 000
                </a>
              </li>
              <li>
                <a href="mailto:info@nelimaclearning.co.ke" className="flex items-center gap-3 text-sm text-white/60 hover:text-gold-400 transition-colors">
                  <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                  info@nelimaclearning.co.ke
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-gold-500 hover:text-ink transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-gold mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Nelimac Learning. All rights reserved.</p>
          <p>Built with care for Nairobi&apos;s education community.</p>
        </div>
      </div>
    </footer>
  )
}
