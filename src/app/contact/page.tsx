import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'
import FAQ from '@/components/contact/FAQ'
import CTA from '@/components/CTA'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <FAQ />
      <CTA />
    </div>
  )
}

