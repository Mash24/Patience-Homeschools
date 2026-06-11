'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

export default function ContactForm() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: searchParams.get('subject') || '',
    message: '',
    inquiryType: searchParams.get('subject')?.startsWith('Event:') ? 'General Inquiry' : '',
  })

  useEffect(() => {
    const subject = searchParams.get('subject')
    if (subject) {
      setFormData((prev) => ({
        ...prev,
        subject,
        inquiryType: subject.startsWith('Event:') ? 'General Inquiry' : prev.inquiryType,
        message: prev.message || (subject.startsWith('Event:') ? `I would like to register for: ${subject.replace('Event: ', '')}` : prev.message),
      }))
    }
  }, [searchParams])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

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
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message')

      setFormData({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: '' })
      setSubmitSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
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
          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">{submitError}</p>
          )}
          {submitSuccess && (
            <p className="text-sm text-gold-800 bg-gold-50 border border-gold-200 rounded-xl p-3">
              Thank you! We&apos;ll get back to you within 24 hours.
            </p>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </section>
  )
}
