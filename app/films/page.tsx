import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Film } from '@/lib/supabase'
import FilmsClient from './FilmsClient'

export const metadata: Metadata = {
  title: 'Productions — Cinémark',
  description: 'Films, séries et clips où les marques de la région prennent vie. Catalogue complet des productions Cinémark.',
}

export const revalidate = 60

export default async function FilmsPage() {
  const { data } = await supabase
    .from('films')
    .select('*')
    .order('production_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  const films = ((data ?? []) as Film[]).sort((a, b) => {
    const da = a.production_date ? new Date(a.production_date).getTime() : 0
    const db = b.production_date ? new Date(b.production_date).getTime() : 0
    if (db !== da) return db - da
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <section id="films" className="page-section-top">
      <div className="films-intro">
        <p className="section-label">Productions</p>
        <h1 className="section-title">Les films <em>Cinémark</em></h1>
      </div>
      <FilmsClient films={films} />
    </section>
  )
}
