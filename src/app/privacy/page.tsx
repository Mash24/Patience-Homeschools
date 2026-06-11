import LegalPage from '@/components/ui/LegalPage'

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How Nelimac Learning collects, uses, and protects your information."
    >
      <p><strong>Last updated:</strong> June 2025</p>
      <h2>Information we collect</h2>
      <p>
        We collect information you provide when registering, applying as a teacher, requesting a tutor,
        or contacting us — including name, email, phone number, and child learning requirements.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your data to match families with educators, process applications, communicate about
        your account, and improve our services. We do not sell personal data to third parties.
      </p>
      <h2>Data security</h2>
      <p>
        We use industry-standard security measures including encrypted connections and secure
        authentication. Access to personal data is restricted to authorised personnel.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by contacting{' '}
        <a href="mailto:info@nelimaclearning.co.ke">info@nelimaclearning.co.ke</a>.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy enquiries, email{' '}
        <a href="mailto:info@nelimaclearning.co.ke">info@nelimaclearning.co.ke</a>.
      </p>
    </LegalPage>
  )
}
