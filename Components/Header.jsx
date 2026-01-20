'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header({ currentPage = "" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", key: "home" },
    { name: "About Us", href: "/about", key: "about" },
    { name: "Our Services", href: "/services", key: "services" },
    { name: "Blog", href: "/blog", key: "blog" },
    { name: "Contact", href: "/contact", key: "contact" }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
    <div className='fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#191E1E]/30 border-b border-white/10'>
      <nav className="flex items-center justify-between px-4 md:px-16 py-6 relative z-50">
        <Link href={"/"}>
        <Image 
          src="/Img/VALogo.png" 
          alt="Visionary Advance Logo" 
          className="w-16 h-16" 
          width={40} 
          height={40} 
          quality={100}
        />
</Link>
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`font-manrope transition-colors ${
                currentPage === item.key
                  ? "text-[#008070] font-semibold"
                  : "text-white hover:text-gray-300"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Get Started Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href={"/contact"}>
            <button className="px-4 cursor-pointer py-2 bg-[#008070] hover:bg-[#006b5d] text-white transition-colors rounded">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white z-50 relative"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 relative flex flex-col justify-center">
            <span 
              className={`block h-0.5 w-6 bg-current transform transition-transform duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-0.5' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-current transform transition-opacity duration-300 mt-1 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span 
              className={`block h-0.5 w-6 bg-current transform transition-transform duration-300 mt-1 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 left-0 w-full h-screen bg-[#191E1E] z-40 transition-transform duration-500 ease-out md:hidden ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-4">
          {navItems.map((item, index) => (
            <a
              key={item.key}
              href={item.href}
              onClick={closeMenu}
              className={`font-manrope text-2xl transition-all duration-300 transform ${
                currentPage === item.key
                  ? "text-[#008070] font-semibold"
                  : "text-white hover:text-gray-300"
              } ${
                isMenuOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: isMenuOpen ? `${index * 100 + 200}ms` : '0ms'
              }}
            >
              {item.name}
            </a>
          ))}
          
          {/* Mobile Get Started Button */}
          <Link href={"/contact"} onClick={closeMenu}>
            <button 
              className={`px-8 py-3 bg-[#008070] hover:bg-[#006b5d] text-white transition-all duration-300 rounded-lg font-manrope font-semibold text-lg transform ${
                isMenuOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: isMenuOpen ? `${navItems.length * 100 + 200}ms` : '0ms'
              }}
            >
              Get Started
            </button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div 
          className={`absolute top-1/4 left-8 w-20 h-20 border-2 border-[#008070]/20 rounded-full transition-all duration-700 transform ${
            isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
          style={{ transitionDelay: isMenuOpen ? '600ms' : '0ms' }}
        />
        <div 
          className={`absolute bottom-1/4 right-8 w-16 h-16 bg-[#008070]/10 rounded-lg transition-all duration-700 transform ${
            isMenuOpen ? 'scale-100 opacity-100 rotate-45' : 'scale-0 opacity-0 rotate-0'
          }`}
          style={{ transitionDelay: isMenuOpen ? '800ms' : '0ms' }}
        />
      </div>
      </div>
    </>
  );
}