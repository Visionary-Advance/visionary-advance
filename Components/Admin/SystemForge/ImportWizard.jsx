// Components/Admin/SystemForge/ImportWizard.jsx
'use client'

import { useState } from 'react'
import TypeBadge from './TypeBadge'

export default function ImportWizard({ source, onComplete, onCancel }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Source input
  const [githubUrl, setGithubUrl] = useState('')
  const [localPaths, setLocalPaths] = useState('')

  // Analysis result
  const [analysis, setAnalysis] = useState(null)

  // Selected modules to create
  const [selectedModules, setSelectedModules] = useState([])

  // Step 1: Analyze source
  async function handleAnalyze() {
    setLoading(true)
    setError(null)

    try {
      const endpoint = source === 'github'
        ? '/api/system-forge/import/github'
        : '/api/system-forge/import/local'

      const body = source === 'github'
        ? { action: 'analyze', url: githubUrl }
        : { action: 'analyze', paths: localPaths.split('\n').filter(Boolean) }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysis(data)
      // Pre-select all suggested modules
      setSelectedModules(data.suggestedModules?.map((m, i) => ({
        ...m,
        id: i,
        selected: true,
        name: m.name,
        type: m.type || 'module',
        category: ''
      })) || [])
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Update module selections
  function toggleModule(id) {
    setSelectedModules(modules =>
      modules.map(m => m.id === id ? { ...m, selected: !m.selected } : m)
    )
  }

  function updateModule(id, field, value) {
    setSelectedModules(modules =>
      modules.map(m => m.id === id ? { ...m, [field]: value } : m)
    )
  }

  // Step 3: Import selected modules
  async function handleImport() {
    setLoading(true)
    setError(null)

    const modulesToImport = selectedModules.filter(m => m.selected)
    if (modulesToImport.length === 0) {
      setError('No modules selected')
      setLoading(false)
      return
    }

    try {
      // First, fetch file contents
      const endpoint = source === 'github'
        ? '/api/system-forge/import/github'
        : '/api/system-forge/import/local'

      // Collect all files from selected modules
      const allFiles = []
      for (const mod of modulesToImport) {
        for (const file of mod.files) {
          allFiles.push({
            path: file.path,
            fullPath: file.fullPath,
            moduleIndex: mod.id
          })
        }
      }

      const body = source === 'github'
        ? { action: 'import', url: githubUrl, selectedFiles: allFiles }
        : { action: 'import', selectedFiles: allFiles }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const importData = await res.json()

      if (!res.ok) {
        throw new Error(importData.error || 'Import failed')
      }

      // Create modules with their files
      const createdModules = []
      for (const mod of modulesToImport) {
        // Get files for this module
        const moduleFiles = importData.files.filter(f =>
          mod.files.some(mf => mf.path === f.file_path)
        )

        // Create the module
        const moduleRes = await fetch('/api/system-forge/modules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: mod.name,
            description: `Imported from ${source === 'github' ? githubUrl : 'local files'}`,
            type: mod.type,
            category: mod.category || null
          })
        })

        if (!moduleRes.ok) continue

        const newModule = await moduleRes.json()

        // Add files to the module
        if (moduleFiles.length > 0) {
          await fetch(`/api/system-forge/modules/${newModule.id}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(moduleFiles)
          })
        }

        createdModules.push(newModule)
      }

      onComplete(createdModules)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              step >= s
                ? 'bg-[#008070] text-white'
                : 'bg-[#262626] text-[#525252]'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`h-0.5 w-8 ${step > s ? 'bg-[#008070]' : 'bg-[#262626]'}`} />
            )}
          </div>
        ))}
        <span className="ml-4 text-sm text-[#a1a1aa]">
          {step === 1 ? 'Enter Source' : step === 2 ? 'Review Modules' : 'Import'}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Step 1: Enter Source */}
      {step === 1 && (
        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6">
          {source === 'github' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                />
              </div>
              <p className="text-xs text-[#525252]">
                Enter a GitHub repository URL. Make sure GITHUB_TOKEN is configured for private repos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#a1a1aa]">
                  Local Paths
                </label>
                <textarea
                  value={localPaths}
                  onChange={(e) => setLocalPaths(e.target.value)}
                  rows={4}
                  placeholder="C:\path\to\folder&#10;C:\path\to\another\folder"
                  className="mt-1 w-full rounded-lg border border-[#262626] bg-[#171717] py-2.5 px-4 font-mono text-sm text-[#fafafa] placeholder-[#525252] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                />
              </div>
              <p className="text-xs text-[#525252]">
                Enter local file or folder paths, one per line.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#171717]"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading || (source === 'github' ? !githubUrl : !localPaths.trim())}
              className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Review Modules */}
      {step === 2 && analysis && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-4">
            <p className="text-sm text-[#a1a1aa]">
              Found <span className="text-[#fafafa] font-medium">{analysis.totalFiles}</span> files in{' '}
              <span className="text-[#fafafa] font-medium">{selectedModules.length}</span> suggested modules
            </p>
          </div>

          <div className="space-y-3">
            {selectedModules.map((mod) => (
              <div
                key={mod.id}
                className={`rounded-xl border p-4 transition-colors ${
                  mod.selected
                    ? 'border-[#008070] bg-[#008070]/5'
                    : 'border-[#262626] bg-[#0a0a0a]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={mod.selected}
                    onChange={() => toggleModule(mod.id)}
                    className="mt-1 h-4 w-4 rounded border-[#262626] bg-[#171717] text-[#008070] focus:ring-[#008070]"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={mod.name}
                        onChange={(e) => updateModule(mod.id, 'name', e.target.value)}
                        className="flex-1 rounded-lg border border-[#262626] bg-[#171717] py-1.5 px-3 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                      />
                      <select
                        value={mod.type}
                        onChange={(e) => updateModule(mod.id, 'type', e.target.value)}
                        className="rounded-lg border border-[#262626] bg-[#171717] py-1.5 px-3 text-sm text-[#fafafa] focus:border-[#008070] focus:outline-none focus:ring-1 focus:ring-[#008070]"
                      >
                        <option value="module">Module</option>
                        <option value="component">Component</option>
                        <option value="snippet">Snippet</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mod.files.slice(0, 5).map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded bg-[#171717] px-1.5 py-0.5 text-xs text-[#525252]"
                        >
                          {f.path.split('/').pop()}
                        </span>
                      ))}
                      {mod.files.length > 5 && (
                        <span className="text-xs text-[#525252]">
                          +{mod.files.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-[#fafafa] hover:bg-[#171717]"
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={loading || selectedModules.filter(m => m.selected).length === 0}
              className="rounded-lg bg-[#008070] px-4 py-2 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50"
            >
              {loading ? 'Importing...' : `Import ${selectedModules.filter(m => m.selected).length} Modules`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
