'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MarkdownEditor from '@/components/editor/MarkdownEditor'
import FrontmatterEditor from '@/components/editor/FrontmatterEditor'
import { invalidateNavigationCache } from '@/components/layout/Navigation'
import matter from 'gray-matter'

/**
 * Post edit page component
 * Provides editing functionality for post content and metadata
 */
export default function EditPost({ params }: { params: { slug: string } }) {
  // Router and session management
  const router = useRouter()
  const { data: session, status } = useSession()

  // State management
  const [post, setPost] = useState<any>(null)         // Post data
  const [loading, setLoading] = useState(true)        // Loading state
  const [saving, setSaving] = useState(false)         // Saving state

  /**
   * Authentication and post loading
   */
  useEffect(() => {
    // Redirect to login page when not authenticated
    if (status === 'unauthenticated') {
      const returnUrl = encodeURIComponent(`/admin/posts/${params.slug}/edit`)
      router.push(`/admin/login?callbackUrl=${returnUrl}`)
      return
    }

    // Load post when authenticated
    if (status === 'authenticated') {
      fetchPost()
    }
  }, [status, params.slug, router])

  /**
   * Fetch post data
   */
  const fetchPost = async () => {
    try {
      // Send request to get post
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Admin-Access': 'true'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch post')
      }

      // Parse post data
      const data = await response.json()
      const { data: frontmatter, content } = matter(data.body.raw)
      
      // Format date
      const formattedDate = new Date(frontmatter.date).toISOString().split('T')[0]
      
      // Update state
      setPost({
        ...data,
        frontmatter: {
          ...frontmatter,
          date: formattedDate
        },
        content
      })
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Save post
   */
  const handleSave = async () => {
    if (!post || !post.frontmatter) return

    setSaving(true)
    try {
      // Send save request
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: post.content,
          frontmatter: {
            title: post.frontmatter.title,
            date: post.frontmatter.date,
            description: post.frontmatter.description,
            topic: post.frontmatter.topic,
            published: Boolean(post.frontmatter.published)
          }
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update post')
      }

      // Update cache and redirect
      invalidateNavigationCache()
      router.push('/admin/posts')

    } catch (error) {
      console.error('Error updating post:', error)
      alert('Save failed: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  // Loading state display
  if (status === 'loading' || loading) {
    return (
      <div className="h-[calc(100vh-6rem)] bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  // Display when post doesn't exist
  if (!post) {
    return (
      <div className="h-[calc(100vh-6rem)] bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-slate-300">Post does not exist</div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-6rem)] bg-slate-900 p-6">
      <div className="h-full container mx-auto max-w-[90rem] flex flex-col">
        {/* Top action bar */}
        <div className="mb-6 flex items-center justify-between flex-none">
          <h1 className="text-xl font-bold text-amber-200">Edit Post</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/posts')}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-2 bg-[#B65051] text-white rounded-lg transition-colors text-sm ${
                saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#B65051]/90'
              }`}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Edit area */}
        <div className="grid grid-cols-[1fr,300px] gap-6 flex-1">
          {/* Markdown editor */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
            <MarkdownEditor
              value={post?.content}
              onChange={(content) => setPost({ ...post, content })}
              slug={params.slug}
            />
          </div>
          {/* Metadata editor */}
          <div className="space-y-6">
            {post && (
              <FrontmatterEditor
                frontmatter={post.frontmatter}
                onChange={(frontmatter) => setPost({ ...post, frontmatter })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}