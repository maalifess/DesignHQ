import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenLine } from 'lucide-react'
import type { Sketch } from '@/hooks/useSketch'
import { formatDate } from '@/lib/export'

interface RecentSketchesProps {
  sketches: Sketch[]
}

export function RecentSketches({ sketches }: RecentSketchesProps) {
  const navigate = useNavigate()
  const recent = sketches.slice(0, 6)

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <PenLine size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Recent Sketches
        </h3>
      </div>

      {recent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <PenLine size={36} style={{ color: 'var(--glass-border)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic', maxWidth: 260 }}>
            Your sketchbook is empty. Pick up the pen — every great designer starts with a single line.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sketchbook')}>
            Open Sketchbook
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
        }}>
          {recent.map((sketch, i) => (
            <motion.div
              key={sketch.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate('/sketchbook')}
              style={{
                aspectRatio: '4/5',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                border: '1px solid var(--glass-border)',
                background: sketch.thumbnail_url
                  ? `url(${sketch.thumbnail_url}) center/cover`
                  : 'var(--bg-surface-deep)',
                transition: 'border-color var(--transition-base)',
              }}
              whileHover={{ scale: 1.03 }}
            >
              {!sketch.thumbnail_url && (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: '0.375rem',
                  padding: '0.5rem',
                }}>
                  <PenLine size={20} style={{ color: 'var(--glass-border)' }} />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }} className="truncate">
                    {sketch.title}
                  </p>
                </div>
              )}
              {/* Hover overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(13,4,7,0.7) 0%, transparent 60%)',
                opacity: 0,
                transition: 'opacity var(--transition-base)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0.5rem',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <p style={{ fontSize: '0.7rem', color: 'white', fontWeight: 500, lineHeight: 1.2 }} className="truncate">
                  {sketch.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
