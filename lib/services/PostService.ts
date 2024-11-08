import { Octokit } from '@octokit/rest'
import matter from 'gray-matter'

// Global cache type definition
declare global {
  var __postCache: {
    instance: any;
    cache: Map<string, CacheData<any>>;
    assetCache: Map<string, AssetCache>;
    initialized: boolean;
    forceRefresh: boolean;
  }
}

// Post data interface definition
export interface Post {
  slug: string        // Post identifier
  title: string       // Title
  date: string        // Publish date
  published: boolean  // Whether published
  topic: string       // Topic category
  description: string // Description
  url: string        // Access path
  body: {
    raw: string      // Raw content
  }
  readingTime: string // Reading time
}

// Cache data type
type CacheData<T> = {
  data: T;           // Cached data
  timestamp: number; // Cache timestamp
}

// Asset cache type
type AssetCache = {
  buffer: Buffer;     // Binary data
  contentType: string;// Content type
  sha: string;        // Git SHA value
  timestamp: number;  // Cache timestamp
}

/**
 * Post Service Class
 * Provides functionality for post CRUD operations, cache management, and asset management
 */
class PostService {
  // Initialize GitHub API client
  private static octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    request: {
      headers: {
        'If-None-Match': '',
      }
    }
  })

  /**
   * Initialize global cache
   * @returns Global cache object
   */
  private static initCache() {
    if (global.__postCache) {
      return global.__postCache
    }

    const isCacheEnabled = process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false'

    console.log('PostService: Initializing global cache')
    global.__postCache = {
      instance: null,
      cache: new Map(),
      assetCache: new Map(),
      initialized: false,
      forceRefresh: !isCacheEnabled
    }
    return global.__postCache
  }

  /**
   * Fetch all posts from GitHub
   * @returns Post list
   */
  private static async fetchAllPosts(): Promise<Post[]> {
    // Get all files in the posts directory
    const { data: files } = await this.octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER!,
      repo: process.env.GITHUB_REPO!,
      path: 'content/posts',
      ref: 'content'
    })

    if (!Array.isArray(files)) {
      return []
    }

    // Process each MDX file
    const posts = await Promise.all(
      files
        .filter(file => file.name.endsWith('.mdx'))
        .map(async file => {
          const { data: content } = await this.octokit.repos.getContent({
            owner: process.env.GITHUB_OWNER!,
            repo: process.env.GITHUB_REPO!,
            path: file.path,
            ref: 'content'
          })

          if ('content' in content && 'encoding' in content) {
            const fileContent = Buffer.from(content.content, 'base64').toString()
            const { data } = matter(fileContent)
            
            return {
              slug: file.name.replace(/\.mdx$/, ''),
              title: String(data.title || ''),
              date: String(data.date || ''),
              published: Boolean(data.published),
              topic: String(data.topic || 'uncategorized'),
              description: String(data.description || ''),
              url: `/posts/${file.name.replace(/\.mdx$/, '')}`,
              body: {
                raw: fileContent
              },
              readingTime: `${Math.ceil(fileContent.length / 500)}`
            }
          }
          return null
        })
    )

    // Filter invalid posts and sort by date
    return posts
      .filter((post): post is Post => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  /**
   * Get post list
   * @param includeUnpublished Whether to include unpublished posts
   * @returns Post list
   */
  public static async getPosts(includeUnpublished = false): Promise<Post[]> {
    // Skip fetch operation on client side
    if (typeof window !== 'undefined') {
      console.log('PostService: Running on client side, skipping fetch')
      return []
    }

    const cache = this.initCache()
    const isCacheEnabled = process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false'

    // Determine if cache refresh is needed
    if (!isCacheEnabled || cache.forceRefresh || !cache.cache.has('posts')) {
      if (!isCacheEnabled) {
        console.log('PostService: Cache disabled, fetching new data')
      } else if (cache.forceRefresh) {
        console.log('PostService: Force refreshing cache, fetching new data')
      } else {
        console.log('PostService: Cache not initialized, fetching new data')
      }
      const posts = await this.fetchAllPosts()
      
      if (isCacheEnabled) {
        cache.cache.set('posts', {
          data: posts,
          timestamp: Date.now()
        })
        cache.initialized = true
        cache.forceRefresh = false
      }
      
      return includeUnpublished ? posts : posts.filter((post: Post) => post.published)
    }

    // Use cached data
    console.log('PostService: Cache hit, posts list')
    const posts = cache.cache.get('posts')?.data as Post[]
    return includeUnpublished ? posts : posts.filter((post: Post) => post.published)
  }

  /**
   * Get single post by slug
   */
  public static async getPost(slug: string, includeUnpublished = false): Promise<Post | null> {
    const posts = await this.getPosts(includeUnpublished)
    return posts.find(post => post.slug === slug) || null
  }

  /**
   * Get posts by topic
   */
  public static async getPostsByTopic(topic: string): Promise<Post[]> {
    try {
      console.log(`PostService: Getting posts for topic: ${topic}`)
      const posts = await this.getPosts(true)
      
      const matchingPosts = posts
        .filter(post => {
          const postTopic = (post.topic || 'uncategorized').toLowerCase()
          const targetTopic = topic.toLowerCase()
          const match = postTopic === targetTopic
          console.log(`PostService: Comparing post topic "${postTopic}" with "${targetTopic}": ${match}`)
          return match
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      console.log(`PostService: Found ${matchingPosts.length} posts for topic ${topic}`)
      return matchingPosts
    } catch (error) {
      console.error('PostService: Error getting posts by topic:', error)
      throw error
    }
  }

  /**
   * Get all topics list
   */
  public static async getTopics(): Promise<string[]> {
    const posts = await this.getPosts(true)
    return Array.from(new Set(
      posts
        .filter(post => post.published)
        .map(post => post.topic)
    ))
  }

  /**
   * Clear cache and reload
   */
  public static async invalidateCache() {
    const cache = this.initCache()
    console.log('PostService: Clearing cache')
    
    cache.cache.clear()
    cache.initialized = false
    cache.forceRefresh = true

    try {
      console.log('PostService: Fetching new data after cache clear')
      await this.getPosts(true)
      console.log('PostService: Cache rebuilt successfully')

      if (typeof window !== 'undefined') {
        console.log('PostService: Dispatching navigation-cache-update event')
        const event = new CustomEvent('navigation-cache-update')
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('PostService: Error rebuilding cache:', error)
    }
  }

  /**
   * Update post content
   */
  public static async updatePost(
    slug: string, 
    content: string, 
    frontmatter: {
      title: string;
      date: string;
      description: string;
      topic: string;
      published: boolean;
    }
  ): Promise<void> {
    try {
      if (!frontmatter || typeof frontmatter !== 'object') {
        throw new Error('Invalid frontmatter')
      }

      const { data: file } = await this.octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: `content/posts/${slug}.mdx`,
        ref: 'content'
      })

      if (!('content' in file) || !('sha' in file)) {
        throw new Error('File not found')
      }

      // Build frontmatter
      const frontmatterBlock = [
        '---',
        `title: ${frontmatter.title}`,
        `date: ${frontmatter.date}`,
        `description: ${frontmatter.description}`,
        `topic: ${frontmatter.topic}`,
        `published: ${frontmatter.published}`,
        '---'
      ].join('\n')

      const newContent = `${frontmatterBlock}\n${content}`

      // Update file
      await this.octokit.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: `content/posts/${slug}.mdx`,
        message: `Update post: ${slug}`,
        content: Buffer.from(newContent).toString('base64'),
        sha: file.sha,
        branch: 'content'
      })

      this.invalidateCache()
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  /**
   * Delete post
   */
  public static async deletePost(slug: string): Promise<void> {
    try {
      const { data: file } = await this.octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: `content/posts/${slug}.mdx`,
        ref: 'content'
      })

      if (!('sha' in file)) {
        throw new Error('File not found')
      }

      await this.octokit.repos.deleteFile({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: `content/posts/${slug}.mdx`,
        message: `Delete post: ${slug}`,
        sha: file.sha,
        branch: 'content'
      })

      this.invalidateCache()
    } catch (error) {
      console.error(`Error deleting post: ${slug}`, error)
      throw new Error('Failed to delete post')
    }
  }

  /**
   * Get post by slug
   */
  public static async getPostBySlug(slug: string, options?: { ignorePublished?: boolean }) {
    try {
      const post = await this.getPost(slug, options?.ignorePublished)
      return post
    } catch (error) {
      console.error('Error in getPostBySlug:', error)
      throw error
    }
  }

  /**
   * Get asset file
   */
  public static async getAsset(path: string): Promise<{
    buffer: Buffer;
    contentType: string;
    sha: string;
  } | null> {
    try {
      const assetPath = `content/assets/${path}`
      const { data: file } = await this.octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: assetPath,
        ref: 'content'
      })

      if (!('content' in file) || !('encoding' in file) || !('sha' in file)) {
        return null
      }

      const buffer = Buffer.from(file.content, 'base64')
      
      // If buffer is empty, try fetching directly from download_url
      if (buffer.length === 0 && 'download_url' in file && file.download_url) {
        const response = await fetch(file.download_url)
        if (!response.ok) {
          throw new Error('Failed to fetch from download_url')
        }
        const arrayBuffer = await response.arrayBuffer()
        const newBuffer = Buffer.from(arrayBuffer)
        
        if (newBuffer.length > 0) {
          const ext = path.split('.').pop()?.toLowerCase()
          const contentType = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'webp': 'image/webp',
          }[ext || ''] || 'application/octet-stream'

          return { buffer: newBuffer, contentType, sha: file.sha }
        }
      }

      const ext = path.split('.').pop()?.toLowerCase()
      const contentType = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp',
      }[ext || ''] || 'application/octet-stream'

      return { buffer, contentType, sha: file.sha }
    } catch (error) {
      console.error('Error fetching asset:', error)
      return null
    }
  }

  /**
   * Upload asset file
   */
  public static async uploadAsset(
    fileName: string,
    content: Buffer,
    options: { overwrite?: boolean } = {}
  ): Promise<string> {
    try {
      const path = `content/assets/${fileName}`
      console.log('Uploading asset:', {
        path,
        fileName,
        contentSize: content.length,
        contentBase64Length: content.toString('base64').length
      })

      let sha: string | undefined

      // Upload file
      const uploadResponse = await this.octokit.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path,
        message: `Upload asset: ${fileName}`,
        content: content.toString('base64'),
        sha,
        branch: 'content'
      })

      console.log('Upload response:', {
        status: uploadResponse.status,
        sha: uploadResponse.data.content?.sha,
        url: uploadResponse.data.content?.download_url
      })

      // Verify upload success
      const verifyResponse = await this.octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path,
        ref: 'content'
      })

      if ('content' in verifyResponse.data) {
        console.log('Verify upload:', {
          size: verifyResponse.data.size,
          sha: verifyResponse.data.sha
        })
      }

      return `/api/assets/${fileName}`
    } catch (error) {
      console.error('Detailed error uploading asset:', {
        error,
        fileName,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }
  }

  private static getOctokit() {
    return this.octokit;
  }

  /**
   * Get all assets grouped by posts
   */
  public static async getAssets() {
    const octokit = this.getOctokit()
    const groupedAssets: { [key: string]: any[] } = {}

    try {
      // Get all files in assets directory
      const { data: assets } = await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path: 'content/assets',
        ref: 'content'
      })

      if (!Array.isArray(assets)) {
        throw new Error('Assets path is not a directory')
      }

      // Get all post contents
      const posts = await this.getPosts(true)
      
      // Iterate through all asset files
      for (const asset of assets) {
        if (asset.type !== 'file') continue

        // Find posts using this asset
        const usingPost = posts.find(post => post.body.raw.includes(asset.name))
        
        const assetInfo = {
          name: asset.name,
          path: asset.path,
          url: asset.download_url,
          postSlug: usingPost?.slug,
          postTitle: usingPost?.title
        }

        const groupKey = usingPost ? usingPost.title : 'unused'
        if (!groupedAssets[groupKey]) {
          groupedAssets[groupKey] = []
        }
        groupedAssets[groupKey].push(assetInfo)
      }

      return groupedAssets
    } catch (error) {
      console.error('Error getting assets:', error)
      throw error
    }
  }

  /**
   * Delete asset file
   */
  public static async deleteAsset(path: string) {
    const octokit = this.getOctokit()

    try {
      // First get file SHA
      const { data: file } = await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path,
        ref: 'content'
      })

      if (Array.isArray(file)) {
        throw new Error('Path is a directory')
      }

      // Delete file
      await octokit.rest.repos.deleteFile({
        owner: process.env.GITHUB_OWNER!,
        repo: process.env.GITHUB_REPO!,
        path,
        message: `Delete asset: ${path}`,
        sha: file.sha,
        branch: 'content'
      })
    } catch (error) {
      console.error('Error deleting asset:', error)
      throw error
    }
  }

  public static async getCacheInfo() {
    const cache = this.initCache()
    const posts = await this.getPosts(true)
    
    // Get cache entries
    const cacheEntries = Array.from(cache.cache.entries()).map(([key, value]) => ({
      key,
      timestamp: value.timestamp,
      data: value.data
    }))

    return {
      isInitialized: cache.initialized,
      isCacheEnabled: process.env.NEXT_PUBLIC_ENABLE_CACHE !== 'false',
      posts: {
        total: posts.length,
        published: posts.filter(p => p.published).length
      },
      cacheEntries
    }
  }
}

export default PostService 