'use server'

import { supabaseServer } from '@/lib/supabaseServer'

export async function subscribe(formData: FormData) {
  const email = (formData.get('email') || '').toString().trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  try {
    const { error } = await supabaseServer
      .from('newsletter_subscribers')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

    if (error) {
      console.error('Newsletter subscribe error:', error)
      return { success: false, message: 'Something went wrong. Please try again.' }
    }

    return { success: true, message: 'Thank you for subscribing!' }
  } catch (e) {
    console.error('Newsletter subscribe:', e)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}
