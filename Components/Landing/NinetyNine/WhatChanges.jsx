import { ArrowRight } from 'lucide-react'

/**
 * Before → after pairs. The spine of the outcome framing: every row is a
 * situation the owner already recognises, followed by what replaces it.
 * Deliberately not a feature list.
 *
 * Layout: two columns on desktop with the arrow between them; on mobile the
 * arrow rotates to point down so the pairing still reads top-to-bottom.
 */
export default function WhatChanges({ heading, intro, items }) {
  return (
    <section className="bg-gray-50 py-16 md:py-24 px-4 md:px-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-black leading-tight mb-4 max-w-3xl">
          {heading}
        </h2>
        {intro && (
          <p className="font-manrope text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mb-12">
            {intro}
          </p>
        )}

        <ul className="space-y-4 md:space-y-5">
          {items.map((item) => (
            <li
              key={item.before}
              className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8"
            >
              <p className="font-manrope text-base md:text-lg text-gray-500 leading-relaxed flex-1 md:text-right">
                {item.before}
              </p>

              <ArrowRight
                className="w-6 h-6 text-[#008070] flex-shrink-0 rotate-90 md:rotate-0 self-start md:self-auto"
                aria-hidden="true"
              />

              <p className="font-inter-display font-semibold text-lg md:text-xl text-black leading-snug flex-1">
                {item.after}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
