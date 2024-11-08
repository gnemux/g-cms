'use client'

import React, { useState, useEffect } from 'react'
import PostService from '@/lib/services/PostService'
import PostCard from '@/components/PostCard'
import MobileTopicSlider from '@/components/layout/MobileTopicSlider'
import type { Post } from '@/lib/services/PostService'
import { siteConfig } from '@/lib/config'

/**
 * Home Page Component
 * Displays blog posts list and topic categories
 */
export default function Home() {
  // State management
  const [posts, setPosts] = useState<Post[]>([]) // All posts
  const [topics, setTopics] = useState<string[]>([]) // Topic list
  const [loading, setLoading] = useState(true) // Loading state

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts and topics data in parallel, disable all caching
        const [postsResponse, topicsResponse] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/topics')
        ])

        // Check response status
        if (!postsResponse.ok || !topicsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        // Parse response data
        const postsData = await postsResponse.json()
        const topicsData = await topicsResponse.json()

        console.log('Fetched posts:', postsData)
        console.log('Fetched topics:', topicsData)

        // Update state
        setPosts(postsData)
        setTopics(topicsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Loading state display
  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-slate-300">Loading...</div>
    </div>
  }

  // Data processing
  const publishedPosts = posts.filter(post => post.published) // Filter published posts

  // Group by topic and get latest post for each topic
  const latestPostsByTopic = topics.map(topic => {
    const topicPosts = publishedPosts
      .filter(post => (post.topic || 'Uncategorized') === topic)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return {
      topic,
      post: topicPosts[0]
    }
  }).filter(item => item.post)

  // Main page content
  const pageContent = (
    <div className="min-h-screen bg-slate-900">
      {/* Hero section - Display title and introduction */}
      <section className="py-8 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-3xl p-8 md:p-20 border border-[#B65051]/20 shadow-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10"></div>
            
            {/* Glow effect decoration */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B65051]/15 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-40 left-20 w-80 h-80 bg-orange-600/15 rounded-full blur-2xl"></div>
            
            {/* Main content */}
            <div className="relative text-center max-w-3xl mx-auto">
              <div className="inline-block mb-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#B65051] via-orange-400 to-[#B65051]/80">
                  {siteConfig.hero.title}
                </h1>
              </div>
              <p className="text-lg md:text-xl text-slate-300/90">
                {siteConfig.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic posts list section */}
      <section className="py-6 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid gap-4 md:gap-8">
            {latestPostsByTopic.map(({ topic, post }) => (
              <div key={topic}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

  // Responsive rendering
  return (
    <>
      {/* Desktop display */}
      <div className="hidden md:block">
        {pageContent}
      </div>
      {/* Mobile display */}
      <div className="block md:hidden">
        <MobileTopicSlider topics={topics}>
          {pageContent}
        </MobileTopicSlider>
      </div>
    </>
  )
}