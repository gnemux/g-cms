'use client'

import React, { useCallback, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

/**
 * Props interface for the Markdown editor component
 */
interface MarkdownEditorProps {
  value?: string;                                                  // Editor content
  onChange?: (value: string) => void;                             // Content change callback
  onSave?: (content: string, frontmatter: any) => Promise<void>;  // Save callback
  slug?: string;                                                  // Article identifier
  className?: string;                                             // Custom style class
}

/**
 * Markdown Editor Component
 * Provides Markdown editing, preview and image upload functionality
 */
export default function MarkdownEditor({ value = '', onChange, onSave, slug, className }: MarkdownEditorProps) {
  // Image upload status
  const [uploading, setUploading] = useState(false)

  /**
   * Handle editor content changes
   * @param val New editor content
   */
  const handleEditorChange = useCallback((val: string | undefined) => {
    onChange?.(val || '')
  }, [onChange])

  /**
   * Handle file upload
   * @param file File to upload
   * @returns Uploaded file URL
   */
  const handleUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Handle image upload
   * @param file Image file to upload
   * @returns Uploaded image URL
   */
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (slug) {
        formData.append('slug', slug)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }, [slug])

  /**
   * Handle drag and drop image upload
   */
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    
    setUploading(true)
    
    try {
      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      
      for (const file of imageFiles) {
        try {
          const url = await handleImageUpload(file)
          const imageMarkdown = `![${file.name}](${url})`
          // Add new image markdown to current editor value
          const newValue = value + '\n' + imageMarkdown + '\n'
          // Update editor content
          handleEditorChange(newValue)
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }
    } catch (error) {
      console.error('Error handling dropped images:', error)
    } finally {
      setUploading(false)
    }
  }, [handleImageUpload, value, handleEditorChange])

  return (
    <div 
      className={`relative h-full ${className}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Upload status overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white">Uploading image...</div>
        </div>
      )}

      {/* Markdown Editor */}
      <MDEditor
        value={value}
        onChange={handleEditorChange}
        height="100%"
        preview="live"
        style={{ height: '100%' }}
        hideToolbar={false}
        enableScroll={true}
        previewOptions={{
          // Recommended not to modify
          // Editor supports automatic switching between system day and night theme modes
          // className: `
          //   prose-headings:text-white
          //   prose-ul:list-disc 
          //   prose-ul:text-white
          //   prose-ol:list-decimal
          //   prose-ol:text-white
          //  `
        }}
        extraCommands={[
          // Image upload button
          {
            name: 'image',
            keyCommand: 'image',
            buttonProps: { 'aria-label': 'Insert Image' },
            icon: <span>📷</span>,
            execute: async (state, api) => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0]
                if (file) {
                  try {
                    setUploading(true)
                    const url = await handleImageUpload(file)
                    const imageMarkdown = `![${file.name}](${url})`
                    const newValue = state.text + '\n' + imageMarkdown + '\n'
                    handleEditorChange(newValue)
                  } catch (error) {
                    console.error('Error uploading image:', error)
                  } finally {
                    setUploading(false)
                  }
                }
              }
              input.click()
            },
          },
        ]}
      />
    </div>
  )
}