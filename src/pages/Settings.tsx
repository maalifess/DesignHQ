import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, User, GraduationCap, Mail, Globe, Trash2, Save, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/useAppStore'
import { useDarkMode } from '@/hooks/useDarkMode'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassModal } from '@/components/ui/GlassModal'

export default function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const { addToast } = useAppStore()
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [saving, setSaving] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    university: profile?.university || '',
    bio: profile?.bio || '',
    portfolio_email: profile?.portfolio_email || '',
    avatar_url: profile?.avatar_url || '',
  })

  const set = (field: string) => (e: any) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setForm((p) => ({ ...p, avatar_url: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile(form)
    setSaving(false)
    if (error) addToast('Failed to save profile', 'error')
    else addToast('Profile updated!', 'success')
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return
    // In production, this would call a server function
    await supabase.auth.signOut()
    addToast('Account deleted', 'info')
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2rem' }}>
        Settings
      </h1>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <GlassCard>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Profile
          </h2>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div
              onClick={() => avatarInputRef.current?.click()}
              style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: form.avatar_url
                  ? `url(${form.avatar_url}) center/cover`
                  : 'linear-gradient(135deg, var(--accent-primary), var(--accent-deep))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 600,
                border: '3px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {!form.avatar_url && (form.display_name || form.full_name || 'A').charAt(0).toUpperCase()}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0,
                transition: 'opacity var(--transition-base)',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
              >
                <Camera size={22} color="white" />
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Profile Photo</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Click the avatar to upload a new photo</p>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input label="Full Name" id="settings-fullname" value={form.full_name} onChange={set('full_name')} leftIcon={<User size={15} />} />
            <Input label="Display Name" id="settings-displayname" value={form.display_name} onChange={set('display_name')} hint="Shown in the app greeting" leftIcon={<User size={15} />} />
            <Input label="University" id="settings-university" value={form.university} onChange={set('university')} placeholder="NCA, Beaconhouse, PIFD..." leftIcon={<GraduationCap size={15} />} />
            <Input label="Portfolio Email" id="settings-email" type="email" value={form.portfolio_email} onChange={set('portfolio_email')} placeholder="shown publicly" leftIcon={<Mail size={15} />} />
            <div style={{ gridColumn: '1/-1' }}>
              <Textarea label="Bio" value={form.bio} onChange={set('bio')} placeholder="A short bio about you as a designer..." rows={3} />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button loading={saving} icon={<Save size={15} />} onClick={handleSave}>Save Changes</Button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '1.5rem' }}>
        <GlassCard>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Preferences
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Dark Mode</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Deep burgundy velvet for late-night sessions</p>
            </div>
            <button
              onClick={toggleDarkMode}
              style={{
                width: 48, height: 26,
                borderRadius: 'var(--radius-full)',
                background: darkMode ? 'var(--accent-primary)' : 'var(--glass-border)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background var(--transition-slow)',
              }}
              aria-label="Toggle dark mode"
              id="settings-dark-mode-toggle"
            >
              <span style={{
                position: 'absolute',
                top: 3, left: darkMode ? 'calc(100% - 22px)' : 3,
                width: 20, height: 20,
                borderRadius: '50%',
                background: 'white',
                transition: 'left var(--transition-base)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Account info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginBottom: '1.5rem' }}>
        <GlassCard>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Account
          </h2>
          <div style={{ padding: '0.875rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Email Address</p>
            <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user?.email}</p>
          </div>
          <Button variant="secondary" onClick={() => signOut()}>Sign Out</Button>
        </GlassCard>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{
          background: 'rgba(192, 0, 26, 0.05)',
          border: '1px solid rgba(192, 0, 26, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--status-danger)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--status-danger)' }}>Danger Zone</h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Deleting your account is permanent and cannot be undone. All your projects, sketches, mood boards, and notes will be lost.
          </p>
          <Button variant="danger" onClick={() => setShowDelete(true)} icon={<Trash2 size={14} />}>Delete Account</Button>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <GlassModal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Account" size="sm">
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.65 }}>
            This will permanently delete your account and all data. Type <strong>DELETE</strong> to confirm.
          </p>
          <Input
            label="Type DELETE to confirm"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
            id="delete-confirm"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="ghost" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" disabled={deleteConfirm !== 'DELETE'} onClick={handleDeleteAccount}>
              Delete Forever
            </Button>
          </div>
        </div>
      </GlassModal>
    </div>
  )
}
