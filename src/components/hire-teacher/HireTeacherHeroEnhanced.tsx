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
  Sparkles,
  Target,
  MessageCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  CheckCircle2,
  UserCheck,
  Bookmark,
  ThumbsUp,
  Timer,
  DollarSign,
  Home,
  Laptop,
  Wifi
} from 'lucide-react'

export default function HireTeacherHeroEnhanced() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const testimonials = [
    {
      name: "Sarah Kimani",
      location: "Karen",
      text: "Nelimac Learning connected us with the perfect teacher for our daughter. The personalized approach has transformed her learning experience.",
      rating: 5,
      child: "Grade 6, IGCSE",
      avatar: "👩‍💼",
      improvement: "Math grades improved by 40%",
      type: "parent"
    },
    {
      name: "David Mwangi",
      location: "Westlands", 
      text: "Outstanding service! Our son went from struggling in math to excelling within 3 months. The teacher matching was spot-on.",
      rating: 5,
      child: "Grade 8, CBC",
      avatar: "👨‍💼",
      improvement: "From D+ to A- in 3 months",
      type: "parent"
    },
    {
      name: "Grace Wanjiku",
      location: "Kilimani",
      text: "The quality of teachers is exceptional. Professional, patient, and truly understand how children learn best.",
      rating: 5,
      child: "Grade 4, British Curriculum",
      avatar: "👩‍💼",
      improvement: "Confidence levels soared",
      type: "parent"
    },
    {
      name: "James Ochieng",
      location: "Runda",
      text: "No signup required, just submit your request and get matched! The process was so simple and the results speak for themselves.",
      rating: 5,
      child: "Grade 10, IGCSE",
      avatar: "👨‍💼",
      improvement: "Physics grades up 50%",
      type: "parent"
    },
    {
      name: "Mary Wanjiku",
      location: "Teacher",
      text: "Joining Nelimac Learning was the best career decision I made. The platform connects me with amazing students and provides great support.",
      rating: 5,
      child: "Mathematics Teacher",
      avatar: "👩‍🏫",
      improvement: "5+ years experience",
      type: "teacher"
    },
    {
      name: "Peter Kamau",
      location: "Teacher",
      text: "The admin team is fantastic - they handle all the logistics so I can focus on what I love: teaching. Great platform for educators!",
      rating: 5,
      child: "Science Teacher",
      avatar: "👨‍🏫",
      improvement: "TSC Certified",
      type: "teacher"
    }
  ]

  const stats = [
    { number: "500+", label: "Happy Families", icon: Heart, color: "text-red-500", description: "Parents trust us" },
    { number: "98%", label: "Success Rate", icon: TrendingUp, color: "text-green-500", description: "Student improvement" },
    { number: "24hrs", label: "Response Time", icon: Clock, color: "text-blue-500", description: "Quick matching" },
    { number: "100+", label: "Expert Teachers", icon: GraduationCap, color: "text-purple-500", description: "TSC certified" }
  ]

  const trustIndicators = [
    { icon: Shield, text: "TSC Certified", color: "text-green-600", description: "All teachers verified" },
    { icon: CheckCircle, text: "Background Checked", color: "text-blue-600", description: "Safe & secure" },
    { icon: Award, text: "Quality Guaranteed", color: "text-purple-600", description: "100% satisfaction" },
    { icon: Zap, text: "No Signup Required", color: "text-orange-600", description: "Just submit & get matched" }
  ]

  const features = [
    {
      icon: Target,
      title: "Teacher Network",
      description: "Join Nairobi's most trusted network of TSC-certified educators",
      color: "bg-blue-50 border-blue-200 text-blue-600"
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Parents get called within 24 hours for personalized service",
      color: "bg-green-50 border-green-200 text-green-600"
    },
    {
      icon: Shield,
      title: "Verified Teachers",
      description: "All teachers are TSC certified and background checked",
      color: "bg-purple-50 border-purple-200 text-purple-600"
    },
    {
      icon: Heart,
      title: "Personal Touch",
      description: "Admin-driven matching ensures perfect teacher-student fit",
      color: "bg-pink-50 border-pink-200 text-pink-600"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const scrollToForm = () => {
    document.getElementById('teacher-matching-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Enhanced Background Elements */}
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
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20"
        />
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-yellow-200 rounded-full opacity-30"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-green-200 rounded-full opacity-30"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            
            {/* Left Column - Enhanced Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 shadow-lg"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Nairobi's #1 Teacher Matching Platform</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </motion.div>

              {/* Enhanced Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Nairobi's Premier
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Teacher Platform
                  </span>
                </h1>
              </motion.div>

              {/* Enhanced Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
              >
                Join our network of TSC-certified teachers or find the perfect educator for your child. 
                <span className="font-semibold text-blue-600">Teachers:</span> Apply to join our platform. 
                <span className="font-semibold text-purple-600">Parents:</span> Request a teacher - we'll call you!
              </motion.p>

              {/* Enhanced Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <indicator.icon className={`h-5 w-5 ${indicator.color}`} />
                    <div>
                      <span className="font-medium text-gray-900 text-sm">{indicator.text}</span>
                      <p className="text-xs text-gray-600">{indicator.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={scrollToForm}
                  className="btn-primary inline-flex items-center justify-center group text-lg px-8 py-4"
                >
                  <Target className="mr-2 h-5 w-5" />
                  Request a Teacher
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="/teacher-apply"
                  className="btn-outline inline-flex items-center justify-center group text-lg px-8 py-4"
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Join as Teacher
                </a>
              </motion.div>

              {/* Enhanced Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}>
                      {stat.number}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{stat.label}</div>
                    <div className="text-xs text-gray-600">{stat.description}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Enhanced Testimonials & Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Enhanced Testimonial Card */}
              <motion.div
                style={{ opacity }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20"
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
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{testimonials[currentTestimonial].avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-gray-600">{testimonials[currentTestimonial].location}</div>
                      <div className="text-sm text-blue-600 font-medium">{testimonials[currentTestimonial].child}</div>
                      <div className="text-xs text-green-600 font-medium">{testimonials[currentTestimonial].improvement}</div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${
                        testimonials[currentTestimonial].type === 'teacher' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {testimonials[currentTestimonial].type === 'teacher' ? 'Teacher' : 'Parent'}
                      </div>
                    </div>
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

              {/* Enhanced Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    className={`${feature.color} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                  >
                    <feature.icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Video Thumbnail */}
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

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center cursor-pointer"
          onClick={scrollToForm}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
        <p className="text-xs text-gray-500 mt-2 text-center">Scroll to get started</p>
      </motion.div>
    </section>
  )
}
