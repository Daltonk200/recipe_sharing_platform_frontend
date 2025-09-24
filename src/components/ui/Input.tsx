import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'flex w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 hover:border-neutral-400 focus:border-primary-400',
        error: 'border-red-300 hover:border-red-400 focus:border-red-400 focus-visible:ring-red-400',
        success: 'border-green-300 hover:border-green-400 focus:border-green-400 focus-visible:ring-green-400',
      },
      size: {
        sm: 'h-9 px-3 py-2 text-xs',
        default: 'h-11 px-4 py-3 text-sm',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          className={cn(inputVariants({ variant: error ? 'error' : variant, size, className }))}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-red-600' : 'text-neutral-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  helperText?: string
}>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            error 
              ? 'border-red-300 hover:border-red-400 focus:border-red-400 focus-visible:ring-red-400'
              : 'border-neutral-300 hover:border-neutral-400 focus:border-primary-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('text-xs', error ? 'text-red-600' : 'text-neutral-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Input, Textarea }
