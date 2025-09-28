'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Star, 
  MapPin, 
  GraduationCap, 
  Award, 
  Clock, 
  Search,
  Filter,
  SortAsc,
  Heart,
  MessageCircle,
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  Zap,
  Shield,
  CheckCircle,
  Eye,
  Phone,
  Sparkles,
  TrendingUp,
  UserCheck,
  Globe,
  Languages,
  Code,
  Palette,
  Music,
  Calculator,
  Microscope,
  PenTool,
  Brain,
  Target,
  ThumbsUp,
  Timer,
  CheckCircle2,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Teacher {
  id: string
  full_name?: string
  name?: string
  email?: string
  phone?: string
  location_area?: string
  location?: string
  subjects?: string[]
  curricula?: string[]
  curriculum?: string
  grade_levels?: string[]
  experience_years?: number
  experience?: string
  education_background?: string
  education?: string
  teaching_philosophy?: string
  availability?: string[]
  hourly_rate_range?: string
  hourlyRate?: string
  tsc_number?: string
  status?: string
  is_featured?: boolean
  is_verified?: boolean
  isVerified?: boolean
  bio?: string
  rating?: number
  reviews?: number
  successRate?: number
  studentsHelped?: number
  responseTime?: string
  badge?: string
  badgeColor?: string
  isOnline?: boolean
}

