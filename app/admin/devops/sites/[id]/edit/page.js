'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Server } from 'lucide-react'
import { EmptyState, PageHeader, PageLoader, useToast } from '@/Components/Admin/ui'
import SiteForm, { siteToForm } from '@/Components/Admin/DevOps/SiteForm'
import { devopsApi } from '@/Components/Admin/DevOps/api'

export default function EditSitePage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const notify = useToast()
  const [site, setSite] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    devopsApi(`/api/devops/sites/${id}`)
      .then(data => setSite(data.site))
      .catch(err => (err.status === 404 ? router.push('/admin/devops/sites') : setError(err.message)))
  }, [id, router])

  async function save(values) {
    await devopsApi(`/api/devops/sites/${id}`, { method: 'PATCH', body: values })
    notify('Site saved', 'success')
    router.push(`/admin/devops/sites/${id}`)
  }

  if (error) return <EmptyState icon={Server} title="Couldn't load this site" description={error} />
  if (!site) return <PageLoader />

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Sites', href: '/admin/devops/sites' }, { label: site.name, href: `/admin/devops/sites/${id}` }, { label: 'Edit' }]}
        title={`Edit ${site.name}`}
      />
      <SiteForm initial={siteToForm(site)} submitLabel="Save changes" onSubmit={save} cancelHref={`/admin/devops/sites/${id}`} />
    </div>
  )
}
