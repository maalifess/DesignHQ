import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAtelierStore, type SavedPattern, type SavedSketch } from '@/store/useAtelierStore'



export default function ProjectDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { profile } = useAuth()
  const designerName = profile?.display_name || profile?.full_name || 'Ariba'

  const projects = useAtelierStore((state) => state.projects)
  const deadlines = useAtelierStore((state) => state.deadlines)
  const fabrics = useAtelierStore((state) => state.fabrics)
  const updateProject = useAtelierStore((state) => state.updateProject)
  
  const sketchesStore = useAtelierStore((state) => state.sketches)
  const patternsStore = useAtelierStore((state) => state.patterns)
  const moodboardsStore = useAtelierStore((state) => state.moodboards)
  const fittingLogsStore = useAtelierStore((state) => state.fittingLogs)
  const notesStore = useAtelierStore((state) => state.notes)
  
  const addSketch = useAtelierStore((state) => state.addSketch)
  const updateSketch = useAtelierStore((state) => state.updateSketch)
  const deleteSketch = useAtelierStore((state) => state.deleteSketch)

  const addPattern = useAtelierStore((state) => state.addPattern)
  const updatePattern = useAtelierStore((state) => state.updatePattern)
  const deletePattern = useAtelierStore((state) => state.deletePattern)

  const activeProject = projects.find((p) => p.id === id) || projects[0]

  const projectSketches = sketchesStore.filter((s) => s.projectId === activeProject?.id)
  const projectPatterns = patternsStore.filter((p) => p.projectId === activeProject?.id)
  const projectMoodboards = moodboardsStore.filter((m) => m.projectId === activeProject?.id)
  const projectFittingLogs = fittingLogsStore.filter((f) => f.projectId === activeProject?.id)
  const projectNotes = notesStore.filter((n) => n.projectId === activeProject?.id)

  const projectTitle = activeProject?.title || 'Ariba Haute Couture Collection'
  const projectCode = activeProject?.code || '#CR-2680'
  const projectCategory = activeProject?.category || 'Haute Couture / Collection'
  const projectTargetDate = activeProject?.targetDate || 'Nov 18, 2026'
  const projectStage = activeProject?.stage || 'Sampling & Fitting Stage (75%)'

  const activeStage = activeProject?.stageNum || 6
  const [activeTab, setActiveTab] = useState<string>('garments')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [showAddLookModal, setShowAddLookModal] = useState<boolean>(false)
  const [showPaletteModal, setShowPaletteModal] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleSelectStage = (stageNum: number, stageName: string) => {
    if (!activeProject) return
    const percent = Math.round((stageNum / 9) * 100)
    const stage = `${stageName} (Phase ${stageNum} of 9)`
    updateProject(activeProject.id, {
      stageNum,
      stage,
      percent,
    })
    showToast(`Milestone updated to Stage ${stageNum}: ${stageName} (${percent}%)`)
  }

  // Palette Editor state
  const currentPalette = activeProject?.palette || [
    { name: 'Haute Crimson', hex: '#800020' },
    { name: 'Merlot Velvet', hex: '#5C0016' },
    { name: 'Blush Satin', hex: '#C05070' },
  ]
  const [editingPalette, setEditingPalette] = useState<{ name: string; hex: string }[]>(currentPalette)
  const [newColorHex, setNewColorHex] = useState('#800020')
  const [newColorName, setNewColorName] = useState('')

  // New Look Form
  const [newLookTitle, setNewLookTitle] = useState('')
  const [newLookCategory, setNewLookCategory] = useState('')
  const [newLookDesc, setNewLookDesc] = useState('')
  const [newLookMeasurements, setNewLookMeasurements] = useState('')
  const [newLookImage, setNewLookImage] = useState('')

  // Edit Pattern Form State
  const [editingPattern, setEditingPattern] = useState<SavedPattern | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editMeasurements, setEditMeasurements] = useState('')
  const [editImage, setEditImage] = useState('')

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState<boolean>(false)
  const [showImportSketchModal, setShowImportSketchModal] = useState<boolean>(false)

  // Edit Sketch Form State
  const [editingSketch, setEditingSketch] = useState<SavedSketch | null>(null)
  const [editSketchTitle, setEditSketchTitle] = useState('')
  const [editSketchGarmentType, setEditSketchGarmentType] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSavePalette = () => {
    if (activeProject) {
      updateProject(activeProject.id, { palette: editingPalette })
      showToast('Collection palette saved!')
    }
    setShowPaletteModal(false)
  }

  const handleAddColorToPalette = () => {
    if (!newColorHex) return
    const name = newColorName.trim() || `Color ${editingPalette.length + 1}`
    setEditingPalette([...editingPalette, { name, hex: newColorHex }])
    setNewColorName('')
  }

  const handleRemoveColorFromPalette = (index: number) => {
    setEditingPalette(editingPalette.filter((_, i) => i !== index))
  }

  const handleAddLook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLookTitle) return
    const num = (projectPatterns.length + 1).toString().padStart(2, '0')
    const defaultImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
    const newLook = {
      projectId: activeProject?.id,
      number: num,
      patternNo: `PT-${Math.floor(Math.random() * 800 + 100)}`,
      title: newLookTitle,
      category: newLookCategory.trim() || 'General',
      status: 'Ready',
      statusType: 'approved' as const,
      fabric: '',
      notions: '',
      nextFitting: '',
      modeliste: '',
      pieces: 1,
      description: newLookDesc || `New pattern created for ${projectTitle}.`,
      measurements: newLookMeasurements.trim(),
      image: newLookImage.trim() || defaultImage,
    }

    addPattern(newLook)
    setShowAddLookModal(false)
    setNewLookTitle('')
    setNewLookCategory('')
    setNewLookDesc('')
    setNewLookMeasurements('')
    setNewLookImage('')
    showToast(`Pattern (${newLookTitle}) added to ${projectTitle}!`)
  }

  const handleImportPattern = (pat: SavedPattern) => {
    addPattern({
      projectId: activeProject?.id,
      importedFromId: pat.id,
      number: (projectPatterns.length + 1).toString().padStart(2, '0'),
      patternNo: `PT-${Math.floor(Math.random() * 800 + 100)}`,
      title: pat.title,
      category: pat.category,
      status: 'Ready',
      statusType: 'approved',
      fabric: pat.fabric || '',
      notions: pat.notions || '',
      nextFitting: '',
      modeliste: '',
      pieces: pat.pieces || 1,
      description: pat.description,
      measurements: pat.measurements,
      image: pat.image,
    })
    showToast(`Imported "${pat.title}" into ${projectTitle}!`)
    setShowImportModal(false)
  }

  const handleStartEdit = (pat: SavedPattern) => {
    setEditingPattern(pat)
    setEditTitle(pat.title)
    setEditCategory(pat.category || '')
    setEditDesc(pat.description || '')
    setEditMeasurements(pat.measurements || '')
    setEditImage(pat.image || '')
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPattern) return
    updatePattern(editingPattern.id, {
      title: editTitle,
      category: editCategory,
      description: editDesc,
      measurements: editMeasurements,
      image: editImage,
    })
    showToast(`Updated "${editTitle}"`)
    setEditingPattern(null)
  }

  const handleImportSketch = (sketch: SavedSketch) => {
    addSketch({
      projectId: activeProject?.id,
      importedFromId: sketch.id,
      title: sketch.title,
      collectionTitle: projectTitle,
      garmentType: sketch.garmentType || 'Outerwear/Tailoring',
      fabricName: sketch.fabricName || 'Studio Canvas Spec',
      imageUrl: sketch.imageUrl,
    })
    showToast(`Imported "${sketch.title}" into ${projectTitle}!`)
    setShowImportSketchModal(false)
  }

  const handleStartEditSketch = (sketch: SavedSketch) => {
    setEditingSketch(sketch)
    setEditSketchTitle(sketch.title)
    setEditSketchGarmentType(sketch.garmentType || '')
  }

  const handleSaveEditSketch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSketch) return
    updateSketch(editingSketch.id, {
      title: editSketchTitle,
      garmentType: editSketchGarmentType,
    })
    showToast(`Updated "${editSketchTitle}"`)
    setEditingSketch(null)
  }

  const filteredPatterns = projectPatterns.filter((look) => {
    if (!searchFilter) return true
    const q = searchFilter.toLowerCase()
    return (
      look.title.toLowerCase().includes(q) ||
      look.fabric.toLowerCase().includes(q) ||
      look.category.toLowerCase().includes(q) ||
      look.status.toLowerCase().includes(q)
    )
  })

  const stagesList = [
    { num: 1, name: 'Ideation', detail: 'Complete' },
    { num: 2, name: 'Moodboard', detail: 'Complete' },
    { num: 3, name: 'Sketching', detail: '12 Rendered' },
    { num: 4, name: 'Fabrication', detail: '8 Swatches' },
    { num: 5, name: 'Patternmaking', detail: 'CAD Graded' },
    { num: 6, name: 'Sampling', detail: 'In Review (75%)' },
    { num: 7, name: 'Fitting', detail: 'Tomorrow' },
    { num: 8, name: 'Production', detail: 'Scheduled' },
    { num: 9, name: 'Runway', detail: 'Launch Nov' },
  ]

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-space-xs text-body-sm font-body-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/projects')}
            className="text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            Collections
          </button>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-semibold">{projectTitle}</span>
        </div>
      </div>

      {/* Header Card */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest/90 backdrop-blur-2xl shadow-2xl border border-outline-variant/20 p-space-lg">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs flex-1">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase font-bold">
                {projectCategory}
              </span>
            </div>

            <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight mt-1 font-bold">
              {projectTitle}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              {activeProject?.description || 'Bespoke atelier collection created by Ariba.'}
            </p>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-space-md mt-space-xs pt-space-xs border-t border-outline-variant/20">
              <div>
                <span className="font-label-sm text-label-sm text-outline block">Lead Designer</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">{designerName}</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline block">Deadline</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">{projectTargetDate}</span>
              </div>
            </div>

            {/* Palette Swatch Row */}
            <div className="flex items-center gap-space-xs mt-space-xs">
              <span className="font-label-sm text-label-sm text-outline">Collection Palette:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(activeProject?.palette || currentPalette).map((p, idx) => (
                  <span
                    key={idx}
                    className="w-6 h-6 rounded-full shadow-md border border-white/20 transition-transform hover:scale-110"
                    style={{ backgroundColor: p.hex }}
                    title={p.name}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEditingPalette(activeProject?.palette || currentPalette)
                    setShowPaletteModal(true)
                  }}
                  className="px-space-xs py-0.5 rounded-md bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-sm text-label-sm font-semibold transition-all cursor-pointer flex items-center gap-1 border border-outline-variant/20 ml-2"
                >
                  <span className="material-symbols-outlined text-xs">palette</span>
                  <span>Edit Palette</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Stack */}
          <div className="flex flex-wrap lg:flex-col gap-space-xs flex-shrink-0">
            <button
              onClick={() => setShowAddLookModal(true)}
              className="flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add Garment Look</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              <span>Export Tech Pack PDF</span>
            </button>
            <button
              type="button"
              onClick={() => showToast('Lookbook preview generated!')}
              className="flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              <span>Lookbook High-Res</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
                showToast('Collection URL copied to clipboard!')
              }}
              className="flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>Share with Atelier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9-Stage Milestone Lifecycle Stepper */}
      <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-xs">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-md text-label-md text-outline uppercase tracking-wider font-bold">
            Couture Production Milestone Pipeline
          </span>
          <span className="font-label-md text-label-md text-primary font-bold">
            Stage {activeStage} of 9: {stagesList[activeStage - 1].name} ({Math.round((activeStage / 9) * 100)}%)
          </span>
        </div>

        {/* Desktop Stepper Bar */}
        <div className="hidden md:grid grid-cols-9 gap-1 text-center">
          {stagesList.map((stage) => {
            const isCurrent = activeStage === stage.num
            const isDone = stage.num < activeStage
            return (
              <div
                key={stage.num}
                onClick={() => handleSelectStage(stage.num, stage.name)}
                className={`flex flex-col items-center p-space-xs rounded-lg border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-primary-container text-on-primary border-primary shadow-[0_4px_16px_rgba(128,0,32,0.5)] font-bold'
                    : isDone
                    ? 'bg-surface-container-high/60 text-primary border-primary/30'
                    : 'bg-surface-container-low text-outline border-outline-variant/20'
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs mb-1 font-bold">
                  {isDone ? '✓' : stage.num}
                </div>
                <span className="font-label-sm text-[11px] font-semibold truncate">{stage.name}</span>
                <span className="font-label-sm text-[9px] opacity-80 truncate">{stage.detail}</span>
              </div>
            )
          })}
        </div>

        {/* Mobile Stepper Touch Row */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-1 mobile-scroll-x">
          {stagesList.map((stage) => (
            <button
              key={stage.num}
              onClick={() => handleSelectStage(stage.num, stage.name)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-semibold cursor-pointer ${
                activeStage === stage.num
                  ? 'bg-primary-container text-on-primary'
                  : stage.num < activeStage
                  ? 'bg-surface-container-high text-primary'
                  : 'bg-surface-container-low text-outline'
              }`}
            >
              {stage.num}. {stage.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Tabs & Sub-Bar */}
      <div className="flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20 pb-space-xs">
          <div className="flex items-center gap-space-2xs overflow-x-auto mobile-scroll-x">
            {[
              { id: 'garments', label: `Patterns (${projectPatterns.length})` },
              { id: 'fabrics', label: `Sketches (${projectSketches.length})` },
              { id: 'moodboard', label: `Mood Boards (${projectMoodboards.length})` },
              { id: 'fitting', label: `Fitting Logs (${projectFittingLogs.length})` },
              { id: 'notes', label: `Notes (${projectNotes.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-space-md py-space-xs rounded-lg font-title-sm text-title-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary-container text-on-primary font-semibold shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-space-xs">
            <button className="p-space-2xs rounded bg-surface-container-high text-on-surface" title="Grid View">
              <span className="material-symbols-outlined text-lg">view_agenda</span>
            </button>
            <button className="p-space-2xs rounded text-outline hover:text-on-surface" title="Table View">
              <span className="material-symbols-outlined text-lg">table_rows</span>
            </button>
          </div>
        </div>

        {/* Sub-bar Filter Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Filter looks by silhouette, fabric, status..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-space-md py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
            />
          </div>
          <span className="font-label-sm text-label-sm text-outline">Sort: Look Runway Order</span>
        </div>
      </div>

      {/* Main Grid: Garments List (Left 8) + Right Rail (Right 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left 8 Columns: Main Tab Content */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {activeTab === 'garments' && (
            <>
              {filteredPatterns.length === 0 ? (
                <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
                  <span className="material-symbols-outlined text-5xl text-outline">styler</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    No Patterns Added Yet
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                    Add patterns with specs, textile assignments, and fitting guidelines.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm font-medium border border-outline-variant/20 cursor-pointer flex items-center gap-1.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Import from Library</span>
                    </button>
                    <button
                      onClick={() => setShowAddLookModal(true)}
                      className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
                      type="button"
                    >
                      + Add Pattern
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-space-md">
                    {filteredPatterns.map((look) => (
                      <div
                        key={look.id}
                        className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md hover:bg-surface-container-low transition-all"
                      >
                        <div className="flex flex-col sm:flex-row items-start gap-space-md">
                          <img
                            alt={look.title}
                            className="w-full sm:w-32 h-44 rounded-lg object-cover flex-shrink-0 shadow-lg border border-outline-variant/30"
                            src={look.image}
                          />

                          <div className="flex flex-col min-w-0 flex-1 gap-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                  {look.title}
                                </h3>
                                {look.category && (
                                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                                    {look.category}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(look)}
                                  className="text-outline hover:text-primary transition-colors p-1 cursor-pointer"
                                  title="Edit Pattern & Measurements"
                                >
                                  <span className="material-symbols-outlined text-base">edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deletePattern(look.id)}
                                  className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                                  title="Delete Pattern"
                                >
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              </div>
                            </div>

                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                              {look.description}
                            </p>

                            {look.measurements && (
                              <div className="mt-2 p-space-xs rounded-lg bg-surface-container-high/60 border border-outline-variant/15 text-xs text-on-surface-variant flex flex-col gap-0.5">
                                <span className="font-semibold text-on-surface text-[11px] uppercase tracking-wider">
                                  Measurements &amp; Specs:
                                </span>
                                <span className="whitespace-pre-line text-on-surface">{look.measurements}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action bar */}
                  <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-sm border-t border-outline-variant/20 mt-2">
                    <div className="font-label-sm text-label-sm text-outline">
                      Showing {filteredPatterns.length} Pattern{filteredPatterns.length === 1 ? '' : 's'}
                    </div>

                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm font-medium border border-outline-variant/20 cursor-pointer flex items-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                        <span>Import from Library</span>
                      </button>
                      <button
                        onClick={() => setShowAddLookModal(true)}
                        className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span>+ Add Another Pattern</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'fabrics' && (
            <>
              {projectSketches.length === 0 ? (
                <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
                  <span className="material-symbols-outlined text-5xl text-outline">draw</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    No Sketches Added Yet
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                    Import existing sketches from your library or create new ones for {projectTitle}.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowImportSketchModal(true)}
                      className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm font-medium border border-outline-variant/20 cursor-pointer flex items-center gap-1.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      <span>Import from Library</span>
                    </button>
                    <button
                      onClick={() => navigate('/sketchbook')}
                      className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      <span>+ Add Sketch</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                    {projectSketches.map((sketch) => (
                      <div
                        key={sketch.id}
                        className="rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden shadow-md group flex flex-col justify-between"
                      >
                        <div className="relative aspect-[3/4] bg-surface-container-high overflow-hidden">
                          <img
                            src={sketch.imageUrl}
                            alt={sketch.title}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-space-sm flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-title-sm text-on-surface font-bold truncate">{sketch.title}</h4>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStartEditSketch(sketch)}
                                className="text-outline hover:text-primary transition-colors p-1 cursor-pointer"
                                title="Edit Sketch Details"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteSketch(sketch.id)}
                                className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                                title="Delete Sketch"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </div>
                          {sketch.garmentType && (
                            <span className="font-label-sm text-outline truncate">{sketch.garmentType}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-sm border-t border-outline-variant/20 mt-2">
                    <div className="font-label-sm text-label-sm text-outline">
                      Showing {projectSketches.length} Sketch{projectSketches.length === 1 ? '' : 'es'}
                    </div>

                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={() => setShowImportSketchModal(true)}
                        className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm font-medium border border-outline-variant/20 cursor-pointer flex items-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                        <span>Import from Library</span>
                      </button>
                      <button
                        onClick={() => navigate('/sketchbook')}
                        className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        <span>+ Add Sketch</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'moodboard' && (
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
              <span className="material-symbols-outlined text-5xl text-outline">dashboard</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                No Mood Board Collage Added Yet
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Create a visual direction for {projectTitle}.
              </p>
              <button
                onClick={() => navigate('/moodboards')}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
                type="button"
              >
                + Create Mood Board
              </button>
            </div>
          )}

          {activeTab === 'fitting' && (
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
              <span className="material-symbols-outlined text-5xl text-outline">straighten</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                No Fitting Logs Added Yet
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Schedule and manage fittings for {projectTitle}.
              </p>
              <button
                onClick={() => {}}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
                type="button"
              >
                + Add Fitting Log
              </button>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
              <span className="material-symbols-outlined text-5xl text-outline">note_alt</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                No Atelier Notes Added Yet
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Keep track of ideas and tasks for {projectTitle}.
              </p>
              <button
                onClick={() => navigate('/notes')}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
                type="button"
              >
                + Add Note
              </button>
            </div>
          )}
        </div>

        {/* Right 4 Columns: Dynamic Right Rail */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Fitting Schedule & Production Deadlines */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">straighten</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Fitting Schedule</h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Live Deadlines</span>
            </div>

            {deadlines.length === 0 ? (
              <div className="p-space-md rounded-lg bg-surface-container-high/40 text-center flex flex-col items-center gap-2">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  No active fitting deadlines set for this collection.
                </span>
                <button
                  onClick={() => navigate('/notes')}
                  className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold cursor-pointer"
                >
                  View Notes &amp; Fittings
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm">
                {deadlines.slice(0, 3).map((dl) => (
                  <div
                    key={dl.id}
                    className="p-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-0.5 border border-outline-variant/10"
                  >
                    <div className="flex items-center justify-between text-title-sm font-title-sm">
                      <span className="text-on-surface font-bold truncate">{dl.title}</span>
                      <span className="text-primary font-bold text-xs flex-shrink-0">{dl.daysLeft}d left</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {dl.detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collection Overview & Metrics */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-xl">analytics</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Collection Metrics</h3>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs text-body-sm font-body-sm">
              <div className="flex justify-between items-center p-space-xs rounded bg-surface-container-high/40">
                <span className="text-outline">Target Runway:</span>
                <span className="text-on-surface font-semibold">{projectTargetDate}</span>
              </div>
              <div className="flex justify-between items-center p-space-xs rounded bg-surface-container-high/40">
                <span className="text-outline">Garment Looks:</span>
                <span className="text-on-surface font-semibold">{projectPatterns.length} Created</span>
              </div>
              <div className="flex justify-between items-center p-space-xs rounded bg-surface-container-high/40">
                <span className="text-outline">Fabric Swatches:</span>
                <span className="text-on-surface font-semibold">{fabrics.length} Swatches in Vault</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Collection Palette Modal */}
      {showPaletteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">palette</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Edit Collection Palette
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaletteModal(false)}
                className="text-outline hover:text-on-surface p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-md">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider font-semibold">
                Current Color Swatches ({editingPalette.length})
              </span>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-space-xs rounded-lg bg-surface-container-high/40 border border-outline-variant/20">
                {editingPalette.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-space-xs py-1 rounded-full bg-surface-container-high border border-white/20 shadow-sm"
                  >
                    <span
                      className="w-5 h-5 rounded-full shadow-inner border border-white/40"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-title-sm text-xs text-on-surface font-semibold">{color.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColorFromPalette(idx)}
                      className="text-outline hover:text-error transition-colors p-0.5 rounded-full"
                      title="Remove Color"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Color Section */}
              <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/20">
                <span className="font-label-md text-label-md text-on-surface font-semibold">Add New Swatch</span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-outline-variant/30 p-0.5"
                    title="Choose hex color"
                  />
                  <input
                    type="text"
                    placeholder="Color Name (e.g. Royal Emerald)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm border border-outline-variant/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddColorToPalette}
                    className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Palette Presets */}
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline font-semibold">Quick Swatch Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Onyx Noir', hex: '#160B0F' },
                    { name: 'Haute Crimson', hex: '#800020' },
                    { name: 'Merlot Velvet', hex: '#5C0016' },
                    { name: 'Blush Satin', hex: '#C05070' },
                    { name: 'Champagne Silk', hex: '#F7E7CE' },
                    { name: 'Emerald Drape', hex: '#004B23' },
                    { name: 'Sapphire Midnight', hex: '#0F2027' },
                    { name: 'Dusty Rose', hex: '#8B4060' },
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => {
                        if (!editingPalette.some((c) => c.hex === preset.hex)) {
                          setEditingPalette([...editingPalette, preset])
                        }
                      }}
                      className="px-2 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-[11px] flex items-center gap-1.5 border border-outline-variant/10 cursor-pointer"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowPaletteModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePalette}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 shadow-lg"
              >
                Save Palette
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Garment Look Modal */}
      {showAddLookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleAddLook}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Add Pattern
              </h3>
              <button type="button" onClick={() => setShowAddLookModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Origami Evening Gown"
                  value={newLookTitle}
                  onChange={(e) => setNewLookTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Image / Sketch</label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={newLookImage}
                    onChange={(e) => setNewLookImage(e.target.value)}
                    className="flex-1 w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                  />
                  <label className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-outline-variant/30 cursor-pointer text-center text-xs font-semibold whitespace-nowrap border border-outline-variant/20 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setNewLookImage(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
                {newLookImage && (
                  <div className="mt-2 relative w-24 h-28 rounded-lg overflow-hidden border border-outline-variant/30 shadow-md">
                    <img src={newLookImage} alt="Pattern Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewLookImage('')}
                      className="absolute top-1 right-1 bg-background/80 text-on-surface rounded-full p-0.5 hover:bg-error/80 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Outerwear, Eveningwear, Draping..."
                  value={newLookCategory}
                  onChange={(e) => setNewLookCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Measurements &amp; Fitting Specs</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bust: 88cm, Waist: 68cm, Hips: 94cm, Seam Allowance: 1.5cm..."
                  value={newLookMeasurements}
                  onChange={(e) => setNewLookMeasurements(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Description &amp; Construction Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe silhouette grainlines, bias drape, and seam allowances..."
                  value={newLookDesc}
                  onChange={(e) => setNewLookDesc(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAddLookModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 cursor-pointer"
              >
                Add Pattern
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Import Pattern from Library Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">download</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Import Pattern from Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              Select any pattern from your global atelier library to import it into <strong>{projectTitle}</strong>:
            </p>

            {patternsStore.length === 0 ? (
              <div className="text-center py-8 text-outline text-body-sm">
                No patterns found in library. Create a new pattern first!
              </div>
            ) : (
              <div className="flex flex-col gap-space-xs max-h-96 overflow-y-auto pr-1">
                {patternsStore.map((pat) => {
                  const isAlreadyInProject =
                    pat.projectId === activeProject?.id ||
                    projectPatterns.some(
                      (p) =>
                        p.id === pat.id ||
                        p.importedFromId === pat.id ||
                        (p.title && p.title.toLowerCase() === pat.title.toLowerCase())
                    )
                  return (
                    <div
                      key={pat.id}
                      className="p-space-xs rounded-lg bg-surface-container-high/80 border border-outline-variant/20 flex items-center justify-between gap-space-md hover:bg-surface-container-highest transition-colors"
                    >
                      <div className="flex items-center gap-space-xs min-w-0">
                        <img
                          src={pat.image}
                          alt={pat.title}
                          className="w-12 h-14 rounded object-cover flex-shrink-0 shadow border border-outline-variant/20"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                            {pat.title}
                          </span>
                          <span className="text-xs text-outline truncate">
                            {pat.category || 'General'}
                          </span>
                        </div>
                      </div>

                      {isAlreadyInProject ? (
                        <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container-highest text-outline rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                          Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImportPattern(pat)}
                          className="px-3 py-1 rounded bg-primary-container text-on-primary font-title-sm text-xs font-semibold hover:brightness-110 cursor-pointer whitespace-nowrap"
                        >
                          Import
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex justify-end pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Pattern Modal */}
      {editingPattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveEdit}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Edit Pattern Specs
              </h3>
              <button
                type="button"
                onClick={() => setEditingPattern(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Image / Sketch</label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="flex-1 w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                  />
                  <label className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-outline-variant/30 cursor-pointer text-center text-xs font-semibold whitespace-nowrap border border-outline-variant/20 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setEditImage(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
                {editImage && (
                  <div className="mt-2 relative w-24 h-28 rounded-lg overflow-hidden border border-outline-variant/30 shadow-md">
                    <img src={editImage} alt="Pattern Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditImage('')}
                      className="absolute top-1 right-1 bg-background/80 text-on-surface rounded-full p-0.5 hover:bg-error/80 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Outerwear, Eveningwear, Draping..."
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Measurements &amp; Fitting Specs</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Bust: 88cm, Waist: 68cm, Hips: 94cm, Seam Allowance: 1.5cm..."
                  value={editMeasurements}
                  onChange={(e) => setEditMeasurements(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Description &amp; Construction Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe grainlines, bias drape, facing details..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingPattern(null)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Import Sketch from Library Modal */}
      {showImportSketchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">draw</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Import Sketch from Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImportSketchModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              Select any sketch from your global atelier sketchbook to import it into <strong>{projectTitle}</strong>:
            </p>

            {sketchesStore.length === 0 ? (
              <div className="text-center py-8 text-outline text-body-sm">
                No sketches found in library. Create a new sketch first!
              </div>
            ) : (
              <div className="flex flex-col gap-space-xs max-h-96 overflow-y-auto pr-1">
                {sketchesStore.map((sketch) => {
                  const isAlreadyInProject =
                    sketch.projectId === activeProject?.id ||
                    projectSketches.some(
                      (s) =>
                        s.id === sketch.id ||
                        s.importedFromId === sketch.id ||
                        (s.title && s.title.toLowerCase() === sketch.title.toLowerCase())
                    )
                  return (
                    <div
                      key={sketch.id}
                      className="p-space-xs rounded-lg bg-surface-container-high/80 border border-outline-variant/20 flex items-center justify-between gap-space-md hover:bg-surface-container-highest transition-colors"
                    >
                      <div className="flex items-center gap-space-xs min-w-0">
                        <img
                          src={sketch.imageUrl}
                          alt={sketch.title}
                          className="w-12 h-14 rounded object-cover flex-shrink-0 shadow border border-outline-variant/20"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                            {sketch.title}
                          </span>
                          <span className="text-xs text-outline truncate">
                            {sketch.garmentType || 'Sketch'}
                          </span>
                        </div>
                      </div>

                      {isAlreadyInProject ? (
                        <span className="text-xs font-semibold px-2.5 py-1 bg-surface-container-highest text-outline rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                          Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImportSketch(sketch)}
                          className="px-3 py-1 rounded bg-primary-container text-on-primary font-title-sm text-xs font-semibold hover:brightness-110 cursor-pointer whitespace-nowrap"
                        >
                          Import
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex justify-end pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowImportSketchModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sketch Details Modal */}
      {editingSketch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveEditSketch}
            className="relative w-full max-w-md rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Edit Sketch Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingSketch(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-md text-body-sm">
              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Sketch Title</label>
                <input
                  type="text"
                  required
                  value={editSketchTitle}
                  onChange={(e) => setEditSketchTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Garment / Silhouette Type</label>
                <input
                  type="text"
                  placeholder="e.g. Outerwear, Eveningwear, Draping..."
                  value={editSketchGarmentType}
                  onChange={(e) => setEditSketchGarmentType(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingSketch(null)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
