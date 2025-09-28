'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  Plus,
  Eye,
  Edit
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Parent {
  id: string
  full_name: string
  phone: string
  email: string
  created_at: string
  children: Child[]
}

interface Child {
  id: string
  full_name: string
  level: string
  birthdate: string
  notes: string
  created_at: string
}

export default function AdminParents() {
  const [parents, setParents] = useState<Parent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedParent, setExpandedParent] = useState<string | null>(null)

  useEffect(() => {
    loadParents()
  }, [])

  const loadParents = async () => {
    try {
      const { data: parentsData } = await supabase
        .from('profiles')
        .select(`
          *,
          children:children(*)
        `)
        .eq('role', 'parent')
        .order('created_at', { ascending: false })

      setParents(parentsData || [])
    } catch (error) {
      console.error('Error loading parents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredParents = parents.filter(parent =>
    parent.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.children.some(child => 
      child.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const toggleExpanded = (parentId: string) => {
    setExpandedParent(expandedParent === parentId ? null : parentId)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return null
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Management</h1>
              <p className="text-gray-600">Manage registered parents and their children</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Parents</p>
                <p className="text-2xl font-bold text-gray-900">{parents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Children</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parents.reduce((total, parent) => total + parent.children.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parents.filter(parent => {
                    const created = new Date(parent.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && 
                           created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search parents or children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Parents List */}
        <div className="space-y-4">
          {filteredParents.map((parent) => (
            <motion.div
              key={parent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(parent.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {parent.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{parent.full_name}</h3>
                      <p className="text-sm text-gray-600">{parent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{parent.children.length} children</p>
                      <p className="text-xs text-gray-500">Joined {formatDate(parent.created_at)}</p>
                    </div>
                    {expandedParent === parent.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedParent === parent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t px-6 py-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Parent Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Parent Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {parent.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          {parent.phone || 'Not provided'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Joined {formatDate(parent.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Children */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Children</h4>
                      {parent.children.length === 0 ? (
                        <p className="text-sm text-gray-500">No children added yet</p>
                      ) : (
                        <div className="space-y-3">
                          {parent.children.map((child) => (
                            <div key={child.id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{child.full_name}</p>
                                  <p className="text-sm text-gray-600">{child.level}</p>
                                  {child.birthdate && (
                                    <p className="text-xs text-gray-500">
                                      Age: {calculateAge(child.birthdate)} years
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button className="p-1 text-gray-400 hover:text-gray-600">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-gray-600">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              {child.notes && (
                                <p className="text-xs text-gray-600 mt-2">{child.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                        <Plus className="h-4 w-4" />
                        Create Assignment
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <Mail className="h-4 w-4" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredParents.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No parents found</p>
            <p className="text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'No parents have registered yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
