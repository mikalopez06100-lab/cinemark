import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { resolveMediaUrl, resolveMediaUrls } from '@/lib/media-url'
import { supabase } from '@/lib/supabase'
import type { Film, Partner } from '@/lib/supabase'

type Props = { params: { slug: string } }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('films')
    .select('title, description')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Film — Cinémark' }
  return {
    title: `${data.title} — Cinémark`,
    description: data.description ?? undefined,
  }
}

export default async function FilmDetailPage({ params }: Props) {
  const { data } = await supabase
    .from('films')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!data) notFound()
  const film = data as Film

  let partners: Partner[] = []
  if (film.partner_ids && film.partner_ids.length > 0) {
    const { data: partnersData } = await supabase
      .from('partners')
      .select('*')
      .in('id', film.partner_ids)
      .eq('active', true)
      .order('name')
    partners = (partnersData ?? []) as Partner[]
  }

  const gallery = resolveMediaUrls(film.gallery_urls)
  const stills = resolveMediaUrls(film.gallery_stills_urls)
  const bts = resolveMediaUrls(film.gallery_bts_urls)
  const promo = resolveMediaUrls(film.gallery_promo_urls)
  const posterSrc = resolveMediaUrl(film.poster_url)
  const credits = film.photographer_credits?.trim() ?? ''

  const cap = (arr: string[] | null | undefined, i: number) => arr?.[i]?.trim() || null

  return (
    <section className="page-section-top">
      <div className="film-detail">
        <div className="film-detail-header">
          <Link href="/films" className="btn-ghost film-back-link">
            ← Retour aux films
          </Link>
          <h1 className="section-title" style={{ marginTop: '1rem' }}>
            {film.title}
          </h1>
          <p className="section-text" style={{ marginTop: '1rem' }}>
            {(film.production_date
              ? new Date(film.production_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
              : film.year) ?? 'Date à venir'}
            {film.format ? ` · ${film.format}` : ''}
          </p>
        </div>

        <div className="film-detail-grid">
          <div className="film-poster">
            {posterSrc ? (
              <Image
                src={posterSrc}
                alt={`Affiche officielle ${film.title}`}
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
                className="film-poster-img"
              />
            ) : (
              <div className="film-poster-empty">Affiche officielle à venir</div>
            )}
          </div>

          <div className="film-detail-content">
            {(film.director || film.production || film.duration) && (
              <>
                <p className="section-label">Fiche technique</p>
                {film.director && <p className="section-text" style={{ marginTop: '-0.35rem' }}><strong>Réalisation :</strong> {film.director}</p>}
                {film.production && <p className="section-text"><strong>Productions :</strong> {film.production}</p>}
                <p className="section-text" style={{ marginBottom: '1.2rem' }}><strong>Durée :</strong> {film.duration ?? '—'}</p>
              </>
            )}
            {film.description && (
              <>
                <p className="section-label">Présentation</p>
                <p className="section-text">{film.description}</p>
              </>
            )}

            {film.synopsis && (
              <>
                <p className="section-label" style={{ marginTop: '2rem' }}>Synopsis</p>
                <p className="section-text">{film.synopsis}</p>
              </>
            )}
            {(film.casting || film.diffusion || film.awards || film.external_url) && (
              <>
                <p className="section-label" style={{ marginTop: '2rem' }}>Autres informations</p>
                {film.casting && <p className="section-text"><strong>Casting :</strong> {film.casting}</p>}
                {film.diffusion && <p className="section-text"><strong>Diffusion :</strong> {film.diffusion}</p>}
                {film.awards && <p className="section-text"><strong>Prix :</strong> {film.awards}</p>}
                {film.external_url && (
                  <p className="section-text">
                    <strong>Lien :</strong>{' '}
                    <a href={film.external_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)' }}>
                      Page externe du film
                    </a>
                  </p>
                )}
              </>
            )}

            <p className="section-label" style={{ marginTop: '2rem' }}>Partenaires du film</p>
            {partners.length === 0 ? (
              <p className="section-text">Aucun partenaire associé pour le moment.</p>
            ) : (
              <div className="film-partners">
                {partners.map((p) => {
                  const logoSrc = resolveMediaUrl(p.logo_url)
                  return (
                  <a
                    key={p.id}
                    href={p.website ?? '#'}
                    target={p.website ? '_blank' : undefined}
                    rel={p.website ? 'noopener noreferrer' : undefined}
                    className={`film-partner${p.website ? ' is-link' : ''}`}
                  >
                    {logoSrc ? (
                      <img src={logoSrc} alt={`Logo ${p.name}`} className="film-partner-logo" />
                    ) : (
                      <div className="film-partner-logo film-partner-logo--empty" />
                    )}
                    <span>{p.name}</span>
                  </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {(stills.length > 0 || bts.length > 0 || promo.length > 0 || gallery.length > 0) && (
          <>
            {stills.length > 0 && <p className="section-label" style={{ marginTop: '3.5rem' }}>Images tirées du film</p>}
            {stills.length > 0 && (
              <div className="film-gallery">
                {stills.map((url, i) => {
                  const c = cap(film.gallery_stills_captions, i)
                  return (
                    <figure key={`${url}-${i}`} className="film-gallery-item">
                      <div className="film-gallery-img-wrap">
                        <Image src={url} alt={c ?? `Image tirée du film ${i + 1} — ${film.title}`} fill sizes="(max-width: 900px) 100vw, 33vw" className="film-gallery-img" />
                      </div>
                      {c ? <figcaption className="film-gallery-caption">{c}</figcaption> : null}
                    </figure>
                  )
                })}
              </div>
            )}
            {bts.length > 0 && <p className="section-label" style={{ marginTop: '3.5rem' }}>Photos de tournage</p>}
            {bts.length > 0 && (
              <div className="film-gallery">
                {bts.map((url, i) => {
                  const c = cap(film.gallery_bts_captions, i)
                  return (
                    <figure key={`${url}-${i}`} className="film-gallery-item">
                      <div className="film-gallery-img-wrap">
                        <Image src={url} alt={c ?? `Photo de tournage ${i + 1} — ${film.title}`} fill sizes="(max-width: 900px) 100vw, 33vw" className="film-gallery-img" />
                      </div>
                      {c ? <figcaption className="film-gallery-caption">{c}</figcaption> : null}
                    </figure>
                  )
                })}
              </div>
            )}
            {promo.length > 0 && <p className="section-label" style={{ marginTop: '3.5rem' }}>Photos promotionnelles</p>}
            {promo.length > 0 && (
              <div className="film-gallery">
                {promo.map((url, i) => {
                  const c = cap(film.gallery_promo_captions, i)
                  return (
                    <figure key={`${url}-${i}`} className="film-gallery-item">
                      <div className="film-gallery-img-wrap">
                        <Image src={url} alt={c ?? `Photo promotionnelle ${i + 1} — ${film.title}`} fill sizes="(max-width: 900px) 100vw, 33vw" className="film-gallery-img" />
                      </div>
                      {c ? <figcaption className="film-gallery-caption">{c}</figcaption> : null}
                    </figure>
                  )
                })}
              </div>
            )}
            {gallery.length > 0 && <p className="section-label" style={{ marginTop: '3.5rem' }}>Galerie</p>}
            {gallery.length > 0 && (
              <div className="film-gallery">
                {gallery.map((url, i) => {
                  const c = cap(film.gallery_captions, i)
                  return (
                    <figure key={`${url}-${i}`} className="film-gallery-item">
                      <div className="film-gallery-img-wrap">
                        <Image src={url} alt={c ?? `Image ${i + 1} — ${film.title}`} fill sizes="(max-width: 900px) 100vw, 33vw" className="film-gallery-img" />
                      </div>
                      {c ? <figcaption className="film-gallery-caption">{c}</figcaption> : null}
                    </figure>
                  )
                })}
              </div>
            )}
            {credits ? (
              <p className="film-gallery-credits">
                <strong>Crédits photographes :</strong> {credits}
              </p>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
