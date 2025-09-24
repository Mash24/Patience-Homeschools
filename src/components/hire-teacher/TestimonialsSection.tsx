'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  Star, 
  Quote, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Kimani",
      location: "Karen",
      child: "Emma, Grade 6",
      curriculum: "IGCSE",
      rating: 5,
      text: "Nelimac Learning transformed our daughter's education journey. The teacher matching was spot-on, and Emma went from struggling in math to excelling within just 3 months. The personalized approach and quality of teaching is outstanding.",
      image: "/api/placeholder/80/80",
      achievements: ["Math grade improved from D to A", "Confidence boosted significantly", "Now loves learning"],
      duration: "6 months",
      teacher: "Grace Wanjiku"
    },
    {
      id: 2,
      name: "David Mwangi",
      location: "Westlands",
      child: "James, Grade 8",
      curriculum: "CBC",
      rating: 5,
      text: "Outstanding service! Our son was struggling with CBC subjects, but the teacher Nelimac matched us with understood his learning style perfectly. James is now performing exceptionally well and actually enjoys his studies.",
      image: "/api/placeholder/80/80",
      achievements: ["All subjects improved", "Better study habits", "Increased motivation"],
      duration: "4 months",
      teacher: "Sarah Mwangi"
    },
    {
      id: 3,
      name: "Grace Wanjiku",
      location: "Kilimani",
      child: "Sophie, Grade 4",
      curriculum: "British Curriculum",
      text: "The quality of teachers is exceptional. Professional, patient, and truly understand how children learn best. Sophie's reading and writing skills have improved dramatically, and she's more confident in class.",
      image: "/api/placeholder/80/80",
      achievements: ["Reading level advanced 2 grades", "Writing skills improved", "Confidence increased"],
      duration: "5 months",
      teacher: "David Kimani",
      rating: 5
    },
    {
      id: 4,
      name: "Michael Ochieng",
      location: "Runda",
      child: "Alex, Grade 10",
      curriculum: "IGCSE",
      rating: 5,
      text: "As a working parent, I was concerned about finding quality education for my son. Nelimac Learning exceeded all expectations. The teacher is not only qualified but also genuinely cares about Alex's success.",
      image: "/api/placeholder/80/80",
      achievements: ["IGCSE grades improved", "Better time management", "Clear career direction"],
      duration: "8 months",
      teacher: "Grace Wanjiku"
    },
    {
      id: 5,
      name: "Jane Wambui",
      location: "Lavington",
      child: "Maria, Grade 7",
      curriculum: "CBC",
      rating: 5,
      text: "The personalized approach and attention to detail is remarkable. Maria was struggling with science concepts, but her teacher made everything so clear and engaging. She now looks forward to science lessons!",
      image: "/api/placeholder/80/80",
      achievements: ["Science grades improved", "Better understanding of concepts", "Increased curiosity"],
      duration: "3 months",
      teacher: "Sarah Mwangi"
    },
    {
      id: 6,
      name: "Peter Mutua",
      location: "Parklands",
      child: "Kevin, Grade 5",
      curriculum: "British Curriculum",
      rating: 5,
      text: "The flexibility and quality of teaching is unmatched. Kevin's teacher adapts to his learning pace and style, making every lesson engaging and effective. We couldn't be happier with the results.",
      image: "/api/placeholder/80/80",
      achievements: ["All-round improvement", "Better focus and attention", "Love for learning"],
      duration: "6 months",
      teacher: "David Kimani"
    }
  ]

  const stats = [
    { number: "200+", label: "Happy Families", icon: Heart, color: "text-red-500" },
    { number: "98%", label: "Success Rate", icon: TrendingUp, color: "text-green-500" },
    { number: "4.9/5", label: "Average Rating", icon: Star, color: "text-yellow-500" },
    { number: "24hrs", label: "Response Time", icon: Award, color: "text-blue-500" }
  ]

  const totalGroups = Math.ceil(testimonials.length / 3)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalGroups)
    }, 8000)
    return () => clearInterval(interval)
  }, [totalGroups])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % totalGroups)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + totalGroups) % totalGroups)
  }

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Parents Say About Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real families are saying about their experience with Nelimac Learning.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mobile-First Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Real Parent Stories</h3>
            <p className="text-xs sm:text-sm text-gray-600">Hear from families who found their perfect teacher</p>
          </div>

          {/* Mobile-First Carousel */}
          <div className="relative">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">Use arrows to navigate</span>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all border border-gray-200"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                animate={{
                  x: `-${currentTestimonial * 100}%`
                }}
                style={{
                  width: `${totalGroups * 100}%`
                }}
              >
                {/* Mobile: 1 card, Tablet: 2 cards, Desktop: 3 cards */}
                {Array.from({ length: totalGroups }, (_, groupIndex) => (
                  <div key={groupIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 px-1 sm:px-2 lg:px-0">
                      {testimonials.slice(groupIndex * 3, (groupIndex + 1) * 3).map((testimonial, index) => (
                        <motion.div
                          key={testimonial.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                        >
                          {/* Ultra-Compact Mobile Card */}
                          <div className="p-3 sm:p-4 lg:p-6">
                            {/* Quote & Rating Row */}
                            <div className="flex items-start justify-between mb-3">
                              <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200 flex-shrink-0" />
                              <div className="flex items-center space-x-0.5">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>

                            {/* Testimonial Text - Ultra Compact */}
                            <blockquote className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed mb-3 line-clamp-3 sm:line-clamp-4">
                              "{testimonial.text}"
                            </blockquote>

                            {/* Parent Info - Ultra Compact */}
                            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                                  {testimonial.name}
                                </div>
                                <div className="text-gray-600 text-xs sm:text-sm truncate">
                                  {testimonial.location} • {testimonial.child}
                                </div>
                                <div className="text-blue-600 text-xs truncate">
                                  {testimonial.curriculum} • {testimonial.duration}
                                </div>
                              </div>
                            </div>

                            {/* Achievement - Ultra Compact */}
                            <div className="pt-2 border-t border-gray-100">
                              <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md">
                                <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1.5 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium truncate">
                                  {testimonial.achievements[0]}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Indicators - Ultra Compact */}
            <div className="flex justify-center mt-4 sm:mt-6 space-x-1.5">
              {Array.from({ length: totalGroups }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 w-6 sm:w-8' : 'bg-gray-300 w-1.5 sm:w-2'
                  }`}
                />
              ))}
            </div>

            {/* Mobile Swipe Hint - Ultra Compact */}
            <div className="lg:hidden text-center mt-3">
              <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                <span>Swipe to explore</span>
                <ChevronRight className="h-3 w-3" />
              </p>
            </div>
          </div>
        </motion.div>

        {/* Video Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Watch Real Stories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm font-medium">{testimonial.name}</div>
                  <div className="text-xs opacity-75">{testimonial.child} • {testimonial.curriculum}</div>
                  <div className="flex items-center mt-2">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-xs opacity-75">2 min video</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Trusted by Families Across Nairobi
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">Happy Families</div>
              </div>
              <div className="text-center">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Expert Teachers</div>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join These Happy Families?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your journey to finding the perfect teacher for your child today.
            </p>
            <button 
              onClick={() => document.getElementById('teacher-matching-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Find Your Perfect Teacher
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