export default function FeaturedTeachersEnhanced() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCurriculum, setSelectedCurriculum] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favoriteTeachers, setFavoriteTeachers] = useState<string[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      // First try to get approved and verified teachers
      let { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('status', 'approved')
        .eq('is_verified', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      // If no approved teachers found, get submitted teachers as fallback
      if (!error && (!data || data.length === 0)) {
        console.log('No approved teachers found, loading submitted teachers as fallback')
        const fallbackResult = await supabase
          .from('teachers')
          .select('*')
          .eq('status', 'submitted')
          .order('created_at', { ascending: false })
          .limit(6) // Limit to 6 for demo purposes
        
        if (!fallbackResult.error) {
          data = fallbackResult.data
          error = fallbackResult.error
        }
      }

      if (error) {
        console.error('Error loading teachers:', error)
        return
      }

      setTeachers(data || [])
    } catch (error) {
      console.error('Error loading teachers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback static data for demo purposes
  const fallbackTeachers = [
    {
      id: '1',
      name: 'Grace Wanjiku',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      subjectIcons: [Calculator, Microscope, Microscope],
      curriculum: 'IGCSE',
      experience: '8 years',
      rating: 4.9,
      reviews: 24,
      location: 'Westlands',
      education: 'MSc Mathematics, University of Nairobi',
      specialties: ['Exam Preparation', 'Problem Solving', 'Conceptual Understanding'],
      hourlyRate: 'Contact for pricing',
      availability: 'Mornings & Evenings',
      image: '/api/placeholder/150/150',
      bio: 'Passionate mathematics educator with 8 years of experience helping students excel in IGCSE Mathematics and Sciences.',
      achievements: ['TSC Certified', 'Top 1% Teacher', 'Student Success Award'],
      languages: ['English', 'Kiswahili'],
      responseTime: '< 2 hours',
      completionRate: '98%',
      badge: 'Top Rated',
      badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      gradient: 'from-blue-500 to-purple-600',
      isVerified: true,
      isOnline: true,
      lastActive: '2 minutes ago',
      studentsHelped: 150,
      successRate: 98
    },
    {
      id: '2',
      name: 'David Kimani',
      subjects: ['English', 'Literature', 'Creative Writing'],
      subjectIcons: [BookOpen, PenTool, Brain],
      curriculum: 'British Curriculum',
      experience: '6 years',
      rating: 4.8,
      reviews: 18,
      location: 'Karen',
      education: 'BA English Literature, Kenyatta University',
      specialties: ['Essay Writing', 'Poetry Analysis', 'Critical Thinking'],
      hourlyRate: 'Contact for pricing',
      availability: 'Afternoons & Weekends',
      image: '/api/placeholder/150/150',
      bio: 'Experienced English teacher specializing in literature and creative writing, helping students develop strong communication skills.',
      achievements: ['TSC Certified', 'Literature Expert', 'Creative Writing Mentor'],
      languages: ['English', 'Kiswahili', 'French'],
      responseTime: '< 1 hour',
      completionRate: '95%',
      badge: 'Expert',
      badgeColor: 'bg-gradient-to-r from-green-400 to-blue-500',
      gradient: 'from-emerald-500 to-teal-600',
      isVerified: true,
      isOnline: false,
      lastActive: '1 hour ago',
      studentsHelped: 120,
      successRate: 95
    },
    {
      id: '3',
      name: 'Sarah Mwangi',
      subjects: ['CBC All Subjects', 'Kiswahili', 'Social Studies'],
      subjectIcons: [BookOpen, Languages, Globe],
      curriculum: 'CBC',
      experience: '5 years',
      rating: 4.9,
      reviews: 31,
      location: 'Kilimani',
      education: 'BEd Primary Education, Moi University',
      specialties: ['Competency-Based Learning', 'Child Development', 'Parent Guidance'],
      hourlyRate: 'Contact for pricing',
      availability: 'Flexible',
      image: '/api/placeholder/150/150',
      bio: 'Dedicated CBC specialist with expertise in competency-based learning and child development.',
      achievements: ['TSC Certified', 'CBC Specialist', 'Child Development Expert'],
      languages: ['English', 'Kiswahili'],
      responseTime: '< 3 hours',
      completionRate: '99%',
      badge: 'CBC Specialist',
      badgeColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
      gradient: 'from-purple-500 to-pink-600',
      isVerified: true,
      isOnline: true,
      lastActive: '5 minutes ago',
      studentsHelped: 200,
      successRate: 99
    },
    {
      id: '4',
      name: 'Michael Ochieng',
      subjects: ['Computer Studies', 'ICT', 'Programming'],
      subjectIcons: [Code, Code, Code],
      curriculum: 'IGCSE',
      experience: '7 years',
      rating: 4.7,
      reviews: 15,
      location: 'Runda',
      education: 'BSc Computer Science, JKUAT',
      specialties: ['Python Programming', 'Web Development', 'Database Design'],
      hourlyRate: 'Contact for pricing',
      availability: 'Evenings & Weekends',
      image: '/api/placeholder/150/150',
      bio: 'Tech-savvy educator passionate about teaching computer science and programming to the next generation.',
      achievements: ['TSC Certified', 'Tech Innovation Award', 'Programming Mentor'],
      languages: ['English', 'Kiswahili'],
      responseTime: '< 4 hours',
      completionRate: '92%',
      badge: 'Tech Expert',
      badgeColor: 'bg-gradient-to-r from-blue-400 to-cyan-500',
      gradient: 'from-blue-500 to-cyan-600',
      isVerified: true,
      isOnline: false,
      lastActive: '3 hours ago',
      studentsHelped: 80,
      successRate: 92
    },
    {
      id: '5',
      name: 'Jane Wambui',
      subjects: ['French', 'German', 'Languages'],
      subjectIcons: [Languages, Languages, Languages],
      curriculum: 'British Curriculum',
      experience: '9 years',
      rating: 4.8,
      reviews: 22,
      location: 'Lavington',
      education: 'MA Modern Languages, University of Nairobi',
      specialties: ['Conversational Practice', 'Grammar Mastery', 'Cultural Immersion'],
      hourlyRate: 'Contact for pricing',
      availability: 'Mornings & Afternoons',
      image: '/api/placeholder/150/150',
      bio: 'Multilingual educator with native-level proficiency in French and German, specializing in conversational learning.',
      achievements: ['TSC Certified', 'Language Expert', 'Cultural Ambassador'],
      languages: ['English', 'Kiswahili', 'French', 'German'],
      responseTime: '< 2 hours',
      completionRate: '96%',
      badge: 'Multilingual',
      badgeColor: 'bg-gradient-to-r from-indigo-400 to-purple-500',
      gradient: 'from-indigo-500 to-purple-600',
      isVerified: true,
      isOnline: true,
      lastActive: '10 minutes ago',
      studentsHelped: 180,
      successRate: 96
    },
    {
      id: '6',
      name: 'Peter Mutua',
      subjects: ['Art', 'Design', 'Creative Studies'],
      subjectIcons: [Palette, PenTool, Brain],
      curriculum: 'CBC',
      experience: '6 years',
      rating: 4.6,
      reviews: 19,
      location: 'Parklands',
      education: 'BFA Fine Arts, Kenyatta University',
      specialties: ['Drawing Techniques', 'Color Theory', 'Portfolio Development'],
      hourlyRate: 'Contact for pricing',
      availability: 'Flexible',
      image: '/api/placeholder/150/150',
      bio: 'Creative arts educator helping students discover their artistic potential through various mediums and techniques.',
      achievements: ['TSC Certified', 'Art Exhibition Winner', 'Creative Mentor'],
      languages: ['English', 'Kiswahili'],
      responseTime: '< 3 hours',
      completionRate: '94%',
      badge: 'Creative',
      badgeColor: 'bg-gradient-to-r from-pink-400 to-rose-500',
      gradient: 'from-pink-500 to-rose-600',
      isVerified: true,
      isOnline: false,
      lastActive: '2 hours ago',
      studentsHelped: 90,
      successRate: 94
    }
  ]

  const curricula = ['all', 'CBC', 'IGCSE', 'British Curriculum']
  const subjects = ['all', 'Mathematics', 'English', 'Science', 'Kiswahili', 'French', 'German', 'Computer Studies', 'Art', 'Music']
  const locations = ['all', 'Westlands', 'Karen', 'Runda', 'Kilimani', 'Lavington', 'Parklands']

  const displayTeachers = teachers.length > 0 ? teachers : fallbackTeachers

  const filteredTeachers = useMemo(() => {
    return displayTeachers.filter(teacher => {
      const teacherName = teacher.full_name || teacher.name || ''
      const teacherSubjects = teacher.subjects || []
      const teacherCurricula = teacher.curricula || []
      const teacherLocation = teacher.location_area || teacher.location || ''
      
      const matchesSearch = teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacherSubjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCurriculum = selectedCurriculum === 'all' || teacherCurricula.includes(selectedCurriculum)
      const matchesSubject = selectedSubject === 'all' || teacherSubjects.includes(selectedSubject)
      const matchesLocation = selectedLocation === 'all' || teacherLocation.toLowerCase().includes(selectedLocation.toLowerCase())

      return matchesSearch && matchesCurriculum && matchesSubject && matchesLocation
    }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience)
        case 'price':
          return parseInt(a.hourlyRate.replace(/[^\d]/g, '')) - parseInt(b.hourlyRate.replace(/[^\d]/g, ''))
        case 'reviews':
          return b.reviews - a.reviews
        default:
          return 0
      }
    })
  }, [searchTerm, selectedCurriculum, selectedSubject, selectedLocation, sortBy])

  const toggleFavorite = (teacherId: string) => {
    setFavoriteTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    )
  }

  const toggleExpanded = (teacherId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(teacherId)) {
        newSet.delete(teacherId)
      } else {
        newSet.add(teacherId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teachers...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Meet Our Teachers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Expert Teacher Network</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            TSC-certified educators who are passionate about helping students succeed. 
            <span className="font-semibold text-purple-600">Join our network</span> and make a difference in students' lives.
          </p>
        </motion.div>

        {/* Modern Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-12"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, subject, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="space-y-4">
            {/* Curriculum Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Curriculum</h3>
              <div className="flex flex-wrap gap-2">
                {curricula.map(curriculum => (
                  <button
                    key={curriculum}
                    onClick={() => setSelectedCurriculum(curriculum)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCurriculum === curriculum
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {curriculum === 'all' ? 'All Curricula' : curriculum}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSubject === subject
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject === 'all' ? 'All Subjects' : subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Location</h3>
              <div className="flex flex-wrap gap-2">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLocation === location
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {location === 'all' ? 'All Locations' : location}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="reviews">Reviews</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <div className="w-4 h-4 space-y-1">
                    <div className="bg-current rounded-sm h-1"></div>
                    <div className="bg-current rounded-sm h-1"></div>
                    <div className="bg-current rounded-sm h-1"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredTeachers.length}</span> of <span className="font-semibold text-gray-900">{teachers.length}</span> teachers
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserCheck className="h-4 w-4" />
              <span>All verified & TSC certified</span>
            </div>
          </div>
        </div>

        {/* Modern Teacher Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8' 
              : 'space-y-6'
            }
          >
            {filteredTeachers.map((teacher, index) => {
              const isExpanded = expandedCards.has(teacher.id)
              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                >
                  {/* Mobile-Optimized Teacher Card */}
                  <div className="p-4 sm:p-6">
                    {/* Header Row - Always Visible */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm sm:text-lg font-bold shadow-lg">
                          {(teacher.full_name || teacher.name || '').split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{teacher.full_name || teacher.name}</h3>
                            {(teacher.is_verified || teacher.isVerified) && (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{teacher.rating || '4.8'}</span>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span>{teacher.location_area || teacher.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Badge & Online Status */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${teacher.badgeColor}`}>
                          {teacher.badge}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${teacher.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                    </div>

                    {/* Compact Info Row */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{(teacher.curricula || [teacher.curriculum]).join(', ')}</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">{teacher.experience_years || teacher.experience} years</span>
            </div>
                    </div>

                    {/* Subjects - Compact */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {(teacher.subjects || []).slice(0, 2).map((subject, subjectIndex) => (
                          <div key={subjectIndex} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
                            <BookOpen className="h-3 w-3 text-gray-600" />
                            <span className="text-xs font-medium text-gray-700">{subject}</span>
                          </div>
                        ))}
                        {(teacher.subjects || []).length > 2 && (
                          <div className="px-2 py-1 bg-gray-100 rounded-md">
                            <span className="text-xs text-gray-600">+{(teacher.subjects || []).length - 2}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {/* Bio */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 leading-relaxed">{teacher.bio || teacher.teaching_philosophy || 'Passionate educator dedicated to student success.'}</p>
                          </div>

                          {/* All Subjects */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">All Subjects</h4>
                            <div className="flex flex-wrap gap-2">
                              {(teacher.subjects || []).map((subject, subjectIndex) => (
                                <div key={subjectIndex} className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">{subject}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">{teacher.successRate || '95'}%</div>
                              <div className="text-xs text-blue-600">Success Rate</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">{teacher.studentsHelped || '50+'}</div>
                              <div className="text-xs text-green-600">Students</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">{teacher.responseTime || '< 2h'}</div>
                              <div className="text-xs text-purple-600">Response</div>
                            </div>
                          </div>

                          {/* Education & Availability */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="p-3 bg-orange-50 rounded-lg">
                              <div className="text-sm font-medium text-orange-800 mb-1">Education</div>
                              <div className="text-xs text-orange-600">{teacher.education_background || teacher.education || 'University Degree'}</div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg">
                              <div className="text-sm font-medium text-indigo-800 mb-1">Availability</div>
                              <div className="text-xs text-indigo-600">{(teacher.availability || []).join(', ') || 'Flexible'}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFavorite(teacher.id)}
                          className={`p-2 rounded-full transition-all ${
                            favoriteTeachers.includes(teacher.id)
                              ? 'text-red-500 bg-red-50'
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favoriteTeachers.includes(teacher.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpanded(teacher.id)}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium flex items-center space-x-1"
                        >
                          <span>{isExpanded ? 'Less' : 'More'}</span>
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                        <button 
                          onClick={() => document.getElementById('teacher-matching-form')?.scrollIntoView({ behavior: 'smooth' })}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Request Teacher
                        </button>
                      </div>
                    </div>
                  </div>
              </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* No Results */}
        {filteredTeachers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCurriculum('all')
                setSelectedSubject('all')
                setSelectedLocation('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              <span className="font-semibold text-blue-600">Parents:</span> Request a teacher and we'll call you within 24 hours. 
              <span className="font-semibold text-purple-600"> Teachers:</span> Join our network and start making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('teacher-matching-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Request a Teacher
              </button>
              <a
                href="/teacher-apply"
                className="btn-outline inline-flex items-center justify-center"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Join as Teacher
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
