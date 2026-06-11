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

function emailShell(title: string, body: string, cta?: { label: string; href: string }) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0A0F1C;">
      <div style="background: #0A0F1C; padding: 24px; text-align: center;">
        <span style="color: #C9A227; font-size: 20px; font-weight: 600;">Nelimac Learning</span>
      </div>
      <div style="padding: 32px 24px; background: #FAF8F5;">
        <h1 style="font-size: 22px; margin: 0 0 16px;">${title}</h1>
        ${body}
        ${cta ? `
          <div style="margin: 28px 0;">
            <a href="${cta.href}" style="background: #C9A227; color: #0A0F1C; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: 600; display: inline-block;">
              ${cta.label}
            </a>
          </div>
        ` : ''}
        <p style="color: #64748b; font-size: 13px; margin-top: 32px;">
          Nelimac Learning · Premium home tutoring in Kenya
        </p>
      </div>
    </div>
  `
}

export async function sendLeadStatusEmail(data: {
  parentName: string
  email: string
  status: 'shortlisted' | 'matched' | 'closed'
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const messages = {
    shortlisted: {
      title: 'You\'re on our shortlist!',
      body: `<p>Dear ${data.parentName},</p>
        <p>Great news — we've reviewed your tutor request and added you to our shortlist. Our concierge team is now matching you with the best qualified teacher for your child.</p>
        <p>We'll be in touch soon with next steps.</p>`,
    },
    matched: {
      title: 'Your tutor has been matched!',
      body: `<p>Dear ${data.parentName},</p>
        <p>Wonderful news — we've matched you with a qualified Nelimac tutor. Sign in to your parent portal to view teacher details and coordinate your first session.</p>`,
      cta: { label: 'Open Parent Portal', href: `${appUrl}/parent/dashboard` },
    },
    closed: {
      title: 'Update on your tutor request',
      body: `<p>Dear ${data.parentName},</p>
        <p>Your tutor request has been closed. If you'd like to reopen it or submit a new request, please contact us or visit our website.</p>`,
    },
  }

  const msg = messages[data.status]
  const html = emailShell(msg.title, msg.body, 'cta' in msg ? msg.cta : undefined)

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.email],
      subject: msg.title,
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendParentAccountInviteEmail(data: {
  parentName: string
  email: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const html = emailShell(
    'Welcome to Nelimac Learning',
    `<p>Dear ${data.parentName},</p>
      <p>Your parent account has been created. Click the button below to sign in and set up your password. From your portal you can track tutor matching, view assigned teachers, and manage your children's profiles.</p>`,
    { label: 'Activate your account', href: `${appUrl}/signin?email=${encodeURIComponent(data.email)}` }
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.email],
      subject: 'Your Nelimac parent account is ready',
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendSessionReminderEmail(data: {
  to: string
  recipientName: string
  subject: string
  dateLabel: string
  timeLabel: string
  location: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const html = emailShell(
    'Session reminder',
    `<p>Hi ${data.recipientName},</p>
      <p>This is a reminder that you have a tutoring session tomorrow:</p>
      <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0;">
        <p style="margin:0 0 8px;"><strong>${data.subject}</strong></p>
        <p style="margin:0 0 4px;color:#64748b;">${data.dateLabel}</p>
        <p style="margin:0 0 4px;color:#64748b;">${data.timeLabel}</p>
        <p style="margin:0;color:#64748b;">${data.location}</p>
      </div>`,
    { label: 'Open dashboard', href: `${appUrl}/signin` }
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.to],
      subject: `Reminder: ${data.subject} tomorrow`,
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendMessageDigestEmail(data: {
  to: string
  recipientName: string
  messages: { subject: string; preview: string; at: string }[]
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const items = data.messages
    .slice(0, 20)
    .map(
      (m) =>
        `<li style="margin-bottom:12px;"><strong>${m.subject}</strong><br/><span style="color:#64748b;font-size:14px;">${m.preview}</span></li>`
    )
    .join('')

  const html = emailShell(
    'Your daily message summary',
    `<p>Hi ${data.recipientName},</p>
      <p>You have ${data.messages.length} new message${data.messages.length === 1 ? '' : 's'} on Nelimac:</p>
      <ul style="padding-left:20px;">${items}</ul>`,
    { label: 'View messages', href: `${appUrl}/signin` }
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.to],
      subject: `Daily digest: ${data.messages.length} new message${data.messages.length === 1 ? '' : 's'}`,
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendNewMessageEmail(data: {
  to: string
  recipientName: string
  subject: string
  preview: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const html = emailShell(
    'New message on Nelimac',
    `<p>Hi ${data.recipientName},</p>
      <p>You have a new message regarding <strong>${data.subject}</strong>:</p>
      <p style="background:#f1f5f9;padding:16px;border-radius:8px;font-style:italic;">"${data.preview}"</p>`,
    { label: 'View messages', href: `${appUrl}/signin` }
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.to],
      subject: `New message: ${data.subject}`,
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendEventRegistrationEmail(data: {
  fullName: string
  email: string
  eventTitle: string
  eventDate: string
}) {
  const html = emailShell(
    'Event registration received',
    `<p>Dear ${data.fullName},</p>
      <p>Thank you for registering your interest in <strong>${data.eventTitle}</strong> on ${new Date(data.eventDate).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.</p>
      <p>Our team will review your registration and confirm your spot shortly.</p>`
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.email],
      subject: `Registration received: ${data.eventTitle}`,
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendEventConfirmedEmail(data: {
  fullName: string
  email: string
  eventTitle: string
  eventDate: string
  location?: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const html = emailShell(
    'Your event spot is confirmed!',
    `<p>Dear ${data.fullName},</p>
      <p>Great news — your registration for <strong>${data.eventTitle}</strong> is confirmed.</p>
      <p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleString('en-KE')}</p>
      ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
      <p>We look forward to seeing you there.</p>`,
    { label: 'View all events', href: `${appUrl}/events` }
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.email],
      subject: `Confirmed: ${data.eventTitle}`,
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendEventRegistrationAdminNotification(data: {
  fullName: string
  email: string
  eventTitle: string
}) {
  return sendAdminEmail({
    subject: `Event registration: ${data.eventTitle} — ${data.fullName}`,
    html: emailShell(
      'New event registration',
      `<p><strong>${data.fullName}</strong> (${data.email}) registered for <strong>${data.eventTitle}</strong>.</p>
        <p>Review registrations in the admin content panel.</p>`,
      { label: 'View registrations', href: `${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/content` }
    ),
  })
}

export async function sendTeacherApprovalEmail(data: {
  name: string
  email: string
  customMessage?: string
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const body = data.customMessage || 'Congratulations! Your teacher application has been approved. You can now access your full teacher dashboard and start receiving student assignments.'
  const html = emailShell(
    'Application approved',
    `<p>Dear ${data.name},</p><p>${body}</p>`,
    { label: 'Open teacher dashboard', href: `${appUrl}/teacher/dashboard` }
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.email],
      subject: 'Your Nelimac teacher application is approved',
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendTeacherRejectionEmail(data: {
  name: string
  email: string
  reason: string
  customMessage?: string
}) {
  const html = emailShell(
    'Application update',
    `<p>Dear ${data.name},</p>
      <p>${data.customMessage || 'Thank you for your interest in teaching with Nelimac Learning. After careful review, we are unable to approve your application at this time.'}</p>
      <p><strong>Reason:</strong> ${data.reason}</p>
      <p>You may reapply in the future if your circumstances change.</p>`
  )

  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { error } = await resend.emails.send({
      from: 'Nelimac Learning <noreply@nelimaclearning.co.ke>',
      to: [data.email],
      subject: 'Update on your Nelimac teacher application',
      html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendContactFormEmail(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  inquiryType: string
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0f172a;">New Contact Form Submission</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Type:</strong> ${data.inquiryType}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
      </div>
    </div>
  `

  return sendAdminEmail({
    subject: `Contact: ${data.subject} — ${data.name}`,
    html,
  })
}
