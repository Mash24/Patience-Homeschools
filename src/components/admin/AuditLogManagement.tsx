'use client'

import { useState, useEffect } from 'react'
import { Loader2, Activity } from 'lucide-react'
import { getAdminActions } from '@/lib/admin/actions'

interface AdminAction {
  id: string
  entity_type: string
  entity_id?: string
  action: string
  meta?: Record<string, unknown>
  created_at: string
}

function formatAction(action: AdminAction) {
  const type = action.entity_type?.replace('_', ' ') || 'item'
  const verb = action.action?.replace(/_/g, ' ') || 'updated'
  return `${verb} · ${type}`
}

export default function AuditLogManagement() {
  const [actions, setActions] = useState<AdminAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminActions(50)
      .then((data) => setActions(data as AdminAction[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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
        <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Audit Log</h1>
        <p className="mt-1 text-sm text-ink-muted">Recent admin actions across the platform</p>
      </div>

      {actions.length === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          No admin actions recorded yet.
        </div>
      ) : (
        <div className="card-elevated divide-y divide-ink/5">
          {actions.map((a) => (
            <div key={a.id} className="flex items-start gap-3 p-4">
              <Activity className="h-4 w-4 text-gold-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink capitalize">{formatAction(a)}</p>
                {a.entity_id && (
                  <p className="text-xs text-ink-muted truncate">ID: {a.entity_id}</p>
                )}
                <p className="text-xs text-ink-muted/70 mt-1">
                  {new Date(a.created_at).toLocaleString('en-KE')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
