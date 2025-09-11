import Link from 'next/link'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        <div className="py-8 sm:py-10 md:py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Patience Home Schools</h3>
                <p className="text-xs sm:text-sm text-gray-300">Nairobi's Trusted Homeschool Network</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Connecting Nairobi's homeschooling families with qualified teachers and creating a supportive learning community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link href="/curricula" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Curricula</Link></li>
              <li><Link href="/hire-teacher" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Hire a Teacher</Link></li>
              <li><Link href="/resources" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Learning Resources</Link></li>
              <li><Link href="/events" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/about" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">Support</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li><Link href="/teacher-apply" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Apply as Teacher</Link></li>
              <li><Link href="/contact" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">Contact Info</h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="text-gray-300 text-xs sm:text-sm">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="text-gray-300 text-xs sm:text-sm">+254 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="text-gray-300 text-xs sm:text-sm">info@patiencehomeschools.co.ke</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-3 sm:space-x-4 pt-3 sm:pt-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-xs sm:text-sm">
              © 2024 Patience Home Schools. All rights reserved.
            </p>
            <p className="text-gray-300 text-xs sm:text-sm mt-2 md:mt-0">
              Built with ❤️ for Nairobi's homeschooling community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
