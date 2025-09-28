import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile/role
  let userRole = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    userRole = profile?.role
  }

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/teacher-apply',
    '/hire-teacher',
    '/parent-register',
    '/login',
    '/auth/callback',
    '/unauthorized'
  ]

  // Admin-only routes
  const adminRoutes = ['/admin']
  
  // Teacher-only routes
  const teacherRoutes = ['/teacher']

  // Parent-only routes
  const parentRoutes = ['/parent']

  // Check if route is public (must be checked first)
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return supabaseResponse
  }
  
  // Check if route requires admin access
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // Check if route requires teacher access
  const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route))
  
  // Check if route requires parent access
  const isParentRoute = parentRoutes.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users from login page
  if (user && pathname === '/login') {
    // Redirect based on role
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else if (userRole === 'teacher') {
      return NextResponse.redirect(new URL('/teacher/dashboard', request.url))
    } else if (userRole === 'parent') {
      return NextResponse.redirect(new URL('/parent/dashboard', request.url))
    }
  }

  // Check admin access
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Check teacher access
  if (isTeacherRoute && userRole !== 'teacher') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
  
  // Check parent access
  if (isParentRoute && userRole !== 'parent') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Don't interfere with auth callback - let it handle its own redirects
  // The auth callback route will handle the proper redirects based on applicationId and user state

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
