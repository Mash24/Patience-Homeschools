'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { Calendar, Users, BookOpen, Clock } from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout role="teacher">
      {/* Teacher-specific content */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All →
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mathematics - Grade 8</p>
                <p className="text-sm text-gray-500">John Doe</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Tomorrow, 2:00 PM</p>
              <p className="text-sm text-gray-500">1 hour</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Join
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Science - Grade 6</p>
                <p className="text-sm text-gray-500">Sarah Johnson</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Friday, 10:00 AM</p>
              <p className="text-sm text-gray-500">1.5 hours</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}