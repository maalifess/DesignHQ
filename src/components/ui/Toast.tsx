import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useAppStore, type Toast } from '@/store/useAppStore'

const icons = {
  success: <CheckCircle size={16} />,
  error:   <AlertCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info:    <Info size={16} />,
}

const colors: Record<Toast['type'], string> = {
  success: 'var(--status-success)',
  error:   'var(--status-danger)',
  warning: 'var(--status-warning)',
  info:    'var(--accent-primary)',
}

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useAppStore()
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-surface-deep)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--glass-shadow)',
        minWidth: '280px',
        maxWidth: '360px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.875rem',
      }}
    >
      <span style={{ color: colors[toast.type], flexShrink: 0 }}>{icons[toast.type]}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          flexShrink: 0,
          padding: '2px',
          display: 'flex',
        }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { toasts } = useAppStore()
  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 'var(--z-toast)' as any,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
