'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export interface SystemSettings {
  email_templates: {
    approval: string
    rejection: string
    assignment: string
  }
  auto_approval_rules: {
    enabled: boolean
    min_experience: number
    required_documents: string[]
  }
  notification_settings: {
    email_enabled: boolean
    in_app_enabled: boolean
    admin_alerts: boolean
  }
  platform_settings: {
    site_name: string
    site_url: string
    support_email: string
    max_file_size: number
  }
}

const DEFAULT_SETTINGS: SystemSettings = {
  email_templates: {
    approval: 'Your teacher application has been approved!',
    rejection: 'Your teacher application was not approved.',
    assignment: 'You have been assigned a new student.',
  },
  auto_approval_rules: {
    enabled: false,
    min_experience: 2,
    required_documents: ['degree', 'id'],
  },
  notification_settings: {
    email_enabled: true,
    in_app_enabled: true,
    admin_alerts: true,
  },
  platform_settings: {
    site_name: 'Nelimac Learning',
    site_url: 'https://nelimaclearning.co.ke',
    support_email: 'support@nelimaclearning.co.ke',
    max_file_size: 10,
  },
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
  if (role !== 'admin') throw new Error('Unauthorized')

  return supabase
}

export async function getSystemSettings(): Promise<SystemSettings> {
  const supabase = await requireAdmin()

  const { data, error } = await supabase
    .from('platform_settings')
    .select('settings')
    .eq('id', 'default')
    .maybeSingle()

  if (error || !data?.settings) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...(data.settings as SystemSettings) }
}

export async function saveSystemSettings(settings: SystemSettings) {
  const supabase = await requireAdmin()

  const { error } = await supabase
    .from('platform_settings')
    .upsert({
      id: 'default',
      settings,
      updated_at: new Date().toISOString(),
    })

  if (error) throw new Error(error.message)

  await supabase.from('admin_actions').insert({
    admin_id: (await supabase.auth.getUser()).data.user?.id,
    entity_type: 'system',
    action: 'update_settings',
  })

  revalidatePath('/admin/settings')
  return { success: true }
}
