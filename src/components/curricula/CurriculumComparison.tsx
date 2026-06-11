'use client'

import SectionHeading from '@/components/ui/SectionHeading'
import { CheckCircle } from 'lucide-react'

const features = [
  'International Recognition',
  'Assessment Method',
  'Subject Flexibility',
  'Digital Integration',
  'University Preparation',
  'Local Context',
]

const data: Record<string, [string, string, string]> = {
  'International Recognition': ['National', 'Global', 'Global'],
  'Assessment Method': ['Competency-based', 'Examination-based', 'Continuous + Exams'],
  'Subject Flexibility': ['Structured', 'High', 'Moderate'],
  'Digital Integration': ['High', 'Moderate', 'Moderate'],
  'University Preparation': ['Good', 'Excellent', 'Excellent'],
  'Local Context': ['High', 'Moderate', 'Low'],
}

export default function CurriculumComparison() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Compare"
          title="Find the right fit"
          description="A side-by-side look at our three most popular programmes."
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="text-left py-4 pr-4 text-sm font-semibold text-ink-muted">Feature</th>
                {['CBC', 'IGCSE', 'British'].map((col) => (
                  <th key={col} className="text-center py-4 px-4 font-serif text-lg font-semibold text-ink">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature} className="border-b border-ink/5">
                  <td className="py-4 pr-4 text-sm text-ink-muted">{feature}</td>
                  {data[feature].map((value, i) => (
                    <td key={i} className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                        <CheckCircle className="h-4 w-4 text-sage-500" />
                        {value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'CBC', best: 'Local universities, holistic development' },
            { name: 'IGCSE', best: 'International universities, global mobility' },
            { name: 'British', best: 'UK universities, traditional rigour' },
          ].map((item) => (
            <div key={item.name} className="card-elevated p-6 text-center">
              <p className="font-serif text-xl font-semibold text-ink mb-2">{item.name}</p>
              <p className="text-xs text-ink-muted">Best for: {item.best}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
