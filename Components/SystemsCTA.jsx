'use client'

import { usePathname } from 'next/navigation'
import { trackCtaClick } from '@/lib/analytics'

export default function SystemsCTA({
  title,
  text,
  buttonText = 'Get Started',
  scrollTarget = 'lead-form',
  variant = 'default' // 'default' | 'hero' | 'inline'
}) {
  const pathname = usePathname()

  const handleClick = (e) => {
    e.preventDefault()

    // Track the CTA click
    trackCtaClick(pathname, buttonText)

    // Scroll to target element
    const target = document.getElementById(scrollTarget)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (variant === 'hero') {
    return (
      <div className="mt-8">
        <button
          onClick={handleClick}
          className="px-8 py-4 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-semibold rounded-lg transition-colors text-lg"
        >
          {buttonText}
        </button>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className="text-[#008070] hover:text-[#006b5d] font-semibold underline underline-offset-4 transition-colors"
      >
        {buttonText}
      </button>
    )
  }

  // Default variant - full CTA section
  return (
    <section className="py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#008070]/20 to-[#008070]/5 border border-[#008070]/30 rounded-2xl p-8 md:p-12">
          {title && (
            <h2 className="font-anton text-2xl md:text-3xl text-white mb-4">
              {title}
            </h2>
          )}
          {text && (
            <p className="font-manrope text-gray-300 mb-8 max-w-2xl mx-auto">
              {text}
            </p>
          )}
          <button
            onClick={handleClick}
            className="px-8 py-4 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-semibold rounded-lg transition-colors text-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  )
}
