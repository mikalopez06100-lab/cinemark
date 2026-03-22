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
    .order('created_at', { ascending: false })

  const films = (data ?? []) as Film[]

  return (
    <section id="films" style={{ paddingTop: '10rem' }}>
      <div className="films-intro">
        <p className="section-label">Productions</p>
        <h1 className="section-title">Les films <em>Cinémark</em></h1>
        <p className="section-text">Films, séries et clips où les marques de la région prennent vie. Chaque production est une opportunité de placement unique.</p>
      </div>
      <FilmsClient films={films} />
    </section>
  )
}
