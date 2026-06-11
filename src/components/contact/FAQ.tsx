'use client'

import SectionHeading from '@/components/ui/SectionHeading'
import FAQAccordion from '@/components/ui/FAQAccordion'

const faqs = [
  {
    question: 'How does the teacher matching process work?',
    answer: 'Parents submit requirements through our form. Our team matches you with qualified teachers based on curriculum, subjects, location, and availability.',
  },
  {
    question: 'What qualifications do your teachers have?',
    answer: 'All teachers are TSC-certified with minimum 2 years of experience and background checks. Many hold advanced degrees in their subject areas.',
  },
  {
    question: 'Which curricula do you support?',
    answer: 'We support CBC, IGCSE, British Curriculum, and more. Teachers are specialists in their respective programmes.',
  },
  {
    question: 'How much does it cost to hire a teacher?',
    answer: 'Rates typically range from KSh 1,500 to KSh 3,000 per hour. Matching is free — you pay teachers directly.',
  },
  {
    question: 'How quickly can I get matched?',
    answer: 'We provide recommendations within 48 hours. The full process from application to starting lessons usually takes 3–5 days.',
  },
]

export default function FAQ() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <FAQAccordion items={faqs} />
      </div>
    </section>
  )
}
