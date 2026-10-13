import { Globe, KeyRound, MessageCircle } from 'lucide-react'
import SetupCallBooking from '@/Components/Booking/SetupCallBooking'

// The Domain/Setup call a customer books after buying their site through
// WaaS (the dashboard card and the welcome email link here, via
// NEXT_PUBLIC_SETUP_CALL_URL in WaaS). For customers, not search: noindex.

export const metadata = {
  title: 'Book your domain & setup call',
  description:
    'A 30-minute call to connect your domain, get your account set up, and answer any questions about your new website.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://visionaryadvance.com/setup-call' },
}

const COVERS = [
  {
    icon: Globe,
    title: 'Your domain',
    body: 'Connect the one you own, or pick and set up a new one. We handle the DNS.',
  },
  {
    icon: KeyRound,
    title: 'Your account',
    body: 'A walkthrough of your dashboard: editing, photos, messages, and reports.',
  },
  {
    icon: MessageCircle,
    title: 'Your questions',
    body: "Anything about your site, email, or what's next. I'll introduce myself, too.",
  },
]

export default function SetupCallPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <section className="px-4 md:px-16 pt-32 md:pt-40 pb-10 md:pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2 font-manrope font-bold text-sm text-gray-500 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#008070]" />
            Domain &amp; Setup
          </div>
          <h1 className="font-inter-display font-bold text-4xl md:text-6xl text-gray-900 leading-tight tracking-tight mb-5">
            Book your setup call
          </h1>
          <p className="font-manrope text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            Your site is paid for. Pick a time and we&apos;ll get your domain connected and your account set up together.
          </p>
          <p className="font-manrope text-sm text-gray-400 mt-3">30 minutes · Google Meet · Free with your plan</p>
        </div>
      </section>

      <section className="px-4 md:px-16 pb-20 md:pb-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 min-w-0">
            <SetupCallBooking />
          </div>

          <aside className="space-y-6">
            <h2 className="font-inter-display font-bold text-xl text-gray-900">What we&apos;ll cover</h2>
            <ul className="space-y-5">
              {COVERS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#008070]/10">
                    <Icon className="h-5 w-5 text-[#008070]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-manrope font-bold text-gray-900">{title}</p>
                    <p className="font-manrope text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-manrope text-sm text-gray-500 border-t border-gray-200 pt-6">
              Can&apos;t find a time that works? Call or text <a href="tel:+15413210468" className="whitespace-nowrap text-[#008070] font-semibold hover:underline">541-321-0468</a>.
            </p>
          </aside>
        </div>
      </section>
    </div>
  )
}
