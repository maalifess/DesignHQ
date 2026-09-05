import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, PencilBrush, FabricImage, FabricText, Circle, Rect, Triangle, Line } from 'fabric'
import {
  Pen, Eraser, Square, Circle as CircleIcon, Triangle as TriIcon, Minus,
  Type, MousePointer, Undo2, Redo2, Trash2, Save, Download, ZoomIn, ZoomOut,
  Layers, SlidersHorizontal, History, Sparkles, Loader2, X
} from 'lucide-react'
import { useSketchStore } from '@/store/useSketchStore'
import { useSketch } from '@/hooks/useSketch'
import { useAppStore } from '@/store/useAppStore'
import { getDesignCritique, type DesignCritique } from '@/lib/gemini'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'
import { Select } from '@/components/ui/Input'

const GARMENT_TYPES = [
  { value: '', label: 'Select type...' },
  { value: 'dress', label: 'Dress' },
  { value: 'skirt', label: 'Skirt' },
  { value: 'trousers', label: 'Trousers' },
  { value: 'coat', label: 'Coat' },
  { value: 'blouse', label: 'Blouse' },
  { value: 'suit', label: 'Suit' },
  { value: 'jumpsuit', label: 'Jumpsuit' },
  { value: 'top', label: 'Top' },
  { value: 'jacket', label: 'Jacket' },
  { value: 'other', label: 'Other' },
]

const SILHOUETTES = [
  { value: '', label: 'Select silhouette...' },
  { value: 'a-line', label: 'A-Line' },
  { value: 'bodycon', label: 'Bodycon' },
  { value: 'balloon', label: 'Balloon' },
  { value: 'straight', label: 'Straight' },
  { value: 'tailored', label: 'Tailored' },
  { value: 'flared', label: 'Flared' },
  { value: 'wrap', label: 'Wrap' },
]

const SEASONS = [
  { value: '', label: 'Select season...' },
  { value: 'SS25', label: 'SS25' },
  { value: 'AW25', label: 'AW25' },
  { value: 'SS26', label: 'SS26' },
  { value: 'AW26', label: 'AW26' },
  { value: 'Resort', label: 'Resort' },
  { value: 'Cruise', label: 'Cruise' },
]

const TOOLS = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'pen', icon: Pen, label: 'Pen' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
  { id: 'rect', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: CircleIcon, label: 'Circle' },
  { id: 'triangle', icon: TriIcon, label: 'Triangle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'text', icon: Type, label: 'Text' },
]

type RightPanel = 'layers' | 'annotations' | 'history'

