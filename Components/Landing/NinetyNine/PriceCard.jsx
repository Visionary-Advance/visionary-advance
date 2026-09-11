import Link from 'next/link'
import { Check } from 'lucide-react'
import CtaButton from './CtaButton'

/**
 * Single-price block.
 *
 * Intentionally NOT Components/Home/PricingSection.jsx — that renders the
 * $1,000 / $2,500 one-time project tiers, which directly contradict this page.
 * One price, one decision, nothing to comparison-shop against.
 *
 * The bullets are outcomes, not features; the one place scope is stated
 * plainly is `scopeNote` under the divider, so the page stays honest about
 * page count and edit frequency without turning into a checklist.
 */
export default function PriceCard({
  heading,
  price,
  period,
  tagline,
  outcomes,
  scopeNote,
  ctaLabel,
  ctaHref,
  upsellNote,
  upsellLinkLabel,
  upsellLinkHref,
}) {
  return (
    <section className="bg-[#050505] py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-white leading-tight text-center mb-12">
          {heading}
        </h2>

        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <div className="flex items-end justify-center gap-2">
              <p className="font-anton text-6xl md:text-7xl text-white leading-none">
                {price}
              </p>
              <p className="font-manrope text-lg text-white/50 mb-2">{period}</p>
            </div>
            <p className="font-manrope text-lg text-white/70 mt-4 max-w-md mx-auto">
              {tagline}
            </p>
          </div>

          <div className="border-t border-white/10 my-8" />

          <ul className="space-y-4">
            {outcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start gap-3 font-manrope text-base md:text-lg text-white"
              >
                <Check className="w-5 h-5 text-[#008070] mt-1 flex-shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 my-8" />

          <p className="font-manrope text-sm text-white/50 text-center mb-8">
            {scopeNote}
          </p>

          <CtaButton href={ctaHref} label={ctaLabel} className="w-full" />
        </div>

        <p className="font-manrope text-center text-white/50 text-base mt-8">
          {upsellNote}{' '}
          <Link
            href={upsellLinkHref}
            className="text-[#008070] font-bold hover:text-white transition-colors underline underline-offset-4"
          >
            {upsellLinkLabel}
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
