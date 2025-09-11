'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Star, Image, Play } from 'lucide-react'

export default function PastEvents() {
  const pastEvents = [
    {
      id: 1,
      title: 'Advanced Physics Lab Session',
      date: 'December 15, 2023',
      location: 'Nairobi Science Centre',
      participants: 18,
      rating: 4.9,
      image: '/api/placeholder/400/250',
      description: 'Hands-on experiments with advanced physics concepts including quantum mechanics and thermodynamics.',
      highlights: ['Quantum mechanics experiments', 'Thermodynamics demonstrations', 'Professional lab equipment', 'Expert guidance'],
      testimonials: [
        {
          name: 'Sarah Mwangi',
          text: 'Amazing experience! My daughter was so engaged and learned so much.',
          rating: 5
        }
      ]
    },
    {
      id: 2,
      title: 'CBC Mathematics Masterclass',
      date: 'December 8, 2023',
      location: 'Kenyatta University',
      participants: 25,
      rating: 4.8,
      image: '/api/placeholder/400/250',
      description: 'Comprehensive mathematics workshop covering all CBC topics with practical applications.',
      highlights: ['Problem-solving techniques', 'Interactive activities', 'Take-home materials', 'Progress assessment'],
      testimonials: [
        {
          name: 'John Kimani',
          text: 'The best math workshop we\'ve attended. Highly recommended!',
          rating: 5
        }
      ]
    },
    {
      id: 3,
      title: 'British Literature Discussion Circle',
      date: 'December 1, 2023',
      location: 'Nairobi Library',
      participants: 20,
      rating: 4.9,
      image: '/api/placeholder/400/250',
      description: 'In-depth discussion of classic British literature with expert analysis and interpretation.',
      highlights: ['Classic literature analysis', 'Critical thinking skills', 'Group discussions', 'Expert facilitation'],
      testimonials: [
        {
          name: 'Grace Wanjiku',
          text: 'Such an enriching experience. The discussions were thought-provoking.',
          rating: 5
        }
      ]
    },
    {
      id: 4,
      title: 'Annual Sports Day',
      date: 'November 25, 2023',
      location: 'Kasarani Sports Complex',
      participants: 120,
      rating: 4.7,
      image: '/api/placeholder/400/250',
      description: 'Community sports day with various activities, competitions, and team-building exercises.',
      highlights: ['Multiple sports activities', 'Team competitions', 'Awards ceremony', 'Family fun'],
      testimonials: [
        {
          name: 'Michael Otieno',
          text: 'Great day out for the whole family. Kids had a blast!',
          rating: 5
        }
      ]
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-md mb-6">
            Past Event
            <span className="text-gradient-gold"> Highlights</span>
          </h2>
          <p className="text-luxury max-w-3xl mx-auto">
            Take a look at some of our recent successful events and see what makes our community 
            so special. These highlights showcase the quality and impact of our premium events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-luxury group cursor-pointer"
            >
              <div className="space-y-6">
                {/* Event Image */}
                <div className="relative overflow-hidden rounded-xl">
                  <div className="aspect-video bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                    <Image className="h-16 w-16 text-sage-400" alt="" />
                  </div>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-gold-500 fill-current" />
                      <span className="text-sm font-semibold text-navy-900">{event.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-navy-900 text-xl mb-2 group-hover:text-gold-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-charcoal-600">{event.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-charcoal-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  {/* Event Highlights */}
                  <div>
                    <h4 className="font-medium text-navy-900 text-sm mb-2">Key Highlights:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {event.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-center text-xs text-charcoal-600">
                          <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></div>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  {event.testimonials.length > 0 && (
                    <div className="bg-sage-50 rounded-lg p-4">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(event.testimonials[0].rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gold-500 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-charcoal-700 italic mb-2">
                        "{event.testimonials[0].text}"
                      </p>
                      <p className="text-xs text-charcoal-600 font-medium">
                        — {event.testimonials[0].name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="card-luxury max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <h3 className="heading-sm">Join Our Next Event</h3>
              <p className="text-luxury max-w-2xl mx-auto">
                Don't miss out on our upcoming premium events. Be part of a community that values 
                excellence in education and creates memorable learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  View Upcoming Events
                </button>
                <button className="btn-outline">
                  Subscribe to Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}