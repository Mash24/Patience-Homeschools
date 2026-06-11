'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Mail,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import NotificationBell from '@/components/shared/NotificationBell'
import MenuToggle from '@/components/ui/MenuToggle'

const navigation = [
  { name: 'Overview', href: '/teacher/dashboard?tab=overview', icon: LayoutDashboard, tab: 'overview' },
  { name: 'Application', href: '/teacher/dashboard?tab=application', icon: FileText, tab: 'application' },
  { name: 'My Students', href: '/teacher/dashboard?tab=students', icon: Users, tab: 'students' },
  { name: 'Schedule', href: '/teacher/dashboard?tab=schedule', icon: Calendar, tab: 'schedule' },
  { name: 'Messages', href: '/teacher/dashboard?tab=messages', icon: Mail, tab: 'messages' },
  { name: 'Documents', href: '/teacher/dashboard?tab=documents', icon: FileText, tab: 'documents' },
  { name: 'Profile', href: '/teacher/dashboard?tab=profile', icon: Settings, tab: 'profile' },
]

export default function TeacherLayout({
  children,
  teacherName,
  statusBadge,
}: {
  children: React.ReactNode
  teacherName?: string
  statusBadge?: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'overview'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinkClass = (tab: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'bg-gold-50 text-gold-700'
        : 'text-ink-muted hover:bg-ivory-dark hover:text-ink'
    }`

  return (
    <div className="min-h-screen bg-ivory">
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-ink/40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-ink/5 shadow-luxury flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-ink/5">
              <Link href="/teacher/dashboard" className="font-serif font-semibold text-ink" onClick={() => setSidebarOpen(false)}>
                Teacher Portal
              </Link>
              <MenuToggle open onClick={() => setSidebarOpen(false)} />
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass(item.tab)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-ink/5">
        <div className="h-16 px-6 flex items-center border-b border-ink/5">
          <Link href="/teacher/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center">
              <span className="font-serif text-base font-semibold text-gold-400">N</span>
            </div>
            <div>
              <span className="block font-serif font-semibold text-ink leading-none">Nelimac</span>
              <span className="block text-[10px] uppercase tracking-wider text-ink-muted">Teacher</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={navLinkClass(item.tab)}>
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
            <span className="font-serif text-base font-semibold text-ink truncate max-w-[120px]">
              {teacherName?.split(' ')[0] || 'Teacher'}
            </span>
          </div>
          <p className="hidden lg:block text-sm text-ink-muted truncate">
            Welcome{teacherName ? `, ${teacherName.split(' ')[0]}` : ''}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            {statusBadge}
            <NotificationBell />
            <Link href="/" className="hidden sm:inline text-xs text-ink-muted hover:text-ink">Back to site</Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl">{children}</main>
      </div>
    </div>
  )
}
