'use client'

import { useRef, useState } from 'react'
import { LoaderCircle, Paperclip, Upload } from 'lucide-react'
import { cx, focusRing, useToast } from '@/Components/Admin/ui'

export default function ReceiptUpload({ expenseId, currentUrl, onUploaded }) {
  const notify = useToast()
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
      const res = await fetch('/api/finance/expenses/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Upload failed')
      notify('Receipt attached', 'success')
      onUploaded?.()
    } catch (err) {
      notify(`Couldn't upload: ${err.message}`, 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cx('mb-2 inline-flex items-center gap-1.5 rounded text-sm text-adm-accent hover:underline', focusRing)}
        >
          <Paperclip className="h-3.5 w-3.5" aria-hidden /> View current receipt
        </a>
      )}

      <button
        type="button"
        disabled={uploading}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files?.[0]) }}
        onClick={() => fileRef.current?.click()}
        className={cx(
          'flex w-full cursor-pointer flex-col items-center rounded-lg border-2 border-dashed p-4 text-center transition-colors disabled:cursor-wait',
          dragOver ? 'border-teal-500/60 bg-teal-500/10' : 'border-adm-border hover:border-adm-border-strong',
          focusRing
        )}
      >
        {uploading ? (
          <span className="flex items-center gap-2 py-3 text-sm text-adm-muted">
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> Uploading…
          </span>
        ) : (
          <>
            <Upload className="h-6 w-6 text-adm-subtle" aria-hidden />
            <span className="mt-2 text-sm text-adm-muted">
              {currentUrl ? 'Replace receipt: ' : ''}drop a file or <span className="text-adm-accent">browse</span>
            </span>
            <span className="mt-1 text-xs text-adm-subtle">PDF, PNG or JPG, up to 10 MB</span>
          </>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => handleUpload(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  )
}
