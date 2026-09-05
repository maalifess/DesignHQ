import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useAppStore } from '@/store/useAppStore'

export interface Project {
  id: string
  user_id: string
  title: string
  theme: string | null
  category: 'assignment' | 'personal' | 'collection' | 'collaboration' | 'competition'
  status: string
  deadline: string | null
  cover_image_url: string | null
  description: string | null
  tags: string[]
  color_label: string | null
  portfolio_ready: boolean
  portfolio_order: number | null
  portfolio_description: string | null
  created_at: string
  updated_at: string
}

export interface CreateProjectData {
  title: string
  theme?: string
  category: Project['category']
  deadline?: string
  cover_image_url?: string
  description?: string
  tags?: string[]
  color_label?: string
}

export function useProjects() {
  const { user } = useAuth()
  const { addToast } = useAppStore()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    if (error) setError(error.message)
    else setProjects(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const createProject = async (data: CreateProjectData): Promise<Project | null> => {
    if (!user) return null
    const newProject = {
      ...data,
      user_id: user.id,
      status: 'ideation',
      tags: data.tags || [],
    }
    // Optimistic update
    const tempId = 'temp-' + Date.now()
    const tempProject = { ...newProject, id: tempId, portfolio_ready: false, portfolio_order: null, portfolio_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Project
    setProjects((prev) => [tempProject, ...prev])

    const { data: created, error } = await supabase.from('projects').insert(newProject).select().single()
    if (error) {
      setProjects((prev) => prev.filter((p) => p.id !== tempId))
      addToast('Failed to create project', 'error')
      return null
    }
    setProjects((prev) => prev.map((p) => p.id === tempId ? created : p))
    addToast('Project created!', 'success')
    return created
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, ...data } : p))
    const { error } = await supabase.from('projects').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) {
      addToast('Failed to update project', 'error')
      fetchProjects()
    }
  }

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      addToast('Failed to delete project', 'error')
      fetchProjects()
    } else {
      addToast('Project deleted', 'info')
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await updateProject(id, { status })
  }

  return { projects, loading, error, createProject, updateProject, deleteProject, updateStatus, refetch: fetchProjects }
}
