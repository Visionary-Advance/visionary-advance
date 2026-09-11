'use client'

import Link from 'next/link'
import { trackCtaClick } from '@/lib/analytics'

const PAGE_PATH = '/99-dollar-websites'

/**
 * CTA link that reports the click to GA before navigating.
 *
 * Client-only because of the handler — the surrounding sections stay server
 * components, so this is the only JS this page ships beyond the FAQ accordion
 * and the testimonials carousel, both of which were already client.
 *
 * `variant` picks the two button treatments used across the site: solid teal
 * for the primary action, translucent white for the secondary on dark ground.
 */
export default function CtaButton({
  href,
  label,
  variant = 'primary',
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-manrope font-bold px-8 py-4 rounded-lg transition-colors text-center text-lg'

  const variants = {
    primary: 'bg-[#008070] hover:bg-[#006b5d] text-white',
    secondary:
      'bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20',
    onTeal: 'bg-white text-[#008070] hover:bg-gray-100',
  }

  return (
    <Link
      href={href}
      onClick={() => trackCtaClick(PAGE_PATH, label)}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {label}
    </Link>
  )
}
