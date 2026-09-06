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
  title: string
  collectionTitle?: string
  garmentType: string
  fabricName: string
  imageUrl: string
  score: number
  aiCritique: string
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

interface AtelierState {
  projects: SavedProject[]
  sketches: SavedSketch[]
  fabrics: SavedFabric[]
  deadlines: SavedDeadline[]

  // Actions
  addProject: (project: Omit<SavedProject, 'id' | 'createdAt'>) => SavedProject
  updateProject: (id: string, updates: Partial<SavedProject>) => void
  deleteProject: (id: string) => void

  addSketch: (sketch: Omit<SavedSketch, 'id' | 'savedAt'>) => SavedSketch
  deleteSketch: (id: string) => void

  addFabric: (fabric: Omit<SavedFabric, 'id'>) => SavedFabric
  deleteFabric: (id: string) => void

  addDeadline: (deadline: Omit<SavedDeadline, 'id'>) => SavedDeadline
  deleteDeadline: (id: string) => void
}

export const useAtelierStore = create<AtelierState>()(
  persist(
    (set, get) => ({
      projects: [],
      sketches: [],
      fabrics: [],
      deadlines: [],

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
    }),
    {
      name: 'ariba_atelier_store',
    }
  )
)
