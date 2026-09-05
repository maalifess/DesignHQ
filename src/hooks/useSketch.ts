import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useAppStore } from '@/store/useAppStore'

export interface Sketch {
  id: string
  project_id: string | null
  user_id: string
  title: string
  canvas_data: any | null
  thumbnail_url: string | null
  annotations: SketchAnnotations | null
  version_history: SketchVersion[]
  created_at: string
  updated_at: string
}

export interface SketchAnnotations {
  garment_type?: string
  silhouette?: string
  primary_color?: string
  secondary_colors?: string[]
  fabrics?: string[]
  season?: string
  occasion?: string
  cost_range?: string
  technical_notes?: string
}

export interface SketchVersion {
  version: number
  canvas_data: any
  saved_at: string
}

export function useSketch() {
  const { user } = useAuth()
  const { addToast } = useAppStore()
  const [sketches, setSketches] = useState<Sketch[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSketches = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('sketches')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setSketches(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchSketches() }, [fetchSketches])

  const createSketch = async (title: string = 'Untitled Sketch', projectId?: string): Promise<Sketch | null> => {
    if (!user) return null
    const { data, error } = await supabase
      .from('sketches')
      .insert({
        user_id: user.id,
        title,
        project_id: projectId || null,
        version_history: [],
      })
      .select()
      .single()
    if (error) { addToast('Failed to create sketch', 'error'); return null }
    setSketches((prev) => [data, ...prev])
    return data
  }

  const saveSketch = async (id: string, canvasData: any, thumbnailUrl?: string, addVersion: boolean = false) => {
    const sketch = sketches.find((s) => s.id === id)
    let version_history = sketch?.version_history || []

    if (addVersion) {
      const newVersion: SketchVersion = {
        version: version_history.length + 1,
        canvas_data: canvasData,
        saved_at: new Date().toISOString(),
      }
      version_history = [...version_history, newVersion].slice(-20)
    }

    const { error } = await supabase
      .from('sketches')
      .update({
        canvas_data: canvasData,
        thumbnail_url: thumbnailUrl,
        version_history,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) { addToast('Failed to save sketch', 'error'); return }
    setSketches((prev) => prev.map((s) => s.id === id ? { ...s, canvas_data: canvasData, thumbnail_url: thumbnailUrl || s.thumbnail_url, version_history, updated_at: new Date().toISOString() } : s))
  }

  const updateAnnotations = async (id: string, annotations: SketchAnnotations) => {
    await supabase.from('sketches').update({ annotations }).eq('id', id)
    setSketches((prev) => prev.map((s) => s.id === id ? { ...s, annotations } : s))
  }

  const deleteSketch = async (id: string) => {
    setSketches((prev) => prev.filter((s) => s.id !== id))
    await supabase.from('sketches').delete().eq('id', id)
    addToast('Sketch deleted', 'info')
  }

  const renameSketch = async (id: string, title: string) => {
    setSketches((prev) => prev.map((s) => s.id === id ? { ...s, title } : s))
    await supabase.from('sketches').update({ title }).eq('id', id)
  }

  return { sketches, loading, createSketch, saveSketch, updateAnnotations, deleteSketch, renameSketch, refetch: fetchSketches }
}
