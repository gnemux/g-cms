import type { TopicMeta, TopicMetaMap } from '@/types/topic'

export const topicMeta: TopicMetaMap = {
  'Technology': {
    title: 'Technology Exploration',
    subtitle: 'Tech Insights',
    description: 'Exploring cutting-edge technologies, analyzing trends, and sharing technical insights. Documenting every step of technological evolution.',
    gradient: 'from-blue-600 to-purple-600',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  'SciFi': {
    title: 'Science Fiction',
    subtitle: 'Future Imagination',
    description: 'Envisioning future worlds, exploring the intersection of technology and humanity. Here, we use imagination to paint tomorrow\'s picture.',
    gradient: 'from-purple-600 to-pink-600',
    icon: 'M11 17.25V16.75C11 16.3358 11.3358 16 11.75 16H12.25C12.6642 16 13 16.3358 13 16.75V17.25C13 17.6642 12.6642 18 12.25 18H11.75C11.3358 18 11 17.6642 11 17.25ZM7 8.75V7.25C7 6.83579 7.33579 6.5 7.75 6.5H16.25C16.6642 6.5 17 6.83579 17 7.25V8.75C17 9.16421 16.6642 9.5 16.25 9.5H7.75C7.33579 9.5 7 9.16421 7 8.75Z'
  }
}

export const defaultTopicMeta: TopicMeta = {
  title: 'Topic Collection',
  subtitle: 'Featured Topics',
  description: 'Explore unique perspectives and deep insights. Discover more fascinating content here.',
  gradient: 'from-gray-600 to-blue-600',
  icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
}

export const availableTopics = ['Technology', 'SciFi', 'Uncategorized'] as const; 