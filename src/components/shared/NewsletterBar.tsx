'use client'
import { useState } from 'react'

export default function NewsletterBar() {
  const [email, setEmail] = useState('')
  
  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="text-white text-lg font-medium">Stay informed</h4>
          <p className="text-white/70 text-sm">Insights on elite homeschooling in Nairobi.</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); /* wire to your provider */ }}
          className="flex w-full max-w-md gap-2"
        >
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg px-4 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <button 
            type="submit"
            className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90 px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}

