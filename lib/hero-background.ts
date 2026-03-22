/** Fichier dans le bucket public `site-assets` (voir scripts/upload-hero-background.mjs). */
export const HERO_BG_STORAGE_PATH = 'backgrounds/nice-paysage.png'

export function getHeroBackgroundImageUrl(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (base) {
    return `${base}/storage/v1/object/public/site-assets/${HERO_BG_STORAGE_PATH}`
  }
  return '/images/nice-hero-bg.png'
}
