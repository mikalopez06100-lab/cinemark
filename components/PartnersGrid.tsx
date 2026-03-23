import Image from 'next/image'
import type { PartnerShowcase } from '@/lib/partners-showcase'

export default function PartnersGrid({ partners }: { partners: PartnerShowcase[] }) {
  return (
    <div className="brands-grid">
      {partners.map((brand) => (
        <div
          key={brand.slug}
          className={`brand-tile${brand.featured ? ' featured' : ''}`}
        >
          <div className="brand-logo-wrap">
            <Image
              src={brand.logo}
              alt={`Logo ${brand.name}`}
              fill
              sizes="(max-width: 900px) 50vw, 25vw"
              className="brand-logo-img"
            />
          </div>
          <span className="brand-name">{brand.name}</span>
          <span className="brand-cat">{brand.category}</span>
        </div>
      ))}
    </div>
  )
}