export default function Sketchbook() {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  const {
    activeTool, setActiveTool,
    strokeColor, setStrokeColor,
    strokeWidth, setStrokeWidth,
    pushUndo, undo, redo,
    isDirty, setDirty, lastSaved, setLastSaved,
    versions, addVersion,
  } = useSketchStore()
  const { sketches, createSketch, saveSketch } = useSketch()
  const { addToast } = useAppStore()

  const [activeSketchId, setActiveSketchId] = useState<string | null>(null)
  const [rightPanel, setRightPanel] = useState<RightPanel>('annotations')
  const [annotations, setAnnotations] = useState<any>({})
  const [critique, setCritique] = useState<DesignCritique | null>(null)
  const [showCritique, setShowCritique] = useState(false)
  const [gettingCritique, setGettingCritique] = useState(false)
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [showVersionModal, setShowVersionModal] = useState(false)
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasEl.current) return
    const canvas = new Canvas(canvasEl.current, {
      isDrawingMode: false,
      width: canvasEl.current.parentElement?.clientWidth || 800,
      height: canvasEl.current.parentElement?.clientHeight || 600,
      backgroundColor: '#fdfaf9',
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
        if (sketches[0].annotations) setAnnotations(sketches[0].annotations)
      } else {
        const sketch = await createSketch('My First Sketch')
        if (sketch) setActiveSketchId(sketch.id)
      }
    })()

    // Auto-save every 30s
    autoSaveRef.current = setInterval(() => { handleSave(canvas, false) }, 30000)

    // Version snapshot every 5 min
    const versionInterval = setInterval(() => {
      addVersion(JSON.stringify(canvas.toJSON()))
    }, 300000)

    return () => {
      canvas.dispose()
      clearInterval(autoSaveRef.current!)
      clearInterval(versionInterval)
    }
  }, [])

  // Update tool
  useEffect(() => {
    if (!fabricCanvas) return
    const brush = new PencilBrush(fabricCanvas)
    brush.color = strokeColor
    brush.width = strokeWidth

    if (activeTool === 'pen' || activeTool === 'eraser') {
      fabricCanvas.isDrawingMode = true
      if (activeTool === 'eraser') {
        brush.color = '#fdfaf9'
        brush.width = strokeWidth * 3
      }
      fabricCanvas.freeDrawingBrush = brush
    } else {
      fabricCanvas.isDrawingMode = false
    }

    if (activeTool === 'text') {
      const handler = (opt: any) => {
        const pointer = fabricCanvas.getScenePoint(opt.e)
        const text = new FabricText('Click to edit', {
          left: pointer.x, top: pointer.y,
          fontFamily: 'var(--font-ui)',
          fill: strokeColor,
          fontSize: 20,
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
    const opts = { left: 150, top: 150, stroke: strokeColor, strokeWidth, fill: 'transparent' }
    let shape: any
    if (type === 'rect') shape = new Rect({ ...opts, width: 120, height: 80 })
    if (type === 'circle') shape = new Circle({ ...opts, radius: 50 })
    if (type === 'triangle') shape = new Triangle({ ...opts, width: 100, height: 100 })
    if (type === 'line') shape = new Line([0, 0, 150, 0], { ...opts, x1: 50, y1: 150, x2: 200, y2: 150 })
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

  const handleSave = async (canvas?: Canvas, manual = true) => {
    const c = canvas || fabricCanvas
    if (!c || !activeSketchId) return
    setSavingState('saving')
    const dataUrl = c.toDataURL({ format: 'png', quality: 0.8, multiplier: 0.5 } as any)
    const canvasJSON = c.toJSON()
    await saveSketch(activeSketchId, canvasJSON, dataUrl, manual)
    if (manual) addVersion(JSON.stringify(canvasJSON))
    setSavingState('saved')
    setLastSaved(new Date())
    setTimeout(() => setSavingState('idle'), 2000)
  }

  const handleGetCritique = async () => {
    if (!fabricCanvas) return
    setGettingCritique(true)
    try {
      const dataUrl = fabricCanvas.toDataURL({ format: 'png', quality: 0.9, multiplier: 1 } as any)
      const base64 = dataUrl.split(',')[1] || ''
      const result = await getDesignCritique(base64)
      setCritique(result)
      setShowCritique(true)
    } catch {
      addToast('Critique failed. Check your Gemini API key.', 'error')
    }
    setGettingCritique(false)
  }

  const handleClearCanvas = () => {
    if (!fabricCanvas) return
    fabricCanvas.clear()
    fabricCanvas.backgroundColor = '#fdfaf9'
    fabricCanvas.renderAll()
  }

  const handleExport = () => {
    if (!fabricCanvas) return
    const dataUrl = fabricCanvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 } as any)
    const link = document.createElement('a')
    link.download = 'sketch.png'
    link.href = dataUrl
    link.click()
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height) - 2rem)', margin: '-2rem', overflow: 'hidden', gap: 0 }}>
      {/* Tools panel — left */}
      <div className="glass-panel" style={{
        width: 56,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.875rem 0',
        gap: '0.375rem',
        borderRight: '1px solid var(--glass-border)',
        borderRadius: 0,
        flexShrink: 0,
      }}>
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleToolClick(id)}
            data-tooltip={label}
            aria-label={label}
            style={{
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTool === id ? 'var(--accent-primary)' : 'transparent',
              color: activeTool === id ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
            }}
          >
            <Icon size={17} />
          </button>
        ))}

        <div className="divider" style={{ width: 32, margin: '0.25rem 0' }} />

        {/* Color */}
        <div style={{ position: 'relative' }}>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid var(--glass-border)', cursor: 'pointer', padding: 2 }}
            title="Stroke color"
          />
        </div>

        {/* Width */}
        <input
          type="range"
          min={1} max={40}
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          style={{ writingMode: 'vertical-lr', height: 80, width: 6, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          title="Brush size"
        />

        <div className="divider" style={{ width: 32, margin: '0.25rem 0' }} />

        <button onClick={handleUndo} className="btn btn-ghost btn-icon" title="Undo"><Undo2 size={16} /></button>
        <button onClick={handleRedo} className="btn btn-ghost btn-icon" title="Redo"><Redo2 size={16} /></button>
        <button onClick={handleClearCanvas} className="btn btn-ghost btn-icon" title="Clear canvas"><Trash2 size={16} /></button>
      </div>

      {/* Canvas area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Canvas top bar */}
        <div className="glass-topbar" style={{ position: 'relative', left: 'auto', right: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {sketches.find((s) => s.id === activeSketchId)?.title || 'Sketchbook'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {savingState === 'saving' && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Loader2 size={13} className="animate-spin" /> Saving…</span>}
            {savingState === 'saved' && <span style={{ fontSize: '0.8rem', color: 'var(--status-success)' }}>Saved ✓</span>}
            <Button variant="glass" size="sm" icon={<History size={14} />} onClick={() => setShowVersionModal(true)}>History</Button>
            <Button variant="glass" size="sm" icon={gettingCritique ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} onClick={handleGetCritique} loading={gettingCritique}>
              Get Critique
            </Button>
            <Button variant="glass" size="sm" icon={<Download size={14} />} onClick={handleExport}>Export</Button>
            <Button size="sm" icon={<Save size={14} />} onClick={() => handleSave(undefined, true)}>Save</Button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative', background: 'var(--bg-base)', overflow: 'hidden' }}>
          <canvas ref={canvasEl} id="sketch-canvas" style={{ display: 'block' }} />
        </div>
      </div>

      {/* Right panel */}
      <div className="glass-panel" style={{
        width: 280,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid var(--glass-border)',
        borderRadius: 0,
        flexShrink: 0,
      }}>
        {/* Panel tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)' }}>
          {(['annotations', 'history'] as const).map((panel) => (
            <button key={panel} onClick={() => setRightPanel(panel)} style={{
              flex: 1,
              padding: '0.625rem',
              background: rightPanel === panel ? 'var(--accent-light)' : 'transparent',
              border: 'none',
              borderBottom: rightPanel === panel ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: rightPanel === panel ? 'var(--accent-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-ui)',
              fontWeight: rightPanel === panel ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
            }}>
              {panel === 'annotations' ? <><SlidersHorizontal size={13} /> Notes</> : <><History size={13} /> History</>}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {rightPanel === 'annotations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <Select label="Garment Type" options={GARMENT_TYPES} value={annotations.garment_type || ''} onChange={(e) => setAnnotations((a: any) => ({ ...a, garment_type: e.target.value }))} />
              <Select label="Silhouette" options={SILHOUETTES} value={annotations.silhouette || ''} onChange={(e) => setAnnotations((a: any) => ({ ...a, silhouette: e.target.value }))} />
              <Select label="Season" options={SEASONS} value={annotations.season || ''} onChange={(e) => setAnnotations((a: any) => ({ ...a, season: e.target.value }))} />
              <div className="form-group">
                <label className="input-label">Primary Color</label>
                <input type="color" value={annotations.primary_color || '#800020'} onChange={(e) => setAnnotations((a: any) => ({ ...a, primary_color: e.target.value }))} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', cursor: 'pointer' }} />
              </div>
              <div className="form-group">
                <label className="input-label">Occasion</label>
                <input className="input" value={annotations.occasion || ''} onChange={(e) => setAnnotations((a: any) => ({ ...a, occasion: e.target.value }))} placeholder="casual, evening, bridal..." />
              </div>
              <div className="form-group">
                <label className="input-label">Est. Cost (PKR)</label>
                <input className="input" type="number" value={annotations.cost_range || ''} onChange={(e) => setAnnotations((a: any) => ({ ...a, cost_range: e.target.value }))} placeholder="e.g. 15000" />
              </div>
              <div className="form-group">
                <label className="input-label">Technical Notes</label>
                <textarea className="input" rows={3} value={annotations.technical_notes || ''} onChange={(e) => setAnnotations((a: any) => ({ ...a, technical_notes: e.target.value }))} placeholder="Fabric, stitching, closure details..." style={{ resize: 'vertical' }} />
              </div>
              <Button variant="secondary" size="sm" onClick={() => { addToast('Annotations saved', 'success') }}>
                Save Annotations
              </Button>
            </div>
          )}

          {rightPanel === 'history' && (
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {versions.length} version{versions.length !== 1 ? 's' : ''} saved
              </p>
              {versions.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No versions yet. Save manually to create a version.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[...versions].reverse().map((v) => (
                    <div key={v.version} style={{
                      padding: '0.75rem',
                      background: 'var(--accent-light)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--glass-border)',
                    }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Version {v.version}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {new Date(v.savedAt).toLocaleTimeString()}
                      </p>
                      <Button variant="ghost" size="sm" onClick={async () => {
                        if (fabricCanvas) { await fabricCanvas.loadFromJSON(JSON.parse(v.data)); fabricCanvas.renderAll(); addToast(`Restored version ${v.version}`, 'info') }
                      }}>
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Design Critique Modal */}
      <GlassModal isOpen={showCritique} onClose={() => setShowCritique(false)} title="AI Atelier Critique & Inspection" size="lg">
        {critique && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="ai-strengths-card">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--status-success)', marginBottom: '0.625rem', fontWeight: 600 }}>✓ Atelier Validation Notes</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', listStyle: 'none' }}>
                {critique.works_well.map((p, i) => <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>• {p}</li>)}
              </ul>
            </div>

            <div className="ai-warning-card">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--status-warning)', marginBottom: '0.625rem', fontWeight: 600 }}>↑ Pattern & Seam Alteration Advisories</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', listStyle: 'none' }}>
                {critique.improvements.map((p, i) => <li key={i} style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>• {p}</li>)}
              </ul>
            </div>

            <div className="ai-director-note">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--accent-secondary)', marginBottom: '0.5rem', fontWeight: 600, fontStyle: 'normal' }}>Atelier Director Note</h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.65, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>"{critique.overall}"</p>
            </div>
          </div>
        )}
      </GlassModal>
    </div>
  )
}
