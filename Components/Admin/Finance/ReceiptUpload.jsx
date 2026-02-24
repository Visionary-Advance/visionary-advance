'use client'

import { useState, useRef } from 'react'

export default function ReceiptUpload({ expenseId, currentUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const handleUpload = async (file) => {
    if (!file || !expenseId) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('expenseId', expenseId)

      const res = await fetch('/api/finance/expenses/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }

      onUploaded?.()
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div>
      {currentUrl && (
        <div className="mb-2 flex items-center gap-2">
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400 hover:text-emerald-300 underline"
          >
            View current receipt
          </a>
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          dragOver
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-[#262626] hover:border-[#404040]'
        }`}
      >
        {uploading ? (
          <p className="text-sm text-[#a1a1aa]">Uploading...</p>
        ) : (
          <>
            <UploadIcon className="mx-auto h-8 w-8 text-[#525252]" />
            <p className="mt-2 text-sm text-[#a1a1aa]">
              Drop receipt here or <span className="text-emerald-400">browse</span>
            </p>
            <p className="mt-1 text-xs text-[#525252]">PDF, PNG, JPG up to 10MB</p>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

function UploadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}
