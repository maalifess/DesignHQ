import React, { useState } from 'react'
import { useAtelierStore } from '@/store/useAtelierStore'

interface FabricItem {
  key: string
  code: string
  name: string
  category: string
  composition: string
  price: number
  gsm: number
  colorName: string
  colorHex: string
  stockMeters: number
  stockLabel: string
  stockStatus: 'in_stock' | 'low_stock' | 'in_transit'
  supplier: string
  location: string
  care: string
  image: string
  grade: string
  warpWeft: string
  cusickDrape: string
  rigidityVal: number
  rigidityLabel: string
  rigidityDesc: string
  sheenVal: number
  sheenLabel: string
  sheenDesc: string
  burnTest: string
  lineage: string
  repName: string
  leadTime: string
  supplierTier: string
}

const INITIAL_FABRICS_DATA: FabricItem[] = [
  {
    key: 'satin',
    code: 'SW-SATIN-800',
    name: 'Mulberry Silk Duchess Satin',
    category: 'Silks & Satins',
    composition: '100% Mulberry Silk, luminous sheen, no stretch',
    price: 68.0,
    gsm: 340,
    colorName: 'Haute Crimson',
    colorHex: '#800020',
    stockMeters: 42.5,
    stockLabel: '42.5m — In Stock',
    stockStatus: 'in_stock',
    supplier: 'Maison de Soie',
    location: 'Lyon, France',
    care: 'Dry Clean Only',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYXiyur532gaNSCCnps3Ias-c0mDhQz2GPOcbpj7PaIa2WG1d9xKCj23w1Kl9q3jF7gWa8JZPUSkUAh7DxSA3ucWRLSfbiqxTGes-Cs1HQsl7WieZnBphtKk0SqCSXElCm-jQJd0kGfNTCooxHPauSAikMFIIZj82kKjsJflViapAdEnGdgV11ZadlrYUTUTeN9I44k3JOz8jBetGKHBqeb2clblb_Se2fSuo4G3EzM4qroTQ03nT2Mw',
    grade: 'Grade 6A',
    warpWeft: 'Warp: 120/cm • Weft: 88/cm',
    cusickDrape: '68%',
    rigidityVal: 85,
    rigidityLabel: '8.5/10',
    rigidityDesc: 'Ideal for ballgowns & structured corsetry',
    sheenVal: 92,
    sheenLabel: '9.2/10',
    sheenDesc: 'High mirror specular luster under runway spots',
    burnTest: 'Smells of burning hair/feathers; leaves soft, dark, crushable irregular ash bead. Extinguishes immediately upon removal from flame. Zero synthetic melting residues verified.',
    lineage: 'Crimson Reverie (AW26) → Look 02 Siren Gown (Pattern #CR-26-02)',
    repName: 'Jean-Luc Moreau',
    leadTime: '7 days',
    supplierTier: 'Tier 1 Maison',
  },
  {
    key: 'wool',
    code: 'SW-WOOL-480',
    name: 'Sartorial Melton Wool',
    category: 'Wool & Cashmere',
    composition: '95% Virgin Wool, 5% Cashmere, dense brushed finish',
    price: 94.0,
    gsm: 480,
    colorName: 'Midnight Onyx',
    colorHex: '#160b0f',
    stockMeters: 14.0,
    stockLabel: '14.0m — Reserve Alert / Low Stock Critical',
    stockStatus: 'low_stock',
    supplier: 'Lanificio Colombo',
    location: 'Biella, Italy',
    care: 'Steam & Dry Clean',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApxYIHFd-Cl4zn5eTnZusOVkTkc3Vv5K4bdDPK5IMTr65DLAHXsjYs6ZxRubDT_6hXmJk6vtYbhd5ahMJBkIXZ197Zly_GzI3smcTtrW7HazJh9nAqo6eeh2x3JLXxQkz1IFcHeM7KRnGlsrIHe8wlUByyeEAQQJngVTlV9zsJ9zZuK60LVcONoEVlFWq1xvblydPcmFq6EuSK1C7D_wvOc4d-6boAgrsuBtzZVjlEaRsrEIAMzu4FcA',
    grade: 'Grade S150',
    warpWeft: 'Warp: 96/cm • Weft: 72/cm',
    cusickDrape: '82%',
    rigidityVal: 90,
    rigidityLabel: '9.0/10',
    rigidityDesc: 'Dense sculptural structure tailored for heavy coats',
    sheenVal: 21,
    sheenLabel: '2.1/10',
    sheenDesc: 'Matte brushed wool surface absorbing directional light',
    burnTest: 'Pure protein fiber burn reaction. Smells distinctly of charred hair; leaves a soft, dark, irregular crushable black crumbly ash with zero hard bead formation.',
    lineage: 'Crimson Reverie (AW26) → Look 08 Cocoon Coat (Pattern #CR-26-08)',
    repName: 'Matteo Rossi',
    leadTime: '14 days',
    supplierTier: 'Tier 1 Mill',
  },
  {
    key: 'organza',
    code: 'SW-ORG-110',
    name: 'Plissé Organza Chiffon',
    category: 'Lace & Tulle',
    composition: '100% Silk Chiffon, fine accordion pleat, 2-way mechanical stretch',
    price: 52.0,
    gsm: 110,
    colorName: 'Dusty Rose',
    colorHex: '#C05070',
    stockMeters: 65.0,
    stockLabel: '65.0m — Abundant',
    stockStatus: 'in_stock',
    supplier: 'Como Textiles',
    location: 'Lake Como, Italy',
    care: 'Delicate Hand Steam',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi-cuRvVKmSzYL3w2jbrgNNHx-MWjD4FqnjrKpBg8RlpIvJuIniluKJRcc3HVd8C9-t8k3k4v0HDtrpNDk2TTd8rxqmFqj0IJiXur94qFwK9D5NvYCyko-SWI5skuQJCxCIVE4LFBvNugCgVdgtGLBKdJPCJVGCh0ZWb5nGw8YfvCyPbHkxvCDxqHbyqsiC2iiHHpaYH5sTC1SsDt8d00zAXHqjNjDEjJvYcqACB0XQLMQCViqvYKrSQ',
    grade: 'Grade 5A',
    warpWeft: 'Warp: 140/cm • Weft: 110/cm',
    cusickDrape: '34%',
    rigidityVal: 42,
    rigidityLabel: '4.2/10',
    rigidityDesc: 'Ultra-light sheer drape for fluid overlays',
    sheenVal: 78,
    sheenLabel: '7.8/10',
    sheenDesc: 'Luminous translucent radiance under rim lighting',
    burnTest: 'Burns with a bright small flickering flame, producing a light grey-white smoke and dark charcoal micro-burn edge. Retains heat-memory pleat structure.',
    lineage: 'Crimson Reverie (AW26) → Look 05 Flou Capelet (Pattern #CR-26-05)',
    repName: 'Elena Bellini',
    leadTime: '10 days',
    supplierTier: 'Tier 2 Atelier',
  },
  {
    key: 'velvet',
    code: 'SW-VELVET-390',
    name: 'Crushed Silk Velvet',
    category: 'Silks & Satins',
    composition: '82% Rayon, 18% Silk, heavy pile, high directional sheen',
    price: 78.0,
    gsm: 390,
    colorName: 'Crimson Wine',
    colorHex: '#5C0016',
    stockMeters: 28.0,
    stockLabel: '28.0m — In Stock',
    stockStatus: 'in_stock',
    supplier: 'Guigou Paris',
    location: 'Paris, France',
    care: 'Velvet Needle Board Dry Clean',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyo2wq7MnyGIJ38qxWJbPr7cExho3a8LO1Fr6-Q9FmFn60-EWbP8gGcQ1yAOlZbjXKFux4meJdhSeSn--RG49wSeaBb_NXqQq2Cc7WQf47JTqi3NCIPYGUSJKqkRmM0oum3STZaVc2-lRmXe8xmlDxgwZSOgopiXin14AftsPus2QJw6Ni2WbCypWBoLk9uhi0FPnukZlBF8ElgpDGXuazeLCvo7PvzcLoV2paUrOIBS7NO3mTgnMzUg',
    grade: 'Grade 6A Velvet',
    warpWeft: 'Warp: 110/cm • Weft: 80/cm',
    cusickDrape: '74%',
    rigidityVal: 70,
    rigidityLabel: '7.0/10',
    rigidityDesc: 'Substantial structural body with fluid pile movement',
    sheenVal: 95,
    sheenLabel: '9.5/10',
    sheenDesc: 'Rich directional depth with velvet iridescence',
    burnTest: 'Dual-fiber reaction. Rayon pile burns rapidly with clean paper-wood aroma while silk ground leaves soft dark ash beads.',
    lineage: 'Crimson Reverie (AW26) → Look 04 Velvet Opera Cape (Pattern #CR-26-09)',
    repName: 'Sylvie Delacroix',
    leadTime: '5 days',
    supplierTier: 'Tier 1 Maison',
  },
  {
    key: 'habotai',
    code: 'SW-HABOTAI-65',
    name: 'Habotai Silk Lining',
    category: 'Linings & Canvas',
    composition: '100% Silk, smooth featherlight hand, anti-static',
    price: 24.50,
    gsm: 65,
    colorName: 'Pearl Habotai',
    colorHex: '#f4dce3',
    stockMeters: 5.0,
    stockLabel: '5.0m on-hand + 50m in transit',
    stockStatus: 'in_transit',
    supplier: 'Lyon Soierie',
    location: 'Lyon, France',
    care: 'Cool Hand Wash / Steam',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYXiyur532gaNSCCnps3Ias-c0mDhQz2GPOcbpj7PaIa2WG1d9xKCj23w1Kl9q3jF7gWa8JZPUSkUAh7DxSA3ucWRLSfbiqxTGes-Cs1HQsl7WieZnBphtKk0SqCSXElCm-jQJd0kGfNTCooxHPauSAikMFIIZj82kKjsJflViapAdEnGdgV11ZadlrYUTUTeN9I44k3JOz8jBetGKHBqeb2clblb_Se2fSuo4G3EzM4qroTQ03nT2Mw',
    grade: 'Grade 5A',
    warpWeft: 'Warp: 150/cm • Weft: 130/cm',
    cusickDrape: '22%',
    rigidityVal: 25,
    rigidityLabel: '2.5/10',
    rigidityDesc: 'Featherlight supple drape for luxury garment linings',
    sheenVal: 60,
    sheenLabel: '6.0/10',
    sheenDesc: 'Soft pearlescent sheen enhancing internal garment finish',
    burnTest: 'Rapid clean extinguishment upon flame removal. Leaves fragile, light grey-black ash spheres with zero melt drip.',
    lineage: 'Crimson Reverie (AW26) → Look 01 Peplum Jacket Lining (Pattern #CR-26-01)',
    repName: 'Marc Vernier',
    leadTime: 'shipment in transit via DHL Express',
    supplierTier: 'Tier 1 Soierie',
  },
]

