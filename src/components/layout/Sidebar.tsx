import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/useAppStore'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', to: '/' },
  { icon: 'styler', label: 'Collections', to: '/projects' },
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
  const { user, profile, signOut } = useAuth()
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const navigate = useNavigate()

  const displayName = profile?.display_name || profile?.full_name || 'Aria Chen'
  const subtitle = profile?.university || 'Royal College of Art'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
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

      <aside
        className={`fixed left-0 top-0 h-full w-sidebar-width bg-surface-container-lowest/90 backdrop-blur-2xl z-50 flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] border-r border-outline-variant/30 ${
          mobileOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        <div className="flex flex-col">
          {/* Atelier Brand Header */}
          <div className="h-topbar-height px-space-md flex items-center justify-between bg-surface-container-low/40 border-b border-outline-variant/20">
            <div className="flex items-center gap-space-xs min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-on-primary font-bold shadow-md flex-shrink-0 border border-pearl-highlight">
                <span className="material-symbols-outlined text-lg">content_cut</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate tracking-tight font-semibold">
                  DesignHQ
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                  Atelier Studio
                </span>
              </div>
            </div>

            {/* Mobile close trigger */}
            {mobileOpen && (
              <button
                onClick={onCloseMobile}
                className="text-on-surface-variant hover:text-on-surface p-1 md:hidden"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs">
            {navItems.map(({ icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={onCloseMobile}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <div
                    className={`flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all font-title-sm text-title-sm cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-semibold shadow-[0_4px_20px_rgba(128,0,32,0.45)]'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-on-primary' : 'text-primary'}`}>
                      {icon}
                    </span>
                    <span className="truncate">{label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer Card */}
        <div className="p-space-sm m-space-sm rounded-xl bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/20">
          <div className="flex items-center gap-space-xs mb-space-xs">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-[0_0_8px_rgba(255,179,181,0.3)] border border-primary/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(255,179,181,0.3)] border border-primary/40">
                {initials}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                {displayName}
              </span>
              <span className="font-label-sm text-label-sm text-outline truncate">
                {subtitle}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-space-2xs border-t border-outline-variant/20">
            <button
              onClick={() => {
                navigate('/settings')
                onCloseMobile?.()
              }}
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
              title="Sign out"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
