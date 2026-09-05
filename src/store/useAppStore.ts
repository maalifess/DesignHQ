import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface AppState {
  // UI
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  darkMode: boolean
  activeProjectId: string | null
  toasts: Toast[]

  // Actions
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleDarkMode: () => void
  setDarkMode: (dark: boolean) => void
  setActiveProject: (id: string | null) => void
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      darkMode: false,
      activeProjectId: null,
      toasts: [],

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleDarkMode: () => {
        const next = !get().darkMode
        set({ darkMode: next })
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
      },
      setDarkMode: (dark) => {
        set({ darkMode: dark })
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
      },
      setActiveProject: (id) => set({ activeProjectId: id }),
      addToast: (message, type = 'success') => {
        const id = Date.now().toString()
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
        setTimeout(() => get().removeToast(id), 3500)
      },
      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'designhq-app-store',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
