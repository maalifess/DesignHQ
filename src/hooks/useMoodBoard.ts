import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useAppStore } from '@/store/useAppStore'

export interface MoodBoard {
  id: string
  project_id: string | null
  user_id: string
  name: string
  canvas_data: any | null
  extracted_colors: string[] | null
  ai_tags: any | null
  created_at: string
  updated_at: string
}

export interface MoodBoardImage {
  id: string
  mood_board_id: string
  image_url: string
  caption: string | null
  position: { x: number; y: number; width: number; height: number; rotation: number; zIndex: number }
  ai_tags: any | null
  dominant_colors: string[] | null
  uploaded_at: string
}

export function useMoodBoard() {
  const { user } = useAuth()
  const { addToast } = useAppStore()
  const [moodBoards, setMoodBoards] = useState<MoodBoard[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMoodBoards = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('mood_boards')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setMoodBoards(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchMoodBoards() }, [fetchMoodBoards])

  const createMoodBoard = async (name: string = 'Untitled Board', projectId?: string): Promise<MoodBoard | null> => {
    if (!user) return null
    const { data, error } = await supabase
      .from('mood_boards')
      .insert({ user_id: user.id, name, project_id: projectId || null })
      .select()
      .single()
    if (error) { addToast('Failed to create mood board', 'error'); return null }
    setMoodBoards((prev) => [data, ...prev])
    addToast('Mood board created!', 'success')
    return data
  }

  const saveMoodBoard = async (id: string, canvasData: any, extractedColors?: string[], aiTags?: any) => {
    const updates: any = { canvas_data: canvasData, updated_at: new Date().toISOString() }
    if (extractedColors) updates.extracted_colors = extractedColors
    if (aiTags) updates.ai_tags = aiTags

    const { error } = await supabase.from('mood_boards').update(updates).eq('id', id)
    if (error) { addToast('Failed to save mood board', 'error'); return }
    setMoodBoards((prev) => prev.map((b) => b.id === id ? { ...b, ...updates } : b))
  }

  const deleteMoodBoard = async (id: string) => {
    setMoodBoards((prev) => prev.filter((b) => b.id !== id))
    await supabase.from('mood_boards').delete().eq('id', id)
    addToast('Mood board deleted', 'info')
  }

  const renameMoodBoard = async (id: string, name: string) => {
    setMoodBoards((prev) => prev.map((b) => b.id === id ? { ...b, name } : b))
    await supabase.from('mood_boards').update({ name }).eq('id', id)
  }

  return { moodBoards, loading, createMoodBoard, saveMoodBoard, deleteMoodBoard, renameMoodBoard, refetch: fetchMoodBoards }
}
