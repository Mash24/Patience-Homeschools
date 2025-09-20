"use client";

import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex min-w-0 flex-col gap-3 sm:w-full sm:min-w-[28rem] sm:flex-row"
      aria-label="Subscribe to newsletter"
    >
      <label className="sr-only" htmlFor="newsletter-email">Your email</label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="Your email"
        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none ring-0 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-[#C9A227] px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-[#0E151B]"
      >
        Subscribe
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
}


