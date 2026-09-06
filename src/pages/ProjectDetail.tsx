import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAtelierStore } from '@/store/useAtelierStore'

interface GarmentLook {
  id: string
  number: string
  patternNo: string
  title: string
  category: string
  status: string
  statusType: 'approved' | 'cutting' | 'warning'
  fabric: string
  notions: string
  nextFitting: string
  modeliste: string
  pieces: number
  description: string
  image: string
}

const INITIAL_LOOKS_DATA: GarmentLook[] = [
  {
    id: 'look-01',
    number: '01',
    patternNo: 'CR-201',
    title: 'Architectural Peplum Jacket',
    category: 'Outerwear/Tailoring',
    status: 'First Toile Approved ✅',
    statusType: 'approved',
    fabric: 'Double-face Wool Crepe',
    notions: 'Horn Buttons & Bone Stiffener',
    nextFitting: 'Tomorrow, 10:30 AM',
    modeliste: 'Elena Rossi',
    pieces: 14,
    description: 'Exaggerated shoulder architecture paired with hand-canvassed chest reinforcement. Features a sharp pinched waist flaring into asymmetric peplum origami folds.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyo2wq7MnyGIJ38qxWJbPr7cExho3a8LO1Fr6-Q9FmFn60-EWbP8gGcQ1yAOlZbjXKFux4meJdhSeSn--RG49wSeaBb_NXqQq2Cc7WQf47JTqi3NCIPYGUSJKqkRmM0oum3STZaVc2-lRmXe8xmlDxgwZSOgopiXin14AftsPus2QJw6Ni2WbCypWBoLk9uhi0FPnukZlBF8ElgpDGXuazeLCvo7PvzcLoV2paUrOIBS7NO3mTgnMzUg',
  },
  {
    id: 'look-02',
    number: '02',
    patternNo: 'CR-204',
    title: 'Cascading Bias-Cut Silk Gown',
    category: 'Eveningwear/Drape',
    status: 'Sample in Cutting ✂️',
    statusType: 'cutting',
    fabric: 'Heavy Mulberry Silk (28mm)',
    notions: 'Invisible Riri Zipper, Silk Gimp',
    nextFitting: 'Oct 24, 02:00 PM',
    modeliste: 'Marco Valenti',
    pieces: 6,
    description: 'True 45-degree grain bias drape with zero hem puckering. Back features hand-rolled rouleau ties anchored by microscopic French seam finishes.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAk63iKooBms-E_I__xCiPC3FeLXgIeMCT4l6Nx9CtY5Gd-P__2v8sr786C_tzcOpQVzqMAtTICjJCaUadCqspWiVOZLCJUDyV1Q2jUnJ53TtrDq5Ffv0hYXBfA-IdsAYZa73lKGRSsHkTgg_xc69StMxFi3TX7g519i_EM3L7gH0xqHua6IoY2sk371RBVTC7csA9nog5r10bZK6vXgHGFYac57wfwV-rtPcIPOUN1zK1JuUQMeJObw',
  },
  {
    id: 'look-03',
    number: '03',
    patternNo: 'CR-207',
    title: 'Tailored Wide-Leg Trousers',
    category: 'Separates/Tailoring',
    status: 'Sample Approved by Studio Director ✅',
    statusType: 'approved',
    fabric: 'Worsted Fine Flannel (Onyx)',
    notions: 'Mother-of-Pearl Waist Fastener',
    nextFitting: 'Fitting Passed (Ready)',
    modeliste: 'Elena Rossi',
    pieces: 8,
    description: 'Double-forward front pleats, Hollywood waistband construction, internal curtain waistband with hand-stitched pick accents along slant pockets.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApxYIHFd-Cl4zn5eTnZusOVkTkc3Vv5K4bdDPK5IMTr65DLAHXsjYs6ZxRubDT_6hXmJk6vtYbhd5ahMJBkIXZ197Zly_GzI3smcTtrW7HazJh9nAqo6eeh2x3JLXxQkz1IFcHeM7KRnGlsrIHe8wlUByyeEAQQJngVTlV9zsJ9zZuK60LVcONoEVlFWq1xvblydPcmFq6EuSK1C7D_wvOc4d-6boAgrsuBtzZVjlEaRsrEIAMzu4FcA',
  },
  {
    id: 'look-04',
    number: '04',
    patternNo: 'CR-209',
    title: 'Pleated Velvet Opera Cape',
    category: 'Couture/Statement Outerwear',
    status: 'Fitting Adjustment Needed ⚠️',
    statusType: 'warning',
    fabric: 'Silk-Rayon Velvet (Merlot)',
    notions: 'Antiqued Brass Clasp & Chain',
    nextFitting: 'Urgent: Tomorrow, 04:00 PM',
    modeliste: 'Sarah Lindqvist',
    pieces: 11,
    description: 'Sunray pleated silk-velvet paneling with structured neck pedestal. Shoulder line requires 1.5cm forward grainline rotation to eliminate collar tension.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYXiyur532gaNSCCnps3Ias-c0mDhQz2GPOcbpj7PaIa2WG1d9xKCj23w1Kl9q3jF7gWa8JZPUSkUAh7DxSA3ucWRLSfbiqxTGes-Cs1HQsl7WieZnBphtKk0SqCSXElCm-jQJd0kGfNTCooxHPauSAikMFIIZj82kKjsJflViapAdEnGdgV11ZadlrYUTUTeN9I44k3JOz8jBetGKHBqeb2clblb_Se2fSuo4G3EzM4qroTQ03nT2Mw',
  },
]

