import type { Metadata } from 'next'
import Link from 'next/link'
import PartnersGrid from '@/components/PartnersGrid'
import { PARTNER_SHOWCASE } from '@/lib/partners-showcase'

export const metadata: Metadata = {
  title: 'Partenaires — Cinémark',
  description:
    'Marques, institutions et artisans de la Côte d\'Azur qui ont collaboré avec Cinémark sur des placements produits et des productions locales.',
}

export default function PartenairesPage() {
  return (
    <section id="partenaires" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
      <div className="clients-intro reveal" style={{ marginBottom: '3rem' }}>
        <p className="section-label">Références</p>
        <h1 className="section-title">
          Ils ont fait <em>confiance</em>
          <br />
          à Cinémark.
        </h1>
        <p className="section-text" style={{ margin: '0 auto', textAlign: 'center' }}>
          Des brasseries artisanales aux institutions sportives et territoriales : des marques ancrées dans le Sud qui
          choisissent le cinéma pour raconter leur territoire.
        </p>
      </div>

      <PartnersGrid partners={PARTNER_SHOWCASE} />

      <p style={{ textAlign: 'center', marginTop: '3.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
        Votre marque sur cette liste ?{' '}
        <Link href="/marques" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
          Déposez une candidature →
        </Link>
      </p>
    </section>
  )
}
