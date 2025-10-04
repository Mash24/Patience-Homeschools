import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import AdminLayout from '@/components/admin/AdminLayout'
import TeachersManagement from './TeachersManagement'

export default async function TeachersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/admin-login')
  
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') redirect('/unauthorized')

  return (
    <AdminLayout>
      <TeachersManagement />
    </AdminLayout>
  )
}