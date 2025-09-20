import { NextResponse } from 'next/server'
import { checkSupabaseConnection } from '@/lib/supabase'

export async function GET() {
  try {
    const supabaseCheck = await checkSupabaseConnection()
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: supabaseCheck.success ? 'connected' : 'disconnected',
        email: process.env.RESEND_API_KEY ? 'configured' : 'not configured',
      },
      version: '1.0.0',
    }

    if (!supabaseCheck.success) {
      return NextResponse.json(health, { status: 503 })
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    )
  }
}
