import HireTeacherHeroEnhanced from '@/components/hire-teacher/HireTeacherHeroEnhanced'
import TeacherMatchingFormEnhanced from '@/components/hire-teacher/TeacherMatchingFormEnhanced'
import HowMatchingWorksEnhanced from '@/components/hire-teacher/HowMatchingWorksEnhanced'
import FeaturedTeachersEnhanced from '@/components/hire-teacher/FeaturedTeachersEnhanced'
import TestimonialsSection from '@/components/hire-teacher/TestimonialsSection'
import FAQSection from '@/components/hire-teacher/FAQSection'

export default function HireTeacherPage() {
  return (
    <div className="min-h-screen">
      <HireTeacherHeroEnhanced />
      <TeacherMatchingFormEnhanced />
      <HowMatchingWorksEnhanced />
      <FeaturedTeachersEnhanced />
      <TestimonialsSection />
      <FAQSection />
    </div>
  )
}

