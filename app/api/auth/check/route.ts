import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin-auth')

  if (!authCookie || authCookie.value !== 'true') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  return NextResponse.json({ authenticated: true })
} 