'use client'

import { useRouter } from 'next/navigation'
import { PageHeader, useToast } from '@/Components/Admin/ui'
import SiteForm from '@/Components/Admin/DevOps/SiteForm'
import HealthAPITemplate from '@/Components/Admin/DevOps/HealthAPITemplate'
import { devopsApi } from '@/Components/Admin/DevOps/api'

export default function NewSitePage() {
  const router = useRouter()
  const notify = useToast()

  async function create(values) {
    const data = await devopsApi('/api/devops/sites', { method: 'POST', body: values })
    notify(`${data.site?.name || 'Site'} added`, 'success')
    router.push(data.site?.id ? `/admin/devops/sites/${data.site.id}` : '/admin/devops/sites')
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Sites', href: '/admin/devops/sites' }, { label: 'New site' }]}
        title="Add a site"
        description="DevOps checks it every few minutes and opens an incident if it goes down."
      />
      <SiteForm submitLabel="Add site" onSubmit={create} cancelHref="/admin/devops/sites" />
      <div className="mt-10 max-w-2xl">
        <HealthAPITemplate />
      </div>
    </div>
  )
}
