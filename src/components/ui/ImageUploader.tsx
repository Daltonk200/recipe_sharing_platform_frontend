import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './Button'

interface ImageUploaderProps {
  value?: string
  onChange: (file: File | null, url?: string) => void
  onProgress?: (progress: number) => void
  className?: string
  accept?: string
  maxSize?: number // in MB
  disabled?: boolean
  loading?: boolean
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onProgress,
  className,
  accept = 'image/*',
  maxSize = 5,
  disabled = false,
  loading = false,
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Call onChange with the file
    onChange(file)
  }, [maxSize, onChange])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled || loading) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [disabled, loading, handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleRemove = useCallback(() => {
    setPreview(null)
    setError(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const handleClick = useCallback(() => {
    if (disabled || loading) return
    fileInputRef.current?.click()
  }, [disabled, loading])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl transition-all cursor-pointer',
          dragActive
            ? 'border-primary-400 bg-primary-50'
            : preview
            ? 'border-neutral-300 bg-neutral-50'
            : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick()
                    }}
                    disabled={disabled || loading}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                    disabled={disabled || loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">Uploading...</p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-12 text-center"
            >
              {loading ? (
                <div>
                  <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
                  <p className="text-neutral-600">Uploading...</p>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-neutral-700">
                      Drop your image here, or{' '}
                      <span className="text-primary-500">browse</span>
                    </p>
                    <p className="text-sm text-neutral-500">
                      Supports: JPG, PNG, GIF (max {maxSize}MB)
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled || loading}
        />
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export { ImageUploader }
