import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function AdminApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')
  
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') redirect('/unauthorized')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Applications</h1>
          <p className="text-gray-600">Application review functionality coming soon...</p>
        </div>
      </div>
    </div>
  )
}