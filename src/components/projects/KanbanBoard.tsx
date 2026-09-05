import React from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { GripVertical, Calendar } from 'lucide-react'
import type { Project } from '@/hooks/useProjects'
import { daysUntil, deadlineColor } from '@/lib/export'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const COLUMNS = [
  { id: 'ideation',     label: 'Ideation',     color: '#A07080' },
  { id: 'research',     label: 'Research',     color: '#6B3344' },
  { id: 'sketching',    label: 'Sketching',    color: '#800020' },
  { id: 'prototyping',  label: 'Prototyping',  color: '#A0002A' },
  { id: 'refinement',   label: 'Refinement',   color: '#C05070' },
  { id: 'final',        label: 'Final',        color: '#5C0016' },
  { id: 'submitted',    label: 'Submitted',    color: '#2D7A4F' },
]

function KanbanCard({ project, isDragging }: { project: Project; isDragging?: boolean }) {
  const navigate = useNavigate()
  const days = project.deadline ? daysUntil(project.deadline) : null

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: project.id })
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: isDragging ? 'var(--bg-surface-deep)' : 'var(--bg-surface)',
        backdropFilter: 'var(--glass-blur)',
        border: `1px solid ${isDragging ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem',
        marginBottom: '0.5rem',
        boxShadow: isDragging ? '0 12px 32px rgba(128,0,32,0.25)' : 'var(--glass-shadow)',
        transform: isDragging ? 'scale(1.03)' : 'scale(1)',
        transition: 'box-shadow var(--transition-base)',
        cursor: 'grab',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }}>
          <GripVertical size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
            {project.color_label && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color_label, flexShrink: 0 }} />
            )}
            <p
              style={{
                fontWeight: 500,
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              className="truncate"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {project.title}
            </p>
          </div>

          {project.theme && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }} className="truncate">
              {project.theme}
            </p>
          )}

          {days !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={11} style={{ color: deadlineColor(days), flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: deadlineColor(days), fontWeight: 500 }}>
                {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({ id, label, color, projects }: { id: string; label: string; color: string; projects: Project[] }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: '220px',
        maxWidth: '240px',
        flexShrink: 0,
        background: isOver ? 'var(--accent-light)' : 'var(--bg-surface)',
        backdropFilter: 'var(--glass-blur)',
        border: `1px solid ${isOver ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color var(--transition-base), background var(--transition-base)',
      }}
    >
      {/* Column header */}
      <div style={{
        padding: '0.875rem 1rem',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', flex: 1 }}>{label}</span>
        <span style={{
          fontSize: '0.75rem',
          color: 'white',
          background: color,
          padding: '1px 8px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 600,
          minWidth: 22,
          textAlign: 'center',
        }}>
          {projects.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: '0.75rem', minHeight: '200px' }}>
        {projects.map((p) => <KanbanCard key={p.id} project={p} />)}
      </div>
    </div>
  )
}

interface KanbanBoardProps {
  projects: Project[]
  onStatusChange: (id: string, status: string) => void
}

export function KanbanBoard({ projects, onStatusChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string)
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = e
    if (over && active.id !== over.id) {
      const newStatus = COLUMNS.find((c) => c.id === over.id)?.id
      if (newStatus) onStatusChange(active.id as string, newStatus)
    }
  }

  const activeProject = projects.find((p) => p.id === activeId)

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', width: 'max-content' }}>
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              {...col}
              projects={projects.filter((p) => p.status === col.id)}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeProject && <KanbanCard project={activeProject} isDragging />}
      </DragOverlay>
    </DndContext>
  )
}
