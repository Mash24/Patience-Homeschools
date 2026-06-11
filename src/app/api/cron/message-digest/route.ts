import { NextRequest, NextResponse } from 'next/server'
import { processMessageDigestQueue } from '@/lib/messaging/digest'

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await processMessageDigestQueue()
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error('message-digest cron:', e)
    return NextResponse.json({ error: 'Digest processing failed' }, { status: 500 })
  }
}
