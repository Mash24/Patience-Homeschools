import Link from "next/link";
import { Mail, Facebook, Instagram, Twitter, Phone, MapPin } from "lucide-react";
import NewsletterForm from "@/components/shared/NewsletterForm";

export default function FooterLuxury() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0E151B] text-white/90">
      {/* gradient top edge */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <section className="mx-auto mt-10 max-w-5xl rounded-2xl bg-white/[0.04] p-5 sm:p-6 backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Stay informed</h3>
              <p className="max-w-prose text-sm text-white/70">
                Insights on elite homeschooling in Nairobi.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </section>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Patience Education Collective</h4>
            <p className="max-w-[36ch] text-sm leading-relaxed text-white/70">
              Nairobi&apos;s premier homeschool network. TSC-certified tutors, concierge
              matching, and exclusive community events.
            </p>

            <div className="mt-4 flex gap-4">
              <Link href="https://facebook.com" aria-label="Facebook" className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="rounded-lg p-2 text-white/70 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <nav className="space-y-3">
            <h4 className="text-base font-semibold text-white">Explore</h4>
            <ul className="grid gap-2 text-sm">
              <li><FooterLink href="/curricula">Programmes</FooterLink></li>
              <li><FooterLink href="/hire-teacher">Request a Private Tutor</FooterLink></li>
              <li><FooterLink href="/resources">Resources</FooterLink></li>
              <li><FooterLink href="/events">Events</FooterLink></li>
            </ul>
          </nav>

          {/* Trust & Policies */}
          <nav className="space-y-3">
            <h4 className="text-base font-semibold text-white">Trust &amp; Policies</h4>
            <ul className="grid gap-2 text-sm">
              <li><FooterLink href="/safeguarding">Safeguarding &amp; Vetting</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Contact</h4>
            <ul className="grid gap-3 text-sm text-white/80">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-white/50" /> Nairobi, Kenya</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-white/50" /> +254 700 000 000</li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/50" />
                <a className="hover:text-white underline/30 hover:underline" href="mailto:info@patiencecollective.co.ke">
                  info@patiencecollective.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5" />

        {/* Legal bar */}
        <div className="flex flex-col items-start justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Patience Education Collective. All rights reserved.</p>
          <p className="max-w-[60ch]">
            Built with care for Nairobi&apos;s homeschooling community.
          </p>
        </div>

        {/* bottom spacer for floating concierge bubble on mobile */}
        <div className="h-20 sm:h-0" />
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md py-2 text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E151B]"
    >
      {children}
    </Link>
  );
}

