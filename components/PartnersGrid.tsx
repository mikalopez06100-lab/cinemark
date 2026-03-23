'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Partner } from '@/lib/supabase'

export type PartnerGridItem = Pick<Partner, 'id' | 'name' | 'category' | 'logo_url' | 'website'> & {
  featured?: boolean
}

function shufflePartners(list: PartnerGridItem[]): PartnerGridItem[] {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function PartnersGrid({ partners }: { partners: PartnerGridItem[] }) {
  const [shuffled, setShuffled] = useState<PartnerGridItem[]>(partners)

  useEffect(() => {
    setShuffled(shufflePartners(partners))
  }, [partners])

  return (
    <div className="brands-grid">
      {shuffled.map((brand) => (
        <div
          key={brand.id}
          className={`brand-tile${brand.featured ? ' featured' : ''}`}
        >
          {brand.logo_url ? (
            <div className="brand-logo-wrap">
              {brand.website ? (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-logo-link"
                  aria-label={`Visiter le site de ${brand.name}`}
                >
                  <Image
                    src={brand.logo_url}
                    alt={`Logo ${brand.name}`}
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    className="brand-logo-img"
                  />
                </a>
              ) : (
                <Image
                  src={brand.logo_url}
                  alt={`Logo ${brand.name}`}
                  fill
                  sizes="(max-width: 900px) 50vw, 25vw"
                  className="brand-logo-img"
                />
              )}
            </div>
          ) : (
            <div className="brand-logo-wrap brand-logo-wrap--empty" aria-hidden />
          )}
          <span className="brand-name">{brand.name}</span>
          <span className="brand-cat">{brand.category ?? 'Partenaire'}</span>
        </div>
      ))}
    </div>
  )
}
