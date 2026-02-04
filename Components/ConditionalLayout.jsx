'use client'

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Pages that should not have header/footer
  const isLandingPage = pathname === '/construction-websites';
  const isAdminPage = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  const hideLayout = isLandingPage || isAdminPage || isLoginPage;

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer variant="default" />}
    </>
  );
}