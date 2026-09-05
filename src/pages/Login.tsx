import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scissors } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const email = 'ariba@designhq.local'
    const password = 'ariba-design-password'
    
    // Try to sign in
    let { error: signInError } = await signIn(email, password)
    
    setLoading(false)
    if (signInError) setError(signInError.message || 'Could not sign in automatically')
    else navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      backgroundImage: 'var(--bg-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-deep))',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Scissors size={24} color="white" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            marginBottom: '0.375rem',
          }}>
            DesignHQ
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Welcome back, Ariba
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Click the button below to enter your design workspace.
          </p>

          <form onSubmit={handleQuickLogin}>
            {error && (
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--status-danger)',
                background: 'rgba(192, 0, 26, 0.08)',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(192, 0, 26, 0.15)',
                marginBottom: '1.25rem',
                textAlign: 'left'
              }}>
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>
              Enter Workspace
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
