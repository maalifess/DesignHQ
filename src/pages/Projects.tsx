import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtelierStore } from '@/store/useAtelierStore'

export default function Projects() {
  const navigate = useNavigate()
  const projects = useAtelierStore((state) => state.projects)
  const addProject = useAtelierStore((state) => state.addProject)

  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  // New Project Form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Couture Line')
  const [season, setSeason] = useState('Autumn/Winter 2026')
  const [targetDate, setTargetDate] = useState('Nov 18, 2026')
  const [stage, setStage] = useState('Sampling (Phase 6 of 9)')
  const [percent, setPercent] = useState(75)
  const [garmentsCount, setGarmentsCount] = useState(8)

  const filtered = projects.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const randomCode = '#CR-' + Math.floor(1000 + Math.random() * 9000)
    addProject({
      code: randomCode,
      title: title.trim(),
      category,
      season,
      targetDate,
      stage,
      stageNum: 6,
      percent: Number(percent),
      palette: [
        { name: 'Haute Crimson', hex: '#800020' },
        { name: 'Merlot Velvet', hex: '#5C0016' },
        { name: 'Blush Satin', hex: '#C05070' },
        { name: 'Vintage Mauve', hex: '#842130' },
      ],
      garmentsCount: Number(garmentsCount),
      description: 'Bespoke atelier collection created by Ariba.',
    })

    setShowModal(false)
    setTitle('')
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20 pb-space-lg">
        <div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight font-bold">
            Couture Collections Registry
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Active haute couture lines, runway presentation schedules, and production milestone progress saved by Ariba.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer w-max"
          type="button"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Collection</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by collection title, code, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-space-md py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
          />
        </div>
        <span className="font-label-sm text-label-sm text-outline">
          Showing {filtered.length} Active Collections
        </span>
      </div>

      {/* Collections List or Empty State */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-space-2xl rounded-xl bg-surface-container-low/90 backdrop-blur-2xl border border-outline-variant/20 text-center space-y-space-md">
          <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">styler</span>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              No Collections Saved Yet
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              There are no collections in Ariba's registry. Click "+ New Collection" to start drafting your first couture line.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
            type="button"
          >
            + Create Collection as Ariba
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-space-lg">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/projects/${item.id}`)}
              className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md hover:bg-surface-container-low transition-all cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded-md bg-secondary-container/50 text-secondary font-label-sm text-label-sm uppercase font-semibold">
                      {item.category}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">Project Code: {item.code}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="font-body-sm text-body-sm text-outline">Target Runway / Jury:</span>
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold bg-surface-container-high px-space-xs py-1 rounded">
                    {item.targetDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-space-2xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">
                    Lifecycle Stage: <strong className="text-primary font-semibold">{item.stage}</strong>
                  </span>
                  <span className="text-primary font-bold">{item.percent}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-primary transition-all duration-700"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs border-t border-outline-variant/20">
                <div className="flex items-center gap-space-md">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm text-outline">Tonal Array:</span>
                    <div className="flex items-center gap-1">
                      {item.palette.map((p, idx) => (
                        <span
                          key={idx}
                          className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                          style={{ backgroundColor: p.hex }}
                          title={p.name}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">|</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">checkroom</span> {item.garmentsCount} Garments Tailored
                  </span>
                </div>

                <div className="flex items-center gap-space-xs">
                  <button
                    type="button"
                    className="px-space-sm py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-colors shadow-md"
                  >
                    Open Collection Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateProject}
            className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                New Couture Collection
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Collection Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Velvet Solstice AW27"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                >
                  <option value="Couture Line">Couture Line</option>
                  <option value="Resort Collection">Resort Collection</option>
                  <option value="Competition Project">Competition Project</option>
                  <option value="Atelier Assignment">Atelier Assignment</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Season</label>
                <input
                  type="text"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Target Runway / Jury Date</label>
                <input
                  type="text"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Stage &amp; Progress (%)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={percent}
                    onChange={(e) => setPercent(Number(e.target.value))}
                    className="w-20 px-space-xs py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Save Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
