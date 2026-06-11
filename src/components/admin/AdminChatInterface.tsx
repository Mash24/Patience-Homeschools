'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: Date
  sessionId: string
}

interface ChatSession {
  id: string
  userInfo: {
    name?: string
    email?: string
    phone?: string
    location?: string
  }
  messages: ChatMessage[]
  status: 'active' | 'resolved' | 'pending'
  escalatedAt: Date
  lastActivity: Date
}

// Mock data - in real implementation, this would come from your database
const mockSessions: ChatSession[] = [
  {
    id: 'session_1',
    userInfo: {
      name: 'Sarah Kimani',
      email: 'sarah.kimani@email.com',
      phone: '+254712345678',
      location: 'Karen'
    },
    messages: [
      {
        id: 'msg_1',
        text: 'I need help finding a math teacher for my daughter in Grade 6',
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000),
        sessionId: 'session_1'
      },
      {
        id: 'msg_2',
        text: 'The AI assistant couldn\'t help with my specific requirements',
        sender: 'user',
        timestamp: new Date(Date.now() - 3500000),
        sessionId: 'session_1'
      }
    ],
    status: 'pending',
    escalatedAt: new Date(Date.now() - 3600000),
    lastActivity: new Date(Date.now() - 3500000)
  },
  {
    id: 'session_2',
    userInfo: {
      name: 'David Mwangi',
      email: 'david.mwangi@email.com',
      phone: '+254723456789',
      location: 'Westlands'
    },
    messages: [
      {
        id: 'msg_3',
        text: 'I\'m not satisfied with the teacher matching process',
        sender: 'user',
        timestamp: new Date(Date.now() - 1800000),
        sessionId: 'session_2'
      }
    ],
    status: 'active',
    escalatedAt: new Date(Date.now() - 1800000),
    lastActivity: new Date(Date.now() - 1800000)
  }
]

export default function AdminChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions)
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'resolved'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.status === filter
    const matchesSearch = searchTerm === '' || 
      session.userInfo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.userInfo.phone?.includes(searchTerm)
    
    return matchesFilter && matchesSearch
  })

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      sessionId: selectedSession.id
    }

    setSessions(prev => prev.map(session => 
      session.id === selectedSession.id 
        ? {
            ...session,
            messages: [...session.messages, message],
            lastActivity: new Date(),
            status: 'active'
          }
        : session
    ))

    setSelectedSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastActivity: new Date(),
      status: 'active'
    } : null)

    setNewMessage('')
  }

  const resolveSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'resolved' as const }
        : session
    ))

    if (selectedSession?.id === sessionId) {
      setSelectedSession(prev => prev ? { ...prev, status: 'resolved' } : null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'active':
        return 'bg-gold-50 text-gold-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-ivory-dark text-ink'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'active':
        return <MessageCircle className="h-3 w-3" />
      case 'resolved':
        return <CheckCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="h-screen bg-ivory flex">
      {/* Sidebar - Chat Sessions */}
      <div className="w-1/3 bg-white border-r border-ink/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-ink/10">
          <h2 className="text-xl font-bold text-ink mb-4">Admin Chat</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-muted/60" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-ink/10 rounded-lg focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            {(['all', 'pending', 'active', 'resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === status
                    ? 'bg-gold-500 text-white'
                    : 'bg-ivory-dark text-ink-muted hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className={`p-4 border-b border-ink/5 cursor-pointer hover:bg-ivory transition-colors ${
                selectedSession?.id === session.id ? 'bg-gold-50 border-gold-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-ink">{session.userInfo.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                  {getStatusIcon(session.status)}
                  <span>{session.status}</span>
                </span>
              </div>
              
              <p className="text-sm text-ink-muted mb-2">{session.userInfo.email}</p>
              <p className="text-xs text-ink-muted">{session.userInfo.phone}</p>
              
              <div className="mt-2">
                <p className="text-xs text-ink-muted">
                  Last activity: {session.lastActivity.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-ink/10 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{selectedSession.userInfo.name}</h3>
                  <p className="text-sm text-ink-muted">{selectedSession.userInfo.email} • {selectedSession.userInfo.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedSession.status)}`}>
                    {getStatusIcon(selectedSession.status)}
                    <span>{selectedSession.status}</span>
                  </span>
                  {selectedSession.status !== 'resolved' && (
                    <button
                      onClick={() => resolveSession(selectedSession.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {selectedSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-gold-500 text-white'
                        : 'bg-ivory-dark text-ink'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        message.sender === 'admin' ? 'bg-gold-500' : 'bg-gray-200'
                      }`}>
                        {message.sender === 'admin' ? (
                          <User className="h-2 w-2 text-white" />
                        ) : (
                          <User className="h-2 w-2 text-ink-muted" />
                        )}
                      </div>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            {selectedSession.status !== 'resolved' && (
              <div className="p-4 border-t border-ink/10 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your response..."
                    className="flex-1 border border-ink/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gold-500 text-white p-2 rounded-lg hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">Select a conversation</h3>
              <p className="text-ink-muted">Choose a chat session from the sidebar to start responding</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
