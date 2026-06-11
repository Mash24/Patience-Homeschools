'use server'

import { supabaseServer } from '@/lib/supabaseServer'
import { sendMessageDigestEmail } from '@/lib/email'

export async function processMessageDigestQueue() {
  const { data: pending, error } = await supabaseServer
    .from('message_digest_queue')
    .select('id, recipient_id, subject, preview, created_at')
    .is('sent_at', null)
    .order('created_at', { ascending: true })
    .limit(500)

  if (error) throw new Error(error.message)
  if (!pending?.length) return { sent: 0 }

  const byRecipient = new Map<string, typeof pending>()
  for (const row of pending) {
    const list = byRecipient.get(row.recipient_id) || []
    list.push(row)
    byRecipient.set(row.recipient_id, list)
  }

  let sent = 0
  const now = new Date().toISOString()

  for (const [recipientId, rows] of byRecipient) {
    const { data: authUser } = await supabaseServer.auth.admin.getUserById(recipientId)
    const email = authUser?.user?.email
    if (!email) continue

    const { data: profile } = await supabaseServer
      .from('profiles')
      .select('full_name')
      .eq('id', recipientId)
      .maybeSingle()

    const result = await sendMessageDigestEmail({
      to: email,
      recipientName: profile?.full_name || 'there',
      messages: rows.map((r) => ({
        subject: r.subject || 'Message',
        preview: r.preview || '',
        at: r.created_at,
      })),
    })

    if (result.success) {
      const ids = rows.map((r) => r.id)
      await supabaseServer
        .from('message_digest_queue')
        .update({ sent_at: now })
        .in('id', ids)
      sent += 1
    }
  }

  return { sent }
}
