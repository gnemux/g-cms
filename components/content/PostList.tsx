import type { PostListItem } from '@/types/post'
import PostCard from './PostCard'

interface PostListProps {
  posts: PostListItem[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(({ node }) => (
        <PostCard key={node.slug} post={node} />
      ))}
    </div>
  )
} 