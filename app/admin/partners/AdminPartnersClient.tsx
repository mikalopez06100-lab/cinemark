'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Partner } from '@/lib/supabase'

type FormState = {
  name: string; category: string; website: string; logo_url: string; active: boolean
}

const emptyForm: FormState = { name: '', category: '', website: '', logo_url: '', active: true }

export default function AdminPartnersClient({ partners }: { partners: Partner[] }) {
  const router = useRouter()
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setModal('create')
  }

  const openEdit = (p: Partner) => {
    setForm({ name: p.name, category: p.category ?? '', website: p.website ?? '', logo_url: p.logo_url ?? '', active: p.active })
    setEditing(p)
    setModal('edit')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    setError('')
    const payload = {
      name: form.name,
      category: form.category || null,
      website: form.website || null,
      logo_url: form.logo_url || null,
      active: form.active,
    }
    const { error } = editing
      ? await supabase.from('partners').update(payload).eq('id', editing.id)
      : await supabase.from('partners').insert(payload)
    if (error) { setError(error.message); setSaving(false); return }
    setModal(null)
    router.refresh()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce partenaire ?')) return
    await supabase.from('partners').delete().eq('id', id)
    router.refresh()
  }

  const uploadLogo = async (file: File) => {
    setError('')
    setUploadingLogo(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const safeName = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const path = `partners/${Date.now()}-${safeName || 'partner'}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/png' })

    if (uploadError) {
      setError(`Upload du logo impossible: ${uploadError.message}`)
      setUploadingLogo(false)
      return
    }

    const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
    setForm((prev) => ({ ...prev, logo_url: data.publicUrl }))
    setUploadingLogo(false)
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Partenaires</h1>
        <button className="btn-admin" onClick={openCreate}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Site web</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr><td colSpan={5} style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Aucun partenaire</td></tr>
            ) : partners.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 400 }}>{p.name}</td>
                <td style={{ color: 'var(--muted)' }}>{p.category ?? '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
                  {p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>{p.website}</a> : '—'}
                </td>
                <td>
                  <span className={`badge ${p.active ? 'badge-active' : 'badge-inactive'}`}>
                    {p.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-admin-ghost" onClick={() => openEdit(p)}>Modifier</button>
                    <button className="btn-admin-ghost btn-admin-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
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
            <h2 className="modal-title">{modal === 'create' ? 'Ajouter un partenaire' : 'Modifier le partenaire'}</h2>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <div className="admin-form-group">
              <label>Nom *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ex. OGC Nice" />
            </div>
            <div className="admin-form-group">
              <label>Catégorie</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Ex. Sport · Institution" />
            </div>
            <div className="admin-form-group">
              <label>Site web</label>
              <input name="website" type="url" value={form.website} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="admin-form-group">
              <label>URL du logo</label>
              <input name="logo_url" type="url" value={form.logo_url} onChange={handleChange} placeholder="https://..." />
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label className="btn-admin-ghost" style={{ cursor: uploadingLogo ? 'not-allowed' : 'pointer', opacity: uploadingLogo ? 0.6 : 1 }}>
                  {uploadingLogo ? 'Upload…' : 'Uploader un logo'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    style={{ display: 'none' }}
                    disabled={uploadingLogo}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadLogo(file)
                    }}
                  />
                </label>
                {form.logo_url && (
                  <img
                    src={form.logo_url}
                    alt="Aperçu logo partenaire"
                    style={{ width: '64px', height: '64px', objectFit: 'contain', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface)', padding: '0.35rem' }}
                  />
                )}
              </div>
            </div>
            <div className="admin-form-group">
              <label>Statut</label>
              <div
                className="toggle-wrap"
                onClick={() => setForm(prev => ({ ...prev, active: !prev.active }))}
              >
                <div className={`toggle ${form.active ? 'on' : ''}`} />
                <span style={{ fontSize: '0.85rem', color: form.active ? 'var(--gold)' : 'var(--muted)' }}>
                  {form.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

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
