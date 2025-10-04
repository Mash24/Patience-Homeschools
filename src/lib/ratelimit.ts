// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function ratelimit(
  key: string, 
  options: { limit: number; windowSec: number }
): Promise<void> {
  const now = Date.now()
  const windowMs = options.windowSec * 1000
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return
  }

  if (record.count >= options.limit) {
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`)
  }

  record.count++
}
