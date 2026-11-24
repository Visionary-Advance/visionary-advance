'use client'

// DevOps on the shared admin shell (same as CRM and Finance): sidebar on desktop,
// sticky top bar with section tabs on phones. Approvals shows how many PRs wait;
// Claude shows how many chats wait on you (a plan to approve or a question).

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bot, GitPullRequest, LayoutDashboard, Server, Siren, Activity } from 'lucide-react'
import SectionShell from '@/Components/Admin/Mobile/SectionShell'
import { devopsApi } from '@/Components/Admin/DevOps/api'

export default function DevOpsLayout({ children }) {
  const pathname = usePathname()
  const [pending, setPending] = useState(0)
  const [waiting, setWaiting] = useState(0)

  const refreshCount = useCallback(() => {
    devopsApi('/api/devops/approvals?count=1')
      .then(data => setPending(data.count || 0))
      .catch(() => {})
    devopsApi('/api/devops/claude/threads?count=1')
      .then(data => setWaiting(data.count || 0))
      .catch(() => {})
  }, [])

  useEffect(() => { refreshCount() }, [pathname, refreshCount])
  useEffect(() => {
    window.addEventListener('devops:approvals-changed', refreshCount)
    window.addEventListener('devops:claude-changed', refreshCount)
    return () => {
      window.removeEventListener('devops:approvals-changed', refreshCount)
      window.removeEventListener('devops:claude-changed', refreshCount)
    }
  }, [refreshCount])

  const navItems = [
    { href: '/admin/devops', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/admin/devops/claude', label: 'Claude', icon: Bot, badge: waiting },
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
