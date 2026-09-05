import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, ZoomIn, ZoomOut, Sparkles, Palette, Download, Save, Plus, Type, Pipette, X, Loader2 } from 'lucide-react'
import { useMoodBoard } from '@/hooks/useMoodBoard'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'
import { analyzeMoodBoard, type MoodBoardAnalysis } from '@/lib/gemini'
import { fileToBase64 } from '@/lib/export'
import { useAppStore } from '@/store/useAppStore'

interface CanvasElement {
  id: string
  type: 'image' | 'text' | 'swatch'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  src?: string
  text?: string
  color?: string
  caption?: string
  locked?: boolean
}

export default function MoodBoardDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { moodBoards, saveMoodBoard, renameMoodBoard } = useMoodBoard()
  const { addToast } = useAppStore()
  const board = moodBoards.find((b) => b.id === id)

  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [aiTags, setAiTags] = useState<MoodBoardAnalysis[]>([])
  const [analyzingAI, setAnalyzingAI] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [palette, setPalette] = useState<string[]>([])
  const [showPalette, setShowPalette] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [boardName, setBoardName] = useState('')
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing canvas data
  useEffect(() => {
    if (board) {
      setBoardName(board.name)
      if (board.canvas_data?.elements) setElements(board.canvas_data.elements)
      if (board.extracted_colors) setPalette(board.extracted_colors as string[])
      if (board.ai_tags) setAiTags(board.ai_tags as MoodBoardAnalysis[])
    }
  }, [board?.id])

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    await saveMoodBoard(id, { elements }, palette.length ? palette : undefined, aiTags.length ? aiTags : undefined)
    setSaving(false)
    addToast('Board saved!', 'success')
  }

  const addImage = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const newEl: CanvasElement = {
        id: Date.now().toString(),
        type: 'image',
        x: 80 + elements.length * 20,
        y: 80 + elements.length * 20,
        width: 240,
        height: 180,
        rotation: 0,
        zIndex: elements.length + 1,
        src,
      }
      setElements((prev) => [...prev, newEl])
    }
    reader.readAsDataURL(file)
  }

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    Array.from(e.dataTransfer.files).forEach((f) => { if (f.type.startsWith('image/')) addImage(f) })
  }, [elements])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(addImage)
  }

  const addTextNote = () => {
    setElements((prev) => [...prev, {
      id: Date.now().toString(),
      type: 'text',
      x: 100, y: 100,
      width: 200, height: 60,
      rotation: 0, zIndex: prev.length + 1,
      text: 'Click to edit...',
      color: '#800020',
    }])
  }

  const addSwatch = () => {
    setElements((prev) => [...prev, {
      id: Date.now().toString(),
      type: 'swatch',
      x: 120, y: 120,
      width: 80, height: 80,
      rotation: 0, zIndex: prev.length + 1,
      color: '#800020',
    }])
  }

  // Drag element on canvas
  const handleElementMouseDown = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation()
    setSelectedId(elId)
    const startX = e.clientX
    const startY = e.clientY
    const el = elements.find((el) => el.id === elId)
    if (!el || el.locked) return
    const elX = el.x, elY = el.y

    const onMove = (mv: MouseEvent) => {
      const dx = (mv.clientX - startX) / zoom
      const dy = (mv.clientY - startY) / zoom
      setElements((prev) => prev.map((el) => el.id === elId ? { ...el, x: elX + dx, y: elY + dy } : el))
    }
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // Pan canvas
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && !(e.target as HTMLElement).classList.contains('canvas-bg')) return
    setSelectedId(null)
    if (e.buttons === 1) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y }) }
    const onUp = () => setIsPanning(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [isPanning, panStart])

  // Zoom on scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setZoom((z) => Math.max(0.25, Math.min(2, z + delta)))
  }

  const handleAnalyzeAI = async () => {
    const imageEls = elements.filter((el) => el.type === 'image' && el.src)
    if (imageEls.length === 0) { addToast('Add some images first!', 'warning'); return }
    setAnalyzingAI(true)
    try {
      const base64s = imageEls.map((el) => el.src!.split(',')[1] || '')
      const results = await analyzeMoodBoard(base64s)
      setAiTags(results)
      setShowAIPanel(true)
    } catch {
      addToast('AI analysis failed. Check your Gemini API key.', 'error')
    }
    setAnalyzingAI(false)
  }

  const handleExtractPalette = () => {
    // Extract colors from swatch elements and generate a demo palette from image dominant colors
    const swatchColors = elements.filter((el) => el.type === 'swatch' && el.color).map((el) => el.color!)
    const demoPalette = ['#800020', '#5C0016', '#A0002A', '#C05070', '#FDF6F6', '#1A0A0E']
    const combined = [...new Set([...swatchColors, ...demoPalette])].slice(0, 8)
    setPalette(combined)
    setShowPalette(true)
    addToast('Palette extracted!', 'success')
  }

  const deleteSelected = () => {
    if (selectedId) {
      setElements((prev) => prev.filter((el) => el.id !== selectedId))
      setSelectedId(null)
    }
  }

  if (!board) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Board not found</h2>
      <Button variant="ghost" onClick={() => navigate('/moodboards')} icon={<ArrowLeft size={16} />}>Back</Button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height) - 2rem)', margin: '-2rem', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div className="glass-topbar" style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        flexWrap: 'wrap',
        zIndex: 10,
        left: 'auto', right: 'auto',
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/moodboards')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div className="divider" style={{ width: 1, height: 24, margin: '0 0.25rem' }} />

        {/* Board name */}
        {editingName ? (
          <input
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onBlur={() => { setEditingName(false); if (id) renameMoodBoard(id, boardName) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { setEditingName(false); if (id) renameMoodBoard(id, boardName) } }}
            style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', background: 'none', border: '1px solid var(--accent-primary)', borderRadius: 4, padding: '2px 8px', color: 'var(--text-primary)', width: 200 }}
            autoFocus
          />
        ) : (
          <h2
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            onClick={() => setEditingName(true)}
          >{boardName}</h2>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <Button variant="glass" size="sm" icon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()}>Add Images</Button>
          <Button variant="glass" size="sm" icon={<Type size={14} />} onClick={addTextNote}>Text</Button>
          <Button variant="glass" size="sm" icon={<Pipette size={14} />} onClick={addSwatch}>Swatch</Button>
          <div className="divider" style={{ width: 1, height: 24, margin: '0 0.125rem' }} />
          <Button variant="glass" size="sm" icon={analyzingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} onClick={handleAnalyzeAI} loading={analyzingAI}>
            Analyze
          </Button>
          <Button variant="glass" size="sm" icon={<Palette size={14} />} onClick={handleExtractPalette}>Palette</Button>
          <div className="divider" style={{ width: 1, height: 24, margin: '0 0.125rem' }} />
          <Button variant="glass" size="sm" icon={<ZoomOut size={14} />} onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8125rem', color: 'var(--text-muted)', padding: '0 0.25rem', alignSelf: 'center' }}>{Math.round(zoom * 100)}%</span>
          <Button variant="glass" size="sm" icon={<ZoomIn size={14} />} onClick={() => setZoom((z) => Math.min(2, z + 0.1))} />
          <div className="divider" style={{ width: 1, height: 24, margin: '0 0.125rem' }} />
          <Button size="sm" icon={saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} onClick={handleSave} loading={saving}>
            Save
          </Button>
          {selectedId && <Button variant="danger" size="sm" icon={<X size={14} />} onClick={deleteSelected}>Delete</Button>}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="canvas-bg dot-grid-bg"
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          cursor: isPanning ? 'grabbing' : 'default',
        }}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', position: 'absolute', width: '3000px', height: '2000px' }}>
          {elements.map((el) => (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.x, top: el.y,
                width: el.width, height: el.height,
                transform: `rotate(${el.rotation}deg)`,
                zIndex: el.zIndex,
                border: selectedId === el.id ? '2px solid var(--accent-primary)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                cursor: el.locked ? 'not-allowed' : 'move',
                userSelect: 'none',
              }}
              onMouseDown={(e) => handleElementMouseDown(e, el.id)}
            >
              {el.type === 'image' && el.src && (
                <img src={el.src} alt={el.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', display: 'block' }} />
              )}
              {el.type === 'text' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newText = e.currentTarget.textContent || ''
                    setElements((prev) => prev.map((x) => x.id === el.id ? { ...x, text: newText } : x))
                  }}
                  style={{
                    width: '100%', height: '100%',
                    padding: '0.5rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    color: el.color || 'var(--text-primary)',
                    background: 'rgba(255,255,255,0.85)',
                    borderRadius: 'var(--radius-sm)',
                    outline: 'none',
                    overflow: 'hidden',
                  }}
                >
                  {el.text}
                </div>
              )}
              {el.type === 'swatch' && (
                <div style={{
                  width: '100%', height: '100%',
                  background: el.color || 'var(--accent-primary)',
                  borderRadius: 'var(--radius-sm)',
                }} />
              )}
              {selectedId === el.id && (
                <div style={{
                  position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent-primary)', color: 'white',
                  fontSize: '0.7rem', padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  whiteSpace: 'nowrap',
                }}>
                  {el.type}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {elements.length === 0 && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '1rem', pointerEvents: 'none',
          }}>
            <Upload size={48} style={{ color: 'var(--glass-border)', opacity: 0.6 }} />
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', maxWidth: 320 }}>
              Drop images here or use the toolbar to add images, text, and color swatches.
            </p>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileInput} />

      {/* AI Tags Panel */}
      <GlassModal isOpen={showAIPanel} onClose={() => setShowAIPanel(false)} title=" AI Analysis Results" size="lg">
        <div style={{ padding: '1.5rem' }}>
          {aiTags.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No results. Try adding more images.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {aiTags.map((tag, i) => (
                <div key={i} style={{ padding: '1rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {[tag.garment_type, tag.style_aesthetic, tag.mood, tag.season].map((t) => t && (
                      <span key={t} className="badge badge-accent">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(tag.dominant_colors || []).map((c, ci) => (
                      <div key={ci} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '1.5px solid rgba(255,255,255,0.4)' }} title={c} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassModal>

      {/* Palette Panel */}
      <GlassModal isOpen={showPalette} onClose={() => setShowPalette(false)} title="Extracted Color Palette" size="sm">
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {palette.map((c, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: c, border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                  onClick={() => { navigator.clipboard.writeText(c); addToast(`Copied ${c}`, 'success') }} title="Click to copy" />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c}</span>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(palette.join(', ')); addToast('Palette copied!', 'success') }}>
            Copy all HEX values
          </Button>
        </div>
      </GlassModal>
    </div>
  )
}
