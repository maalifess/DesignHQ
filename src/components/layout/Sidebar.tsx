import React from 'react'
import { NavLink } from 'react-router-dom'
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

export function Sidebar() {
  const { sidebarCollapsed } = useAppStore()

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 h-full ${
        sidebarCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar-width'
      } bg-surface-container-lowest/90 backdrop-blur-2xl z-50 flex-col justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] transition-all duration-300`}
    >
      <div className="flex flex-col">
        {/* Logo Header */}
        <div className="h-topbar-height px-space-md flex items-center gap-space-xs bg-surface-container-low/40 border-b border-outline-variant/20">
          <img
            src="/logo.png"
            alt="Ariba's Atelier Logo"
            className="w-8 h-8 rounded-lg object-cover shadow-[0_0_12px_rgba(128,0,32,0.6)] flex-shrink-0"
          />
          {!sidebarCollapsed && (
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate tracking-tight">
              Ariba's Atelier
            </span>
          )}
        </div>

        {/* Primary Nav */}
        <nav className="flex flex-col gap-space-2xs p-space-sm mt-space-xs">
          {navItems.map(({ icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-space-xs rounded-lg transition-all font-title-sm text-title-sm ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-[0_4px_20px_rgba(128,0,32,0.45)]'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
              }
              title={sidebarCollapsed ? label : undefined}
            >
              <span className="material-symbols-outlined text-lg flex-shrink-0">{icon}</span>
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
