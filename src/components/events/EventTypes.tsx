'use client'

import { motion } from 'framer-motion'
import { Microscope, BookOpen, Users, Trophy, Palette, Globe, Code, Heart } from 'lucide-react'

export default function EventTypes() {
  const eventTypes = [
    {
      name: 'Lab Sessions',
      icon: Microscope,
      description: 'Hands-on science experiments and practical learning in state-of-the-art laboratories',
      count: '12+ Sessions',
      color: 'from-blue-500 to-blue-600',
      features: ['Professional lab equipment', 'Expert supervision', 'Safety protocols', 'Detailed reports']
    },
    {
      name: 'Academic Workshops',
      icon: BookOpen,
      description: 'Intensive learning sessions covering specific subjects and curriculum topics',
      count: '20+ Workshops',
      color: 'from-green-500 to-green-600',
      features: ['Small group sizes', 'Interactive learning', 'Take-home materials', 'Progress tracking']
    },
    {
      name: 'Study Groups',
      icon: Users,
      description: 'Collaborative learning sessions where students work together on projects',
      count: '15+ Groups',
      color: 'from-purple-500 to-purple-600',
      features: ['Peer learning', 'Group projects', 'Mentor guidance', 'Team building']
    },
    {
      name: 'Sports & Fitness',
      icon: Trophy,
      description: 'Physical activities, sports competitions, and wellness programs',
      count: '8+ Activities',
      color: 'from-orange-500 to-orange-600',
      features: ['Professional coaching', 'Equipment provided', 'Health monitoring', 'Achievement awards']
    },
    {
      name: 'Cultural Events',
      icon: Palette,
      description: 'Art exhibitions, cultural celebrations, and creative expression activities',
      count: '10+ Events',
      color: 'from-pink-500 to-pink-600',
      features: ['Art galleries', 'Cultural performances', 'Creative workshops', 'Exhibition opportunities']
    },
    {
      name: 'Field Trips',
      icon: Globe,
      description: 'Educational excursions to museums, historical sites, and cultural landmarks',
      count: '6+ Trips',
      color: 'from-cyan-500 to-cyan-600',
      features: ['Guided tours', 'Educational materials', 'Transportation', 'Lunch included']
    },
    {
      name: 'Technology Sessions',
      icon: Code,
      description: 'Coding workshops, digital literacy, and innovation projects',
      count: '8+ Sessions',
      color: 'from-indigo-500 to-indigo-600',
      features: ['Modern equipment', 'Expert instructors', 'Project-based learning', 'Portfolio building']
    },
    {
      name: 'Life Skills',
      icon: Heart,
      description: 'Character development, emotional intelligence, and practical life skills',
      count: '5+ Programs',
      color: 'from-red-500 to-red-600',
      features: ['Personal development', 'Leadership skills', 'Communication training', 'Career guidance']
    }
  ]

  return (
    <section className="py-24 bg-sage-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Event
            <span className="text-gradient-gold"> Categories</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Discover our diverse range of premium events designed to complement your homeschooling 
            journey and provide enriching experiences for the whole family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventTypes.map((eventType, index) => (
            <motion.div
              key={eventType.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-luxury group cursor-pointer"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${eventType.color} group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <eventType.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="font-semibold text-navy-900 text-lg mb-2">{eventType.name}</h3>
                  <p className="text-sm text-charcoal-600 mb-3">{eventType.count}</p>
                  <p className="text-sm text-charcoal-500 leading-relaxed">{eventType.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-navy-900 text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {eventType.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-charcoal-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <span className="inline-flex items-center text-sm font-medium text-gold-600 group-hover:text-gold-700">
                    View Events
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="card-luxury max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h3 className="heading-sm">Ready to Join Our Community?</h3>
              <p className="text-luxury max-w-2xl mx-auto">
                Become part of Nairobi's most exclusive homeschooling community and gain access 
                to premium events, expert resources, and a supportive network of like-minded families.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  View All Events
                </button>
                <button className="btn-outline">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}