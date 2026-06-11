import { NextResponse } from 'next/server'
import { lookupLeadByEmail } from '@/lib/parent/leads'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const lead = await lookupLeadByEmail(email)
    if (!lead) {
      return NextResponse.json({ found: false })
    }

    return NextResponse.json({ found: true, lead })
  } catch {
    return NextResponse.json({ error: 'Failed to look up request' }, { status: 500 })
  }
}
