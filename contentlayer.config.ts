import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import type { DocumentGen } from 'contentlayer/core'
import readingTime from 'reading-time'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: true },
    topic: { type: 'string', required: true },
    published: { type: 'boolean', required: true }
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc: DocumentGen) => doc._raw.flattenedPath.replace('posts/', ''),
    },
    url: {
      type: 'string',
      resolve: (doc: DocumentGen) => `/posts/${doc._raw.flattenedPath.replace('posts/', '')}`,
    },
    readingTime: {
      type: 'number',
      resolve: (doc: DocumentGen) => Math.ceil(readingTime(doc.body.raw).minutes),
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  disableImportAliasWarning: true
}) 