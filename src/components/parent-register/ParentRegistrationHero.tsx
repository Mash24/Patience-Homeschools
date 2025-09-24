'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Shield, 
  Star, 
  Play, 
  ArrowRight,
  Award,
  Heart,
  Zap,
  Globe,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Crown,
  Sparkles
} from 'lucide-react'

export default function ParentRegistrationHero() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const testimonials = [
    {
      name: "Sarah Kimani",
      location: "Karen",
      text: "Joining Nelimac Learning was the best decision for our family. The personalized approach and quality teachers have transformed our daughter's education.",
      rating: 5,
      child: "Emma, Grade 6"
    },
    {
      name: "David Mwangi",
      location: "Westlands", 
      text: "The platform makes it so easy to find the perfect teacher. Our son's grades have improved dramatically since we joined.",
      rating: 5,
      child: "James, Grade 8"
    },
    {
      name: "Grace Wanjiku",
      location: "Kilimani",
      text: "The community and resources available to parents are incredible. We feel supported every step of the way.",
      rating: 5,
      child: "Sophie, Grade 4"
    }
  ]

  const stats = [
    { number: "500+", label: "Registered Families", icon: Users, color: "text-blue-500" },
    { number: "98%", label: "Success Rate", icon: TrendingUp, color: "text-green-500" },
    { number: "24hrs", label: "Response Time", icon: Clock, color: "text-purple-500" },
    { number: "50+", label: "Expert Teachers", icon: GraduationCap, color: "text-orange-500" }
  ]

  const benefits = [
    { icon: Shield, text: "TSC Certified Teachers", color: "text-green-600" },
    { icon: CheckCircle, text: "Background Checked", color: "text-blue-600" },
    { icon: Award, text: "Quality Guaranteed", color: "text-purple-600" },
    { icon: Zap, text: "Quick Matching", color: "text-orange-600" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const scrollToForm = () => {
    document.getElementById('parent-registration-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
        />
        <motion.div 
          style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
        />
        <motion.div 
          style={{ y: useTransform(scrollY, [0, 500], [0, 200]) }}
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-200 rounded-full opacity-20"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 shadow-sm"
              >
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Join Nairobi's Premier Education Network</span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Join Our Community
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    of Successful Families
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
              >
                Register as a parent and gain access to our network of TSC-certified teachers, 
                exclusive resources, and personalized education support for your child.
              </motion.p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                    <span className="font-medium text-gray-900 text-sm">{benefit.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={scrollToForm}
                  className="btn-primary inline-flex items-center justify-center group"
                >
                  Register Now - It's Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn-outline inline-flex items-center justify-center group">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Testimonials & Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Testimonial Card */}
              <motion.div
                style={{ opacity }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-600">{testimonials[currentTestimonial].location}</div>
                    <div className="text-sm text-blue-600">{testimonials[currentTestimonial].child}</div>
                  </div>
                  <div className="flex space-x-1">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6"
                >
                  <Globe className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Multiple Curricula</h3>
                  <p className="text-sm opacity-90">CBC, IGCSE, British & More</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-6"
                >
                  <BookOpen className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">All Subjects</h3>
                  <p className="text-sm opacity-90">Math, Science, Languages & More</p>
                </motion.div>
              </div>

              {/* Video Thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="aspect-video flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium">See How It Works</div>
                  <div className="text-xs opacity-75">2 min video</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
