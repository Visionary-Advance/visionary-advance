import Image from 'next/image'
import { headers } from 'next/headers'
import InstantSiteFlow from '@/Components/InstantSite/InstantSiteFlow'
import MetaPixel from '@/Components/InstantSite/MetaPixel'
import FAQ from '@/Components/FAQ'
import { Check, Globe, PencilLine, Search, ShieldCheck, Smartphone } from 'lucide-react'

// Paid-ads landing page (Meta). Not for search: noindex, no site navigation,
// and nothing on the page leads anywhere but the form. The rest of the page
// exists to answer the questions that stop someone finishing it.

export const metadata = {
  title: 'See your new website free',
  description:
    'Find your business on Google Maps and we build you a website from your listing in a few minutes. Free to see. $99 a month to keep it.',
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

// The form, step by step. Times are what each screen takes, plus the build.
const STEPS = [
  {
    time: 'About a minute',
    title: 'Find your business and pick a style',
    body: 'Type your business name and town, tap your Google listing, then choose how you want the site to feel.',
  },
  {
    time: '30 seconds',
    title: 'Tell us where to send your code',
    body: "Your name, mobile number and email. That's all we ask for.",
  },
  {
    time: '2 to 3 minutes',
    title: 'Watch it build, then unlock it',
    body: 'Your site builds while you wait. Enter the code we send and it opens right here.',
  },
]

// What the site is built from. Shown beside a real site built this way.
const FROM_LISTING = [
  'Your hours, phone number and map',
  'Your five-star Google reviews',
  'The photos already on your listing',
  'Pages written about what you do',
]

// What we look after once it's live. Every line here is in the Starter plan.
const CARE = {
  hosting: {
    title: 'Hosting and security, handled',
    body: "We keep your site online, secure and up to date. There's nothing for you to install or renew.",
  },
  changes: {
    title: 'Changes when you ask',
    body: 'New hours or a fresh photo? Request it from your dashboard and we make the edit. One change a month is included.',
  },
  domain: {
    title: 'Your own domain name',
    body: "Free after your first paid month. We register it, connect it and keep it renewed while you're with us.",
  },
  phone: {
    title: 'Made for phones',
    body: 'Built for small screens first, so it loads fast and reads easily when someone looks you up on their phone.',
  },
  google: {
    title: 'Set up for Google',
    body: 'Page titles, descriptions and your map are set up so Google understands what you do and where you are.',
  },
}

const ICON = { size: 22, strokeWidth: 1.75, 'aria-hidden': true }

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
                We build your site from your Google listing&apos;s hours, photos and reviews. Free to see, $99 a month to
                keep it.
              </p>

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

      {/* ── How it works ───────────────────────────────────────────────────
          A real sequence, so it's a numbered timeline: a line joins the steps
          (vertical on phones, horizontal from md), and each step says how long
          it takes, since "how long will this take?" is the question here.
          The times match the form: one screen per step, ~2.5 min build. */}
      <section className="bg-[#E7EDE8] px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-balance font-inter-display text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
            See your new site in a few minutes.
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-[#062A26]/75">
            Three short steps, all on this page. You can stop at any point.
          </p>

          <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {/* The line joining the steps. Sits behind the numbers. */}
            <span aria-hidden="true" className="absolute left-6 right-[calc((100%_-_4rem)/3_-_1.5rem)] top-6 hidden h-0.5 bg-[#008070]/25 md:block" />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[3rem_1fr] gap-x-5 md:block">
                {/* Phones: a segment down to the next step, none after the last. */}
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="absolute -bottom-10 left-6 top-12 w-0.5 -translate-x-1/2 bg-[#008070]/25 md:hidden" />
                )}
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#008070] font-inter-display text-xl font-semibold text-white ring-8 ring-[#E7EDE8]">
                  {i + 1}
                </span>
                <div className="md:mt-6">
                  <p className="text-sm font-bold text-[#008070]">{step.time}</p>
                  <h3 className="mt-1 text-balance text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-[38ch] leading-relaxed text-[#062A26]/75">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What you get ───────────────────────────────────────────────────
          A bento with exactly six cells: the big one shows a real site built
          from a Google listing, the other five are what we look after. Each
          cell has its own surface so the grid reads as distinct promises. */}
      <section className="px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-balance font-inter-display text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
            You run the business. We run the website.
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-[#062A26]/75">
            We build your site from your Google listing, then handle the hosting, updates and changes for $99 a month.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. Built from the listing: the one cell with an image */}
            <article className="overflow-hidden rounded-2xl bg-[#E7EDE8] md:col-span-2 lg:row-span-2">
              <div className="p-6 sm:p-8">
                <h3 className="font-inter-display text-2xl font-semibold sm:text-3xl">Built from your Google listing</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {FROM_LISTING.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 leading-snug">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#008070] text-white">
                        <Check size={13} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <figure className="px-6 pb-6 sm:px-8 sm:pb-8">
                <div className="overflow-hidden rounded-xl ring-1 ring-[#062A26]/10 shadow-[0_24px_50px_-28px_rgba(6,42,38,0.55)]">
                  <Image
                    src="/Img/instant-site-example.jpg"
                    alt="The Xocolate Coffee Co. website, built from the cafe's Google listing"
                    width={1568}
                    height={744}
                    sizes="(min-width: 1024px) 720px, 100vw"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-[#062A26]/70">
                  Xocolate Coffee Co. in Eugene, built from their listing.
                </figcaption>
              </figure>
            </article>

            {/* 2. Hosting: the dark cell, the core "we take care of it" promise */}
            <article className="flex flex-col rounded-2xl bg-[#062A26] p-6 text-white sm:p-8">
              <ShieldCheck {...ICON} className="text-[#7FD1C6]" />
              <h3 className="mt-4 text-balance text-xl font-bold">{CARE.hosting.title}</h3>
              <p className="mt-2 leading-relaxed text-white/80">{CARE.hosting.body}</p>
            </article>

            {/* 3. Changes */}
            <article className="flex flex-col rounded-2xl border border-[#062A26]/10 bg-white p-6 sm:p-8">
              <PencilLine {...ICON} className="text-[#008070]" />
              <h3 className="mt-4 text-balance text-xl font-bold">{CARE.changes.title}</h3>
              <p className="mt-2 leading-relaxed text-[#062A26]/75">{CARE.changes.body}</p>
            </article>

            {/* 4. Domain: the accent cell */}
            <article className="flex flex-col rounded-2xl bg-[#008070] p-6 text-white sm:p-8">
              <Globe {...ICON} />
              <h3 className="mt-4 text-balance text-xl font-bold">{CARE.domain.title}</h3>
              <p className="mt-2 leading-relaxed text-white/90">{CARE.domain.body}</p>
            </article>

            {/* 5. Phones */}
            <article className="flex flex-col rounded-2xl bg-[#CDE6E2] p-6 sm:p-8">
              <Smartphone {...ICON} className="text-[#062A26]" />
              <h3 className="mt-4 text-balance text-xl font-bold">{CARE.phone.title}</h3>
              <p className="mt-2 leading-relaxed text-[#062A26]/80">{CARE.phone.body}</p>
            </article>

            {/* 6. Google. Spans both columns at md so the 2-col grid has no gap. */}
            <article className="flex flex-col rounded-2xl border border-[#062A26]/10 bg-white p-6 sm:p-8 md:col-span-2 lg:col-span-1">
              <Search {...ICON} className="text-[#008070]" />
              <h3 className="mt-4 text-balance text-xl font-bold">{CARE.google.title}</h3>
              <p className="mt-2 leading-relaxed text-[#062A26]/75">{CARE.google.body}</p>
            </article>
          </div>
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
          <ScrollToFormButton>Find my business</ScrollToFormButton>
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
