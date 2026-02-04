// app/api/health/route.js
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
}