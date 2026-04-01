const SITE_ASSETS_BUCKET = 'site-assets'

/**
 * Normalise les URLs d’images issues de la base (ou saisies à la main) pour l’affichage.
 * - URL absolue http(s) ou data: → inchangée
 * - Chemin Next `/images/...`, `/blog/...` → inchangé
 * - Chemin `/storage/v1/object/public/site-assets/...` → préfixe avec NEXT_PUBLIC_SUPABASE_URL si besoin
 * - Clé seule type `film-posters/…` → URL publique du bucket `site-assets`
 */
export function resolveMediaUrl(raw: string | null | undefined): string | null {
  if (raw == null) return null
  const trimmed = String(raw).trim()
  if (!trimmed) return null

  if (trimmed.startsWith('data:')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`

  const base = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') : undefined

  if (trimmed.startsWith('/')) {
    if (base && trimmed.startsWith('/storage/v1/object/public/')) {
      return `${base}${trimmed}`
    }
    return trimmed
  }

  if (base) {
    const key = trimmed.replace(/^\/+/, '')
    return `${base}/storage/v1/object/public/${SITE_ASSETS_BUCKET}/${key}`
  }

  return `/${trimmed.replace(/^\/+/, '')}`
}

export function resolveMediaUrls(urls: string[] | null | undefined): string[] {
  if (!urls?.length) return []
  const out: string[] = []
  for (const u of urls) {
    const r = resolveMediaUrl(u)
    if (r) out.push(r)
  }
  return out
}
