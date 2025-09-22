import TeacherApplyHero from '@/components/teacher-apply/TeacherApplyHero'
import TeacherApplicationWizard from '@/components/teacher-apply/TeacherApplicationWizard'
import WhyJoinUs from '@/components/teacher-apply/WhyJoinUs'
import ApplicationProcess from '@/components/teacher-apply/ApplicationProcess'

export default function TeacherApplyPage() {
  return (
    <div className="min-h-screen">
      <TeacherApplyHero />
      <TeacherApplicationWizard />
      <WhyJoinUs />
      <ApplicationProcess />
    </div>
  )
}

