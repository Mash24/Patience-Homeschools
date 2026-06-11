import { NextResponse } from 'next/server'
import { getPublishedEvents } from '@/lib/content/actions'

export async function GET() {
  const events = await getPublishedEvents()
  return NextResponse.json({ events })
}
