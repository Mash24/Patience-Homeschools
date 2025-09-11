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
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-1 sm:gap-2 rounded-full bg-green-500 px-3 sm:px-4 py-2 sm:py-3 text-white shadow-lg transition hover:scale-[1.02] text-xs sm:text-sm"
      aria-label="WhatsApp Concierge"
    >
      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="hidden xs:inline">Concierge</span>
    </a>
  )
}

