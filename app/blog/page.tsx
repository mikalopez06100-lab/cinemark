import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Blog — Cinémark',
  description: 'Coulisses de tournages, tendances du placement produit et actualités de la production régionale.',
}

export const revalidate = 60

export default async function BlogPage() {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const posts = (data ?? []) as BlogPost[]

  return (
    <section id="blog" style={{ paddingTop: '10rem' }}>
      <div className="blog-intro">
        <p className="section-label">Actualités</p>
        <h1 className="section-title">L&apos;univers <em>Cinémark</em></h1>
        <p className="section-text">Coulisses de tournages, tendances du placement produit et actualités de la production régionale.</p>
      </div>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Aucun article publié pour le moment.</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
              <div className="blog-card-img">
                {post.cover_url ? (
                  <Image
                    src={post.cover_url}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="blog-card-img-photo"
                  />
                ) : (
                  <div className="blog-card-img-icon">
                    <svg viewBox="0 0 48 48" fill="none">
                      <rect x="6" y="10" width="36" height="28" rx="2" stroke="white" strokeWidth="1.5"/>
                      <path d="M6 18h36" stroke="white" strokeWidth="1.5"/>
                      <circle cx="24" cy="30" r="4" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="blog-card-body">
                {post.category && <span className="blog-card-cat">{post.category}</span>}
                <h2 className="blog-card-title">{post.title}</h2>
                {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                <div className="blog-card-meta">
                  <span className="blog-card-date">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                      : ''}
                  </span>
                  <span className="blog-card-read">Lire →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
