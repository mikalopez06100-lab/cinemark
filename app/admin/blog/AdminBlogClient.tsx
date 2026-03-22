'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'

type FormState = {
  title: string; slug: string; category: string;
  excerpt: string; content: string; published: boolean
}

const emptyForm: FormState = {
  title: '', slug: '', category: '', excerpt: '', content: '', published: false
}

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminBlogClient({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setModal('create')
  }

  const openEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category ?? '',
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      published: post.published,
    })
    setEditing(post)
    setModal('edit')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'title') updated.slug = slugify(value)
      return updated
    })
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) return
    setSaving(true)
    setError('')
    const payload = {
      title: form.title,
      slug: form.slug,
      category: form.category || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    }
    const { error } = editing
      ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
      : await supabase.from('blog_posts').insert(payload)
    if (error) { setError(error.message); setSaving(false); return }
    setModal(null)
    router.refresh()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    router.refresh()
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog</h1>
        <button className="btn-admin" onClick={openCreate}>+ Créer un article</button>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={5} style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Aucun article</td></tr>
            ) : posts.map((post) => (
              <tr key={post.id}>
                <td style={{ fontWeight: 400 }}>{post.title}</td>
                <td style={{ color: 'var(--muted)' }}>{post.category ?? '—'}</td>
                <td>
                  <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('fr-FR')
                    : new Date(post.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn-admin-ghost" onClick={() => openEdit(post)}>Modifier</button>
                    <button className="btn-admin-ghost btn-admin-danger" onClick={() => handleDelete(post.id)}>Supprimer</button>
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
            <h2 className="modal-title">{modal === 'create' ? 'Créer un article' : 'Modifier l\'article'}</h2>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <div className="admin-form-group">
              <label>Titre *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Titre de l'article" />
            </div>
            <div className="admin-form-group">
              <label>Slug *</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="titre-de-larticle" />
            </div>
            <div className="admin-form-group">
              <label>Catégorie</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Ex. Coulisses, Tendances, Partenariat…" />
            </div>
            <div className="admin-form-group">
              <label>Extrait</label>
              <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Résumé court de l'article…" style={{ minHeight: '70px' }} />
            </div>
            <div className="admin-form-group">
              <label>Contenu</label>
              <textarea name="content" value={form.content} onChange={handleChange} placeholder="Contenu complet de l'article…" style={{ minHeight: '180px' }} />
            </div>
            <div className="admin-form-group">
              <label>Publication</label>
              <div
                className="toggle-wrap"
                onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
              >
                <div className={`toggle ${form.published ? 'on' : ''}`} />
                <span style={{ fontSize: '0.85rem', color: form.published ? 'var(--gold)' : 'var(--muted)' }}>
                  {form.published ? 'Publié' : 'Brouillon'}
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
