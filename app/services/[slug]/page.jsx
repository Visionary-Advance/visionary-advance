'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { use } from 'react'
import { servicesData } from '@/lib/services-data'
import SplitText from '@/Components/SplitText'

export default function ServicePage({ params }) {
  const { slug } = use(params)
  const service = servicesData[slug]

  if (!service) notFound()

  const {
    title,
    scrollRevealText,
    included,
    processSteps,
    stats,
    cardHeading,
    ctaHeading,
    ctaText,
  } = service

  return (
    <div className="bg-white min-h-screen">

      {/* ===== HERO ===== */}
      <section className="px-4 md:px-[110px] pt-28 md:pt-55 pb-10 md:pb-14">
        <SplitText
          text={title}
          tag="h1"
          splitType="chars"
          duration={0.4}
          delay={80}
          ease="power3.out"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
          rootMargin="0px"
          textAlign="left"
          className="font-inter-display font-bold text-[clamp(56px,9vw,128px)] text-black leading-none tracking-tight"
        />
        <p className="mt-6 max-w-[1100px] text-[clamp(1.1rem,2.5vw,2rem)] leading-snug font-semibold font-inter-display text-black">
          {scrollRevealText}
        </p>
      </section>

      {/* ===== IMAGE SHOWCASE ===== */}
      <section className="px-4 md:px-[110px] pb-16 md:pb-24">
        <div className="w-full aspect-[1224/524] bg-[#d9d9d9] rounded-[10px] overflow-hidden relative">
          {service.showcaseImage ? (
            <img src={service.showcaseImage} alt={`${title} showcase`} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-manrope text-lg">
              Project Showcase
            </div>
          )}
        </div>
      </section>

      {/* ===== TWO-COLUMN: all content + sticky card ===== */}
      <div className="px-4 md:px-[110px] flex flex-col lg:flex-row gap-10 lg:gap-16">

        {/* ── LEFT: all scrolling content ── */}
        <div className="flex-1 min-w-0">

          {/* Our Process */}
          <section className="pt-16 md:pt-20">
            <h2 className="font-inter-display font-bold text-[clamp(40px,5vw,64px)] text-black leading-tight mb-6">
              Our Process
            </h2>
            <p className="font-inter-display font-semibold text-[clamp(16px,1.6vw,24px)] text-black leading-relaxed">
              Every project starts with a clear plan and ends with a result you're proud to show. We keep you involved at every step — no surprises, no disappearing acts.
            </p>
          </section>

          {/* What's Included */}
          <section className="pt-14 md:pt-20">
            <h2 className="font-inter-display font-bold text-[clamp(32px,3.5vw,48px)] text-black mb-8">
              What's Included:
            </h2>
            <ul className="space-y-5">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <Check className="w-5 h-5 text-[#008070] mt-1 flex-shrink-0" />
                  <span className="font-inter-display font-semibold text-[20px] text-black leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* The Process */}
          <section className="pt-14 md:pt-20">
            <h2 className="font-inter-display font-bold text-[clamp(32px,3.5vw,48px)] text-black mb-10">
              The Process:
            </h2>
            <ol className="space-y-8">
              {processSteps.map((step, i) => (
                <li key={i} className="flex gap-5">
                  <span className="font-inter-display font-bold text-[20px] text-black leading-snug flex-shrink-0">
                    {i + 1}.
                  </span>
                  <div>
                    <p className="font-inter-display font-bold text-[20px] text-black leading-snug">
                      {step.title}
                    </p>
                    <p className="font-inter-display text-[20px] text-black leading-snug mt-1">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className="pt-14 md:pt-20">
            <h2 className="font-inter-display font-bold text-[clamp(32px,3.5vw,48px)] text-black mb-4">
              {ctaHeading}
            </h2>
            <p className="font-inter-display text-[20px] text-black mb-8">{ctaText}</p>
            <Link
              href="/contact"
              className="inline-block bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold text-lg px-8 py-4 rounded-[8px] transition-colors"
            >
              Contact Now
            </Link>
          </section>

        </div>

        {/* ── RIGHT: sticky stat card ── */}
        <div className="hidden lg:block w-[389px] flex-shrink-0">
          <div className="sticky top-[120px]">
            <div className="rounded-[10px] overflow-hidden shadow-md">
              {/* Teal header */}
              <div className="bg-[#008070] h-[239px] relative overflow-hidden">
                <div className="absolute -left-[43px] bottom-[-20px] w-[118px] h-[123px] rounded-full bg-white/10" />
                <div className="absolute right-[-20px] -top-[46px] w-[100px] h-[100px] rounded-full bg-white/10" />
                <div className="absolute left-[89px] top-[96px]">
                  <p className="font-inter-display font-bold text-white text-[20px] leading-snug whitespace-pre-line">
                    {cardHeading}
                  </p>
                </div>
              </div>
              {/* Stats */}
              <div
                className="p-8 flex flex-col gap-6 items-center text-center"
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9f7 40%, rgba(0,128,112,0.18) 100%)' }}
              >
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-inter-display font-bold text-[48px] text-black leading-none">
                      {stat.value}
                    </p>
                    <p className="font-inter-display font-bold text-[20px] text-[#008070] mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom spacing after two-column section */}
      <div className="pb-16 md:pb-24" />
    </div>
  )
}
