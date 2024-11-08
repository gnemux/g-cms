import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.join(__dirname, '..', 'content', 'posts')

// Read all MDX files
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'))

files.forEach(file => {
  const filePath = path.join(postsDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Replace all \r\n with \n
  content = content.replace(/\r\n/g, '\n')
  
  // Fix published field format
  content = content.replace(/published: "true\\r"/g, 'published: true')
  content = content.replace(/published: "false\\r"/g, 'published: false')
  content = content.replace(/published: "true"/g, 'published: true')
  content = content.replace(/published: "false"/g, 'published: false')
  
  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8')
})

console.log('MDX files cleaned successfully!')