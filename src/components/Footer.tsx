'use client'

import Link from "next/link";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { subscribe } from "@/lib/newsletter";

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="w-full bg-[#0b0b0f] text-gray-300 border-t border-white/5">
      {/* Newsletter */}
      <section aria-labelledby="newsletter" className="w-full border-b border-white/5 bg-gradient-to-r from-[#0b0b0f] via-[#0f0f15] to-[#0b0b0f]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="newsletter" className="text-xl md:text-2xl font-bold text-white mb-2">
              Stay Informed
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-6">
              Insights on elite education in Nairobi.
            </p>

            {/* ✅ Server Action instead of onSubmit */}
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action={subscribe}>
              <label className="sr-only" htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Subscribe →
              </button>
            </form>
            </div>
          </div>
      </section>

      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Desktop: Self-packing grid, Mobile: Accordion */}
        <div className="hidden md:grid [grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))] gap-8">
          {/* Brand */}
          <section aria-labelledby="footer-brand" className="min-w-0">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-1.5 rounded-lg">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 id="footer-brand" className="text-white font-bold text-lg">
                Nelimac Learning
              </h3>
              </div>
            <p className="text-sm leading-relaxed text-gray-300 mb-4">
              Nairobi's premier education network. TSC-certified tutors, concierge matching,
              and exclusive community events.
            </p>
            <ul aria-label="Social links" className="flex items-center gap-3">
              <li>
                <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Facebook">
                  <Facebook className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </li>
              <li>
                <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Twitter">
                  <Twitter className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </li>
              <li>
                <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Instagram">
                  <Instagram className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </li>
            </ul>
          </section>

          {/* Explore */}
          <nav aria-labelledby="footer-explore" className="min-w-0">
            <h3 id="footer-explore" className="text-white font-bold text-lg mb-3">EXPLORE</h3>
            <ul className="space-y-2">
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/curricula">Programmes</Link></li>
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/hire-teacher">Request a Private Tutor</Link></li>
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/resources">Resources</Link></li>
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/events">Events</Link></li>
            </ul>
          </nav>

          {/* Trust & Policies */}
          <nav aria-labelledby="footer-trust" className="min-w-0">
            <h3 id="footer-trust" className="text-white font-bold text-lg mb-3">TRUST & POLICIES</h3>
            <ul className="space-y-2">
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/safeguarding">Safeguarding & Vetting</Link></li>
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-1 block" href="/terms">Terms of Service</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <address aria-labelledby="footer-contact" className="not-italic min-w-0">
            <h3 id="footer-contact" className="text-white font-bold text-lg mb-3">CONTACT</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <a className="text-gray-300 hover:text-yellow-400 transition-colors duration-200" href="tel:+254700000000">+254 700 000 000</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <a className="text-gray-300 hover:text-yellow-400 transition-colors duration-200" href="mailto:info@nelimaclearning.co.ke">info@nelimaclearning.co.ke</a>
              </li>
            </ul>
          </address>
          </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-4">
          {/* Brand - Always visible on mobile */}
          <section aria-labelledby="footer-brand-mobile" className="min-w-0">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-1.5 rounded-lg">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 id="footer-brand-mobile" className="text-white font-bold text-lg">
                Nelimac Learning
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-300 mb-4">
              Nairobi's premier education network. TSC-certified tutors, concierge matching,
              and exclusive community events.
            </p>
            <ul aria-label="Social links" className="flex items-center gap-3 mb-6">
              <li>
                <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Facebook">
                  <Facebook className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </li>
              <li>
                <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Twitter">
                  <Twitter className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </li>
              <li>
                <Link href="#" className="w-8 h-8 bg-gray-700 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-200 group" aria-label="Instagram">
                  <Instagram className="h-4 w-4 text-gray-300 group-hover:text-white" />
                </Link>
              </li>
            </ul>
          </section>

          {/* Explore - Collapsible */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => toggleSection('explore')}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={expandedSections.explore}
            >
              <h3 className="text-white font-bold text-lg">EXPLORE</h3>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.explore ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.explore && (
              <nav className="mt-3 space-y-2">
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/curricula">Programmes</Link>
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/hire-teacher">Request a Private Tutor</Link>
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/resources">Resources</Link>
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/events">Events</Link>
              </nav>
            )}
          </div>

          {/* Trust & Policies - Collapsible */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => toggleSection('trust')}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={expandedSections.trust}
            >
              <h3 className="text-white font-bold text-lg">TRUST & POLICIES</h3>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.trust ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.trust && (
              <nav className="mt-3 space-y-2">
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/safeguarding">Safeguarding & Vetting</Link>
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/privacy">Privacy Policy</Link>
                <Link className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 py-2 block" href="/terms">Terms of Service</Link>
              </nav>
            )}
          </div>

          {/* Contact - Collapsible */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={expandedSections.contact}
            >
              <h3 className="text-white font-bold text-lg">CONTACT</h3>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.contact ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections.contact && (
              <address className="mt-3 space-y-3 not-italic">
              <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <a className="text-gray-300 hover:text-yellow-400 transition-colors duration-200" href="tel:+254700000000">+254 700 000 000</a>
              </div>
              <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <a className="text-gray-300 hover:text-yellow-400 transition-colors duration-200" href="mailto:info@nelimaclearning.co.ke">info@nelimaclearning.co.ke</a>
              </div>
              </address>
            )}
        </div>
      </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/5 pt-6 text-sm text-gray-400 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Nelimac Learning. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Built with care for Nairobi's education community.</span>
        </div>
      </div>
      
      {/* Bottom spacer for floating concierge button */}
      <div className="h-20 sm:h-0" />
    </footer>
  );
}