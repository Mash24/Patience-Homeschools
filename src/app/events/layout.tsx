import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learning Events & Workshops | Nelimac Learning',
  description: 'Workshops, lab sessions, and community learning events for Nairobi families. Register for upcoming Nelimac events.',
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
