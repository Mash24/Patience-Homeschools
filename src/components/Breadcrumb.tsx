'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-ink-muted mb-4 sm:mb-6 overflow-x-auto">
      <Link 
        href="/teacher/dashboard" 
        className="flex items-center space-x-1 hover:text-ink transition-colors flex-shrink-0 touch-manipulation"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Dashboard</span>
        <span className="sm:hidden">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-ink-muted/60" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-ink transition-colors touch-manipulation truncate max-w-24 sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-medium truncate max-w-24 sm:max-w-none">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
