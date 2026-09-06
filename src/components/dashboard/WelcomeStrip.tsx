import React, { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { format } from 'date-fns'

export function WelcomeStrip() {
  const { profile } = useAuth()
  const now = new Date()

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = profile?.display_name || profile?.full_name?.split(' ')[0] || 'Ariba'

  return (
    <div style={{
      marginBottom: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.25rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
        }}>
          {greeting}, {displayName}
        </h1>
      </div>
    </div>
  )
}
