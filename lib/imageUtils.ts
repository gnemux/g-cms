import fs from 'fs'
import path from 'path'

// Ensure image directory exists
export function ensureImageDirectory(slug: string) {
  const imageDir = path.join(process.cwd(), 'public', 'images', 'posts', slug)
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true })
  }
  return imageDir
}

// Generate unique image filename
export function generateImageFileName(originalName: string) {
  const ext = path.extname(originalName)
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${timestamp}-${random}${ext}`
} 