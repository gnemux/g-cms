import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import PostService from '@/lib/services/PostService'
import { Octokit } from '@octokit/rest'

// Create Octokit instance
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

// Add dynamic route configuration
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const posts = await PostService.getPosts(true)
    
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store',
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { content } = await request.json()

    // Extract frontmatter from content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!frontmatterMatch) {
      return NextResponse.json({ error: 'Invalid frontmatter format' }, { status: 400 })
    }

    const frontmatterContent = frontmatterMatch[1]
    const frontmatterLines = frontmatterContent.split('\n')
    const frontmatter: Record<string, any> = {}

    // Parse frontmatter
    frontmatterLines.forEach((line: string) => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim()
        frontmatter[key.trim()] = value
      }
    })

    // Ensure published field is boolean
    frontmatter.published = frontmatter.published === 'true'

    // Validate required fields
    const requiredFields = ['title', 'date', 'description', 'topic']
    const missingFields = requiredFields.filter(field => !frontmatter[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}-${randomStr}.mdx`

    // Commit to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: `content/posts/${fileName}`,
      message: `Add post: ${frontmatter.title}`,
      content: Buffer.from(content).toString('base64'),
      branch: 'content'
    })

    // Clear cache
    PostService.invalidateCache()

    return NextResponse.json(
      { success: true },
      { 
        headers: {
          'X-Cache-Invalidated': 'true'
        }
      }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

// ... Other methods remain unchanged ...