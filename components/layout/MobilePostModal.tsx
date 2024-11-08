'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Post } from '@/lib/services/PostService'
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

interface MobilePostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onPrevious?: () => void  // Callback for previous article
  onNext?: () => void      // Callback for next article
  hasPrevious?: boolean    // Whether there is a previous article
  hasNext?: boolean        // Whether there is a next article
}

export default function MobilePostModal({
  post,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: MobilePostModalProps) {
  const scrollPositionRef = useRef(0)
  const startXRef = useRef(0)

  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollPositionRef.current)
    }
  }, [isOpen])

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diffX = endX - startXRef.current
    const threshold = 100

    if (diffX > threshold && hasPrevious && onPrevious) {
      onPrevious()
    } else if (diffX < -threshold && hasNext && onNext) {
      onNext()
    }
  }

  const contentWithoutFrontmatter = post.body.raw.replace(/^---[\s\S]*?---/, '').trim()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Article container */}
          <motion.div
            className="absolute inset-0 flex flex-col bg-slate-900"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Fixed top navigation bar */}
            <div className="sticky top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
              <div className="container mx-auto px-4">
                <div className="h-14 flex items-center justify-between">
                  {/* Back button */}
                  <button
                    onClick={onClose}
                    className="flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <svg 
                      className="w-6 h-6 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                      />
                    </svg>
                    <span>Back</span>
                  </button>

                  {/* Navigation hint */}
                  {(hasPrevious || hasNext) && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-slate-400">
                      Swipe left/right to switch articles
                    </div>
                  )}

                  {/* Reading time */}
                  <div className="text-xs text-amber-500/70">
                    {post.readingTime} min read
                  </div>
                </div>
              </div>
            </div>

            {/* Article content scrollable area */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <article className="container mx-auto px-4">
                {/* Article title and date */}
                <header className="py-6">
                  <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                    {post.title}
                  </h1>
                  <time className="text-xs text-amber-500/70">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </header>

                {/* Article content */}
                <div className="prose prose-sm max-w-none dark:prose-invert 
                  prose-headings:text-amber-200 
                  prose-p:text-slate-300 
                  prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
                  prose-strong:text-amber-200
                  prose-code:text-amber-300 prose-code:bg-slate-800/50
                  prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-slate-700/50
                  prose-blockquote:border-l-amber-500/50 prose-blockquote:bg-slate-800/20
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-li:text-slate-300
                  pb-8
                ">
                  <MarkdownRenderer content={contentWithoutFrontmatter} />
                </div>
              </article>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 