import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

  const gallery = film.gallery_urls ?? []

  return (
    <section style={{ paddingTop: '10rem' }}>
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
            {film.poster_url ? (
              <Image
                src={film.poster_url}
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

            <p className="section-label" style={{ marginTop: '2rem' }}>Partenaires du film</p>
            {partners.length === 0 ? (
              <p className="section-text">Aucun partenaire associé pour le moment.</p>
            ) : (
              <div className="film-partners">
                {partners.map((p) => (
                  <a
                    key={p.id}
                    href={p.website ?? '#'}
                    target={p.website ? '_blank' : undefined}
                    rel={p.website ? 'noopener noreferrer' : undefined}
                    className={`film-partner${p.website ? ' is-link' : ''}`}
                  >
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={`Logo ${p.name}`} className="film-partner-logo" />
                    ) : (
                      <div className="film-partner-logo film-partner-logo--empty" />
                    )}
                    <span>{p.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {gallery.length > 0 && (
          <>
            <p className="section-label" style={{ marginTop: '3.5rem' }}>Galerie de tournage</p>
            <div className="film-gallery">
              {gallery.map((url, i) => (
                <div key={`${url}-${i}`} className="film-gallery-item">
                  <Image
                    src={url}
                    alt={`Photo de tournage ${i + 1} — ${film.title}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="film-gallery-img"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
