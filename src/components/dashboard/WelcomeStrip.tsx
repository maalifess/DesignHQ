import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function WelcomeStrip() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const name = profile?.display_name || profile?.full_name || 'Aria Chen'

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest/90 backdrop-blur-2xl shadow-2xl p-space-lg mb-space-xl border border-outline-variant/30">
      {/* Soft Ambient Background Glow Orbs */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 bottom-0 w-64 h-64 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase border border-primary/20 font-semibold">
              Maison Direction
            </span>
            <span className="text-outline font-label-sm text-label-sm">•</span>
            <span className="text-outline font-label-sm text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-secondary">schedule</span> Paris Fashion Week in 42 Days
            </span>
          </div>

          <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight font-semibold mt-1">
            Welcome back, {name}
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Couture Autumn/Winter 2026 In Progress. Atelier line is actively sampling silhouette toiles for Parisian presentation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs mt-2 lg:mt-0">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">Active Lines</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">3 Haute Collections</span>
            </div>
          </div>

          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-base">auto_fix_high</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">Pattern AI</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">Gemini 2.0 Synced</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/sketchbook')}
            className="flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm shadow-lg hover:brightness-110 active:scale-95 transition-all border border-pearl-highlight cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">brush</span>
            <span className="font-semibold">Open Drafting</span>
          </button>
        </div>
      </div>
    </div>
  )
}
