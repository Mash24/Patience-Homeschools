'use client'

import { Search } from 'lucide-react'

export default function ResourceSearch({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}: {
  searchTerm: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  categories: string[]
}) {
  const selectClass =
    'w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all'

  return (
    <section className="py-10 bg-white border-b border-ink/5">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted" />
            <input
              type="text"
              placeholder="Search resources, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-ivory border border-ink/10 rounded-2xl text-ink focus:outline-none focus:ring-2 focus:ring-gold-500/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                Category
              </label>
              <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
