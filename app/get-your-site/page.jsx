import Image from 'next/image'
import { headers } from 'next/headers'
import InstantSiteFlow from '@/Components/InstantSite/InstantSiteFlow'
import MetaPixel from '@/Components/InstantSite/MetaPixel'
import FAQ from '@/Components/FAQ'

// Paid-ads landing page (Meta). Not for search: noindex, no site navigation,
// and nothing on the page leads anywhere but the form. The rest of the page
// exists to answer the questions that stop someone finishing it.

export const metadata = {
  title: 'See your new website free',
  description:
    'Find your business on Google Maps and we build you a website from your listing in about two minutes. Free to see. $99 a month to keep it.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://visionaryadvance.com/get-your-site' },
}

// Palette for this page, taken from a street map rather than the brand's
// black hero: the visitor's Google listing is literally what we build from.
const INK = '#062A26'

// Real reviews, from Components/Home/TestimonialsCarousel.jsx. Trimmed, not reworded.
const QUOTES = [
  {
    quote: 'They really took the time to understand my business and brought my vision to life with a clean, modern, and user-friendly design.',
    name: 'Stephanie F.',
    business: 'PatRick Environmental',
  },
  {
    quote: 'We needed a website that looked professional and actually converted, and he delivered.',
    name: 'Thomas T.',
    business: 'UC Blinds',
  },
  {
    quote: 'The Visionary Advance team truly focused on our branding and company values. They truly put care into their work.',
    name: 'Anallely S.',
    business: 'Xocolate Coffee Co.',
  },
]

const FROM_LISTING = [
  ['Your hours, phone and map', 'Straight from Google, so customers can call or find you in one tap.'],
  ['Your best reviews', 'Your five-star Google reviews, quoted on the page where new customers decide.'],
  ['Your photos', 'The pictures already on your listing, sized for phones.'],
  ['Pages written for you', 'Copy about your services, written from what your listing and reviews say.'],
]

const FAQS = [
  {
    question: 'Is it really free to see?',
    answer:
      "Yes. We build the whole site and send you a code to unlock it. You don't enter a card to see it, and you can walk away if it isn't for you.",
  },
  {
    question: 'What does it cost to keep it?',
    answer:
      '$99 a month on the Starter plan. That covers hosting, security updates and one content change a month, like new hours or a fresh photo. There is no contract, and you can cancel anytime.',
  },
  {
    question: 'Do I get a domain name?',
    answer:
      "Yes. After your first paid month, we register a domain for your site at no extra cost (most .com, .net and .org names). We register it under Visionary Advance while you're subscribed. If you cancel and want to keep the name, ask and we'll transfer it to you.",
  },
  {
    question: 'Why do you need my phone number and email?',
    answer:
      "That's where we send the code that unlocks your site, and how we reach you if you have questions. We don't sell your information.",
  },
  {
    question: 'Can I change things on the site?',
    answer:
      'Yes. Once you claim it, you can request changes from your dashboard. Starter includes one change a month, and you can add more if you need them.',
  },
  {
    question: "What if my business isn't on Google Maps?",
    answer:
      "Choose \"My business isn't on Google\" in the form and leave your details. We'll build your preview by hand and send it to you.",
  },
]

/** A quiet street-map backdrop: blocks, a few roads, a river. Decorative only. */
function MapBackdrop() {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 900">
      <rect width="1200" height="900" fill="#E7EDE8" />
      <path d="M-40 640 C 180 560, 330 700, 520 620 S 860 470, 1240 560" fill="none" stroke="#CDE6E2" strokeWidth="46" strokeLinecap="round" />
      <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
        <path d="M0 210 H1200" strokeWidth="14" />
        <path d="M0 420 H1200" strokeWidth="8" />
        <path d="M0 790 H1200" strokeWidth="8" />
        <path d="M180 0 V900" strokeWidth="8" />
        <path d="M470 0 V900" strokeWidth="14" />
        <path d="M760 0 V900" strokeWidth="8" />
        <path d="M1010 0 V900" strokeWidth="8" />
        <path d="M-40 60 L 640 900" strokeWidth="10" />
      </g>
      <g fill="#DCE5DE">
        <rect x="200" y="235" width="250" height="165" rx="6" />
        <rect x="785" y="440" width="205" height="120" rx="6" />
        <rect x="20" y="440" width="140" height="110" rx="6" />
      </g>
    </svg>
  )
}

function MapPin() {
  return (
    <div className="pointer-events-none absolute -right-2 -top-12 z-10 flex flex-col items-center sm:-right-4" aria-hidden="true">
      <svg className="is-pin h-14 w-11 drop-shadow-[0_8px_10px_rgba(6,42,38,0.35)]" viewBox="0 0 44 56">
        <path d="M22 0C9.85 0 0 9.85 0 22c0 16.5 22 34 22 34s22-17.5 22-34C44 9.85 34.15 0 22 0z" fill="#E5483B" />
        <circle cx="22" cy="21" r="8" fill="#FFFFFF" />
      </svg>
      <span className="is-pin-ripple -mt-1 h-3 w-8 rounded-[50%] bg-[#E5483B]/40" />
    </div>
  )
}

