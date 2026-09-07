import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAtelierStore, type SavedNote } from '@/store/useAtelierStore'

export default function Notes() {
  const notes = useAtelierStore((state) => state.notes)
  const addNote = useAtelierStore((state) => state.addNote)
  const updateNote = useAtelierStore((state) => state.updateNote)
  const deleteNote = useAtelierStore((state) => state.deleteNote)
  const projects = useAtelierStore((state) => state.projects)

  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false)

  // Ensure active note is valid
  const currentActiveId = activeNoteId && notes.some((n) => n.id === activeNoteId)
    ? activeNoteId
    : notes.length > 0
    ? notes[0].id
    : null

  const activeNote = notes.find((n) => n.id === currentActiveId)

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.lookRef && n.lookRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || n.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateNote = () => {
    const today = new Date().toISOString().split('T')[0]
    addNote({
      title: 'New Fitting Spec & Note',
      category: 'Fitting Notes',
      content: 'Enter technical fitting notes, pattern adjustments, grainline notes, or toile alterations here...',
      date: today,
      tag: 'Toile Fitting',
      lookRef: 'Look 01',
      createdAt: new Date().toISOString(),
    })
    // Select newly added note (which is at the top of notes array in store)
    setTimeout(() => {
      const stateNotes = useAtelierStore.getState().notes
      if (stateNotes.length > 0) {
        setActiveNoteId(stateNotes[0].id)
      }
    }, 50)
  }

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this fitting note?')) {
      deleteNote(id)
      if (activeNoteId === id) {
        const remaining = notes.filter((n) => n.id !== id)
        setActiveNoteId(remaining.length > 0 ? remaining[0].id : null)
      }
    }
  }

  const handleFieldChange = (field: keyof SavedNote, value: string) => {
    if (!currentActiveId) return
    updateNote(currentActiveId, { [field]: value })
    setShowSaveToast(true)
    setTimeout(() => setShowSaveToast(false), 2000)
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20 pb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs mb-1">
            <span className="px-space-xs py-0.5 rounded-full bg-primary-container/60 text-primary font-label-sm text-label-sm tracking-wider uppercase font-semibold">
              Central Atelier Library
            </span>
          </div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface font-bold tracking-tight">
            Atelier Fitting Notes &amp; Technical Specs
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Create, manage, and search fitting notes, pattern alterations, and toile specs for designer Ariba.
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer w-max"
          type="button"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Fitting Note</span>
        </button>
      </div>

      {/* Main 2-Column Split: Sidebar List & Note Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Notes List */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Search & Filter */}
          <div className="flex flex-col gap-space-xs">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search fitting notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-space-md py-space-xs rounded-lg bg-surface-container-high/60 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-highest transition-all border border-outline-variant/20"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {['All', 'Fitting Notes', 'Pattern Adjustments', 'Fabrics & Drapes', 'General Atelier Task'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-full font-label-sm text-[11px] transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-primary-container text-on-primary font-bold shadow'
                      : 'bg-surface-container-high/60 text-outline hover:text-on-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Cards */}
          <div className="flex flex-col gap-space-xs max-h-[700px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-space-lg rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20 text-center flex flex-col items-center gap-space-xs">
                <span className="material-symbols-outlined text-3xl text-outline">edit_note</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">
                  No fitting notes found matching filter.
                </span>
                <button
                  onClick={handleCreateNote}
                  className="px-space-sm py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold cursor-pointer mt-1"
                >
                  + Create Fitting Note
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === currentActiveId
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-space-md rounded-xl bg-surface-container-low/90 backdrop-blur-xl border transition-all cursor-pointer flex flex-col gap-1 relative group ${
                      isActive
                        ? 'border-primary ring-2 ring-primary/40 bg-surface-container-low shadow-lg'
                        : 'border-outline-variant/20 hover:border-outline-variant/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-1.5 py-0.5 rounded bg-primary-container/30 text-primary font-label-sm text-[10px] font-bold tracking-wider uppercase">
                        {note.category}
                      </span>
                      <span className="font-label-sm text-[10px] text-outline">{note.date}</span>
                    </div>

                    <h3 className="font-title-sm text-title-sm text-on-surface font-bold truncate mt-0.5 pr-6">
                      {note.title}
                    </h3>

                    <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-between text-label-sm font-label-sm mt-1 pt-1 border-t border-outline-variant/20">
                      <span className="text-outline text-[10px]">
                        {note.lookRef ? `Ref: ${note.lookRef}` : note.tag || 'Fitting Spec'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-opacity p-0.5 rounded cursor-pointer"
                        title="Delete note"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Detail & Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {activeNote ? (
            <div className="rounded-xl bg-surface-container-low/95 backdrop-blur-2xl shadow-2xl border border-outline-variant/30 p-space-lg flex flex-col gap-space-md">
              {/* Header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs border-b border-outline-variant/20 pb-space-md">
                <div className="flex flex-col flex-1">
                  <label className="font-label-sm text-[10px] text-outline uppercase tracking-wider font-semibold">Note Title</label>
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    className="font-headline-sm text-headline-sm text-on-surface font-bold bg-transparent border-b border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none transition-all py-1"
                  />
                </div>

                <div className="flex items-center gap-space-xs">
                  {showSaveToast && (
                    <span className="font-label-sm text-xs text-primary font-semibold animate-fade-in flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Saved
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteNote(activeNote.id, e)}
                    className="px-space-xs py-1 rounded bg-error-container/30 text-error hover:bg-error-container/60 font-label-sm text-label-sm font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Meta controls (Category, Look Ref, Collection Link) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs p-space-xs rounded-lg bg-surface-container-high/40 border border-outline-variant/10 text-body-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-outline font-label-sm text-[10px] uppercase font-semibold">Category</label>
                  <select
                    value={activeNote.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="px-space-xs py-1 rounded bg-surface-container-high text-on-surface font-body-sm text-xs border border-outline-variant/20"
                  >
                    <option value="Fitting Notes">Fitting Notes</option>
                    <option value="Pattern Adjustments">Pattern Adjustments</option>
                    <option value="Fabrics & Drapes">Fabrics &amp; Drapes</option>
                    <option value="General Atelier Task">General Atelier Task</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-outline font-label-sm text-[10px] uppercase font-semibold">Look / Silhouette Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. Look 03 - Velvet Gown"
                    value={activeNote.lookRef || ''}
                    onChange={(e) => handleFieldChange('lookRef', e.target.value)}
                    className="px-space-xs py-1 rounded bg-surface-container-high text-on-surface font-body-sm text-xs border border-outline-variant/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-outline font-label-sm text-[10px] uppercase font-semibold">Assigned Collection</label>
                  <select
                    value={activeNote.collectionId || ''}
                    onChange={(e) => handleFieldChange('collectionId', e.target.value)}
                    className="px-space-xs py-1 rounded bg-surface-container-high text-on-surface font-body-sm text-xs border border-outline-variant/20"
                  >
                    <option value="">(Unassigned / General)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Note Content Textarea */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-outline uppercase tracking-wider font-semibold">
                  Fitting Log &amp; Pattern Specifications Content
                </label>
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleFieldChange('content', e.target.value)}
                  rows={14}
                  placeholder="Record toile fitting measurements, seam line tolerances, dart relocations, or head tailor notes..."
                  className="w-full p-space-md rounded-lg bg-surface-container-high/60 text-on-surface font-body-md text-body-md leading-relaxed border border-outline-variant/30 focus:outline-none focus:bg-surface-container-highest transition-all resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20 font-label-sm text-label-sm text-outline">
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm">cloud_done</span>
                  <span>Changes auto-saved to Atelier Store &amp; available for Collection import</span>
                </div>
                <span className="text-outline text-xs">Date: {activeNote.date}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl text-center flex flex-col items-center justify-center gap-space-md">
              <span className="material-symbols-outlined text-5xl text-outline">straighten</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">No fitting note selected</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Create a new fitting note or select one from the left sidebar list.
              </p>
              <button
                type="button"
                onClick={handleCreateNote}
                className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold cursor-pointer shadow"
              >
                + Create New Fitting Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
