'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Send,
  Search,
  Filter,
  Trash2,
  Archive
} from 'lucide-react'

interface Notification {
  id: string
  recipient_id: string
  recipient_name: string
  recipient_email: string
  recipient_role: 'parent' | 'teacher' | 'admin'
  title: string
  body: string
  type: 'approval' | 'rejection' | 'assignment' | 'message' | 'system'
  status: 'unread' | 'read' | 'sent' | 'failed'
  sent_at?: string
  read_at?: string
  created_at: string
}

export default function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  useEffect(() => {
    // Simulate API call - replace with actual Supabase queries
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          recipient_id: 'teacher_1',
          recipient_name: 'John Doe',
          recipient_email: 'john.doe@email.com',
          recipient_role: 'teacher',
          title: 'Application Approved',
          body: 'Congratulations! Your teacher application has been approved. You can now access your full dashboard and start receiving assignments.',
          type: 'approval',
          status: 'sent',
          sent_at: '2024-01-15T10:30:00Z',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          recipient_id: 'parent_1',
          recipient_name: 'Sarah Johnson',
          recipient_email: 'sarah.johnson@email.com',
          recipient_role: 'parent',
          title: 'Teacher Assigned',
          body: 'Great news! We have assigned teacher John Doe to work with your child Emma. You can now coordinate schedules and begin lessons.',
          type: 'assignment',
          status: 'sent',
          sent_at: '2024-01-14T14:20:00Z',
          created_at: '2024-01-14T14:20:00Z'
        },
        {
          id: '3',
          recipient_id: 'teacher_2',
          recipient_name: 'Jane Smith',
          recipient_email: 'jane.smith@email.com',
          recipient_role: 'teacher',
          title: 'Application Rejected',
          body: 'Thank you for your interest in joining our platform. Unfortunately, we cannot approve your application at this time. Please feel free to reapply in the future.',
          type: 'rejection',
          status: 'sent',
          sent_at: '2024-01-13T09:15:00Z',
          created_at: '2024-01-13T09:15:00Z'
        },
        {
          id: '4',
          recipient_id: 'parent_2',
          recipient_name: 'Michael Kimani',
          recipient_email: 'michael.kimani@email.com',
          recipient_role: 'parent',
          title: 'System Maintenance',
          body: 'We will be performing scheduled maintenance on our platform from 2 AM to 4 AM tomorrow. Some features may be temporarily unavailable.',
          type: 'system',
          status: 'sent',
          sent_at: '2024-01-12T16:45:00Z',
          created_at: '2024-01-12T16:45:00Z'
        },
        {
          id: '5',
          recipient_id: 'teacher_3',
          recipient_name: 'Mike Wilson',
          recipient_email: 'mike.wilson@email.com',
          recipient_role: 'teacher',
          title: 'New Message Received',
          body: 'You have received a new message from parent Grace Wanjiku regarding your assignment.',
          type: 'message',
          status: 'failed',
          created_at: '2024-01-11T11:30:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus
    const matchesType = selectedType === 'all' || notification.type === selectedType
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.body.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'approval': return 'bg-green-100 text-green-800'
      case 'rejection': return 'bg-red-100 text-red-800'
      case 'assignment': return 'bg-blue-100 text-blue-800'
      case 'message': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return Clock
      case 'read': return CheckCircle
      case 'sent': return Send
      case 'failed': return XCircle
      default: return Clock
    }
  }

  const handleResend = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: 'sent' as const, sent_at: new Date().toISOString() }
        : notification
    ))
    // TODO: Actually resend the notification
  }

  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p className="text-gray-600">Manage system notifications and communications</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
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
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="approval">Approval</option>
            <option value="rejection">Rejection</option>
            <option value="assignment">Assignment</option>
            <option value="message">Message</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: notifications.length, color: 'bg-gray-500' },
          { label: 'Sent', count: notifications.filter(n => n.status === 'sent').length, color: 'bg-blue-500' },
          { label: 'Failed', count: notifications.filter(n => n.status === 'failed').length, color: 'bg-red-500' },
          { label: 'Unread', count: notifications.filter(n => n.status === 'unread').length, color: 'bg-yellow-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const StatusIcon = getStatusIcon(notification.status)
                return (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          notification.recipient_role === 'parent' ? 'bg-green-600' : 
                          notification.recipient_role === 'teacher' ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                          <span className="text-white text-xs font-medium">
                            {notification.recipient_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{notification.recipient_name}</div>
                          <div className="text-sm text-gray-500">{notification.recipient_email}</div>
                          <div className="text-xs text-gray-400 capitalize">{notification.recipient_role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{notification.body}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {notification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.sent_at ? new Date(notification.sent_at).toLocaleDateString() : 'Not sent'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedNotification(notification)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {notification.status === 'failed' && (
                          <button
                            onClick={() => handleResend(notification.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Notification Details</h3>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recipient</label>
                  <p className="text-sm text-gray-900">{selectedNotification.recipient_name}</p>
                  <p className="text-sm text-gray-500">{selectedNotification.recipient_email}</p>
                  <p className="text-xs text-gray-400 capitalize">{selectedNotification.recipient_role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type & Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedNotification.type)}`}>
                      {selectedNotification.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedNotification.status)}`}>
                      {selectedNotification.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm text-gray-900">{selectedNotification.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedNotification.body}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900">{new Date(selectedNotification.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sent</label>
                  <p className="text-sm text-gray-900">
                    {selectedNotification.sent_at ? new Date(selectedNotification.sent_at).toLocaleString() : 'Not sent'}
                  </p>
                </div>
              </div>
              
              {selectedNotification.read_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Read</label>
                  <p className="text-sm text-gray-900">{new Date(selectedNotification.read_at).toLocaleString()}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedNotification.status === 'failed' && (
                <button
                  onClick={() => {
                    handleResend(selectedNotification.id)
                    setSelectedNotification(null)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Resend
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
