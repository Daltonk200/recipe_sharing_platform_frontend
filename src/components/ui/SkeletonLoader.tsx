import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  animate?: boolean
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}) => {
  const baseClasses = 'bg-neutral-200'
  
  const variantClasses = {
    text: 'rounded-md',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
  }

  if (animate) {
    return (
      <motion.div
        className={cn(
          baseClasses,
          variantClasses[variant],
          'bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200px_100%] bg-no-repeat',
          className
        )}
        style={{
          width: width || '100%',
          height: height || (variant === 'text' ? '1rem' : '2rem'),
        }}
        initial={{ backgroundPosition: '-200px 0' }}
        animate={{ backgroundPosition: 'calc(200px + 100%) 0' }}
        transition={{
          duration: 1.5,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '2rem'),
      }}
    />
  )
}

// Recipe Card Skeleton
const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-soft p-6 space-y-4">
      <Skeleton variant="rectangular" height="200px" />
      <div className="space-y-2">
        <Skeleton variant="text" height="1.5rem" width="80%" />
        <Skeleton variant="text" height="1rem" width="60%" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" height="1rem" width="40%" />
        <Skeleton variant="text" height="1rem" width="30%" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" height="2rem" width="4rem" />
        <Skeleton variant="rectangular" height="2rem" width="3rem" />
      </div>
    </div>
  )
}

// Recipe Detail Skeleton
const RecipeDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton variant="text" height="2.5rem" width="70%" />
        <Skeleton variant="text" height="1.25rem" width="50%" />
        <Skeleton variant="rectangular" height="400px" />
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-neutral-50 p-4 space-y-2">
            <Skeleton variant="text" height="1rem" width="60%" />
            <Skeleton variant="text" height="1.5rem" width="40%" />
          </div>
        ))}
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <Skeleton variant="text" height="1.5rem" width="30%" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="text" height="1.25rem" width={`${60 + Math.random() * 30}%`} />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <Skeleton variant="text" height="1.5rem" width="30%" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton variant="text" height="1.25rem" width="100%" />
              <Skeleton variant="text" height="1.25rem" width={`${70 + Math.random() * 20}%`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Comment Skeleton
const CommentSkeleton: React.FC = () => {
  return (
    <div className="border-b border-neutral-200 pb-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="2rem" height="2rem" />
        <div className="space-y-1">
          <Skeleton variant="text" height="1rem" width="6rem" />
          <Skeleton variant="text" height="0.75rem" width="4rem" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" height="1rem" width="90%" />
        <Skeleton variant="text" height="1rem" width="70%" />
      </div>
    </div>
  )
}

// Grid Skeleton for lists
const GridSkeleton: React.FC<{ count?: number; component: React.ComponentType }> = ({ 
  count = 8, 
  component: Component 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  )
}

export { 
  Skeleton, 
  RecipeCardSkeleton, 
  RecipeDetailSkeleton, 
  CommentSkeleton, 
  GridSkeleton 
}
