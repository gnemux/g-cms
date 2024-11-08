import type { MDXRemoteSerializeResult } from 'next-mdx-remote/rsc'

export interface PostMeta {
  title: string
  slug: string
  date: string
  description?: string
  topic?: string
}

export interface Post {
  _id: string;
  _raw: {
    sourceFilePath: string;
    sourceFileName: string;
    sourceFileDir: string;
    contentType: string;
    flattenedPath: string;
  };
  type: 'Post';
  title: string;
  date: string;
  description: string;
  topic?: string;
  published: boolean;
  slug: string;
  body: {
    raw: string;
    html: string;
  };
  url: string;
  readingTime: number;
}

export interface PostListItem {
  node: PostMeta
}

export interface PostConnection {
  edges: PostListItem[]
  pageInfo?: {
    hasPreviousPage: boolean
    hasNextPage: boolean
    startCursor: string
    endCursor: string
  }
} 