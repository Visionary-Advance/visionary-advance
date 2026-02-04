'use client'

import { useState } from 'react'

// Generate a random API key
function generateAPIKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const segments = []
  for (let s = 0; s < 4; s++) {
    let segment = ''
    for (let i = 0; i < 8; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  return `devops_${segments.join('_')}`
}

const HEALTH_API_CODE = `// app/api/health/route.js
// Health API endpoint for VA DevOps monitoring

import { NextResponse } from 'next/server'

const serverStartTime = Date.now()
const API_KEY = process.env.HEALTH_CHECK_API_KEY

export async function GET(request) {
  // Optional: API key authentication
  if (API_KEY) {
    const providedKey = request.headers.get('x-api-key')
    if (providedKey !== API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: Math.floor((Date.now() - serverStartTime) / 1000),
    }

    // Memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage()
      health.memory = {
        usedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
        totalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
      }
    }

    health.environment = process.env.NODE_ENV || 'development'

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

export async function HEAD(request) {
  if (API_KEY) {
    const providedKey = request.headers.get('x-api-key')
    if (providedKey !== API_KEY) {
      return new Response(null, { status: 401 })
    }
  }
  return new Response(null, { status: 200 })
}`

const HEALTH_API_CODE_FULL = `// app/api/health/route.js
// Health API endpoint for VA DevOps monitoring
// Full version with database checks

import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { supabase } from '@/lib/supabase'

const serverStartTime = Date.now()
const API_KEY = process.env.HEALTH_CHECK_API_KEY

export async function GET(request) {
  // Optional: API key authentication
  if (API_KEY) {
    const providedKey = request.headers.get('x-api-key')
    if (providedKey !== API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: Math.floor((Date.now() - serverStartTime) / 1000),
    }

    // Memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage()
      health.memory = {
        usedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
        totalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      }
    }

    // Database check (uncomment your database client)
    /*
    try {
      // For Prisma
      await prisma.$queryRaw\`SELECT 1\`
      health.database = { status: 'connected' }

      // For Supabase
      // const { error } = await supabase.from('health_check').select('id').limit(1)
      // health.database = { status: error ? 'error' : 'connected' }
    } catch (dbError) {
      health.database = { status: 'error', message: dbError.message }
      health.status = 'degraded'
    }
    */

    health.environment = process.env.NODE_ENV || 'development'

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

export async function HEAD(request) {
  if (API_KEY) {
    const providedKey = request.headers.get('x-api-key')
    if (providedKey !== API_KEY) {
      return new Response(null, { status: 401 })
    }
  }
  return new Response(null, { status: 200 })
}`

export default function HealthAPITemplate({ showFull = false }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [version, setVersion] = useState('simple') // 'simple' or 'full'
  const [apiKey, setApiKey] = useState('')
  const [keyCopied, setKeyCopied] = useState(false)
  const [envCopied, setEnvCopied] = useState(false)

  const code = version === 'full' ? HEALTH_API_CODE_FULL : HEALTH_API_CODE

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  function handleGenerateKey() {
    setApiKey(generateAPIKey())
    setKeyCopied(false)
    setEnvCopied(false)
  }

  async function copyApiKey() {
    try {
      await navigator.clipboard.writeText(apiKey)
      setKeyCopied(true)
      setTimeout(() => setKeyCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  async function copyEnvLine() {
    try {
      await navigator.clipboard.writeText(`HEALTH_CHECK_API_KEY=${apiKey}`)
      setEnvCopied(true)
      setTimeout(() => setEnvCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#262626]">
        <div>
          <h3 className="text-white font-semibold">Health API Template</h3>
          <p className="text-gray-400 text-sm mt-1">
            Add this endpoint to your client site at <code className="text-purple-400">/app/api/health/route.js</code>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="px-3 py-1.5 bg-[#171717] border border-[#262626] rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
          >
            <option value="simple">Simple</option>
            <option value="full">With DB Check</option>
          </select>
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code preview */}
      <div className="relative">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-3 bg-[#171717] text-gray-400 text-sm hover:bg-[#1a1a1a] transition-colors"
        >
          <span>{expanded ? 'Hide code' : 'Show code preview'}</span>
          <ChevronIcon className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="max-h-96 overflow-auto">
            <pre className="p-4 text-sm text-gray-300 font-mono leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-[#262626] bg-[#0d0d0d]">
        <h4 className="text-white text-sm font-medium mb-2">Quick Setup</h4>
        <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
          <li>Copy the code above</li>
          <li>Create <code className="text-purple-400">/app/api/health/route.js</code> in your client project</li>
          <li>Paste the code and save</li>
          <li>(Optional) Generate an API key below for authentication</li>
        </ol>
      </div>

      {/* API Key Generator */}
      <div className="p-4 border-t border-[#262626]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-white text-sm font-medium">API Key Authentication</h4>
            <p className="text-gray-500 text-xs mt-0.5">Optional - protects the health endpoint from public access</p>
          </div>
          <button
            onClick={handleGenerateKey}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#171717] border border-[#262626] rounded-lg text-sm text-gray-300 hover:border-purple-500 hover:text-white transition-colors"
          >
            <KeyIcon className="w-4 h-4" />
            Generate Key
          </button>
        </div>

        {apiKey && (
          <div className="space-y-3">
            {/* Generated Key */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-[#171717] border border-[#262626] rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
                {apiKey}
              </div>
              <button
                onClick={copyApiKey}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  keyCopied
                    ? 'bg-green-600 text-white'
                    : 'bg-[#262626] text-gray-300 hover:bg-[#333] hover:text-white'
                }`}
              >
                {keyCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                {keyCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Env line */}
            <div>
              <p className="text-gray-400 text-xs mb-1.5">Add to client site's <code className="text-purple-400">.env</code>:</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-[#171717] border border-[#262626] rounded-lg font-mono text-xs text-gray-300 overflow-x-auto">
                  HEALTH_CHECK_API_KEY={apiKey}
                </div>
                <button
                  onClick={copyEnvLine}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    envCopied
                      ? 'bg-green-600 text-white'
                      : 'bg-[#262626] text-gray-300 hover:bg-[#333] hover:text-white'
                  }`}
                >
                  {envCopied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                  {envCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Reminder */}
            <div className="flex items-start gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <InfoIcon className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <p className="text-purple-300 text-xs">
                Remember to also paste this key in the "API Key" field when adding this site to the DevOps dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for inline use
export function HealthAPITemplateCompact() {
  const [copied, setCopied] = useState(false)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(HEALTH_API_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={copyToClipboard}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        copied
          ? 'bg-green-600/20 text-green-400 border border-green-600/30'
          : 'bg-[#171717] text-gray-300 border border-[#262626] hover:border-purple-500 hover:text-white'
      }`}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          Copy Health API
        </>
      )}
    </button>
  )
}

function CopyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function KeyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  )
}

function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
}
