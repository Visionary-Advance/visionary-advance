import Image from 'next/image'
import Link from 'next/link'

export default function LandingHero({
  badge,
  headline,
  subheadline,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  showcaseImage,
  showcaseAlt,
}) {
  return (
    <section className="bg-[#050505] relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <div className="hero-pattern" />
      <div className="relative z-10 px-4 md:px-16">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {badge && (
            <span className="inline-flex items-center gap-2 bg-[#008070]/20 border border-[#008070]/40 rounded-full px-5 py-2 font-manrope font-bold text-sm text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-[#008070]" />
              {badge}
            </span>
          )}
          <h1 className="font-inter-display font-semibold text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight">
            {headline}
          </h1>
          <p className="font-manrope text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={primaryCtaHref}
              className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto transition-colors text-center text-lg"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              className="bg-white/10 backdrop-blur border border-white/20 text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto hover:bg-white/20 transition-colors text-center text-lg"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        {showcaseImage && (
          <div className="relative max-w-5xl mx-auto mt-14 md:mt-20 rounded-2xl overflow-hidden border border-white/10 aspect-[16/9]">
            <Image
              src={showcaseImage}
              alt={showcaseAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        )}
      </div>
    </section>
  )
}
