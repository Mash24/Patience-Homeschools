import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const p = req.nextUrl.pathname
  
  const role = (session?.user?.app_metadata?.role ?? session?.user?.user_metadata?.role) as string | undefined
  const isAdmin = role === 'admin'

  // 1) If logged in and hitting login pages, redirect to proper home
  if ((p === '/login' || p === '/admin-login') && session) {
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/', req.url))
  }

  // 2) Protect admin routes
  if (p.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/admin-login', req.url))
    if (!isAdmin) return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // 3) Protect teacher routes
  if (p.startsWith('/teacher')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url))
    if (role !== 'teacher') return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // 4) Protect parent routes
  if (p.startsWith('/parent')) {
    if (!session) return NextResponse.redirect(new URL('/login', req.url))
    if (role !== 'parent') return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
