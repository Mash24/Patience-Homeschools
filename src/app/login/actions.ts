'use server'

import { createClient } from '@/lib/supabase-server'
import { ratelimit } from '@/lib/ratelimit'

export async function sendMagicLink(email: string, redirectTo = '/parent/dashboard') {
  await ratelimit(`otp:${email}`, { limit: 1, windowSec: 15 })
  
  const supabase = await createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const finalRedirectTo = redirectTo || '/parent/dashboard'
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?redirectTo=${encodeURIComponent(finalRedirectTo)}`,
      shouldCreateUser: true,
      data: { role: 'parent' },
    },
  })
  
  if (error) throw new Error(error.message)
  return { ok: true }
}
