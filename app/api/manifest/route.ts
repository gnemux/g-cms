import { siteConfig } from '@/lib/config'
import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: siteConfig.name,
    short_name: siteConfig.name,
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone"
  }

  return NextResponse.json(manifest, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'application/manifest+json',
    },
  })
} 