import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useAuth } from '@/hooks/useAuth'

interface TopBarProps {
  onOpenMobile?: () => void
  onNewProject?: () => void
}

export function TopBar({ onOpenMobile, onNewProject }: TopBarProps) {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const { sidebarCollapsed } = useAppStore()
  const { profile } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const displayName = profile?.display_name || profile?.full_name || 'Aria Chen'
  const initials = displayName.charAt(0).toUpperCase()

  const sidebarW = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'

  return (
    <header
      className="fixed top-0 right-0 h-topbar-height z-40 bg-surface-container-lowest/80 backdrop-blur-2xl px-4 md:px-gutter-desktop flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] border-b border-outline-variant/30"
      style={{
        left: 0,
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          header.fixed {
            left: ${sidebarW} !important;
            transition: left 0.25s ease-in-out;
          }
        }
      `}</style>

      {/* Left: Mobile Drawer Button & Search Input */}
      <div className="flex items-center gap-space-sm w-full max-w-lg">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface md:hidden"
          type="button"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="relative w-full hidden sm:block">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            className="w-full pl-9 pr-20 py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
            placeholder="Search collections, swatches, sketches..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="absolute right-space-sm top-1/2 -translate-y-1/2 font-label-sm text-label-sm px-space-2xs py-0.5 rounded bg-surface-container-lowest text-outline border border-outline-variant/30">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-xs sm:gap-space-md">
        {/* Velvet / Alabaster Mode Switcher */}
        <div className="flex items-center rounded-lg bg-surface-container-high/40 p-0.5 border border-outline-variant/20">
          <button
            onClick={() => { if (!darkMode) toggleDarkMode() }}
            className={`px-space-xs py-space-2xs rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all ${
              darkMode
                ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title="Dark Velvet Mode"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">dark_mode</span>
            <span className="hidden sm:inline">Velvet</span>
          </button>
          <button
            onClick={() => { if (darkMode) toggleDarkMode() }}
            className={`px-space-xs py-space-2xs rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all ${
              !darkMode
                ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title="Atelier Light Mode"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">light_mode</span>
            <span className="hidden sm:inline">Alabaster</span>
          </button>
        </div>

        {/* Notifications Bell */}
        <button
          className="relative p-space-xs rounded-lg bg-surface-container-high/50 text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/20"
          type="button"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-on-error font-label-sm text-[9px] font-bold flex items-center justify-center leading-none shadow-md">
            3
          </span>
        </button>

        {/* New Collection CTA */}
        <button
          onClick={() => {
            if (onNewProject) onNewProject()
            else navigate('/projects')
          }}
          className="flex items-center gap-space-2xs px-space-sm sm:px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(128,0,32,0.45)] border border-pearl-highlight"
          type="button"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span className="font-semibold hidden xs:inline">New Collection</span>
        </button>

        {/* User Profile Avatar */}
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover shadow-[0_0_8px_rgba(255,179,181,0.3)] border border-primary/40 cursor-pointer"
            onClick={() => navigate('/settings')}
          />
        ) : (
          <div
            onClick={() => navigate('/settings')}
            className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(255,179,181,0.3)] border border-primary/40 cursor-pointer"
          >
            {initials}
          </div>
        )}
      </div>
    </header>
  )
}
