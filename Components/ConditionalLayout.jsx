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
  const isAuditPage = pathname === '/audit';

  const hideLayout = isLandingPage || isAdminPage || isLoginPage || isAuditPage;

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer variant="default" />}
    </>
  );
}