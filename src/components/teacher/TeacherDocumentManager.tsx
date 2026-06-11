'use client'

import { useState, useRef } from 'react'
import { Upload, Eye, Trash2, Loader2, FileText } from 'lucide-react'
import {
  uploadTeacherDocumentFile,
  getTeacherDocumentUrl,
  deleteTeacherDocumentRecord,
  replaceRejectedDocument,
} from '@/lib/teachers/documents'

interface Doc {
  id: string
  kind: string
  file_name: string
  file_path: string
  verified_at?: string
  rejection_reason?: string
}

const DOC_TYPES = [
  { value: 'cv', label: 'CV / Resume' },
  { value: 'profile_photo', label: 'Profile photo' },
  { value: 'tsc_certificate', label: 'TSC certificate' },
  { value: 'education_certificate', label: 'Education certificate' },
  { value: 'other_document', label: 'Other document' },
]

export default function TeacherDocumentManager({
  documents,
  onUpdated,
  canUpload,
}: {
  documents: Doc[]
  onUpdated: () => void
  canUpload: boolean
}) {
  const [kind, setKind] = useState('cv')
  const [uploading, setUploading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [replacingId, setReplacingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('kind', kind)
      await uploadTeacherDocumentFile(fd)
      onUpdated()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleView = async (doc: Doc) => {
    setActionId(doc.id)
    try {
      const url = await getTeacherDocumentUrl(doc.file_path)
      window.open(url, '_blank')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not open file')
    } finally {
      setActionId(null)
    }
  }

  const handleReplace = async (doc: Doc, file: File) => {
    setUploading(true)
    setReplacingId(doc.id)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await replaceRejectedDocument(doc.id, fd)
      onUpdated()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Re-upload failed')
    } finally {
      setUploading(false)
      setReplacingId(null)
    }
  }

  const handleDelete = async (doc: Doc) => {
    if (!confirm(`Delete ${doc.file_name}?`)) return
    setActionId(doc.id)
    try {
      await deleteTeacherDocumentRecord(doc.id)
      onUpdated()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="space-y-6">
      {canUpload && (
        <div className="card-elevated p-5 space-y-3">
          <h3 className="font-medium text-ink">Upload a document</h3>
          <select className="input-field" value={kind} onChange={(e) => setKind(e.target.value)}>
            {DOC_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="input-field text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-ink-muted flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
            </p>
          )}
        </div>
      )}

      {documents.length === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          No documents uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="card-elevated p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ivory-dark rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-ink-muted" />
                  </div>
                  <div>
                    <p className="font-medium text-ink capitalize text-sm">
                      {doc.kind.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-ink-muted truncate max-w-[180px]">{doc.file_name}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  doc.verified_at
                    ? 'bg-green-100 text-green-800'
                    : doc.rejection_reason
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.verified_at ? 'Verified' : doc.rejection_reason ? 'Rejected' : 'Pending'}
                </span>
              </div>
              {doc.rejection_reason && (
                <div className="mb-3 bg-red-50 p-3 rounded-lg space-y-2">
                  <p className="text-xs text-red-700 font-medium">Admin feedback</p>
                  <p className="text-xs text-red-600">{doc.rejection_reason}</p>
                  {canUpload && (
                    <label className="btn-primary text-xs inline-flex items-center gap-1 cursor-pointer">
                      {uploading && replacingId === doc.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3" />
                      )}
                      Re-upload corrected file
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleReplace(doc, file)
                        }}
                      />
                    </label>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(doc)}
                  disabled={actionId === doc.id}
                  className="btn-outline text-xs flex items-center gap-1"
                >
                  {actionId === doc.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                  View
                </button>
                {canUpload && !doc.verified_at && !doc.rejection_reason && (
                  <button
                    onClick={() => handleDelete(doc)}
                    disabled={actionId === doc.id}
                    className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
