import React from 'react'
import { motion } from 'framer-motion'
import { FolderKanban, Clock, PenLine, Layers2, TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import type { Project } from '@/hooks/useProjects'
import type { Sketch } from '@/hooks/useSketch'
import type { Fabric } from '@/hooks/useFabrics'
import { isThisMonth, isThisWeek, addDays, isAfter } from 'date-fns'

interface StatCardsProps {
  projects: Project[]
  sketches: Sketch[]
  fabrics: Fabric[]
}

export function StatCards({ projects, sketches, fabrics }: StatCardsProps) {
  const now = new Date()
  const weekFromNow = addDays(now, 7)

  const stats = [
    {
      icon: FolderKanban,
      label: 'Active Projects',
      value: projects.filter((p) => p.status !== 'submitted').length,
      total: projects.length,
      trend: '+2 this month',
      color: 'var(--accent-primary)',
    },
    {
      icon: Clock,
      label: 'Due This Week',
      value: projects.filter((p) => p.deadline && isAfter(new Date(p.deadline), now) && new Date(p.deadline) <= weekFromNow).length,
      total: null,
      trend: 'Review deadlines',
      color: 'var(--status-warning)',
    },
    {
      icon: PenLine,
      label: 'Sketches This Month',
      value: sketches.filter((s) => isThisMonth(new Date(s.created_at))).length,
      total: sketches.length,
      trend: 'Keep drawing!',
      color: '#6B2050',
    },
    {
      icon: Layers2,
      label: 'Fabric Swatches',
      value: fabrics.length,
      total: null,
      trend: `${fabrics.filter((f) => f.availability === 'in_stock').length} in stock`,
      color: 'var(--accent-mid)',
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
        >
          <GlassCard padding="md">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: `color-mix(in srgb, ${stat.color} 12%, transparent)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid color-mix(in srgb, ${stat.color} 20%, transparent)`,
              }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <TrendingUp size={14} style={{ color: 'var(--text-muted)', marginTop: '4px' }} />
            </div>
            <div style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1,
              marginBottom: '0.25rem',
            }}>
              {stat.value}
              {stat.total !== null && (
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 400 }}>
                  /{stat.total}
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.trend}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  )
}
