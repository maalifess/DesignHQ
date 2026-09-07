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
            const mapped: SavedProject[] = pRes.data.map((r: any) => ({
              id: r.id,
              code: r.code || '#CR-1001',
              title: r.title,
              category: r.category || 'Assignment',
              season: r.season || 'Fashion Design 101',
              targetDate: r.target_date || '2026-11-18',
              stage: r.stage || 'Sampling (Phase 6 of 9)',
              stageNum: r.stage_num ?? 6,
              percent: r.percent ?? 75,
              palette: Array.isArray(r.palette) ? r.palette : [],
              garmentsCount: r.garments_count ?? 0,
              description: r.description || '',
              createdAt: r.created_at || new Date().toISOString(),
            }))
            set({ projects: mapped })
          }

          if (nRes.data && nRes.data.length > 0) {
            const mapped: SavedNote[] = nRes.data.map((r: any) => ({
              id: r.id,
              projectId: r.project_id || undefined,
              collectionId: r.collection_id || undefined,
              importedFromId: r.imported_from_id || undefined,
              title: r.title || 'Fitting Note',
              category: r.category || 'Fitting Notes',
              content: r.content || '',
              date: r.date || 'Today',
              tag: r.tag || 'Fitting Spec',
              lookRef: r.look_ref || undefined,
              createdAt: r.created_at || new Date().toISOString(),
            }))
            set({ notes: mapped })
          }

          if (sRes.data && sRes.data.length > 0) {
            const mapped: SavedSketch[] = sRes.data.map((r: any) => ({
              id: r.id,
              projectId: r.project_id || undefined,
              importedFromId: r.imported_from_id || undefined,
              title: r.title || 'Untitled Sketch',
              collectionTitle: r.collection_title || undefined,
              garmentType: r.garment_type || 'Outerwear/Tailoring',
              fabricName: r.fabric_name || 'Silk Velvet',
              imageUrl: r.image_url || '',
              score: r.score || 95,
              aiCritique: r.ai_critique || '',
              savedAt: r.created_at || new Date().toISOString(),
            }))
            set({ sketches: mapped })
          }

          if (patRes.data && patRes.data.length > 0) {
            const mapped: SavedPattern[] = patRes.data.map((r: any) => ({
              id: r.id,
              projectId: r.project_id || undefined,
              importedFromId: r.imported_from_id || undefined,
              number: r.number || '01',
              patternNo: r.pattern_no || 'PT-101',
              title: r.title || 'Untitled Pattern',
              category: r.category || 'Outerwear',
              status: r.status || 'Ready',
              statusType: r.status_type || 'approved',
              fabric: r.fabric || '',
              notions: r.notions || '',
              nextFitting: r.next_fitting || '',
              modeliste: r.modeliste || 'Ariba',
              pieces: r.pieces || 1,
              description: r.description || '',
              measurements: r.measurements || '',
              image: r.image || '',
            }))
            set({ patterns: mapped })
          }

          if (fRes.data && fRes.data.length > 0) {
            const mapped: SavedFabric[] = fRes.data.map((r: any) => ({
              id: r.id,
              name: r.name,
              type: r.type || 'Silk Velvet',
              weight: r.weight || '320 GSM',
              origin: r.origin || 'Como, Italy',
              metersLeft: r.meters_left ?? 25,
              availability: r.availability || 'In Stock',
              imageUrl: r.image_url || '',
              costPerMeter: r.cost_per_meter ?? 120,
              supplier: r.supplier || 'Biella Textiles Milan',
            }))
            set({ fabrics: mapped })
          }

          if (dRes.data && dRes.data.length > 0) {
            const mapped: SavedDeadline[] = dRes.data.map((r: any) => ({
              id: r.id,
              title: r.title,
              detail: r.detail || '',
              daysLeft: r.days_left ?? 3,
              urgency: r.urgency || 'medium',
              date: r.date || 'Upcoming',
            }))
            set({ deadlines: mapped })
          }
        } catch (err) {
          console.error('Error syncing Supabase atelier data:', err)
        }
      },

      addProject: (projectData) => {
        const id = generateUUID()
        const newProject: SavedProject = {
          ...projectData,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ projects: [newProject, ...state.projects] }))

        supabase.from('projects').insert({
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
          if (error) console.error('Supabase addProject error:', error)
        })

        return newProject
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = updates.title
        if (updates.category !== undefined) dbUpdates.category = updates.category
        if (updates.season !== undefined) dbUpdates.season = updates.season
        if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate
        if (updates.stage !== undefined) dbUpdates.stage = updates.stage
        if (updates.stageNum !== undefined) dbUpdates.stage_num = updates.stageNum
        if (updates.percent !== undefined) dbUpdates.percent = updates.percent
        if (updates.palette !== undefined) dbUpdates.palette = updates.palette
        if (updates.description !== undefined) dbUpdates.description = updates.description

        supabase.from('projects').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase updateProject error:', error)
        })
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
        supabase.from('projects').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase deleteProject error:', error)
        })
      },

      addSketch: (sketchData) => {
        const id = generateUUID()
        const newSketch: SavedSketch = {
          ...sketchData,
          id,
          savedAt: new Date().toISOString(),
        }
        set((state) => ({ sketches: [newSketch, ...state.sketches] }))

        supabase.from('sketches').insert({
          id: newSketch.id,
          project_id: newSketch.projectId || null,
          imported_from_id: newSketch.importedFromId || null,
          title: newSketch.title,
          collection_title: newSketch.collectionTitle || null,
          garment_type: newSketch.garmentType,
          fabric_name: newSketch.fabricName,
          image_url: newSketch.imageUrl,
          ai_critique: newSketch.aiCritique || null,
          score: newSketch.score || 95,
          created_at: newSketch.savedAt,
        }).then(({ error }) => {
          if (error) console.error('Supabase addSketch error:', error)
        })

        return newSketch
      },

      updateSketch: (id, updates) => {
        set((state) => ({
          sketches: state.sketches.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = updates.title
        if (updates.garmentType !== undefined) dbUpdates.garment_type = updates.garmentType
        if (updates.fabricName !== undefined) dbUpdates.fabric_name = updates.fabricName

        supabase.from('sketches').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase updateSketch error:', error)
        })
      },

      deleteSketch: (id) => {
        set((state) => ({ sketches: state.sketches.filter((s) => s.id !== id) }))
        supabase.from('sketches').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase deleteSketch error:', error)
        })
      },

      addFabric: (fabricData) => {
        const id = generateUUID()
        const newFabric: SavedFabric = {
          ...fabricData,
          id,
        }
        set((state) => ({ fabrics: [newFabric, ...state.fabrics] }))

        supabase.from('fabrics').insert({
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
          if (error) console.error('Supabase addFabric error:', error)
        })

        return newFabric
      },

      deleteFabric: (id) => {
        set((state) => ({ fabrics: state.fabrics.filter((f) => f.id !== id) }))
        supabase.from('fabrics').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase deleteFabric error:', error)
        })
      },

      addDeadline: (deadlineData) => {
        const id = generateUUID()
        const newDeadline: SavedDeadline = {
          ...deadlineData,
          id,
        }
        set((state) => ({ deadlines: [newDeadline, ...state.deadlines] }))

        supabase.from('deadlines').insert({
          id: newDeadline.id,
          title: newDeadline.title,
          detail: newDeadline.detail,
          days_left: newDeadline.daysLeft,
          urgency: newDeadline.urgency,
          date: newDeadline.date,
        }).then(({ error }) => {
          if (error) console.error('Supabase addDeadline error:', error)
        })

        return newDeadline
      },

      deleteDeadline: (id) => {
        set((state) => ({ deadlines: state.deadlines.filter((d) => d.id !== id) }))
        supabase.from('deadlines').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase deleteDeadline error:', error)
        })
      },

      addPattern: (patternData) => {
        const id = generateUUID()
        const newPattern: SavedPattern = { ...patternData, id }
        set((state) => ({ patterns: [newPattern, ...state.patterns] }))

        supabase.from('patterns').insert({
          id: newPattern.id,
          project_id: newPattern.projectId || null,
          imported_from_id: newPattern.importedFromId || null,
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
          if (error) console.error('Supabase addPattern error:', error)
        })

        return newPattern
      },

      updatePattern: (id, updates) => {
        set((state) => ({
          patterns: state.patterns.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = updates.title
        if (updates.category !== undefined) dbUpdates.category = updates.category
        if (updates.description !== undefined) dbUpdates.description = updates.description
        if (updates.measurements !== undefined) dbUpdates.measurements = updates.measurements
        if (updates.image !== undefined) dbUpdates.image = updates.image

        supabase.from('patterns').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase updatePattern error:', error)
        })
      },

      deletePattern: (id) => {
        set((state) => ({ patterns: state.patterns.filter((p) => p.id !== id) }))
        supabase.from('patterns').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase deletePattern error:', error)
        })
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
        const newNote: SavedNote = {
          ...noteData,
          id,
          createdAt: noteData.createdAt || new Date().toISOString(),
        }
        set((state) => ({ notes: [newNote, ...state.notes] }))

        supabase.from('notes').insert({
          id: newNote.id,
          project_id: newNote.projectId || null,
          collection_id: newNote.collectionId || null,
          imported_from_id: newNote.importedFromId || null,
          title: newNote.title,
          category: newNote.category || 'Fitting Notes',
          content: newNote.content,
          date: newNote.date || 'Today',
          tag: newNote.tag || 'Fitting Spec',
          look_ref: newNote.lookRef || null,
          created_at: newNote.createdAt,
        }).then(({ error }) => {
          if (error) console.error('Supabase addNote error:', error)
        })

        return newNote
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        }))

        const dbUpdates: any = {}
        if (updates.title !== undefined) dbUpdates.title = updates.title
        if (updates.category !== undefined) dbUpdates.category = updates.category
        if (updates.content !== undefined) dbUpdates.content = updates.content
        if (updates.date !== undefined) dbUpdates.date = updates.date
        if (updates.tag !== undefined) dbUpdates.tag = updates.tag
        if (updates.lookRef !== undefined) dbUpdates.look_ref = updates.lookRef
        if (updates.collectionId !== undefined) dbUpdates.collection_id = updates.collectionId

        supabase.from('notes').update(dbUpdates).eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase updateNote error:', error)
        })
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
        supabase.from('notes').delete().eq('id', id).then(({ error }) => {
          if (error) console.error('Supabase deleteNote error:', error)
        })
      },
    }),
    {
      name: 'ariba_atelier_store',
    }
  )
)
