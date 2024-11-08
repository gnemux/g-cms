'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface CacheOperationsProps {
  onCacheUpdated?: () => void
}

export default function CacheOperations({ onCacheUpdated }: CacheOperationsProps) {
  const [loading, setLoading] = useState(false)

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear all cache?')) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/cache', {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to clear cache')
      onCacheUpdated?.()
    } catch (error) {
      console.error('Error clearing cache:', error)
      alert('Failed to clear cache')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-amber-300">Cache Operations</h2>
        <button
          onClick={handleClearCache}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Clear Cache
        </button>
      </div>
    </div>
  )
} 