'use client'

import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

// Define MDX components
const components = {
  h1: (props: any) => <h1 {...props} className="text-2xl font-bold my-4" />,
  h2: (props: any) => <h2 {...props} className="text-xl font-bold my-3" />,
  p: (props: any) => <p {...props} className="my-2" />,
}

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700">
      <div className="text-slate-100">
        <MDXRemote {...source} components={components} />
      </div>
    </div>
  )
} 