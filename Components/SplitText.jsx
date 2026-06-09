'use client'

import { useRef, useEffect, useState, useContext } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText as GSAPSplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { A11yContext } from './Accessibility/A11yProvider'

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP)

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null)
  const animationCompletedRef = useRef(false)
  const onCompleteRef = useRef(onLetterAnimationComplete)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Respect the accessibility "Stop animations" toggle (and OS reduced-motion,
  // which the provider mirrors into this setting). When on, render the title
  // statically instead of running the GSAP character reveal.
  const a11y = useContext(A11yContext)
  const reduceMotion = a11y?.settings?.stopAnimations ?? false

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete
  }, [onLetterAnimationComplete])

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true)
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true))
    }
  }, [])

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return
      if (animationCompletedRef.current) return
      const el = ref.current

      if (el._rbsplitInstance) {
        try { el._rbsplitInstance.revert() } catch (_) {}
        el._rbsplitInstance = null
      }

      // Reduced motion: skip the split/reveal entirely and show the text
      // immediately in its final state.
      if (reduceMotion) {
        gsap.set(el, { clearProps: 'opacity,transform' })
        return
      }

      const startPct = (1 - threshold) * 100
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin)
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px'
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`
      const start = `top ${startPct}%${sign}`

      let targets
      const assignTargets = (self) => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars
        if (!targets && splitType.includes('words') && self.words.length) targets = self.words
        if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines
        if (!targets) targets = self.chars || self.words || self.lines
      }

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: (self) => {
          assignTargets(self)
          const tween = gsap.fromTo(targets, { ...from }, {
            ...to,
            duration,
            ease,
            stagger: delay / 1000,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              fastScrollEnd: true,
              anticipatePin: 0.4,
            },
            onComplete: () => {
              animationCompletedRef.current = true
              onCompleteRef.current?.()
            },
            willChange: 'transform, opacity',
            force3D: true,
          })
          return tween
        },
      })

      el._rbsplitInstance = splitInstance

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill()
        })
        try { splitInstance.revert() } catch (_) {}
        el._rbsplitInstance = null
      }
    },
    {
      dependencies: [
        text, delay, duration, ease, splitType,
        JSON.stringify(from), JSON.stringify(to),
        threshold, rootMargin, fontsLoaded, reduceMotion,
      ],
      scope: ref,
    }
  )

  const Tag = tag || 'p'

  return (
    <Tag
      ref={ref}
      style={{
        textAlign,
        overflow: 'hidden',
        display: 'inline-block',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        willChange: 'transform, opacity',
      }}
      className={`split-parent ${className}`}
    >
      {text}
    </Tag>
  )
}

export default SplitText
