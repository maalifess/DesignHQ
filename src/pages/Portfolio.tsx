import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, BookOpen, Plus, ChevronDown, ChevronUp, Save, Download, Loader2, X } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { useMoodBoard } from '@/hooks/useMoodBoard'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { generateStyleGuide, type StyleGuideInput, type StyleGuide } from '@/lib/gemini'
import { Badge } from '@/components/ui/Badge'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ── Style Guide Generator Modal ────────────────────────────────────────────────
function StyleGuideModal({ isOpen, onClose, onGenerated }: {
  isOpen: boolean
  onClose: () => void
  onGenerated: (guide: StyleGuide) => void
}) {
  const [form, setForm] = useState<StyleGuideInput>({
    theme: '', season: 'SS26', targetAudience: '', moodKeywords: '',
    colorDirection: '', garmentCategories: [], inspirationRefs: '',
  })
  const [loading, setLoading] = useState(false)
  const { addToast } = useAppStore()
  const [categoryInput, setCategoryInput] = useState('')

  const set = (field: string) => (e: any) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleGenerate = async () => {
    if (!form.theme || !form.targetAudience || !form.moodKeywords) {
      addToast('Please fill in theme, audience, and mood keywords', 'warning')
      return
    }
    setLoading(true)
    try {
      const guide = await generateStyleGuide({ ...form, garmentCategories: categoryInput ? categoryInput.split(',').map(s => s.trim()) : [] })
      onGenerated(guide)
      onClose()
    } catch {
      addToast('Generation failed. Check your Gemini API key.', 'error')
    }
    setLoading(false)
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title=" AI Style Guide Generator" size="lg">
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input label="Collection Theme / Title" id="sg-theme" value={form.theme} onChange={set('theme')} placeholder="e.g. Fluid Femininity" required />
          <Select label="Season" id="sg-season" value={form.season} onChange={set('season')} options={[
            { value: 'SS25', label: 'SS25' }, { value: 'AW25', label: 'AW25' },
            { value: 'SS26', label: 'SS26' }, { value: 'AW26', label: 'AW26' },
            { value: 'Resort', label: 'Resort' }, { value: 'Cruise', label: 'Cruise' },
          ]} />
        </div>
        <Input label="Target Audience" id="sg-audience" value={form.targetAudience} onChange={set('targetAudience')} placeholder="e.g. Women 22-35, evening occasion" />
        <Input label="Mood Keywords" id="sg-mood" value={form.moodKeywords} onChange={set('moodKeywords')} placeholder="romantic, soft, Parisian, ethereal..." />
        <Input label="Color Direction (optional)" id="sg-color" value={form.colorDirection || ''} onChange={set('colorDirection')} placeholder="dusty rose, ivory, deep burgundy..." />
        <Input label="Garment Categories (comma-separated)" id="sg-garments" value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} placeholder="dresses, coats, trousers, blouses..." />
        <Textarea label="Inspiration References (optional)" id="sg-refs" value={form.inspirationRefs || ''} onChange={set('inspirationRefs')} placeholder="Rei Kawakubo, 1970s Parisian couture, soft sculpture..." rows={2} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button loading={loading} icon={loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} onClick={handleGenerate}>
            Generate Style Guide
          </Button>
        </div>
      </div>
    </GlassModal>
  )
}

