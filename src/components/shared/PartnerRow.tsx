'use client'

const partners = [
  'TSC Certified',
  'CBC Programme',
  'Cambridge IGCSE',
  'British Curriculum',
  'Montessori',
  'IB Programme',
]

export default function PartnerRow() {
  return (
    <section className="py-8 border-y border-ink/5 bg-white">
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((name) => (
            <span
              key={name}
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-ink-muted/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
