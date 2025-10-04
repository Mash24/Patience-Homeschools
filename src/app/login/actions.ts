'use server'

import { createClient } from '@/lib/supabase-server'
import { ratelimit } from '@/lib/ratelimit'

export async function sendMagicLink(email: string, redirectTo = '/admin') {
  // Rate limit: 1 request per 15 seconds per email
  await ratelimit(`otp:${email}`, { limit: 1, windowSec: 15 })
  
  const supabase = await createClient()
  
  // Always redirect to admin for admin users
  const finalRedirectTo = redirectTo === '/' ? '/admin' : redirectTo
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?redirectTo=${encodeURIComponent(finalRedirectTo)}`,
      shouldCreateUser: true,
    },
  })
  
  if (error) throw new Error(error.message)
  return { ok: true }
}
