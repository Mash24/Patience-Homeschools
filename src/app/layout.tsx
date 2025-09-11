import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import FooterLuxury from '@/components/layout/FooterLuxury'
import WhatsAppConcierge from '@/components/shared/WhatsAppConcierge'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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