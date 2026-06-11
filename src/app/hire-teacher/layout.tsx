import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find a Private Tutor in Nairobi | Nelimac Learning',
  description: 'Concierge tutor matching for Nairobi families. TSC-certified teachers for CBC, IGCSE, and British curriculum — matched to your child\'s needs.',
  openGraph: {
    title: 'Find a Private Tutor in Nairobi | Nelimac Learning',
    description: 'Concierge tutor matching with TSC-certified educators for discerning Nairobi families.',
  },
}

export default function HireTeacherLayout({ children }: { children: React.ReactNode }) {
  return children
}
