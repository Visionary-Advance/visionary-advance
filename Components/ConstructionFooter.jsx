'use client'
import Link from 'next/link';
import Image from 'next/image';

export default function ConstructionFooter() {
  const date = new Date().getFullYear();

  return (
    <footer className="px-4 md:px-16 py-16 md:py-20 bg-[#000606]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo */}
          <Link href="/">
            <Image
              className="w-40 cursor-pointer"
              src="/Img/VaLogo_Large.png"
              alt="Visionary Advance Logo"
              width={160}
              height={160}
              quality={100}
            />
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/terms-of-service"
              className="font-manrope text-sm text-white hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/privacy-policy"
              className="font-manrope text-sm text-white hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="font-manrope text-sm text-white/70 text-center">
            © {date} Visionary Advance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
