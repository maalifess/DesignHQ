import React from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  padding?: 'none' | 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export function GlassCard({ children, className = '', hover = false, onClick, padding = 'md', style }: GlassCardProps) {
  const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }
  const baseClass = `glass-card ${paddingMap[padding]} ${hover ? 'cursor-pointer' : ''} ${className}`

  if (onClick) {
    return (
      <motion.div
        className={baseClass}
        onClick={onClick}
        style={style}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClass} style={style}>
      {children}
    </div>
  )
}
