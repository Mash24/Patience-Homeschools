'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, Calendar, FileText, UserCheck } from 'lucide-react'
import {
  getEvents,
  getResources,
  upsertEvent,
  upsertResource,
  deleteEvent,
  deleteResource,
} from '@/lib/admin/actions'
import { getEventRegistrations, updateRegistrationStatus } from '@/lib/events/actions'

type Tab = 'events' | 'resources' | 'registrations'

export default function ContentManagement() {
  const [tab, setTab] = useState<Tab>('events')
  const [events, setEvents] = useState<Record<string, unknown>[]>([])
  const [resources, setResources] = useState<Record<string, unknown>[]>([])
  const [registrations, setRegistrations] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'published',
  })

  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    category: 'guide',
    file_url: '',
    status: 'published',
  })

  const load = async () => {
    setLoading(true)
    try {
      const [e, r, reg] = await Promise.all([getEvents(), getResources(), getEventRegistrations()])
      setEvents(e)
      setResources(r)
      setRegistrations(reg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleAddEvent = async () => {
    if (!eventForm.title || !eventForm.date) return
    setSaving(true)
    try {
      await upsertEvent(eventForm)
      setEventForm({ title: '', description: '', date: '', location: '', status: 'published' })
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  const handleAddResource = async () => {
    if (!resourceForm.title) return
    setSaving(true)
    try {
      await upsertResource(resourceForm)
      setResourceForm({ title: '', description: '', category: 'guide', file_url: '', status: 'published' })
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save resource')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Content</h1>
        <p className="mt-1 text-sm text-ink-muted">Manage events and learning resources</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('events')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'events' ? 'bg-gold-50 text-gold-700' : 'text-ink-muted hover:bg-ivory-dark'
          }`}
        >
          <Calendar className="h-4 w-4 inline mr-1.5" />
          Events ({events.length})
        </button>
        <button
          onClick={() => setTab('resources')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'resources' ? 'bg-gold-50 text-gold-700' : 'text-ink-muted hover:bg-ivory-dark'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-1.5" />
          Resources ({resources.length})
        </button>
        <button
          onClick={() => setTab('registrations')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            tab === 'registrations' ? 'bg-gold-50 text-gold-700' : 'text-ink-muted hover:bg-ivory-dark'
          }`}
        >
          <UserCheck className="h-4 w-4 inline mr-1.5" />
          Registrations ({registrations.length})
        </button>
      </div>

      {tab === 'events' && (
        <div className="space-y-4">
          <div className="card-elevated p-5 space-y-3">
            <h2 className="font-medium text-ink">Add event</h2>
            <input className="input-field" placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
            <textarea className="input-field" placeholder="Description" rows={2} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <input type="datetime-local" className="input-field" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
              <input className="input-field" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
            </div>
            <button onClick={handleAddEvent} disabled={saving} className="btn-primary text-sm">
              <Plus className="h-4 w-4" /> Add event
            </button>
          </div>

          {events.map((ev) => (
            <div key={ev.id as string} className="card-elevated p-4 flex justify-between items-start gap-3">
              <div>
                <p className="font-medium text-ink">{ev.title as string}</p>
                <p className="text-xs text-ink-muted mt-1">
                  {new Date(ev.date as string).toLocaleString()} · {(ev.status as string) || 'published'}
                </p>
              </div>
              <button
                onClick={async () => {
                  if (!confirm('Delete this event?')) return
                  await deleteEvent(ev.id as string)
                  await load()
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'registrations' && (
        <div className="space-y-3">
          {registrations.length === 0 ? (
            <div className="card-elevated p-8 text-center text-sm text-ink-muted">
              No event registrations yet.
            </div>
          ) : (
            registrations.map((reg) => {
              const event = reg.event as { title?: string; date?: string } | null
              return (
                <div key={reg.id as string} className="card-elevated p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">{reg.full_name as string}</p>
                      <p className="text-xs text-ink-muted">{reg.email as string}{reg.phone ? ` · ${reg.phone}` : ''}</p>
                      <p className="text-sm text-gold-600 mt-1">{event?.title || 'Event'}</p>
                      {reg.notes && <p className="text-xs text-ink-muted mt-2">{reg.notes as string}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={(reg.status as string) || 'pending'}
                        onChange={async (e) => {
                          await updateRegistrationStatus(reg.id as string, e.target.value as 'pending' | 'confirmed' | 'cancelled')
                          await load()
                        }}
                        className="input-field text-xs w-auto"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {tab === 'resources' && (
        <div className="space-y-4">
          <div className="card-elevated p-5 space-y-3">
            <h2 className="font-medium text-ink">Add resource</h2>
            <input className="input-field" placeholder="Title" value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} />
            <textarea className="input-field" placeholder="Description" rows={2} value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Category" value={resourceForm.category} onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })} />
              <input className="input-field" placeholder="File URL" value={resourceForm.file_url} onChange={(e) => setResourceForm({ ...resourceForm, file_url: e.target.value })} />
            </div>
            <button onClick={handleAddResource} disabled={saving} className="btn-primary text-sm">
              <Plus className="h-4 w-4" /> Add resource
            </button>
          </div>

          {resources.map((res) => (
            <div key={res.id as string} className="card-elevated p-4 flex justify-between items-start gap-3">
              <div>
                <p className="font-medium text-ink">{res.title as string}</p>
                <p className="text-xs text-ink-muted mt-1">
                  {(res.category as string) || 'guide'} · {(res.status as string) || 'published'}
                </p>
              </div>
              <button
                onClick={async () => {
                  if (!confirm('Delete this resource?')) return
                  await deleteResource(res.id as string)
                  await load()
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
