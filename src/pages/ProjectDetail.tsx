import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import { exportAsPDF } from '@/lib/export'
import { useAppStore } from '@/store/useAppStore'
import { GlassModal } from '@/components/ui/GlassModal'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects } = useProjects()
  const { addToast } = useAppStore()

  const [activeTab, setActiveTab] = useState<'garments' | 'fabrics' | 'moodboard' | 'fitting' | 'notes'>('garments')
  const [showAddLookModal, setShowAddLookModal] = useState(false)
  const [newLook, setNewLook] = useState({ title: '', category: 'Outerwear', patternCode: 'CR-210', fabric: 'Silk Satin' })

  const project = projects.find((p) => p.id === id) || {
    id: id || 'demo-project',
    title: 'Crimson Reverie — Autumn/Winter 2026',
    theme: 'A bespoke architectural couture study merging sculpted velvet silhouettes with bias-draped silks.',
    category: 'collection',
    status: 'sampling',
    deadline: '2026-11-18',
    color_label: '#800020',
    tags: ['Couture', 'AW26', 'Parisian'],
  }

  const handleExportPDF = () => {
    const element = document.getElementById('project-tech-pack-container')
    if (element) {
      exportAsPDF(element, `${project.title}-Tech-Pack`, project.title)
      addToast('Tech Pack PDF generated', 'success')
    }
  }

  const handleAddLook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLook.title.trim()) return
    addToast(`Look "${newLook.title}" added to Tech Pack`, 'success')
    setShowAddLookModal(false)
    setNewLook({ title: '', category: 'Outerwear', patternCode: 'CR-210', fabric: 'Silk Satin' })
  }

  return (
    <div id="project-tech-pack-container" className="w-full max-w-[1400px] mx-auto space-y-space-xl">
      {/* Top Breadcrumb & Quick Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-b border-outline-variant/20 pb-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
          <button
            onClick={() => navigate('/projects')}
            className="hover:text-primary transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">styler</span>
            <span>Collections</span>
          </button>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold">{project.title}</span>
          <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/60 text-secondary font-label-sm text-label-sm tracking-widest uppercase font-semibold">
            AW 2026
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <span className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-high/80 text-primary font-label-sm text-label-sm border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Atelier Live Sync • Milan Hub</span>
          </span>
        </div>
      </div>

      {/* Collection Header Card with Velour Ambiance */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-2xl p-space-xl shadow-xl border border-outline-variant/30">
        <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-primary-container/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-space-lg">
          {/* Title & Meta */}
          <div className="space-y-space-md max-w-3xl">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="px-space-sm py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold border border-pearl-highlight">
                Haute Couture / Collection
              </span>
              <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-secondary-fixed-dim font-label-sm text-label-sm flex items-center gap-1 border border-outline-variant/20">
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>Sampling &amp; Fitting Stage (75%)</span>
              </span>
              <span className="px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/20">
                Code: CR-26-PAR
              </span>
            </div>

            <div>
              <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight leading-tight font-semibold">
                {project.title}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-2xl">
                {project.theme}
              </p>
            </div>

            {/* Lead Designer, Metrics, Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-xs">
              <div className="p-space-sm rounded-lg bg-surface-container/70 backdrop-blur-md border border-outline-variant/10">
                <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Lead Designer</div>
                <div className="font-title-sm text-title-sm text-on-surface mt-0.5 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-primary text-base">face</span>
                  <span>Aria Chen</span>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container/70 backdrop-blur-md border border-outline-variant/10">
                <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Target Delivery</div>
                <div className="font-title-sm text-title-sm text-on-surface mt-0.5 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-secondary text-base">event</span>
                  <span>Nov 18, 2026</span>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container/70 backdrop-blur-md border border-outline-variant/10">
                <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Lineup Scope</div>
                <div className="font-title-sm text-title-sm text-on-surface mt-0.5 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-primary text-base">checkroom</span>
                  <span>12 Looks Planned</span>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container/70 backdrop-blur-md border border-outline-variant/10">
                <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Atelier Phase</div>
                <div className="font-title-sm text-title-sm text-on-surface mt-0.5 flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-tertiary text-base">straighten</span>
                  <span>Toile Fitting #2</span>
                </div>
              </div>
            </div>

            {/* Color Palette Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-space-sm pt-space-xs">
              <div className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-semibold">
                Atelier Palette:
              </div>
              <div className="flex items-center gap-space-xs">
                {['#5C0016', '#800020', '#A0002A', '#8B4060', '#160B0F'].map((c, idx) => (
                  <span
                    key={idx}
                    className="w-7 h-7 rounded-full shadow-md border border-pearl-highlight cursor-pointer"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-space-xs">5 Curated Dyes</span>
              </div>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-space-xs shrink-0 self-start w-full lg:w-auto mt-4 lg:mt-0">
            <button
              onClick={() => setShowAddLookModal(true)}
              className="flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm hover:brightness-110 shadow-lg transition-all border border-pearl-highlight font-semibold cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add Garment Look</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-high/80 text-on-surface hover:bg-surface-container-highest font-title-sm text-title-sm transition-all border border-outline-variant/20 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>Export Tech Pack PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9-Stage Milestone Lifecycle Stepper */}
      <div className="rounded-xl bg-surface-container-lowest/80 backdrop-blur-xl p-space-lg shadow-md space-y-space-md border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Atelier Lifecycle
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Couture Production Milestone Pipeline
            </h2>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
            <span className="font-semibold">Stage 6 of 9 Active</span>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="relative pt-space-xs pb-space-2xs overflow-x-auto mobile-scroll-x">
          <div className="flex items-start justify-between min-w-[760px] gap-space-xs relative z-10">
            {[
              { title: 'Ideation', label: 'Complete', done: true },
              { title: 'Moodboard', label: 'Complete', done: true },
              { title: 'Sketching', label: '12 Rendered', done: true },
              { title: 'Fabrication', label: '8 Swatches', done: true },
              { title: 'Patternmaking', label: 'CAD Graded', done: true },
              { title: 'Sampling', label: 'In Review (75%)', active: true },
              { title: 'Fitting', label: 'Tomorrow' },
              { title: 'Production', label: 'Scheduled' },
              { title: 'Runway', label: 'Launch Nov' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center w-24">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md mb-2 ${
                    step.done
                      ? 'bg-primary-container text-on-primary border border-pearl-highlight'
                      : step.active
                      ? 'bg-secondary-container text-on-secondary font-bold ring-4 ring-secondary/20 animate-pulse'
                      : 'bg-surface-container-highest text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {step.done ? 'check' : step.active ? 'progress_activity' : 'straighten'}
                  </span>
                </div>
                <span className={`font-title-sm text-title-sm ${step.active ? 'text-primary font-bold' : 'text-on-surface'}`}>
                  {step.title}
                </span>
                <span className="font-label-sm text-label-sm text-outline">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace (Garments & Tech Pack Cards) */}
      <div className="space-y-space-md">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-xs rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-space-2xs">
            <button
              onClick={() => setActiveTab('garments')}
              className={`px-space-sm py-space-xs rounded-lg font-title-sm text-title-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'garments'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-md border border-pearl-highlight'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-base">checkroom</span>
              <span>Garments &amp; Tech Packs (6)</span>
            </button>
            <button
              onClick={() => navigate('/fabrics')}
              className="px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-title-sm text-title-sm transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">texture</span>
              <span>Assigned Fabrics (8)</span>
            </button>
            <button
              onClick={() => navigate('/moodboards')}
              className="px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-title-sm text-title-sm transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">auto_awesome_motion</span>
              <span>Mood Board Collage</span>
            </button>
            <button
              onClick={() => navigate('/notes')}
              className="px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-title-sm text-title-sm transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">straighten</span>
              <span>Fitting Log</span>
            </button>
          </div>
        </div>

        {/* Garment Looks Grid */}
        <div className="space-y-space-md">
          {/* Look 01 */}
          <div className="group rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-md shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant/20">
            <div className="flex flex-col sm:flex-row gap-space-md">
              {/* Croquis Silhouette Box (No photos) */}
              <div className="relative w-full sm:w-44 h-56 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-primary-container/40 via-surface-container-high to-surface-container-lowest flex items-center justify-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-5xl text-primary/60 group-hover:scale-110 transition-transform">
                  styler
                </span>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-primary font-label-sm text-label-sm font-bold border border-outline-variant/20">
                  LOOK 01
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-on-surface-variant font-label-sm text-label-sm">
                  Toile v2
                </div>
              </div>

              {/* Spec Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex flex-wrap items-start justify-between gap-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wide">Pattern #CR-201</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Outerwear / Tailoring</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors mt-0.5">
                        Architectural Peplum Jacket
                      </h3>
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-primary-container/80 text-on-primary font-label-sm text-label-sm font-semibold flex items-center gap-1 border border-pearl-highlight">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>First Toile Approved</span>
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Exaggerated shoulder architecture paired with hand-canvassed chest reinforcement. Features a sharp pinched waist flaring into asymmetric peplum origami folds.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-xs">
                    <div className="p-space-xs rounded-lg bg-surface-container/60 border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-outline font-semibold">Assigned Fabric</div>
                      <div className="font-title-sm text-title-sm text-on-surface truncate">Double-face Wool Crepe</div>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container/60 border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-outline font-semibold">Hardware &amp; Notions</div>
                      <div className="font-title-sm text-title-sm text-on-surface truncate">Horn Buttons &amp; Stiffener</div>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container/60 border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-outline font-semibold">Next Fitting Event</div>
                      <div className="font-title-sm text-title-sm text-secondary truncate flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>Tomorrow, 10:30 AM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Look 02 */}
          <div className="group rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-md shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant/20">
            <div className="flex flex-col sm:flex-row gap-space-md">
              <div className="relative w-full sm:w-44 h-56 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-secondary-container/40 via-surface-container-high to-surface-container-lowest flex items-center justify-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-5xl text-secondary/60 group-hover:scale-110 transition-transform">
                  dry_cleaning
                </span>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-primary font-label-sm text-label-sm font-bold border border-outline-variant/20">
                  LOOK 02
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/90 text-secondary font-label-sm text-label-sm">
                  Cutting Table
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex flex-wrap items-start justify-between gap-space-xs">
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wide">Pattern #CR-204</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline" />
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Eveningwear / Drape</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors mt-0.5">
                        Cascading Bias-Cut Silk Gown
                      </h3>
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-secondary-container/80 text-on-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1 border border-secondary/30">
                      <span className="material-symbols-outlined text-xs">content_cut</span>
                      <span>Sample in Cutting</span>
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant">
                    True 45-degree grain bias drape with zero hem puckering. Back features hand-rolled rouleau ties anchored by microscopic French seam finishes.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-xs">
                    <div className="p-space-xs rounded-lg bg-surface-container/60 border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-outline font-semibold">Assigned Fabric</div>
                      <div className="font-title-sm text-title-sm text-on-surface truncate">Heavy Mulberry Silk (28mm)</div>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container/60 border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-outline font-semibold">Hardware &amp; Notions</div>
                      <div className="font-title-sm text-title-sm text-on-surface truncate">Invisible Riri Zipper</div>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container/60 border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-outline font-semibold">Next Fitting Event</div>
                      <div className="font-title-sm text-title-sm text-primary truncate flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        <span>Nov 15, 02:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Look Modal */}
      <GlassModal isOpen={showAddLookModal} onClose={() => setShowAddLookModal(false)} title="Add Garment Look to Tech Pack" size="md">
        <form onSubmit={handleAddLook} className="p-space-lg flex flex-col gap-space-md">
          <div className="form-group">
            <label className="input-label">Garment Look Title *</label>
            <input
              required
              className="input"
              placeholder="e.g. Sculpted Velvet Opera Coat"
              value={newLook.title}
              onChange={(e) => setNewLook({ ...newLook, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="form-group">
              <label className="input-label">Category</label>
              <input
                className="input"
                value={newLook.category}
                onChange={(e) => setNewLook({ ...newLook, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Pattern Code</label>
              <input
                className="input"
                value={newLook.patternCode}
                onChange={(e) => setNewLook({ ...newLook, patternCode: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all border border-pearl-highlight mt-2"
          >
            Add Garment to Collection
          </button>
        </form>
      </GlassModal>
    </div>
  )
}
