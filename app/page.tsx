import Image from 'next/image'
import Link from 'next/link'
import PartnersGrid from '@/components/PartnersGrid'
import RevealWrapper from '@/components/RevealWrapper'
import HomeClient from '@/components/HomeClient'
import { getHeroBackgroundImageUrl } from '@/lib/hero-background'
import { supabase } from '@/lib/supabase'
import type { Film, BlogPost, Partner } from '@/lib/supabase'

async function getHomeData() {
  const [filmsRes, postsRes, partnersRes] = await Promise.all([
    supabase
      .from('films')
      .select('*')
      .order('production_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(3),
    supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
    supabase
      .from('partners')
      .select('id, name, category, logo_url, website')
      .eq('active', true)
      .order('name'),
  ])
  return {
    films: (filmsRes.data ?? []) as Film[],
    posts: (postsRes.data ?? []) as BlogPost[],
    partners: (partnersRes.data ?? []) as Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'>[],
  }
}

export const revalidate = 60

export default async function HomePage() {
  const { films, posts, partners } = getHomeDataSorted(await getHomeData())
  const heroBgUrl = getHeroBackgroundImageUrl()

  return (
    <RevealWrapper>
      {/* HERO */}
      <section id="hero">
        <div
          className="hero-bg"
          style={{
            backgroundImage: [
              'linear-gradient(180deg, transparent 48%, rgba(10,10,10,0.94) 100%)',
              'radial-gradient(ellipse 85% 58% at 50% 40%, rgba(184,151,62,0.09) 0%, transparent 68%)',
              'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.38) 44%, rgba(10,10,10,0.78) 100%)',
              `url(${heroBgUrl})`,
            ].join(', '),
          }}
        />
        <div className="film-strip">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="film-hole" />
          ))}
        </div>
        <div className="hero-content">
          <p className="hero-label">Placement de Produits Régionaux · Côte d&apos;Azur · PACA</p>
          <h1 className="hero-title">
            Vos produits<br />
            dans les <em>histoires</em><br />
            de demain.
          </h1>
          <p className="hero-sub">
            Cinémark connecte les marques locales aux productions cinématographiques de la région Sud.
            Films, séries, clips — votre produit devient part d&apos;une histoire.
          </p>
          <div className="hero-actions">
            <Link href="/#contact" className="btn-primary">Démarrer un partenariat</Link>
            <Link href="/#concept" className="btn-ghost">
              Découvrir le concept
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-item reveal">
          <span className="stat-number">40+</span>
          <span className="stat-label">Partenariats signés</span>
        </div>
        <div className="stat-item reveal reveal-delay-1">
          <span className="stat-number">15+</span>
          <span className="stat-label">Productions accompagnées</span>
        </div>
        <div className="stat-item reveal reveal-delay-2">
          <span className="stat-number">06</span>
          <span className="stat-label">Ancrés dans les Alpes-Maritimes</span>
        </div>
        <div className="stat-item reveal reveal-delay-3">
          <span className="stat-number">PACA</span>
          <span className="stat-label">Zone de diffusion</span>
        </div>
      </div>

      {/* CONCEPT */}
      <section id="concept">
        <div className="concept-visual reveal">
          <div className="concept-stripe" />
          <div className="concept-visual-photo">
            <Image
              src="/images/concept-placement-tournage.png"
              alt="Plateau de tournage : clap, Bière du Comté et opérateur caméra — placement produit Cinémark"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="concept-visual-img"
            />
          </div>
          <p className="concept-quote">
            Chaque film est une vitrine. Chaque plan, une opportunité.
            <cite>— Cinémark, Nice 2024</cite>
          </p>
        </div>
        <div className="reveal reveal-delay-1">
          <p className="section-label">Notre concept</p>
          <h2 className="section-title">Le placement produit,<br /><em>réinventé</em> pour les marques locales.</h2>
          <p className="section-text">
            Le placement produit n&apos;est plus réservé aux multinationales. Cinémark démocratise l&apos;accès à cet outil de communication puissant pour les artisans, commerçants et marques du Sud.
          </p>
          <p className="section-text" style={{ marginTop: '1.2rem' }}>
            Votre produit apparaît naturellement dans un film, un clip ou une série — ancré dans l&apos;imaginaire de la Côte d&apos;Azur, porté par une histoire et diffusé sur les plateformes et festivals.
          </p>
          <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem' }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>Organique</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>Pas intrusif, naturel</span>
            </div>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>Durable</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>Le film reste, votre marque aussi</span>
            </div>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>Local</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>Ancré dans le territoire</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process">
        <div className="reveal" style={{ maxWidth: '50rem' }}>
          <p className="section-label">Notre méthode</p>
          <h2 className="section-title">Un processus <em>simple</em>,<br />un résultat visible.</h2>
        </div>
        <div className="process-grid">
          <div className="process-step reveal">
            <span className="step-num">01</span>
            <h3 className="step-title">Sélection & Matching</h3>
            <p className="step-text">Nous identifions les productions en cours sur le territoire et matchons les produits selon l&apos;univers du film, le public cible et la cohérence narrative.</p>
          </div>
          <div className="process-step reveal reveal-delay-1">
            <span className="step-num">02</span>
            <h3 className="step-title">Intégration sur tournage</h3>
            <p className="step-text">Votre produit est intégré de façon organique par l&apos;équipe artistique. Visible, mais jamais forcé. L&apos;histoire reste au centre.</p>
          </div>
          <div className="process-step reveal reveal-delay-2">
            <span className="step-num">03</span>
            <h3 className="step-title">Diffusion & Visibilité</h3>
            <p className="step-text">Le film est diffusé sur les plateformes, festivals et événements locaux. Vous recevez les extraits avec votre produit pour vos propres réseaux.</p>
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients">
        <div className="clients-intro reveal">
          <p className="section-label">Références</p>
          <h2 className="section-title">Ils ont fait <em>confiance</em><br />à Cinémark.</h2>
          <p className="section-text" style={{ margin: '0 auto', textAlign: 'center' }}>
            Des brasseries artisanales aux grandes institutions sportives, Cinémark accompagne des marques qui ont en commun d&apos;être ancrées dans leur territoire.
          </p>
        </div>
        <div className="reveal">
          <PartnersGrid partners={partners} limit={8} />
        </div>
        <p style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link
            href="/partenaires"
            className="btn-ghost"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Voir tous les partenaires
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </p>
      </section>

      {/* TERRITORY */}
      <section id="territory">
        <div className="territory-map reveal">
          <Image
            src="/images/territoire-paca-carte.png"
            alt="Carte de la région PACA avec villes d'intervention Cinémark"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="territory-map-img"
            priority={false}
          />
        </div>
        <div className="reveal reveal-delay-1">
          <p className="section-label">Notre territoire</p>
          <h2 className="section-title">La région la plus<br /><em>filmée</em> de France.</h2>
          <p className="section-text">
            La Côte d&apos;Azur est un territoire d&apos;exception pour la production audiovisuelle. Cinémark exploite ce capital naturel pour positionner vos produits là où la lumière est la meilleure.
          </p>
          <ul className="territory-list">
            <li>Nice · Cannes · Monaco · Menton</li>
            <li>Grasse · Antibes · Vence · Tourettes-sur-Loup</li>
            <li>Marseille · Aix-en-Provence · Toulon</li>
            <li>Festivals : Cannes FF, BARCIFF Barcelona, Première Séance</li>
            <li>Diffusion nationale & plateformes streaming</li>
          </ul>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="testimonial">
        <blockquote className="reveal">
          Voir l&apos;un de nos tableaux dans le court-métrage, c&apos;est une mise en avant que nous n&apos;aurions jamais obtenue seuls. Merci Cinémark pour cette belle opportunité.
        </blockquote>
        <p className="testimonial-attr reveal reveal-delay-1">WeMood Shop <span>— Nice, 2025</span></p>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-info reveal">
          <p className="section-label">Contact</p>
          <h2 className="section-title">Parlez-nous de<br />votre <em>marque</em>.</h2>
          <p className="section-text">
            Chaque partenariat commence par une conversation. Dites-nous qui vous êtes et nous identifierons la production idéale pour votre produit.
          </p>
          <div className="contact-detail">
            <span className="contact-detail-label">Instagram</span>
            <span className="contact-detail-val">
              <a href="https://instagram.com/cinemark_azur" target="_blank" rel="noopener noreferrer">@cinemark_azur</a>
            </span>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-label">Localisation</span>
            <span className="contact-detail-val">Place Masséna, Nice 06000</span>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-label">Zone d&apos;intervention</span>
            <span className="contact-detail-val">Alpes-Maritimes · Var · PACA · Monaco</span>
          </div>
        </div>
        <HomeClient />
      </section>

      {/* FILMS PREVIEW */}
      <section id="films">
        <div className="films-intro reveal">
          <p className="section-label">Productions</p>
          <h2 className="section-title">Les films <em>Cinémark</em></h2>
          <p className="section-text">Films, séries et clips où les marques de la région prennent vie. Chaque production est une opportunité de placement unique.</p>
        </div>

        {films.length > 0 ? (
          <div className="films-grid reveal">
            {films.map((film) => (
              <Link key={film.id} href={`/films/${film.slug}`} className="film-card" data-status={film.status}>
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
                  {film.status === 'ongoing' && 'En cours de tournage'}
                  {film.status === 'upcoming' && 'À venir'}
                  {film.status === 'done' && 'Réalisé'}
                </div>
                <div className="film-card-title">{film.title}</div>
                <div className="film-card-year">
                  {(film.production_date
                    ? new Date(film.production_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                    : film.year) ?? '—'}
                  {film.format ? ` · ${film.format}` : ''}
                </div>
                {film.description && <p className="film-card-desc">{film.description}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="films-grid reveal">
            {[
              { title: 'Soleil d\'Azur', year: 2025, format: 'Long métrage', status: 'ongoing' as const, desc: 'Un drame familial tourné entre Nice et Menton, explorant l\'héritage et le territoire méditerranéen.' },
              { title: 'Nice by Night', year: 2025, format: 'Court métrage', status: 'upcoming' as const, desc: 'Un polar nocturne niçois sélectionné pour le Festival de Cannes Courts Métrages 2025.' },
              { title: 'Méditerranée', year: 2024, format: 'Long métrage', status: 'done' as const, desc: 'Un film de voyage et d\'identité tourné sur toute la côte méditerranéenne française.' },
            ].map((film) => (
              <div key={film.title} className="film-card">
                <div className={`film-card-status status-${film.status}`}>
                  <span className={`status-dot ${film.status}`} />
                  {film.status === 'ongoing' && 'En cours de tournage'}
                  {film.status === 'upcoming' && 'À venir'}
                  {film.status === 'done' && 'Réalisé'}
                </div>
                <div className="film-card-title">{film.title}</div>
                <div className="film-card-year">{film.year} · {film.format}</div>
                <p className="film-card-desc">{film.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/films" className="btn-ghost">
            Voir toutes les productions
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section id="blog">
        <div className="blog-intro reveal">
          <p className="section-label">Actualités</p>
          <h2 className="section-title">L&apos;univers <em>Cinémark</em></h2>
          <p className="section-text">Coulisses de tournages, tendances du placement produit et actualités de la production régionale.</p>
        </div>

        <div className="blog-grid reveal">
          {(posts.length > 0 ? posts : [
            { id: '1', slug: '#', category: 'Coulisses', title: 'Soleil d\'Azur : 3 semaines de tournage à Menton', excerpt: 'Retour sur le tournage du dernier long métrage accompagné par Cinémark, entre soleils de façade et nuits de production.', published_at: '2025-05-15' },
            { id: '2', slug: '#', category: 'Tendances', title: 'Pourquoi le placement produit local explose en 2025', excerpt: 'Les marques régionales découvrent enfin ce que les multinationales savent depuis des années : le cinéma reste le média le plus mémorable.', published_at: '2025-05-08' },
            { id: '3', slug: '#', category: 'Partenariat', title: 'OGC Nice & Cinémark : un an de collaboration', excerpt: 'Retour sur 12 mois de présence de l\'OGC Nice dans les productions Cinémark, et les résultats mesurés en termes de notoriété.', published_at: '2025-05-02' },
          ] as BlogPost[]).map((post) => (
            <Link
              key={post.id}
              href={post.slug === '#' ? '/blog' : `/blog/${post.slug}`}
              className="blog-card"
            >
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
                <span className="blog-card-cat">{post.category}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span className="blog-card-date">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </span>
                  <span className="blog-card-read">Lire →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/blog" className="btn-ghost">
            Voir tous les articles
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </RevealWrapper>
  )
}

function getHomeDataSorted(data: {
  films: Film[]
  posts: BlogPost[]
  partners: Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'>[]
}) {
  const films = [...data.films].sort((a, b) => {
    const da = a.production_date ? new Date(a.production_date).getTime() : 0
    const db = b.production_date ? new Date(b.production_date).getTime() : 0
    if (db !== da) return db - da
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  return { ...data, films }
}
