import PageHero from '@/components/ui/PageHero'

interface LegalPageProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-ivory">
      <PageHero eyebrow="Legal" title={title} description={description} />
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl prose prose-sm prose-headings:font-serif prose-headings:text-ink prose-p:text-ink-muted">
          {children}
        </div>
      </section>
    </div>
  )
}
