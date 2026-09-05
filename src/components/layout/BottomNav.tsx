import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FolderKanban, Image, PenLine, Layers2,
  FileText, BookOpen,
} from 'lucide-react'

const mobileNavItems = [
  { icon: LayoutDashboard, label: 'Home',      to: '/' },
  { icon: FolderKanban,    label: 'Projects',  to: '/projects' },
  { icon: Image,           label: 'Moods',     to: '/moodboards' },
  { icon: PenLine,         label: 'Sketch',    to: '/sketchbook' },
  { icon: Layers2,         label: 'Fabrics',   to: '/fabrics' },
  { icon: FileText,        label: 'Notes',     to: '/notes' },
  { icon: BookOpen,        label: 'Portfolio', to: '/portfolio' },
]

export function BottomNav() {
  return (
    <nav
      className="glass-bottomnav md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottomnav-height)',
        zIndex: 'var(--z-bottomnav)' as any,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem',
      }}
    >
      {mobileNavItems.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.92 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '4px 0',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                position: 'relative',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    width: '20px',
                    height: '3px',
                    borderRadius: '9999px',
                    background: 'var(--accent-secondary)',
                    boxShadow: '0 0 10px var(--accent-secondary)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }} />
              <span style={{
                fontSize: '0.6875rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'var(--font-ui)',
                lineHeight: 1,
              }}>
                {label}
              </span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
