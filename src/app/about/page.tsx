import AboutHero from '@/components/about/AboutHero'
import NelimacStory from '@/components/about/PatienceStory'
import OurMission from '@/components/about/OurMission'
import OurTeam from '@/components/about/OurTeam'
import OurValues from '@/components/about/OurValues'
import CTA from '@/components/CTA'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <AboutHero />
      <NelimacStory />
      <OurMission />
      <OurValues />
      <OurTeam />
      <CTA />
    </div>
  )
}

