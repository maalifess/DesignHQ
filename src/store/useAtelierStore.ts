import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function toValidUUIDOrNull(id?: string | null): string | null {
  if (!id) return null
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id) ? id : null
}

export function safeString(val: any, fallback: string = ''): string {
  if (val === null || val === undefined) return fallback
  if (typeof val === 'string') return val
  if (typeof val === 'number' || typeof val === 'boolean') return String(val)
  if (typeof val === 'object') {
    if (typeof val.content === 'string') return val.content
    if (Array.isArray(val.content)) {
      return val.content.map((c: any) => safeString(c)).filter(Boolean).join('\n')
    }
    if (typeof val.text === 'string') return val.text
    if (typeof val.title === 'string') return val.title
    try {
      return JSON.stringify(val)
    } catch {
      return fallback
    }
  }
  return fallback
}

export interface SavedProject {
  id: string
  code: string
  title: string
  category: string
  season: string
  targetDate: string
  stage: string
  stageNum: number
  percent: number
  palette: { name: string; hex: string }[]
  garmentsCount: number
  description: string
  createdAt: string
}

export interface SavedSketch {
  id: string
  projectId?: string
  importedFromId?: string
  title: string
  collectionTitle?: string
  garmentType: string
  fabricName: string
  imageUrl: string
  score?: number
  aiCritique?: string
  savedAt: string
}

export interface SavedFabric {
  id: string
  name: string
  type: string
  weight: string
  origin: string
  metersLeft: number
  availability: 'In Stock' | 'Low Stock' | 'Ordered'
  imageUrl: string
  costPerMeter: number
  supplier: string
}

export interface SavedDeadline {
  id: string
  title: string
  detail: string
  daysLeft: number
  urgency: 'high' | 'medium' | 'low'
  date: string
}

export interface SavedPattern {
  id: string
  projectId?: string
  importedFromId?: string
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
  measurements?: string
  image: string
}

export interface SavedMoodboard {
  id: string
  projectId?: string
  title: string
  imageUrl: string
}

export interface SavedFittingLog {
  id: string
  projectId?: string
  title: string
  date: string
  notes: string
}

export interface SavedNote {
  id: string
  projectId?: string
  collectionId?: string
  importedFromId?: string
  title: string
  category?: string
  content: string
  date?: string
  tag?: string
  lookRef?: string
  createdAt?: string
}

interface AtelierState {
  projects: SavedProject[]
  sketches: SavedSketch[]
  fabrics: SavedFabric[]
  deadlines: SavedDeadline[]
  patterns: SavedPattern[]
  moodboards: SavedMoodboard[]
  fittingLogs: SavedFittingLog[]
  notes: SavedNote[]

  // Sync with Supabase Database
  fetchFromSupabase: () => Promise<void>

  // Actions
  addProject: (project: Omit<SavedProject, 'id' | 'createdAt'>) => SavedProject
  updateProject: (id: string, updates: Partial<SavedProject>) => void
  deleteProject: (id: string) => void

  addSketch: (sketch: Omit<SavedSketch, 'id' | 'savedAt'>) => SavedSketch
  updateSketch: (id: string, updates: Partial<SavedSketch>) => void
  deleteSketch: (id: string) => void

  addFabric: (fabric: Omit<SavedFabric, 'id'>) => SavedFabric
  deleteFabric: (id: string) => void

  addDeadline: (deadline: Omit<SavedDeadline, 'id'>) => SavedDeadline
  deleteDeadline: (id: string) => void

  addPattern: (pattern: Omit<SavedPattern, 'id'>) => SavedPattern
  updatePattern: (id: string, updates: Partial<SavedPattern>) => void
  deletePattern: (id: string) => void

  addMoodboard: (moodboard: Omit<SavedMoodboard, 'id'>) => SavedMoodboard
  deleteMoodboard: (id: string) => void

  addFittingLog: (fittingLog: Omit<SavedFittingLog, 'id'>) => SavedFittingLog
  deleteFittingLog: (id: string) => void

  addNote: (note: Omit<SavedNote, 'id'>) => SavedNote
  updateNote: (id: string, updates: Partial<SavedNote>) => void
  deleteNote: (id: string) => void
}

