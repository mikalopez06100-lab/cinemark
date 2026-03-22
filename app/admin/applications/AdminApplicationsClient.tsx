'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Application } from '@/lib/supabase'

const statusLabels: Record<Application['status'], string> = {
  new: 'Nouveau', read: 'Lu', contacted: 'Contacté', rejected: 'Refusé'
}
const statusClass: Record<Application['status'], string> = {
  new: 'badge-new', read: 'badge-read', contacted: 'badge-contacted', rejected: 'badge-rejected'
}

export default function AdminApplicationsClient({ applications }: { applications: Application[] }) {
  const router = useRouter()
  const [detail, setDetail] = useState<Application | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: Application['status']) => {
    setUpdating(id)
    await supabase.from('applications').update({ status }).eq('id', id)
    router.refresh()
    setUpdating(null)
    if (detail?.id === id) setDetail(prev => prev ? { ...prev, status } : null)
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Candidatures</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          {applications.filter(a => a.status === 'new').length} nouvelles
        </span>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Marque</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Secteur</th>
              <th>Budget</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Détail</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr><td colSpan={8} style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Aucune candidature</td></tr>
            ) : applications.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 400 }}>{app.brand_name}</td>
                <td style={{ color: 'var(--muted)' }}>{app.contact_name ?? '—'}</td>
                <td style={{ fontSize: '0.82rem' }}>
                  <a href={`mailto:${app.email}`} style={{ color: 'var(--gold)', textDecoration: 'none' }}>{app.email}</a>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{app.sector ?? '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{app.budget_range ?? '—'}</td>
                <td>
                  <select
                    className="status-select"
                    value={app.status}
                    disabled={updating === app.id}
                    onChange={e => handleStatusChange(app.id, e.target.value as Application['status'])}
                  >
                    <option value="new">Nouveau</option>
                    <option value="read">Lu</option>
                    <option value="contacted">Contacté</option>
                    <option value="rejected">Refusé</option>
                  </select>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                  {new Date(app.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <button className="btn-admin-ghost" onClick={() => setDetail(app)}>Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal">
            <h2 className="modal-title">{detail.brand_name}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Contact</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>{detail.contact_name ?? '—'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Email</p>
                <a href={`mailto:${detail.email}`} style={{ fontSize: '0.9rem', color: 'var(--cream)', textDecoration: 'none' }}>{detail.email}</a>
              </div>
              {detail.phone && (
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Téléphone</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>{detail.phone}</p>
                </div>
              )}
              {detail.sector && (
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Secteur</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>{detail.sector}</p>
                </div>
              )}
              {detail.website && (
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Site / Instagram</p>
                  <a href={detail.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--gold)', textDecoration: 'none' }}>{detail.website}</a>
                </div>
              )}
              {detail.budget_range && (
                <div>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.25rem' }}>Budget</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>{detail.budget_range}</p>
                </div>
              )}
            </div>

            {detail.message && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>Message</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7 }}>{detail.message}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {(['new', 'read', 'contacted', 'rejected'] as Application['status'][]).map(s => (
                <button
                  key={s}
                  className={`btn-admin-ghost ${detail.status === s ? 'btn-admin' : ''}`}
                  style={detail.status === s ? {} : {}}
                  onClick={() => handleStatusChange(detail.id, s)}
                  disabled={updating === detail.id}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-admin-ghost" onClick={() => setDetail(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
