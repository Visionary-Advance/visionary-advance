'use client'

// DevOps on the shared admin shell (same as CRM and Finance): sidebar on desktop,
// sticky top bar with section tabs on phones. Approvals shows how many PRs wait.

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { GitPullRequest, LayoutDashboard, Server, Siren, Activity } from 'lucide-react'
import SectionShell from '@/Components/Admin/Mobile/SectionShell'
import { devopsApi } from '@/Components/Admin/DevOps/api'

export default function DevOpsLayout({ children }) {
  const pathname = usePathname()
  const [pending, setPending] = useState(0)

  const refreshCount = useCallback(() => {
    devopsApi('/api/devops/approvals?count=1')
      .then(data => setPending(data.count || 0))
      .catch(() => {})
  }, [])

  useEffect(() => { refreshCount() }, [pathname, refreshCount])
  useEffect(() => {
    window.addEventListener('devops:approvals-changed', refreshCount)
    return () => window.removeEventListener('devops:approvals-changed', refreshCount)
  }, [refreshCount])

  const navItems = [
    { href: '/admin/devops', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/devops/approvals', label: 'Approvals', icon: GitPullRequest, badge: pending },
    { href: '/admin/devops/sites', label: 'Sites', icon: Server },
    { href: '/admin/devops/incidents', label: 'Incidents', icon: Siren },
  ]

  return (
    <SectionShell title="DevOps" icon={Activity} basePath="/admin/devops" navItems={navItems}>
      {children}
    </SectionShell>
  )
}
