'use client'

import React, { useState, useEffect } from 'react'
import PostCard from '@/components/PostCard'
import type { Post } from '@/lib/services/PostService'
import { notFound } from 'next/navigation'

/**
 * Topic Page Component
 * Displays a list of all articles under a specific topic
 */
export default function TopicPage({ params }: { params: { slug: string } }) {
  // State management
  const [posts, setPosts] = useState<Post[]>([])         // Article list
  const [loading, setLoading] = useState(true)           // Loading state
  const [error, setError] = useState<string | null>(null) // Error message

  // Fetch topic articles data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Reset state
        setLoading(true)
        setError(null)
        console.log(`Topics Page: Fetching posts for topic: ${params.slug}`)

        // Fetch article data from API
        const response = await fetch(`/api/topics/${params.slug}`)

        // Handle error cases
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error(`Failed to fetch posts: ${response.statusText}`)
        }

        // Parse response data
        const postsData = await response.json()
        console.log(`Topics Page: Received ${postsData.length} posts for topic: ${params.slug}`)

        if (!Array.isArray(postsData)) {
          throw new Error('Invalid response format')
        }

        // Filter and sort articles
        const publishedPosts = postsData
          .filter(post => post.published)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        console.log(`Topics Page: ${publishedPosts.length} published posts for topic: ${params.slug}`)
        setPosts(publishedPosts)
      } catch (error) {
        console.error('Topics Page: Error fetching posts:', error)
        setError(error instanceof Error ? error.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [params.slug])

  // Loading state display
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  // Error state display
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  // Empty data state display
  if (!posts.length) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Hero section */}
        <section className="py-8 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-3xl p-8 md:p-20 border border-[#B65051]/20 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B65051]/15 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-40 left-20 w-80 h-80 bg-orange-600/15 rounded-full blur-2xl"></div>
              <div className="relative text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#B65051] via-orange-400 to-[#B65051]/80">
                  {decodeURIComponent(params.slug)}
                </h1>
              </div>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 text-center text-slate-400">
          No articles yet
        </div>
      </div>
    )
  }

  // Normal data display
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero section */}
      <section className="py-8 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-3xl p-8 md:p-20 border border-[#B65051]/20 shadow-lg relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10"></div>
            
            {/* Glow effects */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B65051]/15 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-40 left-20 w-80 h-80 bg-orange-600/15 rounded-full blur-2xl"></div>
            
            {/* Content area */}
            <div className="relative text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#B65051] via-orange-400 to-[#B65051]/80">
                {decodeURIComponent(params.slug)}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Article list section */}
      <section className="py-6 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid gap-4 md:gap-8">
            {posts.map(post => (
              <div key={post.slug}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}