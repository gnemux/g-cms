import matter from 'gray-matter'

// Extract the first image URL from Markdown content
export function extractFirstImage(content: string): string | null {
  // First parse frontmatter
  const { content: markdownContent } = matter(content)
  
  // Match image syntax, including GitHub raw URL
  const imageRegex = /!\[.*?\]\((.*?)\)/
  const match = markdownContent.match(imageRegex)
  
  if (match && match[1]) {
    return match[1]
  }
  
  return null
}

// Generate article preview
export function generatePostPreview(content: string): string {
  const { content: markdownContent } = matter(content)
  
  // Remove all image syntax
  const textContent = markdownContent
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/#{1,6}\s/g, '')  // Remove heading markers
    .replace(/\n+/g, ' ')      // Replace line breaks with spaces
    .trim()
  
  // Return first 200 characters
  return textContent.length > 200 
    ? textContent.substring(0, 200) + '...'
    : textContent
} 