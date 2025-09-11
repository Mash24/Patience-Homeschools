'use client'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppConcierge() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+254700000000'
  const href = `https://wa.me/${phone.replace(/\D/g,'')}`
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-white shadow-lg transition hover:scale-[1.02]"
      aria-label="WhatsApp Concierge"
    >
      <MessageCircle className="h-5 w-5" />
      Concierge
    </a>
  )
}

