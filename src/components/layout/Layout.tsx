import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { useAppStore } from '@/store/useAppStore'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useAppStore()
  const location = useLocation()
  const sidebarW = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar (Desktop Rail Only) */}
      <Sidebar />

      {/* Top Header */}
      <TopBar />

      {/* Main Page Canvas Container */}
      <main
        style={{
          flex: 1,
          marginTop: 'var(--topbar-height)',
          minHeight: `calc(100vh - var(--topbar-height))`,
          padding: '1.5rem',
          paddingBottom: 'calc(var(--bottomnav-height) + 2rem)',
          maxWidth: '1400px',
          width: '100%',
          boxSizing: 'border-box',
        }}
        className="main-layout-container"
      >
        <style>{`
          @media (min-width: 768px) {
            .main-layout-container {
              margin-left: ${sidebarW} !important;
              padding: 2rem !important;
              padding-bottom: 2rem !important;
              transition: margin-left 0.25s ease-in-out;
            }
          }
          @media (max-width: 767px) {
            .main-layout-container {
              margin-left: 0 !important;
              padding: 1rem !important;
              padding-bottom: calc(var(--bottomnav-height) + 1.5rem) !important;
            }
          }
        `}</style>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  )
}
