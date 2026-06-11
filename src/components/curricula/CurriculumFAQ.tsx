'use client'

import SectionHeading from '@/components/ui/SectionHeading'
import FAQAccordion from '@/components/ui/FAQAccordion'

const faqs = [
  {
    question: 'Which curriculum is best for my child?',
    answer: 'It depends on your child\'s learning style and future goals. CBC excels for holistic development and local university prep. IGCSE offers international recognition. British provides traditional academic rigour. Our consultants can guide you.',
  },
  {
    question: 'Can my child switch between curricula?',
    answer: 'Yes, with careful planning. We recommend consulting our education team to ensure a smooth transition that doesn\'t disrupt learning progress.',
  },
  {
    question: 'Are your teachers certified for all curricula?',
    answer: 'All teachers are TSC-certified with specialised training in their respective curricula, plus ongoing professional development.',
  },
  {
    question: 'What is the difference between IGCSE and British curriculum?',
    answer: 'IGCSE is a 2–4 year international qualification with flexible subjects. British is a complete 13-year system from primary to A-Levels with a more structured approach.',
  },
  {
    question: 'How does CBC prepare students for university?',
    answer: 'CBC develops critical thinking, problem-solving, and digital literacy — competencies essential for university success alongside strong subject foundations.',
  },
  {
    question: 'What support is available for parents?',
    answer: 'Progress reports, parent-teacher conferences, curriculum guidance, and access to our parent community. Consultants are available throughout your journey.',
  },
]

export default function CurriculumFAQ() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions about programmes"
        />
        <FAQAccordion items={faqs} />
      </div>
    </section>
  )
}
