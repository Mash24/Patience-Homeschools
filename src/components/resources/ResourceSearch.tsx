'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export default function ResourceSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCurriculum, setSelectedCurriculum] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  const curricula = ['All Curricula', 'CBC', 'IGCSE', 'British']
  const levels = ['All Levels', 'Grade 1-3', 'Grade 4-6', 'Grade 7-8', 'Grade 9-10', 'Grade 11-12', 'A-Level']

  const selectClass = 'w-full px-4 py-3 bg-white border border-ink/10 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/50 transition-all'

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-32 py-4 bg-ivory border border-ink/10 rounded-2xl text-ink focus:outline-none focus:ring-2 focus:ring-gold-500/30 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gold-500 text-ink font-semibold rounded-full text-sm hover:bg-gold-400 transition-colors">
              Search
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">Curriculum</label>
              <select value={selectedCurriculum} onChange={(e) => setSelectedCurriculum(e.target.value)} className={selectClass}>
                {curricula.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">Level</label>
              <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className={selectClass}>
                {levels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
