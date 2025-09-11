import NewsletterBar from '@/components/shared/NewsletterBar'
import Link from 'next/link'

export default function FooterLuxury() {
  return (
    <footer className="bg-brand-navy text-white pt-16">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-8">
        <NewsletterBar />

        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          <div className="sm:col-span-2 md:col-span-1">
            <h4 className="font-semibold text-white text-sm sm:text-base">Patience Education Collective</h4>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-white/70 leading-relaxed">
              Nairobi's premier homeschool network. TSC-certified tutors, concierge matching,
              and exclusive community events.
            </p>
          </div>

          <div>
            <h5 className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm">Explore</h5>
            <ul className="space-y-1 sm:space-y-2 text-white/80">
              <li><Link href="/curricula" className="hover:text-white transition-colors text-xs sm:text-sm">Programmes</Link></li>
              <li><Link href="/hire-teacher" className="hover:text-white transition-colors text-xs sm:text-sm">Request a Private Tutor</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors text-xs sm:text-sm">Resources</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors text-xs sm:text-sm">Events</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm">Trust & Policies</h5>
            <ul className="space-y-1 sm:space-y-2 text-white/80">
              <li><Link href="/safeguarding" className="hover:text-white transition-colors text-xs sm:text-sm">Safeguarding & Vetting</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-2 sm:mb-3 font-medium text-xs sm:text-sm">Contact</h5>
            <ul className="space-y-1 sm:space-y-2 text-white/80">
              <li className="text-xs sm:text-sm">Nairobi, Kenya</li>
              <li><a href="tel:+254700000000" className="hover:text-white transition-colors text-xs sm:text-sm">+254 700 000 000</a></li>
              <li><a href="mailto:info@patiencecollective.co.ke" className="hover:text-white transition-colors text-xs sm:text-sm">info@patiencecollective.co.ke</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t border-white/10 py-4 sm:py-6 text-xs sm:text-sm text-white/60 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <span>© {new Date().getFullYear()} Patience Education Collective. All rights reserved.</span>
          <span>Built with care for Nairobi's homeschooling community.</span>
        </div>
      </div>
    </footer>
  )
}

