// app/admin/layout.js
// Root admin layout - handles auth protection for all admin routes

import { AdminAuthProvider } from '@/Components/Admin/AdminAuthProvider'
import AdminScrollRestore from '@/Components/Admin/AdminScrollRestore'

export const metadata = {
  title: 'Admin | Visionary Advance',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminScrollRestore />
      {children}
    </AdminAuthProvider>
  )
}
