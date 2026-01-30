'use client'
import Link from 'next/link';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#191E1E] text-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="font-anton text-8xl md:text-9xl text-[#008070]">404</h1>
          <h2 className="font-anton text-3xl md:text-4xl text-white">
            Page Not Found
          </h2>
          <p className="font-manrope text-lg text-gray-300 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-[#008070] hover:bg-[#006b5d] text-white px-6 py-3 rounded w-full sm:w-auto transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#191E1E] px-6 py-3 rounded w-full sm:w-auto transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-white/10">
          <p className="font-manrope text-sm text-gray-400 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="font-manrope text-[#008070] hover:text-white transition-colors">
              Services
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/about" className="font-manrope text-[#008070] hover:text-white transition-colors">
              About Us
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/blog" className="font-manrope text-[#008070] hover:text-white transition-colors">
              Blog
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/contact" className="font-manrope text-[#008070] hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
