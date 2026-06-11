'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  light?: boolean
}

export default function FAQAccordion({ items, light = false }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.question}
            className={`rounded-2xl border overflow-hidden transition-colors ${
              light
                ? 'border-white/10 bg-white/5'
                : 'border-ink/5 bg-white'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
              aria-expanded={isOpen}
            >
              <span className={`font-medium text-sm sm:text-base ${light ? 'text-white' : 'text-ink'}`}>
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                } ${light ? 'text-gold-400' : 'text-gold-600'}`}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className={`px-5 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed ${
                    light ? 'text-white/60' : 'text-ink-muted'
                  }`}>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
