'use client'

import React, { useState, useEffect } from 'react'
import Link from '@/components/common/Link'
import { getFirstImage, getPreviewContent } from '@/lib/mdxUtils'
import type { Post } from '@/lib/services/PostService'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import modal component
const MobilePostModal = dynamic(() => import('@/components/layout/MobilePostModal'))

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect device type
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setIsModalOpen(true)
    }
  }

  const content = (
    <article className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Border and light effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#B65051]/20 to-orange-600/20 border-2 border-[#B65051]/20"></div>
      
      <div className="grid md:grid-cols-2 gap-6 relative">
        {/* Image container */}
        <div className="aspect-w-16 aspect-h-9 md:aspect-h-full relative bg-slate-900">
          {getFirstImage(post.body.raw) ? (
            <img
              src={getFirstImage(post.body.raw)!}
              alt={post.title}
              className="w-full h-full object-cover brightness-100 group-hover:brightness-110 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B65051]/10 to-orange-600/10">
              <svg 
                className="w-12 h-12 text-[#B65051]/40" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
        </div>

        {/* Article content */}
        <div className="p-8 relative z-10">
          <h3 className="relative text-2xl font-semibold mb-4 text-amber-200 group-hover:text-amber-300 transition-colors">
            {post.title}
          </h3>
          <p className="relative text-slate-300 mb-4 line-clamp-2">
            {post.description}
          </p>
          <p className="relative text-slate-400 mb-6 line-clamp-2 text-sm">
            {getPreviewContent(post.body.raw)}
          </p>
          <div className="relative flex items-center text-sm text-[#B65051]/50">
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="mx-2">·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  )

  return (
    <>
      {/* Desktop: Use direct link */}
      <div className="hidden md:block">
        <Link href={post.url}>
          {content}
        </Link>
      </div>

      {/* Mobile: Use modal */}
      <div className="block md:hidden">
        <div onClick={handleClick}>
          <Link href={post.url} onClick={e => e.preventDefault()}>
            {content}
          </Link>
        </div>
        <MobilePostModal
          post={post}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  )
}