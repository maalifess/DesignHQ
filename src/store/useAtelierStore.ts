import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  title: string
  content: string
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

      addProject: (projectData) => {
        const id = 'proj-' + Date.now()
        const newProject: SavedProject = {
          ...projectData,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ projects: [newProject, ...state.projects] }))
        return newProject
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
      },

      addSketch: (sketchData) => {
        const id = 'sketch-' + Date.now()
        const newSketch: SavedSketch = {
          ...sketchData,
          id,
          savedAt: new Date().toISOString(),
        }
        set((state) => ({ sketches: [newSketch, ...state.sketches] }))
        return newSketch
      },

      updateSketch: (id, updates) => {
        set((state) => ({
          sketches: state.sketches.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }))
      },

      deleteSketch: (id) => {
        set((state) => ({ sketches: state.sketches.filter((s) => s.id !== id) }))
      },

      addFabric: (fabricData) => {
        const id = 'fabric-' + Date.now()
        const newFabric: SavedFabric = {
          ...fabricData,
          id,
        }
        set((state) => ({ fabrics: [newFabric, ...state.fabrics] }))
        return newFabric
      },

      deleteFabric: (id) => {
        set((state) => ({ fabrics: state.fabrics.filter((f) => f.id !== id) }))
      },

      addDeadline: (deadlineData) => {
        const id = 'dl-' + Date.now()
        const newDeadline: SavedDeadline = {
          ...deadlineData,
          id,
        }
        set((state) => ({ deadlines: [newDeadline, ...state.deadlines] }))
        return newDeadline
      },

      deleteDeadline: (id) => {
        set((state) => ({ deadlines: state.deadlines.filter((d) => d.id !== id) }))
      },

      addPattern: (patternData) => {
        const id = 'pattern-' + Date.now()
        const newPattern: SavedPattern = { ...patternData, id }
        set((state) => ({ patterns: [newPattern, ...state.patterns] }))
        return newPattern
      },
      updatePattern: (id, updates) => {
        set((state) => ({
          patterns: state.patterns.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },
      deletePattern: (id) => {
        set((state) => ({ patterns: state.patterns.filter((p) => p.id !== id) }))
      },

      addMoodboard: (moodboardData) => {
        const id = 'moodboard-' + Date.now()
        const newMoodboard: SavedMoodboard = { ...moodboardData, id }
        set((state) => ({ moodboards: [newMoodboard, ...state.moodboards] }))
        return newMoodboard
      },
      deleteMoodboard: (id) => {
        set((state) => ({ moodboards: state.moodboards.filter((m) => m.id !== id) }))
      },

      addFittingLog: (fittingLogData) => {
        const id = 'fittingLog-' + Date.now()
        const newFittingLog: SavedFittingLog = { ...fittingLogData, id }
        set((state) => ({ fittingLogs: [newFittingLog, ...state.fittingLogs] }))
        return newFittingLog
      },
      deleteFittingLog: (id) => {
        set((state) => ({ fittingLogs: state.fittingLogs.filter((f) => f.id !== id) }))
      },

      addNote: (noteData) => {
        const id = 'note-' + Date.now()
        const newNote: SavedNote = { ...noteData, id }
        set((state) => ({ notes: [newNote, ...state.notes] }))
        return newNote
      },
      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
      },
    }),
    {
      name: 'ariba_atelier_store',
    }
  )
)
