'use client'

import { useState } from 'react'
import { Search, Filter, SortAsc, Grid, List } from 'lucide-react'

export default function ResourceSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCurriculum, setSelectedCurriculum] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const curricula = ['All Curricula', 'CBC', 'IGCSE', 'British']
  const levels = ['All Levels', 'Grade 1-3', 'Grade 4-6', 'Grade 7-8', 'Grade 9-10', 'Grade 11-12', 'A-Level']

  return (
    <section className="py-16 bg-white border-b border-sage-100">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-charcoal-400" />
              <input
                type="text"
                placeholder="Search for resources, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-sage-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300 text-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2 px-6">
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Curriculum Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Curriculum</label>
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300"
              >
                {curricula.map((curriculum) => (
                  <option key={curriculum} value={curriculum}>
                    {curriculum}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300"
              >
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Sort By</label>
              <select className="w-full px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all duration-300">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Highest Rated</option>
                <option>Most Downloaded</option>
                <option>Alphabetical</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-end">
              <div className="flex border border-sage-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-gold-500 text-navy-900' : 'bg-white text-charcoal-600 hover:bg-sage-50'} transition-colors duration-300`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-gold-500 text-navy-900' : 'bg-white text-charcoal-600 hover:bg-sage-50'} transition-colors duration-300`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 bg-gold-100 text-gold-800 text-sm font-medium rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:text-gold-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCurriculum && selectedCurriculum !== 'All Curricula' && (
              <span className="inline-flex items-center px-3 py-1 bg-navy-100 text-navy-800 text-sm font-medium rounded-full">
                {selectedCurriculum}
                <button
                  onClick={() => setSelectedCurriculum('')}
                  className="ml-2 hover:text-navy-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedLevel && selectedLevel !== 'All Levels' && (
              <span className="inline-flex items-center px-3 py-1 bg-sage-100 text-sage-800 text-sm font-medium rounded-full">
                {selectedLevel}
                <button
                  onClick={() => setSelectedLevel('')}
                  className="ml-2 hover:text-sage-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-charcoal-600">
            <p>Showing 1-12 of 500+ resources</p>
            <div className="flex items-center space-x-4">
              <span>Results per page:</span>
              <select className="px-2 py-1 border border-sage-200 rounded text-sm">
                <option>12</option>
                <option>24</option>
                <option>48</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}