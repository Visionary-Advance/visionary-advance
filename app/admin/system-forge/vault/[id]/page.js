// app/admin/system-forge/vault/[id]/page.js
'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TypeBadge from '@/Components/Admin/SystemForge/TypeBadge'
import FileEditor from '@/Components/Admin/SystemForge/FileEditor'
import FileList from '@/Components/Admin/SystemForge/FileList'
import RelationshipManager from '@/Components/Admin/SystemForge/RelationshipManager'
import ModuleForm from '@/Components/Admin/SystemForge/ModuleForm'

export default function ModuleDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('files')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showAddFile, setShowAddFile] = useState(false)

  useEffect(() => {
    fetchModule()
  }, [id])

  async function fetchModule() {
    try {
      const res = await fetch(`/api/system-forge/modules/${id}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('Module not found')
        } else {
          setError('Failed to load module')
        }
        return
      }
      const data = await res.json()
      setModule(data)
      if (data.files?.length > 0 && !selectedFile) {
        setSelectedFile(data.files[0])
      }
    } catch (err) {
      setError('Failed to load module')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this module? This will also delete all files.')) {
      return
    }

    try {
      const res = await fetch(`/api/system-forge/modules/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/system-forge/vault')
      }
    } catch (error) {
      console.error('Failed to delete module:', error)
    }
  }

  async function handleFileCreate(fileData) {
    try {
      const res = await fetch(`/api/system-forge/modules/${id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData)
      })
      if (res.ok) {
        const newFile = await res.json()
        setModule({
          ...module,
          files: [...module.files, newFile]
        })
        setSelectedFile(newFile)
        setShowAddFile(false)
      }
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  }

  async function handleFileUpdate(fileId, content) {
    try {
      const res = await fetch(`/api/system-forge/files/${fileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      if (res.ok) {
        const updatedFile = await res.json()
        setModule({
          ...module,
          files: module.files.map(f => f.id === fileId ? updatedFile : f)
        })
        setSelectedFile(updatedFile)
      }
    } catch (error) {
      console.error('Failed to update file:', error)
    }
  }

  async function handleFileDelete(fileId) {
    if (!confirm('Delete this file?')) return

    try {
      const res = await fetch(`/api/system-forge/files/${fileId}`, { method: 'DELETE' })
      if (res.ok) {
        const newFiles = module.files.filter(f => f.id !== fileId)
        setModule({ ...module, files: newFiles })
        if (selectedFile?.id === fileId) {
          setSelectedFile(newFiles[0] || null)
        }
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] px-6 py-16 text-center">
        <p className="text-[#fafafa]">{error}</p>
        <Link
          href="/admin/system-forge/vault"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#008070] hover:text-[#00a08c]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Vault
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/system-forge/vault"
            className="mt-1 rounded-lg p-2 text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#fafafa]">{module.name}</h1>
              <TypeBadge type={module.type} />
            </div>
            <p className="mt-1 text-sm text-[#a1a1aa]">
              {module.description || 'No description'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#171717]"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
          <p className="text-sm text-[#a1a1aa]">Category</p>
          <p className="mt-1 font-medium text-[#fafafa]">{module.category || 'Uncategorized'}</p>
        </div>
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
          <p className="text-sm text-[#a1a1aa]">Files</p>
          <p className="mt-1 font-medium text-[#fafafa]">{module.files?.length || 0}</p>
        </div>
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
          <p className="text-sm text-[#a1a1aa]">Industry Tags</p>
          <p className="mt-1 font-medium text-[#fafafa]">
            {module.industry_tags?.length > 0 ? module.industry_tags.join(', ') : 'None'}
          </p>
        </div>
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
          <p className="text-sm text-[#a1a1aa]">Created</p>
          <p className="mt-1 font-medium text-[#fafafa]">
            {new Date(module.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#262626]">
        <nav className="flex gap-6">
          {['files', 'dependencies', 'relationships'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-[#008070] text-[#fafafa]'
                  : 'border-transparent text-[#a1a1aa] hover:text-[#fafafa]'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'files' && (
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* File List */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
            <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
              <p className="text-sm font-medium text-[#fafafa]">Files</p>
              <button
                onClick={() => setShowAddFile(true)}
                className="rounded p-1 text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <FileList
              files={module.files || []}
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
              onDelete={handleFileDelete}
            />
          </div>

          {/* Editor */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] overflow-hidden">
            {selectedFile ? (
              <FileEditor
                file={selectedFile}
                onSave={(content) => handleFileUpdate(selectedFile.id, content)}
              />
            ) : (
              <div className="flex items-center justify-center py-20 text-[#a1a1aa]">
                {module.files?.length === 0 ? 'No files yet' : 'Select a file to edit'}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'dependencies' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* NPM Dependencies */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
            <div className="border-b border-[#262626] px-6 py-4">
              <h3 className="font-medium text-[#fafafa]">NPM Dependencies</h3>
            </div>
            <div className="p-6">
              {Object.keys(module.dependencies || {}).length === 0 ? (
                <p className="text-sm text-[#a1a1aa]">No dependencies defined</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(module.dependencies).map(([name, version]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg bg-[#171717] px-4 py-2">
                      <span className="font-mono text-sm text-[#fafafa]">{name}</span>
                      <span className="text-sm text-[#a1a1aa]">{version}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
            <div className="border-b border-[#262626] px-6 py-4">
              <h3 className="font-medium text-[#fafafa]">Environment Variables</h3>
            </div>
            <div className="p-6">
              {(module.env_vars || []).length === 0 ? (
                <p className="text-sm text-[#a1a1aa]">No environment variables defined</p>
              ) : (
                <div className="space-y-2">
                  {module.env_vars.map((env, i) => (
                    <div key={i} className="rounded-lg bg-[#171717] px-4 py-2">
                      <span className="font-mono text-sm text-[#fafafa]">{env.name || env}</span>
                      {env.description && (
                        <p className="mt-1 text-xs text-[#a1a1aa]">{env.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'relationships' && (
        <RelationshipManager
          moduleId={id}
          parents={module.parents || []}
          children={module.children || []}
          onUpdate={fetchModule}
        />
      )}

      {/* Edit Module Modal */}
      {showEditForm && (
        <ModuleForm
          module={module}
          onClose={() => setShowEditForm(false)}
          onSuccess={(updated) => {
            setModule({ ...module, ...updated })
            setShowEditForm(false)
          }}
        />
      )}

      {/* Add File Modal */}
      {showAddFile && (
        <AddFileModal
          onClose={() => setShowAddFile(false)}
          onCreate={handleFileCreate}
        />
      )}
    </div>
  )
}

function AddFileModal({ onClose, onCreate }) {
  const [filePath, setFilePath] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!filePath.trim()) return

    setSaving(true)
    await onCreate({ file_path: filePath.trim(), content })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
        <h2 className="text-lg font-semibold text-[#fafafa]">Add File</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">File Path</label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="e.g., components/Button.jsx"
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa]">Initial Content (optional)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 font-mono text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#171717]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !filePath.trim()}
              className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Icons
function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}
