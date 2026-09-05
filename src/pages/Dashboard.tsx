import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { WelcomeStrip } from '@/components/dashboard/WelcomeStrip'
import { StatCards } from '@/components/dashboard/StatCards'
import { ActiveProjects } from '@/components/dashboard/ActiveProjects'
import { RecentSketches } from '@/components/dashboard/RecentSketches'
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines'
import { useProjects } from '@/hooks/useProjects'
import { useSketch } from '@/hooks/useSketch'
import { useFabrics } from '@/hooks/useFabrics'
import { useMoodBoard } from '@/hooks/useMoodBoard'
import { useNavigate } from 'react-router-dom'
import { Image } from 'lucide-react'

function SkeletonCard({ height = 120 }: { height?: number }) {
  return <div className="skeleton" style={{ height, borderRadius: 'var(--radius-lg)' }} />
}

export default function Dashboard() {
  const { projects, loading: projectsLoading } = useProjects()
  const { sketches, loading: sketchesLoading } = useSketch()
  const { fabrics, loading: fabricsLoading } = useFabrics()
  const { moodBoards } = useMoodBoard()
  const navigate = useNavigate()

  const isLoading = projectsLoading || sketchesLoading || fabricsLoading

  return (
    <div style={{ maxWidth: '1400px' }}>
      <WelcomeStrip />

      {/* Stat Cards */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} height={140} />)}
        </div>
      ) : (
        <StatCards projects={projects} sketches={sketches} fabrics={fabrics} />
      )}

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Projects */}
          {isLoading ? <SkeletonCard height={220} /> : <ActiveProjects projects={projects} />}

          {/* Mood Board Previews */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Image size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Mood Boards
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/moodboards')}>View all</button>
            </div>
            {moodBoards.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                No mood boards yet. Start gathering inspiration →
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {moodBoards.slice(0, 2).map((board, i) => (
                  <motion.div
                    key={board.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/moodboards/${board.id}`)}
                    style={{
                      height: 120,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-deep)',
                      border: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '1rem',
                    }}
                  >
                    <Image size={24} style={{ color: 'var(--accent-primary)', opacity: 0.6 }} />
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'center' }} className="truncate">
                      {board.name}
                    </p>
                    {board.extracted_colors && Array.isArray(board.extracted_colors) && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {board.extracted_colors.slice(0, 5).map((c: string, ci: number) => (
                          <div key={ci} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1.5px solid rgba(255,255,255,0.3)' }} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Fabric Highlights */}
          {fabrics.length > 0 && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Recent Fabrics
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/fabrics')}>View all</button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {fabrics.slice(0, 3).map((fabric) => (
                  <div key={fabric.id} style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: 'var(--accent-light)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                    {fabric.image_url && (
                      <div style={{
                        height: 60, borderRadius: 'var(--radius-sm)',
                        background: `url(${fabric.image_url}) center/cover`,
                        border: '1px solid var(--glass-border)',
                      }} />
                    )}
                    {fabric.dominant_colors && (
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {(fabric.dominant_colors as string[]).slice(0, 4).map((c: string, i: number) => (
                          <div key={i} className="color-dot" style={{ background: c }} />
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-primary)' }} className="truncate">{fabric.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isLoading ? (
            <>
              <SkeletonCard height={200} />
              <SkeletonCard height={280} />
            </>
          ) : (
            <>
              <RecentSketches sketches={sketches} />
              <UpcomingDeadlines projects={projects} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
