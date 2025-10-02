import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: error ? 'disconnected' : 'connected',
        email: process.env.RESEND_API_KEY ? 'configured' : 'not configured',
      },
      version: '1.0.0',
    }

    if (error) {
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
