import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { useAppStore } from '@/store/useAppStore'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useAppStore()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const sidebarW = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar (Desktop Rail & Mobile Drawer) */}
      <Sidebar
        mobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      {/* Top Header */}
      <TopBar onOpenMobile={() => setMobileDrawerOpen(true)} />

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

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Glass Navigation */}
      <BottomNav />
    </div>
  )
}
