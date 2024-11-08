import { NextRequest, NextResponse } from 'next/server'
import { postCache } from '@/lib/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Add this config to tell Next.js this is a dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Only allow admin access
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // Get cache status
    const cacheState = postCache.getDebugInfo()

    return NextResponse.json({
      initialized: postCache.isInitialized(),
      enabled: postCache.isCacheEnabled(),
      cacheSize: cacheState.size,
      cacheKeys: Array.from(cacheState.keys()),
      cacheData: Object.fromEntries(cacheState.entries()),
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Error fetching cache info:', error)
    return NextResponse.json({ error: 'Failed to fetch cache info' }, { status: 500 })
  }
} 