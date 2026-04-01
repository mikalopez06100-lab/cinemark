'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { resolveMediaUrl } from '@/lib/media-url'
import type { Film } from '@/lib/supabase'

type Filter = 'all' | 'seeking_partners' | 'upcoming' | 'ongoing' | 'postprod' | 'finalized'

const statusLabel: Record<string, string> = {
  seeking_partners: 'En recherche de partenaires',
  upcoming: 'Tournage à venir',
  ongoing: 'Tournage en cours',
  postprod: 'En cours de post-production',
  finalized: 'Projet finalisé',
}

export default function FilmsClient({ films }: { films: Film[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? films : films.filter(f => f.status === filter)

  return (
    <>
      <div className="films-filters">
        {(['all', 'seeking_partners', 'upcoming', 'ongoing', 'postprod', 'finalized'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' && 'Tous'}
            {f === 'seeking_partners' && 'En recherche'}
            {f === 'upcoming' && 'À venir'}
            {f === 'ongoing' && <><span className="status-dot ongoing" style={{ display: 'inline-block', marginRight: '0.4rem' }} />En cours</>}
            {f === 'postprod' && 'Post-prod'}
            {f === 'finalized' && 'Finalisé'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: 'var(--muted)', padding: '3rem 0' }}>Aucune production dans cette catégorie.</p>
      ) : (
        <div className="films-grid films-grid--list">
          {visible.map((film) => {
            const posterSrc = resolveMediaUrl(film.poster_url)
            return (
            <Link key={film.id} href={`/films/${film.slug}`} className="film-card film-card--row">
              <div className="film-card-img">
                {posterSrc ? (
                  <Image
                    src={posterSrc}
                    alt={`Affiche ${film.title}`}
                    fill
                    sizes="(max-width: 900px) 45vw, 220px"
                    className="film-card-img-photo"
                  />
                ) : (
                  <div className="film-card-img-icon" aria-hidden>
                    <svg viewBox="0 0 48 48" fill="none">
                      <rect x="6" y="10" width="36" height="28" rx="2" stroke="white" strokeWidth="1.5"/>
                      <path d="M6 18h36" stroke="white" strokeWidth="1.5"/>
                      <circle cx="24" cy="30" r="4" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="film-card-body">
                <div className={`film-card-status status-${film.status}`}>
                  <span className={`status-dot ${film.status}`} />
                  {statusLabel[film.status]}
                  {film.status === 'finalized' && film.year ? ` — ${film.year}` : ''}
                </div>
                <div className="film-card-title">{film.title}</div>
                <div className="film-card-year">
                  {(film.production_date
                    ? new Date(film.production_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                    : film.year) ?? '—'}
                  {film.format ? ` · ${film.format}` : ''}
                </div>
                {film.description && (
                  <p className="film-card-desc">{film.description}</p>
                )}
              </div>
            </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
