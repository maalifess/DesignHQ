import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from '@/hooks/useProjects'

interface UpcomingDeadlinesProps {
  projects: Project[]
}

export function UpcomingDeadlines({ projects }: UpcomingDeadlinesProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-space-xl">
      {/* 1. Atelier Fitting Schedule */}
      <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">event_upcoming</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Atelier Fitting Schedule</h2>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-error-container/40 text-error font-bold border border-error/20">
            3 High Priority
          </span>
        </div>

        <div className="flex flex-col gap-space-xs">
          {/* Item 1 */}
          <div className="p-space-sm rounded-lg bg-surface-container-high/60 backdrop-blur-md flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary-container/40 text-primary flex items-center justify-center font-bold flex-shrink-0 border border-primary/30">
                <span className="material-symbols-outlined text-base">style</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Silk Chiffon Evening Gown</span>
                <span className="font-label-sm text-label-sm text-outline truncate">CR-2680 • Final Toile Fitting</span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-title-sm text-title-sm text-error font-bold">2 Days</span>
              <span className="font-label-sm text-label-sm text-outline">Nov 12</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-space-sm rounded-lg bg-surface-container-high/60 backdrop-blur-md flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-9 h-9 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center font-bold flex-shrink-0 border border-secondary/30">
                <span className="material-symbols-outlined text-base">straighten</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Velvet Tailored Blazer</span>
                <span className="font-label-sm text-label-sm text-outline truncate">CR-2680 • Pattern Revision</span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-title-sm text-title-sm text-secondary font-bold">5 Days</span>
              <span className="font-label-sm text-label-sm text-outline">Nov 15</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-space-sm rounded-lg bg-surface-container-high/60 backdrop-blur-md flex items-center justify-between gap-space-sm hover:bg-surface-container-high transition-colors border border-outline-variant/20">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-9 h-9 rounded-lg bg-tertiary-container/40 text-tertiary flex items-center justify-center font-bold flex-shrink-0 border border-tertiary/30">
                <span className="material-symbols-outlined text-base">checkroom</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Organza Corset Toile</span>
                <span className="font-label-sm text-label-sm text-outline truncate">ED-2704 • Sample Approval</span>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="font-title-sm text-title-sm text-on-surface-variant font-semibold">8 Days</span>
              <span className="font-label-sm text-label-sm text-outline">Nov 18</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gemini 2.0 AI Pattern Review Callout */}
      <div className="rounded-xl bg-gradient-to-br from-primary-container/40 via-surface-container-low to-secondary-container/30 backdrop-blur-2xl shadow-xl p-space-lg flex flex-col gap-space-sm border border-primary/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-space-2xs text-secondary font-title-sm text-title-sm font-semibold">
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>Gemini 2.0 AI Pattern Review</span>
          </div>
          <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-bold">
            Active
          </span>
        </div>

        <p className="font-body-md text-body-md text-on-surface font-medium z-10 leading-relaxed">
          "Drape tension on CR-2680 gown bias cut requires +1.5cm seam allowance at left hip line to optimize fluid movement."
        </p>

        <button
          onClick={() => navigate('/sketchbook')}
          className="mt-space-xs flex items-center justify-center gap-space-2xs w-full py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm hover:brightness-110 active:scale-95 transition-all shadow-md font-semibold border border-pearl-highlight cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base">psychology</span>
          <span>Review AI Critique Studio</span>
        </button>
      </div>
    </div>
  )
}
