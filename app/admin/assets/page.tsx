'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Asset {
  name: string
  path: string
  url: string
  postSlug?: string
  postTitle?: string
}

interface GroupedAssets {
  [key: string]: Asset[]
}

export default function AssetsPage() {
  const { data: session, status } = useSession()
  const [assets, setAssets] = useState<GroupedAssets>({})
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  // 认证检查
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/api/auth/signin')
    }
  }, [status])

  // 获取资源列表
  useEffect(() => {
    if (status === 'authenticated') {
      fetchAssets()
    }
  }, [status])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/admin/assets')
      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }
      const data = await response.json()
      setAssets(data)
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (path: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return
    }

    setDeleting(path)
    try {
      const response = await fetch('/api/admin/assets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete asset')
      }

      // 重新获取资源列表
      await fetchAssets()
    } catch (error) {
      console.error('Error deleting asset:', error)
      alert('Delete failed, please try again')
    } finally {
      setDeleting(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold">Asset Management</h1>
        </div>
        <div className="text-sm text-gray-500">
          Total {Object.values(assets).reduce((acc, curr) => acc + curr.length, 0)} files
        </div>
      </div>
      
      {Object.entries(assets).length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No assets found
        </div>
      ) : (
        Object.entries(assets).map(([group, groupAssets]) => (
          <div key={group} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
              {group === 'unused' ? 'Unused Images' : `Article: ${group}`}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({groupAssets.length} files)
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupAssets.map((asset) => (
                <div 
                  key={asset.path} 
                  className="relative bg-gray-800 rounded-lg overflow-hidden group"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-900">
                    <Image
                      src={asset.url}
                      alt={asset.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* 悬浮操作层 */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(asset.path)}
                      disabled={deleting === asset.path}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === asset.path ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                  
                  {/* 文件信息 */}
                  <div className="p-3 bg-gray-800">
                    <p className="text-sm text-gray-300 truncate" title={asset.name}>
                      {asset.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
} 