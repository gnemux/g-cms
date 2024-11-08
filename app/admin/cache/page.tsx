'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CacheOperations from '@/components/cache/CacheOperations'

interface CacheEntry {
  key: string
  timestamp: number
  data: any
}

interface CacheState {
  isInitialized: boolean
  isCacheEnabled: boolean
  posts: {
    total: number
    published: number
  }
  cacheEntries: CacheEntry[]
}

export default function CachePage() {
  const { data: session, status } = useSession()
  const [cacheState, setCacheState] = useState<CacheState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/api/auth/signin')
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCacheState()
    }
  }, [status])

  const fetchCacheState = async () => {
    try {
      const response = await fetch('/api/admin/cache')
      if (!response.ok) {
        throw new Error('Failed to fetch cache state')
      }
      const data = await response.json()
      setCacheState(data)
    } catch (error) {
      console.error('Error fetching cache state:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !cacheState) {
    return (
      <div className="min-h-screen bg-slate-900 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/admin"
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-amber-200">Cache Status</h1>
          </div>
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    )
  }

  const { cacheEntries = [], isInitialized, isCacheEnabled, posts } = cacheState

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-amber-200">Cache Status</h1>
        </div>
        
        <div className="space-y-6">
          {/* 缓存基本信息 */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-amber-300">Basic Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <dt className="text-slate-400">Cache Status</dt>
              <dd className="text-slate-200">{isInitialized ? 'Initialized' : 'Not Initialized'}</dd>
              <dt className="text-slate-400">Cache Enabled</dt>
              <dd className="text-slate-200">{isCacheEnabled ? 'Yes' : 'No'}</dd>
              <dt className="text-slate-400">Cache Items</dt>
              <dd className="text-slate-200">{cacheEntries.length}</dd>
              <dt className="text-slate-400">Total Articles</dt>
              <dd className="text-slate-200">
                {posts.total} (Published: {posts.published})
              </dd>
            </dl>
          </div>

          {/* 缓存内容 */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-amber-300">Cache Content</h2>
            <div className="space-y-4">
              {cacheEntries.length > 0 ? (
                cacheEntries.map(({ key, timestamp, data }) => (
                  <div key={key} className="border-t border-slate-700 pt-4 first:border-0 first:pt-0">
                    <h3 className="text-amber-400 mb-2">{key}</h3>
                    <div className="text-sm text-slate-400">
                      Updated at: {new Date(timestamp).toLocaleString()}
                    </div>
                    <pre className="mt-2 p-4 bg-slate-900 rounded text-slate-300 overflow-x-auto text-sm">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-center py-4">
                  No data in cache
                </div>
              )}
            </div>
          </div>

          {/* 缓存操作 */}
          <CacheOperations onCacheUpdated={fetchCacheState} />
        </div>
      </div>
    </div>
  )
} 