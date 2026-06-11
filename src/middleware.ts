import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

function dashboardPath(role?: string): string {
  switch (role) {
    case 'admin': return '/admin'
    case 'teacher': return '/teacher/dashboard'
    case 'parent': return '/parent/dashboard'
    default: return '/'
  }
}

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
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const p = req.nextUrl.pathname

  // Legacy redirects
  if (p === '/simple-login') {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // Consolidate magic-link login into unified sign-in
  if (p === '/login') {
    const url = new URL('/signin', req.url)
    url.searchParams.set('tab', 'magic')
    const redirectTo = req.nextUrl.searchParams.get('redirectTo')
    if (redirectTo) url.searchParams.set('redirectTo', redirectTo)
    const error = req.nextUrl.searchParams.get('error')
    if (error) url.searchParams.set('error', error)
    return NextResponse.redirect(url)
  }

  const role = (session?.user?.app_metadata?.role ?? session?.user?.user_metadata?.role) as string | undefined
  const isAdmin = role === 'admin'

  // Logged-in users on auth pages → role dashboard
  if ((p === '/signin' || p === '/admin-login') && session) {
    if (p === '/admin-login' && !isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    return NextResponse.redirect(new URL(dashboardPath(role), req.url))
  }

  // Unify parent registration into hire-teacher funnel
  if (p === '/parent-register') {
    return NextResponse.redirect(new URL('/hire-teacher', req.url))
  }

  // Protect admin routes
  if (p.startsWith('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/admin-login', req.url))
    if (!isAdmin) return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Protect teacher routes (except public application pages)
  if (p.startsWith('/teacher') && p !== '/teacher-apply' && !p.startsWith('/teacher-apply/')) {
    if (!session) return NextResponse.redirect(new URL('/signin', req.url))
    if (role !== 'teacher') return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Protect parent routes
  if (p.startsWith('/parent')) {
    if (!session) {
      const url = new URL('/signin', req.url)
      url.searchParams.set('redirectTo', p)
      return NextResponse.redirect(url)
    }
    if (role !== 'parent') return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
