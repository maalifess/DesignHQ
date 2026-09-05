import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Image, PenLine, Layers2,
  FileText, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight,
  Scissors, X,
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

interface SidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const { user, profile, signOut } = useAuth()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const navigate = useNavigate()

  const w = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(13, 4, 7, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 'calc(var(--z-sidebar) - 1)' as any,
            }}
            className="md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`glass-sidebar ${mobileOpen ? 'flex' : 'hidden md:flex'}`}
        animate={{ width: mobileOpen ? 'var(--sidebar-width)' : w }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          zIndex: 'var(--z-sidebar)' as any,
          overflow: 'hidden',
          flexDirection: 'column',
        }}
      >
        {/* ── Logo ── */}
        <div style={{
          padding: sidebarCollapsed && !mobileOpen ? '1.25rem 0' : '1.25rem 1.25rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          justifyContent: sidebarCollapsed && !mobileOpen ? 'center' : 'space-between',
          minHeight: 'var(--topbar-height)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Logo mark */}
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-deep))',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(128, 0, 32, 0.4)',
              border: '1px solid var(--pearl-highlight)',
            }}>
              <Scissors size={18} color="#FFF0F3" />
            </div>
            <AnimatePresence>
              {(!sidebarCollapsed || mobileOpen) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Design<span style={{ color: 'var(--accent-secondary)' }}>HQ</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Close button for mobile drawer */}
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="btn btn-ghost btn-icon md:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Nav links ── */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0' }}>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onCloseMobile}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.12 }}
                  data-tooltip={sidebarCollapsed && !mobileOpen ? label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: sidebarCollapsed && !mobileOpen ? '0.75rem 0' : '0.625rem 1.25rem',
                    justifyContent: sidebarCollapsed && !mobileOpen ? 'center' : 'flex-start',
                    marginBottom: '0.125rem',
                    background: isActive ? 'rgba(128, 0, 32, 0.15)' : 'transparent',
                    borderRight: isActive ? '3px solid var(--accent-secondary)' : '3px solid transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? 'var(--accent-secondary)' : 'var(--text-muted)', flexShrink: 0 }} />
                  <AnimatePresence>
                    {(!sidebarCollapsed || mobileOpen) && (
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
          <NavLink to="/settings" onClick={onCloseMobile} style={{ display: 'block', textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: sidebarCollapsed && !mobileOpen ? '0.75rem 0' : '0.625rem 1.25rem',
                justifyContent: sidebarCollapsed && !mobileOpen ? 'center' : 'flex-start',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
              }}>
                <Settings size={18} style={{ color: isActive ? 'var(--accent-secondary)' : 'var(--text-muted)' }} />
                {(!sidebarCollapsed || mobileOpen) && <span>Settings</span>}
              </div>
            )}
          </NavLink>

          {/* User info */}
          {(!sidebarCollapsed || mobileOpen) && (
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
                color: '#FFF0F3',
                fontSize: '0.8125rem',
                fontWeight: 600,
                flexShrink: 0,
                overflow: 'hidden',
                border: '1px solid var(--pearl-highlight)',
              }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (profile?.display_name || profile?.full_name || 'A').charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
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

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex"
            style={{
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
    </>
  )
}
