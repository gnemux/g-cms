import fs from 'fs'
import path from 'path'

const postsDir = path.join(process.cwd(), 'content', 'posts')

// Read all MDX files
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'))

files.forEach(file => {
  const filePath = path.join(postsDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Replace all \r\n with \n
  content = content.replace(/\r\n/g, '\n')
  
  // Fix the format of published field
  content = content.replace(/published: "true\\r"/g, 'published: true')
  content = content.replace(/published: "false\\r"/g, 'published: false')
  content = content.replace(/published: "true"/g, 'published: true')
  content = content.replace(/published: "false"/g, 'published: false')
  
  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8')
})

console.log('MDX files cleaned successfully!')