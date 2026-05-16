'use client'

import TestimonialsCarousel from '@/Components/Home/TestimonialsCarousel'

export default function EugeneTestimonials() {
  return (
    <section className="relative bg-white py-20 md:py-28 px-4 md:px-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 font-manrope font-semibold text-xs text-gray-700 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#008070]" />
          Eugene clients
        </span>
        <p className="font-manrope text-gray-600 mt-4 text-base md:text-lg">
          Real Eugene, Springfield, and Lane County businesses we've worked with.
        </p>
      </div>
      <TestimonialsCarousel />
    </section>
  )
}
