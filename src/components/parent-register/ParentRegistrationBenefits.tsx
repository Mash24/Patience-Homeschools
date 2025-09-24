'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  CheckCircle, 
  Award, 
  Zap, 
  Users, 
  Clock, 
  Star, 
  Heart,
  BookOpen,
  GraduationCap,
  Globe,
  MessageCircle,
  TrendingUp,
  Crown,
  Sparkles
} from 'lucide-react'

export default function ParentRegistrationBenefits() {
  const benefits = [
    {
      icon: Shield,
      title: "TSC Certified Teachers",
      description: "All our teachers are certified by the Teachers Service Commission, ensuring quality and professionalism.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: CheckCircle,
      title: "Background Verified",
      description: "Every teacher undergoes thorough background checks and verification processes for your peace of mind.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "We guarantee the quality of our teachers with a satisfaction promise and continuous monitoring.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Zap,
      title: "Quick Matching",
      description: "Our smart matching system connects you with the perfect teacher within 24 hours of registration.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join a vibrant community of parents sharing experiences, resources, and educational insights.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Teachers work around your family's schedule, providing maximum convenience and flexibility.",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    }
  ]

  const features = [
    {
      icon: BookOpen,
      title: "Multiple Curricula",
      description: "CBC, IGCSE, British Curriculum and more",
      highlight: "All Major Systems"
    },
    {
      icon: GraduationCap,
      title: "All Subjects",
      description: "Mathematics, Sciences, Languages, Arts",
      highlight: "Complete Coverage"
    },
    {
      icon: Globe,
      title: "All Locations",
      description: "Nairobi-wide coverage with flexible options",
      highlight: "Citywide Service"
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Always available to help and answer questions",
      highlight: "Always Here"
    }
  ]

  const stats = [
    { number: "500+", label: "Happy Families", icon: Heart, color: "text-red-500" },
    { number: "98%", label: "Success Rate", icon: TrendingUp, color: "text-green-500" },
    { number: "24hrs", label: "Response Time", icon: Clock, color: "text-blue-500" },
    { number: "50+", label: "Expert Teachers", icon: GraduationCap, color: "text-purple-500" }
  ]

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 shadow-sm mb-6"
            >
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Why Choose Nelimac Learning?</span>
            </motion.div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need for Your Child's Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of families who trust Nelimac Learning for their children's education. 
              We provide comprehensive support, quality teachers, and a community that cares.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${benefit.bgColor} ${benefit.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`${benefit.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-100 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Comprehensive Education Solutions
              </h3>
              <p className="text-lg text-gray-600">
                We cover all aspects of your child's educational journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-4 group-hover:scale-105 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 mx-auto mb-3" />
                    <div className="text-sm font-medium opacity-90">{feature.highlight}</div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="text-center mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Trusted by Families Across Nairobi
              </h3>
              <p className="text-blue-100 text-lg">
                Our numbers speak for themselves
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`${stat.color} mb-3`}>
                    <stat.icon className="h-8 w-8 mx-auto" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h3>
                <Sparkles className="h-6 w-6 text-yellow-500 ml-2" />
              </div>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our community today and give your child access to the best education resources and teachers in Nairobi.
              </p>
              <button
                onClick={() => {
                  document.getElementById('parent-registration-form')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  })
                }}
                className="btn-primary inline-flex items-center group"
              >
                <Crown className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Register Now - It's Free
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
