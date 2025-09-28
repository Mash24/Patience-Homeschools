'use server'

import { supabaseServer } from '@/lib/supabaseServer'

// Test function to debug email issues
export async function testEmailSending(email: string) {
  try {
    console.log('Testing email sending to:', email)
    
    // Test 1: Check if we can generate a magic link
    const { data, error } = await supabaseServer.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (error) {
      console.error('Magic link generation failed:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    console.log('Magic link generated successfully')
    console.log('Magic link:', data.properties?.action_link)

    return {
      success: true,
      magicLink: data.properties?.action_link,
      message: 'Magic link generated successfully. Check your email.'
    }

  } catch (error) {
    console.error('Test email sending failed:', error)
    return {
      success: false,
      error: 'Test failed',
      details: error
    }
  }
}

// Alternative: Create user directly and send OTP
export async function createUserAndSendOTP(email: string, password: string) {
  try {
    console.log('Creating user and sending OTP to:', email)
    
    // Create user
    const { data: userData, error: userError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: false // Don't auto-confirm, send OTP instead
    })

    if (userError) {
      console.error('User creation failed:', userError)
      return {
        success: false,
        error: userError.message
      }
    }

    // Send OTP
    const { error: otpError } = await supabaseServer.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (otpError) {
      console.error('OTP sending failed:', otpError)
      return {
        success: false,
        error: otpError.message
      }
    }

    return {
      success: true,
      message: 'User created and OTP sent successfully'
    }

  } catch (error) {
    console.error('Create user and send OTP failed:', error)
    return {
      success: false,
      error: 'Operation failed'
    }
  }
}
