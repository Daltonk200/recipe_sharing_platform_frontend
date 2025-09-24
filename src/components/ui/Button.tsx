import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-medium',
        secondary: 'bg-neutral-100 text-neutral-800 shadow-soft hover:bg-neutral-200 hover:shadow-medium',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 hover:text-primary-600',
        ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
        destructive: 'bg-red-500 text-white shadow-soft hover:bg-red-600 hover:shadow-medium',
        success: 'bg-green-500 text-white shadow-soft hover:bg-green-600 hover:shadow-medium',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        default: 'h-11 px-6 py-2',
        lg: 'h-12 px-8 text-lg',
        xl: 'h-14 px-10 text-xl',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, onClick, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        onClick={onClick}
        {...(props as any)}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
