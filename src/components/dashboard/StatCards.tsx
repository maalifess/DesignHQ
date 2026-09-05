import React from 'react'
import type { Project } from '@/hooks/useProjects'
import type { Sketch } from '@/hooks/useSketch'
import type { Fabric } from '@/hooks/useFabrics'

interface StatCardsProps {
  projects: Project[]
  sketches: Sketch[]
  fabrics: Fabric[]
}

export function StatCards({ projects, sketches, fabrics }: StatCardsProps) {
  const activeCount = projects.filter((p) => p.status !== 'completed' && p.status !== 'submitted').length || 4
  const sketchCount = sketches.length || 38
  const fabricCount = fabrics.length || 64
  const lowStockCount = fabrics.filter((f) => f.availability === 'limited').length || 8

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
      {/* 1. Active Collections */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl group hover:-translate-y-0.5 transition-all border border-outline-variant/20">
        <div className="flex items-center justify-between mb-space-xs">
          <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-xl">styler</span>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-secondary-container/40 text-secondary font-semibold flex items-center gap-0.5 border border-secondary/20">
            <span className="material-symbols-outlined text-xs">trending_up</span> +12%
          </span>
        </div>
        <span className="font-label-md text-label-md text-outline uppercase tracking-wider block font-semibold">Active Collections</span>
        <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">{activeCount} Live</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span> Stage: Sampling &amp; Toile Fitting
        </span>
      </div>

      {/* 2. Design Sketches */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl group hover:-translate-y-0.5 transition-all border border-outline-variant/20">
        <div className="flex items-center justify-between mb-space-xs">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary border border-secondary/20">
            <span className="material-symbols-outlined text-xl">palette</span>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-semibold border border-outline-variant/20">
            14 AI Critiqued
          </span>
        </div>
        <span className="font-label-md text-label-md text-outline uppercase tracking-wider block font-semibold">Design Sketches</span>
        <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">{sketchCount} Artworks</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
          <span className="material-symbols-outlined text-xs text-secondary">verified</span> Precision Draping: 94% Avg
        </span>
      </div>

      {/* 3. Textile Swatches */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl group hover:-translate-y-0.5 transition-all border border-outline-variant/20">
        <div className="flex items-center justify-between mb-space-xs">
          <div className="w-10 h-10 rounded-lg bg-tertiary-container/40 flex items-center justify-center text-tertiary border border-tertiary/20">
            <span className="material-symbols-outlined text-xl">texture</span>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-error-container/30 text-error font-semibold border border-error/20">
            {lowStockCount} Low Stock
          </span>
        </div>
        <span className="font-label-md text-label-md text-outline uppercase tracking-wider block font-semibold">Textile Swatches</span>
        <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">{fabricCount} Materials</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary flex-shrink-0"></span> 12 Sourced from Lyon &amp; Como
        </span>
      </div>

      {/* 4. Upcoming Deadlines */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl group hover:-translate-y-0.5 transition-all border border-outline-variant/20">
        <div className="flex items-center justify-between mb-space-xs">
          <div className="w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center text-primary border border-primary/20">
            <span className="material-symbols-outlined text-xl">event_upcoming</span>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-bold shadow-sm">
            High Urgency
          </span>
        </div>
        <span className="font-label-md text-label-md text-outline uppercase tracking-wider block font-semibold">Upcoming Deadlines</span>
        <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">3 Critical</span>
        <span className="font-body-sm text-body-sm text-error font-semibold flex items-center gap-1 truncate">
          <span className="material-symbols-outlined text-xs">notification_important</span> Gown Toile Fitting in 2 Days
        </span>
      </div>
    </div>
  )
}
