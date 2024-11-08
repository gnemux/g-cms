'use client'

import React, { useEffect, useState } from 'react'
import Link from '@/components/common/Link'
import { siteConfig } from '@/lib/config'

interface NavigationProps {
  className?: string
}

const CACHE_UPDATE_EVENT = 'navigation-cache-update'

export default function Navigation({ 
  className = ''
}: NavigationProps) {
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch topics
  const fetchTopics = async () => {
    try {
      setError(null)
      console.log('Navigation: Fetching topics...')
      
      const response = await fetch('/api/topics', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch topics')
      }

      const fetchedTopics = await response.json()
      console.log('Navigation: Fetched new topics:', fetchedTopics)
      setTopics(fetchedTopics)
    } catch (error) {
      console.error('Navigation: Error fetching topics:', error)
      setError('Failed to load topics')
    } finally {
      setLoading(false)
    }
  }

  // Listen for cache update events
  useEffect(() => {
    const handleCacheUpdate = () => {
      console.log('Navigation: Cache update event received')
      alert('Operation successful')
      fetchTopics()
    }

    window.addEventListener(CACHE_UPDATE_EVENT, handleCacheUpdate)
    
    return () => {
      window.removeEventListener(CACHE_UPDATE_EVENT, handleCacheUpdate)
    }
  }, [])

  // Initial load
  useEffect(() => {
    console.log('Navigation: Initial topics fetch')
    fetchTopics()
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm border-b border-amber-500/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-20 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="group relative flex items-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-slate-400/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
                {siteConfig.title}
              </span>
            </div>
          </Link>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center justify-center space-x-16">
              <Link 
                href="/"
                className="text-xl text-amber-200/90 hover:text-amber-200 transition-colors relative group"
              >
                <span>Home</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/70 to-amber-500/0 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {topics.map((topic) => (
                <Link
                  key={topic}
                  href={`/topics/${encodeURIComponent(topic.toLowerCase())}`}
                  className="text-xl text-amber-200/80 hover:text-amber-200 transition-colors relative group"
                >
                  <span>{topic}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/70 to-amber-500/0 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Export function to update page
export function invalidateNavigationCache() {
  console.log('Navigation: Triggering cache invalidation')
  const event = new CustomEvent(CACHE_UPDATE_EVENT)
  window.dispatchEvent(event)
} 