// ── Style Guide Display ────────────────────────────────────────────────────────
function StyleGuideDisplay({ guide }: { guide: StyleGuide }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-deep))',
        borderRadius: 'var(--radius-xl)',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{guide.collection_name}</h1>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontStyle: 'italic', opacity: 0.9 }}>{guide.tagline}</p>
      </div>

      {/* Mood */}
      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Mood</h3>
        <p style={{ lineHeight: 1.8, color: 'var(--text-primary)', fontStyle: 'italic', fontSize: '1.0625rem' }}>{guide.mood_description}</p>
      </div>

      {/* Color palette */}
      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>Color Palette</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {guide.color_palette.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem', minWidth: 100 }}>
              <div style={{
                width: 72, height: 72,
                borderRadius: '50%',
                background: c.hex,
                border: '3px solid var(--glass-border)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }} />
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', textAlign: 'center' }}>{c.name}</p>
              <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{c.hex}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 100 }}>{c.usage_note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Silhouettes */}
      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Key Silhouettes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {guide.key_silhouettes.map((s, i) => (
            <div key={i} style={{ padding: '0.875rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{s.name}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fabrics */}
      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Fabric Recommendations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {guide.fabric_recommendations.map((f, i) => (
            <div key={i} style={{ padding: '0.875rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>{f.name}</p>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                <Badge variant="muted">{f.season}</Badge>
                <Badge variant="muted">{f.weight}</Badge>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.texture}</p>
              {f.note && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{f.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Design details */}
      <div className="glass-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Key Design Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {guide.key_design_details.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700, flexShrink: 0 }}>→</span>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer + Story */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--accent-primary)', marginBottom: '0.875rem' }}>Target Customer</h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.65 }}>{guide.target_customer_profile}</p>
        </div>
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--accent-primary)', marginBottom: '0.875rem' }}>Collection Story</h3>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', lineHeight: 1.65, fontStyle: 'italic' }}>{guide.collection_story}</p>
        </div>
      </div>
    </div>
  )
}

// ── Sortable project item for portfolio ───────────────────────────────────────
function SortablePortfolioItem({ project, included, onToggle }: {
  project: any
  included: boolean
  onToggle: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style}>
      <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', flexShrink: 0 }}>⠿</div>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: project.color_label || 'var(--accent-light)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }} className="truncate">{project.title}</p>
          {project.theme && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="truncate">{project.theme}</p>}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flexShrink: 0 }}>
          <input type="checkbox" checked={included} onChange={() => onToggle(project.id)} style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }} />
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Include</span>
        </label>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const { projects } = useProjects()
  const { profile, updateProfile } = useAuth()
  const { addToast } = useAppStore()
  const [showStyleGuide, setShowStyleGuide] = useState(false)
  const [styleGuide, setStyleGuide] = useState<StyleGuide | null>(null)
  const [includedIds, setIncludedIds] = useState<Set<string>>(new Set(projects.filter(p => p.portfolio_ready).map(p => p.id)))
  const [sortedProjects, setSortedProjects] = useState(projects)
  const [portfolioTitle, setPortfolioTitle] = useState(profile?.portfolio_title || 'Ariba — Fashion Design Portfolio')
  const [portfolioBio, setPortfolioBio] = useState(profile?.portfolio_bio || '')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  useEffect(() => { setSortedProjects(projects) }, [projects])

  const toggleInclude = (id: string) => {
    setIncludedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (active.id !== over?.id) {
      setSortedProjects((items) => {
        const oldIdx = items.findIndex(p => p.id === active.id)
        const newIdx = items.findIndex(p => p.id === over?.id)
        return arrayMove(items, oldIdx, newIdx)
      })
    }
  }

  const handleSavePortfolio = async () => {
    await updateProfile({ portfolio_title: portfolioTitle, portfolio_bio: portfolioBio })
    addToast('Portfolio settings saved!', 'success')
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Portfolio Builder</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={<Sparkles size={14} />} onClick={() => setShowStyleGuide(true)}>Style Guide AI</Button>
          <Button variant="glass" icon={<BookOpen size={14} />} onClick={() => window.open('/portfolio/preview', '_blank')}>Preview</Button>
          <Button onClick={handleSavePortfolio}>Save Portfolio</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: project ordering */}
        <div>
          <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Portfolio Projects</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Drag to reorder. Toggle which projects are included in your public portfolio.
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sortedProjects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {sortedProjects.map((project) => (
                    <SortablePortfolioItem
                      key={project.id}
                      project={project}
                      included={includedIds.has(project.id)}
                      onToggle={toggleInclude}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            {sortedProjects.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                No projects yet. Create some first!
              </p>
            )}
          </div>

          {/* Generated Style Guide */}
          {styleGuide && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Generated Style Guide</h3>
                <Button variant="ghost" size="sm" onClick={() => setStyleGuide(null)}><X size={14} /></Button>
              </div>
              <StyleGuideDisplay guide={styleGuide} />
            </div>
          )}
        </div>

        {/* Right: settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Portfolio Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input label="Portfolio Title" value={portfolioTitle} onChange={(e) => setPortfolioTitle(e.target.value)} placeholder="Your Name — Fashion Design Portfolio" />
              <Textarea label="Bio" value={portfolioBio} onChange={(e) => setPortfolioBio(e.target.value)} placeholder="A brief bio that appears on your public portfolio..." rows={4} />
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Share Your Portfolio</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Your public portfolio is accessible at:
            </p>
            <div style={{
              padding: '0.625rem 0.875rem',
              background: 'var(--accent-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
              color: 'var(--text-secondary)',
              wordBreak: 'break-all',
            }}>
              {window.location.origin}/portfolio/preview
            </div>
            <Button variant="secondary" size="sm" style={{ marginTop: '0.75rem', width: '100%' }}
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/portfolio/preview`); addToast('Link copied!', 'success') }}>
              Copy Link
            </Button>
          </div>
        </div>
      </div>

      <StyleGuideModal isOpen={showStyleGuide} onClose={() => setShowStyleGuide(false)} onGenerated={(g) => { setStyleGuide(g); setShowStyleGuide(false) }} />
    </div>
  )
}
