'use client'

import { useState, useEffect } from 'react'

interface FrontmatterEditorProps {
  frontmatter: {
    title: string
    date: string
    description: string
    topic: string
    published?: boolean
  }
  onChange: (frontmatter: any) => void
}

export default function FrontmatterEditor({ frontmatter, onChange }: FrontmatterEditorProps) {
  const [topics, setTopics] = useState<string[]>([])
  const [isAddingTopic, setIsAddingTopic] = useState(false)
  const [newTopic, setNewTopic] = useState('')

  useEffect(() => {
    fetchTopics()
    if (!frontmatter.date) {
      const today = new Date().toISOString().split('T')[0]
      handleChange('date', today)
    }
  }, [])

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topics')
      if (!response.ok) throw new Error('Failed to fetch topics')
      const data = await response.json()
      setTopics(data)
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    onChange({
      ...frontmatter,
      [field]: value
    })
  }

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === 'add-new') {
      setIsAddingTopic(true)
      setNewTopic('')
    } else {
      handleChange('topic', value)
    }
  }

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      const trimmedTopic = newTopic.trim()
      setTopics(prev => [...prev, trimmedTopic])
      handleChange('topic', trimmedTopic)
      setIsAddingTopic(false)
      setNewTopic('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTopic()
    } else if (e.key === 'Escape') {
      setIsAddingTopic(false)
    }
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 shadow-lg p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
        <input
          type="text"
          value={frontmatter.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B65051]/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
        <input
          type="date"
          value={frontmatter.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B65051]/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          value={frontmatter.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B65051]/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Topic</label>
        {isAddingTopic ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter new topic"
                className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B65051]/50"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingTopic(false)}
                className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTopic}
                disabled={!newTopic.trim()}
                className={`px-4 py-2 text-sm bg-[#B65051] text-white rounded-lg transition-colors ${
                  newTopic.trim() ? 'hover:bg-[#B65051]/90' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                Add Topic
              </button>
            </div>
          </div>
        ) : (
          <select
            value={frontmatter.topic || ''}
            onChange={handleTopicChange}
            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B65051]/50"
          >
            <option value="uncategorized">Uncategorized</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
            <option value="add-new">+ Add New Topic</option>
          </select>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={frontmatter.published ?? false}
          onChange={(e) => handleChange('published', e.target.checked)}
          className="h-4 w-4 text-[#B65051] focus:ring-[#B65051] border-slate-700/50 rounded"
        />
        <label htmlFor="published" className="ml-2 block text-sm text-slate-300">
          Publish Post
        </label>
      </div>
    </div>
  )
} 