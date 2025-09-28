'use client'

import DashboardLayout from '@/components/DashboardLayout'
import { motion } from 'framer-motion'
import { UserCheck, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react'

export default function AdminDashboardPage() {
    return (
    <DashboardLayout role="admin">
      {/* Admin-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Applications */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pending Applications</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </button>
      </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Mathematics, Science • 5 years experience</p>
              </div>
            </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Reject
                </button>
            </div>
          </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                  <p className="font-medium text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-500">English, Literature • 3 years experience</p>
              </div>
            </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All →
            </button>
            </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Payment Processing Delay</p>
                <p className="text-sm text-yellow-700">Some payments are taking longer than usual to process</p>
                <p className="text-xs text-yellow-600 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">High Application Volume</p>
                <p className="text-sm text-blue-700">12 new applications received today</p>
                <p className="text-xs text-blue-600 mt-1">4 hours ago</p>
            </div>
          </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <ClipboardList className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">System Update Complete</p>
                <p className="text-sm text-green-700">All systems are running on the latest version</p>
                <p className="text-xs text-green-600 mt-1">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
      </div>
    </DashboardLayout>
  )
}