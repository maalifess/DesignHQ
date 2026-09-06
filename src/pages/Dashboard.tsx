import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAtelierStore } from '@/store/useAtelierStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const designerName = profile?.display_name || profile?.full_name || 'Ariba'

  const projects = useAtelierStore((state) => state.projects)
  const addProject = useAtelierStore((state) => state.addProject)

  const sketches = useAtelierStore((state) => state.sketches)
  const fabrics = useAtelierStore((state) => state.fabrics)
  const addFabric = useAtelierStore((state) => state.addFabric)

  const deadlines = useAtelierStore((state) => state.deadlines)
  const addDeadline = useAtelierStore((state) => state.addDeadline)

  // Modals
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false)
  const [auditRunning, setAuditRunning] = useState<boolean>(false)
  const [auditApplied, setAuditApplied] = useState<boolean>(false)

  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false)
  const [showAddFabricModal, setShowAddFabricModal] = useState<boolean>(false)
  const [showAddDeadlineModal, setShowAddDeadlineModal] = useState<boolean>(false)

  // New Project Form
  const [projTitle, setProjTitle] = useState('')
  const [projCategory, setProjCategory] = useState('Couture Line')
  const [projSeason, setProjSeason] = useState('Autumn/Winter 2026')
  const [projTargetDate, setProjTargetDate] = useState('Nov 18, 2026')

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
      description: 'New haute couture collection added by Ariba.',
    })
    setShowAddProjectModal(false)
    setProjTitle('')
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
            <div className="flex items-center gap-space-xs">
              <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase">
                Maison Direction
              </span>
              <span className="text-outline font-label-sm text-label-sm">•</span>
              <span className="text-outline font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                Paris Fashion Week Runway Session
              </span>
            </div>
            <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight mt-1 font-bold">
              Welcome back, {designerName}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Couture Atelier Workspace. Managing active haute couture projects, pattern drafting, and saved material swatches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-outline">Active Collections</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                  {projects.length} Saved Line{projects.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Collection</span>
            </button>

            <button
              onClick={() => navigate('/sketchbook')}
              className="flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">brush</span>
              <span>Open Drafting Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div
          onClick={() => navigate('/projects')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-space-xs">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">styler</span>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-secondary-container/40 text-secondary font-semibold flex items-center gap-0.5">
              Saved State
            </span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Active Collections</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {projects.length} Saved
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Active Couture Lines
          </span>
        </div>

        <div
          onClick={() => navigate('/sketchbook')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-space-xs">
            <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-xl">palette</span>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-surface-container-high text-primary font-semibold">
              AI Vision Ready
            </span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Design Sketches</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {sketches.length} Artworks
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-xs text-secondary">verified</span> Freehand Croquis Canvas
          </span>
        </div>

        <div
          onClick={() => navigate('/fabrics')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-space-xs">
            <div className="w-10 h-10 rounded-lg bg-tertiary-container/40 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-xl">texture</span>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface font-semibold">
              Vault
            </span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Textile Swatches</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {fabrics.length} Swatches
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Material Repository
          </span>
        </div>

        <div
          onClick={() => navigate('/notes')}
          className="relative overflow-hidden rounded-xl bg-surface-container-low/80 backdrop-blur-xl p-space-lg shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-space-xs">
            <div className="w-10 h-10 rounded-lg bg-primary-container/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">event_upcoming</span>
            </div>
            <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary font-bold">
              Production
            </span>
          </div>
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider block">Upcoming Deadlines</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-space-2xs block font-bold">
            {deadlines.length} Items
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 truncate">
            <span className="material-symbols-outlined text-xs">straighten</span> Atelier Schedule
          </span>
        </div>
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
                      <div className="flex items-center gap-space-xs">
                        <span className="px-space-xs py-0.5 rounded-md bg-secondary-container/50 text-secondary font-label-sm text-label-sm uppercase font-semibold">
                          {proj.category}
                        </span>
                        <span className="font-body-sm text-body-sm text-outline">Code: {proj.code}</span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
                        {proj.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <span className="font-body-sm text-body-sm text-outline">Target Runway:</span>
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
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-sm text-label-sm text-outline">Tonal Array:</span>
                        <div className="flex items-center gap-1">
                          {proj.palette.map((p, idx) => (
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
                        <span className="material-symbols-outlined text-sm text-primary">checkroom</span> {proj.garmentsCount} Garments Tailored
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
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/projects/${proj.id}`) }}
                        className="px-space-sm py-1.5 rounded-lg bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                        type="button"
                      >
                        Tech Pack
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

        {/* Right 4 columns: Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Urgent Deadlines */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">timer</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Urgent Deadlines</h3>
              </div>
              <button
                onClick={() => setShowAddDeadlineModal(true)}
                className="font-label-sm text-label-sm text-primary hover:underline font-semibold cursor-pointer"
              >
                + Add Item
              </button>
            </div>

            {deadlines.length === 0 ? (
              <div className="p-space-md rounded-lg bg-surface-container-high/40 text-center flex flex-col items-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  No urgent fitting deadlines set for Ariba's atelier line.
                </span>
                <button
                  onClick={() => setShowAddDeadlineModal(true)}
                  className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold cursor-pointer"
                >
                  + Add Fitting Deadline
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm">
                {deadlines.map((dl) => (
                  <div
                    key={dl.id}
                    className="p-space-sm rounded-lg bg-surface-container-high/60 backdrop-blur-md flex items-start gap-space-sm border border-outline-variant/10"
                  >
                    <span
                      className={`px-space-xs py-1 rounded font-label-sm text-label-sm font-bold flex-shrink-0 ${
                        dl.urgency === 'high'
                          ? 'bg-error-container text-on-error'
                          : dl.urgency === 'medium'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-highest text-primary'
                      }`}
                    >
                      {dl.daysLeft} Days
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                        {dl.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        {dl.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/notes')}
              className="w-full py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm text-center transition-colors cursor-pointer"
              type="button"
            >
              View Atelier Production Calendar
            </button>
          </div>

          {/* Fabric Quick Vault */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-xl">texture</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Fabric Quick Vault</h3>
              </div>
              <button
                onClick={() => navigate('/fabrics')}
                className="font-label-sm text-label-sm text-tertiary hover:underline cursor-pointer"
              >
                Full Catalog
              </button>
            </div>

            {fabrics.length === 0 ? (
              <div className="p-space-md rounded-lg bg-surface-container-high/40 text-center flex flex-col items-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  No textile swatches added to Ariba's vault.
                </span>
                <button
                  onClick={() => setShowAddFabricModal(true)}
                  className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold cursor-pointer"
                >
                  + Add Swatch
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm">
                {fabrics.slice(0, 3).map((fb) => (
                  <div
                    key={fb.id}
                    onClick={() => navigate('/fabrics')}
                    className="flex items-center gap-space-sm p-space-xs rounded-lg bg-surface-container-high/50 hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <img
                      alt={fb.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      src={fb.imageUrl}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                        {fb.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">{fb.weight} • {fb.origin}</span>
                    </div>
                    <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-primary-container/40 text-primary font-bold">
                      {fb.metersLeft}m
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddFabricModal(true)}
              className="flex items-center justify-center gap-space-2xs py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add_photo_alternate</span>
              <span>Scan / Add Swatch</span>
            </button>
          </div>

          {/* Gemini 2.0 Atelier Copilot Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary-container/30 via-surface-container-low/90 to-surface-container-low p-space-lg shadow-xl backdrop-blur-2xl border border-outline-variant/20">
            <div className="absolute top-0 right-0 p-space-md opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-6xl text-primary">auto_awesome</span>
            </div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm">neurology</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Gemini 2.0 Atelier Copilot
              </span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-2xs font-bold">
              Silhouette &amp; Line Advisory
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md italic">
              {projects.length > 0
                ? `"Analyzing ${projects.length} collection line(s) for Ariba. Maintain dynamic rhythm between structured tailored suits and liquid bias-cut eveningwear."`
                : `"Atelier Copilot initialized for Ariba. Ready to provide live grainline, drape tolerance, and seam allowance advisories as you save collections and sketchbook artworks."`}
            </p>
            <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/30">
              <span className="font-label-sm text-label-sm text-outline">Accuracy Index: 98.4%</span>
              <button
                onClick={handleRunAudit}
                className="text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                type="button"
              >
                Run Atelier Audit <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateProject}
            className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                New Couture Collection
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
                  placeholder="e.g. Velvet Solstice AW27"
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
                  value={projSeason}
                  onChange={(e) => setProjSeason(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Target Runway Date</label>
                <input
                  type="text"
                  value={projTargetDate}
                  onChange={(e) => setProjTargetDate(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateFabric}
            className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateDeadline}
            className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
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
