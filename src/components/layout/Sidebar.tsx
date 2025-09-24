import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Plus, 
  User, 
  X,
  ChefHat
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui'
import type { User as UserType } from '../../api/auth'

interface SidebarProps {
  user: UserType | null
  isOpen?: boolean
  onClose?: () => void
  onLogout?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  isOpen = false, 
  onClose, 
  onLogout 
}) => {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Create Recipe', href: '/create-recipe', icon: Plus, current: location.pathname === '/create-recipe' },
  ]

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-neutral-200 px-6 py-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-amber-600" />
              <span className="text-xl font-bold text-neutral-900">RecipeShare</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          item.current
                            ? 'bg-amber-50 text-amber-700 border-r-2 border-amber-600'
                            : 'text-neutral-700 hover:text-amber-600 hover:bg-amber-50',
                          'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-medium transition-colors'
                        )}
                      >
                        <item.icon
                          className={cn(
                            item.current ? 'text-amber-600' : 'text-neutral-400 group-hover:text-amber-600',
                            'h-5 w-5 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* User Section */}
              <li className="mt-auto">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {onLogout && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onLogout}
                        className="w-full justify-center"
                      >
                        Sign Out
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 hover:text-primary-600 h-9 px-3 text-sm w-full"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-medium h-9 px-3 text-sm w-full"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 lg:hidden"
      >
        <div className="flex h-full flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <ChefHat className="h-6 w-6 text-amber-600" />
              <span className="text-lg font-bold text-neutral-900">RecipeShare</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4">
            <ul role="list" className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      item.current
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-neutral-700 hover:text-amber-600 hover:bg-amber-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                    )}
                  >
                    <item.icon
                      className={cn(
                        item.current ? 'text-amber-600' : 'text-neutral-400 group-hover:text-amber-600',
                        'h-5 w-5 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile User Section */}
          <div className="p-4 border-t border-neutral-200">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-x-3 p-3 bg-neutral-50 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {onLogout && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    className="w-full justify-center"
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 hover:text-primary-600 h-9 px-3 text-sm w-full"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-500 text-white shadow-soft hover:bg-primary-600 hover:shadow-medium h-9 px-3 text-sm w-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}


