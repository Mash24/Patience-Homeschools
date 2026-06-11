import { Suspense } from 'react'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import FAQ from '@/components/contact/FAQ'
import CTA from '@/components/CTA'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <ContactHero />
      <Suspense fallback={<div className="section-padding container-custom"><div className="h-64 bg-ivory-dark rounded-xl animate-pulse" /></div>}>
        <ContactForm />
      </Suspense>
      <ContactInfo />
      <FAQ />
      <CTA />
    </div>
  )
}
