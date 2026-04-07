'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Works',    href: '/works' },
  { label: 'Blog',     href: '/blog' },
  { label: 'Contact',  href: '/contact' },
]

export default function Header({ variant = 'light' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDark = variant === 'dark'

  useEffect(() => {
    if (!isDark) return
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDark])

  // ── Style tokens based on variant ──────────────────────────────────────
  const barBg = isDark
    ? scrolled
      ? 'backdrop-blur-xl bg-black/70 border border-white/10'
      : 'backdrop-blur-xl bg-white/15 border border-white/20'
    : 'backdrop-blur-xl bg-white/90 border border-black/10 shadow-sm'

  const linkColor = isDark
    ? 'text-white/85 hover:text-white'
    : 'text-black/80 hover:text-black'

  const ctaClasses = isDark
    ? 'bg-[#f0f0f0] text-black hover:bg-white'
    : 'bg-[#008070] hover:bg-[#006b5d] text-white'

  const iconColor = isDark ? 'text-white' : 'text-black'

  return (
    <>
      {/* ── Nav bar ──────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-0 pt-8 transition-all duration-300 ${
        isDark && !scrolled ? '' : ''
      }`}>
        <div className="mx-auto max-w-5xl">
          <div className={`${barBg} rounded-xl px-6 py-3 flex items-center justify-between transition-all duration-300`}>
            <Link href="/">
              <Image
                src="/Img/VA_Logo_Long.png"
                alt="Visionary Advance"
                width={140}
                height={46}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-manrope text-sm transition-colors ${linkColor}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              className={`hidden md:block font-manrope font-bold text-sm px-5 py-2.5 rounded-lg transition-colors ${ctaClasses}`}
            >
              Contact Now
            </Link>

            {/* Animated hamburger ↔ X */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden cursor-pointer w-8 h-8 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="x"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className={`block ${iconColor}`}
                    >
                      <X className="w-6 h-6" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className={`block ${iconColor}`}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[59] bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Menu panel — slides down from top */}
            <motion.div
              key="panel"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 left-0 right-0 z-[60] bg-[#050505] overflow-hidden"
              style={{ height: '100dvh' }}
            >
              {/* Teal accent bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
                style={{ originX: 0 }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#008070] to-[#7c3aed]"
              />

              {/* Header row */}
              <div className="flex items-center justify-between px-6 pt-7 pb-5">
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 }}
                >
                  <Link href="/" onClick={() => setOpen(false)}>
                    <Image
                      src="/Img/VA_Logo_Long.png"
                      alt="Visionary Advance"
                      width={120}
                      height={40}
                      className="h-8 w-auto brightness-0 invert"
                    />
                  </Link>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
                  whileTap={{ scale: 0.88 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0.28 }}
                style={{ originX: 0 }}
                className="h-px bg-white/8 mx-6"
              />

              {/* Nav links — each rises out of a hidden overflow container */}
              <nav className="flex flex-col justify-center flex-1 px-6 pt-4 pb-4" style={{ height: 'calc(100dvh - 200px)' }}>
                {navLinks.map((link, i) => (
                  <div key={link.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.33, 1, 0.68, 1],
                        delay: 0.28 + i * 0.07,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-4 py-3 group"
                      >
                        <span className="font-manrope text-xs font-bold text-white/20 w-5 flex-shrink-0 group-hover:text-[#008070] transition-colors duration-200">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-inter-display font-bold text-[2.4rem] leading-tight text-white group-hover:text-[#008070] transition-colors duration-200">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </nav>

              {/* CTA */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.33, 1, 0.68, 1],
                    delay: 0.28 + navLinks.length * 0.07,
                  }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold py-4 rounded-xl transition-colors text-base"
                  >
                    Book a Discovery Call
                  </Link>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center font-manrope text-xs text-white/20"
                >
                  Eugene, OR · info@visionaryadvance.com
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
