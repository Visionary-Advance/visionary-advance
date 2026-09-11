import CtaButton from './CtaButton'

/**
 * Closing CTA. Same dark rounded-card treatment as the FinalCTA inside
 * LandingPageTemplate.jsx, but with page-specific copy and tracked buttons.
 */
export default function FinalCTA({
  headline,
  body,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-5xl mx-auto bg-[#050505] rounded-3xl px-6 md:px-16 py-16 md:py-20 text-center relative overflow-hidden">
        <div className="hero-pattern opacity-50" />
        <div className="relative z-10">
          <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-white leading-tight mb-6 max-w-3xl mx-auto">
            {headline}
          </h2>
          <p className="font-manrope text-lg text-white/70 max-w-2xl mx-auto mb-8">
            {body}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CtaButton
              href={primaryCtaHref}
              label={primaryCtaLabel}
              className="w-full sm:w-auto"
            />
            <CtaButton
              href={secondaryCtaHref}
              label={secondaryCtaLabel}
              variant="secondary"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
