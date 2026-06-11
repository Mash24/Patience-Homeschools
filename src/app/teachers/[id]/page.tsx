import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabaseServer } from '@/lib/supabaseServer'
import TeacherPublicProfile from '@/components/teachers/TeacherPublicProfile'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const { data: teacher } = await supabaseServer
    .from('teachers')
    .select('full_name, name, bio, subjects, location_area')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (!teacher) return { title: 'Educator | Nelimac Learning' }

  const name = teacher.full_name || teacher.name || 'Educator'
  const subjects = (teacher.subjects || []).slice(0, 3).join(', ')
  const description =
    teacher.bio?.slice(0, 155) ||
    `TSC-certified ${name} — ${subjects || 'multi-subject'} tutor in ${teacher.location_area || 'Nairobi'}. Book via Nelimac Learning.`

  return {
    title: `${name} | Nelimac Learning`,
    description,
    openGraph: {
      title: `${name} — Nelimac educator`,
      description,
    },
  }
}

export const revalidate = 600

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = supabaseServer

  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (!teacher) notFound()

  const [{ data: reviews }, { count: verifiedDocCount }] = await Promise.all([
    supabase
      .from('teacher_reviews')
      .select('rating, comment, created_at')
      .eq('teacher_id', id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('teacher_documents')
      .select('id', { count: 'exact', head: true })
      .eq('teacher_id', id)
      .not('verified_at', 'is', null),
  ])

  return (
    <TeacherPublicProfile
      teacher={teacher}
      reviews={reviews || []}
      verifiedDocCount={verifiedDocCount || 0}
    />
  )
}
