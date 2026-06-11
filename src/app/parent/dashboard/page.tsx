'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Clock,
  CheckCircle,
  GraduationCap,
  Loader2,
  Plus,
  Save,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import ParentLayout from '@/components/parent/ParentLayout'
import MessagingPanel from '@/components/shared/MessagingPanel'
import ScheduleManager from '@/components/shared/ScheduleManager'
import SessionLogManager from '@/components/shared/SessionLogManager'
import ReviewForm from '@/components/parent/ReviewForm'
import ParentLeadStatus from '@/components/parent/ParentLeadStatus'
import ParentOnboardingWizard from '@/components/parent/ParentOnboardingWizard'
import NotificationPreferences from '@/components/shared/NotificationPreferences'
import WeeklyScheduleCalendar from '@/components/shared/WeeklyScheduleCalendar'
import { updateParentProfile, addChild, updateChild } from './actions'

interface Profile {
  id: string
  full_name: string
  phone?: string
  email?: string
}

interface Child {
  id: string
  full_name: string
  level?: string
  notes?: string
}

interface Review {
  id: string
  assignment_id: string
  rating: number
  comment?: string
}

interface ParentLead {
  id: string
  status: string
  child_first_name?: string
  grade_level?: string
  subjects?: string[]
  curricula?: string[]
  mode?: string
  city?: string
  goals?: string
  created_at: string
}

interface Assignment {
  id: string
  teacher_id?: string
  subject?: string
  student_level?: string
  location?: string
  status: string
  hourly_rate?: number
  created_at: string
  teacher?: {
    full_name?: string
    name?: string
    email?: string
    phone?: string
    subjects?: string[]
  }
  child?: { full_name?: string; level?: string }
}

interface ClassSession {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  location?: string
  assignment?: { subject?: string; teacher?: { full_name?: string; name?: string } }
}

function ParentDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const [profile, setProfile] = useState<Profile | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [parentLead, setParentLead] = useState<ParentLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' })
  const [newChild, setNewChild] = useState({ full_name: '', level: '', notes: '' })
  const [showAddChild, setShowAddChild] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/signin?redirectTo=/parent/dashboard')
        return
      }

      const role = user.app_metadata?.role || user.user_metadata?.role
      if (role !== 'parent') {
        router.push('/unauthorized')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const prof: Profile = {
        id: user.id,
        full_name: profileData?.full_name || user.user_metadata?.full_name || 'Parent',
        phone: profileData?.phone || user.user_metadata?.phone,
        email: user.email,
      }
      setProfile(prof)
      setProfileForm({ full_name: prof.full_name, phone: prof.phone || '' })

      const { data: childrenData } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true })

      setChildren(childrenData || [])

      const onboardingDone = profileData?.onboarding_completed === true
      if (!onboardingDone && !(childrenData || []).length) {
        setShowOnboarding(true)
      }

      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select(`
          *,
          teacher:teachers(full_name, name, email, phone, subjects),
          child:children(full_name, level)
        `)
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false })

      setAssignments(assignmentsData || [])

      const assignmentIds = assignmentsData?.map((a) => a.id) || []

      if (assignmentIds.length > 0) {
        const { data: reviewsData } = await supabase
          .from('teacher_reviews')
          .select('*')
          .eq('parent_id', user.id)
          .in('assignment_id', assignmentIds)

        setReviews(reviewsData || [])
      }
      if (assignmentIds.length > 0) {
        const { data: sessionsData } = await supabase
          .from('class_sessions')
          .select(`
            *,
            assignment:assignments(subject, teacher:teachers(full_name, name))
          `)
          .in('assignment_id', assignmentIds)
          .order('day_of_week')

        setSessions(sessionsData || [])
      }

      if (user.email) {
        const { data: leadData } = await supabase
          .from('parent_leads')
          .select('id, status, child_first_name, grade_level, subjects, curricula, mode, city, goals, created_at')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (leadData) setParentLead(leadData)
      }
    } catch (error) {
      console.error('Error loading parent data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateParentProfile(profileForm)
      setProfile((p) => p ? { ...p, ...profileForm } : p)
    } catch {
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddChild = async () => {
    if (!newChild.full_name.trim()) return
    setSaving(true)
    try {
      await addChild(newChild)
      setNewChild({ full_name: '', level: '', notes: '' })
      setShowAddChild(false)
      await loadData()
    } catch {
      alert('Failed to add child')
    } finally {
      setSaving(false)
    }
  }

  const teacherName = (a: Assignment) =>
    a.teacher?.full_name || a.teacher?.name || 'Teacher assigned'

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <ParentLayout parentName={profile?.full_name}>
      {showOnboarding && (
        <ParentOnboardingWizard
          initialName={profileForm.full_name}
          initialPhone={profileForm.phone}
          onComplete={() => {
            setShowOnboarding(false)
            loadData()
          }}
        />
      )}
      <div className="space-y-6 max-w-5xl">
        {activeTab === 'overview' && (
          <>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-ink">Your family dashboard</h1>
              <p className="text-sm text-ink-muted mt-1">Track tutors, schedules, and your children&apos;s progress.</p>
            </div>

            {parentLead && !assignments.length && (
              <ParentLeadStatus lead={parentLead} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Children', value: children.length, icon: Users },
                { label: 'Active tutors', value: assignments.filter((a) => a.status === 'active').length, icon: GraduationCap },
                { label: 'Weekly sessions', value: sessions.length, icon: Calendar },
              ].map((stat) => (
                <div key={stat.label} className="card-elevated p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gold-50">
                      <stat.icon className="h-5 w-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted">{stat.label}</p>
                      <p className="text-2xl font-bold text-ink">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {assignments.length === 0 ? (
              <div className="card-elevated p-8 text-center">
                <GraduationCap className="h-12 w-12 text-ink-muted/40 mx-auto mb-4" />
                <h2 className="font-serif text-lg font-semibold text-ink mb-2">No tutor assigned yet</h2>
                <p className="text-sm text-ink-muted mb-6 max-w-md mx-auto">
                  Submit a request through our concierge form and our team will match you with a qualified tutor.
                </p>
                <Link href="/hire-teacher" className="btn-primary inline-flex">
                  Find a tutor
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-serif text-lg font-semibold text-ink">Your tutors</h2>
                {assignments.map((a) => (
                  <div key={a.id} className="card-elevated p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{teacherName(a)}</p>
                        <p className="text-sm text-ink-muted">{a.subject || 'General tutoring'} · {a.child?.full_name || 'Student'}</p>
                      </div>
                      <span className={`self-start px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        a.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-ivory-dark text-ink-muted'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sessions.length > 0 && (
              <div className="card-elevated p-5">
                <h2 className="font-serif text-lg font-semibold text-ink mb-4">Upcoming schedule</h2>
                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 p-3 bg-ivory rounded-xl">
                      <div className="p-2 bg-gold-50 rounded-lg">
                        <Clock className="h-4 w-4 text-gold-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {s.day_of_week} · {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {s.assignment?.subject} with {s.assignment?.teacher?.full_name || s.assignment?.teacher?.name}
                          {s.location ? ` · ${s.location}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'request' && (
          <>
            <h1 className="font-serif text-2xl font-semibold text-ink">My tutor request</h1>
            {parentLead ? (
              <ParentLeadStatus lead={parentLead} />
            ) : (
              <div className="card-elevated p-8 text-center text-sm text-ink-muted">
                No tutor request found for your account.{' '}
                <Link href="/hire-teacher" className="text-gold-600 hover:text-gold-700">Submit a request</Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'children' && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-2xl font-semibold text-ink">My children</h1>
              <button onClick={() => setShowAddChild(true)} className="btn-primary text-sm">
                <Plus className="h-4 w-4" /> Add child
              </button>
            </div>

            {showAddChild && (
              <div className="card-elevated p-5 space-y-4">
                <h2 className="font-medium text-ink">Add a child</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input className="input-field" placeholder="Full name" value={newChild.full_name} onChange={(e) => setNewChild({ ...newChild, full_name: e.target.value })} />
                  <input className="input-field" placeholder="Grade / level" value={newChild.level} onChange={(e) => setNewChild({ ...newChild, level: e.target.value })} />
                </div>
                <textarea className="input-field" placeholder="Notes (optional)" rows={2} value={newChild.notes} onChange={(e) => setNewChild({ ...newChild, notes: e.target.value })} />
                <div className="flex gap-2">
                  <button onClick={handleAddChild} disabled={saving} className="btn-primary text-sm">Save</button>
                  <button onClick={() => setShowAddChild(false)} className="btn-outline text-sm">Cancel</button>
                </div>
              </div>
            )}

            {children.length === 0 ? (
              <div className="card-elevated p-8 text-center text-ink-muted text-sm">No children added yet.</div>
            ) : (
              children.map((child) => (
                <ChildCard key={child.id} child={child} onUpdated={loadData} />
              ))
            )}
          </>
        )}

        {activeTab === 'assignments' && (
          <>
            <h1 className="font-serif text-2xl font-semibold text-ink">Assigned teachers</h1>
            {assignments.length === 0 ? (
              <div className="card-elevated p-8 text-center text-ink-muted text-sm">
                No teachers assigned yet.{' '}
                <Link href="/hire-teacher" className="text-gold-600 hover:text-gold-700">Request a tutor</Link>
              </div>
            ) : (
              assignments.map((a) => (
                <div key={a.id} className="card-elevated p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold text-lg text-ink">{teacherName(a)}</h2>
                      <p className="text-sm text-ink-muted capitalize">{a.status}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-sage-500" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {a.teacher?.email && (
                      <a href={`mailto:${a.teacher.email}`} className="flex items-center gap-2 text-gold-600">
                        <Mail className="h-4 w-4" />{a.teacher.email}
                      </a>
                    )}
                    {a.teacher?.phone && (
                      <a href={`tel:${a.teacher.phone}`} className="flex items-center gap-2 text-ink-muted">
                        <Phone className="h-4 w-4" />{a.teacher.phone}
                      </a>
                    )}
                    {a.location && (
                      <p className="flex items-center gap-2 text-ink-muted"><MapPin className="h-4 w-4" />{a.location}</p>
                    )}
                    {a.subject && (
                      <p className="flex items-center gap-2 text-ink-muted"><BookOpen className="h-4 w-4" />{a.subject}</p>
                    )}
                  </div>
                  {a.teacher?.subjects && (
                    <div className="flex flex-wrap gap-1">
                      {a.teacher.subjects.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-gold-50 text-gold-800">{s}</span>
                      ))}
                    </div>
                  )}
                  {a.teacher_id && a.status === 'active' && (
                    <ReviewForm
                      teacherId={a.teacher_id}
                      assignmentId={a.id}
                      teacherName={teacherName(a)}
                      existingReview={reviews.find((r) => r.assignment_id === a.id) || null}
                      onSubmitted={loadData}
                    />
                  )}
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'messages' && (
          <>
            <h1 className="font-serif text-2xl font-semibold text-ink">Messages</h1>
            {assignments.length > 0 ? (
              <MessagingPanel assignmentId={assignments[0].id} title="Message your tutor" />
            ) : (
              <MessagingPanel title="Your conversations" />
            )}
          </>
        )}

        {activeTab === 'schedule' && (
          <>
            <h1 className="font-serif text-2xl font-semibold text-ink">Weekly schedule</h1>
            <WeeklyScheduleCalendar
              sessions={sessions}
              emptyMessage="Your weekly tutoring sessions will appear here once a schedule is set up."
            />
            <ScheduleManager
              assignments={assignments.map((a) => ({ id: a.id, subject: a.subject }))}
              sessions={sessions}
              readOnly
              onUpdated={loadData}
            />
            <SessionLogManager
              assignments={assignments.map((a) => ({ id: a.id, subject: a.subject }))}
              readOnly
            />
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h1 className="font-serif text-2xl font-semibold text-ink">Your profile</h1>
            <div className="card-elevated p-6 space-y-5 max-w-lg">
              <div>
                <label className="label-field">Full name</label>
                <input className="input-field" value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input className="input-field" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input className="input-field bg-ivory" value={profile?.email || ''} disabled />
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
            <NotificationPreferences />
          </>
        )}
      </div>
    </ParentLayout>
  )
}

function ChildCard({ child, onUpdated }: { child: Child; onUpdated: () => void }) {
  const [form, setForm] = useState(child)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateChild(child.id, form)
      onUpdated()
    } catch {
      alert('Failed to update child')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card-elevated p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gold-500 flex items-center justify-center">
          <User className="h-5 w-5 text-ink" />
        </div>
        <div>
          <input className="font-medium text-ink bg-transparent border-b border-ink/10 focus:border-gold-500 outline-none" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input className="text-sm text-ink-muted bg-transparent border-b border-ink/10 focus:border-gold-500 outline-none w-full mt-1" placeholder="Grade level" value={form.level || ''} onChange={(e) => setForm({ ...form, level: e.target.value })} />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving} className="btn-outline text-sm">{saving ? 'Saving...' : 'Save'}</button>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-gold-600" />
    </div>
  )
}

export default function ParentDashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ParentDashboardContent />
    </Suspense>
  )
}
