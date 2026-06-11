'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, XCircle, Loader2 } from 'lucide-react'
import { getMyThreads, adminReplyToThread, closeThread } from '@/lib/messaging/actions'

interface Thread {
  id: string
  subject?: string
  status: string
  created_at: string
  messages?: { id: string; sender_role: string; body: string; created_at: string }[]
}

export default function MessagesManagement() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selected, setSelected] = useState<Thread | null>(null)
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const data = await getMyThreads() as Thread[]
      setThreads(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleReply = async () => {
    if (!selected || !reply.trim()) return
    setSending(true)
    try {
      await adminReplyToThread(selected.id, reply)
      setReply('')
      await load()
      const updated = threads.find((t) => t.id === selected.id)
      if (updated) setSelected(updated)
    } finally {
      setSending(false)
    }
  }

  const handleClose = async (id: string) => {
    await closeThread(id)
    await load()
    setSelected(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">Messages</h1>
        <p className="text-sm text-ink-muted">Parent–teacher conversations and support threads</p>
      </div>

      <div className="card-elevated grid md:grid-cols-3 min-h-[480px] overflow-hidden">
        <div className="border-r border-ink/5 max-h-[480px] overflow-y-auto">
          {threads.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted text-center">No message threads yet.</p>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left px-4 py-3 border-b border-ink/5 hover:bg-ivory ${
                  selected?.id === t.id ? 'bg-gold-50' : ''
                }`}
              >
                <p className="text-sm font-medium text-ink truncate">{t.subject || 'Conversation'}</p>
                <p className="text-xs text-ink-muted capitalize">{t.status}</p>
              </button>
            ))
          )}
        </div>

        <div className="md:col-span-2 flex flex-col">
          {selected ? (
            <>
              <div className="px-4 py-3 border-b border-ink/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gold-600" />
                  <span className="font-medium text-ink">{selected.subject}</span>
                </div>
                {selected.status === 'open' && (
                  <button onClick={() => handleClose(selected.id)} className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Close thread
                  </button>
                )}
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-ivory/30 max-h-72">
                {(selected.messages || []).map((m) => (
                  <div key={m.id} className="bg-white rounded-xl px-4 py-2 text-sm">
                    <p className="text-xs font-semibold text-gold-600 capitalize">{m.sender_role}</p>
                    <p className="text-ink mt-1">{m.body}</p>
                  </div>
                ))}
              </div>
              {selected.status === 'open' && (
                <div className="p-4 border-t border-ink/5 flex gap-2">
                  <input
                    className="input-field flex-1"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply as admin..."
                  />
                  <button onClick={handleReply} disabled={sending} className="btn-primary">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="p-12 text-center text-ink-muted text-sm">Select a thread to view messages</p>
          )}
        </div>
      </div>
    </div>
  )
}
