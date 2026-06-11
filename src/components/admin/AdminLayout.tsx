'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MessageSquare,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  Calendar,
  Inbox,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads', href: '/admin/leads', icon: Inbox },
  { name: 'Teachers', href: '/admin/teachers', icon: Users },
  { name: 'Parents', href: '/admin/parents', icon: UserCheck },
  { name: 'Assignments', href: '/admin/assignments', icon: Calendar },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <ul className="space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-50 text-gold-700'
                  : 'text-ink-muted hover:bg-ivory-dark hover:text-ink'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ivory">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-ink/5 shadow-luxury flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-ink/5">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center">
                  <span className="font-serif text-sm font-semibold text-gold-400">N</span>
                </div>
                <span className="font-serif font-semibold text-ink">Admin</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-ink-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
              <NavLinks onNavigate={() => setSidebarOpen(false)} />
            </nav>
          </div>
        </div>
      )}

      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-ink/5">
        <div className="flex items-center h-16 px-6 border-b border-ink/5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center">
              <span className="font-serif text-base font-semibold text-gold-400">N</span>
            </div>
            <div>
              <span className="block font-serif font-semibold text-ink leading-none">Nelimac</span>
              <span className="block text-[10px] uppercase tracking-wider text-ink-muted">Admin</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-ink/5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Back to site
          </Link>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-xl border-b border-ink/5 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-ink-muted hover:text-ink"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <p className="hidden lg:block text-sm font-medium text-ink-muted">Administration</p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gold-500 flex items-center justify-center">
              <span className="text-xs font-bold text-ink">A</span>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
