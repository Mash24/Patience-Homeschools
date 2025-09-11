'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PartnerRow() {
  const partners = [
    {
      name: 'Cambridge International',
      logo: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=200&auto=format&fit=crop',
      description: 'Official Cambridge Assessment Partner'
    },
    {
      name: 'Pearson Edexcel',
      logo: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=200&auto=format&fit=crop',
      description: 'IGCSE & A-Level Provider'
    },
    {
      name: 'Kenya Institute of Curriculum Development',
      logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=200&auto=format&fit=crop',
      description: 'CBC Curriculum Specialist'
    },
    {
      name: 'British Council',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop',
      description: 'English Language Excellence'
    }
  ]

  return (
    <section className="py-16 bg-brand-cream/50">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-serif text-brand-navy mb-4">
            Trusted by Leading Educational Institutions
          </h2>
          <p className="text-brand-charcoal/70 max-w-2xl mx-auto">
            Our partnerships with top curriculum providers ensure your child receives world-class education standards.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden bg-white shadow-soft group-hover:shadow-luxury transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 768px) 96px, 96px"
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-brand-navy text-sm mb-1">
                {partner.name}
              </h3>
              <p className="text-xs text-brand-charcoal/60">
                {partner.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-brand-gold/20"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-brand-charcoal/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
              <span>Certified Educators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
              <span>Background Checked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
              <span>98% Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
              <span>5+ Years Experience</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}