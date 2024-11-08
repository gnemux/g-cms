import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow direct access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // No token verification needed for login page
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        // Other admin paths require token verification
        return !!token
      }
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

// Only match routes starting with /admin
export const config = {
  matcher: '/admin/:path*'
} 