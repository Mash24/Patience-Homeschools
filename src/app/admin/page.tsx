import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/')
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  // Fetch data for dashboard
  const [leadsResult, teachersResult] = await Promise.all([
    supabase
      .from('parent_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
  ])

  const leads = leadsResult.data || []
  const teachers = teachersResult.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard leads={leads} teachers={teachers} />
    </div>
  )
}
