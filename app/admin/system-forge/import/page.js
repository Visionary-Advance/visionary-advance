// app/admin/system-forge/import/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImportWizard from '@/Components/Admin/SystemForge/ImportWizard'

export default function ImportPage() {
  const router = useRouter()
  const [source, setSource] = useState(null) // 'github' or 'local'

  const handleImportComplete = (modules) => {
    // Redirect to vault after successful import
    router.push('/admin/system-forge/vault')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#fafafa]">Import Code</h1>
        <p className="mt-1 text-sm text-[#a1a1aa]">
          Import modules from GitHub repositories or local files
        </p>
      </div>

      {/* Source Selection */}
      {!source && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => setSource('github')}
            className="group rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 text-left transition-colors hover:border-[#008070]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#171717] text-[#fafafa] group-hover:bg-[#008070]">
                <GitHubIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-[#fafafa]">GitHub Repository</p>
                <p className="text-sm text-[#a1a1aa]">Import from public or private repos</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSource('local')}
            className="group rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 text-left transition-colors hover:border-[#008070]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#171717] text-[#fafafa] group-hover:bg-[#008070]">
                <FolderIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-[#fafafa]">Local Files</p>
                <p className="text-sm text-[#a1a1aa]">Import from local file paths</p>
              </div>
            </div>
          </button>

          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#171717] text-[#525252]">
                <CloudIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-[#525252]">URL / Gist</p>
                <p className="text-sm text-[#525252]">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Wizard */}
      {source && (
        <div>
          <button
            onClick={() => setSource(null)}
            className="mb-4 flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Choose different source
          </button>
          <ImportWizard
            source={source}
            onComplete={handleImportComplete}
            onCancel={() => setSource(null)}
          />
        </div>
      )}
    </div>
  )
}

// Icons
function GitHubIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  )
}

function FolderIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  )
}

function CloudIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </svg>
  )
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}
