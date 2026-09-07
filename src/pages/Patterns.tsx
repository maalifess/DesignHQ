import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAtelierStore, type SavedPattern } from '@/store/useAtelierStore'

export default function Patterns() {
  const { patterns, projects, addPattern, updatePattern, deletePattern } = useAtelierStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [showAddModal, setShowAddModal] = useState(false)

  // Edit Pattern Form State
  const [editingPattern, setEditingPattern] = useState<SavedPattern | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editMeasurements, setEditMeasurements] = useState('')
  const [editImage, setEditImage] = useState('')

  // New Pattern Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [measurements, setMeasurements] = useState('')
  const [image, setImage] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')

  const handleCreatePattern = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const num = (patterns.length + 1).toString().padStart(2, '0')
    const defaultImage = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'

    const newPattern: Omit<SavedPattern, 'id'> = {
      projectId: selectedProjectId || undefined,
      number: num,
      patternNo: `PT-${Math.floor(Math.random() * 800 + 100)}`,
      title: title.trim(),
      category: category.trim() || 'General',
      status: 'Ready',
      statusType: 'approved',
      fabric: '',
      notions: '',
      nextFitting: '',
      modeliste: '',
      pieces: 1,
      description: description.trim() || 'Custom pattern specification.',
      measurements: measurements.trim(),
      image: image.trim() || defaultImage,
    }

    addPattern(newPattern)
    setShowAddModal(false)
    setTitle('')
    setCategory('')
    setDescription('')
    setMeasurements('')
    setImage('')
  }

  const handleStartEdit = (pat: SavedPattern) => {
    setEditingPattern(pat)
    setEditTitle(pat.title)
    setEditCategory(pat.category || '')
    setEditDesc(pat.description || '')
    setEditMeasurements(pat.measurements || '')
    setEditImage(pat.image || '')
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPattern) return
    updatePattern(editingPattern.id, {
      title: editTitle,
      category: editCategory,
      description: editDesc,
      measurements: editMeasurements,
      image: editImage,
    })
    setEditingPattern(null)
  }

  // Filter categories
  const categories = ['All', ...Array.from(new Set(patterns.map((p) => p.category).filter(Boolean)))]

  const filteredPatterns = patterns.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Header Banner */}
      <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-2xl">content_cut</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
              Patterns Library
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Centralized repository for all pattern specs, measurements, and technical guidelines across your collections.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-2"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Pattern</span>
        </button>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search patterns by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-space-md py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 text-body-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-primary-container text-on-primary border-transparent'
                  : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20 hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Patterns */}
      {filteredPatterns.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl border border-outline-variant/20 p-space-2xl flex flex-col items-center justify-center text-center gap-space-md">
          <span className="material-symbols-outlined text-5xl text-outline">content_cut</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            No Patterns Found
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            Add patterns with specs, textile assignments, and fitting guidelines to store them in your atelier library.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 cursor-pointer"
            type="button"
          >
            + Add Pattern
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredPatterns.map((p) => {
            const project = projects.find((proj) => proj.id === p.projectId)
            return (
              <div
                key={p.id}
                className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-lg flex flex-col justify-between gap-space-md hover:bg-surface-container-low transition-all"
              >
                <div className="flex gap-space-md">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-24 h-32 rounded-lg object-cover flex-shrink-0 shadow-md border border-outline-variant/30"
                  />
                  <div className="flex flex-col min-w-0 flex-1 gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight truncate">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="text-outline hover:text-primary transition-colors p-1 cursor-pointer"
                          title="Edit Pattern & Measurements"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => deletePattern(p.id)}
                          className="text-outline hover:text-error transition-colors p-1 cursor-pointer"
                          title="Delete Pattern"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>

                    {p.category && (
                      <span className="inline-block self-start px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        {p.category}
                      </span>
                    )}

                    {project && (
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-1 mt-1 truncate"
                      >
                        <span className="material-symbols-outlined text-xs">folder</span>
                        <span>{project.title}</span>
                      </Link>
                    )}

                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>
                </div>

                {p.measurements && (
                  <div className="p-space-xs rounded-lg bg-surface-container-high/60 border border-outline-variant/15 text-xs text-on-surface-variant flex flex-col gap-0.5">
                    <span className="font-semibold text-on-surface text-[11px] uppercase tracking-wider">
                      Measurements &amp; Specs:
                    </span>
                    <span className="whitespace-pre-line text-on-surface">{p.measurements}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Pattern Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleCreatePattern}
            className="relative w-full max-w-[95vw] sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Add Pattern to Library
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Origami Evening Gown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Outerwear, Eveningwear, Draping..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-outline font-semibold">Collection / Project (Optional)</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                >
                  <option value="">Unassigned (Global Library)</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Image / Sketch</label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                  />
                  <label className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-outline-variant/30 cursor-pointer text-center text-xs font-semibold whitespace-nowrap border border-outline-variant/20 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setImage(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
                {image && (
                  <div className="mt-2 relative w-24 h-28 rounded-lg overflow-hidden border border-outline-variant/30 shadow-md">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-1 right-1 bg-background/80 text-on-surface rounded-full p-0.5 hover:bg-error/80 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Measurements &amp; Fitting Specs</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bust: 88cm, Waist: 68cm, Hips: 94cm, Seam Allowance: 1.5cm..."
                  value={measurements}
                  onChange={(e) => setMeasurements(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Description &amp; Construction Notes</label>
                <textarea
                  rows={2}
                  placeholder="Describe grainlines, bias drape, facing details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
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
                Add Pattern
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Edit Pattern Modal */}
      {editingPattern && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveEdit}
            className="relative w-full max-w-[95vw] sm:max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl bg-surface-container-low border border-outline-variant/30 p-4 sm:p-6 shadow-2xl flex flex-col gap-3 sm:gap-4"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Edit Pattern Specs
              </h3>
              <button
                type="button"
                onClick={() => setEditingPattern(null)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-body-sm font-body-sm">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Pattern Image / Sketch</label>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="url"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className="flex-1 w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                  />
                  <label className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface hover:bg-outline-variant/30 cursor-pointer text-center text-xs font-semibold whitespace-nowrap border border-outline-variant/20 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setEditImage(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                </div>
                {editImage && (
                  <div className="mt-2 relative w-24 h-28 rounded-lg overflow-hidden border border-outline-variant/30 shadow-md">
                    <img src={editImage} alt="Pattern Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditImage('')}
                      className="absolute top-1 right-1 bg-background/80 text-on-surface rounded-full p-0.5 hover:bg-error/80 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Outerwear, Eveningwear, Draping..."
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-space-sm py-space-xs rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Measurements &amp; Fitting Specs</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Bust: 88cm, Waist: 68cm, Hips: 94cm, Seam Allowance: 1.5cm..."
                  value={editMeasurements}
                  onChange={(e) => setEditMeasurements(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-outline font-semibold">Description &amp; Construction Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe grainlines, bias drape, facing details..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/20 focus:outline-none text-body-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-space-xs border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setEditingPattern(null)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-title-sm text-title-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
