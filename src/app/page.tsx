import HeroLuxury from '@/components/home/HeroLuxury'
import PartnerRow from '@/components/shared/PartnerRow'
import CurriculaOverview from '@/components/CurriculaOverview'
import HowItWorks from '@/components/HowItWorks'
import FeaturedResources from '@/components/FeaturedResources'
import UpcomingEvents from '@/components/UpcomingEvents'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroLuxury />
      <PartnerRow />
      <CurriculaOverview />
      <HowItWorks />
      <FeaturedResources />
      <UpcomingEvents />
      <Testimonials />
      <CTA />
    </div>
  )
}