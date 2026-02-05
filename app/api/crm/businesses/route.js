// app/api/crm/businesses/route.js
// Business management API

import { NextResponse } from 'next/server'
import { getBusinesses, createBusiness, getIndustries, getBusinessStats } from '@/lib/businesses'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const industry = searchParams.get('industry')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const stats = searchParams.get('stats') === 'true'
    const industries = searchParams.get('industries') === 'true'

    // Get stats only
    if (stats) {
      const statsData = await getBusinessStats()
      return NextResponse.json(statsData)
    }

    // Get industries list only
    if (industries) {
      const industriesList = await getIndustries()
      return NextResponse.json({ industries: industriesList })
    }

    // Get businesses list
    const { businesses, total } = await getBusinesses({ search, industry, limit, offset })

    return NextResponse.json({ businesses, total })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.name) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      )
    }

    const business = await createBusiness(data)

    return NextResponse.json({ business }, { status: 201 })
  } catch (error) {
    console.error('Error creating business:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
