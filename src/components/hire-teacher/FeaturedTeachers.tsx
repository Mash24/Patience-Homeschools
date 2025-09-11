'use client'

import { motion } from 'framer-motion'
import { Star, MapPin, GraduationCap, Award, Clock } from 'lucide-react'

const teachers = [
  {
    name: 'Grace Wanjiku',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    curriculum: 'IGCSE',
    experience: '8 years',
    rating: 4.9,
    reviews: 24,
    location: 'Westlands',
    education: 'MSc Mathematics, University of Nairobi',
    specialties: ['Exam Preparation', 'Problem Solving', 'Conceptual Understanding'],
    hourlyRate: 'KSh 2,500',
    availability: 'Mornings & Evenings',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'David Kimani',
    subjects: ['English', 'Literature', 'Creative Writing'],
    curriculum: 'British Curriculum',
    experience: '6 years',
    rating: 4.8,
    reviews: 18,
    location: 'Karen',
    education: 'BA English Literature, Kenyatta University',
    specialties: ['Essay Writing', 'Poetry Analysis', 'Critical Thinking'],
    hourlyRate: 'KSh 2,200',
    availability: 'Afternoons & Weekends',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Sarah Mwangi',
    subjects: ['CBC All Subjects', 'Kiswahili', 'Social Studies'],
    curriculum: 'CBC',
    experience: '5 years',
    rating: 4.9,
    reviews: 31,
    location: 'Kilimani',
    education: 'BEd Primary Education, Moi University',
    specialties: ['Competency-Based Learning', 'Child Development', 'Parent Guidance'],
    hourlyRate: 'KSh 1,800',
    availability: 'Flexible',
    image: '/api/placeholder/150/150'
  }
]

export default function FeaturedTeachers() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Teachers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet some of our highly qualified and experienced teachers who are ready 
            to help your child succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card hover:shadow-xl transition-all duration-300 group"
            >
              {/* Teacher Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {teacher.name}
                </h3>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{teacher.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{teacher.reviews} reviews</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{teacher.location}</span>
                </div>
              </div>

              {/* Teacher Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, subjectIndex) => (
                      <span
                        key={subjectIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Curriculum</h4>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {teacher.curriculum}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-blue-600" />
                    {teacher.education}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-orange-600" />
                    {teacher.experience} teaching experience
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {teacher.specialties.map((specialty, specialtyIndex) => (
                      <li key={specialtyIndex} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Rate</h4>
                    <p className="text-sm text-gray-600">{teacher.hourlyRate}/hour</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Availability</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {teacher.availability}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-primary group-hover:bg-blue-700 transition-colors duration-300">
                  View Full Profile
                </button>
                <button className="w-full btn-outline group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  Request Interview
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Teachers CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We have 50+ qualified teachers across all curricula and subjects. 
              Submit your requirements and we'll find the perfect match for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Browse All Teachers
              </button>
              <button className="btn-outline">
                Submit Your Requirements
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

