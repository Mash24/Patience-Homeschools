'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, Navigation } from 'lucide-react'
import TeacherApplyHero from '@/components/teacher-apply/TeacherApplyHero'
import TeacherApplicationWizard from '@/components/teacher-apply/TeacherApplicationWizard'
import WhyJoinUs from '@/components/teacher-apply/WhyJoinUs'
import ApplicationProcess from '@/components/teacher-apply/ApplicationProcess'

export default function TeacherApplyPage() {
  const [activeSection, setActiveSection] = useState('hero')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const sections = [
    { id: 'hero', label: 'Overview', component: TeacherApplyHero },
    { id: 'application', label: 'Application', component: TeacherApplicationWizard },
    { id: 'benefits', label: 'Benefits', component: WhyJoinUs },
    { id: 'process', label: 'Process', component: ApplicationProcess }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      
      const scrollPosition = window.scrollY
      setShowScrollTop(scrollPosition > 300)

      // Calculate scroll progress
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(scrollPosition / scrollHeight, 1) : 0
      setScrollProgress(progress)

      // Update active section based on scroll position
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id)
      })).filter(section => section.element)

      const currentSection = sectionElements.find(section => {
        const rect = section.element!.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return
    
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const scrollToTop = () => {
    if (typeof window === 'undefined') return
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Smooth scrolling CSS */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Sticky Navigation */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Teacher Application</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <select
                value={activeSection}
                onChange={(e) => scrollToSection(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Add top padding to account for sticky nav */}
      <div className="pt-16">
        {/* Hero Section */}
        <section id="hero">
          <TeacherApplyHero />
        </section>

        {/* Application Section */}
        <section id="application">
          <TeacherApplicationWizard />
        </section>

        {/* Benefits Section */}
        <section id="benefits">
          <WhyJoinUs />
        </section>

        {/* Process Section */}
        <section id="process">
          <ApplicationProcess />
        </section>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: showScrollTop ? 1 : 0, 
          opacity: showScrollTop ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-6 w-6" />
      </motion.button>

      {/* Progress Indicator */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50"
        style={{
          transform: `scaleX(${scrollProgress})`
        }}
      />
    </div>
  )
}

