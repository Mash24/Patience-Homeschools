import ResourcesHero from '@/components/resources/ResourcesHero'
import ResourceCategories from '@/components/resources/ResourceCategories'
import FeaturedResources from '@/components/resources/FeaturedResources'
import ResourceSearch from '@/components/resources/ResourceSearch'

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <ResourcesHero />
      <ResourceSearch />
      <ResourceCategories />
      <FeaturedResources />
    </div>
  )
}

