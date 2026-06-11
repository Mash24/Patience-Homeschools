import CurriculaHero from '@/components/curricula/CurriculaHero'
import CurriculumDetails from '@/components/curricula/CurriculumDetails'
import CurriculumComparison from '@/components/curricula/CurriculumComparison'
import CurriculumFAQ from '@/components/curricula/CurriculumFAQ'
import CTA from '@/components/CTA'

export default function CurriculaPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <CurriculaHero />
      <CurriculumDetails />
      <CurriculumComparison />
      <CurriculumFAQ />
      <CTA />
    </div>
  )
}

