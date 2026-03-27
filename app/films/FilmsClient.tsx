'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Film } from '@/lib/supabase'

type Filter = 'all' | 'ongoing' | 'upcoming' | 'done'

const statusLabel: Record<string, string> = {
  ongoing: 'En cours de tournage',
  upcoming: 'À venir',
  done: 'Réalisé',
}

export default function FilmsClient({ films }: { films: Film[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? films : films.filter(f => f.status === filter)

  return (
    <>
      <div className="films-filters">
        {(['all', 'ongoing', 'upcoming', 'done'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' && 'Tous'}
            {f === 'ongoing' && <><span className="status-dot ongoing" style={{ display: 'inline-block', marginRight: '0.4rem' }} />En cours</>}
            {f === 'upcoming' && 'À venir'}
            {f === 'done' && 'Réalisés'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: 'var(--muted)', padding: '3rem 0' }}>Aucune production dans cette catégorie.</p>
      ) : (
        <div className="films-grid">
          {visible.map((film) => (
            <Link key={film.id} href={`/films/${film.slug}`} className="film-card">
              <div className="film-card-img">
                {film.poster_url ? (
                  <Image
                    src={film.poster_url}
                    alt={`Affiche ${film.title}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
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
              <div className={`film-card-status status-${film.status}`}>
                <span className={`status-dot ${film.status}`} />
                {statusLabel[film.status]}
                {film.status === 'done' && film.year ? ` — ${film.year}` : ''}
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
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
