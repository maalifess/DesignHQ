import { create } from 'zustand'

export interface Layer {
  id: string
  name: string
  type: 'drawing' | 'shape' | 'text' | 'image'
  visible: boolean
  locked: boolean
  fabricObjectIndex: number
}

interface SketchState {
  canvasRef: any | null
  layers: Layer[]
  selectedLayerId: string | null
  activeTool: string
  strokeColor: string
  fillColor: string
  strokeWidth: number
  opacity: number
  isEraser: boolean
  undoStack: string[]
  redoStack: string[]
  isDirty: boolean
  lastSaved: Date | null
  versions: { version: number; data: string; savedAt: Date }[]

  // Actions
  setCanvasRef: (ref: any) => void
  setLayers: (layers: Layer[]) => void
  setSelectedLayer: (id: string | null) => void
  setActiveTool: (tool: string) => void
  setStrokeColor: (color: string) => void
  setFillColor: (color: string) => void
  setStrokeWidth: (width: number) => void
  setOpacity: (opacity: number) => void
  setIsEraser: (isEraser: boolean) => void
  pushUndo: (state: string) => void
  undo: () => string | null
  redo: () => string | null
  setDirty: (dirty: boolean) => void
  setLastSaved: (date: Date) => void
  addVersion: (data: string) => void
}

export const useSketchStore = create<SketchState>((set, get) => ({
  canvasRef: null,
  layers: [],
  selectedLayerId: null,
  activeTool: 'select',
  strokeColor: '#800020',
  fillColor: 'transparent',
  strokeWidth: 3,
  opacity: 1,
  isEraser: false,
  undoStack: [],
  redoStack: [],
  isDirty: false,
  lastSaved: null,
  versions: [],

  setCanvasRef: (ref) => set({ canvasRef: ref }),
  setLayers: (layers) => set({ layers }),
  setSelectedLayer: (id) => set({ selectedLayerId: id }),
  setActiveTool: (tool) => set({ activeTool: tool, isEraser: tool === 'eraser' }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setOpacity: (opacity) => set({ opacity }),
  setIsEraser: (isEraser) => set({ isEraser }),
  pushUndo: (state) => {
    set((s) => ({
      undoStack: [...s.undoStack.slice(-49), state],
      redoStack: [],
      isDirty: true,
    }))
  },
  undo: () => {
    const { undoStack, redoStack } = get()
    if (undoStack.length === 0) return null
    const prev = undoStack[undoStack.length - 2] ?? null
    const current = undoStack[undoStack.length - 1]
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, current],
    })
    return prev
  },
  redo: () => {
    const { redoStack, undoStack } = get()
    if (redoStack.length === 0) return null
    const next = redoStack[redoStack.length - 1]
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, next],
    })
    return next
  },
  setDirty: (dirty) => set({ isDirty: dirty }),
  setLastSaved: (date) => set({ lastSaved: date, isDirty: false }),
  addVersion: (data) => {
    set((s) => {
      const versions = [
        ...s.versions,
        { version: s.versions.length + 1, data, savedAt: new Date() },
      ].slice(-20) // max 20 versions
      return { versions }
    })
  },
}))
