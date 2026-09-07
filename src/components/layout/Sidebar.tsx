import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/useAppStore'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/' },
  { icon: 'styler', label: 'Collections', to: '/projects' },
  { icon: 'content_cut', label: 'Patterns', to: '/patterns' },
  { icon: 'auto_awesome_motion', label: 'Mood Boards & AI', to: '/moodboards' },
  { icon: 'draw', label: 'Sketchbook', to: '/sketchbook' },
  { icon: 'texture', label: 'Fabric Swatches', to: '/fabrics' },
  { icon: 'straighten', label: 'Fitting Notes', to: '/notes' },
  { icon: 'auto_stories', label: 'Portfolio', to: '/portfolio' },
]

interface SidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const { profile, signOut } = useAuth()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const navigate = useNavigate()

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 h-full ${
          sidebarCollapsed && !mobileOpen ? 'w-sidebar-collapsed' : 'w-sidebar-width'
        } bg-surface-container-lowest/90 backdrop-blur-2xl z-50 flex flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] transition-all duration-300 ${
          mobileOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-topbar-height px-space-md flex items-center gap-space-xs bg-surface-container-low/40 border-b border-outline-variant/20">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-[0_0_12px_rgba(128,0,32,0.6)] flex-shrink-0">
              <span className="material-symbols-outlined text-lg">styler</span>
            </div>
            {(!sidebarCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate tracking-tight">
                  DesignHQ
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                  Atelier Studio
                </span>
              </div>
            )}
          </div>

          {/* Primary Nav */}
          <nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs">
            {navItems.map(({ icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all font-title-sm text-title-sm ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-[0_4px_20px_rgba(128,0,32,0.45)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  } ${sidebarCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title={sidebarCollapsed && !mobileOpen ? label : undefined}
              >
                <span className="material-symbols-outlined text-lg flex-shrink-0">{icon}</span>
                {(!sidebarCollapsed || mobileOpen) && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profile Card Footer */}
        <div className="p-space-sm m-space-sm rounded-xl bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20">
          {(!sidebarCollapsed || mobileOpen) ? (
            <>
              <div className="flex items-center gap-space-xs mb-space-xs">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-[0_0_8px_rgba(255,179,181,0.3)]">
                  AR
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                    {profile?.display_name || 'Ariba'}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline truncate">
                    {profile?.university || 'Royal College of Art'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-2xs border-t border-outline-variant/20">
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-space-2xs text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">settings</span>
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => signOut().then(() => navigate('/login'))}
                  className="text-on-surface-variant hover:text-error transition-colors p-space-2xs rounded"
                  type="button"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-on-surface-variant hover:text-on-surface"
                title="Expand Sidebar"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
