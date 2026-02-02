// Components/Admin/SystemForge/FileEditor.jsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Simple code editor without CodeMirror for initial implementation
// Can be upgraded to CodeMirror later
export default function FileEditor({ file, onSave }) {
  const [content, setContent] = useState(file?.content || '')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    setContent(file?.content || '')
    setHasChanges(false)
  }, [file?.id, file?.content])

  const handleChange = (e) => {
    setContent(e.target.value)
    setHasChanges(e.target.value !== file?.content)
  }

  const handleSave = async () => {
    if (!hasChanges) return
    setSaving(true)
    await onSave(content)
    setHasChanges(false)
    setSaving(false)
  }

  const handleKeyDown = useCallback((e) => {
    // Cmd/Ctrl + S to save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    // Tab to indent
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newContent = content.substring(0, start) + '  ' + content.substring(end)
      setContent(newContent)
      setHasChanges(newContent !== file?.content)
      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }, [content, file?.content, hasChanges])

  if (!file) {
    return (
      <div className="flex items-center justify-center py-20 text-[#a1a1aa]">
        Select a file to edit
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[#fafafa]">{file.file_path}</span>
          {file.language && (
            <span className="rounded bg-[#262626] px-1.5 py-0.5 text-xs text-[#525252]">
              {file.language}
            </span>
          )}
          {hasChanges && (
            <span className="h-2 w-2 rounded-full bg-amber-500" title="Unsaved changes" />
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="rounded-lg bg-[#008070] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#006b5d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          {/* Line numbers */}
          <div className="w-12 flex-shrink-0 border-r border-[#262626] bg-[#0a0a0a] py-3 overflow-hidden">
            <div className="text-right pr-2 font-mono text-xs text-[#525252] leading-6">
              {content.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          </div>

          {/* Code area */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="flex-1 resize-none bg-transparent p-3 font-mono text-sm text-[#fafafa] leading-6 outline-none overflow-auto"
            style={{
              tabSize: 2,
              MozTabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#262626] px-4 py-2 text-xs text-[#525252]">
        <span>Lines: {content.split('\n').length}</span>
        <span className="mx-3">|</span>
        <span>Chars: {content.length}</span>
        <span className="mx-3">|</span>
        <span>Cmd/Ctrl+S to save</span>
      </div>
    </div>
  )
}
