declare module 'contentlayer/generated' {
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
      code: string;
    };
    url: string;
    readingTime: number;
  }

  export const allPosts: Post[];
} 