import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import Script from 'next/script'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nelimac Learning — Nairobi\'s Premier Education Network',
  description: 'Curated TSC-certified educators, concierge tutor matching, and exclusive learning experiences for discerning families across Nairobi.',
  keywords: 'premium education Nairobi, TSC certified teachers, CBC curriculum, IGCSE Kenya, British curriculum, private tutoring Nairobi',
  authors: [{ name: 'Nelimac Learning' }],
  openGraph: {
    title: 'Nelimac Learning — Nairobi\'s Premier Education Network',
    description: 'Curated TSC-certified educators and concierge tutor matching for discerning Nairobi families.',
    type: 'website',
    locale: 'en_KE',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Nelimac Learning',
              description: "Nairobi's Premier Education Network with TSC-certified educators",
              url: 'https://nelimaclearning.co.ke',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Nairobi',
                addressCountry: 'Kenya',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'info@nelimaclearning.co.ke',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
