'use server'

import { supabaseServer } from '@/lib/supabaseServer'

export async function submitProvisionalApplication(formData: FormData) {
  try {
    // Extract data from form
    const data = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      gender: formData.get('gender') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      subjects: JSON.parse(formData.get('subjects') as string || '[]'),
      curricula: JSON.parse(formData.get('curricula') as string || '[]'),
      gradeLevels: JSON.parse(formData.get('gradeLevels') as string || '[]'),
      experienceYears: parseInt(formData.get('experienceYears') as string || '0'),
      educationBackground: formData.get('educationBackground') as string,
      teachingPhilosophy: formData.get('teachingPhilosophy') as string,
      availability: JSON.parse(formData.get('availability') as string || '[]'),
      hourlyRateRange: formData.get('hourlyRateRange') as string,
      tscNumber: formData.get('tscNumber') as string,
      documents: {} // Will be handled by the API
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Invalid email format' }
    }

    // Call the teacher application API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/teacher-apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    
    if (result.success) {
      return {
        success: true,
        email: data.email,
        applicationId: result.userId
      }
    } else {
      return {
        success: false,
        error: result.error,
        data: result.data
      }
    }

  } catch (error) {
    console.error('Error in submitProvisionalApplication:', error)
    return { success: false, error: 'Internal server error' }
  }
}

export async function sendApplicationMagicLink(email: string, applicationId: string) {
  try {
    console.log('Attempting to send magic link to:', email)
    console.log('Application ID:', applicationId)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    console.log('Redirect URL:', `${siteUrl}/auth/callback?applicationId=${applicationId}`)
    
    if (!siteUrl) {
      console.error('Site URL environment variable is not set')
      return { success: false, error: 'Site URL not configured' }
    }

    // Send magic link email using signInWithOtp (this actually sends the email)
    const { data, error } = await supabaseServer.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?applicationId=${applicationId}`,
        // Increase OTP expiration time to 1 hour
        data: {
          applicationId: applicationId
        }
      }
    })

    if (error) {
      console.error('Error sending magic link:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return { success: false, error: `Failed to send magic link: ${error.message}` }
    }

    console.log('Magic link email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error in sendApplicationMagicLink:', error)
    return { success: false, error: 'Internal server error' }
  }
}