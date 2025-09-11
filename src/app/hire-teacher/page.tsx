import HireTeacherHero from '@/components/hire-teacher/HireTeacherHero'
import TeacherMatchingForm from '@/components/hire-teacher/TeacherMatchingForm'
import HowMatchingWorks from '@/components/hire-teacher/HowMatchingWorks'
import FeaturedTeachers from '@/components/hire-teacher/FeaturedTeachers'

export default function HireTeacherPage() {
  return (
    <div className="min-h-screen">
      <HireTeacherHero />
      <TeacherMatchingForm />
      <HowMatchingWorks />
      <FeaturedTeachers />
    </div>
  )
}

