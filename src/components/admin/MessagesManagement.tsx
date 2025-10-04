'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Phone,
  AlertCircle,
  Search,
  Reply,
  Archive,
  Flag
} from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  sender_name: string
  sender_email: string
  sender_role: 'parent' | 'teacher' | 'admin'
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'general' | 'technical' | 'billing' | 'complaint' | 'feedback'
  admin_reply?: string
  created_at: string
  updated_at: string
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    // Simulate API call - replace with actual Supabase queries
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          sender_id: 'parent_1',
          sender_name: 'Sarah Johnson',
          sender_email: 'sarah.johnson@email.com',
          sender_role: 'parent',
          subject: 'Teacher not responding to messages',
          message: 'My assigned teacher has not been responding to my messages for the past week. I need help getting in touch with them.',
          status: 'open',
          priority: 'high',
          category: 'complaint',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          sender_id: 'teacher_1',
          sender_name: 'John Doe',
          sender_email: 'john.doe@email.com',
          sender_role: 'teacher',
          subject: 'Payment issue',
          message: 'I have not received my payment for the last two weeks. Can you please check on this?',
          status: 'in_progress',
          priority: 'urgent',
          category: 'billing',
          admin_reply: 'Looking into this payment issue. Will update you soon.',
          created_at: '2024-01-14T14:20:00Z',
          updated_at: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          sender_id: 'parent_2',
          sender_name: 'Michael Kimani',
          sender_email: 'michael.kimani@email.com',
          sender_role: 'parent',
          subject: 'Great experience with teacher',
          message: 'I wanted to thank you for matching us with such a great teacher. My child is really improving in mathematics.',
          status: 'closed',
          priority: 'low',
          category: 'feedback',
          admin_reply: 'Thank you for the positive feedback! We are glad to hear about your child\'s progress.',
          created_at: '2024-01-13T09:15:00Z',
          updated_at: '2024-01-13T16:45:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || message.priority === selectedPriority
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-gray-100 text-gray-800'
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'billing': return 'bg-green-100 text-green-800'
      case 'complaint': return 'bg-red-100 text-red-800'
      case 'feedback': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleReply = (messageId: string) => {
    if (replyText.trim()) {
      setMessages(messages.map(message => 
        message.id === messageId 
          ? { ...message, status: 'closed' as const, admin_reply: replyText, updated_at: new Date().toISOString() }
          : message
      ))
      setReplyText('')
      setSelectedMessage(null)
      // TODO: Send email notification to sender
    }
  }

  const handleStatusChange = (messageId: string, newStatus: string) => {
    setMessages(messages.map(message => 
      message.id === messageId 
        ? { ...message, status: newStatus as any, updated_at: new Date().toISOString() }
        : message
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages & Support</h1>
          <p className="text-gray-600">Manage support requests and communications</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: messages.length, color: 'bg-gray-500' },
          { label: 'Open', count: messages.filter(m => m.status === 'open').length, color: 'bg-red-500' },
          { label: 'In Progress', count: messages.filter(m => m.status === 'in_progress').length, color: 'bg-yellow-500' },
          { label: 'Closed', count: messages.filter(m => m.status === 'closed').length, color: 'bg-green-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        message.sender_role === 'parent' ? 'bg-green-600' : 
                        message.sender_role === 'teacher' ? 'bg-blue-600' : 'bg-purple-600'
                      }`}>
                        <span className="text-white text-xs font-medium">
                          {message.sender_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{message.sender_name}</div>
                        <div className="text-sm text-gray-500">{message.sender_email}</div>
                        <div className="text-xs text-gray-400 capitalize">{message.sender_role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{message.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(message.category)}`}>
                      {message.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                      {message.priority === 'urgent' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {message.status === 'open' && <Clock className="h-3 w-3 mr-1" />}
                      {message.status === 'in_progress' && <Eye className="h-3 w-3 mr-1" />}
                      {message.status === 'closed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {message.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedMessage(message)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {message.status !== 'closed' && (
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Message Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      selectedMessage.sender_role === 'parent' ? 'bg-green-600' : 
                      selectedMessage.sender_role === 'teacher' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      <span className="text-white font-medium">
                        {selectedMessage.sender_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedMessage.sender_name}</div>
                      <div className="text-sm text-gray-500">{selectedMessage.sender_email}</div>
                      <div className="text-xs text-gray-400 capitalize">{selectedMessage.sender_role}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority === 'urgent' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {selectedMessage.priority}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedMessage.category)}`}>
                      {selectedMessage.category}
                    </span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900">{selectedMessage.subject}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>

              {/* Message Content */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Message:</h5>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Admin Reply */}
              {selectedMessage.admin_reply && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Admin Reply:</h5>
                  <p className="text-blue-800 whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
                  <p className="text-xs text-blue-600 mt-2">
                    Replied on {new Date(selectedMessage.updated_at).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Reply Form */}
              {selectedMessage.status !== 'closed' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Reply:</h5>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your reply here..."
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedMessage.status !== 'closed' && (
                <>
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'in_progress')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Mark In Progress
                  </button>
                  {replyText.trim() && (
                    <button
                      onClick={() => handleReply(selectedMessage.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Send Reply
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
