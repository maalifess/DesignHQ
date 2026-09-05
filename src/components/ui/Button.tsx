import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = `btn-${variant}`
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : size === 'icon' ? 'btn-icon' : ''

  return (
    <motion.button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      whileTap={{ y: 2 }}
      transition={{ duration: 0.08 }}
      {...(props as any)}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}

// ── Icon Button shorthand ──────────────────────────────────────────────────────
interface IconButtonProps extends ButtonProps {
  label: string
}

export function IconButton({ label, ...props }: IconButtonProps) {
  return (
    <Button {...props} size="icon" aria-label={label} data-tooltip={label} />
  )
}
