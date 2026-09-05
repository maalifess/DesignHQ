import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProjects, type CreateProjectData } from '@/hooks/useProjects'
import { GlassModal } from '@/components/ui/GlassModal'
import { Badge, PROJECT_COLORS } from '@/components/ui/Badge'
import { KanbanBoard } from '@/components/projects/KanbanBoard'
import { daysUntil, deadlineColor, formatDate } from '@/lib/export'

const CATEGORIES = [
  { value: 'assignment', label: 'Assignment' },
  { value: 'personal', label: 'Personal' },
  { value: 'collection', label: 'Haute Collection' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'competition', label: 'Runway Competition' },
]

export default function Projects() {
  const { projects, loading, createProject, updateStatus } = useProjects()
  const navigate = useNavigate()
  const [view, setView] = useState<'grid' | 'list' | 'kanban'>('grid')
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const [form, setForm] = useState<CreateProjectData>({
    title: '', category: 'collection', tags: [],
  })

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.theme || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchCat
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const project = await createProject(form)
    setShowNew(false)
    setForm({ title: '', category: 'collection', tags: [] })
    if (project) navigate(`/projects/${project.id}`)
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-space-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md pb-space-xs border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-2xs text-primary font-label-sm text-label-sm tracking-widest uppercase font-semibold">
            <span className="material-symbols-outlined text-base">styler</span>
            <span>Atelier Runway Registry</span>
          </div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface font-semibold tracking-tight">
            Haute Collections &amp; Projects
          </h1>
        </div>

        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm hover:brightness-110 active:scale-95 transition-all font-semibold shadow-lg border border-pearl-highlight cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>New Collection</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low/90 backdrop-blur-xl p-space-sm rounded-xl border border-outline-variant/20">
        <div className="flex flex-wrap items-center gap-space-sm flex-1 min-w-[240px] max-w-lg">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-space-xs top-1/2 -translate-y-1/2 text-outline text-base">
              search
            </span>
            <input
              className="w-full pl-8 pr-space-sm py-1.5 rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
              placeholder="Search collections by title or theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="px-space-sm py-1.5 rounded-lg bg-surface-container-high/60 text-on-surface font-body-sm text-body-sm border border-outline-variant/20 focus:outline-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center rounded-lg bg-surface-container-high/40 p-0.5 border border-outline-variant/20">
          <button
            onClick={() => setView('grid')}
            className={`px-space-xs py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 cursor-pointer transition-all ${
              view === 'grid' ? 'bg-primary-container text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span> Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-space-xs py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 cursor-pointer transition-all ${
              view === 'list' ? 'bg-primary-container text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">view_list</span> List
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`px-space-xs py-1 rounded-md font-label-sm text-label-sm flex items-center gap-1 cursor-pointer transition-all ${
              view === 'kanban' ? 'bg-primary-container text-on-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-sm">view_week</span> Pipeline
          </button>
        </div>
      </div>

      {/* View Output */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-56 rounded-xl" />)}
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard projects={filtered} onStatusChange={updateStatus} />
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl p-space-3xl text-center flex flex-col items-center justify-center gap-space-md border border-outline-variant/20">
          <span className="material-symbols-outlined text-6xl text-outline/50">folder_open</span>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">
              No Collections Found
            </h3>
            <p className="font-body-md text-body-md text-outline max-w-sm">
              Create your first haute couture project or adjust your search filter.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-md cursor-pointer border border-pearl-highlight"
          >
            Create New Collection
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filtered.map((project, i) => {
            const days = project.deadline ? daysUntil(project.deadline) : null
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl hover:bg-surface-container-low hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full border border-outline-variant/20 group"
                >
                  <div className="space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/50 text-secondary font-label-sm text-label-sm uppercase font-semibold border border-secondary/20">
                        {project.category || 'Collection'}
                      </span>
                      {project.color_label && (
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm border border-pearl-highlight"
                          style={{ background: project.color_label }}
                        />
                      )}
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors mt-2">
                      {project.title}
                    </h3>
                    {project.theme && (
                      <p className="font-body-sm text-body-sm text-outline line-clamp-2">
                        {project.theme}
                      </p>
                    )}
                  </div>

                  <div className="pt-space-md mt-space-md border-t border-outline-variant/20 flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold capitalize">
                      Stage: {project.status || 'Sampling'}
                    </span>
                    {days !== null && (
                      <span className="font-label-sm text-label-sm font-semibold flex items-center gap-1" style={{ color: deadlineColor(days) }}>
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-space-xs">
          {filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="p-space-md rounded-xl bg-surface-container-low/80 backdrop-blur-xl hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-between gap-space-md border border-outline-variant/20"
            >
              <div className="flex items-center gap-space-sm min-w-0">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0 border border-pearl-highlight"
                  style={{ background: project.color_label || '#800020' }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                    {project.title}
                  </span>
                  {project.theme && (
                    <span className="font-body-sm text-body-sm text-outline truncate">
                      {project.theme}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-space-md flex-shrink-0">
                <span className="px-space-xs py-0.5 rounded-md bg-surface-container-high text-secondary font-label-sm text-label-sm uppercase font-semibold">
                  {project.status || 'Ideation'}
                </span>
                {project.deadline && (
                  <span className="font-body-sm text-body-sm text-outline hidden sm:inline">
                    {formatDate(project.deadline)}
                  </span>
                )}
                <span className="material-symbols-outlined text-outline text-lg">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <GlassModal isOpen={showNew} onClose={() => setShowNew(false)} title="Create New Haute Collection" size="md">
        <form onSubmit={handleCreate} className="p-space-lg flex flex-col gap-space-md">
          <div className="form-group">
            <label className="input-label">Collection Title *</label>
            <input
              required
              className="input"
              placeholder="e.g. Crimson Reverie AW26"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="input-label">Theme / Concept</label>
            <input
              className="input"
              placeholder="e.g. Sculpted velvet &amp; bias drape"
              value={form.theme || ''}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="form-group">
              <label className="input-label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              >
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Target Runway Date</label>
              <input
                type="date"
                className="input"
                value={form.deadline || ''}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Color Label Swatch</label>
            <div className="flex gap-space-xs mt-1">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, color_label: c.value })}
                  className={`w-7 h-7 rounded-full cursor-pointer transition-transform border border-pearl-highlight ${
                    form.color_label === c.value ? 'scale-125 ring-2 ring-primary' : ''
                  }`}
                  style={{ background: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all border border-pearl-highlight mt-2"
          >
            Initialize Collection
          </button>
        </form>
      </GlassModal>
    </div>
  )
}
