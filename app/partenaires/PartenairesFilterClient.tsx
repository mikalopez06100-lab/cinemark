'use client'

import { useMemo, useState } from 'react'
import PartnersGrid from '@/components/PartnersGrid'
import type { Partner } from '@/lib/supabase'

type PartnerItem = Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'>

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export default function PartenairesFilterClient({ partners }: { partners: PartnerItem[] }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = normalize(query)

  const filtered = useMemo(() => {
    const sorted = [...partners].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
    if (!normalizedQuery) return sorted
    return sorted.filter((p) => {
      const name = normalize(p.name)
      const category = normalize(p.category ?? '')
      return name.includes(normalizedQuery) || category.includes(normalizedQuery)
    })
  }, [partners, normalizedQuery])

  return (
    <>
      <div className="partners-filter-wrap reveal">
        <label htmlFor="partners-filter-input" className="partners-filter-label">
          Rechercher une marque ou une categorie
        </label>
        <input
          id="partners-filter-input"
          className="partners-filter-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex. Monaco Beer, sport, institution..."
        />
        <p className="partners-filter-count">
          {filtered.length} partenaire{filtered.length > 1 ? 's' : ''} affiche{filtered.length > 1 ? 's' : ''}
        </p>
      </div>

      {filtered.length > 0 ? (
        <PartnersGrid partners={filtered} shuffle={false} />
      ) : (
        <p className="partners-filter-empty">Aucun partenaire ne correspond a votre recherche.</p>
      )}
    </>
  )
}
