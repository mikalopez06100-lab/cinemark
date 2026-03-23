export type PartnerShowcase = {
  slug: string
  name: string
  category: string
  logo: string
  featured: boolean
}

/** Logos fournis (zip) — chemins sous /public/images/partners */
export const PARTNER_SHOWCASE: PartnerShowcase[] = [
  { slug: 'akathor', name: 'Akathor', category: 'Culture · Musique', logo: '/images/partners/01_akathor.png', featured: false },
  { slug: 'a-la-fut', name: 'À la Fut', category: 'Brasserie · Artisanal', logo: '/images/partners/02_a_la_fut.png', featured: false },
  { slug: 'avia', name: 'Avia', category: 'Énergie · Mobilité', logo: '/images/partners/03_avia.png', featured: false },
  { slug: 'casino-barriere', name: 'Casino Barrière', category: 'Loisirs · Institution', logo: '/images/partners/04_casino_barriere.png', featured: true },
  { slug: 'brasserie-comte', name: 'Bière du Comté', category: 'Brasserie · Artisanal', logo: '/images/partners/05_brasserie_comte.png', featured: false },
  { slug: 'cosy-kombucha', name: 'Cosy Kombucha', category: 'Boisson · Artisanal', logo: '/images/partners/06_cosy_kombucha.png', featured: false },
  { slug: 'domaine-blavet', name: 'Domaine du Blavet', category: 'Vins · Terroir', logo: '/images/partners/07_domaine_blavet.png', featured: false },
  { slug: 'esprit-azur', name: 'Esprit Azur', category: 'Marque locale', logo: '/images/partners/08_esprit_azur.png', featured: false },
  { slug: 'ezea', name: 'Ezea', category: 'Marque locale', logo: '/images/partners/09_ezea.png', featured: false },
  { slug: 'fil-rouge', name: 'Fil Rouge', category: 'Marque locale', logo: '/images/partners/10_fil_rouge.png', featured: false },
  { slug: 'fsgt', name: 'FSGT 06', category: 'Sport · Fédération', logo: '/images/partners/11_fsgt.png', featured: true },
  { slug: 'haute-pression', name: 'Haute Pression', category: 'Marque locale', logo: '/images/partners/12_haute_pression.png', featured: false },
  { slug: 'j-multari', name: 'J. Multari', category: 'Gastronomie', logo: '/images/partners/13_j_multari.png', featured: false },
  { slug: 'jumalee', name: 'Jumalee', category: 'Marque locale', logo: '/images/partners/14_jumalee.png', featured: false },
  { slug: 'club-nautique', name: 'Club Nautique', category: 'Sport · Mer', logo: '/images/partners/15_club_nautique.png', featured: false },
  { slug: 'ailes-azur', name: 'Ailes Azur', category: 'Marque locale', logo: '/images/partners/16_ailes_azur.png', featured: false },
  { slug: 'levens', name: 'Levens', category: 'Territoire · Institution', logo: '/images/partners/17_levens.png', featured: false },
  { slug: 'lin-du-sud', name: 'Lin du Sud', category: 'Textile · Artisanal', logo: '/images/partners/18_lin_du_sud.png', featured: false },
  { slug: 'ogc-nice', name: 'OGC Nice', category: 'Sport · Institution', logo: '/images/partners/19_ogc_nice.png', featured: true },
  { slug: 'pays-fayence', name: 'Pays de Fayence', category: 'Territoire', logo: '/images/partners/20_pays_fayence.png', featured: false },
  { slug: 'guglielmi', name: 'Guglielmi', category: 'Gastronomie', logo: '/images/partners/21_guglielmi.png', featured: false },
  { slug: 'roz-paper', name: 'Roz Paper', category: 'Marque locale', logo: '/images/partners/22_roz_paper.png', featured: false },
  { slug: 'soleia-nice', name: 'Soleia Nice', category: 'Limoncello · Local', logo: '/images/partners/23_soleia_nice.png', featured: true },
  { slug: 'spar', name: 'Spar', category: 'Distribution · Proximité', logo: '/images/partners/24_spar.png', featured: true },
  { slug: 'vieforme', name: 'Vieforme', category: 'Bien-être', logo: '/images/partners/25_vieforme.png', featured: false },
]

export function partnersForHomePreview(max = 8): PartnerShowcase[] {
  const featured = PARTNER_SHOWCASE.filter((p) => p.featured)
  const rest = PARTNER_SHOWCASE.filter((p) => !p.featured)
  const merged = [...featured, ...rest]
  return merged.slice(0, max)
}
