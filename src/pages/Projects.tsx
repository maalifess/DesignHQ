import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Grid3X3, List, Search, Filter, Calendar, FolderOpen } from 'lucide-react'
import { useProjects, type CreateProjectData } from '@/hooks/useProjects'
import { GlassModal } from '@/components/ui/GlassModal'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Badge, PROJECT_COLORS } from '@/components/ui/Badge'
import { KanbanBoard } from '@/components/projects/KanbanBoard'
import { daysUntil, deadlineColor, formatDate } from '@/lib/export'

const CATEGORIES = [
  { value: 'assignment', label: 'Assignment' },
  { value: 'personal', label: 'Personal' },
  { value: 'collection', label: 'Collection' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'competition', label: 'Competition' },
]

const STATUS_BADGE: Record<string, 'accent' | 'success' | 'warning' | 'danger' | 'muted'> = {
  ideation: 'muted',
  research: 'accent',
  sketching: 'accent',
  prototyping: 'warning',
  refinement: 'warning',
  final: 'success',
  submitted: 'success',
}

function NewProjectModal({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void; onCreate: (data: CreateProjectData) => void }) {
  const [form, setForm] = useState<CreateProjectData>({
    title: '', category: 'assignment', tags: [],
  })
  const [tagsInput, setTagsInput] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (field: string) => (e: any) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onCreate({
      ...form,
      tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean) : [],
    })
    setLoading(false)
    onClose()
    setForm({ title: '', category: 'assignment', tags: [] })
    setTagsInput('')
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="New Project" size="lg">
      <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <Input label="Project Title" id="new-project-title" value={form.title} onChange={set('title')} placeholder="e.g. SS25 Graduation Collection" required />
          </div>
          <Input label="Theme / Concept" id="new-project-theme" value={form.theme || ''} onChange={set('theme')} placeholder="e.g. Fluid Femininity" />
          <Select label="Category" id="new-project-category" value={form.category} onChange={set('category') as any} options={CATEGORIES} />
          <Input label="Deadline" id="new-project-deadline" type="date" value={form.deadline || ''} onChange={set('deadline')} />
          <Input label="Tags (comma-separated)" id="new-project-tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="draping, sustainable, avant-garde" />
        </div>

        {/* Color label */}
        <div>
          <label className="input-label">Color Label</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            {PROJECT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, color_label: c.value }))}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: c.value,
                  border: form.color_label === c.value ? '3px solid var(--text-primary)' : '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'transform var(--transition-fast)',
                  transform: form.color_label === c.value ? 'scale(1.2)' : 'scale(1)',
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <Textarea label="Description (optional)" id="new-project-desc" value={form.description || ''} onChange={set('description')} placeholder="What's this project about?" rows={3} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Create Project</Button>
        </div>
      </form>
    </GlassModal>
  )
}

export default function Projects() {
  const { projects, loading, createProject, updateStatus } = useProjects()
  const navigate = useNavigate()
  const [view, setView] = useState<'grid' | 'list' | 'kanban'>('grid')
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.theme || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCategory || p.category === filterCategory
    return matchSearch && matchCat
  })

  const handleCreate = async (data: CreateProjectData) => {
    const project = await createProject(data)
    if (project) navigate(`/projects/${project.id}`)
  }

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Projects
        </h1>
        <Button icon={<Plus size={16} />} onClick={() => setShowNew(true)} id="new-project-btn">
          New Project
        </Button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} id="projects-search" />
        </div>

        {/* Category filter */}
        <select className="input" style={{ width: 'auto', minWidth: '140px' }} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} id="projects-filter-category">
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginLeft: 'auto' }}>
          {(['grid', 'list', 'kanban'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '0.5rem 0.875rem',
              background: view === v ? 'var(--accent-primary)' : 'transparent',
              color: view === v ? 'white' : 'var(--text-muted)',
              border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', fontFamily: 'var(--font-ui)',
              transition: 'all var(--transition-base)',
            }}>
              {v === 'grid' ? <Grid3X3 size={15} /> : v === 'list' ? <List size={15} /> : 'Kanban'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : view === 'kanban' ? (
        <KanbanBoard projects={filtered} onStatusChange={updateStatus} />
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <FolderOpen size={56} style={{ color: 'var(--glass-border)' }} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {search ? 'No projects match your search' : 'Your design journey starts here'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 360 }}>
              {search ? 'Try a different search term.' : 'Create your first project and bring your ideas to life.'}
            </p>
          </div>
          {!search && <Button icon={<Plus size={16} />} onClick={() => setShowNew(true)}>Start a Project</Button>}
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {filtered.map((project, i) => {
            const days = project.deadline ? daysUntil(project.deadline) : null
            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', height: '100%' }}
                  onClick={() => navigate(`/projects/${project.id}`)}>
                  {/* Cover */}
                  <div style={{
                    height: 120,
                    background: project.cover_image_url
                      ? `url(${project.cover_image_url}) center/cover`
                      : `linear-gradient(135deg, ${project.color_label || 'var(--accent-light)'}, var(--bg-surface-deep))`,
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.375rem' }}>
                      <Badge variant={STATUS_BADGE[project.status] || 'muted'}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                      {project.category && <Badge variant="muted">{project.category}</Badge>}
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }} className="truncate">{project.title}</h3>
                    {project.theme && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }} className="truncate">{project.theme}</p>}
                    {days !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Calendar size={12} style={{ color: deadlineColor(days) }} />
                        <span style={{ fontSize: '0.8125rem', color: deadlineColor(days), fontWeight: 500 }}>
                          {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `Due in ${days}d`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        /* List view */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map((project) => {
            const days = project.deadline ? daysUntil(project.deadline) : null
            return (
              <div key={project.id} className="glass-card" style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                onClick={() => navigate(`/projects/${project.id}`)}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: project.color_label || 'var(--accent-light)', flexShrink: 0, border: '1px solid var(--glass-border)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{project.title}</h3>
                    <Badge variant={STATUS_BADGE[project.status] || 'muted'}>{project.status}</Badge>
                  </div>
                  {project.theme && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{project.theme}</p>}
                </div>
                {days !== null && (
                  <span style={{ fontSize: '0.8125rem', color: deadlineColor(days), fontWeight: 500, flexShrink: 0 }}>
                    {days < 0 ? `${Math.abs(days)}d overdue` : `${days}d`}
                  </span>
                )}
                {project.deadline && <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', flexShrink: 0 }}>{formatDate(project.deadline)}</span>}
              </div>
            )
          })}
        </div>
      )}

      <NewProjectModal isOpen={showNew} onClose={() => setShowNew(false)} onCreate={handleCreate} />
    </div>
  )
}
