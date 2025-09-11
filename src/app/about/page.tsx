import AboutHero from '@/components/about/AboutHero'
import PatienceStory from '@/components/about/PatienceStory'
import OurMission from '@/components/about/OurMission'
import OurTeam from '@/components/about/OurTeam'
import OurValues from '@/components/about/OurValues'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <PatienceStory />
      <OurMission />
      <OurValues />
      <OurTeam />
    </div>
  )
}

