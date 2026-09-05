import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Pin, FileText, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/useAppStore'
import { GlassModal } from '@/components/ui/GlassModal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge, PROJECT_COLORS } from '@/components/ui/Badge'
import { formatDate } from '@/lib/export'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'

interface Note {
  id: string
  title: string
  content: any
  tags: string[]
  color_label: string | null
  pinned: boolean
  created_at: string
  updated_at: string
}

const NOTE_TEMPLATES = [
  {
    id: 'design-brief',
    label: 'Design Brief',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Design Brief' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Project Overview' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Describe the project concept here...' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Target Customer' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Who is this collection for?' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Key Requirements' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Requirement 1' }] }] }] },
      ]
    }
  },
  {
    id: 'submission-checklist',
    label: 'Submission Checklist',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Submission Checklist' }] },
        { type: 'taskList', content: [
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Final sketches complete' }] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Mood board finalized' }] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Fabric samples sourced' }] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Portfolio page updated' }] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'PDF submitted to portal' }] }] },
        ]}
      ]
    }
  },
  {
    id: 'research-notes',
    label: 'Research Notes',
    content: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Research Notes' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Trend Research' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Key trends observed...' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Inspiration References' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Designers, eras, cultures...' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Sources' }] },
        { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Source 1' }] }] }] },
      ]
    }
  },
]

function TiptapToolbar({ editor }: { editor: any }) {
  if (!editor) return null
  const btn = (action: () => void, label: string, isActive?: boolean, children?: any) => (
    <button
      type="button"
      onClick={action}
      title={label}
      style={{
        background: isActive ? 'var(--accent-light)' : 'none',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.25rem 0.5rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-ui)',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        fontWeight: isActive ? 600 : 400,
      }}
    >
      {children || label}
    </button>
  )

  return (
    <div style={{
      display: 'flex',
      gap: '0.25rem',
      flexWrap: 'wrap',
      padding: '0.625rem',
      borderBottom: '1px solid var(--glass-border)',
      background: 'var(--bg-surface)',
    }}>
      {btn(() => editor.chain().focus().toggleBold().run(), 'Bold', editor.isActive('bold'), <strong>B</strong>)}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'Italic', editor.isActive('italic'), <em>I</em>)}
      {btn(() => editor.chain().focus().toggleUnderline().run(), 'Underline', editor.isActive('underline'), <u>U</u>)}
      {btn(() => editor.chain().focus().toggleStrike().run(), 'Strikethrough', editor.isActive('strike'), <s>S</s>)}
      <div className="divider" style={{ width: 1, height: 24, margin: '0 0.125rem' }} />
      {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'H1', editor.isActive('heading', { level: 1 }), 'H1')}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }), 'H2')}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }), 'H3')}
      <div className="divider" style={{ width: 1, height: 24, margin: '0 0.125rem' }} />
      {btn(() => editor.chain().focus().toggleBulletList().run(), 'Bullet List', editor.isActive('bulletList'), '• List')}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), 'Ordered List', editor.isActive('orderedList'), '1. List')}
      {btn(() => editor.chain().focus().toggleTaskList().run(), 'Checklist', editor.isActive('taskList'), ' Check')}
      <div className="divider" style={{ width: 1, height: 24, margin: '0 0.125rem' }} />
      {btn(() => editor.chain().focus().setHorizontalRule().run(), 'Divider', false, '—')}
    </div>
  )
}

function NoteEditor({ note, onSave, onClose }: { note: Note; onSave: (id: string, data: Partial<Note>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(note.title)
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Link.configure({ openOnClick: true }),
    ],
    content: note.content || '',
  })

  const handleSave = async () => {
    if (!editor) return
    setSaving(true)
    await onSave(note.id, { title, content: editor.getJSON() })
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Note top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          style={{
            flex: 1, fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600,
            background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)',
          }}
        />
        <Button size="sm" loading={saving} onClick={handleSave}>Save</Button>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
      </div>

      <TiptapToolbar editor={editor} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <EditorContent
          editor={editor}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            minHeight: 300,
          }}
        />
      </div>

      {editor && (
        <div style={{ padding: '0.5rem 1.25rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {editor.storage.characterCount?.characters()} characters
        </div>
      )}
    </div>
  )
}

export default function Notes() {
  const { user } = useAuth()
  const { addToast } = useAppStore()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [search, setSearch] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('notes').select('*').eq('user_id', user.id).order('pinned', { ascending: false }).order('updated_at', { ascending: false })
      .then(({ data }) => { setNotes(data || []); setLoading(false) })
  }, [user])

  const createNote = async (template?: typeof NOTE_TEMPLATES[0]) => {
    if (!user) return
    const { data } = await supabase.from('notes').insert({
      user_id: user.id,
      title: template ? template.label : 'Untitled Note',
      content: template?.content || null,
      tags: [],
    }).select().single()
    if (data) {
      setNotes((prev) => [data, ...prev])
      setActiveNote(data)
    }
    setShowTemplates(false)
  }

  const saveNote = async (id: string, updates: Partial<Note>) => {
    const { error } = await supabase.from('notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
    if (!error) {
      setNotes((prev) => prev.map((n) => n.id === id ? { ...n, ...updates } : n))
      if (activeNote?.id === id) setActiveNote((prev) => prev ? { ...prev, ...updates } : prev)
      addToast('Note saved', 'success')
    }
  }

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (activeNote?.id === id) setActiveNote(null)
    addToast('Note deleted', 'info')
  }

  const togglePin = async (note: Note) => {
    await saveNote(note.id, { pinned: !note.pinned })
  }

  const filtered = notes.filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height) - 2rem)', margin: '-2rem', overflow: 'hidden' }}>
      {/* Notes list */}
      <div className="glass-panel" style={{
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--glass-border)',
        borderRadius: 0,
        flexShrink: 0,
      }}>
        {/* List header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notes</h2>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowTemplates(true)}>New</Button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="input" style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }} placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} id="notes-search" />
          </div>
        </div>

        {/* Notes list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 72 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {search ? 'No notes match.' : 'No notes yet. Create your first!'}
            </div>
          ) : filtered.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--glass-border)',
                cursor: 'pointer',
                background: activeNote?.id === note.id ? 'var(--accent-light)' : 'transparent',
                borderLeft: activeNote?.id === note.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transition: 'all var(--transition-base)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.375rem', marginBottom: '0.25rem' }}>
                <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.3 }} className="truncate">{note.title}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(note) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: note.pinned ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0 }}
                >
                  <Pin size={13} />
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(note.updated_at)}</p>
              {note.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
                  {note.tags.slice(0, 2).map((t) => <Badge key={t} variant="muted" className="text-xs">#{t}</Badge>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', minWidth: 0 }}>
        {activeNote ? (
          <NoteEditor note={activeNote} onSave={saveNote} onClose={() => setActiveNote(null)} />
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem' }}>
            <FileText size={56} style={{ color: 'var(--glass-border)', opacity: 0.6 }} />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Select a note or create one</h3>
              <p style={{ color: 'var(--text-muted)' }}>Your design thinking lives here.</p>
            </div>
            <Button icon={<Plus size={16} />} onClick={() => setShowTemplates(true)}>New Note</Button>
          </div>
        )}
      </div>

      {/* Template selector modal */}
      <GlassModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} title="Choose a Template" size="md">
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="glass-card" style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => createNote()}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Blank Note</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Start with a clean slate</p>
          </div>
          {NOTE_TEMPLATES.map((t) => (
            <div key={t.id} className="glass-card" style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => createNote(t)}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.label}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Pre-filled template</p>
            </div>
          ))}
        </div>
      </GlassModal>
    </div>
  )
}
