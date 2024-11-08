'use client'

import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { FileText, Image, Database, LogOut } from 'lucide-react'

const adminMenus = [
  {
    title: 'Article Management',
    description: 'Create, edit and manage all articles',
    href: '/admin/posts',
    icon: FileText
  },
  {
    title: 'Asset Management',
    description: 'Manage all uploaded image assets',
    href: '/admin/assets',
    icon: Image
  },
  {
    title: 'Cache View',
    description: 'View and manage system cache status',
    href: '/admin/cache',
    icon: Database
  }
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/api/auth/signin')
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-amber-200 mb-2">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Choose an operation</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenus.map((menu) => {
            const Icon = menu.icon
            return (
              <button
                key={menu.href}
                onClick={() => router.push(menu.href)}
                className="group p-6 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-200 text-left"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <h2 className="ml-4 text-xl font-semibold text-amber-200 group-hover:text-amber-100">
                    {menu.title}
                  </h2>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
                  {menu.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
} 