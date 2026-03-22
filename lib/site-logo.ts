/** Chemin fixe dans le bucket Supabase `site-assets` (voir scripts/upload-site-logo.mjs). */
export const SITE_LOGO_STORAGE_PATH = 'branding/cinemark-logo.png'

export function getSiteLogoUrlFromSupabase(supabaseUrl: string): string {
  const base = supabaseUrl.replace(/\/$/, '')
  return `${base}/storage/v1/object/public/site-assets/${SITE_LOGO_STORAGE_PATH}`
}

/** URL distante si Supabase est configuré ; sinon null (utiliser le fallback local). */
export function getSiteLogoRemoteUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  return getSiteLogoUrlFromSupabase(url)
}
