'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Film, Partner } from '@/lib/supabase'

type FormState = {
  title: string; slug: string; production_date: string; year: string; format: string;
  description: string; synopsis: string; director: string; production: string; duration: string;
  casting: string; diffusion: string; awards: string; external_url: string;
  poster_url: string; gallery_urls: string[]; gallery_stills_urls: string[]; gallery_bts_urls: string[]; gallery_promo_urls: string[];
  status: Film['status']; partner_ids: string[]
}

const emptyForm: FormState = {
  title: '', slug: '', production_date: '', year: '', format: '',
  description: '', synopsis: '', director: '', production: '', duration: '', casting: '', diffusion: '', awards: '', external_url: '',
  poster_url: '', gallery_urls: [], gallery_stills_urls: [], gallery_bts_urls: [], gallery_promo_urls: [],
  status: 'seeking_partners', partner_ids: []
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
  const searchParams = useSearchParams()
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Film | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingPoster, setUploadingPoster] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState('')
  const sortedPartners = useMemo(
    () => [...partners].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })),
    [partners]
  )

  useEffect(() => {
    if (searchParams.get('new') === '1') openCreate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setModal('create')
  }

  const openEdit = (film: Film) => {
    setForm({
      title: film.title,
      slug: film.slug,
      production_date: film.production_date ? film.production_date.slice(0, 7) : '',
      year: film.year?.toString() ?? '',
      format: film.format ?? '',
      description: film.description ?? '',
      synopsis: film.synopsis ?? '',
      director: film.director ?? '',
      production: film.production ?? '',
      duration: film.duration ?? '',
      casting: film.casting ?? '',
      diffusion: film.diffusion ?? '',
      awards: film.awards ?? '',
      external_url: film.external_url ?? '',
      poster_url: film.poster_url ?? '',
      gallery_urls: film.gallery_urls ?? [],
      gallery_stills_urls: film.gallery_stills_urls ?? [],
      gallery_bts_urls: film.gallery_bts_urls ?? [],
      gallery_promo_urls: film.gallery_promo_urls ?? [],
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
      production_date: form.production_date ? `${form.production_date}-01` : null,
      year: form.year ? parseInt(form.year) : null,
      format: form.format || null,
      description: form.description || null,
      synopsis: form.synopsis || null,
      director: form.director || null,
      production: form.production || null,
      duration: form.duration || null,
      casting: form.casting || null,
      diffusion: form.diffusion || null,
      awards: form.awards || null,
      external_url: form.external_url || null,
      poster_url: form.poster_url || null,
      gallery_urls: form.gallery_urls.length > 0 ? form.gallery_urls : null,
      gallery_stills_urls: form.gallery_stills_urls.length > 0 ? form.gallery_stills_urls : null,
      gallery_bts_urls: form.gallery_bts_urls.length > 0 ? form.gallery_bts_urls : null,
      gallery_promo_urls: form.gallery_promo_urls.length > 0 ? form.gallery_promo_urls : null,
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

  const uploadFilmAsset = async (file: File, folder: 'film-posters' | 'film-gallery') => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const safeSlug = form.slug || slugify(form.title) || 'film'
    const path = `${folder}/${Date.now()}-${safeSlug}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/png' })
    if (uploadError) throw new Error(uploadError.message)
    const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
    return data.publicUrl
  }

  const removeGalleryImage = (url: string) => {
    setForm((prev) => ({ ...prev, gallery_urls: prev.gallery_urls.filter((u) => u !== url) }))
  }

  const removeCategorizedGalleryImage = (key: 'gallery_stills_urls' | 'gallery_bts_urls' | 'gallery_promo_urls', url: string) => {
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((u) => u !== url) }))
  }

  const statusBadge = (s: string) => {
    const cls = {
      finalized: 'badge-done',
      postprod: 'badge-postprod',
      ongoing: 'badge-ongoing',
      upcoming: 'badge-upcoming',
      seeking_partners: 'badge-seeking',
    }[s] ?? ''
    const label = {
      finalized: 'Projet finalisé',
      postprod: 'En cours de post-production',
      ongoing: 'Tournage en cours',
      upcoming: 'Tournage à venir',
      seeking_partners: 'En recherche de partenaires',
    }[s] ?? s
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
              <th>Date prod.</th>
              <th>Réalisateur</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {films.length === 0 ? (
              <tr><td colSpan={6} style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Aucun film</td></tr>
            ) : films.map((film) => (
              <tr key={film.id}>
                <td style={{ fontWeight: 400 }}>{film.title}</td>
                <td>{statusBadge(film.status)}</td>
                <td style={{ color: 'var(--muted)' }}>
                  {film.production_date
                    ? new Date(film.production_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
                    : (film.year ?? '—')}
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{film.director ?? '—'}</td>
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
                <label>Date de production</label>
                <input name="production_date" type="month" value={form.production_date} onChange={handleChange} />
              </div>
              <div className="admin-form-group">
                <label>Statut *</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="finalized">Projet finalisé</option>
                  <option value="postprod">En cours de post-production</option>
                  <option value="ongoing">Tournage en cours</option>
                  <option value="upcoming">Tournage à venir</option>
                  <option value="seeking_partners">En recherche de partenaires</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label>Année (fallback)</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="2025" />
            </div>
            <div className="admin-form-group">
              <label>Format</label>
              <input name="format" value={form.format} onChange={handleChange} placeholder="Long métrage, Série, Clip…" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label>Réalisateur</label>
                <input name="director" value={form.director} onChange={handleChange} placeholder="Ex. Alexandre Hösli" />
              </div>
              <div className="admin-form-group">
                <label>Production</label>
                <input name="production" value={form.production} onChange={handleChange} placeholder="Ex. DMC Production" />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Durée</label>
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="Ex. 1h28, 52 min" />
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description du film…" />
            </div>
            <div className="admin-form-group">
              <label>Synopsis (page détail)</label>
              <textarea name="synopsis" value={form.synopsis} onChange={handleChange} placeholder="Synopsis complet du film…" style={{ minHeight: '130px' }} />
            </div>
            <div className="admin-form-group">
              <label>Casting</label>
              <textarea name="casting" value={form.casting} onChange={handleChange} placeholder="Ex. Actrice A, Acteur B…" style={{ minHeight: '90px' }} />
            </div>
            <div className="admin-form-group">
              <label>Diffusion</label>
              <textarea name="diffusion" value={form.diffusion} onChange={handleChange} placeholder="Ex. Festivals, salles, plateformes…" style={{ minHeight: '90px' }} />
            </div>
            <div className="admin-form-group">
              <label>Prix</label>
              <textarea name="awards" value={form.awards} onChange={handleChange} placeholder="Ex. Prix du jury… (optionnel)" style={{ minHeight: '80px' }} />
            </div>
            <div className="admin-form-group">
              <label>Lien (page film)</label>
              <input name="external_url" type="url" value={form.external_url} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="admin-form-group">
              <label>Affiche officielle (URL)</label>
              <input name="poster_url" type="url" value={form.poster_url} onChange={handleChange} placeholder="https://..." />
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label className="btn-admin-ghost" style={{ cursor: uploadingPoster ? 'not-allowed' : 'pointer', opacity: uploadingPoster ? 0.6 : 1 }}>
                  {uploadingPoster ? 'Upload…' : 'Uploader affiche'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    disabled={uploadingPoster}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try {
                        setUploadingPoster(true)
                        setError('')
                        const url = await uploadFilmAsset(file, 'film-posters')
                        setForm((prev) => ({ ...prev, poster_url: url }))
                      } catch (err: any) {
                        setError(`Upload affiche impossible: ${err.message ?? 'Erreur inconnue'}`)
                      } finally {
                        setUploadingPoster(false)
                      }
                    }}
                  />
                </label>
                {form.poster_url && (
                  <img src={form.poster_url} alt="Aperçu affiche" style={{ width: '76px', height: '112px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                )}
              </div>
            </div>
            <div className="admin-form-group">
              <label>Images de tournage</label>
              <div style={{ marginBottom: '0.6rem' }}>
                <label className="btn-admin-ghost" style={{ cursor: uploadingGallery ? 'not-allowed' : 'pointer', opacity: uploadingGallery ? 0.6 : 1 }}>
                  {uploadingGallery ? 'Upload…' : 'Ajouter des images'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    style={{ display: 'none' }}
                    disabled={uploadingGallery}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? [])
                      if (files.length === 0) return
                      try {
                        setUploadingGallery(true)
                        setError('')
                        const urls = await Promise.all(files.map((f) => uploadFilmAsset(f, 'film-gallery')))
                        setForm((prev) => ({ ...prev, gallery_urls: [...prev.gallery_urls, ...urls] }))
                      } catch (err: any) {
                        setError(`Upload galerie impossible: ${err.message ?? 'Erreur inconnue'}`)
                      } finally {
                        setUploadingGallery(false)
                      }
                    }}
                  />
                </label>
              </div>
              {form.gallery_urls.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {form.gallery_urls.map((url) => (
                    <div key={url} style={{ position: 'relative' }}>
                      <img src={url} alt="Image de tournage" style={{ width: '88px', height: '66px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(url)}
                        className="btn-admin-ghost btn-admin-danger"
                        style={{ position: 'absolute', top: '-8px', right: '-8px', padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Aucune image ajoutée.</p>
              )}
            </div>
            <div className="admin-form-group">
              <label>Images tirées du film</label>
              <div style={{ marginBottom: '0.6rem' }}>
                <label className="btn-admin-ghost" style={{ cursor: uploadingGallery ? 'not-allowed' : 'pointer', opacity: uploadingGallery ? 0.6 : 1 }}>
                  {uploadingGallery ? 'Upload…' : 'Ajouter des images'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    style={{ display: 'none' }}
                    disabled={uploadingGallery}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? [])
                      if (files.length === 0) return
                      try {
                        setUploadingGallery(true)
                        setError('')
                        const urls = await Promise.all(files.map((f) => uploadFilmAsset(f, 'film-gallery')))
                        setForm((prev) => ({ ...prev, gallery_stills_urls: [...prev.gallery_stills_urls, ...urls] }))
                      } catch (err: any) {
                        setError(`Upload impossible: ${err.message ?? 'Erreur inconnue'}`)
                      } finally {
                        setUploadingGallery(false)
                      }
                    }}
                  />
                </label>
              </div>
              {form.gallery_stills_urls.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {form.gallery_stills_urls.map((url) => (
                    <div key={url} style={{ position: 'relative' }}>
                      <img src={url} alt="Image tirée du film" style={{ width: '88px', height: '66px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      <button type="button" onClick={() => removeCategorizedGalleryImage('gallery_stills_urls', url)} className="btn-admin-ghost btn-admin-danger" style={{ position: 'absolute', top: '-8px', right: '-8px', padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>×</button>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Aucune image ajoutée.</p>}
            </div>
            <div className="admin-form-group">
              <label>Photos promotionnelles</label>
              <div style={{ marginBottom: '0.6rem' }}>
                <label className="btn-admin-ghost" style={{ cursor: uploadingGallery ? 'not-allowed' : 'pointer', opacity: uploadingGallery ? 0.6 : 1 }}>
                  {uploadingGallery ? 'Upload…' : 'Ajouter des images'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    style={{ display: 'none' }}
                    disabled={uploadingGallery}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? [])
                      if (files.length === 0) return
                      try {
                        setUploadingGallery(true)
                        setError('')
                        const urls = await Promise.all(files.map((f) => uploadFilmAsset(f, 'film-gallery')))
                        setForm((prev) => ({ ...prev, gallery_promo_urls: [...prev.gallery_promo_urls, ...urls] }))
                      } catch (err: any) {
                        setError(`Upload impossible: ${err.message ?? 'Erreur inconnue'}`)
                      } finally {
                        setUploadingGallery(false)
                      }
                    }}
                  />
                </label>
              </div>
              {form.gallery_promo_urls.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {form.gallery_promo_urls.map((url) => (
                    <div key={url} style={{ position: 'relative' }}>
                      <img src={url} alt="Photo promotionnelle" style={{ width: '88px', height: '66px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      <button type="button" onClick={() => removeCategorizedGalleryImage('gallery_promo_urls', url)} className="btn-admin-ghost btn-admin-danger" style={{ position: 'absolute', top: '-8px', right: '-8px', padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>×</button>
                    </div>
                  ))}
                </div>
              ) : <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Aucune image ajoutée.</p>}
            </div>

            {sortedPartners.length > 0 && (
              <div className="admin-form-group">
                <label>Partenaires associés</label>
                <div style={{ marginTop: '0.25rem', maxHeight: '220px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 0.7rem' }}>
                  {sortedPartners.map((p) => (
                    <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.84rem', color: form.partner_ids.includes(p.id) ? 'var(--gold)' : 'var(--muted)', padding: '0.2rem 0' }}>
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
