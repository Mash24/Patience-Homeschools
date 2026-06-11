'use client'

import SectionHeading from '@/components/ui/SectionHeading'
import FAQAccordion from '@/components/ui/FAQAccordion'

const faqs = [
  {
    question: 'How does the teacher matching process work?',
    answer: 'Submit your requirements and our team personally reviews and matches you with up to 3 qualified, TSC-certified teachers based on curriculum, subjects, location, and teaching style.',
  },
  {
    question: 'How long does matching take?',
    answer: 'We typically provide teacher recommendations within 48 hours. The full process from enquiry to first lesson usually takes 3–5 days.',
  },
  {
    question: 'Are all teachers TSC certified?',
    answer: 'Yes. Every teacher is TSC-certified, background-checked, and vetted before joining our network.',
  },
  {
    question: 'Is the matching service free?',
    answer: 'Yes — matching is completely free. You pay the teacher directly for their services with no platform commission.',
  },
  {
    question: 'What do teachers charge?',
    answer: 'Rates typically range from KSh 1,500 to KSh 3,000 per hour depending on subject, experience, and curriculum. Transparent pricing is provided with each shortlist.',
  },
  {
    question: 'Can I interview teachers before choosing?',
    answer: 'Absolutely. We encourage you to meet or interview recommended teachers to ensure the right fit for your family.',
  },
  {
    question: 'Do you offer online and in-person teaching?',
    answer: 'Yes — many teachers offer in-home, online, or hybrid arrangements. Specify your preference in the request form.',
  },
  {
    question: 'What if I\'m not satisfied with my teacher?',
    answer: 'We offer a satisfaction guarantee. If you\'re not happy within the first month, we\'ll help find a replacement at no extra cost.',
  },
]

export default function FAQSection() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know about finding a tutor through Nelimac."
        />
        <FAQAccordion items={faqs} />
      </div>
    </section>
  )
}
