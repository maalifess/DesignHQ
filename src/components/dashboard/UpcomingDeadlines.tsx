import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import type { Project } from '@/hooks/useProjects'
import { daysUntil, deadlineColor, formatDate } from '@/lib/export'
import { addDays, isAfter, parseISO } from 'date-fns'

interface UpcomingDeadlinesProps {
  projects: Project[]
}

export function UpcomingDeadlines({ projects }: UpcomingDeadlinesProps) {
  const navigate = useNavigate()
  const now = new Date()
  const thirtyDays = addDays(now, 30)

  const upcoming = projects
    .filter((p) => p.deadline && isAfter(parseISO(p.deadline), now) && parseISO(p.deadline) <= thirtyDays)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Calendar size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Upcoming Deadlines
        </h3>
      </div>

      {upcoming.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
          No deadlines in the next 30 days. You're ahead of the curve! 
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {upcoming.map((project, i) => {
            const days = daysUntil(project.deadline!)
            const color = deadlineColor(days)

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-light)',
                  cursor: 'pointer',
                  border: '1px solid var(--glass-border)',
                  transition: 'border-color var(--transition-base)',
                }}
                whileHover={{ borderColor: color }}
              >
                {/* Color indicator */}
                <div style={{
                  width: 4, height: 36,
                  borderRadius: 2,
                  background: color,
                  flexShrink: 0,
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    marginBottom: '0.125rem',
                  }} className="truncate">
                    {project.title}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(project.deadline!)}
                  </p>
                </div>

                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  <Clock size={12} />
                  {days === 1 ? '1 day' : `${days} days`}
                </span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
