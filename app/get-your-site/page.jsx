import Image from 'next/image'
import { headers } from 'next/headers'
import InstantSiteFlow from '@/Components/InstantSite/InstantSiteFlow'
import MetaPixel from '@/Components/InstantSite/MetaPixel'
import {
  INK, LandingFooter, MapBackdrop, MapPin, ProofSection, ScrollToFormButton, StepsSection, WhatYouGetSection,
} from '@/Components/InstantSite/LandingSections'
import FAQ from '@/Components/FAQ'

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

            <div id="start" className="relative min-w-0 scroll-mt-6 lg:sticky lg:top-6 lg:col-span-6">
              <MapPin />
              <InstantSiteFlow defaultCity={city} defaultState={state} />
            </div>
          </div>
        </div>
      </section>

      <ProofSection />
      <StepsSection />
      <WhatYouGetSection intro="We build your site from your Google listing, then handle the hosting, updates and changes for $99 a month." />

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

      <LandingFooter />
    </main>
  )
}
