import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, User as UserIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input, Button } from '../ui'
import type { User } from '../../api/auth'

interface HeaderProps {
  user?: User
  isSidebarOpen?: boolean
  toggleSidebar?: () => void
  onSearch?: (query: string) => void
  searchQuery?: string
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onSearch,
  searchQuery = ''
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Search Section */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, chefs..."
                value={searchQuery}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-10 w-full max-w-md bg-neutral-50 border-neutral-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-neutral-600 hover:text-amber-600"
            >
              <Bell className="h-5 w-5" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full border-2 border-white" />
            </Button>

            {/* User Profile */}
            {user ? (
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-neutral-900">{user.username}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