function sanitizeNote(r: any): SavedNote {
  return {
    id: safeString(r.id, generateUUID()),
    projectId: toValidUUIDOrNull(r.projectId || r.project_id) || undefined,
    collectionId: toValidUUIDOrNull(r.collectionId || r.collection_id) || undefined,
    importedFromId: toValidUUIDOrNull(r.importedFromId || r.imported_from_id) || undefined,
    title: safeString(r.title, 'Fitting Note'),
    category: safeString(r.category, 'Fitting Notes'),
    content: safeString(r.content, ''),
    date: safeString(r.date, 'Today'),
    tag: safeString(r.tag, 'Fitting Spec'),
    lookRef: safeString(r.lookRef || r.look_ref, ''),
    createdAt: safeString(r.createdAt || r.created_at, new Date().toISOString()),
  }
}

function sanitizeProject(r: any): SavedProject {
  return {
    id: safeString(r.id, generateUUID()),
    code: safeString(r.code, '#CR-1001'),
    title: safeString(r.title, 'Untitled Collection'),
    category: safeString(r.category, 'Assignment'),
    season: safeString(r.season, 'Fashion Design 101'),
    targetDate: safeString(r.targetDate || r.target_date, '2026-11-18'),
    stage: safeString(r.stage, 'Sampling (Phase 6 of 9)'),
    stageNum: Number(r.stageNum ?? r.stage_num ?? 6),
    percent: Number(r.percent ?? 75),
    palette: Array.isArray(r.palette) ? r.palette : [],
    garmentsCount: Number(r.garmentsCount ?? r.garments_count ?? 0),
    description: safeString(r.description, ''),
    createdAt: safeString(r.createdAt || r.created_at, new Date().toISOString()),
  }
}

function sanitizeSketch(r: any): SavedSketch {
  return {
    id: safeString(r.id, generateUUID()),
    projectId: toValidUUIDOrNull(r.projectId || r.project_id) || undefined,
    importedFromId: toValidUUIDOrNull(r.importedFromId || r.imported_from_id) || undefined,
    title: safeString(r.title, 'Untitled Sketch'),
    collectionTitle: safeString(r.collectionTitle || r.collection_title, ''),
    garmentType: safeString(r.garmentType || r.garment_type, 'Outerwear/Tailoring'),
    fabricName: safeString(r.fabricName || r.fabric_name, 'Silk Velvet'),
    imageUrl: safeString(r.imageUrl || r.image_url, ''),
    score: Number(r.score ?? 95),
    aiCritique: safeString(r.aiCritique || r.ai_critique, ''),
    savedAt: safeString(r.savedAt || r.created_at, new Date().toISOString()),
  }
}

function sanitizePattern(r: any): SavedPattern {
  return {
    id: safeString(r.id, generateUUID()),
    projectId: toValidUUIDOrNull(r.projectId || r.project_id) || undefined,
    importedFromId: toValidUUIDOrNull(r.importedFromId || r.imported_from_id) || undefined,
    number: safeString(r.number, '01'),
    patternNo: safeString(r.patternNo || r.pattern_no, 'PT-101'),
    title: safeString(r.title, 'Untitled Pattern'),
    category: safeString(r.category, 'Outerwear'),
    status: safeString(r.status, 'Ready'),
    statusType: (r.statusType || r.status_type || 'approved') as any,
    fabric: safeString(r.fabric, ''),
    notions: safeString(r.notions, ''),
    nextFitting: safeString(r.nextFitting || r.next_fitting, ''),
    modeliste: safeString(r.modeliste, 'Ariba'),
    pieces: Number(r.pieces ?? 1),
    description: safeString(r.description, ''),
    measurements: safeString(r.measurements, ''),
    image: safeString(r.image, ''),
  }
}

function sanitizeFabric(r: any): SavedFabric {
  return {
    id: safeString(r.id, generateUUID()),
    name: safeString(r.name, 'Textile Swatch'),
    type: safeString(r.type, 'Silk Velvet'),
    weight: safeString(r.weight, '320 GSM'),
    origin: safeString(r.origin, 'Como, Italy'),
    metersLeft: Number(r.metersLeft ?? r.meters_left ?? 25),
    availability: (r.availability || 'In Stock') as any,
    imageUrl: safeString(r.imageUrl || r.image_url, ''),
    costPerMeter: Number(r.costPerMeter ?? r.cost_per_meter ?? 120),
    supplier: safeString(r.supplier, 'Biella Textiles Milan'),
  }
}

function sanitizeDeadline(r: any): SavedDeadline {
  return {
    id: safeString(r.id, generateUUID()),
    title: safeString(r.title, 'Runway Deadline'),
    detail: safeString(r.detail, ''),
    daysLeft: Number(r.daysLeft ?? r.days_left ?? 3),
    urgency: (r.urgency || 'medium') as any,
    date: safeString(r.date, 'Upcoming'),
  }
}

