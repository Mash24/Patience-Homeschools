'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Breadcrumb from '@/components/Breadcrumb'
import StatusBar from '@/components/StatusBar'
import { 
  User, 
  LogOut, 
  CheckCircle, 
  Bell, 
  MessageSquare, 
  Menu, 
  X,
  Home,
  Users,
  BookOpen,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  ChevronRight,
  Plus,
  Eye,
  Download,
  Send,
  BookOpen as LogoIcon,
  Shield,
  UserCheck,
  ClipboardList,
  CreditCard,
  PieChart,
  Mail,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Globe,
  Sparkles,
  Sun,
  Moon,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface DashboardCard {
  id: string
  title: string
  value: string | number
  change?: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
  action?: string
  href?: string
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'info' | 'success' | 'warning' | 'error'
  unread: boolean
}

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  href: string
}

interface DashboardLayoutProps {
  role: 'teacher' | 'admin' | 'parent'
  children?: React.ReactNode
}

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    checkUser()
    loadNotifications()
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement search logic here
  }

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }

      setUser(user)
    } catch (err) {
      console.error('Error checking user:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadNotifications = async () => {
    // Mock notifications - replace with real data
    setNotifications([
      {
        id: '1',
        title: role === 'teacher' ? 'New Student Assignment' : 'New Teacher Application',
        message: role === 'teacher' ? 'You have been assigned to teach Mathematics to John Doe' : 'Sarah Johnson submitted a teacher application',
        time: '2 hours ago',
        type: 'info',
        unread: true
      },
      {
        id: '2',
        title: 'Payment Processed',
        message: role === 'teacher' ? 'KES 15,000 has been credited to your account' : 'Payment processed for teacher Sarah Johnson',
        time: '1 day ago',
        type: 'success',
        unread: false
      },
      {
        id: '3',
        title: 'Schedule Update',
        message: role === 'teacher' ? 'Your Tuesday 2PM class has been rescheduled' : 'Teacher availability updated',
        time: '2 days ago',
        type: 'warning',
        unread: false
      }
    ])
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  // Role-specific sidebar items
  const getSidebarItems = (): SidebarItem[] => {
    switch (role) {
      case 'teacher':
        return [
          { id: 'overview', label: 'Overview', icon: Home, href: '/dashboard' },
          { id: 'students', label: 'My Students', icon: Users, href: '/students' },
          { id: 'assignments', label: 'Assignments', icon: BookOpen, href: '/assignments' },
          { id: 'schedule', label: 'Schedule', icon: Calendar, href: '/schedule' },
          { id: 'documents', label: 'Documents', icon: FileText, href: '/documents' },
          { id: 'earnings', label: 'Earnings', icon: DollarSign, href: '/earnings' },
          { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages' },
          { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' }
        ]
      case 'admin':
        return [
          { id: 'overview', label: 'Dashboard', icon: Home, href: '/admin' },
          { id: 'teachers', label: 'Teachers', icon: UserCheck, href: '/admin/teachers' },
          { id: 'parents', label: 'Parents', icon: Users, href: '/admin/parents' },
          { id: 'applications', label: 'Applications', icon: ClipboardList, href: '/admin/applications' },
          { id: 'assignments', label: 'Assignments', icon: BookOpen, href: '/admin/assignments' },
          { id: 'payments', label: 'Payments', icon: CreditCard, href: '/admin/payments' },
          { id: 'reports', label: 'Reports', icon: PieChart, href: '/admin/reports' },
          { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
          { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' }
        ]
      default:
        return []
    }
  }

  // Role-specific dashboard cards
  const getDashboardCards = (): DashboardCard[] => {
    switch (role) {
      case 'teacher':
        return [
          {
            id: 'students',
            title: 'Active Students',
            value: 4,
            change: '+2 this week',
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            action: 'View Students',
            href: '/students'
          },
          {
            id: 'sessions',
            title: 'Upcoming Sessions',
            value: 8,
            change: 'This week',
            icon: Calendar,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            action: 'View Schedule',
            href: '/schedule'
          },
          {
            id: 'earnings',
            title: 'This Month',
            value: 'KES 24,000',
            change: '+15% from last month',
            icon: DollarSign,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            action: 'View Details',
            href: '/earnings'
          },
          {
            id: 'documents',
            title: 'Documents',
            value: 'All Verified',
            change: '3 uploaded',
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            action: 'Manage',
            href: '/documents'
          }
        ]
      case 'admin':
        return [
          {
            id: 'teachers',
            title: 'Active Teachers',
            value: 43,
            change: '+8 this month',
            icon: UserCheck,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            action: 'Manage Teachers',
            href: '/admin/teachers'
          },
          {
            id: 'applications',
            title: 'Pending Applications',
            value: 12,
            change: '3 new today',
            icon: ClipboardList,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            action: 'Review Now',
            href: '/admin/applications'
          },
          {
            id: 'parents',
            title: 'Active Parents',
            value: 47,
            change: '+12% this week',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            action: 'View Parents',
            href: '/admin/parents'
          },
          {
            id: 'revenue',
            title: 'Monthly Revenue',
            value: 'KES 120,000',
            change: '+18% from last month',
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            action: 'View Reports',
            href: '/admin/reports'
          }
        ]
      default:
        return []
    }
  }

  const getRoleTitle = () => {
    switch (role) {
      case 'teacher': return 'Teacher Dashboard'
      case 'admin': return 'Admin Dashboard'
      default: return 'Dashboard'
    }
  }

  const getStatusBanner = () => {
    switch (role) {
      case 'teacher':
        return {
          title: 'Application Approved!',
          message: 'You can now manage classes and view student assignments. Complete your availability schedule to start receiving bookings.',
          actions: ['Complete Schedule', 'View Profile']
        }
      case 'admin':
        return {
          title: 'System Overview',
          message: 'Welcome to the admin dashboard. You have 12 pending teacher applications and 3 new parent registrations today.',
          actions: ['Review Applications', 'View Reports']
        }
      default:
        return {
          title: 'Welcome!',
          message: 'Your dashboard is ready.',
          actions: ['Get Started']
        }
    }
  }

  const sidebarItems = getSidebarItems()
  const dashboardCards = getDashboardCards()
  const statusBanner = getStatusBanner()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Modern Header with Glassmorphism */}
      <header className={`fixed top-0 left-0 right-0 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} z-50 transition-all duration-300`}>
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Left side - Modern Logo & Menu */}
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation transition-all duration-200"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              {/* Modern Logo with Gradient */}
              <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4 lg:ml-0 min-w-0 flex-1">
                <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1.5 sm:p-2 rounded-xl flex-shrink-0 shadow-lg">
                  <LogoIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className={`text-sm sm:text-base lg:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>Nelimac Learning</h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} truncate`}>{getRoleTitle()}</p>
                </div>
              </div>
            </div>
            
            {/* Right side - Modern Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
              {/* Advanced Search */}
              <div className="hidden sm:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${role === 'teacher' ? 'students, assignments' : role === 'admin' ? 'teachers, applications' : 'content'}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={`w-32 sm:w-48 lg:w-64 pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border ${darkMode ? 'border-gray-600 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm transition-all duration-200`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <Search className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'} transition-all duration-200 touch-manipulation`}
              >
                {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className={`p-1.5 sm:p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'} transition-all duration-200 touch-manipulation`}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>

              {/* Notifications with Modern Badge */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-1.5 sm:p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'} transition-all duration-200 touch-manipulation`}
                >
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
                
                {/* Modern Notification Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 top-full mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                          <button className="text-xs text-blue-600 hover:text-blue-700">Mark all read</button>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map((notification) => (
                            <div key={notification.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors cursor-pointer`}>
                              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Messages */}
              <button className={`relative p-1.5 sm:p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-400 hover:bg-gray-100'} transition-all duration-200 touch-manipulation`}>
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500 rounded-full animate-pulse"></span>
              </button>

              {/* Modern Profile Section */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 touch-manipulation"
                >
                  <div className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                    {user?.user_metadata?.profile_photo_url ? (
                      <img
                        src={user.user_metadata.profile_photo_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate max-w-24`}>Welcome back, {user?.email?.split('@')[0]}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'} capitalize`}>{role}</p>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>

                {/* Modern Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 top-full mt-2 w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50`}
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            {user?.user_metadata?.profile_photo_url ? (
                              <img
                                src={user.user_metadata.profile_photo_url}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <User className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.email?.split('@')[0]}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} capitalize`}>{role}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <button className={`w-full text-left px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <Settings className="h-4 w-4 inline mr-2" />
                            Settings
                          </button>
                          <button className={`w-full text-left px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                            <User className="h-4 w-4 inline mr-2" />
                            Profile
                          </button>
                          <hr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                          <button
                            onClick={handleLogout}
                            className={`w-full text-left px-3 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'} transition-colors`}
                          >
                            <LogOut className="h-4 w-4 inline mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar - Touch Optimized */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-lg lg:hidden pt-14 sm:pt-16"
            >
              <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 border-b">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 sm:p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 touch-manipulation"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <nav className="flex-1 px-3 sm:px-4 py-3 sm:py-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-3 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors touch-manipulation ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="mr-3 h-5 w-5 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </a>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:pb-0 lg:bg-white lg:border-r lg:z-40">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className="flex-1 lg:pl-64 pt-14 sm:pt-16">
          <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 pb-16 sm:pb-20">
            {/* Breadcrumb Navigation - Mobile optimized */}
            <div className="mb-4 sm:mb-6">
              <Breadcrumb items={[{ label: 'Overview' }]} />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Modern Status Banner with Glassmorphism */}
              <div className={`relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-gray-700/50' : 'border-white/20'} shadow-xl p-6 sm:p-8`}>
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                
                <div className="relative text-white">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{statusBanner.title}</h2>
                      <p className="text-blue-100 mb-3 text-sm sm:text-base leading-relaxed">
                        {statusBanner.message}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {statusBanner.actions.map((action, index) => (
                          <button 
                            key={index} 
                            className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all duration-200 text-sm sm:text-base touch-manipulation whitespace-nowrap border border-white/20"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Dashboard Cards with Glassmorphism */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {dashboardCards.map((card, index) => {
                  const Icon = card.icon
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-xl border ${darkMode ? 'border-gray-700/50' : 'border-white/20'} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
                    >
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className={`p-3 rounded-xl ${card.bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`h-6 w-6 ${card.color}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-600'} leading-tight`}>{card.title}</h3>
                              </div>
                            </div>
                            <div className="ml-0 sm:ml-16">
                              <p className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{card.value}</p>
                              {card.change && (
                                <div className="flex items-center space-x-2">
                                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    card.change.includes('+') 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {card.change.includes('+') ? (
                                      <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                      <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    {card.change}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} group-hover:bg-blue-500/20 transition-colors duration-300`}>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                        
                        {card.action && (
                          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <button className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors duration-200 flex items-center group-hover:translate-x-1 transform transition-transform`}>
                              {card.action}
                              <ArrowUpRight className="h-3 w-3 ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Quick Actions & Recent Activity - Mobile optimized */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {role === 'teacher' && (
                      <>
                        <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="flex items-center space-x-3">
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Add Availability</span>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Upload Document</span>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </button>
                      </>
                    )}
                    
                    {role === 'admin' && (
                      <>
                        <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="flex items-center space-x-3">
                            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Review Applications</span>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="flex items-center space-x-3">
                            <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Generate Reports</span>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </button>
                      </>
                    )}
                    
                    {role === 'parent' && (
                      <>
                        <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Schedule Session</span>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </button>
                        
                        <button className="w-full flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            <span className="font-medium text-gray-900 text-sm sm:text-base">Make Payment</span>
                          </div>
                          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </button>
                      </>
                    )}
                    
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Send className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-900">Send Message</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            notification.type === 'success' ? 'bg-green-100' :
                            notification.type === 'warning' ? 'bg-yellow-100' :
                            notification.type === 'error' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {notification.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                             notification.type === 'warning' ? <AlertCircle className="h-4 w-4 text-yellow-600" /> :
                             notification.type === 'error' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
                             <Bell className="h-4 w-4 text-blue-600" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.message}</p>
                          <p className="text-xs text-gray-400">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Custom content for each role */}
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Status Bar - Always Visible */}
      <StatusBar version="v1.0.0" showSupport={true} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
