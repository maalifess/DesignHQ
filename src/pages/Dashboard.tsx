import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAtelierStore, safeString } from '@/store/useAtelierStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const designerName = profile?.display_name || profile?.full_name || 'Ariba'

  const notes = useAtelierStore((state) => state.notes)
  const addNote = useAtelierStore((state) => state.addNote)

  const projects = useAtelierStore((state) => state.projects)
  const addProject = useAtelierStore((state) => state.addProject)

  const sketches = useAtelierStore((state) => state.sketches)
  const fabrics = useAtelierStore((state) => state.fabrics)
  const addFabric = useAtelierStore((state) => state.addFabric)

  const deadlines = useAtelierStore((state) => state.deadlines)
  const addDeadline = useAtelierStore((state) => state.addDeadline)

  const closestProject = projects.length > 0 ? projects[0] : null
  const closestDeadline = deadlines.length > 0 ? [...deadlines].sort((a, b) => a.daysLeft - b.daysLeft)[0] : null

  // Quick Note State
  const [quickNoteTitle, setQuickNoteTitle] = useState('')
  const [quickNoteContent, setQuickNoteContent] = useState('')
  const [quickNoteCategory, setQuickNoteCategory] = useState('Fitting Notes')
  const [quickNoteSavedToast, setQuickNoteSavedToast] = useState(false)

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickNoteContent.trim()) return
    const title = quickNoteTitle.trim() || 'Quick Fitting Note'
    const today = new Date().toISOString().split('T')[0]
    addNote({
      title,
      category: quickNoteCategory,
      content: quickNoteContent.trim(),
      date: today,
      tag: quickNoteCategory.toLowerCase().includes('pattern') ? 'Pattern Specs' : 'Fitting Note',
      createdAt: new Date().toISOString(),
    })
    setQuickNoteTitle('')
    setQuickNoteContent('')
    setQuickNoteSavedToast(true)
    setTimeout(() => setQuickNoteSavedToast(false), 3000)
  }

  // Modals
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false)
  const [auditRunning, setAuditRunning] = useState<boolean>(false)
  const [auditApplied, setAuditApplied] = useState<boolean>(false)

  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false)
  const [showAddFabricModal, setShowAddFabricModal] = useState<boolean>(false)
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState<boolean>(false)

  // New Project Form
  const [projTitle, setProjTitle] = useState('')
  const [projCategory, setProjCategory] = useState('Assignment')
  const [projSeason, setProjSeason] = useState('Fashion Design 101')
  const [projTargetDate, setProjTargetDate] = useState('2026-11-18')
  const [projDesc, setProjDesc] = useState('Bespoke atelier collection created by Ariba.')

  // New Fabric Form
  const [fabName, setFabName] = useState('')
  const [fabWeight, setFabWeight] = useState('320 GSM')
  const [fabOrigin, setFabOrigin] = useState('Como, Italy')
  const [fabMeters, setFabMeters] = useState(25)

  // New Deadline Form
  const [dlTitle, setDlTitle] = useState('')
  const [dlDetail, setDlDetail] = useState('')
  const [dlDays, setDlDays] = useState(3)

  const handleRunAudit = () => {
    setShowAuditModal(true)
    setAuditRunning(true)
    setTimeout(() => {
      setAuditRunning(false)
    }, 1000)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projTitle.trim()) return
    const code = '#CR-' + Math.floor(1000 + Math.random() * 9000)
    addProject({
      code,
      title: projTitle.trim(),
      category: projCategory,
      season: projSeason,
      targetDate: projTargetDate,
      stage: 'Sampling (Phase 6 of 9)',
      stageNum: 6,
      percent: 75,
      palette: [
        { name: 'Haute Crimson', hex: '#800020' },
        { name: 'Merlot Velvet', hex: '#5C0016' },
        { name: 'Blush Satin', hex: '#C05070' },
      ],
      garmentsCount: 6,
      description: projDesc.trim() || 'Bespoke atelier collection created by Ariba.',
    })
    setShowAddProjectModal(false)
    setProjTitle('')
    setProjDesc('Bespoke atelier collection created by Ariba.')
  }

  const handleCreateFabric = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fabName.trim()) return
    addFabric({
      name: fabName.trim(),
      type: 'Silk Velvet',
      weight: fabWeight,
      origin: fabOrigin,
      metersLeft: Number(fabMeters),
      availability: fabMeters < 10 ? 'Low Stock' : 'In Stock',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYXiyur532gaNSCCnps3Ias-c0mDhQz2GPOcbpj7PaIa2WG1d9xKCj23w1Kl9q3jF7gWa8JZPUSkUAh7DxSA3ucWRLSfbiqxTGes-Cs1HQsl7WieZnBphtKk0SqCSXElCm-jQJd0kGfNTCooxHPauSAikMFIIZj82kKjsJflViapAdEnGdgV11ZadlrYUTUTeN9I44k3JOz8jBetGKHBqeb2clblb_Se2fSuo4G3EzM4qroTQ03nT2Mw',
      costPerMeter: 120,
      supplier: 'Biella Textiles Milan',
    })
    setShowAddFabricModal(false)
    setFabName('')
  }

  const handleCreateDeadline = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dlTitle.trim()) return
    addDeadline({
      title: dlTitle.trim(),
      detail: dlDetail.trim() || 'Atelier schedule item',
      daysLeft: Number(dlDays),
      urgency: dlDays <= 2 ? 'high' : dlDays <= 5 ? 'medium' : 'low',
      date: 'Upcoming',
    })
    setShowAddDeadlineModal(false)
    setDlTitle('')
    setDlDetail('')
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest/90 backdrop-blur-2xl shadow-2xl p-space-lg">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-64 h-64 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-2xs">
            {closestProject ? (
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                  Closest Deadline
                </span>
                <span className="text-outline font-label-sm text-label-sm">•</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                  <span className="font-semibold text-on-surface">{closestProject.title}</span> — Target Runway: {closestProject.targetDate}
                </span>
              </div>
            ) : closestDeadline ? (
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                  Closest Deadline
                </span>
                <span className="text-outline font-label-sm text-label-sm">•</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                  <span className="font-semibold text-on-surface">{closestDeadline.title}</span> ({closestDeadline.daysLeft} days left)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold">
                  Atelier Dashboard
                </span>
              </div>
            )}
            <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight mt-1 font-bold">
              Welcome back, {designerName}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Collection</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/projects')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary mb-space-xs">
            <span className="material-symbols-outlined text-xl">styler</span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Active Collections</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {projects.length} Saved
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/sketchbook')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary mb-space-xs">
            <span className="material-symbols-outlined text-xl">palette</span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Design Sketches</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {sketches.length} Sketches
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/fabrics')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-tertiary-container/40 flex items-center justify-center text-tertiary mb-space-xs">
            <span className="material-symbols-outlined text-xl">texture</span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Saved Patterns</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {fabrics.length} Patterns
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => navigate('/notes')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl cursor-pointer flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center text-primary mb-space-xs">
            <span className="material-symbols-outlined text-xl">event_upcoming</span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Upcoming Deadlines</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {deadlines.length} Items
          </span>
        </motion.div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left 8 columns */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Current Active Collections */}
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">styler</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Current Active Collections</h2>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="font-label-sm text-label-sm text-primary hover:underline font-semibold cursor-pointer"
                  type="button"
                >
                  + Add Collection
                </button>
                <button
                  onClick={() => navigate('/projects')}
                  className="font-label-md text-label-md text-outline hover:text-on-surface transition-colors flex items-center gap-0.5 cursor-pointer"
                  type="button"
                >
                  Registry <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-sm">
                <span className="material-symbols-outlined text-4xl text-outline">checkroom</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  No Active Collections Saved
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Create your first haute couture collection as Ariba to start tracking patternmaking, toiles, and runway milestone progress.
                </p>
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer mt-space-xs"
                  type="button"
                >
                  + Create Collection
                </button>
              </div>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {proj.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <span className="font-body-sm text-body-sm text-outline">Deadline:</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold bg-surface-container-high px-space-xs py-1 rounded">
                        {proj.targetDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-space-2xs">
                    <div className="flex items-center justify-between font-label-sm text-label-sm">
                      <span className="text-on-surface-variant">
                        Lifecycle Stage: <strong className="text-primary font-semibold">{proj.stage}</strong>
                      </span>
                      <span className="text-primary font-bold">{proj.percent}% Complete</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary-container via-secondary-container to-primary transition-all duration-700"
                        style={{ width: `${proj.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs border-t border-outline-variant/20">
                    <div className="flex items-center gap-space-md">
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">draw</span> {sketches.length} Sketches
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">•</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-secondary">dashboard</span> 0 Mood Boards
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/notes') }}
                        className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
                        type="button"
                      >
                        Fitting Notes
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Sketchbook & AI Critique */}
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-xl">draw</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Recent Sketchbook &amp; AI Critique</h2>
              </div>
              <button
                onClick={() => navigate('/sketchbook')}
                className="font-label-md text-label-md text-secondary hover:underline cursor-pointer"
              >
                Open Sketchbook Canvas
              </button>
            </div>

            {sketches.length === 0 ? (
              <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-sm">
                <span className="material-symbols-outlined text-4xl text-outline">edit_note</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  No Saved Sketchbook Artworks
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Draw croquis annotations and silhouettes in the Sketchbook canvas, then click "Save to Atelier" to view them here with Gemini AI critiques.
                </p>
                <button
                  onClick={() => navigate('/sketchbook')}
                  className="px-space-md py-space-xs rounded-lg bg-secondary-container text-on-secondary-container font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer mt-space-xs"
                  type="button"
                >
                  Open Freehand Sketchbook
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {sketches.map((sk) => (
                  <div
                    key={sk.id}
                    onClick={() => navigate('/sketchbook')}
                    className="rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20 p-space-md shadow-xl flex flex-col gap-space-sm group cursor-pointer"
                  >
                    <div className="relative w-full h-72 rounded-lg overflow-hidden bg-surface-container-lowest">
                      <img
                        alt={sk.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={sk.imageUrl}
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-sm text-[10px] font-bold tracking-wider uppercase">
                          {sk.collectionTitle || 'Ariba Look'}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-space-xs py-0.5 rounded bg-primary-container/80 backdrop-blur-md text-on-primary font-label-sm text-[10px] font-semibold">
                        Score: {sk.score}/100
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">
                          {sk.title}
                        </h4>
                        <span className="font-label-sm text-label-sm text-outline">{sk.fabricName}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        {sk.garmentType}
                      </p>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-1 border border-outline-variant/10">
                      <div className="flex items-center gap-1 text-secondary font-label-sm text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        <span>AI Mentor Critique</span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant italic">
                        {sk.aiCritique}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 columns: Quick Notes Corner */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          <form onSubmit={handleSaveQuickNote} className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Atelier Quick Notes</h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/notes')}
                className="font-label-sm text-label-sm text-primary hover:underline font-semibold cursor-pointer"
              >
                Full Log
              </button>
            </div>

            {quickNoteSavedToast && (
              <div className="p-space-xs rounded bg-primary-container/40 text-primary font-label-sm text-xs flex items-center gap-1 font-semibold animate-fade-in">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Note saved to Fitting Notes library!</span>
              </div>
            )}

            <div className="flex flex-col gap-space-xs">
              <input
                type="text"
                placeholder="Note Title (Optional)"
                value={quickNoteTitle}
                onChange={(e) => setQuickNoteTitle(e.target.value)}
                className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface font-title-sm text-title-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
              />

              <select
                value={quickNoteCategory}
                onChange={(e) => setQuickNoteCategory(e.target.value)}
                className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface font-body-sm text-body-sm focus:outline-none border border-outline-variant/20"
              >
                <option value="Fitting Notes">Fitting Notes</option>
                <option value="Pattern Adjustments">Pattern Adjustments</option>
                <option value="Fabrics & Drapes">Fabrics &amp; Drapes</option>
                <option value="General Atelier Task">General Atelier Task</option>
              </select>

              <textarea
                rows={5}
                required
                value={quickNoteContent}
                onChange={(e) => setQuickNoteContent(e.target.value)}
                placeholder="Jot down quick fitting notes, pattern adjustments, or task reminders..."
                className="w-full p-space-sm rounded-lg bg-surface-container-high/60 text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20 resize-none"
              />
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                type="submit"
                className="flex-1 py-space-xs rounded-lg bg-primary-container hover:brightness-110 text-on-primary font-title-sm text-title-sm font-semibold transition-all shadow cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Save Note</span>
              </button>
              <button
                onClick={() => navigate('/notes')}
                className="px-space-sm py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-colors cursor-pointer"
                type="button"
              >
                View All ({notes.length})
              </button>
            </div>

            {/* Recent Saved Notes List */}
            {notes.length > 0 && (
              <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/20">
                <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-semibold">
                  Recent Atelier Notes ({notes.slice(0, 3).length})
                </span>
                <div className="flex flex-col gap-space-xs max-h-48 overflow-y-auto pr-1">
                  {notes.slice(0, 3).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => navigate('/notes')}
                      className="p-space-xs rounded bg-surface-container-high/40 hover:bg-surface-container-high border border-outline-variant/10 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-title-sm text-xs font-semibold text-on-surface truncate">{safeString(n.title)}</span>
                        <span className="font-label-sm text-[10px] text-primary bg-primary-container/30 px-1 rounded">{safeString(n.category)}</span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{safeString(n.content)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-[95vw] sm:max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Gemini 2.0 Full Atelier Audit
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {auditRunning ? (
              <div className="flex flex-col items-center justify-center py-space-2xl gap-space-md">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
                <p className="font-body-md text-body-md text-on-surface font-semibold">
                  Auditing silhouette rhythm, grainlines, and seam tolerances for Ariba...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-space-md">
                <div className="p-space-md rounded-lg bg-surface-container-high/60 border border-outline-variant/20 flex flex-col gap-space-xs">
                  <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                    Harmonic Rhythm Score: 98.4%
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Audited saved collections and sketchbook drafts for designer Ariba. The structural tension across shoulders and draped bias hemlines maintains high runway impact.
                  </p>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <h4 className="font-title-sm text-title-sm text-on-surface font-bold">
                    Actionable Recommendations for Ariba:
                  </h4>
                  <ul className="space-y-space-xs text-body-sm font-body-sm text-on-surface-variant">
                    <li className="p-space-xs rounded bg-surface-container-high/40 border border-outline-variant/10">
                      • <strong>Silhouette Contrast:</strong> Introduce flared peplums or circular capes to elevate column lines.
                    </li>
                    <li className="p-space-xs rounded bg-surface-container-high/40 border border-outline-variant/10">
                      • <strong>Seam Allowance:</strong> Stabilize heavy velvet shoulder scyes with 45gsm fusible stay tape.
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
                  <button
                    onClick={() => setShowAuditModal(false)}
                    className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
                  >
                    Close Audit
                  </button>
                  <button
                    onClick={() => {
                      setAuditApplied(true)
                      setTimeout(() => setShowAuditModal(false), 800)
                    }}
                    className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
                  >
                    {auditApplied ? 'Audit Applied ✓' : 'Apply Audit Recommendations'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateProject}
            className="relative w-full max-w-[95vw] sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                New Collection
              </h3>
              <button type="button" onClick={() => setShowAddProjectModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Collection Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Velvet Solstice Collection"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Category</label>
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="Final Term">Final Term</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Course</label>
                <input
                  type="text"
                  placeholder="e.g. Fashion Design 101"
                  value={projSeason}
                  onChange={(e) => setProjSeason(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Deadline</label>
                <input
                  type="date"
                  value={projTargetDate}
                  onChange={(e) => setProjTargetDate(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bespoke atelier collection created by Ariba."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAddProjectModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Create Collection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Fabric Modal */}
      {showAddFabricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateFabric}
            className="relative w-full max-w-[95vw] sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Scan / Add Textile Swatch
              </h3>
              <button type="button" onClick={() => setShowAddFabricModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Fabric Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mulberry Silk Velvet"
                  value={fabName}
                  onChange={(e) => setFabName(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Weight &amp; Weave</label>
                <input
                  type="text"
                  value={fabWeight}
                  onChange={(e) => setFabWeight(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Origin &amp; Mill</label>
                <input
                  type="text"
                  value={fabOrigin}
                  onChange={(e) => setFabOrigin(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Available Meters</label>
                <input
                  type="number"
                  value={fabMeters}
                  onChange={(e) => setFabMeters(Number(e.target.value))}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAddFabricModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-tertiary-container text-on-tertiary-container font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Add Swatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Deadline Modal */}
      {showAddDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateDeadline}
            className="relative w-full max-w-[95vw] sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Add Fitting / Production Deadline
              </h3>
              <button type="button" onClick={() => setShowAddDeadlineModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Deadline Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Organza Toile Fitting"
                  value={dlTitle}
                  onChange={(e) => setDlTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Detail / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Model: Maya L. • 10:00 AM Milan Salons"
                  value={dlDetail}
                  onChange={(e) => setDlDetail(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Days Remaining</label>
                <input
                  type="number"
                  min="1"
                  value={dlDays}
                  onChange={(e) => setDlDays(Number(e.target.value))}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAddDeadlineModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Save Deadline
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
