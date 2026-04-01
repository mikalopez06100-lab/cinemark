/** Fichier dans le bucket public `site-assets` (voir scripts/upload-concept-image.mjs). */
export const CONCEPT_IMAGE_STORAGE_PATH = 'concept/cosy-kombucha-tournage.png'

export function getConceptImageUrl(): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (base) {
    return `${base}/storage/v1/object/public/site-assets/${CONCEPT_IMAGE_STORAGE_PATH}`
  }
  return '/images/concept-cosy-kombucha-tournage.png'
}
