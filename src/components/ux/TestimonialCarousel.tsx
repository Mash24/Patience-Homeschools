'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  autoSlide?: boolean
  slideInterval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export default function TestimonialCarousel({
  testimonials,
  autoSlide = true,
  slideInterval = 5000,
  showDots = true,
  showArrows = true,
  className = ''
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, isHovered, testimonials.length])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (testimonials.length === 0) return null

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-white p-6 md:p-8 shadow-lg border border-gray-100"
          >
            {/* Rating Stars */}
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonials[currentIndex].rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Content */}
            <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              "{testimonials[currentIndex].content}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonials[currentIndex].name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && testimonials.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && testimonials.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoSlide && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
          <motion.div
            className="bg-blue-600 h-1 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: slideInterval / 1000, ease: "linear" }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  )
}
