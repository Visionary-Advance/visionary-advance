'use client'
import Image from 'next/image';
import Link from 'next/link';

export default function ConstructionHeader() {
  return (
    <div className='fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#191E1E]/30 border-b border-white/10'>
      <nav className="flex items-center justify-left px-4 md:px-16 py-6 relative z-50">
        <Link href="/">
          <Image
            src="/Img/VALogo.png"
            alt="Visionary Advance Logo"
            className="w-16 h-16 cursor-pointer"
            width={40}
            height={40}
            quality={100}
          />
        </Link>
      </nav>
    </div>
  );
}
