import NewsletterBar from '@/components/shared/NewsletterBar'
import Link from 'next/link'

export default function FooterLuxury() {
  return (
    <footer className="bg-brand-navy text-white pt-16">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-8">
        <NewsletterBar />

        <div className="mt-12 grid gap-10 md:grid-cols-4">
          <div>
            <h4 className="font-semibold text-white">Patience Education Collective</h4>
            <p className="mt-3 text-sm text-white/70">
              Nairobi's premier homeschool network. TSC-certified tutors, concierge matching,
              and exclusive community events.
            </p>
          </div>

          <div>
            <h5 className="mb-3 font-medium">Explore</h5>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/curricula" className="hover:text-white transition-colors">Programmes</Link></li>
              <li><Link href="/hire-teacher" className="hover:text-white transition-colors">Request a Private Tutor</Link></li>
              <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-3 font-medium">Trust & Policies</h5>
            <ul className="space-y-2 text-white/80">
              <li><Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding & Vetting</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="mb-3 font-medium">Contact</h5>
            <ul className="space-y-2 text-white/80">
              <li>Nairobi, Kenya</li>
              <li><a href="tel:+254700000000" className="hover:text-white transition-colors">+254 700 000 000</a></li>
              <li><a href="mailto:info@patiencecollective.co.ke" className="hover:text-white transition-colors">info@patiencecollective.co.ke</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 py-6 text-sm text-white/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Patience Education Collective. All rights reserved.</span>
          <span>Built with care for Nairobi's homeschooling community.</span>
        </div>
      </div>
    </footer>
  )
}

