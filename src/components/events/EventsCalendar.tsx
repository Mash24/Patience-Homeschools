'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function EventsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const events = [
    {
      id: 1,
      title: 'Advanced Chemistry Lab Session',
      date: new Date(2024, 0, 15),
      time: '10:00 AM - 2:00 PM',
      location: 'Nairobi Science Centre',
      capacity: 20,
      registered: 15,
      price: 'KSh 2,500',
      type: 'Lab Session',
      curriculum: 'IGCSE',
      featured: true
    },
    {
      id: 2,
      title: 'CBC Mathematics Workshop',
      date: new Date(2024, 0, 18),
      time: '9:00 AM - 12:00 PM',
      location: 'Kenyatta University',
      capacity: 30,
      registered: 28,
      price: 'KSh 1,500',
      type: 'Workshop',
      curriculum: 'CBC',
      featured: false
    },
    {
      id: 3,
      title: 'British Literature Discussion',
      date: new Date(2024, 0, 22),
      time: '2:00 PM - 4:00 PM',
      location: 'Nairobi Library',
      capacity: 25,
      registered: 22,
      price: 'Free',
      type: 'Discussion',
      curriculum: 'British',
      featured: true
    },
    {
      id: 4,
      title: 'Sports Day & Team Building',
      date: new Date(2024, 0, 25),
      time: '8:00 AM - 5:00 PM',
      location: 'Kasarani Sports Complex',
      capacity: 100,
      registered: 85,
      price: 'KSh 1,000',
      type: 'Sports',
      curriculum: 'All',
      featured: false
    }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    )
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="card-luxury">
              <div className="flex items-center justify-between mb-8">
                <h2 className="heading-sm">Event Calendar</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-sage-100 rounded-lg transition-colors duration-300"
                  >
                    <ChevronLeft className="h-5 w-5 text-charcoal-600" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-sage-100 rounded-lg transition-colors duration-300"
                  >
                    <ChevronRight className="h-5 w-5 text-charcoal-600" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-navy-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-charcoal-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : []
                  const isToday = day && day.toDateString() === new Date().toDateString()
                  const isSelected = day && day.toDateString() === selectedDate.toDateString()
                  
                  return (
                    <button
                      key={index}
                      onClick={() => day && setSelectedDate(day)}
                      className={`p-2 h-16 text-sm rounded-lg transition-all duration-300 ${
                        day
                          ? `hover:bg-gold-50 ${
                              isSelected
                                ? 'bg-gold-500 text-navy-900 font-semibold'
                                : isToday
                                ? 'bg-navy-100 text-navy-900 font-semibold'
                                : 'text-charcoal-700 hover:text-gold-600'
                            }`
                          : ''
                      }`}
                    >
                      {day && (
                        <div className="space-y-1">
                          <div>{day.getDate()}</div>
                          {dayEvents.length > 0 && (
                            <div className="flex justify-center">
                              <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            <h3 className="heading-sm">Upcoming Events</h3>
            
            {events.slice(0, 4).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors duration-300">
                        {event.title}
                      </h4>
                      <p className="text-sm text-charcoal-600">{event.type}</p>
                    </div>
                    {event.featured && (
                      <Star className="h-4 w-4 text-gold-500 fill-current" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-charcoal-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{event.registered}/{event.capacity} registered</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-sage-100">
                    <span className="font-semibold text-gold-600">{event.price}</span>
                    <button className="btn-primary text-sm py-2 px-4">
                      Register
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            <button className="w-full btn-outline">
              View All Events
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}