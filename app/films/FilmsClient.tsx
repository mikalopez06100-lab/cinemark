'use client'

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
            <div key={film.id} className="film-card">
              <div className={`film-card-status status-${film.status}`}>
                <span className={`status-dot ${film.status}`} />
                {statusLabel[film.status]}
                {film.status === 'done' && film.year ? ` — ${film.year}` : ''}
              </div>
              <div className="film-card-title">{film.title}</div>
              <div className="film-card-year">
                {film.year}{film.format ? ` · ${film.format}` : ''}
              </div>
              {film.description && (
                <p className="film-card-desc">{film.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
