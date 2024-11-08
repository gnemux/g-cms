'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from '@/components/common/Link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import type { Post } from '@/lib/services/PostService'
import { invalidateNavigationCache } from '@/components/layout/Navigation'
import { ArrowLeft } from 'lucide-react'

/**
 * Article Management Page Component
 * Provides article list display, create, edit, delete and other functions
 */
export default function AdminPosts() {
  // Router and session management
  const router = useRouter()
  const { data: session, status } = useSession()

  // State management
  const [posts, setPosts] = useState<Post[]>([])  // Article list
  const [loading, setLoading] = useState(true)    // Loading state
  const [activeTab, setActiveTab] = useState<string>('all') // Currently selected topic

  // Get all unique topics - fix compilation error
  const topics = useMemo(() => {
    const topicSet = new Set(['all'])
    posts.forEach(post => {
      if (post.topic) {
        topicSet.add(post.topic)
      }
    })
    return Array.from(topicSet)
  }, [posts])

  // Filter articles by topic and publish status
  const getFilteredPosts = (topic: string, isDraft: boolean) => {
    let filtered = posts
    if (topic !== 'all') {
      filtered = filtered.filter(post => post.topic === topic)
    }
    return filtered.filter(post => !post.published === isDraft)
  }

  /**
   * Get article list
   * Fetch all articles from server and sort by date
   */
  const fetchPosts = async () => {
    try {
      console.log('Admin: Fetching posts...')
      const response = await fetch('/api/admin/posts', {
        credentials: 'include',
        cache: 'no-store'  // Explicitly disable cache
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      // Get and sort articles
      const allPosts: Post[] = await response.json()
      const sortedPosts = [...allPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setPosts(sortedPosts)
    } catch (error) {
      console.error('Admin: Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Authentication and data loading
   * Redirect to login page when not authenticated, load article list when authenticated
   */
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }
    if (status === 'authenticated') {
      fetchPosts()
    }
  }, [status, router])

  /**
   * Delete article
   * @param slug Article identifier
   */
  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      await fetchPosts()  // Refresh list
      invalidateNavigationCache() // Refresh navigation cache

    } catch (error) {
      console.error('Admin: Error deleting post:', error)
      alert('Failed to delete')
    }
  }

  // Loading state display
  if (loading || status === 'loading') {
    return <div className="text-center p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Top navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-amber-200">Article Management</h1>
          </div>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            New Article
          </Link>
        </div>

        {/* Topic tabs */}
        <div className="mb-6 border-b border-slate-700">
          <div className="flex space-x-2 overflow-x-auto">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTab(topic)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === topic
                    ? 'text-amber-300 border-b-2 border-amber-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {topic === 'all' ? 'All Articles' : topic}
              </button>
            ))}
          </div>
        </div>

        {/* Published article list */}
        <div className="space-y-6">
          <div className="space-y-4">
            {getFilteredPosts(activeTab, false).map((post) => (
              <div
                key={post.slug}
                className="bg-slate-800 rounded-lg p-6 flex justify-between items-center border border-slate-700"
              >
                <div>
                  <h2 className="text-xl font-semibold text-amber-200 mb-2">
                    {post.title}
                  </h2>
                  <div className="text-sm text-slate-400">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span className="mx-2">·</span>
                    <span>{post.topic}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/posts/${post.slug}/edit`}
                    className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Draft box */}
          {getFilteredPosts(activeTab, true).length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-slate-300 mb-4 mt-8">Drafts</h3>
              <div className="space-y-4">
                {getFilteredPosts(activeTab, true).map((post) => (
                  <div
                    key={post.slug}
                    className="bg-slate-800/50 rounded-lg p-6 flex justify-between items-center border border-slate-700"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-slate-300 mb-2">
                        {post.title}
                      </h2>
                      <div className="text-sm text-slate-400">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="mx-2">·</span>
                        <span>{post.topic}</span>
                        <span className="mx-2">·</span>
                        <span className="text-amber-400/70">Draft</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}