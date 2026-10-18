export default function DataDeletion() {
  return (
    <section className="max-w-3xl mx-auto mt-26 p-6 text-white leading-7">
      <h1 className="text-3xl font-bold mb-6">Data Deletion Instructions</h1>

      <p className="mb-6">
        If you connected a Facebook Page or Instagram account to <strong>Visionary Advance</strong>, you can remove our access and have your data deleted at any time. See our{' '}
        <a href="/privacy-policy" className="text-[#008070] underline">Privacy Policy</a> for what we store and how we use it.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Remove our access</h2>
      <p className="mb-4">This stops us from reading your posts right away.</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          <strong>Facebook:</strong> go to Settings &amp; privacy &rarr; Settings &rarr; Business integrations, find <strong>Visionary Advance Auth</strong>, and click Remove.
        </li>
        <li>
          <strong>Instagram:</strong> go to Settings &rarr; Website permissions &rarr; Apps and websites, find <strong>Visionary Advance Auth</strong>, and click Remove.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">2. Ask us to delete your data</h2>
      <p className="mb-4">
        Email <a href="mailto:info@visionaryadvance.com?subject=Facebook%20data%20deletion%20request" className="text-[#008070] underline">info@visionaryadvance.com</a> with the subject &ldquo;Facebook data deletion request&rdquo; and the name of the Facebook Page (and Instagram username, if any) you connected.
      </p>
      <p className="mb-6">
        Within 30 days, we will delete the stored Page and Instagram account IDs, names and access tokens, remove your posts from any website we manage, and reply to confirm.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p>Email: <a href="mailto:info@visionaryadvance.com" className="text-[#008070] underline">info@visionaryadvance.com</a></p>
    </section>
  );
}
