'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, BookOpen, Users, Calendar, FileText, Phone, Crown } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Curricula', href: '/curricula' },
    { name: 'Find Teacher', href: '/hire-teacher' },
    { name: 'Resources', href: '/resources' },
    { name: 'Events', href: '/events' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-luxury border-b border-gold-200' 
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-gold-500 to-gold-400 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-gold">
              <BookOpen className="h-6 w-6 text-navy-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors duration-300">
                Patience Education Collective
              </h1>
              <p className="text-sm text-charcoal-600 font-medium">Nairobi's Premier Homeschool Network</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-charcoal-700 hover:text-gold-600 font-medium transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-6">
              <Link
                href="/hire-teacher"
                className="btn-ghost"
              >
                Find Teacher
              </Link>
              <Link
                href="/teacher-apply"
                className="btn-primary group"
              >
                <Crown className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Join Faculty
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal-700 hover:text-gold-600 transition-colors duration-300 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 bg-white/95 backdrop-blur-md rounded-2xl mt-4 shadow-luxury border border-gold-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-charcoal-700 hover:text-gold-600 hover:bg-gold-50 rounded-lg font-medium transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gold-100 space-y-2">
                <Link
                  href="/hire-teacher"
                  className="block px-4 py-3 bg-navy-50 text-navy-800 rounded-lg font-medium hover:bg-navy-100 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Find Teacher
                </Link>
                <Link
                  href="/teacher-apply"
                  className="block px-4 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-500 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>Join Faculty</span>
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
