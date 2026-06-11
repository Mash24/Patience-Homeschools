'use server'

import { createClient } from '@/lib/supabase-server'

export interface TeacherSuggestion {
  id: string
  full_name: string
  subjects: string[]
  curricula: string[]
  location_area?: string
  experience_years?: number
  is_featured?: boolean
  is_verified?: boolean
  score: number
  reasons: string[]
}

function normalize(s: string) {
  return s.toLowerCase().trim()
}

function overlapScore(leadItems: string[], teacherItems: string[], weight: number, label: string): { points: number; reason?: string } {
  const leadSet = new Set(leadItems.map(normalize))
  const matches = teacherItems.filter((t) => leadSet.has(normalize(t)))
  if (!matches.length) return { points: 0 }
  const points = Math.min(matches.length * weight, weight * 3)
  return { points, reason: `${label}: ${matches.join(', ')}` }
}

function locationScore(leadCity?: string, leadArea?: string, teacherArea?: string): { points: number; reason?: string } {
  if (!teacherArea) return { points: 0 }
  const area = normalize(teacherArea)
  const city = leadCity ? normalize(leadCity) : ''
  const loc = leadArea ? normalize(leadArea) : ''
  if (city && area.includes(city)) return { points: 20, reason: `Location: ${teacherArea}` }
  if (loc && (area.includes(loc) || loc.includes(area))) return { points: 15, reason: `Area: ${teacherArea}` }
  if (city || loc) return { points: 0 }
  return { points: 5, reason: `Based in ${teacherArea}` }
}

function scoreTeacher(
  lead: {
    subjects: string[]
    curricula: string[]
    city?: string
    location_area?: string
  },
  teacher: {
    id: string
    full_name: string
    subjects: string[]
    curricula: string[]
    location_area?: string
    experience_years?: number
    is_featured?: boolean
    is_verified?: boolean
  }
): TeacherSuggestion {
  const reasons: string[] = []
  let score = 0

  const sub = overlapScore(lead.subjects || [], teacher.subjects || [], 25, 'Subjects')
  score += sub.points
  if (sub.reason) reasons.push(sub.reason)

  const cur = overlapScore(lead.curricula || [], teacher.curricula || [], 20, 'Curricula')
  score += cur.points
  if (cur.reason) reasons.push(cur.reason)

  const loc = locationScore(lead.city, lead.location_area, teacher.location_area)
  score += loc.points
  if (loc.reason) reasons.push(loc.reason)

  if (teacher.is_featured) {
    score += 10
    reasons.push('Featured educator')
  }
  if (teacher.is_verified) {
    score += 8
    reasons.push('Verified by Nelimac')
  }
  if ((teacher.experience_years || 0) >= 3) {
    score += 5
    reasons.push(`${teacher.experience_years}+ years experience`)
  }

  return {
    id: teacher.id,
    full_name: teacher.full_name,
    subjects: teacher.subjects || [],
    curricula: teacher.curricula || [],
    location_area: teacher.location_area,
    experience_years: teacher.experience_years,
    is_featured: teacher.is_featured,
    is_verified: teacher.is_verified,
    score,
    reasons,
  }
}

export async function getTeacherSuggestionsForLead(leadId: string, limit = 5): Promise<TeacherSuggestion[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string
  if (role !== 'admin') throw new Error('Unauthorized')

  const { data: lead, error: leadError } = await supabase
    .from('parent_leads')
    .select('subjects, curricula, city, location_area')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) throw new Error('Lead not found')

  const { data: teachers, error: teachersError } = await supabase
    .from('teachers')
    .select('id, full_name, subjects, curricula, location_area, experience_years, is_featured, is_verified')
    .eq('status', 'approved')

  if (teachersError) throw new Error(teachersError.message)

  return (teachers || [])
    .map((t) => scoreTeacher(lead, t))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
