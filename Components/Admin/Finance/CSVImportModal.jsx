'use client'

import { useState, useRef, useCallback } from 'react'
import {
  parseCSV,
  autoMapColumns,
  validateRow,
  mapRow,
  TARGET_FIELDS,
  REQUIRED_FIELDS,
} from '@/lib/csv-parser'
import { formatCurrency, EXPENSE_CATEGORIES } from '@/lib/finance'

export default function CSVImportModal({ isOpen, onClose, onComplete, type }) {
  const [step, setStep] = useState(1)
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState('')
  const [headers, setHeaders] = useState([])
  const [rawRows, setRawRows] = useState([])
  const [columnMapping, setColumnMapping] = useState({})
  const [validatedRows, setValidatedRows] = useState([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef(null)

  const reset = () => {
    setStep(1)
    setDragOver(false)
    setFileName('')
    setHeaders([])
    setRawRows([])
    setColumnMapping({})
    setValidatedRows([])
    setImporting(false)
    setResult(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // ============ STEP 1: FILE UPLOAD ============

  const processFile = useCallback((file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['csv', 'tsv', 'txt'].includes(ext)) {
      alert('Please upload a .csv or .tsv file')
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const { headers: h, rows: r } = parseCSV(text)
      setHeaders(h)
      setRawRows(r)
      const autoMap = autoMapColumns(h, type)
      setColumnMapping(autoMap)
      setStep(2)
    }
    reader.readAsText(file)
  }, [type])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0])
  }

  // ============ STEP 2: COLUMN MAPPING ============

  const updateMapping = (csvCol, dbField) => {
    setColumnMapping(prev => ({ ...prev, [csvCol]: dbField }))
  }

  const requiredFields = REQUIRED_FIELDS[type] || []
  const targetFields = TARGET_FIELDS[type] || {}

  const mappedRequiredFields = requiredFields.filter(rf =>
    Object.values(columnMapping).includes(rf)
  )
  const allRequiredMapped = requiredFields.every(rf =>
    Object.values(columnMapping).includes(rf)
  )

  const goToPreview = () => {
    // Map and validate all rows
    const results = rawRows.map((raw, idx) => {
      const mapped = mapRow(raw, columnMapping)
      const validation = validateRow(mapped, type)
      return { index: idx, raw, mapped, ...validation }
    })
    setValidatedRows(results)
    setStep(3)
  }

  // ============ STEP 3: PREVIEW & IMPORT ============

  const validCount = validatedRows.filter(r => r.valid).length
  const invalidCount = validatedRows.filter(r => !r.valid).length

  const handleImport = async () => {
    const validRows = validatedRows.filter(r => r.valid).map(r => r.data)
    if (validRows.length === 0) return

    setImporting(true)
    try {
      const res = await fetch('/api/finance/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, rows: validRows }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      setResult(data)
    } catch (err) {
      setResult({ error: err.message })
    } finally {
      setImporting(false)
    }
  }

  const handleDone = () => {
    handleClose()
    onComplete?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#262626] bg-[#0a0a0a] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#fafafa]">
              Import {type === 'income' ? 'Income' : 'Expenses'} from CSV
            </h2>
            <p className="mt-0.5 text-sm text-[#525252]">
              Step {step} of 3 — {step === 1 ? 'Upload' : step === 2 ? 'Map Columns' : 'Preview & Import'}
            </p>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-[#525252] hover:bg-[#171717] hover:text-[#fafafa] transition-colors">
            <XIcon />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 px-6 pt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-emerald-500' : 'bg-[#262626]'}`} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 1 && (
            <Step1Upload
              dragOver={dragOver}
              setDragOver={setDragOver}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              fileRef={fileRef}
            />
          )}

          {step === 2 && (
            <Step2Mapping
              headers={headers}
              rawRows={rawRows}
              columnMapping={columnMapping}
              updateMapping={updateMapping}
              targetFields={targetFields}
              requiredFields={requiredFields}
              mappedRequiredFields={mappedRequiredFields}
              type={type}
            />
          )}

          {step === 3 && !result && (
            <Step3Preview
              validatedRows={validatedRows}
              validCount={validCount}
              invalidCount={invalidCount}
              type={type}
            />
          )}

          {step === 3 && result && (
            <ImportResult result={result} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#262626] px-6 py-4">
          <div>
            {step > 1 && !result && (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:bg-[#171717] transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="rounded-lg border border-[#262626] px-4 py-2 text-sm font-medium text-[#a1a1aa] hover:bg-[#171717] transition-colors"
            >
              Cancel
            </button>

            {step === 2 && (
              <button
                onClick={goToPreview}
                disabled={!allRequiredMapped}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Preview Rows
              </button>
            )}

            {step === 3 && !result && (
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {importing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Importing...
                  </span>
                ) : (
                  `Import ${validCount} Row${validCount !== 1 ? 's' : ''}`
                )}
              </button>
            )}

            {step === 3 && result && (
              <button
                onClick={handleDone}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ STEP 1 COMPONENT ============

function Step1Upload({ dragOver, setDragOver, handleDrop, handleFileChange, fileRef }) {
  return (
    <div className="flex flex-col items-center py-8">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`w-full cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-[#262626] hover:border-[#404040]'
        }`}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-[#525252]" />
        <p className="mt-4 text-sm text-[#a1a1aa]">
          Drag and drop your CSV file here, or{' '}
          <span className="text-emerald-400 font-medium">browse</span>
        </p>
        <p className="mt-2 text-xs text-[#525252]">
          Accepts .csv and .tsv files exported from Google Sheets, Excel, etc.
        </p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.tsv,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

// ============ STEP 2 COMPONENT ============

function Step2Mapping({ headers, rawRows, columnMapping, updateMapping, targetFields, requiredFields, mappedRequiredFields, type }) {
  const previewRows = rawRows.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* File info */}
      <div className="rounded-lg border border-[#262626] bg-[#171717] p-3">
        <p className="text-sm text-[#a1a1aa]">
          <span className="text-[#fafafa] font-medium">{rawRows.length}</span> rows found with{' '}
          <span className="text-[#fafafa] font-medium">{headers.length}</span> columns
        </p>
      </div>

      {/* Required fields status */}
      <div className="flex flex-wrap gap-2">
        {requiredFields.map(rf => {
          const isMapped = mappedRequiredFields.includes(rf)
          const label = targetFields[rf] || rf
          return (
            <span
              key={rf}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                isMapped
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isMapped ? <CheckIcon /> : <AlertIcon />}
              {label} *
            </span>
          )
        })}
      </div>

      {/* Mapping table */}
      <div className="overflow-x-auto rounded-xl border border-[#262626]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#262626] bg-[#171717]">
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">CSV Column</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Maps To</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Sample Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {headers.map(header => (
              <tr key={header} className="bg-[#0a0a0a]">
                <td className="px-4 py-2.5 text-sm font-medium text-[#fafafa]">{header}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={columnMapping[header] || '_skip'}
                    onChange={(e) => updateMapping(header, e.target.value)}
                    className={`w-full rounded-lg border px-2.5 py-1.5 text-sm focus:outline-none transition-colors ${
                      columnMapping[header] === '_skip'
                        ? 'border-[#262626] bg-[#171717] text-[#525252]'
                        : 'border-emerald-500/50 bg-[#171717] text-[#fafafa]'
                    }`}
                  >
                    {Object.entries(targetFields).map(([key, label]) => (
                      <option key={key} value={key}>{label}{requiredFields.includes(key) ? ' *' : ''}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#525252] max-w-[200px] truncate">
                  {previewRows.map((r, i) => r[header]).filter(Boolean).slice(0, 2).join(', ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-[#a1a1aa]">Raw Data Preview (first 3 rows)</h3>
        <div className="overflow-x-auto rounded-lg border border-[#262626]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#262626] bg-[#171717]">
                {headers.map(h => (
                  <th key={h} className="px-3 py-2 text-left font-medium text-[#525252] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {previewRows.map((row, i) => (
                <tr key={i} className="bg-[#0a0a0a]">
                  {headers.map(h => (
                    <td key={h} className="px-3 py-2 text-[#a1a1aa] whitespace-nowrap max-w-[150px] truncate">
                      {row[h] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============ STEP 3 COMPONENT ============

function Step3Preview({ validatedRows, validCount, invalidCount, type }) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex gap-4">
        <div className="flex-1 rounded-lg border border-[#262626] bg-[#171717] p-3 text-center">
          <p className="text-2xl font-semibold text-emerald-400">{validCount}</p>
          <p className="text-xs text-[#525252]">Valid rows</p>
        </div>
        {invalidCount > 0 && (
          <div className="flex-1 rounded-lg border border-[#262626] bg-[#171717] p-3 text-center">
            <p className="text-2xl font-semibold text-red-400">{invalidCount}</p>
            <p className="text-xs text-[#525252]">Invalid rows</p>
          </div>
        )}
        <div className="flex-1 rounded-lg border border-[#262626] bg-[#171717] p-3 text-center">
          <p className="text-2xl font-semibold text-[#fafafa]">
            {formatCurrency(validatedRows.filter(r => r.valid).reduce((sum, r) => sum + (r.data.amount || 0), 0))}
          </p>
          <p className="text-xs text-[#525252]">Total amount</p>
        </div>
      </div>

      {/* Rows table */}
      <div className="overflow-x-auto rounded-xl border border-[#262626]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#262626] bg-[#171717]">
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252] w-8">#</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Status</th>
              {type === 'income' ? (
                <>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Client</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Amount</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Date</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Method</th>
                </>
              ) : (
                <>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Description</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Amount</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Date</th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Category</th>
                </>
              )}
              <th className="px-3 py-2.5 text-left text-xs font-medium uppercase text-[#525252]">Issues</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {validatedRows.map((row) => (
              <tr key={row.index} className={`${row.valid ? 'bg-[#0a0a0a]' : 'bg-red-500/5'}`}>
                <td className="px-3 py-2 text-xs text-[#525252]">{row.index + 1}</td>
                <td className="px-3 py-2">
                  {row.valid ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                      <CheckIcon className="text-emerald-400" />
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20">
                      <AlertIcon className="text-red-400" />
                    </span>
                  )}
                </td>
                {type === 'income' ? (
                  <>
                    <td className="px-3 py-2 text-[#fafafa]">{row.data.client_name || row.mapped.client_name || '—'}</td>
                    <td className="px-3 py-2 text-green-400 font-medium">{row.data.amount ? formatCurrency(row.data.amount) : '—'}</td>
                    <td className="px-3 py-2 text-[#a1a1aa]">{row.data.date_paid || '—'}</td>
                    <td className="px-3 py-2 text-[#a1a1aa]">{row.data.payment_method || '—'}</td>
                  </>
                ) : (
                  <>
                    <td className="px-3 py-2 text-[#fafafa]">{row.data.description || row.mapped.description || '—'}</td>
                    <td className="px-3 py-2 text-red-400 font-medium">{row.data.amount ? formatCurrency(row.data.amount) : '—'}</td>
                    <td className="px-3 py-2 text-[#a1a1aa]">{row.data.date || '—'}</td>
                    <td className="px-3 py-2 text-[#a1a1aa] text-xs">
                      {row.data.category ? (EXPENSE_CATEGORIES[row.data.category]?.label || row.data.category) : '—'}
                    </td>
                  </>
                )}
                <td className="px-3 py-2 text-xs text-red-400 max-w-[200px]">
                  {row.errors.length > 0 ? row.errors.join('; ') : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============ RESULT COMPONENT ============

function ImportResult({ result }) {
  if (result.error) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="rounded-full bg-red-500/20 p-4">
          <AlertIcon className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[#fafafa]">Import Failed</h3>
        <p className="mt-2 text-sm text-[#a1a1aa]">{result.error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="rounded-full bg-emerald-500/20 p-4">
        <CheckIcon className="h-8 w-8 text-emerald-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#fafafa]">Import Complete</h3>
      <p className="mt-2 text-sm text-[#a1a1aa]">
        Successfully imported <span className="text-emerald-400 font-medium">{result.imported}</span> row{result.imported !== 1 ? 's' : ''}
        {result.failed > 0 && (
          <>, <span className="text-red-400 font-medium">{result.failed}</span> failed</>
        )}
      </p>
      {result.errors?.length > 0 && (
        <div className="mt-4 w-full max-w-md rounded-lg border border-[#262626] bg-[#171717] p-3">
          <p className="text-xs font-medium text-red-400 mb-2">Errors:</p>
          <ul className="space-y-1 text-xs text-[#a1a1aa]">
            {result.errors.slice(0, 10).map((err, i) => (
              <li key={i}>
                Row {err.index !== undefined ? err.index + 1 : `Batch ${err.batch}`}: {err.errors?.join(', ')}
              </li>
            ))}
            {result.errors.length > 10 && (
              <li className="text-[#525252]">...and {result.errors.length - 10} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============ ICONS ============

function XIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function UploadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={`h-3.5 w-3.5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function AlertIcon({ className }) {
  return (
    <svg className={`h-3.5 w-3.5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
}
