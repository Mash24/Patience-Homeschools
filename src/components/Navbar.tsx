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
    { name: 'Curricula', href: '/curricula' },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-blue-100' 
        : 'bg-gradient-to-br from-blue-50/80 via-white/60 to-purple-50/80 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center py-4 sm:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                Nelimac Learning
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Nairobi's Premier Education Network</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                Nelimac
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    pathname === item.href 
                      ? 'text-blue-600' 
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                    pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
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
                    placeholder="Search teachers, subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-56 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                </div>
              </form>
            </div>

            {/* CTAs */}
            <div className="flex items-center space-x-3 ml-6">
              {/* Parent CTA - Primary */}
              <Link
                href="/hire-teacher"
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center group"
              >
                <Target className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Hire a Teacher
              </Link>

              {/* Teacher CTA - Secondary */}
              <Link
                href="/teacher-apply"
                className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:via-orange-700 hover:to-amber-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center group"
              >
                <Crown className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                Join Faculty
              </Link>

              {/* Sign In */}
              <Link
                href="/signin"
                className="border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-medium text-sm transition-all duration-300 flex items-center px-4 py-2.5 rounded-xl hover:bg-blue-50/50 backdrop-blur-sm"
              >
                <User className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-50/50"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-50/50"
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
                  placeholder="Search teachers, subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-sm"
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden overflow-hidden">
            <div className="px-4 pt-2 pb-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-2xl mt-3 shadow-2xl border border-blue-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg ${
                    pathname === item.href 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/30'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile CTAs */}
              <div className="pt-4 border-t border-blue-100 space-y-3">
                <Link
                  href="/hire-teacher"
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl font-semibold text-center transition-all duration-300 shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Hire a Teacher</span>
                  </span>
                </Link>
                <Link
                  href="/teacher-apply"
                  className="block px-4 py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white rounded-xl font-semibold text-center transition-all duration-300 shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>Join Faculty</span>
                  </span>
                </Link>
                <Link
                  href="/signin"
                  className="block px-4 py-3 border border-gray-300 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 font-medium text-center transition-all duration-300 rounded-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
