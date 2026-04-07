'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Works', href: '/works' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-black py-12 md:py-16 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Left: Logo + Newsletter */}
          <div className="md:col-span-2 space-y-6">
            <Image
              src="/Img/VA_Logo_Long.png"
              alt="Visionary Advance"
              width={220}
              height={72}
              className="h-16 w-auto"
            />
            <h3 className="font-manrope font-semibold text-2xl md:text-3xl text-white max-w-xs">
              Sign up for our newsletter Today
            </h3>
            {status === 'success' ? (
              <p className="font-manrope text-[#008070] text-sm">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  required
                  disabled={status === 'sending'}
                  className="flex-1 bg-white/10 border-none rounded-l-md px-4 py-2.5 font-manrope text-sm text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-[#008070] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-white text-black font-manrope font-semibold text-sm px-5 py-2.5 rounded-r-md hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Subscribe'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="font-manrope text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}
          </div>

          {/* Right: Resources */}
          <div>
            <p className="font-manrope font-bold text-sm text-white/50 mb-4">
              Resources
            </p>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-manrope text-white/50 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6">
          <p className="font-manrope text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Visionary Advance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
