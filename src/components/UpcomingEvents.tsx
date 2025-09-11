'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, Microscope, Trophy, BookOpen } from 'lucide-react'

const events = [
  {
    title: 'CBC Science Lab Session',
    description: 'Hands-on practical experiments for CBC Grade 6-8 students at Nairobi School Lab.',
    date: '2024-02-15',
    time: '10:00 AM - 2:00 PM',
    location: 'Nairobi School, Westlands',
    attendees: 25,
    maxAttendees: 30,
    type: 'Lab Session',
    icon: Microscope,
    color: 'blue'
  },
  {
    title: 'IGCSE Mathematics Workshop',
    description: 'Advanced problem-solving techniques and exam preparation strategies.',
    date: '2024-02-20',
    time: '9:00 AM - 12:00 PM',
    location: 'Online via Zoom',
    attendees: 18,
    maxAttendees: 25,
    type: 'Workshop',
    icon: BookOpen,
    color: 'green'
  },
  {
    title: 'Homeschool Sports Day',
    description: 'Annual sports day bringing together all homeschooling families for fun activities.',
    date: '2024-02-25',
    time: '8:00 AM - 4:00 PM',
    location: 'Kasarani Sports Complex',
    attendees: 45,
    maxAttendees: 60,
    type: 'Sports Day',
    icon: Trophy,
    color: 'orange'
  }
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600'
}

export default function UpcomingEvents() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community events designed to enhance learning, build connections, 
            and create memorable experiences for homeschooling families.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[event.color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform duration-300`}>
                  <event.icon className="h-6 w-6" />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {event.type}
                </span>
              </div>

              {/* Event Content */}
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees}/{event.maxAttendees} registered</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Registration</span>
                  <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* RSVP Button */}
              <button className="w-full btn-primary group-hover:bg-blue-700 transition-colors duration-300">
                RSVP Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* View All Events CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/events" className="btn-outline">
            View All Events
          </Link>
        </motion.div>

        {/* Event Types Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Event Types
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-6 border border-gray-100 rounded-lg">
                <Microscope className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Lab Sessions</h4>
                <p className="text-gray-600 text-sm">Hands-on practical experiments at partner schools</p>
              </div>
              <div className="text-center p-6 border border-gray-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Workshops</h4>
                <p className="text-gray-600 text-sm">Subject-specific learning sessions and exam prep</p>
              </div>
              <div className="text-center p-6 border border-gray-100 rounded-lg">
                <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Community Events</h4>
                <p className="text-gray-600 text-sm">Sports days, meetups, and social activities</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
