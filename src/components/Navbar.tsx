'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, BookOpen, Users, Calendar, FileText, Phone, Crown, Search, User, GraduationCap, Target, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Find a Tutor', href: '/hire-teacher' },
    { name: 'Programmes', href: '/curricula' },
    { name: 'Resources', href: '/resources' },
    { name: 'Events', href: '/events' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to hire-teacher page with search query
      window.location.href = `/hire-teacher?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg border-b border-gray-100' 
        : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Nelimac Learning
              </h1>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-bold text-gray-900">
                Nelimac
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href 
                      ? 'text-amber-600' 
                      : 'text-gray-700 hover:text-amber-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tutors, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 bg-white"
                  />
                </div>
              </form>
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-4 ml-6">
              {/* Primary CTA - Request a Private Tutor */}
              {/* <Link
                href="/hire-teacher"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Request a Private Tutor
              </Link> */}

              {/* Teacher Sign In */}
              <Link
                href="/signin"
                className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="lg:hidden pb-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tutors, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-4 pt-2 pb-6 space-y-2 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg ${
                    pathname === item.href 
                      ? 'text-amber-600 bg-amber-50' 
                      : 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile CTAs */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  href="/hire-teacher"
                  className="block px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-center transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Request a Private Tutor
                </Link>
                <Link
                  href="/signin"
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium text-center transition-colors duration-200 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

