'use client'

import { usePathname } from 'next/navigation'
import NextLink from 'next/link'

export default function NotFound() {
  const pathname = usePathname()
  const isAdminPath = pathname?.startsWith('/admin')

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-3xl p-12 border border-[#B65051]/20 shadow-lg relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10"></div>
          
          {/* 发光效果 */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B65051]/15 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-orange-600/15 rounded-full blur-2xl"></div>
          
          {/* 内容区域 */}
          <div className="relative text-center">
            <h1 className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B65051] via-orange-400 to-[#B65051]/80">
              404
            </h1>
            <h2 className="text-2xl font-semibold mb-6 text-amber-200">
              页面不存在
            </h2>
            <p className="text-slate-300 mb-8">
                抱歉，您要找的页面似乎已经离开了这个世界。
            </p>
            <NextLink href='/'>
              <span className="inline-flex items-center justify-center px-6 py-3 bg-[#B65051] text-white rounded-lg hover:bg-[#B65051]/90 transition-colors">
                返回首页
              </span>
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
} 