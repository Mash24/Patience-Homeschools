'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  Mail,
  Bell,
  Shield,
  Database,
  Users,
  Globe,
  Key,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { getSystemSettings, saveSystemSettings, type SystemSettings } from '@/lib/admin/settings-actions'

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    getSystemSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setSaveMessage('')
    
    try {
      await saveSystemSettings(settings)
      setSaveMessage('Settings saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch {
      setSaveMessage('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (section: keyof SystemSettings, key: string, value: unknown) => {
    setSettings((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }
    })
  }

  if (loading || !settings) {
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
          <h1 className="text-2xl font-bold text-ink">System Settings</h1>
          <p className="text-ink-muted">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-gold-500 text-white rounded-md text-sm font-medium hover:bg-gold-400 disabled:opacity-50 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-md flex items-center space-x-2 ${
          saveMessage.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {saveMessage.includes('successfully') ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Email Templates */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Mail className="h-6 w-6 text-gold-600" />
            <h3 className="text-lg font-semibold text-ink">Email Templates</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Approval Email</label>
              <textarea
                rows={3}
                value={settings.email_templates.approval}
                onChange={(e) => updateSetting('email_templates', 'approval', e.target.value)}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                placeholder="Enter approval email template..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Rejection Email</label>
              <textarea
                rows={3}
                value={settings.email_templates.rejection}
                onChange={(e) => updateSetting('email_templates', 'rejection', e.target.value)}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                placeholder="Enter rejection email template..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Assignment Email</label>
              <textarea
                rows={3}
                value={settings.email_templates.assignment}
                onChange={(e) => updateSetting('email_templates', 'assignment', e.target.value)}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                placeholder="Enter assignment email template..."
              />
            </div>
          </div>
        </div>

        {/* Auto Approval Rules */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-ink">Auto Approval Rules</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.auto_approval_rules.enabled}
                onChange={(e) => updateSetting('auto_approval_rules', 'enabled', e.target.checked)}
                className="h-4 w-4 text-gold-600 focus:ring-gold-500/30 border-ink/10 rounded"
              />
              <label className="text-sm font-medium text-ink">Enable automatic approval</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Minimum Experience (years)</label>
              <input
                type="number"
                value={settings.auto_approval_rules.min_experience}
                onChange={(e) => updateSetting('auto_approval_rules', 'min_experience', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Required Documents</label>
              <div className="space-y-2">
                {['degree', 'id', 'tsc', 'cv'].map((doc) => (
                  <div key={doc} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.auto_approval_rules.required_documents.includes(doc)}
                      onChange={(e) => {
                        const docs = settings.auto_approval_rules.required_documents
                        const newDocs = e.target.checked 
                          ? [...docs, doc]
                          : docs.filter(d => d !== doc)
                        updateSetting('auto_approval_rules', 'required_documents', newDocs)
                      }}
                      className="h-4 w-4 text-gold-600 focus:ring-gold-500/30 border-ink/10 rounded"
                    />
                    <label className="text-sm text-ink capitalize">{doc}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-ink">Notification Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notification_settings.email_enabled}
                onChange={(e) => updateSetting('notification_settings', 'email_enabled', e.target.checked)}
                className="h-4 w-4 text-gold-600 focus:ring-gold-500/30 border-ink/10 rounded"
              />
              <label className="text-sm font-medium text-ink">Enable email notifications</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notification_settings.in_app_enabled}
                onChange={(e) => updateSetting('notification_settings', 'in_app_enabled', e.target.checked)}
                className="h-4 w-4 text-gold-600 focus:ring-gold-500/30 border-ink/10 rounded"
              />
              <label className="text-sm font-medium text-ink">Enable in-app notifications</label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notification_settings.admin_alerts}
                onChange={(e) => updateSetting('notification_settings', 'admin_alerts', e.target.checked)}
                className="h-4 w-4 text-gold-600 focus:ring-gold-500/30 border-ink/10 rounded"
              />
              <label className="text-sm font-medium text-ink">Enable admin alerts</label>
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-ink">Platform Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Site Name</label>
              <input
                type="text"
                value={settings.platform_settings.site_name}
                onChange={(e) => updateSetting('platform_settings', 'site_name', e.target.value)}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Site URL</label>
              <input
                type="url"
                value={settings.platform_settings.site_url}
                onChange={(e) => updateSetting('platform_settings', 'site_url', e.target.value)}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Support Email</label>
              <input
                type="email"
                value={settings.platform_settings.support_email}
                onChange={(e) => updateSetting('platform_settings', 'support_email', e.target.value)}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Max File Size (MB)</label>
              <input
                type="number"
                value={settings.platform_settings.max_file_size}
                onChange={(e) => updateSetting('platform_settings', 'max_file_size', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-ink/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-ink-muted" />
            <h3 className="text-lg font-semibold text-ink">System Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-ivory p-4 rounded-lg">
              <div className="text-sm font-medium text-ink-muted">System Health</div>
              <div className="text-2xl font-bold text-green-600">98%</div>
            </div>
            <div className="bg-ivory p-4 rounded-lg">
              <div className="text-sm font-medium text-ink-muted">Active Users</div>
              <div className="text-2xl font-bold text-gold-600">1,234</div>
            </div>
            <div className="bg-ivory p-4 rounded-lg">
              <div className="text-sm font-medium text-ink-muted">Database Size</div>
              <div className="text-2xl font-bold text-purple-600">2.4 GB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