export default function ProjectDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { profile } = useAuth()
  const designerName = profile?.display_name || profile?.full_name || 'Ariba'

  const projects = useAtelierStore((state) => state.projects)
  const activeProject = projects.find((p) => p.id === id) || projects[0]

  const projectTitle = activeProject?.title || 'Ariba Haute Couture Collection'
  const projectCode = activeProject?.code || '#CR-2680'
  const projectCategory = activeProject?.category || 'Haute Couture / Collection'
  const projectTargetDate = activeProject?.targetDate || 'Nov 18, 2026'
  const projectStage = activeProject?.stage || 'Sampling & Fitting Stage (75%)'

  const [looksList, setLooksList] = useState<GarmentLook[]>(INITIAL_LOOKS_DATA)
  const [activeStage, setActiveStage] = useState<number>(6) // Stage 6: Sampling
  const [activeTab, setActiveTab] = useState<string>('garments')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const [showAddLookModal, setShowAddLookModal] = useState<boolean>(false)
  const [showAiAnalysisModal, setShowAiAnalysisModal] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New Look Form
  const [newLookTitle, setNewLookTitle] = useState('')
  const [newLookCategory, setNewLookCategory] = useState('Outerwear/Tailoring')
  const [newLookFabric, setNewLookFabric] = useState('Silk Velvet')
  const [newLookNotions, setNewLookNotions] = useState('Horn Buttons')
  const [newLookModeliste, setNewLookModeliste] = useState('Ariba')
  const [newLookDesc, setNewLookDesc] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleAddLook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLookTitle) return
    const num = (looksList.length + 1).toString().padStart(2, '0')
    const newLook: GarmentLook = {
      id: `look-${num}`,
      number: num,
      patternNo: `CR-2${Math.floor(Math.random() * 80 + 10)}`,
      title: newLookTitle,
      category: newLookCategory,
      status: 'Initial Pattern Grading ✂️',
      statusType: 'cutting',
      fabric: newLookFabric,
      notions: newLookNotions,
      nextFitting: 'Next Fitting Scheduled',
      modeliste: newLookModeliste,
      pieces: 10,
      description: newLookDesc || `New garment look created for ${projectTitle}.`,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyo2wq7MnyGIJ38qxWJbPr7cExho3a8LO1Fr6-Q9FmFn60-EWbP8gGcQ1yAOlZbjXKFux4meJdhSeSn--RG49wSeaBb_NXqQq2Cc7WQf47JTqi3NCIPYGUSJKqkRmM0oum3STZaVc2-lRmXe8xmlDxgwZSOgopiXin14AftsPus2QJw6Ni2WbCypWBoLk9uhi0FPnukZlBF8ElgpDGXuazeLCvo7PvzcLoV2paUrOIBS7NO3mTgnMzUg',
    }

    setLooksList([...looksList, newLook])
    setShowAddLookModal(false)
    setNewLookTitle('')
    setNewLookDesc('')
    showToast(`Look ${num} (${newLookTitle}) added to ${projectTitle}!`)
  }

  const filteredLooks = looksList.filter((look) => {
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

      {/* Breadcrumb & Meta Bar */}
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
          <span className="px-space-xs py-0.5 rounded bg-primary-container/40 text-primary font-label-sm text-label-sm font-bold">
            {projectCode}
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <span className="px-space-xs py-1 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Atelier Live Sync • Paris Hub
          </span>
          <button className="p-1 rounded text-outline hover:text-on-surface cursor-pointer" title="Bookmark">
            <span className="material-symbols-outlined text-base">bookmark</span>
          </button>
          <button className="p-1 rounded text-outline hover:text-on-surface cursor-pointer" title="Options">
            <span className="material-symbols-outlined text-base">more_vert</span>
          </button>
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
              <span className="px-space-xs py-0.5 rounded-full bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-semibold">
                {projectStage}
              </span>
              <span className="font-label-sm text-label-sm text-outline">Code: {projectCode}</span>
            </div>

            <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight mt-1 font-bold">
              {projectTitle}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              {activeProject?.description || 'A bespoke architectural couture study merging sculpted velvet silhouettes with bias-draped silks, historic tailoring lines, and modern precision structure.'}
            </p>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md mt-space-xs pt-space-xs border-t border-outline-variant/20">
              <div>
                <span className="font-label-sm text-label-sm text-outline block">Lead Designer</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">{designerName}</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline block">Target Delivery</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">{projectTargetDate}</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline block">Lineup Scope</span>
                <span className="font-title-sm text-title-sm text-on-surface font-semibold">12 Looks Planned</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline block">Atelier Phase</span>
                <span className="font-title-sm text-title-sm text-primary font-bold">Toile Fitting #2</span>
              </div>
            </div>

            {/* Palette Swatch Row */}
            <div className="flex items-center gap-space-xs mt-space-xs">
              <span className="font-label-sm text-label-sm text-outline">Collection Palette:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#5C0016] shadow-md border border-white/20" title="Deep Burgundy (#5C0016)" />
                <span className="w-6 h-6 rounded-full bg-[#800020] shadow-md border border-white/20" title="Crimson Velvet (#800020)" />
                <span className="w-6 h-6 rounded-full bg-[#A0002A] shadow-md border border-white/20" title="Rose Velvet (#A0002A)" />
                <span className="w-6 h-6 rounded-full bg-[#8B4060] shadow-md border border-white/20" title="Dusty Mauve (#8B4060)" />
                <span className="w-6 h-6 rounded-full bg-[#160B0F] shadow-md border border-white/20" title="Onyx Noir (#160B0F)" />
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
                onClick={() => setActiveStage(stage.num)}
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
              onClick={() => setActiveStage(stage.num)}
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
              { id: 'garments', label: `Garments & Tech Packs (${looksList.length})` },
              { id: 'fabrics', label: 'Assigned Fabrics (8)' },
              { id: 'moodboard', label: 'Mood Board Collage' },
              { id: 'fitting', label: 'Fitting Log' },
              { id: 'notes', label: 'Atelier Notes' },
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
        {/* Left 8 Columns: Garment / Look Cards */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {filteredLooks.map((look) => (
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
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">
                        Look {look.number}
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">#{look.patternNo}</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        {look.category}
                      </span>
                    </div>

                    <span
                      className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm font-bold ${
                        look.statusType === 'approved'
                          ? 'bg-primary-container/40 text-primary'
                          : look.statusType === 'cutting'
                          ? 'bg-secondary-container/40 text-secondary'
                          : 'bg-error-container text-on-error'
                      }`}
                    >
                      {look.status}
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                    {look.title}
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                    {look.description}
                  </p>

                  <div className="grid grid-cols-2 gap-space-xs mt-2 pt-space-xs border-t border-outline-variant/20 text-body-sm font-body-sm">
                    <div>
                      <span className="text-outline block text-[11px]">Primary Textile:</span>
                      <span className="text-on-surface font-semibold">{look.fabric}</span>
                    </div>
                    <div>
                      <span className="text-outline block text-[11px]">Hardware &amp; Notions:</span>
                      <span className="text-on-surface font-semibold">{look.notions}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-space-xs mt-2 pt-space-2xs text-label-sm font-label-sm text-outline">
                    <span>Modéliste: <strong className="text-on-surface">{look.modeliste}</strong> ({look.pieces} pieces)</span>
                    <span className="text-secondary font-semibold">Next Fitting: {look.nextFitting}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center font-label-sm text-label-sm text-outline py-space-xs">
            Showing {filteredLooks.length} of 12 Lineup Looks
          </div>
        </div>

        {/* Right 4 Columns: Right Rail Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Fitting Schedule (Milan Studio) */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">straighten</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Fitting Schedule</h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Milan Studio</span>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="p-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-0.5 border border-outline-variant/10">
                <div className="flex items-center justify-between text-title-sm font-title-sm">
                  <span className="text-on-surface font-bold">01 Peplum Jacket</span>
                  <span className="text-primary font-bold">Tomorrow, 10:30 AM</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Model: Maya Lin (Size 36 FR) • Focus: Armhole depth &amp; peplum flare
                </span>
              </div>

              <div className="p-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-0.5 border border-outline-variant/10">
                <div className="flex items-center justify-between text-title-sm font-title-sm">
                  <span className="text-on-surface font-bold">04 Velvet Opera Cape</span>
                  <span className="text-error font-bold">Tomorrow, 04:00 PM</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Model: Maya Lin (Size 36 FR) • Focus: Collar stand tension release
                </span>
              </div>

              <div className="p-space-xs rounded-lg bg-surface-container-high/60 backdrop-blur-md flex flex-col gap-0.5 border border-outline-variant/10">
                <div className="flex items-center justify-between text-title-sm font-title-sm">
                  <span className="text-on-surface font-bold">02 Silk Satin Gown</span>
                  <span className="text-secondary font-bold">Oct 24, 02:00 PM</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Model: Camille D. (Size 34 FR) • Focus: Bias grain gravity drape
                </span>
              </div>
            </div>

            {/* Head Tailor's Dispatch Note */}
            <div className="p-space-xs rounded-lg bg-surface-container-high/40 border border-outline-variant/20 flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">format_quote</span> Head Tailor's Dispatch
              </span>
              <p className="font-body-sm text-[11px] text-on-surface-variant italic leading-relaxed">
                "Silk velvet lot #802 arrived from Lyon. Steam press strictly on needleboard at 120°C max. Do not clamp seams without fleece cushion."
              </p>
            </div>
          </div>

          {/* Sample Production Budget */}
          <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-xl">payments</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Sample Budget</h3>
              </div>
              <span className="font-label-sm text-label-sm text-outline">AW26 Allocation</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">$14,250</span>
                <span className="font-body-sm text-body-sm text-outline">/ $18,000 spent</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold">79.1% Utilized</span>

              <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mt-1 flex">
                <div className="h-full bg-primary-container" style={{ width: '42%' }} title="Fabrics & Linings" />
                <div className="h-full bg-secondary-container" style={{ width: '21%' }} title="Modéliste & CAD" />
                <div className="h-full bg-tertiary-container" style={{ width: '12%' }} title="Fit Models & Studio" />
                <div className="h-full bg-surface-bright" style={{ width: '4.1%' }} title="Hardware & Notions" />
              </div>
            </div>

            <div className="flex flex-col gap-space-2xs text-body-sm font-body-sm pt-space-xs border-t border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-outline">Fabrics &amp; Linings (38m)</span>
                <span className="text-on-surface font-semibold">$6,840</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Modéliste &amp; CAD Toiles</span>
                <span className="text-on-surface font-semibold">$4,620</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Fit Models &amp; Studio Time</span>
                <span className="text-on-surface font-semibold">$1,850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Hardware, Thread &amp; Notions</span>
                <span className="text-on-surface font-semibold">$940</span>
              </div>
            </div>
          </div>

          {/* Gemini Vision v3.2 AI Silhouette Critique */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary-container/30 via-surface-container-low/90 to-surface-container-low p-space-lg shadow-xl backdrop-blur-2xl border border-outline-variant/20 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-xs">
              <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Gemini Vision v3.2
              </span>
            </div>

            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              AI Silhouette Critique
            </h4>

            <div className="flex flex-wrap gap-1">
              {['#Dramatic Romance', '#Neo-Gothic Tailoring', '#Hourglass Waistline', '#Asymmetric Origami'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-[10px] font-semibold">
                  {tag}
                </span>
              ))}
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
              "High stylistic harmony across Looks 01–04. Look 04 velvet weight (420gsm) exceeds cape shoulder canvas tolerance by 14%; recommend inner twill stay tape to prevent sagging during runway movement."
            </p>

            <button
              onClick={() => setShowAiAnalysisModal(true)}
              className="text-primary hover:text-on-primary-fixed-variant font-label-md text-label-md font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              type="button"
            >
              Open Full AI Drapery Analysis <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Garment Look Modal */}
      {showAddLookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleAddLook}
            className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Add Garment Look
              </h3>
              <button type="button" onClick={() => setShowAddLookModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Garment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Origami Evening Gown"
                  value={newLookTitle}
                  onChange={(e) => setNewLookTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Category</label>
                <select
                  value={newLookCategory}
                  onChange={(e) => setNewLookCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                >
                  <option value="Outerwear/Tailoring">Outerwear/Tailoring</option>
                  <option value="Eveningwear/Drape">Eveningwear/Drape</option>
                  <option value="Separates/Tailoring">Separates/Tailoring</option>
                  <option value="Couture/Statement Outerwear">Couture/Statement Outerwear</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Primary Fabric</label>
                <input
                  type="text"
                  placeholder="Silk Velvet (380 GSM)"
                  value={newLookFabric}
                  onChange={(e) => setNewLookFabric(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Hardware &amp; Notions</label>
                <input
                  type="text"
                  placeholder="Riri Zipper, Silk Gimp"
                  value={newLookNotions}
                  onChange={(e) => setNewLookNotions(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Lead Modéliste</label>
                <input
                  type="text"
                  placeholder="Elena Rossi"
                  value={newLookModeliste}
                  onChange={(e) => setNewLookModeliste(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Design &amp; Draping Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe silhouette grainlines, bias drape, and seam allowances..."
                  value={newLookDesc}
                  onChange={(e) => setNewLookDesc(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAddLookModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Add Look
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Drapery Analysis Modal */}
      {showAiAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-xl bg-surface-container-low border border-outline-variant/30 p-space-lg shadow-2xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Gemini Vision Full Drapery Analysis
                </h3>
              </div>
              <button type="button" onClick={() => setShowAiAnalysisModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm text-body-sm font-body-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-high/60 border border-outline-variant/20 flex flex-col gap-1">
                <span className="font-title-sm text-title-sm text-primary font-bold">
                  Cohesion Rating: 94/100
                </span>
                <p className="text-on-surface-variant leading-relaxed">
                  High silhouette synergy between Look 01 (structured shoulders) and Look 02 (liquid bias drape). The collection aesthetic firmly balances rigorous architecture with gothic fluid romanticism.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-title-sm text-title-sm text-on-surface font-bold">
                  Tension &amp; Fabric Weight Warnings:
                </span>
                <p className="text-error font-semibold">
                  • Look 04 Velvet Opera Cape (420 GSM) exceeds shoulder canvas tolerance by 14%. Insert inner twill stay tape.
                </p>
                <p className="text-secondary font-semibold">
                  • Look 02 Bias Gown requires 45° grain alignment verification during cutting to prevent hem twist.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowAiAnalysisModal(false)}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
