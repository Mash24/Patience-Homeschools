import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export const revalidate = 300

const TEACHER_SELECT =
  'id, full_name, name, subjects, curricula, location_area, city, years_experience, experience_years, is_featured, status'

async function fetchTeachers() {
  const supabase = supabaseServer

  const { data: featured, error: featuredError } = await supabase
    .from('teachers')
    .select(TEACHER_SELECT)
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (featuredError) {
    console.error('featured teachers:', featuredError)
    return []
  }

  let rows = featured || []

  if (rows.length < 8) {
    const excludeIds = rows.map((t) => t.id)
    let query = supabase
      .from('teachers')
      .select(TEACHER_SELECT)
      .eq('status', 'approved')
      .eq('is_featured', false)
      .order('created_at', { ascending: false })
      .limit(8 - rows.length)

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`)
    }

    const { data: rest } = await query
    rows = [...rows, ...(rest || [])]
  }

  return rows
}

function buildRatingsMap(
  teacherIds: string[],
  reviewRows: { teacher_id: string; rating: number }[] | null
) {
  const ratingsMap: Record<string, { avg: number; count: number }> = {}

  for (const row of reviewRows || []) {
    if (!ratingsMap[row.teacher_id]) {
      ratingsMap[row.teacher_id] = { avg: 0, count: 0 }
    }
    ratingsMap[row.teacher_id].avg += row.rating
    ratingsMap[row.teacher_id].count += 1
  }

  for (const id of Object.keys(ratingsMap)) {
    const { avg, count } = ratingsMap[id]
    ratingsMap[id].avg = Math.round((avg / count) * 10) / 10
  }

  return ratingsMap
}

export async function GET() {
  try {
    const data = await fetchTeachers()
    const teacherIds = data.map((t) => t.id)
    const ratingsMap: Record<string, { avg: number; count: number }> = {}

    if (teacherIds.length > 0) {
      const { data: reviewRows } = await supabaseServer
        .from('teacher_reviews')
        .select('teacher_id, rating')
        .in('teacher_id', teacherIds)

      Object.assign(ratingsMap, buildRatingsMap(teacherIds, reviewRows))
    }

    const teachers = data.map((t) => {
      const stats = ratingsMap[t.id]
      return {
        id: t.id,
        name: t.full_name || t.name || 'Educator',
        subjects: (t.subjects || []).slice(0, 3).join(', '),
        curriculum: (t.curricula || [])[0] || 'Multi-curriculum',
        location: t.location_area || t.city || 'Nairobi',
        experience: `${t.years_experience || t.experience_years || 0} years`,
        rating: stats?.avg ?? null,
        reviewCount: stats?.count ?? 0,
        isFeatured: t.is_featured,
      }
    })

    return NextResponse.json(
      { teachers },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch {
    return NextResponse.json({ teachers: [] })
  }
}
