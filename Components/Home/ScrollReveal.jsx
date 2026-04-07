'use client'

import { useEffect, useRef, useMemo } from 'react'

export default function ScrollReveal({
  children,
  baseColor = 'rgb(200, 200, 200)',
  revealColor = 'rgb(23, 23, 23)',
  containerClassName = '',
  textClassName = '',
}) {
  const containerRef = useRef(null)
  const charRefs = useRef([])
  const currentProgress = useRef(0)
  const targetProgress = useRef(0)
  const rafId = useRef(null)

  const wordGroups = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(/(\s+)/).filter(Boolean).map((segment) => ({
      isSpace: /^\s+$/.test(segment),
      chars: segment.split(''),
    }))
  }, [children])

  const totalCharCount = useMemo(() => {
    return wordGroups.reduce((sum, g) => sum + g.chars.length, 0)
  }, [wordGroups])

  useEffect(() => {
    const render = () => {
      const el = containerRef.current
      const spans = charRefs.current
      if (!el) { rafId.current = requestAnimationFrame(render); return }

      // Calculate target progress from scroll position
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const startY = windowH * 0.8
      const endY = windowH * 0.2
      targetProgress.current = Math.max(0, Math.min(1, (startY - rect.top) / (startY - endY)))

      // Lerp toward target for smooth fluid motion
      const diff = targetProgress.current - currentProgress.current
      currentProgress.current += diff * 0.08

      // Snap if very close
      if (Math.abs(diff) < 0.0001) {
        currentProgress.current = targetProgress.current
      }

      const progress = currentProgress.current

      // Measure widths
      let totalWidth = 0
      const widths = []
      for (let i = 0; i < totalCharCount; i++) {
        const span = spans[i]
        if (!span) { widths.push(0); continue }
        const w = span.offsetWidth || 4
        widths.push(w)
        totalWidth += w
      }

      if (totalWidth > 0) {
        const filledWidth = progress * totalWidth
        let accumulated = 0

        for (let i = 0; i < totalCharCount; i++) {
          const span = spans[i]
          if (!span) { accumulated += widths[i]; continue }

          const charWidth = widths[i]

          if (accumulated + charWidth <= filledWidth) {
            span.style.backgroundImage = `linear-gradient(to right, ${revealColor} 100%, ${baseColor} 100%)`
          } else if (accumulated >= filledWidth) {
            span.style.backgroundImage = `linear-gradient(to right, ${revealColor} 0%, ${baseColor} 0%)`
          } else {
            const charFill = ((filledWidth - accumulated) / charWidth) * 100
            span.style.backgroundImage = `linear-gradient(to right, ${revealColor} ${charFill}%, ${baseColor} ${charFill}%)`
          }

          accumulated += charWidth
        }
      }

      rafId.current = requestAnimationFrame(render)
    }

    rafId.current = requestAnimationFrame(render)

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [baseColor, revealColor, totalCharCount])

  let charIndex = 0

  return (
    <div ref={containerRef} className={containerClassName}>
      <p
        className={`text-[clamp(1.1rem,2.5vw,2rem)] leading-snug font-semibold ${textClassName}`}
      >
        {wordGroups.map((group, gi) => {
          if (group.isSpace) {
            charIndex += group.chars.length
            return ' '
          }

          const wordChars = group.chars.map((char, ci) => {
            const idx = charIndex++
            return (
              <span
                key={idx}
                ref={(el) => { charRefs.current[idx] = el }}
                style={{
                  backgroundImage: `linear-gradient(to right, ${baseColor} 0%, ${baseColor} 0%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                {char}
              </span>
            )
          })

          return (
            <span key={`w${gi}`} className="inline-block whitespace-nowrap">
              {wordChars}
            </span>
          )
        })}
      </p>
    </div>
  )
}
