import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export function BottomNav() {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', to: '/' },
    { icon: 'styler', label: 'Collections', to: '/projects' },
    { icon: 'draw', label: 'Sketchbook', to: '/sketchbook' },
    { icon: 'edit_note', label: 'Notes', to: '/notes' },
    { icon: 'dashboard', label: 'Moods', to: '/moodboards' },
  ]

  return (
    <nav className="fixed bottom-3 left-3 right-3 h-14 z-50 bg-surface-container-lowest/95 backdrop-blur-2xl rounded-full border border-outline-variant/30 px-2 flex items-center justify-around shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] md:hidden">
      {navItems.map(({ icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center flex-1 text-center py-1 transition-all min-h-[44px] cursor-pointer ${
              isActive
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface font-normal'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-0 bg-primary-container/30 rounded-full border border-primary/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="material-symbols-outlined text-xl mb-0.5 relative z-10">{icon}</span>
              <span className="font-label-sm text-[10px] tracking-tight truncate relative z-10">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