export default function Fabrics() {
  const [fabricsList, setFabricsList] = useState<FabricItem[]>(INITIAL_FABRICS_DATA)
  const [selectedKey, setSelectedKey] = useState<string>('satin')
  const [activeCategory, setActiveCategory] = useState<string>('All Materials')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [contactModalRep, setContactModalRep] = useState<string | null>(null)
  const [orderToast, setOrderToast] = useState<string | null>(null)

  // New Swatch Form state
  const [newFabricName, setNewFabricName] = useState('')
  const [newCategory, setNewCategory] = useState('Silks & Satins')
  const [newComposition, setNewComposition] = useState('')
  const [newPrice, setNewPrice] = useState('65')
  const [newGSM, setNewGSM] = useState('280')
  const [newSupplier, setNewSupplier] = useState('')
  const [newColorHex, setNewColorHex] = useState('#800020')

  const selectedFabric = fabricsList.find((f) => f.key === selectedKey) || fabricsList[0]

  const filteredFabrics = fabricsList.filter((f) => {
    const matchCategory = activeCategory === 'All Materials' || f.category === activeCategory
    const matchQuery =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.composition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchQuery
  })

  const addFabricStore = useAtelierStore((state) => state.addFabric)

  const handleCreateSwatch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFabricName) return
    const key = `swatch-${Date.now()}`
    const newItem: FabricItem = {
      key,
      code: `SW-CUSTOM-${Math.floor(Math.random() * 900 + 100)}`,
      name: newFabricName,
      category: newCategory,
      composition: newComposition || '100% Fine Couture Textile',
      price: parseFloat(newPrice) || 60,
      gsm: parseInt(newGSM) || 280,
      colorName: 'Custom Dye',
      colorHex: newColorHex,
      stockMeters: 50.0,
      stockLabel: '50.0m — Newly Sourced',
      stockStatus: 'in_stock',
      supplier: newSupplier || 'Maison Direct',
      location: 'Paris, France',
      care: 'Dry Clean Only',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYXiyur532gaNSCCnps3Ias-c0mDhQz2GPOcbpj7PaIa2WG1d9xKCj23w1Kl9q3jF7gWa8JZPUSkUAh7DxSA3ucWRLSfbiqxTGes-Cs1HQsl7WieZnBphtKk0SqCSXElCm-jQJd0kGfNTCooxHPauSAikMFIIZj82kKjsJflViapAdEnGdgV11ZadlrYUTUTeN9I44k3JOz8jBetGKHBqeb2clblb_Se2fSuo4G3EzM4qroTQ03nT2Mw',
      grade: 'Grade 6A',
      warpWeft: 'Warp: 120/cm • Weft: 90/cm',
      cusickDrape: '65%',
      rigidityVal: 75,
      rigidityLabel: '7.5/10',
      rigidityDesc: 'Balanced drape and structure for atelier garments',
      sheenVal: 80,
      sheenLabel: '8.0/10',
      sheenDesc: 'Luminous directional sheen',
      burnTest: 'Smells of burning hair/feathers; leaves soft, crushable dark ash bead. Zero synthetic melting residues.',
      lineage: 'Ariba Atelier Swatch Collection',
      repName: 'Jean-Luc Moreau',
      leadTime: '7 days',
      supplierTier: 'Tier 1 Maison',
    }

    addFabricStore({
      name: newFabricName,
      type: newCategory,
      weight: `${newGSM} GSM`,
      origin: newSupplier || 'Paris, France',
      metersLeft: 50.0,
      availability: 'In Stock',
      imageUrl: newItem.image,
      costPerMeter: parseFloat(newPrice) || 60,
      supplier: newSupplier || 'Maison Direct',
    })

    setFabricsList([newItem, ...fabricsList])
    setSelectedKey(key)
    setShowAddModal(false)
    setNewFabricName('')
  }

  const handleOrderBolt = (fabric: FabricItem) => {
    setFabricsList((prev) =>
      prev.map((f) =>
        f.key === fabric.key
          ? {
              ...f,
              stockMeters: f.stockMeters + 50,
              stockLabel: `${f.stockMeters + 50}m — Bolt Ordered (+50m)`,
              stockStatus: 'in_stock',
            }
          : f
      )
    )
    setOrderToast(`Order placed for 50 meters of ${fabric.name} with ${fabric.supplier}!`)
    setTimeout(() => setOrderToast(null), 3000)
  }

  const handleExportLookbookPDF = () => {
    window.print()
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Toast Notification */}
      {orderToast && (
        <div className="fixed top-20 right-6 z-50 px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm shadow-2xl animate-bounce">
          {orderToast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md border-b border-outline-variant/20 pb-space-lg">
        <div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight">
            Digital Fabric &amp; Material Swatch Library
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Catalog, inventory levels, microscopic textile specs, lab drape metrics, supplier provenance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md">
            Season: <strong>AW26</strong>
          </span>
          <button
            onClick={handleExportLookbookPDF}
            type="button"
            className="px-space-sm py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
          >
            Export Lookbook PDF
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            type="button"
            className="flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Fabric Swatch</span>
          </button>
        </div>
      </div>

      {/* Metric Ribbon (5 Tiles) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 shadow-lg">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">Curated Fabrics</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-1 block font-bold">{fabricsList.length}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Across 8 Houses</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 shadow-lg">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">In Stock</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-1 block font-bold">
            {fabricsList.filter((f) => f.stockStatus === 'in_stock').length}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">1,420m available</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 shadow-lg">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">Low Stock Alert</span>
          <span className="font-headline-lg text-headline-lg text-error my-1 block font-bold">
            0{fabricsList.filter((f) => f.stockStatus === 'low_stock').length}
          </span>
          <span className="font-body-sm text-body-sm text-error font-semibold">Requires Reorder</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 shadow-lg">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">In Transit</span>
          <span className="font-headline-lg text-headline-lg text-secondary my-1 block font-bold">
            0{fabricsList.filter((f) => f.stockStatus === 'in_transit').length}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Lyon &amp; Como Parcels</span>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-low/80 backdrop-blur-xl border border-outline-variant/20 shadow-lg">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block">Average Density</span>
          <span className="font-headline-lg text-headline-lg text-on-surface my-1 block font-bold">285</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">GSM (Medium Weight)</span>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search by weave, composition (silk, wool, linen), or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-space-md py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
          />
        </div>

        <div className="flex items-center gap-space-2xs overflow-x-auto pb-1 mobile-scroll-x">
          {[
            { label: 'All Materials', count: fabricsList.length },
            { label: 'Silks & Satins', count: fabricsList.filter((f) => f.category === 'Silks & Satins').length },
            { label: 'Wool & Cashmere', count: fabricsList.filter((f) => f.category === 'Wool & Cashmere').length },
            { label: 'Linings & Canvas', count: fabricsList.filter((f) => f.category === 'Linings & Canvas').length },
            { label: 'Lace & Tulle', count: fabricsList.filter((f) => f.category === 'Lace & Tulle').length },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className={`px-space-sm py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.label
                  ? 'bg-primary-container text-on-primary font-semibold shadow-[0_2px_10px_rgba(128,0,32,0.4)]'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Catalog & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left 7 Columns: Fabric Cards List */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          {filteredFabrics.map((fabric) => {
            const isSelected = selectedKey === fabric.key
            return (
              <div
                key={fabric.key}
                onClick={() => setSelectedKey(fabric.key)}
                className={`rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl p-space-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/40 bg-surface-container-low'
                    : 'border-outline-variant/20 hover:border-outline-variant/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
                  <img
                    alt={fabric.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-md border border-outline-variant/30"
                    src={fabric.image}
                  />

                  <div className="flex flex-col min-w-0 flex-1 gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-title-sm text-title-sm text-on-surface font-bold truncate">
                        {fabric.name}
                      </h3>
                      <span className="font-title-sm text-title-sm text-primary font-bold">
                        ${fabric.price.toFixed(2)}/m
                      </span>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {fabric.category} • {fabric.composition}
                    </p>

                    <div className="flex flex-wrap items-center gap-space-xs mt-1">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-semibold">
                        {fabric.gsm} GSM
                      </span>
                      <span
                        className="w-4 h-4 rounded-full shadow-inner border border-outline-variant/40"
                        style={{ backgroundColor: fabric.colorHex }}
                        title={fabric.colorName}
                      />
                      <span className="font-label-sm text-label-sm text-outline">{fabric.colorName}</span>

                      <span className="text-outline">•</span>
                      <span
                        className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                          fabric.stockStatus === 'low_stock'
                            ? 'bg-error-container text-on-error'
                            : fabric.stockStatus === 'in_transit'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-primary-container/40 text-primary'
                        }`}
                      >
                        {fabric.stockLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-label-sm font-label-sm text-outline mt-1">
                      <span>Supplier: {fabric.supplier} ({fabric.location})</span>
                      <span>Care: {fabric.care}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right 5 Columns: Spectrometry & Atelier Lab Inspector (Sticky Drawer) */}
        <div className="lg:col-span-5 sticky top-topbar-height flex flex-col gap-space-md">
          <div className="rounded-xl bg-surface-container-low/95 backdrop-blur-2xl shadow-2xl border border-outline-variant/30 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">biotech</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Spectrometry &amp; Atelier Lab</h3>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold">
                {selectedFabric.grade}
              </span>
            </div>

            {/* Selected Fabric Title & Macro Image */}
            <div className="flex flex-col gap-space-xs">
              <h4 className="font-title-md text-title-md text-on-surface font-bold">
                {selectedFabric.name}
              </h4>
              <p className="font-body-sm text-body-sm text-outline">Code: {selectedFabric.code}</p>

              <div className="relative w-full h-44 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-lowest mt-1">
                <img
                  alt="50x Optical Lens Macro"
                  className="w-full h-full object-cover"
                  src={selectedFabric.image}
                />
                <span className="absolute bottom-2 right-2 px-space-xs py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-outline font-label-sm text-[10px]">
                  50x Optical Macro Lens
                </span>
              </div>
            </div>

            {/* Lab Metrics Grid */}
            <div className="flex flex-col gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-outline">Weave Density:</span>
                <span className="text-on-surface font-semibold">{selectedFabric.warpWeft}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-outline">Cusick Drape Index:</span>
                <span className="text-primary font-bold">{selectedFabric.cusickDrape}</span>
              </div>

              {/* Sculptural Rigidity Bar */}
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Sculptural Rigidity</span>
                  <span className="text-primary font-bold">{selectedFabric.rigidityLabel} ({selectedFabric.rigidityVal}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-container"
                    style={{ width: `${selectedFabric.rigidityVal}%` }}
                  />
                </div>
                <span className="font-label-sm text-[10px] text-outline italic">{selectedFabric.rigidityDesc}</span>
              </div>

              {/* Light Reflection Bar */}
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Light Reflection Coefficient</span>
                  <span className="text-secondary font-bold">{selectedFabric.sheenLabel} ({selectedFabric.sheenVal}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full rounded-full bg-secondary-container"
                    style={{ width: `${selectedFabric.sheenVal}%` }}
                  />
                </div>
                <span className="font-label-sm text-[10px] text-outline italic">{selectedFabric.sheenDesc}</span>
              </div>
            </div>

            {/* Burn Test Certification Narrative */}
            <div className="p-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-1 border border-outline-variant/10">
              <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">local_fire_department</span> Burn Test Certification
              </span>
              <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                {selectedFabric.burnTest}
              </p>
            </div>

            {/* Active Collection Lineage */}
            <div className="flex flex-col gap-0.5">
              <span className="font-label-sm text-label-sm text-outline">Active Collection Lineage:</span>
              <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                {selectedFabric.lineage}
              </span>
            </div>

            {/* Supplier Console */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col gap-1 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-title-sm text-title-sm text-on-surface font-bold">
                  {selectedFabric.supplier} ({selectedFabric.location})
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-semibold">
                  {selectedFabric.supplierTier}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Atelier Direct Contact: <strong>{selectedFabric.repName}</strong> • lead-time: {selectedFabric.leadTime}
              </span>
            </div>

            {/* Inspector Action Buttons */}
            <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
              <button
                type="button"
                onClick={() => handleOrderBolt(selectedFabric)}
                className="py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer shadow-md"
              >
                Order Bolt (50m)
              </button>
              <button
                type="button"
                onClick={() => setContactModalRep(selectedFabric.repName)}
                className="py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm text-center transition-colors cursor-pointer"
              >
                Contact Mill Rep
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Atelier Fabric Allocation & Cutting Log Table */}
      <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-xl">content_cut</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Atelier Fabric Allocation &amp; Cutting Log</h3>
          </div>
          <span className="font-label-sm text-label-sm text-outline">Updated 12m ago</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline font-label-md text-label-md uppercase tracking-wider">
                <th className="py-space-xs px-space-sm">Swatch ID</th>
                <th className="py-space-xs px-space-sm">Weave &amp; Composition</th>
                <th className="py-space-xs px-space-sm">Allocated Pattern</th>
                <th className="py-space-xs px-space-sm">Cut Status</th>
                <th className="py-space-xs px-space-sm">Remaining Shelf</th>
                <th className="py-space-xs px-space-sm text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm text-on-surface">
              <tr className="hover:bg-surface-container-high/40 transition-colors">
                <td className="py-space-sm px-space-sm font-semibold text-primary">SW-SATIN-800</td>
                <td className="py-space-sm px-space-sm">Mulberry Duchess Satin (340 GSM)</td>
                <td className="py-space-sm px-space-sm">CR-26-02 Siren Gown</td>
                <td className="py-space-sm px-space-sm">
                  <span className="px-2 py-0.5 rounded bg-primary-container/40 text-primary font-semibold">
                    Marked &amp; Pinned
                  </span>
                </td>
                <td className="py-space-sm px-space-sm">42.5 meters</td>
                <td className="py-space-sm px-space-sm text-right">
                  <button onClick={() => setSelectedKey('satin')} className="text-primary hover:underline font-semibold cursor-pointer" type="button">
                    Inspect Spec
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-high/40 transition-colors">
                <td className="py-space-sm px-space-sm font-semibold text-error">SW-WOOL-480</td>
                <td className="py-space-sm px-space-sm">Sartorial Melton Wool (480 GSM)</td>
                <td className="py-space-sm px-space-sm">CR-26-08 Cocoon Coat</td>
                <td className="py-space-sm px-space-sm">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error font-bold flex items-center gap-1 w-max">
                    <span className="material-symbols-outlined text-xs">warning</span> Pattern Exceeds Bolt (-3.5m)
                  </span>
                </td>
                <td className="py-space-sm px-space-sm text-error font-semibold">14.0 meters — Deficit Warning</td>
                <td className="py-space-sm px-space-sm text-right">
                  <button onClick={() => handleOrderBolt(fabricsList[1])} className="text-error hover:underline font-bold cursor-pointer" type="button">
                    Reorder Bolt
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-high/40 transition-colors">
                <td className="py-space-sm px-space-sm font-semibold text-secondary">SW-ORG-110</td>
                <td className="py-space-sm px-space-sm">Plissé Organza Chiffon (110 GSM)</td>
                <td className="py-space-sm px-space-sm">CR-26-05 Flou Capelet</td>
                <td className="py-space-sm px-space-sm">
                  <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary font-semibold">
                    Rough Cut Dispatched
                  </span>
                </td>
                <td className="py-space-sm px-space-sm">65.0 meters</td>
                <td className="py-space-sm px-space-sm text-right">
                  <button onClick={() => setSelectedKey('organza')} className="text-tertiary hover:underline font-semibold cursor-pointer" type="button">
                    Inspect Spec
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Swatch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreateSwatch}
            className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">New Fabric Swatch</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Fabric Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Italian Silk Faille"
                  value={newFabricName}
                  onChange={(e) => setNewFabricName(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                >
                  <option value="Silks & Satins">Silks &amp; Satins</option>
                  <option value="Wool & Cashmere">Wool &amp; Cashmere</option>
                  <option value="Linings & Canvas">Linings &amp; Canvas</option>
                  <option value="Lace & Tulle">Lace &amp; Tulle</option>
                  <option value="Hardware & Trims">Hardware &amp; Trims</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Composition</label>
                <input
                  type="text"
                  placeholder="100% Silk Faille"
                  value={newComposition}
                  onChange={(e) => setNewComposition(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Price per Meter ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">GSM Density</label>
                <input
                  type="number"
                  value={newGSM}
                  onChange={(e) => setNewGSM(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Supplier House</label>
                <input
                  type="text"
                  placeholder="Maison de Soie (Lyon)"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Add Fabric Swatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contact Mill Rep Modal */}
      {contactModalRep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Contact Mill Representative
              </h3>
              <button type="button" onClick={() => setContactModalRep(null)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-xs text-body-sm font-body-sm">
              <p className="text-on-surface-variant">
                Direct dispatch message for <strong>{contactModalRep}</strong> regarding order inquiry:
              </p>
              <textarea
                rows={4}
                defaultValue={`Hello ${contactModalRep}, Ariba from Royal College of Art Atelier requesting updated swatch specs and shipping timeline...`}
                className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setContactModalRep(null)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setContactModalRep(null)
                  setOrderToast(`Message sent directly to ${contactModalRep}!`)
                  setTimeout(() => setOrderToast(null), 3000)
                }}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
