// Components/Admin/SystemForge/RelationshipManager.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TypeBadge from './TypeBadge'

export default function RelationshipManager({ moduleId, parents, children, onUpdate }) {
  const [modules, setModules] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [relationshipType, setRelationshipType] = useState('contains')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchModules()
  }, [])

  async function fetchModules() {
    try {
      const res = await fetch('/api/system-forge/modules?limit=100')
      if (res.ok) {
        const data = await res.json()
        setModules(data.modules || [])
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error)
    }
  }

  async function handleAddRelationship(childId) {
    setLoading(true)
    try {
      const res = await fetch('/api/system-forge/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_id: moduleId,
          child_id: childId,
          relationship_type: relationshipType
        })
      })

      if (res.ok) {
        onUpdate()
        setShowAddModal(false)
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to add relationship')
      }
    } catch (error) {
      console.error('Failed to add relationship:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveRelationship(relationshipId) {
    if (!confirm('Remove this relationship?')) return

    try {
      const res = await fetch(`/api/system-forge/relationships?id=${relationshipId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to remove relationship:', error)
    }
  }

  // Filter out modules that already have relationships with this module
  const existingRelatedIds = [
    ...children.map(c => c.child?.id || c.child_id),
    ...parents.map(p => p.parent?.id || p.parent_id),
    moduleId
  ]
  const availableModules = modules.filter(m => !existingRelatedIds.includes(m.id))

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Contains (Children) */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
        <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
          <div>
            <h3 className="font-medium text-[#fafafa]">Contains</h3>
            <p className="text-xs text-[#525252]">Child modules this module includes</p>
          </div>
          <button
            onClick={() => {
              setRelationshipType('contains')
              setShowAddModal(true)
            }}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-1.5 text-sm text-[#fafafa] hover:bg-[#171717]"
          >
            Add
          </button>
        </div>
        <div className="divide-y divide-[#262626]">
          {children.filter(c => c.relationship_type === 'contains').length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#525252]">
              No child modules
            </div>
          ) : (
            children
              .filter(c => c.relationship_type === 'contains')
              .map((rel) => (
                <RelationshipItem
                  key={rel.id}
                  relationship={rel}
                  module={rel.child}
                  onRemove={() => handleRemoveRelationship(rel.id)}
                />
              ))
          )}
        </div>
      </div>

      {/* Depends On */}
      <div className="rounded-xl border border-[#262626] bg-[#0a0a0a]">
        <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
          <div>
            <h3 className="font-medium text-[#fafafa]">Depends On</h3>
            <p className="text-xs text-[#525252]">Modules this module requires</p>
          </div>
          <button
            onClick={() => {
              setRelationshipType('depends_on')
              setShowAddModal(true)
            }}
            className="rounded-lg border border-[#262626] bg-[#0a0a0a] px-3 py-1.5 text-sm text-[#fafafa] hover:bg-[#171717]"
          >
            Add
          </button>
        </div>
        <div className="divide-y divide-[#262626]">
          {children.filter(c => c.relationship_type === 'depends_on').length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[#525252]">
              No dependencies
            </div>
          ) : (
            children
              .filter(c => c.relationship_type === 'depends_on')
              .map((rel) => (
                <RelationshipItem
                  key={rel.id}
                  relationship={rel}
                  module={rel.child}
                  onRemove={() => handleRemoveRelationship(rel.id)}
                />
              ))
          )}
        </div>
      </div>

      {/* Parent Modules */}
      {parents.length > 0 && (
        <div className="lg:col-span-2 rounded-xl border border-[#262626] bg-[#0a0a0a]">
          <div className="border-b border-[#262626] px-6 py-4">
            <h3 className="font-medium text-[#fafafa]">Used By</h3>
            <p className="text-xs text-[#525252]">Parent modules that include this module</p>
          </div>
          <div className="divide-y divide-[#262626]">
            {parents.map((rel) => (
              <RelationshipItem
                key={rel.id}
                relationship={rel}
                module={rel.parent}
                showType
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Relationship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-[#262626] bg-[#0a0a0a]">
            <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
              <h3 className="font-medium text-[#fafafa]">
                Add {relationshipType === 'contains' ? 'Child Module' : 'Dependency'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded p-1 text-[#a1a1aa] hover:bg-[#171717] hover:text-[#fafafa]"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {availableModules.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-[#525252]">
                  No available modules
                </div>
              ) : (
                <div className="divide-y divide-[#262626]">
                  {availableModules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => handleAddRelationship(mod.id)}
                      disabled={loading}
                      className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-[#171717] disabled:opacity-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[#fafafa]">{mod.name}</p>
                        <p className="text-sm text-[#525252] truncate">{mod.description || 'No description'}</p>
                      </div>
                      <TypeBadge type={mod.type} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RelationshipItem({ relationship, module, onRemove, showType }) {
  if (!module) return null

  return (
    <div className="group flex items-center gap-3 px-6 py-3">
      <Link
        href={`/admin/system-forge/vault/${module.id}`}
        className="flex-1 min-w-0"
      >
        <p className="font-medium text-[#fafafa] hover:text-[#008070]">{module.name}</p>
      </Link>
      <TypeBadge type={module.type} />
      {showType && (
        <span className="text-xs text-[#525252]">
          {relationship.relationship_type === 'contains' ? 'contains' : 'depends on'}
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 rounded p-1 text-[#525252] hover:text-red-400 transition-opacity"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
