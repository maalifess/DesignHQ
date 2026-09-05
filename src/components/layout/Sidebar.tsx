import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Image, PenLine, Layers2,
  FileText, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight,
  Scissors,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/useAppStore'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    to: '/' },
  { icon: FolderKanban,   label: 'Projects',      to: '/projects' },
  { icon: Image,          label: 'Mood Boards',   to: '/moodboards' },
  { icon: PenLine,        label: 'Sketchbook',    to: '/sketchbook' },
  { icon: Layers2,        label: 'Fabrics',       to: '/fabrics' },
  { icon: FileText,       label: 'Notes',         to: '/notes' },
  { icon: BookOpen,       label: 'Portfolio',     to: '/portfolio' },
]

export function Sidebar() {
  const { user, profile, signOut } = useAuth()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const navigate = useNavigate()

  const w = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <motion.aside
      className="glass-sidebar"
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 'var(--z-sidebar)' as any,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        padding: sidebarCollapsed ? '1.25rem 0' : '1.25rem 1.25rem',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
        minHeight: 'var(--topbar-height)',
      }}>
        {/* Logo mark */}
        <div style={{
          width: 32, height: 32,
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-deep))',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Scissors size={16} color="white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.375rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                letterSpacing: '0.01em',
              }}
            >
              DesignHQ
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav links ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={{ display: 'block', textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.12 }}
                data-tooltip={sidebarCollapsed ? label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarCollapsed ? '0.75rem 0' : '0.625rem 1.25rem',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  marginBottom: '0.125rem',
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  borderRight: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Settings & User ── */}
      <div style={{ borderTop: '1px solid var(--glass-border)', padding: '0.75rem 0' }}>
        <NavLink to="/settings" style={{ display: 'block', textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: sidebarCollapsed ? '0.75rem 0' : '0.625rem 1.25rem',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
            }}>
              <Settings size={18} />
              {!sidebarCollapsed && <span>Settings</span>}
            </div>
          )}
        </NavLink>

        {/* User info */}
        {!sidebarCollapsed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.75rem 1.25rem',
            marginTop: '0.25rem',
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-mid))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.8125rem',
              fontWeight: 600,
              flexShrink: 0,
              overflow: 'hidden',
            }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (profile?.display_name || profile?.full_name || 'A').charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', truncate: true } as any} className="truncate">
                {profile?.display_name || profile?.full_name || 'Ariba'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut().then(() => navigate('/login'))}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                borderRadius: 'var(--radius-sm)',
              }}
              data-tooltip="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
          }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          data-tooltip={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  )
}
