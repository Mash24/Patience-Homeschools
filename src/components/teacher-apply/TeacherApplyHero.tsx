'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Users, DollarSign, Shield, Clock, Award, ArrowRight, CheckCircle } from 'lucide-react'

export default function TeacherApplyHero() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Rates',
      description: 'KSh 1,500 - 3,000 per hour',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Flexible Schedule',
      description: 'Choose your own hours',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Guaranteed payments',
      color: 'purple'
    }
  ]

  const stats = [
    { value: '50+', label: 'Active Teachers', color: 'green' },
    { value: '200+', label: 'Happy Families', color: 'blue' },
    { value: 'KSh 2,500', label: 'Avg. Hourly Rate', color: 'orange' },
    { value: '98%', label: 'Satisfaction Rate', color: 'purple' }
  ]

  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600'
  }

  return (
    <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container-custom py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm"
            >
              <GraduationCap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Join Nairobi's Premier Teaching Network</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Join Our Team of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 block">
                Expert Teachers
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Share your expertise with Nairobi's homeschooling community. 
              Connect with families who value quality education and make a meaningful impact on young minds.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button 
                onClick={() => {
                  const applicationSection = document.getElementById('application')
                  if (applicationSection) {
                    applicationSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    })
                  }
                }}
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center space-x-2">
                  <span>Start Your Application</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200">
                <span className="flex items-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-${benefit.color}-100 to-${benefit.color}-200 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`h-6 w-6 text-${benefit.color}-600`} />
            </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Our Impact in Numbers
              </h2>
              <p className="text-gray-600">
                Join a growing community of educators and families
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className={`text-2xl md:text-3xl lg:text-4xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses]} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>TSC Certified Teachers</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Background Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Secure Payments</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

