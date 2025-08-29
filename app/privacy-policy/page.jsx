'use client';

export default function PrivacyPolicy() {
  return (
    <section className="max-w-3xl mx-auto p-6 text-white leading-7">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        <strong>Effective Date:</strong> 03/01/25 <br />
        <strong>Last Updated:</strong> 03/01/25
      </p>

      <p className="mb-6">
        At <strong>Visionary Advance</strong>, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, share, and safeguard your data in compliance with <strong>GDPR</strong> and <strong>CCPA</strong>.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Personal Information:</strong> Name, email, phone number, etc.</li>
        <li><strong>Usage Data:</strong> Pages visited, time spent, clicks.</li>
        <li><strong>Cookies & Tracking:</strong> Used for analytics and improving your experience.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Provide and improve our services</li>
        <li>Respond to customer inquiries</li>
        <li>Send marketing communications (if opted-in)</li>
        <li>Comply with legal obligations</li>
      </ul>

      <p className="mb-6"><strong>Note:</strong> We do <span className="font-semibold">not sell</span> your personal information.</p>

      <h2 className="text-2xl font-semibold mb-4">Your Rights Under GDPR (EU Residents)</h2>
      <p className="mb-4">If you are located in the EEA, you have the right to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Access, correct, or delete your data</li>
        <li>Object to or restrict processing</li>
        <li>Request data portability</li>
        <li>Withdraw consent anytime</li>
      </ul>
      <p className="mb-6">To exercise your rights, email us at <a href="mailto:info@visionaryadvance.com" className="text-[#008070] underline">info@visionaryadvance.com</a>.</p>

      <h2 className="text-2xl font-semibold mb-4">Your Rights Under CCPA (California Residents)</h2>
      <p className="mb-4">California residents have the right to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Know what personal information we collect and use</li>
        <li>Request access or deletion of your information</li>
        <li>Opt-out of data sales (we do <span className="font-semibold">not</span> sell data)</li>
      </ul>
      <p className="mb-6">Submit a request at <a href="mailto:info@visionaryadvance.com" className="text-[#008070] underline">info@visionaryadvance.com</a>. Identity verification is required.</p>

      <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
      <p className="mb-6">We implement industry-standard measures to protect your data, but no method is 100% secure.</p>

      <h2 className="text-2xl font-semibold mb-4">Third-Party Services & Links</h2>
      <p className="mb-6">We may link to third-party sites or use services like analytics or payment processors. Their privacy policies apply separately.</p>

      <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
      <p className="mb-6">We retain personal data only as long as necessary to provide services, comply with laws, or resolve disputes.</p>

      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p className="mb-2">For any privacy concerns or requests, contact us at:</p>
      <p>Email: <a href="mailto:info@visionaryadvance.com" className="text-[#008070] underline">info@visionaryadvance.com</a></p>
      <p>Website: <a href="www.visionaryadvance.com" className="text-[#008070] underline">Visionary Advance</a></p>
    </section>
  );
}
