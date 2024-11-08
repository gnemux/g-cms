import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'content', 'config', 'topics.json')

export function getTopicConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {}
  }
  const content = fs.readFileSync(CONFIG_PATH, 'utf8')
  return JSON.parse(content)
}

export function saveTopicConfig(config: any) {
  const dirPath = path.dirname(CONFIG_PATH)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
} 