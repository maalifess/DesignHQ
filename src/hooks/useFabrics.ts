import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { useAppStore } from '@/store/useAppStore'

export interface Fabric {
  id: string
  user_id: string
  name: string
  image_url: string | null
  type: string | null
  texture: string | null
  weight: string | null
  seasons: string[]
  cost_per_meter: number | null
  currency: string
  supplier_name: string | null
  supplier_url: string | null
  availability: 'in_stock' | 'limited' | 'out_of_stock'
  care_instructions: string | null
  notes: string | null
  tags: string[]
  dominant_colors: string[] | null
  created_at: string
}

export interface CreateFabricData {
  name: string
  image_url?: string
  type?: string
  texture?: string
  weight?: string
  seasons?: string[]
  cost_per_meter?: number
  supplier_name?: string
  supplier_url?: string
  availability?: Fabric['availability']
  care_instructions?: string
  notes?: string
  tags?: string[]
  dominant_colors?: string[]
}

export function useFabrics() {
  const { user } = useAuth()
  const { addToast } = useAppStore()
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFabrics = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('fabrics')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setFabrics(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchFabrics() }, [fetchFabrics])

  const createFabric = async (data: CreateFabricData): Promise<Fabric | null> => {
    if (!user) return null
    const { data: created, error } = await supabase
      .from('fabrics')
      .insert({ ...data, user_id: user.id, currency: 'PKR', seasons: data.seasons || [], tags: data.tags || [] })
      .select()
      .single()
    if (error) { addToast('Failed to add fabric', 'error'); return null }
    setFabrics((prev) => [created, ...prev])
    addToast('Fabric added to library!', 'success')
    return created
  }

  const updateFabric = async (id: string, data: Partial<Fabric>) => {
    setFabrics((prev) => prev.map((f) => f.id === id ? { ...f, ...data } : f))
    const { error } = await supabase.from('fabrics').update(data).eq('id', id)
    if (error) { addToast('Failed to update fabric', 'error'); fetchFabrics() }
  }

  const deleteFabric = async (id: string) => {
    setFabrics((prev) => prev.filter((f) => f.id !== id))
    await supabase.from('fabrics').delete().eq('id', id)
    addToast('Fabric removed', 'info')
  }

  return { fabrics, loading, createFabric, updateFabric, deleteFabric, refetch: fetchFabrics }
}
