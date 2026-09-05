import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, Layers2, X, Upload, Loader2, ExternalLink } from 'lucide-react'
import { useFabrics, type CreateFabricData, type Fabric } from '@/hooks/useFabrics'
import { GlassModal } from '@/components/ui/GlassModal'
import { Button } from '@/components/ui/Button'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/store/useAppStore'

const FABRIC_TYPES = [
  { value: '', label: 'Any type' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'silk', label: 'Silk' },
  { value: 'linen', label: 'Linen' },
  { value: 'chiffon', label: 'Chiffon' },
  { value: 'denim', label: 'Denim' },
  { value: 'wool', label: 'Wool' },
  { value: 'leather', label: 'Leather' },
  { value: 'velvet', label: 'Velvet' },
  { value: 'satin', label: 'Satin' },
  { value: 'georgette', label: 'Georgette' },
  { value: 'organza', label: 'Organza' },
  { value: 'other', label: 'Other' },
]

const AVAILABILITY_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'limited', label: 'Limited' },
  { value: 'out_of_stock', label: 'Out of Stock' },
]

const AVAILABILITY_BADGE: Record<string, 'success' | 'warning' | 'danger'> = {
  in_stock: 'success',
  limited: 'warning',
  out_of_stock: 'danger',
}

const AVAILABILITY_LABEL: Record<string, string> = {
  in_stock: 'In Stock',
  limited: 'Limited',
  out_of_stock: 'Out of Stock',
}

