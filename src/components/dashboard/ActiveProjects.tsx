import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, FolderOpen } from 'lucide-react'
import type { Project } from '@/hooks/useProjects'
import { daysUntil, deadlineColor, formatDate } from '@/lib/export'

const STATUS_LABELS: Record<string, string> = {
  ideation: 'Ideation',
  research: 'Research',
  sketching: 'Sketching',
  prototyping: 'Prototyping',
  refinement: 'Refinement',
  final: 'Final',
  submitted: 'Submitted',
}

const KANBAN_STAGES = ['ideation', 'research', 'sketching', 'prototyping', 'refinement', 'final', 'submitted']

function progressPercent(status: string): number {
  const idx = KANBAN_STAGES.indexOf(status)
  if (idx < 0) return 0
  return Math.round(((idx + 1) / KANBAN_STAGES.length) * 100)
}

interface ActiveProjectsProps {
  projects: Project[]
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const navigate = useNavigate()
  const active = projects.filter((p) => p.status !== 'submitted').slice(0, 8)

  if (active.length === 0) {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Active Projects
        </h2>
        <div className="glass-card" style={{
          textAlign: 'center', padding: '3rem 2rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        }}>
          <FolderOpen size={48} style={{ color: 'var(--accent-light)', opacity: 0.8 }} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
              Your design journey starts here
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 360 }}>
              Create your first project and bring your ideas to life.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/projects')}>
            Start a Project
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Active Projects
        </h2>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
      }}>
        {active.map((project, i) => {
          const days = project.deadline ? daysUntil(project.deadline) : null
          const progress = progressPercent(project.status)

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{
                minWidth: '220px',
                maxWidth: '240px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <div className="glass-card" style={{ padding: '1.125rem', height: '100%' }}>
                {/* Cover */}
                <div style={{
                  height: '100px',
                  borderRadius: 'var(--radius-md)',
                  background: project.cover_image_url
                    ? `url(${project.cover_image_url}) center/cover`
                    : `linear-gradient(135deg, ${project.color_label || 'var(--accent-light)'}, var(--bg-surface-deep))`,
                  marginBottom: '0.875rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <span className="badge badge-accent" style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', fontSize: '0.7rem' }}>
                    {STATUS_LABELS[project.status] || project.status}
                  </span>
                </div>

                {/* Info */}
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem',
                }} className="truncate">
                  {project.title}
                </h4>
                {project.theme && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.625rem' }} className="truncate">
                    {project.theme}
                  </p>
                )}

                {/* Deadline */}
                {days !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    <Calendar size={12} style={{ color: deadlineColor(days), flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: deadlineColor(days), fontWeight: 500 }}>
                      {days === 0 ? 'Due today!' : days < 0 ? `${Math.abs(days)}d overdue` : `Due in ${days}d`}
                    </span>
                  </div>
                )}

                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 500 }}>{progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
