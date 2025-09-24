import ParentRegistrationHero from '@/components/parent-register/ParentRegistrationHero'
import ParentRegistrationForm from '@/components/parent-register/ParentRegistrationForm'
import ParentRegistrationBenefits from '@/components/parent-register/ParentRegistrationBenefits'
import ParentRegistrationTestimonials from '@/components/parent-register/ParentRegistrationTestimonials'
import ParentRegistrationFAQ from '@/components/parent-register/ParentRegistrationFAQ'

export default function ParentRegisterPage() {
  return (
    <div className="min-h-screen">
      <ParentRegistrationHero />
      <ParentRegistrationForm />
      <ParentRegistrationBenefits />
      <ParentRegistrationTestimonials />
      <ParentRegistrationFAQ />
    </div>
  )
}
