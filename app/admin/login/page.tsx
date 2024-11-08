'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

/**
 * Admin login page component
 * Provides username and password login functionality
 */
export default function LoginPage() {
  // Router and query parameters
  const router = useRouter()
  const searchParams = useSearchParams()

  // State management
  const [username, setUsername] = useState('')           // Username
  const [password, setPassword] = useState('')           // Password
  const [error, setError] = useState('')                // Error message
  const [isLoading, setIsLoading] = useState(false)     // Loading state

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Reset state
    setError('')
    setIsLoading(true)

    try {
      // Get callback URL, default to admin homepage
      const callbackUrl = searchParams?.get('callbackUrl') || '/admin/posts'

      // Call NextAuth login
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl,
      })

      // Handle login result
      if (result?.ok) {
        window.location.href = callbackUrl
      } else {
        console.error('Login failed:', result?.error)
        setError('Invalid username or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed, please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[600px] flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-6">
        {/* Login form card */}
        <div className="bg-slate-800/50 rounded-2xl border border-[#B65051]/20 p-6">
          <h2 className="text-2xl font-bold text-amber-200 text-center mb-6">
            Admin Login
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username input */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-[#B65051]/20 bg-slate-800/50 placeholder-slate-400 text-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B65051]/50 focus:border-transparent"
                placeholder="Username"
              />
            </div>
            
            {/* Password input */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#B65051]/20 bg-slate-800/50 placeholder-slate-400 text-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B65051]/50 focus:border-transparent"
                placeholder="Password"
              />
            </div>

            {/* Error message display */}
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-[#B65051] hover:bg-[#B65051]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B65051] transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}