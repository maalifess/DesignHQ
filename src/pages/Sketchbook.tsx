import React, { useEffect, useRef, useState } from 'react'
import { Canvas, PencilBrush, FabricText, Circle, Rect, Triangle, Line } from 'fabric'
import { useSketchStore } from '@/store/useSketchStore'
import { useSketch } from '@/hooks/useSketch'
import { useAppStore } from '@/store/useAppStore'
import { getDesignCritique, type DesignCritique } from '@/lib/gemini'

const SWATCH_COLORS = [
  { hex: '#ff828a', name: 'Crimson Rose' },
  { hex: '#800020', name: 'Velvet Merlot' },
  { hex: '#ffd9e0', name: 'Champagne Pearl' },
  { hex: '#a78a8a', name: 'Atelier Slate' },
  { hex: '#160b0f', name: 'Obsidian Noir' },
  { hex: '#f4dce3', name: 'Alabaster Chalk' },
]

export default function Sketchbook() {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  const {
    activeTool, setActiveTool,
    strokeColor, setStrokeColor,
    strokeWidth, setStrokeWidth,
    pushUndo, undo, redo,
    setDirty, setLastSaved,
    addVersion,
  } = useSketchStore()
  const { sketches, createSketch, saveSketch } = useSketch()
  const { addToast } = useAppStore()

  const [activeSketchId, setActiveSketchId] = useState<string | null>(null)
  const [critique, setCritique] = useState<DesignCritique | null>(null)
  const [gettingCritique, setGettingCritique] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasEl.current) return
    const container = canvasEl.current.parentElement
    const width = container?.clientWidth || 700
    const height = container?.clientHeight || 680

    const canvas = new Canvas(canvasEl.current, {
      isDrawingMode: true,
      width,
      height,
      backgroundColor: 'transparent',
    })
    setFabricCanvas(canvas)

    canvas.on('object:added', () => { pushUndo(JSON.stringify(canvas.toJSON())); setDirty(true) })
    canvas.on('object:modified', () => { pushUndo(JSON.stringify(canvas.toJSON())); setDirty(true) })
    canvas.on('object:removed', () => { pushUndo(JSON.stringify(canvas.toJSON())); setDirty(true) })

    // Init sketch
    ;(async () => {
      if (sketches.length > 0) {
        setActiveSketchId(sketches[0].id)
        if (sketches[0].canvas_data) {
          await canvas.loadFromJSON(sketches[0].canvas_data)
          canvas.renderAll()
        }
      } else {
        const sketch = await createSketch('Look 04 — Pleated Asymmetrical Velvet Coat')
        if (sketch) setActiveSketchId(sketch.id)
      }
    })()

    return () => {
      canvas.dispose()
    }
  }, [])

  // Update brush settings
  useEffect(() => {
    if (!fabricCanvas) return
    const brush = new PencilBrush(fabricCanvas)
    brush.color = strokeColor
    brush.width = strokeWidth

    if (activeTool === 'pen' || activeTool === 'charcoal' || activeTool === 'wash') {
      fabricCanvas.isDrawingMode = true
      if (activeTool === 'wash') brush.width = strokeWidth * 2.5
      fabricCanvas.freeDrawingBrush = brush
    } else if (activeTool === 'eraser') {
      fabricCanvas.isDrawingMode = true
      brush.color = '#1c1014'
      brush.width = strokeWidth * 4
      fabricCanvas.freeDrawingBrush = brush
    } else {
      fabricCanvas.isDrawingMode = false
    }

    if (activeTool === 'text') {
      const handler = (opt: any) => {
        const pointer = fabricCanvas.getScenePoint(opt.e)
        const text = new FabricText('Atelier Annotation', {
          left: pointer.x, top: pointer.y,
          fontFamily: 'Plus Jakarta Sans',
          fill: strokeColor,
          fontSize: 16,
        })
        fabricCanvas.add(text)
        fabricCanvas.setActiveObject(text)
        fabricCanvas.off('mouse:down', handler)
      }
      fabricCanvas.on('mouse:down', handler)
    }
  }, [activeTool, strokeColor, strokeWidth, fabricCanvas])

  const addShape = (type: string) => {
    if (!fabricCanvas) return
    const opts = { left: 200, top: 200, stroke: strokeColor, strokeWidth, fill: 'transparent' }
    let shape: any
    if (type === 'rect') shape = new Rect({ ...opts, width: 140, height: 90 })
    if (type === 'circle') shape = new Circle({ ...opts, radius: 55 })
    if (type === 'triangle') shape = new Triangle({ ...opts, width: 110, height: 110 })
    if (type === 'line') shape = new Line([0, 0, 160, 0], { ...opts, x1: 50, y1: 200, x2: 210, y2: 200 })
    if (shape) { fabricCanvas.add(shape); fabricCanvas.setActiveObject(shape) }
  }

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId)
    if (['rect', 'circle', 'triangle', 'line'].includes(toolId)) addShape(toolId)
  }

  const handleUndo = async () => {
    const prev = undo()
    if (prev && fabricCanvas) {
      await fabricCanvas.loadFromJSON(JSON.parse(prev))
      fabricCanvas.renderAll()
    }
  }

  const handleRedo = async () => {
    const next = redo()
    if (next && fabricCanvas) {
      await fabricCanvas.loadFromJSON(JSON.parse(next))
      fabricCanvas.renderAll()
    }
  }

  const handleSave = async () => {
    if (!fabricCanvas || !activeSketchId) return
    const dataUrl = fabricCanvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.5 } as any)
    const canvasJSON = fabricCanvas.toJSON()
    await saveSketch(activeSketchId, canvasJSON, dataUrl, true)
    addVersion(JSON.stringify(canvasJSON))
    setLastSaved(new Date())
    addToast('Sketch saved to Atelier Cloud', 'success')
  }

  const handleGetCritique = async () => {
    if (!fabricCanvas) return
    setGettingCritique(true)
    try {
      const dataUrl = fabricCanvas.toDataURL({ format: 'png', quality: 0.9, multiplier: 1 } as any)
      const base64 = dataUrl.split(',')[1] || ''
      const result = await getDesignCritique(base64)
      setCritique(result)
      addToast('Gemini AI Critique refreshed with latest canvas artwork!', 'success')
    } catch {
      addToast('Critique failed. Check API configuration.', 'error')
    }
    setGettingCritique(false)
  }

  const handleClearCanvas = () => {
    if (!fabricCanvas) return
    fabricCanvas.clear()
    fabricCanvas.renderAll()
    addToast('Canvas cleared', 'info')
  }

  const handleExportPng = () => {
    if (!fabricCanvas) return
    const dataUrl = fabricCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 } as any)
    const link = document.createElement('a')
    link.download = 'look_04_sketch.png'
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col gap-space-md w-full">
      {/* Top Workspace Sub-Header & Action Control Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl border border-outline-variant/20">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">draw</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Look 04 — Pleated Asymmetrical Velvet Coat
                </span>
                <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                  AW26 Draft
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-outline flex-wrap">
                <span className="text-on-surface-variant font-medium">Collection: Crimson Reverie AW26</span>
                <span>•</span>
                <span>Version: v2.4 (Modified 12m ago)</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-primary-fixed-dim">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Auto-saved to Cloud
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Operations Toolbar */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <div className="flex items-center bg-surface-container-high/50 p-1 rounded-lg">
            <button
              onClick={handleUndo}
              className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded transition-all"
              title="Undo (Ctrl+Z)"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">undo</span>
            </button>
            <button
              onClick={handleRedo}
              className="p-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded transition-all"
              title="Redo (Ctrl+Y)"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">redo</span>
            </button>
            <div className="w-px h-4 bg-outline-variant mx-1"></div>
            <button
              onClick={handleClearCanvas}
              className="p-space-xs text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded transition-all"
              title="Clear Canvas"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">delete_sweep</span>
            </button>
          </div>

          <div className="flex items-center bg-surface-container-high/50 p-1 rounded-lg">
            <button
              onClick={handleExportPng}
              className="px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded text-label-md font-label-md flex items-center gap-1.5 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-base">image</span>
              <span>Export PNG</span>
            </button>
            <button
              onClick={handleSave}
              className="px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded text-label-md font-label-md flex items-center gap-1.5 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-base">cloud_upload</span>
              <span>Save Cloud</span>
            </button>
          </div>

          <button
            onClick={handleGetCritique}
            disabled={gettingCritique}
            className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_25px_rgba(128,0,32,0.65)] disabled:opacity-50"
            type="button"
          >
            <span className={`material-symbols-outlined text-base ${gettingCritique ? 'animate-spin' : ''}`}>
              {gettingCritique ? 'sync' : 'auto_awesome'}
            </span>
            <span className="font-semibold tracking-wide">Gemini Fashion Critique</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Left (Sketchbook Atelier) & Right (Gemini Critique Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* Center-Left: Interactive Fashion Drawing Canvas Area (7/8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-sm relative">
          {/* Canvas Stage Container */}
          <div className="relative w-full rounded-2xl bg-surface-container-lowest/95 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[720px] select-none border border-outline-variant/20">
            {/* Subtle Couture Dot Backdrop Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffb3b5 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            ></div>

            {/* Ambient Glows */}
            <div className="absolute w-96 h-96 rounded-full bg-primary-container/20 filter blur-3xl pointer-events-none -top-12 -left-12"></div>
            <div className="absolute w-80 h-80 rounded-full bg-secondary-container/20 filter blur-3xl pointer-events-none -bottom-16 right-0"></div>

            {/* Garment & Croquis Technical Layer */}
            <div className="relative w-full h-[720px] flex items-center justify-center">
              {/* Reference Underlay Model Figure with Vector Fashion Sketch */}
              <div className="absolute inset-0 flex items-center justify-center p-space-md pointer-events-none">
                <div className="relative h-full aspect-[9/16] flex items-center justify-center">
                  {/* Clean SVG Fashion Croquis Illustration */}
                  <svg className="w-full h-full text-outline-variant/40 opacity-75 filter drop-shadow-[0_12px_36px_rgba(0,0,0,0.8)]" viewBox="0 0 400 700" fill="none">
                    {/* Head & Neck */}
                    <ellipse cx="200" cy="80" rx="22" ry="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="200" y1="108" x2="200" y2="135" stroke="currentColor" strokeWidth="1.5" />
                    {/* Shoulders */}
                    <path d="M 130 145 L 200 135 L 270 145" stroke="#ffb3b5" strokeWidth="2.5" />
                    {/* Bust & Corset waist */}
                    <path d="M 140 145 C 150 200, 160 220, 175 270 M 260 145 C 250 200, 240 220, 225 270" stroke="#ffb3b5" strokeWidth="2" />
                    <path d="M 175 270 L 225 270" stroke="#ffb3b5" strokeWidth="2" strokeDasharray="2 2" />
                    {/* Tailored Coat Hem Outline */}
                    <path d="M 175 270 Q 120 400 100 560 L 290 590 Q 240 400 225 270 Z" fill="#800020" fillOpacity="0.25" stroke="#ff828a" strokeWidth="2.5" />
                    {/* Pleated cascading Hem */}
                    <path d="M 100 560 L 115 620 L 140 570 L 165 630 L 190 575 L 220 625 L 250 580 L 290 590" stroke="#ffd9e0" strokeWidth="2" strokeLinecap="round" />
                    {/* Proportional Grid Guides */}
                    <line x1="50" y1="80" x2="350" y2="80" stroke="#584141" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="50" y1="145" x2="350" y2="145" stroke="#584141" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="50" y1="270" x2="350" y2="270" stroke="#584141" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="50" y1="420" x2="350" y2="420" stroke="#584141" strokeWidth="0.5" strokeDasharray="4 4" />
                    <line x1="50" y1="570" x2="350" y2="570" stroke="#584141" strokeWidth="0.5" strokeDasharray="4 4" />
                  </svg>

                  {/* Couture Technical Callout Badges */}
                  <div className="absolute top-[26%] left-0 sm:-left-6 bg-surface-container-high/90 backdrop-blur-md px-space-xs py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce border border-primary/30">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Notch Lapel +1.5cm</span>
                  </div>
                  <div className="absolute bottom-[24%] right-0 sm:-right-4 bg-surface-container-high/90 backdrop-blur-md px-space-xs py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-tertiary/30">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Velvet 380 GSM Bias Flow</span>
                  </div>
                  <div className="absolute top-[48%] left-4 bg-surface-container-high/90 backdrop-blur-md px-space-xs py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-secondary/30">
                    <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">Armhole Scye Adjustment</span>
                  </div>
                </div>
              </div>

              {/* Freehand Drawing Canvas Overlay */}
              <canvas ref={canvasEl} className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none" />

              {/* Floating Atelier Studio Drawing Toolbar */}
              <div className="absolute bottom-space-md left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-space-xs max-w-full px-space-xs">
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container-high/95 backdrop-blur-2xl shadow-2xl border border-outline-variant/30 flex-wrap justify-center">
                  {/* Tool Switchers */}
                  <button
                    onClick={() => handleToolClick('pen')}
                    className={`p-space-xs rounded-xl transition-all flex items-center justify-center ${
                      activeTool === 'pen' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                    title="Fine Quill & Pen"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                  <button
                    onClick={() => handleToolClick('charcoal')}
                    className={`p-space-xs rounded-xl transition-all flex items-center justify-center ${
                      activeTool === 'charcoal' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                    title="Charcoal Chalk"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">brush</span>
                  </button>
                  <button
                    onClick={() => handleToolClick('wash')}
                    className={`p-space-xs rounded-xl transition-all flex items-center justify-center ${
                      activeTool === 'wash' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                    title="Aquarelle Wash"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">format_paint</span>
                  </button>
                  <button
                    onClick={() => handleToolClick('eraser')}
                    className={`p-space-xs rounded-xl transition-all flex items-center justify-center ${
                      activeTool === 'eraser' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                    title="Eraser"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">ink_eraser</span>
                  </button>
                  <button
                    onClick={() => handleToolClick('line')}
                    className={`p-space-xs rounded-xl transition-all flex items-center justify-center ${
                      activeTool === 'line' ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                    title="Straight Ruler"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">straighten</span>
                  </button>

                  <div className="w-px h-6 bg-outline-variant/60 mx-1"></div>

                  {/* Stroke Width Slider Control */}
                  <div className="flex items-center gap-space-xs px-space-xs">
                    <span className="material-symbols-outlined text-xs text-outline">line_weight</span>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-20 accent-primary bg-surface-container-low cursor-pointer"
                    />
                    <span className="font-label-sm text-label-sm text-outline w-6 text-right">{strokeWidth}px</span>
                  </div>

                  <div className="w-px h-6 bg-outline-variant/60 mx-1"></div>

                  {/* Curated Fashion Atelier Swatches */}
                  <div className="flex items-center gap-1 px-space-xs">
                    {SWATCH_COLORS.map(({ hex, name }) => (
                      <button
                        key={hex}
                        onClick={() => setStrokeColor(hex)}
                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                          strokeColor === hex ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest scale-110' : ''
                        }`}
                        style={{ backgroundColor: hex }}
                        title={name}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                {/* Hint Footer Pill */}
                <div className="flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-low/80 backdrop-blur-md shadow-md border border-outline-variant/20">
                  <span className="material-symbols-outlined text-xs text-primary">touch_app</span>
                  <span className="font-label-sm text-label-sm text-outline">Interactive drawing active • Click and drag to annotate or sketch</span>
                </div>
              </div>

              {/* Top Floating Canvas Info Chips */}
              <div className="absolute top-space-md left-space-md z-20 flex items-center gap-space-xs flex-wrap">
                <span className="px-space-sm py-1 rounded-lg bg-surface-container-high/80 backdrop-blur-md text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-sm text-primary">grid_3x3</span>
                  <span>Proportional 8-Head Grid: On</span>
                </span>
                <span className="px-space-sm py-1 rounded-lg bg-surface-container-high/80 backdrop-blur-md text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-sm">layers</span>
                  <span>Layer 2: Outer Tailoring</span>
                </span>
              </div>

              {/* Top Right Zoom Controls */}
              <div className="absolute top-space-md right-space-md z-20 flex items-center bg-surface-container-high/80 backdrop-blur-md rounded-lg p-0.5 border border-outline-variant/20">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Zoom Out"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">remove</span>
                </button>
                <span className="px-2 font-label-sm text-label-sm text-on-surface font-semibold">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Zoom In"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Fit to Screen"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">crop_free</span>
                </button>
              </div>
            </div>
          </div>

          {/* Specimen Technical Fabric & Specs Matrix Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
            <div className="p-space-md rounded-xl bg-surface-container-low/70 backdrop-blur-md flex items-center gap-space-sm shadow-md border border-outline-variant/20">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">texture</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Primary Textile</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Lyon Silk Velvet • 380 GSM</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Deep Crimson • Pile Weave</span>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low/70 backdrop-blur-md flex items-center gap-space-sm shadow-md border border-outline-variant/20">
              <div className="w-10 h-10 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">straighten</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Construction Ease</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Tailored Fit • +4cm Bust</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Horsehair Canvas Interfacing</span>
              </div>
            </div>

            <div className="p-space-md rounded-xl bg-surface-container-low/70 backdrop-blur-md flex items-center gap-space-sm shadow-md border border-outline-variant/20">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container/40 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-2xl">psychology</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Pattern AI Verification</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">3 Warnings Resolved</span>
                <span className="font-body-sm text-body-sm text-primary-fixed-dim">Lapel grainline locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Design Mentor Panel (Google Gemini 2.0 Fashion Critique) (5/4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-space-md">
          {/* Gemini 2.0 Flash Fashion Critique Card */}
          <div className="p-space-lg rounded-2xl bg-surface-container-low/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-space-md relative overflow-hidden border border-outline-variant/20">
            {/* Inset Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full filter blur-3xl pointer-events-none"></div>

            {/* AI Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center text-primary-fixed shadow-md">
                  <span className="material-symbols-outlined text-lg animate-pulse">auto_awesome</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">Gemini 2.0 Flash</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary">AI MENTOR</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">Fashion Professor & Couture Drapery Model</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer text-xl" title="AI Model Info">
                info
              </span>
            </div>

            {/* Overall Aesthetic Rating & Silhouette Score Bar */}
            <div className="p-space-md rounded-xl bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                  Aesthetic & Silhouette Rating
                </span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  94<span className="text-body-sm text-outline font-normal">/100</span>
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                <span className="font-semibold text-primary-fixed">Dark Romantic Tailoring</span> — Strong architectural expression with balanced asymmetry.
              </p>
              {/* Progress Fill Bar */}
              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-secondary-container via-primary-container to-primary transition-all duration-500"
                  style={{ width: '94%' }}
                ></div>
              </div>
            </div>

            {/* Section: Works Well (Checkmarks) */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-primary-fixed-dim">
                <span className="material-symbols-outlined text-base">verified</span>
                <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Works Well</span>
              </div>
              <div className="space-y-2">
                {(critique?.works_well || [
                  { title: 'Proportions & Shoulder Arch', desc: 'Strong exaggerated shoulder line creates a striking architectural silhouette that counterbalances the cinched waist.' },
                  { title: 'Drape & Movement Physics', desc: 'Dynamic bias flow on the lower left pleats realistically depicts velvet weight (380+ GSM) with authentic draping fold lines.' },
                  { title: 'Focal Point Anchor', desc: 'Cinched waistline with asymmetrical closure anchors the garment balance without visual chaos.' },
                ]).map((item: any, i: number) => (
                  <div key={i} className="p-space-sm rounded-lg bg-surface-container-high/40 flex items-start gap-space-xs border border-outline-variant/10">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">check_circle</span>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-on-surface font-medium">
                        {typeof item === 'string' ? item : item.title}
                      </span>
                      {typeof item === 'object' && item.desc && (
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{item.desc}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Actionable Improvements */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-secondary">
                <span className="material-symbols-outlined text-base">warning</span>
                <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Actionable Alterations</span>
              </div>
              <div className="space-y-2">
                {(critique?.improvements || [
                  { title: 'Lapel Seam Placement', tag: '1.5cm Delta', desc: 'Right lapel peak exceeds balance ratio by 1.5cm; consider softening the notch angle by 7° to prevent neck collapse.' },
                  { title: 'Armhole Scye Depth', tag: '+1.2cm Ease', desc: 'For heavy silk-velvet layering over winter base layers, increase scye depth by 1.2cm to ensure ease of movement.' },
                ]).map((item: any, i: number) => (
                  <div key={i} className="p-space-sm rounded-lg bg-secondary-container/20 flex items-start gap-space-xs border border-secondary-container/30">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5 shrink-0">error</span>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-title-sm text-title-sm text-on-surface font-medium">
                          {typeof item === 'string' ? item : item.title}
                        </span>
                        {item.tag && <span className="font-label-sm text-label-sm text-secondary font-bold">{item.tag}</span>}
                      </div>
                      {typeof item === 'object' && item.desc && (
                        <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{item.desc}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Atelier Director & Professor Summary Note */}
            <div className="p-space-md rounded-xl bg-gradient-to-br from-primary-container/40 to-surface-container-high/60 backdrop-blur-md flex flex-col gap-space-xs shadow-md border border-primary-container/30">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-base text-primary">format_quote</span>
                <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">Professor & Atelier Director Note</span>
              </div>
              <p className="font-headline-sm text-headline-sm italic text-primary-fixed-dim leading-snug font-headline-hero">
                "{critique?.overall || "Inspiring couture direction, Aria. The tension between rigid military tailoring and fluid drapery gives this look runway standout presence. Ready for toile cutting once lapel notch is adjusted."}"
              </p>
              <div className="flex items-center justify-between pt-space-xs mt-1 border-t border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-outline">Prof. Gabriel Laurent • RCA Fashion Chair</span>
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-xs">verified_user</span> Approved for Prototype
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-space-xs pt-space-2xs">
              <button
                onClick={() => addToast('Suggestions merged into Collection Tech Pack!', 'success')}
                className="w-full py-space-sm px-space-md rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(128,0,32,0.4)]"
                type="button"
              >
                <span className="material-symbols-outlined text-base">architecture</span>
                <span>Apply Suggestions to Tech Pack</span>
              </button>
              <button
                onClick={() => addToast('Saved to AW26 Haute Collection Portfolio', 'info')}
                className="w-full py-space-sm px-space-md rounded-lg bg-surface-container-high/70 hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm transition-all flex items-center justify-center gap-2 border border-outline-variant/20"
                type="button"
              >
                <span className="material-symbols-outlined text-base">bookmark_add</span>
                <span>Save to Collection Portfolio</span>
              </button>
            </div>
          </div>

          {/* AI Yardage & Consumption Card */}
          <div className="p-space-md rounded-xl bg-surface-container-low/70 backdrop-blur-md shadow-lg flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">calculate</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">AI Yardage & Consumption</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Tolerance: ±2.5%</span>
            </div>
            <div className="grid grid-cols-2 gap-space-xs">
              <div className="p-space-xs rounded-lg bg-surface-container-high/50 flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-outline">Estimated Fabric</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  3.85 <span className="text-body-sm font-normal text-outline">Meters</span>
                </span>
                <span className="font-label-sm text-label-sm text-primary">Includes 45° Bias Drape</span>
              </div>
              <div className="p-space-xs rounded-lg bg-surface-container-high/50 flex flex-col border border-outline-variant/10">
                <span className="font-label-sm text-label-sm text-outline">Sample Cost</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  €245 <span className="text-body-sm font-normal text-outline">Est.</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Silk Velvet + Habotai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
