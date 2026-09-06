import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'

interface TopBarProps {
  onOpenMobile?: () => void
}

export function TopBar({ onOpenMobile }: TopBarProps) {
  const { sidebarCollapsed, darkMode, toggleDarkMode } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  return (
    <header
      className={`fixed top-0 right-0 h-topbar-height z-40 bg-surface-container-lowest/90 backdrop-blur-2xl px-gutter-desktop flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] transition-all duration-300 ${
        sidebarCollapsed ? 'left-sidebar-collapsed' : 'left-sidebar-width'
      }`}
    >
      {/* Mobile Menu Button */}
      <div className="flex md:hidden items-center gap-space-xs">
        <button
          onClick={onOpenMobile}
          className="p-space-xs text-on-surface-variant hover:text-on-surface"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="font-headline-sm text-headline-sm text-on-surface">DesignHQ</span>
      </div>

      {/* Global Search Bar (Desktop) */}
      <div className="hidden md:flex items-center gap-space-sm w-full max-w-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search collections, swatches, sketches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-20 py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all"
          />
          <kbd className="absolute right-space-sm top-1/2 -translate-y-1/2 font-label-sm text-label-sm px-space-2xs py-0.5 rounded bg-surface-container-lowest text-outline border border-outline-variant/30">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-space-md">
        {/* Velvet / Alabaster Theme Toggle */}
        <div className="flex items-center rounded-lg bg-surface-container-high/40 p-0.5 border border-outline-variant/20">
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`px-space-xs py-space-2xs rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all ${
              darkMode
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title="Dark Velvet Mode"
          >
            <span className="material-symbols-outlined text-sm">dark_mode</span>
            <span className="hidden sm:inline">Velvet</span>
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`px-space-xs py-space-2xs rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-all ${
              !darkMode
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title="Atelier Light Mode"
          >
            <span className="material-symbols-outlined text-sm">light_mode</span>
            <span className="hidden sm:inline">Alabaster</span>
          </button>
        </div>



        {/* Primary CTA: New Collection */}
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(128,0,32,0.45)]"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span className="font-semibold hidden sm:inline">New Collection</span>
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(255,179,181,0.3)]">
          AR
        </div>
      </div>
    </header>
  )
}
