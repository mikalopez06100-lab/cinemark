'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resolveMediaUrl } from '@/lib/media-url'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'

type FormState = {
  title: string; slug: string; category: string;
  excerpt: string; content: string; cover_url: string; published: boolean
}

const emptyForm: FormState = {
  title: '', slug: '', category: '', excerpt: '', content: '', cover_url: '', published: false
}

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminBlogClient({ posts }: { posts: BlogPost[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [importingHtml, setImportingHtml] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchParams.get('new') === '1') openCreate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

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
      cover_url: post.cover_url ?? '',
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
      cover_url: form.cover_url || null,
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

  const uploadCover = async (file: File) => {
    setError('')
    setUploadingCover(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const safeSlug = form.slug || slugify(form.title) || 'article'
    const path = `blog-covers/${Date.now()}-${safeSlug}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/png' })

    if (uploadError) {
      setError(`Upload de la couverture impossible: ${uploadError.message}`)
      setUploadingCover(false)
      return
    }

    const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
    setForm((prev) => ({ ...prev, cover_url: data.publicUrl }))
    setUploadingCover(false)
  }

  const uploadBlobAsset = async (blob: Blob, folder: string, slugSeed: string, ext: string) => {
    const safeSlug = slugify(slugSeed) || 'article'
    const path = `${folder}/${Date.now()}-${safeSlug}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(path, blob, { upsert: true, contentType: blob.type || `image/${ext}` })
    if (uploadError) throw new Error(uploadError.message)
    const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
    return data.publicUrl
  }

  const uploadDataUrl = async (dataUrl: string, folder: string, slugSeed: string, fallbackExt = 'jpg') => {
    const m = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)
    const mime = m?.[1] ?? `image/${fallbackExt}`
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg'
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return uploadBlobAsset(blob, folder, slugSeed, ext)
  }

  const importFromHtmlFile = async (file: File) => {
    try {
      setImportingHtml(true)
      setError('')
      const raw = await file.text()

      const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/i)
      const rawTitle = (titleMatch?.[1] ?? file.name.replace(/\.html?$/i, '')).replace(/\s+/g, ' ').trim()
      const title = rawTitle.replace(/\s*[|—-]\s*Cinemark Azur\s*$/i, '').trim()
      const slug = slugify(title || 'nouvel-article')

      const intro =
        raw
          .match(/<p class="intro">([\s\S]*?)<\/p>/i)?.[1]
          ?.replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim() ?? ''

      const bodyMatch = raw.match(/<article class="article-body">([\s\S]*?)<\/article>/i)
      let body = bodyMatch?.[1]?.trim() ?? ''

      const figureRegex = /<figure[\s\S]*?<\/figure>/gi
      const figures = body.match(figureRegex) ?? []

      for (let i = 0; i < figures.length; i += 1) {
        const figure = figures[i]
        const srcMatch = figure.match(/<img[^>]+src="([^"]+)"/i)
        const captionMatch = figure.match(/<figcaption>([\s\S]*?)<\/figcaption>/i)
        const src = srcMatch?.[1] ?? ''
        const caption = (captionMatch?.[1] ?? '').trim()
        let finalSrc = src
        if (src.startsWith('data:image/')) {
          finalSrc = await uploadDataUrl(src, 'blog-imports', `${slug}-figure-${i + 1}`)
        }
        const replacement = `<figure class="blog-article-image"><img src="${finalSrc}" alt="${title || 'Article'} - image ${i + 1}" width="1200" height="800" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
        body = body.replace(figure, replacement)
      }

      const heroDataMatch = raw.match(/\.hero-bg[\s\S]*?data:image\/[a-zA-Z]+;base64,[^'")\s]+/i)
      const heroDataUrl = heroDataMatch?.[0]?.match(/(data:image\/[a-zA-Z]+;base64,[^'")\s]+)/i)?.[1]

      let coverUrl = form.cover_url
      if (heroDataUrl) {
        coverUrl = await uploadDataUrl(heroDataUrl, 'blog-covers', slug)
      }

      const content = `<div class="blog-article-html">
${coverUrl ? `<figure class="blog-article-cover"><img src="${coverUrl}" alt="${title}" width="1200" height="675" loading="eager" /></figure>` : ''}
${body}
</div>`
        .replace(/href="#"/g, 'href="/votre-marque"')
        .replace(/Contacter Cinemark Azur/g, 'Candidater — marques & partenaires')

      setForm((prev) => ({
        ...prev,
        title,
        slug,
        category: prev.category || 'Actualités',
        excerpt: intro ? `${intro.slice(0, 280)}${intro.length > 280 ? '…' : ''}` : prev.excerpt,
        cover_url: coverUrl,
        content,
        published: true,
      }))
    } catch (err: any) {
      setError(`Import HTML impossible: ${err?.message ?? 'Erreur inconnue'}`)
    } finally {
      setImportingHtml(false)
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Actualités</h1>
        <button className="btn-admin" onClick={openCreate}>+ Créer une actualité</button>
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
              <label>Import rapide (HTML)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label className="btn-admin-ghost" style={{ cursor: importingHtml ? 'not-allowed' : 'pointer', opacity: importingHtml ? 0.6 : 1 }}>
                  {importingHtml ? 'Import en cours…' : 'Importer un fichier HTML'}
                  <input
                    type="file"
                    accept=".html,.htm,text/html"
                    style={{ display: 'none' }}
                    disabled={importingHtml}
                    onChange={(e) => {
                      const htmlFile = e.target.files?.[0]
                      if (htmlFile) importFromHtmlFile(htmlFile)
                      e.currentTarget.value = ''
                    }}
                  />
                </label>
                <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                  Remplit automatiquement titre, slug, extrait, contenu et couverture.
                </span>
              </div>
            </div>

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
              <label>Image de couverture (URL)</label>
              <input name="cover_url" type="url" value={form.cover_url} onChange={handleChange} placeholder="https://..." />
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label className="btn-admin-ghost" style={{ cursor: uploadingCover ? 'not-allowed' : 'pointer', opacity: uploadingCover ? 0.6 : 1 }}>
                  {uploadingCover ? 'Upload…' : 'Uploader une image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    style={{ display: 'none' }}
                    disabled={uploadingCover}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadCover(file)
                    }}
                  />
                </label>
                {(() => {
                  const src = resolveMediaUrl(form.cover_url)
                  return src ? (
                    <img
                      src={src}
                      alt="Aperçu couverture article"
                      style={{ width: '96px', height: '56px', objectFit: 'cover', border: '1px solid var(--border)', borderRadius: '4px' }}
                    />
                  ) : null
                })()}
              </div>
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