function ScrollToFormButton({ children }) {
  return (
    <a
      href="#start"
      className="inline-block rounded-xl bg-[#008070] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#008070]/25 transition hover:bg-[#006b5d] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#008070]/40"
    >
      {children}
    </a>
  )
}

export default async function GetYourSitePage() {
  // Vercel's geo headers pre-fill city and state: two fewer things to type on
  // a phone. Visitors can change them; they're a guess, not a lock.
  const h = await headers()
  const city = decodeURIComponent(h.get('x-vercel-ip-city') || '')
  const country = h.get('x-vercel-ip-country')
  const state = country === 'US' ? (h.get('x-vercel-ip-country-region') || '') : ''

  return (
    <main className="bg-white" style={{ color: INK }}>
      <MetaPixel />

      {/* ── Hero + form ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <MapBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:pb-24">
          <header className="flex items-center justify-between">
            <Image src="/Img/VA_Logo_Long.png" alt="Visionary Advance" width={192} height={60} priority className="h-auto w-40 sm:w-48" />
            <a href="tel:+15413210468" className="text-sm font-bold text-[#062A26]/70 hover:text-[#062A26]">(541) 321-0468</a>
          </header>

          <div className="mt-8 grid items-start gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6 lg:pt-6">
              <h1 className="font-inter-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[4.25rem]">
                Your Google listing, built into a website while you watch.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#062A26]/80 sm:text-xl">
                Type your business name. We pull your hours, photos and best reviews from Google Maps and build your site in
                about two minutes. Free to see, $99 a month if you keep it.
              </p>

              {/* Desktop only: on a phone the form comes straight after the
                  headline, and this list follows further down the page. */}
              <ul className="mt-10 hidden space-y-4 lg:block">
                {FROM_LISTING.slice(0, 3).map(([title]) => (
                  <li key={title} className="flex items-center gap-3 text-lg font-bold">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#008070] text-sm text-white">✓</span>
                    {title}
                  </li>
                ))}
              </ul>
            </div>

            <div id="start" className="relative scroll-mt-6 lg:sticky lg:top-6 lg:col-span-6">
              <MapPin />
              <InstantSiteFlow defaultCity={city} defaultState={state} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof ───────────────────────────────────────────────────────── */}
      <section className="border-y border-[#062A26]/10 bg-white px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.name}>
              <p className="text-amber-500" aria-label="5 out of 5 stars">★★★★★</p>
              <blockquote className="mt-2 text-lg leading-relaxed">&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption className="mt-3 text-sm text-[#062A26]/70">
                <span className="font-bold text-[#062A26]">{q.name}</span>, {q.business}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── How it works (a real sequence, so it's numbered) ──────────────── */}
      <section className="bg-[#E7EDE8] px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-2xl font-inter-display text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
            Three steps, and you&apos;re looking at your new site.
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ['Find your business, pick a style', 'Type its name and town, choose your Google listing, then pick how you want the site to feel.'],
              ['Tell us where to send the code', 'Your name, mobile and email. Nothing else.'],
              ['Watch it build, then unlock it', 'Enter the code we send and your site opens right on this page.'],
            ].map(([title, body], i) => (
              <li key={title} className="border-t-2 border-[#008070] pt-5">
                <span className="font-inter-display text-5xl font-semibold text-[#008070]">{i + 1}</span>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-1 leading-relaxed text-[#062A26]/75">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What we pull from the listing ─────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-inter-display text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
              You already did the hard part when you set up your Google listing.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#062A26]/75">
              Everything customers look for is already on it. We turn it into a site you can put on your truck, your
              cards and your Facebook page.
            </p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2">
            {FROM_LISTING.map(([title, body]) => (
              <div key={title} className="rounded-2xl bg-[#E7EDE8] p-6">
                <dt className="text-lg font-bold">{title}</dt>
                <dd className="mt-1 leading-relaxed text-[#062A26]/75">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Price ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#062A26] px-4 py-16 text-white sm:px-6 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-inter-display text-6xl font-semibold tracking-[-0.02em] sm:text-7xl">
              $99<span className="text-2xl font-medium text-white/60"> a month</span>
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
              Only if you keep it. Hosting, updates and one change a month are included, plus a free domain after your
              first paid month. Cancel anytime.
            </p>
          </div>
          <ScrollToFormButton>See my site free</ScrollToFormButton>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FAQ faqs={FAQS} />

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 text-center sm:px-6">
        <MapBackdrop />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-inter-display text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
            Two minutes from now, you could be looking at it.
          </h2>
          <p className="mt-4 text-lg text-[#062A26]/75">Free to build. No credit card.</p>
          <div className="mt-8">
            <ScrollToFormButton>Find my business</ScrollToFormButton>
          </div>
        </div>
      </section>

      <footer className="px-4 py-8 text-center text-sm text-[#062A26]/60 sm:px-6">
        © {new Date().getFullYear()} Visionary Advance LLC, Eugene, Oregon.{' '}
        <a href="/privacy-policy" className="underline">Privacy</a>{' '}
        <a href="/terms-of-service" className="underline">Terms</a>
      </footer>
    </main>
  )
}
