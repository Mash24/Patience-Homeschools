'use client'

import { useState } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { updateTeacherProfile } from '@/lib/teachers/profile'

const AVAILABILITY_OPTIONS = ['mornings', 'afternoons', 'evenings', 'weekends']

export default function TeacherProfileEditor({
  profile,
  onSaved,
}: {
  profile: {
    phone: string
    bio?: string
    location_area: string
    hourly_rate_range: string
    availability: string[]
    teaching_philosophy: string
    education_background: string
    full_name: string
    email: string
    subjects: string[]
    curricula: string[]
    experience_years: number
  }
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    phone: profile.phone || '',
    bio: profile.bio || '',
    location_area: profile.location_area || '',
    hourly_rate_range: profile.hourly_rate_range || '',
    availability: profile.availability || [],
    teaching_philosophy: profile.teaching_philosophy || '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const toggleAvailability = (slot: string) => {
    setForm((f) => ({
      ...f,
      availability: f.availability.includes(slot)
        ? f.availability.filter((a) => a !== slot)
        : [...f.availability, slot],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await updateTeacherProfile(form)
      setMessage('Profile updated successfully.')
      onSaved()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label-field">Full name</label>
          <input className="input-field bg-ivory" value={profile.full_name} disabled />
        </div>
        <div>
          <label className="label-field">Email</label>
          <input className="input-field bg-ivory" value={profile.email} disabled />
        </div>
        <div>
          <label className="label-field">Phone</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label-field">Location</label>
          <input className="input-field" value={form.location_area} onChange={(e) => setForm({ ...form, location_area: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className="label-field">Bio</label>
          <textarea className="input-field min-h-[100px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short introduction for parents..." />
        </div>
        <div>
          <label className="label-field">Hourly rate range</label>
          <input className="input-field" placeholder="e.g. KES 2000–3000" value={form.hourly_rate_range} onChange={(e) => setForm({ ...form, hourly_rate_range: e.target.value })} />
        </div>
        <div>
          <label className="label-field">Experience</label>
          <input className="input-field bg-ivory" value={`${profile.experience_years} years`} disabled />
        </div>
      </div>

      <div>
        <label className="label-field">Availability</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {AVAILABILITY_OPTIONS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => toggleAvailability(slot)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                form.availability.includes(slot)
                  ? 'bg-gold-500 text-ink'
                  : 'bg-ivory-dark text-ink-muted hover:bg-gold-50'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-field">Subjects</label>
        <div className="flex flex-wrap gap-1 mt-1">
          {profile.subjects.map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-gold-50 text-gold-800">{s}</span>
          ))}
        </div>
      </div>

      <div>
        <label className="label-field">Teaching philosophy</label>
        <textarea className="input-field min-h-[100px]" value={form.teaching_philosophy} onChange={(e) => setForm({ ...form, teaching_philosophy: e.target.value })} />
      </div>

      <div>
        <label className="label-field">Education background</label>
        <textarea className="input-field min-h-[80px] bg-ivory" value={profile.education_background} disabled />
        <p className="text-xs text-ink-muted mt-1">Contact admin to update qualifications on file.</p>
      </div>

      {message && (
        <p className={`text-sm ${message.includes('success') ? 'text-sage-700' : 'text-red-600'}`}>{message}</p>
      )}

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save profile</>}
      </button>
    </div>
  )
}
