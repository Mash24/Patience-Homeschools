import CurriculaHero from '@/components/curricula/CurriculaHero'
import CurriculumDetails from '@/components/curricula/CurriculumDetails'
import CurriculumComparison from '@/components/curricula/CurriculumComparison'
import CurriculumFAQ from '@/components/curricula/CurriculumFAQ'

export default function CurriculaPage() {
  return (
    <div className="min-h-screen">
      <CurriculaHero />
      <CurriculumDetails />
      <CurriculumComparison />
      <CurriculumFAQ />
    </div>
  )
}

