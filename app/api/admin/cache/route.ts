import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import PostService from '@/lib/services/PostService'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get cache information
    const cache = await PostService.getCacheInfo()
    return NextResponse.json(cache)
  } catch (error) {
    console.error('Error getting cache info:', error)
    return NextResponse.json(
      { error: 'Failed to get cache info' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clear cache
    await PostService.invalidateCache()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}