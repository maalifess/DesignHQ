import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

export function TopBar() {
  const { sidebarCollapsed, darkMode, toggleDarkMode } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  return (
    <header
      className={`fixed top-0 right-0 left-0 md:${
        sidebarCollapsed ? 'left-sidebar-collapsed' : 'left-sidebar-width'
      } h-topbar-height z-40 bg-surface-container-lowest/90 backdrop-blur-2xl px-4 md:px-gutter-desktop flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] transition-all duration-300`}
    >
      {/* Mobile Branding (No sidebar toggle menu on mobile) */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold shadow-[0_0_10px_rgba(128,0,32,0.5)] flex-shrink-0">
          <span className="material-symbols-outlined text-lg">styler</span>
        </div>
        <span className="font-headline-sm text-headline-sm text-on-surface font-bold text-base tracking-tight truncate">
          Ariba's Atelier
        </span>
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
      <div className="flex items-center gap-2 md:gap-space-md">
        {/* Animated Single Theme Toggle Button */}
        <motion.button
          type="button"
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md cursor-pointer select-none transition-colors duration-300 ${
            darkMode
              ? 'bg-surface-container-high/80 border-outline-variant/40 text-on-surface hover:bg-surface-container-highest shadow-[0_0_12px_rgba(255,177,194,0.12)]'
              : 'bg-surface-container-high border-outline-variant/50 text-on-surface hover:bg-surface-container-highest shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
          }`}
          aria-label="Toggle theme mode"
          title={darkMode ? 'Currently Dark (Velvet). Click to switch to Light (Alabaster)' : 'Currently Light (Alabaster). Click to switch to Dark (Velvet)'}
        >
          <motion.span
            key={darkMode ? 'dark-icon' : 'light-icon'}
            initial={{ rotate: -180, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 180, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
            className={`material-symbols-outlined text-lg ${
              darkMode ? 'text-secondary' : 'text-amber-500'
            }`}
          >
            {darkMode ? 'dark_mode' : 'light_mode'}
          </motion.span>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={darkMode ? 'dark-label' : 'light-label'}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <span className="hidden sm:inline">{darkMode ? 'Dark' : 'Light'}</span>
              <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded-full font-bold tracking-wider ${
                darkMode 
                  ? 'bg-secondary-container/60 text-secondary' 
                  : 'bg-primary/15 text-primary'
              }`}>
                {darkMode ? 'Velvet' : 'Alabaster'}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Primary CTA: New Collection */}
        <motion.button
          type="button"
          onClick={() => navigate('/projects')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-title-sm text-xs md:text-title-sm hover:brightness-110 transition-all shadow-[0_4px_20px_rgba(128,0,32,0.45)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span className="font-semibold hidden sm:inline">New Collection</span>
        </motion.button>
      </div>
    </header>
  )
}
