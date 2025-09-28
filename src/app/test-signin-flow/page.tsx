'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestSigninFlow() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[${timestamp}] ${message}`)
  }

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      addLog('🔍 Checking current user status...')
      
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
      setUser(user)
      
      // Check profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) {
        addLog(`❌ Error getting profile: ${profileError.message}`)
      } else if (profileData) {
        addLog(`✅ Profile found - Role: ${profileData.role}`)
        setProfile(profileData)
      } else {
        addLog('❌ No profile found')
      }
      
      // Check teacher record
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (teacherError) {
        addLog(`❌ Error getting teacher record: ${teacherError.message}`)
      } else if (teacherData) {
        addLog(`✅ Teacher record found - Status: ${teacherData.status}`)
        setTeacher(teacherData)
      } else {
        addLog('❌ No teacher record found')
      }
      
      // Determine what should happen
      addLog('🎯 Determining redirect logic...')
      
      if (profileData?.role === 'teacher') {
        addLog('✅ User has teacher profile - should redirect to /teacher/dashboard')
      } else if (teacherData) {
        addLog('⚠️ User has teacher record but no profile - should create profile and redirect')
      } else {
        addLog('❌ User has no teacher record or profile - should redirect to /teacher-apply')
      }
      
    } catch (err) {
      addLog(`💥 Error: ${err}`)
    }
  }

  const testRedirect = async (path: string) => {
    addLog(`🧪 Testing redirect to: ${path}`)
    try {
      router.push(path)
    } catch (err) {
      addLog(`❌ Redirect failed: ${err}`)
    }
  }

  const createProfile = async () => {
    if (!user || !teacher) return
    
    try {
      addLog('🔧 Creating profile...')
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          role: 'teacher',
          full_name: teacher.full_name,
          email: teacher.email,
          phone: teacher.phone,
          location: teacher.location_area,
        })
      
      if (error) {
        addLog(`❌ Error creating profile: ${error.message}`)
      } else {
        addLog('✅ Profile created successfully!')
        await checkUserStatus() // Refresh
      }
    } catch (err) {
      addLog(`💥 Error: ${err}`)
    }
  }

  const signOut = async () => {
    try {
      addLog('🚪 Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setTeacher(null)
      addLog('✅ Signed out')
    } catch (err) {
      addLog(`💥 Error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Test Signin Flow</h1>
        
        {/* Current State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👤 User</h2>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>
            ) : (
              <p className="text-gray-600">No user</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Profile</h2>
            {profile ? (
              <div className="space-y-2 text-sm">
                <p><strong>Role:</strong> {profile.role}</p>
                <p><strong>Name:</strong> {profile.full_name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-600">❌ No profile</p>
                {user && teacher && (
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

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">👨‍🏫 Teacher</h2>
            {teacher ? (
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {teacher.status}</p>
                <p><strong>Name:</strong> {teacher.full_name}</p>
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
          <div className="bg-gray-100 rounded p-4 h-64 overflow-y-auto">
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
