'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, BookOpen, Video, Loader2, ExternalLink } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

interface ResourceItem {
  id: string
  title: string
  description?: string
  category: string
  file_url?: string
  is_premium: boolean
}

const categoryIcons: Record<string, typeof FileText> = {
  guide: FileText,
  video: Video,
  default: BookOpen,
}

export default function FeaturedResources({
  searchTerm = '',
  category = '',
}: {
  searchTerm?: string
  category?: string
}) {
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/resources')
      .then((r) => r.json())
      .then((d) => setResources(d.resources || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = resources.filter((r) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description?.toLowerCase().includes(q) ?? false) ||
      r.category.toLowerCase().includes(q)
    const matchesCategory =
      !category || category === 'All Categories' || r.category.toLowerCase() === category.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Featured"
          title="Learning resources"
          description="Guides and materials curated by our education team."
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-ink-muted text-sm py-12">
            {resources.length === 0
              ? 'Resources will appear here as they are published.'
              : 'No resources match your search.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource, index) => {
              const Icon = categoryIcons[resource.category] || categoryIcons.default
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="card-elevated p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gold-600" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-1 rounded-full capitalize">
                      {resource.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-ink text-sm mb-2 leading-snug">{resource.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed flex-1">
                    {resource.description || 'Download this resource for your learning journey.'}
                  </p>
                  {resource.file_url ? (
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2.5 border border-ink/10 text-ink text-sm font-semibold rounded-full hover:border-gold-500 hover:text-gold-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {resource.is_premium ? 'Access resource' : 'Download free'}
                    </a>
                  ) : (
                    <span className="mt-4 text-xs text-ink-muted text-center">Coming soon</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
