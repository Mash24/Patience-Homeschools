'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  BookOpen,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import type { ParentLead, Teacher } from '@/lib/schemas'

interface AdminDashboardProps {
  leads: ParentLead[]
  teachers: Teacher[]
}

export default function AdminDashboard({ leads, teachers }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'teachers'>('leads')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(text)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-800'
      case 'matched':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-mobile py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-lg">Admin Dashboard</h1>
              <p className="text-muted mt-2">Manage leads and teacher applications</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-green-600">{teachers.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-mobile py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'leads'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Parent Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'teachers'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Teacher Applications ({teachers.length})
          </button>
        </div>

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No leads found</p>
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{lead.parent_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.city && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {lead.city}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(lead.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {copiedId === lead.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Child Information</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {lead.child_first_name && <p><strong>Name:</strong> {lead.child_first_name}</p>}
                        <p><strong>Grade:</strong> {lead.grade_level}</p>
                        <p><strong>Mode:</strong> {lead.mode}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Curricula:</strong> {lead.curricula.join(', ')}</p>
                        <p><strong>Subjects:</strong> {lead.subjects.join(', ')}</p>
                        {lead.budget_band && <p><strong>Budget:</strong> {lead.budget_band}</p>}
                      </div>
                    </div>
                  </div>

                  {lead.goals && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Learning Goals</h4>
                      <p className="text-sm text-gray-600">{lead.goals}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(lead.created_at)}
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn-ghost text-sm">
                        View Details
                      </button>
                      <button className="btn-primary text-sm">
                        Create Match
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {teachers.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No teacher applications found</p>
              </div>
            ) : (
              teachers.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                          {teacher.status}
                        </span>
                        {teacher.verified && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {teacher.email}
                        </div>
                        {teacher.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {teacher.phone}
                          </div>
                        )}
                        {teacher.city && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {teacher.city}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(teacher.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      {copiedId === teacher.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Experience</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Years:</strong> {teacher.years_experience}</p>
                        <p><strong>Mode:</strong> {teacher.mode}</p>
                        {teacher.tsc_number && <p><strong>TSC:</strong> {teacher.tsc_number}</p>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Curricula:</strong> {teacher.curricula.join(', ')}</p>
                        <p><strong>Subjects:</strong> {teacher.subjects.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {teacher.bio && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
                      <p className="text-sm text-gray-600">{teacher.bio}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(teacher.created_at)}
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn-ghost text-sm">
                        View Details
                      </button>
                      <button className="btn-primary text-sm">
                        Review Application
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
