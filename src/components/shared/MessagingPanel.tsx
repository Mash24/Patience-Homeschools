'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Send, Loader2 } from 'lucide-react'
import {
  getMyThreads,
  getOrCreateAssignmentThread,
  sendMessage,
} from '@/lib/messaging/actions'

interface Thread {
  id: string
  subject?: string
  status: string
  created_at: string
  context?: { assignment_id?: string }
  messages?: { id: string; sender_role: string; body: string; created_at: string }[]
}

export default function MessagingPanel({
  assignmentId,
  title = 'Messages',
}: {
  assignmentId?: string
  title?: string
}) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThread, setActiveThread] = useState<Thread | null>(null)
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const loadThreads = async () => {
    try {
      setLoading(true)
      if (assignmentId) {
        const thread = await getOrCreateAssignmentThread(assignmentId) as Thread
        setThreads([thread])
        setActiveThread(thread)
      } else {
        const data = await getMyThreads() as Thread[]
        setThreads(data)
        if (data.length && !activeThread) setActiveThread(data[0])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreads()
  }, [assignmentId])

  const handleSend = async () => {
    if (!activeThread || !reply.trim()) return
    setSending(true)
    try {
      await sendMessage(activeThread.id, reply)
      setReply('')
      await loadThreads()
      const updated = threads.find((t) => t.id === activeThread.id)
      if (updated) setActiveThread(updated)
    } catch {
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
      </div>
    )
  }

  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-4 border-b border-ink/5 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-gold-600" />
        <h2 className="font-semibold text-ink">{title}</h2>
      </div>

      {threads.length === 0 ? (
        <p className="p-8 text-center text-sm text-ink-muted">
          No conversations yet. Messages appear once you have an active assignment.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 min-h-[320px]">
          {!assignmentId && (
            <div className="border-r border-ink/5 md:col-span-1 max-h-80 overflow-y-auto">
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThread(t)}
                  className={`w-full text-left px-4 py-3 border-b border-ink/5 hover:bg-ivory ${
                    activeThread?.id === t.id ? 'bg-gold-50' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-ink truncate">{t.subject || 'Conversation'}</p>
                  <p className="text-xs text-ink-muted capitalize">{t.status}</p>
                </button>
              ))}
            </div>
          )}

          <div className={`flex flex-col ${assignmentId ? 'md:col-span-3' : 'md:col-span-2'}`}>
            {activeThread ? (
              <>
                <div className="flex-1 p-4 space-y-3 max-h-64 overflow-y-auto bg-ivory/50">
                  {(activeThread.messages || []).length === 0 ? (
                    <p className="text-sm text-ink-muted text-center py-8">Start the conversation below.</p>
                  ) : (
                    (activeThread.messages || []).map((m) => (
                      <div key={m.id} className="bg-white rounded-xl px-4 py-2 text-sm shadow-sm">
                        <p className="text-xs font-semibold text-gold-600 capitalize mb-1">{m.sender_role}</p>
                        <p className="text-ink">{m.body}</p>
                      </div>
                    ))
                  )}
                </div>
                {activeThread.status === 'open' && (
                  <div className="p-4 border-t border-ink/5 flex gap-2">
                    <input
                      className="input-field flex-1"
                      placeholder="Type your message..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    />
                    <button onClick={handleSend} disabled={sending} className="btn-primary shrink-0">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="p-8 text-sm text-ink-muted text-center">Select a conversation</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
