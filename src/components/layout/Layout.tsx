import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import type { User } from '../../api/auth'

interface LayoutProps {
  children: React.ReactNode
  user?: User
  onSearch?: (query: string) => void
  searchQuery?: string
  onLogout?: () => void
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  onSearch,
  searchQuery = '',
  onLogout,
  className = ''
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar
        user={user || null}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onSearch={onSearch}
          searchQuery={searchQuery}
        />

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`min-h-screen w-full ${className}`}
        >
          {children}
        </motion.main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
