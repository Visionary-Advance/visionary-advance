/**
 * Day-marked timeline. Speed is the outcome being sold here, so the day marker
 * is the loudest element in each row — not the step number.
 *
 * Mirrors the numbered ProcessSection in LandingPageTemplate.jsx, but with the
 * marker column widened for "Day 1" style labels instead of "01".
 */
export default function HowFast({ heading, intro, steps }) {
  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-inter-display font-bold text-3xl md:text-5xl text-black leading-tight mb-4 max-w-3xl">
          {heading}
        </h2>
        {intro && (
          <p className="font-manrope text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mb-12">
            {intro}
          </p>
        )}

        <ol className="space-y-8 md:space-y-10">
          {steps.map((step) => (
            <li key={step.marker} className="flex flex-col sm:flex-row gap-3 sm:gap-8">
              <span className="font-inter-display font-bold text-xl md:text-2xl text-[#008070] leading-none flex-shrink-0 sm:w-28 sm:pt-1">
                {step.marker}
              </span>
              <div className="flex-1 border-b border-gray-200 pb-8 md:pb-10">
                <h3 className="font-inter-display font-bold text-xl md:text-2xl text-black mb-2">
                  {step.title}
                </h3>
                <p className="font-manrope text-base md:text-lg text-gray-700 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
