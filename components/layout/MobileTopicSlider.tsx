'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'

interface MobileTopicSliderProps {
  topics: string[]
  currentTopic?: string
  children: React.ReactNode
}

export default function MobileTopicSlider({ 
  topics,
  currentTopic,
  children 
}: MobileTopicSliderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [direction, setDirection] = useState(0)
  const [startX, setStartX] = useState(0)

  useEffect(() => {
    if (!currentTopic) {
      setCurrentIndex(-1)
    } else {
      const index = topics.findIndex(
        topic => topic.toLowerCase() === currentTopic.toLowerCase()
      )
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }, [currentTopic, topics])

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = async (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diffX = endX - startX
    const threshold = 100

    if (diffX > threshold) {
      // 向右滑动（显示前一个页面）
      if (currentIndex > -1) {
        const nextIndex = currentIndex - 1
        setDirection(-1) // 新页面从左侧进入
        if (nextIndex === -1) {
          await router.push('/')
        } else {
          await router.push(`/topics/${encodeURIComponent(topics[nextIndex].toLowerCase())}`)
        }
      }
    } else if (diffX < -threshold) {
      // 向左滑动（显示下一个页面）
      if (currentIndex < topics.length - 1) {
        const nextIndex = currentIndex + 1
        setDirection(1) // 新页面从右侧进入
        await router.push(`/topics/${encodeURIComponent(topics[nextIndex].toLowerCase())}`)
      }
    }
  }

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    })
  }

  const pageTransition = {
    type: "tween",
    duration: 0.3,
    ease: "easeInOut"
  }

  return (
    <div className="min-h-screen bg-slate-900 md:overflow-hidden">
      <AnimatePresence
        initial={false}
        mode="wait"
        custom={direction}
        onExitComplete={() => setDirection(0)}
      >
        <motion.div
          key={pathname}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="min-h-screen md:overflow-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 