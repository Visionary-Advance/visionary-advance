// app/admin/finance/layout.js
'use client'

import { ArrowDownLeft, Calculator, LayoutDashboard, Receipt, Settings, Wallet } from 'lucide-react'
import SectionShell from '@/Components/Admin/Mobile/SectionShell'

const NAV_ITEMS = [
  { href: '/admin/finance', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/finance/income', label: 'Income', icon: ArrowDownLeft },
  { href: '/admin/finance/expenses', label: 'Expenses', icon: Receipt },
  { href: '/admin/finance/tax', label: 'Tax estimator', mobileLabel: 'Tax', icon: Calculator },
  { href: '/admin/finance/settings', label: 'Settings', icon: Settings },
]

export default function FinanceLayout({ children }) {
  return (
    <SectionShell title="Finance" icon={Wallet} basePath="/admin/finance" navItems={NAV_ITEMS}>
      {children}
    </SectionShell>
  )
}
