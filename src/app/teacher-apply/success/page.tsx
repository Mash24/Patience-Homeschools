'use client'

import { CheckCircle, Mail, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import AuthLayout from '@/components/ui/AuthLayout'

export default function TeacherApplicationSuccess() {
  return (
    <AuthLayout
      title="Application submitted"
      subtitle="Thank you for applying to join Nelimac Learning. We'll review your application shortly."
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-sage-500/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-sage-500" />
        </div>

        <div className="space-y-4 text-left">
          {[
            { icon: Mail, title: 'Check your email', desc: 'A magic link has been sent so you can track your application status.' },
            { icon: Clock, title: 'Review within 48 hours', desc: 'Our team will review your credentials and documents.' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-4 bg-ivory rounded-xl">
              <item.icon className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink text-sm">{item.title}</p>
                <p className="text-xs text-ink-muted mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Link href="/application-status" className="btn-primary w-full">
            Check Application Status
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="btn-outline w-full">
            Back to Home
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
