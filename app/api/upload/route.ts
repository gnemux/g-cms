import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import PostService from '@/lib/services/PostService'

export const dynamic = 'force-dynamic'

// Set maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024 

export async function POST(request: NextRequest) {
  try {
    // Verify if user is logged in
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get uploaded file data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds limit (${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)` 
      }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name
    const ext = originalName.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file using PostService
    const url = await PostService.uploadAsset(fileName, buffer)

    // Return complete URL
    return NextResponse.json({ 
      url: url.startsWith('/api') ? url : `/api/assets/${fileName}` 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
}