'use client'

import React from 'react'
import Link from '@/components/common/Link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/config'

interface MobileNavigationProps {
  className?: string
}

export default function MobileNavigation({ className = '' }: MobileNavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 md:hidden ${className}`}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm border-b border-amber-500/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -top-20 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="h-16 flex items-center justify-center">
          <Link href="/" className="group relative flex items-center">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 to-slate-400/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
                {siteConfig.title}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
} 