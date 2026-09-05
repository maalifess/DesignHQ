import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, ChevronRight, Menu, Scissors } from 'lucide-react'
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

interface TopBarProps {
  onOpenMobile?: () => void
}

export function TopBar({ onOpenMobile }: TopBarProps) {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { sidebarCollapsed } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpenMobile, setSearchOpenMobile] = useState(false)
  const navigate = useNavigate()

  const breadcrumbs = getBreadcrumb(location.pathname)
  const sidebarW = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <header
      className="glass-topbar"
      style={{
        position: 'fixed',
        top: 0, right: 0,
        left: 0,
        height: 'var(--topbar-height)',
        zIndex: 'var(--z-topbar)' as any,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        gap: '0.75rem',
      }}
    >
      {/* Desktop margin spacer to align topbar with sidebar */}
      <style>{`
        @media (min-width: 768px) {
          .glass-topbar {
            left: ${sidebarW} !important;
            padding: 0 1.5rem !important;
            transition: left 0.25s ease-in-out;
          }
        }
      `}</style>

      {/* Mobile Drawer Toggle & Logo */}
      <div className="flex md:hidden" style={{ alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={onOpenMobile}
          className="btn btn-ghost btn-icon"
          aria-label="Open menu"
          style={{ padding: '4px' }}
        >
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div style={{
            width: 26, height: 26,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-deep))',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Scissors size={14} color="#FFF0F3" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem' }}>
            Design<span style={{ color: 'var(--accent-secondary)' }}>HQ</span>
          </span>
        </div>
      </div>

      {/* Breadcrumb (Desktop) */}
      <div className="hidden md:flex" style={{ flex: 1, alignItems: 'center', gap: '0.375rem', minWidth: 0 }}>
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

      <div style={{ flex: 1 }} className="md:hidden" />

      {/* Global Search Field */}
      <div style={{ position: 'relative', width: '220px' }} className="hidden sm:block">
        <Search size={15} style={{
          position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none',
        }} />
        <input
          type="search"
          placeholder="Search collections, fabrics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
          style={{
            paddingLeft: '2.25rem',
            height: '36px',
            fontSize: '0.8125rem',
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
          background: 'rgba(128, 0, 32, 0.12)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-full)',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.8125rem',
          fontWeight: 600,
          flexShrink: 0,
        }}
        aria-label="Toggle theme"
        id="dark-mode-toggle"
      >
        {darkMode ? <Sun size={15} style={{ color: 'var(--accent-secondary)' }} /> : <Moon size={15} style={{ color: 'var(--accent-secondary)' }} />}
        <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
      </motion.button>
    </header>
  )
}
