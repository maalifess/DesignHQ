import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Edit3, Trash2, FolderOpen } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { GlassModal } from '@/components/ui/GlassModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { daysUntil, deadlineColor, formatDate } from '@/lib/export'
import { useSketch } from '@/hooks/useSketch'
import { useMoodBoard } from '@/hooks/useMoodBoard'

const KANBAN_STAGES = ['ideation', 'research', 'sketching', 'prototyping', 'refinement', 'final', 'submitted']

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, deleteProject, updateStatus } = useProjects()
  const { sketches } = useSketch()
  const { moodBoards } = useMoodBoard()
  const [activeTab, setActiveTab] = useState<'overview' | 'sketches' | 'moodboards' | 'notes'>('overview')
  const [showDelete, setShowDelete] = useState(false)

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <FolderOpen size={48} style={{ color: 'var(--glass-border)' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Project not found</h2>
        <Button variant="ghost" onClick={() => navigate('/projects')} icon={<ArrowLeft size={16} />}>Back to Projects</Button>
      </div>
    )
  }

  const days = project.deadline ? daysUntil(project.deadline) : null
  const progressIdx = KANBAN_STAGES.indexOf(project.status)
  const progress = progressIdx >= 0 ? Math.round(((progressIdx + 1) / KANBAN_STAGES.length) * 100) : 0
  const projectSketches = sketches.filter((s: any) => s.project_id === id)
  const projectBoards = moodBoards.filter((b: any) => b.project_id === id)

  const handleDelete = async () => {
    await deleteProject(project.id)
    navigate('/projects')
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={15} /> All Projects
      </button>

      {/* Hero */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}
      >
        {/* Cover strip */}
        <div style={{
          height: 160,
          background: project.cover_image_url
            ? `url(${project.cover_image_url}) center/cover`
            : `linear-gradient(135deg, ${project.color_label || 'var(--accent-primary)'} 0%, var(--accent-deep) 100%)`,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(13,4,7,0.5))' }} />
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
            <Button variant="glass" size="sm" icon={<Edit3 size={14} />}>Edit</Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setShowDelete(true)}>Delete</Button>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {project.title}
                </h1>
                <Badge variant="accent">{project.status}</Badge>
                <Badge variant="muted">{project.category}</Badge>
              </div>
              {project.theme && <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.75rem' }}>{project.theme}</p>}
              {project.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{project.description}</p>}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0 }}>
              {days !== null && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 600, color: deadlineColor(days) }}>{Math.abs(days)}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{days < 0 ? 'days overdue' : 'days left'}</p>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--accent-primary)' }}>{progress}%</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>complete</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              {KANBAN_STAGES.map((stage) => (
                <span key={stage} style={{
                  fontSize: '0.7rem',
                  color: stage === project.status ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontWeight: stage === project.status ? 600 : 400,
                  cursor: 'pointer',
                }} onClick={() => updateStatus(project.id, stage)}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </span>
              ))}
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Tags & deadline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {project.tags?.map((tag: string) => <Badge key={tag} variant="muted">#{tag}</Badge>)}
            {project.deadline && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                <Calendar size={13} /> {formatDate(project.deadline)}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        {(['overview', 'moodboards', 'sketches', 'notes'] as const).map((tab) => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'sketches' && projectSketches.length > 0 && (
              <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', padding: '1px 6px' }}>
                {projectSketches.length}
              </span>
            )}
            {tab === 'moodboards' && projectBoards.length > 0 && (
              <span style={{ marginLeft: '0.375rem', fontSize: '0.7rem', background: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', padding: '1px 6px' }}>
                {projectBoards.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Project Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  ['Category', project.category],
                  ['Status', project.status],
                  ['Deadline', project.deadline ? formatDate(project.deadline) : '—'],
                  ['Created', formatDate(project.created_at)],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Quick Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'Mood Boards', value: projectBoards.length },
                  { label: 'Sketches', value: projectSketches.length },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center', padding: '0.75rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--accent-primary)', lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sketches' && (
          <div>
            {projectSketches.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No sketches linked to this project yet.</p>
                <Button onClick={() => navigate('/sketchbook')}>Open Sketchbook</Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {projectSketches.map((sketch) => (
                  <div key={sketch.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate('/sketchbook')}>
                    <div style={{ height: 140, background: sketch.thumbnail_url ? `url(${sketch.thumbnail_url}) center/cover` : 'var(--bg-surface-deep)' }} />
                    <div style={{ padding: '0.75rem' }}>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)' }} className="truncate">{sketch.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'moodboards' && (
          <div>
            {projectBoards.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No mood boards linked to this project yet.</p>
                <Button onClick={() => navigate('/moodboards')}>Go to Mood Boards</Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {projectBoards.map((board) => (
                  <div key={board.id} className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/moodboards/${board.id}`)}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-primary)' }}>{board.name}</h3>
                    {board.extracted_colors && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '0.75rem' }}>
                        {(board.extracted_colors as string[]).slice(0, 6).map((c: string, i: number) => (
                          <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, border: '1.5px solid rgba(255,255,255,0.3)' }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Notes linked to this project will appear here.</p>
            <Button style={{ marginTop: '1rem' }} onClick={() => navigate('/notes')}>Go to Notes</Button>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation */}
      <GlassModal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Project" size="sm">
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong>"{project.title}"</strong>? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Project</Button>
          </div>
        </div>
      </GlassModal>
    </div>
  )
}
