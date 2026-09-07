import React from 'react'

export default function MoodBoards() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto px-4">
      <div className="rounded-2xl bg-surface-container-low/90 backdrop-blur-2xl shadow-2xl border border-outline-variant/30 p-space-2xl text-center flex flex-col items-center gap-space-md">
        <div className="w-16 h-16 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-3xl">auto_awesome_motion</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
          Im still working on it shoo
        </h2>
        <p className="font-body-md text-body-md text-outline">
          This atelier feature is under active craftsmanship. Check back soon!
        </p>
      </div>
    </div>
  )
}
