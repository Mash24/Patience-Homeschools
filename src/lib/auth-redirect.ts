export type UserRole = 'admin' | 'teacher' | 'parent'

export function getRoleFromUser(user: {
  app_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
}): UserRole | undefined {
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role === 'admin' || role === 'teacher' || role === 'parent') return role
  return undefined
}

export function getDashboardPath(role?: string): string {
  switch (role) {
    case 'admin': return '/admin'
    case 'teacher': return '/teacher/dashboard'
    case 'parent': return '/parent/dashboard'
    default: return '/'
  }
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL
    || process.env.NEXT_PUBLIC_SITE_URL
    || 'http://localhost:3000'
}
