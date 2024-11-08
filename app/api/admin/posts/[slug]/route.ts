import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import PostService from '@/lib/services/PostService'

// Add dynamic route configuration
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    })
  }

  try {
    const post = await PostService.getPostBySlug(params.slug, { ignorePublished: true })
    
    if (!post) {
      return new NextResponse(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
      })
    }

    return new NextResponse(JSON.stringify(post))
  } catch (error) {
    console.error('Error fetching post:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()

    const { content, frontmatter } = body

    // Detailed data validation
    if (!frontmatter) {
      return NextResponse.json({ error: 'Frontmatter is required' }, { status: 400 })
    }

    // Ensure published is a boolean value
    const processedFrontmatter = {
      ...frontmatter,
      published: Boolean(frontmatter.published)
    }

    // Validate required fields (excluding published)
    const requiredFields = ['title', 'date', 'description', 'topic']
    const missingFields = requiredFields.filter(field => !processedFrontmatter[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Update post
    await PostService.updatePost(params.slug, content, processedFrontmatter)

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'X-Cache-Invalidated': 'true',
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    )
  } catch (error) {
    console.error('API: Error updating post:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Verify if user is logged in
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = params
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Delete post
    await PostService.deletePost(slug)

    return NextResponse.json({ success: true }, {
      headers: {
        'X-Cache-Invalidated': 'true',
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
} 