let realtimeSubscribed = false

export const setupRealtimeSync = () => {
  if (realtimeSubscribed) return
  realtimeSubscribed = true

  try {
    supabase
      .channel('atelier_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (_payload) => {
          useAtelierStore.getState().fetchFromSupabase()
        }
      )
      .subscribe()
  } catch (err) {
    console.warn('Realtime subscription error:', err)
  }
}

export const useAtelierStore = create<AtelierState>()(
  persist(
    (set, get) => ({
      projects: [],
      sketches: [],
      fabrics: [],
      deadlines: [],
      patterns: [],
      moodboards: [],
      fittingLogs: [],
      notes: [],

      fetchFromSupabase: async () => {
        try {
          const [pRes, nRes, sRes, patRes, fRes, dRes] = await Promise.all([
            supabase.from('projects').select('*').order('created_at', { ascending: false }),
            supabase.from('notes').select('*').order('created_at', { ascending: false }),
            supabase.from('sketches').select('*').order('created_at', { ascending: false }),
            supabase.from('patterns').select('*').order('created_at', { ascending: false }),
            supabase.from('fabrics').select('*').order('created_at', { ascending: false }),
            supabase.from('deadlines').select('*').order('created_at', { ascending: false }),
          ])

          if (pRes.data && pRes.data.length > 0) {
            set({ projects: pRes.data.map(sanitizeProject) })
          }

          if (nRes.data && nRes.data.length > 0) {
            set({ notes: nRes.data.map(sanitizeNote) })
          }

          if (sRes.data && sRes.data.length > 0) {
            set({ sketches: sRes.data.map(sanitizeSketch) })
          }

          if (patRes.data && patRes.data.length > 0) {
            set({ patterns: patRes.data.map(sanitizePattern) })
          }

          if (fRes.data && fRes.data.length > 0) {
            set({ fabrics: fRes.data.map(sanitizeFabric) })
          }

          if (dRes.data && dRes.data.length > 0) {
            set({ deadlines: dRes.data.map(sanitizeDeadline) })
          }
        } catch (err) {
          console.error('Error syncing Supabase atelier data:', err)
        }
      },

      addProject: (projectData) => {
        const id = generateUUID()
        const newProject: SavedProject = sanitizeProject({
          ...projectData,
          id,
          createdAt: new Date().toISOString(),
        })
        set((state) => ({ projects: [newProject, ...state.projects] }))

        supabase.from('projects').upsert({
          id: newProject.id,
          code: newProject.code,
          title: newProject.title,
          category: newProject.category,
          season: newProject.season,
          target_date: newProject.targetDate,
          stage: newProject.stage,
          stage_num: newProject.stageNum,
          percent: newProject.percent,
          palette: newProject.palette,
          garments_count: newProject.garmentsCount,
          description: newProject.description,
          created_at: newProject.createdAt,
        }).then(({ error }) => {
          if (error) console.error('Supabase addProject error:', error.message)
        })

        return newProject
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? sanitizeProject({ ...p, ...updates }) : p)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = safeString(updates.title)
        if (updates.category !== undefined) dbUpdates.category = safeString(updates.category)
        if (updates.season !== undefined) dbUpdates.season = safeString(updates.season)
        if (updates.targetDate !== undefined) dbUpdates.target_date = safeString(updates.targetDate)
        if (updates.stage !== undefined) dbUpdates.stage = safeString(updates.stage)
        if (updates.stageNum !== undefined) dbUpdates.stage_num = updates.stageNum
        if (updates.percent !== undefined) dbUpdates.percent = updates.percent
        if (updates.palette !== undefined) dbUpdates.palette = updates.palette
        if (updates.description !== undefined) dbUpdates.description = safeString(updates.description)

        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('projects').update(dbUpdates).eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase updateProject error:', error.message)
          })
        }
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('projects').delete().eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase deleteProject error:', error.message)
          })
        }
      },

      addSketch: (sketchData) => {
        const id = generateUUID()
        const newSketch: SavedSketch = sanitizeSketch({
          ...sketchData,
          id,
          savedAt: new Date().toISOString(),
        })
        set((state) => ({ sketches: [newSketch, ...state.sketches] }))

        supabase.from('sketches').upsert({
          id: newSketch.id,
          project_id: toValidUUIDOrNull(newSketch.projectId),
          imported_from_id: toValidUUIDOrNull(newSketch.importedFromId),
          title: newSketch.title,
          collection_title: newSketch.collectionTitle || null,
          garment_type: newSketch.garmentType,
          fabric_name: newSketch.fabricName,
          image_url: newSketch.imageUrl,
          ai_critique: newSketch.aiCritique || null,
          score: newSketch.score || 95,
          created_at: newSketch.savedAt,
        }).then(({ error }) => {
          if (error) console.error('Supabase addSketch error:', error.message)
        })

        return newSketch
      },

      updateSketch: (id, updates) => {
        set((state) => ({
          sketches: state.sketches.map((s) => (s.id === id ? sanitizeSketch({ ...s, ...updates }) : s)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = safeString(updates.title)
        if (updates.garmentType !== undefined) dbUpdates.garment_type = safeString(updates.garmentType)
        if (updates.fabricName !== undefined) dbUpdates.fabric_name = safeString(updates.fabricName)

        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('sketches').update(dbUpdates).eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase updateSketch error:', error.message)
          })
        }
      },

      deleteSketch: (id) => {
        set((state) => ({ sketches: state.sketches.filter((s) => s.id !== id) }))
        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('sketches').delete().eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase deleteSketch error:', error.message)
          })
        }
      },

      addFabric: (fabricData) => {
        const id = generateUUID()
        const newFabric: SavedFabric = sanitizeFabric({
          ...fabricData,
          id,
        })
        set((state) => ({ fabrics: [newFabric, ...state.fabrics] }))

        supabase.from('fabrics').upsert({
          id: newFabric.id,
          name: newFabric.name,
          type: newFabric.type,
          weight: newFabric.weight,
          origin: newFabric.origin,
          meters_left: newFabric.metersLeft,
          availability: newFabric.availability,
          image_url: newFabric.imageUrl,
          cost_per_meter: newFabric.costPerMeter,
          supplier: newFabric.supplier,
        }).then(({ error }) => {
          if (error) console.error('Supabase addFabric error:', error.message)
        })

        return newFabric
      },

      deleteFabric: (id) => {
        set((state) => ({ fabrics: state.fabrics.filter((f) => f.id !== id) }))
        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('fabrics').delete().eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase deleteFabric error:', error.message)
          })
        }
      },

      addDeadline: (deadlineData) => {
        const id = generateUUID()
        const newDeadline: SavedDeadline = sanitizeDeadline({
          ...deadlineData,
          id,
        })
        set((state) => ({ deadlines: [newDeadline, ...state.deadlines] }))

        supabase.from('deadlines').upsert({
          id: newDeadline.id,
          title: newDeadline.title,
          detail: newDeadline.detail,
          days_left: newDeadline.daysLeft,
          urgency: newDeadline.urgency,
          date: newDeadline.date,
        }).then(({ error }) => {
          if (error) console.error('Supabase addDeadline error:', error.message)
        })

        return newDeadline
      },

      deleteDeadline: (id) => {
        set((state) => ({ deadlines: state.deadlines.filter((d) => d.id !== id) }))
        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('deadlines').delete().eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase deleteDeadline error:', error.message)
          })
        }
      },

      addPattern: (patternData) => {
        const id = generateUUID()
        const newPattern: SavedPattern = sanitizePattern({ ...patternData, id })
        set((state) => ({ patterns: [newPattern, ...state.patterns] }))

        supabase.from('patterns').upsert({
          id: newPattern.id,
          project_id: toValidUUIDOrNull(newPattern.projectId),
          imported_from_id: toValidUUIDOrNull(newPattern.importedFromId),
          number: newPattern.number,
          pattern_no: newPattern.patternNo,
          title: newPattern.title,
          category: newPattern.category,
          status: newPattern.status,
          status_type: newPattern.statusType,
          fabric: newPattern.fabric,
          notions: newPattern.notions,
          next_fitting: newPattern.nextFitting,
          modeliste: newPattern.modeliste,
          pieces: newPattern.pieces,
          description: newPattern.description,
          measurements: newPattern.measurements || null,
          image: newPattern.image,
        }).then(({ error }) => {
          if (error) console.error('Supabase addPattern error:', error.message)
        })

        return newPattern
      },

      updatePattern: (id, updates) => {
        set((state) => ({
          patterns: state.patterns.map((p) => (p.id === id ? sanitizePattern({ ...p, ...updates }) : p)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = safeString(updates.title)
        if (updates.category !== undefined) dbUpdates.category = safeString(updates.category)
        if (updates.description !== undefined) dbUpdates.description = safeString(updates.description)
        if (updates.measurements !== undefined) dbUpdates.measurements = safeString(updates.measurements)
        if (updates.image !== undefined) dbUpdates.image = safeString(updates.image)

        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('patterns').update(dbUpdates).eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase updatePattern error:', error.message)
          })
        }
      },

      deletePattern: (id) => {
        set((state) => ({ patterns: state.patterns.filter((p) => p.id !== id) }))
        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('patterns').delete().eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase deletePattern error:', error.message)
          })
        }
      },

      addMoodboard: (moodboardData) => {
        const id = generateUUID()
        const newMoodboard: SavedMoodboard = { ...moodboardData, id }
        set((state) => ({ moodboards: [newMoodboard, ...state.moodboards] }))
        return newMoodboard
      },

      deleteMoodboard: (id) => {
        set((state) => ({ moodboards: state.moodboards.filter((m) => m.id !== id) }))
      },

      addFittingLog: (fittingLogData) => {
        const id = generateUUID()
        const newFittingLog: SavedFittingLog = { ...fittingLogData, id }
        set((state) => ({ fittingLogs: [newFittingLog, ...state.fittingLogs] }))
        return newFittingLog
      },

      deleteFittingLog: (id) => {
        set((state) => ({ fittingLogs: state.fittingLogs.filter((f) => f.id !== id) }))
      },

      addNote: (noteData) => {
        const id = generateUUID()
        const newNote: SavedNote = sanitizeNote({
          ...noteData,
          id,
          createdAt: noteData.createdAt || new Date().toISOString(),
        })
        set((state) => ({ notes: [newNote, ...state.notes] }))

        supabase.from('notes').upsert({
          id: newNote.id,
          project_id: toValidUUIDOrNull(newNote.projectId),
          collection_id: toValidUUIDOrNull(newNote.collectionId),
          imported_from_id: toValidUUIDOrNull(newNote.importedFromId),
          title: newNote.title,
          category: newNote.category || 'Fitting Notes',
          content: newNote.content,
          date: newNote.date || 'Today',
          tag: newNote.tag || 'Fitting Spec',
          look_ref: newNote.lookRef || null,
          created_at: newNote.createdAt,
        }).then(({ error }) => {
          if (error) console.error('Supabase addNote error:', error.message)
        })

        return newNote
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? sanitizeNote({ ...n, ...updates }) : n)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = safeString(updates.title)
        if (updates.category !== undefined) dbUpdates.category = safeString(updates.category)
        if (updates.content !== undefined) dbUpdates.content = safeString(updates.content)
        if (updates.date !== undefined) dbUpdates.date = safeString(updates.date)
        if (updates.tag !== undefined) dbUpdates.tag = safeString(updates.tag)
        if (updates.lookRef !== undefined) dbUpdates.look_ref = safeString(updates.lookRef)
        if (updates.collectionId !== undefined) dbUpdates.collection_id = toValidUUIDOrNull(updates.collectionId)

        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('notes').update(dbUpdates).eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase updateNote error:', error.message)
          })
        }
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
        const validId = toValidUUIDOrNull(id)
        if (validId) {
          supabase.from('notes').delete().eq('id', validId).then(({ error }) => {
            if (error) console.error('Supabase deleteNote error:', error.message)
          })
        }
      },
    }),
    {
      name: 'ariba_atelier_store',
      // Sanitize stored data when loaded from localStorage
      merge: (persistedState: any, currentState) => {
        const p = persistedState || {}
        return {
          ...currentState,
          ...p,
          projects: Array.isArray(p.projects) ? p.projects.map(sanitizeProject) : currentState.projects,
          sketches: Array.isArray(p.sketches) ? p.sketches.map(sanitizeSketch) : currentState.sketches,
          fabrics: Array.isArray(p.fabrics) ? p.fabrics.map(sanitizeFabric) : currentState.fabrics,
          deadlines: Array.isArray(p.deadlines) ? p.deadlines.map(sanitizeDeadline) : currentState.deadlines,
          patterns: Array.isArray(p.patterns) ? p.patterns.map(sanitizePattern) : currentState.patterns,
          notes: Array.isArray(p.notes) ? p.notes.map(sanitizeNote) : currentState.notes,
        }
      },
    }
  )
)
