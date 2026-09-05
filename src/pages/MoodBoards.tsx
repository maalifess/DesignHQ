import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Image, Search } from 'lucide-react'
import { useMoodBoard } from '@/hooks/useMoodBoard'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/Button'
import { GlassModal } from '@/components/ui/GlassModal'
import { Input, Select } from '@/components/ui/Input'
import { formatDate } from '@/lib/export'

export default function MoodBoards() {
  const { moodBoards, loading, createMoodBoard } = useMoodBoard()
  const { projects } = useProjects()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('Untitled Board')
  const [newProject, setNewProject] = useState('')
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  const filtered = moodBoards.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = async () => {
    setCreating(true)
    const board = await createMoodBoard(newName, newProject || undefined)
    setCreating(false)
    setShowNew(false)
    setNewName('Untitled Board')
    setNewProject('')
    if (board) navigate(`/moodboards/${board.id}`)
  }

  return (
    <div style={{ maxWidth: '1400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mood Boards</h1>
        <Button icon={<Plus size={16} />} onClick={() => setShowNew(true)} id="new-moodboard-btn">New Board</Button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 320, marginBottom: '1.5rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search boards..." value={search} onChange={(e) => setSearch(e.target.value)} id="moodboards-search" />
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <Image size={56} style={{ color: 'var(--glass-border)' }} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {search ? 'No boards match your search' : 'Start gathering inspiration'}
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 340 }}>
              {search ? 'Try a different term.' : 'Create your first mood board to collect images, colors, and visual ideas.'}
            </p>
          </div>
          {!search && <Button icon={<Plus size={16} />} onClick={() => setShowNew(true)}>Create Mood Board</Button>}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filtered.map((board, i) => (
            <motion.div
              key={board.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
            >
              <div
                className="glass-card"
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/moodboards/${board.id}`)}
              >
                {/* Canvas preview */}
                <div style={{
                  height: 160,
                  background: 'var(--bg-surface-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Color palette preview */}
                  {board.extracted_colors && (board.extracted_colors as string[]).length > 0 ? (
                    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                      {(board.extracted_colors as string[]).slice(0, 5).map((c: string, ci: number) => (
                        <div key={ci} style={{ flex: 1, background: c }} />
                      ))}
                    </div>
                  ) : (
                    <Image size={36} style={{ color: 'var(--glass-border)', opacity: 0.5 }} />
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }} className="truncate">
                    {board.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {formatDate(board.updated_at)}
                    </p>
                    {board.ai_tags && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                         Tagged
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <GlassModal isOpen={showNew} onClose={() => setShowNew(false)} title="New Mood Board" size="sm">
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Board Name" id="new-board-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. AW25 Inspiration" />
          <Select
            label="Link to Project (optional)"
            id="new-board-project"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            options={[{ value: '', label: 'No project' }, ...projects.map((p) => ({ value: p.id, label: p.title }))]}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleCreate}>Create Board</Button>
          </div>
        </div>
      </GlassModal>
    </div>
  )
}
