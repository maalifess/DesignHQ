import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { ToastContainer } from '@/components/ui/Toast'
import { useAppStore } from '@/store/useAppStore'

// ── Lazy-loaded pages ──────────────────────────────────────────────────────────
const Dashboard        = lazy(() => import('@/pages/Dashboard'))
const Projects         = lazy(() => import('@/pages/Projects'))
const ProjectDetail    = lazy(() => import('@/pages/ProjectDetail'))
const Patterns         = lazy(() => import('@/pages/Patterns'))
const MoodBoards       = lazy(() => import('@/pages/MoodBoards'))
const MoodBoardDetail  = lazy(() => import('@/pages/MoodBoardDetail'))
const Sketchbook       = lazy(() => import('@/pages/Sketchbook'))
const Fabrics          = lazy(() => import('@/pages/Fabrics'))
const Notes            = lazy(() => import('@/pages/Notes'))
const Portfolio        = lazy(() => import('@/pages/Portfolio'))
const PortfolioPublic  = lazy(() => import('@/pages/PortfolioPublic'))
const Settings         = lazy(() => import('@/pages/Settings'))
const Login            = lazy(() => import('@/pages/Login'))
const ForgotPassword   = lazy(() => import('@/pages/ForgotPassword'))

// ── Loading fallback ───────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: '50%',
        border: '3px solid var(--accent-light)',
        borderTopColor: 'var(--accent-primary)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>
        Loading…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Auth Guard ─────────────────────────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <PageLoader />
  if (session) return <Navigate to="/" replace />
  return <>{children}</>
}

import { useAtelierStore } from '@/store/useAtelierStore'

// ── Supabase & Dark mode initializer ──────────────────────────────────────────
function AtelierAppInit() {
  const { darkMode } = useAppStore()
  const fetchFromSupabase = useAtelierStore((state) => state.fetchFromSupabase)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    fetchFromSupabase()
  }, [fetchFromSupabase])

  return null
}

// ── App Router ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public portfolio (no auth) */}
        <Route path="/portfolio/preview" element={<PortfolioPublic />} />
        <Route path="/portfolio/preview/:userId" element={<PortfolioPublic />} />

        {/* Auth pages */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Protected app */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <Layout><Projects /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute>
            <Layout><ProjectDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/patterns" element={
          <ProtectedRoute>
            <Layout><Patterns /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/moodboards" element={
          <ProtectedRoute>
            <Layout><MoodBoards /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/moodboards/:id" element={
          <ProtectedRoute>
            <Layout><MoodBoardDetail /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/sketchbook" element={
          <ProtectedRoute>
            <Layout><Sketchbook /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/fabrics" element={
          <ProtectedRoute>
            <Layout><Fabrics /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute>
            <Layout><Notes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Layout><Portfolio /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AtelierAppInit />
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  )
}
