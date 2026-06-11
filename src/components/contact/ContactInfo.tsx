'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const contactMethods = [
  { icon: Mail, title: 'Email', details: 'info@nelimaclearning.co.ke', href: 'mailto:info@nelimaclearning.co.ke' },
  { icon: Phone, title: 'Phone', details: '+254 700 000 000', href: 'tel:+254700000000' },
  { icon: MapPin, title: 'Location', details: 'Nairobi, Kenya' },
]

const businessHours = [
  { day: 'Mon – Fri', hours: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 2:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
]

export default function ContactInfo() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-elevated p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center mx-auto mb-4">
                <method.icon className="h-6 w-6 text-gold-600" />
              </div>
              <h3 className="font-semibold text-ink mb-1">{method.title}</h3>
              {method.href ? (
                <a href={method.href} className="text-sm text-ink-muted hover:text-gold-600 transition-colors">
                  {method.details}
                </a>
              ) : (
                <p className="text-sm text-ink-muted">{method.details}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="card-elevated p-8 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-gold-600" />
            <h3 className="font-semibold text-ink">Business Hours</h3>
          </div>
          <ul className="space-y-3">
            {businessHours.map((item) => (
              <li key={item.day} className="flex justify-between text-sm">
                <span className="text-ink-muted">{item.day}</span>
                <span className="font-medium text-ink">{item.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
