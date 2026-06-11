'use client'

import { useState } from 'react'
import ResourcesHero from '@/components/resources/ResourcesHero'
import ResourceCategories from '@/components/resources/ResourceCategories'
import FeaturedResources from '@/components/resources/FeaturedResources'
import ResourceSearch from '@/components/resources/ResourceSearch'

const CATEGORIES = ['All Categories', 'guide', 'video', 'worksheet', 'parent']

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('All Categories')

  return (
    <div className="min-h-screen bg-ivory">
      <ResourcesHero />
      <ResourceSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        categories={CATEGORIES}
      />
      <ResourceCategories />
      <FeaturedResources searchTerm={searchTerm} category={category} />
    </div>
  )
}