function FabricCard({ fabric, onClick }: { fabric: Fabric; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Swatch image */}
        <div style={{
          height: 140,
          background: fabric.image_url
            ? `url(${fabric.image_url}) center/cover`
            : `linear-gradient(135deg, var(--accent-light), var(--bg-surface-deep))`,
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
            <Badge variant={AVAILABILITY_BADGE[fabric.availability]}>
              {AVAILABILITY_LABEL[fabric.availability]}
            </Badge>
          </div>
          {fabric.dominant_colors && (
            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', display: 'flex', gap: '3px' }}>
              {(fabric.dominant_colors as string[]).slice(0, 4).map((c: string, i: number) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1.5px solid rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '0.875rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.375rem',
          }} className="truncate">
            {fabric.name}
          </h3>
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {fabric.type && <Badge variant="muted">{fabric.type}</Badge>}
            {fabric.texture && <Badge variant="muted">{fabric.texture}</Badge>}
          </div>
          {fabric.cost_per_meter && (
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              PKR {fabric.cost_per_meter.toLocaleString()}/m
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function AddFabricModal({ isOpen, onClose, onCreate }: { isOpen: boolean; onClose: () => void; onCreate: (data: CreateFabricData) => void }) {
  const [form, setForm] = useState<CreateFabricData>({ name: '', availability: 'in_stock' })
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [seasonsInput, setSeasonsInput] = useState<string[]>([])
  const set = (field: string) => (e: any) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      setImagePreview(src)
      setForm((p) => ({ ...p, image_url: src }))
    }
    reader.readAsDataURL(file)
  }

  const toggleSeason = (s: string) => setSeasonsInput((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onCreate({ ...form, tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()) : [], seasons: seasonsInput })
    setLoading(false)
    onClose()
    setForm({ name: '', availability: 'in_stock' })
    setImagePreview('')
    setTagsInput('')
    setSeasonsInput([])
  }

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Add Fabric Swatch" size="xl">
      <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Image upload */}
        <div style={{ gridColumn: '1/-1' }}>
          <label className="input-label">Swatch Image</label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 140,
            border: '2px dashed var(--glass-border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: imagePreview ? `url(${imagePreview}) center/cover` : 'var(--accent-light)',
            overflow: 'hidden',
            transition: 'border-color var(--transition-base)',
          }}>
            {!imagePreview && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Upload size={24} style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.875rem' }}>Click to upload swatch photo</p>
              </div>
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
          </label>
        </div>

        <Input label="Fabric Name" id="fabric-name" value={form.name} onChange={set('name')} placeholder="e.g. Raw Silk Dupatta" required />
        <Select label="Type" id="fabric-type" value={form.type || ''} onChange={set('type')} options={FABRIC_TYPES} />
        <Input label="Texture" id="fabric-texture" value={form.texture || ''} onChange={set('texture')} placeholder="smooth, rough, sheer..." />
        <Select label="Weight" id="fabric-weight" value={form.weight || ''} onChange={set('weight')} options={[
          { value: '', label: 'Select weight...' },
          { value: 'lightweight', label: 'Lightweight' },
          { value: 'medium', label: 'Medium' },
          { value: 'heavy', label: 'Heavy' },
        ]} />
        <Input label="Cost per Meter (PKR)" id="fabric-cost" type="number" value={form.cost_per_meter || ''} onChange={set('cost_per_meter')} placeholder="e.g. 1200" />
        <Select label="Availability" id="fabric-availability" value={form.availability} onChange={set('availability') as any} options={AVAILABILITY_OPTIONS} />
        <Input label="Supplier Name" id="fabric-supplier" value={form.supplier_name || ''} onChange={set('supplier_name')} placeholder="Liberty Market, Fancy Cloth..." />
        <Input label="Supplier URL (optional)" id="fabric-supplier-url" type="url" value={form.supplier_url || ''} onChange={set('supplier_url')} placeholder="https://..." />

        {/* Seasons */}
        <div style={{ gridColumn: '1/-1' }}>
          <label className="input-label">Season Suitability</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {['SS', 'AW', 'Resort', 'All-season'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSeason(s)}
                className={`badge ${seasonsInput.includes(s) ? 'badge-accent' : 'badge-muted'}`}
                style={{ cursor: 'pointer', border: 'none', fontFamily: 'var(--font-ui)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Textarea label="Care Instructions" value={form.care_instructions || ''} onChange={set('care_instructions')} placeholder="Dry clean only, hand wash cold..." style={{ gridColumn: '1/-1' } as any} rows={2} />
        <Input label="Tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="sustainable, printed, imported..." style={{ gridColumn: '1/-1' } as any} />
        <Textarea label="Personal Notes" value={form.notes || ''} onChange={set('notes')} placeholder="Where you found it, usage ideas..." style={{ gridColumn: '1/-1' } as any} rows={2} />

        <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Add Swatch</Button>
        </div>
      </form>
    </GlassModal>
  )
}

function FabricDetailDrawer({ fabric, onClose, onUpdate, onDelete }: { fabric: Fabric; onClose: () => void; onUpdate: (id: string, data: Partial<Fabric>) => void; onDelete: (id: string) => void }) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        top: 'var(--topbar-height)',
        right: 0,
        bottom: 0,
        width: 360,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface-deep)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">{fabric.name}</h3>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fabric.image_url && (
          <div style={{ height: 200, borderRadius: 'var(--radius-lg)', background: `url(${fabric.image_url}) center/cover`, border: '1px solid var(--glass-border)' }} />
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {fabric.type && <Badge variant="accent">{fabric.type}</Badge>}
          <Badge variant={AVAILABILITY_BADGE[fabric.availability]}>{AVAILABILITY_LABEL[fabric.availability]}</Badge>
          {fabric.seasons?.map((s) => <Badge key={s} variant="muted">{s}</Badge>)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[
            ['Texture', fabric.texture],
            ['Weight', fabric.weight],
            ['Cost/m', fabric.cost_per_meter ? `PKR ${fabric.cost_per_meter.toLocaleString()}` : null],
            ['Supplier', fabric.supplier_name],
            ['Care', fabric.care_instructions],
          ].map(([k, v]) => v ? (
            <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', maxWidth: 200, textAlign: 'right' }}>{v}</span>
            </div>
          ) : null)}
        </div>

        {fabric.supplier_url && (
          <a href={fabric.supplier_url} target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ExternalLink size={13} /> Visit Supplier
          </a>
        )}

        {fabric.notes && (
          <div style={{ padding: '0.875rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Notes</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>{fabric.notes}</p>
          </div>
        )}

        {fabric.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {fabric.tags.map((t) => <Badge key={t} variant="muted">#{t}</Badge>)}
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem' }}>
        <Button variant="danger" size="sm" style={{ flex: 1 }} onClick={() => { onDelete(fabric.id); onClose() }}>Delete</Button>
      </div>
    </motion.div>
  )
}

export default function Fabrics() {
  const { fabrics, loading, createFabric, updateFabric, deleteFabric } = useFabrics()
  const { addToast } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState<Fabric | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterAvail, setFilterAvail] = useState('')

  const filtered = fabrics.filter((f) => {
    const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || (f.notes || '').toLowerCase().includes(search.toLowerCase())
    const matchType = !filterType || f.type === filterType
    const matchAvail = !filterAvail || f.availability === filterAvail
    return matchSearch && matchType && matchAvail
  })

  return (
    <div style={{ maxWidth: '1400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Fabric Library</h1>
        <Button icon={<Plus size={16} />} onClick={() => setShowAdd(true)} id="add-fabric-btn">Add Swatch</Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search fabrics..." value={search} onChange={(e) => setSearch(e.target.value)} id="fabrics-search" />
        </div>
        <select className="input" style={{ width: 'auto', minWidth: 140 }} value={filterType} onChange={(e) => setFilterType(e.target.value)} id="fabrics-filter-type">
          {FABRIC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label || 'All Types'}</option>)}
        </select>
        <select className="input" style={{ width: 'auto', minWidth: 140 }} value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)} id="fabrics-filter-avail">
          <option value="">All Availability</option>
          {AVAILABILITY_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{filtered.length} swatches</span>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <Layers2 size={56} style={{ color: 'var(--glass-border)' }} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {search ? 'No swatches match' : 'Your material library is waiting'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 340 }}>
              {search ? 'Try a different search.' : 'Start by adding your first swatch.'}
            </p>
          </div>
          {!search && <Button icon={<Plus size={16} />} onClick={() => setShowAdd(true)}>Add First Swatch</Button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {filtered.map((fabric, i) => (
            <motion.div key={fabric.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <FabricCard fabric={fabric} onClick={() => setSelected(fabric)} />
            </motion.div>
          ))}
        </div>
      )}

      <AddFabricModal isOpen={showAdd} onClose={() => setShowAdd(false)} onCreate={createFabric} />

      <AnimatePresence>
        {selected && (
          <FabricDetailDrawer
            fabric={selected}
            onClose={() => setSelected(null)}
            onUpdate={updateFabric}
            onDelete={deleteFabric}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
