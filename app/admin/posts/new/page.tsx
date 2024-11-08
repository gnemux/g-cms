'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MarkdownEditor from '@/components/editor/MarkdownEditor'
import FrontmatterEditor from '@/components/editor/FrontmatterEditor'
import { invalidateNavigationCache } from '@/components/layout/Navigation'
import matter from 'gray-matter'

/**
 * Default content and metadata for new post
 */
const defaultPost = {
  // Default Markdown content
  content: `
# Main Title

## Subtitle

Start writing your article content here...

- List item 1
- List item 2
- List item 3

`,
  // Default post metadata
  frontmatter: {
    title: 'New Post Title',
    date: new Date().toISOString().split('T')[0],
    description: 'Article description goes here',
    topic: 'Uncategorized',
    published: false
  }
}

/**
 * New Post Page Component
 * Provides editing functionality for post content and metadata
 */
export default function NewPost() {
  // Router and session management
  const router = useRouter()
  const { data: session, status } = useSession()

  // State management
  const [post, setPost] = useState(defaultPost)          // Post data
  const [saving, setSaving] = useState(false)            // Saving state
  const [tempSlug] = useState(() => `temp-${Date.now()}`) // Temporary post identifier

  /**
   * Authentication check
   * Redirect to login page when not authenticated
   */
  useEffect(() => {
    if (status === 'unauthenticated') {
      const returnUrl = encodeURIComponent('/admin/posts/new')
      router.push(`/admin/login?callbackUrl=${returnUrl}`)
    }
  }, [status, router])

  /**
   * Save post
   * Submit post content and metadata to server
   */
  const handleSave = async () => {
    setSaving(true)
    try {
      // Combine content and metadata into Markdown string
      const markdown = matter.stringify(post.content, {
        title: post.frontmatter.title,
        date: post.frontmatter.date,
        description: post.frontmatter.description,
        topic: post.frontmatter.topic,
        published: post.frontmatter.published
      })

      // Send save request
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: markdown }),
      })

      // Handle error response
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create post')
      }

      // Update navigation cache and redirect
      invalidateNavigationCache()
      router.push('/admin/posts')
      
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  // Loading state display
  if (status === 'loading') {
    return (
      <div className="h-[calc(100vh-6rem)] bg-slate-900 p-6 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="h-[calc(100vh-6rem)] bg-slate-900 p-6">
      <div className="h-full container mx-auto max-w-[90rem] flex flex-col">
        {/* Top action bar */}
        <div className="mb-6 flex items-center justify-between flex-none">
          <h1 className="text-xl font-bold text-amber-200">New Post</h1>
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

        {/* Editor area */}
        <div className="grid grid-cols-[1fr,300px] gap-6 flex-1">
          {/* Markdown editor */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-lg overflow-hidden">
            <MarkdownEditor
              value={post.content}
              onChange={(content) => setPost({ ...post, content })}
              slug={tempSlug}
            />
          </div>
          {/* Metadata editor */}
          <div className="space-y-6">
            <FrontmatterEditor
              frontmatter={post.frontmatter}
              onChange={(frontmatter) => setPost({ ...post, frontmatter })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}