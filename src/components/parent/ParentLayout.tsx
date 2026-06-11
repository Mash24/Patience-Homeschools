'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, User, LogOut, MessageSquare, Clock, Inbox } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import NotificationBell from '@/components/shared/NotificationBell'
import MenuToggle from '@/components/ui/MenuToggle'

const navigation = [
  { name: 'Overview', href: '/parent/dashboard', icon: LayoutDashboard, tab: 'overview' },
  { name: 'My Request', href: '/parent/dashboard?tab=request', icon: Inbox, tab: 'request' },
  { name: 'My Children', href: '/parent/dashboard?tab=children', icon: Users, tab: 'children' },
  { name: 'Teachers', href: '/parent/dashboard?tab=assignments', icon: Calendar, tab: 'assignments' },
  { name: 'Messages', href: '/parent/dashboard?tab=messages', icon: MessageSquare, tab: 'messages' },
  { name: 'Schedule', href: '/parent/dashboard?tab=schedule', icon: Clock, tab: 'schedule' },
  { name: 'Profile', href: '/parent/dashboard?tab=profile', icon: User, tab: 'profile' },
]

export default function ParentLayout({
  children,
  parentName,
}: {
  children: React.ReactNode
  parentName?: string
}) {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-ivory">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-ink/5 flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-ink/5">
              <Link href="/parent/dashboard" className="font-serif font-semibold text-ink">Parent Portal</Link>
              <MenuToggle open onClick={() => setSidebarOpen(false)} />
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.tab ? 'bg-gold-50 text-gold-700' : 'text-ink-muted hover:bg-ivory-dark hover:text-ink'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-ink/5">
        <div className="h-16 px-6 flex items-center border-b border-ink/5">
          <Link href="/parent/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center">
              <span className="font-serif text-base font-semibold text-gold-400">N</span>
            </div>
            <div>
              <span className="block font-serif font-semibold text-ink leading-none">Nelimac</span>
              <span className="block text-[10px] uppercase tracking-wider text-ink-muted">Parent</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.tab ? 'bg-gold-50 text-gold-700' : 'text-ink-muted hover:bg-ivory-dark hover:text-ink'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-ink/5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-xl border-b border-ink/5 flex items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <MenuToggle open={sidebarOpen} onClick={() => setSidebarOpen((v) => !v)} />
            <span className="font-serif text-base font-semibold text-ink truncate max-w-[140px]">
              {parentName ? parentName.split(' ')[0] : 'Parent'}
            </span>
          </div>
          <p className="hidden lg:block text-sm text-ink-muted">
            Welcome{parentName ? `, ${parentName.split(' ')[0]}` : ''}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <NotificationBell />
            <Link href="/" className="text-xs text-ink-muted hover:text-ink">Back to site</Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
