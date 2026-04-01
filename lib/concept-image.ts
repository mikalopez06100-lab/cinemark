/** Fichier versionné dans `public/images` ; sync optionnelle vers le bucket (scripts/upload-concept-image.mjs). */
export const CONCEPT_IMAGE_STORAGE_PATH = 'concept/cosy-kombucha-tournage.png'

const LOCAL_CONCEPT_SRC = '/images/concept-cosy-kombucha-tournage.png'

export function getConceptImageUrl(): string {
  const override = process.env.NEXT_PUBLIC_CONCEPT_IMAGE_URL?.trim()
  if (override) return override
  return LOCAL_CONCEPT_SRC
}
