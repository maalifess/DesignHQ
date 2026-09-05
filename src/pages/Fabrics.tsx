import React, { useState } from 'react'
import { useFabrics, type Fabric } from '@/hooks/useFabrics'
import { GlassModal } from '@/components/ui/GlassModal'
import { exportFabricLookbook } from '@/lib/export'
import { useAppStore } from '@/store/useAppStore'

const FABRIC_CATEGORIES = [
  { id: 'all', label: 'All Materials (64)' },
  { id: 'silk', label: 'Silks & Satins (22)' },
  { id: 'wool', label: 'Wool & Cashmere (16)' },
  { id: 'lining', label: 'Linings & Canvas (11)' },
  { id: 'lace', label: 'Lace & Tulle (9)' },
  { id: 'hardware', label: 'Hardware & Trims (6)' },
]

export default function Fabrics() {
  const { fabrics, createFabric, deleteFabric, loading } = useFabrics()
  const { addToast } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Form State for new swatch
  const [newFabric, setNewFabric] = useState({
    name: '',
    type: 'Silk',
    texture: 'Smooth Duchess Satin',
    weight: '340 GSM',
    cost_per_meter: 68,
    currency: 'USD',
    supplier_name: 'Maison de Soie',
    supplier_url: 'https://maison-de-soie.fr',
    availability: 'in_stock' as 'in_stock' | 'limited' | 'out_of_stock',
    care_instructions: 'Dry Clean Only',
    notes: 'Haute couture garment fabric with rich velvet depth',
  })

  const activeFabric = fabrics.find((f) => f.id === selectedFabricId) || fabrics[0] || {
    id: 'satin-demo',
    name: 'Mulberry Silk Duchess Satin',
    type: 'Silk',
    texture: 'Luminous lustrous sheen',
    weight: '340 GSM',
    cost_per_meter: 68,
    currency: 'USD',
    supplier_name: 'Maison de Soie',
    supplier_url: 'Lyon, France',
    availability: 'in_stock',
    care_instructions: 'Dry Clean Only',
    notes: 'Smells of burning hair/feathers; leaves soft, dark ash bead. Extinguishes immediately.',
    dominant_colors: ['#800020', '#5C0016', '#C05070'],
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFabric.name.trim()) return
    const created = await createFabric(newFabric)
    if (created) {
      addToast('Fabric swatch added to library', 'success')
      setShowAddModal(false)
      setNewFabric({
        name: '',
        type: 'Silk',
        texture: 'Smooth Satin',
        weight: '250 GSM',
        cost_per_meter: 45,
        currency: 'USD',
        supplier_name: '',
        supplier_url: '',
        availability: 'in_stock',
        care_instructions: 'Dry Clean Only',
        notes: '',
      })
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-space-xl">
      {/* Top Header Canvas */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-md border-b border-outline-variant/20">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm tracking-widest uppercase font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Atelier Material Repository &amp; Textile Archives</span>
          </div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight font-semibold">
            Digital Fabric &amp; Material Swatch Library
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Catalog, inventory levels, microscopic textile specs, laboratory drape metrics, and master supplier provenance.
          </p>
        </div>

        {/* Action Cluster */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            onClick={() => exportFabricLookbook(document.getElementById('fabric-library-container')!)}
            className="flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-xl text-on-surface font-title-sm text-title-sm shadow-md hover:bg-surface-container-highest transition-all border border-outline-variant/20 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-tertiary">picture_as_pdf</span>
            <span>Export Lookbook PDF</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-space-xs px-space-lg py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm shadow-xl hover:brightness-110 active:scale-95 transition-all font-semibold border border-pearl-highlight cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>New Fabric Swatch</span>
          </button>
        </div>
      </div>

      {/* Metric Ribbon */}
      <div className="p-space-md rounded-xl bg-surface-container-low/70 backdrop-blur-2xl shadow-xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg border border-outline-variant/20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md w-full xl:w-auto">
          <div className="flex flex-col bg-surface-container/60 p-space-sm rounded-lg shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Curated Fabrics</span>
              <span className="material-symbols-outlined text-secondary text-sm">view_in_ar</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">{fabrics.length || 64}</span>
            <span className="font-label-sm text-label-sm text-secondary-fixed-dim">Across 8 Houses</span>
          </div>

          <div className="flex flex-col bg-surface-container/60 p-space-sm rounded-lg shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">In Stock</span>
              <span className="w-2 h-2 rounded-full bg-primary" />
            </div>
            <span className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">48</span>
            <span className="font-label-sm text-label-sm text-primary">1,420m available</span>
          </div>

          <div className="flex flex-col bg-surface-container/60 p-space-sm rounded-lg shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Low Stock Alert</span>
              <span className="w-2 h-2 rounded-full bg-error animate-ping" />
            </div>
            <span className="font-headline-md text-headline-md text-error font-bold mt-0.5">08</span>
            <span className="font-label-sm text-label-sm text-error">Requires Reorder</span>
          </div>

          <div className="flex flex-col bg-surface-container/60 p-space-sm rounded-lg shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">In Transit</span>
              <span className="material-symbols-outlined text-tertiary text-sm">local_shipping</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">08</span>
            <span className="font-label-sm text-label-sm text-tertiary">Lyon &amp; Como Parcels</span>
          </div>

          <div className="flex flex-col bg-surface-container/60 p-space-sm rounded-lg shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Average Density</span>
              <span className="material-symbols-outlined text-outline text-sm">scale</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">285</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">GSM (Medium Weight)</span>
          </div>
        </div>

        {/* Quick Search */}
        <div className="w-full xl:w-96 flex flex-col gap-1">
          <label className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-semibold">
            Textile Search &amp; Composition
          </label>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
              filter_list
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-high/80 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
              placeholder="Search by weave, silk, wool, or supplier..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-space-xs overflow-x-auto pb-1 mobile-scroll-x">
        {FABRIC_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-space-md py-space-xs rounded-full font-title-sm text-title-sm transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-primary-container text-on-primary font-semibold shadow-md border border-pearl-highlight'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest border border-outline-variant/20'
            }`}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 12-Column Split Matrix */}
      <div id="fabric-library-container" className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Catalog (7 Columns) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          {fabrics.map((fabric) => {
            const isSelected = activeFabric.id === fabric.id
            const isLowStock = fabric.availability === 'limited'

            return (
              <article
                key={fabric.id}
                onClick={() => setSelectedFabricId(fabric.id)}
                className={`cursor-pointer p-space-lg rounded-xl transition-all duration-300 shadow-xl relative group border ${
                  isSelected
                    ? 'bg-surface-container-low border-primary shadow-[0_0_20px_rgba(128,0,32,0.3)]'
                    : 'bg-surface-container-low/70 hover:bg-surface-container-low border-outline-variant/20'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-space-md items-start md:items-center">
                  {/* Custom CSS Tactile Swatch Texture Box (No photos) */}
                  <div
                    className="relative w-full md:w-36 h-36 rounded-lg overflow-hidden flex-shrink-0 shadow-md flex items-center justify-center border border-outline-variant/30"
                    style={{
                      background: isSelected
                        ? 'radial-gradient(circle at 30% 30%, #800020 0%, #5C0016 70%, #160b0f 100%)'
                        : 'radial-gradient(circle at 30% 30%, #34262b 0%, #25181d 70%, #160b0f 100%)',
                    }}
                  >
                    <span className="material-symbols-outlined text-4xl text-primary/60 group-hover:scale-110 transition-transform">
                      texture
                    </span>
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-sm" />
                      <span className="font-label-sm text-[10px] text-on-surface uppercase tracking-wider font-semibold">
                        {fabric.type || 'Silk'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-surface-container-lowest/85 font-label-sm text-[10px] text-secondary font-semibold">
                      {fabric.weight || '340 GSM'}
                    </div>
                  </div>

                  {/* Swatch Metadata */}
                  <div className="flex-1 flex flex-col justify-between w-full min-w-0">
                    <div className="flex items-start justify-between gap-space-xs">
                      <div>
                        <div className="flex items-center gap-space-2xs mb-1 flex-wrap">
                          {isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full bg-error-container/60 text-on-error-container font-label-sm text-[10px] tracking-wider uppercase font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
                              Low Stock Alert
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-[10px] tracking-wider uppercase font-semibold">
                              Haute Textile
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] uppercase">
                            AW26 Run
                          </span>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                          {fabric.name}
                        </h2>
                        <p className="font-body-sm text-body-sm text-outline truncate mt-0.5">
                          {fabric.texture || '100% Silk • Luminous lustrous sheen'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">
                          ${fabric.cost_per_meter || 68}.00
                        </span>
                        <span className="block font-label-sm text-label-sm text-outline">per meter</span>
                      </div>
                    </div>

                    {/* Quantitative Attributes */}
                    <div className="grid grid-cols-3 gap-space-xs mt-space-sm pt-space-xs border-t border-outline-variant/20">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-outline font-semibold">Inventory</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-error' : 'bg-primary'}`} />
                          <span className="font-title-sm text-title-sm text-on-surface font-bold">42.5m</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-outline font-semibold">Provenance</span>
                        <span className="font-title-sm text-title-sm text-on-surface truncate mt-0.5">
                          {fabric.supplier_name || 'Maison de Soie'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase text-outline font-semibold">Care &amp; Wash</span>
                        <div className="flex items-center gap-1 text-on-surface-variant mt-0.5">
                          <span className="material-symbols-outlined text-sm text-tertiary">dry_cleaning</span>
                          <span className="font-body-sm text-body-sm truncate">{fabric.care_instructions || 'Dry Clean'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Right Active Swatch Inspection Console (5 Columns) */}
        <div className="xl:col-span-5 sticky top-24">
          <aside className="p-space-lg rounded-2xl bg-surface-container/85 backdrop-blur-3xl shadow-2xl flex flex-col gap-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="p-2 rounded-lg bg-primary-container text-on-primary shadow-sm flex items-center justify-center border border-pearl-highlight">
                  <span className="material-symbols-outlined text-base">smb_share</span>
                </span>
                <div>
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-semibold">
                    Spectrometry &amp; Atelier Lab
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    {activeFabric.name}
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary font-label-sm text-[11px] tracking-wider uppercase font-bold border border-primary/30">
                Grade 6A
              </span>
            </div>

            {/* Macro Zoom Inspection Plate (CSS texture gradient, no photo) */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary-container/60 via-surface-container-high to-surface-container-lowest shadow-inner border border-outline-variant/30 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 z-10 text-on-surface">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">biotech</span>
                <span className="font-label-sm text-xs text-outline uppercase tracking-widest font-semibold">
                  50x Optical Macro Lens
                </span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">
                  Warp: 120/cm • Weft: 88/cm
                </span>
              </div>
            </div>

            {/* Lab Benchmarks */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-outline">
                <span className="font-label-sm text-[11px] uppercase tracking-wider font-semibold">
                  Laboratory Drapability &amp; Stress Scores
                </span>
                <span className="font-label-sm text-[11px] text-primary font-bold">Cusick Drape: 68%</span>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="p-space-sm rounded-lg bg-surface-container-low/70 flex flex-col gap-1 border border-outline-variant/10">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">Sculptural Rigidity</span>
                    <span className="font-label-sm text-[11px] text-primary font-bold">8.5 / 10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span className="font-label-sm text-[9px] text-outline">Ideal for ballgowns &amp; corsetry</span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low/70 flex flex-col gap-1 border border-outline-variant/10">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">Light Reflection Coeff.</span>
                    <span className="font-label-sm text-[11px] text-secondary font-bold">9.2 / 10</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="font-label-sm text-[9px] text-outline">High mirror specular luster</span>
                </div>
              </div>
            </div>

            {/* Burn Test Certification */}
            <div className="p-space-sm rounded-lg bg-surface-container-low/80 flex items-start gap-space-sm shadow-sm border border-outline-variant/20">
              <div className="p-2 rounded-md bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-base">local_fire_department</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-2xs">
                  <span className="font-title-sm text-title-sm text-on-surface font-semibold">Burn Test Certification</span>
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">
                  Smells of burning hair; leaves soft, dark crushable ash bead. Extinguishes immediately. Zero synthetic melting residues verified.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Add New Swatch Modal */}
      <GlassModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Fabric Swatch Entry" size="md">
        <form onSubmit={handleCreate} className="p-space-lg flex flex-col gap-space-md">
          <div className="form-group">
            <label className="input-label">Fabric Name *</label>
            <input
              required
              className="input"
              placeholder="e.g. Mulberry Silk Duchess Satin"
              value={newFabric.name}
              onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="form-group">
              <label className="input-label">Material Type</label>
              <input
                className="input"
                placeholder="Silk, Wool, Linen..."
                value={newFabric.type}
                onChange={(e) => setNewFabric({ ...newFabric, type: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Weight (GSM)</label>
              <input
                className="input"
                placeholder="340 GSM"
                value={newFabric.weight}
                onChange={(e) => setNewFabric({ ...newFabric, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div className="form-group">
              <label className="input-label">Cost per Meter ($)</label>
              <input
                type="number"
                className="input"
                value={newFabric.cost_per_meter}
                onChange={(e) => setNewFabric({ ...newFabric, cost_per_meter: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Supplier Name</label>
              <input
                className="input"
                placeholder="Maison de Soie"
                value={newFabric.supplier_name}
                onChange={(e) => setNewFabric({ ...newFabric, supplier_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Care Instructions</label>
            <input
              className="input"
              placeholder="Dry Clean Only"
              value={newFabric.care_instructions}
              onChange={(e) => setNewFabric({ ...newFabric, care_instructions: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all border border-pearl-highlight mt-2"
          >
            Save Fabric Swatch
          </button>
        </form>
      </GlassModal>
    </div>
  )
}
