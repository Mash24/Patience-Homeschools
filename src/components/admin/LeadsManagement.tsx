'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Inbox,
  Eye,
  Search,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  ExternalLink,
  BookOpen,
  Calendar,
  DollarSign,
  Download,
} from 'lucide-react'
import type { ParentLead } from '@/lib/schemas'
import { getLeads, updateLeadStatus, bulkUpdateLeadStatus, convertLeadToParent, exportLeadsCsv, type LeadStatus } from '@/app/admin/leads/actions'
import TeacherMatchSuggestions from '@/components/admin/TeacherMatchSuggestions'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'matched', label: 'Matched' },
  { value: 'closed', label: 'Closed' },
] as const

function formatMode(mode: string) {
  switch (mode) {
    case 'in_home': return 'In-home'
    case 'online': return 'Online'
    case 'hybrid': return 'Hybrid'
    default: return mode
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LeadsManagement() {
  const searchParams = useSearchParams()
  const [leads, setLeads] = useState<ParentLead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<ParentLead | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    loadLeads()
  }, [selectedStatus])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const data = await getLeads(selectedStatus === 'all' ? undefined : selectedStatus)
      setLeads((data as ParentLead[]) || [])
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const q = searchTerm.toLowerCase()
    return (
      lead.parent_name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.child_first_name?.toLowerCase().includes(q) ?? false) ||
      lead.subjects.some((s) => s.toLowerCase().includes(q)) ||
      (lead.city?.toLowerCase().includes(q) ?? false)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gold-50 text-gold-800'
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800'
      case 'matched': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-ivory-dark text-ink-muted'
      default: return 'bg-ivory-dark text-ink'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Clock
      case 'shortlisted': return UserPlus
      case 'matched': return CheckCircle
      case 'closed': return XCircle
      default: return Clock
    }
  }

  const handleConvert = async (leadId: string) => {
    if (!confirm('Create a parent account and send an invite email to this lead?')) return
    try {
      setActionLoading(leadId)
      await convertLeadToParent(leadId)
      await loadLeads()
      alert('Parent account created and invite email sent.')
    } catch (error) {
      console.error('Error converting lead:', error)
      alert(error instanceof Error ? error.message : 'Failed to convert lead')
    } finally {
      setActionLoading(null)
    }
  }

  const handleExportCsv = async () => {
    try {
      const csv = await exportLeadsCsv(selectedStatus)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `parent-leads-${selectedStatus}-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export leads')
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filteredLeads.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredLeads.map((l) => l.id)))
    }
  }

  const handleBulkStatus = async (status: LeadStatus) => {
    const ids = Array.from(selected)
    if (!ids.length || !confirm(`Update ${ids.length} lead(s) to "${status}"?`)) return
    setBulkLoading(true)
    try {
      await bulkUpdateLeadStatus(ids, status)
      setSelected(new Set())
      await loadLeads()
    } catch (error) {
      console.error('Bulk update error:', error)
      alert('Failed to update leads')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleStatusChange = async (leadId: string, status: LeadStatus) => {
    try {
      setActionLoading(leadId)
      await updateLeadStatus(leadId, status)
      await loadLeads()
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status } : null))
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      alert('Failed to update lead status. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Parent Leads</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Hire-a-teacher requests from the concierge matching form
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/60" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-ink/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-ink/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={handleExportCsv}
            className="btn-outline text-sm flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total', count: leads.length, color: 'bg-ink' },
          { label: 'New', count: leads.filter((l) => l.status === 'new').length, color: 'bg-gold-500' },
          { label: 'Shortlisted', count: leads.filter((l) => l.status === 'shortlisted').length, color: 'bg-yellow-500' },
          { label: 'Matched', count: leads.filter((l) => l.status === 'matched').length, color: 'bg-sage-500' },
        ].map((stat) => (
          <div key={stat.label} className="card-elevated p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Inbox className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-ink-muted">{stat.label}</p>
                <p className="text-sm sm:text-lg font-bold text-ink">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="card-elevated p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-ink-muted">{selected.size} selected</span>
          <button
            onClick={() => handleBulkStatus('shortlisted')}
            disabled={bulkLoading}
            className="btn-outline text-xs"
          >
            Shortlist
          </button>
          <button
            onClick={() => handleBulkStatus('matched')}
            disabled={bulkLoading}
            className="btn-outline text-xs"
          >
            Mark matched
          </button>
          <button
            onClick={() => handleBulkStatus('closed')}
            disabled={bulkLoading}
            className="text-xs text-ink-muted border border-ink/10 px-3 py-1.5 rounded-xl hover:bg-ivory"
          >
            Close
          </button>
        </div>
      )}

      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink/5">
            <thead className="bg-ivory">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selected.size === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-gold-600 rounded border-ink/20"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Parent</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Child / Grade</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Subjects</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-ink-muted text-sm">
                    No leads found. Submissions from the hire-teacher form will appear here.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const StatusIcon = getStatusIcon(lead.status)
                  return (
                    <tr key={lead.id} className="hover:bg-ivory/50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                          className="h-4 w-4 text-gold-600 rounded border-ink/20"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gold-500 flex items-center justify-center shrink-0">
                            <span className="text-ink text-xs font-bold">
                              {lead.parent_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{lead.parent_name}</p>
                            <p className="text-xs text-ink-muted truncate">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 text-sm text-ink">
                        {lead.child_first_name || '—'}
                        <span className="block text-xs text-ink-muted">{lead.grade_level}</span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {lead.subjects.slice(0, 2).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-gold-50 text-gold-800">{s}</span>
                          ))}
                          {lead.subjects.length > 2 && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-ivory-dark text-ink-muted">+{lead.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 text-xs text-ink-muted whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{lead.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {lead.status === 'new' && (
                            <button
                              onClick={() => handleStatusChange(lead.id, 'shortlisted')}
                              disabled={actionLoading === lead.id}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Shortlist"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-ink/40">
          <div className="bg-white rounded-2xl shadow-luxury w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-ink/5 px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-ink">Lead Details</h3>
              <button onClick={() => setSelectedLead(null)} className="p-1 text-ink-muted hover:text-ink">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLead.status)}`}>
                  {(() => { const Icon = getStatusIcon(selectedLead.status); return <Icon className="h-4 w-4" /> })()}
                  <span className="capitalize">{selectedLead.status}</span>
                </span>
                <span className="text-xs text-ink-muted">{formatDate(selectedLead.created_at)}</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-600">Contact</h4>
                <div className="grid gap-2 text-sm">
                  <p className="font-medium text-ink">{selectedLead.parent_name}</p>
                  <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-gold-600 hover:text-gold-700">
                    <Mail className="h-4 w-4" />{selectedLead.email}
                  </a>
                  {selectedLead.phone && (
                    <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-ink-muted">
                      <Phone className="h-4 w-4" />{selectedLead.phone}
                    </a>
                  )}
                  {(selectedLead.city || selectedLead.location_area) && (
                    <p className="flex items-center gap-2 text-ink-muted">
                      <MapPin className="h-4 w-4" />
                      {[selectedLead.location_area, selectedLead.city].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-600">Child & Learning</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-ink-muted text-xs">Child</p>
                    <p className="text-ink">{selectedLead.child_first_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">Grade</p>
                    <p className="text-ink flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" />{selectedLead.grade_level}</p>
                  </div>
                  <div>
                    <p className="text-ink-muted text-xs">Mode</p>
                    <p className="text-ink">{formatMode(selectedLead.mode)}</p>
                  </div>
                  {selectedLead.budget_band && (
                    <div>
                      <p className="text-ink-muted text-xs">Budget</p>
                      <p className="text-ink flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{selectedLead.budget_band}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-ink-muted text-xs mb-1 flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />Curricula</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedLead.curricula.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full text-xs bg-ivory-dark text-ink">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-ink-muted text-xs mb-1">Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedLead.subjects.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-gold-50 text-gold-800">{s}</span>
                    ))}
                  </div>
                </div>
                {selectedLead.goals && (
                  <div>
                    <p className="text-ink-muted text-xs mb-1">Goals</p>
                    <p className="text-sm text-ink">{selectedLead.goals}</p>
                  </div>
                )}
                {selectedLead.schedule_note && (
                  <div>
                    <p className="text-ink-muted text-xs mb-1 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Schedule</p>
                    <p className="text-sm text-ink">{selectedLead.schedule_note}</p>
                  </div>
                )}
              </div>

              {(selectedLead.status === 'new' || selectedLead.status === 'shortlisted') && (
                <TeacherMatchSuggestions leadId={selectedLead.id} />
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-ink/5 px-6 py-4 flex flex-wrap gap-2 justify-end">
              <button onClick={() => setSelectedLead(null)} className="btn-outline text-sm">
                Close
              </button>
              {selectedLead.status === 'new' && (
                <button
                  onClick={() => handleConvert(selectedLead.id)}
                  disabled={actionLoading === selectedLead.id}
                  className="btn-secondary text-sm"
                >
                  Create parent account
                </button>
              )}
              {selectedLead.status !== 'closed' && (
                <button
                  onClick={() => handleStatusChange(selectedLead.id, 'closed')}
                  disabled={actionLoading === selectedLead.id}
                  className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50"
                >
                  Close lead
                </button>
              )}
              {selectedLead.status === 'new' && (
                <button
                  onClick={() => handleStatusChange(selectedLead.id, 'shortlisted')}
                  disabled={actionLoading === selectedLead.id}
                  className="btn-secondary text-sm"
                >
                  Shortlist
                </button>
              )}
              {(selectedLead.status === 'new' || selectedLead.status === 'shortlisted') && (
                <Link
                  href={`/admin/assignments/new?leadId=${selectedLead.id}`}
                  className="btn-primary text-sm"
                >
                  Create assignment
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
              {selectedLead.status === 'shortlisted' && (
                <button
                  onClick={() => handleStatusChange(selectedLead.id, 'matched')}
                  disabled={actionLoading === selectedLead.id}
                  className="btn-primary text-sm"
                >
                  Mark matched
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
