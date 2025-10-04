'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Phone, 
  ChevronUp,
  ChevronDown,
  Sparkles,
  HeadphonesIcon
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot' | 'admin'
  timestamp: Date
  isEscalated?: boolean
}

interface ChatSession {
  id: string
  messages: Message[]
  isEscalated: boolean
}

const FAQ_RESPONSES = {
  'pricing': {
    text: "Our teacher matching service is free! Teachers set their own rates, typically ranging from KES 1,500-3,000 per hour depending on subject and experience. We'll provide transparent pricing when we match you with teachers.",
    keywords: ['price', 'cost', 'fee', 'rate', 'expensive', 'cheap', 'pricing']
  },
  'timeline': {
    text: "We typically provide teacher recommendations within 24 hours of receiving your request. Our admin team personally reviews each match to ensure quality and compatibility.",
    keywords: ['time', 'when', 'how long', 'timeline', 'schedule', 'quick', 'fast']
  },
  'subjects': {
    text: "We cover all subjects including Mathematics, English, Sciences, Languages (French, German), Computer Studies, Art, and more. We support CBC, IGCSE, and British curricula.",
    keywords: ['subject', 'math', 'english', 'science', 'curriculum', 'cbc', 'igcse', 'british']
  },
  'locations': {
    text: "We serve all areas in Nairobi including Westlands, Karen, Runda, Kilimani, Lavington, Parklands, and surrounding areas. Both in-home and online teaching options are available.",
    keywords: ['location', 'area', 'nairobi', 'westlands', 'karen', 'online', 'home']
  },
  'process': {
    text: "Simply fill out our teacher request form with your child's needs, and our admin team will match you with 3 suitable teachers within 24 hours. You can then review profiles and choose your preferred teacher.",
    keywords: ['process', 'how', 'work', 'step', 'form', 'request', 'match']
  },
  'guarantee': {
    text: "We offer a 100% satisfaction guarantee. If you're not happy with your teacher match, we'll find a replacement at no extra cost. All our teachers are TSC certified and background checked.",
    keywords: ['guarantee', 'satisfaction', 'quality', 'certified', 'safe', 'replacement']
  }
}

const ESCALATION_TRIGGERS = [
  'complaint', 'problem', 'issue', 'not working', 'bad', 'terrible', 'angry', 'frustrated',
  'refund', 'money back', 'cancel', 'stop', 'wrong', 'mistake', 'error'
]

