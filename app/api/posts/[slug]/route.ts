import { NextResponse } from 'next/server'
import PostService from '@/lib/services/PostService'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await PostService.getPost(params.slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 在服务器端处理 MDX
    const { content } = matter(post.body.raw)
    const mdxSource = await serialize(content)

    // 返回处理后的数据
    return NextResponse.json({
      post,
      mdxSource
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error('API: Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
} 