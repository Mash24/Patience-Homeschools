'use client'

import { motion } from 'framer-motion'
import { Users, Mail, Phone, MapPin } from 'lucide-react'

const teamMembers = [
  {
    name: 'Patience Wanjiku',
    role: 'Founder & Education Director',
    description: '8+ years in education, passionate about personalized learning',
    image: '/api/placeholder/200/200',
    initials: 'PW'
  },
  {
    name: 'David Kimani',
    role: 'Teacher Relations Manager',
    description: 'Ensures quality teacher recruitment and support',
    image: '/api/placeholder/200/200',
    initials: 'DK'
  },
  {
    name: 'Sarah Mwangi',
    role: 'Community Coordinator',
    description: 'Manages events and community engagement',
    image: '/api/placeholder/200/200',
    initials: 'SM'
  }
]

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@patiencehomeschools.co.ke',
    description: 'General inquiries and support'
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+254 XXX XXX XXX',
    description: 'Speak directly with our team'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'Nairobi, Kenya',
    description: 'Located in the heart of Nairobi'
  }
]

export default function OurTeam() {
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
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our dedicated team is committed to providing exceptional educational services 
            and building a supportive community for families and teachers.
          </p>
        </motion.div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="card text-center hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                {member.initials}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {member.name}
              </h3>
              <div className="text-blue-600 font-medium mb-3">
                {member.role}
              </div>
              <p className="text-gray-600 text-sm">
                {member.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Get in Touch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((contact, index) => (
                <div key={contact.title} className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{contact.title}</h4>
                  <p className="text-blue-600 font-medium mb-2">{contact.details}</p>
                  <p className="text-gray-600 text-sm">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

