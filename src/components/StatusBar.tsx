'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface StatusBarProps {
  version?: string
  showSupport?: boolean
}

export default function StatusBar({ version = 'v1.0.0', showSupport = true }: StatusBarProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Update last sync time periodically
    const syncInterval = setInterval(() => {
      setLastSync(new Date())
    }, 30000) // Update every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(syncInterval)
    }
  }, [])

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-3 w-3 text-red-500" />
    }
    return <Wifi className="h-3 w-3 text-green-500" />
  }

  const getStatusText = () => {
    if (!isOnline) {
      return 'Offline'
    }
    return 'All systems operational'
  }

  const getStatusColor = () => {
    if (!isOnline) {
      return 'text-red-600'
    }
    return 'text-green-600'
  }

  const formatLastSync = () => {
    const now = new Date()
    const diff = now.getTime() - lastSync.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) {
      return 'Just now'
    } else if (minutes < 60) {
      return `${minutes}m ago`
    } else {
      const hours = Math.floor(minutes / 60)
      return `${hours}h ago`
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-3 sm:px-4 py-2 text-xs text-gray-500 z-[60] shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left side - Version and Status */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          {/* Version */}
          <span className="font-medium text-gray-700 text-xs sm:text-sm">{version}</span>
          
          {/* Separator */}
          <span className="text-gray-300 hidden sm:inline">•</span>

          {/* Connection Status */}
          <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
            {getStatusIcon()}
            <span className={`font-medium text-xs sm:text-sm ${getStatusColor()} hidden sm:inline`}>
              {getStatusText()}
            </span>
            <span className={`font-medium text-xs ${getStatusColor()} sm:hidden`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Right side - Sync and Support */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Last Sync */}
          <span className="text-gray-500 text-xs sm:text-sm">
            <span className="hidden sm:inline">Last sync: </span>{formatLastSync()}
          </span>
          
          {/* Support Button */}
          {showSupport && (
            <>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <button className="hover:text-gray-700 transition-colors font-medium text-xs sm:text-sm touch-manipulation">
                <span className="hidden sm:inline">💬 Support</span>
                <span className="sm:hidden">💬</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
