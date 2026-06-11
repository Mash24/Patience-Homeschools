'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inquiryTypes = [
    'General Inquiry',
    'Teacher Application',
    'Parent Request',
    'Technical Support',
    'Partnership',
    'Other',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setFormData({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: '' })
    setIsSubmitting(false)
    alert("Thank you for your message! We'll get back to you within 24 hours.")
  }

  return (
    <section className="section-padding bg-ivory">
      <div className="container-custom max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow="Get in Touch"
          title="Send us a message"
          description="Fill out the form and our team will respond within 24 hours."
        />

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="card-elevated p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-field">Name</label>
              <input className="input-field" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input type="email" className="input-field" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-field">Phone</label>
              <input className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Inquiry Type</label>
              <select className="input-field" required value={formData.inquiryType} onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}>
                <option value="">Select type</option>
                {inquiryTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Subject</label>
            <input className="input-field" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Message</label>
            <textarea className="input-field min-h-[120px] resize-y" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
  )
}
