import path from 'path'

// Client function: Get the first image path from the article
export function getFirstImage(content: string): string | null {
  // Match Markdown image syntax
  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/)
  if (imageMatch) {
    return imageMatch[1]
  }

  // Match HTML img tag
  const imgMatch = content.match(/<img.*?src=["'](.*?)["']/)
  if (imgMatch) {
    return imgMatch[1]
  }

  return null
}

// Client function: Get all image paths from the article
export function getAllImages(content: string): string[] {
  const matches = content.matchAll(/!\[.*?\]\((.*?)\)/g)
  return Array.from(matches).map(match => match[1])
}

// Server function: Delete image file
export async function deleteImageServer(imagePath: string): Promise<void> {
  // Dynamically import fs and path, only used on server side
  if (typeof window === 'undefined') {
    const fs = require('fs')
    const path = require('path')
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      
      // Try to delete empty directory
      const dirPath = path.dirname(fullPath)
      const files = fs.readdirSync(dirPath)
      if (files.length === 0) {
        fs.rmdirSync(dirPath)
      }
    }
  }
}

// Generate article preview
export function getPreviewContent(content: string): string {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '').trim()
  // Get first 75 characters and end at the last complete sentence
  const preview = contentWithoutFrontmatter.slice(0, 75).replace(/([。！？.!?])[^。！？.!?]*$/, '$1')
  return preview + (contentWithoutFrontmatter.length > 75 ? '...' : '')
}

// Extract all image URLs from the article
export function extractImagesFromMdx(content: string): string[] {
  const images = new Set<string>()
  
  // Match Markdown image syntax
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/g
  let match = markdownImageRegex.exec(content)
  while (match) {
    if (match[1].startsWith('https://raw.githubusercontent.com')) {
      const urlParts = match[1].split('/content/images/')
      if (urlParts.length > 1) {
        images.add(urlParts[1])
      }
    }
    match = markdownImageRegex.exec(content)
  }

  // Match HTML img tag
  const htmlImageRegex = /<img.*?src=["'](.*?)["']/g
  match = htmlImageRegex.exec(content)
  while (match) {
    if (match[1].startsWith('https://raw.githubusercontent.com')) {
      const urlParts = match[1].split('/content/images/')
      if (urlParts.length > 1) {
        images.add(urlParts[1])
      }
    }
    match = htmlImageRegex.exec(content)
  }

  return Array.from(images)  // Use Array.from instead of spread operator
} 