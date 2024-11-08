import { NextResponse } from 'next/server'
import PostService from '@/lib/services/PostService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const topics = await PostService.getTopics()
    return NextResponse.json(topics, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('API: Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
} 