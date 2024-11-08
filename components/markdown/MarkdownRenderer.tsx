'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold my-4 text-amber-200">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold my-3 text-amber-200">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold my-2 text-amber-200">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="my-2 text-slate-300">{children}</p>
        ),
        a: ({ href, children }) => (
          <a 
            href={href}
            className="text-amber-400 hover:text-amber-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside my-4 text-slate-300">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside my-4 text-slate-300">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="my-1">{children}</li>
        ),
        img: ({ src, alt }) => (
          <img 
            src={src} 
            alt={alt || ''} 
            className="rounded-lg max-w-full h-auto my-4"
            loading="lazy"
          />
        ),
        pre: ({ children }) => (
          <pre className="bg-slate-800 rounded-lg p-4 my-4 overflow-x-auto">
            {children}
          </pre>
        ),
        code: ({ children }) => (
          <code className="bg-slate-800 rounded px-1 py-0.5 text-amber-300">
            {children}
          </code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-amber-500/50 pl-4 my-4 italic text-slate-400">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
} 