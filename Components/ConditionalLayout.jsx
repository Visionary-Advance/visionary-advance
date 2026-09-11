'use client'

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const LANDING_PAGES = new Set([
  '/construction-websites',
  '/99-dollar-websites',
]);

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Standalone landing pages: no site nav, so the only way off the page is a
  // CTA. Add a path here when a page is meant to stand alone.
  const isLandingPage = LANDING_PAGES.has(pathname);
  const isAdminPage = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/login';
  const isHomePage = pathname === '/';

  const hideLayout = isLandingPage || isAdminPage || isLoginPage;

  return (
    <>
      {!hideLayout && <Header variant={isHomePage ? 'dark' : 'light'} />}
      {children}
      {!hideLayout && <Footer variant="default" />}
    </>
  );
}
