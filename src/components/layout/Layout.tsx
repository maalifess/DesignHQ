import React from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useAppStore } from '@/store/useAppStore'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useAppStore()
  const sidebarW = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar />
      <TopBar />
      <motion.main
        animate={{ marginLeft: sidebarW }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          flex: 1,
          marginTop: 'var(--topbar-height)',
          minHeight: `calc(100vh - var(--topbar-height))`,
          padding: '2rem',
          overflowX: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  )
}
