import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PortfolioPublic() {
  const { userId } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      let profileData = null

      if (userId) {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
        profileData = data
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
          profileData = data
          const { data: projectsData } = await supabase.from('projects').select('*').eq('user_id', session.user.id).eq('portfolio_ready', true).order('portfolio_order')
          setProjects(projectsData || [])
        }
      }

      setProfile(profileData)
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0D0407', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(192,48,74,0.3)', borderTopColor: '#C0304A', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  const displayName = profile?.portfolio_title || profile?.full_name || 'Ariba'
  const bio = profile?.portfolio_bio || 'Fashion design student with a passion for thoughtful, sustainable design.'

  return (
    <div style={{ minHeight: '100vh', background: '#0D0407', color: '#FFF0F3', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at top, rgba(192,48,74,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(80,0,20,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {profile?.avatar_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              width: 120, height: 120,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(192,48,74,0.5)',
              marginBottom: '2rem',
            }}
          >
            <img src={profile.avatar_url} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #FFF0F3, #C0304A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {displayName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            fontStyle: 'italic',
            color: 'rgba(255,240,243,0.7)',
            maxWidth: 560,
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {profile?.portfolio_email && (
            <a href={`mailto:${profile.portfolio_email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', borderRadius: '100px', border: '1px solid rgba(192,48,74,0.4)', color: '#FFF0F3', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}>
              <Mail size={15} /> Contact
            </a>
          )}
        </motion.div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '4rem',
            color: '#FFF0F3',
          }}>
            Selected Works
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                  gap: '3rem',
                  alignItems: 'center',
                }}
              >
                {/* Project image */}
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{
                    aspectRatio: '4/3',
                    background: project.cover_image_url
                      ? `url(${project.cover_image_url}) center/cover`
                      : `linear-gradient(135deg, ${project.color_label || 'rgba(192,48,74,0.3)'}, rgba(30,8,14,0.8))`,
                    borderRadius: '16px',
                    border: '1px solid rgba(200,80,100,0.15)',
                  }} />
                </div>

                {/* Project info */}
                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <p style={{ fontSize: '0.8125rem', color: 'rgba(212,144,154,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    {project.category} — {project.theme || 'Fashion Design'}
                  </p>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    fontWeight: 600,
                    color: '#FFF0F3',
                    lineHeight: 1.2,
                    marginBottom: '1rem',
                  }}>
                    {project.title}
                  </h3>
                  {(project.portfolio_description || project.description) && (
                    <p style={{ color: 'rgba(255,240,243,0.65)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
                      {project.portfolio_description || project.description}
                    </p>
                  )}
                  {project.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {project.tags.map((tag: string) => (
                        <span key={tag} style={{
                          fontSize: '0.8125rem',
                          padding: '0.25rem 0.75rem',
                          background: 'rgba(192,48,74,0.12)',
                          border: '1px solid rgba(192,48,74,0.25)',
                          borderRadius: '100px',
                          color: '#D4909A',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Contact footer */}
      <footer style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(200,80,100,0.15)',
        marginTop: '4rem',
      }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 600, color: '#FFF0F3', marginBottom: '1rem' }}>
          Let's Connect
        </h2>
        {profile?.portfolio_email && (
          <a href={`mailto:${profile.portfolio_email}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '1.125rem', color: '#C0304A', textDecoration: 'none',
          }}>
            <Mail size={18} /> {profile.portfolio_email}
          </a>
        )}
        <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'rgba(255,240,243,0.3)' }}>
          Built with DesignHQ — Made with  for fashion designers
        </p>
      </footer>
    </div>
  )
}
