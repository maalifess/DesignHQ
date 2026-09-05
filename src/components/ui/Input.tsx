import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {props.required && <span style={{ color: 'var(--accent-primary)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{
            position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
          }}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${className}`}
          style={{
            paddingLeft: leftIcon ? '2.5rem' : undefined,
            paddingRight: rightIcon ? '2.5rem' : undefined,
            borderColor: error ? 'var(--status-danger)' : undefined,
          }}
          {...props}
        />
        {rightIcon && (
          <span style={{
            position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', display: 'flex',
          }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p style={{ fontSize: '0.8125rem', color: 'var(--status-danger)', marginTop: '0.25rem' }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

// ── Textarea ───────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label, error, className = '', id, ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <textarea
        ref={ref}
        id={inputId}
        className={`input ${className}`}
        style={{
          resize: 'vertical',
          minHeight: '100px',
          borderColor: error ? 'var(--status-danger)' : undefined,
        }}
        {...props}
      />
      {error && <p style={{ fontSize: '0.8125rem', color: 'var(--status-danger)' }}>{error}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// ── Select ─────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  error?: string
}

export function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <select
        id={inputId}
        className={`input ${className}`}
        style={{
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236B3344' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.875rem center',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p style={{ fontSize: '0.8125rem', color: 'var(--status-danger)' }}>{error}</p>}
    </div>
  )
}
