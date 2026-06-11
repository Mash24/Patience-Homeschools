import LegalPage from '@/components/ui/LegalPage'

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Terms governing use of the Nelimac Learning platform."
    >
      <p><strong>Last updated:</strong> June 2025</p>
      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using Nelimac Learning, you agree to these Terms of Service. If you do not
        agree, please do not use our platform.
      </p>
      <h2>Services</h2>
      <p>
        Nelimac Learning provides an education network connecting families with TSC-certified
        educators. We facilitate matching but do not employ teachers directly. Payment arrangements
        are made between families and educators.
      </p>
      <h2>User responsibilities</h2>
      <p>
        Users must provide accurate information, maintain account security, and use the platform
        lawfully. Teachers must hold valid TSC certification and comply with safeguarding requirements.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        Nelimac Learning is not liable for disputes between families and educators, or for outcomes
        of private tutoring arrangements beyond our matching service.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms:{' '}
        <a href="mailto:info@nelimaclearning.co.ke">info@nelimaclearning.co.ke</a>.
      </p>
    </LegalPage>
  )
}
