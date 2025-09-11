'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

const testimonials = [
  {
    name: 'Sarah Mwangi',
    role: 'Parent of Grade 6 Student',
    content: 'Patience Home Schools connected us with an amazing CBC teacher who understood my daughter\'s learning style. The resources and support have been invaluable.',
    rating: 5,
    location: 'Westlands, Nairobi'
  },
  {
    name: 'David Kimani',
    role: 'Parent of IGCSE Student',
    content: 'The lab sessions and community events have made homeschooling feel less isolating. My son has made friends and gained practical experience.',
    rating: 5,
    location: 'Karen, Nairobi'
  },
  {
    name: 'Grace Wanjiku',
    role: 'Parent of British Curriculum Student',
    content: 'The teacher matching process was so thorough. We found the perfect match for our son\'s needs, and the results speak for themselves.',
    rating: 5,
    location: 'Runda, Nairobi'
  },
  {
    name: 'James Otieno',
    role: 'Parent of Multiple Students',
    content: 'Having access to qualified teachers for different subjects and curricula under one platform has simplified our homeschooling journey significantly.',
    rating: 5,
    location: 'Kilimani, Nairobi'
  },
  {
    name: 'Mary Njoki',
    role: 'Parent of Grade 8 Student',
    content: 'The free resources and regular events have enriched our homeschooling experience. Highly recommend to any parent considering homeschooling.',
    rating: 5,
    location: 'Lavington, Nairobi'
  },
  {
    name: 'Peter Mwangi',
    role: 'Parent of IGCSE Student',
    content: 'The platform made it easy to find teachers who specialize in the subjects my daughter needed. The quality of education has exceeded our expectations.',
    rating: 5,
    location: 'Kileleshwa, Nairobi'
  }
]

export default function Testimonials() {
  const [itemsPerView, setItemsPerView] = useState(1)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Create infinite testimonials array for seamless looping
  const infiniteTestimonials = [...testimonials, ...testimonials, ...testimonials]
  const startIndex = testimonials.length // Start from the middle set
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3)
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2)
      } else {
        setItemsPerView(1)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = testimonials.length - 1

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    
    setCurrentIndex((prev) => {
      const newIndex = prev + 1
      if (newIndex >= testimonials.length * 2) {
        // Reset to beginning without animation
        setTimeout(() => {
          setCurrentIndex(startIndex)
          setIsTransitioning(false)
        }, 500)
        return newIndex
      }
      setTimeout(() => setIsTransitioning(false), 500)
      return newIndex
    })
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    
    setCurrentIndex((prev) => {
      const newIndex = prev - 1
      if (newIndex < startIndex) {
        // Jump to end without animation
        setTimeout(() => {
          setCurrentIndex(startIndex + maxIndex)
          setIsTransitioning(false)
        }, 500)
        return newIndex
      }
      setTimeout(() => setIsTransitioning(false), 500)
      return newIndex
    })
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setCurrentIndex(startIndex + index)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (isHovered || isTransitioning) return // Pause when hovered or transitioning
    
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovered, isTransitioning])


  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Parents Say
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from families who have transformed their homeschooling experience 
            with Patience Home Schools.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 group"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 group"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </button>

          {/* Carousel Track */}
          <div 
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              }}
            >
              {infiniteTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card hover:shadow-xl transition-all duration-300 relative h-full"
                  >
                    {/* Quote Icon */}
                    <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6">
                      <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                        <Quote className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-3 sm:mb-4 pt-3 sm:pt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="border-t border-gray-100 pt-3 sm:pt-4 mt-auto">
                      <div className="font-semibold text-sm sm:text-base text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-600">
                        {testimonial.location}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: testimonials.length }).map((_, index) => {
              const isActive = (currentIndex - startIndex) === index || 
                              (currentIndex >= testimonials.length * 2 && index === 0) ||
                              (currentIndex < startIndex && index === testimonials.length - 1)
              return (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 lg:mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8 text-center">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">98%</div>
                <div className="text-xs sm:text-sm text-gray-600">Parent Satisfaction</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">200+</div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Families</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">50+</div>
                <div className="text-xs sm:text-sm text-gray-600">Qualified Teachers</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">3</div>
                <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
