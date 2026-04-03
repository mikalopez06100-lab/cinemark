import Image from 'next/image'
import Link from 'next/link'
import PartnersGrid from '@/components/PartnersGrid'
import RevealWrapper from '@/components/RevealWrapper'
import HomeClient from '@/components/HomeClient'
import { getConceptImageUrl } from '@/lib/concept-image'
import { getHeroBackgroundImageUrl } from '@/lib/hero-background'
import { resolveMediaUrl } from '@/lib/media-url'
import { supabase } from '@/lib/supabase'
import type { Film, BlogPost, Partner } from '@/lib/supabase'

const filmStatusLabel: Record<Film['status'], string> = {
  finalized: 'Projet finalisé',
  postprod: 'En cours de post-production',
  ongoing: 'Tournage en cours',
  upcoming: 'Tournage à venir',
  seeking_partners: 'En recherche de partenaires',
}

async function getHomeData() {
  const [filmsRes, postsRes, partnersRes, filmsCountRes, partnersCountRes] = await Promise.all([
    supabase
      .from('films')
      .select('*')
      .order('production_date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(4),
    supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
    supabase
      .from('partners')
      .select('id, name, category, logo_url, website')
      .eq('active', true)
      .order('name'),
    supabase.from('films').select('id', { count: 'exact', head: true }),
    supabase.from('partners').select('id', { count: 'exact', head: true }).eq('active', true),
  ])
  return {
    films: (filmsRes.data ?? []) as Film[],
    posts: (postsRes.data ?? []) as BlogPost[],
    partners: (partnersRes.data ?? []) as Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'>[],
    filmsCount: filmsCountRes.count ?? 0,
    partnersCount: partnersCountRes.count ?? 0,
  }
}

/** Évite une page d’accueil figée en cache (contenu Supabase + section contact à jour). */
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { films, posts, partners, filmsCount, partnersCount } = getHomeDataSorted(await getHomeData())
  const heroBgUrl = getHeroBackgroundImageUrl()
  const conceptImageUrl = getConceptImageUrl()

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
          <p className="hero-label">Placement de Produits Régionaux · Côte d&apos;Azur · PACA · Corse</p>
          <h1 className="hero-title">
            Vos produits<br />
            dans les <em>histoires</em><br />
            de demain.
          </h1>
          <p className="hero-sub">
            Notre agence est spécialisée dans les Partenariats et le Placement de Produits Régionaux, au coeur de films,
            de séries ou de vidéo-clips professionnels et indépendants tournés en région Sud / PACA.
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
          <span className="stat-number">{partnersCount}+</span>
          <span className="stat-label">Partenaires</span>
        </div>
        <div className="stat-item reveal reveal-delay-1">
          <span className="stat-number">{filmsCount}+</span>
          <span className="stat-label">Projets accompagnés</span>
        </div>
        <div className="stat-item reveal reveal-delay-2">
          <span className="stat-number">06</span>
          <span className="stat-label">Ancrés dans les Alpes-Maritimes</span>
        </div>
        <div className="stat-item reveal reveal-delay-3">
          <span className="stat-number">LE SUD</span>
          <span className="stat-label">Zone d&apos;action</span>
        </div>
      </div>

      {/* CONCEPT */}
      <section id="concept">
        <div className="concept-visual reveal">
          <div className="concept-stripe" />
          <div className="concept-visual-photo">
            <Image
              src={conceptImageUrl}
              alt="Bouteilles Cosy Kombucha sur plateau avec clap de cinéma — placement produit régional et cinéma Cinémark Azur"
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
          <h2 className="section-title">Le placement de produits,<br /><em>adapté</em> pour les marques locales.</h2>
          <p className="section-text">
            Nous concevons des connexions naturelles et authentiques entre les créateurs de contenus et les marques,
            les commerçants ou les artisans qui font la richesse de notre territoire méditerranéen.
          </p>
          <p className="section-text" style={{ marginTop: '1.2rem' }}>
            Une boisson consommée à l&apos;image, un bijou porté, un accessoire manipulé, votre restaurant qui devient un décor
            ou un tableau visible en arrière-plan.
            <br />
            Offrez à votre marque une visibilité sur grand écran ?
          </p>
          <div className="concept-pillars">
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>Soutenir</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>La création locale</span>
            </div>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>Valorisez</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>Votre image et celle de la Région</span>
            </div>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--gold-lt)', fontWeight: 300 }}>Favoriser</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>Les circuits courts</span>
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
            <h3 className="step-title">Sélection</h3>
            <p className="step-text">Nous identifions les productions de qualité tournées dans les prochains mois sur le territoire, puis nous sélectionnons les partenaires selon l&apos;univers du film et le public ciblé.</p>
          </div>
          <div className="process-step reveal reveal-delay-1">
            <span className="step-num">02</span>
            <h3 className="step-title">Intégration sur tournage</h3>
            <p className="step-text">Sous le contrôle bienveillant de notre équipe, votre produit sera intégré de façon harmonieuse dans le récit. Visible, mais jamais ostentatoire. L&apos;histoire reste au coeur du projet.</p>
          </div>
          <div className="process-step reveal reveal-delay-2">
            <span className="step-num">03</span>
            <h3 className="step-title">Diffusion & Visibilité</h3>
            <p className="step-text">Les films sont destinés, selon les cas, aux festivals régionaux, nationaux et internationaux, ainsi qu&apos;aux salles de cinéma, aux chaînes TV et aux plateformes en ligne.</p>
          </div>
        </div>
      </section>

      {/* FILMS PREVIEW */}
      <section id="films">
        <div className="films-intro reveal">
          <p className="section-label">Productions</p>
          <h2 className="section-title">Les films <em>Cinémark</em></h2>
          <p className="section-text" style={{ marginTop: '1rem' }}>
            Découvrez tous les projets audiovisuels soutenus par Cinémark depuis 2025.
          </p>
        </div>

        {films.length > 0 ? (
          <div className="films-grid films-grid--home-list reveal">
            {films.map((film) => {
              const posterSrc = resolveMediaUrl(film.poster_url)
              return (
              <Link key={film.id} href={`/films/${film.slug}`} className="film-card film-card--row" data-status={film.status}>
                <div className="film-card-img">
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt={`Affiche ${film.title}`}
                      fill
                      sizes="(max-width: 900px) 45vw, 220px"
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
                <div className="film-card-body">
                  <div className={`film-card-status status-${film.status}`}>
                    <span className={`status-dot ${film.status}`} />
                    {filmStatusLabel[film.status]}
                  </div>
                  <div className="film-card-title">{film.title}</div>
                  <div className="film-card-year">
                    {(film.production_date
                      ? new Date(film.production_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                      : film.year) ?? '—'}
                    {film.format ? ` · ${film.format}` : ''}
                  </div>
                  {film.description && <p className="film-card-desc">{film.description}</p>}
                </div>
              </Link>
              )
            })}
          </div>
        ) : (
          <div className="films-grid films-grid--home-list reveal">
            {[
              { title: 'Soleil d\'Azur', year: 2025, format: 'Long métrage', status: 'ongoing' as const, desc: 'Un drame familial tourné entre Nice et Menton, explorant l\'héritage et le territoire méditerranéen.' },
              { title: 'Nice by Night', year: 2025, format: 'Court métrage', status: 'seeking_partners' as const, desc: 'Un polar nocturne niçois sélectionné pour le Festival de Cannes Courts Métrages 2025.' },
              { title: 'Méditerranée', year: 2024, format: 'Long métrage', status: 'finalized' as const, desc: 'Un film de voyage et d\'identité tourné sur toute la côte méditerranéenne française.' },
            ].map((film) => (
              <div key={film.title} className="film-card film-card--row">
                <div className="film-card-img">
                  <div className="film-card-img-icon" aria-hidden>
                    <svg viewBox="0 0 48 48" fill="none">
                      <rect x="6" y="10" width="36" height="28" rx="2" stroke="white" strokeWidth="1.5"/>
                      <path d="M6 18h36" stroke="white" strokeWidth="1.5"/>
                      <circle cx="24" cy="30" r="4" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
                <div className="film-card-body">
                  <div className={`film-card-status status-${film.status}`}>
                    <span className={`status-dot ${film.status}`} />
                    {filmStatusLabel[film.status]}
                  </div>
                  <div className="film-card-title">{film.title}</div>
                  <div className="film-card-year">{film.year} · {film.format}</div>
                  <p className="film-card-desc">{film.desc}</p>
                </div>
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

      {/* PARTENAIRES (références) */}
      <section id="partenaires-section">
        <div className="clients-intro reveal">
          <p className="section-label">Références</p>
          <h2 className="section-title">Ils font <em>confiance</em><br />à Cinémark.</h2>
          <p className="section-text" style={{ margin: '0 auto', textAlign: 'center' }}>
            Boissons bio et artisanales, Cinémark-Azur accompagne les enseignes ancrées dans leur territoire.
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
            src="/images/territoire-cote-dazur.png"
            alt="Vue panoramique sur la côte et les collines méditerranéennes — territoire d&apos;intervention Cinémark"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="territory-map-img"
            priority={false}
          />
        </div>
        <div className="reveal reveal-delay-1">
          <p className="section-label">Notre territoire</p>
          <h2 className="section-title">La 2ème région la plus<br /><em>filmée</em> de France.</h2>
          <p className="section-text">
            Forte de sa lumière naturelle, de ses décors variés et de sa grande histoire avec le cinéma, la région Sud est un territoire d&apos;exception pour la production audiovisuelle. Elle accueille plus de 1.000 tournages chaque année.
          </p>
          <ul className="territory-list">
            <li>Nice · Cannes · Menton</li>
            <li>Alpes-Maritimes · Var · Bouches-du-Rhône</li>
            <li>Principauté de Monaco</li>
            <li>Alpes-de-Haute-Provence · Hautes-Alpes · Vaucluse</li>
            <li>Corse</li>
          </ul>
        </div>
      </section>

      {/* VOTRE TOURNAGE (aperçu) */}
      <section id="tournage" style={{ background: 'var(--black)' }}>
        <div className="clients-intro reveal" style={{ marginBottom: 0 }}>
          <p className="section-label">Votre tournage</p>
          <h2 className="section-title marques-hero-title">
            <span className="marques-hero-line1">Vous préparez un tournage</span>
            <span className="marques-hero-line2">
              dans le <em>Sud</em> ?
            </span>
          </h2>
          <p className="section-text" style={{ margin: '0 auto', textAlign: 'center' }}>
            Nous accompagnons les productions audiovisuelles dans la recherche de partenaires et de placements de produit adaptés à votre univers cinématographique.
          </p>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/marques" className="btn-primary">
              En savoir plus sur votre tournage
            </Link>
          </p>
        </div>
      </section>

      {/* VOTRE MARQUE (aperçu) */}
      <section id="votre-marque" style={{ background: 'var(--charcoal)' }}>
        <div className="clients-intro reveal" style={{ marginBottom: 0 }}>
          <p className="section-label">Votre marque</p>
          <h2 className="section-title">
            Votre marque sur <em>grand écran</em>
          </h2>
          <p className="section-text" style={{ margin: '0 auto', textAlign: 'center' }}>
            Le Cinéma est un support de communication puissant, capable de créer une véritable connexion avec le public et de retenir son attention.
          </p>
          <p className="section-text" style={{ margin: '1rem auto 0', textAlign: 'center' }}>
            Démarquez-vous et faites rayonner votre enseigne, grâce à une présence originale et raffinée.
          </p>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/votre-marque" className="btn-primary">
              Proposer votre Marque
            </Link>
          </p>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="testimonial">
        <blockquote className="reveal">
          Très heureux de voir l&apos;un de nos tableaux dans le court-métrage &quot;Comme tout le monde&quot; ! Merci de cette belle mise en avant.
        </blockquote>
        <p className="testimonial-attr reveal reveal-delay-1">WEMOOD SHOP <span>— Nice, Octobre 2025</span></p>
        <blockquote className="reveal reveal-delay-2" style={{ marginTop: '2.5rem' }}>
          Un plaisir d&apos;avoir participé à cette aventure avec Cinémark-Azur !
        </blockquote>
        <p className="testimonial-attr reveal reveal-delay-3">AUTO-MOTO ÉCOLE DES LYCÉES <span>— Nice, Octobre 2025</span></p>
        <blockquote className="reveal reveal-delay-4" style={{ marginTop: '2.5rem' }}>
          Fier d&apos;avoir participé à La Samain du Cinéma Fantastique (Nice), en fournissant des produits Grav&apos;Azur pour les invités du Festival !
          Organisation professionnelle et belle collaboration avec Cinémark-Azur.
        </blockquote>
        <p className="testimonial-attr reveal">GRAV&apos;AZUR <span>— Nice, Novembre 2025</span></p>
      </section>

      {/* ACTUALITES PREVIEW */}
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
          ] as BlogPost[]).map((post) => {
            const coverSrc = resolveMediaUrl(post.cover_url)
            return (
            <Link
              key={post.id}
              href={post.slug === '#' ? '/blog' : `/blog/${post.slug}`}
              className="blog-card"
            >
              <div className="blog-card-img">
                {coverSrc ? (
                  <Image
                    src={coverSrc}
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
            )
          })}
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/blog" className="btn-ghost">
            Voir toutes les actualités
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" aria-labelledby="contact-heading">
        <div className="contact-info reveal">
          <hr className="contact-section-rule" aria-hidden />
          <h2 id="contact-heading" className="section-title contact-section-title">Contact</h2>
          <div className="contact-detail">
            <span className="contact-detail-label">Contact</span>
            <span className="contact-detail-val">Dominic Graziani</span>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-label">Portable</span>
            <span className="contact-detail-val">
              <a href="tel:+33611987231">06 11 987 231</a>
            </span>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-label">Email</span>
            <span className="contact-detail-val">
              <a href="mailto:dominic@cinemark-azur.com">dominic@cinemark-azur.com</a>
            </span>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-label">Localisation</span>
            <span className="contact-detail-val">3 place Masséna, Nice 06000</span>
          </div>
          <div className="contact-detail contact-detail--social">
            <span className="contact-detail-label">Instagram</span>
            <a
              href="https://instagram.com/cinemark_azur"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <svg className="contact-social-icon" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.897 4.897 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.894 4.894 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.406-.11a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
                />
              </svg>
              <span>@cinemark_azur</span>
            </a>
          </div>
          <div className="contact-detail contact-detail--social">
            <span className="contact-detail-label">LinkedIn</span>
            <a
              href="https://www.linkedin.com/in/cinemark-azur-2499963a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
            >
              <svg className="contact-social-icon" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
          <div className="contact-detail">
            <span className="contact-detail-label">Zone d&apos;intervention</span>
            <span className="contact-detail-val">Alpes-Maritimes · Var · PACA · Monaco · Corse</span>
          </div>
        </div>
        <HomeClient />
      </section>
    </RevealWrapper>
  )
}

function getHomeDataSorted(data: {
  films: Film[]
  posts: BlogPost[]
  partners: Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'>[]
  filmsCount: number
  partnersCount: number
}) {
  const films = [...data.films].sort((a, b) => {
    const da = a.production_date ? new Date(a.production_date).getTime() : 0
    const db = b.production_date ? new Date(b.production_date).getTime() : 0
    if (db !== da) return db - da
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
  return { ...data, films }
}
