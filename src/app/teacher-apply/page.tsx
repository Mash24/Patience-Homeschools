import TeacherApplyHero from '@/components/teacher-apply/TeacherApplyHero'
import TeacherApplicationForm from '@/components/teacher-apply/TeacherApplicationForm'
import WhyJoinUs from '@/components/teacher-apply/WhyJoinUs'
import ApplicationProcess from '@/components/teacher-apply/ApplicationProcess'

export default function TeacherApplyPage() {
  return (
    <div className="min-h-screen">
      <TeacherApplyHero />
      <TeacherApplicationForm />
      <WhyJoinUs />
      <ApplicationProcess />
    </div>
  )
}

