import { NextResponse } from 'next/server'
import { getPublishedResources } from '@/lib/content/actions'

export async function GET() {
  const resources = await getPublishedResources()
  return NextResponse.json({ resources })
}
