'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Post } from '@/lib/services/PostService'

// Dynamically import MDXRemote component to reduce initial bundle size
const MDXRemote = dynamic(() => import('next-mdx-remote').then(mod => mod.MDXRemote), {
  loading: () => <div>Loading content...</div>,
  ssr: false // Disable server-side rendering to avoid hydration issues
})

/**
 * Post detail page component
 * Displays the complete content of a single post, including title, metadata, and body
 */
export default function PostPage({ params }: { params: { slug: string } }) {
  // State management
  const [post, setPost] = useState<Post | null>(null)         // Post data
  const [mdxSource, setMdxSource] = useState<any>(null)       // MDX source code
  const [loading, setLoading] = useState(true)                // Loading state

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Get post data from API
        const response = await fetch(`/api/posts/${params.slug}`)

        // Handle error cases
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch post')
        }

        // Update state
        const { post: postData, mdxSource: mdxData } = await response.json()
        setPost(postData)
        setMdxSource(mdxData)
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  // Loading state display
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    )
  }

  // Show 404 when data doesn't exist
  if (!post || !mdxSource) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-slate-900 py-16">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Article header information area */}
        <header className="mb-12 space-y-8">
          {/* Topic tag */}
          <div className="flex justify-center">
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#B65051]/10 text-[#B65051] hover:bg-[#B65051]/20 transition-colors"
            >
              <Link href={`/topics/${post.topic.toLowerCase()}`}>
                <span className="mr-1">📚</span> {post.topic}
              </Link>
            </div>
          </div>

          {/* Article title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-amber-200 leading-tight">
            {post.title}
          </h1>

          {/* Article metadata: publish date and reading time */}
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <span className="text-slate-600">·</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {/* Article description (if exists) */}
          {post.description && (
            <div className="max-w-2xl mx-auto">
              <div className="text-slate-400 text-center text-lg leading-relaxed border-l-4 border-[#B65051]/20 pl-4 py-2 bg-slate-800/30 rounded-r-lg">
                {post.description}
              </div>
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        {/* Article main content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <MDXRemote {...mdxSource} />
        </div>

        {/* Article footer navigation */}
        <footer className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex justify-between items-center text-sm text-slate-400">
            {/* Topic link */}
            <div className="flex items-center hover:text-slate-300 transition-colors">
              <Link href={`/topics/${post.topic.toLowerCase()}`}>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  More {post.topic} posts
                </div>
              </Link>
            </div>
            {/* Back to home link */}
            <div className="flex items-center hover:text-slate-300 transition-colors">
              <Link href="/">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </div>
              </Link>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}