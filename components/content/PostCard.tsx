import Link from 'next/link'
import type { PostMeta } from '@/types/post'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: PostMeta
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative flex flex-col space-y-2">
      <h2 className="text-2xl font-semibold">
        <Link
          href={`/posts/${post.slug}`}
          className="hover:underline"
        >
          {post.title}
        </Link>
      </h2>
      {post.description && (
        <p className="text-muted-foreground">{post.description}</p>
      )}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.topic && (
          <>
            <span>•</span>
            <Link
              href={`/topics/${post.topic}`}
              className="hover:underline"
            >
              {post.topic}
            </Link>
          </>
        )}
      </div>
    </article>
  )
} 