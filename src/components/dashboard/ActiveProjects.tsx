import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from '@/hooks/useProjects'

interface ActiveProjectsProps {
  projects: Project[]
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-xl">styler</span>
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Current Active Collections</h2>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="font-label-md text-label-md text-primary hover:text-on-surface transition-colors flex items-center gap-0.5 bg-transparent border-none cursor-pointer font-semibold"
          type="button"
        >
          View Runway Registry <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      {/* Collection Card 1: Crimson Reverie AW26 */}
      <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl overflow-hidden p-space-lg flex flex-col gap-space-md hover:bg-surface-container-low transition-all border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div>
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="px-space-xs py-0.5 rounded-md bg-secondary-container/50 text-secondary font-label-sm text-label-sm uppercase font-semibold border border-secondary/20">
                Couture AW26
              </span>
              <span className="font-body-sm text-body-sm text-outline">Project Code: #CR-2680</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold">Crimson Reverie AW26</h3>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-body-sm text-body-sm text-outline">Target Runway:</span>
            <span className="font-title-sm text-title-sm text-on-surface font-semibold bg-surface-container-high px-space-xs py-1 rounded border border-outline-variant/20">
              Nov 18, 2026
            </span>
          </div>
        </div>

        {/* Lifecycle Stage Progress */}
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-on-surface-variant">
              Lifecycle Stage: <strong className="text-primary font-semibold">Sampling (Phase 6 of 9)</strong>
            </span>
            <span className="text-primary font-bold">75% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-primary transition-all duration-700"
              style={{ width: '75%' }}
            />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mt-1 hidden sm:grid">
            <span className="font-label-sm text-[10px] text-primary font-semibold">Ideate</span>
            <span className="font-label-sm text-[10px] text-primary font-semibold">Mood</span>
            <span className="font-label-sm text-[10px] text-primary font-semibold">Sketch</span>
            <span className="font-label-sm text-[10px] text-primary font-semibold">Textile</span>
            <span className="font-label-sm text-[10px] text-primary font-semibold">Pattern</span>
            <span className="font-label-sm text-[10px] text-on-surface font-bold bg-surface-container-high rounded py-0.5 border border-outline-variant/30">
              Sampling
            </span>
            <span className="font-label-sm text-[10px] text-outline">Runway</span>
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs border-t border-outline-variant/20">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-label-sm text-outline">Tonal Array:</span>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-[#800020] shadow-sm border border-pearl-highlight" title="Haute Crimson (#800020)" />
                <span className="w-5 h-5 rounded-full bg-[#5C0016] shadow-sm border border-pearl-highlight" title="Merlot Velvet (#5C0016)" />
                <span className="w-5 h-5 rounded-full bg-[#C05070] shadow-sm border border-pearl-highlight" title="Blush Satin (#C05070)" />
                <span className="w-5 h-5 rounded-full bg-[#842130] shadow-sm border border-pearl-highlight" title="Vintage Mauve (#842130)" />
              </div>
            </div>
            <span className="font-body-sm text-body-sm text-outline hidden xs:inline">|</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">checkroom</span> 8 Garments Tailored
            </span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => navigate('/notes')}
              className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors cursor-pointer border border-outline-variant/20"
              type="button"
            >
              Fitting Notes
            </button>
            <button
              onClick={() => {
                if (projects[0]?.id) navigate(`/projects/${projects[0].id}`)
                else navigate('/projects')
              }}
              className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container font-label-md text-label-md font-semibold transition-colors cursor-pointer border border-secondary/30"
              type="button"
            >
              Tech Pack
            </button>
          </div>
        </div>
      </div>

      {/* Collection Card 2: Ethereal Drapery SS27 */}
      <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl overflow-hidden p-space-lg flex flex-col gap-space-md hover:bg-surface-container-low transition-all border border-outline-variant/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div>
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="px-space-xs py-0.5 rounded-md bg-tertiary-container/50 text-tertiary font-label-sm text-label-sm uppercase font-semibold border border-tertiary/20">
                Resort Collection
              </span>
              <span className="font-body-sm text-body-sm text-outline">Project Code: #ED-2704</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-semibold">Ethereal Drapery SS27</h3>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-body-sm text-body-sm text-outline">Target Runway:</span>
            <span className="font-title-sm text-title-sm text-on-surface font-semibold bg-surface-container-high px-space-xs py-1 rounded border border-outline-variant/20">
              Jan 15, 2027
            </span>
          </div>
        </div>

        {/* Lifecycle Stage Progress */}
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between font-label-sm text-label-sm">
            <span className="text-on-surface-variant">
              Lifecycle Stage: <strong className="text-secondary font-semibold">Fabrication (Phase 4 of 9)</strong>
            </span>
            <span className="text-secondary font-bold">45% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary-container transition-all duration-700"
              style={{ width: '45%' }}
            />
          </div>
        </div>

        {/* Footer info & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs border-t border-outline-variant/20">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-label-sm text-label-sm text-outline">Tonal Array:</span>
              <div className="flex items-center gap-1">
                <span className="w-5 h-5 rounded-full bg-[#FAF5EF] shadow-sm border border-pearl-highlight" title="Ivory Silk (#FAF5EF)" />
                <span className="w-5 h-5 rounded-full bg-[#C05070] shadow-sm border border-pearl-highlight" title="Blush Satin (#C05070)" />
                <span className="w-5 h-5 rounded-full bg-[#800020] shadow-sm border border-pearl-highlight" title="Haute Wine (#800020)" />
                <span className="w-5 h-5 rounded-full bg-[#584141] shadow-sm border border-pearl-highlight" title="Obsidian Shadow (#584141)" />
              </div>
            </div>
            <span className="font-body-sm text-body-sm text-outline hidden xs:inline">|</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-secondary">checkroom</span> 12 Garments Tailored
            </span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => navigate('/notes')}
              className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors cursor-pointer border border-outline-variant/20"
              type="button"
            >
              Fitting Notes
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container font-label-md text-label-md font-semibold transition-colors cursor-pointer border border-secondary/30"
              type="button"
            >
              Tech Pack
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
