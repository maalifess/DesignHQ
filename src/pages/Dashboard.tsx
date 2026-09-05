import React from 'react'
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

function SkeletonCard({ height = 120 }: { height?: number }) {
  return <div className="skeleton rounded-xl" style={{ height }} />
}

export default function Dashboard() {
  const { projects, loading: projectsLoading } = useProjects()
  const { sketches, loading: sketchesLoading } = useSketch()
  const { fabrics, loading: fabricsLoading } = useFabrics()
  const { moodBoards } = useMoodBoard()
  const navigate = useNavigate()

  const isLoading = projectsLoading || sketchesLoading || fabricsLoading

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Hero Welcome Strip */}
      <WelcomeStrip />

      {/* Metric Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} height={140} />)}
        </div>
      ) : (
        <StatCards projects={projects} sketches={sketches} fabrics={fabrics} />
      )}

      {/* Main 12-Column Atelier Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {isLoading ? <SkeletonCard height={280} /> : <ActiveProjects projects={projects} />}

          {/* Mood Board & Fabric Highlights */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome_motion</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Mood Boards &amp; Color Arrays</h3>
              </div>
              <button
                className="font-label-md text-label-md text-primary hover:text-on-surface transition-colors flex items-center gap-0.5 bg-transparent border-none cursor-pointer font-semibold"
                onClick={() => navigate('/moodboards')}
              >
                Explore Boards <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {moodBoards.length === 0 ? (
              <p className="font-body-sm text-body-sm text-outline italic">
                No mood boards curated yet. Start gathering inspiration and AI color extraction →
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                {moodBoards.slice(0, 2).map((board) => (
                  <motion.div
                    key={board.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate(`/moodboards/${board.id}`)}
                    className="p-space-md rounded-lg bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/20 cursor-pointer flex flex-col gap-space-xs hover:bg-surface-container-high transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                        {board.name}
                      </span>
                      <span className="material-symbols-outlined text-secondary text-base">palette</span>
                    </div>
                    {board.extracted_colors && Array.isArray(board.extracted_colors) && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Palette:</span>
                        <div className="flex items-center gap-1">
                          {board.extracted_colors.slice(0, 5).map((c: string, ci: number) => (
                            <span
                              key={ci}
                              className="w-4 h-4 rounded-full border border-pearl-highlight shadow-sm"
                              style={{ background: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {isLoading ? (
            <>
              <SkeletonCard height={240} />
              <SkeletonCard height={320} />
            </>
          ) : (
            <>
              <UpcomingDeadlines projects={projects} />
              <RecentSketches sketches={sketches} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
