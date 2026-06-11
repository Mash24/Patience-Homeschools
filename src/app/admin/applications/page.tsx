import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/admin/AdminLayout'

export default async function AdminApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin-login')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') redirect('/unauthorized')

  return (
    <AdminLayout>
      <div className="card-elevated p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-2">Coming Soon</p>
        <h1 className="font-serif text-2xl font-semibold text-ink mb-3">Teacher Applications</h1>
        <p className="text-ink-muted">Application review and approval workflow will be available in the next release.</p>
      </div>
    </AdminLayout>
  )
}
