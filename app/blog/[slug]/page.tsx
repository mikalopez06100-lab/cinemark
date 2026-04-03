import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'

export const revalidate = 60

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Actualité — Cinémark' }
  return {
    title: `${data.title} — Cinémark`,
    description: data.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!data) notFound()

  const post = data as BlogPost

  return (
    <article className="page-section-top blog-article-shell">
      <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'none', marginBottom: '3rem', transition: 'color 0.2s' }} className="btn-ghost">
        ← Retour aux actualités
      </Link>

      {post.category && (
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1.5rem' }}>
          {post.category}
        </p>
      )}

      <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '1.5rem', color: 'var(--cream)' }}>
        {post.title}
      </h1>

      {post.published_at && (
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '3rem' }}>
          {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}

      <div style={{ width: '100%', height: '1px', background: 'var(--border)', marginBottom: '3rem' }} />

      {post.excerpt && (
        <p style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'rgba(242,236,224,0.7)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          {post.excerpt}
        </p>
      )}

      {post.content && (
        <div className="blog-post-body">
          {post.content.trimStart().startsWith('<') ? (
            <div
              className="blog-article-html"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '1rem' }}>
              {post.content.split('\n').map((para, i) =>
                para.trim() ? <p key={i} style={{ marginBottom: '1.5rem' }}>{para}</p> : null
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
