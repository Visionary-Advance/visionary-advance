'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Visionary Advance created two websites for me. I had an excellent experience working with this website design company! From start to finish, their team was professional, responsive, and incredibly easy to work with. They really took the time to understand my business and brought my vision to life with a clean, modern, and user-friendly design.',
    name: 'Stephanie Foxx',
    role: 'PatRick Environmental',
    rating: 5,
  },
  {
    quote:
      'A huge thank you to Brandon for setting up my business website! The Visionary Advance team truly focused on our branding and company values. They truly put care into their work. I highly recommend.',
    name: 'Anallely Sanchez-Hernandez',
    role: 'Xocolate Coffee Co.',
    rating: 5,
  },
]

// Duplicate for seamless infinite loop
const doubled = [...testimonials, ...testimonials]

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [paused, setPaused] = useState(false)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="font-inter-display font-semibold text-3xl md:text-5xl text-gray-900 tracking-tight">
          What Our Clients Say
        </h2>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 80px, black calc(100% - 80px), transparent)',
        }}
      >
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-6 pb-4"
          style={{
            width: 'max-content',
            animation: 'testimonial-marquee 50s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {doubled.map((testimonial, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[380px] bg-[#0d0d0d] rounded-2xl p-8 flex flex-col relative overflow-hidden"
              style={{ border: '1px solid rgba(0,128,112,0.25)' }}
            >
              {/* Decorative large quote mark */}
              <span
                className="absolute top-4 right-6 font-anton text-[120px] leading-none select-none pointer-events-none"
                style={{ color: 'rgba(0,128,112,0.12)' }}
              >
                &ldquo;
              </span>

              {/* Top accent line */}
              <div className="w-10 h-0.5 bg-[#008070] mb-6" />

              <StarRating count={testimonial.rating} />

              <blockquote className="font-manrope text-gray-300 text-base md:text-lg mt-5 leading-relaxed flex-1 relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="font-manrope font-bold text-white">
                  {testimonial.name}
                </p>
                <p className="font-manrope text-[#008070] text-sm mt-0.5">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
