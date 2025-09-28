'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppConcierge from '@/components/shared/WhatsAppConcierge'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

// Pages that should show marketing navbar and footer
const MARKETING_PAGES = [
  '/',
  '/about',
  '/contact',
  '/curricula',
  '/hire-teacher',
  '/teacher-apply',
  '/resources',
  '/events',
  '/pricing',
  '/testimonials'
]

// Pages that should have clean app layout (no marketing navbar/footer)
const APP_PAGES = [
  '/dashboard',
  '/admin',
  '/teacher',
  '/parent',
  '/students',
  '/schedule',
  '/documents',
  '/earnings',
  '/messages',
  '/settings',
  '/signup',
  '/login',
  '/email-verified',
  '/setup-password',
  '/auth'
]

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current page should show marketing layout
  const isMarketingPage = MARKETING_PAGES.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  )
  
  // Check if current page should show app layout
  const isAppPage = APP_PAGES.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  )

  // Default to marketing layout for unknown pages
  const showMarketingLayout = isMarketingPage || (!isMarketingPage && !isAppPage)

  if (showMarketingLayout) {
    // Marketing layout with navbar and footer
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppConcierge />
      </>
    )
  }

  // Clean app layout (no marketing navbar/footer)
  return (
    <>
      <main className="min-h-screen">
        {children}
      </main>
      {/* Only show WhatsApp on app pages, not marketing pages */}
      <WhatsAppConcierge />
    </>
  )
}
