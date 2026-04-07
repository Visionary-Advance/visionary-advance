'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="font-inter-display font-bold text-[clamp(120px,20vw,200px)] leading-none text-black">
            404
          </h1>
          <h2 className="font-inter-display font-bold text-2xl md:text-3xl text-black">
            This page doesn&apos;t exist
          </h2>
          <p className="font-manrope text-lg text-gray-500 max-w-md mx-auto">
            The page you&apos;re looking for has been moved or no longer exists. Let&apos;s get you somewhere useful.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link
            href="/"
            className="bg-[#008070] hover:bg-[#006b5d] text-white font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto transition-colors text-center text-lg"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="border border-gray-300 text-black font-manrope font-bold px-8 py-4 rounded-lg w-full sm:w-auto hover:border-[#008070] transition-colors text-center text-lg"
          >
            Contact Us
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 border-t border-gray-200 pt-8"
        >
          <p className="font-manrope text-sm text-gray-400 mb-4">Or try one of these</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Services', href: '/services' },
              { label: 'Works', href: '/works' },
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Audit', href: '/audit' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-manrope font-semibold text-gray-400 hover:text-[#008070] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
