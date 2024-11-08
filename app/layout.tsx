import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { Providers } from './providers'
import Navigation from '@/components/layout/Navigation'
import MobileNavigation from '@/components/layout/MobileNavigation'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: siteConfig.name,
  other: {
    'manifest': '/api/manifest'  // 指向动态生成的 manifest
  }
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/api/manifest" />
      </head>
      <body className="bg-slate-900">
        <Providers>
          <Navigation className="hidden md:block" />
          <MobileNavigation className="block md:hidden" />
          <div className="pt-24">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
} 