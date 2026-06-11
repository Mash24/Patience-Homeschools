import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function AdminApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin-login')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') redirect('/unauthorized')

  redirect('/admin/teachers?status=submitted')
}
