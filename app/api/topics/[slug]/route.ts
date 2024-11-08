import { NextResponse } from 'next/server'
import PostService from '@/lib/services/PostService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    console.log(`API: Fetching posts for topic: ${params.slug}`)
    
    // Get all posts, including unpublished ones
    const allPosts = await PostService.getPosts(true)
    
    // Decode topic name
    const decodedTopic = decodeURIComponent(params.slug)
    
    // Filter posts with case-insensitive comparison
    const topicPosts = allPosts.filter(post => {
      const postTopic = (post.topic || 'Uncategorized').toLowerCase()
      const targetTopic = decodedTopic.toLowerCase()
      const match = postTopic === targetTopic
      return match
    })

    return NextResponse.json(topicPosts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('API: Error fetching posts by topic:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
} 