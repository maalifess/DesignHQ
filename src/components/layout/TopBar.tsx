import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useDarkMode } from '@/hooks/useDarkMode'

const breadcrumbMap: Record<string, string> = {
  '/':            'Dashboard',
  '/projects':    'Projects',
  '/moodboards':  'Mood Boards',
  '/sketchbook':  'Sketchbook',
  '/fabrics':     'Fabric Library',
  '/notes':       'Design Notes',
  '/portfolio':   'Portfolio',
  '/settings':    'Settings',
}

function getBreadcrumb(pathname: string): string[] {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return ['Dashboard']
  const crumbs: string[] = []
  let path = ''
  for (const part of parts) {
    path += '/' + part
    const label = breadcrumbMap[path]
    if (label) crumbs.push(label)
    else crumbs.push(part.charAt(0).toUpperCase() + part.slice(1))
  }
  return crumbs
}

export function TopBar() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { sidebarCollapsed } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const breadcrumbs = getBreadcrumb(location.pathname)
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]

  const sidebarW = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <motion.header
      className="glass-topbar"
      animate={{ left: sidebarW }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0, right: 0,
        height: 'var(--topbar-height)',
        zIndex: 'var(--z-topbar)' as any,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        gap: '1rem',
      }}
    >
      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
            <span style={{
              fontFamily: i === breadcrumbs.length - 1 ? 'var(--font-display)' : 'var(--font-ui)',
              fontSize: i === breadcrumbs.length - 1 ? '1.125rem' : '0.875rem',
              fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
              color: i === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: '240px', flexShrink: 0 }}>
        <Search size={15} style={{
          position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none',
        }} />
        <input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{
            paddingLeft: '2.25rem',
            height: '36px',
            fontSize: '0.875rem',
            borderRadius: 'var(--radius-full)',
          }}
          id="global-search"
          aria-label="Global search"
        />
      </div>

      {/* Dark mode toggle */}
      <motion.button
        onClick={toggleDarkMode}
        whileTap={{ scale: 0.9 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          background: 'var(--accent-light)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-full)',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          color: 'var(--accent-primary)',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          flexShrink: 0,
        }}
        aria-label="Toggle dark mode"
        id="dark-mode-toggle"
      >
        {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        <span>{darkMode ? 'Light' : 'Dark'}</span>
      </motion.button>
    </motion.header>
  )
}
