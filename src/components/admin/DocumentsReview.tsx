'use client'

import { useState, useEffect } from 'react'
import { FileText, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import {
  getPendingDocuments,
  getAdminDocumentUrl,
  verifyTeacherDocument,
  rejectTeacherDocument,
  bulkVerifyDocuments,
  bulkRejectDocuments,
} from '@/lib/teachers/documents'

interface PendingDoc {
  id: string
  kind: string
  file_name: string
  file_path: string
  created_at: string
  teacher?: { full_name?: string; email?: string; status?: string }
}

export default function DocumentsReview() {
  const [docs, setDocs] = useState<PendingDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)

  const load = () => {
    setLoading(true)
    getPendingDocuments()
      .then((data) => setDocs(data as PendingDoc[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === docs.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(docs.map((d) => d.id)))
    }
  }

  const handleView = async (doc: PendingDoc) => {
    setActionId(doc.id)
    try {
      const url = await getAdminDocumentUrl(doc.file_path)
      window.open(url, '_blank')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not open file')
    } finally {
      setActionId(null)
    }
  }

  const handleVerify = async (id: string) => {
    setActionId(id)
    try {
      await verifyTeacherDocument(id)
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to verify')
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection:')
    if (!reason?.trim()) return
    setActionId(id)
    try {
      await rejectTeacherDocument(id, reason)
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to reject')
    } finally {
      setActionId(null)
    }
  }

  const handleBulkVerify = async () => {
    const ids = Array.from(selected)
    if (!ids.length || !confirm(`Verify ${ids.length} document(s)?`)) return
    setBulkLoading(true)
    try {
      await bulkVerifyDocuments(ids)
      setSelected(new Set())
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Bulk verify failed')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkReject = async () => {
    const ids = Array.from(selected)
    if (!ids.length) return
    const reason = prompt(`Rejection reason for ${ids.length} document(s):`)
    if (!reason?.trim()) return
    setBulkLoading(true)
    try {
      await bulkRejectDocuments(ids, reason)
      setSelected(new Set())
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Bulk reject failed')
    } finally {
      setBulkLoading(false)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Document review</h1>
          <p className="mt-1 text-sm text-ink-muted">{docs.length} documents awaiting verification</p>
        </div>
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-muted">{selected.size} selected</span>
            <button
              onClick={handleBulkVerify}
              disabled={bulkLoading}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Verify all
            </button>
            <button
              onClick={handleBulkReject}
              disabled={bulkLoading}
              className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 flex items-center gap-1"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject all
            </button>
          </div>
        )}
      </div>

      {docs.length === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          All caught up — no pending documents.
        </div>
      ) : (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-ink-muted px-1">
            <input
              type="checkbox"
              checked={selected.size === docs.length && docs.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-gold-600 rounded border-ink/20"
            />
            Select all
          </label>
          {docs.map((doc) => (
            <div key={doc.id} className="card-elevated p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                    className="mt-1 h-4 w-4 text-gold-600 rounded border-ink/20 shrink-0"
                  />
                  <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="font-medium text-ink capitalize">{doc.kind.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-ink-muted">{doc.file_name}</p>
                    <p className="text-xs text-gold-600 mt-1">
                      {doc.teacher?.full_name} · {doc.teacher?.email}
                    </p>
                    <p className="text-xs text-ink-muted/70 mt-0.5">
                      Uploaded {new Date(doc.created_at).toLocaleDateString('en-KE')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:pl-0 pl-7">
                  <button onClick={() => handleView(doc)} disabled={actionId === doc.id} className="btn-outline text-xs flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button onClick={() => handleVerify(doc.id)} disabled={actionId === doc.id} className="btn-primary text-xs flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Verify
                  </button>
                  <button onClick={() => handleReject(doc.id)} disabled={actionId === doc.id} className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
