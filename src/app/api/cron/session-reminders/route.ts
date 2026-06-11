import { NextRequest, NextResponse } from 'next/server'
import { processSessionReminders } from '@/lib/scheduling/reminders'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await processSessionReminders()
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error('session-reminders cron:', e)
    return NextResponse.json({ error: 'Reminder processing failed' }, { status: 500 })
  }
}