export default function WhatsAppConcierge() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatSession, setChatSession] = useState<ChatSession>({
    id: `chat_${Date.now()}`,
    messages: [
      {
        id: 'welcome',
        text: "Hi! I'm here to help you find the perfect teacher for your child. What would you like to know?",
        sender: 'bot',
        timestamp: new Date()
      }
    ],
    isEscalated: false
  })
  const [isTyping, setIsTyping] = useState(false)
  const [showEscalation, setShowEscalation] = useState(false)

  const phone = '+254742909506'
  const whatsappHref = `https://wa.me/${phone.replace(/\D/g,'')}?text=Hi%20Nelimac%20Team,%20I%20need%20help%20finding%20a%20teacher%20for%20my%20child.`

  const detectIntent = (message: string): string | null => {
    const lowerMessage = message.toLowerCase()
    
    for (const [intent, data] of Object.entries(FAQ_RESPONSES)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent
      }
    }
    
    return null
  }

  const shouldEscalate = (message: string): boolean => {
    const lowerMessage = message.toLowerCase()
    return ESCALATION_TRIGGERS.some(trigger => lowerMessage.includes(trigger))
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setChatSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))

    setCurrentMessage('')
    setIsTyping(true)

    // Simulate bot thinking time
    await new Promise(resolve => setTimeout(resolve, 1000))

    let botResponse: Message

    if (shouldEscalate(currentMessage)) {
      botResponse = {
        id: `msg_${Date.now() + 1}`,
        text: "I understand you're having an issue. Let me connect you with our admin team who can provide personalized assistance.",
        sender: 'bot',
        timestamp: new Date(),
        isEscalated: true
      }
      
      setChatSession(prev => ({
        ...prev,
        isEscalated: true
      }))
      setShowEscalation(true)
    } else {
      const intent = detectIntent(currentMessage)
      
      if (intent) {
        botResponse = {
          id: `msg_${Date.now() + 1}`,
          text: FAQ_RESPONSES[intent as keyof typeof FAQ_RESPONSES].text,
          sender: 'bot',
          timestamp: new Date()
        }
      } else {
        botResponse = {
          id: `msg_${Date.now() + 1}`,
          text: "I can help with questions about pricing, timelines, subjects, locations, our process, or guarantees. Could you be more specific about what you'd like to know?",
          sender: 'bot',
          timestamp: new Date()
        }
      }
    }

    setChatSession(prev => ({
      ...prev,
      messages: [...prev.messages, botResponse]
    }))

    setIsTyping(false)
  }

  const escalateToAdmin = () => {
    const adminMessage: Message = {
      id: `msg_${Date.now()}`,
      text: "You've been connected with our admin team. They will respond shortly.",
      sender: 'admin',
      timestamp: new Date()
    }

    setChatSession(prev => ({
      ...prev,
      messages: [...prev.messages, adminMessage]
    }))

    setShowEscalation(false)
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi Nelimac Team! I need help with: ${chatSession.messages
        .filter(m => m.sender === 'user')
        .slice(-3)
        .map(m => m.text)
        .join(', ')}`
    )
    
    window.open(`https://wa.me/${phone.replace(/\D/g,'')}?text=${message}`, '_blank')
  }

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'user':
        return <User className="h-3 w-3" />
      case 'bot':
        return <Bot className="h-3 w-3" />
      case 'admin':
        return <HeadphonesIcon className="h-3 w-3" />
      default:
        return <MessageCircle className="h-3 w-3" />
    }
  }

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'bg-blue-500'
      case 'bot':
        return 'bg-green-500'
      case 'admin':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  return (
    <>
      {/* Main Floating Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Quick Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mb-3 space-y-2"
            >
              {/* AI Chat Option */}
              <motion.button
                onClick={() => {
                  setIsChatOpen(true)
                  setIsExpanded(false)
                }}
                className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="h-4 w-4 text-green-500" />
                <span>AI Assistant</span>
                <Sparkles className="h-3 w-3 text-yellow-500" />
              </motion.button>

              {/* Direct WhatsApp Option */}
              <motion.a
                href={whatsappHref}
      target="_blank"
      rel="noreferrer"
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-4 w-4" />
                <span>WhatsApp Direct</span>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg transition hover:scale-[1.02] text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-5 w-5" />
      <span className="hidden xs:inline">Concierge</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronUp className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-4 sm:bottom-32 sm:right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Nelimac AI Assistant</h3>
                  <p className="text-xs opacity-90">
                    {chatSession.isEscalated ? 'Admin Connected' : 'Smart Support'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 h-64">
              {chatSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white'
                        : message.sender === 'admin'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-4 h-4 rounded-full ${getSenderColor(message.sender)} text-white flex items-center justify-center`}>
                        {getSenderIcon(message.sender)}
                      </div>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Escalation Modal */}
            {showEscalation && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <HeadphonesIcon className="h-6 w-6 text-purple-500" />
                    <h3 className="font-semibold text-gray-900">Connect to Admin?</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Our admin team can provide personalized assistance for your specific needs.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={escalateToAdmin}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Yes, Connect Me
                    </button>
                    <button
                      onClick={() => setShowEscalation(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              {chatSession.isEscalated ? (
                <div className="text-center">
                  <button
                    onClick={openWhatsApp}
                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Continue on WhatsApp</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Admin will respond via WhatsApp
                  </p>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim()}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

