'use client'

import { useState, useEffect } from 'react'
import { Loader2, Users } from 'lucide-react'
import { getPlatformUsers } from '@/lib/admin/actions'

interface PlatformUser {
  id: string
  full_name?: string
  role?: string
  phone?: string
  created_at?: string
}

const roleColors: Record<string, string> = {
  admin: 'bg-ink text-white',
  teacher: 'bg-gold-50 text-gold-800',
  parent: 'bg-sage-50 text-sage-800',
}

export default function UsersManagement() {
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getPlatformUsers()
      .then((data) => setUsers(data as PlatformUser[]))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter)

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
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-ink">Users</h1>
          <p className="mt-1 text-sm text-ink-muted">{users.length} platform accounts</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-elevated p-8 text-center text-sm text-ink-muted">
          No users found.
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory border-b border-ink/5">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-ink-muted">Name</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted hidden sm:table-cell">Role</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-ink-muted hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-ivory/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-gold-600" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{u.full_name || 'Unnamed'}</p>
                        <p className="text-xs text-ink-muted sm:hidden capitalize">{u.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[u.role || ''] || 'bg-ivory-dark text-ink-muted'}`}>
                      {u.role || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted hidden md:table-cell">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-ink-muted hidden lg:table-cell">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
