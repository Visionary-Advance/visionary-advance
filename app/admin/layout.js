// app/admin/layout.js
// Root admin layout - handles auth protection for all admin routes

import { AdminAuthProvider } from '@/Components/Admin/AdminAuthProvider'

export const metadata = {
  title: 'Admin | Visionary Advance',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  )
}
