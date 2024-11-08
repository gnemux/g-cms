import { NextRequest, NextResponse } from 'next/server'
import PostService from '@/lib/services/PostService'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    const asset = await PostService.getAsset(path)

    if (!asset) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return new NextResponse(asset.buffer, {
      headers: {
        'Content-Type': asset.contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving asset:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 