'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function DebugAuthFlowContent() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  useEffect(() => {
    debugAuthFlow()
  }, [])

  const debugAuthFlow = async () => {
    try {
      addLog('🔍 Starting auth flow debug...')
      
      // Check current user
      addLog('1. Checking current user...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        addLog(`❌ Error getting user: ${userError.message}`)
        return
      }
      
      if (!user) {
        addLog('❌ No user found - not authenticated')
        return
      }
      
      addLog(`✅ User found: ${user.email}`)
      addLog(`📧 User ID: ${user.id}`)
      addLog(`🔑 Password set: ${user.user_metadata?.password_set}`)
      addLog(`📋 ApplicationId in metadata: ${user.user_metadata?.applicationId}`)
      addLog(`👤 Role in metadata: ${user.user_metadata?.role}`)
      
      setUser(user)
      
      // Check profile
      addLog('2. Checking user profile...')
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        addLog(`❌ Error getting profile: ${profileError.message}`)
      } else if (profileData) {
        addLog(`✅ Profile found - Role: ${profileData.role}`)
        addLog(`📝 Profile data: ${JSON.stringify(profileData, null, 2)}`)
        setProfile(profileData)
      } else {
        addLog('❌ No profile found')
      }
      
      // Check teacher record
      addLog('3. Checking teacher record...')
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (teacherError) {
        addLog(`❌ Error getting teacher record: ${teacherError.message}`)
      } else if (teacherData) {
        addLog(`✅ Teacher record found - Status: ${teacherData.status}`)
        addLog(`📊 Teacher data: ${JSON.stringify(teacherData, null, 2)}`)
        setTeacher(teacherData)
      } else {
        addLog('❌ No teacher record found')
      }
      
      // Check provisional application
      addLog('4. Checking provisional applications...')
      const { data: provisionalData, error: provisionalError } = await supabase
        .from('provisional_applications')
        .select('*')
        .eq('email', user.email)
        .order('application_date', { ascending: false })
        .limit(1)
      
      if (provisionalError) {
        addLog(`❌ Error getting provisional applications: ${provisionalError.message}`)
      } else if (provisionalData && provisionalData.length > 0) {
        addLog(`✅ Provisional application found: ${provisionalData[0].id}`)
        addLog(`📋 Provisional data: ${JSON.stringify(provisionalData[0], null, 2)}`)
      } else {
        addLog('❌ No provisional applications found')
      }
      
      // Determine what should happen next
      addLog('5. Determining next steps...')
      
      if (!user.user_metadata?.password_set) {
        addLog('🔄 User needs password setup')
        addLog('📍 Should redirect to: /signup or /setup-password')
      } else if (profileData?.role === 'teacher') {
        addLog('✅ User is a teacher with password set')
        addLog('📍 Should redirect to: /teacher/dashboard')
      } else if (!profileData) {
        addLog('❌ User has no profile - this is the problem!')
        addLog('📍 User will be redirected to /teacher-apply by middleware')
      } else {
        addLog(`❓ Unknown state - Role: ${profileData?.role}`)
      }
      
    } catch (err) {
      addLog(`💥 Error in debug flow: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testRedirect = (path: string) => {
    addLog(`🧪 Testing redirect to: ${path}`)
    router.push(path)
  }

  const createProfile = async () => {
    if (!user) return
    
    try {
      addLog('🔧 Creating missing profile...')
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          role: 'teacher',
          full_name: user.user_metadata?.full_name || '',
          email: user.email,
        })
      
      if (error) {
        addLog(`❌ Error creating profile: ${error.message}`)
      } else {
        addLog('✅ Profile created successfully!')
        await debugAuthFlow() // Refresh data
      }
    } catch (err) {
      addLog(`💥 Error creating profile: ${err}`)
    }
  }

  const signOut = async () => {
    try {
      addLog('🚪 Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setTeacher(null)
      addLog('✅ Signed out successfully')
    } catch (err) {
      addLog(`💥 Error signing out: ${err}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Debugging auth flow...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Auth Flow Debug</h1>
        
        {/* Current State */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👤 User</h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Password Set:</strong> {user.user_metadata?.password_set ? '✅' : '❌'}</p>
                <p><strong>ApplicationId:</strong> {user.user_metadata?.applicationId || 'None'}</p>
                <p><strong>Role:</strong> {user.user_metadata?.role || 'None'}</p>
              </div>
            ) : (
              <p className="text-gray-600">No user</p>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Profile</h2>
            {profile ? (
              <div className="space-y-2 text-sm">
                <p><strong>Role:</strong> {profile.role}</p>
                <p><strong>Name:</strong> {profile.full_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || 'None'}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600">❌ No profile found</p>
                {user && (
                  <button
                    onClick={createProfile}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Create Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Teacher Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👨‍🏫 Teacher</h2>
            {teacher ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {teacher.status}</p>
                <p><strong>Name:</strong> {teacher.full_name}</p>
                <p><strong>Subjects:</strong> {teacher.subjects?.join(', ') || 'None'}</p>
                <p><strong>Experience:</strong> {teacher.experience_years} years</p>
              </div>
            ) : (
              <p className="text-gray-600">No teacher record</p>
            )}
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => testRedirect('/teacher/dashboard')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Teacher Dashboard
            </button>
            <button
              onClick={() => testRedirect('/signup')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Signup Page
            </button>
            <button
              onClick={() => testRedirect('/teacher-apply')}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Test Teacher Apply
            </button>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📝 Debug Logs</h2>
          <div className="bg-gray-100 rounded p-4 h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="text-sm font-mono text-gray-800 mb-1">
                  {log}
                </p>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Debugging auth flow...</p>
      </div>
    </div>
  )
}

export default function DebugAuthFlowPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DebugAuthFlowContent />
    </Suspense>
  )
}
