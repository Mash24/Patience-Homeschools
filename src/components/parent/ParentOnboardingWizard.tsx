'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, GraduationCap, MessageSquare, Calendar, ArrowRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { updateParentProfile, addChild, completeParentOnboarding } from '@/app/parent/dashboard/actions'

const STEPS = ['Welcome', 'Your profile', 'Add a child', 'You\'re set'] as const

export default function ParentOnboardingWizard({
  initialName,
  initialPhone,
  onComplete,
}: {
  initialName: string
  initialPhone: string
  onComplete: () => void
}) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({ full_name: initialName, phone: initialPhone })
  const [child, setChild] = useState({ full_name: '', level: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSaveProfile = async () => {
    if (!profile.full_name.trim()) {
      setError('Please enter your name')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateParentProfile(profile)
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddChild = async () => {
    if (!child.full_name.trim()) {
      setError('Please enter your child\'s name')
      return
    }
    setSaving(true)
    setError('')
    try {
      await addChild({ full_name: child.full_name, level: child.level || undefined })
      setStep(3)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add child')
    } finally {
      setSaving(false)
    }
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await completeParentOnboarding()
      onComplete()
    } catch {
      onComplete()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50">
      <div className="bg-white rounded-2xl shadow-luxury w-full max-w-lg overflow-hidden">
        <div className="bg-ink px-6 py-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-gold-400" />
            <span className="text-xs uppercase tracking-wider text-gold-400 font-medium">Getting started</span>
          </div>
          <h2 className="font-serif text-xl font-semibold">{STEPS[step]}</h2>
          <div className="flex gap-1.5 mt-4">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-gold-400' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {step === 0 && (
            <>
              <p className="text-sm text-ink-muted leading-relaxed">
                Welcome to your Nelimac parent portal. In a few quick steps you&apos;ll set up your profile,
                add your children, and learn how to track tutors and schedules.
              </p>
              <button onClick={() => setStep(1)} className="btn-primary w-full">
                Let&apos;s get started <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="label-field">Your full name</label>
                <input
                  className="input-field"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label-field">Phone number</label>
                <input
                  className="input-field"
                  type="tel"
                  placeholder="+254..."
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-outline flex-1">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex-1">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-ink-muted">Who will be receiving tutoring?</p>
              <div>
                <label className="label-field">Child&apos;s name</label>
                <input
                  className="input-field"
                  value={child.full_name}
                  onChange={(e) => setChild({ ...child, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="label-field">Grade / level</label>
                <input
                  className="input-field"
                  placeholder="e.g. Grade 6, Form 2"
                  value={child.level}
                  onChange={(e) => setChild({ ...child, level: e.target.value })}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={handleAddChild} disabled={saving} className="btn-primary flex-1">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs text-ink-muted hover:text-ink w-full text-center"
              >
                Skip for now
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-sm text-ink-muted">Here&apos;s what you can do in your portal:</p>
              <ul className="space-y-3">
                {[
                  { icon: GraduationCap, label: 'Track tutor requests', href: '/parent/dashboard?tab=request' },
                  { icon: Users, label: 'Manage children', href: '/parent/dashboard?tab=children' },
                  { icon: Calendar, label: 'View weekly schedule', href: '/parent/dashboard?tab=schedule' },
                  { icon: MessageSquare, label: 'Message your tutor', href: '/parent/dashboard?tab=messages' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-xl border border-ink/10 hover:bg-ivory transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-gold-600 shrink-0" />
                      <span className="text-sm font-medium text-ink">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={handleFinish} disabled={saving} className="btn-primary w-full">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go to dashboard'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
