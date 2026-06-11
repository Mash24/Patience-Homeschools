import LegalPage from '@/components/ui/LegalPage'

export default function SafeguardingPage() {
  return (
    <LegalPage
      title="Safeguarding & Vetting"
      description="Our commitment to child safety and educator vetting."
    >
      <h2>Our commitment</h2>
      <p>
        Nelimac Learning is committed to the safety and wellbeing of every child on our platform.
        All educators undergo rigorous vetting before joining our network.
      </p>
      <h2>Teacher vetting</h2>
      <ul>
        <li>TSC certification verification</li>
        <li>Background and reference checks</li>
        <li>Identity and qualification document review</li>
        <li>Ongoing performance monitoring via parent feedback</li>
      </ul>
      <h2>Reporting concerns</h2>
      <p>
        If you have a safeguarding concern, contact us immediately at{' '}
        <a href="mailto:safeguarding@nelimaclearning.co.ke">safeguarding@nelimaclearning.co.ke</a>{' '}
        or call our support line. All reports are treated seriously and confidentially.
      </p>
      <h2>In-home sessions</h2>
      <p>
        We recommend that a parent or guardian be present during in-home tutoring sessions,
        especially for younger children. Online sessions should use secure, child-appropriate platforms.
      </p>
    </LegalPage>
  )
}
