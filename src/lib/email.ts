import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendAdminEmail({
  subject,
  html,
  to = 'admin@nelimaclearning.co.ke'
}: {
  subject: string
  html: string
  to?: string
}) {
  if (!resend) {
    console.log('Email service not configured - RESEND_API_KEY missing')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Email sending error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendParentLeadNotification(leadData: {
  id: string
  parentName: string
  email: string
  phone?: string
  city?: string
  childFirstName?: string
  gradeLevel: string
  curricula: string[]
  subjects: string[]
  mode: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">New Parent Lead Received</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #334155; margin-top: 0;">Lead Details</h3>
        <p><strong>Lead ID:</strong> ${leadData.id}</p>
        <p><strong>Parent Name:</strong> ${leadData.parentName}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone || 'Not provided'}</p>
        <p><strong>City:</strong> ${leadData.city || 'Not provided'}</p>
        <p><strong>Child Name:</strong> ${leadData.childFirstName || 'Not provided'}</p>
        <p><strong>Grade Level:</strong> ${leadData.gradeLevel}</p>
        <p><strong>Curricula:</strong> ${leadData.curricula.join(', ')}</p>
        <p><strong>Subjects:</strong> ${leadData.subjects.join(', ')}</p>
        <p><strong>Mode:</strong> ${leadData.mode}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
           style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View in Admin Dashboard
        </a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">
        This lead was automatically generated from the website contact form.
      </p>
    </div>
  `

  return sendAdminEmail({
    subject: `New Parent Lead: ${leadData.parentName} - ${leadData.gradeLevel}`,
    html,
  })
}

export async function sendTeacherApplicationNotification(teacherData: {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  curricula: string[]
  subjects: string[]
  yearsExperience: number
  tscNumber?: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">New Teacher Application Received</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #334155; margin-top: 0;">Application Details</h3>
        <p><strong>Application ID:</strong> ${teacherData.id}</p>
        <p><strong>Name:</strong> ${teacherData.name}</p>
        <p><strong>Email:</strong> ${teacherData.email}</p>
        <p><strong>Phone:</strong> ${teacherData.phone || 'Not provided'}</p>
        <p><strong>City:</strong> ${teacherData.city || 'Not provided'}</p>
        <p><strong>Years Experience:</strong> ${teacherData.yearsExperience}</p>
        <p><strong>TSC Number:</strong> ${teacherData.tscNumber || 'Not provided'}</p>
        <p><strong>Curricula:</strong> ${teacherData.curricula.join(', ')}</p>
        <p><strong>Subjects:</strong> ${teacherData.subjects.join(', ')}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
           style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Review Application
        </a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">
        This application was automatically submitted from the teacher application form.
      </p>
    </div>
  `

  return sendAdminEmail({
    subject: `New Teacher Application: ${teacherData.name} - ${teacherData.curricula.join(', ')}`,
    html,
  })
}

export async function sendParentRegistrationNotification(data: {
  parentName: string
  email: string
  phone?: string
  city?: string
  childrenCount: number
  userId: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">New Parent Registration</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #334155; margin-top: 0;">Parent Details</h3>
        <p><strong>Name:</strong> ${data.parentName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>City:</strong> ${data.city || 'Not provided'}</p>
        <p><strong>Children:</strong> ${data.childrenCount}</p>
        <p><strong>User ID:</strong> ${data.userId}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
           style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View in Admin Dashboard
        </a>
      </div>
      
      <p style="color: #64748b; font-size: 14px;">
        This parent has successfully registered and their account is now active. 
        You can view their full profile in the admin dashboard.
      </p>
    </div>
  `

  return sendAdminEmail({
    subject: `New Parent Registration: ${data.parentName}`,
    html,
  })
}
