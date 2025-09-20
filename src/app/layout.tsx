import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import FooterLuxury from '@/components/layout/FooterLuxury'
import WhatsAppConcierge from '@/components/shared/WhatsAppConcierge'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Patience Education Collective - Nairobi\'s Premier Homeschool Network',
  description: 'Experience the gold standard in homeschooling with our curated network of TSC-certified educators, comprehensive resources, and exclusive community events designed for discerning families across Nairobi.',
  keywords: 'premium homeschooling Nairobi, elite education, TSC certified teachers, CBC curriculum, IGCSE Kenya, British curriculum, luxury home education, qualified educators, exclusive learning resources',
  authors: [{ name: 'Patience Education Collective' }],
  openGraph: {
    title: 'Patience Education Collective - Nairobi\'s Premier Homeschool Network',
    description: 'Experience the gold standard in homeschooling with our curated network of TSC-certified educators and exclusive community events.',
    type: 'website',
    locale: 'en_KE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Patience Education Collective",
              "description": "Nairobi's Premier Homeschool Network with TSC-certified educators",
              "url": "https://patiencehomeschools.co.ke",
              "logo": "https://patiencehomeschools.co.ke/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nairobi",
                "addressCountry": "Kenya"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+254-XXX-XXX-XXX",
                "contactType": "customer service",
                "email": "info@patiencehomeschools.co.ke"
              },
              "sameAs": [
                "https://facebook.com/patiencehomeschools",
                "https://instagram.com/patiencehomeschools"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <FooterLuxury />
        <WhatsAppConcierge />
      </body>
    </html>
  )
}