// Security utilities for file uploads and data validation

export interface FileValidationResult {
  isValid: boolean
  error?: string
  sanitizedName?: string
}

export interface SecurityConfig {
  maxFileSize: number
  allowedTypes: string[]
  allowedExtensions: string[]
  scanForMalware?: boolean
}

// File validation configuration
export const FILE_CONFIGS = {
  image: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
  },
  document: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['.pdf', '.doc', '.docx']
  },
  certificate: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png']
  }
}

// Validate file upload
export function validateFile(file: File, config: SecurityConfig): FileValidationResult {
  // Check file size
  if (file.size > config.maxFileSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(config.maxFileSize)}`
    }
  }

  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
    }
  }

  // Check file extension
  const fileExtension = getFileExtension(file.name)
  if (!config.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`
    }
  }

  // Sanitize filename
  const sanitizedName = sanitizeFileName(file.name)

  return {
    isValid: true,
    sanitizedName
  }
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'))
}

// Sanitize filename
export function sanitizeFileName(filename: string): string {
  // Remove any path components
  const name = filename.split('/').pop() || filename.split('\\').pop() || filename
  
  // Replace special characters with underscores
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Generate secure file hash
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Check for malicious file patterns
export function scanFileForThreats(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    // Basic file header validation
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer.slice(0, 1024)) // First 1KB
      
      // Check for common malicious file signatures
      const maliciousSignatures = [
        [0x4D, 0x5A], // PE executable
        [0x7F, 0x45, 0x4C, 0x46], // ELF executable
        [0xCA, 0xFE, 0xBA, 0xBE], // Mach-O executable
      ]
      
      let isMalicious = false
      for (const signature of maliciousSignatures) {
        if (uint8Array.length >= signature.length) {
          let matches = true
          for (let i = 0; i < signature.length; i++) {
            if (uint8Array[i] !== signature[i]) {
              matches = false
              break
            }
          }
          if (matches) {
            isMalicious = true
            break
          }
        }
      }
      
      resolve(!isMalicious)
    }
    reader.readAsArrayBuffer(file.slice(0, 1024))
  })
}

// Rate limiting for form submissions
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  private readonly maxAttempts: number
  private readonly windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs)
    
    if (validAttempts.length >= this.maxAttempts) {
      return false
    }
    
    // Add current attempt
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    
    return true
  }

  getRemainingAttempts(identifier: string): number {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    const validAttempts = attempts.filter(time => now - time < this.windowMs)
    return Math.max(0, this.maxAttempts - validAttempts.length)
  }

  getResetTime(identifier: string): number | null {
    const attempts = this.attempts.get(identifier) || []
    if (attempts.length === 0) return null
    
    const oldestAttempt = Math.min(...attempts)
    return oldestAttempt + this.windowMs
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

// Email validation with additional security checks
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const sanitizedEmail = sanitizeInput(email)
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  // Check for common disposable email domains
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org'
  ]
  
  const domain = sanitizedEmail.split('@')[1]?.toLowerCase()
  if (disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Disposable email addresses are not allowed' }
  }
  
  return { isValid: true }
}

// Phone number validation for Kenya
export function validateKenyanPhone(phone: string): { isValid: boolean; error?: string; formatted?: string } {
  const sanitizedPhone = sanitizeInput(phone).replace(/\D/g, '') // Remove non-digits
  
  // Kenyan phone number patterns
  const patterns = [
    /^254[0-9]{9}$/, // 254XXXXXXXXX
    /^0[0-9]{9}$/,   // 0XXXXXXXXX
    /^\+254[0-9]{9}$/ // +254XXXXXXXXX
  ]
  
  let isValid = false
  let formatted = sanitizedPhone
  
  for (const pattern of patterns) {
    if (pattern.test(sanitizedPhone)) {
      isValid = true
      // Normalize to 254XXXXXXXXX format
      if (sanitizedPhone.startsWith('0')) {
        formatted = '254' + sanitizedPhone.substring(1)
      } else if (sanitizedPhone.startsWith('+254')) {
        formatted = sanitizedPhone.substring(1)
      }
      break
    }
  }
  
  if (!isValid) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)' 
    }
  }
  
  return { isValid: true, formatted }
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length]
  }
  
  return result
}

// CSRF token generation and validation
export class CSRFProtection {
  private static tokens: Map<string, { token: string; expires: number }> = new Map()
  private static readonly TOKEN_LENGTH = 32
  private static readonly TOKEN_EXPIRY = 30 * 60 * 1000 // 30 minutes

  static generateToken(sessionId: string): string {
    const token = generateSecureToken(this.TOKEN_LENGTH)
    const expires = Date.now() + this.TOKEN_EXPIRY
    
    this.tokens.set(sessionId, { token, expires })
    
    // Clean up expired tokens
    this.cleanupExpiredTokens()
    
    return token
  }

  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId)
    
    if (!stored || stored.expires < Date.now()) {
      return false
    }
    
    return stored.token === token
  }

  private static cleanupExpiredTokens(): void {
    const now = Date.now()
    for (const [sessionId, data] of this.tokens.entries()) {
      if (data.expires < now) {
        this.tokens.delete(sessionId)
      }
    }
  }
}
