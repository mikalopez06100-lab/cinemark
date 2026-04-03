import heroBgLocal from '../public/images/nice-hero-bg.png'

/** Fichier local versionné ; sync optionnelle Supabase : scripts/upload-hero-background.mjs */
export const HERO_BG_STORAGE_PATH = 'backgrounds/nice-paysage.png'

/** URL pour CSS `background-image` : import statique (déploiement fiable) ou override absolu. */
export function getHeroBackgroundImageUrl(): string {
  const override = process.env.NEXT_PUBLIC_HERO_BACKGROUND_URL?.trim()
  if (override) return override
  return heroBgLocal.src
}
