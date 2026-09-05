import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'accent', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}

// ── Color label badge ──────────────────────────────────────────────────────────
export const PROJECT_COLORS = [
  { label: 'Crimson',  value: '#800020' },
  { label: 'Burgundy', value: '#5C0016' },
  { label: 'Rose',     value: '#A0002A' },
  { label: 'Blush',    value: '#C05070' },
  { label: 'Mauve',    value: '#8B4060' },
  { label: 'Plum',     value: '#6B2050' },
]

interface ColorBadgeProps {
  color: string
  label?: string
  size?: 'sm' | 'md'
}

export function ColorBadge({ color, label, size = 'sm' }: ColorBadgeProps) {
  const dim = size === 'sm' ? 10 : 14
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
      <span
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          background: color,
          border: '1.5px solid rgba(255,255,255,0.3)',
          flexShrink: 0,
        }}
      />
      {label && <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</span>}
    </span>
  )
}
