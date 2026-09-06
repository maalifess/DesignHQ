import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export function BottomNav() {
  const location = useLocation()

  // Dynamic 5th destination tab based on location context
  const fifthTab = location.pathname.includes('/projects') || location.pathname.includes('/notes')
    ? { icon: 'straighten', label: 'Fitting', to: '/notes' }
    : { icon: 'auto_stories', label: 'Portfolio', to: '/portfolio' }

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', to: '/' },
    { icon: 'styler', label: 'Collections', to: '/projects' },
    { icon: 'draw', label: 'Sketchbook', to: '/sketchbook' },
    { icon: 'texture', label: 'Fabrics', to: '/fabrics' },
    fifthTab,
  ]

  return (
    <nav className="fixed bottom-3 left-3 right-3 h-14 z-50 bg-surface-container-lowest/90 backdrop-blur-2xl rounded-full border border-outline-variant/30 px-3 flex items-center justify-around shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] md:hidden">
      {navItems.map(({ icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 text-center py-1 transition-all ${
              isActive
                ? 'text-primary font-bold scale-105'
                : 'text-on-surface-variant hover:text-on-surface font-normal'
            }`
          }
        >
          <span className="material-symbols-outlined text-xl mb-0.5">{icon}</span>
          <span className="font-label-sm text-[10px] tracking-tight truncate">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
