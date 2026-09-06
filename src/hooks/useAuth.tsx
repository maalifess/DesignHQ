import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  university: string | null
  bio: string | null
  avatar_url: string | null
  portfolio_title: string | null
  portfolio_bio: string | null
  portfolio_email: string | null
  portfolio_layout: string
  dark_mode: boolean
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, university?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const defaultAribaUser = {
  id: 'ariba-designer-01',
  email: 'ariba@atelierdesignhq.com',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User

const defaultAribaProfile: Profile = {
  id: 'ariba-designer-01',
  full_name: 'Ariba',
  display_name: 'Ariba',
  university: 'Royal College of Art',
  bio: 'Lead Couture Modéliste & Fashion Designer',
  avatar_url: null,
  portfolio_title: 'Ariba Couture Atelier Portfolio',
  portfolio_bio: 'Haute couture fashion design & technical pattern development.',
  portfolio_email: 'ariba@atelierdesignhq.com',
  portfolio_layout: 'editorial',
  dark_mode: true,
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>({
    user: defaultAribaUser,
    access_token: 'mock-token',
    token_type: 'bearer',
  } as any)
  const [user, setUser] = useState<User | null>(defaultAribaUser)
  const [profile, setProfile] = useState<Profile | null>(defaultAribaProfile)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (data) setProfile(data)
      return data
    } catch {
      return defaultAribaProfile
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session)
        setUser(session.user)
        fetchProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setSession({ user: defaultAribaUser, access_token: 'mock-token', token_type: 'bearer' } as any)
        setUser(defaultAribaUser)
        setProfile(defaultAribaProfile)
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSession(session)
        setUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setSession({ user: defaultAribaUser, access_token: 'mock-token', token_type: 'bearer' } as any)
        setUser(defaultAribaUser)
        setProfile(defaultAribaProfile)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string, university?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        display_name: fullName.split(' ')[0],
        university: university || null,
      })
    }
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession({ user: defaultAribaUser, access_token: 'mock-token', token_type: 'bearer' } as any)
    setUser(defaultAribaUser)
    setProfile(defaultAribaProfile)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') }
    const { error } = await supabase.from('profiles').update(data).eq('id', user.id)
    if (!error) setProfile((prev) => prev ? { ...prev, ...data } : null)
    return { error }
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
