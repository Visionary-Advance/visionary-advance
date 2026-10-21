import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import InstantSiteFlow from '@/Components/InstantSite/InstantSiteFlow'
import MetaPixel from '@/Components/InstantSite/MetaPixel'
import {
  INK, LandingFooter, MapBackdrop, MapPin, ProofSection, ScrollToFormButton, StepsSection, WhatYouGetSection,
} from '@/Components/InstantSite/LandingSections'
import FAQ from '@/Components/FAQ'
import { getTrialSpotsLeft, TRIAL_ENDS_LABEL, TRIAL_SPOTS } from '@/lib/trial'

// Paid-ads landing page for the limited free trial: /get-your-site's page with
// the trial offer, and a banner counting the spots left. Once they're gone the
// form keeps working as a waitlist, and the banner points to /get-your-site.

export const metadata = {
  title: `Your new website, free until ${TRIAL_ENDS_LABEL}`,
  description:
    `We build you a website from your Google listing in a few minutes. Free until ${TRIAL_ENDS_LABEL} for the first ${TRIAL_SPOTS} businesses.`,
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://visionaryadvance.com/free-trial' },
}

const FAQS = [
  {
    question: `Is it really free until ${TRIAL_ENDS_LABEL}?`,
    answer:
      `Yes. We build your site, put it live and look after it until ${TRIAL_ENDS_LABEL} at no charge, and you don't enter a card to start. Before then we'll check in, and if you want to keep it, it's $99 a month from ${TRIAL_ENDS_LABEL}. If you don't, we take it down and you owe nothing.`,
  },
  {
    question: `Why only ${TRIAL_SPOTS} spots?`,
    answer:
      'We set up every trial site by hand and look after it ourselves, so we keep the group small enough to do that properly.',
  },
  {
    question: 'What if the spots are gone?',
    answer:
      "You can still build and see your site. You'll go on the waitlist and we'll text you if a spot opens up. If you don't want to wait, you can keep it right away for $99 a month.",
  },
  {
    question: `What's included after ${TRIAL_ENDS_LABEL}?`,
    answer:
      'The Starter plan: hosting, security updates and one content change a month, like new hours or a fresh photo. There is no contract, and you can cancel anytime.',
  },
  {
    question: 'Do I get a domain name?',
    answer:
      "Yes. After your first paid month, we register a domain for your site at no extra cost (most .com, .net and .org names). We register it under Visionary Advance while you're subscribed. If you cancel and want to keep the name, ask and we'll transfer it to you.",
  },
  {
    question: 'Why do you need my phone number and email?',
    answer:
      "That's where we send the code that unlocks your site, and how we reach you to set up your trial. We don't sell your information.",
  },
  {
    question: "What if my business isn't on Google Maps?",
    answer:
      "Choose \"My business isn't on Google\" in the form and leave your details. It still takes a trial spot, and we'll build your preview by hand.",
  },
]

/** The top strip: how many spots are left, or where to go once they're gone. */
function SpotsBanner({ spotsLeft }) {
  if (spotsLeft === null) return null

  if (spotsLeft === 0) {
    return (
      <div className="bg-[#062A26] px-4 py-3 text-center text-sm font-bold text-white sm:text-base">
        The free trial is full. Join the waitlist below, or{' '}
        <Link href="/get-your-site" className="text-[#7FD1C6] underline underline-offset-2 hover:text-white">
          get your site now for $99 a month
        </Link>
        .
      </div>
    )
  }

  return (
    <div className="bg-[#E5483B] px-4 py-3 text-center text-sm font-bold text-white sm:text-base" role="status">
      🎟️ {spotsLeft === 1 ? 'Last spot left' : `${spotsLeft <= TRIAL_SPOTS / 2 ? 'Only ' : ''}${spotsLeft} of ${TRIAL_SPOTS} spots left`} for the free trial
    </div>
  )
}

export default async function FreeTrialPage() {
  // Geo headers pre-fill city and state, as on /get-your-site
  const h = await headers()
  const city = decodeURIComponent(h.get('x-vercel-ip-city') || '')
  const country = h.get('x-vercel-ip-country')
  const state = country === 'US' ? (h.get('x-vercel-ip-country-region') || '') : ''

  // Read on every request (headers() makes the page dynamic), so the banner is never stale
  const spotsLeft = await getTrialSpotsLeft()
  const full = spotsLeft === 0

  return (
    <main className="bg-white" style={{ color: INK }}>
      <MetaPixel />
      <SpotsBanner spotsLeft={spotsLeft} />

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
              <p className="inline-block rounded-full bg-[#008070] px-3 py-1 text-sm font-bold text-white">
                Free trial · {TRIAL_SPOTS} businesses only
              </p>
              <h1 className="mt-4 font-inter-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[4.25rem]">
                Your new website, free until {TRIAL_ENDS_LABEL}.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#062A26]/80 sm:text-xl">
                We build your site from your Google listing&apos;s hours, photos and reviews while you watch. Free until{' '}
                {TRIAL_ENDS_LABEL}, then $99 a month only if you keep it.
              </p>
              {full && (
                <p className="mt-4 max-w-xl font-bold text-[#062A26]">
                  All {TRIAL_SPOTS} spots are taken. You can still build your site and join the waitlist.
                </p>
              )}
            </div>

            <div id="start" className="relative min-w-0 scroll-mt-6 lg:sticky lg:top-6 lg:col-span-6">
              <MapPin />
              <InstantSiteFlow defaultCity={city} defaultState={state} offer="trial" />
            </div>
          </div>
        </div>
      </section>

      <ProofSection />
      <StepsSection />
      <WhatYouGetSection intro={`We build your site from your Google listing, then handle the hosting, updates and changes. Free until ${TRIAL_ENDS_LABEL}.`} />

      {/* ── Price ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#062A26] px-4 py-16 text-white sm:px-6 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-inter-display text-6xl font-semibold tracking-[-0.02em] sm:text-7xl">
              $0<span className="text-2xl font-medium text-white/60"> until {TRIAL_ENDS_LABEL}</span>
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
              No card to start. After that it&apos;s $99 a month, only if you keep it: hosting, updates and one change a
              month, plus a free domain after your first paid month. Cancel anytime.
            </p>
          </div>
          <ScrollToFormButton>{full ? 'Join the waitlist' : 'Claim my spot'}</ScrollToFormButton>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <FAQ faqs={FAQS} />

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 text-center sm:px-6">
        <MapBackdrop />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-inter-display text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
            {full ? 'The trial is full, but your site is still two minutes away.' : 'Two minutes from now, you could be looking at it.'}
          </h2>
          <p className="mt-4 text-lg text-[#062A26]/75">
            {full ? 'Build it free and join the waitlist.' : `Free until ${TRIAL_ENDS_LABEL}. No credit card.`}
          </p>
          <div className="mt-8">
            <ScrollToFormButton>{full ? 'Join the waitlist' : 'Claim my spot'}</ScrollToFormButton>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
