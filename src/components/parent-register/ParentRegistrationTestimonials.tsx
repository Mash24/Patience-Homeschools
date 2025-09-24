'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Heart,
  Users,
  Award,
  TrendingUp
} from 'lucide-react'

export default function ParentRegistrationTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const testimonials = [
    {
      name: "Sarah Kimani",
      location: "Karen",
      child: "Emma, Grade 6",
      rating: 5,
      text: "Joining Nelimac Learning was the best decision for our family. The personalized approach and quality teachers have transformed our daughter's education. She went from struggling with mathematics to being top of her class!",
      image: "/api/placeholder/80/80",
      achievements: ["Math Grade Improved", "Confidence Boost", "Better Study Habits"],
      duration: "6 months"
    },
    {
      name: "David Mwangi",
      location: "Westlands",
      child: "James, Grade 8",
      rating: 5,
      text: "The platform makes it so easy to find the perfect teacher. Our son's grades have improved dramatically since we joined. The teachers are not just educators, they're mentors who truly care about our child's success.",
      image: "/api/placeholder/80/80",
      achievements: ["All A's", "Leadership Role", "Scholarship Award"],
      duration: "8 months"
    },
    {
      name: "Grace Wanjiku",
      location: "Kilimani",
      child: "Sophie, Grade 4",
      rating: 5,
      text: "The community and resources available to parents are incredible. We feel supported every step of the way. The teachers understand our daughter's learning style and adapt their methods accordingly.",
      image: "/api/placeholder/80/80",
      achievements: ["Reading Level Up", "Creative Expression", "Social Skills"],
      duration: "4 months"
    },
    {
      name: "Michael Ochieng",
      location: "Runda",
      child: "Alex, Grade 10",
      rating: 5,
      text: "As a working parent, the flexibility of scheduling is a game-changer. The online sessions are just as effective as in-person ones, and our son loves the interactive learning approach.",
      image: "/api/placeholder/80/80",
      achievements: ["IGCSE Preparation", "Time Management", "Self-Discipline"],
      duration: "1 year"
    },
    {
      name: "Jane Akinyi",
      location: "Lavington",
      child: "Maria, Grade 2",
      rating: 5,
      text: "The CBC curriculum support is outstanding. Our daughter's teacher understands the competency-based approach perfectly and makes learning fun and engaging. She looks forward to every lesson!",
      image: "/api/placeholder/80/80",
      achievements: ["Core Competencies", "Digital Literacy", "Critical Thinking"],
      duration: "3 months"
    },
    {
      name: "Peter Kiprop",
      location: "Parklands",
      child: "Daniel, Grade 7",
      rating: 5,
      text: "The quality of teachers is exceptional. They're not just teaching subjects, they're building character and confidence. Our son has become more independent and responsible in his studies.",
      image: "/api/placeholder/80/80",
      achievements: ["Independence", "Responsibility", "Academic Excellence"],
      duration: "5 months"
    }
  ]

  const stats = [
    { number: "98%", label: "Parent Satisfaction", icon: Heart, color: "text-red-500" },
    { number: "500+", label: "Happy Families", icon: Users, color: "text-blue-500" },
    { number: "95%", label: "Grade Improvement", icon: TrendingUp, color: "text-green-500" },
    { number: "4.9/5", label: "Average Rating", icon: Star, color: "text-yellow-500" }
  ]

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-mobile">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              What Parents Say About Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what real parents have to say about their experience with Nelimac Learning.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gray-50 rounded-xl p-6"
              >
                <div className={`${stat.color} mb-3`}>
                  <stat.icon className="h-8 w-8 mx-auto" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Testimonial */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 lg:p-12 mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <Quote className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Featured Testimonial</h3>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isPlaying 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Play className={`h-4 w-4 ${isPlaying ? 'hidden' : 'block'}`} />
                  <div className={`h-4 w-4 ${isPlaying ? 'block' : 'hidden'}`}>
                    <div className="w-1 h-4 bg-white rounded-sm mr-1 inline-block"></div>
                    <div className="w-1 h-4 bg-white rounded-sm inline-block"></div>
                  </div>
                  <span className="text-sm font-medium">
                    {isPlaying ? 'Pause' : 'Auto-play'}
                  </span>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
              >
                {/* Testimonial Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg lg:text-xl text-gray-700 mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-gray-600">
                        {testimonials[currentTestimonial].location} • {testimonials[currentTestimonial].child}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        Member for {testimonials[currentTestimonial].duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {testimonials[currentTestimonial].achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Video Testimonials Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl overflow-hidden cursor-pointer group"
            >
              <div className="aspect-video flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="p-6 text-white">
                <h4 className="font-semibold mb-2">Sarah's Success Story</h4>
                <p className="text-sm opacity-90">How Emma improved from Grade D to Grade A in Mathematics</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl overflow-hidden cursor-pointer group"
            >
              <div className="aspect-video flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="p-6 text-white">
                <h4 className="font-semibold mb-2">David's Experience</h4>
                <p className="text-sm opacity-90">Finding the perfect teacher for James's IGCSE preparation</p>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white"
          >
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Join These Happy Families?
            </h3>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Start your journey with Nelimac Learning today and give your child the education they deserve.
            </p>
            <button
              onClick={() => {
                document.getElementById('parent-registration-form')?.scrollIntoView({ 
                  behavior: 'smooth' 
                })
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center group"
            >
              <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Register Your Family Today
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
