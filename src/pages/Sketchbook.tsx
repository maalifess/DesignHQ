import React, { useEffect, useRef, useState } from 'react'
import { useAtelierStore, type SavedSketch } from '@/store/useAtelierStore'

interface Point {
  x: number
  y: number
}

interface Stroke {
  tool: 'pen' | 'eraser'
  color: string
  size: number
  points: Point[]
}

interface MeasurementLine {
  start: Point
  end: Point
  label: string
}

const COLOR_PRESETS = [
  { name: 'Crimson Rose', hex: '#800020' },
  { name: 'Merlot', hex: '#5c0016' },
  { name: 'Blush Pink', hex: '#c05070' },
  { name: 'Gold Satin', hex: '#d4af37' },
  { name: 'Charcoal Noir', hex: '#1e1e1e' },
  { name: 'Pure White', hex: '#ffffff' },
]

export default function Sketchbook() {
  const { sketches, projects, patterns, addSketch, updateSketch, deleteSketch } = useAtelierStore()

  // Navigation State: Library vs Canvas Mode
  const [isCanvasMode, setIsCanvasMode] = useState(false)
  const [editingSketchId, setEditingSketchId] = useState<string | null>(null)

  // Library View State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilterProject, setSelectedFilterProject] = useState<string>('All')

  // Canvas Metadata Form State
  const [sketchTitle, setSketchTitle] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [garmentType, setGarmentType] = useState('Outerwear/Tailoring')

  // Canvas Tool State
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'measure'>('pen')
  const [brushColor, setBrushColor] = useState<string>('#800020')
  const [brushSize, setBrushSize] = useState<number>(4)

  // Canvas Image Underlay
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null)
  const [bgImageElement, setBgImageElement] = useState<HTMLImageElement | null>(null)
  const [showPatternPickerModal, setShowPatternPickerModal] = useState(false)

  // Drawing & Measurement History
  const [strokesHistory, setStrokesHistory] = useState<Stroke[]>([])
  const [redoStrokes, setRedoStrokes] = useState<Stroke[]>([])
  const [measurementsList, setMeasurementsList] = useState<MeasurementLine[]>([])

  // Measurement Modal / Manual Label State
  const [pendingMeasurement, setPendingMeasurement] = useState<MeasurementLine | null>(null)
  const [measureLabelInput, setMeasureLabelInput] = useState('')
  const [editingMeasureIndex, setEditingMeasureIndex] = useState<number | null>(null)

  // Live Drawing State
  const [isInteracting, setIsInteracting] = useState(false)
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])
  const [measureStart, setMeasureStart] = useState<Point | null>(null)
  const [measureCurrent, setMeasureCurrent] = useState<Point | null>(null)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Load Background Image Element when bgImageUrl changes
  useEffect(() => {
    if (!bgImageUrl) {
      setBgImageElement(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setBgImageElement(img)
    img.src = bgImageUrl
  }, [bgImageUrl])

  // Redraw Canvas (Background Image + Strokes + Measurements)
  const redrawCanvas = (
    strokes: Stroke[],
    measures: MeasurementLine[],
    liveMeasure?: { start: Point; end: Point }
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.width / dpr
    const height = canvas.height / dpr

    // Clear Canvas
    ctx.clearRect(0, 0, width, height)

    // Draw Background Image if present
    if (bgImageElement) {
      const imgAspect = bgImageElement.width / bgImageElement.height
      const canvasAspect = width / height
      let renderW = width
      let renderH = height
      let offsetX = 0
      let offsetY = 0

      if (imgAspect > canvasAspect) {
        renderH = width / imgAspect
        offsetY = (height - renderH) / 2
      } else {
        renderW = height * imgAspect
        offsetX = (width - renderW) / 2
      }

      ctx.save()
      ctx.globalAlpha = 0.85
      ctx.drawImage(bgImageElement, offsetX, offsetY, renderW, renderH)
      ctx.restore()
    }

    // Draw Saved Strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }

      ctx.lineWidth = stroke.size
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = stroke.color
        ctx.globalAlpha = 1.0
      }

      ctx.stroke()
      ctx.restore()
    })

    // Helper to draw a measurement line with end ticks and label
    const drawMeasurement = (m: { start: Point; end: Point; label?: string }) => {
      ctx.save()
      ctx.strokeStyle = '#d4af37' // Gold measurement color
      ctx.fillStyle = '#d4af37'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 4])

      // Main line
      ctx.beginPath()
      ctx.moveTo(m.start.x, m.start.y)
      ctx.lineTo(m.end.x, m.end.y)
      ctx.stroke()

      // Ticks at ends
      ctx.setLineDash([])
      const dx = m.end.x - m.start.x
      const dy = m.end.y - m.start.y
      const distPx = Math.hypot(dx, dy)
      if (distPx > 5) {
        const angle = Math.atan2(dy, dx)
        const tickLen = 8

        // Start tick
        ctx.beginPath()
        ctx.moveTo(
          m.start.x - tickLen * Math.sin(angle),
          m.start.y + tickLen * Math.cos(angle)
        )
        ctx.lineTo(
          m.start.x + tickLen * Math.sin(angle),
          m.start.y - tickLen * Math.cos(angle)
        )
        ctx.stroke()

        // End tick
        ctx.beginPath()
        ctx.moveTo(
          m.end.x - tickLen * Math.sin(angle),
          m.end.y + tickLen * Math.cos(angle)
        )
        ctx.lineTo(
          m.end.x + tickLen * Math.sin(angle),
          m.end.y - tickLen * Math.cos(angle)
        )
        ctx.stroke()

        // Distance label
        const midX = (m.start.x + m.end.x) / 2
        const midY = (m.start.y + m.end.y) / 2
        const labelText = m.label || `${Math.round(distPx / 4)} cm`

        ctx.font = 'bold 12px Inter, sans-serif'
        const textMetrics = ctx.measureText(labelText)
        const pad = 4
        ctx.fillStyle = 'rgba(15, 10, 12, 0.85)'
        ctx.fillRect(
          midX - textMetrics.width / 2 - pad,
          midY - 14 - pad,
          textMetrics.width + pad * 2,
          18
        )

        ctx.fillStyle = '#f4dce3'
        ctx.textAlign = 'center'
        ctx.fillText(labelText, midX, midY - 2)
      }
      ctx.restore()
    }

    // Draw static measurements
    measures.forEach(drawMeasurement)

    // Draw live measurement line if active
    if (liveMeasure) {
      drawMeasurement(liveMeasure)
    }
  }

  // Handle Canvas Resize & Retain Resolution
  useEffect(() => {
    if (!isCanvasMode) return
    const handleResize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
      redrawCanvas(strokesHistory, measurementsList)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isCanvasMode, strokesHistory, measurementsList, bgImageElement])

  // Get Point from Event
  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  // Mouse / Touch Start
  const startInteraction = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const pt = getCanvasCoords(e)
    setIsInteracting(true)

    if (activeTool === 'measure') {
      setMeasureStart(pt)
      setMeasureCurrent(pt)
    } else {
      setCurrentStroke([pt])
    }
  }

  // Mouse / Touch Move
  const handleInteractionMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isInteracting) return
    const pt = getCanvasCoords(e)

    if (activeTool === 'measure') {
      setMeasureCurrent(pt)
      if (measureStart) {
        redrawCanvas(strokesHistory, measurementsList, {
          start: measureStart,
          end: pt,
        })
      }
    } else {
      const updated = [...currentStroke, pt]
      setCurrentStroke(updated)
      const activeLiveStroke: Stroke = {
        tool: activeTool,
        color: brushColor,
        size: brushSize,
        points: updated,
      }
      redrawCanvas([...strokesHistory, activeLiveStroke], measurementsList)
    }
  }

  // Mouse / Touch End
  const stopInteraction = () => {
    if (!isInteracting) return
    setIsInteracting(false)

    if (activeTool === 'measure') {
      if (measureStart && measureCurrent) {
        const dx = measureCurrent.x - measureStart.x
        const dy = measureCurrent.y - measureStart.y
        const distPx = Math.hypot(dx, dy)
        if (distPx > 8) {
          const autoVal = `${Math.round(distPx / 4)} cm`
          const newMeasure: MeasurementLine = {
            start: measureStart,
            end: measureCurrent,
            label: autoVal,
          }
          setPendingMeasurement(newMeasure)
          setMeasureLabelInput(autoVal)
          setEditingMeasureIndex(null)
        }
      }
      setMeasureStart(null)
      setMeasureCurrent(null)
    } else {
      if (currentStroke.length > 1) {
        const newStroke: Stroke = {
          tool: activeTool,
          color: brushColor,
          size: brushSize,
          points: currentStroke,
        }
        const updated = [...strokesHistory, newStroke]
        setStrokesHistory(updated)
        setRedoStrokes([])
        redrawCanvas(updated, measurementsList)
      }
      setCurrentStroke([])
    }
  }

  const handleUndo = () => {
    if (activeTool === 'measure' && measurementsList.length > 0) {
      const updated = measurementsList.slice(0, -1)
      setMeasurementsList(updated)
      redrawCanvas(strokesHistory, updated)
    } else if (strokesHistory.length > 0) {
      const last = strokesHistory[strokesHistory.length - 1]
      const updated = strokesHistory.slice(0, -1)
      setStrokesHistory(updated)
      setRedoStrokes([...redoStrokes, last])
      redrawCanvas(updated, measurementsList)
    }
  }

  const handleRedo = () => {
    if (redoStrokes.length > 0) {
      const last = redoStrokes[redoStrokes.length - 1]
      const updatedRedo = redoStrokes.slice(0, -1)
      const updatedStrokes = [...strokesHistory, last]
      setRedoStrokes(updatedRedo)
      setStrokesHistory(updatedStrokes)
      redrawCanvas(updatedStrokes, measurementsList)
    }
  }

  const handleClearCanvas = () => {
    if (window.confirm('Clear all drawing strokes, measurements, and background image?')) {
      setStrokesHistory([])
      setRedoStrokes([])
      setMeasurementsList([])
      setBgImageUrl(null)
      setBgImageElement(null)
      redrawCanvas([], [])
      showToast('Canvas cleared cleanly.')
    }
  }

  // Open Canvas for New Sketch
  const handleOpenNewSketch = () => {
    setEditingSketchId(null)
    setSketchTitle('Untitled Sketch')
    setGarmentType('Outerwear/Tailoring')
    setSelectedProjectId('')
    setStrokesHistory([])
    setRedoStrokes([])
    setMeasurementsList([])
    setBgImageUrl(null)
    setBgImageElement(null)
    setIsCanvasMode(true)
  }

  // Open Canvas for Editing an Existing Sketch
  const handleEditSketchInCanvas = (sketch: SavedSketch) => {
    setEditingSketchId(sketch.id)
    setSketchTitle(sketch.title)
    setGarmentType(sketch.garmentType || 'Outerwear/Tailoring')
    setSelectedProjectId(sketch.projectId || '')
    setBgImageUrl(sketch.imageUrl)
    setStrokesHistory([])
    setRedoStrokes([])
    setMeasurementsList([])
    setIsCanvasMode(true)
  }

  // Save Sketch to Store
  const handleSaveSketch = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    const project = projects.find((p) => p.id === selectedProjectId)

    if (editingSketchId) {
      updateSketch(editingSketchId, {
        title: sketchTitle.trim() || 'Untitled Sketch',
        projectId: selectedProjectId || undefined,
        collectionTitle: project?.title || undefined,
        garmentType,
        imageUrl: dataUrl,
      })
      showToast(`Sketch "${sketchTitle}" updated!`)
    } else {
      addSketch({
        title: sketchTitle.trim() || 'Untitled Sketch',
        projectId: selectedProjectId || undefined,
        collectionTitle: project?.title || undefined,
        garmentType,
        fabricName: 'Studio Canvas Spec',
        imageUrl: dataUrl,
      })
      showToast(`Sketch "${sketchTitle}" saved to your atelier sketchbook!`)
    }

    setIsCanvasMode(false)
  }

  const handleExportPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `${sketchTitle.replace(/\s+/g, '_')}_Sketch.png`
    link.href = dataUrl
    link.click()
    showToast('PNG image exported to downloads!')
  }

  // Filtered Sketches for Gallery
  const filteredSketches = sketches.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.garmentType && s.garmentType.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesProj = selectedFilterProject === 'All' || s.projectId === selectedFilterProject
    return matchesSearch && matchesProj
  })

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* LIBRARY VIEW MODE                                                          */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {!isCanvasMode ? (
        <>
          {/* Header Banner */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-2xl">draw</span>
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Sketchbook Library
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Create digital croquis sketches, draw precise specs, and annotate technical measurements for your collections.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenNewSketch}
              className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>New Sketch</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                search
              </span>
              <input
                type="text"
                placeholder="Search sketches by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-space-md py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 text-body-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-outline font-semibold whitespace-nowrap">Filter Collection:</label>
              <select
                value={selectedFilterProject}
                onChange={(e) => setSelectedFilterProject(e.target.value)}
                className="px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 text-body-sm"
              >
                <option value="All">All Collections</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gallery Grid */}
          {filteredSketches.length === 0 ? (
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
              <span className="material-symbols-outlined text-5xl text-outline">draw</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                No Sketches Yet
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Open the digital canvas to sketch garments, annotate pattern measurements, and save artwork to your library.
              </p>
              <button
                onClick={handleOpenNewSketch}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
                type="button"
              >
                + New Sketch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-lg">
              {filteredSketches.map((sketch) => {
                const project = projects.find((p) => p.id === sketch.projectId)
                return (
                  <div
                    key={sketch.id}
                    className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-sm flex flex-col justify-between gap-space-sm hover:bg-surface-container-low transition-all group"
                  >
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/20">
                      <img
                        src={sketch.imageUrl}
                        alt={sketch.title}
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditSketchInCanvas(sketch)}
                          className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-title-sm text-xs font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Open Canvas</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-title-sm text-title-sm font-bold text-on-surface truncate">
                          {sketch.title}
                        </h3>
                        <button
                          onClick={() => deleteSketch(sketch.id)}
                          className="text-outline hover:text-error transition-colors p-0.5 cursor-pointer"
                          title="Delete Sketch"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>

                      {sketch.garmentType && (
                        <span className="text-xs text-outline truncate">{sketch.garmentType}</span>
                      )}

                      {project && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium truncate mt-0.5">
                          <span className="material-symbols-outlined text-xs">folder</span>
                          <span>{project.title}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      ) : (
        /* ────────────────────────────────────────────────────────────────────────── */
        /* INTERACTIVE CANVAS STUDIO MODE                                            */
        /* ────────────────────────────────────────────────────────────────────────── */
        <div className="flex flex-col gap-space-md">
          {/* Top Control Bar */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-xs w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsCanvasMode(false)}
                className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface cursor-pointer"
                title="Back to Library"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </button>
              <input
                type="text"
                value={sketchTitle}
                onChange={(e) => setSketchTitle(e.target.value)}
                placeholder="Sketch Title..."
                className="px-space-xs py-1 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 font-headline-sm text-headline-sm font-bold focus:outline-none w-full sm:w-64"
              />
            </div>

            {/* Metadata Inputs */}
            <div className="flex flex-wrap items-center gap-space-xs text-body-sm w-full md:w-auto justify-end">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 text-xs"
              >
                <option value="">Unassigned Collection</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowPatternPickerModal(true)}
                className="px-space-xs py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-xs flex items-center gap-1 border border-outline-variant/20 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_cut</span>
                <span>{bgImageUrl ? 'Change Pattern Image' : 'Import Pattern Image'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportPNG}
                className="px-space-xs py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-xs cursor-pointer"
              >
                Export PNG
              </button>

              <button
                type="button"
                onClick={handleSaveSketch}
                className="px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary font-title-sm text-xs font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">save</span>
                <span>Save Sketch</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas Board */}
          <div
            ref={containerRef}
            className="relative w-full h-[640px] rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shadow-2xl touch-none select-none dot-grid-bg"
          >
            {/* HTML5 High-DPI Canvas */}
            <canvas
              ref={canvasRef}
              id="atelierSketchCanvas"
              onMouseDown={startInteraction}
              onMouseMove={handleInteractionMove}
              onMouseUp={stopInteraction}
              onMouseLeave={stopInteraction}
              onTouchStart={startInteraction}
              onTouchMove={handleInteractionMove}
              onTouchEnd={stopInteraction}
              className={`absolute inset-0 w-full h-full z-10 ${
                activeTool === 'measure' ? 'cursor-crosshair' : activeTool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'
              }`}
            />

            {/* Floating Drawing Dock (Bottom Center) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 max-w-full px-2">
              <div className="flex flex-wrap items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/40 shadow-2xl">
                {/* Pen Tool */}
                <button
                  type="button"
                  onClick={() => setActiveTool('pen')}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    activeTool === 'pen' ? 'bg-primary-container text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Drawing Pen"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>

                {/* Eraser Tool */}
                <button
                  type="button"
                  onClick={() => setActiveTool('eraser')}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    activeTool === 'eraser' ? 'bg-primary-container text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Eraser"
                >
                  <span className="material-symbols-outlined text-lg">ink_eraser</span>
                </button>

                {/* Measurement Tool */}
                <button
                  type="button"
                  onClick={() => setActiveTool('measure')}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    activeTool === 'measure' ? 'bg-primary-container text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Measurement Ruler Tool (Click & drag to measure distance)"
                >
                  <span className="material-symbols-outlined text-lg">straighten</span>
                </button>

                <span className="h-6 w-px bg-outline-variant/30 my-auto hidden sm:block" />

                {/* Brush Size Slider */}
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-xs text-outline">line_weight</span>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-16 sm:w-24 accent-primary cursor-pointer"
                  />
                  <span className="font-label-sm text-[10px] text-outline w-6 text-right font-mono">{brushSize}px</span>
                </div>

                <span className="h-6 w-px bg-outline-variant/30 my-auto hidden sm:block" />

                {/* Color Picker & Wheel */}
                <div className="flex items-center gap-1">
                  <label className="relative w-6 h-6 rounded-full cursor-pointer overflow-hidden border border-outline-variant/40 shadow-inner" title="Color Wheel Picker">
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="absolute -inset-2 w-10 h-10 cursor-pointer opacity-0"
                    />
                    <span className="block w-full h-full rounded-full" style={{ backgroundColor: brushColor }} />
                  </label>

                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setBrushColor(preset.hex)}
                      className={`w-5 h-5 rounded-full transition-all cursor-pointer border border-outline-variant/30 ${
                        brushColor === preset.hex ? 'ring-2 ring-primary scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                </div>

                <span className="h-6 w-px bg-outline-variant/30 my-auto hidden sm:block" />

                {/* History Actions */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                    title="Undo"
                  >
                    <span className="material-symbols-outlined text-base">undo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStrokes.length === 0}
                    className="p-1.5 text-on-surface-variant hover:text-on-surface disabled:opacity-30 cursor-pointer"
                    title="Redo"
                  >
                    <span className="material-symbols-outlined text-base">redo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="p-1.5 text-on-surface-variant hover:text-error cursor-pointer"
                    title="Clear Canvas"
                  >
                    <span className="material-symbols-outlined text-base">delete_sweep</span>
                  </button>
                </div>
              </div>

              <span className="font-label-sm text-[10px] text-outline bg-surface-container-lowest/90 backdrop-blur-md px-3 py-0.5 rounded-full">
                {activeTool === 'measure'
                  ? 'Measurement Tool Active — Click & drag on canvas to measure specs'
                  : 'Drawing Active — Sketch, annotate, and measure your garment designs'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Image Picker Modal */}
      {showPatternPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">content_cut</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Import Pattern Image onto Canvas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPatternPickerModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              Select a pattern image from your library or upload an image file to place onto the canvas for sketching and annotating:
            </p>

            {/* Upload Custom File Option */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/60 border border-outline-variant/20 flex items-center justify-between gap-space-md">
              <span className="text-body-sm text-on-surface font-semibold">Upload Image File</span>
              <label className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-xs font-semibold cursor-pointer hover:brightness-110">
                <span>Browse File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setBgImageUrl(reader.result as string)
                        setShowPatternPickerModal(false)
                        showToast('Pattern image loaded onto canvas!')
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>

            <span className="text-xs text-outline font-semibold uppercase tracking-wider">
              Or Select From Atelier Patterns:
            </span>

            {patterns.length === 0 ? (
              <div className="text-center py-6 text-outline text-body-sm">
                No patterns found in library.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs max-h-72 overflow-y-auto pr-1">
                {patterns.map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => {
                      setBgImageUrl(pat.image)
                      setShowPatternPickerModal(false)
                      showToast(`Loaded "${pat.title}" onto canvas!`)
                    }}
                    className="p-space-2xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/20 flex flex-col items-center gap-1 cursor-pointer transition-colors text-left"
                  >
                    <img
                      src={pat.image}
                      alt={pat.title}
                      className="w-full h-28 object-cover rounded shadow-sm border border-outline-variant/20"
                    />
                    <span className="font-title-sm text-[11px] font-bold text-on-surface truncate w-full px-1">
                      {pat.title}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowPatternPickerModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Manual Measurement Label Modal */}
      {pendingMeasurement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">straighten</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {editingMeasureIndex !== null ? 'Edit Measurement Label' : 'Measurement Tape & Ruler'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingMeasurement(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-body-sm text-on-surface-variant">
              Auto-calculated tape distance: <strong className="text-primary">{pendingMeasurement.label}</strong>.
              You can keep this length or type custom specs below:
            </p>

            <div className="flex flex-col gap-1">
              <label className="text-outline text-xs font-semibold">Measurement Specs / Custom Label</label>
              <input
                type="text"
                value={measureLabelInput}
                onChange={(e) => setMeasureLabelInput(e.target.value)}
                placeholder="e.g. Bust: 88cm, Waist: 68cm, Scye: +1.5cm"
                className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 font-medium text-body-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setPendingMeasurement(null)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const finalLabel = measureLabelInput.trim() || pendingMeasurement.label
                  if (editingMeasureIndex !== null) {
                    const updated = [...measurementsList]
                    updated[editingMeasureIndex] = { ...updated[editingMeasureIndex], label: finalLabel }
                    setMeasurementsList(updated)
                    redrawCanvas(strokesHistory, updated)
                  } else {
                    const updated = [...measurementsList, { ...pendingMeasurement, label: finalLabel }]
                    setMeasurementsList(updated)
                    redrawCanvas(strokesHistory, updated)
                  }
                  setPendingMeasurement(null)
                }}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 cursor-pointer"
              >
                Save Measurement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
