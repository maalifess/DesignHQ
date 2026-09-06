import React, { useState } from 'react'

interface FittingNote {
  id: string
  title: string
  look: string
  modeliste: string
  fitModel: string
  date: string
  status: string
  content: string
  pinned: boolean
}

const PRESEEDED_NOTES: FittingNote[] = []

export default function Notes() {
  const [notesList, setNotesList] = useState<FittingNote[]>(PRESEEDED_NOTES)
  const [activeNoteId, setActiveNoteId] = useState<string>('fn-01')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const activeNote = notesList.find((n) => n.id === activeNoteId) || notesList[0]

  const filteredNotes = notesList.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.look.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContentChange = (newContent: string) => {
    setNotesList((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, content: newContent } : n))
    )
  }

  const handleTitleChange = (newTitle: string) => {
    setNotesList((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, title: newTitle } : n))
    )
  }

  const handleCreateNote = () => {
    const newNote: FittingNote = {
      id: `fn-${Date.now()}`,
      title: 'New Fitting Note',
      look: 'Look 05 (CR-210)',
      modeliste: 'Ariba',
      fitModel: 'Fit Size 36 FR',
      date: 'Today',
      status: 'Draft 📝',
      content: 'Enter technical fitting observation notes, seam allowances, and toile adjustments...',
      pinned: false,
    }
    setNotesList([newNote, ...notesList])
    setActiveNoteId(newNote.id)
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-space-xl pb-space-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20 pb-space-lg">
        <div>
          <h1 className="font-headline-hero text-headline-hero text-on-surface tracking-tight">
            Atelier Fitting Notes &amp; Technical Specifications
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Toile fitting logs, pattern modification notes, model scye measurements, and head tailor dispatches.
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

      {/* Main 2-Column Split: Notes List (300px) + Editor Area (Flex 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Notes List */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
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

          <div className="flex flex-col gap-space-xs">
            {filteredNotes.length === 0 ? (
              <div className="p-space-lg rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/20 text-center flex flex-col items-center gap-space-xs">
                <span className="material-symbols-outlined text-3xl text-outline">edit_note</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">
                  No fitting notes found.
                </span>
                <button
                  onClick={handleCreateNote}
                  className="px-space-sm py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold cursor-pointer"
                >
                  + Create Fitting Note
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`p-space-md rounded-xl bg-surface-container-low/90 backdrop-blur-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isActive
                        ? 'border-primary ring-2 ring-primary/40 bg-surface-container-low shadow-lg'
                        : 'border-outline-variant/20 hover:border-outline-variant/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[10px] text-primary font-bold uppercase tracking-wider">
                        {note.look}
                      </span>
                      <span className="font-label-sm text-[10px] text-outline">{note.date}</span>
                    </div>

                    <h3 className="font-title-sm text-title-sm text-on-surface font-bold truncate mt-0.5">
                      {note.title}
                    </h3>

                    <div className="flex items-center justify-between text-label-sm font-label-sm mt-1 pt-1 border-t border-outline-variant/20">
                      <span className="text-outline">Model: {note.fitModel}</span>
                      <span className="text-secondary font-semibold">{note.status}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Detail & Rich Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {activeNote ? (
            <div className="rounded-xl bg-surface-container-low/95 backdrop-blur-2xl shadow-2xl border border-outline-variant/30 p-space-lg flex flex-col gap-space-md">
              {/* Note Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs border-b border-outline-variant/20 pb-space-md">
                <div className="flex flex-col flex-1">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="font-headline-sm text-headline-sm text-on-surface font-bold bg-transparent border-none focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center gap-space-xs text-label-sm font-label-sm text-outline mt-1">
                    <span>Look Assignment: <strong className="text-primary">{activeNote.look}</strong></span>
                    <span>•</span>
                    <span>Modéliste: <strong className="text-on-surface">{activeNote.modeliste}</strong></span>
                    <span>•</span>
                    <span>Fit Model: <strong className="text-on-surface">{activeNote.fitModel}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs">
                  <span className="px-space-xs py-1 rounded bg-secondary-container/40 text-secondary font-label-sm text-label-sm font-bold">
                    {activeNote.status}
                  </span>
                </div>
              </div>

              {/* Text Area */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-outline uppercase tracking-wider">
                  Technical Specifications &amp; Toile Adjustment Log
                </label>
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  rows={14}
                  className="w-full p-space-md rounded-lg bg-surface-container-high/60 text-on-surface font-body-md text-body-md leading-relaxed border border-outline-variant/30 focus:outline-none focus:bg-surface-container-highest transition-all resize-y"
                />
              </div>

              <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20 font-label-sm text-label-sm text-outline">
                <span>Auto-saved to Atelier Cloud</span>
                <button
                  type="button"
                  onClick={() => alert('Fitting note saved successfully!')}
                  className="px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:brightness-110 transition-all cursor-pointer"
                >
                  Save Specification
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-outline-variant/20 p-space-2xl text-center flex flex-col items-center justify-center gap-space-md">
              <span className="material-symbols-outlined text-5xl text-outline">straighten</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Select a fitting note to inspect</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
