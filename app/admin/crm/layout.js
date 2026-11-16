// app/admin/crm/layout.js
'use client'

import { Building2, FolderKanban, LayoutDashboard, Mic, SquareKanban, UserPlus, Users } from 'lucide-react'
import SectionShell from '@/Components/Admin/Mobile/SectionShell'

const NAV_ITEMS = [
  { href: '/admin/crm', label: 'Dashboard', mobileLabel: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/admin/crm/leads', label: 'Leads', icon: UserPlus },
  { href: '/admin/crm/pipeline', label: 'Pipeline', icon: SquareKanban },
  { href: '/admin/crm/clients', label: 'Clients', icon: Users },
  { href: '/admin/crm/businesses', label: 'Businesses', icon: Building2 },
  { href: '/admin/crm/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/crm/pocket', label: 'Recordings', icon: Mic },
]

export default function CRMLayout({ children }) {
  return (
    <SectionShell title="CRM" icon={Users} basePath="/admin/crm" navItems={NAV_ITEMS}>
      {children}
    </SectionShell>
  )
}
