import { NextResponse } from 'next/server'
import PostService from '@/lib/services/PostService'

export const dynamic = 'force-dynamic' // Disable route caching
export const revalidate = 0 // Disable data caching

export async function GET() {
  try {
    const posts = await PostService.getPosts()
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate', // Disable browser caching
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('API: Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
} 