import Image from 'next/image'
import type { Partner } from '@/lib/supabase'

export type PartnerGridItem = Pick<Partner, 'id' | 'name' | 'category' | 'logo_url'> & {
  featured?: boolean
}

export default function PartnersGrid({ partners }: { partners: PartnerGridItem[] }) {
  return (
    <div className="brands-grid">
      {partners.map((brand) => (
        <div
          key={brand.id}
          className={`brand-tile${brand.featured ? ' featured' : ''}`}
        >
          {brand.logo_url ? (
            <div className="brand-logo-wrap">
              <Image
                src={brand.logo_url}
                alt={`Logo ${brand.name}`}
                fill
                sizes="(max-width: 900px) 50vw, 25vw"
                className="brand-logo-img"
              />
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
