// templates/api-health.js
// Health API endpoint template for client sites
// Copy this file to your client site's /app/api/health/route.js

import { NextResponse } from 'next/server'

// Optional: Import your database client to check DB connection
// import { prisma } from '@/lib/prisma'
// import { supabase } from '@/lib/supabase'

// Store server start time for uptime calculation
const serverStartTime = Date.now()

// Optional: Configure API key authentication
const API_KEY = process.env.HEALTH_CHECK_API_KEY

export async function GET(request) {
  // Optional: API key authentication
  if (API_KEY) {
    const providedKey = request.headers.get('x-api-key')
    if (providedKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      uptime: Math.floor((Date.now() - serverStartTime) / 1000),
    }

    // Memory usage (Node.js)
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage()
      health.memory = {
        usedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
        totalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      }
    }

    // Optional: Database check
    // Uncomment and modify based on your database client
    /*
    try {
      // For Prisma
      await prisma.$queryRaw`SELECT 1`
      health.database = { status: 'connected' }

      // For Supabase
      // const { error } = await supabase.from('health_check').select('id').limit(1)
      // health.database = { status: error ? 'error' : 'connected' }
    } catch (dbError) {
      health.database = { status: 'error', message: dbError.message }
      health.status = 'degraded'
    }
    */

    // Optional: External service checks
    /*
    const externalServices = {}

    // Example: Check an external API
    try {
      const res = await fetch('https://api.example.com/health', {
        signal: AbortSignal.timeout(5000)
      })
      externalServices.exampleApi = res.ok ? 'healthy' : 'unhealthy'
    } catch {
      externalServices.exampleApi = 'unreachable'
      health.status = 'degraded'
    }

    health.services = externalServices
    */

    // Optional: Environment info
    health.environment = process.env.NODE_ENV || 'development'

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Also support HEAD requests for simple up/down checks
export async function HEAD(request) {
  if (API_KEY) {
    const providedKey = request.headers.get('x-api-key')
    if (providedKey !== API_KEY) {
      return new Response(null, { status: 401 })
    }
  }

  return new Response(null, { status: 200 })
}

/*
USAGE INSTRUCTIONS:

1. Copy this file to your Next.js project at:
   /app/api/health/route.js

2. (Optional) Add environment variable for API key:
   HEALTH_CHECK_API_KEY=your-secret-key

3. (Optional) Uncomment and configure database checks

4. The endpoint will be available at:
   https://your-site.com/api/health

RESPONSE FORMAT:
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "usedMb": 50,
    "totalMb": 100,
    "rss": 80
  },
  "database": {
    "status": "connected"
  },
  "environment": "production"
}

The VA DevOps monitor will call this endpoint and track:
- Response time
- HTTP status code
- Health status (healthy/degraded/unhealthy)
- Database status (if provided)
- Memory usage (if provided)
- Version (for deployment tracking)
*/
