import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Your Tutor Request | Nelimac Learning',
  description: 'Check the status of your hire-a-teacher request with Nelimac Learning.',
  robots: { index: false },
}

export default function MyRequestLayout({ children }: { children: React.ReactNode }) {
  return children
}
