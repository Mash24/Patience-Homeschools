import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nelimac Learning - Nairobi\'s Premier Education Network',
  description: 'Experience the gold standard in education with our curated network of TSC-certified educators, comprehensive resources, and exclusive community events designed for discerning families across Nairobi.',
  keywords: 'premium education Nairobi, elite learning, TSC certified teachers, CBC curriculum, IGCSE Kenya, British curriculum, luxury education, qualified educators, exclusive learning resources',
  authors: [{ name: 'Nelimac Learning' }],
  openGraph: {
    title: 'Nelimac Learning - Nairobi\'s Premier Education Network',
    description: 'Experience the gold standard in education with our curated network of TSC-certified educators and exclusive community events.',
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
              "name": "Nelimac Learning",
              "description": "Nairobi's Premier Education Network with TSC-certified educators",
              "url": "https://nelimaclearning.co.ke",
              "logo": "https://nelimaclearning.co.ke/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nairobi",
                "addressCountry": "Kenya"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+254-XXX-XXX-XXX",
                "contactType": "customer service",
                "email": "info@nelimaclearning.co.ke"
              },
              "sameAs": [
                "https://facebook.com/nelimaclearning",
                "https://instagram.com/nelimaclearning"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}