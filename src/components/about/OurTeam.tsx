'use client'

import { motion } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'

const teamMembers = [
  {
    name: 'Patience Wanjiku',
    role: 'Founder & Education Director',
    description: '8+ years in education, passionate about personalised learning.',
    initials: 'PW',
  },
  {
    name: 'David Kimani',
    role: 'Teacher Relations Manager',
    description: 'Ensures quality recruitment and ongoing teacher support.',
    initials: 'DK',
  },
  {
    name: 'Sarah Mwangi',
    role: 'Community Coordinator',
    description: 'Manages events and family engagement across Nairobi.',
    initials: 'SM',
  },
]

export default function OurTeam() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Leadership"
          title="The people behind Nelimac"
          description="A dedicated team committed to connecting families with exceptional educators."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-ink flex items-center justify-center mx-auto mb-5">
                <span className="font-serif text-2xl font-semibold text-gold-400">{member.initials}</span>
              </div>
              <h3 className="font-semibold text-ink text-lg">{member.name}</h3>
              <p className="text-sm text-gold-600 font-medium mt-1 mb-3">{member.role}</p>
              <p className="text-sm text-ink-muted leading-relaxed">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
