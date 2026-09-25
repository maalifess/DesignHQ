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

      <main
        className={`flex-1 mt-[var(--topbar-height)] min-h-[calc(100vh-var(--topbar-height))] p-4 pb-[calc(var(--bottomnav-height)+1.5rem)] md:p-8 md:pb-8 w-full max-w-[1400px] box-border transition-[margin-left] duration-300 ${
          sidebarCollapsed ? 'md:ml-[var(--sidebar-collapsed)]' : 'md:ml-[var(--sidebar-width)]'
        }`}
      >
        <div key={location.pathname}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  )
}
