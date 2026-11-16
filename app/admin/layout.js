// app/admin/layout.js
// Root admin layout - handles auth protection for all admin routes

import { AdminAuthProvider } from '@/Components/Admin/AdminAuthProvider'
import AdminScrollRestore from '@/Components/Admin/AdminScrollRestore'
import ServiceWorkerRegister from '@/Components/Admin/ServiceWorkerRegister'
import InstallPrompt from '@/Components/Admin/InstallPrompt'
import AdminBottomNav from '@/Components/Admin/AdminBottomNav'

export const metadata = {
  title: 'Admin | Visionary Advance',
  robots: 'noindex, nofollow',
  manifest: '/admin.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'VA Admin',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport = {
  themeColor: '#008070',
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminScrollRestore />
      <ServiceWorkerRegister />
      {children}
      <InstallPrompt />
      <AdminBottomNav />
    </AdminAuthProvider>
  )
}
