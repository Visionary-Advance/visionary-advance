'use client'

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/construction-websites';
  
  return (
    <>
      {!isLandingPage && <Header />}
      {children}
      {!isLandingPage && <Footer variant="default" />}
    </>
  );
}