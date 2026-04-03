import type { Metadata } from 'next'
import Link from 'next/link'
import PartenairesFilterClient from './PartenairesFilterClient'
import RevealWrapper from '@/components/RevealWrapper'
import { supabase } from '@/lib/supabase'
import type { Partner } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Partenaires — Cinémark',
  description:
    'Marques, institutions et artisans de la Côte d\'Azur qui ont collaboré avec Cinémark sur des placements produits et des productions locales.',
}

export const dynamic = 'force-dynamic'

export default async function PartenairesPage() {
  const { data } = await supabase
    .from('partners')
    .select('id, name, category, logo_url, website')
    .eq('active', true)
    .order('name')
  const partners = (data ?? []) as Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'>[]

  return (
    <RevealWrapper>
      <section id="partenaires" className="page-section-top" style={{ paddingBottom: '5rem' }}>
        <div className="clients-intro reveal" style={{ marginBottom: '3rem' }}>
          <p className="section-label">Références</p>
          <h1 className="section-title">
            Ils font confiance à Cinémark.
          </h1>
          <p className="section-text" style={{ margin: '0 auto', textAlign: 'center' }}>
            Des marques de vêtements locales aux grandes institutions sportives, en passant par les boissons bio et artisanales,
            Cinémark-Azur accompagne les enseignes ancrées dans leur territoire.
          </p>
        </div>

        <PartenairesFilterClient partners={partners} />

        <p style={{ textAlign: 'center', marginTop: '3.5rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
          Votre marque sur cette liste ?{' '}
          <Link href="/votre-marque" style={{ color: 'var(--gold)', textDecoration: 'none' }}>
            Déposez une candidature →
          </Link>
        </p>
      </section>
    </RevealWrapper>
  )
}
