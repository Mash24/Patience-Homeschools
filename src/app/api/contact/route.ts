import { NextResponse } from 'next/server'
import { ContactFormSchema } from '@/lib/schemas'
import { sendContactFormEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = ContactFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const result = await sendContactFormEmail(parsed.data)

    if (!result.success) {
      console.error('Contact email failed:', result.error)
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or email us directly.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
