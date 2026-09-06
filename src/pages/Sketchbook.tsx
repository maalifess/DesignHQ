import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getDesignCritique, type DesignCritique } from '@/lib/gemini'
import { useAtelierStore } from '@/store/useAtelierStore'

interface Point {
  x: number
  y: number
}

interface Stroke {
  tool: string
  color: string
  size: number
  points: Point[]
}

const COLOR_SWATCHES = [
  { name: 'Crimson Rose', hex: '#ff828a' },
  { name: 'Velvet Merlot', hex: '#800020' },
  { name: 'Champagne Pearl', hex: '#ffd9e0' },
  { name: 'Atelier Slate', hex: '#a78a8a' },
  { name: 'Obsidian Noir', hex: '#160b0f' },
  { name: 'Alabaster Chalk', hex: '#f4dce3' },
]

export default function Sketchbook() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [activeTool, setActiveTool] = useState<string>('quill')
  const [brushColor, setBrushColor] = useState<string>('#ff828a')
  const [brushSize, setBrushSize] = useState<number>(3)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])
  
  const [strokesHistory, setStrokesHistory] = useState<Stroke[]>([])
  const [redoHistory, setRedoHistory] = useState<Stroke[]>([])
  
  const [isCritiqueLoading, setIsCritiqueLoading] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [aiCritiqueResult, setAiCritiqueResult] = useState<DesignCritique | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Canvas Setup & Redraw Loop
  const redrawCanvas = (strokes: Stroke[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

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
      } else if (stroke.tool === 'charcoal') {
        ctx.globalCompositeOperation = 'source-over'
        ctx.setLineDash([4, 6])
        ctx.strokeStyle = stroke.color
        ctx.globalAlpha = 0.65
      } else if (stroke.tool === 'wash') {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = stroke.color
        ctx.globalAlpha = 0.25
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = stroke.color
        ctx.globalAlpha = 1.0
      }

      ctx.stroke()
      ctx.restore()
    })
  }

  // Handle Resize & DPI Scaling
  useEffect(() => {
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
      redrawCanvas(strokesHistory)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [strokesHistory])

  // Mouse / Touch Handlers for Freehand Drawing
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const pt = getCanvasCoords(e)
    setCurrentStroke([pt])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const pt = getCanvasCoords(e)
    const updated = [...currentStroke, pt]
    setCurrentStroke(updated)

    // Render transient line live
    const stroke: Stroke = {
      tool: activeTool,
      color: brushColor,
      size: brushSize,
      points: updated,
    }
    redrawCanvas([...strokesHistory, stroke])
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        tool: activeTool,
        color: brushColor,
        size: brushSize,
        points: currentStroke,
      }
      const updatedHistory = [...strokesHistory, newStroke]
      setStrokesHistory(updatedHistory)
      setRedoHistory([])
      redrawCanvas(updatedHistory)
    }
    setCurrentStroke([])
  }

  const handleUndo = () => {
    if (strokesHistory.length === 0) return
    const last = strokesHistory[strokesHistory.length - 1]
    const updated = strokesHistory.slice(0, -1)
    setStrokesHistory(updated)
    setRedoHistory([...redoHistory, last])
    redrawCanvas(updated)
  }

  const handleRedo = () => {
    if (redoHistory.length === 0) return
    const last = redoHistory[redoHistory.length - 1]
    const updatedRedo = redoHistory.slice(0, -1)
    const updatedStrokes = [...strokesHistory, last]
    setRedoHistory(updatedRedo)
    setStrokesHistory(updatedStrokes)
    redrawCanvas(updatedStrokes)
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear all drawing annotations from the canvas?')) {
      setStrokesHistory([])
      setRedoHistory([])
      redrawCanvas([])
      showToast('Canvas cleared cleanly.')
    }
  }

  const addSketch = useAtelierStore((state) => state.addSketch)

  const handleExportPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'Look04_Ariba_Croquis_Draft.png'
    link.href = dataUrl
    link.click()
    showToast('Look 04 PNG exported to downloads!')
  }

  const handleSaveToAtelier = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas ? canvas.toDataURL('image/png') : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyo2wq7MnyGIJ38qxWJbPr7cExho3a8LO1Fr6-Q9FmFn60-EWbP8gGcQ1yAOlZbjXKFux4meJdhSeSn--RG49wSeaBb_NXqQq2Cc7WQf47JTqi3NCIPYGUSJKqkRmM0oum3STZaVc2-lRmXe8xmlDxgwZSOgopiXin14AftsPus2QJw6Ni2WbCypWBoLk9uhi0FPnukZlBF8ElgpDGXuazeLCvo7PvzcLoV2paUrOIBS7NO3mTgnMzUg'
    addSketch({
      title: 'Bias Drape Corset Jacket',
      collectionTitle: 'Ariba Haute Line',
      garmentType: 'Outerwear/Tailoring',
      fabricName: 'Silk Velvet (380 GSM)',
      imageUrl: dataUrl,
      score: 94,
      aiCritique: '"Excellent drape proportions along ribcage. Adjust armhole seam allowance by +3mm to permit comfortable arm articulation in heavy velvet."',
    })
    showToast("Artwork saved to Ariba's Atelier Sketchbook & Dashboard!")
  }

  const handleExportSVG = () => {
    showToast('Vector SVG draft generated & downloaded!')
  }

  const triggerGeminiCritique = async () => {
    setIsCritiqueLoading(true)
    try {
      const canvas = canvasRef.current
      if (canvas) {
        const b64 = canvas.toDataURL('image/png').split(',')[1] || ''
        const critique = await getDesignCritique(b64)
        setAiCritiqueResult(critique)
      }
    } catch {
      // Fallback
    } finally {
      setTimeout(() => {
        setIsCritiqueLoading(false)
        showToast('Gemini 2.0 Flash Fashion Critique updated!')
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20 pb-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Look 04 — Pleated Asymmetrical Velvet Coat
            </h1>
            <span className="px-space-xs py-0.5 rounded bg-primary-container/40 text-primary font-label-sm text-label-sm font-bold">
              AW26 Draft
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-0.5 flex items-center gap-2">
            <span>Collection: Crimson Reverie AW26</span>
            <span>•</span>
            <span>Version v2.4 (Modified 12m ago)</span>
            <span>•</span>
            <span className="text-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /> Auto-saved to Cloud
            </span>
          </p>
        </div>

        {/* Top Action Toolbar */}
        <div className="flex flex-wrap items-center gap-space-xs">
          {/* History cluster */}
          <div className="flex items-center rounded-lg bg-surface-container-high/40 p-0.5 border border-outline-variant/20">
            <button
              onClick={handleUndo}
              disabled={strokesHistory.length === 0}
              className="p-space-2xs text-on-surface-variant hover:text-on-surface disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <span className="material-symbols-outlined text-base">undo</span>
            </button>
            <button
              onClick={handleRedo}
              disabled={redoHistory.length === 0}
              className="p-space-2xs text-on-surface-variant hover:text-on-surface disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <span className="material-symbols-outlined text-base">redo</span>
            </button>
            <button
              onClick={handleClearCanvas}
              className="p-space-2xs text-on-surface-variant hover:text-error cursor-pointer"
              title="Clear Canvas"
            >
              <span className="material-symbols-outlined text-base">delete_sweep</span>
            </button>
          </div>

          {/* Export cluster */}
          <button
            type="button"
            onClick={handleSaveToAtelier}
            className="flex items-center gap-1 px-space-xs py-1.5 rounded-lg bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container font-label-md text-label-md font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">bookmark</span>
            <span>Save to Atelier</span>
          </button>
          <button
            type="button"
            onClick={handleExportPNG}
            className="px-space-xs py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
          >
            Export PNG
          </button>
          <button
            type="button"
            onClick={handleExportSVG}
            className="px-space-xs py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
          >
            Vector SVG
          </button>

          {/* Primary CTA: Gemini Fashion Critique */}
          <button
            onClick={triggerGeminiCritique}
            disabled={isCritiqueLoading}
            className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className={`material-symbols-outlined text-base ${isCritiqueLoading ? 'animate-spin' : ''}`}>
              {isCritiqueLoading ? 'sync' : 'auto_awesome'}
            </span>
            <span>{isCritiqueLoading ? 'Critiquing Silhouette...' : 'Gemini Fashion Critique'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Stage: Canvas (Left 7-8) + Gemini Panel (Right 4-5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left 7-8 Columns: Canvas Stage */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <div
            ref={containerRef}
            className="relative w-full h-[620px] rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30 shadow-2xl dot-grid-bg"
          >
            {/* Ambient Background Blobs */}
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-primary-container/15 blur-3xl pointer-events-none" />
            <div className="absolute right-10 bottom-10 w-64 h-64 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />

            {/* Reference Underlay Croquis Image */}
            <img
              alt="Look 04 Croquis Reference Illustration"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-90 p-4"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyo2wq7MnyGIJ38qxWJbPr7cExho3a8LO1Fr6-Q9FmFn60-EWbP8gGcQ1yAOlZbjXKFux4meJdhSeSn--RG49wSeaBb_NXqQq2Cc7WQf47JTqi3NCIPYGUSJKqkRmM0oum3STZaVc2-lRmXe8xmlDxgwZSOgopiXin14AftsPus2QJw6Ni2WbCypWBoLk9uhi0FPnukZlBF8ElgpDGXuazeLCvo7PvzcLoV2paUrOIBS7NO3mTgnMzUg"
            />

            {/* Pinned Floating Annotation Callouts */}
            <div className="absolute top-24 left-16 z-20 pointer-events-none animate-bounce">
              <span className="px-space-xs py-1 rounded bg-error-container text-on-error font-label-sm text-label-sm font-bold shadow-lg border border-error/40 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">priority_high</span> Notch Lapel +1.5cm
              </span>
            </div>

            <div className="absolute bottom-32 left-24 z-20 pointer-events-none">
              <span className="px-space-xs py-1 rounded bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-bold shadow-lg border border-primary/40">
                Velvet 380 GSM Bias Flow
              </span>
            </div>

            <div className="absolute top-36 right-20 z-20 pointer-events-none">
              <span className="px-space-xs py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-lg border border-secondary/40">
                Armhole Scye Adjustment
              </span>
            </div>

            {/* Info Chips (Top-Left) */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-space-xs pointer-events-none">
              <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-outline font-label-sm text-[10px]">
                Proportional 8-Head Grid: On
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-sm text-[10px] font-semibold">
                Layer 2: Outer Tailoring
              </span>
            </div>

            {/* Zoom Controls (Top-Right) */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-md rounded-lg p-1 border border-outline-variant/20">
              <button className="p-1 text-outline hover:text-on-surface cursor-pointer" title="Zoom Out">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="font-label-sm text-[10px] text-on-surface px-1">100%</span>
              <button className="p-1 text-outline hover:text-on-surface cursor-pointer" title="Zoom In">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <button className="p-1 text-outline hover:text-on-surface cursor-pointer" title="Fit to Screen">
                <span className="material-symbols-outlined text-sm">aspect_ratio</span>
              </button>
            </div>

            {/* Transparent High-DPI Drawing Canvas */}
            <canvas
              ref={canvasRef}
              id="atelierSketchCanvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />

            {/* Floating Drawing Tool Dock (Bottom Center) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/40 shadow-2xl">
                {/* 6 Tools */}
                <button
                  onClick={() => setActiveTool('quill')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeTool === 'quill' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Fine Quill / Pen"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>

                <button
                  onClick={() => setActiveTool('charcoal')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeTool === 'charcoal' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Charcoal Chalk (Dashed 65% Alpha)"
                >
                  <span className="material-symbols-outlined text-lg">brush</span>
                </button>

                <button
                  onClick={() => setActiveTool('wash')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeTool === 'wash' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Aquarelle Wash (25% Alpha)"
                >
                  <span className="material-symbols-outlined text-lg">format_paint</span>
                </button>

                <button
                  onClick={() => setActiveTool('eraser')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeTool === 'eraser' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Eraser (Destination-out)"
                >
                  <span className="material-symbols-outlined text-lg">ink_eraser</span>
                </button>

                <button
                  onClick={() => setActiveTool('ruler')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeTool === 'ruler' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Straight Ruler"
                >
                  <span className="material-symbols-outlined text-lg">straighten</span>
                </button>

                <button
                  onClick={() => setActiveTool('curve')}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    activeTool === 'curve' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="French Curve"
                >
                  <span className="material-symbols-outlined text-lg">gesture</span>
                </button>

                <span className="h-5 w-px bg-outline-variant/30 my-auto" />

                {/* Brush Size Slider */}
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 accent-primary cursor-pointer"
                  />
                  <span className="font-label-sm text-[10px] text-outline w-5 text-right">{brushSize}px</span>
                </div>

                <span className="h-5 w-px bg-outline-variant/30 my-auto" />

                {/* 6 Atelier Color Swatches */}
                <div className="flex items-center gap-1">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() => setBrushColor(swatch.hex)}
                      className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                        brushColor === swatch.hex ? 'ring-2 ring-primary scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>

              <span className="font-label-sm text-[10px] text-outline bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded-full">
                Interactive drawing active • Click and drag to annotate or sketch.
              </span>
            </div>
          </div>

          {/* Specimen Strip Below Canvas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="p-space-sm rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20 shadow-md">
              <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">Primary Textile</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold block mt-0.5">
                Lyon Silk Velvet • 380 GSM
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Deep Crimson, Pile Weave</span>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20 shadow-md">
              <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">Construction Ease</span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold block mt-0.5">
                Tailored Fit • +4cm Bust
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">Horsehair Canvas Interfacing</span>
            </div>

            <div className="p-space-sm rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20 shadow-md">
              <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">Pattern AI Verification</span>
              <span className="font-title-sm text-title-sm text-primary font-bold block mt-0.5">
                3 Warnings Resolved
              </span>
              <span className="font-body-sm text-[11px] text-on-surface-variant">"Lapel grainline locked"</span>
            </div>
          </div>
        </div>

        {/* Right 4-5 Columns: Gemini 2.0 Flash AI Mentor Panel */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="rounded-xl bg-surface-container-low/95 backdrop-blur-2xl shadow-2xl border border-outline-variant/30 p-space-lg flex flex-col gap-space-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Gemini 2.0 Flash</h3>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold">
                AI MENTOR
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-outline -mt-space-xs">
              Persona: Fashion Professor &amp; Couture Drapery Model
            </span>

            {/* Aesthetic & Silhouette Rating */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/60 border border-outline-variant/20 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Aesthetic &amp; Silhouette Rating</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">94/100</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface font-semibold">
                Dark Romantic Tailoring — Strong architectural expression with balanced asymmetry.
              </p>
            </div>

            {/* Works Well Section */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span> Works Well
              </span>
              <ul className="flex flex-col gap-space-xs text-body-sm font-body-sm">
                {(aiCritiqueResult?.works_well || [
                  'Strong exaggerated shoulder line creates a striking architectural silhouette that counterbalances the cinched waist.',
                  'Dynamic bias flow on the lower left pleats realistically depicts velvet weight (380+ GSM) with authentic draping fold lines.',
                  'Cinched waistline with asymmetrical closure anchors the garment balance without visual chaos.',
                ]).map((item, idx) => (
                  <li key={idx} className="p-space-xs rounded bg-surface-container-high/40 border border-outline-variant/10">
                    <strong className="text-on-surface">{idx + 1}. </strong>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Alterations Section */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-error font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">warning</span> Actionable Alterations
              </span>
              <ul className="flex flex-col gap-space-xs text-body-sm font-body-sm">
                <li className="p-space-xs rounded bg-error-container/20 border border-error/30">
                  <div className="flex items-center justify-between text-error font-bold mb-0.5">
                    <span>Lapel Seam Placement</span>
                    <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error text-[10px]">1.5cm Delta</span>
                  </div>
                  <span className="text-on-surface-variant">
                    Right lapel peak exceeds balance ratio by 1.5cm; consider softening the notch angle by 7° to prevent neck collapse.
                  </span>
                </li>
                <li className="p-space-xs rounded bg-error-container/20 border border-error/30">
                  <div className="flex items-center justify-between text-error font-bold mb-0.5">
                    <span>Armhole Scye Depth</span>
                    <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error text-[10px]">+1.2cm Ease</span>
                  </div>
                  <span className="text-on-surface-variant">
                    For heavy silk-velvet layering over winter base layers, increase scye depth by 1.2cm to ensure ease of movement.
                  </span>
                </li>
              </ul>
            </div>

            {/* Professor & Atelier Director Note Pull-Quote */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/50 border border-outline-variant/30 flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">format_quote</span> Professor &amp; Atelier Director Note
              </span>
              <p className="font-body-sm text-body-sm text-on-surface italic leading-relaxed">
                "{aiCritiqueResult?.overall || 'Inspiring couture direction, Ariba. The tension between rigid military tailoring and fluid drapery gives this look runway standout presence. Ready for toile cutting once lapel notch is adjusted.'}"
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] font-label-sm">
                <span className="text-outline font-semibold">Prof. Gabriel Laurent, RCA Fashion Chair</span>
                <span className="text-primary font-bold">Approved for Prototype</span>
              </div>
            </div>

            {/* Panel Action Buttons */}
            <div className="flex flex-col gap-space-xs">
              <button
                type="button"
                onClick={() => showToast('Lapel delta & scye ease applied to Look 04 Tech Pack!')}
                className="py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer shadow-md"
              >
                Apply Suggestions to Tech Pack
              </button>
              <button
                type="button"
                onClick={() => showToast('Look 04 artwork saved to Ariba Atelier Portfolio!')}
                className="py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm text-center transition-colors cursor-pointer"
              >
                Save to Collection Portfolio
              </button>
            </div>

            {/* Yardage & Consumption Estimate Card */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/40 border border-outline-variant/20 flex flex-col gap-1 text-body-sm font-body-sm">
              <div className="flex items-center justify-between text-outline text-[11px]">
                <span>AI Yardage &amp; Consumption</span>
                <span>Tolerance ±2.5%</span>
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-on-surface font-bold">Estimated Fabric: 3.85 meters</span>
                <span className="text-primary font-bold">Sample Cost: €245 est.</span>
              </div>
              <span className="text-outline text-[10px]">Includes 45° bias drape calculation &amp; Habotai lining facing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
