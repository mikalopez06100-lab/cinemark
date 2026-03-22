'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Film, Partner } from '@/lib/supabase'

type FormState = {
  title: string; slug: string; year: string; format: string;
  description: string; status: Film['status']; partner_ids: string[]
}

const emptyForm: FormState = {
  title: '', slug: '', year: '', format: '',
  description: '', status: 'upcoming', partner_ids: []
}

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminFilmsClient({
  films, partners
}: {
  films: Film[]
  partners: Pick<Partner, 'id' | 'name'>[]
}) {
  const router = useRouter()
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Film | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setModal('create')
  }

  const openEdit = (film: Film) => {
    setForm({
      title: film.title,
      slug: film.slug,
      year: film.year?.toString() ?? '',
      format: film.format ?? '',
      description: film.description ?? '',
      status: film.status,
      partner_ids: film.partner_ids ?? [],
    })
    setEditing(film)
    setModal('edit')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'title') updated.slug = slugify(value)
      return updated
    })
  }

  const togglePartner = (id: string) => {
    setForm(prev => ({
      ...prev,
      partner_ids: prev.partner_ids.includes(id)
        ? prev.partner_ids.filter(p => p !== id)
        : [...prev.partner_ids, id]
    }))
  }

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.status) return
    setSaving(true)
    setError('')
    const payload = {
      title: form.title,
      slug: form.slug,
      year: form.year ? parseInt(form.year) : null,
      format: form.format || null,
      description: form.description || null,
      status: form.status,
      partner_ids: form.partner_ids.length > 0 ? form.partner_ids : null,
    }
    const { error } = editing
      ? await supabase.from('films').update(payload).eq('id', editing.id)
      : await supabase.from('films').insert(payload)
    if (error) { setError(error.message); setSaving(false); return }
    setModal(null)
    router.refresh()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce film ?')) return
    await supabase.from('films').delete().eq('id', id)
    router.refresh()
  }

  const statusBadge = (s: string) => {
    const cls = { ongoing: 'badge-ongoing', upcoming: 'badge-upcoming', done: 'badge-done' }[s] ?? ''
    const label = { ongoing: 'En cours', upcoming: 'À venir', done: 'Réalisé' }[s] ?? s
    return <span className={`badge ${cls}`}>{label}</span>
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Films</h1>
        <button className="btn-admin" onClick={openCreate}>+ Créer un film</button>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Année</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {films.length === 0 ? (
              <tr><td colSpan={5} style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Aucun film</td></tr>
            ) : films.map((film) => (
              <tr key={film.id}>
                <td style={{ fontWeight: 400 }}>{film.title}</td>
                <td>{statusBadge(film.status)}</td>
                <td style={{ color: 'var(--muted)' }}>{film.year ?? '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{film.format ?? '—'}</td>
                <td>
                  <div className="row-actions">
                    <button className="btn-admin-ghost" onClick={() => openEdit(film)}>Modifier</button>
                    <button className="btn-admin-ghost btn-admin-danger" onClick={() => handleDelete(film.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2 className="modal-title">{modal === 'create' ? 'Créer un film' : 'Modifier le film'}</h2>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <div className="admin-form-group">
              <label>Titre *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Ex. Soleil d'Azur" />
            </div>
            <div className="admin-form-group">
              <label>Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="soleil-dazur" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label>Année</label>
                <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="2025" />
              </div>
              <div className="admin-form-group">
                <label>Statut *</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="ongoing">En cours</option>
                  <option value="upcoming">À venir</option>
                  <option value="done">Réalisé</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Format</label>
              <input name="format" value={form.format} onChange={handleChange} placeholder="Long métrage, Série, Clip…" />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description du film…" />
            </div>

            {partners.length > 0 && (
              <div className="admin-form-group">
                <label>Partenaires associés</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {partners.map(p => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.8rem', color: form.partner_ids.includes(p.id) ? 'var(--gold)' : 'var(--muted)' }}>
                      <input
                        type="checkbox"
                        checked={form.partner_ids.includes(p.id)}
                        onChange={() => togglePartner(p.id)}
                        style={{ accentColor: 'var(--gold)' }}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-admin-ghost" onClick={() => setModal(null)}>Annuler</button>
              <button className="btn-admin" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
